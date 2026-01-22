"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { Home, Upload, FolderOpen, Settings, User } from "lucide-react"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { User as SupabaseUser } from "@supabase/supabase-js"

export function BottomNav() {
  const pathname = usePathname()
  const [user, setUser] = useState<SupabaseUser | null>(null)

  useEffect(() => {
    const supabase = createClient()

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true
    if (path !== "/" && pathname.startsWith(path)) return true
    return false
  }

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-lg border-t border-border">
      <div className="flex items-center justify-around h-16 px-2">
        <NavItem
          href="/"
          icon={<Home className="w-5 h-5" />}
          label="Home"
          active={isActive("/")}
        />
        
        <NavItem
          href="/?action=upload"
          icon={
            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center -mt-6 shadow-lg">
              <Upload className="w-5 h-5 text-primary-foreground" />
            </div>
          }
          label=""
          active={false}
        />

        {user ? (
          <NavItem
            href="/dashboard"
            icon={<FolderOpen className="w-5 h-5" />}
            label="Files"
            active={isActive("/dashboard")}
          />
        ) : (
          <NavItem
            href="/auth/login"
            icon={<User className="w-5 h-5" />}
            label="Account"
            active={isActive("/auth")}
          />
        )}
      </div>
    </nav>
  )
}

function NavItem({
  href,
  icon,
  label,
  active,
}: {
  href: string
  icon: React.ReactNode
  label: string
  active: boolean
}) {
  return (
    <Link
      href={href}
      className={`flex flex-col items-center justify-center min-w-[60px] py-2 transition-colors ${
        active ? "text-primary" : "text-muted-foreground"
      }`}
    >
      {icon}
      {label && (
        <span className={`text-xs mt-1 font-medium ${active ? "text-primary" : "text-muted-foreground"}`}>
          {label}
        </span>
      )}
    </Link>
  )
}
