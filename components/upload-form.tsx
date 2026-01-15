"use client"

import { useState, useCallback, useEffect } from "react"
import { useDropzone } from "react-dropzone"
import { Upload, Lock, Clock, Link, Copy, Check, X, Loader2, FileIcon, Type, BarChart3, Key } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"

interface UploadResult {
  success: boolean
  slug: string
  url: string
  filename: string
  title: string | null
  size: number
  expiresAt: string | null
  hasPassword: boolean
  ownerToken: string
}

export function UploadForm() {
  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState("")
  const [customSlug, setCustomSlug] = useState("")
  const [password, setPassword] = useState("")
  const [expiry, setExpiry] = useState("never")
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState<UploadResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState<"link" | "token" | null>(null)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
  }, [])

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles[0]) {
      setFile(acceptedFiles[0])
      setError(null)
      setResult(null)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    maxSize: 1024 * 1024 * 1024,
    onDropRejected: (rejections) => {
      if (rejections[0]?.errors[0]?.code === "file-too-large") {
        setError("File too large. Maximum size is 1GB.")
      }
    },
  })

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)
    setProgress(0)
    setError(null)

    const formData = new FormData()
    formData.append("file", file)
    if (title) formData.append("title", title)
    if (customSlug) formData.append("slug", customSlug)
    if (password) formData.append("password", password)
    formData.append("expiry", expiry)

    try {
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + Math.random() * 10, 90))
      }, 200)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      clearInterval(progressInterval)
      setProgress(100)

      const text = await response.text()
      let data
      try {
        data = JSON.parse(text)
      } catch {
        throw new Error("Server error. Please try again.")
      }

      if (!response.ok) {
        throw new Error(data.error || "Upload failed")
      }

      setResult(data)
      setFile(null)
      setTitle("")
      setCustomSlug("")
      setPassword("")
      setExpiry("never")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed")
    } finally {
      setUploading(false)
      setProgress(0)
    }
  }

  const copyToClipboard = async (text: string, type: "link" | "token") => {
    await navigator.clipboard.writeText(text)
    setCopied(type)
    setTimeout(() => setCopied(null), 2000)
  }

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`
  }

  if (result) {
    const fullUrl = `${typeof window !== "undefined" ? window.location.origin : ""}${result.url}`

    return (
      <div className="space-y-4">
        {/* Success Header */}
        <div className="flex items-center gap-3 p-4 bg-primary/10 rounded-xl border border-primary/20">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Check className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <p className="font-semibold text-foreground">Upload Complete!</p>
            <p className="text-sm text-muted-foreground">{result.title || result.filename}</p>
          </div>
        </div>

        {/* Share Link */}
        <div className="space-y-2">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Share Link</Label>
          <div className="flex items-center gap-2 bg-muted rounded-lg p-3 border border-border">
            <Link className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <code className="flex-1 text-sm text-foreground truncate font-mono">{fullUrl}</code>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => copyToClipboard(fullUrl, "link")}
              className="h-8 w-8 flex-shrink-0"
            >
              {copied === "link" ? <Check className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Owner Token - Only show if not logged in */}
        {!user && (
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-wider text-primary flex items-center gap-1.5">
              <Key className="w-3 h-3" /> Owner Token (Save This!)
            </Label>
            <div className="flex items-center gap-2 bg-primary/10 rounded-lg p-3 border border-primary/20">
              <Key className="w-4 h-4 text-primary flex-shrink-0" />
              <code className="flex-1 text-sm text-foreground truncate font-mono">{result.ownerToken}</code>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => copyToClipboard(result.ownerToken, "token")}
                className="h-8 w-8 flex-shrink-0"
              >
                {copied === "token" ? <Check className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">Use this token to view analytics or delete your file</p>
          </div>
        )}

        {/* File Properties */}
        <div className="flex flex-wrap gap-2">
          {result.hasPassword && (
            <div className="flex items-center gap-1.5 bg-muted px-3 py-1.5 rounded-full text-sm">
              <Lock className="w-3.5 h-3.5 text-primary" />
              <span className="text-muted-foreground">Protected</span>
            </div>
          )}
          {result.expiresAt && (
            <div className="flex items-center gap-1.5 bg-muted px-3 py-1.5 rounded-full text-sm">
              <Clock className="w-3.5 h-3.5 text-primary" />
              <span className="text-muted-foreground">Auto-expires</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <Button asChild variant="outline" className="flex-1 bg-transparent">
            <a href={`${result.url}/analytics?token=${result.ownerToken}`}>
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </a>
          </Button>
          <Button onClick={() => setResult(null)} className="flex-1">
            <Upload className="w-4 h-4 mr-2" />
            Upload Another
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all
          ${isDragActive ? "border-primary bg-primary/10 scale-[1.02]" : "border-border hover:border-primary/50 hover:bg-muted/30"}
          ${file ? "border-primary bg-primary/5" : ""}
        `}
      >
        <input {...getInputProps()} />

        {file ? (
          <div className="space-y-2">
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-primary rounded-xl">
              <FileIcon className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <p className="font-semibold text-foreground truncate max-w-xs mx-auto">{file.name}</p>
              <p className="text-sm text-muted-foreground">{formatSize(file.size)}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                setFile(null)
              }}
              className="text-muted-foreground hover:text-destructive"
            >
              <X className="w-4 h-4 mr-1" /> Remove
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-muted rounded-xl">
              <Upload className="w-6 h-6 text-muted-foreground" />
            </div>
            <div>
              <p className="font-semibold text-foreground">{isDragActive ? "Drop it here" : "Drop file here"}</p>
              <p className="text-sm text-muted-foreground">or click to browse</p>
            </div>
          </div>
        )}
      </div>

      {/* Options */}
      <div className="space-y-3">
        <div className="space-y-2">
          <Label htmlFor="title" className="flex items-center gap-2 text-sm">
            <Type className="w-4 h-4 text-primary" /> Title
          </Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="My file (optional)"
            maxLength={100}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="slug" className="flex items-center gap-2 text-sm">
            <Link className="w-4 h-4 text-primary" /> Custom URL
          </Label>
          <Input
            id="slug"
            value={customSlug}
            onChange={(e) => setCustomSlug(e.target.value.replace(/[^a-zA-Z0-9_-]/g, ""))}
            placeholder="my-file (optional)"
            maxLength={32}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="password" className="flex items-center gap-2 text-sm">
              <Lock className="w-4 h-4 text-primary" /> Password
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Optional"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="expiry" className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-primary" /> Expires
            </Label>
            <Select value={expiry} onValueChange={setExpiry}>
              <SelectTrigger id="expiry">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5m">5 minutes</SelectItem>
                <SelectItem value="10m">10 minutes</SelectItem>
                <SelectItem value="1h">1 hour</SelectItem>
                <SelectItem value="1d">1 day</SelectItem>
                <SelectItem value="7d">7 days</SelectItem>
                <SelectItem value="never">Never</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 text-destructive text-sm">
          {error}
        </div>
      )}

      {/* Upload Progress */}
      {uploading && (
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-muted-foreground text-center">Uploading... {Math.round(progress)}%</p>
        </div>
      )}

      {/* Upload Button */}
      <Button onClick={handleUpload} disabled={!file || uploading} className="w-full h-11">
        {uploading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Uploading...
          </>
        ) : (
          <>
            <Upload className="w-4 h-4 mr-2" />
            Upload File
          </>
        )}
      </Button>
    </div>
  )
}
