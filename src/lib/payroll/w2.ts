// ---------------------------------------------------------------------------
// W-2 calculator math (salary → annual taxes and take-home)
// ---------------------------------------------------------------------------
// A tax-return style estimate: federal income tax from the brackets after the
// standard deduction, FICA, and the state's own rule. Pure, so the calculator
// and the worked examples in its article run the same code.
//
// It differs from the paycheck engine's `calculatePaycheck` on purpose: that one
// follows the withholding method an employer applies each pay period; this one
// supports married filing separately and reports Box 1 style figures. For a
// standard filer the two agree on federal tax (federal-tax.test.ts).

import {
  ADDITIONAL_MEDICARE_RATE,
  ADDITIONAL_MEDICARE_WITHHOLDING_THRESHOLD,
  FEDERAL_BRACKETS,
  FEDERAL_STANDARD_DEDUCTIONS,
  federalIncomeTaxOn,
  MEDICARE_RATE,
  SOCIAL_SECURITY_RATE,
  SOCIAL_SECURITY_WAGE_BASE,
  toWithholdingStatus,
  type ReturnFilingStatus,
} from './federal-tax';
import { stateTaxOnWages, type StateTaxChoice, type StateTaxLine } from './state-tax';

export interface W2Input {
  grossAnnual: number;
  filingStatus: ReturnFilingStatus;
  state: StateTaxChoice;
  /** 'other' state only: flat rate in percent (5 = 5%) */
  customStateRatePct?: number;
  /** Traditional 401(k)/403(b): lowers income tax, not FICA */
  pretax401k?: number;
  /** HSA through payroll: lowers income tax and FICA */
  pretaxHsa?: number;
  /** Other Section 125 deductions (health premiums, FSA): lower income tax and FICA */
  pretaxOther?: number;
}

export interface W2Result {
  totalPretax: number;
  /** Gross minus every pre-tax deduction: the Box 1 figure */
  afterPretax: number;
  /** Gross minus HSA and Section 125 deductions */
  ficaWages: number;
  standardDeduction: number;
  taxableIncome: number;
  federalTax: number;
  ssTax: number;
  medicareTax: number;
  addMedicare: number;
  totalFica: number;
  /** State income tax, any local income tax the engine models, and employee-paid state programs */
  stateTax: number;
  stateLines: StateTaxLine[];
  totalTax: number;
  netAnnual: number;
  /** Federal marginal rate as a decimal */
  marginalRate: number;
  /** Total tax as a share of gross */
  effectiveRate: number;
}

export function computeW2(input: W2Input): W2Result {
  const gross = Math.max(0, input.grossAnnual);
  const p401k = Math.max(0, input.pretax401k ?? 0);
  const pHsa = Math.max(0, input.pretaxHsa ?? 0);
  const pOther = Math.max(0, input.pretaxOther ?? 0);

  const totalPretax = p401k + pHsa + pOther;
  const afterPretax = Math.max(0, gross - totalPretax);

  // FICA: a 401(k) contribution is still subject to FICA; HSA and Section 125 deductions are not
  const ficaWages = Math.max(0, gross - pHsa - pOther);
  const ssTax = Math.min(ficaWages, SOCIAL_SECURITY_WAGE_BASE) * SOCIAL_SECURITY_RATE;
  const medicareTax = ficaWages * MEDICARE_RATE;
  const addMedicare = Math.max(0, ficaWages - ADDITIONAL_MEDICARE_WITHHOLDING_THRESHOLD) * ADDITIONAL_MEDICARE_RATE;
  const totalFica = ssTax + medicareTax + addMedicare;

  const standardDeduction = FEDERAL_STANDARD_DEDUCTIONS[input.filingStatus];
  const taxableIncome = Math.max(0, afterPretax - standardDeduction);
  const federalTax = federalIncomeTaxOn(taxableIncome, input.filingStatus);

  // The state's own withholding rule on the same wages, or the visitor's flat rate for another state
  const state = stateTaxOnWages({
    state: input.state,
    taxableWages: afterPretax,
    ficaWages,
    filingStatus: toWithholdingStatus(input.filingStatus),
    customRate: (input.customStateRatePct ?? 0) / 100,
  });

  const totalTax = federalTax + totalFica + state.total;
  return {
    totalPretax,
    afterPretax,
    ficaWages,
    standardDeduction,
    taxableIncome,
    federalTax,
    ssTax,
    medicareTax,
    addMedicare,
    totalFica,
    stateTax: state.total,
    stateLines: state.lines,
    totalTax,
    netAnnual: gross - totalTax - totalPretax,
    marginalRate: FEDERAL_BRACKETS[input.filingStatus].find((b) => taxableIncome > b.min && taxableIncome <= b.max)?.rate ?? 0,
    effectiveRate: gross > 0 ? totalTax / gross : 0,
  };
}
