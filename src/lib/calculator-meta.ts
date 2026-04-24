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
  | 'sales-commission'
  | 'pro-rata-salary'
  | 'salary-increase'
  | 'overtime'
  | 'salary-converter'
  | 'payroll'
  | 'post-tax-bonus'
  | 'tax-bracket'
  | 'after-tax-income'
  | 'time-card'
  | 'business-day'
  | 'profit-margin'
  | 'roi'
  | 'discount'
  | 'property-tax'
  | 'gross-margin'
  | 'markup'
  | 'tax-refund'
  | 'decimal-converter'
  | 'wages'
  | 'payroll-deduction'
  | 'salary-tax'
  | 'time-card-lunch'
  | 'hourly-paycheck'
  | 'severance-pay'
  | 'workers-comp'
  | 'fica-tax'
  | 'time-and-a-half'
  | 'employee-turnover'
  | 'cost-per-hire'
  | 'billable-hours'
  | 'revenue-per-employee';

export interface CalculatorMeta {
  slug: CalculatorSlug;
  title: string;
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

export const SITE_URL = 'https://calchub.com';
export const SITE_NAME = 'CalcHub';
export const SITE_TAGLINE = 'Free Online Business & HR Calculators';

// Category display metadata — order matters for hub page
// Category order: highest-demand categories first (by search volume, CPC, and calculator count)
export const categoryOrder = [
  'Payroll & Taxes',          // 8 tools — highest volume & CPC keywords
  'Salary & Compensation',    // 5 tools — high-demand salary/pay topics
  'HR Analytics',             // 5 tools — HR metrics, severance, workers comp
  'Commission & Compensation', // 2 tools — high-value tier1 keywords
  'Business Finance',         // 5 tools — strong margin/ROI/discount keywords
  'Time & Attendance',        // 4 tools — essential time-tracking tools
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
    slug: 'sales-commission',
    title: 'Sales Commission Calculator',
    shortDescription:
      'Calculate take-home commission from flat rates, tiered structures, and quota-based plans with deductions and visual charts.',
    metaDescription:
      'Free sales commission calculator. Calculate your commission from flat rate, tiered, or quota attainment structures. Includes deductions, visual charts, and CSV export. Accurate results for real estate, SaaS, B2B, and retail sales professionals.',
    keywords: [
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
    path: '/calculators/sales-commission',
  },
  {
    slug: 'salary-converter',
    title: 'Salary Converter Calculator',
    shortDescription:
      'Convert between hourly, daily, weekly, bi-weekly, semi-monthly, monthly, and annual salary rates instantly.',
    metaDescription:
      'Free salary converter calculator. Instantly convert your pay between hourly, daily, weekly, bi-weekly, semi-monthly, monthly, and annual rates. See equivalent earnings across all pay periods with overtime adjustments.',
    keywords: [
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
    slug: 'pro-rata-salary',
    title: 'Pro Rata Salary Calculator',
    shortDescription:
      'Calculate prorated salary when an employee starts mid-year, works part-time, or is on a fixed-term contract.',
    metaDescription:
      'Free pro rata salary calculator. Quickly calculate prorated pay for mid-year starts, part-time employees, and contract workers. Includes daily rate, percentage of full salary, and detailed worked examples.',
    keywords: [
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
    path: '/calculators/pro-rata-salary',
  },
  {
    slug: 'salary-increase',
    title: 'Salary Increase Calculator',
    shortDescription:
      'See what a percentage raise looks like in actual paycheck dollars, with inflation adjustment and future projections.',
    metaDescription:
      'Free salary increase calculator. See exactly how a percentage raise affects your paycheck with before-and-after comparison, inflation adjustment, and future salary projections. Plan your next raise with confidence.',
    keywords: [
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
    path: '/calculators/salary-increase',
  },
  {
    slug: 'overtime',
    title: 'Overtime Calculator',
    shortDescription:
      'Calculate overtime pay with standard time-and-a-half and double-time rates, weekly and daily tracking with state-specific rules.',
    metaDescription:
      'Free overtime calculator. Calculate overtime pay at 1.5x and 2x rates, track weekly and daily hours, and see your total earnings with overtime included. Covers federal FLSA rules and common state overtime laws.',
    keywords: [
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
    path: '/calculators/overtime',
  },

  // ── Payroll & Taxes ──
  {
    slug: 'payroll',
    title: 'Payroll & Paycheck Calculator',
    shortDescription:
      'Estimate your take-home pay after federal and state taxes, deductions, and benefits contributions.',
    metaDescription:
      'Free payroll and paycheck calculator. Estimate your take-home pay after federal tax, state tax, Social Security, Medicare, and custom deductions. See your net pay breakdown for salary and hourly employees.',
    keywords: [
      'payroll calculator',
      'paycheck calculator',
      'take home pay calculator',
      'net pay calculator',
      'salary after taxes calculator',
      'paycheck after tax calculator',
      'federal tax withholding calculator',
      'state tax calculator paycheck',
      'payroll deductions calculator',
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
    path: '/calculators/payroll',
  },
  {
    slug: 'post-tax-bonus',
    title: 'Post-Tax & Bonus Calculator',
    shortDescription:
      'Calculate your net bonus after federal and state tax withholding, or find your gross bonus from a desired net amount.',
    metaDescription:
      'Free bonus tax calculator. Find your take-home bonus after supplemental tax withholding, or reverse-calculate the gross bonus needed for a specific net amount. Covers federal flat rate, state taxes, and the bonus tax methodology.',
    keywords: [
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
    path: '/calculators/post-tax-bonus',
  },
  {
    slug: 'tax-bracket',
    title: 'Tax Bracket Calculator',
    shortDescription:
      'Find your federal tax bracket, effective tax rate, and marginal rate with a detailed breakdown of taxes owed by bracket.',
    metaDescription:
      'Free tax bracket calculator. Find your federal income tax bracket, calculate effective and marginal tax rates, and see exactly how much tax you owe in each bracket. Covers 2025 federal tax brackets for all filing statuses.',
    keywords: [
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
    path: '/calculators/tax-bracket',
  },
  {
    slug: 'after-tax-income',
    title: 'After-Tax Income Calculator',
    shortDescription:
      'Calculate your net income after federal and state taxes with a detailed breakdown of tax savings and take-home pay.',
    metaDescription:
      'Free after-tax income calculator. See your take-home pay after federal and state income taxes, Social Security, and Medicare. Compare your gross vs. net income with a clear tax breakdown for any salary or hourly rate.',
    keywords: [
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
    path: '/calculators/after-tax-income',
  },

  // ── Time & Attendance ──
  {
    slug: 'time-card',
    title: 'Time Card & Time-to-Decimal Calculator',
    shortDescription:
      'Calculate total work hours from clock-in/out times, deduct breaks, and convert to decimal format for payroll.',
    metaDescription:
      'Free time card calculator. Convert clock-in and clock-out times to total hours, deduct breaks, and get decimal-hour output for payroll processing. Supports multiple time entries and AM/PM format.',
    keywords: [
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
    path: '/calculators/time-card',
  },
  {
    slug: 'business-day',
    title: 'Business Day Calculator',
    shortDescription:
      'Calculate business days between two dates, or add/subtract business days from a start date, excluding weekends and holidays.',
    metaDescription:
      'Free business day calculator. Find the number of business days between two dates, or add/subtract working days from a start date. Excludes weekends and optionally excludes public holidays. Essential for project deadlines and HR planning.',
    keywords: [
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
    path: '/calculators/business-day',
  },

  // ── Business Finance ──
  {
    slug: 'profit-margin',
    title: 'Profit Margin & Markup Calculator',
    shortDescription:
      'Calculate retail pricing, profit margins, and markup percentages from wholesale costs and selling prices.',
    metaDescription:
      'Free profit margin and markup calculator. Calculate profit margin, markup percentage, gross profit, and selling price from cost and revenue. Essential for retail pricing, wholesale, and business financial planning.',
    keywords: [
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
    path: '/calculators/profit-margin',
  },
  {
    slug: 'roi',
    title: 'ROI Calculator',
    shortDescription:
      'Calculate Return on Investment from initial cost, final value, and time period with annualized returns.',
    metaDescription:
      'Free ROI calculator. Calculate Return on Investment percentage, net profit/loss, and annualized returns from your investment costs and gains. Perfect for business decisions, marketing campaigns, and investment analysis.',
    keywords: [
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
    path: '/calculators/roi',
  },
  {
    slug: 'discount',
    title: 'Discount Calculator',
    shortDescription:
      'Calculate sale prices, discount amounts, and savings from percentage or fixed discounts. Compare original vs. discounted prices.',
    metaDescription:
      'Free discount calculator. Quickly calculate the sale price after a percentage or fixed-amount discount. See how much you save, compare multiple discounts, and find the original price from a discounted amount. Perfect for retail and business pricing.',
    keywords: [
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
    path: '/calculators/discount',
  },

  // ── NEW: Property Tax ──
  {
    slug: 'property-tax',
    title: 'Property Tax Calculator',
    shortDescription:
      'Estimate your annual property tax from assessed value, tax rate, and exemptions. Compare effective rates across jurisdictions.',
    metaDescription:
      'Free property tax calculator. Estimate your annual property tax bill based on assessed value, millage rate, and applicable exemptions. Compare effective tax rates, see monthly breakdowns, and plan your housing budget with accuracy.',
    keywords: [
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
    path: '/calculators/property-tax',
  },

  // ── NEW: Gross Margin ──
  {
    slug: 'gross-margin',
    title: 'Gross Margin Calculator',
    shortDescription:
      'Calculate gross margin, gross profit, and COGS from revenue and cost of goods sold with detailed financial analysis.',
    metaDescription:
      'Free gross margin calculator. Quickly compute gross margin percentage, gross profit, and cost of goods sold from your revenue and costs. Includes visual breakdowns, industry benchmarks, and multi-product comparison for business financial analysis.',
    keywords: [
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
    path: '/calculators/gross-margin',
  },

  // ── NEW: Markup ──
  {
    slug: 'markup',
    title: 'Markup Calculator',
    shortDescription:
      'Calculate selling price from cost and desired markup percentage, with margin vs markup comparison and multi-tier pricing.',
    metaDescription:
      'Free markup calculator. Determine the right selling price from your cost basis and desired markup percentage. Includes margin vs markup comparison, cost-based pricing tables, and visual charts for wholesale and retail pricing decisions.',
    keywords: [
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
    path: '/calculators/markup',
  },

  // ── NEW: Tax Refund ──
  {
    slug: 'tax-refund',
    title: 'Tax Refund Calculator',
    shortDescription:
      'Estimate your federal and state tax refund based on income, withholding, deductions, and filing status.',
    metaDescription:
      'Free tax refund estimator. Calculate your expected tax refund or amount owed based on your income, federal and state tax withholdings, deductions, credits, and filing status. Plan your tax season with confidence.',
    keywords: [
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
    path: '/calculators/tax-refund',
  },

  // ── NEW: Decimal Converter ──
  {
    slug: 'decimal-converter',
    title: 'Decimal & Fraction Converter',
    shortDescription:
      'Convert between decimals, fractions, percentages, and time formats instantly. Essential for payroll and math calculations.',
    metaDescription:
      'Free decimal and fraction converter. Convert decimals to fractions, fractions to decimals, decimals to percentages, and time to decimal hours. Perfect for payroll processing, grade calculations, and everyday math conversions.',
    keywords: [
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
    path: '/calculators/decimal-converter',
  },

  // ── NEW: Wages ──
  {
    slug: 'wages',
    title: 'Wages Calculator',
    shortDescription:
      'Calculate gross and net wages from hours worked and hourly rate, including overtime and multiple pay rates.',
    metaDescription:
      'Free wages calculator. Compute your gross and net wages from hours worked and pay rate. Includes regular hours, overtime, double-time calculations, and supports multiple hourly rates. See weekly, bi-weekly, and annual wage breakdowns.',
    keywords: [
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
    path: '/calculators/wages',
  },

  // ── NEW: Payroll Deduction ──
  {
    slug: 'payroll-deduction',
    title: 'Payroll Deduction Calculator',
    shortDescription:
      'Calculate detailed paycheck deductions including federal tax, state tax, Social Security, Medicare, insurance, and retirement contributions.',
    metaDescription:
      'Free payroll deduction calculator. Itemize all paycheck deductions including federal and state income tax, FICA (Social Security and Medicare), health insurance, 401(k) contributions, and other pre-tax and post-tax deductions. See your gross-to-net pay breakdown.',
    keywords: [
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
    path: '/calculators/payroll-deduction',
  },

  // ── NEW: Salary Tax ──
  {
    slug: 'salary-tax',
    title: 'Salary Tax Calculator',
    shortDescription:
      'Calculate total tax on your salary including federal, state, FICA, and local taxes with a comprehensive breakdown by tax type.',
    metaDescription:
      'Free salary tax calculator. See exactly how much tax you pay on your salary, broken down by federal income tax, state income tax, Social Security, Medicare, and local taxes. Supports all filing statuses and compares effective tax rates across income levels.',
    keywords: [
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
    path: '/calculators/salary-tax',
  },

  // ── NEW: Time Card with Lunch ──
  {
    slug: 'time-card-lunch',
    title: 'Time Card Calculator with Lunch',
    shortDescription:
      'Calculate total work hours with automatic lunch break deduction. Supports multiple in/out entries per day and weekly totals.',
    metaDescription:
      'Free time card calculator with lunch break deduction. Track clock-in and clock-out times with automatic lunch break subtraction. Supports multiple daily entries, custom break durations, and generates weekly hour totals in decimal format for payroll.',
    keywords: [
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
    path: '/calculators/time-card-lunch',
  },

  // ── NEW: Hourly Paycheck ──
  {
    slug: 'hourly-paycheck',
    title: 'Hourly Paycheck Calculator',
    shortDescription:
      'Calculate your hourly paycheck after taxes and deductions. See net pay per hour, per week, and per year with full breakdown.',
    metaDescription:
      'Free hourly paycheck calculator. Enter your hourly rate and hours worked to see your gross pay, federal and state tax withholdings, FICA deductions, and net take-home pay. View results per paycheck, per week, and per year.',
    keywords: [
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
    path: '/calculators/hourly-paycheck',
  },

  // ── HR Analytics ──
  {
    slug: 'severance-pay',
    title: 'Severance Pay Calculator',
    shortDescription:
      'Calculate total severance pay based on salary, years of service, and company multiplier. Includes monthly equivalent and tax estimate.',
    metaDescription:
      'Free severance pay calculator. Estimate your total severance package based on years of service, base salary, and severance multiplier. See weekly rate, total weeks, and monthly equivalent. Covers common severance formulas used in the US.',
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
    path: '/calculators/severance-pay',
  },
  {
    slug: 'workers-comp',
    title: 'Workers Comp Calculator',
    shortDescription:
      'Estimate your annual workers compensation insurance premium from payroll, class code rate, and experience modification factor.',
    metaDescription:
      'Free workers comp calculator. Estimate your workers compensation insurance premium based on annual payroll, classification rate per $100, and experience modification rate (EMR). Compare costs by class code and see per-employee cost breakdown.',
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
    path: '/calculators/workers-comp',
  },
  {
    slug: 'fica-tax',
    title: 'FICA Tax Calculator',
    shortDescription:
      'Calculate Social Security and Medicare FICA taxes for employees and self-employed individuals with a full employer/employee breakdown.',
    metaDescription:
      'Free FICA tax calculator. Calculate Social Security tax (6.2%), Medicare tax (1.45%), and Additional Medicare tax (0.9%) for employees and self-employed workers. See employer and employee share, annual wage base limits, and self-employment tax deduction.',
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
    path: '/calculators/fica-tax',
  },
  {
    slug: 'time-and-a-half',
    title: 'Time and a Half Calculator',
    shortDescription:
      'Calculate overtime pay at 1.5× your regular rate. Enter your hourly wage and OT hours to instantly see your time and a half earnings.',
    metaDescription:
      'Free time and a half calculator. Instantly calculate your overtime pay at 1.5 times your regular hourly rate. Enter your hourly wage and overtime hours to see regular pay, overtime pay, and total gross earnings for the week.',
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
    path: '/calculators/time-and-a-half',
  },
  {
    slug: 'employee-turnover',
    title: 'Employee Turnover Rate Calculator',
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
    path: '/calculators/employee-turnover',
  },
  {
    slug: 'cost-per-hire',
    title: 'Cost per Hire Calculator',
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
    path: '/calculators/cost-per-hire',
  },
  {
    slug: 'billable-hours',
    title: 'Billable Hours Calculator',
    shortDescription:
      'Calculate billable hours, utilization rate, and billable revenue from total hours worked and non-billable time.',
    metaDescription:
      'Free billable hours calculator. Track your billable hours, calculate utilization rate, and estimate billable revenue. Enter total work hours, non-billable time (admin, training), and hourly billing rate to see how efficiently your time generates income.',
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
    path: '/calculators/billable-hours',
  },
  {
    slug: 'revenue-per-employee',
    title: 'Revenue per Employee Calculator',
    shortDescription:
      'Calculate revenue per employee ratio and benchmark against industry averages to measure workforce productivity and efficiency.',
    metaDescription:
      'Free revenue per employee calculator. Divide your annual revenue by headcount to get a key productivity metric. Compare your revenue per employee against industry benchmarks and track efficiency improvements over time.',
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
    path: '/calculators/revenue-per-employee',
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
