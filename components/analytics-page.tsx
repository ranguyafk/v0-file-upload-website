"use client"

import { useState } from "react"
import { FileIcon, Download, Eye, Link, Copy, Check, BarChart3, Trash2, Loader2, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface FileInfo {
  slug: string
  title: string | null
  filename: string
  fileSize: number
  fileType: string | null
  expiresAt: string | null
  hasPassword: boolean
  downloadCount: number
  viewCount: number
  createdAt: string
}

interface AnalyticsPageProps {
  fileInfo: FileInfo
  ownerToken: string
}

export function AnalyticsPage({ fileInfo, ownerToken }: AnalyticsPageProps) {
  const [copied, setCopied] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [deleted, setDeleted] = useState(false)

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getTimeRemaining = (expiresAt: string) => {
    const diff = new Date(expiresAt).getTime() - Date.now()
    if (diff <= 0) return "Expired"

    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days > 0) return `${days} day${days > 1 ? "s" : ""}`
    if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""}`
    return `${minutes} minute${minutes > 1 ? "s" : ""}`
  }

  const copyLink = async () => {
    const fullUrl = `${window.location.origin}/${fileInfo.slug}`
    await navigator.clipboard.writeText(fullUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      const response = await fetch(`/api/file/${fileInfo.slug}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: ownerToken }),
      })

      if (response.ok) {
        setDeleted(true)
      }
    } catch {
      // Error handling
    } finally {
      setDeleting(false)
    }
  }

  if (deleted) {
    return (
      <div className="w-full max-w-xl mx-auto">
        <div className="bg-card border border-border rounded-2xl p-8 text-center space-y-4">
          <div className="flex items-center justify-center w-16 h-16 mx-auto bg-destructive/10 rounded-full">
            <Trash2 className="w-8 h-8 text-destructive" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">File Deleted</h2>
          <p className="text-muted-foreground">Your file has been permanently removed.</p>
          <Button asChild className="mt-4">
            <a href="/">Upload a New File</a>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-5">
      {/* Header Card */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="bg-gradient-to-br from-primary/20 via-primary/10 to-transparent p-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/30">
              <FileIcon className="w-7 h-7 text-primary-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <BarChart3 className="w-4 h-4 text-primary" />
                <span className="text-xs uppercase tracking-wider text-primary font-medium">Analytics</span>
              </div>
              <h1 className="text-xl font-bold text-foreground truncate">{fileInfo.title || fileInfo.filename}</h1>
              {fileInfo.title && <p className="text-sm text-muted-foreground truncate">{fileInfo.filename}</p>}
            </div>
          </div>
        </div>

        {/* Share Link */}
        <div className="p-4 border-t border-border bg-muted/30">
          <div className="flex items-center gap-2">
            <Link className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <code className="flex-1 text-sm text-foreground truncate font-mono">
              {typeof window !== "undefined" ? window.location.origin : ""}/{fileInfo.slug}
            </code>
            <Button variant="ghost" size="icon" onClick={copyLink} className="h-8 w-8">
              {copied ? <Check className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <Eye className="w-5 h-5 text-blue-500" />
            </div>
            <span className="text-sm text-muted-foreground">Views</span>
          </div>
          <p className="text-3xl font-bold text-foreground">{fileInfo.viewCount}</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
              <Download className="w-5 h-5 text-green-500" />
            </div>
            <span className="text-sm text-muted-foreground">Downloads</span>
          </div>
          <p className="text-3xl font-bold text-foreground">{fileInfo.downloadCount}</p>
        </div>
      </div>

      {/* File Details */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-border bg-muted/30">
          <h2 className="font-semibold text-foreground">File Details</h2>
        </div>
        <div className="divide-y divide-border">
          <div className="flex items-center justify-between px-5 py-3">
            <span className="text-muted-foreground">Size</span>
            <span className="text-foreground font-medium">{formatSize(fileInfo.fileSize)}</span>
          </div>
          <div className="flex items-center justify-between px-5 py-3">
            <span className="text-muted-foreground">Created</span>
            <span className="text-foreground font-medium">{formatDate(fileInfo.createdAt)}</span>
          </div>
          <div className="flex items-center justify-between px-5 py-3">
            <span className="text-muted-foreground">Expires</span>
            <span className="text-foreground font-medium">
              {fileInfo.expiresAt ? getTimeRemaining(fileInfo.expiresAt) : "Never"}
            </span>
          </div>
          <div className="flex items-center justify-between px-5 py-3">
            <span className="text-muted-foreground">Password</span>
            <span className={`font-medium ${fileInfo.hasPassword ? "text-green-500" : "text-muted-foreground"}`}>
              {fileInfo.hasPassword ? "Protected" : "None"}
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button asChild variant="outline" className="flex-1 bg-transparent">
          <a href="/">Upload Another</a>
        </Button>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="flex-1">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete File
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-destructive" />
                Delete File
              </AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this file? This action cannot be undone and the file will be permanently
                removed.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                disabled={deleting}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {deleting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}
