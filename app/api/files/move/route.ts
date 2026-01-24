import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { isValidUUID } from "@/lib/utils/validation"
import { checkColumnExists, getSchemaErrorMessage } from "@/lib/schema-verification"

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

    // Verify schema before proceeding
    const folderIdColumnExists = await checkColumnExists(supabase, "files", "folder_id")
    if (!folderIdColumnExists) {
      console.error("Schema validation failed: folder_id column missing from files table")
      return NextResponse.json(
        {
          error: getSchemaErrorMessage(["folder_id"]),
        },
        { status: 500 },
      )
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

    // Validate ID formats
    if (!isValidUUID(file_id)) {
      return NextResponse.json({ error: "Invalid file ID format" }, { status: 400 })
    }

    if (folder_id && !isValidUUID(folder_id)) {
      return NextResponse.json({ error: "Invalid folder ID format" }, { status: 400 })
    }

    // Verify file belongs to user
    const { data: file, error: fileError } = await supabase.from("files").select("id, user_id").eq("id", file_id).single()

    if (fileError) {
      console.error("Error fetching file:", {
        error: fileError,
        fileId: file_id,
        userId: user.id,
      })
      return NextResponse.json({ error: "Failed to verify file" }, { status: 500 })
    }

    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 404 })
    }

    if (file.user_id !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // If folder_id is provided, verify it exists and belongs to user
    if (folder_id) {
      const { data: folder, error: folderError } = await supabase
        .from("folders")
        .select("id, user_id")
        .eq("id", folder_id)
        .single()

      if (folderError) {
        console.error("Error fetching folder:", {
          error: folderError,
          folderId: folder_id,
          userId: user.id,
        })
        return NextResponse.json({ error: "Failed to verify folder" }, { status: 500 })
      }

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
      console.error("Move file error:", {
        error,
        code: error.code,
        message: error.message,
        details: error.details,
        fileId: file_id,
        folderId: folder_id,
        userId: user.id,
      })

      // Check for schema-related errors
      const errorMessage = error.message.toLowerCase()
      if (errorMessage.includes("folder_id") && errorMessage.includes("column")) {
        return NextResponse.json(
          {
            error: getSchemaErrorMessage(["folder_id"]),
          },
          { status: 500 },
        )
      }

      return NextResponse.json(
        { error: `Failed to move file: ${error.message || "Unknown database error"}` },
        { status: 500 },
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Move file error:", {
      error,
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    })
    return NextResponse.json({ error: "Failed to move file" }, { status: 500 })
  }
}
