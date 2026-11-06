import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import AppShell from '@/components/layout/AppShell';
import SalaryBreakdownInteractive from '@/components/calculators/SalaryBreakdownInteractive';
import {
  SALARY_TIERS,
  HOURLY_TIERS,
  ANNUAL_TIERS,
  getSalaryTierBySlug,
  buildSalaryPageData,
} from '@/lib/salary-pages';
import { SITE_URL, SITE_NAME } from '@/lib/calculator-meta';
import { TAX_YEAR } from '@/lib/payroll/withholding-2026';
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Calculator,
  CheckCircle2,
  Clock,
  DollarSign,
  Home,
  Landmark,
  MapPin,
  PiggyBank,
  TrendingUp,
  Wallet,
} from 'lucide-react';

interface PageProps {
  params: Promise<{ slug: string }>;
}

const usd = (n: number, decimals = 0) =>
  n.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

export async function generateStaticParams() {
  return SALARY_TIERS.map((tier) => ({ slug: tier.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const tier = getSalaryTierBySlug(slug);
  if (!tier) return {};

  const data = buildSalaryPageData(tier);
  const url = `${SITE_URL}/salary/${tier.slug}`;

  return {
    title: { absolute: data.metaTitle },
    description: data.metaDescription,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: data.metaTitle,
      description: data.metaDescription,
      url,
      siteName: SITE_NAME,
      type: 'article',
      images: [
        {
          url: `/api/og?title=${encodeURIComponent(data.metaTitle)}&category=${encodeURIComponent('2026 Salary & Tax Guide')}&subtitle=${encodeURIComponent(data.metaDescription)}`,
          width: 1200,
          height: 630,
          alt: tier.label,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: data.metaTitle,
      description: data.metaDescription,
      images: [`/api/og?title=${encodeURIComponent(data.metaTitle)}&category=${encodeURIComponent('2026 Salary & Tax Guide')}&subtitle=${encodeURIComponent(data.metaDescription)}`],
    },
  };
}

export default async function SalaryBreakdownPage({ params }: PageProps) {
  const { slug } = await params;
  const tier = getSalaryTierBySlug(slug);
  if (!tier) notFound();

  const data = buildSalaryPageData(tier);
  const { gross, highlights, schedules, stateRows, budget, faqs, prevTier, nextTier } = data;
  const pageUrl = `${SITE_URL}/salary/${tier.slug}`;

  const h1Title =
    tier.type === 'hourly'
      ? `${tier.label} Is How Much a Year? (${TAX_YEAR} Before & After Taxes)`
      : `${tier.label} Is How Much an Hour? (${TAX_YEAR} Paycheck & Tax Breakdown)`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: SITE_URL,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Salary & Compensation',
            item: `${SITE_URL}/category/salary-compensation`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'Wage & Salary Guides',
            item: `${SITE_URL}/salary`,
          },
          {
            '@type': 'ListItem',
            position: 4,
            name: tier.label,
            item: pageUrl,
          },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: faqs.map((f) => ({
          '@type': 'Question',
          name: f.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: f.answer,
          },
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
        {/* Breadcrumb Navigation */}
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
          <Link href="/salary" className="hover:text-foreground transition-colors">
            Salary Breakdowns
          </Link>
          <span>/</span>
          <span className="text-foreground font-semibold">{tier.label}</span>
        </nav>

        {/* Hero Section + Instant Direct Answer */}
        <header className="rounded-3xl border border-border/70 bg-gradient-to-br from-emerald-500/[0.07] via-background to-teal-500/[0.05] p-6 sm:p-8 shadow-sm">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/25 px-3.5 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300 mb-3">
            <CheckCircle2 className="h-3.5 w-3.5" />
            IRS {TAX_YEAR} Federal &amp; 30-State Verified Breakdown
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground mb-3">
            {h1Title}
          </h1>

          <p className="text-sm sm:text-base text-muted-foreground max-w-3xl leading-relaxed mb-6">
            {tier.type === 'hourly' ? (
              <>
                Working full-time (40 hours/week for 52 weeks = 2,080 hours),{' '}
                <strong className="text-foreground">${tier.amount} an hour</strong> equals{' '}
                <strong className="text-emerald-600 dark:text-emerald-400">
                  {usd(gross.annual)} per year
                </strong>{' '}
                before taxes ({usd(gross.monthly, 2)}/month or {usd(gross.biWeekly, 2)} bi-weekly).
                After {TAX_YEAR} federal tax and FICA, you take home{' '}
                <strong className="text-foreground">{usd(highlights.txRow.netAnnual)}/year</strong>{' '}
                in 0%-income-tax states (TX, FL, TN, NV) or an average of{' '}
                <strong className="text-foreground">{usd(highlights.avgNetAnnual)}/year</strong>{' '}
                across all 30 major US states.
              </>
            ) : (
              <>
                A <strong className="text-foreground">{usd(tier.amount)} annual salary</strong>{' '}
                equals{' '}
                <strong className="text-emerald-600 dark:text-emerald-400">
                  {usd(gross.hourly, 2)} per hour
                </strong>{' '}
                based on a standard 40-hour workweek (2,080 hours/year), or{' '}
                <strong className="text-foreground">{usd(gross.biWeekly, 2)} bi-weekly</strong> and{' '}
                <strong className="text-foreground">{usd(gross.monthly, 2)} per month</strong>{' '}
                before taxes. After {TAX_YEAR} federal and FICA taxes, single filers take home{' '}
                <strong className="text-foreground">{usd(highlights.txRow.netAnnual)}/year</strong>{' '}
                in 0%-tax states or an average of{' '}
                <strong className="text-foreground">{usd(highlights.avgNetAnnual)}/year</strong>{' '}
                across 30 US states.
              </>
            )}
          </p>

          {/* 4 Headline KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="rounded-2xl border border-emerald-500/30 bg-background/90 p-4 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground mb-1">
                <DollarSign className="h-4 w-4 text-emerald-600" />
                {tier.type === 'hourly' ? 'Annual Gross (2,080 hrs)' : 'Hourly Wage (40h/wk)'}
              </div>
              <div className="text-xl sm:text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
                {tier.type === 'hourly' ? usd(gross.annual) : `${usd(gross.hourly, 2)}/hr`}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {tier.type === 'hourly'
                  ? `1.5× Overtime: ${usd(gross.overtime15x, 2)}/hr`
                  : `37.5h/wk rate: ${usd(tier.amount / 1950, 2)}/hr`}
              </div>
            </div>

            <div className="rounded-2xl border border-border/70 bg-background/90 p-4 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground mb-1">
                <Wallet className="h-4 w-4 text-teal-600" />
                Bi-Weekly Paycheck (26/yr)
              </div>
              <div className="text-xl sm:text-2xl font-extrabold text-foreground">
                {usd(gross.biWeekly, 2)}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                ~{usd(highlights.avgNetBiWeekly)} after taxes (avg)
              </div>
            </div>

            <div className="rounded-2xl border border-border/70 bg-background/90 p-4 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground mb-1">
                <Clock className="h-4 w-4 text-blue-600" />
                Monthly Pay (12/yr)
              </div>
              <div className="text-xl sm:text-2xl font-extrabold text-foreground">
                {usd(gross.monthly, 0)}/mo
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                ~{usd(highlights.avgNetMonthly)}/mo net take-home
              </div>
            </div>

            <div className="rounded-2xl border border-border/70 bg-background/90 p-4 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground mb-1">
                <Landmark className="h-4 w-4 text-amber-600" />
                {TAX_YEAR} Net Take-Home Range
              </div>
              <div className="text-xl sm:text-2xl font-extrabold text-foreground">
                {usd(highlights.caRow.netAnnual)}–{usd(highlights.txRow.netAnnual)}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                CA/NY/OR vs. 0%-Tax States (TX/FL)
              </div>
            </div>
          </div>
        </header>

        {/* Interactive Customizer */}
        <SalaryBreakdownInteractive initialHourlyRate={gross.hourly} label={tier.label} />

        {/* Table 1: 7-Period Gross Pay Conversion by Weekly Schedule */}
        <section className="rounded-3xl border border-border/70 bg-card p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                {tier.label} Pay Breakdown by Pay Period &amp; Work Schedule
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Compare gross earnings across 7 pay periods for full-time (40 hrs/wk), unpaid time
                off (50 weeks), 37.5-hour schedules, part-time, and overtime.
              </p>
            </div>
            <Link
              href="/calculators/salary-converter"
              className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center gap-1"
            >
              Open Full Salary Converter <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-border/60">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <th className="py-3.5 px-4">Work Schedule</th>
                  <th className="py-3.5 px-3 text-right">Annual Hrs</th>
                  <th className="py-3.5 px-3 text-right">Daily (8h)</th>
                  <th className="py-3.5 px-3 text-right">Weekly (52)</th>
                  <th className="py-3.5 px-3 text-right">Bi-Weekly (26)</th>
                  <th className="py-3.5 px-3 text-right">Semi-Mo (24)</th>
                  <th className="py-3.5 px-3 text-right">Monthly (12)</th>
                  <th className="py-3.5 px-4 text-right">Annual Gross</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {schedules.map((s, i) => (
                  <tr
                    key={s.scheduleLabel}
                    className={
                      i === 0
                        ? 'bg-emerald-500/[0.06] font-semibold'
                        : 'hover:bg-muted/30 transition-colors'
                    }
                  >
                    <td className="py-3 px-4 font-medium text-foreground">{s.scheduleLabel}</td>
                    <td className="py-3 px-3 text-right text-muted-foreground">
                      {s.annualHours.toLocaleString()} hrs
                    </td>
                    <td className="py-3 px-3 text-right">{usd(s.dailyGross, 2)}</td>
                    <td className="py-3 px-3 text-right">{usd(s.weeklyGross, 2)}</td>
                    <td className="py-3 px-3 text-right">{usd(s.biWeeklyGross, 2)}</td>
                    <td className="py-3 px-3 text-right">{usd(s.semiMonthlyGross, 2)}</td>
                    <td className="py-3 px-3 text-right">{usd(s.monthlyGross, 0)}</td>
                    <td className="py-3 px-4 text-right font-bold text-emerald-600 dark:text-emerald-400">
                      {usd(s.annualGross, 0)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Table 2: All 30 US States 2026 After-Tax Take-Home Comparison */}
        <section className="rounded-3xl border border-border/70 bg-card p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                {tier.label} After Taxes in 30 US States ({TAX_YEAR} Take-Home Table)
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Exact {TAX_YEAR} net pay for a Single filer working 40 hours/week ({usd(gross.annual)}{' '}
                gross/year) after Federal Income Tax, Social Security (6.2%), Medicare (1.45%), and
                official state withholding. Click any state to customize allowances and deductions.
              </p>
            </div>
            <Link
              href="/category/payroll-taxes"
              className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center gap-1"
            >
              Browse All 30 State Calculators <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-border/60">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <th className="py-3.5 px-4">State</th>
                  <th className="py-3.5 px-3 text-right">Federal + FICA</th>
                  <th className="py-3.5 px-3 text-right">State / Local Tax</th>
                  <th className="py-3.5 px-3 text-right">Eff. Tax Rate</th>
                  <th className="py-3.5 px-3 text-right">Bi-Weekly Net</th>
                  <th className="py-3.5 px-3 text-right">Monthly Net</th>
                  <th className="py-3.5 px-4 text-right">Annual Take-Home</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {stateRows.map((row) => (
                  <tr key={row.code} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4 font-medium">
                      <Link
                        href={`/calculators/${row.calculatorSlug}`}
                        className="inline-flex items-center gap-1.5 text-foreground hover:text-emerald-600 dark:hover:text-emerald-400 font-semibold transition-colors"
                      >
                        <MapPin className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                        {row.name}
                        {row.hasNoStateIncomeTax && (
                          <span className="ml-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-300">
                            0% State Tax
                          </span>
                        )}
                      </Link>
                    </td>
                    <td className="py-3 px-3 text-right text-muted-foreground">
                      {usd(row.federalAndFicaAnnual)}
                    </td>
                    <td className="py-3 px-3 text-right text-muted-foreground">
                      {row.stateTaxAnnual === 0 ? '$0' : usd(row.stateTaxAnnual)}
                    </td>
                    <td className="py-3 px-3 text-right text-muted-foreground">
                      {row.effectiveRatePct}%
                    </td>
                    <td className="py-3 px-3 text-right font-medium">
                      {usd(row.netBiWeekly, 2)}
                    </td>
                    <td className="py-3 px-3 text-right font-medium">{usd(row.netMonthly, 0)}</td>
                    <td className="py-3 px-4 text-right font-bold text-emerald-600 dark:text-emerald-400">
                      {usd(row.netAnnual)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 3: 50/30/20 Monthly Budget & Rent / Mortgage Affordability */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 rounded-3xl border border-border/70 bg-card p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-600">
                <PiggyBank className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-foreground">
                  50/30/20 Monthly Budget on {tier.label}
                </h2>
                <p className="text-xs text-muted-foreground">
                  Based on {usd(budget.avgNetMonthly)}/month average after-tax take-home pay
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/[0.04] p-4">
                <div className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                  50% Essential Needs
                </div>
                <div className="text-2xl font-extrabold text-foreground mt-1">
                  {usd(budget.needs50)}/mo
                </div>
                <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                  Rent or mortgage, utilities, groceries, transportation, health insurance, and
                  minimum debt payments.
                </p>
              </div>

              <div className="rounded-2xl border border-blue-500/25 bg-blue-500/[0.04] p-4">
                <div className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300">
                  30% Lifestyle Wants
                </div>
                <div className="text-2xl font-extrabold text-foreground mt-1">
                  {usd(budget.wants30)}/mo
                </div>
                <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                  Dining out, hobbies, travel, streaming subscriptions, shopping, and personal
                  upgrades.
                </p>
              </div>

              <div className="rounded-2xl border border-amber-500/25 bg-amber-500/[0.04] p-4">
                <div className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300">
                  20% Savings &amp; Debt
                </div>
                <div className="text-2xl font-extrabold text-foreground mt-1">
                  {usd(budget.savings20)}/mo
                </div>
                <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                  401(k) / Roth IRA contributions ({usd(budget.savings20 * 12)}/yr), emergency fund,
                  and extra principal payments.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 rounded-3xl border border-border/70 bg-card p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-500/15 text-teal-600">
                <Home className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-foreground">
                  Rent &amp; Home Affordability
                </h2>
                <p className="text-xs text-muted-foreground">
                  Standard lender &amp; landlord qualification benchmarks on {usd(gross.annual)}/yr
                </p>
              </div>
            </div>

            <div className="space-y-2.5 text-sm">
              <div className="flex items-center justify-between rounded-xl border border-border/60 bg-muted/20 px-4 py-2.5">
                <span className="text-muted-foreground">Max Rent (30% of Gross Rule)</span>
                <strong className="text-foreground">{usd(budget.maxRent30Gross)}/mo</strong>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-border/60 bg-muted/20 px-4 py-2.5">
                <span className="text-muted-foreground">Conservative Housing (28% Rule)</span>
                <strong className="text-foreground">
                  {usd(budget.conservativeHousing28Gross)}/mo
                </strong>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-border/60 bg-muted/20 px-4 py-2.5">
                <span className="text-muted-foreground">Max Auto Payment (10% of Gross)</span>
                <strong className="text-foreground">
                  {usd(budget.recommendedCarPayment10Gross)}/mo
                </strong>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-emerald-500/25 bg-emerald-500/[0.05] px-4 py-2.5">
                <span className="font-medium text-foreground">Target Home Price (~3.5× Income)</span>
                <strong className="text-emerald-600 dark:text-emerald-400">
                  {usd(budget.estimatedHomePrice35x)}
                </strong>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Frequently Asked Questions */}
        <section className="rounded-3xl border border-border/70 bg-card p-6 sm:p-8 shadow-xs space-y-5">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">
            Frequently Asked Questions About Earning {tier.label}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {faqs.map((f) => (
              <div
                key={f.question}
                className="rounded-2xl border border-border/60 bg-muted/15 p-5 space-y-2"
              >
                <h3 className="text-base font-bold text-foreground">{f.question}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Prev / Next Navigation + Related Calculators */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          {prevTier ? (
            <Link
              href={`/salary/${prevTier.slug}`}
              className="inline-flex items-center gap-2 rounded-2xl border border-border bg-card px-4 py-3 text-sm font-semibold text-foreground hover:border-emerald-500/50 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 text-emerald-600" />
              Previous: {prevTier.label} Breakdown
            </Link>
          ) : (
            <div />
          )}

          {nextTier && (
            <Link
              href={`/salary/${nextTier.slug}`}
              className="inline-flex items-center gap-2 rounded-2xl border border-border bg-card px-4 py-3 text-sm font-semibold text-foreground hover:border-emerald-500/50 transition-colors"
            >
              Next: {nextTier.label} Breakdown
              <ArrowRight className="h-4 w-4 text-emerald-600" />
            </Link>
          )}
        </div>

        {/* All 30 Wage & Salary Tiers Internal Link Directory */}
        <section className="rounded-3xl border border-border/70 bg-card p-6 sm:p-8 shadow-xs space-y-6">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-foreground">
              Explore More {TAX_YEAR} Hourly Wage &amp; Annual Salary Breakdowns
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Compare pre-tax and after-tax pay across all 30 popular hourly wage and annual salary
              tiers.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Hourly Wage Guides ($15/hr – $60/hr)
            </h3>
            <div className="flex flex-wrap gap-2">
              {HOURLY_TIERS.map((hr) => {
                const s = `${hr}-an-hour`;
                const active = s === tier.slug;
                return (
                  <Link
                    key={s}
                    href={`/salary/${s}`}
                    className={`rounded-xl px-3 py-1.5 text-xs font-semibold border transition-colors ${
                      active
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-background hover:bg-muted border-border text-foreground'
                    }`}
                  >
                    ${hr}/hr (${((hr * 2080) / 1000).toFixed(1)}k/yr)
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Annual Salary Guides ($35,000 – $200,000/yr)
            </h3>
            <div className="flex flex-wrap gap-2">
              {ANNUAL_TIERS.map((yr) => {
                const s = `${yr}-a-year`;
                const active = s === tier.slug;
                return (
                  <Link
                    key={s}
                    href={`/salary/${s}`}
                    className={`rounded-xl px-3 py-1.5 text-xs font-semibold border transition-colors ${
                      active
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-background hover:bg-muted border-border text-foreground'
                    }`}
                  >
                    ${yr / 1000}k/yr (${(yr / 2080).toFixed(2)}/hr)
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}

