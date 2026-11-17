// ---------------------------------------------------------------------------
// 2026 withholding rules for the states that have no paycheck page
// ---------------------------------------------------------------------------
// The 30 states in 2026.ts each have a paycheck page, employer-cost figures and
// an article. The jurisdictions here have only a withholding rule: enough for
// the state tax, W-2 and 1099 calculators to name them and compute their income
// tax, without the minimum-wage, unemployment-insurance and article content a
// paycheck page needs.
//
// A state is added only with its own 2026 withholding publication in hand. The
// publication is cited above each rule and listed in MORE_STATE_SOURCES, and
// each rule has hand-computed tests in 2026-more-states.test.ts. A state whose
// publication could not be read stays out of the record at the bottom, and the
// calculators keep offering it as "Another state" with a rate the visitor enters.
//
// Conventions, the same as for the 30 page states:
// - Annual figures. Publications that give a formula per pay period are applied
//   to a year of wages with the annual table; whole-dollar rounding per paycheck
//   is not applied.
// - `allowances` is the number the employee claims on the state's own form. The
//   calculators pass the usual number for a filer with no dependents
//   (state-tax.ts, MORE_STATES).
// - Where a state's form offers a lower-withholding option that the employee
//   must ask for, the rule uses the default the employer applies without it.
// - A state program whose cost the law lets the employer take from wages, up to
//   a stated share, is shown at that share and labeled "up to".
//
// Not modeled, and why:
// - Rhode Island: the Division of Taxation's 2026 withholding booklet could not
//   be downloaded (its site refuses automated requests). Figures restated by
//   third parties were not used.
// - District of Columbia: the Office of Tax and Revenue has published no
//   withholding tables since the 2018 FR-230; its standing notice refers
//   employers to the income tax rate schedule and a federal allowance amount
//   that no longer exists, so there is no 2026 formula to implement.
//
// The rules are built by a function that receives the year's federal tables,
// because some states start from federal figures. 2026.ts calls it with
// FEDERAL_2026; this file imports nothing from 2026.ts, so there is no cycle.

import {
  federalIncomeTax,
  taxFromSchedule,
  type FederalTables,
  type FilingStatus,
  type ScheduleRow,
  type StateRule,
  type WithholdingOnlyState,
} from './engine';

/** A rate table as publications print it: [wages over, tax on that amount, rate on the excess] */
const table = (rows: [over: number, base: number, rate: number][]): ScheduleRow[] => rows.map(([over, base, rate]) => ({ over, base, rate }));

export interface MoreStateSource {
  label: string;
  url: string;
  publisher: string;
  note: string;
}

// ---------------------------------------------------------------------------
// Alabama — Withholding Tax Tables and Instructions for Employers and
// Withholding Agents, revised January 2026, "Formula For Computing Alabama
// Withholding Tax". Annual gross income less: a standard deduction that steps
// down between $25,999 and $35,500 of income, the employee's federal income tax
// withheld for the year, and the personal exemption for the Form A-4 code
// (S $1,500; M and H $3,000). Dependents (a further deduction each) are not
// modeled: the calculators assume none. Rates 2%, 4%, 5%.
// ---------------------------------------------------------------------------

/** [amount up to $25,999 of income, reduction per $500 step above it, amount from $35,500] */
const AL_STANDARD_DEDUCTION: Record<FilingStatus, [number, number, number]> = {
  single: [3000, 25, 2500], // A-4 code S
  married: [8500, 175, 5000], // code M
  hoh: [5200, 135, 2500], // code H
};
const AL_PERSONAL_EXEMPTION: Record<FilingStatus, number> = { single: 1500, married: 3000, hoh: 3000 };

function alabamaStandardDeduction(grossIncome: number, status: FilingStatus): number {
  const [full, perStep, floor] = AL_STANDARD_DEDUCTION[status];
  if (grossIncome <= 25999) return full;
  if (grossIncome >= 35500) return floor;
  // "less $X for each $500 increment or part thereof of GI above $25,999"
  return full - perStep * Math.ceil((grossIncome - 25999) / 500);
}

function alabamaIncomeTax(annualWages: number, status: FilingStatus, federalWithheld: number): number {
  const taxable = annualWages - alabamaStandardDeduction(annualWages, status) - federalWithheld - AL_PERSONAL_EXEMPTION[status];
  if (taxable <= 0) return 0;
  // code M: first $1,000 at 2%, next $5,000 at 4%, the rest at 5%; every other code: $500, $2,500, the rest
  const [first, next] = status === 'married' ? [1000, 5000] : [500, 2500];
  return Math.min(taxable, first) * 0.02 + Math.min(Math.max(0, taxable - first), next) * 0.04 + Math.max(0, taxable - first - next) * 0.05;
}

// ---------------------------------------------------------------------------
// Arkansas — Withholding Tax Formula Method, Tax Year 2026, effective
// 01/01/2026, as reposted 05/29/2026 with the 3.7% top rate (it replaced the
// December 2025 version at 3.9%). Wages less the $2,470 standard deduction; below
// $100,001 the income is looked up at the middle of its $100 range; tax is the
// bracket percentage less the bracket's adjustment, rounded to a dollar; then $29
// per exemption on Form AR4EC. One schedule for every filing status. The separate
// low-income tables, which an employee must qualify for and claim, are not modeled.
// ---------------------------------------------------------------------------

