import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// POST - Move file to folder
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    let body
    try {
      body = await request.json()
    } catch (error) {
      console.error("Invalid JSON in file move request:", error)
      return NextResponse.json({ error: "Invalid request format" }, { status: 400 })
    }
    const { file_id, folder_id } = body

    if (!file_id) {
      return NextResponse.json({ error: "File ID is required" }, { status: 400 })
    }

    // Verify file belongs to user
    const { data: file } = await supabase.from("files").select("id, user_id").eq("id", file_id).single()

    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 404 })
    }

    if (file.user_id !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // If folder_id is provided, verify it exists and belongs to user
    if (folder_id) {
      const { data: folder } = await supabase.from("folders").select("id, user_id").eq("id", folder_id).single()

      if (!folder) {
        return NextResponse.json({ error: "Folder not found" }, { status: 404 })
      }

      if (folder.user_id !== user.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }
    }

    // Move file to folder (or root if folder_id is null)
    const { error } = await supabase
      .from("files")
      .update({ folder_id: folder_id || null })
      .eq("id", file_id)
      .eq("user_id", user.id)

    if (error) {
      console.error("Move file error:", error)
      return NextResponse.json({ error: "Failed to move file" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Move file error:", error)
    return NextResponse.json({ error: "Failed to move file" }, { status: 500 })
  }
}
