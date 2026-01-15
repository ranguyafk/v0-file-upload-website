"use client"

import { useState } from "react"
import { ArrowRight, Loader2, FileIcon, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function ManageLinks() {
  const [slug, setSlug] = useState("")
  const [token, setToken] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleManage = async () => {
    if (!slug || !token) return

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/file/${slug}?token=${token}`)
      const data = await response.json()

      if (!response.ok || !data.isOwner) {
        setError("Invalid link or token. Please check your credentials.")
        return
      }

      window.location.href = `/${slug}/analytics?token=${token}`
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="manage-slug" className="text-sm flex items-center gap-2">
          <FileIcon className="w-4 h-4 text-primary" /> File Slug
        </Label>
        <Input
          id="manage-slug"
          value={slug}
          onChange={(e) => {
            setSlug(e.target.value.replace(/[^a-zA-Z0-9_-]/g, ""))
            setError(null)
          }}
          placeholder="your-file-slug"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="manage-token" className="text-sm">
          Owner Token
        </Label>
        <Input
          id="manage-token"
          type="password"
          value={token}
          onChange={(e) => {
            setToken(e.target.value)
            setError(null)
          }}
          placeholder="Enter your owner token"
          onKeyDown={(e) => e.key === "Enter" && handleManage()}
        />
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg p-3">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      <Button onClick={handleManage} disabled={!slug || !token || loading} className="w-full">
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Verifying...
          </>
        ) : (
          <>
            View Analytics
            <ArrowRight className="w-4 h-4 ml-2" />
          </>
        )}
      </Button>
    </div>
  )
}
