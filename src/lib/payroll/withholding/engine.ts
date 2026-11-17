// ---------------------------------------------------------------------------
// Paycheck withholding engine: the year-independent half
// ---------------------------------------------------------------------------
// Types, the bracket helpers, the federal percentage method and the gross-to-net
// walk. Nothing in this file is a tax figure: every number that changes from one
// year to the next lives in a year file (`2026.ts`, `2027.ts`) as a
// `TaxYearDefinition`, and `index.ts` picks the year. No imports, so the engine
// can be loaded by a plain script.

export type FilingStatus = 'single' | 'married' | 'hoh';
export type PayFrequency = 'weekly' | 'bi-weekly' | 'semi-monthly' | 'monthly';
export type StateCode =
  | 'CA'
  | 'TX'
  | 'FL'
  | 'NY'
  | 'IL'
  | 'WA'
  | 'TN'
  | 'NV'
  | 'PA'
  | 'NC'
  | 'GA'
  | 'MI'
  | 'IN'
  | 'AZ'
  | 'CO'
  | 'UT'
  | 'KY'
  | 'LA'
  | 'IA'
  | 'ID'
  | 'OH'
  | 'VA'
  | 'NJ'
  | 'MA'
  | 'MD'
  | 'MN'
  | 'MO'
  | 'WI'
  | 'OR'
  | 'SC';

/**
 * Jurisdictions with a withholding rule but no paycheck page (see 2026-more-states.ts).
 * They are a separate type on purpose: everything keyed by StateCode (paycheck pages,
 * employer-cost profiles, article content) stays complete for the 30 page states.
 */
export type WithholdingOnlyState = 'AL' | 'AR' | 'CT' | 'DE' | 'DC' | 'HI' | 'KS' | 'ME' | 'MS' | 'MT' | 'NE' | 'NM' | 'ND' | 'OK' | 'RI' | 'VT' | 'WV';

/** StateCode plus the two generic options used by the national hourly paycheck calculator */
export type PaycheckState = StateCode | 'none' | 'other';

export const PERIODS_PER_YEAR: Record<PayFrequency, number> = {
  weekly: 52,
  'bi-weekly': 26,
  'semi-monthly': 24,
  monthly: 12,
};

// A rate schedule row: tax = base + (income − over) × rate, for the last row whose `over` ≤ income
export interface ScheduleRow {
  over: number;
  base: number;
  rate: number;
}

export function taxFromSchedule(income: number, schedule: ScheduleRow[]): number {
  if (income <= 0) return 0;
  let row = schedule[0];
  for (const r of schedule) {
    if (income > r.over) row = r;
  }
  return row.base + (income - row.over) * row.rate;
}

// Build a schedule from bracket tops and rates (base amounts accumulate automatically)
export function scheduleFromBrackets(tops: number[], rates: number[]): ScheduleRow[] {
  const rows: ScheduleRow[] = [];
  let over = 0;
  let base = 0;
  rates.forEach((rate, i) => {
    rows.push({ over, base, rate });
    const top = tops[i];
    if (top !== undefined) {
      base += (top - over) * rate;
      over = top;
    }
  });
  return rows;
}

// ---------------------------------------------------------------------------
// Federal figures for one year
// ---------------------------------------------------------------------------

export interface FederalTables {
  /** Annual rate schedules, applied to wages above the standard deduction */
  schedules: Record<FilingStatus, ScheduleRow[]>;
  standardDeduction: Record<FilingStatus, number>;
  socialSecurityRate: number;
  socialSecurityWageBase: number;
  medicareRate: number;
  additionalMedicareRate: number;
  /** Employers must withhold Additional Medicare on wages over this amount regardless of filing status */
  additionalMedicareThreshold: number;
  /** Form W-4 Step 3: amount per qualifying child under 17 */
  w4ChildCredit: number;
  /** Form W-4 Step 3: amount per other dependent */
  w4OtherDependentCredit: number;
}

/** Steps 2–4 of a 2020-or-later Form W-4 (all optional; omit for a standard W-4) */
export interface W4Adjustments {
  /** Step 2(c) checkbox: two jobs total, or a working spouse */
  multipleJobs?: boolean;
  /** Step 3: total annual credit (children × the child amount + other dependents × $500) */
  dependentsCredit?: number;
  /** Step 4(a): other annual income not from jobs */
  otherIncome?: number;
  /** Step 4(b): annual deductions beyond the standard deduction */
  deductions?: number;
  /** Step 4(c): extra withholding per paycheck */
  extraWithholdingPerPeriod?: number;
}

export function hasW4Adjustments(w4?: W4Adjustments): boolean {
  return !!w4 && (!!w4.multipleJobs || (w4.dependentsCredit ?? 0) > 0 || (w4.otherIncome ?? 0) > 0 || (w4.deductions ?? 0) > 0 || (w4.extraWithholdingPerPeriod ?? 0) > 0);
}

