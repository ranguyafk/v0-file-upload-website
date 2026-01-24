import { put } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { checkRateLimit } from "@/lib/rate-limit"
import { hashPassword } from "@/lib/utils/password"
import { generateSlug, isValidSlug } from "@/lib/utils/slug"
import { sanitizeString } from "@/lib/utils/validation"
import { randomBytes } from "crypto"

const MAX_FILE_SIZE = 1024 * 1024 * 1024 // 1GB

export async function POST(request: NextRequest) {
  try {
    // Validate required environment variables
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error("Missing Supabase environment variables")
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 })
    }

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.error("Missing Vercel Blob storage token")
      return NextResponse.json({ error: "Storage service not configured" }, { status: 500 })
    }

    const ip = request.headers.get("x-forwarded-for") || "unknown"

    // Rate limiting
    const { allowed, remaining } = await checkRateLimit(ip, "upload")
    if (!allowed) {
      console.error("Rate limit exceeded:", { ip, action: "upload" })
      return NextResponse.json(
        { error: "Rate limit exceeded. Try again later." },
        { status: 429, headers: { "X-RateLimit-Remaining": "0" } },
      )
    }

    let formData
    try {
      formData = await request.formData()
    } catch (error) {
      console.error("Invalid FormData in upload request:", error)
      return NextResponse.json({ error: "Invalid request format" }, { status: 400 })
    }
    const file = formData.get("file") as File
    const title = formData.get("title") as string | null
    const customSlug = formData.get("slug") as string | null
    const password = formData.get("password") as string | null
    const expiry = formData.get("expiry") as string | null

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    if (!file.name || file.name.trim().length === 0) {
      return NextResponse.json({ error: "File must have a valid name" }, { status: 400 })
    }

    if (file.size === 0) {
      return NextResponse.json({ error: "File is empty" }, { status: 400 })
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "File too large. Maximum size is 1GB." }, { status: 400 })
    }

    // Validate or generate slug
    if (customSlug && !isValidSlug(customSlug)) {
      return NextResponse.json(
        { error: "Invalid custom URL. Use 3-32 characters (letters, numbers, underscores, and dashes)." },
        { status: 400 },
      )
    }
    let slug = customSlug?.trim() || generateSlug()

    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    // Check if slug is taken
    const { data: existing, error: slugError } = await supabase.from("files").select("id").eq("slug", slug).single()

    if (slugError && slugError.code !== "PGRST116") {
      // PGRST116 is "not found" which is expected
      console.error("Slug check error:", {
        error: slugError,
        slug,
      })
    }

    if (existing) {
      if (customSlug) {
        return NextResponse.json({ error: "This custom URL is already taken." }, { status: 409 })
      }
      
      // Generate a new random slug to avoid collision with retry loop
      let attempts = 0
      const maxAttempts = 5
      
      while (attempts < maxAttempts) {
        slug = generateSlug(12 + attempts * 4) // Increase length with each retry
        const { data: existingRetry } = await supabase.from("files").select("id").eq("slug", slug).single()
        
        if (!existingRetry) {
          break // Found a unique slug
        }
        
        attempts++
        
        if (attempts >= maxAttempts) {
          console.error("Failed to generate unique slug after max attempts:", { attempts })
          return NextResponse.json({ error: "Failed to generate unique URL. Please try again." }, { status: 500 })
        }
      }
    }

    // Upload to Vercel Blob
    let blob
    try {
      blob = await put(`files/${slug}/${file.name}`, file, {
        access: "public",
      })
    } catch (blobError) {
      console.error("Blob upload error:", {
        error: blobError,
        fileName: file.name,
        fileSize: file.size,
        slug,
        userId: user?.id,
      })
      return NextResponse.json({ error: "Failed to upload file to storage" }, { status: 500 })
    }

    // Calculate expiry time
    let expiresAt: string | null = null
    const validExpiryOptions = ["5m", "10m", "1h", "1d", "7d", "never"]
    
    if (expiry && !validExpiryOptions.includes(expiry)) {
      return NextResponse.json({ error: "Invalid expiry option" }, { status: 400 })
    }
    
    if (expiry && expiry !== "never") {
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
    }

    // Hash password if provided
    const passwordHash = password ? await hashPassword(password) : null

    const ownerToken = randomBytes(16).toString("hex")

    const { error: dbError } = await supabase.from("files").insert({
      slug,
      title: title?.trim() ? sanitizeString(title.trim()) : null,
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
    })

    if (dbError) {
      console.error("Database error:", {
        error: dbError,
        code: dbError.code,
        message: dbError.message,
        details: dbError.details,
        hint: dbError.hint,
        fileName: file.name,
        slug,
        userId: user?.id,
      })

      return NextResponse.json(
        { error: `Failed to save file metadata: ${dbError.message || "Unknown database error"}` },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      slug,
      url: `/${slug}`,
      filename: file.name,
      title: title?.trim() ? sanitizeString(title.trim()) : null,
      size: file.size,
      expiresAt,
      hasPassword: !!password,
      ownerToken,
    })
  } catch (error) {
    console.error("Upload error:", {
      error,
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    })
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
