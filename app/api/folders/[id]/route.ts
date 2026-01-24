import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { isValidUUID, sanitizeString } from "@/lib/utils/validation"

// PATCH - Rename folder
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = params
    
    // Validate ID format
    if (!isValidUUID(id)) {
      return NextResponse.json({ error: "Invalid folder ID format" }, { status: 400 })
    }
    
    let body
    try {
      body = await request.json()
    } catch (error) {
      console.error("Invalid JSON in folder rename request:", error)
      return NextResponse.json({ error: "Invalid request format" }, { status: 400 })
    }
    const { name } = body

    if (!name || name.trim().length === 0) {
      return NextResponse.json({ error: "Folder name is required" }, { status: 400 })
    }

    if (name.trim().length > 100) {
      return NextResponse.json({ error: "Folder name too long" }, { status: 400 })
    }

    const { data: folder, error } = await supabase
      .from("folders")
      .update({ name: sanitizeString(name) || name.trim(), updated_at: new Date().toISOString() })
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single()

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json({ error: "A folder with this name already exists here" }, { status: 409 })
      }
      console.error("Rename folder error:", error)
      return NextResponse.json({ error: "Failed to rename folder" }, { status: 500 })
    }

    if (!folder) {
      return NextResponse.json({ error: "Folder not found" }, { status: 404 })
    }

    return NextResponse.json({ folder })
  } catch (error) {
    console.error("Rename folder error:", error)
    return NextResponse.json({ error: "Failed to rename folder" }, { status: 500 })
  }
}

// DELETE - Delete folder
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = params

    // Validate ID format
    if (!isValidUUID(id)) {
      return NextResponse.json({ error: "Invalid folder ID format" }, { status: 400 })
    }

    // Check if folder has subfolders
    const { data: subfolders } = await supabase.from("folders").select("id").eq("parent_id", id).limit(1)

    if (subfolders && subfolders.length > 0) {
      return NextResponse.json(
        { error: "Cannot delete folder with subfolders. Delete subfolders first." },
        { status: 400 },
      )
    }

    // Check if folder has files
    const { data: files } = await supabase.from("files").select("id").eq("folder_id", id).limit(1)

    if (files && files.length > 0) {
      return NextResponse.json({ error: "Cannot delete folder with files. Move or delete files first." }, { status: 400 })
    }

    const { error } = await supabase.from("folders").delete().eq("id", id).eq("user_id", user.id)

    if (error) {
      console.error("Delete folder error:", error)
      return NextResponse.json({ error: "Failed to delete folder" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete folder error:", error)
    return NextResponse.json({ error: "Failed to delete folder" }, { status: 500 })
  }
}
