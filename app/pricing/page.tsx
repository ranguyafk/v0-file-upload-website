import type React from "react"
import { Check, Zap, Crown, Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export const metadata = {
  title: "Pricing - FileDrop",
  description: "Simple, transparent pricing for everyone. Start free, upgrade when you need more.",
}

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 py-16 md:py-24 relative">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Simple, Transparent <span className="text-primary">Pricing</span>
            </h1>
            <p className="text-lg text-muted-foreground">Start for free. Upgrade when you need more power.</p>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Free */}
          <div className="bg-card border border-border rounded-2xl p-6 flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center">
                <Zap className="w-5 h-5 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-xl text-foreground">Free</h3>
            </div>
            <div className="mb-6">
              <span className="text-4xl font-bold text-foreground">$0</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <p className="text-muted-foreground mb-6">Perfect for personal use and trying things out.</p>
            <ul className="space-y-3 mb-8 flex-1">
              <PricingFeature>Up to 500MB per file</PricingFeature>
              <PricingFeature>5 uploads per day</PricingFeature>
              <PricingFeature>Files expire after 7 days max</PricingFeature>
              <PricingFeature>Password protection</PricingFeature>
              <PricingFeature>Basic analytics</PricingFeature>
            </ul>
            <Button asChild variant="outline" className="w-full bg-transparent">
              <Link href="/">Get Started</Link>
            </Button>
          </div>

          {/* Pro - Highlighted */}
          <div className="bg-card border-2 border-primary rounded-2xl p-6 flex flex-col relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-sm font-medium px-3 py-1 rounded-full">
              Most Popular
            </div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <Crown className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-xl text-foreground">Pro</h3>
            </div>
            <div className="mb-6">
              <span className="text-4xl font-bold text-foreground">$9</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <p className="text-muted-foreground mb-6">For creators and professionals who share often.</p>
            <ul className="space-y-3 mb-8 flex-1">
              <PricingFeature>Up to 2GB per file</PricingFeature>
              <PricingFeature>Unlimited uploads</PricingFeature>
              <PricingFeature>Files never expire (optional)</PricingFeature>
              <PricingFeature>Password protection</PricingFeature>
              <PricingFeature>Advanced analytics</PricingFeature>
              <PricingFeature>Priority support</PricingFeature>
              <PricingFeature>Custom branding</PricingFeature>
            </ul>
            <Button asChild className="w-full">
              <Link href="/contact">Upgrade to Pro</Link>
            </Button>
          </div>

          {/* Enterprise */}
          <div className="bg-card border border-border rounded-2xl p-6 flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center">
                <Building2 className="w-5 h-5 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-xl text-foreground">Enterprise</h3>
            </div>
            <div className="mb-6">
              <span className="text-4xl font-bold text-foreground">Custom</span>
            </div>
            <p className="text-muted-foreground mb-6">For teams and businesses with custom needs.</p>
            <ul className="space-y-3 mb-8 flex-1">
              <PricingFeature>Up to 10GB per file</PricingFeature>
              <PricingFeature>Unlimited everything</PricingFeature>
              <PricingFeature>Custom domain</PricingFeature>
              <PricingFeature>Team management</PricingFeature>
              <PricingFeature>API access</PricingFeature>
              <PricingFeature>SSO integration</PricingFeature>
              <PricingFeature>Dedicated support</PricingFeature>
              <PricingFeature>SLA guarantee</PricingFeature>
            </ul>
            <Button asChild variant="outline" className="w-full bg-transparent">
              <Link href="/contact">Contact Sales</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ Link */}
      <section className="border-t border-border bg-card/50">
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Have Questions?</h2>
          <p className="text-muted-foreground mb-6">Check out our FAQ or reach out to our team.</p>
          <div className="flex items-center justify-center gap-4">
            <Button asChild variant="outline">
              <Link href="/faq">View FAQ</Link>
            </Button>
            <Button asChild>
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}

function PricingFeature({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-center gap-2 text-sm text-muted-foreground">
      <Check className="w-4 h-4 text-primary flex-shrink-0" />
      <span>{children}</span>
    </li>
  )
}