const AR_STANDARD_DEDUCTION = 2470;
const AR_EXEMPTION_CREDIT = 29;
/** [net taxable income from, rate, minus adjustment] up to $94,700; above that the adjustment moves in $100 bands */
const AR_BRACKETS: [from: number, rate: number, minus: number][] = [
  [0, 0, 0],
  [5600, 0.02, 111.98],
  [11200, 0.03, 223.97],
  [16000, 0.034, 287.97],
  [26400, 0.037, 367.16],
];

function arkansasGrossTax(netTaxableIncome: number): number {
  if (netTaxableIncome <= 0) return 0;
  // "If Net Taxable Income is below $100,001, look up the income at the $50 range (midrange of $100)"
  const income = netTaxableIncome < 100001 ? Math.floor(netTaxableIncome / 100) * 100 + 50 : netTaxableIncome;
  let tax: number;
  if (income >= 97601) tax = income * 0.037 - 79.9;
  // $94,701–$94,800 minus $369.90, then $10.00 less for each further $100 band, down to $89.90 at $97,501–$97,600
  else if (income >= 94701) tax = income * 0.037 - (369.9 - 10 * Math.floor((income - 94701) / 100));
  else {
    let row = AR_BRACKETS[0];
    for (const r of AR_BRACKETS) if (income >= r[0]) row = r;
    tax = income * row[1] - row[2];
  }
  return Math.max(0, Math.round(tax));
}

function arkansasIncomeTax(annualWages: number, exemptions: number): number {
  return Math.max(0, arkansasGrossTax(annualWages - AR_STANDARD_DEDUCTION) - exemptions * AR_EXEMPTION_CREDIT);
}

// ---------------------------------------------------------------------------
// Connecticut — TPG-211, 2026 Withholding Calculation Rules (Rev. 12/25),
// effective January 1, 2026. By Form CT-W4 withholding code: F single, C married
// filing jointly with one earner, B head of household. Tables A (exemption),
// C (2% rate phase-out add-back), D (recapture) and E (personal credit decimal)
// are looked up by annual salary; Table B is applied to salary less the
// exemption. Every range is "more than X, up to and including Y". The tables are
// regular step patterns and are generated here; the tests hold rows typed from
// the publication.
// CT Paid Leave: 0.5% of wages up to the Social Security wage base, paid by the
// employee (ctpaidleave.org, "How CT Paid Leave works: contributions").
// ---------------------------------------------------------------------------

type CtCode = 'F' | 'C' | 'B';
const CT_CODE: Record<FilingStatus, CtCode> = { single: 'F', married: 'C', hoh: 'B' };
/** Steps of `width` above `from`, counting a part of a step as a whole one; zero at or below `from` */
const stepsAbove = (salary: number, from: number, width: number) => (salary > from ? Math.ceil((salary - from) / width) : 0);

/** Table A: the full exemption up to a salary, then $1,000 less for each $1,000 of salary above it */
const CT_EXEMPTION: Record<CtCode, [full: number, upTo: number]> = { F: [15000, 30000], C: [24000, 48000], B: [19000, 38000] };
function ctExemption(salary: number, code: CtCode): number {
  const [full, upTo] = CT_EXEMPTION[code];
  return Math.max(0, full - 1000 * stepsAbove(salary, upTo, 1000));
}

/** Table B: initial tax on salary less the exemption */
const CT_TABLE_B: Record<CtCode, ScheduleRow[]> = {
  F: table([
    [0, 0, 0.02],
    [10000, 200, 0.045],
    [50000, 2000, 0.055],
    [100000, 4750, 0.06],
    [200000, 10750, 0.065],
    [250000, 14000, 0.069],
    [500000, 31250, 0.0699],
  ]),
  B: table([
    [0, 0, 0.02],
    [16000, 320, 0.045],
    [80000, 3200, 0.055],
    [160000, 7600, 0.06],
    [320000, 17200, 0.065],
    [400000, 22400, 0.069],
    [800000, 50000, 0.0699],
  ]),
  C: table([
    [0, 0, 0.02],
    [20000, 400, 0.045],
    [100000, 4000, 0.055],
    [200000, 9500, 0.06],
    [400000, 21500, 0.065],
    [500000, 28000, 0.069],
    [1000000, 62500, 0.0699],
  ]),
};

/** Table C: [salary the add-back starts above, width of each step, amount per step]; ten steps */
const CT_ADD_BACK: Record<CtCode, [from: number, width: number, amount: number]> = { F: [56500, 5000, 25], C: [100500, 5000, 50], B: [78500, 4000, 40] };
function ctAddBack(salary: number, code: CtCode): number {
  const [from, width, amount] = CT_ADD_BACK[code];
  return amount * Math.min(10, stepsAbove(salary, from, width));
}

