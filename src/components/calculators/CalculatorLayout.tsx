'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { SITE_URL } from '@/lib/calculator-meta';
import { Card, CardContent } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import {
  ChevronRight,
  Home,
  BookOpen,
  HelpCircle,
  Calculator,
  ArrowRight,
} from 'lucide-react';
import { motion } from 'framer-motion';
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
// Animation variants
// ---------------------------------------------------------------------------

import { Variants } from 'framer-motion';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.05 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
};

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

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

export default function CalculatorLayout({
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
  const [activeTocId, setActiveTocId] = useState<string | null>(null);

  // ---- Scroll TOC item into view ----
  const scrollToSection = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  // ---- Track active TOC heading via IntersectionObserver ----
  useEffect(() => {
    if (!tableOfContents?.length) return;

    const ids = tableOfContents.map((t) => t.id);
    const observers: IntersectionObserver[] = [];

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveTocId(id);
          }
        },
        { rootMargin: '-80px 0px -60% 0px', threshold: 0 }
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => {
      observers.forEach((o) => o.disconnect());
    };
  }, [tableOfContents]);

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
          <motion.nav
            aria-label="Breadcrumb"
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4 sm:mb-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <ol className="flex items-center flex-wrap gap-1" itemScope itemType="https://schema.org/BreadcrumbList">
              {/* Home crumb (replaces first breadcrumb if it maps to /) */}
              <motion.li variants={itemVariants} className="flex items-center" itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
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
              </motion.li>

              {/* Skip first breadcrumb if it is 'Calculators' (redundant with Home) */}
              {breadcrumbs
                .filter((crumb) => crumb.label !== 'Calculators')
                .map((crumb, idx, arr) => {
                  const isLast = idx === arr.length - 1;
                  const crumbHref = crumb.href || undefined;
                  return (
                    <motion.li
                      key={crumb.label}
                      variants={itemVariants}
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
                    </motion.li>
                  );
                })}
            </ol>
          </motion.nav>
        )}

        {/* ================================================================= */}
        {/* Hero                                                              */}
        {/* ================================================================= */}
        <motion.div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 sm:mb-8"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 sm:gap-4 min-w-0">
              <div className="flex items-center justify-center size-8 sm:size-14 rounded-2xl bg-primary/10 text-primary shrink-0 p-1">
                {icon}
              </div>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-3xl lg:text-4xl font-bold tracking-tight truncate">
                  {title}
                </h1>
                <p className="text-muted-foreground text-sm sm:text-base mt-1 line-clamp-2">
                  {description}
                </p>
              </div>
            </div>
            <div className="shrink-0 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
              <ResultActions />
            </div>
          </motion.div>
        </motion.div>

        {/* ================================================================= */}
        {/* Main content + sidebar                                            */}
        {/* ================================================================= */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-6">
          {/* ---------- Left column: calculator + SEO ---------- */}
          <div className="flex-1 min-w-0 space-y-8">
            {/* Calculator card */}
            <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
              <Card className="glass-strong overflow-hidden calculator-form">{children}</Card>
            </motion.div>

            {/* ============================================================= */}
            {/* How-to section                                                 */}
            {/* ============================================================= */}
            {hasHowTo && (
              <motion.section
                id="how-to-calculate"
                className="scroll-mt-24"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.15 }}
                variants={containerVariants}
              >
                <motion.h2
                  className="text-xl sm:text-2xl font-bold mb-4"
                  variants={itemVariants}
                >
                  <BookOpen className="inline-block size-5 mr-2 text-primary" />
                  How to Calculate
                </motion.h2>
                <ol className="space-y-3">
                  {howToSteps!.map((step, idx) => (
                    <motion.li
                      key={idx}
                      className="flex gap-3 items-start"
                      variants={itemVariants}
                    >
                      <span className="flex items-center justify-center size-7 rounded-full bg-primary/10 text-primary text-xs font-bold shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                        {step}
                      </p>
                    </motion.li>
                  ))}
                </ol>
              </motion.section>
            )}

            {/* ============================================================= */}
            {/* Formula section                                                */}
            {/* ============================================================= */}
            {hasFormula && (
              <motion.section
                id="formula"
                className="scroll-mt-24"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.15 }}
                variants={fadeInUp}
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
              </motion.section>
            )}

            {/* ============================================================= */}
            {/* Commission Structures section                                  */}
            {/* ============================================================= */}
            {hasCommissionStructures && (
              <motion.section
                id="commission-structures"
                className="scroll-mt-24"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                variants={containerVariants}
              >
                <motion.h2
                  className="text-xl sm:text-2xl font-bold mb-4"
                  variants={itemVariants}
                >
                  Common Commission Structures
                </motion.h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {commissionStructures!.map((cs, idx) => (
                    <motion.div
                      key={idx}
                      className="glass rounded-2xl p-5 space-y-3"
                      variants={itemVariants}
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
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            )}

            {/* ============================================================= */}
            {/* Worked Examples section                                        */}
            {/* ============================================================= */}
            {hasWorkedExamples && (
              <motion.section
                id="worked-examples"
                className="scroll-mt-24"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                variants={containerVariants}
              >
                <motion.h2
                  className="text-xl sm:text-2xl font-bold mb-4"
                  variants={itemVariants}
                >
                  Worked Examples
                </motion.h2>
                <div className="space-y-4">
                  {workedExamples!.map((ex, idx) => (
                    <motion.div
                      key={idx}
                      className={`glass rounded-2xl p-5 border-l-4 ${idx % 2 === 0
                        ? 'border-l-emerald-500'
                        : 'border-l-gold-500'
                        }`}
                      variants={itemVariants}
                    >
                      <h3 className="font-semibold text-sm sm:text-base mb-1">
                        {ex.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {ex.description}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            )}

            {/* ============================================================= */}
            {/* FAQ section                                                    */}
            {/* ============================================================= */}
            {hasFaqs && (
              <motion.section
                id="frequently-asked-questions"
                className="scroll-mt-24"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                variants={fadeInUp}
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
                    <Accordion type="single" collapsible className="w-full">
                      {faqs!.map((faq, idx) => (
                        <AccordionItem
                          key={idx}
                          value={`faq-${idx}`}
                          className="px-5"
                        >
                          <AccordionTrigger className="text-left text-sm sm:text-base">
                            {faq.question}
                          </AccordionTrigger>
                          <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                            {faq.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              </motion.section>
            )}

            {/* ============================================================= */}
            {/* Related Tools section                                          */}
            {/* ============================================================= */}
            {hasRelatedTools && (
              <motion.section
                id="related-calculators"
                className="scroll-mt-24"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                variants={containerVariants}
              >
                <motion.h2
                  className="text-xl sm:text-2xl font-bold mb-4"
                  variants={itemVariants}
                >
                  Related Calculators
                </motion.h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {relatedTools!.map((tool) => (
                    <motion.div key={tool.slug} variants={itemVariants}>
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
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            )}
          </div>

          {/* ---------- Right sidebar: ads + TOC ---------- */}
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-24 space-y-6">
              {/* Top ad space */}
              {adContent ? (
                adContent
              ) : (
                <div className="ad-space">Advertisement</div>
              )}

              {/* Table of Contents */}
              {tableOfContents && tableOfContents.length > 0 && (
                <motion.div
                  className="glass rounded-2xl p-5"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.4 }}
                >
                  <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <BookOpen className="size-4 text-primary" />
                    Table of Contents
                  </h3>
                  <ul className="space-y-1">
                    {tableOfContents.map((item) => (
                      <li key={item.id}>
                        <button
                          type="button"
                          onClick={() => scrollToSection(item.id)}
                          className={`w-full text-left text-xs leading-relaxed py-1.5 px-2.5 rounded-lg border-l-2 transition-all duration-150 hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${activeTocId === item.id
                            ? 'border-l-emerald-500 text-foreground font-medium bg-emerald-500/5'
                            : 'border-l-transparent text-muted-foreground'
                            }`}
                        >
                          {item.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {/* Bottom ad space */}
              <div className="ad-space">Advertisement</div>
            </div>
          </aside>
        </div>

        {/* ================================================================= */}
        {/* Mobile Ad                                                         */}
        {/* ================================================================= */}
        <div className="lg:hidden mt-8 max-w-7xl mx-auto px-4 sm:px-6">
          {adContent ? (
            adContent
          ) : (
            <div className="ad-space">Advertisement</div>
          )}
        </div>
      </div>
    </>
  );
}
