// ---------------------------------------------------------------------------
// Employer-side payroll cost, 2026 (Roadmap v2, Phase 16.1)
// ---------------------------------------------------------------------------
// What an employer pays ON TOP of gross wages for one employee: the FICA match,
// federal unemployment tax (FUTA), state unemployment insurance (SUI) at the
// state's standard new-employer rate, and the employer share of mandatory state
// paid-leave programs. Workers' compensation, health insurance, retirement
// match and local employer payroll taxes are not modelled — they vary by
// employer, not by state.
//
// Sources (figures as of November 2026):
// - FUTA: IRS Tax Topic 759 — 6.0% on the first $7,000, 5.4% credit, 0.6% net.
//   Credit reduction: U.S. DOL potential 2026 list names California (1.5%) and
//   the Virgin Islands; the final determination is made after November 10,
//   2026. The constant below carries the potential rate and the UI says so.
// - SUI new-employer rates and taxable wage bases: U.S. DOL ETA "Significant
//   Provisions of State UI Laws" plus each state agency where linked in
//   STATE_EMPLOYER_TAXES. Cross-checked against the APS Payroll (Oct 20 2026),
//   Asure (Oct 2026) and Equifax Workforce tables. Industry-rated states (WA,
//   UT, LA, MN) have no single new-employer rate; see each entry's note.
// - Paid-leave employer shares: WA ESD (1.13% total, 28.57% employer),
//   CO FAMLI (0.88% split 50/50), MA DFML (0.88% total, employer pays 0.42%
//   medical at 25+ workers), Paid Leave Oregon (1.0% total, 40% employer),
//   MN DEED Paid Leave (0.88% total, 0.44% employer), NJ TDI new-employer 0.5%.
// ---------------------------------------------------------------------------

import {
  CO_FAMLI_RATE,
  MEDICARE_RATE,
  MN_PAID_LEAVE_RATE,
  PERIODS_PER_YEAR,
  SOCIAL_SECURITY_RATE,
  SOCIAL_SECURITY_WAGE_BASE,
  WA_PFML_EMPLOYEE_RATE,
  type PaycheckLine,
  type PaycheckState,
  type PayFrequency,
  type StateCode,
} from './withholding-2026';
import type { SeoSource } from '@/lib/seo-data/types';
import { SRC } from '@/lib/seo-data/sources';

export const FUTA_RATE = 0.06;
export const FUTA_CREDIT = 0.054;
/** 6.0% − 5.4% credit for employers in a state with no outstanding federal UI loan */
export const FUTA_NET_RATE = 0.006;
export const FUTA_WAGE_BASE = 7000;
/**
 * Potential 2026 FUTA credit reductions (U.S. DOL, January 2026 list). The
 * final list is published after November 10, 2026; California's 2025 final
 * reduction was 1.2%, so 1.5% is the expected 2026 figure.
 */
export const FUTA_CREDIT_REDUCTION: Partial<Record<StateCode, number>> = { CA: 0.015 };

/** Washington PFML total premium (employer + employee) */
export const WA_PFML_TOTAL_RATE = 0.0113;
export const WA_PFML_EMPLOYER_RATE = Math.round((WA_PFML_TOTAL_RATE - WA_PFML_EMPLOYEE_RATE) * 1e6) / 1e6; // 0.003228
export const CO_FAMLI_EMPLOYER_RATE = CO_FAMLI_RATE; // 0.88% split 50/50
export const MA_PFML_EMPLOYER_RATE = 0.0042; // 60% of the 0.70% medical contribution
export const OR_PAID_LEAVE_EMPLOYER_RATE = 0.004; // 40% of the 1.0% contribution
export const MN_PAID_LEAVE_EMPLOYER_RATE = MN_PAID_LEAVE_RATE; // 0.88% split 50/50
export const NJ_TDI_EMPLOYER_NEW_RATE = 0.005;
export const CA_ETT_RATE = 0.001;
export const NV_CEP_RATE = 0.0005;

