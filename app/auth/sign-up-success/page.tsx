import Link from "next/link"
import { Upload, Mail, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function SignUpSuccessPage() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
            <Upload className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-2xl text-foreground">FileDrop</span>
        </Link>

        <div className="bg-card border border-border rounded-2xl overflow-hidden p-8">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Mail className="w-8 h-8 text-primary" />
          </div>

          <h1 className="text-2xl font-bold text-foreground mb-2">Check your email</h1>
          <p className="text-muted-foreground mb-6">
            We've sent you a confirmation link. Click it to activate your account and start sharing files.
          </p>

          <Button asChild className="w-full">
            <Link href="/auth/login">
              Continue to Login
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </main>
  )
}