/** Table D: three runs of steps (10, 30 and 9 of them), each starting above its own salary */
const CT_RECAPTURE: Record<CtCode, { width: number; starts: [number, number, number]; amounts: [number, number, number] }> = {
  F: { width: 5000, starts: [105000, 200000, 500000], amounts: [25, 90, 50] },
  B: { width: 8000, starts: [168000, 320000, 800000], amounts: [40, 140, 80] },
  C: { width: 10000, starts: [210000, 400000, 1000000], amounts: [50, 180, 100] },
};
function ctRecapture(salary: number, code: CtCode): number {
  const { width, starts, amounts } = CT_RECAPTURE[code];
  return (
    amounts[0] * Math.min(10, stepsAbove(salary, starts[0], width)) +
    amounts[1] * Math.min(30, stepsAbove(salary, starts[1], width)) +
    amounts[2] * Math.min(9, stepsAbove(salary, starts[2], width))
  );
}

/**
 * Table E: the decimal is .75 up to the first salary, falls .05 per $500 to .40, holds .35 up to the
 * second, falls to .20, holds .15 up to the third, falls .01 per $500 to .11, holds .10 up to the
 * fourth, then falls .01 per $500 to zero.
 */
const CT_CREDIT_ENDS: Record<CtCode, [number, number, number, number]> = {
  F: [18800, 25000, 31300, 60000],
  C: [30000, 40000, 50000, 96000],
  B: [24000, 34000, 44000, 74000],
};
function ctCreditDecimal(salary: number, code: CtCode): number {
  const [e1, e2, e3, e4] = CT_CREDIT_ENDS[code];
  const hundredths =
    salary <= e1
      ? 75
      : salary <= e1 + 3500
        ? 75 - 5 * stepsAbove(salary, e1, 500)
        : salary <= e2
          ? 35
          : salary <= e2 + 1500
            ? 35 - 5 * stepsAbove(salary, e2, 500)
            : salary <= e3
              ? 15
              : salary <= e3 + 2000
                ? 15 - stepsAbove(salary, e3, 500)
                : salary <= e4
                  ? 10
                  : Math.max(0, 10 - stepsAbove(salary, e4, 500));
  return hundredths / 100;
}

function connecticutIncomeTax(annualSalary: number, status: FilingStatus): number {
  const code = CT_CODE[status];
  const taxable = annualSalary - ctExemption(annualSalary, code);
  if (taxable <= 0) return 0;
  const initial = taxFromSchedule(taxable, CT_TABLE_B[code]) + ctAddBack(annualSalary, code) + ctRecapture(annualSalary, code);
  return initial * (1 - ctCreditDecimal(annualSalary, code));
}

const CT_PAID_LEAVE_RATE = 0.005;

// ---------------------------------------------------------------------------
// Delaware — Employer's Guide (Withholding Regulations & Employer's Duties),
// section 17, "Tax Computation Table Effective January 1, 2025", the edition in
// force for 2026. Wages less the standard deduction ($3,250, or $6,500 married
// filing jointly), the table, then $110 per personal exemption on Form DE-W4.
// The guide names no head of household status; such a filer is single.
// Delaware Paid Leave: 19 Del. C. § 3705 sets 2026 contributions of 0.8% of
// wages up to the Social Security wage base (medical 0.4%, family caregiving
// 0.08%, parental 0.32%) and lets the employer deduct no more than half, 0.4%.
// ---------------------------------------------------------------------------

const DE_STANDARD_DEDUCTION: Record<FilingStatus, number> = { single: 3250, married: 6500, hoh: 3250 };
const DE_EXEMPTION_CREDIT = 110;
const DE_SCHEDULE = table([
  [0, 0, 0],
  [2000, 0, 0.022],
  [5000, 66, 0.039],
  [10000, 261, 0.048],
  [20000, 741, 0.052],
  [25000, 1001, 0.0555],
  [60000, 2943.5, 0.066],
]);
const DE_PAID_LEAVE_EMPLOYEE_MAX_RATE = 0.004;

function delawareIncomeTax(annualWages: number, status: FilingStatus, exemptions: number): number {
  const tax = taxFromSchedule(annualWages - DE_STANDARD_DEDUCTION[status], DE_SCHEDULE);
  return Math.max(0, tax - exemptions * DE_EXEMPTION_CREDIT);
}

// ---------------------------------------------------------------------------
// Hawaii — Booklet A, Employer's Tax Guide (Rev. 2025), appendix "effective as of
// December 5, 2025 for withholding January 1, 2026 and thereafter", annualized
// income tax withholding. Wages less $1,144 per Form HW-4 allowance and the
// $4,350 extra lump-sum allowance, then the annual schedule. Head of household
// uses the single schedule. The withholding schedule tops out at 7.90%.
// Temporary Disability Insurance: an employer may withhold half the premium, at
// most 0.5% of weekly wages and $7.50 a week in 2026 (DLIR, 2026 Maximum Weekly
// Wage Base notice of December 10, 2025).
// ---------------------------------------------------------------------------

const HI_ALLOWANCE = 1144;
const HI_LUMP_SUM_ALLOWANCE = 4350;
const HI_SCHEDULES: Record<'single' | 'married', ScheduleRow[]> = {
  single: table([
    [0, 0, 0.014],
    [9600, 134, 0.032],
    [14400, 288, 0.055],
    [19200, 552, 0.064],
    [24000, 859, 0.068],
    [36000, 1675, 0.072],
    [48000, 2539, 0.076],
    [125000, 8391, 0.079],
  ]),
  married: table([
    [0, 0, 0.014],
    [19200, 269, 0.032],
    [28800, 576, 0.055],
    [38400, 1104, 0.064],
    [48000, 1718, 0.068],
    [72000, 3350, 0.072],
    [96000, 5078, 0.076],
    [250000, 16782, 0.079],
  ]),
};
const HI_TDI_MAX_RATE = 0.005;
const HI_TDI_MAX_PER_WEEK = 7.5;

