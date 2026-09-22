import type { Metadata } from 'next';
import Link from 'next/link';
import AppShell from '@/components/layout/AppShell';
import NewsletterSignup from '@/components/newsletter/NewsletterSignup';
import { SITE_URL, SITE_NAME } from '@/lib/calculator-meta';

export const metadata: Metadata = {
  title: 'Free Weekly Payroll Tips Newsletter — Payroll Tip Tuesday',
  description:
    'Get one actionable payroll tip every Tuesday. Free newsletter for small business owners, HR managers, and accountants. Topics: overtime compliance, bonus tax, retirement plans, state tax changes. No spam, unsubscribe anytime.',
  keywords: [
    'payroll newsletter',
    'HR newsletter',
    'payroll tips',
    'small business payroll',
    'overtime compliance tips',
    'tax withholding newsletter',
    'HR tips weekly',
    'payroll Tip Tuesday',
    'free payroll newsletter',
    'business finance newsletter',
  ],
  alternates: {
    canonical: `${SITE_URL}/newsletter`,
  },
  openGraph: {
    title: 'Free Weekly Payroll Tips Newsletter — Payroll Tip Tuesday',
    description:
      'One actionable payroll tip every Tuesday. Free for small business owners and HR managers. No spam.',
    url: `${SITE_URL}/newsletter`,
    siteName: SITE_NAME,
    type: 'website',
    locale: 'en_US',
    images: [{ url: '/og-image.png', width: 1344, height: 768, alt: 'Payroll Tip Tuesday Newsletter' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Weekly Payroll Tips Newsletter',
    description: 'One actionable payroll tip every Tuesday. Free. No spam.',
    images: ['/og-image.png'],
  },
};

// JSON-LD structured data for the newsletter
const newsletterJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Newsletter',
  name: 'Payroll Tip Tuesday',
  description:
    'Weekly newsletter delivering one actionable payroll tip every Tuesday for small business owners, HR managers, and accountants.',
  publisher: {
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
  },
  url: `${SITE_URL}/newsletter`,
  inLanguage: 'en-US',
  frequency: 'Weekly',
  about: [
    'Payroll taxes',
    'Overtime compliance',
    'Bonus tax strategy',
    'Retirement plan administration',
    'State tax changes',
    'HR metrics',
  ],
};

export default function NewsletterPage() {
  return (
    <AppShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(newsletterJsonLd) }}
      />
      <div className="py-8 sm:py-12 max-w-4xl mx-auto px-4 sm:px-6">
        {/* Hero */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-600 mb-4">
            📬 Free Weekly Newsletter
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight mb-4">
            Payroll Tip Tuesday
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            One actionable payroll tip every Tuesday morning. Built for small business owners,
            HR managers, and accountants who need to stay compliant without drowning in jargon.
          </p>
          <NewsletterSignup variant="banner" className="max-w-2xl mx-auto" />
        </div>

        {/* What You'll Get */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">What you&apos;ll get</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl border border-border/60 bg-card/60">
              <h3 className="font-semibold mb-2">📋 Compliance updates</h3>
              <p className="text-sm text-muted-foreground">
                State and federal tax changes that affect your payroll — explained in plain English,
                not IRS publications. We track changes to FLSA, IRS Pub 15-T, state wage bases,
                and overtime rules.
              </p>
            </div>
            <div className="p-5 rounded-2xl border border-border/60 bg-card/60">
              <h3 className="font-semibold mb-2">💡 Calculation tips</h3>
              <p className="text-sm text-muted-foreground">
                Step-by-step walkthroughs of complex calculations: bonus tax withholding,
                California daily overtime, 401(k) match optimization, severance pay formulas,
                and workers comp premium calculations.
              </p>
            </div>
            <div className="p-5 rounded-2xl border border-border/60 bg-card/60">
              <h3 className="font-semibold mb-2">⚠️ Common mistakes</h3>
              <p className="text-sm text-muted-foreground">
                Real-world compliance errors we&apos;ve seen — and how to avoid them. Misclassifying
                contractors, forgetting bonus-adjusted overtime, miscalculating pro-rata salary
                for mid-year hires, and more.
              </p>
            </div>
            <div className="p-5 rounded-2xl border border-border/60 bg-card/60">
              <h3 className="font-semibold mb-2">🧮 New calculator alerts</h3>
              <p className="text-sm text-muted-foreground">
                Be the first to know when we launch a new calculator. We&apos;re shipping new tools
                monthly — PTO accrual, 1099 vs W-2 comparison, break-even analysis, cash-flow
                forecasting, and Social Security estimation are all coming soon.
              </p>
            </div>
          </div>
        </section>

        {/* Sample tips */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">Sample tips you&apos;ll receive</h2>
          <div className="space-y-4">
            <article className="p-5 rounded-2xl border-l-4 border-l-emerald-500 bg-emerald-500/5">
              <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wide mb-1">
                Week of Sept 15, 2026
              </p>
              <h3 className="font-semibold mb-2">
                The 2026 Social Security wage base is $176,100 — here&apos;s what changes for high earners
              </h3>
              <p className="text-sm text-muted-foreground">
                Employees earning over $176,100 stop paying Social Security tax mid-year.
                Their paychecks suddenly look bigger — but the FICA deduction returns in January.
                Learn how to communicate this to your high-earning team and avoid &quot;why did my
                paycheck change?&quot; questions.
              </p>
            </article>
            <article className="p-5 rounded-2xl border-l-4 border-l-blue-500 bg-blue-500/5">
              <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1">
                Week of Sept 22, 2026
              </p>
              <h3 className="font-semibold mb-2">
                Bonus tax withholding: why the 22% flat rate can cause a tax bill in April
              </h3>
              <p className="text-sm text-muted-foreground">
                The federal supplemental withholding rate of 22% on bonuses sounds simple — but
                if your employee&apos;s marginal tax rate is 24% or 32%, they&apos;ll owe additional tax
                at year-end. Here&apos;s how to estimate the shortfall and how to communicate it
                during bonus season.
              </p>
            </article>
            <article className="p-5 rounded-2xl border-l-4 border-l-purple-500 bg-purple-500/5">
              <p className="text-xs font-semibold text-purple-600 uppercase tracking-wide mb-1">
                Week of Sept 29, 2026
              </p>
              <h3 className="font-semibold mb-2">
                California 7th-consecutive-day overtime: the rule most employers miss
              </h3>
              <p className="text-sm text-muted-foreground">
                California requires overtime on the 7th consecutive day of work in a workweek —
                even if the employee works only 1 hour that day. The first 8 hours are paid at 1.5x,
                and any hours over 8 are paid at double time. We walk through a real schedule and
                the surprising payroll cost.
              </p>
            </article>
          </div>
        </section>

        {/* Who it's for */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">Who this newsletter is for</h2>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex gap-3">
              <span className="size-5 rounded-full bg-emerald-500/20 text-emerald-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">✓</span>
              <div>
                <strong className="text-foreground">Small business owners</strong> running payroll for 1-50 employees
                who want to handle compliance without an HR department.
              </div>
            </li>
            <li className="flex gap-3">
              <span className="size-5 rounded-full bg-emerald-500/20 text-emerald-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">✓</span>
              <div>
                <strong className="text-foreground">HR managers</strong> at growing companies who need to stay current
                on FLSA, IRS, and state labor law changes.
              </div>
            </li>
            <li className="flex gap-3">
              <span className="size-5 rounded-full bg-emerald-500/20 text-emerald-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">✓</span>
              <div>
                <strong className="text-foreground">Accountants and bookkeepers</strong> serving small business clients
                who want a quick weekly reference for payroll questions.
              </div>
            </li>
            <li className="flex gap-3">
              <span className="size-5 rounded-full bg-emerald-500/20 text-emerald-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">✓</span>
              <div>
                <strong className="text-foreground">Payroll administrators</strong> at mid-size companies who handle
                day-to-day payroll and want to avoid costly compliance errors.
              </div>
            </li>
          </ul>
        </section>

        {/* Schedule */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">Newsletter schedule</h2>
          <p className="text-sm text-muted-foreground mb-4">
            We publish every Tuesday at 7:00 AM ET. Each issue is short (3-5 minute read) and ends
            with a relevant calculator you can use immediately.
          </p>
          <div className="rounded-2xl border border-border/60 bg-card/60 p-5">
            <h3 className="font-semibold mb-3 text-sm">Upcoming topics (next 8 weeks)</h3>
            <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
              <li>2026 Social Security wage base — what changes for high earners</li>
              <li>Bonus tax withholding — the 22% flat rate vs. marginal rate gap</li>
              <li>California 7th-consecutive-day overtime — the rule most employers miss</li>
              <li>401(k) match optimization — getting the full employer contribution</li>
              <li>Worker classification — the ABC test for contractors vs. employees</li>
              <li>Severance pay calculation — weeks of service × state rules</li>
              <li>HSA vs. FSA — which is better for your employees?</li>
              <li>Year-end payroll checklist — what to verify before December 31</li>
            </ol>
          </div>
        </section>

        {/* Privacy */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">Privacy &amp; unsubscribe</h2>
          <p className="text-sm text-muted-foreground">
            We will never sell, rent, or share your email address. Every email includes a one-click
            unsubscribe link at the bottom. We use industry-standard email practices and comply with
            CAN-SPAM and GDPR. Read our full <Link href="/privacy-policy" className="text-emerald-600 hover:underline">privacy policy</Link>.
          </p>
        </section>

        {/* Final CTA */}
        <div className="text-center pt-6 border-t">
          <h2 className="text-2xl font-bold mb-3">Ready to subscribe?</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Join 2,000+ small business owners and HR managers. First tip arrives next Tuesday.
          </p>
          <NewsletterSignup variant="banner" className="max-w-2xl mx-auto" />
        </div>
      </div>
    </AppShell>
  );
}
