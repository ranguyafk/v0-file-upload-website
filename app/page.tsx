import type React from "react"
import { UploadForm } from "@/components/upload-form"
import { ManageLinks } from "@/components/manage-links"
import { Shield, Zap, Clock, LinkIcon, Lock, BarChart3, Upload, Star, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/5 pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />

        <div className="container mx-auto px-4 py-12 md:py-16 lg:py-24 relative">
          <div className="text-center space-y-4 md:space-y-6 mb-8 md:mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/15 text-primary border border-primary/20 px-3 md:px-4 py-1.5 rounded-full text-xs md:text-sm font-medium animate-in fade-in">
              <Star className="w-3 h-3 md:w-4 md:h-4" />
              100% Free to Use
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold text-foreground tracking-tight text-balance px-4 animate-in slide-in-from-bottom-4">
              Share Files <span className="text-primary">Instantly</span>
            </h1>
            <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty px-4 animate-in slide-in-from-bottom-4 delay-100">
              Upload up to 1GB. Get a custom link. Set a password. Choose when it expires. It's that simple.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 max-w-5xl mx-auto">
            {/* Upload Card */}
            <div className="bg-card border border-border rounded-2xl p-5 md:p-6 animate-in slide-in-from-left-4 delay-200">
              <div className="flex items-center gap-3 mb-4 md:mb-6">
                <div className="w-12 h-12 md:w-12 md:h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Upload className="w-6 h-6 md:w-6 md:h-6 text-primary" />
                </div>
                <div>
                  <h2 className="font-bold text-lg md:text-xl text-foreground">Upload a File</h2>
                  <p className="text-sm text-muted-foreground">Share files up to 1GB</p>
                </div>
              </div>
              <UploadForm />
            </div>

            {/* Manage Card */}
            <div className="bg-card border border-border rounded-2xl p-5 md:p-6 animate-in slide-in-from-right-4 delay-200">
              <div className="flex items-center gap-3 mb-4 md:mb-6">
                <div className="w-12 h-12 md:w-12 md:h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <BarChart3 className="w-6 h-6 md:w-6 md:h-6 text-primary" />
                </div>
                <div>
                  <h2 className="font-bold text-lg md:text-xl text-foreground">Manage Files</h2>
                  <p className="text-sm text-muted-foreground">View stats or delete uploads</p>
                </div>
              </div>
              <ManageLinks />

              {/* Sign in prompt */}
              <div className="mt-6 pt-6 border-t border-border">
                <p className="text-sm text-muted-foreground mb-3">Sign in to see all your files in one place</p>
                <Button asChild variant="outline" className="w-full h-12 md:h-auto bg-transparent touch-target active-scale">
                  <Link href="/auth/login">
                    Sign In to Dashboard
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="border-t border-border bg-card/50">
        <div className="container mx-auto px-4 py-16 md:py-20 lg:py-28">
          <div className="text-center mb-10 md:mb-14">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-3 md:mb-4">Everything You Need</h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto px-4">
              Powerful features that make sharing files secure and effortless
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-6xl mx-auto">
            <FeatureCard
              icon={<Zap className="w-5 h-5 md:w-6 md:h-6" />}
              title="Lightning Fast"
              description="Upload files up to 1GB with blazing fast speeds. No waiting around."
            />
            <FeatureCard
              icon={<LinkIcon className="w-5 h-5 md:w-6 md:h-6" />}
              title="Custom URLs"
              description="Create memorable links like yoursite.com/my-project for easy sharing."
            />
            <FeatureCard
              icon={<Lock className="w-5 h-5 md:w-6 md:h-6" />}
              title="Password Protection"
              description="Lock sensitive files with a password. Only people with the code can access."
            />
            <FeatureCard
              icon={<Clock className="w-5 h-5 md:w-6 md:h-6" />}
              title="Auto-Expiration"
              description="Set files to self-destruct after minutes, hours, or days."
            />
            <FeatureCard
              icon={<Shield className="w-5 h-5 md:w-6 md:h-6" />}
              title="DDoS Protection"
              description="Built-in rate limiting keeps your files safe from abuse."
            />
            <FeatureCard
              icon={<BarChart3 className="w-5 h-5 md:w-6 md:h-6" />}
              title="Analytics Dashboard"
              description="Track views, downloads, and see who's accessing your files."
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-t border-border bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="container mx-auto px-4 py-12 md:py-16 lg:py-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-4xl mx-auto text-center">
            <StatCard value="1 GB" label="Max File Size" />
            <StatCard value="100%" label="Free Forever" />
            <StatCard value="256-bit" label="Encryption" />
            <StatCard value="99.9%" label="Uptime" />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border">
        <div className="container mx-auto px-4 py-16 md:py-20 lg:py-28">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-3 md:mb-4 px-4">Ready to Share?</h2>
            <p className="text-base md:text-lg text-muted-foreground mb-6 md:mb-8 px-4">
              Create an account to unlock more features and manage all your files in one place.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 px-4">
              <Button asChild size="lg" className="w-full sm:w-auto h-12 md:h-12 px-6 md:px-8 touch-target active-scale">
                <Link href="/auth/sign-up">
                  Create Free Account
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto h-12 md:h-12 px-6 md:px-8 bg-transparent touch-target active-scale">
                <Link href="/pricing">View Pricing</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="group bg-card border border-border rounded-2xl p-5 md:p-6 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all active-scale">
      <div className="w-12 h-12 md:w-12 md:h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-4 group-hover:bg-primary/20 transition-colors">
        {icon}
      </div>
      <h3 className="font-semibold text-base md:text-lg text-foreground mb-2">{title}</h3>
      <p className="text-sm md:text-base text-muted-foreground leading-relaxed">{description}</p>
    </div>
  )
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary mb-1">{value}</p>
      <p className="text-sm md:text-base text-muted-foreground">{label}</p>
    </div>
  )
}
