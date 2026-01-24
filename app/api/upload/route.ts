import { put } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { checkRateLimit } from "@/lib/rate-limit"
import { hashPassword } from "@/lib/utils/password"
import { generateSlug, isValidSlug } from "@/lib/utils/slug"
import { randomBytes } from "crypto"

const MAX_FILE_SIZE = 1024 * 1024 * 1024 // 1GB

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "unknown"

    // Rate limiting
    const { allowed, remaining } = await checkRateLimit(ip, "upload")
    if (!allowed) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Try again later." },
        { status: 429, headers: { "X-RateLimit-Remaining": "0" } },
      )
    }

    const formData = await request.formData()
    const file = formData.get("file") as File
    const title = formData.get("title") as string | null
    const customSlug = formData.get("slug") as string | null
    const password = formData.get("password") as string | null
    const expiry = formData.get("expiry") as string | null
    const folderId = formData.get("folder_id") as string | null

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "File too large. Maximum size is 1GB." }, { status: 400 })
    }

    // Validate or generate slug
    let slug = customSlug?.trim() || generateSlug()
    if (customSlug && !isValidSlug(customSlug)) {
      return NextResponse.json({ error: "Invalid custom URL. Use 3-32 alphanumeric characters." }, { status: 400 })
    }

    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    // Check if slug is taken
    const { data: existing } = await supabase.from("files").select("id").eq("slug", slug).single()

    if (existing) {
      if (customSlug) {
        return NextResponse.json({ error: "This custom URL is already taken." }, { status: 409 })
      }
      slug = generateSlug(12)
    }

    // Upload to Vercel Blob
    const blob = await put(`files/${slug}/${file.name}`, file, {
      access: "public",
    })

    // Calculate expiry time
    let expiresAt: string | null = null
    if (expiry === "5m") {
      expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString()
    } else if (expiry === "10m") {
      expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString()
    } else if (expiry === "1h") {
      expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString()
    } else if (expiry === "1d") {
      expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    } else if (expiry === "7d") {
      expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    }

    // Hash password if provided
    const passwordHash = password ? await hashPassword(password) : null

    const ownerToken = randomBytes(16).toString("hex")

    const { error: dbError } = await supabase.from("files").insert({
      slug,
      title: title?.trim() || null,
      filename: file.name,
      file_url: blob.url,
      file_size: file.size,
      file_type: file.type,
      password_hash: passwordHash,
      expires_at: expiresAt,
      ip_address: ip,
      owner_token: ownerToken,
      view_count: 0,
      user_id: user?.id || null,
      folder_id: folderId || null,
    })

    if (dbError) {
      console.error("Database error:", dbError)
      return NextResponse.json({ error: "Failed to save file metadata" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      slug,
      url: `/${slug}`,
      filename: file.name,
      title: title?.trim() || null,
      size: file.size,
      expiresAt,
      hasPassword: !!password,
      ownerToken,
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
