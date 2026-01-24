"use client"

import { useState, useMemo, useCallback } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { PhotoGrid } from "@/components/photo-grid"
import { FileList } from "@/components/file-list"
import { SelectionToolbar } from "@/components/selection-toolbar"
import { PreviewModal } from "@/components/preview-modal"
import {
  Upload,
  LogOut,
  FileIcon,
  Crown,
  Loader2,
  Trash2,
  Image as ImageIcon,
} from "lucide-react"
import type { User } from "@supabase/supabase-js"
import { toast } from "sonner"

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
  file_type: string
  file_url: string
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
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [isDeleting, setIsDeleting] = useState(false)
  const [activeTab, setActiveTab] = useState<"photos" | "files">("photos")
  const [previewIndex, setPreviewIndex] = useState<number | null>(null)

  // Classify files into photos and non-photos
  const { photos, otherFiles } = useMemo(() => {
    const photos: FileRecord[] = []
    const otherFiles: FileRecord[] = []
    
    files.forEach((file) => {
      if (file.file_type && file.file_type.startsWith("image/")) {
        photos.push(file)
      } else {
        otherFiles.push(file)
      }
    })
    
    return { photos, otherFiles }
  }, [files])

  const selectionMode = selectedIds.size > 0

  const handleToggleSelection = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }, [])

  const handleClearSelection = useCallback(() => {
    setSelectedIds(new Set())
  }, [])

  const handleLogout = async () => {
    setLoggingOut(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
  }

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return
    
    const count = selectedIds.size
    if (!confirm(`Are you sure you want to delete ${count} ${count === 1 ? "file" : "files"}?`)) return

    setIsDeleting(true)
    const selectedFiles = files.filter((f) => selectedIds.has(f.id))
    
    try {
      // Delete each file using existing endpoint
      const deletePromises = selectedFiles.map((file) =>
        fetch(`/api/file/${file.slug}?token=${file.owner_token}`, {
          method: "DELETE",
        })
      )
      
      await Promise.all(deletePromises)
      toast.success(`Deleted ${count} ${count === 1 ? "file" : "files"}`)
      handleClearSelection()
      router.refresh()
    } catch (error) {
      console.error("Bulk delete error:", error)
      toast.error("Failed to delete some files")
    } finally {
      setIsDeleting(false)
    }
  }

  const handleCopyLinks = () => {
    if (selectedIds.size === 0) return
    
    const selectedFiles = files.filter((f) => selectedIds.has(f.id))
    const links = selectedFiles.map((f) => `${window.location.origin}/${f.slug}`).join("\n")
    
    navigator.clipboard.writeText(links)
    toast.success(`Copied ${selectedIds.size} ${selectedIds.size === 1 ? "link" : "links"}`)
    handleClearSelection()
  }

  const handleDownload = () => {
    if (selectedIds.size === 0) return
    
    const selectedFiles = files.filter((f) => selectedIds.has(f.id))
    
    // Open each file URL (browser will handle downloads)
    selectedFiles.forEach((file) => {
      window.open(file.file_url, "_blank")
    })
    
    toast.success(`Opening ${selectedIds.size} ${selectedIds.size === 1 ? "file" : "files"}`)
    handleClearSelection()
  }

  const handlePreview = useCallback((index: number) => {
    setPreviewIndex(index)
  }, [])

  const handleClosePreview = useCallback(() => {
    setPreviewIndex(null)
  }, [])

  const handleNavigatePreview = useCallback((index: number) => {
    setPreviewIndex(index)
  }, [])

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
    <main className="min-h-screen bg-background pb-20 md:pb-0">
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

        {/* Files Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "photos" | "files")} className="w-full">
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="p-4 border-b border-border bg-muted/30">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold text-sm md:text-base text-foreground">Your Files ({files.length})</h2>
              </div>
              
              <TabsList className="w-full md:w-auto">
                <TabsTrigger value="photos" className="flex-1 md:flex-none touch-target">
                  <ImageIcon className="w-4 h-4 mr-2" />
                  Photos ({photos.length})
                </TabsTrigger>
                <TabsTrigger value="files" className="flex-1 md:flex-none touch-target">
                  <FileIcon className="w-4 h-4 mr-2" />
                  Files ({otherFiles.length})
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Selection Toolbar */}
            <SelectionToolbar
              selectedCount={selectedIds.size}
              onCopyLinks={handleCopyLinks}
              onDownload={handleDownload}
              onDelete={handleBulkDelete}
              onClearSelection={handleClearSelection}
              isDeleting={isDeleting}
            />

            {/* Photos Tab */}
            <TabsContent value="photos" className="mt-0">
              {photos.length === 0 ? (
                <div className="p-8 md:p-12 text-center">
                  <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-sm md:text-base text-muted-foreground mb-4">No photos uploaded yet</p>
                  <Button asChild className="touch-target active-scale">
                    <Link href="/">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Your First Photo
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="p-4">
                  <PhotoGrid
                    photos={photos}
                    selectedIds={selectedIds}
                    onToggleSelection={handleToggleSelection}
                    onPreview={handlePreview}
                    selectionMode={selectionMode}
                  />
                </div>
              )}
            </TabsContent>

            {/* Files Tab */}
            <TabsContent value="files" className="mt-0">
              {otherFiles.length === 0 ? (
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
                <FileList
                  files={otherFiles}
                  selectedIds={selectedIds}
                  onToggleSelection={handleToggleSelection}
                  selectionMode={selectionMode}
                />
              )}
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {/* Preview Modal */}
      {previewIndex !== null && (
        <PreviewModal
          isOpen={true}
          onClose={handleClosePreview}
          images={photos}
          currentIndex={previewIndex}
          onNavigate={handleNavigatePreview}
        />
      )}
    </main>
  )
}
