// ---------------------------------------------------------------------------
// Site-wide constants and category metadata
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

export type Category = (typeof categoryOrder)[number];
