import { type NextRequest, NextResponse } from "next/server"
import { checkRateLimit } from "@/lib/rate-limit"

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "unknown"
    const { action } = await request.json()

    if (action !== "signup" && action !== "login") {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }

    const { allowed, remaining } = await checkRateLimit(ip, action)

    if (!allowed) {
      return NextResponse.json({ error: "Too many attempts. Please try again later.", remaining: 0 }, { status: 429 })
    }

    return NextResponse.json({ allowed: true, remaining })
  } catch (error) {
    console.error("Rate limit check error:", error)
    return NextResponse.json({ allowed: true, remaining: 10 })
  }
}
