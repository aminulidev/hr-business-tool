// ---------------------------------------------------------------------------
// Programmatic Wage & Salary Breakdown Pages (/salary/[slug])
// ---------------------------------------------------------------------------
// Deterministic 2026 gross-to-net, 7-period, 30-state tax, and 50/30/20 budget
// breakdowns powered by calculatePaycheck() in withholding-2026.ts.

import {
  calculatePaycheck,
  type StateCode,
  TAX_YEAR,
} from './payroll/withholding-2026';
import { STATE_CODES, STATE_PAYCHECK_PAGES } from './payroll/state-pages';

export type SalaryTierType = 'hourly' | 'annual';

export interface SalaryTierConfig {
  slug: string;
  type: SalaryTierType;
  /** Primary numeric value: e.g. 25 for $25/hr, or 75000 for $75,000/yr */
  amount: number;
  /** Equivalent full-time (2,080 hrs/yr) hourly rate */
  hourlyRate: number;
  /** Equivalent full-time (2,080 hrs/yr) annual gross pay */
  annualGross: number;
  label: string;
  shortLabel: string;
}

export const HOURLY_TIERS = [15, 16, 17, 18, 19, 20, 22, 25, 28, 30, 35, 40, 45, 50, 60] as const;

export const ANNUAL_TIERS = [
  35000, 40000, 45000, 50000, 55000, 60000, 65000, 70000, 75000, 80000, 90000,
  100000, 120000, 150000, 200000,
] as const;

const usd = (n: number, decimals = 0) =>
  n.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

/**
 * Date the salary-page math was last verified: every figure is produced by the
 * shared payroll engine, whose golden tests (withholding-2026.test.ts) and
 * generated-content tests (state-pages.test.ts) ran green on this date.
 */
export const SALARY_PAGES_REVIEWED = '2026-11-06';

export const SALARY_TIERS: SalaryTierConfig[] = [
  ...HOURLY_TIERS.map((hr): SalaryTierConfig => ({
    slug: `${hr}-an-hour`,
    type: 'hourly',
    amount: hr,
    hourlyRate: hr,
    annualGross: hr * 2080,
    label: `$${hr} an Hour`,
    shortLabel: `$${hr}/hr`,
  })),
  ...ANNUAL_TIERS.map((yr): SalaryTierConfig => ({
    slug: `${yr}-a-year`,
    type: 'annual',
    amount: yr,
    hourlyRate: Number((yr / 2080).toFixed(2)),
    annualGross: yr,
    label: `${usd(yr)} a Year`,
    shortLabel: `$${yr / 1000}k/yr`,
  })),
];

export function getSalaryTierBySlug(slug: string): SalaryTierConfig | undefined {
  return SALARY_TIERS.find((t) => t.slug === slug);
}

export interface StateTakeHomeRow {
  code: StateCode;
  name: string;
  calculatorSlug: string;
  hasNoStateIncomeTax: boolean;
  grossAnnual: number;
  federalAndFicaAnnual: number;
  stateTaxAnnual: number;
  totalTaxAnnual: number;
  effectiveRatePct: number;
  netAnnual: number;
  netMonthly: number;
  netBiWeekly: number;
  netWeekly: number;
  netHourly: number;
}

export interface ScheduleBreakdownRow {
  scheduleLabel: string;
  hoursPerWeek: number;
  weeksPerYear: number;
  annualHours: number;
  hourlyGross: number;
  dailyGross: number;
  weeklyGross: number;
  biWeeklyGross: number;
  semiMonthlyGross: number;
  monthlyGross: number;
  annualGross: number;
}

