import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// This endpoint creates a profile for a user after email confirmation
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    // Check if profile already exists
    const { data: existingProfile, error: checkError } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", user.id)
      .single()

    if (existingProfile) {
      return NextResponse.json({ message: "Profile already exists" })
    }

    // Log if check had an error (other than not found)
    if (checkError && checkError.code !== "PGRST116") {
      console.error("Profile check error:", checkError)
    }

    // Create profile
    const { error } = await supabase.from("profiles").insert({
      id: user.id,
      email: user.email!,
      plan: "free",
      max_file_size: 536870912, // 500MB
      max_uploads_per_day: 5,
    })

    if (error) {
      console.error("Profile creation error:", error)
      return NextResponse.json({ error: "Failed to create profile" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Profile creation error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
