import type React from "react"
import Link from "next/link"
import { WifiOff, RefreshCw, Home } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Offline() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto">
          <WifiOff className="w-10 h-10 text-muted-foreground" />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">You're Offline</h1>
          <p className="text-lg text-muted-foreground">
            No internet connection detected. Please check your network and try again.
          </p>
        </div>

        <div className="space-y-3">
          <p className="text-sm text-muted-foreground pt-4">
            Some features may be available while offline
          </p>
        </div>
      </div>
    </main>
  )
}
