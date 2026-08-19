import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Clock,
  Scale,
  FileText,
  TrendingUp,
  Users,
  DollarSign,
  ChevronRight,
  BookOpen,
} from 'lucide-react';
import AppShell from '@/components/layout/AppShell';
import { Badge } from '@/components/ui/badge';
import { SITE_URL, SITE_NAME } from '@/lib/calculator-meta';

export const metadata: Metadata = {
  title: 'HR & Business Guides',
  description:
    'Free in-depth guides on payroll taxes, overtime laws, time card calculations, FICA, sales commission structures, and more — written for small business owners and HR professionals.',
  keywords: [
    'HR guides',
    'payroll guide',
    'overtime law guide',
    'time card guide',
    'FICA tax guide',
    'business calculator guides',
    'HR compliance guides',
  ],
  alternates: {
    canonical: `${SITE_URL}/guides`,
  },
  openGraph: {
    title: `HR & Business Guides | ${SITE_NAME}`,
    description:
      'Free in-depth guides on payroll taxes, overtime laws, FICA, and more for small business owners and HR professionals.',
    url: `${SITE_URL}/guides`,
    type: 'website',
  },
};

// ─── Guide entries ────────────────────────────────────────────────────────────

const guides = [
  {
    slug: 'time-card-calculator-guide',
    title: 'How to Use a Time Card Calculator: Complete Guide',
    excerpt:
      'Learn how to convert clock-in/out times to decimal hours, handle lunch deductions, and calculate weekly overtime correctly — with worked examples for every scenario.',
    category: 'Time & Attendance',
    icon: Clock,
    color: 'emerald',
    relatedCalculators: [
      { label: 'Time Card Calculator', href: '/calculators/time-card-calculator' },
      { label: 'Time Card with Lunch', href: '/calculators/time-card-calculator-with-lunch' },
    ],
    readTime: '10 min read',
  },
  {
    slug: 'overtime-california-guide',
    title: 'California Overtime Laws: Daily & Weekly OT Rules for 2026',
    excerpt:
      "California's overtime laws are stricter than federal law — daily OT kicks in after 8 hours, and double-time after 12. Here's everything employers and employees need to know.",
    category: 'Legal & Compliance',
    icon: Scale,
    color: 'blue',
    relatedCalculators: [
      { label: 'Overtime Calculator', href: '/calculators/overtime-calculator' },
      { label: 'Time and a Half Calculator', href: '/calculators/time-and-a-half-calculator' },
    ],
    readTime: '12 min read',
  },
  {
    slug: 'fica-tax-guide',
    title: 'FICA Tax Explained: How It\'s Calculated in 2026',
    excerpt:
      'FICA funds Social Security and Medicare. Learn the 2026 wage base, the Additional Medicare Tax, and how self-employed workers calculate their SE tax — with worked examples.',
    category: 'Taxes',
    icon: DollarSign,
    color: 'amber',
    relatedCalculators: [
      { label: 'FICA Tax Calculator', href: '/calculators/fica-tax-calculator' },
      { label: 'Payroll Calculator', href: '/calculators/payroll-calculator' },
    ],
    readTime: '11 min read',
  },
  {
    slug: 'how-to-calculate-payroll-taxes',
    title: 'The Ultimate Guide to Calculating Payroll Taxes in 2026',
    excerpt:
      'A complete walkthrough of FICA, FUTA, SUTA, and federal income tax withholding — with a step-by-step worked example for a $65,000 employee.',
    category: 'Payroll',
    icon: FileText,
    color: 'emerald',
    relatedCalculators: [
      { label: 'Payroll Calculator', href: '/calculators/payroll-calculator' },
      { label: 'After-Tax Income Calculator', href: '/calculators/after-tax-income-calculator' },
    ],
    readTime: '14 min read',
  },
  {
    slug: 'understanding-overtime-pay-laws',
    title: 'Understanding Overtime Pay Laws: A Comprehensive Guide',
    excerpt:
      'Federal FLSA rules, exempt vs. non-exempt classification, how bonuses affect the regular rate, and a state-by-state comparison table for 2026.',
    category: 'Legal & Compliance',
    icon: Scale,
    color: 'blue',
    relatedCalculators: [
      { label: 'Overtime Calculator', href: '/calculators/overtime-calculator' },
      { label: 'Time and a Half Calculator', href: '/calculators/time-and-a-half-calculator' },
    ],
    readTime: '12 min read',
  },
  {
    slug: 'how-to-structure-sales-commission-plan',
    title: 'How to Structure a Sales Commission Plan that Drives Revenue',
    excerpt:
      'From flat rate to tiered to quota-based models — complete with worked examples, accelerator design, clawback provisions, and common mistakes to avoid.',
    category: 'Commission & Compensation',
    icon: TrendingUp,
    color: 'purple',
    relatedCalculators: [
      { label: 'Sales Commission Calculator', href: '/calculators/commission-calculator' },
    ],
    readTime: '13 min read',
  },
  {
    slug: 'hidden-costs-of-employee-turnover',
    title: 'The Hidden Costs of Employee Turnover (And How to Fix It)',
    excerpt:
      'The true cost of losing an employee is 50–200% of their annual salary. Learn the full cost formula, industry benchmarks, and proven retention strategies.',
    category: 'HR Analytics',
    icon: Users,
    color: 'rose',
    relatedCalculators: [
      { label: 'Employee Turnover Calculator', href: '/calculators/employee-turnover-calculator' },
      { label: 'Cost Per Hire Calculator', href: '/calculators/cost-per-hire-calculator' },
    ],
    readTime: '11 min read',
  },
  {
    slug: 'salary-vs-hourly-which-is-better',
    title: 'Salary vs. Hourly Pay: Complete Employer & Employee Guide',
    excerpt:
      'The FLSA exempt vs. non-exempt distinction explained, with a full comparison table, tax implications, and the legal traps that cost employers thousands in back pay.',
    category: 'HR Strategy',
    icon: DollarSign,
    color: 'amber',
    relatedCalculators: [
      { label: 'Salary Converter', href: '/calculators/salary-converter' },
      { label: 'Hourly Paycheck Calculator', href: '/calculators/hourly-paycheck-calculator' },
    ],
    readTime: '12 min read',
  },
  {
    slug: 'contractor-vs-employee-misclassification',
    title: 'Contractor vs. Employee: Avoiding Misclassification in 2026',
    excerpt:
      'The IRS 3-category framework, California AB5 ABC test, real penalty examples, and a best-practices checklist to keep your contractor relationships legally sound.',
    category: 'Legal & Compliance',
    icon: Scale,
    color: 'blue',
    relatedCalculators: [
      { label: 'Payroll Calculator', href: '/calculators/payroll-calculator' },
      { label: 'Wages Calculator', href: '/calculators/wages-calculator' },
    ],
    readTime: '12 min read',
  },
  {
    slug: '5-essential-hr-metrics',
    title: '5 Essential HR Metrics Every Small Business Should Track',
    excerpt:
      'Turnover rate, revenue per employee, cost per hire, utilization rate, and overtime percentage — with industry benchmarks, calculation formulas, and tracking dashboards.',
    category: 'HR Analytics',
    icon: Users,
    color: 'rose',
    relatedCalculators: [
      { label: 'Employee Turnover Calculator', href: '/calculators/employee-turnover-calculator' },
      { label: 'Revenue Per Employee Calculator', href: '/calculators/revenue-per-employee-calculator' },
    ],
    readTime: '13 min read',
  },
  {
    slug: '4-day-work-week-pros-cons',
    title: 'The 4-Day Work Week: Research, Compliance & Implementation Guide',
    excerpt:
      "What the UK, NZ, and Microsoft Japan trials actually showed — plus the FLSA overtime implications, California daily OT risks, and a phased rollout framework for HR managers.",
    category: 'Future of Work',
    icon: Clock,
    color: 'emerald',
    relatedCalculators: [
      { label: 'Time Card Calculator', href: '/calculators/time-card-calculator' },
      { label: 'Revenue Per Employee Calculator', href: '/calculators/revenue-per-employee-calculator' },
    ],
    readTime: '12 min read',
  },
];

