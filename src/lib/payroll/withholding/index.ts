// ---------------------------------------------------------------------------
// Paycheck withholding: the tax-year switch
// ---------------------------------------------------------------------------
// One file per tax year (`2026.ts`, `2027.ts`) holds that year's figures; the
// year-independent math is in `engine.ts`. This file registers the years and
// says which one the site is written for.
//
//   TAX_YEAR              the year every page, article and default calculation uses
//   SELECTABLE_TAX_YEARS  the years a visitor can choose on the paycheck calculators
//   calculatePaycheck()   uses `input.taxYear` when given, else TAX_YEAR
//
// Moving the site to a new year is a content job as much as a code one; follow
// `docs/tax-year-rollover.md` before changing TAX_YEAR.

import { computePaycheck, type PaycheckInput, type PaycheckResult, type PaycheckState, type StateCode, type TaxYearDefinition } from './engine';
import { YEAR_2026 } from './2026';
import { YEAR_2027 } from './2027';

export * from './engine';

export const TAX_YEARS = {
  2026: YEAR_2026,
  2027: YEAR_2027,
} as const satisfies Record<number, TaxYearDefinition>;

export type TaxYear = keyof typeof TAX_YEARS;

/** The tax year the site is written for. Change it only with the rollover checklist. */
export const TAX_YEAR: TaxYear = 2026;

/**
 * Years offered in the calculators' tax-year switch, oldest first. A year later
 * than TAX_YEAR is shown as a preview with a note on what is final and what is
 * carried over. Leave only TAX_YEAR here to hide the switch.
 */
export const SELECTABLE_TAX_YEARS: readonly TaxYear[] = [2026, 2027];

export function isTaxYear(value: unknown): value is TaxYear {
  return typeof value === 'number' && Object.prototype.hasOwnProperty.call(TAX_YEARS, value);
}

/** The year's figures; anything unknown falls back to TAX_YEAR */
export function getTaxYear(year?: number | null): TaxYearDefinition {
  return TAX_YEARS[isTaxYear(year) ? year : TAX_YEAR];
}

/** A `?year=` value from a share link: a selectable year, or TAX_YEAR for anything else */
export function parseTaxYear(value: string | number | null | undefined): TaxYear {
  const n = typeof value === 'number' ? value : value && /^\d{4}$/.test(value) ? Number(value) : NaN;
  return isTaxYear(n) && SELECTABLE_TAX_YEARS.includes(n) ? n : TAX_YEAR;
}

/** True when the state's lines for that year come from the state's own publication for that year */
export function stateIsPublished(year: number, state: StateCode): boolean {
  return getTaxYear(year).statesPublished.includes(state);
}

/** The year a state's lines are really for: the year asked for, or the one its rule is carried over from */
export function stateRulesYear(year: number, state: PaycheckState): number {
  const def = getTaxYear(year);
  return state === 'none' || state === 'other' || def.statesPublished.includes(state) ? def.year : def.stateRulesFrom;
}

const STATE_LINE_KEYS = new Set(['state', 'local', 'sdi', 'pfl']);
/** True for the key of a line that comes from a state rule (income tax, local tax, disability, paid leave) */
export function isStateLineKey(key: string): boolean {
  return STATE_LINE_KEYS.has(key);
}
/** True when the paycheck has any state line */
export function hasStateLines(result: PaycheckResult): boolean {
  return result.deductions.some((d) => isStateLineKey(d.key));
}

/** The label a year gets in the interface: a year the site has not moved to yet is a preview */
export function taxYearLabel(year: number): string {
  return year > TAX_YEAR ? `${year} preview` : String(year);
}

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
/** "November 17, 2026" from YYYY-MM-DD, without going through a time zone */
function formatAsOf(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  return `${MONTHS[m - 1]} ${d}, ${y}`;
}

export interface TaxYearNote {
  /** "2027 preview." or "2027 figures." */
  title: string;
  /** Plain sentences: what the federal figures rest on, what is still a draft, what is carried over */
  sentences: string[];
  sources: readonly { label: string; url: string }[];
}

/**
 * What a result for this year rests on, or null when everything in it is final.
 * A note is due when a federal figure comes from a draft, or when the result has
 * state lines and that state has not published for the year.
 */
export function taxYearNote(year: number, state: PaycheckState, stateName: string | null, hasStateLines: boolean): TaxYearNote | null {
  const def = getTaxYear(year);
  const carriedOver = hasStateLines && stateRulesYear(def.year, state) !== def.year;
  if (def.federalPending.length === 0 && !carriedOver) return null;
  const sentences = [`Federal income tax, Social Security and Medicare use ${def.federalBasis}.`, ...def.federalPending];
  if (carriedOver) {
    sentences.push(
      `${stateName ?? 'This state'} had not published ${def.year} withholding figures as of ${formatAsOf(def.asOf)}, so the ${stateName ?? 'state'} lines use ${def.stateRulesFrom} rules.`,
    );
  }
  sentences.push('Expect small changes once everything is final.');
  return { title: def.year > TAX_YEAR ? `${def.year} preview.` : `${def.year} figures.`, sentences, sources: def.federalSources };
}

/** Gross-to-net for one paycheck: federal income tax, FICA and the state's employee-side lines */
export function calculatePaycheck(input: PaycheckInput): PaycheckResult {
  return computePaycheck(getTaxYear(input.taxYear), input);
}

// Federal figures of the current year, for copy that prints them
const CURRENT = TAX_YEARS[TAX_YEAR].federal;
export const FEDERAL_STANDARD_DEDUCTION = CURRENT.standardDeduction;
export const SOCIAL_SECURITY_RATE = CURRENT.socialSecurityRate;
export const SOCIAL_SECURITY_WAGE_BASE = CURRENT.socialSecurityWageBase;
export const MEDICARE_RATE = CURRENT.medicareRate;
export const ADDITIONAL_MEDICARE_RATE = CURRENT.additionalMedicareRate;
export const ADDITIONAL_MEDICARE_THRESHOLD = CURRENT.additionalMedicareThreshold;
export const W4_CHILD_CREDIT = CURRENT.w4ChildCredit;
export const W4_OTHER_DEPENDENT_CREDIT = CURRENT.w4OtherDependentCredit;
