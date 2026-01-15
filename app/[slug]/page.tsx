import { createClient } from "@/lib/supabase/server"
import { DownloadPage } from "@/components/download-page"

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function FilePage({ params }: PageProps) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: file, error } = await supabase
    .from("files")
    .select(
      "id, slug, title, filename, file_size, file_type, expires_at, password_hash, download_count, view_count, created_at",
    )
    .eq("slug", slug)
    .single()

  if (error || !file) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center p-4">
        <DownloadPage fileInfo={null} error="File not found" />
      </main>
    )
  }

  // Check if expired
  if (file.expires_at && new Date(file.expires_at) < new Date()) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center p-4">
        <DownloadPage fileInfo={null} error="This file has expired" />
      </main>
    )
  }

  await supabase
    .from("files")
    .update({ view_count: (file.view_count || 0) + 1 })
    .eq("id", file.id)

  const fileInfo = {
    slug: file.slug,
    title: file.title,
    filename: file.filename,
    fileSize: file.file_size,
    fileType: file.file_type,
    expiresAt: file.expires_at,
    hasPassword: !!file.password_hash,
    downloadCount: file.download_count,
    viewCount: (file.view_count || 0) + 1,
    createdAt: file.created_at,
  }

  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4">
      <DownloadPage fileInfo={fileInfo} />
    </main>
  )
}