// ---------------------------------------------------------------------------
// Federal (W-4 2020 or later), Pub. 15-T Worksheet 1A, annual payroll period
// ---------------------------------------------------------------------------
// Standard schedule: tax on (wages + Step 4(a) − Step 4(b) − standard deduction).
// Step 2 checkbox schedule: the same brackets at half width with a 0% band of
// half the standard deduction — identical to Pub. 15-T's "Form W-4, Step 2,
// Checkbox" table — which is ½ × tax(2 × adjusted wages − standard deduction).
// Step 3 credits come off the annual tax (not below zero); Step 4(c) is added
// per paycheck.

export function federalIncomeTax(
  federal: FederalTables,
  annualWages: number,
  status: FilingStatus,
  w4?: W4Adjustments,
  periodsPerYear = 1,
): number {
  const schedule = federal.schedules[status];
  const std = federal.standardDeduction[status];
  const adjusted = annualWages + Math.max(0, w4?.otherIncome ?? 0) - Math.max(0, w4?.deductions ?? 0);
  let tax = w4?.multipleJobs ? taxFromSchedule(2 * adjusted - std, schedule) / 2 : taxFromSchedule(adjusted - std, schedule);
  tax = Math.max(0, tax - Math.max(0, w4?.dependentsCredit ?? 0));
  return tax + Math.max(0, w4?.extraWithholdingPerPeriod ?? 0) * periodsPerYear;
}

// ---------------------------------------------------------------------------
// State rules for one year
// ---------------------------------------------------------------------------

/** One deduction before rounding */
export interface RawLine {
  key: string;
  label: string;
  annual: number;
}

export interface StateContext {
  /** FICA wages minus pre-tax retirement: the income-tax wage figure */
  taxableWages: number;
  /** Gross minus Section 125 benefits: the payroll-tax wage figure */
  ficaWages: number;
  filingStatus: FilingStatus;
  /** State withholding allowances / exemptions */
  allowances: number;
  /** New York only: employee lives in New York City */
  nycResident: boolean;
}

/** A state's employee-side lines (income tax, local tax, disability, paid leave) for one paycheck */
export type StateRule = (ctx: StateContext) => RawLine[];

/**
 * Everything that changes from one tax year to the next.
 *
 * A year can be added before every state has published: the states that have
 * not are listed by omission from `statesPublished`, and their rule must then be
 * the very function used in `stateRulesFrom` (the tests check identity), so a
 * carried-over state can never be passed off as a published one.
 */
export interface TaxYearDefinition {
  year: number;
  federal: FederalTables;
  stateRules: Record<StateCode, StateRule>;
  /** States whose rule above comes from that state's publication for this year */
  statesPublished: readonly StateCode[];
  /** Rules for jurisdictions without a paycheck page; one that is missing is not modeled at all */
  moreStateRules: Partial<Record<WithholdingOnlyState, StateRule>>;
  /** The same honesty rule as `statesPublished`, for `moreStateRules` */
  moreStatesPublished: readonly WithholdingOnlyState[];
  /** The year the other states' rules are carried over from; equals `year` once every state is published */
  stateRulesFrom: number;
  /** What the federal figures rest on, one clause, for the note under a result */
  federalBasis: string;
  /** The publications behind the federal figures, linked under a result when the year needs a note */
  federalSources: readonly { label: string; url: string }[];
  /** Federal items that are not final yet, one sentence each; empty for a finished year */
  federalPending: readonly string[];
  /** The date the "not published yet" statements were last checked (YYYY-MM-DD) */
  asOf: string;
}

// ---------------------------------------------------------------------------
// Paycheck calculation
// ---------------------------------------------------------------------------

export interface PaycheckInput {
  state: PaycheckState;
  /** 'other' state only: flat state income tax rate as a decimal (0.05 = 5%) */
  customStateRate?: number;
  /** Flat after-tax deductions taken from every paycheck (union dues, garnishments, post-tax insurance) */
  otherDeductionsPerPeriod?: number;
  /** Annual pre-tax retirement contributions (401(k), 403(b)): exempt from income tax, still subject to FICA */
  preTaxRetirementAnnual?: number;
  /** Annual Section 125 benefits (health, dental, FSA, HSA through payroll): exempt from income tax and FICA */
  preTaxBenefitsAnnual?: number;
  hourlyRate: number;
  regularHoursPerWeek: number;
  overtimeHoursPerWeek: number;
  overtimeMultiplier: number;
  payFrequency: PayFrequency;
  filingStatus: FilingStatus;
  /** State withholding allowances / exemptions. Ignored in no-income-tax states. */
  stateAllowances: number;
  /** New York only: employee lives in New York City */
  nycResident?: boolean;
  /** Form W-4 Steps 2–4; omit for a standard W-4 */
  w4?: W4Adjustments;
  /** Tax year to calculate for; omit for the site's current year (`TAX_YEAR`). An unknown year falls back to it. */
  taxYear?: number;
}

