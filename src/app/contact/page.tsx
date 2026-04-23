import type { Metadata } from 'next';
import LegalPageLayout from '@/components/layout/LegalPageLayout';
import { SITE_NAME, SITE_URL } from '@/lib/calculator-meta';
import { Mail, Clock, MessageSquare, Globe } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Get in touch with CalcHub. Contact us for questions, feedback, bug reports, or partnership inquiries about our free business and HR calculator tools.',
  keywords: [
    'contact CalcHub',
    'CalcHub support',
    'calculator help',
    'CalcHub feedback',
  ],
  openGraph: {
    title: `Contact Us | ${SITE_NAME}`,
    description: `Get in touch with ${SITE_NAME} for questions, feedback, or support.`,
    url: `${SITE_URL}/contact`,
    type: 'website',
  },
  alternates: {
    canonical: `${SITE_URL}/contact`,
  },
};

export default function ContactPage() {
  return (
    <LegalPageLayout title="Contact Us" lastUpdated="April 21, 2026">
      <section className="space-y-6 text-sm leading-relaxed text-foreground/80">
        <p>
          We would love to hear from you. Whether you have a question about one of our calculators,
          want to report a bug, have a suggestion for a new tool, or are interested in partnering
          with CalcHub, please do not hesitate to reach out. We aim to respond to all inquiries
          within 48 business hours.
        </p>

        <div className="grid gap-6 sm:grid-cols-2 mt-8">
          {/* Email */}
          <div className="rounded-xl border border-border/50 bg-card p-6 space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
                <Mail className="h-5 w-5 text-emerald-600" />
              </div>
              <h3 className="text-base font-semibold text-foreground">Email Us</h3>
            </div>
            <p className="text-muted-foreground text-xs">
              For general questions, feedback, and support:
            </p>
            <a
              href="mailto:hello@calchub.com"
              className="text-emerald-600 hover:text-emerald-700 font-medium underline underline-offset-2"
            >
              hello@calchub.com
            </a>
            <div className="border-t border-border/30 pt-3 mt-3">
              <p className="text-muted-foreground text-xs">
                For privacy-related inquiries:
              </p>
              <a
                href="mailto:privacy@calchub.com"
                className="text-emerald-600 hover:text-emerald-700 font-medium underline underline-offset-2"
              >
                privacy@calchub.com
              </a>
            </div>
            <div className="border-t border-border/30 pt-3">
              <p className="text-muted-foreground text-xs">
                For legal and partnership inquiries:
              </p>
              <a
                href="mailto:legal@calchub.com"
                className="text-emerald-600 hover:text-emerald-700 font-medium underline underline-offset-2"
              >
                legal@calchub.com
              </a>
            </div>
          </div>

          {/* Response Time */}
          <div className="rounded-xl border border-border/50 bg-card p-6 space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold-500/10">
                <Clock className="h-5 w-5 text-gold-600" />
              </div>
              <h3 className="text-base font-semibold text-foreground">Response Time</h3>
            </div>
            <p className="text-muted-foreground">
              We aim to respond to all inquiries within <strong className="text-foreground">48 business hours</strong>.
              During weekends and holidays, response times may be slightly longer.
            </p>
            <div className="pt-2 space-y-2 text-xs text-muted-foreground">
              <p><strong className="text-foreground">Business Hours:</strong> Monday &ndash; Friday, 9:00 AM &ndash; 6:00 PM (EST)</p>
              <p><strong className="text-foreground">Weekend Support:</strong> Limited availability</p>
            </div>
          </div>

          {/* Feedback */}
          <div className="rounded-xl border border-border/50 bg-card p-6 space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
                <MessageSquare className="h-5 w-5 text-emerald-600" />
              </div>
              <h3 className="text-base font-semibold text-foreground">Feedback &amp; Suggestions</h3>
            </div>
            <p className="text-muted-foreground">
              Your feedback helps us improve. Let us know if you have ideas for new calculators,
              find any calculation errors, or have suggestions for improving the user experience.
            </p>
            <p className="text-muted-foreground text-xs">
              Please include as much detail as possible in your message, such as the calculator
              name, the values you entered, the expected result, and the actual result you received.
            </p>
          </div>

          {/* Website */}
          <div className="rounded-xl border border-border/50 bg-card p-6 space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold-500/10">
                <Globe className="h-5 w-5 text-gold-600" />
              </div>
              <h3 className="text-base font-semibold text-foreground">Online</h3>
            </div>
            <p className="text-muted-foreground">
              You can also find us online:
            </p>
            <div className="space-y-2 text-xs">
              <p>
                <strong className="text-foreground">Website:</strong>{' '}
                <a
                  href={SITE_URL}
                  className="text-emerald-600 hover:text-emerald-700 underline underline-offset-2"
                >
                  {SITE_URL}
                </a>
              </p>
              <p>
                <strong className="text-foreground">Location:</strong> United States
              </p>
            </div>
          </div>
        </div>

        <h2 className="text-xl font-semibold text-foreground pt-6">Frequently Asked Questions</h2>

        <div className="space-y-4 mt-4">
          <div className="rounded-xl border border-border/50 bg-muted/20 p-5">
            <h3 className="text-sm font-semibold text-foreground mb-2">
              I found an error in one of the calculators. How do I report it?
            </h3>
            <p>
              Please email us at{' '}
              <a
                href="mailto:hello@calchub.com"
                className="text-emerald-600 hover:text-emerald-700 underline underline-offset-2"
              >
                hello@calchub.com
              </a>{' '}
              with the calculator name, the input values you used, the result you received, and the
              result you expected. Screenshots are very helpful. We will investigate and fix any
              confirmed errors as quickly as possible.
            </p>
          </div>

          <div className="rounded-xl border border-border/50 bg-muted/20 p-5">
            <h3 className="text-sm font-semibold text-foreground mb-2">
              Can I suggest a new calculator?
            </h3>
            <p>
              We are always looking to expand our tool suite. If you have an idea for a calculator
              that would be useful for small business or HR professionals, please send your suggestion
              to{' '}
              <a
                href="mailto:hello@calchub.com"
                className="text-emerald-600 hover:text-emerald-700 underline underline-offset-2"
              >
                hello@calchub.com
              </a>
              . We evaluate all suggestions based on demand and feasibility.
            </p>
          </div>

          <div className="rounded-xl border border-border/50 bg-muted/20 p-5">
            <h3 className="text-sm font-semibold text-foreground mb-2">
              I am interested in advertising or partnering with CalcHub. Who should I contact?
            </h3>
            <p>
              For business development, advertising, and partnership inquiries, please email us at{' '}
              <a
                href="mailto:legal@calchub.com"
                className="text-emerald-600 hover:text-emerald-700 underline underline-offset-2"
              >
                legal@calchub.com
              </a>{' '}
              with details about your proposal. We will review and respond to serious inquiries.
            </p>
          </div>
        </div>
      </section>
    </LegalPageLayout>
  );
}
