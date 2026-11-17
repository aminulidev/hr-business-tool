// ---------------------------------------------------------------------------
// Federal figures for the tax-return calculators
// ---------------------------------------------------------------------------
// The paycheck engine (./withholding) holds each year's federal brackets,
// standard deductions and FICA figures. The standalone calculators (federal
// tax, tax brackets, W-2, 1099, refund, FICA, self-employment, Social Security,
// contractor vs employee) used to carry their own typed copy of the same
// numbers. They read them from here instead, so a new tax year is one change in
// one place and a calculator can never disagree with the paycheck pages.
//
// Nothing in this file is a tax figure that changes with the year, except by
// way of the engine. The constants typed here are statutory and not indexed.

import { getTaxYear, TAX_YEAR, type FilingStatus, type ScheduleRow } from './withholding';

/** Filing statuses on a federal income tax return. The withholding engine has three; a return has four. */
export type ReturnFilingStatus = 'single' | 'mfj' | 'mfs' | 'hoh';

export interface TaxBracket {
  min: number;
  /** Infinity for the top bracket */
  max: number;
  /** Marginal rate as a decimal, 0.22 = 22% */
  rate: number;
}

const toBrackets = (rows: ScheduleRow[]): TaxBracket[] =>
  rows.map((row, i) => ({ min: row.over, max: rows[i + 1]?.over ?? Infinity, rate: row.rate }));

/**
 * Federal income tax brackets for a year (default: the site's tax year).
 * Married filing separately is half of married filing jointly at every threshold,
 * which is how section 1(j)(2)(D) defines it and what the IRS tables print.
 */
export function federalBrackets(year: number = TAX_YEAR): Record<ReturnFilingStatus, TaxBracket[]> {
  const { schedules } = getTaxYear(year).federal;
  const mfj = toBrackets(schedules.married);
  return {
    single: toBrackets(schedules.single),
    mfj,
    mfs: mfj.map((b) => ({ min: b.min / 2, max: b.max / 2, rate: b.rate })),
    hoh: toBrackets(schedules.hoh),
  };
}

/** Standard deduction by return filing status; married filing separately takes the single amount */
export function federalStandardDeduction(year: number = TAX_YEAR): Record<ReturnFilingStatus, number> {
  const { standardDeduction } = getTaxYear(year).federal;
  return { single: standardDeduction.single, mfj: standardDeduction.married, mfs: standardDeduction.single, hoh: standardDeduction.hoh };
}

/** Tax on a taxable income (after deductions) by walking the brackets */
export function federalIncomeTaxOn(taxableIncome: number, status: ReturnFilingStatus, year: number = TAX_YEAR): number {
  let tax = 0;
  for (const b of federalBrackets(year)[status]) {
    if (taxableIncome <= b.min) break;
    tax += (Math.min(taxableIncome, b.max) - b.min) * b.rate;
  }
  return tax;
}

/** The state engine's filing status for a return status: separate filers withhold as single */
export function toWithholdingStatus(status: ReturnFilingStatus): FilingStatus {
  return status === 'mfj' ? 'married' : status === 'hoh' ? 'hoh' : 'single';
}

// ── The site's tax year, for calculators that do not offer a year choice ──────

const CURRENT = getTaxYear(TAX_YEAR).federal;

export const FEDERAL_BRACKETS = federalBrackets();
export const FEDERAL_STANDARD_DEDUCTIONS = federalStandardDeduction();

/** Employee share of FICA */
export const SOCIAL_SECURITY_WAGE_BASE = CURRENT.socialSecurityWageBase;
export const SOCIAL_SECURITY_RATE = CURRENT.socialSecurityRate;
export const MEDICARE_RATE = CURRENT.medicareRate;
export const ADDITIONAL_MEDICARE_RATE = CURRENT.additionalMedicareRate;
/** What an employer withholds on: wages over $200,000 whatever the filing status */
export const ADDITIONAL_MEDICARE_WITHHOLDING_THRESHOLD = CURRENT.additionalMedicareThreshold;

/** Self-employment tax: both halves of FICA (section 1401) on 92.35% of net earnings (section 1402(a)(12)) */
export const SECA_SOCIAL_SECURITY_RATE = 2 * CURRENT.socialSecurityRate;
export const SECA_MEDICARE_RATE = 2 * CURRENT.medicareRate;
export const SECA_NET_EARNINGS_FACTOR = 0.9235;

/** Additional Medicare Tax thresholds on the return (section 3101(b)(2)); set by statute and not indexed */
export const ADDITIONAL_MEDICARE_THRESHOLDS: Record<ReturnFilingStatus, number> = {
  single: 200000,
  hoh: 200000,
  mfj: 250000,
  mfs: 125000,
};
