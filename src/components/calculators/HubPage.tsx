'use client';

import React, { useState, useMemo } from 'react';
import { motion, Variants } from 'framer-motion';
import Link from 'next/link';
import { Search, X } from 'lucide-react';
import { calculators, categoryOrder, categoryMeta, type CalculatorMeta } from '@/lib/calculator-meta';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 300, damping: 30 },
  },
};

export default function HubPage() {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter and group calculators based on search query
  const filteredCalculators = useMemo(() => {
    if (!searchQuery.trim()) return calculators;
    const query = searchQuery.toLowerCase();
    return calculators.filter(
      (calc) =>
        calc.title.toLowerCase().includes(query) ||
        calc.shortDescription.toLowerCase().includes(query) ||
        calc.keywords.some((kw) => kw.toLowerCase().includes(query))
    );
  }, [searchQuery]);

  const grouped = useMemo(() => {
    const groups: {
      category: string;
      meta: { emoji: string; description: string };
      items: typeof calculators;
    }[] = [];

    categoryOrder.forEach((cat) => {
      const items = filteredCalculators.filter((c) => c.category === cat);
      if (items.length > 0 && categoryMeta[cat]) {
        groups.push({
          category: cat,
          meta: categoryMeta[cat],
          items,
        });
      }
    });

    return groups;
  }, [filteredCalculators]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="py-6 sm:py-12"
    >
      {/* Hero Section */}
      <div className="text-center mb-8 sm:mb-16 px-4">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-4"
        >
          Business & HR{' '}
          <span className="bg-gradient-to-r from-emerald-500 via-emerald-600 to-gold-500 bg-clip-text text-transparent">
            Calculators
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-muted-foreground max-w-2xl mx-auto text-base sm:text-lg mb-6 sm:mb-8"
        >
          Professional-grade tools for small business owners, HR managers, and
          financial professionals. Free, accurate, and instant results.
        </motion.p>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="max-w-xl mx-auto relative group"
        >
          <div className="absolute inset-0 bg-emerald-500/15 blur-2xl group-focus-within:bg-emerald-500/25 transition-all duration-500 -z-10 rounded-full" />
          <div className="relative flex items-center">
            <Search className="absolute left-4 h-5 w-5 text-muted-foreground group-focus-within:text-emerald-600 transition-colors" />
            <input
              type="text"
              placeholder="Search calculators (e.g. 'payroll', 'commission', 'ROI')..."
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

        {/* Calculator count badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-sm text-emerald-600 font-medium"
        >
          <span>{filteredCalculators.length}</span>
          <span className="text-muted-foreground">
            {searchQuery ? 'matching tools found' : 'free tools available'}
          </span>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-20 py-6 sm:py-12">
        {/* Calculator Grid */}
        <div className="space-y-12">
          {grouped.map((group) => (
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
                  <p className="text-sm text-muted-foreground">
                    {group.meta.description}
                  </p>
                </div>
              </div>
              <motion.div
                key={group.category}
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
              >
                {group.items.map((calc) => (
                  <CalculatorCardComponent key={calc.slug} calc={calc} />
                ))}
              </motion.div>
            </section>
          ))}
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
            {/* Left Column: Expert Authority */}
            <div className="lg:col-span-2 space-y-8">
              <section>
                <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                  Professional Business &amp; HR Tools You Can Trust
                </h2>
                <div className="prose prose-emerald dark:prose-invert max-w-none text-muted-foreground space-y-3">
                  <p>
                    At <strong className="text-foreground">QuickBizCalc</strong>, we understand that accuracy is everything when it comes to payroll, commissions, and business finances. Our suite of 32+ free online calculators is designed specifically for small business owners, HR professionals, and financial analysts who need instant, reliable results without the complexity of expensive software.
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
                    Peer-Reviewed Accuracy
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    All formulas are vetted by CPAs and Senior HR professionals in accordance with IRS Publication 15-T and federal FLSA labor regulations.
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

            {/* Right Column: Key Benefits / Sidebar */}
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
                      <strong className="block text-foreground">Instant Reports</strong>
                      Download full calculation audits as structured CSV reports instantly.
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <div className="h-5 w-5 rounded-full bg-emerald-500/20 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">3</div>
                    <div className="text-sm">
                      <strong className="block text-foreground">CPA Reviewed</strong>
                      Tools vetted by CPAs and HR Directors for logic, tax brackets, and regulatory compliance.
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