const colorMap: Record<string, string> = {
  emerald: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20 hover:bg-emerald-500/15',
  blue: 'bg-blue-500/10 text-blue-700 border-blue-500/20 hover:bg-blue-500/15',
  amber: 'bg-amber-500/10 text-amber-700 border-amber-500/20 hover:bg-amber-500/15',
  purple: 'bg-purple-500/10 text-purple-700 border-purple-500/20 hover:bg-purple-500/15',
  rose: 'bg-rose-500/10 text-rose-700 border-rose-500/20 hover:bg-rose-500/15',
};

const iconBgMap: Record<string, string> = {
  emerald: 'bg-emerald-500/15 text-emerald-600',
  blue: 'bg-blue-500/15 text-blue-600',
  amber: 'bg-amber-500/15 text-amber-600',
  purple: 'bg-purple-500/15 text-purple-600',
  rose: 'bg-rose-500/15 text-rose-600',
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function GuidesPage() {
  const categories = Array.from(new Set(guides.map((g) => g.category)));

  return (
    <AppShell>
      <main id="main-content" className="min-h-screen">
        {/* Hero */}
        <section className="py-16 sm:py-24 text-center px-4">
          <div className="max-w-3xl mx-auto space-y-5">
            <Badge
              variant="outline"
              className="px-3 py-1 bg-emerald-500/10 border-emerald-500/30 text-emerald-600"
            >
              Free Expert Guides
            </Badge>
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-foreground">
              HR &amp; Business{' '}
              <span className="text-emerald-600">Guides</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              In-depth, practical guides on payroll taxes, overtime law, time tracking, FICA, and
              more — written for small business owners and HR professionals who need accurate,
              actionable information.
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <BookOpen className="h-4 w-4" />
                {guides.length} guides
              </span>
              <span>·</span>
              <span>1,500 – 2,500 words each</span>
              <span>·</span>
              <span>Worked examples included</span>
            </div>
          </div>
        </section>

        {/* Guides by category */}
        <section className="max-w-6xl mx-auto px-4 pb-24 space-y-16">
          {categories.map((category) => {
            const categoryGuides = guides.filter((g) => g.category === category);
            return (
              <div key={category}>
                <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                  <span className="h-px flex-1 bg-border/60" />
                  <span>{category}</span>
                  <span className="h-px flex-1 bg-border/60" />
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {categoryGuides.map((guide) => {
                    const Icon = guide.icon;
                    const cardColor = colorMap[guide.color] || colorMap.emerald;
                    const iconBg = iconBgMap[guide.color] || iconBgMap.emerald;
                    return (
                      <Link
                        key={guide.slug}
                        href={`/blog/${guide.slug}`}
                        className={`group block rounded-2xl border p-6 transition-all duration-300 hover:shadow-xl ${cardColor}`}
                      >
                        <div className="space-y-4">
                          {/* Icon + meta */}
                          <div className="flex items-start justify-between">
                            <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${iconBg}`}>
                              <Icon className="h-5 w-5" />
                            </div>
                            <span className="text-xs text-muted-foreground">{guide.readTime}</span>
                          </div>

                          {/* Title */}
                          <h3 className="text-lg font-bold text-foreground group-hover:text-emerald-700 transition-colors leading-snug">
                            {guide.title}
                          </h3>

                          {/* Excerpt */}
                          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                            {guide.excerpt}
                          </p>

                          {/* Related calculators */}
                          <div className="pt-2 border-t border-current/10 space-y-1">
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                              Related Calculators
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {guide.relatedCalculators.map((calc) => (
                                <span
                                  key={calc.href}
                                  className="inline-flex items-center text-xs font-medium bg-background/60 border border-border/50 rounded-full px-2.5 py-0.5 text-foreground/70"
                                >
                                  {calc.label}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Read CTA */}
                          <div className="flex items-center gap-1 text-sm font-semibold group-hover:gap-2 transition-all">
                            Read Guide <ChevronRight className="h-4 w-4" />
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </section>
      </main>
    </AppShell>
  );
}
