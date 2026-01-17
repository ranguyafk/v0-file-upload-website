import { createBrowserClient } from "@supabase/ssr"

let client: ReturnType<typeof createBrowserClient> | null = null

// ⚠️ Hardcoded Supabase credentials
const SUPABASE_URL = "https://gxdhyaqrayvkajdgftwm.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd4ZGh5YXFyYXl2a2FqZGdmdHdtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgyNjc5MzEsImV4cCI6MjA4Mzg0MzkzMX0.aMmxi9tY031sFWEziX0cEgypYJbd3Sgtnsr4qqMR390"

export function createClient() {
  if (client) return client

  client = createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY)

  return client
}
