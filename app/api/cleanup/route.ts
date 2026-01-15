import { NextResponse } from "next/server"
import { del } from "@vercel/blob"
import { createClient } from "@/lib/supabase/server"

// This endpoint can be called by a cron job to clean up expired files
export async function POST() {
  try {
    const supabase = await createClient()

    // Get expired files
    const { data: expiredFiles, error } = await supabase
      .from("files")
      .select("*")
      .lt("expires_at", new Date().toISOString())
      .not("expires_at", "is", null)

    if (error) {
      console.error("Cleanup query error:", error)
      return NextResponse.json({ error: "Cleanup failed" }, { status: 500 })
    }

    let deleted = 0
    for (const file of expiredFiles || []) {
      try {
        // Delete from Blob storage
        await del(file.file_url)

        // Delete from database
        await supabase.from("files").delete().eq("id", file.id)
        deleted++
      } catch (e) {
        console.error(`Failed to delete file ${file.slug}:`, e)
      }
    }

    // Clean up old rate limit entries
    const oldWindow = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    await supabase.from("rate_limits").delete().lt("window_start", oldWindow)

    return NextResponse.json({
      success: true,
      deleted,
      total: expiredFiles?.length || 0,
    })
  } catch (error) {
    console.error("Cleanup error:", error)
    return NextResponse.json({ error: "Cleanup failed" }, { status: 500 })
  }
}
