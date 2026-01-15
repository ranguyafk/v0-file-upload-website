import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { del } from "@vercel/blob"

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params
    const { searchParams } = new URL(request.url)
    const token = searchParams.get("token")

    const supabase = await createClient()

    const { data: file, error } = await supabase
      .from("files")
      .select(
        "slug, filename, title, file_size, file_type, expires_at, password_hash, download_count, view_count, created_at, owner_token",
      )
      .eq("slug", slug)
      .single()

    if (error || !file) {
      return NextResponse.json({ error: "File not found" }, { status: 404 })
    }

    // Check if expired
    if (file.expires_at && new Date(file.expires_at) < new Date()) {
      return NextResponse.json({ error: "File has expired" }, { status: 410 })
    }

    const isOwner = token && file.owner_token === token

    return NextResponse.json({
      slug: file.slug,
      filename: file.filename,
      title: file.title,
      fileSize: file.file_size,
      fileType: file.file_type,
      expiresAt: file.expires_at,
      hasPassword: !!file.password_hash,
      downloadCount: file.download_count,
      viewCount: file.view_count || 0,
      createdAt: file.created_at,
      isOwner,
    })
  } catch (error) {
    console.error("File info error:", error)
    return NextResponse.json({ error: "Failed to get file info" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params
    const body = await request.json()
    const { token } = body

    if (!token) {
      return NextResponse.json({ error: "Owner token required" }, { status: 401 })
    }

    const supabase = await createClient()

    // Get the file and verify ownership
    const { data: file, error } = await supabase
      .from("files")
      .select("id, file_url, owner_token")
      .eq("slug", slug)
      .single()

    if (error || !file) {
      return NextResponse.json({ error: "File not found" }, { status: 404 })
    }

    if (file.owner_token !== token) {
      return NextResponse.json({ error: "Invalid owner token" }, { status: 403 })
    }

    // Delete from Vercel Blob
    try {
      await del(file.file_url)
    } catch (blobError) {
      console.error("Blob deletion error:", blobError)
      // Continue with database deletion even if blob fails
    }

    // Delete from database
    const { error: deleteError } = await supabase.from("files").delete().eq("id", file.id)

    if (deleteError) {
      console.error("Database deletion error:", deleteError)
      return NextResponse.json({ error: "Failed to delete file" }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "File deleted successfully" })
  } catch (error) {
    console.error("Delete error:", error)
    return NextResponse.json({ error: "Failed to delete file" }, { status: 500 })
  }
}