export interface EmployerStateTax {
  key: string;
  label: string;
  rate: number;
  /** Annual wage cap the rate applies to; null = all wages */
  wageBase: number | null;
  note?: string;
}

export interface StateEmployerProfile {
  sui: {
    /** Standard new-employer rate as a decimal; null where the state assigns an industry rate */
    rate: number | null;
    wageBase: number;
    /** Printed rate text, e.g. "2.70%" or "industry average" */
    rateText: string;
    note: string;
  };
  /** Other mandatory employer-paid state payroll taxes (not workers' compensation) */
  extras: EmployerStateTax[];
  /** State-specific primary source for the rates above */
  source: SeoSource;
}

const DOL_LAWS = SRC.dolStateUiLaws;
const leaveCap = SOCIAL_SECURITY_WAGE_BASE;

export const STATE_EMPLOYER_TAXES: Record<StateCode, StateEmployerProfile> = {
  CA: {
    sui: { rate: 0.034, wageBase: 7000, rateText: '3.40%', note: 'New employers pay 3.4% on the first $7,000 per worker for two to three years; experience rates then run 1.5% to 6.2%.' },
    extras: [{ key: 'ett', label: 'CA Employment Training Tax (0.1%)', rate: CA_ETT_RATE, wageBase: 7000 }],
    source: { label: 'California EDD, Rates and Withholding (2026 UI, ETT and SDI rates)', url: 'https://edd.ca.gov/en/payroll_taxes/rates_and_withholding/', publisher: 'California Employment Development Department', note: 'New-employer UI rate, $7,000 taxable wage limit and the 0.1% ETT' },
  },
  TX: {
    sui: { rate: 0.027, wageBase: 9000, rateText: '2.70%', note: 'Texas assigns every new employer 2.7% (or the industry average if higher) on the first $9,000 per worker until it has enough history for an experience rate.' },
    extras: [],
    source: DOL_LAWS,
  },
  FL: {
    sui: { rate: 0.027, wageBase: 7000, rateText: '2.70%', note: 'Florida reemployment tax starts at 2.7% on the first $7,000 per worker for the first 10 quarters, then moves to an experience rate between 0.1% and 5.4%.' },
    extras: [],
    source: DOL_LAWS,
  },
  NY: {
    sui: { rate: 0.041, wageBase: 17600, rateText: '4.10%', note: 'New York new employers pay 4.025% UI plus the 0.075% Re-employment Service Fund (4.1% combined) on the first $17,600 per worker; the wage base jumped from $12,800 in 2025.' },
    extras: [],
    source: { label: 'New York State Department of Labor, Current 2026 Employer Contribution Rate', url: 'https://dol.ny.gov/unemployment-insurance-rate-information', publisher: 'New York State Department of Labor', note: '4.025% new-employer UI rate plus the 0.075% RSF contribution' },
  },
  IL: {
    sui: { rate: 0.0335, wageBase: 14250, rateText: '3.35%', note: 'Illinois new employers pay 3.35% on the first $14,250 per worker (3.45% in administrative and waste-management services, NAICS 56).' },
    extras: [],
    source: DOL_LAWS,
  },
  WA: {
    sui: { rate: null, wageBase: 78200, rateText: 'industry average', note: 'Washington has no single new-employer rate: ESD assigns 115% of the average rate for your industry (minimum 1.0%) on the first $78,200 per worker, the highest wage base in the country. Enter the rate from your ESD rate notice.' },
    extras: [{ key: 'pfml', label: 'WA Paid Family & Medical Leave, employer share (0.32%)', rate: WA_PFML_EMPLOYER_RATE, wageBase: leaveCap, note: 'Employers with 50 or more employees pay 28.57% of the 1.13% premium; smaller employers only collect the employee share.' }],
    source: { label: 'Washington ESD, How We Determine Unemployment Tax Rates', url: 'https://esd.wa.gov/employer-requirements/unemployment-taxes/how-we-determine-tax-rates', publisher: 'Washington Employment Security Department', note: 'New employers pay 115% of their industry average; 2026 taxable wage base' },
  },
  TN: {
    sui: { rate: 0.027, wageBase: 7000, rateText: '2.70%', note: 'Tennessee new employers in most industries pay 2.7% on the first $7,000 per worker; manufacturing sectors are assigned different rates.' },
    extras: [],
    source: DOL_LAWS,
  },
  NV: {
    sui: { rate: 0.0295, wageBase: 43700, rateText: '2.95%', note: 'Nevada new employers pay 2.95% on the first $43,700 per worker for 14 to 17 quarters before experience rating applies.' },
    extras: [{ key: 'cep', label: 'NV Career Enhancement Program (0.05%)', rate: NV_CEP_RATE, wageBase: 43700 }],
    source: DOL_LAWS,
  },
  PA: {
    sui: { rate: 0.03822, wageBase: 10000, rateText: '3.822%', note: 'Pennsylvania non-construction new employers pay 3.822% (including the 9.2% surcharge) on the first $10,000 per worker; construction pays 10.5924%.' },
    extras: [],
    source: DOL_LAWS,
  },
  NC: {
    sui: { rate: 0.01, wageBase: 34200, rateText: '1.00%', note: 'North Carolina assigns new employers 1.0% on the first $34,200 per worker; experience rates run 0.06% to 5.76%.' },
    extras: [],
    source: DOL_LAWS,
  },
  GA: {
    sui: { rate: 0.027, wageBase: 9500, rateText: '2.70%', note: 'Georgia new employers pay 2.7% (2.64% for non-profits) on the first $9,500 per worker.' },
    extras: [],
    source: DOL_LAWS,
  },
  MI: {
    sui: { rate: 0.027, wageBase: 9000, rateText: '2.70%', note: 'Michigan new employers pay 2.7% for the first two years (construction 5.0%) on the first $9,000 per worker; employers delinquent on UI payments use a $9,500 base.' },
    extras: [],
    source: DOL_LAWS,
  },
  IN: {
    sui: { rate: 0.025, wageBase: 9500, rateText: '2.50%', note: 'Indiana new employers pay 2.5% on the first $9,500 per worker for the first four calendar years (new governmental employers 1.6%).' },
    extras: [],
    source: DOL_LAWS,
  },
  AZ: {
    sui: { rate: 0.02, wageBase: 8000, rateText: '2.00%', note: 'Arizona new employers pay 2.0% on the first $8,000 per worker for at least two calendar years.' },
    extras: [],
    source: DOL_LAWS,
  },
  CO: {
    sui: { rate: 0.0305, wageBase: 30600, rateText: '3.05%', note: 'Colorado non-construction new employers pay 3.05% combined (premium plus support surcharges) on the first $30,600 per worker; heavy construction pays 6.285%.' },
    extras: [{ key: 'famli', label: 'CO FAMLI Paid Leave, employer share (0.44%)', rate: CO_FAMLI_EMPLOYER_RATE, wageBase: leaveCap, note: 'Employers with 10 or more employees pay half of the 0.88% premium; smaller employers pay no employer share.' }],
    source: DOL_LAWS,
  },
  UT: {
    sui: { rate: null, wageBase: 50700, rateText: 'industry average', note: 'Utah assigns new employers the average rate of their industry (overall rates run 0.1% to 7.1%) on the first $50,700 per worker. Enter the rate from your Utah DWS rate notice.' },
    extras: [],
    source: { label: 'Utah Department of Workforce Services, Employer Tax Rates', url: 'https://jobs.utah.gov/ui/employer/Public/Questions/TaxRates.aspx', publisher: 'Utah Department of Workforce Services', note: 'New-employer rates are assigned by industry' },
  },
  KY: {
    sui: { rate: 0.027, wageBase: 12000, rateText: '2.70%', note: 'Kentucky employers with less than three years of experience pay 2.7% on the first $12,000 per worker (new construction employers get the schedule maximum).' },
    extras: [],
    source: DOL_LAWS,
  },
  LA: {
    sui: { rate: null, wageBase: 7000, rateText: 'industry average', note: 'Louisiana assigns new employers the average rate of their industry classification (statutory range 1.0% to 6.2%) on the first $7,000 per worker, down from $7,700 in 2025. Enter the rate from your LWC notice.' },
    extras: [],
    source: DOL_LAWS,
  },
  IA: {
    sui: { rate: 0.01, wageBase: 20400, rateText: '1.00%', note: 'Iowa non-construction new employers pay 1.0% on the first $20,400 per worker; construction pays 5.4%.' },
    extras: [],
    source: DOL_LAWS,
  },
  ID: {
    sui: { rate: 0.01, wageBase: 58300, rateText: '1.00%', note: 'Idaho new employers pay the 1.0% standard rate for at least six quarters on the first $58,300 per worker, the third-highest wage base in the country.' },
    extras: [],
    source: DOL_LAWS,
  },
  OH: {
    sui: { rate: 0.0285, wageBase: 9000, rateText: '2.85%', note: 'Ohio non-construction new employers pay 2.7% plus a 0.15% fee (2.85% total) on the first $9,000 per worker; construction pays 5.85%.' },
    extras: [],
    source: DOL_LAWS,
  },
  VA: {
    sui: { rate: 0.025, wageBase: 8000, rateText: '2.50%', note: 'Virginia new employers pay a 2.5% base rate (plus any pool and fund-building add-ons in force) on the first $8,000 per worker until eligible for a computed rate.' },
    extras: [],
    source: DOL_LAWS,
  },
  NJ: {
    sui: { rate: 0.028, wageBase: 44800, rateText: '2.80%', note: 'New Jersey new employers pay 2.8% (unemployment plus workforce funds) for the July 2026 to June 2027 fiscal year on the first $44,800 per worker.' },
    extras: [{ key: 'tdi', label: 'NJ Temporary Disability Insurance, employer (0.5%)', rate: NJ_TDI_EMPLOYER_NEW_RATE, wageBase: 44800, note: 'New-employer TDI rate; experience-rated employers pay 0.1% to 0.75%.' }],
    source: { label: 'New Jersey Department of Labor, Employer Rate Information, Contributions and Due Dates', url: 'https://www.nj.gov/labor/ea/employer-services/rate-info/', publisher: 'New Jersey Department of Labor and Workforce Development', note: 'New-employer unemployment and disability rates and the 2026 wage base' },
  },
  MA: {
    sui: { rate: 0.0242, wageBase: 15000, rateText: '2.42%', note: 'Massachusetts employers registered under three years pay 2.42% on the first $15,000 per worker (new construction 6.08%); the small workforce-training and health-insurance assessments are not included.' },
    extras: [{ key: 'pfml', label: 'MA Paid Family & Medical Leave, employer share (0.42%)', rate: MA_PFML_EMPLOYER_RATE, wageBase: leaveCap, note: 'Employers with 25 or more covered individuals pay 60% of the 0.70% medical contribution; smaller employers owe no employer share.' }],
    source: DOL_LAWS,
  },
  MD: {
    sui: { rate: 0.026, wageBase: 8500, rateText: '2.60%', note: 'Maryland new employers pay 2.6% on the first $8,500 per worker under 2026 Table A, the lowest-rate table (experience rates 0.3% to 7.5%).' },
    extras: [],
    source: { label: 'Maryland Department of Labor, Unemployment Insurance Tax Rates', url: 'https://www.labor.maryland.gov/unemployment-insurance/employer-agent/tax-rate.shtml', publisher: 'Maryland Department of Labor', note: 'Table A in effect for 2026 and the new-employer rate' },
  },
  MN: {
    sui: { rate: null, wageBase: 44000, rateText: 'industry average + 0.4%', note: 'Minnesota assigns new employers their industry average (1.0% to 8.9%) plus the 0.4% base tax on the first $44,000 per worker; most non-construction industries fall between 1.0% and 4.06%. Enter the rate from your Minnesota UI notice.' },
    extras: [{ key: 'pfml', label: 'MN Paid Leave, employer share (0.44%)', rate: MN_PAID_LEAVE_EMPLOYER_RATE, wageBase: leaveCap, note: 'Half of the 0.88% premium; employers with 30 or fewer employees and lower wages qualify for the 0.22% small-employer rate.' }],
    source: { label: 'Minnesota DEED, Paid Leave Premiums for Employers', url: 'https://mn.gov/deed/paidleave/employers/premiums/', publisher: 'Minnesota Department of Employment and Economic Development', note: '0.88% premium with a 0.44% employer contribution in 2026' },
  },
  MO: {
    sui: { rate: 0.02376, wageBase: 9000, rateText: '2.376%', note: 'Missouri new employers pay 2.376% on the first $9,000 per worker (non-profits 1.0%).' },
    extras: [],
    source: DOL_LAWS,
  },
  WI: {
    sui: { rate: 0.0305, wageBase: 14000, rateText: '3.05%', note: 'Wisconsin new employers with payroll under $500,000 pay 3.05% on the first $14,000 per worker; larger new employers pay 3.25% (construction 2.5% and 2.7%).' },
    extras: [],
    source: DOL_LAWS,
  },
  OR: {
    sui: { rate: 0.024, wageBase: 56700, rateText: '2.40%', note: 'Oregon new employers pay 2.4% on the first $56,700 per worker; the 0.135% special payroll tax offset is not included.' },
    extras: [{ key: 'pfl', label: 'Paid Leave Oregon, employer share (0.4%)', rate: OR_PAID_LEAVE_EMPLOYER_RATE, wageBase: leaveCap, note: 'Employers with 25 or more employees pay 40% of the 1.0% contribution; smaller employers pay no employer share.' }],
    source: DOL_LAWS,
  },
  SC: {
    sui: { rate: 0.0106, wageBase: 14000, rateText: '1.06%', note: 'South Carolina new employers are assigned class 30: 1.0% plus the 0.06% contingency assessment (1.06% combined) on the first $14,000 per worker.' },
    extras: [],
    source: DOL_LAWS,
  },
};

