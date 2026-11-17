// ---------------------------------------------------------------------------
// 1099 calculator math (self-employment income → taxes and take-home)
// ---------------------------------------------------------------------------
// Pure, so the calculator and the worked examples in its article run the same
// code. What it models, and what it leaves out, is stated here once:
//
// - Self-employment tax: 12.4% Social Security up to the wage base plus 2.9%
//   Medicare, on 92.35% of net profit. The 0.9% Additional Medicare Tax is NOT
//   included.
// - Federal income tax: brackets after the standard deduction, half of the
//   self-employment tax, and a 20% qualified business income deduction taken
//   on net profit with no income limit or service-business phase-out.
// - State income tax: the state's wage withholding formula applied to net
//   profit after the self-employment tax deduction (an estimate; state returns
//   have their own rules for business income), or a flat rate for another
//   state. Employee payroll programs are left out: they come from wages.

import {
  FEDERAL_BRACKETS,
  FEDERAL_STANDARD_DEDUCTIONS,
  federalIncomeTaxOn,
  SECA_MEDICARE_RATE,
  SECA_NET_EARNINGS_FACTOR,
  SECA_SOCIAL_SECURITY_RATE,
  SOCIAL_SECURITY_WAGE_BASE,
  toWithholdingStatus,
  type ReturnFilingStatus,
} from './federal-tax';
import { stateTaxOnWages, type StateTaxChoice } from './state-tax';

export const QBI_DEDUCTION_RATE = 0.2;

export interface Form1099Input {
  grossIncome: number;
  businessExpenses?: number;
  filingStatus: ReturnFilingStatus;
  state: StateTaxChoice;
  /** 'other' state only: flat rate in percent (5 = 5%) */
  customStateRatePct?: number;
}

export interface Form1099Result {
  /** Gross receipts minus expenses: Schedule C profit */
  netSE: number;
  secaTaxable: number;
  ssPortion: number;
  medicarePortion: number;
  secaTax: number;
  secaDeduction: number;
  qbiDeduction: number;
  standardDeduction: number;
  taxableIncome: number;
  federalTax: number;
  stateTax: number;
  totalTax: number;
  afterTax: number;
  /** Federal marginal rate as a decimal */
  marginalRate: number;
  /** Total tax as a share of net profit */
  effectiveRate: number;
  /** One of four equal estimated payments */
  quarterly: number;
}

export function compute1099(input: Form1099Input): Form1099Result {
  const netSE = Math.max(0, Math.max(0, input.grossIncome) - Math.max(0, input.businessExpenses ?? 0));

  const secaTaxable = netSE * SECA_NET_EARNINGS_FACTOR;
  const ssPortion = Math.min(secaTaxable, SOCIAL_SECURITY_WAGE_BASE) * SECA_SOCIAL_SECURITY_RATE;
  const medicarePortion = secaTaxable * SECA_MEDICARE_RATE;
  const secaTax = ssPortion + medicarePortion;
  const secaDeduction = secaTax / 2;
  const qbiDeduction = netSE * QBI_DEDUCTION_RATE;

  const standardDeduction = FEDERAL_STANDARD_DEDUCTIONS[input.filingStatus];
  const taxableIncome = Math.max(0, netSE - secaDeduction - qbiDeduction - standardDeduction);
  const federalTax = federalIncomeTaxOn(taxableIncome, input.filingStatus);

  const state = stateTaxOnWages({
    state: input.state,
    taxableWages: Math.max(0, netSE - secaDeduction),
    filingStatus: toWithholdingStatus(input.filingStatus),
    customRate: (input.customStateRatePct ?? 0) / 100,
  });
  const stateTax = state.incomeTax + state.localTax;

  const totalTax = secaTax + federalTax + stateTax;
  return {
    netSE,
    secaTaxable,
    ssPortion,
    medicarePortion,
    secaTax,
    secaDeduction,
    qbiDeduction,
    standardDeduction,
    taxableIncome,
    federalTax,
    stateTax,
    totalTax,
    afterTax: netSE - totalTax,
    marginalRate: FEDERAL_BRACKETS[input.filingStatus].find((b) => taxableIncome > b.min && taxableIncome <= b.max)?.rate ?? 0,
    effectiveRate: netSE > 0 ? totalTax / netSE : 0,
    quarterly: totalTax / 4,
  };
}
