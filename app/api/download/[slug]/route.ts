import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { checkRateLimit } from "@/lib/rate-limit"
import { verifyPassword } from "@/lib/utils/password"

export async function POST(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params
    const ip = request.headers.get("x-forwarded-for") || "unknown"

    // Rate limiting
    const { allowed } = await checkRateLimit(ip, "download")
    if (!allowed) {
      return NextResponse.json({ error: "Rate limit exceeded. Try again later." }, { status: 429 })
    }

    const supabase = await createClient()

    // Get file info
    const { data: file, error } = await supabase.from("files").select("*").eq("slug", slug).single()

    if (error || !file) {
      return NextResponse.json({ error: "File not found" }, { status: 404 })
    }

    // Check if expired
    if (file.expires_at && new Date(file.expires_at) < new Date()) {
      return NextResponse.json({ error: "File has expired" }, { status: 410 })
    }

    // Check password if required
    if (file.password_hash) {
      let body
      try {
        body = await request.json()
      } catch (error) {
        console.error("Invalid JSON in download request (password required):", error)
        return NextResponse.json({ error: "Invalid request format", requiresPassword: true }, { status: 400 })
      }
      const password = body.password

      if (!password) {
        return NextResponse.json({ error: "Password required", requiresPassword: true }, { status: 401 })
      }

      const valid = await verifyPassword(password, file.password_hash)
      if (!valid) {
        return NextResponse.json({ error: "Invalid password" }, { status: 403 })
      }
    }

    // Increment download count
    await supabase
      .from("files")
      .update({ download_count: file.download_count + 1 })
      .eq("id", file.id)

    return NextResponse.json({
      success: true,
      filename: file.filename,
      fileUrl: file.file_url,
      fileSize: file.file_size,
      fileType: file.file_type,
      downloadCount: file.download_count + 1,
    })
  } catch (error) {
    console.error("Download error:", error)
    return NextResponse.json({ error: "Download failed" }, { status: 500 })
  }
}
