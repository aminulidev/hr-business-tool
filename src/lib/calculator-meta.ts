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
  | 'revenue-per-employee-calculator';

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
  'HR Analytics',
  'Commission & Compensation',
  'Business Finance',
  'Time & Attendance',
] as const;

export const categoryMeta: Record<string, { emoji: string; description: string }> = {
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
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Get a single calculator's metadata by slug */
export function getCalculatorBySlug(slug: string): CalculatorMeta | undefined {
  return calculators.find((c) => c.slug === slug);
}

/** Get all calculator slugs (for generateStaticParams) */
export function getAllSlugs(): CalculatorSlug[] {
  return calculators.map((c) => c.slug);
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
  for (const cat of categoryOrder) {
    grouped[cat] = calculators.filter((c) => c.category === cat);
  }
  return grouped;
}