export interface EmployerCostInput {
  state: PaycheckState;
  grossAnnual: number;
  /** Gross minus Section 125 benefits — the FICA/FUTA/SUI wage figure */
  ficaWagesAnnual: number;
  payFrequency: PayFrequency;
  /** Hours worked in a year, for the cost-per-hour figure */
  hoursPerYear: number;
  /**
   * The employer's assigned SUI rate as a decimal. Omit to use the state's
   * standard new-employer rate; required for industry-rated states (WA, UT,
   * LA, MN) and for 'none' / 'other', where no state table applies.
   */
  suiRate?: number | null;
}

export interface EmployerCostResult {
  periodsPerYear: number;
  grossAnnual: number;
  grossPerPeriod: number;
  /** Employer-paid taxes and contributions, in display order */
  lines: PaycheckLine[];
  employerTaxesAnnual: number;
  employerTaxesPerPeriod: number;
  /** Gross wages plus employer taxes */
  totalCostAnnual: number;
  totalCostPerPeriod: number;
  totalCostPerHour: number;
  /** Employer taxes as a share of gross wages, e.g. 0.095 */
  loadRate: number;
  /** SUI rate actually applied (null when none could be applied) */
  suiRateApplied: number | null;
  suiWageBase: number | null;
  /** FUTA rate applied, including any credit reduction */
  futaRateApplied: number;
}

