import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardContentWithFolders } from "@/components/dashboard-content-with-folders"

export const metadata = {
  title: "Dashboard - FileDrop",
  description: "Manage your files and account",
}

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  // Get user's files (only root level files for initial load)
  const { data: files } = await supabase
    .from("files")
    .select("*")
    .eq("user_id", user.id)
    .is("folder_id", null)
    .order("created_at", { ascending: false })

  return <DashboardContentWithFolders user={user} profile={profile} initialFiles={files || []} />
}
