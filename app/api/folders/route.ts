import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// GET - Return empty folders list (deprecated endpoint)
// This endpoint is deprecated as the folder system has been removed.
// We return an empty array with 200 status to prevent 500 errors during transition.
export async function GET(request: NextRequest) {
  try {
    // Validate required environment variables
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error("Missing Supabase environment variables")
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 })
    }

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Return empty folders array (folder system has been removed)
    return NextResponse.json({ folders: [] })
  } catch (error) {
    console.error("Fetch folders error:", {
      error,
      message: error instanceof Error ? error.message : "Unknown error",
    })
    // Return empty array even on error to prevent UI breakage
    return NextResponse.json({ folders: [] })
  }
}

// POST - Return error (deprecated endpoint)
// Folder creation is no longer supported
export async function POST(request: NextRequest) {
  return NextResponse.json(
    { error: "Folder functionality has been removed. Files are now stored at the root level only." },
    { status: 410 } // 410 Gone - resource no longer available
  )
}