function hawaiiIncomeTax(annualWages: number, status: FilingStatus, allowances: number): number {
  const subject = annualWages - allowances * HI_ALLOWANCE - HI_LUMP_SUM_ALLOWANCE;
  return taxFromSchedule(subject, HI_SCHEDULES[status === 'married' ? 'married' : 'single']);
}

// ---------------------------------------------------------------------------
// Kansas — KW-100, Kansas Withholding Tax Guide (Rev. 10-24), rates for wages
// paid on or after July 1, 2024, still the edition in force in 2026. Wages less
// the withholding allowance amount, then Table 7 (annual). On the single table
// the first Form K-4 allowance is worth the $9,160 personal exemption and each
// further one $2,320; on the married table the first two are $9,160 each. A head
// of household uses the single table with one additional $2,320 allowance.
// ---------------------------------------------------------------------------

const KS_PERSONAL_EXEMPTION = 9160;
const KS_ADDITIONAL_ALLOWANCE = 2320;
const KS_SCHEDULES: Record<'single' | 'married', ScheduleRow[]> = {
  single: table([
    [0, 0, 0],
    [3605, 0, 0.052],
    [26605, 1196, 0.0558],
  ]),
  married: table([
    [0, 0, 0],
    [8240, 0, 0.052],
    [54240, 2392, 0.0558],
  ]),
};

function kansasIncomeTax(annualWages: number, status: FilingStatus, allowances: number): number {
  const married = status === 'married';
  const full = Math.min(Math.max(0, allowances), married ? 2 : 1);
  const allowanceAmount = full * KS_PERSONAL_EXEMPTION + Math.max(0, allowances - full) * KS_ADDITIONAL_ALLOWANCE;
  return taxFromSchedule(annualWages - allowanceAmount, KS_SCHEDULES[married ? 'married' : 'single']);
}

// ---------------------------------------------------------------------------
// Maine — 2026 Withholding Tables for Individual Income Tax, revised August 2026
// (it replaced the December 2025 edition, with larger standard deductions and
// the new surcharge), percentage method. Wages less $5,300 per Form W-4ME
// allowance and the standard deduction for withholding, which shrinks to nothing
// between $102,250 and $177,250 of wages (single) or $204,550 and $354,550
// (married). A 2% surcharge applies to income over $1,000,000 ($1,500,000
// married). Head of household uses the single schedule.
// Paid Family and Medical Leave: an employer may deduct up to 0.5% of wages, up
// to the Social Security wage base (Maine Department of Labor, employer FAQ).
// ---------------------------------------------------------------------------

const ME_ALLOWANCE = 5300;
/** [deduction, wages up to which it is whole, wages from which it is zero] */
const ME_STANDARD_DEDUCTION: Record<'single' | 'married', [number, number, number]> = {
  single: [12850, 102250, 177250],
  married: [28550, 204550, 354550],
};
const ME_SCHEDULES: Record<'single' | 'married', ScheduleRow[]> = {
  single: table([
    [0, 0, 0.058],
    [27400, 1589, 0.0675],
    [64850, 4117, 0.0715],
  ]),
  married: table([
    [0, 0, 0.058],
    [54850, 3181, 0.0675],
    [129750, 8237, 0.0715],
  ]),
};
const ME_SURCHARGE_RATE = 0.02;
const ME_SURCHARGE_OVER: Record<'single' | 'married', number> = { single: 1000000, married: 1500000 };
const ME_PFML_EMPLOYEE_MAX_RATE = 0.005;

function maineStandardDeduction(annualWages: number, status: 'single' | 'married'): number {
  const [full, wholeUpTo, zeroFrom] = ME_STANDARD_DEDUCTION[status];
  if (annualWages <= wholeUpTo) return full;
  if (annualWages >= zeroFrom) return 0;
  return (full * (zeroFrom - annualWages)) / (zeroFrom - wholeUpTo);
}

function maineIncomeTax(annualWages: number, status: FilingStatus, allowances: number): number {
  const schedule = status === 'married' ? 'married' : 'single';
  const income = annualWages - allowances * ME_ALLOWANCE - maineStandardDeduction(annualWages, schedule);
  if (income <= 0) return 0;
  return taxFromSchedule(income, ME_SCHEDULES[schedule]) + Math.max(0, income - ME_SURCHARGE_OVER[schedule]) * ME_SURCHARGE_RATE;
}

// ---------------------------------------------------------------------------
// Mississippi — Pub. 89-700, Withholding Income Tax Tables and Employer
// Instructions (revised 1.13.2026; tables "Effective January 1, 2026") and the
// DOR "Computer Payroll Accounting, For Periods In 2026" flowchart. Wages less
// the Form 89-350 exemption and the standard deduction; 4.0% of taxable income
// over $10,000. Married is the one-earner entry (spouse not employed).
// ---------------------------------------------------------------------------

