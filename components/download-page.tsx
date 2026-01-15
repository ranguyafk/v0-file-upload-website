"use client"

import { useState } from "react"
import { Download, Lock, FileIcon, Clock, Loader2, AlertCircle, CheckCircle, XCircle, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface FileInfo {
  slug: string
  filename: string
  title: string | null
  fileSize: number
  fileType: string | null
  expiresAt: string | null
  hasPassword: boolean
  downloadCount: number
  viewCount: number
  createdAt: string
}

interface DownloadPageProps {
  fileInfo: FileInfo | null
  error?: string
}

export function DownloadPage({ fileInfo, error: initialError }: DownloadPageProps) {
  const [password, setPassword] = useState("")
  const [downloading, setDownloading] = useState(false)
  const [error, setError] = useState<string | null>(initialError || null)
  const [needsPassword, setNeedsPassword] = useState(fileInfo?.hasPassword || false)
  const [passwordStatus, setPasswordStatus] = useState<"idle" | "correct" | "wrong">("idle")

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`
  }

  const getTimeRemaining = (expiresAt: string) => {
    const diff = new Date(expiresAt).getTime() - Date.now()
    if (diff <= 0) return "Expired"

    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days > 0) return `${days}d remaining`
    if (hours > 0) return `${hours}h remaining`
    return `${minutes}m remaining`
  }

  const handleDownload = async () => {
    if (!fileInfo) return

    setDownloading(true)
    setError(null)
    setPasswordStatus("idle")

    try {
      const response = await fetch(`/api/download/${fileInfo.slug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: password || undefined }),
      })

      const text = await response.text()
      let data
      try {
        data = JSON.parse(text)
      } catch {
        throw new Error("Server error. Please try again.")
      }

      if (!response.ok) {
        if (data.requiresPassword) {
          setNeedsPassword(true)
          setError("Please enter the password to download this file.")
        } else if (response.status === 403) {
          setPasswordStatus("wrong")
          setError("Incorrect password. Please try again.")
        } else {
          setError(data.error || "Download failed")
        }
        return
      }

      if (fileInfo.hasPassword) {
        setPasswordStatus("correct")
      }

      // Slight delay to show success state
      setTimeout(() => {
        const link = document.createElement("a")
        link.href = data.fileUrl
        link.download = data.filename
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }, 500)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Download failed")
    } finally {
      setDownloading(false)
    }
  }

  if (initialError || !fileInfo) {
    return (
      <div className="w-full max-w-xl mx-auto">
        <div className="bg-card border border-border rounded-2xl p-8 text-center space-y-4">
          <div className="flex items-center justify-center w-16 h-16 mx-auto bg-destructive/10 rounded-full">
            <AlertCircle className="w-8 h-8 text-destructive" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">File Not Found</h2>
          <p className="text-muted-foreground">{initialError || "This file may have been deleted or expired."}</p>
          <Button asChild variant="outline">
            <a href="/">Upload a New File</a>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        {/* File Header */}
        <div className="bg-gradient-to-br from-primary/20 to-primary/5 p-8 text-center">
          <div className="flex items-center justify-center w-20 h-20 mx-auto bg-gradient-to-br from-primary to-primary/60 rounded-2xl shadow-lg shadow-primary/20 mb-4">
            <FileIcon className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">{fileInfo.title || fileInfo.filename}</h1>
          {fileInfo.title && <p className="text-muted-foreground text-sm mt-1 truncate">{fileInfo.filename}</p>}
          <p className="text-muted-foreground mt-2">{formatSize(fileInfo.fileSize)}</p>
        </div>

        <div className="p-6 space-y-5">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-muted/50 rounded-lg p-3 text-center">
              <div className="flex items-center justify-center gap-1.5 text-muted-foreground mb-1">
                <Eye className="w-4 h-4" />
              </div>
              <p className="text-lg font-semibold text-foreground">{fileInfo.viewCount}</p>
              <p className="text-xs text-muted-foreground">Views</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-3 text-center">
              <div className="flex items-center justify-center gap-1.5 text-muted-foreground mb-1">
                <Download className="w-4 h-4" />
              </div>
              <p className="text-lg font-semibold text-foreground">{fileInfo.downloadCount}</p>
              <p className="text-xs text-muted-foreground">Downloads</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-3 text-center">
              <div className="flex items-center justify-center gap-1.5 text-muted-foreground mb-1">
                <Clock className="w-4 h-4" />
              </div>
              <p className="text-lg font-semibold text-foreground">
                {fileInfo.expiresAt ? getTimeRemaining(fileInfo.expiresAt) : "Never"}
              </p>
              <p className="text-xs text-muted-foreground">Expires</p>
            </div>
          </div>

          {/* Password Field */}
          {needsPassword && (
            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center gap-2 text-sm font-medium">
                <Lock className="w-4 h-4 text-primary" /> Password Required
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    setPasswordStatus("idle")
                    setError(null)
                  }}
                  placeholder="Enter password to download"
                  onKeyDown={(e) => e.key === "Enter" && handleDownload()}
                  className={`pr-10 ${
                    passwordStatus === "correct"
                      ? "border-green-500 focus-visible:ring-green-500"
                      : passwordStatus === "wrong"
                        ? "border-destructive focus-visible:ring-destructive"
                        : ""
                  }`}
                />
                {passwordStatus === "correct" && (
                  <CheckCircle className="w-5 h-5 text-green-500 absolute right-3 top-1/2 -translate-y-1/2" />
                )}
                {passwordStatus === "wrong" && (
                  <XCircle className="w-5 h-5 text-destructive absolute right-3 top-1/2 -translate-y-1/2" />
                )}
              </div>
              {passwordStatus === "wrong" && (
                <p className="text-sm text-destructive flex items-center gap-1.5">
                  <XCircle className="w-4 h-4" /> Incorrect password
                </p>
              )}
              {passwordStatus === "correct" && (
                <p className="text-sm text-green-500 flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4" /> Password correct! Starting download...
                </p>
              )}
            </div>
          )}

          {/* Error */}
          {error && passwordStatus !== "wrong" && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 text-destructive text-sm">
              {error}
            </div>
          )}

          {/* Download Button */}
          <Button
            onClick={handleDownload}
            disabled={downloading || (needsPassword && !password) || passwordStatus === "correct"}
            size="lg"
            className="w-full h-12 text-base font-semibold"
          >
            {downloading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                {needsPassword ? "Verifying..." : "Preparing..."}
              </>
            ) : passwordStatus === "correct" ? (
              <>
                <CheckCircle className="w-5 h-5 mr-2" />
                Download Starting...
              </>
            ) : (
              <>
                <Download className="w-5 h-5 mr-2" />
                Download File
              </>
            )}
          </Button>

          {/* Upload Link */}
          <div className="text-center pt-2">
            <a href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Want to share your own file?
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