export function buildSalaryPageData(tier: SalaryTierConfig) {
  const hr = tier.hourlyRate;
  const grossAnnual = tier.annualGross;
  const grossMonthly = grossAnnual / 12;
  const grossSemiMonthly = grossAnnual / 24;
  const grossBiWeekly = grossAnnual / 26;
  const grossWeekly = grossAnnual / 52;
  const grossDaily = grossWeekly / 5;

  // 1. Schedule & Hours Matrix
  const schedules: ScheduleBreakdownRow[] = [
    {
      scheduleLabel: 'Full-Time (40 hrs/wk, 52 wks)',
      hoursPerWeek: 40,
      weeksPerYear: 52,
      annualHours: 2080,
      hourlyGross: hr,
      dailyGross: hr * 8,
      weeklyGross: hr * 40,
      biWeeklyGross: hr * 80,
      semiMonthlyGross: (hr * 2080) / 24,
      monthlyGross: (hr * 2080) / 12,
      annualGross: hr * 2080,
    },
    {
      scheduleLabel: 'Full-Time w/ 2 Wks Unpaid Time Off (50 wks)',
      hoursPerWeek: 40,
      weeksPerYear: 50,
      annualHours: 2000,
      hourlyGross: hr,
      dailyGross: hr * 8,
      weeklyGross: hr * 40,
      biWeeklyGross: (hr * 2000) / 26,
      semiMonthlyGross: (hr * 2000) / 24,
      monthlyGross: (hr * 2000) / 12,
      annualGross: hr * 2000,
    },
    {
      scheduleLabel: '37.5 Hours/Week (Paid 30m Daily Lunch)',
      hoursPerWeek: 37.5,
      weeksPerYear: 52,
      annualHours: 1950,
      hourlyGross: hr,
      dailyGross: hr * 7.5,
      weeklyGross: hr * 37.5,
      biWeeklyGross: hr * 75,
      semiMonthlyGross: (hr * 1950) / 24,
      monthlyGross: (hr * 1950) / 12,
      annualGross: hr * 1950,
    },
    {
      scheduleLabel: '30 Hours/Week (ACA Full-Time Threshold)',
      hoursPerWeek: 30,
      weeksPerYear: 52,
      annualHours: 1560,
      hourlyGross: hr,
      dailyGross: hr * 6,
      weeklyGross: hr * 30,
      biWeeklyGross: hr * 60,
      semiMonthlyGross: (hr * 1560) / 24,
      monthlyGross: (hr * 1560) / 12,
      annualGross: hr * 1560,
    },
    {
      scheduleLabel: 'Part-Time (20 hrs/wk, 52 wks)',
      hoursPerWeek: 20,
      weeksPerYear: 52,
      annualHours: 1040,
      hourlyGross: hr,
      dailyGross: hr * 4,
      weeklyGross: hr * 20,
      biWeeklyGross: hr * 40,
      semiMonthlyGross: (hr * 1040) / 24,
      monthlyGross: (hr * 1040) / 12,
      annualGross: hr * 1040,
    },
    {
      scheduleLabel: '40 hrs + 5 hrs Overtime (1.5× OT)',
      hoursPerWeek: 45,
      weeksPerYear: 52,
      annualHours: 2340,
      hourlyGross: hr,
      dailyGross: hr * 8 + hr * 1.5,
      weeklyGross: hr * 40 + hr * 1.5 * 5,
      biWeeklyGross: (hr * 40 + hr * 1.5 * 5) * 2,
      semiMonthlyGross: ((hr * 40 + hr * 1.5 * 5) * 52) / 24,
      monthlyGross: ((hr * 40 + hr * 1.5 * 5) * 52) / 12,
      annualGross: (hr * 40 + hr * 1.5 * 5) * 52,
    },
  ];

  // 2. All 30 States 2026 After-Tax Comparison (Single, 40 hrs/wk, Bi-Weekly)
  const stateRows: StateTakeHomeRow[] = STATE_CODES.map((code) => {
    const page = STATE_PAYCHECK_PAGES[code];
    const defaultAllowances = page.allowances?.defaultSingle ?? 0;
    const res = calculatePaycheck({
      state: code,
      hourlyRate: hr,
      regularHoursPerWeek: 40,
      overtimeHoursPerWeek: 0,
      overtimeMultiplier: 1.5,
      payFrequency: 'bi-weekly',
      filingStatus: 'single',
      stateAllowances: defaultAllowances,
    });
    const fedAndFicaAnnual = res.deductions
      .filter((d) => d.key === 'federal' || d.key === 'social-security' || d.key === 'medicare')
      .reduce((sum, d) => sum + d.annual, 0);
    const stateTaxAnnual = res.deductions
      .filter((d) => d.key !== 'federal' && d.key !== 'social-security' && d.key !== 'medicare')
      .reduce((sum, d) => sum + d.annual, 0);

    return {
      code,
      name: page.name,
      calculatorSlug: page.slug,
      hasNoStateIncomeTax: code === 'TX' || code === 'FL' || code === 'TN' || code === 'NV',
      grossAnnual: res.grossAnnual,
      federalAndFicaAnnual: fedAndFicaAnnual,
      stateTaxAnnual,
      totalTaxAnnual: res.totalDeductionsAnnual,
      effectiveRatePct: Number((res.effectiveRate * 100).toFixed(1)),
      netAnnual: res.netAnnual,
      netMonthly: res.netAnnual / 12,
      netBiWeekly: res.netPerPeriod,
      netWeekly: res.netAnnual / 52,
      netHourly: res.netPerHour,
    };
  });

  // Reference states for quick highlights
  const txRow = stateRows.find((r) => r.code === 'TX')!;
  const caRow = stateRows.find((r) => r.code === 'CA')!;
  const nyRow = stateRows.find((r) => r.code === 'NY')!;
  const paRow = stateRows.find((r) => r.code === 'PA')!;
  const avgNetAnnual = Math.round(
    stateRows.reduce((sum, r) => sum + r.netAnnual, 0) / stateRows.length
  );
  const avgNetMonthly = Math.round(avgNetAnnual / 12);
  const avgNetBiWeekly = Math.round(avgNetAnnual / 26);

  // 3. 50/30/20 Budget & Housing Guidelines (based on 30-state average monthly net & gross)
  const budget = {
    avgNetMonthly,
    needs50: Math.round(avgNetMonthly * 0.5),
    wants30: Math.round(avgNetMonthly * 0.3),
    savings20: Math.round(avgNetMonthly * 0.2),
    maxRent30Gross: Math.round(grossMonthly * 0.3),
    conservativeHousing28Gross: Math.round(grossMonthly * 0.28),
    recommendedCarPayment10Gross: Math.round(grossMonthly * 0.1),
    estimatedHomePrice35x: Math.round(grossAnnual * 3.5),
  };

  // 4. Neighboring tiers for internal linking
  const tierIdx = SALARY_TIERS.findIndex((t) => t.slug === tier.slug);
  const sameTypeTiers = SALARY_TIERS.filter((t) => t.type === tier.type && t.slug !== tier.slug);
  const crossTypeTiers = SALARY_TIERS.filter((t) => t.type !== tier.type)
    .sort((a, b) => Math.abs(a.annualGross - grossAnnual) - Math.abs(b.annualGross - grossAnnual))
    .slice(0, 4);

  // 5. Dynamic FAQs
  const faqs =
    tier.type === 'hourly'
      ? [
          {
            question: `$${tier.amount} an hour is how much a year before and after taxes in ${TAX_YEAR}?`,
            answer: `Working full-time (40 hours per week for 52 weeks, or 2,080 hours per year), $${tier.amount} an hour equals ${usd(grossAnnual)} per year before taxes (${usd(grossMonthly, 2)} per month or ${usd(grossBiWeekly, 2)} bi-weekly). After ${TAX_YEAR} federal income tax, Social Security (6.2%), and Medicare (1.45%), a single filer takes home ${usd(txRow.netAnnual)} per year (${usd(txRow.netBiWeekly, 2)} bi-weekly) in zero-income-tax states like Texas, Florida, Tennessee, and Nevada, or an average of ${usd(avgNetAnnual)} per year (${usd(avgNetBiWeekly)} bi-weekly) across all 30 major US states.`,
          },
          {
            question: `How much is $${tier.amount} an hour bi-weekly and monthly?`,
            answer: `At $${tier.amount} an hour for 40 hours a week, your gross weekly pay is ${usd(grossWeekly, 2)}, your gross bi-weekly paycheck (every two weeks, 80 hours) is ${usd(grossBiWeekly, 2)}, your semi-monthly paycheck (twice a month) is ${usd(grossSemiMonthly, 2)}, and your gross monthly income is ${usd(grossMonthly, 2)}. After taxes, average bi-weekly take-home pay is roughly ${usd(avgNetBiWeekly)} (${usd(txRow.netBiWeekly, 2)} in no-tax states, ${usd(caRow.netBiWeekly, 2)} in California).`,
          },
          {
            question: `What is the overtime rate for $${tier.amount} an hour?`,
            answer: `Under the federal Fair Labor Standards Act (FLSA), non-exempt hourly employees earn time-and-a-half (1.5×) for hours worked over 40 in a workweek. For a $${tier.amount}.00 regular hourly wage, your 1.5× overtime rate is ${usd(hr * 1.5, 2)} per hour, and your 2.0× double-time rate is ${usd(hr * 2, 2)} per hour. Working just 5 overtime hours per week boosts your annual gross income from ${usd(grossAnnual)} to ${usd((hr * 40 + hr * 1.5 * 5) * 52)}.`,
          },
          {
            question: `How much rent can I afford on $${tier.amount} an hour?`,
            answer: `Using the standard 30%-of-gross-income landlord rule on ${usd(grossMonthly)} monthly gross pay, the maximum recommended rent for someone earning $${tier.amount}/hour full-time is ${usd(budget.maxRent30Gross)} per month (or ${usd(budget.conservativeHousing28Gross)}/month under the conservative 28% front-end ratio). Following the 50/30/20 after-tax budget rule, all essential monthly needs (rent, utilities, groceries, insurance, and minimum debt payments) should stay within ~${usd(budget.needs50)}/month.`,
          },
        ]
      : [
          {
            question: `${usd(tier.amount)} a year is how much an hour in ${TAX_YEAR}?`,
            answer: `A ${usd(tier.amount)} annual salary equals ${usd(hr, 2)} per hour based on a standard full-time schedule of 40 hours per week for 52 weeks (2,080 hours per year). If your employer provides a paid 30-minute daily lunch (37.5 work hours per week, or 1,950 hours per year), your effective hourly wage is ${usd(tier.amount / 1950, 2)} per hour.`,
          },
          {
            question: `How much is ${usd(tier.amount)} a year after taxes in ${TAX_YEAR}?`,
            answer: `On a ${usd(tier.amount)} salary in ${TAX_YEAR}, a single filer working full-time takes home ${usd(txRow.netAnnual)} per year (${usd(txRow.netMonthly, 0)}/month or ${usd(txRow.netBiWeekly, 0)} bi-weekly) in states with no state income tax (Texas, Florida, Tennessee, Nevada). Across all 30 states, average take-home pay is ${usd(avgNetAnnual)} per year (${usd(avgNetMonthly)}/month), ranging from ${usd(caRow.netAnnual)} in California and ${usd(nyRow.netAnnual)} in New York to ${usd(paRow.netAnnual)} in Pennsylvania.`,
          },
          {
            question: `How much is a ${usd(tier.amount)} salary bi-weekly, semi-monthly, and monthly?`,
            answer: `Before taxes, ${usd(tier.amount)} a year breaks down to ${usd(grossMonthly, 2)} per month (12 paychecks), ${usd(grossSemiMonthly, 2)} semi-monthly (24 paychecks), ${usd(grossBiWeekly, 2)} bi-weekly (26 paychecks), ${usd(grossWeekly, 2)} per week (52 paychecks), and ${usd(grossDaily, 2)} per 8-hour workday.`,
          },
          {
            question: `How much house or rent can I afford on a ${usd(tier.amount)} salary?`,
            answer: `With a ${usd(tier.amount)} annual salary (${usd(grossMonthly, 0)}/month gross), landlords using the 30% rule typically approve rent up to ${usd(budget.maxRent30Gross)} per month, while mortgage lenders using the 28% front-end DTI rule recommend a maximum monthly PITI payment of ${usd(budget.conservativeHousing28Gross)}. Depending on interest rates and down payment, a ${usd(tier.amount)} salary typically supports a home purchase price around ${usd(budget.estimatedHomePrice35x)}.`,
          },
        ];

  const metaTitle =
    tier.type === 'hourly'
      ? `${tier.label} Is How Much a Year? (${usd(grossAnnual)} Gross · ${usd(avgNetAnnual)} After Taxes in ${TAX_YEAR})`
      : `${tier.label} Is How Much an Hour? (${usd(hr, 2)}/hr Gross & ${TAX_YEAR} After-Tax Pay)`;

  const metaDescription =
    tier.type === 'hourly'
      ? `$${tier.amount} an hour is ${usd(grossAnnual)} a year before taxes (${usd(grossBiWeekly, 2)} bi-weekly, ${usd(grossMonthly, 2)}/mo) and ~${usd(avgNetAnnual)}–${usd(txRow.netAnnual)} after ${TAX_YEAR} taxes. See 30-state take-home pay, overtime rates, and 50/30/20 budget.`
      : `${usd(tier.amount)} a year is ${usd(hr, 2)} an hour (${usd(grossBiWeekly, 2)} bi-weekly, ${usd(grossMonthly, 2)}/mo) and ~${usd(avgNetAnnual)}–${usd(txRow.netAnnual)} after ${TAX_YEAR} taxes. Compare take-home pay across 30 US states and monthly budget rules.`;

  return {
    tier,
    gross: {
      hourly: hr,
      daily: grossDaily,
      weekly: grossWeekly,
      biWeekly: grossBiWeekly,
      semiMonthly: grossSemiMonthly,
      monthly: grossMonthly,
      annual: grossAnnual,
      overtime15x: hr * 1.5,
      doubleTime2x: hr * 2,
    },
    highlights: {
      txRow,
      caRow,
      nyRow,
      paRow,
      avgNetAnnual,
      avgNetMonthly,
      avgNetBiWeekly,
    },
    schedules,
    stateRows,
    budget,
    faqs,
    metaTitle,
    metaDescription,
    sameTypeTiers,
    crossTypeTiers,
    prevTier: tierIdx > 0 ? SALARY_TIERS[tierIdx - 1] : null,
    nextTier: tierIdx < SALARY_TIERS.length - 1 ? SALARY_TIERS[tierIdx + 1] : null,
  };
}

