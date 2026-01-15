export const metadata = {
  title: "Terms of Service - FileDrop",
  description: "FileDrop terms of service. Read our terms and conditions for using our file sharing service.",
}

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-background">
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Terms of Service</h1>
          <p className="text-muted-foreground mb-8">Last updated: January 2026</p>

          <div className="prose prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground">
                By accessing or using FileDrop, you agree to be bound by these Terms of Service. If you do not agree to
                these terms, do not use our service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">2. Service Description</h2>
              <p className="text-muted-foreground">
                FileDrop provides a file sharing service that allows users to upload, store temporarily, and share files
                with others via unique URLs.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">3. Acceptable Use</h2>
              <p className="text-muted-foreground">You agree NOT to use FileDrop to:</p>
              <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
                <li>Upload, share, or distribute illegal content</li>
                <li>Upload copyrighted material without authorization</li>
                <li>Distribute malware, viruses, or harmful software</li>
                <li>Share content that violates others' privacy</li>
                <li>Engage in harassment, abuse, or illegal activities</li>
                <li>Attempt to circumvent security measures or rate limits</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">4. Content Responsibility</h2>
              <p className="text-muted-foreground">
                You are solely responsible for the content you upload and share. FileDrop does not monitor uploaded
                content but reserves the right to remove any content that violates these terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">5. Service Limitations</h2>
              <p className="text-muted-foreground">
                We reserve the right to modify, suspend, or discontinue any aspect of the service at any time. We are
                not liable for any modification, suspension, or discontinuation of the service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">6. Disclaimer of Warranties</h2>
              <p className="text-muted-foreground">
                FileDrop is provided "as is" without warranties of any kind. We do not guarantee that the service will
                be uninterrupted, secure, or error-free.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">7. Limitation of Liability</h2>
              <p className="text-muted-foreground">
                FileDrop shall not be liable for any indirect, incidental, special, consequential, or punitive damages
                resulting from your use of or inability to use the service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">8. Changes to Terms</h2>
              <p className="text-muted-foreground">
                We may update these terms at any time. Continued use of the service after changes constitutes acceptance
                of the new terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">9. Contact</h2>
              <p className="text-muted-foreground">
                For questions about these terms, contact us at legal@filedrop.com.
              </p>
            </section>
          </div>
        </div>
      </section>
    </main>
  )
}
