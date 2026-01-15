import { createClient } from "@/lib/supabase/server"

const LIMITS = {
  upload: { max: 10, windowMs: 60 * 60 * 1000 }, // 10 uploads per hour
  download: { max: 100, windowMs: 60 * 60 * 1000 }, // 100 downloads per hour
  signup: { max: 3, windowMs: 60 * 60 * 1000 }, // 3 signups per hour per IP
  login: { max: 5, windowMs: 15 * 60 * 1000 }, // 5 login attempts per 15 min
}

export async function checkRateLimit(
  ip: string,
  action: keyof typeof LIMITS,
): Promise<{ allowed: boolean; remaining: number }> {
  const supabase = await createClient()
  const limit = LIMITS[action]
  const windowStart = new Date(Date.now() - limit.windowMs)

  // Use auth_rate_limits for auth actions, rate_limits for others
  const tableName = action === "signup" || action === "login" ? "auth_rate_limits" : "rate_limits"

  // Get current count
  const { data: existing } = await supabase
    .from(tableName)
    .select("*")
    .eq("ip_address", ip)
    .eq("action", action)
    .gte("window_start", windowStart.toISOString())
    .single()

  if (!existing) {
    // Create new rate limit entry
    await supabase.from(tableName).upsert({
      ip_address: ip,
      action,
      count: 1,
      window_start: new Date().toISOString(),
    })
    return { allowed: true, remaining: limit.max - 1 }
  }

  if (existing.count >= limit.max) {
    return { allowed: false, remaining: 0 }
  }

  // Increment count
  await supabase
    .from(tableName)
    .update({ count: existing.count + 1 })
    .eq("id", existing.id)

  return { allowed: true, remaining: limit.max - existing.count - 1 }
}
