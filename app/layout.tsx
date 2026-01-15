import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "FileDrop - Secure File Sharing | Upload & Share Files Instantly",
  description:
    "Upload and share files up to 1GB with custom URLs, password protection, auto-expiration, and analytics. Fast, secure, and free.",
  keywords: ["file sharing", "upload files", "secure file transfer", "custom url", "password protected files"],
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <Header />
        {children}
        <Footer />
        <Analytics />
      </body>
    </html>
  )
}
