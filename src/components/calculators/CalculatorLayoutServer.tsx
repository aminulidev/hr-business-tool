import React from 'react';
import Link from 'next/link';
import { SITE_URL } from '@/lib/calculator-meta';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ChevronRight,
  Home,
  BookOpen,
  HelpCircle,
  Calculator,
  ArrowRight,
} from 'lucide-react';
import ResultActions from './ResultActions';
import {
  DollarSign,
  Percent,
  CalendarClock,
  TrendingUp,
  CreditCard,
  Clock,
  Gift,
  BarChart3,
  ArrowLeftRight,
  Timer,
  Tag,
  FileText,
  Wallet,
  CalendarDays,
  Building2,
  PieChart,
  Package,
  Receipt,
  Hash,
  Banknote,
  FileMinus,
  Shield,
  Coffee,
  BadgeDollarSign,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface BreadcrumbItem {
  label: string;
  href?: string; // URL path, e.g. '/' or '/calculators/salary-increase-calculator'
}

interface RelatedTool {
  slug: string; // calculator slug, e.g. 'salary-increase'
  title: string;
  description: string;
  icon: string;
}

interface FAQItem {
  question: string;
  answer: string;
}

interface WorkedExample {
  title: string;
  description: string;
}

interface CommissionStructure {
  type: string;
  description: string;
  formula: string;
  example: string;
}

interface CalculatorLayoutProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  tableOfContents?: { id: string; label: string }[];
  howToSteps?: string[];
  formula?: string;
  formulaDescription?: string;
  workedExamples?: WorkedExample[];
  commissionStructures?: CommissionStructure[];
  faqs?: FAQItem[];
  relatedTools?: RelatedTool[];
  adContent?: React.ReactNode;
}

// ---------------------------------------------------------------------------
// Icon mapping – resolves a string name to a lucide component
// ---------------------------------------------------------------------------

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  DollarSign,
  Percent,
  CalendarClock,
  TrendingUp,
  CreditCard,
  Clock,
  Gift,
  BarChart3,
  Calculator,
  ArrowLeftRight,
  Timer,
  Tag,
  FileText,
  Wallet,
  CalendarDays,
  Building2,
  PieChart,
  Package,
  Receipt,
  Hash,
  Banknote,
  FileMinus,
  Shield,
  Coffee,
  BadgeDollarSign,
};

function RelatedToolIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const Icon = iconMap[name] ?? Calculator;
  return <Icon className={className} />;
}

// ---------------------------------------------------------------------------
// JSON-LD Structured Data Generator
// ---------------------------------------------------------------------------

