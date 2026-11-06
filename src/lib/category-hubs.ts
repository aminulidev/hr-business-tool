import {
  Landmark,
  Clock,
  Wallet,
  TrendingUp,
  Users,
  Briefcase,
  type LucideIcon,
} from 'lucide-react';
import { getPublishedCalculators, type CalculatorMeta } from './calculator-meta';

export interface CategoryHubConfig {
  slug: string;
  categoryName: string; // Matches CalculatorMeta.category
  shortTitle: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  heroSubtitle: string;
  icon: LucideIcon;
  featuredSlugs: string[];
  referenceTable: {
    title: string;
    description: string;
    headers: string[];
    rows: string[][];
  };
  guideSections: {
    title: string;
    paragraphs: string[];
  }[];
  faqs: {
    question: string;
    answer: string;
  }[];
}

export const CATEGORY_HUBS: CategoryHubConfig[] = [
  {
    slug: 'payroll-taxes',
    categoryName: 'Payroll & Taxes',
    shortTitle: 'Payroll & Taxes',
    title: 'Payroll & Tax Calculators (2026)',
    metaTitle: 'Payroll & Tax Calculators (2026) — Federal, FICA & State Paycheck Tools',
    metaDescription:
      'Free 2026 Payroll & Tax Calculators: estimate hourly and salaried take-home pay across 30 US states, FICA & self-employment taxes, W-2 vs. 1099 pay, and bonus tax withholding.',
    heroSubtitle:
      'IRS Publication 15-T verified 2026 federal, FICA, self-employment, and state hourly paycheck calculators.',
    icon: Landmark,
    featuredSlugs: [
      'hourly-paycheck-calculator',
      'payroll-calculator',
      'fica-tax-calculator',
      'federal-tax-calculator',
      'bonus-tax-calculator',
      'self-employment-tax-calculator',
    ],
    referenceTable: {
      title: '2026 IRS Federal Payroll & Tax Key Thresholds at a Glance',
      description:
        'Official 2026 statutory tax rates, wage bases, and standard deductions used across all QuickBizCalc payroll calculators.',
      headers: ['Tax / Statutory Metric', '2026 Rate or Limit', 'Who Pays', 'Statutory Authority'],
      rows: [
        ['Social Security Tax (OASDI)', '6.2% up to $184,500 wage cap ($11,439 max)', 'Employee (6.2%) + Employer (6.2%)', 'SSA / IRC §3101'],
        ['Medicare Tax (HI)', '1.45% on all wages (Uncapped)', 'Employee (1.45%) + Employer (1.45%)', 'IRS Pub. 15 (Circular E)'],
        ['Additional Medicare Surtax', '0.9% above $200k (Single) / $250k (MFJ)', 'Employee Only', 'IRC §3101(b)(2)'],
        ['Self-Employment Tax (SECA)', '15.3% on 92.35% of net earnings', '1099 / Self-Employed (50% deductible)', 'IRS Schedule SE'],
        ['2026 Standard Deduction', '$16,100 (Single) · $32,200 (MFJ) · $24,150 (HOH)', 'Reduces Federal Taxable Income', 'IRS 2026 Inflation Adjustments'],
        ['Supplemental / Bonus Withholding', '22% Flat Rate (37% above $1M)', 'Employee Federal Withholding', 'IRS Pub. 15-T Section 7'],
        ['FUTA Federal Unemployment', '0.6% net on first $7,000 ($42/yr max)', 'Employer Only', 'IRS Form 940'],
      ],
    },
    guideSections: [
      {
        title: 'How 2026 US Paycheck Withholding Works',
        paragraphs: [
          'Every W-2 paycheck in the United States is subject to two distinct federal tax systems: FICA payroll taxes and Federal Income Tax withholding. FICA taxes—comprising 6.2% for Social Security up to the $184,500 annual wage cap and 1.45% for Medicare on all earnings—are flat taxes applied from the first dollar of gross pay unless deducted through a Section 125 pre-tax cafeteria health plan or HSA.',
          'Federal income tax withholding, by contrast, is progressive. Under IRS Publication 15-T, your employer annualizes your per-period gross pay, subtracts pre-tax retirement contributions (such as traditional 401(k) or 403(b) deferrals) and your 2026 standard deduction ($16,100 for Single filers or $32,200 for Married Filing Jointly), and applies the 7 federal tax brackets (10%, 12%, 22%, 24%, 32%, 35%, and 37%).',
        ],
      },
      {
        title: 'State Income Tax & Local Payroll Deductions Across 30 States',
        paragraphs: [
          'Beyond federal taxes, your net take-home pay depends heavily on the state where you work. Nine states—including Texas, Florida, Washington, Tennessee, and Nevada—levy 0% state income tax on wages (though Washington deducts WA PFML and WA Cares payroll premiums). Meanwhile, flat-tax states like Pennsylvania (3.07%), Indiana (2.95%), Arizona (2.50%), Michigan (4.25%), North Carolina (4.25%), Colorado (4.40%), Illinois (4.95%), and Georgia (5.19%) apply a single rate above their state exemption, while California and New York use graduated brackets.',
        ],
      },
    ],
    faqs: [
      {
        question: 'How much of my paycheck goes to taxes in 2026?',
        answer:
          'For a typical US worker earning $50,000 to $85,000 per year, total taxes (7.65% FICA + federal income tax + state income tax) usually range from 16% to 22% of gross pay in no-income-tax states (TX, FL, WA, TN, NV) and 21% to 28% in states with state income tax.',
      },
      {
        question: 'Why are bonuses taxed at 22%?',
        answer:
          'The IRS classifies bonuses, commissions, and severance pay as supplemental wages. Employers typically withhold a flat 22% federal supplemental rate (plus 7.65% FICA and state tax) on bonuses under $1 million. However, at tax time your bonus is taxed at your normal marginal income tax bracket—meaning any over-withholding is refunded on your tax return.',
      },
      {
        question: 'What is the difference between a W-2 employee and a 1099 contractor for taxes?',
        answer:
          'A W-2 employee splits the 15.3% FICA tax 50/50 with their employer (paying 7.65% each). A 1099 independent contractor is considered both employee and employer under SECA, paying the full 15.3% self-employment tax on 92.35% of net business profit, though they can deduct half of SE tax and eligible business expenses.',
      },
    ],
  },
  {
    slug: 'time-attendance',
    categoryName: 'Time & Attendance',
    shortTitle: 'Time & Attendance',
    title: 'Time Card & Attendance Calculators (2026)',
    metaTitle: 'Time Card & Attendance Calculators (2026) — Work Hours, Lunch Breaks & Business Days',
    metaDescription:
      'Free 2026 Time Card, Work Hours, Lunch Break, Time-to-Decimal, PTO Accrual, and Business Day Calculators for payroll admins, freelancers, and hourly employees.',
    heroSubtitle:
      'Calculate weekly timesheets with unpaid lunch breaks, convert HH:MM to decimal payroll hours, and count business days excluding 2026 federal holidays.',
    icon: Clock,
    featuredSlugs: [
      'time-card-calculator-with-lunch',
      'time-card-calculator',
      'business-day-calculator',
      'time-to-decimal-calculator',
      'billable-hours-calculator',
      'pto-accrual-calculator',
    ],
    referenceTable: {
      title: 'Payroll Minutes to Decimal Hours Conversion Chart (FLSA Standard)',
      description:
        'Payroll software (ADP, Gusto, Paychex, QuickBooks) requires hours in decimal format rather than minutes. Use this chart to avoid timesheet underpayment errors.',
      headers: ['Minutes Worked', 'Decimal Hours (Exact)', '15-Min Rounding (7-Min Rule)', '6-Min Legal/Agency Increment (0.1h)'],
      rows: [
        ['5 minutes', '0.08 hrs', '0.00 hrs', '0.10 hrs'],
        ['7 minutes', '0.12 hrs', '0.00 hrs', '0.20 hrs'],
        ['8 minutes', '0.13 hrs', '0.25 hrs', '0.20 hrs'],
        ['15 minutes', '0.25 hrs', '0.25 hrs', '0.30 hrs'],
        ['20 minutes', '0.33 hrs', '0.25 hrs', '0.40 hrs'],
        ['30 minutes', '0.50 hrs', '0.50 hrs', '0.50 hrs'],
        ['45 minutes', '0.75 hrs', '0.75 hrs', '0.80 hrs'],
        ['50 minutes', '0.83 hrs', '0.75 hrs', '0.90 hrs'],
        ['60 minutes', '1.00 hr', '1.00 hr', '1.00 hr'],
      ],
    },
    guideSections: [
      {
        title: 'FLSA Meal Break vs. Rest Break Payroll Rules (29 CFR §785)',
        paragraphs: [
          'Under federal Fair Labor Standards Act (FLSA) regulations, short rest breaks lasting 5 to 20 minutes must be counted as compensable working time and included in regular and overtime pay calculations. Bona fide meal periods lasting 30 minutes or more (where the employee is completely relieved of all work duties) may be unpaid and deducted from daily work hours.',
          'When processing weekly time cards, always convert net daily minutes into decimal hours by dividing minutes by 60 before multiplying by the employee\'s hourly pay rate. Entering "8 hours 30 minutes" as 8.30 instead of 8.50 shortchanges an employee by 0.20 hours (12 minutes) every single day.',
        ],
      },
    ],
    faqs: [
      {
        question: 'How do I convert hours and minutes into decimal hours for payroll?',
        answer:
          'Keep the whole hours unchanged and divide the remaining minutes by 60. For example, 7 hours and 45 minutes equals 7 + (45 ÷ 60) = 7.75 decimal hours.',
      },
      {
        question: 'What is the FLSA 7-minute rounding rule?',
        answer:
          'Under 29 CFR §785.48(b), employers that round time clock punches to the nearest quarter-hour (15 minutes) must round minutes 1–7 down to 0 and minutes 8–14 up to 15, ensuring the rounding policy is neutral and does not systematically underpay employees over time.',
      },
      {
        question: 'How many business workdays are in a standard year?',
        answer:
          'A standard calendar year has 260 to 262 weekdays (52 weeks × 5 days). After subtracting the 11 US Federal Holidays observed by OPM and Federal Reserve banks, there are 249 to 251 net federal business days per year.',
      },
    ],
  },
  {
    slug: 'salary-compensation',
    categoryName: 'Salary & Compensation',
    shortTitle: 'Salary & Pay',
    title: 'Salary, Overtime & Pay Calculators (2026)',
    metaTitle: 'Salary & Overtime Calculators (2026) — Hourly to Salary, 1.5x OT & Raise Tools',
    metaDescription:
      'Free 2026 Salary & Compensation Calculators: convert hourly wages to annual salary, calculate FLSA 1.5x time-and-a-half and 2x double time, pro-rata salary, and pay raises.',
    heroSubtitle:
      'Convert hourly wages to annual, monthly, and biweekly pay, model salary raises, and calculate FLSA overtime and shift differentials.',
    icon: Wallet,
    featuredSlugs: [
      'wages-calculator',
      'salary-converter',
      'overtime-calculator',
      'time-and-a-half-calculator',
      'salary-increase-calculator',
      'pro-rata-calculator',
    ],
    referenceTable: {
      title: '2026 Hourly Wage to Annual & Bi-Weekly Salary Quick Conversion Table (40 Hrs/Wk)',
      description:
        'Based on a standard full-time schedule of 40 hours per week (2,080 paid hours per year across 52 weeks / 26 bi-weekly pay periods).',
      headers: ['Hourly Wage', 'Weekly Gross (40h)', 'Bi-Weekly Gross (80h)', 'Monthly Gross', 'Annual Salary (2,080h)'],
      rows: [
        ['$15.00 / hr', '$600', '$1,200', '$2,600', '$31,200 / yr'],
        ['$20.00 / hr', '$800', '$1,600', '$3,467', '$41,600 / yr'],
        ['$25.00 / hr', '$1,000', '$2,000', '$4,333', '$52,000 / yr'],
        ['$30.00 / hr', '$1,200', '$2,400', '$5,200', '$62,400 / yr'],
        ['$35.00 / hr', '$1,400', '$2,800', '$6,067', '$72,800 / yr'],
        ['$40.00 / hr', '$1,600', '$3,200', '$6,933', '$83,200 / yr'],
        ['$50.00 / hr', '$2,000', '$4,000', '$8,667', '$104,000 / yr'],
        ['$75.00 / hr', '$3,000', '$6,000', '$13,000', '$156,000 / yr'],
      ],
    },
    guideSections: [
      {
        title: 'How to Convert Between Hourly Pay and Annual Salary',
        paragraphs: [
          'A standard full-time American work year consists of 2,080 paid hours (40 hours per week multiplied by 52 weeks). To convert an hourly wage into an annual salary, multiply the hourly rate by 2,080. Conversely, to find the hourly equivalent of an annual salary, divide the annual salary by 2,080.',
          'For non-exempt employees covered by the Fair Labor Standards Act (FLSA), any hours worked beyond 40 in a single 7-day workweek must be paid at least at 1.5x the regular rate of pay ("time and a half"). Certain states—most notably California, Colorado, Alaska, and Nevada—also mandate daily overtime when daily hours exceed 8 or 12 hours.',
        ],
      },
    ],
    faqs: [
      {
        question: 'How do you quickly estimate annual salary from an hourly rate in your head?',
        answer:
          'Double your hourly rate and add three zeros (which multiplies by 2,000 hours). For example, $25/hour is roughly $50,000/year (exact for 2,080 hours is $52,000/year), and $35/hour is roughly $70,000/year (exact is $72,800/year).',
      },
      {
        question: 'What is the difference between bi-weekly and semi-monthly pay?',
        answer:
          'Bi-weekly pay runs every two weeks (typically every other Friday), resulting in 26 paychecks per year (and 2 months each year with 3 paychecks). Semi-monthly pay runs twice a month on fixed dates (such as the 15th and last day of the month), resulting in 24 slightly larger paychecks per year.',
      },
      {
        question: 'How is pro-rata salary calculated for part-time or mid-month hires?',
        answer:
          'For part-time employees, divide their weekly hours by standard full-time hours (40) and multiply by the full-time equivalent salary. For mid-month starters or leavers, divide the annual salary by 260 annual workdays and multiply by the exact number of workdays active in the pay period.',
      },
    ],
  },
  {
    slug: 'business-finance',
    categoryName: 'Business Finance',
    shortTitle: 'Business Finance',
    title: 'Business Finance & Margin Calculators (2026)',
    metaTitle: 'Business Finance Calculators (2026) — Profit Margin, Markup, EBITDA, ROI & Burn Rate',
    metaDescription:
      'Free 2026 Business Finance Calculators: calculate gross and net profit margin, price markup, EBITDA margin, startup cash burn rate and runway, break-even units, ROI, and sales tax.',
    heroSubtitle:
      'Model gross and net profit margins, convert markup to margin, calculate startup burn rate and runway, and analyze ROI and break-even points.',
    icon: TrendingUp,
    featuredSlugs: [
      'profit-margin-calculator',
      'markup-calculator',
      'burn-rate-calculator',
      'ebitda-margin-calculator',
      'break-even-calculator',
      'sales-tax-calculator',
    ],
    referenceTable: {
      title: 'Profit Margin vs. Price Markup Conversion Table',
      description:
        'Why a 50% markup only yields a 33.3% profit margin — and the exact markup required to hit your target gross margin.',
      headers: ['Target Gross Margin (%)', 'Required Markup (%)', 'Price Multiplier (× Cost)', 'Example ($100 Unit Cost)'],
      rows: [
        ['15.0% Margin', '17.6% Markup', '1.18× Cost', 'Sell at $117.65 → $17.65 Profit'],
        ['20.0% Margin', '25.0% Markup', '1.25× Cost', 'Sell at $125.00 → $25.00 Profit'],
        ['25.0% Margin', '33.3% Markup', '1.33× Cost', 'Sell at $133.33 → $33.33 Profit'],
        ['30.0% Margin', '42.9% Markup', '1.43× Cost', 'Sell at $142.86 → $42.86 Profit'],
        ['33.3% Margin', '50.0% Markup', '1.50× Cost', 'Sell at $150.00 → $50.00 Profit'],
        ['40.0% Margin', '66.7% Markup', '1.67× Cost', 'Sell at $166.67 → $66.67 Profit'],
        ['50.0% Margin (Keystone)', '100.0% Markup', '2.00× Cost', 'Sell at $200.00 → $100.00 Profit'],
        ['75.0% Margin (SaaS Tier)', '300.0% Markup', '4.00× Cost', 'Sell at $400.00 → $300.00 Profit'],
      ],
    },
    guideSections: [
      {
        title: 'Gross Margin vs. Operating (EBITDA) Margin vs. Net Profit Margin',
        paragraphs: [
          'Healthy financial management requires tracking profitability at three levels of the income statement. Gross Profit Margin ((Revenue − COGS) ÷ Revenue) measures the direct unit economics of your product or service before overhead. If your gross margin is too low, scaling sales volume will simply magnify operating losses.',
          'EBITDA Margin and Operating Margin strip out Cost of Goods Sold plus operating expenses (payroll, rent, marketing, software) to measure core operational efficiency, while Net Profit Margin accounts for interest and taxes to show how many cents of every revenue dollar reach the bottom line.',
        ],
      },
    ],
    faqs: [
      {
        question: 'What is the difference between profit margin and markup?',
        answer:
          'Profit margin divides gross profit by Selling Price (Revenue), whereas markup divides gross profit by Unit Cost (COGS). Because cost is smaller than selling price, your markup percentage is always higher than your profit margin percentage. A 100% markup (doubling your cost) equals a 50% gross margin.',
      },
      {
        question: 'How do I price a product to achieve a specific target margin?',
        answer:
          'Never multiply your cost by (1 + Target Margin %). Instead, divide your Unit Cost by (1 − Target Margin %). For example, to achieve a 40% profit margin on an item that costs $60, divide $60 by (1 − 0.40) = $60 ÷ 0.60 = $100 selling price.',
      },
      {
        question: 'How many months of cash runway should a business maintain?',
        answer:
          'Traditional small businesses aim for 3 to 6 months of fixed operating expenses in liquid cash reserves, while venture-backed startups operating at a net burn target 18 to 24 months of runway at financing and begin raising or cutting burn when runway drops below 9 to 12 months.',
      },
    ],
  },
  {
    slug: 'hr-analytics',
    categoryName: 'HR Analytics',
    shortTitle: 'HR & Workforce',
    title: 'HR Analytics & Workforce Calculators (2026)',
    metaTitle: 'HR Analytics Calculators (2026) — Employee Cost, FTE, Turnover & Revenue Per Employee',
    metaDescription:
      'Free 2026 HR Analytics & Workforce Planning Calculators: calculate true loaded employee cost, FTE & ACA 50-employee counts, turnover cost, severance pay, and revenue per employee.',
    heroSubtitle:
      'Quantify true loaded employee cost (1.25x–1.45x salary), calculate IRS ACA Full-Time Equivalents, and benchmark turnover and revenue per FTE.',
    icon: Users,
    featuredSlugs: [
      'employee-cost-calculator',
      'fte-calculator',
      'employee-turnover-calculator',
      'severance-pay-calculator',
      'revenue-per-employee-calculator',
      'cost-per-hire-calculator',
    ],
    referenceTable: {
      title: '2026 Core HR & People Analytics Benchmarks',
      description:
        'Industry reference benchmarks for workforce planning, hiring budgets, and organizational efficiency.',
      headers: ['HR Metric', 'Formula', '2026 Private Industry Benchmark', 'High-Performance Target'],
      rows: [
        ['Loaded Employee Cost Multiplier', 'Total Employer Cost ÷ Base Salary', '1.28x – 1.42x Base Salary', '1.25x – 1.35x (Remote/Lean)'],
        ['Annual Voluntary Turnover Rate', '(Separations ÷ Avg Headcount) × 100', '12% – 18% Annually', '< 10% Annually'],
        ['Replacement Cost per Departure', 'Recruiting + Onboarding + Ramp Loss', '50% – 150% of Annual Salary', 'Mitigated via Internal Mobility'],
        ['Average Cost Per Hire (SHRM)', '(Internal + External Recruiting) ÷ Hires', '$4,700 (Non-Exec) / $15k+ (Tech/Exec)', '< $3,500 via Referral/Inbound'],
        ['Revenue Per Employee (RPE)', 'Annual Revenue ÷ Full-Time Equivalents', '$180,000 – $320,000 / FTE', '$400,000+ / FTE (SaaS/Tech)'],
        ['ACA Employer Mandate Threshold', 'FT Headcount (30h+) + (Monthly PT Hrs ÷ 120)', '50.0+ ACA FTEs triggers ALE rules', 'Track monthly to avoid §4980H penalties'],
      ],
    },
    guideSections: [
      {
        title: 'Data-Driven Workforce Planning for HR & Finance Teams',
        paragraphs: [
          'People costs represent 60% to 75% of total operating expenses in service, technology, and knowledge-work businesses. Bridging the gap between HR and Finance requires translating workforce metrics—like headcount, attrition, and benefit elections—into exact dollar impacts on EBITDA and cash flow.',
          'Use our Employee Cost Calculator to model the full 1.25x–1.45x burden rate of new hires, the FTE Calculator to verify compliance with the 50-employee Affordable Care Act (ACA) mandate, and the Employee Turnover Calculator to build an ROI business case for retention initiatives.',
        ],
      },
    ],
    faqs: [
      {
        question: 'How much does an employee really cost above their base salary?',
        answer:
          'According to Bureau of Labor Statistics (BLS) data, statutory payroll taxes (7.65% FICA, FUTA, SUTA) and employee benefits (health insurance, 401(k) match, paid time off) add roughly 30% to 40% on top of base wages—before adding $3,000 to $10,000 per year in IT hardware, SaaS software seats, and workspace overhead.',
      },
      {
        question: 'How is FTE calculated for the ACA 50-employee health insurance mandate?',
        answer:
          'The IRS defines a full-time employee under the ACA as anyone working 30+ hours per week (or 130+ hours/month). Part-time employees working under 30 hours/week are included by summing their monthly hours (up to 120 per worker) and dividing by 120. If your full-time count plus part-time FTE equivalents average 50 or more across the year, you are an Applicable Large Employer (ALE).',
      },
      {
        question: 'What is standard severance pay in the US?',
        answer:
          'While not federally mandated for individual layoffs, US corporate severance packages typically offer 1 to 2 weeks of base pay per year of service for general staff (with a 2–4 week minimum) and 2 to 4 weeks per year of service for directors and executives, plus COBRA health subsidy.',
      },
    ],
  },
  {
    slug: 'sales-saas',
    categoryName: 'Sales & Compensation',
    shortTitle: 'Sales, SaaS & Freelance',
    title: 'Sales, SaaS & Freelance Calculators (2026)',
    metaTitle: 'Sales, SaaS & Freelance Calculators (2026) — Commission, CAC, CLV, Churn & Rates',
    metaDescription:
      'Free 2026 Sales, SaaS & Freelance Calculators: model tiered sales commissions, Customer Acquisition Cost (CAC), Customer Lifetime Value (CLV), churn rate, freelance hourly rates, and Upwork fees.',
    heroSubtitle:
      'Model tiered sales commissions and quota accelerators, analyze SaaS unit economics (CAC, CLV, Churn), and price freelance hourly rates and Upwork bids.',
    icon: Briefcase,
    featuredSlugs: [
      'commission-calculator',
      'customer-acquisition-cost-calculator',
      'customer-lifetime-value-calculator',
      'churn-rate-calculator',
      'freelance-hourly-rate-calculator',
      'upwork-fee-calculator',
    ],
    referenceTable: {
      title: '2026 Sales, SaaS & Freelance Unit Economics Benchmarks',
      description:
        'Key golden ratios and pricing benchmarks for B2B sales teams, subscription businesses, and independent consultants.',
      headers: ['Metric / Benchmark', 'Formula', 'Healthy Target Range', 'Why It Matters'],
      rows: [
        ['LTV : CAC Ratio', 'Gross-Margin CLV ÷ Fully Loaded CAC', '3.0 : 1 to 5.0 : 1', 'Ensures customer profit covers acquisition + overhead'],
        ['CAC Payback Period', 'CAC ÷ (Monthly ARPU × Gross Margin %)', '< 12 Months (SMB/Mid-Market)', 'Determines how fast growth recycles cash'],
        ['Monthly Gross Revenue Churn', 'Churned MRR ÷ Starting MRR', '< 1.0%/mo (Ent) · < 2.5%/mo (SMB)', 'Reducing churn by 1% can lift CLV by 25%+'],
        ['AE On-Target Earnings (OTE) Ratio', 'Annual Quota ÷ Total OTE (50/50 Split)', '4.0x – 5.0x OTE', 'Standard B2B SaaS sales rep quota-to-comp ratio'],
        ['Freelance Billable Utilization', 'Billable Hours ÷ Total Work Hours (40h)', '55% – 65% (~1,200 hrs/yr)', 'Accounts for non-billable admin, sales & PTO'],
        ['Upwork Reverse Bid Multiplier', 'Target Net Payout ÷ (1 − 0.10 Fee)', '1.1111× Target (Divide by 0.90)', 'Covers Upwork 10% service fee without losing margin'],
      ],
    },
    guideSections: [
      {
        title: 'Aligning Sales Compensation, Unit Economics, and Freelance Pricing',
        paragraphs: [
          'Whether you are scaling a B2B sales organization or running a solo consulting practice, sustainable growth depends on unit economics. For SaaS and recurring-revenue companies, Sales Commission plans must keep your Fully Loaded CAC within a 12-month payback window while maintaining an LTV:CAC ratio of at least 3:1.',
          'For independent freelancers and agencies, pricing profitably requires working backward from your desired after-tax net income, adding business expenses and the 15.3% self-employment tax, and dividing by realistic annual billable hours (~1,200 hours/year rather than 2,080)—plus grossing up proposals on marketplaces like Upwork by dividing by 0.90 to absorb platform fees.',
        ],
      },
    ],
    faqs: [
      {
        question: 'What is a typical B2B sales commission rate?',
        answer:
          'Most B2B software and services companies use a 50/50 base-to-variable On-Target Earnings (OTE) split with a base commission rate of 8% to 12% of Annual Contract Value (ACV), rising to 15%–20% via quota accelerators once a rep exceeds 100% of quota.',
      },
      {
        question: 'Why should I divide by 0.90 instead of adding 10% on Upwork?',
        answer:
          'Upwork takes 10% of the total gross contract price. If you want $1,000 net and bid $1,100 (+10%), Upwork takes $110 and leaves you with $990. Dividing $1,000 by 0.90 gives $1,111.11—so after Upwork deducts 10% ($111.11), you receive exactly $1,000.00.',
      },
      {
        question: 'How do you calculate Gross-Margin CLV from monthly churn?',
        answer:
          'Multiply your Monthly Average Revenue Per User (ARPU) by your Gross Margin percentage, then divide by your monthly churn rate (as a decimal). At $100 ARPU, 80% gross margin, and 2.5% (0.025) monthly churn, Gross-Margin CLV is $80 ÷ 0.025 = $3,200.',
      },
    ],
  },
];

export function getCategoryHubBySlug(slug: string): CategoryHubConfig | undefined {
  return CATEGORY_HUBS.find((h) => h.slug === slug);
}

export function getCategoryHubByName(categoryName: string): CategoryHubConfig | undefined {
  return CATEGORY_HUBS.find((h) => h.categoryName === categoryName);
}

export function getCalculatorsForCategoryHub(slug: string): CalculatorMeta[] {
  const hub = getCategoryHubBySlug(slug);
  if (!hub) return [];
  return getPublishedCalculators().filter((c) => c.category === hub.categoryName);
}

