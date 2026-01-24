"use client"

import { useState, useCallback } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  FileIcon,
  Eye,
  Download,
  Lock,
  Clock,
  BarChart3,
  ExternalLink,
  Copy,
  Check,
  Loader2,
} from "lucide-react"

interface FileListProps {
  files: Array<{
    id: string
    slug: string
    title: string | null
    filename: string
    file_size: number
    file_type: string
    view_count: number
    download_count: number
    expires_at: string | null
    password_hash: string | null
    created_at: string
    owner_token: string
  }>
  selectedIds: Set<string>
  onToggleSelection: (id: string) => void
  selectionMode: boolean
}

export function FileList({ files, selectedIds, onToggleSelection, selectionMode }: FileListProps) {
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null)
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null)

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

  const copyLink = async (slug: string, e: React.MouseEvent) => {
    e.stopPropagation()
    await navigator.clipboard.writeText(`${window.location.origin}/${slug}`)
    setCopiedSlug(slug)
    setTimeout(() => setCopiedSlug(null), 2000)
  }

  const handleTouchStart = useCallback(
    (id: string) => {
      if (!selectionMode) {
        const timer = setTimeout(() => {
          onToggleSelection(id)
        }, 500) // 500ms long press
        setLongPressTimer(timer)
      }
    },
    [selectionMode, onToggleSelection]
  )

  const handleTouchEnd = useCallback(() => {
    if (longPressTimer) {
      clearTimeout(longPressTimer)
      setLongPressTimer(null)
    }
  }, [longPressTimer])

  const handleClick = useCallback(
    (id: string) => {
      if (selectionMode) {
        onToggleSelection(id)
      }
    },
    [selectionMode, onToggleSelection]
  )

  if (files.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No files to display</p>
      </div>
    )
  }

  return (
    <div className="divide-y divide-border">
      {files.map((file) => {
        const isSelected = selectedIds.has(file.id)
        return (
          <div
            key={file.id}
            className={`p-4 transition-colors ${
              selectionMode ? "cursor-pointer hover:bg-muted/30" : ""
            } ${isSelected ? "bg-primary/10" : ""}`}
            onClick={() => handleClick(file.id)}
            onTouchStart={() => handleTouchStart(file.id)}
            onTouchEnd={handleTouchEnd}
            role={selectionMode ? "button" : undefined}
            tabIndex={selectionMode ? 0 : undefined}
            aria-selected={isSelected}
            onKeyDown={(e) => {
              if (selectionMode && (e.key === "Enter" || e.key === " ")) {
                e.preventDefault()
                handleClick(file.id)
              }
            }}
          >
            <div className="flex flex-col gap-3">
              <div className="flex items-start gap-3">
                {/* Selection checkbox (desktop) */}
                {selectionMode && (
                  <div className="hidden md:flex items-center pt-1">
                    <div
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                        isSelected
                          ? "bg-primary border-primary"
                          : "bg-background border-border hover:border-primary"
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 text-primary-foreground" />}
                    </div>
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <FileIcon className="w-4 h-4 text-primary flex-shrink-0" />
                    <p className="font-medium text-sm md:text-base text-foreground truncate">
                      {file.title || file.filename}
                    </p>
                    {file.password_hash && <Lock className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />}
                    {file.expires_at && <Clock className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />}
                    {/* Selection indicator (mobile) */}
                    {isSelected && (
                      <div className="md:hidden ml-auto">
                        <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                          <Check className="w-3.5 h-3.5 text-primary-foreground" />
                        </div>
                      </div>
                    )}
                  </div>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    /{file.slug} &middot; {formatSize(file.file_size)} &middot; {formatDate(file.created_at)}
                  </p>
                </div>
              </div>

              {!selectionMode && (
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
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => copyLink(file.slug, e)}
                      title="Copy link"
                      className="h-9 w-9 md:h-8 md:w-8 active-scale"
                    >
                      {copiedSlug === file.slug ? (
                        <Check className="w-4 h-4 text-primary" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      asChild
                      title="View file"
                      className="h-9 w-9 md:h-8 md:w-8 active-scale"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Link href={`/${file.slug}`} target="_blank">
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      asChild
                      title="Analytics"
                      className="h-9 w-9 md:h-8 md:w-8 active-scale"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Link href={`/${file.slug}/analytics?token=${file.owner_token}`}>
                        <BarChart3 className="w-4 h-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