const MS_EXEMPTION: Record<FilingStatus, number> = { single: 6000, married: 12000, hoh: 9500 };
const MS_STANDARD_DEDUCTION: Record<FilingStatus, number> = { single: 2300, married: 4600, hoh: 3400 };
const MS_RATE = 0.04;
const MS_ZERO_BAND = 10000;

function mississippiIncomeTax(annualWages: number, status: FilingStatus): number {
  const taxable = annualWages - MS_EXEMPTION[status] - MS_STANDARD_DEDUCTION[status];
  return Math.max(0, taxable - MS_ZERO_BAND) * MS_RATE;
}

// ---------------------------------------------------------------------------
// Montana — Employer and Information Agent Guide with Withholding Tax Tables,
// V4 November 2025, for use beginning January 1, 2026. Formula W = A + B × (G − C)
// on the annual table for the Form MW-4 status. No allowances since 2024; the 0%
// band is the federal standard deduction. Top rate 5.65% for 2026 (H.B. 337).
// ---------------------------------------------------------------------------

const MT_SCHEDULES: Record<FilingStatus, ScheduleRow[]> = {
  // MW-4 box 1a: single or married filing separately
  single: table([
    [0, 0, 0],
    [16100, 0, 0.047],
    [63600, 2233, 0.0565],
  ]),
  // box 1b: married filing jointly or qualifying surviving spouse
  married: table([
    [0, 0, 0],
    [32200, 0, 0.047],
    [127200, 4465, 0.0565],
  ]),
  // box 1c: head of household
  hoh: table([
    [0, 0, 0],
    [24150, 0, 0.047],
    [95400, 3349, 0.0565],
  ]),
};

function montanaIncomeTax(annualWages: number, status: FilingStatus): number {
  return taxFromSchedule(annualWages, MT_SCHEDULES[status]);
}

// ---------------------------------------------------------------------------
// Nebraska — 2026 Nebraska Circular EN (8-429-1998 Rev. 11-2025), wages paid on
// or after January 1, 2026. Wages less $2,440 per Form W-4N allowance, then
// Table 7 (annual). Single includes head of household. The W-4N worksheet gives
// a single filer with one job two allowances and a married one-earner filer
// three (a head of household one more).
// The circular's special rule: if the result is under 1.5% of wages, withhold at
// least half of what a single employee with one allowance, or a married employee
// with two, would have withheld.
// ---------------------------------------------------------------------------

const NE_ALLOWANCE = 2440;
const NE_SCHEDULES: Record<'single' | 'married', ScheduleRow[]> = {
  single: table([
    [0, 0, 0],
    [3430, 0, 0.0226],
    [6710, 74.13, 0.0322],
    [21810, 560.35, 0.0421],
    [31610, 972.93, 0.0435],
    [40130, 1343.55, 0.0448],
    [75370, 2922.3, 0.046],
  ]),
  married: table([
    [0, 0, 0],
    [8190, 0, 0.0226],
    [13010, 108.93, 0.0322],
    [32400, 733.29, 0.0421],
    [50400, 1491.09, 0.0435],
    [62530, 2018.75, 0.0448],
    [82920, 2932.22, 0.046],
  ]),
};

function nebraskaIncomeTax(annualWages: number, status: FilingStatus, allowances: number): number {
  const married = status === 'married';
  const schedule = NE_SCHEDULES[married ? 'married' : 'single'];
  const at = (count: number) => taxFromSchedule(Math.max(0, annualWages - count * NE_ALLOWANCE), schedule);
  const tax = at(allowances);
  return tax < annualWages * 0.015 ? Math.max(tax, at(married ? 2 : 1) / 2) : tax;
}

// ---------------------------------------------------------------------------
// New Mexico — FYI-104, New Mexico Withholding Tax, effective January 1, 2026
// (Rev. 11/2025). The federal Form W-4 status picks the table; nothing is
// subtracted first, the 0% band stands in for the standard deduction (Table 7,
// annual).
// Workers' Compensation Fee: $2.25 a quarter from each covered employee
// (Taxation and Revenue Department; form TRD-41431 instructions).
// ---------------------------------------------------------------------------

const NM_SCHEDULES: Record<FilingStatus, ScheduleRow[]> = {
  single: table([
    [0, 0, 0],
    [8050, 0, 0.015],
    [13550, 82.5, 0.032],
    [20550, 306.5, 0.032],
    [24550, 434.5, 0.043],
    [33550, 821.5, 0.043],
    [41550, 1165.5, 0.047],
    [58550, 1964.5, 0.047],
    [74550, 2716.5, 0.049],
    [218050, 9748, 0.059],
  ]),
  married: table([
    [0, 0, 0],
    [16100, 0, 0.015],
    [24100, 120, 0.032],
    [32100, 376, 0.032],
    [41100, 664, 0.043],
    [57100, 1352, 0.043],
    [66100, 1739, 0.047],
    [102100, 3431, 0.047],
    [116100, 4089, 0.049],
    [331100, 14624, 0.059],
  ]),
  hoh: table([
    [0, 0, 0],
    [12075, 0, 0.015],
    [20075, 120, 0.032],
    [28075, 376, 0.032],
    [37075, 664, 0.043],
    [53075, 1352, 0.043],
    [62075, 1739, 0.047],
    [98075, 3431, 0.047],
    [112075, 4089, 0.049],
    [327075, 14624, 0.059],
  ]),
};
const NM_WORKERS_COMP_FEE_PER_QUARTER = 2.25;

