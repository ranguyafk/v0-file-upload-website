"use client"

import { useEffect, useCallback, useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X, ChevronLeft, ChevronRight, Download, ExternalLink } from "lucide-react"
import Image from "next/image"

interface PreviewModalProps {
  isOpen: boolean
  onClose: () => void
  images: Array<{
    id: string
    slug: string
    title: string | null
    filename: string
    file_url: string
  }>
  currentIndex: number
  onNavigate: (index: number) => void
}

export function PreviewModal({ isOpen, onClose, images, currentIndex, onNavigate }: PreviewModalProps) {
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)

  const currentImage = images[currentIndex]
  const hasPrev = currentIndex > 0
  const hasNext = currentIndex < images.length - 1

  const handlePrev = useCallback(() => {
    if (hasPrev) {
      onNavigate(currentIndex - 1)
    }
  }, [hasPrev, currentIndex, onNavigate])

  const handleNext = useCallback(() => {
    if (hasNext) {
      onNavigate(currentIndex + 1)
    }
  }, [hasNext, currentIndex, onNavigate])

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handlePrev()
      if (e.key === "ArrowRight") handleNext()
      if (e.key === "Escape") onClose()
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, handlePrev, handleNext, onClose])

  // Touch swipe support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) {
      // Swiped left
      handleNext()
    }
    if (touchStart - touchEnd < -50) {
      // Swiped right
      handlePrev()
    }
  }

  if (!currentImage) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] md:max-w-7xl h-[90vh] p-0 bg-black/95 border-none">
        <div className="relative w-full h-full flex flex-col">
          {/* Header */}
          <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-gradient-to-b from-black/60 to-transparent">
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-medium truncate text-sm md:text-base">
                {currentImage.title || currentImage.filename}
              </h3>
              <p className="text-white/60 text-xs md:text-sm">
                {currentIndex + 1} / {images.length}
              </p>
            </div>
            <div className="flex items-center gap-2 ml-4">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20 touch-target"
                asChild
              >
                <a href={currentImage.file_url} download target="_blank" rel="noopener noreferrer">
                  <Download className="w-5 h-5" />
                </a>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20 touch-target"
                asChild
              >
                <a href={`/${currentImage.slug}`} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-5 h-5" />
                </a>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-white hover:bg-white/20 touch-target"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Image */}
          <div
            className="flex-1 flex items-center justify-center p-4 md:p-8"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div className="relative w-full h-full flex items-center justify-center">
              <img
                src={currentImage.file_url}
                alt={currentImage.title || currentImage.filename}
                className="max-w-full max-h-full object-contain select-none"
                draggable={false}
              />
            </div>
          </div>

          {/* Navigation - Desktop */}
          {hasPrev && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePrev}
              className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 w-12 h-12"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-8 h-8" />
            </Button>
          )}
          {hasNext && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNext}
              className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 w-12 h-12"
              aria-label="Next image"
            >
              <ChevronRight className="w-8 h-8" />
            </Button>
          )}

          {/* Navigation - Mobile (bottom) */}
          <div className="md:hidden absolute bottom-0 left-0 right-0 flex items-center justify-center gap-4 p-4 bg-gradient-to-t from-black/60 to-transparent">
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePrev}
              disabled={!hasPrev}
              className="text-white hover:bg-white/20 disabled:opacity-30 touch-target"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNext}
              disabled={!hasNext}
              className="text-white hover:bg-white/20 disabled:opacity-30 touch-target"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
