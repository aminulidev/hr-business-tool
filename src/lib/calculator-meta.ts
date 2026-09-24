import {
  DollarSign,
  CalendarClock,
  TrendingUp,
  CreditCard,
  Clock,
  Percent,
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
  UserMinus,
  ShieldCheck,
  Landmark,
  AlarmClock,
  Users,
  Briefcase,
  Hourglass,
  Activity,
  Target,
  Moon,
  PartyPopper,
  Zap,
  AlertTriangle,
  FileCheck,
  FileSpreadsheet,
  UserCog,
  Map as MapIcon,
  CalendarCheck,
  CalendarRange,
  HeartPulse,
  Plane,
  LogIn,
  LogOut,
  Clock3,
  Gauge,
  RefreshCw,
  GitCompareArrows,
  PauseCircle,
  Utensils,
  GraduationCap,
  TrendingDown,
  Building,
  Boxes,
  PiggyBank,
  Calculator,
  LineChart,
  Scale,
  Warehouse,
  type LucideIcon,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
// TODO: slug update to target keywords
export type CalculatorSlug =
  | 'commission-calculator'
  | 'pro-rata-calculator'
  | 'salary-increase-calculator'
  | 'overtime-calculator'
  | 'salary-converter'
  | 'payroll-calculator'
  | 'bonus-tax-calculator'
  | 'tax-bracket-calculator'
  | 'after-tax-income-calculator'
  | 'time-card-calculator'
  | 'business-day-calculator'
  | 'profit-margin-calculator'
  | 'roi-calculator'
  | 'discount-calculator'
  | 'property-tax-calculator'
  | 'gross-margin-calculator'
  | 'markup-calculator'
  | 'tax-refund-estimator'
  | 'time-to-decimal-calculator'
  | 'wages-calculator'
  | 'payroll-deduction-calculator'
  | 'salary-tax-calculator'
  | 'time-card-calculator-with-lunch'
  | 'hourly-paycheck-calculator'
  | 'severance-pay-calculator'
  | 'workers-comp-calculator'
  | 'fica-tax-calculator'
  | 'time-and-a-half-calculator'
  | 'employee-turnover-calculator'
  | 'cost-per-hire-calculator'
  | 'billable-hours-calculator'
  | 'revenue-per-employee-calculator'
  | 'pto-accrual-calculator'
  | 'contractor-vs-employee-calculator'
  | 'break-even-calculator'
  | 'cash-flow-forecast-calculator'
  | 'social-security-estimator'
  // Phase 4 expansion: Salary & Pay + Payroll Taxes niche pages
  | 'shift-pay-calculator'
  | 'night-shift-differential-calculator'
  | 'holiday-pay-calculator'
  | 'double-time-calculator'
  | 'hazard-pay-calculator'
  | 'federal-tax-calculator'
  | 'state-tax-calculator'
  | 'w-2-calculator'
  | '1099-calculator'
  | 'self-employment-tax-calculator'
  // Phase 5 expansion: Time & Attendance niche pages
  | 'work-hours-calculator'
  | 'employee-hours-calculator'
  | 'shift-hours-calculator'
  | 'attendance-calculator'
  | 'leave-calculator'
  | 'sick-leave-calculator'
  | 'holiday-countdown-calculator'
  | 'working-hours-calculator'
  | 'timesheet-calculator'
  | 'payroll-hours-calculator'
  | 'clock-in-calculator'
  | 'clock-out-calculator'
  | 'hours-between-times-calculator'
  | 'utilization-rate-calculator'
  | 'employee-schedule-calculator'
  | 'shift-rotation-calculator'
  | 'time-difference-calculator'
  | 'break-calculator'
  | 'lunch-deduction-calculator'
  // Phase 6 expansion: HR Analytics niche pages
  | 'employee-retention-calculator'
  | 'attrition-calculator'
  | 'fte-calculator'
  | 'headcount-calculator'
  | 'cost-of-turnover-calculator'
  | 'labor-cost-calculator'
  | 'employee-productivity-calculator'
  | 'hr-budget-calculator'
  | 'compensation-ratio-calculator'
  | 'time-to-hire-calculator'
  | 'time-to-fill-calculator'
  | 'recruiting-roi-calculator'
  | 'employee-engagement-score-calculator'
  | 'training-cost-calculator'
  | 'employee-cost-calculator'
  | 'absenteeism-calculator'
  | 'replacement-cost-calculator'
  | 'hr-roi-calculator'
  | 'salary-benchmark-calculator'
  | 'employee-benefit-cost-calculator'
  | 'employee-utilization-calculator'
  | 'payroll-cost-calculator'
  | 'workforce-planning-calculator'
  | 'workforce-capacity-calculator'
  | 'span-of-control-calculator'
  | 'diversity-ratio-calculator'
  | 'promotion-rate-calculator'
  | 'internal-mobility-calculator'
  | 'employee-lifetime-value-calculator'
  | 'labor-efficiency-calculator'
  // Phase 7 expansion: Business Finance niche pages
  | 'roe-calculator'
  | 'roa-calculator'
  | 'net-margin-calculator'
  | 'contribution-margin-calculator'
  | 'ebitda-margin-calculator'
  | 'operating-margin-calculator'
  | 'gross-profit-calculator'
  | 'net-profit-calculator'
  | 'selling-price-calculator'
  | 'wholesale-price-calculator'
  | 'retail-margin-calculator'
  | 'burn-rate-calculator'
  | 'runway-calculator'
  | 'budget-calculator'
  | 'working-capital-calculator'
  | 'inventory-turnover-calculator'
  | 'inventory-holding-cost-calculator'
  | 'eoq-calculator'
  | 'safety-stock-calculator'
  | 'reorder-point-calculator'
  | 'debt-ratio-calculator'
  | 'current-ratio-calculator'
  | 'quick-ratio-calculator'
  | 'interest-coverage-ratio-calculator'
  | 'asset-turnover-calculator'
  | 'business-valuation-calculator'
  | 'depreciation-calculator'
  | 'amortization-calculator'
  | 'cash-conversion-cycle-calculator'
  | 'financial-ratio-calculator'
  | 'unit-economics-calculator'
  | 'operating-cash-flow-calculator'
  | 'contribution-calculator'
  // Phase 8 expansion: Sales & Compensation niche pages
  | 'tiered-commission-calculator'
  | 'split-commission-calculator'
  | 'quota-calculator'
  | 'sales-target-calculator'
  | 'sales-bonus-calculator'
  | 'commission-split-calculator'
  | 'incentive-calculator'
  | 'revenue-forecast-calculator'
  | 'sales-forecast-calculator'
  | 'pipeline-calculator'
  | 'win-rate-calculator'
  | 'conversion-rate-calculator'
  | 'lead-cost-calculator'
  | 'customer-acquisition-cost-calculator'
  | 'customer-lifetime-value-calculator'
  | 'cac-payback-calculator'
  | 'marketing-roi-calculator'
  | 'cpl-calculator'
  | 'cpa-calculator'
  | 'cpm-calculator'
  | 'cpc-calculator'
  | 'roas-calculator'
  | 'revenue-growth-calculator'
  | 'customer-retention-calculator'
  // Phase 9 expansion: Freelancer & Agency niche pages
  | 'freelance-hourly-rate-calculator'
  | 'fiverr-fee-calculator'
  | 'upwork-fee-calculator'
  | 'project-pricing-calculator'
  | 'invoice-calculator'
  | 'client-profit-calculator'
  | 'agency-margin-calculator'
  | 'proposal-price-calculator'
  | 'retainer-calculator'
  | 'consultant-fee-calculator'
  | 'billable-rate-calculator'
  | 'profit-per-client-calculator'
  | 'time-value-calculator'
  | 'monthly-revenue-calculator'
  | 'team-cost-calculator'
  | 'quote-calculator'
  | 'estimate-calculator'
  // Phase 10 expansion: Startup & SaaS niche pages
  | 'mrr-calculator'
  | 'arr-calculator'
  | 'churn-rate-calculator'
  | 'expansion-mrr-calculator'
  | 'net-revenue-retention-calculator'
  | 'saas-pricing-calculator'
  | 'ltv-cac-ratio-calculator'
  | 'trial-conversion-calculator'
  | 'free-to-paid-conversion-calculator'
  | 'arpu-calculator'
  | 'acv-calculator'
  | 'gross-revenue-retention-calculator'
  | 'mau-value-calculator'
  | 'startup-valuation-calculator'
  | 'equity-dilution-calculator'
  | 'cap-table-calculator'
  | 'safe-note-calculator'
  | 'option-pool-calculator'
  | 'founder-equity-split-calculator'
  // Phase 11 expansion: Accounting niche pages
  | 'gst-calculator'
  | 'vat-calculator'
  | 'sales-tax-calculator'
  | 'income-tax-calculator'
  | 'straight-line-depreciation-calculator'
  | 'declining-balance-depreciation-calculator'
  | 'journal-entry-calculator'
  | 'trial-balance-calculator'
  | 'balance-sheet-calculator'
  | 'cash-flow-statement-calculator'
  | 'pnl-calculator'
  | 'inventory-valuation-calculator'
  | 'fifo-calculator'
  | 'lifo-calculator'
  | 'weighted-average-cost-calculator'
  | 'accounts-receivable-days-calculator'
  | 'accounts-payable-days-calculator'
  | 'book-value-calculator'
  | 'fixed-asset-calculator'
  | 'cost-allocation-calculator'
  | 'overhead-rate-calculator'
  | 'manufacturing-cost-calculator'
  | 'cogs-calculator'
  | 'operating-expense-ratio-calculator';

export interface CalculatorMeta {
  slug: CalculatorSlug;
  title: string;
  metaTitle?: string; // High-CTR custom <title> for SERP
  shortDescription: string; // Used on hub cards
  metaDescription: string; // Used in <meta name="description">
  keywords: string[]; // Target keywords for SEO
  icon: LucideIcon;
  tier: 'tier1' | 'tier2' | 'tier3';
  category: string; // Hub section label
  path: string; // Full URL path e.g. /calculators/sales-commission
  status?: 'published' | 'draft' | 'scheduled';
  publishDate?: string; // YYYY-MM-DD
}

// ---------------------------------------------------------------------------
// Site-wide constants
// ---------------------------------------------------------------------------

export const SITE_URL = 'https://www.quickbizcalc.com';
export const SITE_NAME = 'QuickBizCalc';
export const SITE_TAGLINE = 'Free Online Business & HR Calculators';
export const CONTACT_EMAIL = 'quickbizcalc@gmail.com';

// Category display metadata — order matters for hub page
// Category order: highest-demand categories first (by search volume, CPC, and calculator count)
export const categoryOrder = [
  'Payroll & Taxes',
  'Salary & Compensation',
  'Accounting',
  'HR Analytics',
  'Commission & Compensation',
  'Business Finance',
  'Time & Attendance',
  'Sales & Compensation',
  'Freelancer & Agency',
  'Startup & SaaS',
] as const;

export const categoryMeta: Record<string, { emoji: string; description: string }> = {
  'Accounting': {
    emoji: '📑',
    description: 'Bookkeeping, depreciation, financial statements, taxes, and cost accounting',
  },
  'Commission & Compensation': {
    emoji: '\uD83D\uDD25',
    description: 'Calculate earnings, commissions, and convert between pay rates',
  },
  'Salary & Compensation': {
    emoji: '\uD83D\uDCB0',
    description: 'Tools for salary analysis, raises, overtime, and prorated pay',
  },
  'HR Analytics': {
    emoji: '\uD83D\uDCCA',
    description: 'Workforce metrics, severance pay, workers comp, and hiring costs',
  },
  'Payroll & Taxes': {
    emoji: '\uD83D\uDCB3',
    description: 'Estimate take-home pay, tax brackets, and withholding',
  },
  'Time & Attendance': {
    emoji: '\u23F0',
    description: 'Track work hours, time-to-decimal, and business day counting',
  },
  'Sales & Compensation': {
    emoji: '\uD83D\uDCB8',
    description: 'Sales commissions, quotas, pipeline, CAC, LTV, and marketing ROI',
  },
  'Freelancer & Agency': {
    emoji: '\uD83D\uDCBC',
    description: 'Freelance rates, project pricing, agency margins, and platform fees',
  },
  'Startup & SaaS': {
    emoji: '\uD83D\uDD25',
    description: 'MRR, ARR, churn, LTV:CAC, SaaS metrics, startup valuation, and cap table',
  },
  'Business Finance': {
    emoji: '\uD83D\uDCC8',
    description: 'Pricing, margins, ROI, discounts, and investment analysis',
  },
};

// ---------------------------------------------------------------------------
// Calculator metadata registry — single source of truth
// ---------------------------------------------------------------------------

export const calculators: CalculatorMeta[] = [
  // ── Commission & Compensation ──
  {
    slug: 'commission-calculator',
    status: 'published',
    title: 'Sales Commission Calculator',
    metaTitle: 'Free Sales Commission Calculator 2026 — Tiered, Split & Quota Plans',
    shortDescription:
      'Calculate take-home commission from flat rates, tiered structures, and quota-based plans with deductions and visual charts.',
    metaDescription:
      'Free sales commission calculator 2026. Calculate earnings from flat, tiered, quota attainment, and split-commission plans. Includes deductions, accelerators, and visual earnings charts.',
    keywords: [
      'commission calculator',
      'sales commission calculator',
      'commission calculator',
      'how to calculate sales commission',
      'tiered commission calculator',
      'quota attainment calculator',
      'commission with deductions',
      'real estate commission calculator',
      'SaaS commission calculator',
      'base salary plus commission calculator',
      'commission accelerator calculator',
      'net commission calculator',
      'sales rep compensation calculator',
      'commission formula',
      'calculate commission from sales',
    ],
    icon: DollarSign,
    tier: 'tier1',
    category: 'Commission & Compensation',
    path: '/calculators/commission-calculator',
  },
  {
    slug: 'salary-converter',
    status: 'published',
    title: 'Salary Converter Calculator',
    metaTitle: 'Free Salary Converter 2026 — Hourly / Weekly / Monthly / Annual',
    shortDescription:
      'Convert between hourly, daily, weekly, bi-weekly, semi-monthly, monthly, and annual salary rates instantly.',
    metaDescription:
      'Free salary converter 2026. Instantly convert pay between hourly, daily, weekly, bi-weekly, semi-monthly, monthly, and annual rates. Includes overtime adjustment and 2,080-hour assumption.',
    keywords: [
      'salary converter',
      'hourly to salary calculator',
      'salary converter',
      'hourly to salary calculator',
      'salary to hourly calculator',
      'hourly rate calculator',
      'hourly pay calculator',
      'hourly wage calculator',
      'salary calculator',
      'monthly salary calculator',
      'yearly salary calculator',
      'annual salary calculator',
      'hourly rate to salary',
      'convert hourly to annual salary',
      'weekly salary calculator',
      'biweekly to annual salary',
      'wages calculator',
    ],
    icon: ArrowLeftRight,
    tier: 'tier1',
    category: 'Commission & Compensation',
    path: '/calculators/salary-converter',
  },

  // ── Salary & Compensation ──
  {
    slug: 'pro-rata-calculator',
    status: 'published',
    title: 'Pro Rata Salary Calculator',
    metaTitle: 'Free Pro Rata Salary Calculator 2026 — Mid-Year Start & Part-Time',
    shortDescription:
      'Calculate prorated salary when an employee starts mid-year, works part-time, or is on a fixed-term contract.',
    metaDescription:
      'Free pro rata salary calculator 2026. Calculate prorated pay for mid-year hires, part-time employees, and contract workers. See daily rate, percent of full salary, and full worked example.',
    keywords: [
      'pro rata calculator',
      'pro rata salary calculator',
      'pro rata salary calculator',
      'pro rata calculator',
      'prorated salary calculator',
      'how to calculate pro rata salary',
      'pro rata part time salary',
      'mid year start salary calculator',
      'prorated pay calculator',
      'contract salary calculator',
      'pro rata annual salary',
      'pro rata daily rate calculator',
    ],
    icon: CalendarClock,
    tier: 'tier1',
    category: 'Salary & Compensation',
    path: '/calculators/pro-rata-calculator',
  },
  {
    slug: 'salary-increase-calculator',
    status: 'published',
    title: 'Salary Increase Calculator',
    metaTitle: 'Free Salary Increase Calculator 2026 — Raise %, Inflation Adjusted',
    shortDescription:
      'See what a percentage raise looks like in actual paycheck dollars, with inflation adjustment and future projections.',
    metaDescription:
      'Free salary increase calculator 2026. See exactly how a percentage raise affects your paycheck. Compare gross and net before/after, adjust for inflation, and project 5-year compound growth.',
    keywords: [
      'salary increase calculator',
      'salary increase calculator',
      'raise calculator',
      'percentage raise calculator',
      'how much is my raise worth',
      'salary raise to dollar amount',
      'salary after raise calculator',
      'pay raise calculator percentage',
      'inflation adjusted salary calculator',
      'salary growth calculator',
      'cost of living raise calculator',
      'merit increase calculator',
      'annual salary increase calculator',
    ],
    icon: TrendingUp,
    tier: 'tier1',
    category: 'Salary & Compensation',
    path: '/calculators/salary-increase-calculator',
  },
  {
    slug: 'overtime-calculator',
    status: 'published',
    title: 'Overtime Calculator',
    metaTitle: 'Free Overtime Calculator 2026 — Time-and-a-Half & Double-Time Pay',
    shortDescription:
      'Calculate overtime pay with standard time-and-a-half and double-time rates, weekly and daily tracking with state-specific rules.',
    metaDescription:
      'Free overtime calculator 2026. Calculate overtime pay at 1.5x time-and-a-half and 2x double-time rates. Includes FLSA weekly rules, California daily overtime, and effective hourly rate.',
    keywords: [
      'overtime calculator',
      'overtime calculator',
      'overtime pay calculator',
      'time and a half calculator',
      'overtime hours calculator',
      'how to calculate overtime pay',
      'double time calculator',
      'overtime rate calculator',
      'weekly overtime calculator',
      'FLSA overtime calculator',
      'overtime wage calculator',
      '1.5x pay calculator',
      'overtime earnings calculator',
    ],
    icon: Timer,
    tier: 'tier1',
    category: 'Salary & Compensation',
    path: '/calculators/overtime-calculator',
  },

  // ── Payroll & Taxes ──
  {
    slug: 'payroll-calculator',
    status: 'published',
    title: 'Payroll & Paycheck Calculator',
    metaTitle: 'Free Payroll Calculator 2026 — Net Paycheck, Taxes & Deductions',
    shortDescription:
      'Estimate your take-home pay after federal and state taxes, deductions, and benefits contributions.',
    metaDescription:
      'Free payroll calculator 2026. Estimate take-home pay after federal, state, and FICA taxes plus 401(k), HSA, and insurance deductions. Supports weekly, bi-weekly, semi-monthly, and monthly pay.',
    keywords: [
      'payroll calculator',
      'online payroll calculator',
      'free paycheck calculator',
      'payroll calculator',
      'paycheck calculator',
      'take home pay calculator',
      'net pay calculator',
      'salary after taxes calculator',
      'employee payroll calculator',
      'biweekly paycheck calculator',
      'monthly take home pay calculator',
      'online payroll calculator',
      'calculate my paycheck',
      'payroll tax calculator',
      'free paycheck calculator',
      'payroll deduction calculator',
      'payroll deductions online calculator',
      'hourly paycheck calculator',
      'paycheck tax calculator',
      'tax withholding calculator',
    ],
    icon: CreditCard,
    tier: 'tier2',
    category: 'Payroll & Taxes',
    path: '/calculators/payroll-calculator',
  },
  {
    slug: 'bonus-tax-calculator',
    status: 'published',
    title: 'Post-Tax & Bonus Calculator',
    metaTitle: 'Free Bonus Tax Calculator 2026 — Federal Supplemental Withholding',
    shortDescription:
      'Calculate your net bonus after federal and state tax withholding, or find your gross bonus from a desired net amount.',
    metaDescription:
      'Free bonus tax calculator 2026. Calculate take-home bonus after the 22% federal supplemental rate, state tax, and FICA. Reverse mode: find gross bonus for a target net amount.',
    keywords: [
      'bonus tax calculator',
      'bonus tax calculator',
      'after tax bonus calculator',
      'net bonus calculator',
      'bonus withholding calculator',
      'how much tax on bonus',
      'supplemental tax rate calculator',
      'gross up bonus calculator',
      'bonus paycheck calculator',
      'federal tax on bonus calculator',
      'reverse bonus calculator',
      'supplemental wage calculator',
      'bonus after taxes',
    ],
    icon: Gift,
    tier: 'tier2',
    category: 'Payroll & Taxes',
    path: '/calculators/bonus-tax-calculator',
  },
  {
    slug: 'tax-bracket-calculator',
    status: 'published',
    title: 'Tax Bracket Calculator',
    metaTitle: 'Free Tax Bracket Calculator 2026 — Federal Marginal & Effective Rate',
    shortDescription:
      'Find your federal tax bracket, effective tax rate, and marginal rate with a detailed breakdown of taxes owed by bracket.',
    metaDescription:
      'Free 2026 federal tax bracket calculator. Find your marginal and effective tax rate for single, married, or head of household. See tax owed by bracket with full breakdown and examples.',
    keywords: [
      'tax bracket calculator',
      'tax bracket calculator',
      'effective tax rate calculator',
      'marginal tax rate calculator',
      'federal income tax calculator',
      'income tax calculator',
      'taxable income calculator',
      'federal tax calculator',
      'tax rate calculator',
      'irs tax calculator',
      'federal income tax rate calculator',
      'tax bracket 2025',
      'what tax bracket am I in',
      'reverse tax calculator',
      'salary tax calculator',
      'tax deduction calculator',
      'tax credit calculator',
      'lottery tax calculator',
      'dividend tax calculator',
      'state tax calculator',
      'online tax calculator',
      'simple tax calculator',
      'tax refund estimator',
      'tax return calculator',
      'paye tax calculator',
      'tax calculator',
    ],
    icon: FileText,
    tier: 'tier2',
    category: 'Payroll & Taxes',
    path: '/calculators/tax-bracket-calculator',
  },
  {
    slug: 'after-tax-income-calculator',
    status: 'published',
    title: 'After-Tax Income Calculator',
    metaTitle: 'Free After-Tax Income Calculator 2026 — Net Take-Home Pay',
    shortDescription:
      'Calculate your net income after federal and state taxes with a detailed breakdown of tax savings and take-home pay.',
    metaDescription:
      'Free after-tax income calculator 2026. See your true net take-home pay after federal tax, state tax, FICA, and deductions. Compare gross vs net across all 50 states with full breakdown.',
    keywords: [
      'after tax income calculator',
      'after tax calculator',
      'pay after tax',
      'net salary calculator',
      'after tax income calculator',
      'salary after tax calculator',
      'salary after tax',
      'net salary calculator',
      'take home salary calculator',
      'pay after tax',
      'after tax calculator',
      'net income calculator',
      'salary paycheck calculator',
      'how much take home pay',
      'gross to net income calculator',
      'after tax take home calculator',
      '45000 after tax',
      '40k after tax',
    ],
    icon: Wallet,
    tier: 'tier2',
    category: 'Payroll & Taxes',
    path: '/calculators/after-tax-income-calculator',
  },

  // ── Time & Attendance ──
  {
    slug: 'time-card-calculator',
    status: 'published',
    title: 'Time Card & Time-to-Decimal Calculator',
    metaTitle: 'Free Time Card Calculator 2026 — Weekly Hours & Decimal Payroll',
    shortDescription:
      'Calculate total work hours from clock-in/out times, deduct breaks, and convert to decimal format for payroll.',
    metaDescription:
      'Free weekly time card calculator. Enter clock-in and clock-out times to calculate daily hours, weekly totals, overtime pay, and decimal conversion for payroll entry. Print-ready timesheets.',
    keywords: [
      'time card calculator',
      'time card calculator',
      'time to decimal calculator',
      'hours calculator from time',
      'work hours calculator',
      'time clock calculator',
      'decimal hours calculator',
      'convert time to decimal hours',
      'time card hours calculator',
      'clock in clock out calculator',
      'payroll time calculator',
      'time sheet calculator',
      'minutes to decimal converter',
      'decimal calculator',
      'fraction to decimal calculator',
      'decimal to fraction calculator',
      'time card calculator with lunch',
      'payroll hours calculator',
    ],
    icon: Clock,
    tier: 'tier2',
    category: 'Time & Attendance',
    path: '/calculators/time-card-calculator',
  },
  {
    slug: 'business-day-calculator',
    status: 'published',
    title: 'Business Day Calculator',
    metaTitle: 'Free Business Day Calculator 2026 — Add or Subtract Working Days',
    shortDescription:
      'Calculate business days between two dates, or add/subtract business days from a start date, excluding weekends and holidays.',
    metaDescription:
      'Free business day calculator. Add or subtract working days from any date, skip weekends and US federal holidays, and get exact delivery, payment, or contract due dates instantly.',
    keywords: [
      'business day calculator',
      'business day calculator',
      'working days calculator',
      'business days between dates',
      'workday calculator',
      'add business days',
      'exclude weekends calculator',
      'count business days',
      'business days from date',
      'working days between two dates',
      'net working days calculator',
      'business day counter',
    ],
    icon: CalendarDays,
    tier: 'tier2',
    category: 'Time & Attendance',
    path: '/calculators/business-day-calculator',
  },

  // ── Business Finance ──
  {
    slug: 'profit-margin-calculator',
    status: 'published',
    title: 'Profit Margin & Markup Calculator',
    metaTitle: 'Free Profit Margin Calculator 2026 — Formula, Examples, Benchmarks',
    shortDescription:
      'Calculate retail pricing, profit margins, and markup percentages from wholesale costs and selling prices.',
    metaDescription:
      'Free profit margin calculator 2026. Calculate net, gross, and operating margin with full formula, worked examples for retail, SaaS, and services, and industry benchmarks. No signup.',
    keywords: [
      'profit margin calculator',
      'omni margin calculator',
      'margin calculator',
      'profit margin calculator',
      'markup calculator',
      'profit margin vs markup calculator',
      'gross profit calculator',
      'retail price calculator',
      'selling price calculator',
      'profit percentage calculator',
      'business profit calculator',
      'wholesale to retail calculator',
      'pricing calculator business',
      'margin vs markup',
      'cost price selling price calculator',
      'omni margin calculator',
      'gross margin calculator',
      'markup formula',
    ],
    icon: Percent,
    tier: 'tier2',
    category: 'Business Finance',
    path: '/calculators/profit-margin-calculator',
  },
  {
    slug: 'roi-calculator',
    status: 'published',
    title: 'ROI Calculator',
    metaTitle: 'Free ROI Calculator 2026 — Return on Investment Formula & Examples',
    shortDescription:
      'Calculate Return on Investment from initial cost, final value, and time period with annualized returns.',
    metaDescription:
      'Free ROI calculator 2026. Calculate return on investment with full formula, annualized ROI, NPV, and IRR. Worked examples for marketing campaigns, real estate, and equipment purchases.',
    keywords: [
      'roi calculator',
      'roi formula',
      'ROI calculator',
      'return on investment calculator',
      'investment return calculator',
      'ROI percentage calculator',
      'annualized return calculator',
      'net profit calculator',
      'investment calculator',
      'business ROI calculator',
      'marketing ROI calculator',
      'rate of return calculator',
      'profit on investment calculator',
      'investment gain calculator',
    ],
    icon: BarChart3,
    tier: 'tier2',
    category: 'Business Finance',
    path: '/calculators/roi-calculator',
  },
  {
    slug: 'discount-calculator',
    status: 'published',
    title: 'Discount Calculator',
    metaTitle: 'Free Discount Calculator 2026 — Sale Price, Stack Discounts, Tax',
    shortDescription:
      'Calculate sale prices, discount amounts, and savings from percentage or fixed discounts. Compare original vs. discounted prices.',
    metaDescription:
      'Free discount calculator 2026. Calculate sale price from original price and discount %. Stack multiple discounts (10% + 15%), include sales tax, and reverse-mode to find original price.',
    keywords: [
      'discount calculator',
      'discount formula',
      'discount calculator',
      'percentage discount calculator',
      'sale price calculator',
      'discount formula',
      'how to calculate discount',
      'price after discount',
      'discount amount calculator',
      'calculate percentage off',
      'original price calculator',
      'double discount calculator',
      'markup and discount calculator',
      'retail discount calculator',
      'decimal to percent calculator',
    ],
    icon: Tag,
    tier: 'tier2',
    category: 'Business Finance',
    path: '/calculators/discount-calculator',
  },

  // ── NEW: Property Tax ──
  {
    slug: 'property-tax-calculator',
    status: 'published',
    title: 'Property Tax Calculator',
    metaTitle: 'Free Property Tax Calculator 2026 — Annual, Monthly Escrow & Appeal',
    shortDescription:
      'Estimate your annual property tax from assessed value, tax rate, and exemptions. Compare effective rates across jurisdictions.',
    metaDescription:
      'Free property tax calculator 2026. Estimate annual property tax from assessed value and mill rate. See monthly escrow payment, 5-year projection, and appeal-process guidance for high-tax areas.',
    keywords: [
      'property tax calculator',
      'property tax calculator',
      'land transfer tax calculator',
      'property tax estimator',
      'real estate tax calculator',
      'home tax calculator',
      'property tax rate calculator',
      'assessed value calculator',
      'millage rate calculator',
    ],
    icon: Building2,
    tier: 'tier2',
    category: 'Payroll & Taxes',
    path: '/calculators/property-tax-calculator',
  },

  // ── NEW: Gross Margin ──
  {
    slug: 'gross-margin-calculator',
    status: 'published',
    title: 'Gross Margin Calculator',
    metaTitle: 'Free Gross Margin Calculator 2026 — COGS, Markup, Benchmarks',
    shortDescription:
      'Calculate gross margin, gross profit, and COGS from revenue and cost of goods sold with detailed financial analysis.',
    metaDescription:
      'Free gross margin calculator 2026. Calculate gross profit margin from revenue and COGS. See markup %, industry benchmarks (retail, SaaS, grocery), and break-even point instantly.',
    keywords: [
      'gross margin calculator',
      'gross margin calculator',
      'gross profit calculator',
      'gross profit margin formula',
      'cogs calculator',
      'cost of goods sold calculator',
      'gross margin percentage calculator',
      'gross profit analysis',
      'product profitability calculator',
    ],
    icon: PieChart,
    tier: 'tier2',
    category: 'Business Finance',
    path: '/calculators/gross-margin-calculator',
  },

  // ── NEW: Markup ──
  {
    slug: 'markup-calculator',
    status: 'published',
    title: 'Markup Calculator',
    metaTitle: 'Free Markup Calculator 2026 — Markup vs Margin, Keystone Pricing',
    shortDescription:
      'Calculate selling price from cost and desired markup percentage, with margin vs markup comparison and multi-tier pricing.',
    metaDescription:
      'Free markup calculator 2026. Calculate markup percentage from cost, see side-by-side margin conversion, use keystone (2x) quick button, and benchmark against retail industry standards.',
    keywords: [
      'markup calculator',
      'markup formula',
      'markup calculator',
      'markup formula',
      'cost based pricing calculator',
      'markup percentage calculator',
      'selling price from cost calculator',
      'price markup calculator',
      'wholesale markup calculator',
      'retail markup calculator',
    ],
    icon: Package,
    tier: 'tier2',
    category: 'Business Finance',
    path: '/calculators/markup-calculator',
  },

  // ── NEW: Tax Refund ──
  {
    slug: 'tax-refund-estimator',
    status: 'published',
    title: 'Tax Refund Calculator',
    metaTitle: 'Free Tax Refund Estimator 2026 — Federal Refund or Balance Due',
    shortDescription:
      'Estimate your federal and state tax refund based on income, withholding, deductions, and filing status.',
    metaDescription:
      'Free 2026 tax refund estimator. Estimate your federal refund or balance due from income, withholding, dependents, and credits (CTC, EITC, education). See prior-year comparison instantly.',
    keywords: [
      'tax refund estimator',
      'tax refund calculator 2022 2023',
      'tax refund estimator',
      'tax return calculator',
      'tax refund calculator',
      'estimate tax refund',
      'tax refund calculator 2025',
      'how much will my tax refund be',
      'federal tax refund estimator',
      'tax return estimate',
      'income tax refund calculator',
      'refund anticipation calculator',
    ],
    icon: Receipt,
    tier: 'tier2',
    category: 'Payroll & Taxes',
    path: '/calculators/tax-refund-estimator',
  },

  // ── NEW: Decimal Converter ──
  {
    slug: 'time-to-decimal-calculator',
    status: 'published',
    title: 'Decimal & Fraction Converter',
    metaTitle: 'Free Time to Decimal Calculator 2026 — Payroll Hours Conversion',
    shortDescription:
      'Convert between decimals, fractions, percentages, and time formats instantly. Essential for payroll and math calculations.',
    metaDescription:
      'Free time to decimal calculator 2026. Convert clock time (HH:MM) to decimal hours for payroll entry. Batch mode for multiple entries, reverse mode decimal to HH:MM, and minutes-to-decimal tool.',
    keywords: [
      'time to decimal calculator',
      'decimal calculator',
      'decimal converter',
      'fraction to decimal calculator',
      'decimal to fraction calculator',
      'decimal to percent calculator',
      'percent to decimal calculator',
      'fraction converter',
      'decimal to fraction converter',
      'repeating decimal to fraction',
      'mixed number to decimal',
      'improper fraction calculator',
    ],
    icon: Hash,
    tier: 'tier2',
    category: 'Time & Attendance',
    path: '/calculators/time-to-decimal-calculator',
  },

  // ── NEW: Wages ──
  {
    slug: 'wages-calculator',
    status: 'published',
    title: 'Wages Calculator',
    metaTitle: 'Free Wages Calculator 2026 — Hourly to Annual Pay Conversion',
    shortDescription:
      'Calculate gross and net wages from hours worked and hourly rate, including overtime and multiple pay rates.',
    metaDescription:
      'Free wages calculator 2026. Convert hourly rate to weekly, bi-weekly, semi-monthly, monthly, and annual wages. Includes overtime, FICA, and net take-home pay estimate.',
    keywords: [
      'wages calculator',
      'hourly wage calculator',
      'wages calculator',
      'wage calculator',
      'gross wages calculator',
      'net wages calculator',
      'hourly wage calculator',
      'weekly wage calculator',
      'earnings calculator hourly',
      'total wages earned calculator',
      'pay rate calculator',
      'wage calculator from hours',
    ],
    icon: Banknote,
    tier: 'tier2',
    category: 'Salary & Compensation',
    path: '/calculators/wages-calculator',
  },

  // ── NEW: Payroll Deduction ──
  {
    slug: 'payroll-deduction-calculator',
    status: 'published',
    title: 'Payroll Deduction Calculator',
    metaTitle: 'Free Payroll Deduction Calculator 2026 — 401(k), HSA, FSA, Insurance',
    shortDescription:
      'Calculate detailed paycheck deductions including federal tax, state tax, Social Security, Medicare, insurance, and retirement contributions.',
    metaDescription:
      'Free payroll deduction calculator. Calculate take-home pay after 401(k), HSA, FSA, health, dental, vision, life insurance, and garnishment deductions. See per-paycheck and annual impact.',
    keywords: [
      'payroll deduction calculator',
      'payroll deductions online calculator',
      'payroll deduction calculator',
      'payroll deductions online calculator',
      'paycheck deduction calculator',
      'salary deduction calculator',
      'pretax deduction calculator',
      'after tax deduction calculator',
      'payroll deductions estimator',
      'fica deduction calculator',
      'benefits deduction calculator',
      '401k deduction calculator',
    ],
    icon: FileMinus,
    tier: 'tier2',
    category: 'Payroll & Taxes',
    path: '/calculators/payroll-deduction-calculator',
  },

  // ── NEW: Salary Tax ──
  {
    slug: 'salary-tax-calculator',
    status: 'published',
    title: 'Salary Tax Calculator',
    metaTitle: 'Free Salary Tax Calculator 2026 — Take-Home Pay by State',
    shortDescription:
      'Calculate total tax on your salary including federal, state, FICA, and local taxes with a comprehensive breakdown by tax type.',
    metaDescription:
      'Free salary tax calculator 2026. Calculate your net take-home pay from gross annual salary after federal tax, state tax, FICA, and deductions. See monthly, bi-weekly, and 401(k) impact.',
    keywords: [
      'salary tax calculator',
      'salary after tax calculator',
      'salary paycheck calculator',
      'salary tax calculator',
      'reverse tax calculator',
      'how much tax on my salary',
      'salary tax breakdown',
      'total tax on salary calculator',
      'effective salary tax rate',
      'gross to net salary calculator',
      'tax as percentage of salary',
      'salary after all taxes',
      'combined tax rate calculator',
    ],
    icon: Shield,
    tier: 'tier2',
    category: 'Payroll & Taxes',
    path: '/calculators/salary-tax-calculator',
  },

  // ── NEW: Time Card with Lunch ──
  {
    slug: 'time-card-calculator-with-lunch',
    status: 'published',
    title: 'Time Card Calculator with Lunch',
    metaTitle: 'Free Time Card Calculator with Lunch 2026 — Weekly Timesheet',
    shortDescription:
      'Calculate total work hours with automatic lunch break deduction. Supports multiple in/out entries per day and weekly totals.',
    metaDescription:
      'Free time card calculator with lunch break. Track clock-in/out times, auto-deduct lunch, calculate regular and overtime hours, and export a clean printable weekly timesheet in seconds.',
    keywords: [
      'time card calculator with lunch',
      'time card calculator with lunch',
      'time card with lunch break',
      'work hours calculator with lunch',
      'hours calculator minus lunch',
      'time card lunch deduction',
      'weekly time card calculator',
      'employee time tracker with lunch',
      'clock in clock out with lunch',
      'work hours minus break',
      'time sheet with lunch break',
    ],
    icon: Coffee,
    tier: 'tier2',
    category: 'Time & Attendance',
    path: '/calculators/time-card-calculator-with-lunch',
  },

  // ── NEW: Hourly Paycheck ──
  {
    slug: 'hourly-paycheck-calculator',
    status: 'published',
    title: 'Hourly Paycheck Calculator',
    metaTitle: 'Free Hourly Paycheck Calculator 2026 — Take-Home Pay After Taxes',
    shortDescription:
      'Calculate your hourly paycheck after taxes and deductions. See net pay per hour, per week, and per year with full breakdown.',
    metaDescription:
      'Free hourly paycheck calculator 2026. Calculate your net take-home pay after federal tax, state tax, FICA, and deductions. See annual, monthly, and bi-weekly take-home in seconds.',
    keywords: [
      'hourly paycheck calculator',
      'adp hourly calculator',
      'hourly pay calculator',
      'hourly paycheck calculator',
      'free paycheck calculator',
      'net hourly pay calculator',
      'hourly take home pay calculator',
      'hourly paycheck after taxes',
      'hourly rate net pay calculator',
      'hourly employee paycheck calculator',
      'hourly wage after tax calculator',
      'biweekly hourly paycheck calculator',
      'hourly net pay estimator',
    ],
    icon: BadgeDollarSign,
    tier: 'tier2',
    category: 'Payroll & Taxes',
    path: '/calculators/hourly-paycheck-calculator',
  },

  // ── HR Analytics ──
  {
    slug: 'severance-pay-calculator',
    status: 'published',
    title: 'Severance Pay Calculator',
    metaTitle: 'Free Severance Pay Calculator 2026 — Weeks of Pay & Tax Withholding',
    shortDescription:
      'Calculate total severance pay based on salary, years of service, and company multiplier. Includes monthly equivalent and tax estimate.',
    metaDescription:
      'Free severance pay calculator 2026. Estimate severance based on years of service, weekly pay, and state rules. See supplemental tax withholding and COBRA continuation cost projection.',
    keywords: [
      'severance pay calculator',
      'severance calculator',
      'how to calculate severance pay',
      'severance package calculator',
      'severance pay formula',
      'weeks of severance calculator',
      'severance pay per year of service',
      'layoff severance calculator',
      'severance pay estimator',
      'how much severance am I owed',
      'severance agreement calculator',
      'separation pay calculator',
    ],
    icon: UserMinus,
    tier: 'tier1',
    category: 'HR Analytics',
    path: '/calculators/severance-pay-calculator',
  },
  {
    slug: 'workers-comp-calculator',
    status: 'published',
    title: 'Workers Comp Calculator',
    metaTitle: 'Free Workers Comp Calculator 2026 — Annual Premium Estimate',
    shortDescription:
      'Estimate your annual workers compensation insurance premium from payroll, class code rate, and experience modification factor.',
    metaDescription:
      'Free workers comp calculator 2026. Estimate annual workers compensation premium from payroll and class code rate. See per-$100 payroll cost, experience mod impact, and 5-year projection.',
    keywords: [
      'workers comp calculator',
      'workers compensation calculator',
      'workers comp premium calculator',
      'workers comp rate calculator',
      'workers compensation insurance calculator',
      'experience mod calculator',
      'EMR workers comp calculator',
      'workers comp cost per employee',
      'workers comp rate per 100',
      'class code rate calculator',
      'employer workers compensation cost',
    ],
    icon: ShieldCheck,
    tier: 'tier1',
    category: 'HR Analytics',
    path: '/calculators/workers-comp-calculator',
  },
  {
    slug: 'fica-tax-calculator',
    status: 'published',
    title: 'FICA Tax Calculator',
    metaTitle: 'Free FICA Tax Calculator 2026 — Social Security & Medicare',
    shortDescription:
      'Calculate Social Security and Medicare FICA taxes for employees and self-employed individuals with a full employer/employee breakdown.',
    metaDescription:
      'Free FICA tax calculator 2026. Calculate Social Security (6.2% up to $176,100 wage base) and Medicare (1.45%) employee withholding. Includes employer match and self-employment SECA tax.',
    keywords: [
      'FICA tax calculator',
      'social security tax calculator',
      'medicare tax calculator',
      'self employment tax calculator',
      'FICA calculator',
      'payroll tax calculator FICA',
      'how to calculate FICA',
      'social security withholding calculator',
      'additional medicare tax calculator',
      'FICA withholding calculator',
      'employer FICA calculator',
      'self employed FICA tax',
    ],
    icon: Landmark,
    tier: 'tier1',
    category: 'Payroll & Taxes',
    path: '/calculators/fica-tax-calculator',
  },
  {
    slug: 'time-and-a-half-calculator',
    status: 'published',
    title: 'Time and a Half Calculator',
    metaTitle: 'Free Time-and-a-Half Calculator 2026 — Overtime Pay Rate',
    shortDescription:
      'Calculate overtime pay at 1.5× your regular rate. Enter your hourly wage and OT hours to instantly see your time and a half earnings.',
    metaDescription:
      'Free time-and-a-half calculator. Instantly calculate 1.5x overtime pay for any hourly rate and hours worked. See gross overtime pay, FLSA compliance, and double-time comparison.',
    keywords: [
      'time and a half calculator',
      'time and a half pay calculator',
      'overtime 1.5x calculator',
      'time and a half rate calculator',
      'how to calculate time and a half',
      'overtime pay rate calculator',
      '1.5 times pay calculator',
      'time and a half hourly rate',
      'overtime earnings calculator',
      'FLSA overtime calculator',
      'time and half pay formula',
    ],
    icon: AlarmClock,
    tier: 'tier1',
    category: 'Salary & Compensation',
    path: '/calculators/time-and-a-half-calculator',
  },
  {
    slug: 'employee-turnover-calculator',
    status: 'published',
    title: 'Employee Turnover Rate Calculator',
    metaTitle: 'Free Employee Turnover Calculator 2026 — Rate & Cost of Attrition',
    shortDescription:
      'Calculate your employee turnover rate, retention rate, and estimated cost of attrition with industry benchmark comparisons.',
    metaDescription:
      'Free employee turnover rate calculator. Calculate your organization\'s annual turnover rate and retention rate from headcount and separation data. Estimate the financial cost of employee attrition and compare to industry benchmarks.',
    keywords: [
      'employee turnover rate calculator',
      'staff turnover calculator',
      'employee attrition calculator',
      'turnover rate formula',
      'how to calculate employee turnover',
      'annual turnover rate calculator',
      'employee retention rate calculator',
      'cost of employee turnover calculator',
      'workforce turnover calculator',
      'HR turnover metrics',
    ],
    icon: Users,
    tier: 'tier2',
    category: 'HR Analytics',
    path: '/calculators/employee-turnover-calculator',
  },
  {
    slug: 'cost-per-hire-calculator',
    status: 'published',
    title: 'Cost per Hire Calculator',
    metaTitle: 'Free Cost Per Hire Calculator 2026 — Recruiting ROI & SHRM Benchmark',
    shortDescription:
      'Calculate your average cost per hire from internal and external recruiting costs. See total spend breakdown and cost benchmarks.',
    metaDescription:
      'Free cost per hire calculator. Calculate your organization\'s recruiting cost per hire by entering internal HR costs, external agency and advertising expenses, and total hires. Compare to SHRM benchmarks and identify cost-saving opportunities.',
    keywords: [
      'cost per hire calculator',
      'recruiting cost calculator',
      'cost of hiring calculator',
      'HR cost per hire',
      'how to calculate cost per hire',
      'recruiting ROI calculator',
      'hiring cost estimator',
      'talent acquisition cost calculator',
      'cost per hire formula',
      'SHRM cost per hire',
    ],
    icon: Briefcase,
    tier: 'tier2',
    category: 'HR Analytics',
    path: '/calculators/cost-per-hire-calculator',
  },
  {
    slug: 'billable-hours-calculator',
    status: 'published',
    title: 'Billable Hours Calculator',
    metaTitle: 'Free Billable Hours Calculator 2026 — Utilization & Revenue',
    shortDescription:
      'Calculate billable hours, utilization rate, and billable revenue from total hours worked and non-billable time.',
    metaDescription:
      'Free billable hours calculator. Track billable vs non-billable hours, calculate utilization rate, project monthly and annual revenue from your hourly rate, and export invoice-ready totals.',
    keywords: [
      'billable hours calculator',
      'utilization rate calculator',
      'billable rate calculator',
      'how to calculate billable hours',
      'billable hours tracker',
      'consultant billable hours calculator',
      'lawyer billable hours calculator',
      'billable utilization calculator',
      'time tracking billable hours',
      'billable revenue calculator',
    ],
    icon: Hourglass,
    tier: 'tier2',
    category: 'Time & Attendance',
    path: '/calculators/billable-hours-calculator',
  },
  {
    slug: 'revenue-per-employee-calculator',
    status: 'published',
    title: 'Revenue per Employee Calculator',
    metaTitle: 'Free Revenue Per Employee Calculator 2026 — Workforce Productivity',
    shortDescription:
      'Calculate revenue per employee ratio and benchmark against industry averages to measure workforce productivity and efficiency.',
    metaDescription:
      'Free revenue per employee calculator 2026. Measure workforce productivity by dividing revenue by FTE count. Compare to industry benchmarks, see 5-year trend, and plan headcount growth.',
    keywords: [
      'revenue per employee calculator',
      'revenue per employee ratio',
      'sales per employee calculator',
      'workforce productivity calculator',
      'HR productivity metrics',
      'revenue per FTE calculator',
      'how to calculate revenue per employee',
      'employee productivity ratio',
      'headcount efficiency calculator',
    ],
    icon: Activity,
    tier: 'tier2',
    category: 'HR Analytics',
    path: '/calculators/revenue-per-employee-calculator',
  },

  // ── 5 new calculators (Phase 3 expansion) ──

  // PTO Accrual Calculator
  {
    slug: 'pto-accrual-calculator',
    status: 'published',
    title: 'PTO Accrual Calculator',
    metaTitle: 'Free PTO Accrual Calculator 2026 — Vacation Time Tracking',
    shortDescription:
      'Calculate paid time off accrual per pay period, project year-end balance, and convert accrued hours to cash value.',
    metaDescription:
      'Free PTO accrual calculator 2026. Calculate vacation time accrual per paycheck, project year-end balance, and convert PTO hours to dollar cash value. Supports hourly, per-pay-period, and annual lump-sum policies.',
    keywords: [
      'PTO accrual calculator',
      'vacation accrual calculator',
      'paid time off calculator',
      'PTO calculator',
      'vacation time accrual',
      'PTO balance calculator',
      'paid leave accrual',
      'how to calculate PTO accrual',
      'PTO payout calculator',
      'vacation accrual formula',
    ],
    icon: CalendarDays,
    tier: 'tier2',
    category: 'Time & Attendance',
    path: '/calculators/pto-accrual-calculator',
  },

  // Contractor vs Employee Calculator
  {
    slug: 'contractor-vs-employee-calculator',
    status: 'published',
    title: '1099 vs W-2 Calculator',
    metaTitle: 'Free 1099 vs W-2 Calculator 2026 — Contractor vs Employee Tax',
    shortDescription:
      'Compare total take-home pay as a 1099 contractor vs W-2 employee. Includes SECA tax (15.3%) vs FICA (7.65%) and federal income tax.',
    metaDescription:
      'Free 1099 vs W-2 calculator 2026. Compare take-home pay as an independent contractor vs employee. Includes SECA tax (15.3%), FICA (7.65%), federal tax brackets, and effective tax rate for each scenario.',
    keywords: [
      '1099 vs W2 calculator',
      'contractor vs employee calculator',
      '1099 tax calculator',
      'self employment tax calculator',
      'SECA tax calculator',
      'independent contractor tax',
      '1099 vs W2 take home pay',
      'contractor vs employee tax comparison',
      'self employment vs employee',
      '1099 tax rate calculator',
    ],
    icon: Briefcase,
    tier: 'tier1',
    category: 'Payroll & Taxes',
    path: '/calculators/contractor-vs-employee-calculator',
  },

  // Break-Even Calculator
  {
    slug: 'break-even-calculator',
    status: 'published',
    title: 'Break-Even Calculator',
    metaTitle: 'Free Break-Even Calculator 2026 — Units, Revenue & Margin of Safety',
    shortDescription:
      'Calculate break-even point in units and revenue, contribution margin, and margin of safety with worked examples.',
    metaDescription:
      'Free break-even calculator 2026. Calculate break-even point in units and revenue, contribution margin per unit, margin of safety, and target profit units. Worked examples for retail, SaaS, and services businesses.',
    keywords: [
      'break even calculator',
      'break even point calculator',
      'break even analysis',
      'break even units calculator',
      'break even revenue calculator',
      'contribution margin calculator',
      'margin of safety calculator',
      'how to calculate break even point',
      'break even formula',
      'target profit calculator',
    ],
    icon: Target,
    tier: 'tier1',
    category: 'Business Finance',
    path: '/calculators/break-even-calculator',
  },

  // Cash Flow Forecast Calculator
  {
    slug: 'cash-flow-forecast-calculator',
    status: 'published',
    title: 'Cash Flow Forecast Calculator',
    metaTitle: 'Free Cash Flow Forecast Calculator 2026 — 12-Month Projection',
    shortDescription:
      'Project 12-month cash flow with growth rates, identify the lowest-cash month, and visualize cumulative cash position.',
    metaDescription:
      'Free cash flow forecast calculator 2026. Project 12-month cash flow with monthly revenue, expenses, and growth rates. See when cash runs out, identify lowest-cash month, and visualize cumulative cash position on a chart.',
    keywords: [
      'cash flow forecast calculator',
      'cash flow projection',
      'cash flow calculator',
      '12 month cash flow forecast',
      'business cash flow projection',
      'cash position calculator',
      'runway calculator',
      'burn rate calculator',
      'cash flow analysis',
      'small business cash flow forecast',
    ],
    icon: TrendingUp,
    tier: 'tier1',
    category: 'Business Finance',
    path: '/calculators/cash-flow-forecast-calculator',
  },

  // Social Security Estimator
  {
    slug: 'social-security-estimator',
    status: 'published',
    title: 'Social Security Estimator',
    metaTitle: 'Free Social Security Estimator 2026 — Retirement Benefit Calculator',
    shortDescription:
      'Estimate your monthly Social Security retirement benefit at ages 62, 67 (FRA), and 70 using the 2026 PIA bend points.',
    metaDescription:
      'Free Social Security estimator 2026. Calculate your monthly retirement benefit at age 62, 67 (Full Retirement Age), and 70 using 2026 PIA bend points and AIME formula. See lifetime payout projections and claiming strategy impact.',
    keywords: [
      'social security calculator',
      'social security estimator',
      'retirement benefit calculator',
      'SSA benefit estimator',
      'social security PIA calculator',
      'primary insurance amount calculator',
      'social security at 62 calculator',
      'social security at 70 calculator',
      'AIME calculator',
      'social security retirement estimate',
    ],
    icon: Landmark,
    tier: 'tier1',
    category: 'Payroll & Taxes',
    path: '/calculators/social-security-estimator',
  },

  // ── Phase 4: Salary & Pay expansion (5 new calculators) ──

  {
    slug: 'shift-pay-calculator',
    status: 'published',
    title: 'Shift Pay Calculator',
    metaTitle: 'Free Shift Pay Calculator 2026 — 1st, 2nd & 3rd Shift Earnings',
    shortDescription:
      'Calculate total earnings across 1st, 2nd, and 3rd shifts with custom shift differentials and hours per shift.',
    metaDescription:
      'Free shift pay calculator 2026. Calculate total earnings across day, swing, and graveyard shifts with custom shift differential percentages and hours per shift. Includes 5%, 10%, and 15% shift premium presets.',
    keywords: [
      'shift pay calculator',
      'shift differential calculator',
      '2nd shift pay calculator',
      '3rd shift pay calculator',
      'graveyard shift pay',
      'swing shift pay calculator',
      'shift premium calculator',
      'shift differential pay',
      'night shift pay calculator',
      'evening shift differential',
      'shift pay rate calculator',
      'shift work pay calculator',
    ],
    icon: CalendarClock,
    tier: 'tier2',
    category: 'Salary & Compensation',
    path: '/calculators/shift-pay-calculator',
  },

  {
    slug: 'night-shift-differential-calculator',
    status: 'published',
    title: 'Night Shift Differential Calculator',
    metaTitle: 'Free Night Shift Differential Calculator 2026 — Swing & Graveyard Pay',
    shortDescription:
      'Calculate night shift differential pay for hours worked between 6pm and 6am, with multi-tier rates and weekly totals.',
    metaDescription:
      'Free night shift differential calculator 2026. Calculate additional pay for hours worked on night shifts (6pm-6am). Supports custom differential percentages, multi-tier rates, and weekly totals for healthcare and manufacturing workers.',
    keywords: [
      'night shift differential calculator',
      'night shift pay calculator',
      'shift differential pay calculator',
      'graveyard shift differential',
      'night shift premium calculator',
      'night shift rate calculator',
      'second shift differential',
      'third shift differential',
      'night differential pay',
      'evening shift pay calculator',
      'night shift extra pay',
      'FLSA night shift',
    ],
    icon: Moon,
    tier: 'tier2',
    category: 'Salary & Compensation',
    path: '/calculators/night-shift-differential-calculator',
  },

  {
    slug: 'holiday-pay-calculator',
    status: 'published',
    title: 'Holiday Pay Calculator',
    metaTitle: 'Free Holiday Pay Calculator 2026 — Time-and-a-Half, Double-Time & Premium',
    shortDescription:
      'Calculate holiday pay at time-and-a-half, double-time, or custom premium rates, with regular hours and weekly totals.',
    metaDescription:
      'Free holiday pay calculator 2026. Calculate holiday pay at 1.5x, 2x, or custom premium multipliers. Enter hourly rate, holiday hours, and regular hours to see total weekly earnings including holiday premium pay.',
    keywords: [
      'holiday pay calculator',
      'holiday pay rate calculator',
      'holiday premium pay calculator',
      'time and a half holiday pay',
      'double time holiday pay',
      'holiday overtime calculator',
      'federal holiday pay calculator',
      'holiday pay rate',
      'holiday pay FLSA',
      'holiday premium calculator',
      'holiday double time calculator',
      'Thanksgiving pay calculator',
    ],
    icon: PartyPopper,
    tier: 'tier2',
    category: 'Salary & Compensation',
    path: '/calculators/holiday-pay-calculator',
  },

  {
    slug: 'double-time-calculator',
    status: 'published',
    title: 'Double Time Calculator',
    metaTitle: 'Free Double Time Calculator 2026 — 2x Overtime Pay Rate',
    shortDescription:
      'Calculate double-time pay at 2x your regular hourly rate. Enter your hourly wage and double-time hours to see your earnings.',
    metaDescription:
      'Free double time calculator 2026. Calculate 2x overtime pay for any hourly rate and hours worked. Includes California double-time rules (over 12 hours/day or 7th consecutive day) and total gross pay.',
    keywords: [
      'double time calculator',
      'double time pay calculator',
      '2x overtime calculator',
      'double time rate calculator',
      'how to calculate double time',
      'double time pay rate',
      'double overtime calculator',
      'California double time calculator',
      'double time hours calculator',
      '2 times pay calculator',
      'double time overtime',
      'FLSA double time',
    ],
    icon: Zap,
    tier: 'tier2',
    category: 'Salary & Compensation',
    path: '/calculators/double-time-calculator',
  },

  {
    slug: 'hazard-pay-calculator',
    status: 'published',
    title: 'Hazard Pay Calculator',
    metaTitle: 'Free Hazard Pay Calculator 2026 — Hazardous Duty Premium Pay',
    shortDescription:
      'Calculate hazard pay premium for hazardous duty work, including percentage-based premiums, hourly add-ons, and flat stipends.',
    metaDescription:
      'Free hazard pay calculator 2026. Calculate hazardous duty pay as a percentage premium, hourly add-on rate, or flat stipend. See total hazard pay, regular pay, and combined earnings for high-risk work environments.',
    keywords: [
      'hazard pay calculator',
      'hazardous duty pay calculator',
      'hazard pay rate',
      'hazard pay percentage',
      'hazard pay premium calculator',
      'danger pay calculator',
      'hazard pay FLSA',
      'hazard pay hourly rate',
      'hazard pay stipend',
      'covid hazard pay calculator',
      'hazardous duty pay rate',
      'hazard pay multiplier',
    ],
    icon: AlertTriangle,
    tier: 'tier2',
    category: 'Salary & Compensation',
    path: '/calculators/hazard-pay-calculator',
  },

  // ── Phase 4: Payroll Taxes expansion (5 new calculators) ──

  {
    slug: 'federal-tax-calculator',
    status: 'published',
    title: 'Federal Tax Calculator',
    metaTitle: 'Free Federal Tax Calculator 2026 — Federal Income Tax by Bracket',
    shortDescription:
      'Calculate your federal income tax liability using 2026 IRS tax brackets, standard deduction, and filing status.',
    metaDescription:
      'Free federal tax calculator 2026. Calculate federal income tax for single, married filing jointly, head of household, and married filing separately. Uses 2026 IRS tax brackets, standard deduction, and full bracket breakdown.',
    keywords: [
      'federal tax calculator',
      'federal income tax calculator',
      'federal tax estimator',
      'IRS tax calculator',
      'federal tax bracket calculator',
      'federal tax rate calculator',
      'federal tax refund calculator',
      'federal tax liability calculator',
      'federal withholding calculator',
      '2026 federal tax calculator',
      'US federal tax calculator',
      'federal income tax estimator',
    ],
    icon: Landmark,
    tier: 'tier1',
    category: 'Payroll & Taxes',
    path: '/calculators/federal-tax-calculator',
  },

  {
    slug: 'state-tax-calculator',
    status: 'published',
    title: 'State Tax Calculator',
    metaTitle: 'Free State Tax Calculator 2026 — All 50 States Income Tax',
    shortDescription:
      'Calculate state income tax for all 50 states, including flat-rate states, progressive bracket states, and no-income-tax states.',
    metaDescription:
      'Free state income tax calculator 2026. Calculate state tax for all 50 states with current brackets, standard deductions, and exemptions. Compare take-home pay across states including no-income-tax states like Texas, Florida, and Tennessee.',
    keywords: [
      'state tax calculator',
      'state income tax calculator',
      'state tax estimator',
      'state tax rate calculator',
      'California state tax calculator',
      'New York state tax calculator',
      'Texas state tax calculator',
      'Florida state tax calculator',
      'state tax by state comparison',
      'state income tax by state',
      'state withholding calculator',
      'state tax bracket calculator',
    ],
    icon: MapIcon,
    tier: 'tier1',
    category: 'Payroll & Taxes',
    path: '/calculators/state-tax-calculator',
  },

  {
    slug: 'w-2-calculator',
    status: 'published',
    title: 'W-2 Calculator',
    metaTitle: 'Free W-2 Calculator 2026 — Take-Home Pay, Taxes & Withholding',
    shortDescription:
      'Calculate W-2 employee take-home pay after federal tax, state tax, FICA, and pre-tax deductions from gross wages.',
    metaDescription:
      'Free W-2 calculator 2026. Calculate net take-home pay for W-2 employees after federal income tax, state tax, Social Security, Medicare, and 401(k)/HSA deductions. See per-paycheck and annual take-home.',
    keywords: [
      'W-2 calculator',
      'W2 tax calculator',
      'W-2 take home pay calculator',
      'W-2 withholding calculator',
      'W2 paycheck calculator',
      'W-2 employee tax calculator',
      'W2 income calculator',
      'W-2 net pay calculator',
      'W2 wage calculator',
      'W-2 form calculator',
      'W2 tax withholding',
      'W-2 vs 1099 calculator',
    ],
    icon: FileCheck,
    tier: 'tier1',
    category: 'Payroll & Taxes',
    path: '/calculators/w-2-calculator',
  },

  {
    slug: '1099-calculator',
    status: 'published',
    title: '1099 Calculator',
    metaTitle: 'Free 1099 Calculator 2026 — Independent Contractor Tax & Net Pay',
    shortDescription:
      'Calculate 1099 contractor taxes including self-employment tax (15.3%), federal income tax, and quarterly estimated payments.',
    metaDescription:
      'Free 1099 calculator 2026. Calculate take-home pay for 1099 independent contractors including SECA self-employment tax (15.3%), federal income tax, business expense deductions, and quarterly estimated tax payments.',
    keywords: [
      '1099 calculator',
      '1099 tax calculator',
      '1099 self employment tax calculator',
      '1099 take home pay calculator',
      '1099 contractor tax calculator',
      '1099 income calculator',
      '1099 net pay calculator',
      'independent contractor tax calculator',
      '1099 quarterly tax calculator',
      '1099 NEC calculator',
      '1099 estimated tax calculator',
      '1099 SECA calculator',
    ],
    icon: FileSpreadsheet,
    tier: 'tier1',
    category: 'Payroll & Taxes',
    path: '/calculators/1099-calculator',
  },

  {
    slug: 'self-employment-tax-calculator',
    status: 'published',
    title: 'Self Employment Tax Calculator',
    metaTitle: 'Free Self Employment Tax Calculator 2026 — SECA Tax & Deduction',
    shortDescription:
      'Calculate self-employment tax (SECA) including the 7.65% deduction for employer-equivalent portion and net SE earnings.',
    metaDescription:
      'Free self employment tax calculator 2026. Calculate SECA tax (15.3% on net SE income) including Social Security and Medicare portions, the 50% employer-equivalent deduction, and quarterly estimated tax payments.',
    keywords: [
      'self employment tax calculator',
      'SECA tax calculator',
      'self employment tax',
      'self employed tax calculator',
      'self employment tax rate',
      'self employment tax deduction',
      'self employment income calculator',
      'Schedule SE calculator',
      'self employment tax estimator',
      'sole proprietor tax calculator',
      'freelancer tax calculator',
      'independent contractor tax',
    ],
    icon: UserCog,
    tier: 'tier1',
    category: 'Payroll & Taxes',
    path: '/calculators/self-employment-tax-calculator',
  },

  // ── Phase 5: Time & Attendance expansion (16 new calculators) ──

  {
    slug: 'work-hours-calculator',
    status: 'published',
    title: 'Work Hours Calculator',
    metaTitle: 'Free Work Hours Calculator 2026 — Weekly & Monthly Hours Tracking',
    shortDescription:
      'Calculate total work hours from daily start/end times across a full workweek with auto break deduction.',
    metaDescription:
      'Free work hours calculator 2026. Enter daily clock-in and clock-out times to calculate total work hours per week or month. Includes automatic break deduction, overtime detection, and decimal hours conversion for payroll.',
    keywords: [
      'work hours calculator',
      'hours worked calculator',
      'weekly work hours calculator',
      'monthly work hours calculator',
      'how many hours worked',
      'work hours tracker',
      'calculate work hours',
      'employee work hours calculator',
      'total hours worked calculator',
      'work hours from time entries',
      'hours worked per week',
    ],
    icon: Clock,
    tier: 'tier2',
    category: 'Time & Attendance',
    path: '/calculators/work-hours-calculator',
  },

  {
    slug: 'employee-hours-calculator',
    status: 'published',
    title: 'Employee Hours Calculator',
    metaTitle: 'Free Employee Hours Calculator 2026 — Track Multiple Employees',
    shortDescription:
      'Track weekly hours for multiple employees with regular, overtime, and total pay calculations for payroll.',
    metaDescription:
      'Free employee hours calculator 2026. Track work hours for multiple employees in a single view. Calculate regular hours, overtime, double-time, and total gross pay per employee for weekly payroll processing.',
    keywords: [
      'employee hours calculator',
      'employee work hours tracker',
      'multi employee hours calculator',
      'staff hours calculator',
      'payroll hours by employee',
      'employee time tracking',
      'weekly employee hours',
      'employee hours log',
      'calculate employee hours for payroll',
      'multiple employee time tracker',
    ],
    icon: Users,
    tier: 'tier2',
    category: 'Time & Attendance',
    path: '/calculators/employee-hours-calculator',
  },

  {
    slug: 'shift-hours-calculator',
    status: 'published',
    title: 'Shift Hours Calculator',
    metaTitle: 'Free Shift Hours Calculator 2026 — 8/10/12 Hour Shift Tracking',
    shortDescription:
      'Calculate total hours across shift patterns including 8-hour, 10-hour, and 12-hour shifts with weekly totals.',
    metaDescription:
      'Free shift hours calculator 2026. Calculate work hours for fixed shifts (8h, 10h, 12h) or rotating shift patterns. See weekly and monthly totals, overtime, and shift coverage gaps for scheduling.',
    keywords: [
      'shift hours calculator',
      '8 hour shift calculator',
      '10 hour shift calculator',
      '12 hour shift calculator',
      'shift work hours',
      'shift pattern calculator',
      'fixed shift hours',
      'rotating shift hours',
      'shift schedule calculator',
      'shift coverage calculator',
    ],
    icon: CalendarClock,
    tier: 'tier2',
    category: 'Time & Attendance',
    path: '/calculators/shift-hours-calculator',
  },

  {
    slug: 'attendance-calculator',
    status: 'draft',
    title: 'Attendance Calculator',
    metaTitle: 'Free Attendance Calculator 2026 — Track Attendance Rate & Absences',
    shortDescription:
      'Calculate employee attendance rate, absence rate, and tardy percentage from total scheduled vs attended days.',
    metaDescription:
      'Free attendance calculator 2026. Calculate employee attendance rate, absenteeism rate, and tardiness from total scheduled workdays. Track monthly and quarterly attendance trends with industry benchmark comparisons.',
    keywords: [
      'attendance calculator',
      'attendance rate calculator',
      'absenteeism rate calculator',
      'employee attendance tracker',
      'attendance percentage calculator',
      'absence rate calculator',
      'tardiness calculator',
      'attendance metrics',
      'workplace attendance rate',
      'how to calculate attendance rate',
    ],
    icon: CalendarCheck,
    tier: 'tier2',
    category: 'Time & Attendance',
    path: '/calculators/attendance-calculator',
  },

  {
    slug: 'leave-calculator',
    status: 'draft',
    title: 'Leave Calculator',
    metaTitle: 'Free Leave Calculator 2026 — PTO, Vacation & Sick Leave Tracking',
    shortDescription:
      'Calculate total leave entitlement, used leave, and remaining balance across PTO, vacation, sick, and personal leave.',
    metaDescription:
      'Free leave calculator 2026. Track total leave entitlement, used leave, and remaining balance across multiple leave types (PTO, vacation, sick, personal). Includes accrual rate and end-of-year projection.',
    keywords: [
      'leave calculator',
      'leave balance calculator',
      'leave entitlement calculator',
      'paid leave calculator',
      'annual leave calculator',
      'leave tracker',
      'leave accrual calculator',
      'remaining leave calculator',
      'leave management calculator',
      'time off calculator',
    ],
    icon: CalendarRange,
    tier: 'tier2',
    category: 'Time & Attendance',
    path: '/calculators/leave-calculator',
  },

  {
    slug: 'sick-leave-calculator',
    status: 'draft',
    title: 'Sick Leave Calculator',
    metaTitle: 'Free Sick Leave Calculator 2026 — Accrual, Usage & FMLA Tracking',
    shortDescription:
      'Calculate sick leave accrual, usage, and remaining balance with state-specific mandates and FMLA tracking.',
    metaDescription:
      'Free sick leave calculator 2026. Calculate sick leave accrual per pay period, track used vs remaining balance, and check compliance with state mandates (CA, NY, WA, MA, OR, and other paid sick leave states).',
    keywords: [
      'sick leave calculator',
      'sick leave accrual calculator',
      'sick time calculator',
      'paid sick leave calculator',
      'sick leave balance tracker',
      'sick leave tracking',
      'FMLA calculator',
      'sick days calculator',
      'state sick leave law calculator',
      'sick leave entitlement calculator',
    ],
    icon: HeartPulse,
    tier: 'tier2',
    category: 'Time & Attendance',
    path: '/calculators/sick-leave-calculator',
  },

  {
    slug: 'holiday-countdown-calculator',
    status: 'draft',
    title: 'Holiday Countdown Calculator',
    metaTitle: 'Free Holiday Countdown Calculator 2026 — Days Until Next Holiday',
    shortDescription:
      'Count days until the next US federal holiday, company holiday, or custom date with paid-time-off projections.',
    metaDescription:
      'Free holiday countdown calculator 2026. See days until the next US federal holiday, calculate holiday pay eligibility, and plan paid time off around federal holidays including Thanksgiving, Christmas, and New Year.',
    keywords: [
      'holiday countdown calculator',
      'days until holiday',
      'federal holiday calendar',
      'next holiday calculator',
      'US holiday countdown',
      'holiday pay eligibility',
      'holiday time off planner',
      'federal holiday list 2026',
      'holiday date calculator',
      'paid holiday calculator',
    ],
    icon: PartyPopper,
    tier: 'tier3',
    category: 'Time & Attendance',
    path: '/calculators/holiday-countdown-calculator',
  },

  {
    slug: 'working-hours-calculator',
    status: 'draft',
    title: 'Working Hours Calculator',
    metaTitle: 'Free Working Hours Calculator 2026 — Annual & Monthly Hours',
    shortDescription:
      'Calculate annual, monthly, and weekly working hours excluding weekends, holidays, and PTO for any country.',
    metaDescription:
      'Free working hours calculator 2026. Calculate total annual working hours, monthly average, and weekly hours excluding weekends, public holidays, and PTO. Supports US, UK, Canada, Australia, and EU working hour standards.',
    keywords: [
      'working hours calculator',
      'annual working hours calculator',
      'monthly working hours',
      'how many work hours in a year',
      'work hours per year calculator',
      'business hours calculator',
      'net working hours',
      'annual work hours 2026',
      'total working hours per month',
      'standard work hours calculator',
    ],
    icon: CalendarClock,
    tier: 'tier2',
    category: 'Time & Attendance',
    path: '/calculators/working-hours-calculator',
  },

  {
    slug: 'timesheet-calculator',
    status: 'draft',
    title: 'Timesheet Calculator',
    metaTitle: 'Free Timesheet Calculator 2026 — Weekly Timesheet with Pay',
    shortDescription:
      'Generate a printable weekly timesheet with daily hours, break deductions, overtime, and total pay.',
    metaDescription:
      'Free timesheet calculator 2026. Create a printable weekly timesheet with daily clock-in/out times, automatic break deductions, overtime calculation, and total gross pay. Print-ready and email-ready format.',
    keywords: [
      'timesheet calculator',
      'weekly timesheet calculator',
      'timesheet with pay calculator',
      'printable timesheet',
      'timesheet template calculator',
      'employee timesheet',
      'timesheet overtime calculator',
      'timesheet with lunch deduction',
      'free timesheet calculator',
      'online timesheet',
    ],
    icon: FileText,
    tier: 'tier2',
    category: 'Time & Attendance',
    path: '/calculators/timesheet-calculator',
  },

  {
    slug: 'payroll-hours-calculator',
    status: 'draft',
    title: 'Payroll Hours Calculator',
    metaTitle: 'Free Payroll Hours Calculator 2026 — Convert Hours to Pay',
    shortDescription:
      'Convert work hours to gross pay with regular, overtime, and double-time rates for payroll processing.',
    metaDescription:
      'Free payroll hours calculator 2026. Convert total work hours to gross pay with separate regular, overtime (1.5x), and double-time (2x) rates. See per-paycheck breakdown for weekly, bi-weekly, semi-monthly, and monthly pay periods.',
    keywords: [
      'payroll hours calculator',
      'hours to pay calculator',
      'payroll time calculator',
      'convert hours to dollars',
      'payroll hours conversion',
      'hours worked to gross pay',
      'payroll hours per pay period',
      'payroll hours and minutes',
      'payroll time conversion',
      'hours to wages calculator',
    ],
    icon: Banknote,
    tier: 'tier2',
    category: 'Time & Attendance',
    path: '/calculators/payroll-hours-calculator',
  },

  {
    slug: 'clock-in-calculator',
    status: 'draft',
    title: 'Clock In Calculator',
    metaTitle: 'Free Clock In Calculator 2026 — Track Start Times & Hours',
    shortDescription:
      'Calculate hours worked from a single clock-in time, projected clock-out, and total shift duration.',
    metaDescription:
      'Free clock in calculator 2026. Enter your clock-in time, break length, and shift length to calculate your clock-out time and total hours worked. Includes lunch break deduction and projected end-time for 8-hour shifts.',
    keywords: [
      'clock in calculator',
      'clock in time calculator',
      'when can I clock out',
      'shift end time calculator',
      '8 hour shift calculator',
      'clock in clock out',
      'work shift calculator',
      'what time to clock out',
      'start time calculator',
      'shift duration calculator',
    ],
    icon: LogIn,
    tier: 'tier3',
    category: 'Time & Attendance',
    path: '/calculators/clock-in-calculator',
  },

  {
    slug: 'clock-out-calculator',
    status: 'draft',
    title: 'Clock Out Calculator',
    metaTitle: 'Free Clock Out Calculator 2026 — Hit Your Target Hours',
    shortDescription:
      'Calculate what time to clock out to hit a target number of hours, including lunch and overtime caps.',
    metaDescription:
      'Free clock out calculator 2026. Enter clock-in time, lunch break, and target hours worked — get the exact clock-out time. Avoid accidental overtime by setting an 8-hour cap or hit a target for full-time status.',
    keywords: [
      'clock out calculator',
      'what time to clock out',
      'clock out time calculator',
      'target hours calculator',
      'avoid overtime calculator',
      '8 hour shift end time',
      'when should I clock out',
      'clock out time for target hours',
      'shift end calculator',
      'exact clock out time',
    ],
    icon: LogOut,
    tier: 'tier3',
    category: 'Time & Attendance',
    path: '/calculators/clock-out-calculator',
  },

  {
    slug: 'hours-between-times-calculator',
    status: 'draft',
    title: 'Hours Between Two Times Calculator',
    metaTitle: 'Free Hours Between Two Times Calculator 2026 — Duration Calc',
    shortDescription:
      'Calculate the exact hours and minutes between any two times, with overnight shift support and decimal hours.',
    metaDescription:
      'Free hours between two times calculator 2026. Calculate duration between any two clock times with overnight shift support. See hours and minutes, decimal hours, and total seconds. Perfect for shift work, billing, and event planning.',
    keywords: [
      'hours between two times calculator',
      'hours between calculator',
      'time duration calculator',
      'hours between two times',
      'time difference calculator',
      'how many hours between',
      'calculate hours between times',
      'duration calculator hours',
      'elapsed time calculator',
      'time span calculator',
    ],
    icon: Clock3,
    tier: 'tier2',
    category: 'Time & Attendance',
    path: '/calculators/hours-between-times-calculator',
  },

  {
    slug: 'utilization-rate-calculator',
    status: 'draft',
    title: 'Utilization Rate Calculator',
    metaTitle: 'Free Utilization Rate Calculator 2026 — Billable vs Total Hours',
    shortDescription:
      'Calculate billable utilization rate for consultants, lawyers, and agencies with target rate benchmarking.',
    metaDescription:
      'Free utilization rate calculator 2026. Calculate billable utilization rate by dividing billable hours by total available hours. See target benchmarks for consulting (75%), legal (70%), and agency (65%) with revenue impact analysis.',
    keywords: [
      'utilization rate calculator',
      'billable utilization calculator',
      'resource utilization calculator',
      'staff utilization rate',
      'utilization rate formula',
      'how to calculate utilization rate',
      'consultant utilization rate',
      'lawyer utilization rate',
      'agency utilization calculator',
      'employee utilization rate',
    ],
    icon: Gauge,
    tier: 'tier2',
    category: 'Time & Attendance',
    path: '/calculators/utilization-rate-calculator',
  },

  {
    slug: 'employee-schedule-calculator',
    status: 'draft',
    title: 'Employee Schedule Calculator',
    metaTitle: 'Free Employee Schedule Calculator 2026 — Build Weekly Schedules',
    shortDescription:
      'Build a weekly employee schedule with shift assignments, coverage by day, and total scheduled hours per employee.',
    metaDescription:
      'Free employee schedule calculator 2026. Build a weekly schedule by assigning shifts to employees. See total scheduled hours per employee, coverage by day, overtime alerts, and labor cost estimate per shift.',
    keywords: [
      'employee schedule calculator',
      'work schedule calculator',
      'staff schedule builder',
      'weekly schedule maker',
      'shift schedule calculator',
      'employee scheduling tool',
      'workforce schedule calculator',
      'schedule hours calculator',
      'shift assignment calculator',
      'team schedule calculator',
    ],
    icon: CalendarDays,
    tier: 'tier3',
    category: 'Time & Attendance',
    path: '/calculators/employee-schedule-calculator',
  },

  {
    slug: 'shift-rotation-calculator',
    status: 'draft',
    title: 'Shift Rotation Calculator',
    metaTitle: 'Free Shift Rotation Calculator 2026 — 2-2-3, DuPont, Pitman',
    shortDescription:
      'Generate 2-2-3, DuPont, Pitman, and 4-on-4-off rotating shift schedules with team coverage and rest days.',
    metaDescription:
      'Free shift rotation calculator 2026. Generate popular rotating shift patterns including 2-2-3 (Panama), DuPont (28-day), Pitman (2-3-2), and 4-on-4-off. See team coverage, rest days, and weekly hours for each crew.',
    keywords: [
      'shift rotation calculator',
      '2-2-3 shift calculator',
      'DuPont shift schedule',
      'Pitman shift schedule',
      '4 on 4 off calculator',
      'rotating shift calculator',
      'Panama shift schedule',
      'continental shift calculator',
      'shift pattern generator',
      'crew rotation calculator',
    ],
    icon: RefreshCw,
    tier: 'tier3',
    category: 'Time & Attendance',
    path: '/calculators/shift-rotation-calculator',
  },

  {
    slug: 'time-difference-calculator',
    status: 'draft',
    title: 'Time Difference Calculator',
    metaTitle: 'Free Time Difference Calculator 2026 — Between Dates & Times',
    shortDescription:
      'Calculate the time difference between two dates and times in days, hours, minutes, and total hours.',
    metaDescription:
      'Free time difference calculator 2026. Calculate the duration between any two dates and times. See results in days, hours, minutes, total hours, and decimal hours. Perfect for project duration, age, and elapsed time tracking.',
    keywords: [
      'time difference calculator',
      'time between two dates',
      'date difference calculator',
      'days between dates calculator',
      'time elapsed calculator',
      'duration between dates',
      'how long between dates',
      'date duration calculator',
      'time span between two dates',
      'calculate time gap',
    ],
    icon: GitCompareArrows,
    tier: 'tier2',
    category: 'Time & Attendance',
    path: '/calculators/time-difference-calculator',
  },

  {
    slug: 'break-calculator',
    status: 'draft',
    title: 'Break Calculator',
    metaTitle: 'Free Break Calculator 2026 — Meal & Rest Break Compliance',
    shortDescription:
      'Calculate required meal and rest breaks by shift length with state-specific compliance (CA, OR, WA, CO).',
    metaDescription:
      'Free break calculator 2026. Calculate required meal and rest breaks by shift length. Includes state-specific rules for California (30-min meal for 5+ hours, 10-min rest per 4 hours), Oregon, Washington, and Colorado.',
    keywords: [
      'break calculator',
      'meal break calculator',
      'rest break calculator',
      'work break calculator',
      'California meal break calculator',
      'required break calculator',
      'shift break calculator',
      '15 minute break calculator',
      '30 minute lunch calculator',
      'FLSA break calculator',
    ],
    icon: PauseCircle,
    tier: 'tier2',
    category: 'Time & Attendance',
    path: '/calculators/break-calculator',
  },

  {
    slug: 'lunch-deduction-calculator',
    status: 'draft',
    title: 'Lunch Deduction Calculator',
    metaTitle: 'Free Lunch Deduction Calculator 2026 — Auto-Deduct Lunch Breaks',
    shortDescription:
      'Calculate net work hours after deducting lunch breaks with fixed, auto, or waive-able lunch options.',
    metaDescription:
      'Free lunch deduction calculator 2026. Calculate net work hours after deducting lunch breaks. Choose fixed deduction (30 min), auto-deduct (over 6 hours), or waived lunch. See total payable hours for payroll.',
    keywords: [
      'lunch deduction calculator',
      'lunch break deduction',
      'auto lunch deduction calculator',
      'work hours minus lunch',
      'lunch time calculator',
      'unpaid lunch calculator',
      '30 minute lunch deduction',
      '1 hour lunch deduction',
      'lunch deduction for payroll',
      'waived lunch calculator',
    ],
    icon: Utensils,
    tier: 'tier2',
    category: 'Time & Attendance',
    path: '/calculators/lunch-deduction-calculator',
  },

  // ── Phase 6: HR Analytics expansion (30 new calculators) ──

  {
    slug: 'employee-retention-calculator',
    status: 'draft',
    title: 'Employee Retention Calculator',
    metaTitle: 'Free Employee Retention Calculator 2026 — Retention Rate & Trends',
    shortDescription:
      'Calculate employee retention rate over any period (90 days, 1 year) with benchmark comparisons to industry averages.',
    metaDescription:
      'Free employee retention calculator 2026. Calculate retention rate over 90 days, 6 months, 1 year, or custom periods. Compare to industry benchmarks (US average 80-85%). Identify departments with high attrition.',
    keywords: [
      'employee retention calculator',
      'retention rate calculator',
      'employee retention rate',
      'how to calculate retention rate',
      'workforce retention',
      'staff retention calculator',
      'employee retention metrics',
      'HR retention calculator',
      'annual retention rate',
      '90 day retention rate',
    ],
    icon: Users,
    tier: 'tier2',
    category: 'HR Analytics',
    path: '/calculators/employee-retention-calculator',
  },

  {
    slug: 'attrition-calculator',
    status: 'draft',
    title: 'Attrition Calculator',
    metaTitle: 'Free Attrition Calculator 2026 — Attrition Rate & Cost',
    shortDescription:
      'Calculate employee attrition rate (voluntary, involuntary, total) and project annualized attrition from period data.',
    metaDescription:
      'Free attrition calculator 2026. Calculate voluntary, involuntary, and total attrition rates. Annualize period attrition, compare to industry benchmarks, and identify root causes of workforce attrition.',
    keywords: [
      'attrition calculator',
      'attrition rate calculator',
      'employee attrition rate',
      'how to calculate attrition',
      'churn rate calculator',
      'workforce attrition',
      'staff attrition metrics',
      'voluntary attrition',
      'involuntary attrition',
      'annualized attrition rate',
    ],
    icon: TrendingDown,
    tier: 'tier2',
    category: 'HR Analytics',
    path: '/calculators/attrition-calculator',
  },

  {
    slug: 'fte-calculator',
    status: 'draft',
    title: 'FTE Calculator',
    metaTitle: 'Free FTE Calculator 2026 — Full-Time Equivalent Conversion',
    shortDescription:
      'Convert part-time hours to full-time equivalent (FTE) count for budgeting, ACA compliance, and headcount planning.',
    metaDescription:
      'Free FTE calculator 2026. Convert part-time employee hours to full-time equivalent count. ACA threshold (30h/week), standard 40h FTE, and custom hours. Used for budgeting, healthcare compliance, and workforce planning.',
    keywords: [
      'FTE calculator',
      'full time equivalent calculator',
      'FTE conversion',
      'how to calculate FTE',
      'FTE count calculator',
      'ACA FTE calculator',
      'part time to FTE',
      'FTE formula',
      'FTE meaning',
      'workforce FTE',
    ],
    icon: Users,
    tier: 'tier2',
    category: 'HR Analytics',
    path: '/calculators/fte-calculator',
  },

  {
    slug: 'headcount-calculator',
    status: 'draft',
    title: 'Headcount Calculator',
    metaTitle: 'Free Headcount Calculator 2026 — Track & Project Headcount',
    shortDescription:
      'Track current headcount, project year-end count based on hiring and attrition, and plan headcount growth for budgeting.',
    metaDescription:
      'Free headcount calculator 2026. Track current headcount by department, project year-end count based on planned hires and attrition rate, and plan headcount growth for annual budgeting and workforce planning.',
    keywords: [
      'headcount calculator',
      'employee headcount tracker',
      'workforce headcount',
      'headcount planning',
      'headcount projection',
      'headcount metrics',
      'active headcount',
      'total headcount',
      'headcount report',
      'staff headcount calculator',
    ],
    icon: Users,
    tier: 'tier3',
    category: 'HR Analytics',
    path: '/calculators/headcount-calculator',
  },

  {
    slug: 'cost-of-turnover-calculator',
    status: 'draft',
    title: 'Cost of Turnover Calculator',
    metaTitle: 'Free Cost of Turnover Calculator 2026 — Total Cost of Attrition',
    shortDescription:
      'Calculate total cost of employee turnover including replacement, lost productivity, onboarding, and lost knowledge.',
    metaDescription:
      'Free cost of turnover calculator 2026. Calculate the total financial impact of employee turnover: recruitment, lost productivity, onboarding, training, lost knowledge, and overtime for remaining staff. Industry benchmarks included.',
    keywords: [
      'cost of turnover calculator',
      'employee turnover cost calculator',
      'cost of employee turnover',
      'turnover cost formula',
      'cost of attrition',
      'replacement cost calculator',
      'employee turnover financial impact',
      'cost per departure',
      'turnover cost analysis',
      'HR turnover cost',
    ],
    icon: DollarSign,
    tier: 'tier1',
    category: 'HR Analytics',
    path: '/calculators/cost-of-turnover-calculator',
  },

  {
    slug: 'labor-cost-calculator',
    status: 'draft',
    title: 'Labor Cost Calculator',
    metaTitle: 'Free Labor Cost Calculator 2026 — Total Labor Cost % of Revenue',
    shortDescription:
      'Calculate total labor cost (wages + benefits + taxes) as a percentage of revenue with industry benchmark comparison.',
    metaDescription:
      'Free labor cost calculator 2026. Calculate total labor cost including wages, benefits, payroll taxes, and workers comp. See labor cost as % of revenue with industry benchmarks (restaurants 30%, retail 20%, services 50%).',
    keywords: [
      'labor cost calculator',
      'labor cost percentage',
      'total labor cost',
      'labor cost as percent of revenue',
      'workforce cost calculator',
      'labor expense calculator',
      'employee labor cost',
      'direct labor cost',
      'labor cost ratio',
      'labor cost formula',
    ],
    icon: Wallet,
    tier: 'tier1',
    category: 'HR Analytics',
    path: '/calculators/labor-cost-calculator',
  },

  {
    slug: 'employee-productivity-calculator',
    status: 'draft',
    title: 'Employee Productivity Calculator',
    metaTitle: 'Free Employee Productivity Calculator 2026 — Revenue per Hour',
    shortDescription:
      'Calculate employee productivity as revenue per employee, revenue per hour, and output per FTE with industry comparisons.',
    metaDescription:
      'Free employee productivity calculator 2026. Calculate revenue per employee, revenue per labor hour, output per FTE, and productivity growth rate. Benchmark against industry averages (tech $400k/emp, retail $250k, manufacturing $300k).',
    keywords: [
      'employee productivity calculator',
      'productivity per employee',
      'revenue per employee',
      'labor productivity',
      'output per employee',
      'productivity metrics',
      'productivity ratio',
      'workforce productivity',
      'employee efficiency calculator',
      'productivity index',
    ],
    icon: Activity,
    tier: 'tier2',
    category: 'HR Analytics',
    path: '/calculators/employee-productivity-calculator',
  },

  {
    slug: 'hr-budget-calculator',
    status: 'draft',
    title: 'HR Budget Calculator',
    metaTitle: 'Free HR Budget Calculator 2026 — Plan HR Department Spend',
    shortDescription:
      'Build an HR department budget covering recruiting, training, benefits, technology, and headcount costs as % of total.',
    metaDescription:
      'Free HR budget calculator 2026. Plan HR department spend across recruiting, training, benefits, payroll, technology, and HR staff. See HR budget as % of revenue (typical 1-2.5%) and per-employee HR cost.',
    keywords: [
      'HR budget calculator',
      'HR department budget',
      'human resources budget',
      'HR spend calculator',
      'HR budget template',
      'HR cost per employee',
      'HR budget as percent of revenue',
      'HR planning budget',
      'recruitment budget',
      'training budget',
    ],
    icon: Wallet,
    tier: 'tier2',
    category: 'HR Analytics',
    path: '/calculators/hr-budget-calculator',
  },

  {
    slug: 'compensation-ratio-calculator',
    status: 'draft',
    title: 'Compensation Ratio Calculator',
    metaTitle: 'Free Compensation Ratio Calculator 2026 — Compa-Ratio Analysis',
    shortDescription:
      'Calculate compa-ratio (employee salary vs market midpoint) for each role to identify under/over-paid positions.',
    metaDescription:
      'Free compensation ratio calculator 2026. Calculate compa-ratio = employee salary / market midpoint. Identify underpaid (<0.9), at-market (0.9-1.1), and overpaid (>1.1) positions. Used for salary equity and pay band analysis.',
    keywords: [
      'compensation ratio calculator',
      'compa ratio calculator',
      'comparatio',
      'salary ratio',
      'pay ratio analysis',
      'compensation analysis',
      'salary positioning',
      'pay band ratio',
      'market ratio calculator',
      'salary midpoint',
    ],
    icon: Percent,
    tier: 'tier2',
    category: 'HR Analytics',
    path: '/calculators/compensation-ratio-calculator',
  },

  {
    slug: 'time-to-hire-calculator',
    status: 'draft',
    title: 'Time to Hire Calculator',
    metaTitle: 'Free Time to Hire Calculator 2026 — Recruiting Velocity Metric',
    shortDescription:
      'Calculate average time to hire from job posting to offer acceptance, with industry benchmark comparison.',
    metaDescription:
      'Free time to hire calculator 2026. Calculate average days from job posting to offer acceptance. Benchmark against industry averages (tech 35 days, healthcare 49 days, finance 42 days). Identify bottlenecks in your recruiting pipeline.',
    keywords: [
      'time to hire calculator',
      'time to hire metric',
      'recruiting velocity',
      'time to fill vs time to hire',
      'days to hire',
      'hiring speed',
      'recruitment time',
      'time to offer',
      'time to accept',
      'hiring cycle time',
    ],
    icon: Timer,
    tier: 'tier2',
    category: 'HR Analytics',
    path: '/calculators/time-to-hire-calculator',
  },

  {
    slug: 'time-to-fill-calculator',
    status: 'draft',
    title: 'Time to Fill Calculator',
    metaTitle: 'Free Time to Fill Calculator 2026 — Vacancy Duration Metric',
    shortDescription:
      'Calculate average time to fill open positions from job requisition approval to candidate start date.',
    metaDescription:
      'Free time to fill calculator 2026. Calculate average days from requisition approval to candidate start. SHRM benchmark: 36-42 days average. Track by department and role to identify slow-moving positions and forecast hiring capacity.',
    keywords: [
      'time to fill calculator',
      'time to fill metric',
      'vacancy duration',
      'days to fill',
      'recruitment cycle time',
      'time to fill vs time to hire',
      'position fill time',
      'open requisition time',
      'time to start',
      'recruiting timeline',
    ],
    icon: Clock,
    tier: 'tier2',
    category: 'HR Analytics',
    path: '/calculators/time-to-fill-calculator',
  },

  {
    slug: 'recruiting-roi-calculator',
    status: 'draft',
    title: 'Recruiting ROI Calculator',
    metaTitle: 'Free Recruiting ROI Calculator 2026 — Talent Acquisition ROI',
    shortDescription:
      'Calculate recruiting ROI: value of hires vs cost of talent acquisition, with payback period and ROI %.',
    metaDescription:
      'Free recruiting ROI calculator 2026. Calculate talent acquisition ROI: (value of new hire productivity - recruiting cost) / recruiting cost. See payback period, cost per hire, and ROI % for your recruiting investment.',
    keywords: [
      'recruiting ROI calculator',
      'talent acquisition ROI',
      'recruitment ROI',
      'recruiting return on investment',
      'hiring ROI calculator',
      'recruitment investment return',
      'TA ROI',
      'recruiting effectiveness',
      'recruitment cost benefit',
      'hiring effectiveness metrics',
    ],
    icon: BarChart3,
    tier: 'tier2',
    category: 'HR Analytics',
    path: '/calculators/recruiting-roi-calculator',
  },

  {
    slug: 'employee-engagement-score-calculator',
    status: 'draft',
    title: 'Employee Engagement Score Calculator',
    metaTitle: 'Free Employee Engagement Score Calculator 2026 — eNPS & Survey',
    shortDescription:
      'Calculate employee engagement score from survey responses, eNPS (Employee Net Promoter Score), and participation rate.',
    metaDescription:
      'Free employee engagement score calculator 2026. Calculate engagement score from pulse survey responses, eNPS (Employee Net Promoter Score = % promoters - % detractors), and participation rate. Benchmark against Gallup Q12.',
    keywords: [
      'employee engagement score calculator',
      'eNPS calculator',
      'employee net promoter score',
      'engagement survey calculator',
      'employee engagement metrics',
      'engagement index',
      'pulse survey score',
      'engagement rate',
      'Gallup Q12 score',
      'employee satisfaction score',
    ],
    icon: Activity,
    tier: 'tier2',
    category: 'HR Analytics',
    path: '/calculators/employee-engagement-score-calculator',
  },

  {
    slug: 'training-cost-calculator',
    status: 'draft',
    title: 'Training Cost Calculator',
    metaTitle: 'Free Training Cost Calculator 2026 — Per-Employee & Total L&D',
    shortDescription:
      'Calculate total training cost (development, delivery, materials, lost productivity) and cost per employee per hour.',
    metaDescription:
      'Free training cost calculator 2026. Calculate total training cost including development, delivery, materials, facility, travel, and lost productivity. See cost per employee, per training hour, and as % of payroll.',
    keywords: [
      'training cost calculator',
      'employee training cost',
      'L&D budget calculator',
      'cost per training hour',
      'training cost per employee',
      'training ROI',
      'learning and development cost',
      'training program cost',
      'training investment',
      'corporate training cost',
    ],
    icon: GraduationCap,
    tier: 'tier2',
    category: 'HR Analytics',
    path: '/calculators/training-cost-calculator',
  },

  {
    slug: 'employee-cost-calculator',
    status: 'draft',
    title: 'Employee Cost Calculator',
    metaTitle: 'Free Employee Cost Calculator 2026 — True Cost Per Employee',
    shortDescription:
      'Calculate the true cost per employee including wages, benefits, payroll taxes, equipment, and overhead allocation.',
    metaDescription:
      'Free employee cost calculator 2026. Calculate true cost per employee: wages + benefits + payroll taxes + workers comp + equipment + overhead. Typical loaded cost = 1.25-1.40x base salary. Used for pricing and headcount planning.',
    keywords: [
      'employee cost calculator',
      'cost per employee',
      'true cost of an employee',
      'loaded cost per employee',
      'employee total cost',
      'employee cost to employer',
      'burdened labor cost',
      'fully loaded cost',
      'employee overhead cost',
      'cost of employing someone',
    ],
    icon: DollarSign,
    tier: 'tier1',
    category: 'HR Analytics',
    path: '/calculators/employee-cost-calculator',
  },

  {
    slug: 'absenteeism-calculator',
    status: 'draft',
    title: 'Absenteeism Calculator',
    metaTitle: 'Free Absenteeism Calculator 2026 — Absence Rate & Cost',
    shortDescription:
      'Calculate absenteeism rate, cost of absences, and Bradford Factor score with industry benchmark comparison.',
    metaDescription:
      'Free absenteeism calculator 2026. Calculate absenteeism rate (absent days / scheduled days), cost of absences (lost productivity + replacement labor), and Bradford Factor (frequency-weighted score). SHRM benchmark: 3.2% absence rate.',
    keywords: [
      'absenteeism calculator',
      'absence rate calculator',
      'absenteeism rate',
      'Bradford Factor calculator',
      'cost of absenteeism',
      'employee absence rate',
      'absenteeism cost',
      'sick absence rate',
      'absence frequency',
      'workplace absenteeism',
    ],
    icon: CalendarCheck,
    tier: 'tier2',
    category: 'HR Analytics',
    path: '/calculators/absenteeism-calculator',
  },

  {
    slug: 'replacement-cost-calculator',
    status: 'draft',
    title: 'Replacement Cost Calculator',
    metaTitle: 'Free Replacement Cost Calculator 2026 — Cost to Replace Employee',
    shortDescription:
      'Calculate the cost to replace a departing employee: recruitment, onboarding, training, and lost productivity.',
    metaDescription:
      'Free replacement cost calculator 2026. Calculate total cost to replace an employee: recruitment (advertising, agency, HR time), onboarding, training, ramp-up productivity loss, and overtime for coverage. Typical: 50-200% of annual salary.',
    keywords: [
      'replacement cost calculator',
      'cost to replace an employee',
      'employee replacement cost',
      'turnover replacement cost',
      'cost of replacing an employee',
      'replacement cost formula',
      'recruiting replacement cost',
      'cost per replacement',
      'replacement ratio',
      'employee departure cost',
    ],
    icon: RefreshCw,
    tier: 'tier2',
    category: 'HR Analytics',
    path: '/calculators/replacement-cost-calculator',
  },

  {
    slug: 'hr-roi-calculator',
    status: 'draft',
    title: 'HR ROI Calculator',
    metaTitle: 'Free HR ROI Calculator 2026 — HR Investment Return',
    shortDescription:
      'Calculate HR ROI: value of HR initiatives (retention savings, productivity gains, cost reductions) vs HR budget.',
    metaDescription:
      'Free HR ROI calculator 2026. Calculate return on HR investment: value of retention savings, productivity improvements, training ROI, and cost reductions minus HR department budget. See HR ROI % and payback period.',
    keywords: [
      'HR ROI calculator',
      'human resources ROI',
      'HR return on investment',
      'HR value calculator',
      'HR impact calculator',
      'HR program ROI',
      'HR investment return',
      'HR metrics ROI',
      'human capital ROI',
      'HR business value',
    ],
    icon: TrendingUp,
    tier: 'tier2',
    category: 'HR Analytics',
    path: '/calculators/hr-roi-calculator',
  },

  {
    slug: 'salary-benchmark-calculator',
    status: 'draft',
    title: 'Salary Benchmark Calculator',
    metaTitle: 'Free Salary Benchmark Calculator 2026 — Market Salary Comparison',
    shortDescription:
      'Compare employee salaries to market benchmarks by role, location, and experience to identify pay gaps.',
    metaDescription:
      'Free salary benchmark calculator 2026. Compare employee salaries to market data (BLS, Payscale, Glassdoor) by role, location, experience level, and company size. Identify underpaid roles and adjust pay bands for retention.',
    keywords: [
      'salary benchmark calculator',
      'salary benchmarking',
      'market salary comparison',
      'salary comparison tool',
      'compensation benchmarking',
      'salary survey calculator',
      'pay benchmark',
      'market rate calculator',
      'salary range calculator',
      'compensation market analysis',
    ],
    icon: BarChart3,
    tier: 'tier2',
    category: 'HR Analytics',
    path: '/calculators/salary-benchmark-calculator',
  },

  {
    slug: 'employee-benefit-cost-calculator',
    status: 'draft',
    title: 'Employee Benefit Cost Calculator',
    metaTitle: 'Free Employee Benefit Cost Calculator 2026 — Per-Employee Benefits',
    shortDescription:
      'Calculate total employee benefit cost (health, retirement, PTO, insurance) per employee and as % of wages.',
    metaDescription:
      'Free employee benefit cost calculator 2026. Calculate total benefit cost per employee: health insurance, 401(k) match, PTO, life/disability insurance, FSA/HSA contributions. See benefits as % of wages (typically 30-32% per BLS).',
    keywords: [
      'employee benefit cost calculator',
      'benefits cost per employee',
      'employee benefits cost',
      'benefits as percent of salary',
      'total benefits cost',
      'benefits load calculator',
      'employer benefits cost',
      'health insurance cost per employee',
      '401k match cost',
      'benefits package cost',
    ],
    icon: HeartPulse,
    tier: 'tier2',
    category: 'HR Analytics',
    path: '/calculators/employee-benefit-cost-calculator',
  },

  {
    slug: 'employee-utilization-calculator',
    status: 'draft',
    title: 'Employee Utilization Calculator',
    metaTitle: 'Free Employee Utilization Calculator 2026 — Capacity Utilization',
    shortDescription:
      'Calculate workforce utilization rate: productive hours vs available hours, with target benchmark per role.',
    metaDescription:
      'Free employee utilization calculator 2026. Calculate workforce capacity utilization: productive hours / available hours. Target utilization: 75-85% productive, 15-25% non-billable (training, admin). Identify under/over-utilized staff.',
    keywords: [
      'employee utilization calculator',
      'workforce utilization rate',
      'capacity utilization calculator',
      'employee utilization rate',
      'staff utilization',
      'productive hours rate',
      'workforce capacity utilization',
      'utilization vs productivity',
      'employee utilization metrics',
      'capacity utilization rate',
    ],
    icon: Gauge,
    tier: 'tier2',
    category: 'HR Analytics',
    path: '/calculators/employee-utilization-calculator',
  },

  {
    slug: 'payroll-cost-calculator',
    status: 'draft',
    title: 'Payroll Cost Calculator',
    metaTitle: 'Free Payroll Cost Calculator 2026 — Total Cost of Payroll',
    shortDescription:
      'Calculate total payroll cost including wages, employer taxes (FICA, FUTA, SUTA), workers comp, and admin.',
    metaDescription:
      'Free payroll cost calculator 2026. Calculate total cost of running payroll: gross wages + employer FICA (7.65%) + FUTA (0.6%) + SUTA (1-5%) + workers comp + payroll service fees. See loaded payroll cost vs gross wages.',
    keywords: [
      'payroll cost calculator',
      'total payroll cost',
      'employer payroll taxes',
      'cost of payroll',
      'payroll tax calculator employer',
      'employer tax burden',
      'payroll overhead cost',
      'payroll expense calculator',
      'payroll burden calculator',
      'fully loaded payroll cost',
    ],
    icon: CreditCard,
    tier: 'tier2',
    category: 'HR Analytics',
    path: '/calculators/payroll-cost-calculator',
  },

  {
    slug: 'workforce-planning-calculator',
    status: 'draft',
    title: 'Workforce Planning Calculator',
    metaTitle: 'Free Workforce Planning Calculator 2026 — Headcount Demand Model',
    shortDescription:
      'Plan future headcount needs based on revenue growth, attrition, and productivity targets with scenario modeling.',
    metaDescription:
      'Free workforce planning calculator 2026. Project headcount needs for 1-5 years based on revenue targets, current revenue per employee, attrition rate, and productivity goals. Build base, optimistic, and conservative scenarios.',
    keywords: [
      'workforce planning calculator',
      'headcount planning',
      'workforce forecast',
      'strategic workforce planning',
      'headcount projection',
      'workforce demand planning',
      'HR capacity planning',
      'workforce model',
      'talent planning calculator',
      'headcount forecast',
    ],
    icon: CalendarRange,
    tier: 'tier2',
    category: 'HR Analytics',
    path: '/calculators/workforce-planning-calculator',
  },

  {
    slug: 'workforce-capacity-calculator',
    status: 'draft',
    title: 'Workforce Capacity Calculator',
    metaTitle: 'Free Workforce Capacity Calculator 2026 — Max Output per FTE',
    shortDescription:
      'Calculate workforce capacity: maximum output (revenue, units, tickets) achievable with current headcount and hours.',
    metaDescription:
      'Free workforce capacity calculator 2026. Calculate maximum workforce output based on headcount, available hours, and productivity rate. Identify capacity gaps, plan hiring, and benchmark utilization against industry standards.',
    keywords: [
      'workforce capacity calculator',
      'capacity planning calculator',
      'workforce capacity',
      'maximum output calculator',
      'capacity utilization',
      'workforce capacity analysis',
      'capacity vs demand',
      'production capacity calculator',
      'workforce throughput',
      'capacity gap analysis',
    ],
    icon: Target,
    tier: 'tier2',
    category: 'HR Analytics',
    path: '/calculators/workforce-capacity-calculator',
  },

  {
    slug: 'span-of-control-calculator',
    status: 'draft',
    title: 'Span of Control Calculator',
    metaTitle: 'Free Span of Control Calculator 2026 — Manager to IC Ratio',
    shortDescription:
      'Calculate span of control (direct reports per manager) by department with optimal span benchmarking.',
    metaDescription:
      'Free span of control calculator 2026. Calculate average direct reports per manager by department. Benchmark against industry: 4-6 (complex roles), 7-10 (standard), 15-30 (transactional). Identify over/under-managed teams and org design issues.',
    keywords: [
      'span of control calculator',
      'manager to IC ratio',
      'direct reports per manager',
      'span of control ratio',
      'organizational span',
      'management span',
      'supervisory ratio',
      'org design metrics',
      'span of control benchmark',
      'ideal span of control',
    ],
    icon: Users,
    tier: 'tier3',
    category: 'HR Analytics',
    path: '/calculators/span-of-control-calculator',
  },

  {
    slug: 'diversity-ratio-calculator',
    status: 'draft',
    title: 'Diversity Ratio Calculator',
    metaTitle: 'Free Diversity Ratio Calculator 2026 — DEI Metrics Tracker',
    shortDescription:
      'Calculate workforce diversity ratios by gender, race/ethnicity, age, and tenure with EEO-1 benchmark comparison.',
    metaDescription:
      'Free diversity ratio calculator 2026. Track workforce diversity by gender, race/ethnicity, age group, and tenure. Compare to EEO-1 benchmarks and BLS workforce demographics. Identify underrepresented groups and track DEI progress.',
    keywords: [
      'diversity ratio calculator',
      'DEI metrics calculator',
      'workforce diversity',
      'diversity and inclusion metrics',
      'gender diversity ratio',
      'racial diversity calculator',
      'EEO-1 reporting',
      'representation metrics',
      'inclusion index',
      'diversity benchmark',
    ],
    icon: Users,
    tier: 'tier2',
    category: 'HR Analytics',
    path: '/calculators/diversity-ratio-calculator',
  },

  {
    slug: 'promotion-rate-calculator',
    status: 'draft',
    title: 'Promotion Rate Calculator',
    metaTitle: 'Free Promotion Rate Calculator 2026 — Internal Promotion Metrics',
    shortDescription:
      'Calculate promotion rate (internal promotions per total headcount) by department, gender, and tenure cohort.',
    metaDescription:
      'Free promotion rate calculator 2026. Calculate internal promotion rate: % of employees promoted in a period. Track by department, gender, race, and tenure cohort. Identify career-path gaps and ensure equitable promotion practices.',
    keywords: [
      'promotion rate calculator',
      'internal promotion rate',
      'promotion metrics',
      'promotion rate formula',
      'career advancement rate',
      'promotion velocity',
      'promotion equity',
      'promotion cycle',
      'internal mobility rate',
      'promotion analysis',
    ],
    icon: TrendingUp,
    tier: 'tier2',
    category: 'HR Analytics',
    path: '/calculators/promotion-rate-calculator',
  },

  {
    slug: 'internal-mobility-calculator',
    status: 'draft',
    title: 'Internal Mobility Calculator',
    metaTitle: 'Free Internal Mobility Rate Calculator 2026 — Talent Movement',
    shortDescription:
      'Calculate internal mobility rate (lateral moves + promotions) and retention impact of internal talent movement.',
    metaDescription:
      'Free internal mobility rate calculator 2026. Calculate internal mobility rate: lateral moves + promotions per headcount. Higher internal mobility = 2x retention (LinkedIn data). Track by department, level, and time-in-role.',
    keywords: [
      'internal mobility calculator',
      'internal mobility rate',
      'talent mobility',
      'internal transfer rate',
      'lateral move rate',
      'internal job posting',
      'talent marketplace',
      'career pathing metrics',
      'internal talent movement',
      'retention through mobility',
    ],
    icon: ArrowLeftRight,
    tier: 'tier2',
    category: 'HR Analytics',
    path: '/calculators/internal-mobility-calculator',
  },

  {
    slug: 'employee-lifetime-value-calculator',
    status: 'draft',
    title: 'Employee Lifetime Value Calculator',
    metaTitle: 'Free Employee Lifetime Value Calculator 2026 — ELTV / Human Capital',
    shortDescription:
      'Calculate Employee Lifetime Value (ELTV): net value an employee generates over their tenure minus total cost.',
    metaDescription:
      'Free employee lifetime value calculator 2026. Calculate ELTV: (revenue generated - total cost) over employee tenure. Identify high-value roles, optimize tenure curves, and quantify the ROI of retention initiatives vs replacement.',
    keywords: [
      'employee lifetime value calculator',
      'ELTV calculator',
      'human capital value',
      'employee value calculator',
      'lifetime value of an employee',
      'human capital ROI',
      'employee ROI calculator',
      'workforce value',
      'employee net value',
      'talent value calculator',
    ],
    icon: Activity,
    tier: 'tier2',
    category: 'HR Analytics',
    path: '/calculators/employee-lifetime-value-calculator',
  },

  {
    slug: 'labor-efficiency-calculator',
    status: 'draft',
    title: 'Labor Efficiency Calculator',
    metaTitle: 'Free Labor Efficiency Calculator 2026 — Output vs Hours',
    shortDescription:
      'Calculate labor efficiency ratio: actual output vs standard output expected for hours worked, with variance analysis.',
    metaDescription:
      'Free labor efficiency calculator 2026. Calculate labor efficiency = (standard hours for actual output / actual hours worked) x 100. Used in manufacturing, services, and project work. Identify under-performing teams and process improvements.',
    keywords: [
      'labor efficiency calculator',
      'labor efficiency ratio',
      'workforce efficiency',
      'labor productivity ratio',
      'efficiency variance',
      'standard hours vs actual',
      'labor utilization efficiency',
      'operational efficiency calculator',
      'labor performance',
      'efficiency metric',
    ],
    icon: Gauge,
    tier: 'tier2',
    category: 'HR Analytics',
    path: '/calculators/labor-efficiency-calculator',
  },

  // ── Phase 7: Business Finance expansion (33 new calculators) ──

  {
    slug: 'roe-calculator',
    status: 'draft',
    title: 'Return on Equity (ROE) Calculator',
    metaTitle: 'Free ROE Calculator 2026 — Return on Equity Formula & Benchmark',
    shortDescription:
      'Calculate Return on Equity (ROE) = net income / shareholders equity, with industry benchmark comparison and DuPont analysis.',
    metaDescription:
      'Free ROE calculator 2026. Calculate Return on Equity = net income / shareholders equity × 100. See DuPont 3-step decomposition (margin × turnover × leverage). Benchmark against S&P 500 average ROE of 15-20%.',
    keywords: [
      'ROE calculator',
      'return on equity calculator',
      'ROE formula',
      'how to calculate ROE',
      'DuPont analysis',
      'ROE ratio',
      'shareholders equity return',
      'stockholders equity',
      'ROE benchmark',
      'return on common equity',
    ],
    icon: TrendingUp,
    tier: 'tier2',
    category: 'Business Finance',
    path: '/calculators/roe-calculator',
  },

  {
    slug: 'roa-calculator',
    status: 'draft',
    title: 'Return on Assets (ROA) Calculator',
    metaTitle: 'Free ROA Calculator 2026 — Return on Assets Formula & Benchmark',
    shortDescription:
      'Calculate Return on Assets (ROA) = net income / total assets, with industry benchmark comparison.',
    metaDescription:
      'Free ROA calculator 2026. Calculate Return on Assets = net income / total assets × 100. See industry benchmarks (banks 1%, retail 5-10%, tech 10-15%) and asset efficiency analysis.',
    keywords: [
      'ROA calculator',
      'return on assets calculator',
      'ROA formula',
      'how to calculate ROA',
      'asset profitability',
      'ROA ratio',
      'return on total assets',
      'ROA benchmark',
      'asset efficiency',
      'net income to assets',
    ],
    icon: TrendingUp,
    tier: 'tier2',
    category: 'Business Finance',
    path: '/calculators/roa-calculator',
  },

  {
    slug: 'net-margin-calculator',
    status: 'draft',
    title: 'Net Profit Margin Calculator',
    metaTitle: 'Free Net Profit Margin Calculator 2026 — Net Margin Formula',
    shortDescription:
      'Calculate net profit margin = net income / revenue × 100 with industry benchmark comparison.',
    metaDescription:
      'Free net profit margin calculator 2026. Calculate net margin = net income / revenue × 100. See industry benchmarks (tech 20%, retail 3%, restaurants 5%) and trend analysis.',
    keywords: [
      'net profit margin calculator',
      'net margin calculator',
      'net profit margin',
      'how to calculate net margin',
      'net income margin',
      'net profit percentage',
      'net margin formula',
      'net margin ratio',
      'net profit ratio',
      'bottom line margin',
    ],
    icon: Percent,
    tier: 'tier2',
    category: 'Business Finance',
    path: '/calculators/net-margin-calculator',
  },

  {
    slug: 'contribution-margin-calculator',
    status: 'draft',
    title: 'Contribution Margin Calculator',
    metaTitle: 'Free Contribution Margin Calculator 2026 — Per Unit & Ratio',
    shortDescription:
      'Calculate contribution margin per unit and as a ratio = (price - variable cost) / price, with break-even analysis.',
    metaDescription:
      'Free contribution margin calculator 2026. Calculate contribution margin per unit = price - variable cost, and ratio = (price - VC) / price × 100. See break-even units and operating leverage analysis.',
    keywords: [
      'contribution margin calculator',
      'contribution margin ratio',
      'contribution margin per unit',
      'how to calculate contribution margin',
      'CM ratio',
      'variable cost ratio',
      'marginal profit',
      'contribution margin formula',
      'break even contribution',
      'unit contribution',
    ],
    icon: Percent,
    tier: 'tier2',
    category: 'Business Finance',
    path: '/calculators/contribution-margin-calculator',
  },

  {
    slug: 'ebitda-margin-calculator',
    status: 'draft',
    title: 'EBITDA Margin Calculator',
    metaTitle: 'Free EBITDA Margin Calculator 2026 — EBITDA / Revenue',
    shortDescription:
      'Calculate EBITDA margin = EBITDA / revenue × 100, excluding interest, taxes, depreciation, and amortization.',
    metaDescription:
      'Free EBITDA margin calculator 2026. Calculate EBITDA margin = EBITDA / revenue × 100. See how EBITDA strips out financing and accounting decisions for operational comparison. Industry benchmarks included.',
    keywords: [
      'EBITDA margin calculator',
      'EBITDA margin',
      'how to calculate EBITDA margin',
      'EBITDA to revenue',
      'EBITDA percentage',
      'cash flow margin',
      'operating EBITDA margin',
      'EBITDA ratio',
      'EBITDA formula',
      'enterprise value margin',
    ],
    icon: Percent,
    tier: 'tier2',
    category: 'Business Finance',
    path: '/calculators/ebitda-margin-calculator',
  },

  {
    slug: 'operating-margin-calculator',
    status: 'draft',
    title: 'Operating Margin Calculator',
    metaTitle: 'Free Operating Margin Calculator 2026 — Operating Income / Revenue',
    shortDescription:
      'Calculate operating margin = operating income / revenue × 100, measuring operational profitability before interest and taxes.',
    metaDescription:
      'Free operating margin calculator 2026. Calculate operating margin = operating income / revenue × 100. Measures operational profitability before interest and taxes. Industry benchmarks: tech 25%, retail 5%, manufacturing 10%.',
    keywords: [
      'operating margin calculator',
      'operating profit margin',
      'how to calculate operating margin',
      'operating income margin',
      'EBIT margin',
      'operating margin ratio',
      'operating margin formula',
      'operating return on sales',
      'operating profit ratio',
      'op margin',
    ],
    icon: Percent,
    tier: 'tier2',
    category: 'Business Finance',
    path: '/calculators/operating-margin-calculator',
  },

  {
    slug: 'gross-profit-calculator',
    status: 'draft',
    title: 'Gross Profit Calculator',
    metaTitle: 'Free Gross Profit Calculator 2026 — Revenue Minus COGS',
    shortDescription:
      'Calculate gross profit = revenue - COGS, with gross margin %, markup %, and industry benchmark comparison.',
    metaDescription:
      'Free gross profit calculator 2026. Calculate gross profit = revenue - COGS. See gross margin %, markup %, and industry benchmarks (retail 30%, SaaS 80%, grocery 25%). Used for pricing and profitability analysis.',
    keywords: [
      'gross profit calculator',
      'gross profit',
      'how to calculate gross profit',
      'revenue minus COGS',
      'gross profit formula',
      'gross earnings',
      'gross income calculator',
      'gross profit analysis',
      'gross profit dollars',
      'gross profit percentage',
    ],
    icon: DollarSign,
    tier: 'tier2',
    category: 'Business Finance',
    path: '/calculators/gross-profit-calculator',
  },

  {
    slug: 'net-profit-calculator',
    status: 'draft',
    title: 'Net Profit Calculator',
    metaTitle: 'Free Net Profit Calculator 2026 — Net Income Calculation',
    shortDescription:
      'Calculate net profit (net income) = revenue - all expenses including taxes and interest, with margin %.',
    metaDescription:
      'Free net profit calculator 2026. Calculate net profit = revenue - COGS - operating expenses - interest - taxes. See net profit margin %, EPS impact, and bottom-line analysis for income statement.',
    keywords: [
      'net profit calculator',
      'net income calculator',
      'net profit',
      'how to calculate net profit',
      'bottom line profit',
      'net earnings',
      'net profit formula',
      'net income formula',
      'net profit dollars',
      'net income after taxes',
    ],
    icon: DollarSign,
    tier: 'tier2',
    category: 'Business Finance',
    path: '/calculators/net-profit-calculator',
  },

  {
    slug: 'selling-price-calculator',
    status: 'draft',
    title: 'Selling Price Calculator',
    metaTitle: 'Free Selling Price Calculator 2026 — Cost + Margin Pricing',
    shortDescription:
      'Calculate selling price from cost and desired margin or markup, with break-even and target profit analysis.',
    metaDescription:
      'Free selling price calculator 2026. Calculate selling price = cost / (1 - margin %) or cost × (1 + markup %). See break-even units, target profit analysis, and competitive price positioning.',
    keywords: [
      'selling price calculator',
      'how to calculate selling price',
      'price calculator',
      'cost plus pricing',
      'margin based pricing',
      'markup based pricing',
      'selling price formula',
      'retail price calculator',
      'product pricing calculator',
      'target price calculator',
    ],
    icon: Tag,
    tier: 'tier2',
    category: 'Business Finance',
    path: '/calculators/selling-price-calculator',
  },

  {
    slug: 'wholesale-price-calculator',
    status: 'draft',
    title: 'Wholesale Price Calculator',
    metaTitle: 'Free Wholesale Price Calculator 2026 — B2B Pricing from Cost',
    shortDescription:
      'Calculate wholesale price from manufacturing cost with margin, retailer markup, and MSRP comparison.',
    metaDescription:
      'Free wholesale price calculator 2026. Calculate wholesale price = cost × (1 + wholesale margin %). See retailer markup (typically 2x), MSRP (suggested retail), and B2B pricing strategy for distributors.',
    keywords: [
      'wholesale price calculator',
      'wholesale pricing',
      'how to calculate wholesale price',
      'B2B pricing calculator',
      'distributor price',
      'wholesale margin',
      'wholesale markup',
      'wholesale price formula',
      'wholesale to retail',
      'trade price calculator',
    ],
    icon: Tag,
    tier: 'tier2',
    category: 'Business Finance',
    path: '/calculators/wholesale-price-calculator',
  },

  {
    slug: 'retail-margin-calculator',
    status: 'draft',
    title: 'Retail Margin Calculator',
    metaTitle: 'Free Retail Margin Calculator 2026 — Margin, Markup, Keystone',
    shortDescription:
      'Calculate retail margin %, markup %, and gross profit from cost and selling price with keystone pricing.',
    metaDescription:
      'Free retail margin calculator 2026. Calculate retail margin = (price - cost) / price × 100. See markup %, keystone (2x) pricing, and retail industry benchmarks (apparel 50%, grocery 25%, electronics 30%).',
    keywords: [
      'retail margin calculator',
      'retail margin',
      'how to calculate retail margin',
      'retail markup',
      'keystone pricing',
      'retail margin formula',
      'retail gross margin',
      'retail profit margin',
      'retail pricing margin',
      'store margin',
    ],
    icon: Percent,
    tier: 'tier2',
    category: 'Business Finance',
    path: '/calculators/retail-margin-calculator',
  },

  {
    slug: 'burn-rate-calculator',
    status: 'draft',
    title: 'Burn Rate Calculator',
    metaTitle: 'Free Burn Rate Calculator 2026 — Startup Cash Burn Rate',
    shortDescription:
      'Calculate monthly and annual burn rate from cash outflows, with gross and net burn for startups.',
    metaDescription:
      'Free burn rate calculator 2026. Calculate gross burn = total monthly cash outflow, net burn = outflow - inflow. See runway in months. Critical startup metric — track alongside cash balance and fundraising timeline.',
    keywords: [
      'burn rate calculator',
      'cash burn rate',
      'startup burn rate',
      'how to calculate burn rate',
      'monthly burn rate',
      'gross burn rate',
      'net burn rate',
      'burn rate formula',
      'cash consumption rate',
      'startup runway',
    ],
    icon: TrendingDown,
    tier: 'tier1',
    category: 'Business Finance',
    path: '/calculators/burn-rate-calculator',
  },

  {
    slug: 'runway-calculator',
    status: 'draft',
    title: 'Runway Calculator',
    metaTitle: 'Free Runway Calculator 2026 — Months of Cash Remaining',
    shortDescription:
      'Calculate cash runway = current cash / monthly burn rate. See months of runway and fundraising timeline.',
    metaDescription:
      'Free runway calculator 2026. Calculate runway = cash balance / monthly net burn. See months of cash remaining, fundraising timeline (raise 6 months before running out), and scenario analysis.',
    keywords: [
      'runway calculator',
      'cash runway',
      'startup runway',
      'how to calculate runway',
      'months of runway',
      'cash runway formula',
      'runway calculation',
      'startup cash runway',
      'months until out of cash',
      'fundraising timeline',
    ],
    icon: Clock,
    tier: 'tier1',
    category: 'Business Finance',
    path: '/calculators/runway-calculator',
  },

  {
    slug: 'budget-calculator',
    status: 'draft',
    title: 'Business Budget Calculator',
    metaTitle: 'Free Business Budget Calculator 2026 — Annual Budget Planner',
    shortDescription:
      'Build an annual business budget across revenue, COGS, operating expenses, and capital expenditures.',
    metaDescription:
      'Free business budget calculator 2026. Plan annual budget by category: revenue, COGS, salaries, marketing, rent, utilities, capex. See projected net income, breakeven revenue, and budget vs actuals template.',
    keywords: [
      'business budget calculator',
      'annual budget planner',
      'company budget template',
      'how to make a business budget',
      'small business budget',
      'operating budget calculator',
      'revenue budget',
      'expense budget',
      'profit budget',
      'business financial plan',
    ],
    icon: Wallet,
    tier: 'tier2',
    category: 'Business Finance',
    path: '/calculators/budget-calculator',
  },

  {
    slug: 'working-capital-calculator',
    status: 'draft',
    title: 'Working Capital Calculator',
    metaTitle: 'Free Working Capital Calculator 2026 — Current Assets - Liabilities',
    shortDescription:
      'Calculate working capital = current assets - current liabilities, with ratio analysis and liquidity assessment.',
    metaDescription:
      'Free working capital calculator 2026. Calculate working capital = current assets - current liabilities. See working capital ratio, days sales outstanding, and operating cycle. Critical for short-term liquidity management.',
    keywords: [
      'working capital calculator',
      'working capital',
      'how to calculate working capital',
      'net working capital',
      'working capital formula',
      'current assets minus current liabilities',
      'working capital ratio',
      'working capital requirement',
      'liquidity calculator',
      'operating capital',
    ],
    icon: Wallet,
    tier: 'tier2',
    category: 'Business Finance',
    path: '/calculators/working-capital-calculator',
  },

  {
    slug: 'inventory-turnover-calculator',
    status: 'draft',
    title: 'Inventory Turnover Calculator',
    metaTitle: 'Free Inventory Turnover Calculator 2026 — COGS / Avg Inventory',
    shortDescription:
      'Calculate inventory turnover ratio = COGS / average inventory, with days in inventory and industry benchmarks.',
    metaDescription:
      'Free inventory turnover calculator 2026. Calculate inventory turnover = COGS / average inventory. See days in inventory (DIO), industry benchmarks (grocery 15x, retail 6x, manufacturing 5x), and inventory efficiency analysis.',
    keywords: [
      'inventory turnover calculator',
      'inventory turnover ratio',
      'how to calculate inventory turnover',
      'inventory turnover formula',
      'stock turnover',
      'days in inventory',
      'DIO calculator',
      'inventory turns',
      'inventory turnover rate',
      'inventory efficiency',
    ],
    icon: Boxes,
    tier: 'tier2',
    category: 'Business Finance',
    path: '/calculators/inventory-turnover-calculator',
  },

  {
    slug: 'inventory-holding-cost-calculator',
    status: 'draft',
    title: 'Inventory Holding Cost Calculator',
    metaTitle: 'Free Inventory Holding Cost Calculator 2026 — Carrying Cost %',
    shortDescription:
      'Calculate inventory holding cost = (capital + storage + service + risk) costs, as % of inventory value.',
    metaDescription:
      'Free inventory holding cost calculator 2026. Calculate carrying cost = capital cost + storage + insurance + obsolescence + shrinkage. Typical: 20-30% of inventory value annually. See how to reduce holding cost.',
    keywords: [
      'inventory holding cost calculator',
      'carrying cost calculator',
      'inventory carrying cost',
      'holding cost formula',
      'how to calculate holding cost',
      'inventory storage cost',
      'inventory cost',
      'carrying cost of inventory',
      'holding cost percentage',
      'inventory carrying cost ratio',
    ],
    icon: Boxes,
    tier: 'tier2',
    category: 'Business Finance',
    path: '/calculators/inventory-holding-cost-calculator',
  },

  {
    slug: 'eoq-calculator',
    status: 'draft',
    title: 'Economic Order Quantity (EOQ) Calculator',
    metaTitle: 'Free EOQ Calculator 2026 — Optimal Order Size Formula',
    shortDescription:
      'Calculate Economic Order Quantity (EOQ) = √(2DS/H), minimizing total ordering and holding costs.',
    metaDescription:
      'Free EOQ calculator 2026. Calculate Economic Order Quantity = √(2 × demand × order cost / holding cost per unit). Find optimal order size that minimizes total inventory cost. Includes reorder point and safety stock.',
    keywords: [
      'EOQ calculator',
      'economic order quantity calculator',
      'EOQ formula',
      'how to calculate EOQ',
      'optimal order quantity',
      'Wilson formula',
      'EOQ model',
      'order quantity calculator',
      'EOQ analysis',
      'inventory optimization',
    ],
    icon: Boxes,
    tier: 'tier2',
    category: 'Business Finance',
    path: '/calculators/eoq-calculator',
  },

  {
    slug: 'safety-stock-calculator',
    status: 'draft',
    title: 'Safety Stock Calculator',
    metaTitle: 'Free Safety Stock Calculator 2026 — Buffer Stock Formula',
    shortDescription:
      'Calculate safety stock = (max daily usage × max lead time) - (avg daily usage × avg lead time), with service level.',
    metaDescription:
      'Free safety stock calculator 2026. Calculate safety stock = Z × σ × √lead time. See buffer stock for service levels (90%, 95%, 99%) using normal distribution. Prevent stockouts without overstocking.',
    keywords: [
      'safety stock calculator',
      'buffer stock calculator',
      'how to calculate safety stock',
      'safety stock formula',
      'buffer inventory',
      'safety stock level',
      'service level inventory',
      'Z score safety stock',
      'statistical safety stock',
      'stockout prevention',
    ],
    icon: Boxes,
    tier: 'tier2',
    category: 'Business Finance',
    path: '/calculators/safety-stock-calculator',
  },

  {
    slug: 'reorder-point-calculator',
    status: 'draft',
    title: 'Reorder Point Calculator',
    metaTitle: 'Free Reorder Point Calculator 2026 — When to Reorder',
    shortDescription:
      'Calculate reorder point = (avg daily usage × lead time) + safety stock, with lead time demand analysis.',
    metaDescription:
      'Free reorder point calculator 2026. Calculate reorder point = (avg daily demand × lead time in days) + safety stock. See when to reorder to avoid stockouts. Includes lead time demand and service level analysis.',
    keywords: [
      'reorder point calculator',
      'reorder level calculator',
      'how to calculate reorder point',
      'reorder point formula',
      'when to reorder inventory',
      'reorder quantity',
      'lead time demand',
      'reorder point with safety stock',
      'ROP calculator',
      'inventory trigger point',
    ],
    icon: Boxes,
    tier: 'tier2',
    category: 'Business Finance',
    path: '/calculators/reorder-point-calculator',
  },

  {
    slug: 'debt-ratio-calculator',
    status: 'draft',
    title: 'Debt Ratio Calculator',
    metaTitle: 'Free Debt Ratio Calculator 2026 — Total Debt / Total Assets',
    shortDescription:
      'Calculate debt ratio = total liabilities / total assets, measuring financial leverage and solvency.',
    metaDescription:
      'Free debt ratio calculator 2026. Calculate debt ratio = total liabilities / total assets × 100. Measures financial leverage. Healthy: 30-50%. Above 60% = high leverage. See debt-to-equity and interest coverage too.',
    keywords: [
      'debt ratio calculator',
      'debt to assets ratio',
      'how to calculate debt ratio',
      'debt ratio formula',
      'financial leverage ratio',
      'debt ratio analysis',
      'total debt to total assets',
      'gearing ratio',
      'solvency ratio',
      'debt percentage',
    ],
    icon: Scale,
    tier: 'tier2',
    category: 'Business Finance',
    path: '/calculators/debt-ratio-calculator',
  },

  {
    slug: 'current-ratio-calculator',
    status: 'draft',
    title: 'Current Ratio Calculator',
    metaTitle: 'Free Current Ratio Calculator 2026 — Current Assets / Liabilities',
    shortDescription:
      'Calculate current ratio = current assets / current liabilities, measuring short-term liquidity.',
    metaDescription:
      'Free current ratio calculator 2026. Calculate current ratio = current assets / current liabilities. Healthy: 1.5-2.0. Below 1.0 = liquidity risk. See working capital, quick ratio, and cash ratio for full liquidity analysis.',
    keywords: [
      'current ratio calculator',
      'current ratio',
      'how to calculate current ratio',
      'current ratio formula',
      'liquidity ratio',
      'working capital ratio',
      'current assets to current liabilities',
      'current ratio analysis',
      'short term liquidity',
      'current ratio benchmark',
    ],
    icon: Scale,
    tier: 'tier2',
    category: 'Business Finance',
    path: '/calculators/current-ratio-calculator',
  },

  {
    slug: 'quick-ratio-calculator',
    status: 'draft',
    title: 'Quick Ratio (Acid Test) Calculator',
    metaTitle: 'Free Quick Ratio Calculator 2026 — Acid Test Ratio Formula',
    shortDescription:
      'Calculate quick ratio (acid test) = (current assets - inventory) / current liabilities, stricter liquidity test.',
    metaDescription:
      'Free quick ratio calculator 2026. Calculate quick ratio = (cash + marketable securities + AR) / current liabilities, or (current assets - inventory) / current liabilities. Healthy: 1.0+. Stricter than current ratio.',
    keywords: [
      'quick ratio calculator',
      'acid test ratio',
      'how to calculate quick ratio',
      'quick ratio formula',
      'acid test calculator',
      'liquidity ratio',
      'quick ratio analysis',
      'current assets minus inventory',
      'quick ratio benchmark',
      'strict liquidity ratio',
    ],
    icon: Scale,
    tier: 'tier2',
    category: 'Business Finance',
    path: '/calculators/quick-ratio-calculator',
  },

  {
    slug: 'interest-coverage-ratio-calculator',
    status: 'draft',
    title: 'Interest Coverage Ratio Calculator',
    metaTitle: 'Free Interest Coverage Ratio Calculator 2026 — EBIT / Interest',
    shortDescription:
      'Calculate interest coverage ratio = EBIT / interest expense, measuring ability to pay debt interest.',
    metaDescription:
      'Free interest coverage ratio calculator 2026. Calculate ICR = EBIT / interest expense. Healthy: 3.0+. Below 1.5 = distress risk. See debt service coverage and fixed charge coverage for comprehensive solvency analysis.',
    keywords: [
      'interest coverage ratio calculator',
      'interest coverage ratio',
      'how to calculate interest coverage',
      'ICR formula',
      'EBIT to interest ratio',
      'times interest earned',
      'TIE ratio',
      'debt service ratio',
      'interest coverage analysis',
      'solvency ratio',
    ],
    icon: Scale,
    tier: 'tier2',
    category: 'Business Finance',
    path: '/calculators/interest-coverage-ratio-calculator',
  },

  {
    slug: 'asset-turnover-calculator',
    status: 'draft',
    title: 'Asset Turnover Calculator',
    metaTitle: 'Free Asset Turnover Calculator 2026 — Revenue / Total Assets',
    shortDescription:
      'Calculate asset turnover ratio = revenue / total assets, measuring efficiency of asset utilization.',
    metaDescription:
      'Free asset turnover calculator 2026. Calculate asset turnover = revenue / average total assets. Measures how efficiently a company uses assets to generate revenue. Industry: retail 2.5x, tech 0.8x, manufacturing 1.0x.',
    keywords: [
      'asset turnover calculator',
      'asset turnover ratio',
      'how to calculate asset turnover',
      'asset turnover formula',
      'total asset turnover',
      'asset efficiency ratio',
      'asset utilization',
      'asset turnover analysis',
      'fixed asset turnover',
      'return on assets',
    ],
    icon: TrendingUp,
    tier: 'tier2',
    category: 'Business Finance',
    path: '/calculators/asset-turnover-calculator',
  },

  {
    slug: 'business-valuation-calculator',
    status: 'draft',
    title: 'Business Valuation Calculator',
    metaTitle: 'Free Business Valuation Calculator 2026 — DCF, Multiple, Asset',
    shortDescription:
      'Calculate business value using DCF, revenue multiple, EBITDA multiple, and asset-based methods.',
    metaDescription:
      'Free business valuation calculator 2026. Estimate business value using: (1) DCF (discounted cash flow), (2) Revenue multiple (2-5x typical), (3) EBITDA multiple (4-10x typical), (4) Asset-based. See valuation range and methodology comparison.',
    keywords: [
      'business valuation calculator',
      'how much is my business worth',
      'business value calculator',
      'DCF calculator',
      'discounted cash flow',
      'revenue multiple',
      'EBITDA multiple',
      'business appraisal',
      'company valuation',
      'small business valuation',
    ],
    icon: Building,
    tier: 'tier1',
    category: 'Business Finance',
    path: '/calculators/business-valuation-calculator',
  },

  {
    slug: 'depreciation-calculator',
    status: 'draft',
    title: 'Depreciation Calculator',
    metaTitle: 'Free Depreciation Calculator 2026 — Straight Line, MACRS, Double Declining',
    shortDescription:
      'Calculate depreciation using straight-line, double-declining balance, sum-of-years digits, and MACRS methods.',
    metaDescription:
      'Free depreciation calculator 2026. Calculate asset depreciation using straight-line, double-declining balance, sum-of-years digits, and MACRS. See annual depreciation, accumulated depreciation, and book value over asset life.',
    keywords: [
      'depreciation calculator',
      'straight line depreciation',
      'double declining balance',
      'MACRS calculator',
      'how to calculate depreciation',
      'depreciation formula',
      'sum of years digits',
      'asset depreciation',
      'accumulated depreciation',
      'book value calculator',
    ],
    icon: TrendingDown,
    tier: 'tier2',
    category: 'Business Finance',
    path: '/calculators/depreciation-calculator',
  },

  {
    slug: 'amortization-calculator',
    status: 'draft',
    title: 'Amortization Calculator',
    metaTitle: 'Free Amortization Calculator 2026 — Loan & Intangible Asset',
    shortDescription:
      'Calculate loan amortization schedule and intangible asset amortization with monthly payment breakdown.',
    metaDescription:
      'Free amortization calculator 2026. Calculate loan amortization schedule (principal, interest, balance per period) and intangible asset amortization (straight-line over useful life). See total interest and payoff date.',
    keywords: [
      'amortization calculator',
      'loan amortization schedule',
      'how to calculate amortization',
      'amortization formula',
      'intangible asset amortization',
      'goodwill amortization',
      'amortization table',
      'mortgage amortization',
      'amortization expense',
      'loan payoff calculator',
    ],
    icon: TrendingDown,
    tier: 'tier2',
    category: 'Business Finance',
    path: '/calculators/amortization-calculator',
  },

  {
    slug: 'cash-conversion-cycle-calculator',
    status: 'draft',
    title: 'Cash Conversion Cycle Calculator',
    metaTitle: 'Free Cash Conversion Cycle Calculator 2026 — DIO + DSO - DPO',
    shortDescription:
      'Calculate cash conversion cycle = DIO + DSO - DPO, measuring days to convert inventory to cash.',
    metaDescription:
      'Free cash conversion cycle calculator 2026. Calculate CCC = days inventory outstanding + days sales outstanding - days payable outstanding. Measures time to convert investment in inventory to cash. Shorter = better.',
    keywords: [
      'cash conversion cycle calculator',
      'CCC calculator',
      'how to calculate cash conversion cycle',
      'CCC formula',
      'DIO DSO DPO',
      'days inventory outstanding',
      'days sales outstanding',
      'days payable outstanding',
      'cash cycle',
      'operating cycle',
    ],
    icon: Clock,
    tier: 'tier2',
    category: 'Business Finance',
    path: '/calculators/cash-conversion-cycle-calculator',
  },

  {
    slug: 'financial-ratio-calculator',
    status: 'draft',
    title: 'Financial Ratio Calculator',
    metaTitle: 'Free Financial Ratio Calculator 2026 — Liquidity, Solvency, Profitability',
    shortDescription:
      'Calculate 12 key financial ratios: liquidity, solvency, profitability, and efficiency in one tool.',
    metaDescription:
      'Free financial ratio calculator 2026. Calculate all key ratios in one place: current ratio, quick ratio, debt ratio, interest coverage, ROE, ROA, net margin, asset turnover, inventory turnover, and more.',
    keywords: [
      'financial ratio calculator',
      'financial ratios',
      'liquidity ratios',
      'solvency ratios',
      'profitability ratios',
      'efficiency ratios',
      'financial statement analysis',
      'ratio analysis calculator',
      'financial metrics calculator',
      'all financial ratios',
    ],
    icon: Calculator,
    tier: 'tier1',
    category: 'Business Finance',
    path: '/calculators/financial-ratio-calculator',
  },

  {
    slug: 'unit-economics-calculator',
    status: 'draft',
    title: 'Unit Economics Calculator',
    metaTitle: 'Free Unit Economics Calculator 2026 — LTV, CAC, Payback',
    shortDescription:
      'Calculate unit economics: CAC, LTV, LTV:CAC ratio, payback period, and contribution margin per unit.',
    metaDescription:
      'Free unit economics calculator 2026. Calculate customer acquisition cost (CAC), lifetime value (LTV), LTV:CAC ratio (target 3:1), payback period (target <12 months), and contribution margin per unit. Critical for SaaS and subscription businesses.',
    keywords: [
      'unit economics calculator',
      'LTV calculator',
      'CAC calculator',
      'LTV CAC ratio',
      'customer acquisition cost',
      'lifetime value',
      'unit economics',
      'payback period calculator',
      'SaaS unit economics',
      'contribution margin per unit',
    ],
    icon: LineChart,
    tier: 'tier1',
    category: 'Business Finance',
    path: '/calculators/unit-economics-calculator',
  },

  {
    slug: 'operating-cash-flow-calculator',
    status: 'draft',
    title: 'Operating Cash Flow Calculator',
    metaTitle: 'Free Operating Cash Flow Calculator 2026 — OCF Formula',
    shortDescription:
      'Calculate operating cash flow (OCF) using direct and indirect methods, with free cash flow analysis.',
    metaDescription:
      'Free operating cash flow calculator 2026. Calculate OCF = net income + non-cash expenses ± changes in working capital (indirect method). See free cash flow = OCF - capex. Critical for liquidity and valuation.',
    keywords: [
      'operating cash flow calculator',
      'OCF calculator',
      'how to calculate operating cash flow',
      'OCF formula',
      'cash flow from operations',
      'CFO calculator',
      'indirect method cash flow',
      'free cash flow',
      'FCF calculator',
      'cash generated from operations',
    ],
    icon: Wallet,
    tier: 'tier2',
    category: 'Business Finance',
    path: '/calculators/operating-cash-flow-calculator',
  },

  {
    slug: 'contribution-calculator',
    status: 'draft',
    title: 'Contribution Calculator',
    metaTitle: 'Free Contribution Calculator 2026 — Total Contribution Margin',
    shortDescription:
      'Calculate total contribution = (price - variable cost) × units, with break-even and target profit analysis.',
    metaDescription:
      'Free contribution calculator 2026. Calculate total contribution margin = (selling price - variable cost per unit) × units sold. See contribution margin ratio, break-even units, and target profit units. Used for CVP analysis.',
    keywords: [
      'contribution calculator',
      'total contribution margin',
      'contribution margin calculator',
      'CVP analysis',
      'cost volume profit',
      'contribution to profit',
      'how to calculate contribution',
      'contribution formula',
      'break even contribution',
      'target profit calculator',
    ],
    icon: Percent,
    tier: 'tier2',
    category: 'Business Finance',
    path: '/calculators/contribution-calculator',
  },

  // ── Phase 8: Sales & Compensation expansion (24 new calculators) ──

  {
    slug: 'tiered-commission-calculator',
    status: 'draft',
    title: 'Tiered Commission Calculator',
    metaTitle: 'Free Tiered Commission Calculator 2026 — Multi-Tier Sales Pay',
    shortDescription:
      'Calculate commission with tiered rates — different percentages for different sales thresholds, with accelerators.',
    metaDescription:
      'Free tiered commission calculator 2026. Calculate commission with multiple rate tiers (e.g., 5% to $50k, 8% to $100k, 12% above). See per-tier breakdown, total commission, and effective rate. Used in SaaS, real estate, insurance sales.',
    keywords: [
      'tiered commission calculator',
      'graduated commission calculator',
      'tiered commission structure',
      'commission tiers',
      'accelerator commission',
      'progressive commission',
      'commission breakpoints',
      'tiered sales commission',
      'multi rate commission',
      'commission bands',
    ],
    icon: DollarSign,
    tier: 'tier2',
    category: 'Sales & Compensation',
    path: '/calculators/tiered-commission-calculator',
  },

  {
    slug: 'split-commission-calculator',
    status: 'draft',
    title: 'Split Commission Calculator',
    metaTitle: 'Free Split Commission Calculator 2026 — Multi-Rep Deal Split',
    shortDescription:
      'Calculate commission splits between multiple sales reps on a single deal, with custom split percentages.',
    metaDescription:
      'Free split commission calculator 2026. Split commission between 2+ sales reps on shared deals. Enter total deal, commission rate, and each rep\'s split %. See per-rep commission and total payout. Used in team-based selling.',
    keywords: [
      'split commission calculator',
      'commission split',
      'multi rep commission',
      'shared deal commission',
      'team commission split',
      'commission split formula',
      'joint sales commission',
      'co-selling commission',
      'commission allocation',
      'deal split calculator',
    ],
    icon: Users,
    tier: 'tier2',
    category: 'Sales & Compensation',
    path: '/calculators/split-commission-calculator',
  },

  {
    slug: 'quota-calculator',
    status: 'draft',
    title: 'Sales Quota Calculator',
    metaTitle: 'Free Sales Quota Calculator 2026 — Set Rep Quotas by Territory',
    shortDescription:
      'Calculate sales quotas per rep based on territory potential, historical performance, and growth targets.',
    metaDescription:
      'Free sales quota calculator 2026. Set sales quotas per rep based on: territory TAM, historical close rates, average deal size, and growth targets. See quota attainment scenarios and capacity planning.',
    keywords: [
      'sales quota calculator',
      'quota setting',
      'sales rep quota',
      'how to calculate sales quota',
      'quota formula',
      'territory quota',
      'monthly quota',
      'quarterly quota',
      'annual quota',
      'quota attainment',
    ],
    icon: Target,
    tier: 'tier2',
    category: 'Sales & Compensation',
    path: '/calculators/quota-calculator',
  },

  {
    slug: 'sales-target-calculator',
    status: 'draft',
    title: 'Sales Target Calculator',
    metaTitle: 'Free Sales Target Calculator 2026 — Revenue & Unit Goals',
    shortDescription:
      'Calculate sales targets (revenue, units, deals) from revenue goal, average deal size, and win rate.',
    metaDescription:
      'Free sales target calculator 2026. Calculate required sales activity (calls, meetings, proposals, deals) from revenue target, average deal size, and conversion rates. See full funnel targets and capacity requirements.',
    keywords: [
      'sales target calculator',
      'sales goal calculator',
      'how to calculate sales target',
      'revenue target calculator',
      'sales activity target',
      'sales funnel target',
      'sales quota target',
      'monthly sales target',
      'quarterly sales target',
      'sales goal setting',
    ],
    icon: Target,
    tier: 'tier2',
    category: 'Sales & Compensation',
    path: '/calculators/sales-target-calculator',
  },

  {
    slug: 'sales-bonus-calculator',
    status: 'draft',
    title: 'Sales Bonus Calculator',
    metaTitle: 'Free Sales Bonus Calculator 2026 — Performance Bonus & SPIFFs',
    shortDescription:
      'Calculate sales bonuses based on quota attainment, with accelerators, SPIFFs, and team bonuses.',
    metaDescription:
      'Free sales bonus calculator 2026. Calculate performance bonuses from quota attainment: 100% = base bonus, 110%+ = accelerators. Add SPIFFs (single performance incentive) and team bonuses. See total variable comp.',
    keywords: [
      'sales bonus calculator',
      'performance bonus calculator',
      'SPIFF calculator',
      'sales incentive bonus',
      'quota attainment bonus',
      'accelerator bonus',
      'sales bonus structure',
      'variable comp calculator',
      'sales bonus formula',
      'team bonus calculator',
    ],
    icon: Gift,
    tier: 'tier2',
    category: 'Sales & Compensation',
    path: '/calculators/sales-bonus-calculator',
  },

  {
    slug: 'commission-split-calculator',
    status: 'draft',
    title: 'Commission Split Calculator',
    metaTitle: 'Free Commission Split Calculator 2026 — Rep vs Company Split',
    shortDescription:
      'Calculate commission splits between sales rep and company, with custom split percentages and overrides.',
    metaDescription:
      'Free commission split calculator 2026. Calculate commission split between rep and company (e.g., 60/40, 70/30). See rep take-home, company share, and manager overrides. Used for independent contractor and 1099 sales roles.',
    keywords: [
      'commission split calculator',
      'rep company commission split',
      'commission share',
      '1099 commission split',
      'independent contractor commission',
      'commission override',
      'commission split percentage',
      'sales agent commission',
      'broker split',
      'commission distribution',
    ],
    icon: ArrowLeftRight,
    tier: 'tier2',
    category: 'Sales & Compensation',
    path: '/calculators/commission-split-calculator',
  },

  {
    slug: 'incentive-calculator',
    status: 'draft',
    title: 'Sales Incentive Calculator',
    metaTitle: 'Free Sales Incentive Calculator 2026 — Variable Comp Plan Design',
    shortDescription:
      'Calculate total sales incentive compensation: base + commission + bonus + SPIFFs, with cap analysis.',
    metaDescription:
      'Free sales incentive calculator 2026. Design variable compensation: base salary + commission + bonus + SPIFFs. See OTE (on-target earnings), cap analysis, and pay mix. Used for sales comp plan design and benchmarking.',
    keywords: [
      'sales incentive calculator',
      'variable compensation calculator',
      'OTE calculator',
      'on target earnings',
      'sales comp plan',
      'incentive compensation',
      'pay mix calculator',
      'sales compensation design',
      'variable pay',
      'total compensation sales',
    ],
    icon: Gift,
    tier: 'tier2',
    category: 'Sales & Compensation',
    path: '/calculators/incentive-calculator',
  },

  {
    slug: 'revenue-forecast-calculator',
    status: 'draft',
    title: 'Revenue Forecast Calculator',
    metaTitle: 'Free Revenue Forecast Calculator 2026 — Annual Revenue Projection',
    shortDescription:
      'Forecast revenue based on growth rate, seasonality, and scenario analysis (base, optimistic, conservative).',
    metaDescription:
      'Free revenue forecast calculator 2026. Project annual revenue from current run rate and growth rate. See base, optimistic, and conservative scenarios. Includes monthly breakdown, seasonality, and ARR/MRR conversion.',
    keywords: [
      'revenue forecast calculator',
      'revenue projection',
      'annual revenue forecast',
      'revenue growth forecast',
      'how to forecast revenue',
      'revenue model calculator',
      'ARR forecast',
      'MRR forecast',
      'revenue prediction',
      'sales revenue forecast',
    ],
    icon: TrendingUp,
    tier: 'tier1',
    category: 'Sales & Compensation',
    path: '/calculators/revenue-forecast-calculator',
  },

  {
    slug: 'sales-forecast-calculator',
    status: 'draft',
    title: 'Sales Forecast Calculator',
    metaTitle: 'Free Sales Forecast Calculator 2026 — Pipeline-Based Forecast',
    shortDescription:
      'Forecast sales from pipeline value, win rate, and stage probabilities. See weighted pipeline forecast.',
    metaDescription:
      'Free sales forecast calculator 2026. Forecast sales from pipeline: deal value × stage probability × win rate. See weighted pipeline forecast, best/worst case, and coverage ratio (pipeline needed to hit quota).',
    keywords: [
      'sales forecast calculator',
      'pipeline forecast',
      'weighted pipeline',
      'sales prediction',
      'forecast accuracy',
      'pipeline coverage',
      'sales funnel forecast',
      'CRM forecast',
      'probability weighted forecast',
      'sales projection',
    ],
    icon: TrendingUp,
    tier: 'tier1',
    category: 'Sales & Compensation',
    path: '/calculators/sales-forecast-calculator',
  },

  {
    slug: 'pipeline-calculator',
    status: 'draft',
    title: 'Sales Pipeline Calculator',
    metaTitle: 'Free Sales Pipeline Calculator 2026 — Coverage & Gap Analysis',
    shortDescription:
      'Calculate pipeline coverage ratio and gap analysis — how much pipeline you need to hit quota.',
    metaDescription:
      'Free sales pipeline calculator 2026. Calculate pipeline coverage ratio (pipeline ÷ quota), gap to quota, and required pipeline to close. See 3x-4x coverage benchmark and stage-by-stage pipeline health.',
    keywords: [
      'pipeline calculator',
      'pipeline coverage',
      'pipeline gap analysis',
      'sales pipeline ratio',
      'pipeline to quota',
      'pipeline coverage ratio',
      'required pipeline',
      'pipeline health',
      'pipeline value',
      'sales coverage',
    ],
    icon: BarChart3,
    tier: 'tier2',
    category: 'Sales & Compensation',
    path: '/calculators/pipeline-calculator',
  },

  {
    slug: 'win-rate-calculator',
    status: 'draft',
    title: 'Win Rate Calculator',
    metaTitle: 'Free Win Rate Calculator 2026 — Sales Win/Loss Analysis',
    shortDescription:
      'Calculate sales win rate = won deals / total deals, with loss analysis and benchmark comparison.',
    metaDescription:
      'Free win rate calculator 2026. Calculate win rate = won deals / (won + lost deals) × 100. See by rep, segment, and deal size. Industry benchmarks: SaaS 25-35%, enterprise 20-30%, SMB 30-40%. Identify improvement areas.',
    keywords: [
      'win rate calculator',
      'sales win rate',
      'how to calculate win rate',
      'win loss ratio',
      'deal win rate',
      'opportunity win rate',
      'close rate calculator',
      'win rate analysis',
      'sales conversion rate',
      'win rate benchmark',
    ],
    icon: BarChart3,
    tier: 'tier2',
    category: 'Sales & Compensation',
    path: '/calculators/win-rate-calculator',
  },

  {
    slug: 'conversion-rate-calculator',
    status: 'draft',
    title: 'Conversion Rate Calculator',
    metaTitle: 'Free Conversion Rate Calculator 2026 — Sales Funnel Conversion',
    shortDescription:
      'Calculate conversion rate at each funnel stage: lead → MQL → SQL → opportunity → customer.',
    metaDescription:
      'Free conversion rate calculator 2026. Calculate conversion rate = converted / total × 100. Track by funnel stage (lead to MQL, MQL to SQL, SQL to opp, opp to customer). See full funnel conversion and drop-off analysis.',
    keywords: [
      'conversion rate calculator',
      'sales conversion rate',
      'how to calculate conversion rate',
      'funnel conversion',
      'lead conversion rate',
      'MQL to SQL conversion',
      'opportunity conversion',
      'close rate',
      'conversion optimization',
      'funnel analysis',
    ],
    icon: BarChart3,
    tier: 'tier2',
    category: 'Sales & Compensation',
    path: '/calculators/conversion-rate-calculator',
  },

  {
    slug: 'lead-cost-calculator',
    status: 'draft',
    title: 'Lead Cost Calculator',
    metaTitle: 'Free Lead Cost Calculator 2026 — Cost Per Lead by Channel',
    shortDescription:
      'Calculate cost per lead (CPL) by marketing channel, with quality-adjusted lead cost analysis.',
    metaDescription:
      'Free lead cost calculator 2026. Calculate cost per lead = total spend / leads generated. Track by channel (Google Ads, LinkedIn, content, events). See quality-adjusted CPL (cost per SQL) and channel ROI comparison.',
    keywords: [
      'lead cost calculator',
      'cost per lead',
      'CPL calculator',
      'how to calculate lead cost',
      'lead generation cost',
      'marketing lead cost',
      'lead cost by channel',
      'cost per MQL',
      'cost per SQL',
      'lead acquisition cost',
    ],
    icon: DollarSign,
    tier: 'tier2',
    category: 'Sales & Compensation',
    path: '/calculators/lead-cost-calculator',
  },

  {
    slug: 'customer-acquisition-cost-calculator',
    status: 'draft',
    title: 'Customer Acquisition Cost (CAC) Calculator',
    metaTitle: 'Free CAC Calculator 2026 — Customer Acquisition Cost by Channel',
    shortDescription:
      'Calculate CAC = total sales + marketing spend / new customers acquired. Track by channel and cohort.',
    metaDescription:
      'Free CAC calculator 2026. Calculate Customer Acquisition Cost = (sales + marketing spend) / new customers. See CAC by channel, payback period, and LTV:CAC ratio. SaaS benchmark: CAC payback <12 months, LTV:CAC >3:1.',
    keywords: [
      'CAC calculator',
      'customer acquisition cost',
      'how to calculate CAC',
      'CAC formula',
      'cost to acquire customer',
      'customer acquisition cost by channel',
      'blended CAC',
      'paid CAC',
      'CAC payback',
      'acquisition cost',
    ],
    icon: DollarSign,
    tier: 'tier1',
    category: 'Sales & Compensation',
    path: '/calculators/customer-acquisition-cost-calculator',
  },

  {
    slug: 'customer-lifetime-value-calculator',
    status: 'draft',
    title: 'Customer Lifetime Value (CLV) Calculator',
    metaTitle: 'Free CLV Calculator 2026 — Customer Lifetime Value Formula',
    shortDescription:
      'Calculate CLV = (ARPU × gross margin) / monthly churn. See by cohort and segment. Target LTV:CAC 3:1.',
    metaDescription:
      'Free customer lifetime value calculator 2026. Calculate CLV = (ARPU × gross margin) / churn rate. See simple CLV, predictive CLV, and historic CLV. Target LTV:CAC > 3:1 for SaaS. Track by segment and cohort.',
    keywords: [
      'CLV calculator',
      'customer lifetime value',
      'LTV calculator',
      'how to calculate CLV',
      'CLV formula',
      'customer LTV',
      'lifetime customer value',
      'predictive CLV',
      'historic CLV',
      'customer value',
    ],
    icon: DollarSign,
    tier: 'tier1',
    category: 'Sales & Compensation',
    path: '/calculators/customer-lifetime-value-calculator',
  },

  {
    slug: 'cac-payback-calculator',
    status: 'draft',
    title: 'CAC Payback Calculator',
    metaTitle: 'Free CAC Payback Calculator 2026 — Months to Recover CAC',
    shortDescription:
      'Calculate CAC payback period = CAC / (monthly ARPU × gross margin). Target <12 months for SaaS.',
    metaDescription:
      'Free CAC payback calculator 2026. Calculate months to recover customer acquisition cost = CAC / (ARPU × gross margin). SaaS benchmark: <12 months. See how churn and expansion revenue affect payback. Critical for unit economics.',
    keywords: [
      'CAC payback calculator',
      'CAC payback period',
      'how to calculate CAC payback',
      'months to recover CAC',
      'customer acquisition payback',
      'CAC recovery',
      'payback period SaaS',
      'unit economics payback',
      'CAC payback formula',
      'gross margin payback',
    ],
    icon: Clock,
    tier: 'tier1',
    category: 'Sales & Compensation',
    path: '/calculators/cac-payback-calculator',
  },

  {
    slug: 'marketing-roi-calculator',
    status: 'draft',
    title: 'Marketing ROI Calculator',
    metaTitle: 'Free Marketing ROI Calculator 2026 — Campaign ROI & Attribution',
    shortDescription:
      'Calculate marketing ROI = (revenue from campaign - campaign cost) / campaign cost × 100. Track by channel.',
    metaDescription:
      'Free marketing ROI calculator 2026. Calculate marketing return on investment = (attributed revenue - spend) / spend × 100. See by channel (paid, organic, email, events). Includes MQL-to-revenue attribution and payback period.',
    keywords: [
      'marketing ROI calculator',
      'marketing return on investment',
      'campaign ROI',
      'marketing attribution',
      'how to calculate marketing ROI',
      'marketing ROI formula',
      'channel ROI',
      'paid media ROI',
      'content marketing ROI',
      'marketing effectiveness',
    ],
    icon: BarChart3,
    tier: 'tier1',
    category: 'Sales & Compensation',
    path: '/calculators/marketing-roi-calculator',
  },

  {
    slug: 'cpl-calculator',
    status: 'draft',
    title: 'Cost Per Lead (CPL) Calculator',
    metaTitle: 'Free CPL Calculator 2026 — Cost Per Lead by Marketing Channel',
    shortDescription:
      'Calculate CPL = total ad spend / leads generated. Compare CPL across channels and campaigns.',
    metaDescription:
      'Free CPL calculator 2026. Calculate cost per lead = total spend / leads. See CPL by channel: Google Ads $50-200, LinkedIn $75-300, Facebook $25-75, content $50-150. Optimize budget allocation by CPL and lead quality.',
    keywords: [
      'CPL calculator',
      'cost per lead',
      'how to calculate CPL',
      'CPL formula',
      'cost per lead by channel',
      'Google Ads CPL',
      'LinkedIn CPL',
      'Facebook CPL',
      'lead generation cost',
      'CPL benchmark',
    ],
    icon: DollarSign,
    tier: 'tier2',
    category: 'Sales & Compensation',
    path: '/calculators/cpl-calculator',
  },

  {
    slug: 'cpa-calculator',
    status: 'draft',
    title: 'Cost Per Acquisition (CPA) Calculator',
    metaTitle: 'Free CPA Calculator 2026 — Cost Per Customer Acquisition',
    shortDescription:
      'Calculate CPA = total marketing spend / customers acquired. Track CPA by channel and campaign.',
    metaDescription:
      'Free CPA calculator 2026. Calculate cost per acquisition = total spend / customers acquired. See CPA by channel: Google Ads $100-500, LinkedIn $200-800, Facebook $50-200. Optimize for CPA < LTV/3 for healthy unit economics.',
    keywords: [
      'CPA calculator',
      'cost per acquisition',
      'how to calculate CPA',
      'CPA formula',
      'cost per customer',
      'acquisition cost',
      'CPA by channel',
      'target CPA',
      'CPA vs CAC',
      'paid acquisition cost',
    ],
    icon: DollarSign,
    tier: 'tier2',
    category: 'Sales & Compensation',
    path: '/calculators/cpa-calculator',
  },

  {
    slug: 'cpm-calculator',
    status: 'draft',
    title: 'CPM Calculator (Cost Per Mille)',
    metaTitle: 'Free CPM Calculator 2026 — Cost Per 1,000 Impressions',
    shortDescription:
      'Calculate CPM = (ad cost / impressions) × 1,000. Compare CPM across ad networks and channels.',
    metaDescription:
      'Free CPM calculator 2026. Calculate cost per mille (1,000 impressions) = (ad spend / impressions) × 1,000. See CPM by channel: Google Display $2-10, Facebook $5-15, LinkedIn $15-30, video $20-40. Plan ad budget from CPM and reach.',
    keywords: [
      'CPM calculator',
      'cost per mille',
      'cost per thousand impressions',
      'how to calculate CPM',
      'CPM formula',
      'advertising CPM',
      'CPM by channel',
      'Google Ads CPM',
      'Facebook CPM',
      'CPM benchmark',
    ],
    icon: DollarSign,
    tier: 'tier2',
    category: 'Sales & Compensation',
    path: '/calculators/cpm-calculator',
  },

  {
    slug: 'cpc-calculator',
    status: 'draft',
    title: 'CPC Calculator (Cost Per Click)',
    metaTitle: 'Free CPC Calculator 2026 — Cost Per Click Advertising',
    shortDescription:
      'Calculate CPC = ad cost / clicks. Compare CPC across Google Ads, Facebook, LinkedIn by keyword.',
    metaDescription:
      'Free CPC calculator 2026. Calculate cost per click = total ad spend / clicks. See CPC by channel: Google Search $1-50, Facebook $0.50-3, LinkedIn $5-10. Calculate required CPC for target CPA with conversion rate.',
    keywords: [
      'CPC calculator',
      'cost per click',
      'how to calculate CPC',
      'CPC formula',
      'Google Ads CPC',
      'Facebook CPC',
      'LinkedIn CPC',
      'PPC calculator',
      'CPC by keyword',
      'CPC benchmark',
    ],
    icon: DollarSign,
    tier: 'tier2',
    category: 'Sales & Compensation',
    path: '/calculators/cpc-calculator',
  },

  {
    slug: 'roas-calculator',
    status: 'draft',
    title: 'ROAS Calculator (Return on Ad Spend)',
    metaTitle: 'Free ROAS Calculator 2026 — Return on Ad Spend by Channel',
    shortDescription:
      'Calculate ROAS = ad revenue / ad spend. Target 4:1 (400%) for healthy paid media. Track by campaign.',
    metaDescription:
      'Free ROAS calculator 2026. Calculate return on ad spend = revenue from ads / ad spend × 100. Target: 4:1 (400%) for ecommerce, 3:1 for SaaS. See ROAS by channel, campaign, and keyword. Different from ROI (ROAS excludes overhead).',
    keywords: [
      'ROAS calculator',
      'return on ad spend',
      'how to calculate ROAS',
      'ROAS formula',
      'ad ROI',
      'ROAS by channel',
      'Google Ads ROAS',
      'Facebook ROAS',
      'target ROAS',
      'ROAS benchmark',
    ],
    icon: BarChart3,
    tier: 'tier1',
    category: 'Sales & Compensation',
    path: '/calculators/roas-calculator',
  },

  {
    slug: 'revenue-growth-calculator',
    status: 'draft',
    title: 'Revenue Growth Calculator',
    metaTitle: 'Free Revenue Growth Calculator 2026 — YoY, MoM, CAGR',
    shortDescription:
      'Calculate revenue growth rate (YoY, MoM, QoQ) and CAGR. See compound growth projections.',
    metaDescription:
      'Free revenue growth calculator 2026. Calculate revenue growth rate = (current - previous) / previous × 100. See YoY, MoM, QoQ growth and CAGR (compound annual growth rate). Project future revenue with growth rate.',
    keywords: [
      'revenue growth calculator',
      'revenue growth rate',
      'how to calculate revenue growth',
      'YoY growth',
      'MoM growth',
      'QoQ growth',
      'CAGR calculator',
      'compound annual growth rate',
      'revenue growth formula',
      'growth rate calculator',
    ],
    icon: TrendingUp,
    tier: 'tier2',
    category: 'Sales & Compensation',
    path: '/calculators/revenue-growth-calculator',
  },

  {
    slug: 'customer-retention-calculator',
    status: 'draft',
    title: 'Customer Retention Calculator',
    metaTitle: 'Free Customer Retention Calculator 2026 — Churn & Retention Rate',
    shortDescription:
      'Calculate customer retention rate and churn rate. See logo retention, net revenue retention.',
    metaDescription:
      'Free customer retention calculator 2026. Calculate customer retention rate = ((start + new - end) / start) × 100. See logo churn, revenue churn, and net revenue retention (NRR). SaaS benchmark: NRR >110%, logo retention >90%.',
    keywords: [
      'customer retention calculator',
      'customer retention rate',
      'how to calculate customer retention',
      'churn rate calculator',
      'logo retention',
      'net revenue retention',
      'NRR calculator',
      'gross revenue retention',
      'GRR calculator',
      'customer churn',
    ],
    icon: Users,
    tier: 'tier1',
    category: 'Sales & Compensation',
    path: '/calculators/customer-retention-calculator',
  },

  // ── Phase 9: Freelancer & Agency expansion (17 new calculators) ──

  {
    slug: 'freelance-hourly-rate-calculator',
    status: 'draft',
    title: 'Freelance Hourly Rate Calculator',
    metaTitle: 'Free Freelance Hourly Rate Calculator 2026 — Set Your Rate',
    shortDescription:
      'Calculate your freelance hourly rate based on desired annual income, expenses, billable hours, and taxes.',
    metaDescription:
      'Free freelance hourly rate calculator 2026. Calculate your minimum hourly rate from desired annual income, business expenses, billable hours (non-billable overhead), and self-employment taxes. Includes benefits and retirement.',
    keywords: [
      'freelance hourly rate calculator',
      'freelance rate calculator',
      'how to calculate freelance rate',
      'freelance pricing calculator',
      'freelancer hourly rate',
      'consulting rate calculator',
      'freelance rate formula',
      'what should I charge as a freelancer',
      'freelance hourly rate guide',
      'independent contractor rate',
    ],
    icon: DollarSign,
    tier: 'tier1',
    category: 'Freelancer & Agency',
    path: '/calculators/freelance-hourly-rate-calculator',
  },

  {
    slug: 'fiverr-fee-calculator',
    status: 'draft',
    title: 'Fiverr Fee Calculator',
    metaTitle: 'Free Fiverr Fee Calculator 2026 — Seller & Buyer Fees',
    shortDescription:
      'Calculate Fiverr fees: 20% seller service fee and 5% + $2 buyer service fee. See your take-home pay.',
    metaDescription:
      'Free Fiverr fee calculator 2026. Calculate Fiverr seller fees (20% of order) and buyer fees (5% + $2.50 service fee). See take-home pay as a seller and total cost as a buyer. Includes gig extras and tips.',
    keywords: [
      'Fiverr fee calculator',
      'Fiverr seller fee',
      'Fiverr buyer fee',
      'Fiverr commission',
      'Fiverr take home pay',
      'how much does Fiverr charge',
      'Fiverr service fee',
      'Fiverr processing fee',
      'Fiverr gig fee',
      'Fiverr fee percentage',
    ],
    icon: DollarSign,
    tier: 'tier2',
    category: 'Freelancer & Agency',
    path: '/calculators/fiverr-fee-calculator',
  },

  {
    slug: 'upwork-fee-calculator',
    status: 'draft',
    title: 'Upwork Fee Calculator',
    metaTitle: 'Free Upwork Fee Calculator 2026 — Sliding Scale Fees',
    shortDescription:
      'Calculate Upwork fees: 10% flat fee or sliding scale (20%/10%/5%). See freelancer take-home and client cost.',
    metaDescription:
      'Free Upwork fee calculator 2026. Calculate Upwork service fees: 10% flat rate (new) or sliding scale (20% first $500, 10% $500-10k, 5% above $10k). See freelancer take-home pay and client total cost.',
    keywords: [
      'Upwork fee calculator',
      'Upwork service fee',
      'Upwork commission',
      'Upwork sliding scale fee',
      'Upwork take home pay',
      'how much does Upwork charge',
      'Upwork freelancer fee',
      'Upwork client fee',
      'Upwork fee percentage',
      'Upwork connect fee',
    ],
    icon: DollarSign,
    tier: 'tier2',
    category: 'Freelancer & Agency',
    path: '/calculators/upwork-fee-calculator',
  },

  {
    slug: 'project-pricing-calculator',
    status: 'draft',
    title: 'Project Pricing Calculator',
    metaTitle: 'Free Project Pricing Calculator 2026 — Fixed-Bid Project Cost',
    shortDescription:
      'Calculate fixed-bid project price from estimated hours, hourly rate, overhead, and profit margin.',
    metaDescription:
      'Free project pricing calculator 2026. Calculate fixed-bid project price from: estimated hours, hourly rate, overhead multiplier, and desired profit margin. See cost, profit, and price per hour. Used by freelancers and agencies.',
    keywords: [
      'project pricing calculator',
      'how to price a project',
      'fixed bid calculator',
      'project cost calculator',
      'project quote calculator',
      'freelance project pricing',
      'agency project pricing',
      'project rate calculator',
      'project estimate pricing',
      'fixed price project',
    ],
    icon: DollarSign,
    tier: 'tier1',
    category: 'Freelancer & Agency',
    path: '/calculators/project-pricing-calculator',
  },

  {
    slug: 'invoice-calculator',
    status: 'draft',
    title: 'Invoice Calculator',
    metaTitle: 'Free Invoice Calculator 2026 — Subtotal, Tax, Discount, Total',
    shortDescription:
      'Calculate invoice total with line items, subtotal, tax, discount, and final amount due.',
    metaDescription:
      'Free invoice calculator 2026. Calculate invoice total from line items: subtotal, discount, sales tax/VAT, and final amount due. Supports multiple line items, percentage or fixed discounts, and tax-inclusive pricing.',
    keywords: [
      'invoice calculator',
      'invoice total calculator',
      'invoice tax calculator',
      'how to calculate invoice',
      'invoice subtotal calculator',
      'invoice with discount',
      'invoice with tax',
      'VAT calculator',
      'invoice amount calculator',
      'billing calculator',
    ],
    icon: FileText,
    tier: 'tier2',
    category: 'Freelancer & Agency',
    path: '/calculators/invoice-calculator',
  },

  {
    slug: 'client-profit-calculator',
    status: 'draft',
    title: 'Client Profit Calculator',
    metaTitle: 'Free Client Profit Calculator 2026 — Profit Per Client Account',
    shortDescription:
      'Calculate profit per client: revenue from client minus direct costs, labor, and allocated overhead.',
    metaDescription:
      'Free client profit calculator 2026. Calculate profit per client: client revenue minus direct costs (labor, materials, subcontractors) and allocated overhead. See profit margin per client and identify unprofitable accounts.',
    keywords: [
      'client profit calculator',
      'profit per client',
      'client profitability',
      'account profitability',
      'client margin calculator',
      'profit by client',
      'client revenue vs cost',
      'client ROI calculator',
      'account profit analysis',
      'client profitability analysis',
    ],
    icon: DollarSign,
    tier: 'tier2',
    category: 'Freelancer & Agency',
    path: '/calculators/client-profit-calculator',
  },

  {
    slug: 'agency-margin-calculator',
    status: 'draft',
    title: 'Agency Margin Calculator',
    metaTitle: 'Free Agency Margin Calculator 2026 — Agency Markup & Profit',
    shortDescription:
      'Calculate agency margin: (client billing - contractor cost) / client billing. See margin % and markup %.',
    metaDescription:
      'Free agency margin calculator 2026. Calculate agency margin = (client billing - contractor/labor cost) / client billing x 100. See margin %, markup %, and profit dollars. Used by staffing, creative, and consulting agencies.',
    keywords: [
      'agency margin calculator',
      'agency markup calculator',
      'agency margin',
      'agency profit margin',
      'agency billing rate',
      'contractor markup',
      'staffing margin',
      'agency spread',
      'agency gross margin',
      'agency billing vs cost',
    ],
    icon: Percent,
    tier: 'tier2',
    category: 'Freelancer & Agency',
    path: '/calculators/agency-margin-calculator',
  },

  {
    slug: 'proposal-price-calculator',
    status: 'draft',
    title: 'Proposal Price Calculator',
    metaTitle: 'Free Proposal Price Calculator 2026 — RFP & Bid Pricing',
    shortDescription:
      'Calculate proposal price for RFPs and bids: labor, materials, subcontractors, overhead, and profit margin.',
    metaDescription:
      'Free proposal price calculator 2026. Calculate RFP/bid proposal price from: labor hours and rates, materials, subcontractor costs, overhead allocation, contingency, and profit margin. See cost breakdown and competitive price.',
    keywords: [
      'proposal price calculator',
      'RFP pricing calculator',
      'bid price calculator',
      'proposal cost calculator',
      'how to price a proposal',
      'proposal estimate',
      'bid estimate calculator',
      'RFP bid calculator',
      'proposal budget',
      'proposal pricing strategy',
    ],
    icon: FileText,
    tier: 'tier2',
    category: 'Freelancer & Agency',
    path: '/calculators/proposal-price-calculator',
  },

  {
    slug: 'retainer-calculator',
    status: 'draft',
    title: 'Retainer Calculator',
    metaTitle: 'Free Retainer Calculator 2026 — Monthly Retainer Pricing',
    shortDescription:
      'Calculate monthly retainer price based on included hours, hourly rate, discount for commitment, and scope.',
    metaDescription:
      'Free retainer calculator 2026. Calculate monthly retainer fee from: included hours per month, hourly rate, retainer discount (typically 10-20% vs ad-hoc), and scope of work. See effective hourly rate and annual contract value.',
    keywords: [
      'retainer calculator',
      'monthly retainer calculator',
      'retainer fee calculator',
      'retainer pricing',
      'how to price a retainer',
      'retainer agreement calculator',
      'monthly retainer rate',
      'agency retainer calculator',
      'freelance retainer',
      'retainer discount',
    ],
    icon: CalendarRange,
    tier: 'tier2',
    category: 'Freelancer & Agency',
    path: '/calculators/retainer-calculator',
  },

  {
    slug: 'consultant-fee-calculator',
    status: 'draft',
    title: 'Consultant Fee Calculator',
    metaTitle: 'Free Consultant Fee Calculator 2026 — Hourly, Daily, Project',
    shortDescription:
      'Calculate consultant fees: hourly, daily, project-based, and retainer. See market rate benchmarks.',
    metaDescription:
      'Free consultant fee calculator 2026. Calculate consultant fees: hourly rate, daily rate, project fixed fee, and monthly retainer. See market benchmarks by specialty: management consulting $200-500/hr, IT $150-300, marketing $100-250.',
    keywords: [
      'consultant fee calculator',
      'consulting rate calculator',
      'consultant hourly rate',
      'consultant daily rate',
      'how much to charge as a consultant',
      'consulting fee calculator',
      'consultant project fee',
      'consulting rate benchmark',
      'consultant pricing',
      'consulting fee structure',
    ],
    icon: DollarSign,
    tier: 'tier2',
    category: 'Freelancer & Agency',
    path: '/calculators/consultant-fee-calculator',
  },

  {
    slug: 'billable-rate-calculator',
    status: 'draft',
    title: 'Billable Rate Calculator',
    metaTitle: 'Free Billable Rate Calculator 2026 — Required Hourly Rate',
    shortDescription:
      'Calculate required billable rate from target salary, overhead, utilization rate, and profit margin.',
    metaDescription:
      'Free billable rate calculator 2026. Calculate required billable rate from: target annual salary, overhead multiplier, utilization rate (billable vs non-billable hours), and profit margin. See break-even rate and target rate.',
    keywords: [
      'billable rate calculator',
      'how to calculate billable rate',
      'required hourly rate',
      'billable hourly rate',
      'agency billable rate',
      'target billable rate',
      'cost per billable hour',
      'billing rate formula',
      'professional services rate',
      'billable utilization rate',
    ],
    icon: DollarSign,
    tier: 'tier1',
    category: 'Freelancer & Agency',
    path: '/calculators/billable-rate-calculator',
  },

  {
    slug: 'profit-per-client-calculator',
    status: 'draft',
    title: 'Profit Per Client Calculator',
    metaTitle: 'Free Profit Per Client Calculator 2026 — Client Profitability',
    shortDescription:
      'Calculate profit per client from monthly retainer, project revenue, direct costs, and time invested.',
    metaDescription:
      'Free profit per client calculator 2026. Calculate profit per client from: monthly retainer, project revenue, hourly cost of time invested, subcontractor costs, and software/tools. See which clients are most profitable.',
    keywords: [
      'profit per client calculator',
      'profit per client',
      'client profitability calculator',
      'profit per account',
      'client profit margin',
      'which clients are most profitable',
      'client profit analysis',
      'revenue per client',
      'client value calculator',
      'account profitability',
    ],
    icon: DollarSign,
    tier: 'tier2',
    category: 'Freelancer & Agency',
    path: '/calculators/profit-per-client-calculator',
  },

  {
    slug: 'time-value-calculator',
    status: 'draft',
    title: 'Time Value Calculator',
    metaTitle: 'Free Time Value Calculator 2026 — Value of Your Time',
    shortDescription:
      'Calculate the value of your time: annual income / work hours = hourly time value. See cost of activities.',
    metaDescription:
      'Free time value calculator 2026. Calculate the value of your time: annual income / work hours = hourly value. See the cost of any activity (meetings, commute, tasks). Decide what to outsource based on time value vs cost.',
    keywords: [
      'time value calculator',
      'value of time calculator',
      'how much is my time worth',
      'hourly value of time',
      'time cost calculator',
      'opportunity cost of time',
      'time value of money',
      'what is my time worth',
      'time money calculator',
      'cost of my time',
    ],
    icon: Clock,
    tier: 'tier2',
    category: 'Freelancer & Agency',
    path: '/calculators/time-value-calculator',
  },

  {
    slug: 'monthly-revenue-calculator',
    status: 'draft',
    title: 'Monthly Revenue Calculator',
    metaTitle: 'Free Monthly Revenue Calculator 2026 — Freelancer & Agency',
    shortDescription:
      'Calculate monthly revenue from active projects, retainers, hourly work, and one-time projects.',
    metaDescription:
      'Free monthly revenue calculator 2026. Calculate monthly revenue from: active retainers, hourly billable work, project milestones, and one-time projects. See MRR, projected annual revenue, and revenue by client.',
    keywords: [
      'monthly revenue calculator',
      'freelance revenue calculator',
      'agency revenue calculator',
      'monthly revenue projection',
      'revenue forecast freelancer',
      'MRR calculator freelancer',
      'monthly income calculator',
      'freelance revenue model',
      'agency monthly revenue',
      'revenue by client',
    ],
    icon: TrendingUp,
    tier: 'tier2',
    category: 'Freelancer & Agency',
    path: '/calculators/monthly-revenue-calculator',
  },

  {
    slug: 'team-cost-calculator',
    status: 'draft',
    title: 'Team Cost Calculator',
    metaTitle: 'Free Team Cost Calculator 2026 — Project Team Cost',
    shortDescription:
      'Calculate total cost of a project team: each member\'s hours, rate, and role. See loaded cost with overhead.',
    metaDescription:
      'Free team cost calculator 2026. Calculate total project team cost: each member\'s hours, hourly rate, and role. See loaded cost with overhead multiplier (1.3-1.5x). Used for project budgeting and pricing by agencies.',
    keywords: [
      'team cost calculator',
      'project team cost',
      'team budget calculator',
      'how much does a team cost',
      'project staffing cost',
      'team rate calculator',
      'agency team cost',
      'loaded team cost',
      'project labor cost',
      'team billing cost',
    ],
    icon: Users,
    tier: 'tier2',
    category: 'Freelancer & Agency',
    path: '/calculators/team-cost-calculator',
  },

  {
    slug: 'quote-calculator',
    status: 'draft',
    title: 'Quote Calculator',
    metaTitle: 'Free Quote Calculator 2026 — Client Quote Generator',
    shortDescription:
      'Generate a client quote from line items, labor, materials, and profit margin. See total with tax.',
    metaDescription:
      'Free quote calculator 2026. Generate a client quote from: labor hours and rates, materials/parts, subcontractor costs, overhead, profit margin, and sales tax. See itemized quote total and cost breakdown.',
    keywords: [
      'quote calculator',
      'client quote generator',
      'price quote calculator',
      'job quote calculator',
      'how to calculate a quote',
      'quote template calculator',
      'service quote calculator',
      'project quote',
      'price estimate quote',
      'quote pricing tool',
    ],
    icon: FileText,
    tier: 'tier2',
    category: 'Freelancer & Agency',
    path: '/calculators/quote-calculator',
  },

  {
    slug: 'estimate-calculator',
    status: 'draft',
    title: 'Estimate Calculator',
    metaTitle: 'Free Estimate Calculator 2026 — Project Time & Cost Estimate',
    shortDescription:
      'Calculate project estimate: best/likely/worst case hours, cost range, and contingency buffer.',
    metaDescription:
      'Free estimate calculator 2026. Calculate project estimate using three-point estimation: best case, likely case, worst case hours. See expected hours (PERT formula), cost range, and contingency buffer. Used for project planning and bidding.',
    keywords: [
      'estimate calculator',
      'project estimate calculator',
      'time estimate calculator',
      'cost estimate calculator',
      'three point estimate',
      'PERT calculator',
      'project time estimate',
      'project cost estimate',
      'best case worst case estimate',
      'estimation calculator',
    ],
    icon: FileText,
    tier: 'tier2',
    category: 'Freelancer & Agency',
    path: '/calculators/estimate-calculator',
  },

  // ── Phase 10: Startup & SaaS expansion (19 new calculators) ──

  {
    slug: 'mrr-calculator',
    status: 'draft',
    title: 'MRR Calculator',
    metaTitle: 'Free MRR Calculator 2026 — Monthly Recurring Revenue',
    shortDescription: 'Calculate Monthly Recurring Revenue (MRR) from active subscriptions, upgrades, downgrades, and churn.',
    metaDescription: 'Free MRR calculator 2026. Calculate Monthly Recurring Revenue from active subscriptions. Track new MRR, expansion MRR, churned MRR, and net new MRR. Critical SaaS metric for growth tracking.',
    keywords: ['mrr calculator', 'monthly recurring revenue', 'how to calculate mrr', 'mrr formula', 'saas mrr', 'net new mrr', 'mrr growth', 'recurring revenue calculator'],
    icon: TrendingUp, tier: 'tier1', category: 'Startup & SaaS', path: '/calculators/mrr-calculator',
  },
  {
    slug: 'arr-calculator',
    status: 'draft',
    title: 'ARR Calculator',
    metaTitle: 'Free ARR Calculator 2026 — Annual Recurring Revenue',
    shortDescription: 'Calculate Annual Recurring Revenue (ARR) from MRR or annual contracts. Track ARR growth rate.',
    metaDescription: 'Free ARR calculator 2026. Calculate Annual Recurring Revenue = MRR x 12. Track ARR growth, new ARR, churned ARR, and net new ARR. Key SaaS valuation metric.',
    keywords: ['arr calculator', 'annual recurring revenue', 'how to calculate arr', 'arr formula', 'saas arr', 'arr growth rate', 'arr vs mrr'],
    icon: TrendingUp, tier: 'tier1', category: 'Startup & SaaS', path: '/calculators/arr-calculator',
  },
  {
    slug: 'churn-rate-calculator',
    status: 'draft',
    title: 'Churn Rate Calculator',
    metaTitle: 'Free Churn Rate Calculator 2026 — Logo & Revenue Churn',
    shortDescription: 'Calculate customer churn rate (logo) and revenue churn rate. Track by cohort, segment, and plan.',
    metaDescription: 'Free churn rate calculator 2026. Calculate logo churn (customers lost) and revenue churn (MRR lost). SaaS benchmarks: logo churn <5%/yr, revenue churn <3%/yr. Track gross and net churn.',
    keywords: ['churn rate calculator', 'customer churn', 'revenue churn', 'how to calculate churn', 'churn rate formula', 'saas churn', 'logo churn', 'net churn'],
    icon: TrendingDown, tier: 'tier1', category: 'Startup & SaaS', path: '/calculators/churn-rate-calculator',
  },
  {
    slug: 'expansion-mrr-calculator',
    status: 'draft',
    title: 'Expansion MRR Calculator',
    metaTitle: 'Free Expansion MRR Calculator 2026 — Upsell & Cross-sell',
    shortDescription: 'Calculate expansion MRR from upsells, cross-sells, seat additions, and plan upgrades.',
    metaDescription: 'Free expansion MRR calculator 2026. Calculate expansion MRR from upsells, cross-sells, seat additions, and plan upgrades. Track expansion MRR % and its impact on NRR. SaaS benchmark: expansion >10% of MRR.',
    keywords: ['expansion mrr calculator', 'expansion mrr', 'upsell mrr', 'cross sell mrr', 'saas expansion', 'expansion revenue', 'net revenue retention'],
    icon: TrendingUp, tier: 'tier2', category: 'Startup & SaaS', path: '/calculators/expansion-mrr-calculator',
  },
  {
    slug: 'net-revenue-retention-calculator',
    status: 'draft',
    title: 'Net Revenue Retention (NRR) Calculator',
    metaTitle: 'Free NRR Calculator 2026 — Net Revenue Retention',
    shortDescription: 'Calculate NRR = (starting MRR + expansion - churn - contraction) / starting MRR. SaaS benchmark: >110%.',
    metaDescription: 'Free NRR calculator 2026. Calculate Net Revenue Retention = (starting MRR + expansion - churn - contraction) / starting MRR. SaaS benchmark: >110%. Companies with >120% NRR command premium valuations.',
    keywords: ['nrr calculator', 'net revenue retention', 'how to calculate nrr', 'nrr formula', 'saas nrr', 'net dollar retention', 'ndrr calculator'],
    icon: TrendingUp, tier: 'tier1', category: 'Startup & SaaS', path: '/calculators/net-revenue-retention-calculator',
  },
  {
    slug: 'saas-pricing-calculator',
    status: 'draft',
    title: 'SaaS Pricing Calculator',
    metaTitle: 'Free SaaS Pricing Calculator 2026 — Tier Pricing Strategy',
    shortDescription: 'Calculate SaaS pricing tiers based on value metrics, competitor analysis, and willingness to pay.',
    metaDescription: 'Free SaaS pricing calculator 2026. Design SaaS pricing tiers (Free, Starter, Pro, Enterprise) based on value metrics, competitor analysis, and willingness to pay. See price per seat, per usage, and freemium economics.',
    keywords: ['saas pricing calculator', 'saas pricing strategy', 'how to price saas', 'saas tier pricing', 'saas pricing model', 'saas price calculator', 'subscription pricing'],
    icon: Tag, tier: 'tier1', category: 'Startup & SaaS', path: '/calculators/saas-pricing-calculator',
  },
  {
    slug: 'ltv-cac-ratio-calculator',
    status: 'draft',
    title: 'LTV:CAC Ratio Calculator',
    metaTitle: 'Free LTV:CAC Ratio Calculator 2026 — Unit Economics',
    shortDescription: 'Calculate LTV:CAC ratio. Target >3:1 for SaaS. Below 1:1 = losing money per customer.',
    metaDescription: 'Free LTV:CAC ratio calculator 2026. Calculate LTV:CAC ratio = customer lifetime value / customer acquisition cost. Target >3:1 for SaaS. Below 1:1 = losing money. Track by channel and segment.',
    keywords: ['ltv cac ratio calculator', 'ltv cac ratio', 'how to calculate ltv cac', 'ltv cac formula', 'saas unit economics', 'ltv to cac', 'lifetime value to cac'],
    icon: BarChart3, tier: 'tier1', category: 'Startup & SaaS', path: '/calculators/ltv-cac-ratio-calculator',
  },
  {
    slug: 'trial-conversion-calculator',
    status: 'draft',
    title: 'Trial Conversion Rate Calculator',
    metaTitle: 'Free Trial Conversion Calculator 2026 — Trial to Paid',
    shortDescription: 'Calculate trial-to-paid conversion rate. SaaS benchmark: 15-25% for free trials, 2-5% for freemium.',
    metaDescription: 'Free trial conversion rate calculator 2026. Calculate trial-to-paid conversion = paid users / trial users x 100. SaaS benchmarks: free trial 15-25%, freemium 2-5%. Track by cohort, source, and plan.',
    keywords: ['trial conversion calculator', 'trial to paid conversion', 'free trial conversion rate', 'saas trial conversion', 'trial conversion formula', 'trial signup conversion'],
    icon: BarChart3, tier: 'tier2', category: 'Startup & SaaS', path: '/calculators/trial-conversion-calculator',
  },
  {
    slug: 'free-to-paid-conversion-calculator',
    status: 'draft',
    title: 'Free-to-Paid Conversion Calculator',
    metaTitle: 'Free Free-to-Paid Conversion Calculator 2026 — Freemium',
    shortDescription: 'Calculate free-to-paid conversion rate for freemium SaaS. Benchmark: 2-5%.',
    metaDescription: 'Free free-to-paid conversion calculator 2026. Calculate conversion = paid users / free users x 100. Freemium benchmark: 2-5%. Track by feature usage, cohort, and upgrade trigger. Optimize with paywall design.',
    keywords: ['free to paid conversion calculator', 'freemium conversion', 'free to paid conversion rate', 'freemium saas', 'free user conversion', 'freemium metrics'],
    icon: BarChart3, tier: 'tier2', category: 'Startup & SaaS', path: '/calculators/free-to-paid-conversion-calculator',
  },
  {
    slug: 'arpu-calculator',
    status: 'draft',
    title: 'ARPU Calculator',
    metaTitle: 'Free ARPU Calculator 2026 — Average Revenue Per User',
    shortDescription: 'Calculate ARPU = total revenue / total users. Track by segment, plan, and cohort.',
    metaDescription: 'Free ARPU calculator 2026. Calculate Average Revenue Per User = total revenue / total users. Track by segment, plan tier, and cohort. SaaS ARPU benchmarks: SMB $50-200/mo, mid-market $500-2k, enterprise $5k-50k.',
    keywords: ['arpu calculator', 'average revenue per user', 'how to calculate arpu', 'arpu formula', 'saas arpu', 'revenue per user', 'arppu calculator'],
    icon: DollarSign, tier: 'tier2', category: 'Startup & SaaS', path: '/calculators/arpu-calculator',
  },
  {
    slug: 'acv-calculator',
    status: 'draft',
    title: 'ACV Calculator (Annual Contract Value)',
    metaTitle: 'Free ACV Calculator 2026 — Annual Contract Value',
    shortDescription: 'Calculate ACV = total contract value / contract years. Track ACV vs TCV and ACV growth.',
    metaDescription: 'Free ACV calculator 2026. Calculate Annual Contract Value = total contract value / contract term in years. Track ACV vs TCV (total contract value). SaaS benchmarks: SMB $5-25k, mid-market $25-100k, enterprise $100k+.',
    keywords: ['acv calculator', 'annual contract value', 'how to calculate acv', 'acv formula', 'saas acv', 'acv vs tcv', 'annual contract value calculator'],
    icon: DollarSign, tier: 'tier2', category: 'Startup & SaaS', path: '/calculators/acv-calculator',
  },
  {
    slug: 'gross-revenue-retention-calculator',
    status: 'draft',
    title: 'Gross Revenue Retention (GRR) Calculator',
    metaTitle: 'Free GRR Calculator 2026 — Gross Revenue Retention',
    shortDescription: 'Calculate GRR = (starting MRR - churn - contraction) / starting MRR. SaaS benchmark: >90%.',
    metaDescription: 'Free GRR calculator 2026. Calculate Gross Revenue Retention = (starting MRR - churned MRR - contraction MRR) / starting MRR. GRR excludes expansion. SaaS benchmark: >90%. NRR = GRR + expansion.',
    keywords: ['grr calculator', 'gross revenue retention', 'how to calculate grr', 'grr formula', 'saas grr', 'gross retention', 'grr vs nrr'],
    icon: TrendingUp, tier: 'tier2', category: 'Startup & SaaS', path: '/calculators/gross-revenue-retention-calculator',
  },
  {
    slug: 'mau-value-calculator',
    status: 'draft',
    title: 'MAU Value Calculator',
    metaTitle: 'Free MAU Value Calculator 2026 — Value Per Monthly Active User',
    shortDescription: 'Calculate value per MAU = revenue / monthly active users. Track ARPU per active user.',
    metaDescription: 'Free MAU value calculator 2026. Calculate value per monthly active user = revenue / MAU. Track by platform (web, mobile), segment, and engagement level. Used for social media, gaming, and freemium app valuation.',
    keywords: ['mau value calculator', 'value per mau', 'monthly active users value', 'arpu per mau', 'mau valuation', 'user value calculator', 'mau to revenue'],
    icon: Users, tier: 'tier2', category: 'Startup & SaaS', path: '/calculators/mau-value-calculator',
  },
  {
    slug: 'startup-valuation-calculator',
    status: 'draft',
    title: 'Startup Valuation Calculator',
    metaTitle: 'Free Startup Valuation Calculator 2026 — VC & Berkus Method',
    shortDescription: 'Calculate startup valuation using VC method, Berkus method, and revenue multiples.',
    metaDescription: 'Free startup valuation calculator 2026. Estimate pre-money and post-money valuation using VC method (terminal value / ROI), Berkus method, and revenue multiples (ARR x industry multiple). For pre-revenue to Series A.',
    keywords: ['startup valuation calculator', 'how much is my startup worth', 'vc valuation method', 'berkus method', 'pre money valuation', 'post money valuation', 'startup worth calculator'],
    icon: Building, tier: 'tier1', category: 'Startup & SaaS', path: '/calculators/startup-valuation-calculator',
  },
  {
    slug: 'equity-dilution-calculator',
    status: 'draft',
    title: 'Equity Dilution Calculator',
    metaTitle: 'Free Equity Dilution Calculator 2026 — Funding Round Dilution',
    shortDescription: 'Calculate equity dilution per funding round. See ownership % before and after investment.',
    metaDescription: 'Free equity dilution calculator 2026. Calculate how much equity you dilute per funding round. Enter pre-money valuation, investment amount, and option pool. See founder ownership % before and after each round.',
    keywords: ['equity dilution calculator', 'dilution calculator', 'funding round dilution', 'equity dilution formula', 'startup dilution', 'ownership dilution', 'cap table dilution'],
    icon: Percent, tier: 'tier1', category: 'Startup & SaaS', path: '/calculators/equity-dilution-calculator',
  },
  {
    slug: 'cap-table-calculator',
    status: 'draft',
    title: 'Cap Table Calculator',
    metaTitle: 'Free Cap Table Calculator 2026 — Capitalization Table',
    shortDescription: 'Build a cap table showing founder, investor, and employee ownership across multiple rounds.',
    metaDescription: 'Free cap table calculator 2026. Build a capitalization table showing ownership % for founders, investors, and option pool across multiple funding rounds. See pre-money, post-money, and dilution per round.',
    keywords: ['cap table calculator', 'capitalization table', 'cap table template', 'startup cap table', 'equity cap table', 'cap table model', 'ownership table'],
    icon: FileText, tier: 'tier1', category: 'Startup & SaaS', path: '/calculators/cap-table-calculator',
  },
  {
    slug: 'safe-note-calculator',
    status: 'draft',
    title: 'SAFE Note Calculator',
    metaTitle: 'Free SAFE Note Calculator 2026 — YC SAFE Agreement',
    shortDescription: 'Calculate SAFE note conversion: valuation cap, discount rate, and ownership at next round.',
    metaDescription: 'Free SAFE note calculator 2026. Calculate conversion of YC SAFE (Simple Agreement for Future Equity) at next funding round. Compare valuation cap vs discount rate. See ownership % and dilution.',
    keywords: ['safe note calculator', 'safe agreement calculator', 'yc safe', 'safe note conversion', 'valuation cap calculator', 'safe discount rate', 'safe note dilution'],
    icon: FileText, tier: 'tier2', category: 'Startup & SaaS', path: '/calculators/safe-note-calculator',
  },
  {
    slug: 'option-pool-calculator',
    status: 'draft',
    title: 'Option Pool Calculator',
    metaTitle: 'Free Option Pool Calculator 2026 — Employee Equity Pool',
    shortDescription: 'Calculate option pool size, dilution impact, and grants per employee level.',
    metaDescription: 'Free option pool calculator 2026. Calculate employee option pool size (typically 10-20% post-money), dilution impact on founders, and standard grants by role (engineer 0.1-0.5%, VP 0.5-2%, C-level 2-5%).',
    keywords: ['option pool calculator', 'employee option pool', 'equity pool size', 'stock option pool', 'option pool dilution', 'esop calculator', 'employee equity pool'],
    icon: Users, tier: 'tier2', category: 'Startup & SaaS', path: '/calculators/option-pool-calculator',
  },
  {
    slug: 'founder-equity-split-calculator',
    status: 'draft',
    title: 'Founder Equity Split Calculator',
    metaTitle: 'Free Founder Equity Split Calculator 2026 — Co-founder Equity',
    shortDescription: 'Calculate fair founder equity split based on contributions: idea, capital, time, IP, and network.',
    metaDescription: 'Free founder equity split calculator 2026. Calculate fair equity split between co-founders based on: idea contribution, capital invested, time commitment, IP/technical skills, and network/connections. Avoid common equity mistakes.',
    keywords: ['founder equity split calculator', 'co founder equity', 'equity split calculator', 'founder ownership split', 'startup equity division', 'co founder equity split', 'founder shares'],
    icon: Users, tier: 'tier2', category: 'Startup & SaaS', path: '/calculators/founder-equity-split-calculator',
  },

  // ── Phase 11: Accounting expansion (26 new calculators) ──

  {
    slug: 'gst-calculator',
    status: 'draft',
    title: 'GST Calculator',
    metaTitle: 'Free GST Calculator 2026 — Goods and Services Tax',
    shortDescription: 'Calculate GST (Goods and Services Tax) inclusive and exclusive amounts with custom rates.',
    metaDescription: 'Free GST calculator 2026. Calculate GST inclusive and exclusive amounts. Add or remove GST at standard rates (Australia 10%, India 18%, Singapore 9%). See net amount, GST amount, and gross total.',
    keywords: ['gst calculator', 'goods and services tax', 'how to calculate gst', 'gst inclusive', 'gst exclusive', 'gst rate', 'add gst', 'remove gst', 'gst formula'],
    icon: Percent, tier: 'tier1', category: 'Accounting', path: '/calculators/gst-calculator',
  },
  {
    slug: 'vat-calculator',
    status: 'draft',
    title: 'VAT Calculator',
    metaTitle: 'Free VAT Calculator 2026 — Value Added Tax',
    shortDescription: 'Calculate VAT inclusive and exclusive amounts with custom rates. UK 20%, Germany 19%, France 20%.',
    metaDescription: 'Free VAT calculator 2026. Calculate VAT inclusive and exclusive amounts. Add or remove VAT at standard rates (UK 20%, Germany 19%, France 20%, Ireland 23%). See net, VAT, and gross.',
    keywords: ['vat calculator', 'value added tax', 'how to calculate vat', 'vat inclusive', 'vat exclusive', 'vat rate', 'add vat', 'remove vat', 'vat formula'],
    icon: Percent, tier: 'tier1', category: 'Accounting', path: '/calculators/vat-calculator',
  },
  {
    slug: 'sales-tax-calculator',
    status: 'draft',
    title: 'Sales Tax Calculator',
    metaTitle: 'Free Sales Tax Calculator 2026 — US State Sales Tax',
    shortDescription: 'Calculate US sales tax by state with combined state + local rates. Add or extract sales tax.',
    metaDescription: 'Free sales tax calculator 2026. Calculate US sales tax by state (California 7.25%, Texas 6.25%, New York 4%). Add sales tax to price or extract from total. Combined state + local rates.',
    keywords: ['sales tax calculator', 'how to calculate sales tax', 'sales tax rate', 'add sales tax', 'us sales tax', 'state sales tax', 'sales tax formula'],
    icon: Percent, tier: 'tier1', category: 'Accounting', path: '/calculators/sales-tax-calculator',
  },
  {
    slug: 'income-tax-calculator',
    status: 'draft',
    title: 'Income Tax Calculator',
    metaTitle: 'Free Income Tax Calculator 2026 — Federal Income Tax',
    shortDescription: 'Calculate federal income tax from taxable income using 2026 IRS tax brackets and filing status.',
    metaDescription: 'Free income tax calculator 2026. Calculate federal income tax using 2026 IRS tax brackets. Enter taxable income and filing status (single, MFJ, HoH). See marginal rate, effective rate, and take-home.',
    keywords: ['income tax calculator', 'how to calculate income tax', 'federal income tax', 'taxable income', 'income tax brackets', 'income tax rate', 'income tax estimator'],
    icon: FileText, tier: 'tier1', category: 'Accounting', path: '/calculators/income-tax-calculator',
  },
  {
    slug: 'straight-line-depreciation-calculator',
    status: 'draft',
    title: 'Straight Line Depreciation Calculator',
    metaTitle: 'Free Straight Line Depreciation Calculator 2026',
    shortDescription: 'Calculate straight-line depreciation: equal annual expense over useful life.',
    metaDescription: 'Free straight-line depreciation calculator 2026. Calculate equal annual depreciation = (cost - salvage) / useful life. See annual depreciation, accumulated depreciation, and book value per year.',
    keywords: ['straight line depreciation calculator', 'straight line method', 'how to calculate straight line depreciation', 'depreciation schedule', 'annual depreciation', 'book value'],
    icon: TrendingDown, tier: 'tier2', category: 'Accounting', path: '/calculators/straight-line-depreciation-calculator',
  },
  {
    slug: 'declining-balance-depreciation-calculator',
    status: 'draft',
    title: 'Declining Balance Depreciation Calculator',
    metaTitle: 'Free Declining Balance Depreciation Calculator 2026',
    shortDescription: 'Calculate declining balance and double-declining balance depreciation. Accelerated method.',
    metaDescription: 'Free declining balance depreciation calculator 2026. Calculate double-declining balance (DDB) depreciation. See annual depreciation, accumulated depreciation, and book value. Accelerated method for tax.',
    keywords: ['declining balance calculator', 'double declining balance', 'ddb calculator', 'accelerated depreciation', 'how to calculate ddb', 'declining balance method'],
    icon: TrendingDown, tier: 'tier2', category: 'Accounting', path: '/calculators/declining-balance-depreciation-calculator',
  },
  {
    slug: 'journal-entry-calculator',
    status: 'draft',
    title: 'Journal Entry Calculator',
    metaTitle: 'Free Journal Entry Calculator 2026 — Debits and Credits',
    shortDescription: 'Create balanced journal entries with debits and credits. Verify accounting equation.',
    metaDescription: 'Free journal entry calculator 2026. Create balanced double-entry bookkeeping journal entries. Enter debits and credits for multiple accounts. Verify total debits = total credits. Accounting equation check.',
    keywords: ['journal entry calculator', 'debits and credits', 'double entry bookkeeping', 'accounting entry', 'journal entry formula', 'debit credit calculator'],
    icon: FileText, tier: 'tier2', category: 'Accounting', path: '/calculators/journal-entry-calculator',
  },
  {
    slug: 'trial-balance-calculator',
    status: 'draft',
    title: 'Trial Balance Calculator',
    metaTitle: 'Free Trial Balance Calculator 2026 — Debit/Credit Balance',
    shortDescription: 'Verify total debits equal total credits. Check if trial balance is balanced.',
    metaDescription: 'Free trial balance calculator 2026. Enter account balances (debit or credit) and verify total debits = total credits. Identify unbalanced entries. Essential accounting accuracy check.',
    keywords: ['trial balance calculator', 'trial balance', 'debit credit balance', 'accounting balance check', 'how to prepare trial balance', 'unbalanced trial balance'],
    icon: FileText, tier: 'tier2', category: 'Accounting', path: '/calculators/trial-balance-calculator',
  },
  {
    slug: 'balance-sheet-calculator',
    status: 'draft',
    title: 'Balance Sheet Calculator',
    metaTitle: 'Free Balance Sheet Calculator 2026 — Assets = Liabilities + Equity',
    shortDescription: 'Build a balance sheet: assets, liabilities, and equity. Verify accounting equation.',
    metaDescription: 'Free balance sheet calculator 2026. Build a balance sheet with current assets, fixed assets, current liabilities, long-term liabilities, and equity. Verify Assets = Liabilities + Equity.',
    keywords: ['balance sheet calculator', 'how to make a balance sheet', 'accounting equation', 'assets liabilities equity', 'balance sheet formula', 'financial position'],
    icon: FileText, tier: 'tier1', category: 'Accounting', path: '/calculators/balance-sheet-calculator',
  },
  {
    slug: 'cash-flow-statement-calculator',
    status: 'draft',
    title: 'Cash Flow Statement Calculator',
    metaTitle: 'Free Cash Flow Statement Calculator 2026 — Operating/Investing/Financing',
    shortDescription: 'Build a cash flow statement: operating, investing, and financing activities.',
    metaDescription: 'Free cash flow statement calculator 2026. Build a cash flow statement with operating activities (net income + non-cash + WC changes), investing activities (capex, asset sales), and financing (debt, equity).',
    keywords: ['cash flow statement calculator', 'how to make cash flow statement', 'operating activities', 'investing activities', 'financing activities', 'cash flow from operations'],
    icon: Wallet, tier: 'tier1', category: 'Accounting', path: '/calculators/cash-flow-statement-calculator',
  },
  {
    slug: 'pnl-calculator',
    status: 'draft',
    title: 'P&L Calculator (Income Statement)',
    metaTitle: 'Free P&L Calculator 2026 — Profit and Loss Statement',
    shortDescription: 'Build a profit and loss (income) statement: revenue, COGS, gross profit, operating expenses, net income.',
    metaDescription: 'Free P&L calculator 2026. Build a profit and loss statement (income statement): revenue, COGS, gross profit, operating expenses, EBIT, interest, taxes, net income. See margins at each level.',
    keywords: ['pnl calculator', 'profit and loss calculator', 'income statement calculator', 'how to make pnl', 'income statement formula', 'net income calculator'],
    icon: FileText, tier: 'tier1', category: 'Accounting', path: '/calculators/pnl-calculator',
  },
  {
    slug: 'inventory-valuation-calculator',
    status: 'draft',
    title: 'Inventory Valuation Calculator',
    metaTitle: 'Free Inventory Valuation Calculator 2026 — FIFO, LIFO, WAC',
    shortDescription: 'Calculate inventory value using FIFO, LIFO, and weighted average cost methods.',
    metaDescription: 'Free inventory valuation calculator 2026. Compare inventory valuation methods: FIFO (first in first out), LIFO (last in first out), and weighted average cost. See COGS and ending inventory for each method.',
    keywords: ['inventory valuation calculator', 'inventory valuation methods', 'fifo lifo wac', 'ending inventory', 'cogs calculator', 'inventory cost'],
    icon: Boxes, tier: 'tier2', category: 'Accounting', path: '/calculators/inventory-valuation-calculator',
  },
  {
    slug: 'fifo-calculator',
    status: 'draft',
    title: 'FIFO Calculator',
    metaTitle: 'Free FIFO Calculator 2026 — First In First Out Inventory',
    shortDescription: 'Calculate COGS and ending inventory using FIFO (first in, first out) method.',
    metaDescription: 'Free FIFO calculator 2026. Calculate cost of goods sold and ending inventory using FIFO (first in, first out) method. Enter purchase batches and units sold. See per-unit and total COGS.',
    keywords: ['fifo calculator', 'first in first out', 'fifo method', 'fifo cogs', 'fifo ending inventory', 'how to calculate fifo'],
    icon: Boxes, tier: 'tier2', category: 'Accounting', path: '/calculators/fifo-calculator',
  },
  {
    slug: 'lifo-calculator',
    status: 'draft',
    title: 'LIFO Calculator',
    metaTitle: 'Free LIFO Calculator 2026 — Last In First Out Inventory',
    shortDescription: 'Calculate COGS and ending inventory using LIFO (last in, first out) method.',
    metaDescription: 'Free LIFO calculator 2026. Calculate cost of goods sold and ending inventory using LIFO (last in, first out) method. Enter purchase batches and units sold. See per-unit and total COGS.',
    keywords: ['lifo calculator', 'last in first out', 'lifo method', 'lifo cogs', 'lifo ending inventory', 'how to calculate lifo'],
    icon: Boxes, tier: 'tier2', category: 'Accounting', path: '/calculators/lifo-calculator',
  },
  {
    slug: 'weighted-average-cost-calculator',
    status: 'draft',
    title: 'Weighted Average Cost Calculator',
    metaTitle: 'Free Weighted Average Cost Calculator 2026 — WAC Inventory',
    shortDescription: 'Calculate weighted average cost per unit for inventory valuation.',
    metaDescription: 'Free weighted average cost calculator 2026. Calculate WAC = total cost of inventory / total units. See COGS and ending inventory using weighted average method. Compare with FIFO and LIFO.',
    keywords: ['weighted average cost calculator', 'wac calculator', 'weighted average method', 'average cost inventory', 'how to calculate wac', 'avco method'],
    icon: Boxes, tier: 'tier2', category: 'Accounting', path: '/calculators/weighted-average-cost-calculator',
  },
  {
    slug: 'accounts-receivable-days-calculator',
    status: 'draft',
    title: 'Accounts Receivable Days Calculator',
    metaTitle: 'Free Accounts Receivable Days Calculator 2026 — DSO',
    shortDescription: 'Calculate Days Sales Outstanding (DSO) = (AR / revenue) x 365. Lower = faster collection.',
    metaDescription: 'Free accounts receivable days calculator 2026. Calculate DSO = (AR / annual revenue) x 365. Measures average days to collect receivables. Lower = better. Benchmark: 30-60 days.',
    keywords: ['accounts receivable days calculator', 'dso calculator', 'days sales outstanding', 'how to calculate dso', 'ar days', 'collection period', 'receivables days'],
    icon: Clock, tier: 'tier2', category: 'Accounting', path: '/calculators/accounts-receivable-days-calculator',
  },
  {
    slug: 'accounts-payable-days-calculator',
    status: 'draft',
    title: 'Accounts Payable Days Calculator',
    metaTitle: 'Free Accounts Payable Days Calculator 2026 — DPO',
    shortDescription: 'Calculate Days Payable Outstanding (DPO) = (AP / COGS) x 365. Higher = slower payment.',
    metaDescription: 'Free accounts payableable days calculator 2026. Calculate DPO = (AP / annual COGS) x 365. Measures average days to pay suppliers. Higher = better cash flow. Benchmark: 30-60 days.',
    keywords: ['accounts payable days calculator', 'dpo calculator', 'days payable outstanding', 'how to calculate dpo', 'ap days', 'payment period', 'payables days'],
    icon: Clock, tier: 'tier2', category: 'Accounting', path: '/calculators/accounts-payable-days-calculator',
  },
  {
    slug: 'book-value-calculator',
    status: 'draft',
    title: 'Book Value Calculator',
    metaTitle: 'Free Book Value Calculator 2026 — Net Book Value of Assets',
    shortDescription: 'Calculate book value = cost - accumulated depreciation. See net book value per asset.',
    metaDescription: 'Free book value calculator 2026. Calculate net book value = original cost - accumulated depreciation. Track book value per asset, see depreciation schedule, and compare to market value.',
    keywords: ['book value calculator', 'net book value', 'how to calculate book value', 'book value formula', 'carrying value', 'net asset value'],
    icon: TrendingDown, tier: 'tier2', category: 'Accounting', path: '/calculators/book-value-calculator',
  },
  {
    slug: 'fixed-asset-calculator',
    status: 'draft',
    title: 'Fixed Asset Calculator',
    metaTitle: 'Free Fixed Asset Calculator 2026 — Asset Register & Depreciation',
    shortDescription: 'Track fixed assets: cost, depreciation, book value, and disposal gain/loss.',
    metaDescription: 'Free fixed asset calculator 2026. Track fixed assets: original cost, useful life, annual depreciation, accumulated depreciation, book value, and gain/loss on disposal. Asset register summary.',
    keywords: ['fixed asset calculator', 'asset register', 'fixed asset tracking', 'asset depreciation', 'asset disposal', 'book value of fixed assets'],
    icon: Building2, tier: 'tier2', category: 'Accounting', path: '/calculators/fixed-asset-calculator',
  },
  {
    slug: 'cost-allocation-calculator',
    status: 'draft',
    title: 'Cost Allocation Calculator',
    metaTitle: 'Free Cost Allocation Calculator 2026 — Allocate Costs to Departments',
    shortDescription: 'Allocate shared costs to departments based on usage, headcount, or square footage.',
    metaDescription: 'Free cost allocation calculator 2026. Allocate shared costs (rent, utilities, IT) to departments based on allocation bases: headcount, square footage, usage, or revenue. See cost per department.',
    keywords: ['cost allocation calculator', 'allocate costs', 'cost sharing', 'how to allocate costs', 'allocation base', 'cost distribution', 'department cost allocation'],
    icon: PieChart, tier: 'tier2', category: 'Accounting', path: '/calculators/cost-allocation-calculator',
  },
  {
    slug: 'overhead-rate-calculator',
    status: 'draft',
    title: 'Overhead Rate Calculator',
    metaTitle: 'Free Overhead Rate Calculator 2026 — Overhead Absorption',
    shortDescription: 'Calculate overhead rate = total overhead / allocation base. Applied to products/jobs.',
    metaDescription: 'Free overhead rate calculator 2026. Calculate overhead absorption rate = total overhead / allocation base (direct labor hours, machine hours, or direct labor cost). Apply to products for full costing.',
    keywords: ['overhead rate calculator', 'overhead absorption rate', 'how to calculate overhead rate', 'predetermined overhead rate', 'overhead allocation', 'manufacturing overhead'],
    icon: Percent, tier: 'tier2', category: 'Accounting', path: '/calculators/overhead-rate-calculator',
  },
  {
    slug: 'manufacturing-cost-calculator',
    status: 'draft',
    title: 'Manufacturing Cost Calculator',
    metaTitle: 'Free Manufacturing Cost Calculator 2026 — Total Production Cost',
    shortDescription: 'Calculate total manufacturing cost: direct materials + direct labor + manufacturing overhead.',
    metaDescription: 'Free manufacturing cost calculator 2026. Calculate total manufacturing cost = direct materials + direct labor + manufacturing overhead. See per-unit cost, COGM, and cost of goods available for sale.',
    keywords: ['manufacturing cost calculator', 'total manufacturing cost', 'how to calculate manufacturing cost', 'production cost', 'direct materials', 'direct labor', 'manufacturing overhead'],
    icon: Building2, tier: 'tier2', category: 'Accounting', path: '/calculators/manufacturing-cost-calculator',
  },
  {
    slug: 'cogs-calculator',
    status: 'draft',
    title: 'COGS Calculator (Cost of Goods Sold)',
    metaTitle: 'Free COGS Calculator 2026 — Cost of Goods Sold Formula',
    shortDescription: 'Calculate COGS = beginning inventory + purchases - ending inventory. See gross profit.',
    metaDescription: 'Free COGS calculator 2026. Calculate Cost of Goods Sold = beginning inventory + purchases - ending inventory. See gross profit and gross margin. Essential for income statement and tax.',
    keywords: ['cogs calculator', 'cost of goods sold', 'how to calculate cogs', 'cogs formula', 'beginning inventory', 'ending inventory', 'cogs calculation'],
    icon: DollarSign, tier: 'tier1', category: 'Accounting', path: '/calculators/cogs-calculator',
  },
  {
    slug: 'operating-expense-ratio-calculator',
    status: 'draft',
    title: 'Operating Expense Ratio Calculator',
    metaTitle: 'Free Operating Expense Ratio Calculator 2026',
    shortDescription: 'Calculate operating expense ratio = operating expenses / revenue x 100. Lower = more efficient.',
    metaDescription: 'Free operating expense ratio calculator 2026. Calculate OER = operating expenses / revenue x 100. Measures efficiency. Lower = better. Track by industry: SaaS 40-60%, retail 20-30%, manufacturing 15-25%.',
    keywords: ['operating expense ratio calculator', 'oer calculator', 'how to calculate operating expense ratio', 'opex ratio', 'efficiency ratio', 'operating cost ratio'],
    icon: Percent, tier: 'tier2', category: 'Accounting', path: '/calculators/operating-expense-ratio-calculator',
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Get a single calculator's metadata by slug */
export function getCalculatorBySlug(slug: string): CalculatorMeta | undefined {
  return calculators.find((c) => c.slug === slug);
}

/** Get all calculator slugs (for generateStaticParams) */
export function getAllSlugs(includeDrafts = false): CalculatorSlug[] {
  const list = includeDrafts ? calculators : getPublishedCalculators();
  return list.map((c) => c.slug);
}

/** Get calculators grouped by tier */
export function getCalculatorsByTier() {
  return {
    tier1: calculators.filter((c) => c.tier === 'tier1'),
    tier2: calculators.filter((c) => c.tier === 'tier2'),
    tier3: calculators.filter((c) => c.tier === 'tier3'),
  };
}

/** Get calculators grouped by category (for hub page) */
export function getCalculatorsByCategory() {
  const grouped: Record<string, CalculatorMeta[]> = {};
  const active = getPublishedCalculators();
  for (const cat of categoryOrder) {
    grouped[cat] = active.filter((c) => c.category === cat);
  }
  return grouped;
}

/**
 * Check if a calculator is actively published.
 * If status is not set, default to published for backward compatibility.
 * If status is scheduled, it is active only if today is on or after publishDate.
 */
export function isCalculatorPublished(calc: CalculatorMeta): boolean {
  if (calc.status === 'draft') return false;
  if (calc.status === 'scheduled') {
    if (!calc.publishDate) return false;
    const publishTime = new Date(calc.publishDate).getTime();
    return !isNaN(publishTime) && Date.now() >= publishTime;
  }
  return true;
}

/** Get only published calculators */
export function getPublishedCalculators(): CalculatorMeta[] {
  return calculators.filter(isCalculatorPublished);
}
