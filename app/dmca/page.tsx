import { Button } from "@/components/ui/button"
import Link from "next/link"

export const metadata = {
  title: "DMCA Policy - FileDrop",
  description: "FileDrop DMCA takedown policy and procedures for copyright infringement claims.",
}

export default function DMCAPage() {
  return (
    <main className="min-h-screen bg-background">
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">DMCA Policy</h1>
          <p className="text-muted-foreground mb-8">Digital Millennium Copyright Act Compliance</p>

          <div className="prose prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">Reporting Copyright Infringement</h2>
              <p className="text-muted-foreground">
                FileDrop respects intellectual property rights and complies with the Digital Millennium Copyright Act
                (DMCA). If you believe your copyrighted work has been posted on FileDrop without authorization, please
                submit a DMCA takedown notice.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">DMCA Takedown Notice Requirements</h2>
              <p className="text-muted-foreground">Your notice must include:</p>
              <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
                <li>Your physical or electronic signature</li>
                <li>Identification of the copyrighted work claimed to be infringed</li>
                <li>Identification of the infringing material with enough detail to locate it</li>
                <li>Your contact information (address, phone number, email)</li>
                <li>A statement that you have a good faith belief the use is not authorized</li>
                <li>A statement under penalty of perjury that the information is accurate</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">Submit a DMCA Notice</h2>
              <p className="text-muted-foreground">
                Send your DMCA takedown notice to: <strong>dmca@filedrop.com</strong>
              </p>
              <p className="text-muted-foreground mt-2">
                We will review all valid notices and remove infringing content within 24-48 hours.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">Counter-Notification</h2>
              <p className="text-muted-foreground">
                If you believe your content was removed in error, you may submit a counter-notification to
                dmca@filedrop.com with the required information under the DMCA.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">Repeat Infringers</h2>
              <p className="text-muted-foreground">
                FileDrop maintains a policy to terminate access for repeat infringers in appropriate circumstances.
              </p>
            </section>
          </div>

          <div className="mt-10 p-6 bg-card border border-border rounded-xl">
            <h3 className="font-semibold text-foreground mb-2">Need to Report Content?</h3>
            <p className="text-sm text-muted-foreground mb-4">
              For copyright infringement reports or other content concerns, contact our team.
            </p>
            <Button asChild>
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}
