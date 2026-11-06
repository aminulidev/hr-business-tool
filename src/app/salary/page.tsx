import type { Metadata } from 'next';
import Link from 'next/link';
import AppShell from '@/components/layout/AppShell';
import { SALARY_TIERS, buildSalaryPageData } from '@/lib/salary-pages';
import { SITE_URL, SITE_NAME } from '@/lib/calculator-meta';
import { TAX_YEAR } from '@/lib/payroll/withholding-2026';
import { ArrowRight, Clock, DollarSign, Landmark, Wallet } from 'lucide-react';

export const metadata: Metadata = {
  title: {
    absolute: `${TAX_YEAR} Hourly Wage & Annual Salary Breakdown Guides ($15/hr to $200k/yr) | QuickBizCalc`,
  },
  description: `Compare ${TAX_YEAR} hourly-to-salary and annual-to-hourly pay breakdowns ($15–$60/hr and $35k–$200k/yr) before and after federal, FICA, and 30-state taxes.`,
  alternates: {
    canonical: `${SITE_URL}/salary`,
  },
  openGraph: {
    title: `${TAX_YEAR} Hourly Wage & Annual Salary Breakdown Guides`,
    description: `Compare ${TAX_YEAR} gross and after-tax pay across 30 hourly wage and annual salary tiers in all 30 US states.`,
    url: `${SITE_URL}/salary`,
    siteName: SITE_NAME,
    type: 'website',
  },
};

const usd = (n: number, decimals = 0) =>
  n.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