function newMexicoIncomeTax(annualWages: number, status: FilingStatus): number {
  return taxFromSchedule(annualWages, NM_SCHEDULES[status]);
}

// ---------------------------------------------------------------------------
// North Dakota — Income Tax Withholding Rates & Instructions, for wages paid in
// 2026 (form 28216, 12/2025), percentage method for Forms W-4 from 2020 or
// later: the annual table for the federal W-4 status, applied to annual wages
// with nothing subtracted.
// ---------------------------------------------------------------------------

const ND_SCHEDULES: Record<FilingStatus, ScheduleRow[]> = {
  single: table([
    [0, 0, 0],
    [57625, 0, 0.0195],
    [258450, 3916.09, 0.025],
  ]),
  married: table([
    [0, 0, 0],
    [57500, 0, 0.0195],
    [168525, 2164.99, 0.025],
  ]),
  hoh: table([
    [0, 0, 0],
    [78475, 0, 0.0195],
    [289675, 4118.4, 0.025],
  ]),
};

function northDakotaIncomeTax(annualWages: number, status: FilingStatus): number {
  return taxFromSchedule(annualWages, ND_SCHEDULES[status]);
}

// ---------------------------------------------------------------------------
// Oklahoma — Packet OW-2, 2026 Oklahoma Income Tax Withholding Tables, revised
// 11-2025, effective January 1, 2026. Wages less $1,000 per OK-W-4 allowance,
// then Table 7 (annual). The OK-W-4 has no head of household box; such a filer
// is single for withholding.
// ---------------------------------------------------------------------------

const OK_ALLOWANCE = 1000;
const OK_SCHEDULES: Record<'single' | 'married', ScheduleRow[]> = {
  single: table([
    [0, 0, 0],
    [10100, 0, 0.025],
    [11250, 28.75, 0.035],
    [13550, 109.25, 0.045],
  ]),
  married: table([
    [0, 0, 0],
    [20200, 0, 0.025],
    [22500, 57.5, 0.035],
    [27100, 218.5, 0.045],
  ]),
};

function oklahomaIncomeTax(annualWages: number, status: FilingStatus, allowances: number): number {
  const net = Math.max(0, annualWages - allowances * OK_ALLOWANCE);
  return taxFromSchedule(net, OK_SCHEDULES[status === 'married' ? 'married' : 'single']);
}

// ---------------------------------------------------------------------------
// Vermont — GB-1210-2026, 2026 Income Tax Withholding Instructions, Tables, and
// Charts, effective January 1 to December 31, 2026. Wages less $5,400 per Form
// W-4VT allowance, then the annual table. There are only single and married
// tables; a head of household is single with one more allowance.
// The Child Care Contribution is an employer tax; an employer may choose to pass
// up to a quarter of it (0.11% of wages) to employees, so it is not shown.
// ---------------------------------------------------------------------------

const VT_ALLOWANCE = 5400;
const VT_SCHEDULES: Record<'single' | 'married', ScheduleRow[]> = {
  single: table([
    [0, 0, 0],
    [3925, 0, 0.0335],
    [54675, 1700.13, 0.066],
    [126775, 6458.73, 0.076],
    [260225, 16600.93, 0.0875],
  ]),
  married: table([
    [0, 0, 0],
    [11775, 0, 0.0335],
    [96475, 2837.45, 0.066],
    [216525, 10760.75, 0.076],
    [323825, 18915.55, 0.0875],
  ]),
};

function vermontIncomeTax(annualWages: number, status: FilingStatus, allowances: number): number {
  return taxFromSchedule(annualWages - allowances * VT_ALLOWANCE, VT_SCHEDULES[status === 'married' ? 'married' : 'single']);
}

// ---------------------------------------------------------------------------
// West Virginia — Form WV IT-100.2A, Tables for Percentage Method of
// Withholding, March 2026 (the tables reissued after S.B. 392 cut rates 5%
// retroactive to January 1, 2026). Wages less $2,000 per IT-104 exemption, then
// Table 5 (annual). The Two Earner/Two or More Jobs table is the one employers
// use for everyone; the lower One Earner/One Job table applies only when the
// employee checks line 5 of Form IT-104, so the default table is used here.
// ---------------------------------------------------------------------------

const WV_EXEMPTION = 2000;
const WV_TWO_EARNER = table([
  [0, 0, 0.0211],
  [7500, 158.25, 0.0281],
  [18750, 474.38, 0.0316],
  [30000, 829.88, 0.0422],
  [45000, 1462.88, 0.0458],
]);
/** The optional table for an employee who checks IT-104 line 5; kept for the tests and for a future option */
const WV_ONE_EARNER = table([
  [0, 0, 0.0211],
  [10000, 211, 0.0281],
  [25000, 632.5, 0.0316],
  [40000, 1106.5, 0.0422],
  [60000, 1950.5, 0.0458],
]);

function westVirginiaIncomeTax(annualWages: number, exemptions: number, oneEarnerOption = false): number {
  const taxable = Math.max(0, annualWages - exemptions * WV_EXEMPTION);
  return taxFromSchedule(taxable, oneEarnerOption ? WV_ONE_EARNER : WV_TWO_EARNER);
}

