import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Home,
  ChevronRight,
  ArrowRight,
  LayoutGrid,
  ShieldCheck,
  BookOpen,
  HelpCircle,
  MapPin,
  DollarSign,
} from 'lucide-react';
import AppShell from '@/components/layout/AppShell';
import { SITE_URL, SITE_NAME, type CalculatorMeta } from '@/lib/calculator-meta';
import {
  CATEGORY_HUBS,
  getCategoryHubBySlug,
  getCalculatorsForCategoryHub,
} from '@/lib/category-hubs';
import { HOURLY_TIERS, ANNUAL_TIERS } from '@/lib/salary-pages';

export function generateStaticParams() {
  return CATEGORY_HUBS.map((hub) => ({ slug: hub.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const hub = getCategoryHubBySlug(slug);

  if (!hub) {
    return { title: 'Category Not Found' };
  }

  const url = `${SITE_URL}/category/${hub.slug}`;

  return {
    title: { absolute: hub.metaTitle },
    description: hub.metaDescription,
    alternates: {
      canonical: url,
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: `${hub.metaTitle} | ${SITE_NAME}`,
      description: hub.metaDescription,
      url,
      siteName: SITE_NAME,
      type: 'website',
      locale: 'en_US',
      images: [
        {
          url: `/api/og?title=${encodeURIComponent(hub.title)}&category=${encodeURIComponent(hub.shortTitle)}&subtitle=${encodeURIComponent(hub.heroSubtitle)}`,
          width: 1344,
          height: 768,
          alt: hub.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${hub.metaTitle} | ${SITE_NAME}`,
      description: hub.metaDescription,
      images: [`/api/og?title=${encodeURIComponent(hub.title)}&category=${encodeURIComponent(hub.shortTitle)}&subtitle=${encodeURIComponent(hub.heroSubtitle)}`],
    },
  };
}

function CalculatorCard({ calc, isFeatured = false }: { calc: CalculatorMeta; isFeatured?: boolean }) {
  const Icon = calc.icon;
  return (
    <Link
      href={calc.path}
      className="group block h-full rounded-2xl border border-border/60 bg-card/85 backdrop-blur-sm p-5 sm:p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-emerald-500/8 hover:border-emerald-500/40"
    >
      <div className="flex items-start justify-between mb-3.5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-md shadow-emerald-500/20">
          <Icon className="h-5 w-5 text-white" />
        </div>
        <div className="flex items-center gap-1.5">
          {isFeatured && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/25">
              Popular
            </span>
          )}
          <ArrowRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
        </div>
      </div>
      <h3 className="font-bold text-base mb-1.5 text-foreground group-hover:text-emerald-600 transition-colors">
        {calc.title}
      </h3>
      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
        {calc.shortDescription}
      </p>
    </Link>
  );
}

export default async function CategoryHubPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const hub = getCategoryHubBySlug(slug);

  if (!hub) {
    notFound();
  }

  const tools = getCalculatorsForCategoryHub(slug);
  const HubIcon = hub.icon;
  const featuredSet = new Set(hub.featuredSlugs);

  // For Payroll & Taxes, separate State Hourly Paycheck calculators into their own scannable directory
  const isPayrollHub = hub.slug === 'payroll-taxes';
  const isSalaryHub = hub.slug === 'salary-compensation';
  const statePaycheckTools = isPayrollHub
    ? tools.filter(
        (t) =>
          t.slug.endsWith('-hourly-paycheck-calculator') &&
          t.slug !== 'hourly-paycheck-calculator'
      )
    : [];
  const primaryTools = isPayrollHub
    ? tools.filter(
        (t) =>
          !t.slug.endsWith('-hourly-paycheck-calculator') ||
          t.slug === 'hourly-paycheck-calculator'
      )
    : tools;

  // Sort primary tools so featured tools appear first
  const sortedPrimaryTools = [...primaryTools].sort((a, b) => {
    const aFeat = featuredSet.has(a.slug) ? 0 : 1;
    const bFeat = featuredSet.has(b.slug) ? 0 : 1;
    return aFeat - bFeat;
  });

  const url = `${SITE_URL}/category/${hub.slug}`;

  const collectionJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: hub.title,
    description: hub.metaDescription,
    url,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: tools.length,
      itemListElement: tools.map((tool, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: tool.title,
        description: tool.shortDescription,
        url: `${SITE_URL}${tool.path}`,
      })),
    },
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
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
        name: hub.shortTitle,
        item: url,
      },
    ],
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: hub.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <AppShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="py-6 sm:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center flex-wrap gap-1.5 text-sm text-muted-foreground">
              <li className="flex items-center">
                <Link
                  href="/"
                  className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors"
                >
                  <Home className="h-3.5 w-3.5" />
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50" />
              </li>
              <li className="text-foreground font-semibold" aria-current="page">
                {hub.shortTitle}
              </li>
            </ol>
          </nav>

          {/* Category Hero */}
          <div className="rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 via-card/90 to-gold-500/5 p-6 sm:p-10 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-3 max-w-3xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/25 text-emerald-700 dark:text-emerald-400 text-xs font-semibold">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                  <span>{tools.length} Free 2026 Verified Calculators</span>
                </div>
                <div className="flex items-center gap-3.5">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white shadow-lg shadow-emerald-600/25">
                    <HubIcon className="h-6 w-6" />
                  </div>
                  <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-foreground">
                    {hub.title}
                  </h1>
                </div>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  {hub.heroSubtitle}
                </p>
              </div>

              <Link
                href="/"
                className="self-start md:self-center inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border/70 bg-card hover:bg-muted text-xs sm:text-sm font-semibold text-foreground transition-colors shrink-0"
              >
                <LayoutGrid className="h-4 w-4 text-emerald-600" />
                Browse All 94 Calculators
              </Link>
            </div>

            {/* Category Silo Switcher Dock */}
            <div className="mt-6 pt-5 border-t border-border/50 flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span className="text-xs font-semibold text-muted-foreground mr-1">
                Categories:
              </span>
              {CATEGORY_HUBS.map((item) => {
                const ItemIcon = item.icon;
                const isActive = item.slug === hub.slug;
                return (
                  <Link
                    key={item.slug}
                    href={`/category/${item.slug}`}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/25'
                        : 'bg-background/80 hover:bg-muted text-muted-foreground hover:text-foreground border border-border/60'
                    }`}
                  >
                    <ItemIcon
                      className={`h-3.5 w-3.5 ${
                        isActive ? 'text-white' : 'text-emerald-600 dark:text-emerald-400'
                      }`}
                    />
                    <span>{item.shortTitle}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Primary Calculators Grid */}
          <section className="space-y-5">
            <div className="flex items-center justify-between border-b border-border/50 pb-3">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                  {isPayrollHub
                    ? 'Federal, FICA & Paycheck Calculators'
                    : `All ${hub.shortTitle} Calculators (${sortedPrimaryTools.length})`}
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                  Click any calculator below for instant live results, formulas, and 2026 benchmarks.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {sortedPrimaryTools.map((calc) => (
                <CalculatorCard
                  key={calc.slug}
                  calc={calc}
                  isFeatured={featuredSet.has(calc.slug)}
                />
              ))}
            </div>
          </section>

          {/* Dedicated State Hourly Paycheck Directory (for Payroll & Taxes Hub) */}
          {isPayrollHub && statePaycheckTools.length > 0 && (
            <section className="space-y-5 pt-4">
              <div className="flex items-center gap-3 border-b border-border/50 pb-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                    2026 State Hourly Paycheck Calculators ({statePaycheckTools.length} States)
                  </h2>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    State-specific income tax withholding, minimum wages, overtime rules, and local payroll deductions.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                {statePaycheckTools.map((calc) => (
                  <CalculatorCard key={calc.slug} calc={calc} />
                ))}
              </div>
            </section>
          )}

          {/* Dedicated 30 Wage & Salary Breakdown Guides Directory (for Salary & Compensation and Payroll Hubs) */}
          {(isSalaryHub || isPayrollHub) && (
            <section className="rounded-3xl border border-border/60 bg-card/85 p-6 sm:p-8 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600">
                    <DollarSign className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                      2026 Hourly Wage &amp; Annual Salary Breakdown Guides (30 Tiers)
                    </h2>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Pre-calculated 7-period pay conversions, 30-state after-tax take-home tables, and 50/30/20 budgets.
                    </p>
                  </div>
                </div>
                <Link
                  href="/salary"
                  className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center gap-1"
                >
                  View All 30 Salary Guides <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="space-y-2.5">
                <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Hourly Wage to Annual Salary ($15/hr – $60/hr)
                </div>
                <div className="flex flex-wrap gap-2">
                  {HOURLY_TIERS.map((hr) => (
                    <Link
                      key={hr}
                      href={`/salary/${hr}-an-hour`}
                      className="rounded-xl border border-border/70 bg-background hover:border-emerald-500/50 hover:bg-emerald-500/5 px-3 py-1.5 text-xs font-semibold text-foreground transition-colors"
                    >
                      ${hr}/hr (${((hr * 2080) / 1000).toFixed(1)}k/yr)
                    </Link>
                  ))}
                </div>
              </div>

              <div className="space-y-2.5">
                <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Annual Salary to Hourly &amp; After-Tax Pay ($35k – $200k/yr)
                </div>
                <div className="flex flex-wrap gap-2">
                  {ANNUAL_TIERS.map((yr) => (
                    <Link
                      key={yr}
                      href={`/salary/${yr}-a-year`}
                      className="rounded-xl border border-border/70 bg-background hover:border-emerald-500/50 hover:bg-emerald-500/5 px-3 py-1.5 text-xs font-semibold text-foreground transition-colors"
                    >
                      ${yr / 1000}k/yr (${(yr / 2080).toFixed(2)}/hr)
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* 2026 Reference Benchmark Table */}
          <section className="space-y-4 pt-4">
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                {hub.referenceTable.title}
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {hub.referenceTable.description}
              </p>
            </div>
            <div className="overflow-x-auto rounded-2xl border border-border/60 bg-card/85 shadow-xs">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-border/60 bg-emerald-500/8">
                    {hub.referenceTable.headers.map((header, i) => (
                      <th
                        key={i}
                        className="px-4 py-3.5 font-bold text-foreground whitespace-nowrap"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {hub.referenceTable.rows.map((row, rowIdx) => (
                    <tr
                      key={rowIdx}
                      className="hover:bg-muted/40 transition-colors"
                    >
                      {row.map((cell, cellIdx) => (
                        <td
                          key={cellIdx}
                          className={`px-4 py-3 ${
                            cellIdx === 0
                              ? 'font-semibold text-foreground'
                              : 'text-muted-foreground'
                          }`}
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* In-Depth Guide Sections */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
            {hub.guideSections.map((sec, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-border/60 bg-card/70 p-6 space-y-3"
              >
                <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-emerald-600 shrink-0" />
                  <span>{sec.title}</span>
                </h2>
                <div className="space-y-3 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {sec.paragraphs.map((p, pIdx) => (
                    <p key={pIdx}>{p}</p>
                  ))}
                </div>
              </div>
            ))}
          </section>

          {/* Category FAQs */}
          <section className="space-y-4 pt-2">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-emerald-600" />
              <span>Frequently Asked Questions — {hub.shortTitle}</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
              {hub.faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-border/60 bg-card/80 p-5 space-y-2"
                >
                  <h3 className="font-bold text-sm sm:text-base text-foreground">
                    {faq.question}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </AppShell>
  );
}
