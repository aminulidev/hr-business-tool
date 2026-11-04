'use client';

import React, { useState, useMemo } from 'react';
import { motion, Variants } from 'framer-motion';
import Link from 'next/link';
import { Search, X, Flame, ArrowRight, Scale } from 'lucide-react';
import { getPublishedCalculators, categoryOrder, categoryMeta, type CalculatorMeta } from '@/lib/calculator-meta';
import { searchCalculators } from '@/lib/search-calculators';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 300, damping: 30 },
  },
};

const TOP_TOOL_SLUGS = [
  { slug: 'hourly-paycheck-calculator', label: 'Hourly Paycheck (2026)', badge: 'Most Popular' },
  { slug: 'wages-calculator', label: 'Wages & Salary Converter' },
  { slug: 'business-day-calculator', label: 'Business Days & Holidays' },
  { slug: 'profit-margin-calculator', label: 'Profit Margin & Markup' },
  { slug: 'time-card-calculator-with-lunch', label: 'Time Card + Lunch Break' },
  { slug: 'federal-tax-calculator', label: '2026 Federal Tax Estimator' },
];

export default function HubPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

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

  const grouped = useMemo(() => {
    const groups: {
      category: string;
      meta: { emoji: string; description: string };
      items: CalculatorMeta[];
      maxScore: number;
    }[] = [];

    categoryOrder.forEach((cat) => {
      const items = filteredCalculators.filter((c) => c.category === cat);
      if (items.length > 0 && categoryMeta[cat]) {
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
          meta: categoryMeta[cat],
          items,
          maxScore,
        });
      }
    });

    const coveredCategories = new Set(groups.map((g) => g.category));
    const remainingItems = filteredCalculators.filter((c) => !coveredCategories.has(c.category));
    if (remainingItems.length > 0) {
      const remainingCats = Array.from(new Set(remainingItems.map((c) => c.category)));
      remainingCats.forEach((cat) => {
        const items = remainingItems.filter((c) => c.category === cat);
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
          meta: categoryMeta[cat] || { emoji: '📊', description: `${cat} calculators and tools` },
          items,
          maxScore,
        });
      });
    }

    if (searchResults) {
      groups.sort((a, b) => b.maxScore - a.maxScore);
    }

    return groups;
  }, [filteredCalculators, searchResults]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="py-6 sm:py-10"
    >
      {/* Hero Section */}
      <div className="text-center mb-8 sm:mb-10 px-4">
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-4"
        >
          Business &amp; HR{' '}
          <span className="bg-gradient-to-r from-emerald-500 via-emerald-600 to-gold-500 bg-clip-text text-transparent">
            Calculators
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-muted-foreground max-w-2xl mx-auto text-base sm:text-lg mb-6"
        >
          Instant, IRS &amp; FLSA-verified 2026 calculators for small business owners, HR managers, and employees.
          No signup, 100% browser-private.
        </motion.p>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="max-w-xl mx-auto relative group"
        >
          <div className="absolute inset-0 bg-emerald-500/15 blur-2xl group-focus-within:bg-emerald-500/25 transition-all duration-500 -z-10 rounded-full" />
          <div className="relative flex items-center">
            <Search className="absolute left-4 h-5 w-5 text-muted-foreground group-focus-within:text-emerald-600 transition-colors" />
            <input
              type="text"
              placeholder="Search 50+ calculators (e.g. 'hourly paycheck', 'profit margin', 'business days')..."
              className="w-full h-14 pl-12 pr-12 rounded-2xl border border-border/60 bg-background/80 backdrop-blur-xl shadow-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all text-base"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 p-1.5 rounded-full hover:bg-muted text-muted-foreground transition-colors"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </motion.div>

        {/* Most Popular Quick-Launch Strip Above the Fold */}
        <div className="max-w-4xl mx-auto mt-6">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 dark:text-amber-400 mr-1">
              <Flame className="h-3.5 w-3.5" />
              Most Popular:
            </span>
            {TOP_TOOL_SLUGS.map((item) => (
              <Link
                key={item.slug}
                href={`/calculators/${item.slug}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-card hover:bg-emerald-500/10 hover:border-emerald-500/40 hover:text-emerald-600 border border-border/60 transition-all shadow-xs"
              >
                <span>{item.label}</span>
                {item.badge && (
                  <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 text-[10px] font-bold">
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
            <Link
              href="/compare/jobs"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-all shadow-xs"
            >
              <Scale className="h-3 w-3" />
              Compare 2 Job Offers
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-14">
        {/* Interactive Category Filter Tabs */}
        <div className="flex items-center justify-start sm:justify-center overflow-x-auto pb-2 gap-2 no-scrollbar">
          <button
            type="button"
            onClick={() => setSelectedCategory('ALL')}
            className={`shrink-0 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold border transition-all ${
              selectedCategory === 'ALL'
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20'
                : 'bg-card hover:bg-muted text-muted-foreground hover:text-foreground border-border/60'
            }`}
          >
            All Calculators ({categoryCounts.ALL})
          </button>
          {categoryOrder.map((cat) => {
            const count = categoryCounts[cat] || 0;
            if (count === 0) return null;
            const emoji = categoryMeta[cat]?.emoji || '📊';
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold border transition-all ${
                  isSelected
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20'
                    : 'bg-card hover:bg-muted text-muted-foreground hover:text-foreground border-border/60'
                }`}
              >
                <span>{emoji}</span>
                <span>{cat}</span>
                <span className={`text-xs ${isSelected ? 'text-emerald-100' : 'text-muted-foreground'}`}>
                  ({count})
                </span>
              </button>
            );
          })}
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
                {['ROI', 'Commission', 'Payroll', 'Overtime', 'Break-Even', 'PTO'].map((term) => (
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
            grouped.map((group) => (
              <section key={group.category}>
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-2xl">{group.meta.emoji}</span>
                  <div>
                    <h2 className="text-xl font-bold">
                      {group.category}
                      <span className="ml-2 text-sm font-medium text-muted-foreground">
                        ({group.items.length} tool{group.items.length > 1 ? 's' : ''})
                      </span>
                    </h2>
                    <p className="text-sm text-muted-foreground">{group.meta.description}</p>
                  </div>
                </div>
                <motion.div
                  key={group.category}
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.05 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
                >
                  {group.items.map((calc) => (
                    <CalculatorCardComponent key={calc.slug} calc={calc} />
                  ))}
                </motion.div>
              </section>
            ))
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
        <div className="relative h-full rounded-2xl border border-border/60 bg-card/80 backdrop-blur-sm p-5 sm:p-6 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/5 hover:border-emerald-500/30">
          <div className="flex items-start justify-between mb-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/30 transition-shadow">
              <Icon className="h-6 w-6 text-white" />
            </div>
          </div>
          <h3 className="font-bold text-base mb-1.5 group-hover:text-emerald-600 transition-colors">
            {calc.title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {calc.shortDescription}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