export default function SalaryHubPage() {
  const hourlyPages = SALARY_TIERS.filter((t) => t.type === 'hourly').map((t) =>
    buildSalaryPageData(t)
  );
  const annualPages = SALARY_TIERS.filter((t) => t.type === 'annual').map((t) =>
    buildSalaryPageData(t)
  );

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        name: `${TAX_YEAR} Hourly Wage & Annual Salary Breakdown Guides`,
        url: `${SITE_URL}/salary`,
        description: `Complete ${TAX_YEAR} hourly-to-annual and salary-to-hourly conversion tables with 30-state after-tax take-home comparisons.`,
      },
      {
        '@type': 'ItemList',
        itemListElement: SALARY_TIERS.map((t, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: `${t.label} Breakdown (${TAX_YEAR})`,
          url: `${SITE_URL}/salary/${t.slug}`,
        })),
      },
    ],
  };

  return (
    <AppShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-2 text-xs font-medium text-muted-foreground"
        >
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link
            href="/category/salary-compensation"
            className="hover:text-foreground transition-colors"
          >
            Salary &amp; Compensation
          </Link>
          <span>/</span>
          <span className="text-foreground font-semibold">Wage &amp; Salary Guides</span>
        </nav>

        {/* Hero */}
        <header className="rounded-3xl border border-border/70 bg-gradient-to-br from-emerald-500/[0.07] via-background to-teal-500/[0.05] p-6 sm:p-8 shadow-sm space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/25 px-3.5 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
            <DollarSign className="h-3.5 w-3.5" />
            30 Curated {TAX_YEAR} Wage &amp; Salary Tiers · 30 US States Compared
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            {TAX_YEAR} Hourly Wage &amp; Annual Salary Breakdown Guides
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-3xl leading-relaxed">
            Instantly convert any hourly wage ($15/hr to $60/hr) or annual salary ($35,000 to
            $200,000/yr) into weekly, bi-weekly, semi-monthly, and monthly paychecks — with exact{' '}
            {TAX_YEAR} after-tax take-home comparisons across 30 US states and 50/30/20 housing
            budgets.
          </p>
        </header>

        {/* Hourly Wage Table & Cards */}
        <section className="rounded-3xl border border-border/70 bg-card p-6 sm:p-8 shadow-xs space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-foreground flex items-center gap-2">
                <Clock className="h-5 w-5 text-emerald-600" />
                Hourly Wage to Annual Salary Breakdowns ($15/hr – $60/hr)
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Based on a standard 40-hour full-time workweek (2,080 hours/year). Click any hourly
                rate to see all 30 states.
              </p>
            </div>
            <Link
              href="/calculators/wages-calculator"
              className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center gap-1"
            >
              Custom Hourly Wage Calculator <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-border/60">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <th className="py-3.5 px-4">Hourly Rate</th>
                  <th className="py-3.5 px-3 text-right">1.5× Overtime</th>
                  <th className="py-3.5 px-3 text-right">Bi-Weekly Gross</th>
                  <th className="py-3.5 px-3 text-right">Monthly Gross</th>
                  <th className="py-3.5 px-3 text-right">Annual Gross</th>
                  <th className="py-3.5 px-3 text-right">0%-Tax State Net</th>
                  <th className="py-3.5 px-4 text-right">30-State Avg Net</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {hourlyPages.map(({ tier, gross, highlights }) => (
                  <tr key={tier.slug} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4 font-semibold">
                      <Link
                        href={`/salary/${tier.slug}`}
                        className="text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center gap-1"
                      >
                        {tier.label}
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </td>
                    <td className="py-3 px-3 text-right text-muted-foreground">
                      {usd(gross.overtime15x, 2)}/hr
                    </td>
                    <td className="py-3 px-3 text-right">{usd(gross.biWeekly, 2)}</td>
                    <td className="py-3 px-3 text-right">{usd(gross.monthly, 0)}</td>
                    <td className="py-3 px-3 text-right font-bold">{usd(gross.annual)}</td>
                    <td className="py-3 px-3 text-right font-medium text-emerald-600 dark:text-emerald-400">
                      {usd(highlights.txRow.netAnnual)}
                    </td>
                    <td className="py-3 px-4 text-right font-medium">
                      {usd(highlights.avgNetAnnual)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Annual Salary Table & Cards */}
        <section className="rounded-3xl border border-border/70 bg-card p-6 sm:p-8 shadow-xs space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-foreground flex items-center gap-2">
                <Wallet className="h-5 w-5 text-teal-600" />
                Annual Salary to Hourly &amp; Bi-Weekly Breakdowns ($35k – $200k/yr)
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Convert annual salaries to hourly rates, bi-weekly paychecks, and {TAX_YEAR}{' '}
                after-tax take-home pay.
              </p>
            </div>
            <Link
              href="/calculators/salary-converter"
              className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center gap-1"
            >
              Custom Salary Converter <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-border/60">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <th className="py-3.5 px-4">Annual Salary</th>
                  <th className="py-3.5 px-3 text-right">Hourly (40h/wk)</th>
                  <th className="py-3.5 px-3 text-right">Bi-Weekly Gross</th>
                  <th className="py-3.5 px-3 text-right">Monthly Gross</th>
                  <th className="py-3.5 px-3 text-right">0%-Tax State Net</th>
                  <th className="py-3.5 px-4 text-right">30-State Avg Net</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {annualPages.map(({ tier, gross, highlights }) => (
                  <tr key={tier.slug} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4 font-semibold">
                      <Link
                        href={`/salary/${tier.slug}`}
                        className="text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center gap-1"
                      >
                        {tier.label}
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </td>
                    <td className="py-3 px-3 text-right font-bold">{usd(gross.hourly, 2)}/hr</td>
                    <td className="py-3 px-3 text-right">{usd(gross.biWeekly, 2)}</td>
                    <td className="py-3 px-3 text-right">{usd(gross.monthly, 0)}</td>
                    <td className="py-3 px-3 text-right font-medium text-emerald-600 dark:text-emerald-400">
                      {usd(highlights.txRow.netAnnual)}
                    </td>
                    <td className="py-3 px-4 text-right font-medium">
                      {usd(highlights.avgNetAnnual)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </AppShell>
  );
}