export interface PaycheckLine {
  key: string;
  label: string;
  annual: number;
  perPeriod: number;
}

export interface PaycheckResult {
  /** The tax year the figures were calculated for */
  taxYear: number;
  periodsPerYear: number;
  grossAnnual: number;
  grossPerPeriod: number;
  deductions: PaycheckLine[];
  totalDeductionsAnnual: number;
  netAnnual: number;
  netPerPeriod: number;
  /** Take-home pay divided by hours worked */
  netPerHour: number;
  /** Total deductions as a share of gross pay */
  effectiveRate: number;
  /** Gross minus Section 125 benefits: the FICA (and employer FUTA/SUI) wage figure */
  ficaWagesAnnual: number;
  /** FICA wages minus pre-tax retirement: the income-tax wage figure */
  taxableWagesAnnual: number;
}

const round2 = (n: number) => Math.round(n * 100) / 100;

/** Gross-to-net for one paycheck under one year's figures. Callers normally use `calculatePaycheck` from `index.ts`. */
export function computePaycheck(year: TaxYearDefinition, input: PaycheckInput): PaycheckResult {
  const federal = year.federal;
  const periodsPerYear = PERIODS_PER_YEAR[input.payFrequency];
  const weeklyGross =
    input.hourlyRate * input.regularHoursPerWeek +
    input.hourlyRate * input.overtimeMultiplier * input.overtimeHoursPerWeek;
  const grossAnnual = weeklyGross * 52;

  const benefits = Math.min(grossAnnual, Math.max(0, input.preTaxBenefitsAnnual ?? 0));
  const retirement = Math.min(grossAnnual - benefits, Math.max(0, input.preTaxRetirementAnnual ?? 0));
  const ficaWages = grossAnnual - benefits;
  const taxableWages = ficaWages - retirement;

  const lines: RawLine[] = [];
  if (retirement > 0) {
    lines.push({ key: 'retirement', label: '401(k) / retirement (pre-tax)', annual: retirement });
  }
  if (benefits > 0) {
    lines.push({ key: 'benefits', label: 'Health & Section 125 benefits (pre-tax)', annual: benefits });
  }
  lines.push(
    {
      key: 'federal',
      label: hasW4Adjustments(input.w4) ? 'Federal income tax (W-4 Steps 2–4)' : 'Federal income tax',
      annual: federalIncomeTax(federal, taxableWages, input.filingStatus, input.w4, periodsPerYear),
    },
    {
      key: 'social-security',
      label: 'Social Security (6.2%)',
      annual: Math.min(ficaWages, federal.socialSecurityWageBase) * federal.socialSecurityRate,
    },
    {
      key: 'medicare',
      label: 'Medicare (1.45%)',
      annual:
        ficaWages * federal.medicareRate +
        Math.max(0, ficaWages - federal.additionalMedicareThreshold) * federal.additionalMedicareRate,
    },
  );

  if (input.state === 'other') {
    const rate = input.customStateRate ?? 0;
    if (rate > 0) {
      lines.push({
        key: 'state',
        label: `State income tax (${+(rate * 100).toFixed(2)}%)`,
        annual: taxableWages * rate,
      });
    }
  } else if (input.state !== 'none') {
    lines.push(
      ...year.stateRules[input.state]({
        taxableWages,
        ficaWages,
        filingStatus: input.filingStatus,
        allowances: input.stateAllowances,
        nycResident: !!input.nycResident,
      }),
    );
  }

  if (input.otherDeductionsPerPeriod && input.otherDeductionsPerPeriod > 0) {
    lines.push({
      key: 'other',
      label: 'Other deductions',
      annual: input.otherDeductionsPerPeriod * periodsPerYear,
    });
  }

  const deductions = lines.map((l) => ({
    ...l,
    annual: round2(l.annual),
    perPeriod: round2(l.annual / periodsPerYear),
  }));
  const totalDeductionsAnnual = round2(deductions.reduce((sum, l) => sum + l.annual, 0));
  const netAnnual = round2(grossAnnual - totalDeductionsAnnual);
  const hoursPerYear = (input.regularHoursPerWeek + input.overtimeHoursPerWeek) * 52;

  return {
    taxYear: year.year,
    periodsPerYear,
    grossAnnual: round2(grossAnnual),
    grossPerPeriod: round2(grossAnnual / periodsPerYear),
    deductions,
    totalDeductionsAnnual,
    netAnnual,
    netPerPeriod: round2(netAnnual / periodsPerYear),
    netPerHour: hoursPerYear > 0 ? round2(netAnnual / hoursPerYear) : 0,
    effectiveRate: grossAnnual > 0 ? totalDeductionsAnnual / grossAnnual : 0,
    ficaWagesAnnual: round2(ficaWages),
    taxableWagesAnnual: round2(taxableWages),
  };
}
