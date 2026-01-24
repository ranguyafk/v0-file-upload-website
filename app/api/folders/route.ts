import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { isValidUUID, sanitizeString } from "@/lib/utils/validation"

// GET - List folders for a user
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const parentId = searchParams.get("parent_id")

    let query = supabase
      .from("folders")
      .select("*")
      .eq("user_id", user.id)
      .order("name", { ascending: true })

    if (!parentId || parentId === "null") {
      query = query.is("parent_id", null)
    } else {
      query = query.eq("parent_id", parentId)
    }

    const { data: folders, error } = await query

    if (error) {
      console.error("Fetch folders error:", error)
      return NextResponse.json({ error: "Failed to fetch folders" }, { status: 500 })
    }

    return NextResponse.json({ folders })
  } catch (error) {
    console.error("Fetch folders error:", error)
    return NextResponse.json({ error: "Failed to fetch folders" }, { status: 500 })
  }
}

// POST - Create a new folder
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
      console.error("Invalid JSON in folder creation request:", error)
      return NextResponse.json({ error: "Invalid request format" }, { status: 400 })
    }
    const { name, parent_id } = body

    if (!name || name.trim().length === 0) {
      return NextResponse.json({ error: "Folder name is required" }, { status: 400 })
    }

    if (name.trim().length > 100) {
      return NextResponse.json({ error: "Folder name too long" }, { status: 400 })
    }

    // Validate parent_id format if provided
    if (parent_id && !isValidUUID(parent_id)) {
      return NextResponse.json({ error: "Invalid parent folder ID format" }, { status: 400 })
    }

    // If parent_id is provided, verify it exists and belongs to user
    if (parent_id) {
      const { data: parentFolder, error: parentError } = await supabase
        .from("folders")
        .select("id, user_id")
        .eq("id", parent_id)
        .eq("user_id", user.id)
        .single()

      if (parentError || !parentFolder) {
        console.error("Parent folder validation error:", parentError)
        return NextResponse.json({ error: "Invalid parent folder or parent folder not found" }, { status: 400 })
      }
    }

    const { data: folder, error } = await supabase
      .from("folders")
      .insert({
        name: sanitizeString(name) || name.trim(),
        user_id: user.id,
        parent_id: parent_id || null,
      })
      .select()
      .single()

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json({ error: "A folder with this name already exists here" }, { status: 409 })
      }
      console.error("Create folder error:", error)
      return NextResponse.json({ error: "Failed to create folder" }, { status: 500 })
    }

    return NextResponse.json({ folder })
  } catch (error) {
    console.error("Create folder error:", error)
    return NextResponse.json({ error: "Failed to create folder" }, { status: 500 })
  }
}
