import type React from "react"
import { Shield, Zap, Users, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export const metadata = {
  title: "About - FileDrop",
  description: "Learn about FileDrop and our mission to make file sharing simple, secure, and accessible to everyone.",
}

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 py-16 md:py-24 relative">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              About <span className="text-primary">FileDrop</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Making file sharing simple, secure, and accessible to everyone.
            </p>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">Our Story</h2>
          <div className="prose prose-invert max-w-none space-y-4 text-muted-foreground">
            <p>
              FileDrop was born from a simple frustration: sharing files shouldn't be complicated. Too many services
              require accounts, have confusing interfaces, or compromise on security.
            </p>
            <p>
              We built FileDrop to be different. No accounts required. No complicated settings. Just drag, drop, and
              share. It's that simple.
            </p>
            <p>
              But simple doesn't mean basic. Under the hood, FileDrop uses enterprise-grade encryption, intelligent rate
              limiting, and a globally distributed CDN to ensure your files are always fast and secure.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="border-t border-border bg-card/50">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">Our Values</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <ValueCard
              icon={<Shield className="w-6 h-6" />}
              title="Security First"
              description="Your data's security is non-negotiable. We use industry-leading encryption."
            />
            <ValueCard
              icon={<Zap className="w-6 h-6" />}
              title="Simplicity"
              description="No bloat, no complexity. Just the features you need, nothing more."
            />
            <ValueCard
              icon={<Users className="w-6 h-6" />}
              title="User Privacy"
              description="We don't track you, sell your data, or require personal information."
            />
            <ValueCard
              icon={<Globe className="w-6 h-6" />}
              title="Accessibility"
              description="Free tier for everyone. No one should be locked out of file sharing."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border">
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Ready to Get Started?</h2>
          <p className="text-muted-foreground mb-6">Join thousands of users who trust FileDrop every day.</p>
          <Button asChild size="lg">
            <Link href="/">Start Sharing</Link>
          </Button>
        </div>
      </section>
    </main>
  )
}

function ValueCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="bg-card border border-border rounded-xl p-6 text-center">
      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mx-auto mb-4">
        {icon}
      </div>
      <h3 className="font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )
}
