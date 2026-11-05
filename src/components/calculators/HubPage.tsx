'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, Variants } from 'framer-motion';
import Link from 'next/link';
import {
  Search,
  X,
  Flame,
  ArrowRight,
  Scale,
  LayoutGrid,
  Landmark,
  Wallet,
  Clock,
  TrendingUp,
  Users,
  Briefcase,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react';
import { getPublishedCalculators, categoryOrder, categoryMeta, type CalculatorMeta } from '@/lib/calculator-meta';
import { searchCalculators } from '@/lib/search-calculators';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 300, damping: 30 },
  },
};

const TOP_TOOL_SLUGS = [
  { slug: 'hourly-paycheck-calculator', label: 'Hourly Paycheck', badge: '#1 Tool' },
  { slug: 'wages-calculator', label: 'Salary to Hourly' },
  { slug: 'business-day-calculator', label: 'Business Days' },
  { slug: 'profit-margin-calculator', label: 'Profit Margin' },
  { slug: 'time-card-calculator-with-lunch', label: 'Time Card + Lunch' },
  { slug: 'employee-cost-calculator', label: 'Employee Cost' },
];

const CATEGORY_UI_CONFIG: Record<
  string,
  { shortLabel: string; icon: LucideIcon; description: string }
> = {
  'Payroll & Taxes': {
    shortLabel: 'Payroll & Taxes',
    icon: Landmark,
    description: '2026 federal & state paycheck calculators, FICA, W-2 vs. 1099, and withholding estimators',
  },
  'Time & Attendance': {
    shortLabel: 'Time & Attendance',
    icon: Clock,
    description: 'Weekly time cards with lunch breaks, business days, PTO accrual, and billable hours',
  },
  'Salary & Compensation': {
    shortLabel: 'Salary & Pay',
    icon: Wallet,
    description: 'Salary-to-hourly converters, overtime (1.5x & 2x), pro-rata pay, raises, and shift differentials',
  },
  'Business Finance': {
    shortLabel: 'Business Finance',
    icon: TrendingUp,
    description: 'Profit margin, markup, ROI, EBITDA margin, startup burn rate, break-even, and sales tax',
  },
  'HR Analytics': {
    shortLabel: 'HR & Workforce',
    icon: Users,
    description: 'True loaded employee cost, FTE & ACA compliance, turnover cost, severance, and revenue per employee',
  },
  'Sales & Compensation': {
    shortLabel: 'Sales, SaaS & Freelance',
    icon: Briefcase,
    description: 'Sales commission, CAC, CLV, SaaS churn rate, freelance hourly rates, and Upwork fee calculators',
  },
};