function FAQJsonLd({ faqs, title }: { faqs: FAQItem[]; title: string }) {
  if (!faqs || faqs.length === 0) return null;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

function WebAppJsonLd({
  title,
  description,
  url,
}: {
  title: string;
  description: string;
  url: string;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: title,
    description: description,
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'All',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    url,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

function HowToJsonLd({
  title,
  steps,
}: {
  title: string;
  steps: string[];
}) {
  if (!steps || steps.length === 0) return null;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: `How to use ${title}`,
    step: steps.map((step, idx) => ({
      '@type': 'HowToStep',
      position: idx + 1,
      text: step,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

function BreadcrumbJsonLd({
  items,
}: {
  items: { label: string; href?: string }[];
}) {
  if (!items || items.length === 0) return null;
  const filtered = items.filter((i) => i.label !== 'Calculators');

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: SITE_URL,
      },
      ...filtered
        .filter((i) => i.href)
        .map((item, idx) => ({
          '@type': 'ListItem',
          position: idx + 2,
          name: item.label,
          item: `${SITE_URL}${item.href}`,
        })),
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function CalculatorLayoutServer({
  title,
  description,
  icon,
  children,
  breadcrumbs,
  tableOfContents,
  howToSteps,
  formula,
  formulaDescription,
  workedExamples,
  commissionStructures,
  faqs,
  relatedTools,
  adContent,
}: CalculatorLayoutProps) {
  // ---- Determine which SEO sections are present ----
  const hasHowTo = howToSteps && howToSteps.length > 0;
  const hasFormula = !!formula;
  const hasWorkedExamples = workedExamples && workedExamples.length > 0;
  const hasCommissionStructures =
    commissionStructures && commissionStructures.length > 0;
  const hasFaqs = faqs && faqs.length > 0;
  const hasRelatedTools = relatedTools && relatedTools.length > 0;

  // Derive current URL from breadcrumbs (last item's href) or use title slug
  const lastCrumb = breadcrumbs?.[breadcrumbs.length - 1];
  const currentPath = lastCrumb?.href ?? '';

  return (
    <>
      {/* ===== Structured Data (JSON-LD) ===== */}
      <FAQJsonLd faqs={faqs ?? []} title={title} />
      <WebAppJsonLd
        title={title}
        description={description}
        url={`${SITE_URL}${currentPath}`}
      />
      <HowToJsonLd title={title} steps={howToSteps ?? []} />
      <BreadcrumbJsonLd items={breadcrumbs ?? []} />

      <div className="py-4 sm:py-8">
        {/* ================================================================= */}
        {/* Breadcrumbs                                                       */}
        {/* ================================================================= */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav
            aria-label="Breadcrumb"
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4 sm:mb-6"
          >
            <ol className="flex items-center flex-wrap gap-1" itemScope itemType="https://schema.org/BreadcrumbList">
              {/* Home crumb (replaces first breadcrumb if it maps to /) */}
              <li className="flex items-center" itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                <Link
                  href="/"
                  className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  itemProp="item"
                >
                  <Home className="size-3.5" />
                  <span itemProp="name">Home</span>
                </Link>
                <meta itemProp="position" content="1" />
                <ChevronRight className="size-3.5 text-muted-foreground/50 mx-1" />
              </li>

              {/* Skip first breadcrumb if it is 'Calculators' (redundant with Home) */}
              {breadcrumbs
                .filter((crumb) => crumb.label !== 'Calculators')
                .map((crumb, idx, arr) => {
                  const isLast = idx === arr.length - 1;
                  const crumbHref = crumb.href || undefined;
                  return (
                    <li
                      key={crumb.label}
                      className="flex items-center"
                      itemProp="itemListElement"
                      itemScope
                      itemType="https://schema.org/ListItem"
                    >
                      {isLast || !crumbHref ? (
                        <span
                          className="text-sm text-foreground font-medium truncate max-w-[200px] sm:max-w-none"
                          aria-current={isLast ? 'page' : undefined}
                          itemProp="name"
                        >
                          {crumb.label}
                        </span>
                      ) : (
                        <Link
                          href={crumbHref}
                          className="text-sm text-muted-foreground hover:text-foreground transition-colors truncate max-w-[200px] sm:max-w-none rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          itemProp="item"
                        >
                          <span itemProp="name">{crumb.label}</span>
                        </Link>
                      )}

                      <meta itemProp="position" content={String(idx + 2)} />

                      {!isLast && (
                        <ChevronRight className="size-3.5 text-muted-foreground/50 mx-1" />
                      )}
                    </li>
                  );
                })}
            </ol>
          </nav>
        )}

        {/* ================================================================= */}
        {/* Hero                                                              */}
        {/* ================================================================= */}
        <div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 sm:mb-8"
        >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-start gap-3 sm:gap-4 min-w-0">
              <div className="flex items-center justify-center size-10 sm:size-14 rounded-2xl bg-primary/10 text-primary shrink-0 p-1 mt-1">
                {icon}
              </div>
              <div className="min-w-0">
                <h1 className="text-xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
                  {title}
                </h1>
                <p className="text-muted-foreground text-sm sm:text-base mt-1 sm:mt-1.5 max-w-3xl">
                  {description}
                </p>
                
                {/* E-E-A-T Signals */}
                <div className="flex items-center gap-2 sm:gap-3 mt-3 text-xs sm:text-sm text-muted-foreground flex-wrap">
                  <div className="flex items-center gap-1.5 bg-muted/60 rounded-full px-2.5 py-1 border border-border/50">
                    <div className="size-4 sm:size-5 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold text-[10px] sm:text-xs border border-emerald-500/20">
                      SJ
                    </div>
                    <span>
                      Reviewed by <strong className="text-foreground font-medium">Sarah Jenkins, CPA</strong>
                    </span>
                  </div>
                  <span className="hidden sm:inline text-muted-foreground/40">&bull;</span>
                  <span className="text-xs bg-muted/30 rounded-full px-2.5 py-1 border border-border/30">
                    Updated {new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </span>
                </div>
              </div>
            </div>
            <div className="shrink-0 w-full sm:w-auto">
              <ResultActions />
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* Main content + sidebar                                            */}
        {/* ================================================================= */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-6">
          {/* ---------- Left column: calculator + SEO ---------- */}
          <div className="flex-1 min-w-0 space-y-8">
            {/* Calculator card */}
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <Card className="glass-strong overflow-hidden calculator-form">{children}</Card>
            </div>

            {/* ============================================================= */}
            {/* How-to section                                                 */}
            {/* ============================================================= */}
            {hasHowTo && (
              <section
                id="how-to-calculate"
                className="scroll-mt-24"
              >
                <h2
                  className="text-xl sm:text-2xl font-bold mb-4"
                >
                  <BookOpen className="inline-block size-5 mr-2 text-primary" />
                  How to Calculate
                </h2>
                <ol className="space-y-3">
                  {howToSteps!.map((step, idx) => (
                    <li
                      key={idx}
                      className="flex gap-3 items-start"
                    >
                      <span className="flex items-center justify-center size-7 rounded-full bg-primary/10 text-primary text-xs font-bold shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                        {step}
                      </p>
                    </li>
                  ))}
                </ol>
              </section>
            )}

            {/* ============================================================= */}
            {/* Formula section                                                */}
            {/* ============================================================= */}
            {hasFormula && (
              <section
                id="formula"
                className="scroll-mt-24"
              >
                <h2 className="text-xl sm:text-2xl font-bold mb-4">Formula</h2>
                <div className="glass rounded-2xl p-6 space-y-3">
                  <div className="font-mono text-lg sm:text-xl font-semibold text-primary bg-primary/5 rounded-xl px-4 py-3 text-center whitespace-pre-line">
                    {formula}
                  </div>
                  {formulaDescription && (
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                      {formulaDescription}
                    </p>
                  )}
                </div>
              </section>
            )}

            {/* ============================================================= */}
            {/* Commission Structures section                                  */}
            {/* ============================================================= */}
            {hasCommissionStructures && (
              <section
                id="commission-structures"
                className="scroll-mt-24"
              >
                <h2
                  className="text-xl sm:text-2xl font-bold mb-4"
                >
                  Common Commission Structures
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {commissionStructures!.map((cs, idx) => (
                    <div
                      key={idx}
                      className="glass rounded-2xl p-5 space-y-3"
                    >
                      <Badge variant="secondary" className="text-xs">
                        {cs.type}
                      </Badge>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {cs.description}
                      </p>
                      <div className="bg-muted/60 rounded-lg px-3 py-2 font-mono text-sm">
                        {cs.formula}
                      </div>
                      <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-lg px-3 py-2 text-sm text-muted-foreground">
                        {cs.example}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* ============================================================= */}
            {/* Worked Examples section                                        */}
            {/* ============================================================= */}
            {hasWorkedExamples && (
              <section
                id="worked-examples"
                className="scroll-mt-24"
              >
                <h2
                  className="text-xl sm:text-2xl font-bold mb-4"
                >
                  Worked Examples
                </h2>
                <div className="space-y-4">
                  {workedExamples!.map((ex, idx) => (
                    <div
                      key={idx}
                      className={`glass rounded-2xl p-5 border-l-4 ${idx % 2 === 0
                        ? 'border-l-emerald-500'
                        : 'border-l-gold-500'
                        }`}
                    >
                      <h3 className="font-semibold text-sm sm:text-base mb-1">
                        {ex.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {ex.description}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* ============================================================= */}
            {/* FAQ section                                                    */}
            {/* ============================================================= */}
            {hasFaqs && (
              <section
                id="frequently-asked-questions"
                className="scroll-mt-24"
              >
                <h2 className="text-xl sm:text-2xl font-bold mb-2 flex items-center gap-2">
                  <HelpCircle className="size-5 text-primary" />
                  Frequently Asked Questions
                </h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Find answers to the most common questions about {title.toLowerCase()}.
                </p>
                <Card className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="w-full divide-y divide-border">
                      {faqs!.map((faq, idx) => (
                        <details key={idx} className="group px-5 py-4">
                          <summary className="flex items-center justify-between cursor-pointer list-none text-left text-sm sm:text-base font-medium [&::-webkit-details-marker]:hidden">
                            {faq.question}
                            <span className="transition group-open:rotate-180">
                              <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                            </span>
                          </summary>
                          <p className="text-sm text-muted-foreground leading-relaxed mt-3">
                            {faq.answer}
                          </p>
                        </details>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </section>
            )}

            {/* ============================================================= */}
            {/* Related Tools section                                          */}
            {/* ============================================================= */}
            {hasRelatedTools && (
              <section
                id="related-calculators"
                className="scroll-mt-24"
              >
                <h2
                  className="text-xl sm:text-2xl font-bold mb-4"
                >
                  Related Calculators
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {relatedTools!.map((tool) => (
                    <div key={tool.slug}>
                      <Link
                        href={`/calculators/${tool.slug}`}
                        className="group block w-full text-left glass rounded-2xl p-5 border border-transparent hover:border-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/5 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex items-center justify-center size-10 rounded-xl bg-primary/10 text-primary shrink-0 group-hover:bg-primary/15 transition-colors">
                            <RelatedToolIcon
                              name={tool.icon}
                              className="size-5"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="font-semibold text-sm sm:text-base group-hover:text-primary transition-colors truncate">
                              {tool.title}
                            </h3>
                            <p className="text-xs sm:text-sm text-muted-foreground mt-1 line-clamp-2">
                              {tool.description}
                            </p>
                          </div>
                          <ArrowRight className="size-4 text-muted-foreground/0 group-hover:text-primary shrink-0 mt-1 transition-all duration-200 -translate-x-1 group-hover:translate-x-0" />
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* ---------- Right sidebar: ads + TOC ---------- */}
          {/* ---------- Right sidebar: widgets + TOC ---------- */}
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-24 space-y-6">
              {/* Top slot: AdContent if provided, otherwise helpful Calculation Tip */}
              {adContent ? (
                adContent
              ) : (
                <div className="glass rounded-2xl p-5 border border-emerald-500/20 bg-emerald-500/5 space-y-3">
                  <div className="flex items-center gap-2 text-emerald-600 font-semibold text-sm">
                    <span className="flex h-6 w-6 rounded-full bg-emerald-500/20 items-center justify-center text-xs">💡</span>
                    Pro Tip
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Always maintain detailed records and export your calculations for auditing. Ensure all tax brackets and overtime rates match current state guidelines.
                  </p>
                  <Link
                    href="/guides"
                    className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
                  >
                    Browse HR & Business Guides <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              )}

              {/* Table of Contents */}
              {tableOfContents && tableOfContents.length > 0 && (
                <div className="glass rounded-2xl p-5">
                  <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <BookOpen className="size-4 text-primary" />
                    Table of Contents
                  </h3>
                  <ul className="space-y-1">
                    {tableOfContents.map((item) => (
                      <li key={item.id}>
                        <a
                          href={`#${item.id}`}
                          className="block w-full text-left text-xs leading-relaxed py-1.5 px-2.5 rounded-lg border-l-2 transition-all duration-150 hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring border-l-transparent text-muted-foreground hover:text-foreground"
                        >
                          {item.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Bottom slot: Trust & Methodology Card */}
              <div className="glass rounded-2xl p-5 border border-border/60 space-y-3">
                <div className="flex items-center gap-2 font-semibold text-sm text-foreground">
                  <Shield className="h-4 w-4 text-emerald-600" />
                  Trust & Accuracy
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Our formulas are peer-reviewed by certified CPAs and HR professionals, complying with IRS and FLSA standards.
                </p>
                <div className="pt-2 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground">
                  <Link href="/about" className="text-emerald-600 hover:underline">
                    Our Methodology
                  </Link>
                  <span>•</span>
                  <Link href="/glossary" className="text-emerald-600 hover:underline">
                    Glossary
                  </Link>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* ================================================================= */}
        {/* Mobile Ad / Slot (only rendered when real ad is provided)        */}
        {/* ================================================================= */}
        {adContent && (
          <div className="lg:hidden mt-8 max-w-7xl mx-auto px-4 sm:px-6">
            {adContent}
          </div>
        )}
      </div>
    </>
  );
}