// ---------------------------------------------------------------------------
// Sources, one per modeled jurisdiction (linked from the state tax article)
// ---------------------------------------------------------------------------

export const MORE_STATE_SOURCES: Partial<Record<WithholdingOnlyState, MoreStateSource>> = {
  AL: {
    label: 'Alabama Withholding Tax Tables and Instructions for Employers and Withholding Agents (revised January 2026)',
    url: 'https://www.revenue.alabama.gov/wp-content/uploads/2026/01/whbooklet_0126.pdf',
    publisher: 'Alabama Department of Revenue',
    note: 'Formula for computing Alabama withholding tax: standard deduction schedule, exemptions and rates',
  },
  AR: {
    label: 'Arkansas Withholding Tax Formula Method, Tax Year 2026',
    url: 'https://www.dfa.arkansas.gov/wp-content/uploads/Withholding-Tax-Formula.pdf',
    publisher: 'Arkansas Department of Finance and Administration',
    note: 'Standard deduction, bracket table with the 3.7% top rate, and the $29 exemption credit',
  },
  CT: {
    label: 'Connecticut TPG-211, 2026 Withholding Calculation Rules (Rev. 12/25)',
    url: 'https://portal.ct.gov/drs/drs-forms/current-year-forms/withholding-forms',
    publisher: 'Connecticut Department of Revenue Services',
    note: 'Calculation steps and Tables A to E by withholding code',
  },
  DE: {
    label: "Delaware Employer's Guide (Withholding Regulations & Employer's Duties), tax computation table effective January 1, 2025",
    url: 'https://revenue.delaware.gov/employers-guide-withholding-regulations-employers-duties/',
    publisher: 'Delaware Division of Revenue',
    note: 'Annualized withholding method: standard deduction, tax table and the $110 exemption credit',
  },
  HI: {
    label: "Hawaii Booklet A, Employer's Tax Guide (Rev. 2025), tables for withholding January 1, 2026 and thereafter",
    url: 'https://files.hawaii.gov/tax/news/pubs/25BkltA.pdf',
    publisher: 'Hawaii Department of Taxation',
    note: 'Annualized withholding: allowance amounts and the annual rate schedules',
  },
  KS: {
    label: 'Kansas KW-100, Kansas Withholding Tax Guide (Rev. 10-24)',
    url: 'https://www.ksrevenue.gov/pdf/kw100.pdf',
    publisher: 'Kansas Department of Revenue',
    note: 'Percentage formula, personal exemption amounts and the annual table',
  },
  ME: {
    label: 'Maine 2026 Withholding Tables for Individual Income Tax (revised August 2026)',
    url: 'https://www.maine.gov/revenue/tax-return-forms/employment-tax-returns-2026',
    publisher: 'Maine Revenue Services',
    note: 'Percentage method: allowance, standard deduction for withholding, rate schedules and the surcharge',
  },
  MS: {
    label: 'Mississippi Pub. 89-700, Withholding Income Tax Tables and Employer Instructions (effective January 1, 2026)',
    url: 'https://www.dor.ms.gov/business/withholding-tax',
    publisher: 'Mississippi Department of Revenue',
    note: 'Exemptions, standard deductions and the 4.0% rate over $10,000',
  },
  MT: {
    label: 'Montana Employer and Information Agent Guide with Montana Withholding Tax Tables (for use beginning January 1, 2026)',
    url: 'https://revenue.mt.gov/publications/montana-employer-and-information-agent-guide',
    publisher: 'Montana Department of Revenue',
    note: 'Annual withholding formula and tables by Form MW-4 status',
  },
  NE: {
    label: '2026 Nebraska Circular EN, Income Tax Withholding on Wages (wages paid on or after January 1, 2026)',
    url: 'https://revenue.nebraska.gov/businesses/nebraska-income-tax-withholding',
    publisher: 'Nebraska Department of Revenue',
    note: 'Allowance amount, annual percentage table and the 1.5% special withholding rule',
  },
  NM: {
    label: 'New Mexico FYI-104, New Mexico Withholding Tax (effective January 1, 2026)',
    url: 'https://realfile.tax.newmexico.gov/FYI-104.pdf',
    publisher: 'New Mexico Taxation and Revenue Department',
    note: 'Annual withholding tables by federal W-4 filing status',
  },
  ND: {
    label: 'North Dakota Income Tax Withholding Rates & Instructions, for wages paid in 2026',
    url: 'https://www.tax.nd.gov/income-tax-withholding',
    publisher: 'North Dakota Office of State Tax Commissioner',
    note: 'Annual percentage method tables for Forms W-4 from 2020 or later',
  },
  OK: {
    label: 'Oklahoma Packet OW-2, 2026 Oklahoma Income Tax Withholding Tables',
    url: 'https://oklahoma.gov/content/dam/ok/en/tax/documents/resources/publications/businesses/withholding-tables/WHTables-2026.pdf',
    publisher: 'Oklahoma Tax Commission',
    note: 'Percentage formula, allowance amount and the annual rate tables',
  },
  VT: {
    label: 'Vermont GB-1210-2026, 2026 Income Tax Withholding Instructions, Tables, and Charts',
    url: 'https://tax.vermont.gov/sites/tax/files/documents/GB-1210-2026.pdf',
    publisher: 'Vermont Department of Taxes',
    note: 'Allowance amount and the annual single and married tables',
  },
  WV: {
    label: 'West Virginia Form IT-100.2A, Tables for Percentage Method of Withholding (March 2026)',
    url: 'https://tax.wv.gov/Documents/Withholding/it100.2a.pdf',
    publisher: 'West Virginia Tax Division',
    note: 'Exemption amount and the annual two-earner table used by default',
  },
};

