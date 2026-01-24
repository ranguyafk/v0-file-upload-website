"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Loader2 } from "lucide-react"

interface CreateFolderDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onFolderCreated: () => void
  parentId?: string | null
}

export function CreateFolderDialog({ open, onOpenChange, onFolderCreated, parentId = null }: CreateFolderDialogProps) {
  const [folderName, setFolderName] = useState("")
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCreate = async () => {
    if (!folderName.trim()) {
      setError("Folder name is required")
      return
    }

    setCreating(true)
    setError(null)

    try {
      const response = await fetch("/api/folders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: folderName.trim(), parent_id: parentId }),
      })

      const text = await response.text()
      let data
      try {
        data = JSON.parse(text)
      } catch (parseError) {
        console.error("Failed to parse server response:", parseError, "Response:", text)
        throw new Error("Invalid server response. Please try again.")
      }

      if (!response.ok) {
        const errorMsg = data.error || `Failed to create folder (${response.status})`
        console.error("Folder creation failed:", { status: response.status, error: errorMsg })
        throw new Error(errorMsg)
      }

      setFolderName("")
      onOpenChange(false)
      onFolderCreated()
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to create folder"
      console.error("Folder creation error:", err)
      setError(errorMsg)
    } finally {
      setCreating(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Folder</DialogTitle>
          <DialogDescription>Enter a name for your new folder.</DialogDescription>
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
                if (e.key === "Enter" && !creating) {
                  handleCreate()
                }
              }}
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={creating}>
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={creating || !folderName.trim()}>
            {creating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Folder"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
