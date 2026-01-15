import { createClient } from "@/lib/supabase/server"
import { AnalyticsPage } from "@/components/analytics-page"
import { redirect } from "next/navigation"

interface PageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ token?: string }>
}

export default async function FileAnalyticsPage({ params, searchParams }: PageProps) {
  const { slug } = await params
  const { token } = await searchParams
  const supabase = await createClient()

  if (!token) {
    redirect(`/${slug}`)
  }

  const { data: file, error } = await supabase
    .from("files")
    .select("*")
    .eq("slug", slug)
    .eq("owner_token", token)
    .single()

  if (error || !file) {
    redirect(`/${slug}`)
  }

  const fileInfo = {
    slug: file.slug,
    title: file.title,
    filename: file.filename,
    fileSize: file.file_size,
    fileType: file.file_type,
    expiresAt: file.expires_at,
    hasPassword: !!file.password_hash,
    downloadCount: file.download_count,
    viewCount: file.view_count || 0,
    createdAt: file.created_at,
  }

  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4">
      <AnalyticsPage fileInfo={fileInfo} ownerToken={token} />
    </main>
  )
}
