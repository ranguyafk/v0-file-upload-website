import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// PATCH - Rename folder (DEPRECATED)
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  return NextResponse.json(
    { error: "Folder functionality has been removed." },
    { status: 410 } // 410 Gone
  )
}

// DELETE - Delete folder (DEPRECATED)
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  return NextResponse.json(
    { error: "Folder functionality has been removed." },
    { status: 410 } // 410 Gone
  )
}
