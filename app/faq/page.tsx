import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export const metadata = {
  title: "FAQ - FileDrop",
  description: "Frequently asked questions about FileDrop file sharing service.",
}

const faqs = [
  {
    question: "What is the maximum file size I can upload?",
    answer:
      "Free users can upload files up to 500MB. Pro users can upload up to 2GB, and Enterprise users can upload up to 10GB per file.",
  },
  {
    question: "How long are files stored?",
    answer:
      "You can choose when your files expire: 5 minutes, 10 minutes, 1 hour, 1 day, 7 days, or never (Pro and Enterprise only). Free tier files expire after a maximum of 7 days.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Yes! All files are transmitted over HTTPS with 256-bit encryption. You can also add password protection to your files for an extra layer of security.",
  },
  {
    question: "Can I see who downloaded my files?",
    answer:
      "Yes, you'll receive an owner token when you upload a file. Use this token to access your analytics dashboard where you can see view counts, download counts, and more.",
  },
  {
    question: "What happens if I lose my owner token?",
    answer:
      "Unfortunately, we cannot recover lost owner tokens for security reasons. Make sure to save your token somewhere safe when you upload a file.",
  },
  {
    question: "Can I delete my files before they expire?",
    answer:
      "Yes! Go to the analytics page using your owner token and you'll find a delete button. Once deleted, files cannot be recovered.",
  },
  {
    question: "Do you have an API?",
    answer:
      "API access is available for Enterprise customers. Contact our sales team to learn more about API integration options.",
  },
  {
    question: "What file types are supported?",
    answer:
      "We support all file types including documents, images, videos, audio, archives, and more. There are no restrictions on file formats.",
  },
  {
    question: "Is there a limit on downloads?",
    answer: "There are no limits on how many times your files can be downloaded. Share your links freely!",
  },
  {
    question: "How do I upgrade to Pro?",
    answer:
      "Visit our pricing page and click 'Upgrade to Pro'. You can pay monthly or annually. Cancel anytime with no hidden fees.",
  },
]

export default function FAQPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 py-16 md:py-24 relative">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Frequently Asked <span className="text-primary">Questions</span>
            </h1>
            <p className="text-lg text-muted-foreground">Everything you need to know about FileDrop</p>
          </div>
        </div>
      </section>

      {/* FAQ List */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-card border border-border rounded-xl px-6 data-[state=open]:border-primary/40"
              >
                <AccordionTrigger className="text-left font-medium text-foreground hover:no-underline py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="border-t border-border bg-card/50">
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Still Have Questions?</h2>
          <p className="text-muted-foreground mb-6">Our team is here to help.</p>
          <Button asChild>
            <Link href="/contact">Contact Support</Link>
          </Button>
        </div>
      </section>
    </main>
  )
}
