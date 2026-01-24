"use client"

import { Button } from "@/components/ui/button"
import { Trash2, Copy, Download, X, Loader2 } from "lucide-react"

interface SelectionToolbarProps {
  selectedCount: number
  onCopyLinks: () => void
  onDownload: () => void
  onDelete: () => void
  onClearSelection: () => void
  isDeleting: boolean
}

export function SelectionToolbar({
  selectedCount,
  onCopyLinks,
  onDownload,
  onDelete,
  onClearSelection,
  isDeleting,
}: SelectionToolbarProps) {
  if (selectedCount === 0) return null

  return (
    <>
      {/* Desktop toolbar - sticky top */}
      <div className="hidden md:flex sticky top-0 z-10 bg-primary/10 border-y border-primary/20 px-4 py-3 items-center justify-between backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClearSelection}
            className="h-8 w-8"
            aria-label="Clear selection"
          >
            <X className="w-4 h-4" />
          </Button>
          <span className="text-sm font-medium">
            {selectedCount} {selectedCount === 1 ? "item" : "items"} selected
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onCopyLinks} className="active-scale">
            <Copy className="w-4 h-4 mr-2" />
            Copy Links
          </Button>
          <Button variant="outline" size="sm" onClick={onDownload} className="active-scale">
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={onDelete}
            disabled={isDeleting}
            className="active-scale"
          >
            {isDeleting ? (
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
          </Button>
        </div>
      </div>

      {/* Mobile toolbar - fixed bottom */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border shadow-lg safe-area-inset-bottom">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium">
              {selectedCount} {selectedCount === 1 ? "item" : "items"}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearSelection}
              className="h-8 text-xs"
            >
              Clear
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onCopyLinks}
              className="touch-target active-scale text-xs"
            >
              <Copy className="w-4 h-4 mr-1.5" />
              Copy
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onDownload}
              className="touch-target active-scale text-xs"
            >
              <Download className="w-4 h-4 mr-1.5" />
              Download
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={onDelete}
              disabled={isDeleting}
              className="touch-target active-scale text-xs"
            >
              {isDeleting ? (
                <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4 mr-1.5" />
              )}
              Delete
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
