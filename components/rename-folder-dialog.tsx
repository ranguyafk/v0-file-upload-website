"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Loader2 } from "lucide-react"

interface RenameFolderDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onFolderRenamed: () => void
  folderId: string | null
  currentName: string
}

export function RenameFolderDialog({ open, onOpenChange, onFolderRenamed, folderId, currentName }: RenameFolderDialogProps) {
  const [folderName, setFolderName] = useState(currentName)
  const [renaming, setRenaming] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setFolderName(currentName)
  }, [currentName, open])

  const handleRename = async () => {
    if (!folderName.trim() || !folderId) {
      setError("Folder name is required")
      return
    }

    if (folderName.trim() === currentName) {
      onOpenChange(false)
      return
    }

    setRenaming(true)
    setError(null)

    try {
      const response = await fetch(`/api/folders/${folderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: folderName.trim() }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to rename folder")
      }

      onOpenChange(false)
      onFolderRenamed()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to rename folder")
    } finally {
      setRenaming(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Rename Folder</DialogTitle>
          <DialogDescription>Enter a new name for this folder.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="folder-name">Folder Name</Label>
            <Input
              id="folder-name"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              placeholder="My Folder"
              maxLength={100}
              className="h-12 text-base"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !renaming) {
                  handleRename()
                }
              }}
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={renaming}>
            Cancel
          </Button>
          <Button onClick={handleRename} disabled={renaming || !folderName.trim()}>
            {renaming ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Renaming...
              </>
            ) : (
              "Rename"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
