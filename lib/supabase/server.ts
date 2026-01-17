import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

// ⚠️ Hardcoded Supabase credentials
const SUPABASE_URL = "https://gxdhyaqrayvkajdgftwm.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd4ZGh5YXFyYXl2a2FqZGdmdHdtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgyNjc5MzEsImV4cCI6MjA4Mzg0MzkzMX0.aMmxi9tY031sFWEziX0cEgypYJbd3Sgtnsr4qqMR390"

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Ignore - called from Server Component
          }
        },
      },
    }
  )
}