export default function HubPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Press "/" anywhere (when not already typing in an input) to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === '/' &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const isSearching = searchQuery.trim().length > 0;
  const searchResults = useMemo(() => {
    if (!isSearching) return null;
    return searchCalculators(searchQuery);
  }, [searchQuery, isSearching]);

  const activeCalculators = useMemo(() => getPublishedCalculators(), []);

  const filteredCalculators = useMemo(() => {
    const base = searchResults ? searchResults.map((r) => r.calculator) : activeCalculators;
    if (selectedCategory === 'ALL') return base;
    return base.filter((c) => c.category === selectedCategory);
  }, [searchResults, activeCalculators, selectedCategory]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { ALL: activeCalculators.length };
    for (const c of activeCalculators) {
      counts[c.category] = (counts[c.category] || 0) + 1;
    }
    return counts;
  }, [activeCalculators]);

  // Order categories by highest tool count / demand
  const orderedActiveCategories = useMemo(() => {
    const preferredOrder = [
      'Payroll & Taxes',
      'Time & Attendance',
      'Salary & Compensation',
      'Business Finance',
      'HR Analytics',
      'Sales & Compensation',
    ];
    const allCats = Array.from(new Set([...preferredOrder, ...categoryOrder]));
    return allCats.filter((cat) => (categoryCounts[cat] || 0) > 0);
  }, [categoryCounts]);

  const grouped = useMemo(() => {
    const groups: {
      category: string;
      meta: { emoji: string; description: string };
      items: CalculatorMeta[];
      maxScore: number;
    }[] = [];

    orderedActiveCategories.forEach((cat) => {
      const items = filteredCalculators.filter((c) => c.category === cat);
      if (items.length > 0) {
        let maxScore = 0;
        if (searchResults) {
          for (const item of items) {
            const found = searchResults.find((r) => r.calculator.slug === item.slug);
            if (found && found.score > maxScore) {
              maxScore = found.score;
            }
          }
        }
        groups.push({
          category: cat,
          meta: {
            emoji: categoryMeta[cat]?.emoji || '📊',
            description:
              CATEGORY_UI_CONFIG[cat]?.description ||
              categoryMeta[cat]?.description ||
              `${cat} calculators and tools`,
          },
          items,
          maxScore,
        });
      }
    });

    if (searchResults) {
      groups.sort((a, b) => b.maxScore - a.maxScore);
    }

    return groups;
  }, [filteredCalculators, orderedActiveCategories, searchResults]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
      className="py-6 sm:py-10"
    >
      {/* Hero Section */}
      <div className="text-center mb-8 sm:mb-10 px-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-semibold mb-4"
        >
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
          <span>2026 IRS &amp; FLSA Verified · {activeCalculators.length} Free Calculators</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.04 }}
          className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-3.5"
        >
          Business &amp; HR{' '}
          <span className="bg-gradient-to-r from-emerald-500 via-emerald-600 to-gold-500 bg-clip-text text-transparent">
            Calculators
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-lg mb-6"
        >
          Instant, accurate 2026 payroll, tax, time card, and financial calculators for business owners, HR
          managers, and employees. No signup, 100% browser-private.
        </motion.p>

        {/* Search Bar — Flex layout ensures Search icon is never covered by backdrop-blur */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          className="max-w-2xl mx-auto relative group"
        >
          <div className="absolute inset-0 bg-emerald-500/15 blur-2xl group-focus-within:bg-emerald-500/25 transition-all duration-500 -z-10 rounded-full" />
          <div className="flex items-center w-full h-13 sm:h-14 px-4 rounded-2xl border border-border/70 bg-card/90 backdrop-blur-xl shadow-lg group-focus-within:ring-2 group-focus-within:ring-emerald-500/40 group-focus-within:border-emerald-500/60 transition-all">
            <Search className="h-5 w-5 text-emerald-600 shrink-0 mr-3" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder={`Search ${activeCalculators.length} calculators (e.g. 'hourly paycheck', 'profit margin', 'employee cost')...`}
              className="w-full h-full bg-transparent text-foreground placeholder:text-muted-foreground/80 focus:outline-none text-sm sm:text-base truncate"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery ? (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="ml-2 p-1.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors shrink-0"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            ) : (
              <kbd className="hidden sm:inline-flex items-center justify-center h-6 px-2 ml-2 rounded-md border border-border/70 bg-muted/60 font-mono text-[11px] font-medium text-muted-foreground shrink-0 select-none">
                /
              </kbd>
            )}
          </div>
        </motion.div>

        {/* Popular Quick-Launch Strip */}
        <div className="max-w-4xl mx-auto mt-4">
          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 dark:text-amber-400 mr-0.5">
              <Flame className="h-3.5 w-3.5 fill-amber-500/20" />
              Popular:
            </span>
            {TOP_TOOL_SLUGS.map((item) => (
              <Link
                key={item.slug}
                href={`/calculators/${item.slug}`}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-card/90 hover:bg-emerald-500/10 hover:border-emerald-500/40 hover:text-emerald-600 border border-border/60 transition-all shadow-2xs"
              >
                <span>{item.label}</span>
                {item.badge && (
                  <span className="px-1.5 py-0.2 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold">
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
            <Link
              href="/compare/jobs"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-600/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 hover:bg-emerald-600 hover:text-white transition-all shadow-2xs"
            >
              <Scale className="h-3 w-3" />
              Compare 2 Job Offers
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12">
        {/* Redesigned Category Filter Dock — Centered, Wrapped, Zero Scrollbar, Zero Clipping */}
        <div className="max-w-5xl mx-auto">
          <div
            role="tablist"
            aria-label="Filter calculators by category"
            className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 p-2 rounded-2xl bg-card/75 dark:bg-card/40 backdrop-blur-xl border border-border/60 shadow-sm"
          >
            <button
              type="button"
              role="tab"
              aria-selected={selectedCategory === 'ALL'}
              onClick={() => setSelectedCategory('ALL')}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                selectedCategory === 'ALL'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25'
                  : 'bg-transparent hover:bg-muted/80 text-muted-foreground hover:text-foreground'
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5 shrink-0" />
              <span>All Tools</span>
              <span
                className={`px-1.5 py-0.5 rounded-md text-[11px] font-bold leading-none ${
                  selectedCategory === 'ALL'
                    ? 'bg-white/20 text-white'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {categoryCounts.ALL}
              </span>
            </button>

            {orderedActiveCategories.map((cat) => {
              const count = categoryCounts[cat] || 0;
              if (count === 0) return null;
              const config = CATEGORY_UI_CONFIG[cat];
              const IconComponent = config?.icon || LayoutGrid;
              const displayLabel = config?.shortLabel || cat;
              const isSelected = selectedCategory === cat;

              return (
                <button
                  key={cat}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setSelectedCategory(isSelected ? 'ALL' : cat)}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25'
                      : 'bg-transparent hover:bg-muted/80 text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <IconComponent
                    className={`h-3.5 w-3.5 shrink-0 ${
                      isSelected ? 'text-white' : 'text-emerald-600 dark:text-emerald-400'
                    }`}
                  />
                  <span>{displayLabel}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded-md text-[11px] font-bold leading-none ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Calculator Grid */}
        <div className="space-y-12">
          {grouped.length === 0 ? (
            <div className="text-center py-16 px-4 max-w-md mx-auto rounded-3xl border border-border/60 bg-card/50 backdrop-blur-sm">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 mb-4">
                <Search className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-foreground">No calculators found</h3>
              <p className="text-sm text-muted-foreground mt-1.5">
                We couldn&apos;t find any tool matching &ldquo;{searchQuery}&rdquo;. Try another search term:
              </p>
              <div className="mt-5 flex flex-wrap justify-center gap-2">
                {['Paycheck', 'Profit Margin', 'Time Card', 'Overtime', 'Employee Cost', 'Burn Rate'].map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => {
                      setSelectedCategory('ALL');
                      setSearchQuery(term);
                    }}
                    className="text-xs font-medium px-3 py-1.5 rounded-full bg-muted hover:bg-accent text-foreground transition-colors border border-border/60"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            grouped.map((group) => {
              const SectionIcon = CATEGORY_UI_CONFIG[group.category]?.icon || LayoutGrid;
              const sectionTitle = CATEGORY_UI_CONFIG[group.category]?.shortLabel || group.category;

              return (
                <section key={group.category} className="scroll-mt-24">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 pb-3 border-b border-border/50">
                    <div className="flex items-start sm:items-center gap-3.5">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600">
                        <SectionIcon className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2.5">
                          <h2 className="text-xl font-bold tracking-tight text-foreground">
                            {sectionTitle}
                          </h2>
                          <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                            {group.items.length} {group.items.length === 1 ? 'tool' : 'tools'}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                          {group.meta.description}
                        </p>
                      </div>
                    </div>

                    {selectedCategory === 'ALL' ? (
                      <button
                        type="button"
                        onClick={() => setSelectedCategory(group.category)}
                        className="self-start sm:self-center text-xs font-semibold text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-1 cursor-pointer shrink-0"
                      >
                        Filter category &rarr;
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setSelectedCategory('ALL')}
                        className="self-start sm:self-center text-xs font-semibold text-muted-foreground hover:text-foreground inline-flex items-center gap-1 cursor-pointer shrink-0"
                      >
                        &larr; Show all {categoryCounts.ALL} calculators
                      </button>
                    )}
                  </div>

                  <motion.div
                    key={group.category}
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.05 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5"
                  >
                    {group.items.map((calc) => (
                      <CalculatorCardComponent key={calc.slug} calc={calc} />
                    ))}
                  </motion.div>
                </section>
              );
            })
          )}
        </div>

        {/* Featured Side-by-Side Job Offer Comparison Banner */}
        <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-600 text-xs font-bold">
              <Scale className="h-3.5 w-3.5" />
              Interactive Compensation Analyzer
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
              Deciding Between Two Job Offers?
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              Base salary only tells half the story. Compare two offers side-by-side including annual bonus, 401(k)
              employer match, health insurance premiums, PTO days value, and daily commute costs.
            </p>
          </div>
          <Link
            href="/compare/jobs"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/20 shrink-0 transition-colors"
          >
            Compare 2 Job Offers Now
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Featured Guides & Strategic Insights Section */}
        <div className="pt-10 border-t border-border/40">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-600 mb-2">
                📖 Editorial Insights
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold">Featured HR &amp; Business Guides</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Practical, in-depth breakdowns on payroll taxes, overtime regulations, and compensation planning.
              </p>
            </div>
            <Link
              href="/guides"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
            >
              View All Guides &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              href="/blog/fica-tax-guide"
              className="group p-6 rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm hover:border-emerald-500/30 hover:shadow-lg transition-all space-y-3"
            >
              <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wide">Taxes</span>
              <h3 className="font-bold text-base group-hover:text-emerald-600 transition-colors">
                FICA Tax Explained: What You Owe in 2026
              </h3>
              <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                Social Security wage base limits, Medicare surtaxes, and self-employment adjustments with worked examples.
              </p>
              <div className="pt-2 text-xs font-medium text-emerald-600 flex items-center gap-1">
                Read Guide &rarr;
              </div>
            </Link>

            <Link
              href="/blog/how-to-structure-sales-commission-plan"
              className="group p-6 rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm hover:border-emerald-500/30 hover:shadow-lg transition-all space-y-3"
            >
              <span className="text-xs font-semibold text-purple-600 uppercase tracking-wide">Compensation</span>
              <h3 className="font-bold text-base group-hover:text-emerald-600 transition-colors">
                How to Structure a Sales Commission Plan
              </h3>
              <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                From flat rate to tiered quotas and accelerators — avoid clawback traps and motivate sales teams.
              </p>
              <div className="pt-2 text-xs font-medium text-emerald-600 flex items-center gap-1">
                Read Guide &rarr;
              </div>
            </Link>

            <Link
              href="/blog/overtime-california-guide"
              className="group p-6 rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm hover:border-emerald-500/30 hover:shadow-lg transition-all space-y-3"
            >
              <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Labor Law</span>
              <h3 className="font-bold text-base group-hover:text-emerald-600 transition-colors">
                California Overtime Laws: Daily &amp; Weekly OT Rules
              </h3>
              <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                Understanding daily 8-hour overtime, 12-hour double time, and 7th consecutive day rules.
              </p>
              <div className="pt-2 text-xs font-medium text-emerald-600 flex items-center gap-1">
                Read Guide &rarr;
              </div>
            </Link>
          </div>
        </div>

        {/* SEO & Trust Content Section */}
        <div className="pt-8 border-t border-border/40">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            <div className="lg:col-span-2 space-y-8">
              <section>
                <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                  Professional Business &amp; HR Tools You Can Trust
                </h2>
                <div className="prose prose-emerald dark:prose-invert max-w-none text-muted-foreground space-y-3">
                  <p>
                    At <strong className="text-foreground">QuickBizCalc</strong>, we understand that accuracy is everything when it comes to payroll, commissions, and business finances. Our suite of {activeCalculators.length} free online calculators is designed specifically for small business owners, HR professionals, and financial analysts who need instant, reliable results without the complexity of expensive software.
                  </p>
                  <p>
                    Whether you are calculating a <Link href="/calculators/commission-calculator" className="text-emerald-600 hover:underline">sales commission</Link>, estimating <Link href="/calculators/payroll-calculator" className="text-emerald-600 hover:underline">payroll taxes</Link>, or analyzing <Link href="/calculators/roi-calculator" className="text-emerald-600 hover:underline">ROI</Link> for your next investment, our tools provide a transparent breakdown of formulas and worked examples.
                  </p>
                </div>
              </section>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="p-4 sm:p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 space-y-2">
                  <h3 className="font-bold mb-1 flex items-center gap-2">
                    <span className="inline-flex items-center justify-center h-7 w-7 p-1 rounded-full bg-emerald-500/20 text-emerald-600">✓</span>
                    Built From Primary Sources
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    Every formula comes from IRS Publication 15-T, Department of Labor FLSA rules, or the relevant state agency, and each calculator page cites the publication it is based on.
                  </p>
                  <Link href="/about" className="inline-block text-xs font-semibold text-emerald-600 hover:underline pt-1">
                    Learn about our methodology &rarr;
                  </Link>
                </div>
                <div className="p-4 sm:p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 space-y-2">
                  <h3 className="font-bold mb-1 flex items-center gap-2">
                    <span className="inline-flex items-center justify-center h-7 w-7 p-1 rounded-full bg-emerald-500/20 text-emerald-600">✓</span>
                    100% Client-Side Privacy
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    Calculations run locally in your browser. Your salaries, employee numbers, and financial records are never saved to our servers.
                  </p>
                  <Link href="/privacy-policy" className="inline-block text-xs font-semibold text-emerald-600 hover:underline pt-1">
                    Read our privacy commitment &rarr;
                  </Link>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="p-4 sm:p-6 rounded-2xl border border-border/60 bg-card/50 backdrop-blur-sm">
                <h3 className="font-bold mb-4 text-sm uppercase tracking-wider text-muted-foreground">
                  Why Use QuickBizCalc?
                </h3>
                <ul className="space-y-4">
                  <li className="flex gap-3">
                    <div className="h-5 w-5 rounded-full bg-emerald-500/20 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">1</div>
                    <div className="text-sm">
                      <strong className="block text-foreground">Zero Cost</strong>
                      100% free forever. No credit card, account registration, or subscriptions required.
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <div className="h-5 w-5 rounded-full bg-emerald-500/20 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">2</div>
                    <div className="text-sm">
                      <strong className="block text-foreground">Instant Live Results</strong>
                      See real-time breakdowns, interactive charts, and multi-period conversions as you type.
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <div className="h-5 w-5 rounded-full bg-emerald-500/20 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">3</div>
                    <div className="text-sm">
                      <strong className="block text-foreground">Sources Cited</strong>
                      Every calculator lists the IRS, Department of Labor, or state publication its formula comes from.
                    </div>
                  </li>
                </ul>
              </div>

              <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-800 text-white shadow-xl shadow-emerald-600/20">
                <h3 className="font-bold mb-2">Need a custom tool?</h3>
                <p className="text-sm text-emerald-50/80 mb-4">
                  We are constantly expanding our suite. If you have a specific business calculation you need automated, let us know.
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center w-full py-2 px-4 rounded-xl bg-white text-emerald-700 font-bold text-sm hover:bg-emerald-50 transition-colors"
                >
                  Request a Calculator
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Long-form SEO content */}
        <section className="pt-10 border-t border-border/40">
          <div className="max-w-4xl mx-auto space-y-6 text-muted-foreground">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Free Business &amp; HR Calculators for Small Business Owners</h2>
            <p className="leading-relaxed">QuickBizCalc hosts {activeCalculators.length} free business and HR calculators built for US small business owners, payroll administrators, HR managers, and self-employed professionals. Every tool on this site is 100% free with no signup, no paywall, and no usage limit. Calculations run entirely in your browser, which means your salary, employee count, and financial inputs never leave your device.</p>
            <h3 className="text-xl sm:text-2xl font-bold text-foreground pt-4">Why use a dedicated business calculator instead of a spreadsheet?</h3>
            <p className="leading-relaxed">Spreadsheets are powerful but error-prone. A misplaced parenthesis in a payroll formula can cost an employee hundreds of dollars per paycheck, and a wrong overtime multiplier can trigger a Department of Labor audit. Our calculators encode the correct formulas for the 2026 tax year — including the 6.2% Social Security wage base limit ($184,500 in 2026), the 1.45% Medicare employee portion, the 22% federal supplemental withholding rate for bonuses, and FLSA time-and-a-half overtime rules — so you can rely on the math without re-deriving it from IRS Publication 15-T every time.</p>
            <h3 className="text-xl sm:text-2xl font-bold text-foreground pt-4">Who uses QuickBizCalc?</h3>
            <p className="leading-relaxed">Our typical users are US-based hourly employees checking their next paycheck, small business owners running payroll for 1-10 employees, HR directors benchmarking turnover and cost-per-hire against industry averages, freelance consultants tracking billable hours and utilization rate, and sales reps modeling commission under tiered or quota-based plans. The most-visited calculators on the site are the <Link href="/calculators/hourly-paycheck-calculator" className="text-emerald-600 hover:underline">hourly paycheck calculator</Link>, the <Link href="/calculators/time-card-calculator-with-lunch" className="text-emerald-600 hover:underline">time card calculator with lunch</Link>, and the <Link href="/calculators/business-day-calculator" className="text-emerald-600 hover:underline">business day calculator</Link>.</p>
            <h3 className="text-xl sm:text-2xl font-bold text-foreground pt-4">Are these calculators accurate for the 2026 tax year?</h3>
            <p className="leading-relaxed">Yes. Our tax calculators use the 2026 federal income tax brackets, the 2026 Social Security wage base ($184,500), and the 2026 FICA rates (6.2% + 1.45% = 7.65% employee portion). Every calculator page includes a Statutory Sources section citing the IRS publication, FLSA section, or SSA regulation that the formula is based on.</p>
            <h3 className="text-xl sm:text-2xl font-bold text-foreground pt-4">Can I embed these calculators on my own website?</h3>
            <p className="leading-relaxed">Yes — every calculator has an Embed button in the top-right of the page that generates a one-line iframe snippet you can paste into your own website or blog. Embedding is free for personal and commercial use, and the embedded calculator includes a small &quot;Powered by QuickBizCalc&quot; attribution link.</p>
            <h3 className="text-xl sm:text-2xl font-bold text-foreground pt-4">How is QuickBizCalc monetized?</h3>
            <p className="leading-relaxed">QuickBizCalc is supported by display advertising. We do not sell user data, we do not require an account, and we do not email you after you use a calculator. The ads you see on each page keep the tools free for everyone.</p>
          </div>
        </section>
      </div>
    </motion.div>
  );
}

function CalculatorCardComponent({ calc }: { calc: CalculatorMeta }) {
  const Icon = calc.icon;

  return (
    <motion.div
      variants={cardVariants}
      className="cursor-pointer group hover:-translate-y-1 active:scale-[0.98] transition-transform duration-200"
    >
      <Link href={calc.path} className="block h-full">
        <div className="relative h-full rounded-2xl border border-border/60 bg-card/85 backdrop-blur-sm p-5 sm:p-6 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/8 hover:border-emerald-500/35 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between mb-3.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-md shadow-emerald-500/20 group-hover:shadow-emerald-500/30 transition-shadow">
                <Icon className="h-5 w-5 text-white" />
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
            </div>
            <h3 className="font-bold text-base mb-1.5 group-hover:text-emerald-600 transition-colors">
              {calc.title}
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {calc.shortDescription}
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
