"use client"

import { ChevronRight, Home } from "lucide-react"
import { Button } from "@/components/ui/button"

interface BreadcrumbItem {
  id: string | null
  name: string
}

interface BreadcrumbNavigationProps {
  path: BreadcrumbItem[]
  onNavigate: (folderId: string | null) => void
}

export function BreadcrumbNavigation({ path, onNavigate }: BreadcrumbNavigationProps) {
  return (
    <div className="flex items-center gap-1 overflow-x-auto py-2 text-sm">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onNavigate(null)}
        className="flex items-center gap-1 h-8 px-2 active-scale"
      >
        <Home className="w-4 h-4" />
        <span className="hidden md:inline">Files</span>
      </Button>
      {path.map((item, index) => (
        <div key={item.id || "root"} className="flex items-center gap-1">
          <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate(item.id)}
            className={`h-8 px-2 active-scale ${index === path.length - 1 ? "font-semibold text-foreground" : "text-muted-foreground"}`}
            disabled={index === path.length - 1}
          >
            {item.name}
          </Button>
        </div>
      ))}
    </div>
  )
}
