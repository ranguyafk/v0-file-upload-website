"use client"

import { useState } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Upload,
  LogOut,
  FileIcon,
  Eye,
  Download,
  Trash2,
  Clock,
  Lock,
  BarChart3,
  Crown,
  Loader2,
  ExternalLink,
  Copy,
  Check,
} from "lucide-react"
import type { User } from "@supabase/supabase-js"

interface Profile {
  id: string
  email: string
  plan: "free" | "pro" | "enterprise"
  plan_expires_at: string | null
  max_file_size: number
  max_uploads_per_day: number
}

interface FileRecord {
  id: string
  slug: string
  title: string | null
  filename: string
  file_size: number
  view_count: number
  download_count: number
  expires_at: string | null
  password_hash: string | null
  created_at: string
  owner_token: string
}

export function DashboardContent({
  user,
  profile,
  files,
}: {
  user: User
  profile: Profile | null
  files: FileRecord[]
}) {
  const router = useRouter()
  const [loggingOut, setLoggingOut] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null)

  const handleLogout = async () => {
    setLoggingOut(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
  }

  const handleDelete = async (slug: string, ownerToken: string) => {
    if (!confirm("Are you sure you want to delete this file?")) return

    setDeletingId(slug)
    try {
      const res = await fetch(`/api/file/${slug}?token=${ownerToken}`, {
        method: "DELETE",
      })
      if (res.ok) {
        router.refresh()
      }
    } catch (error) {
      console.error("Delete error:", error)
    } finally {
      setDeletingId(null)
    }
  }

  const copyLink = async (slug: string) => {
    await navigator.clipboard.writeText(`${window.location.origin}/${slug}`)
    setCopiedSlug(slug)
    setTimeout(() => setCopiedSlug(null), 2000)
  }

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const plan = profile?.plan || "free"
  const isPro = plan === "pro" || plan === "enterprise"

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 md:py-8">
        {/* Header */}
        <div className="flex flex-col gap-4 mb-6 md:mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-sm md:text-base text-muted-foreground truncate">{user.email}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2 md:gap-3">
            {!isPro && (
              <Button asChild variant="outline" className="flex-1 md:flex-none bg-transparent border-primary text-primary touch-target active-scale">
                <Link href="/pricing">
                  <Crown className="w-4 h-4 mr-2" />
                  Upgrade to Pro
                </Link>
              </Button>
            )}
            <Button asChild className="flex-1 md:flex-none touch-target active-scale">
              <Link href="/">
                <Upload className="w-4 h-4 mr-2" />
                Upload File
              </Link>
            </Button>
            <Button variant="ghost" size="icon" onClick={handleLogout} disabled={loggingOut} className="touch-target active-scale">
              {loggingOut ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Plan Badge */}
        <div className="bg-card border border-border rounded-xl p-4 mb-6 md:mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 md:w-10 md:h-10 rounded-xl flex items-center justify-center ${isPro ? "bg-primary/20" : "bg-muted"}`}
            >
              <Crown className={`w-5 h-5 ${isPro ? "text-primary" : "text-muted-foreground"}`} />
            </div>
            <div>
              <p className="font-semibold text-sm md:text-base text-foreground capitalize">{plan} Plan</p>
              <p className="text-xs md:text-sm text-muted-foreground">
                {isPro
                  ? "Unlimited uploads, 2GB max file size"
                  : `${profile?.max_uploads_per_day || 5} uploads/day, ${formatSize(profile?.max_file_size || 536870912)} max`}
              </p>
            </div>
          </div>
          {!isPro && (
            <Button asChild size="sm" className="active-scale">
              <Link href="/pricing">Upgrade</Link>
            </Button>
          )}
        </div>

        {/* Files List */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="p-4 border-b border-border bg-muted/30">
            <h2 className="font-semibold text-sm md:text-base text-foreground">Your Files ({files.length})</h2>
          </div>

          {files.length === 0 ? (
            <div className="p-8 md:p-12 text-center">
              <FileIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-sm md:text-base text-muted-foreground mb-4">No files uploaded yet</p>
              <Button asChild className="touch-target active-scale">
                <Link href="/">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Your First File
                </Link>
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {files.map((file) => (
                <div key={file.id} className="p-4 hover:bg-muted/30 transition-colors">
                  <div className="flex flex-col gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <FileIcon className="w-4 h-4 text-primary flex-shrink-0" />
                        <p className="font-medium text-sm md:text-base text-foreground truncate">{file.title || file.filename}</p>
                        {file.password_hash && <Lock className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />}
                        {file.expires_at && <Clock className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />}
                      </div>
                      <p className="text-xs md:text-sm text-muted-foreground">
                        /{file.slug} &middot; {formatSize(file.file_size)} &middot; {formatDate(file.created_at)}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 md:gap-6 text-xs md:text-sm">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Eye className="w-4 h-4" />
                          <span>{file.view_count}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Download className="w-4 h-4" />
                          <span>{file.download_count}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 md:gap-2">
                        <Button variant="ghost" size="icon" onClick={() => copyLink(file.slug)} title="Copy link" className="h-9 w-9 md:h-8 md:w-8 active-scale">
                          {copiedSlug === file.slug ? (
                            <Check className="w-4 h-4 text-primary" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                        <Button variant="ghost" size="icon" asChild title="View file" className="h-9 w-9 md:h-8 md:w-8 active-scale">
                          <Link href={`/${file.slug}`} target="_blank">
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="icon" asChild title="Analytics" className="h-9 w-9 md:h-8 md:w-8 active-scale">
                          <Link href={`/${file.slug}/analytics?token=${file.owner_token}`}>
                            <BarChart3 className="w-4 h-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(file.slug, file.owner_token)}
                          disabled={deletingId === file.slug}
                          className="text-destructive hover:text-destructive h-9 w-9 md:h-8 md:w-8 active-scale"
                          title="Delete"
                        >
                          {deletingId === file.slug ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
