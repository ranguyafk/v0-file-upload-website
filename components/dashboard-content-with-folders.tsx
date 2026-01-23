"use client"

import { useState, useEffect, useCallback } from "react"
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
  FolderIcon,
  FolderPlus,
  Edit2,
  MoreVertical,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { User } from "@supabase/supabase-js"
import { CreateFolderDialog } from "./create-folder-dialog"
import { RenameFolderDialog } from "./rename-folder-dialog"
import { BreadcrumbNavigation } from "./breadcrumb-navigation"

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
  folder_id: string | null
}

interface Folder {
  id: string
  name: string
  parent_id: string | null
  created_at: string
  updated_at: string
}

interface BreadcrumbItem {
  id: string | null
  name: string
}

export function DashboardContentWithFolders({
  user,
  profile,
  initialFiles,
}: {
  user: User
  profile: Profile | null
  initialFiles: FileRecord[]
}) {
  const router = useRouter()
  const [loggingOut, setLoggingOut] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [deletingFolderId, setDeletingFolderId] = useState<string | null>(null)
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null)
  const [folders, setFolders] = useState<Folder[]>([])
  const [files, setFiles] = useState<FileRecord[]>(initialFiles)
  const [breadcrumbPath, setBreadcrumbPath] = useState<BreadcrumbItem[]>([])
  
  const [createFolderOpen, setCreateFolderOpen] = useState(false)
  const [renameFolderOpen, setRenameFolderOpen] = useState(false)
  const [renamingFolder, setRenamingFolder] = useState<{ id: string; name: string } | null>(null)
  
  const [loading, setLoading] = useState(false)
  const [draggedFileId, setDraggedFileId] = useState<string | null>(null)

  const fetchFolders = useCallback(async () => {
    try {
      const response = await fetch(`/api/folders?parent_id=${currentFolderId || "null"}`)
      if (response.ok) {
        const data = await response.json()
        setFolders(data.folders || [])
      }
    } catch (error) {
      console.error("Failed to fetch folders:", error)
    }
  }, [currentFolderId])

  const fetchFiles = useCallback(async () => {
    try {
      setLoading(true)
      const supabase = createClient()
      let query = supabase
        .from("files")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (currentFolderId) {
        query = query.eq("folder_id", currentFolderId)
      } else {
        query = query.is("folder_id", null)
      }

      const { data, error } = await query

      if (error) throw error
      setFiles(data || [])
    } catch (error) {
      console.error("Failed to fetch files:", error)
    } finally {
      setLoading(false)
    }
  }, [currentFolderId, user.id])

  const buildBreadcrumbPath = useCallback(async (folderId: string | null) => {
    if (!folderId) {
      setBreadcrumbPath([])
      return
    }

    try {
      const supabase = createClient()
      const path: BreadcrumbItem[] = []
      let currentId: string | null = folderId

      while (currentId) {
        const { data: folder } = await supabase.from("folders").select("*").eq("id", currentId).single()
        if (folder) {
          path.unshift({ id: folder.id, name: folder.name })
          currentId = folder.parent_id
        } else {
          break
        }
      }

      setBreadcrumbPath(path)
    } catch (error) {
      console.error("Failed to build breadcrumb path:", error)
    }
  }, [])

  useEffect(() => {
    fetchFolders()
    fetchFiles()
    buildBreadcrumbPath(currentFolderId)
  }, [currentFolderId, fetchFolders, fetchFiles, buildBreadcrumbPath])

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
        await fetchFiles()
      }
    } catch (error) {
      console.error("Delete error:", error)
    } finally {
      setDeletingId(null)
    }
  }

  const handleDeleteFolder = async (folderId: string) => {
    if (!confirm("Are you sure you want to delete this folder? It must be empty.")) return

    setDeletingFolderId(folderId)
    try {
      const response = await fetch(`/api/folders/${folderId}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Failed to delete folder")
        return
      }

      await fetchFolders()
    } catch (error) {
      console.error("Delete folder error:", error)
      setError("Failed to delete folder")
    } finally {
      setDeletingFolderId(null)
    }
  }

  const handleFolderClick = (folderId: string) => {
    setCurrentFolderId(folderId)
  }

  const handleNavigate = (folderId: string | null) => {
    setCurrentFolderId(folderId)
  }

  const copyLink = async (slug: string) => {
    await navigator.clipboard.writeText(`${window.location.origin}/${slug}`)
    setCopiedSlug(slug)
    setTimeout(() => setCopiedSlug(null), 2000)
  }

  const handleRenameFolder = (folder: Folder) => {
    setRenamingFolder({ id: folder.id, name: folder.name })
    setRenameFolderOpen(true)
  }

  const handleDragStart = (fileId: string) => {
    setDraggedFileId(fileId)
  }

  const handleDragEnd = () => {
    setDraggedFileId(null)
  }

  const handleDrop = async (targetFolderId: string | null) => {
    if (!draggedFileId) return

    try {
      const response = await fetch("/api/files/move", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ file_id: draggedFileId, folder_id: targetFolderId }),
      })

      if (response.ok) {
        await fetchFiles()
      }
    } catch (error) {
      console.error("Move file error:", error)
    } finally {
      setDraggedFileId(null)
    }
  }

  const handleFolderDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
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

        {/* Files and Folders */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          {error && (
            <div className="bg-destructive/10 border-b border-destructive/20 p-4 text-destructive text-sm flex items-center justify-between">
              <span>{error}</span>
              <button onClick={() => setError(null)} className="text-destructive hover:text-destructive/80">
                ✕
              </button>
            </div>
          )}
          <div className="p-4 border-b border-border bg-muted/30 flex items-center justify-between">
            <div className="flex-1">
              <h2 className="font-semibold text-sm md:text-base text-foreground mb-1">
                Your Files
              </h2>
              <BreadcrumbNavigation path={breadcrumbPath} onNavigate={handleNavigate} />
            </div>
            <Button
              size="sm"
              onClick={() => setCreateFolderOpen(true)}
              className="active-scale"
            >
              <FolderPlus className="w-4 h-4 mr-2" />
              New Folder
            </Button>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-muted-foreground" />
            </div>
          ) : folders.length === 0 && files.length === 0 ? (
            <div className="p-8 md:p-12 text-center">
              <FileIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-sm md:text-base text-muted-foreground mb-4">
                {currentFolderId ? "This folder is empty" : "No files uploaded yet"}
              </p>
              {!currentFolderId && (
                <Button asChild className="touch-target active-scale">
                  <Link href="/">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Your First File
                  </Link>
                </Button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-border">
              {/* Folders */}
              {folders.map((folder) => (
                <div
                  key={folder.id}
                  className="p-4 hover:bg-muted/30 transition-colors"
                  onDragOver={handleFolderDragOver}
                  onDrop={(e) => {
                    e.preventDefault()
                    handleDrop(folder.id)
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="flex-1 flex items-center gap-3 cursor-pointer"
                      onClick={() => handleFolderClick(folder.id)}
                    >
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <FolderIcon className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm md:text-base text-foreground truncate">{folder.name}</p>
                        <p className="text-xs md:text-sm text-muted-foreground">Folder</p>
                      </div>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-9 w-9 md:h-8 md:w-8 active-scale">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleRenameFolder(folder)}>
                          <Edit2 className="w-4 h-4 mr-2" />
                          Rename
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteFolder(folder.id)}
                          className="text-destructive"
                          disabled={deletingFolderId === folder.id}
                        >
                          {deletingFolderId === folder.id ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Deleting...
                            </>
                          ) : (
                            <>
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </>
                          )}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}

              {/* Files */}
              {files.map((file) => (
                <div
                  key={file.id}
                  draggable
                  onDragStart={() => handleDragStart(file.id)}
                  onDragEnd={handleDragEnd}
                  className="p-4 hover:bg-muted/30 transition-colors cursor-move"
                >
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

      <CreateFolderDialog
        open={createFolderOpen}
        onOpenChange={setCreateFolderOpen}
        onFolderCreated={() => {
          fetchFolders()
        }}
        parentId={currentFolderId}
      />

      <RenameFolderDialog
        open={renameFolderOpen}
        onOpenChange={setRenameFolderOpen}
        onFolderRenamed={() => {
          fetchFolders()
        }}
        folderId={renamingFolder?.id || null}
        currentName={renamingFolder?.name || ""}
      />
    </main>
  )
}
