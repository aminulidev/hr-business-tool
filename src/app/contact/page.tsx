import type { Metadata } from 'next';
import LegalPageLayout from '@/components/layout/LegalPageLayout';
import AppShell from '@/components/layout/AppShell';
import ContactForm from '@/components/layout/ContactForm';
import { CONTACT_EMAIL, SITE_NAME, SITE_URL } from '@/lib/calculator-meta';
import { Mail, Clock, MessageSquare, Globe, MapPin } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Get in touch with QuickBizCalc. Contact us for questions, feedback, bug reports, or partnership inquiries about our free business and HR calculator tools.',
  keywords: [
    'contact QuickBizCalc',
    'QuickBizCalc support',
    'calculator help',
    'QuickBizCalc feedback',
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
    <AppShell>
      <LegalPageLayout title="Contact Us" lastUpdated="April 21, 2026">
        <section className="space-y-12 text-sm leading-relaxed">
          <div className="max-w-3xl">
            <p className="text-base text-foreground/70">
              We value your feedback and are here to help with any questions you may have about our tools. 
              Whether you&apos;ve found a bug, have a suggestion for a new calculator, or want to discuss a 
              business partnership, we&apos;d love to hear from you.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-5">
            {/* Contact Form - Main Area */}
            <div className="lg:col-span-3">
              <ContactForm />
            </div>

            {/* Contact Info - Sidebar Area */}
            <div className="lg:col-span-2 space-y-6">
              <div className="rounded-2xl border border-border/50 bg-card p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Mail className="h-5 w-5 text-emerald-600" />
                  Direct Contact
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                      General & Support
                    </p>
                    <a
                      href={`mailto:${CONTACT_EMAIL}`}
                      className="text-base font-medium text-emerald-600 hover:text-emerald-700 underline underline-offset-4"
                    >
                      {CONTACT_EMAIL}
                    </a>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                      Business & Legal
                    </p>
                    <a
                      href={`mailto:${CONTACT_EMAIL}`}
                      className="text-base font-medium text-emerald-600 hover:text-emerald-700 underline underline-offset-4"
                    >
                      {CONTACT_EMAIL}
                    </a>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-border/50 bg-card p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-gold-600" />
                  Response Time
                </h3>
                <p className="text-muted-foreground mb-4">
                  We aim to respond to all inquiries within <strong className="text-foreground">48 business hours</strong>.
                </p>
                <div className="space-y-2 text-xs border-t border-border/30 pt-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Mon — Fri:</span>
                    <span className="font-medium">9:00 AM — 6:00 PM EST</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sat — Sun:</span>
                    <span className="font-medium text-amber-600">Limited Support</span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-border/50 bg-card p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Globe className="h-5 w-5 text-blue-600" />
                  Location
                </h3>
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">United States</p>
                    <p className="text-xs text-muted-foreground">Remote Operations</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="pt-8 border-t border-border/30">
            <h2 className="text-2xl font-bold text-foreground mb-8 flex items-center gap-3">
              <MessageSquare className="h-6 w-6 text-emerald-600" />
              Frequently Asked Questions
            </h2>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="rounded-xl border border-border/30 bg-muted/10 p-6 hover:bg-muted/20 transition-colors">
                <h3 className="text-base font-semibold text-foreground mb-3">
                  How do I report a calculation error?
                </h3>
                <p className="text-muted-foreground">
                  Please use the contact form or email us with the calculator name and the specific inputs 
                  that produced the unexpected result. Our technical team investigates all reports 
                  within 24-48 hours.
                </p>
              </div>

              <div className="rounded-xl border border-border/30 bg-muted/10 p-6 hover:bg-muted/20 transition-colors">
                <h3 className="text-base font-semibold text-foreground mb-3">
                  Can I request a custom calculator?
                </h3>
                <p className="text-muted-foreground">
                  Absolutely! We are constantly expanding our suite. If you have a specific business 
                  or HR formula you&apos;d like to see automated, please send us your suggestion.
                </p>
              </div>

              <div className="rounded-xl border border-border/30 bg-muted/10 p-6 hover:bg-muted/20 transition-colors">
                <h3 className="text-base font-semibold text-foreground mb-3">
                  Is there a cost to use your tools?
                </h3>
                <p className="text-muted-foreground">
                  No, all calculators on QuickBizCalc are 100% free for both personal and professional 
                  use. We are supported by minimal, non-intrusive advertising.
                </p>
              </div>

              <div className="rounded-xl border border-border/30 bg-muted/10 p-6 hover:bg-muted/20 transition-colors">
                <h3 className="text-base font-semibold text-foreground mb-3">
                  How is my data protected?
                </h3>
                <p className="text-muted-foreground">
                  Your privacy is our priority. All calculations happen entirely in your browser. 
                  We never see, store, or transmit any of the data you enter into our tools.
                </p>
              </div>
            </div>
          </div>
        </section>
      </LegalPageLayout>
    </AppShell>
  );
}
