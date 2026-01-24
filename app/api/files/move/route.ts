import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// POST - Move file to folder (DEPRECATED)
// Folder functionality has been removed. This endpoint now returns an error.
export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  return NextResponse.json(
    { error: "File organization into folders has been removed. All files are now stored at the root level." },
    { status: 410 } // 410 Gone - resource no longer available
  )
}