const round2 = (n: number) => Math.round(n * 100) / 100;

function isStateCode(s: PaycheckState): s is StateCode {
  return s !== 'none' && s !== 'other';
}

export function calculateEmployerCost(input: EmployerCostInput): EmployerCostResult {
  const periodsPerYear = PERIODS_PER_YEAR[input.payFrequency];
  const gross = Math.max(0, input.grossAnnual);
  const wages = Math.min(gross, Math.max(0, input.ficaWagesAnnual));
  const profile = isStateCode(input.state) ? STATE_EMPLOYER_TAXES[input.state] : null;

  const futaReduction = isStateCode(input.state) ? (FUTA_CREDIT_REDUCTION[input.state] ?? 0) : 0;
  const futaRate = FUTA_NET_RATE + futaReduction;

  const raw: { key: string; label: string; annual: number }[] = [
    {
      key: 'er-social-security',
      label: 'Social Security match (6.2%)',
      annual: Math.min(wages, SOCIAL_SECURITY_WAGE_BASE) * SOCIAL_SECURITY_RATE,
    },
    { key: 'er-medicare', label: 'Medicare match (1.45%)', annual: wages * MEDICARE_RATE },
    {
      key: 'futa',
      label:
        futaReduction > 0
          ? `Federal unemployment, FUTA (${(futaRate * 100).toFixed(1)}% on first $7,000 incl. ${(futaReduction * 100).toFixed(1)}% credit reduction)`
          : 'Federal unemployment, FUTA (0.6% on first $7,000)',
      annual: Math.min(wages, FUTA_WAGE_BASE) * futaRate,
    },
  ];

  let suiRateApplied: number | null = null;
  let suiWageBase: number | null = null;
  if (profile) {
    const rate = input.suiRate ?? profile.sui.rate;
    suiWageBase = profile.sui.wageBase;
    if (rate !== null && rate >= 0) {
      suiRateApplied = rate;
      raw.push({
        key: 'sui',
        label: `State unemployment insurance (${parseFloat((rate * 100).toFixed(3))}% on first $${profile.sui.wageBase.toLocaleString('en-US')})`,
        annual: Math.min(wages, profile.sui.wageBase) * rate,
      });
    }
    for (const extra of profile.extras) {
      raw.push({
        key: extra.key,
        label: extra.label,
        annual: (extra.wageBase === null ? wages : Math.min(wages, extra.wageBase)) * extra.rate,
      });
    }
  } else if (input.suiRate !== undefined && input.suiRate !== null && input.suiRate >= 0) {
    // Generic state: apply the entered rate to the federal $7,000 base, the floor every state uses
    suiRateApplied = input.suiRate;
    suiWageBase = FUTA_WAGE_BASE;
    raw.push({
      key: 'sui',
      label: `State unemployment insurance (${parseFloat((input.suiRate * 100).toFixed(3))}% on first $7,000)`,
      annual: Math.min(wages, FUTA_WAGE_BASE) * input.suiRate,
    });
  }

  const lines: PaycheckLine[] = raw.map((l) => ({
    key: l.key,
    label: l.label,
    annual: round2(l.annual),
    perPeriod: round2(l.annual / periodsPerYear),
  }));
  const employerTaxesAnnual = round2(lines.reduce((s, l) => s + l.annual, 0));
  const totalCostAnnual = round2(gross + employerTaxesAnnual);

  return {
    periodsPerYear,
    grossAnnual: round2(gross),
    grossPerPeriod: round2(gross / periodsPerYear),
    lines,
    employerTaxesAnnual,
    employerTaxesPerPeriod: round2(employerTaxesAnnual / periodsPerYear),
    totalCostAnnual,
    totalCostPerPeriod: round2(totalCostAnnual / periodsPerYear),
    totalCostPerHour: input.hoursPerYear > 0 ? round2(totalCostAnnual / input.hoursPerYear) : 0,
    loadRate: gross > 0 ? employerTaxesAnnual / gross : 0,
    suiRateApplied,
    suiWageBase,
    futaRateApplied: futaRate,
  };
}

/** Sources every employer-cost section cites, in addition to the state's own */
export const EMPLOYER_COST_SOURCES: SeoSource[] = [SRC.irsPub15, SRC.irsTopic759, SRC.dolFutaCreditReduction, SRC.dolStateUiLaws];
