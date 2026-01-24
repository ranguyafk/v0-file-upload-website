"use client"

import { useState, useCallback } from "react"
import { Check } from "lucide-react"
import Image from "next/image"

interface PhotoGridProps {
  photos: Array<{
    id: string
    slug: string
    title: string | null
    filename: string
    file_url: string
    file_size: number
    created_at: string
  }>
  selectedIds: Set<string>
  onToggleSelection: (id: string) => void
  onPreview: (index: number) => void
  selectionMode: boolean
}

export function PhotoGrid({
  photos,
  selectedIds,
  onToggleSelection,
  onPreview,
  selectionMode,
}: PhotoGridProps) {
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null)

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
    (index: number, id: string) => {
      if (selectionMode) {
        onToggleSelection(id)
      } else {
        onPreview(index)
      }
    },
    [selectionMode, onToggleSelection, onPreview]
  )

  if (photos.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No photos to display</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-3">
      {photos.map((photo, index) => {
        const isSelected = selectedIds.has(photo.id)
        return (
          <div
            key={photo.id}
            className="relative aspect-square group cursor-pointer"
            onClick={() => handleClick(index, photo.id)}
            onTouchStart={() => handleTouchStart(photo.id)}
            onTouchEnd={handleTouchEnd}
            role="button"
            tabIndex={0}
            aria-label={`${photo.title || photo.filename}${isSelected ? ", selected" : ""}`}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault()
                handleClick(index, photo.id)
              }
            }}
          >
            {/* Image container */}
            <div className="relative w-full h-full overflow-hidden rounded-lg bg-muted border border-border">
              {/* Using regular img tag instead of Next.js Image because files are from 
                  external Vercel Blob storage and Image component requires known dimensions */}
              <img
                src={photo.file_url}
                alt={photo.title || photo.filename}
                className={`w-full h-full object-cover transition-all ${
                  isSelected ? "scale-95 opacity-70" : "group-hover:scale-105"
                }`}
                loading="lazy"
              />

              {/* Selection overlay */}
              {(selectionMode || isSelected) && (
                <div
                  className={`absolute inset-0 flex items-start justify-end p-2 ${
                    isSelected ? "bg-primary/20" : "bg-black/0 group-hover:bg-black/10"
                  } transition-all`}
                >
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                      isSelected
                        ? "bg-primary border-primary"
                        : "bg-white/80 border-white group-hover:bg-white"
                    }`}
                  >
                    {isSelected && <Check className="w-4 h-4 text-primary-foreground" />}
                  </div>
                </div>
              )}

              {/* Desktop checkbox (always visible in selection mode) */}
              {selectionMode && (
                <div className="hidden md:flex absolute top-2 left-2">
                  <div
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                      isSelected
                        ? "bg-primary border-primary"
                        : "bg-white/80 border-white hover:bg-white"
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 text-primary-foreground" />}
                  </div>
                </div>
              )}
            </div>

            {/* Hover info */}
            <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <p className="text-white text-xs font-medium truncate">
                {photo.title || photo.filename}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
