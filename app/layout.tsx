import type React from "react"
import type { Metadata, Viewport } from "next"
import { Analytics } from "@vercel/analytics/next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { InstallPrompt } from "@/components/install-prompt"
import { BottomNav } from "@/components/bottom-nav"
import { ServiceWorkerRegister } from "@/components/service-worker-register"
import { OnboardingFlow } from "@/components/onboarding-flow"
import "./globals.css"

export const metadata: Metadata = {
  title: "FileDrop - Secure File Sharing | Upload & Share Files Instantly",
  description:
    "Upload and share files up to 1GB with custom URLs, password protection, auto-expiration, and analytics. Fast, secure, and free.",
  keywords: ["file sharing", "upload files", "secure file transfer", "custom url", "password protected files"],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "FileDrop",
  },
  openGraph: {
    title: "FileDrop - Secure File Sharing",
    description: "Upload and share files up to 1GB with custom URLs, password protection, and analytics.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FileDrop - Secure File Sharing",
    description: "Upload and share files up to 1GB with custom URLs, password protection, and analytics.",
  },
  generator: 'v0.app'
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#f5c842",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/apple-icon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className={`font-sans antialiased pb-16 md:pb-0`}>
        <ServiceWorkerRegister />
        <Header />
        {children}
        <Footer />
        <BottomNav />
        <InstallPrompt />
        <OnboardingFlow />
        <Analytics />
      </body>
    </html>
  )
}