// ---------------------------------------------------------------------------
// The rules
// ---------------------------------------------------------------------------

export function buildMoreStateRules2026(federal: FederalTables): Partial<Record<WithholdingOnlyState, StateRule>> {
  return {
    AL: (c) => [
      {
        key: 'state',
        label: 'Alabama income tax',
        // the formula deducts the federal income tax withheld from the same wages
        annual: alabamaIncomeTax(c.taxableWages, c.filingStatus, federalIncomeTax(federal, c.taxableWages, c.filingStatus)),
      },
    ],
    AR: (c) => [{ key: 'state', label: 'Arkansas income tax', annual: arkansasIncomeTax(c.taxableWages, c.allowances) }],
    CT: (c) => [
      { key: 'state', label: 'Connecticut income tax', annual: connecticutIncomeTax(c.taxableWages, c.filingStatus) },
      { key: 'pfl', label: 'CT Paid Leave (0.5%)', annual: Math.min(c.ficaWages, federal.socialSecurityWageBase) * CT_PAID_LEAVE_RATE },
    ],
    DE: (c) => [
      { key: 'state', label: 'Delaware income tax', annual: delawareIncomeTax(c.taxableWages, c.filingStatus, c.allowances) },
      { key: 'pfl', label: 'DE Paid Leave (up to 0.4%)', annual: Math.min(c.ficaWages, federal.socialSecurityWageBase) * DE_PAID_LEAVE_EMPLOYEE_MAX_RATE },
    ],
    HI: (c) => [
      { key: 'state', label: 'Hawaii income tax', annual: hawaiiIncomeTax(c.taxableWages, c.filingStatus, c.allowances) },
      { key: 'sdi', label: 'HI Temporary Disability Insurance (up to 0.5%, $7.50 a week at most)', annual: Math.min(c.ficaWages * HI_TDI_MAX_RATE, HI_TDI_MAX_PER_WEEK * 52) },
    ],
    KS: (c) => [{ key: 'state', label: 'Kansas income tax', annual: kansasIncomeTax(c.taxableWages, c.filingStatus, c.allowances) }],
    ME: (c) => [
      { key: 'state', label: 'Maine income tax', annual: maineIncomeTax(c.taxableWages, c.filingStatus, c.allowances) },
      { key: 'pfl', label: 'ME Paid Family & Medical Leave (up to 0.5%)', annual: Math.min(c.ficaWages, federal.socialSecurityWageBase) * ME_PFML_EMPLOYEE_MAX_RATE },
    ],
    MS: (c) => [{ key: 'state', label: 'Mississippi income tax (4.0% over $10,000)', annual: mississippiIncomeTax(c.taxableWages, c.filingStatus) }],
    MT: (c) => [{ key: 'state', label: 'Montana income tax', annual: montanaIncomeTax(c.taxableWages, c.filingStatus) }],
    NE: (c) => [{ key: 'state', label: 'Nebraska income tax', annual: nebraskaIncomeTax(c.taxableWages, c.filingStatus, c.allowances) }],
    NM: (c) => [
      { key: 'state', label: 'New Mexico income tax', annual: newMexicoIncomeTax(c.taxableWages, c.filingStatus) },
      ...(c.ficaWages > 0 ? [{ key: 'sdi', label: "NM Workers' Compensation Fee ($2.25 a quarter)", annual: 4 * NM_WORKERS_COMP_FEE_PER_QUARTER }] : []),
    ],
    ND: (c) => [{ key: 'state', label: 'North Dakota income tax', annual: northDakotaIncomeTax(c.taxableWages, c.filingStatus) }],
    OK: (c) => [{ key: 'state', label: 'Oklahoma income tax', annual: oklahomaIncomeTax(c.taxableWages, c.filingStatus, c.allowances) }],
    VT: (c) => [{ key: 'state', label: 'Vermont income tax', annual: vermontIncomeTax(c.taxableWages, c.filingStatus, c.allowances) }],
    WV: (c) => [{ key: 'state', label: 'West Virginia income tax', annual: westVirginiaIncomeTax(c.taxableWages, c.allowances) }],
  };
}

export const __testMoreStates = {
  alabamaIncomeTax,
  alabamaStandardDeduction,
  arkansasIncomeTax,
  connecticutIncomeTax,
  ctAddBack,
  ctCreditDecimal,
  ctExemption,
  ctRecapture,
  delawareIncomeTax,
  hawaiiIncomeTax,
  kansasIncomeTax,
  maineIncomeTax,
  maineStandardDeduction,
  vermontIncomeTax,
  mississippiIncomeTax,
  nebraskaIncomeTax,
  newMexicoIncomeTax,
  northDakotaIncomeTax,
  montanaIncomeTax,
  oklahomaIncomeTax,
  westVirginiaIncomeTax,
};
