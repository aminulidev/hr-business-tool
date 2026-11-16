import type { Metadata } from 'next';
import Link from 'next/link';
import AppShell from '@/components/layout/AppShell';
import NewsletterSignup from '@/components/newsletter/NewsletterSignup';
import { SITE_URL, SITE_NAME } from '@/lib/calculator-meta';
import { TAX_YEAR } from '@/lib/payroll/withholding';

/**
 * Newsletter landing page (rewritten in Phase 18). This page describes only what is actually sent:
 * an occasional email, at most monthly, when US payroll figures or deadlines change. It must not
 * carry subscriber counts, a publishing schedule, or "past issues" that do not exist.
 */

const TITLE = 'Payroll Updates by Email';
const DESCRIPTION =
  'An occasional email, at most one a month, when US payroll rates, thresholds or filing deadlines change, plus new and updated calculators. Free, and you can unsubscribe anytime.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  // Sign-up page with no search value: excluded from search
  robots: { index: false, follow: true },
  alternates: {
    canonical: `${SITE_URL}/newsletter`,
  },
  openGraph: {
    title: `${TITLE} | ${SITE_NAME}`,
    description: DESCRIPTION,
    url: `${SITE_URL}/newsletter`,
    siteName: SITE_NAME,
    type: 'website',
    locale: 'en_US',
    images: [{ url: '/og-image.png', width: 1344, height: 768, alt: `${SITE_NAME} payroll updates` }],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: ['/og-image.png'],
  },
};

const COVERS = [
  {
    title: 'Figures that change',
    body: 'The numbers payroll runs on are revised every year: federal withholding tables and the standard deduction, the Social Security wage base, retirement plan limits, state minimum wages and unemployment wage bases. When one changes, we say what the new figure is and when it takes effect.',
  },
  {
    title: 'Dates to act on',
    body: 'Deadlines that are easy to miss until they pass: W-2 and 1099 filing dates, quarterly payroll tax returns, and state changes that start mid-year.',
  },
  {
    title: 'Calculator changes',
    body: 'When a calculator on this site is updated for new rules, or a new one is published, the email says what changed so you know your saved figures may need a second look.',
  },
  {
    title: 'Corrections',
    body: 'If we find and fix an error in a calculator or an article, subscribers hear about it. See the editorial policy for how corrections are handled.',
  },
];

export default function NewsletterPage() {
  return (
    <AppShell>
      <div className="py-8 sm:py-12 max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-600 mb-4">
            Free · at most one email a month
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight mb-4">{TITLE}</h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            An email when something in US payroll changes: a rate, a threshold, a deadline, or one of our calculators.
            Written for small business owners, HR managers and bookkeepers who run payroll and want to know before it
            affects a paycheck.
          </p>
          <NewsletterSignup variant="banner" className="max-w-2xl mx-auto text-left" />
        </div>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">What the email covers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {COVERS.map((c) => (
              <div key={c.title} className="p-5 rounded-2xl border border-border/60 bg-card/60">
                <h3 className="font-semibold mb-2">{c.title}</h3>
                <p className="text-sm text-muted-foreground">{c.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">How often</h2>
          <p className="text-sm text-muted-foreground">
            When there is something to report, and never more than once a month. Most changes cluster around the end of
            the year, when the IRS and the Social Security Administration publish the next year&apos;s figures and states
            set new minimum wages, so expect more in the fourth quarter and little in mid-year. The calculators on this
            site currently use {TAX_YEAR} figures.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">Who writes it</h2>
          <p className="text-sm text-muted-foreground">
            The {SITE_NAME} Editorial Team, the same people who maintain the calculators. Figures are taken from the
            publishing agency, such as the IRS, the Social Security Administration, the Department of Labor or a state
            revenue department, and linked so you can check them. It is general information, not tax or legal advice. Read
            the <Link href="/editorial-policy" className="text-emerald-600 hover:underline">editorial policy</Link> for how
            we source and review content.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">Privacy and unsubscribing</h2>
          <p className="text-sm text-muted-foreground">
            We use your email address only to send this email. We do not sell, rent or share it. Every email has an
            unsubscribe link, and you can also ask to be removed through the{' '}
            <Link href="/contact" className="text-emerald-600 hover:underline">contact page</Link>. Details are in the{' '}
            <Link href="/privacy-policy" className="text-emerald-600 hover:underline">privacy policy</Link>.
          </p>
        </section>
      </div>
    </AppShell>
  );
}
