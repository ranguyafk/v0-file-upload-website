export const metadata = {
  title: "Privacy Policy - FileDrop",
  description: "FileDrop privacy policy. Learn how we handle and protect your data.",
}

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-background">
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Privacy Policy</h1>
          <p className="text-muted-foreground mb-8">Last updated: January 2026</p>

          <div className="prose prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">1. Information We Collect</h2>
              <p className="text-muted-foreground">
                When you use FileDrop, we collect minimal information necessary to provide our service:
              </p>
              <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
                <li>Files you upload (stored temporarily based on your expiration settings)</li>
                <li>IP addresses (for rate limiting and abuse prevention)</li>
                <li>Basic usage analytics (page views, feature usage)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">2. How We Use Your Information</h2>
              <p className="text-muted-foreground">We use collected information solely to:</p>
              <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
                <li>Provide and maintain our file sharing service</li>
                <li>Prevent abuse and enforce rate limits</li>
                <li>Improve our service based on usage patterns</li>
                <li>Respond to support requests</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">3. Data Storage & Security</h2>
              <p className="text-muted-foreground">
                All files are transmitted using HTTPS with 256-bit encryption. Files are stored on secure, encrypted
                servers. Password-protected files use bcrypt hashing. Files are automatically deleted based on your
                chosen expiration time.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">4. Data Sharing</h2>
              <p className="text-muted-foreground">
                We do not sell, trade, or rent your personal information to third parties. We may share data only when
                required by law or to protect our rights and safety.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">5. Cookies</h2>
              <p className="text-muted-foreground">
                We use minimal cookies for essential functionality only. No tracking cookies or third-party advertising
                cookies are used.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">6. Your Rights</h2>
              <p className="text-muted-foreground">
                You have the right to delete your files at any time using your owner token. For any privacy-related
                requests, contact us at privacy@filedrop.com.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">7. Changes to This Policy</h2>
              <p className="text-muted-foreground">
                We may update this policy from time to time. We will notify users of significant changes by posting a
                notice on our website.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">8. Contact Us</h2>
              <p className="text-muted-foreground">
                If you have questions about this privacy policy, please contact us at privacy@filedrop.com.
              </p>
            </section>
          </div>
        </div>
      </section>
    </main>
  )
}
