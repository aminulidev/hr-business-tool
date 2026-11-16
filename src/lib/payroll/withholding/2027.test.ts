import { describe, expect, it } from 'vitest';
import { FEDERAL_2027, YEAR_2027 } from './2027';
import { calculatePaycheck, federalIncomeTax, type FilingStatus, type PaycheckInput, type W4Adjustments } from './index';
import { STATE_CODES } from '../state-pages';

// ---------------------------------------------------------------------------
// 2027 federal figures, checked against the two primary publications without
// reusing the engine's own schedule helpers:
//
// 1. IRS Rev. Proc. 2026-35 (Nov 5, 2026), section 3.01 Tables 1–3: the "tax is
//    $X plus N% of the excess over $Y" amounts, typed here from the document.
// 2. The IRS early-release draft of Publication 15-T for use in 2027 (Nov 9,
//    2026): the annual Percentage Method tables from the workbook attached to
//    the draft ("1B % Method Tables - Automated"), typed here row by row, and
//    Worksheet 1A, replayed below as the IRS words it.
//
// When the final Publication 15-T (2027) is out, compare its tables with the
// rows below; if they match, drop the "draft" sentence from YEAR_2027.
// ---------------------------------------------------------------------------

const input = (over: Partial<PaycheckInput> = {}): PaycheckInput => ({
  state: 'TX',
  hourlyRate: 25,
  regularHoursPerWeek: 40,
  overtimeHoursPerWeek: 0,
  overtimeMultiplier: 1.5,
  payFrequency: 'bi-weekly',
  filingStatus: 'single',
  stateAllowances: 0,
  taxYear: 2027,
  ...over,
});

const line = (r: ReturnType<typeof calculatePaycheck>, key: string) => r.deductions.find((d) => d.key === key);

describe('2027 federal tables match Rev. Proc. 2026-35', () => {
  it('standard deductions (section 3.15)', () => {
    expect(FEDERAL_2027.standardDeduction).toEqual({ single: 16600, married: 33200, hoh: 24925 });
  });

  // [taxable income over, tax on that amount, rate on the excess], as printed in Tables 1–3
  const REV_PROC: Record<FilingStatus, [number, number, number][]> = {
    married: [
      [0, 0, 0.1],
      [25600, 2560, 0.12],
      [104050, 11974, 0.22],
      [218250, 37098, 0.24],
      [416650, 84714, 0.32],
      [529100, 120698, 0.35],
      [793650, 213290.5, 0.37],
    ],
    hoh: [
      [0, 0, 0.1],
      [18250, 1825, 0.12],
      [69650, 7993, 0.22],
      [109100, 16672, 0.24],
      [208300, 40480, 0.32],
      [264550, 58480, 0.35],
      [661350, 197360, 0.37],
    ],
    single: [
      [0, 0, 0.1],
      [12800, 1280, 0.12],
      [52025, 5987, 0.22],
      [109125, 18549, 0.24],
      [208325, 42357, 0.32],
      [264550, 60349, 0.35],
      [661375, 199237.75, 0.37],
    ],
  };

  it.each(Object.keys(REV_PROC) as FilingStatus[])('%s rate table: thresholds, cumulative tax and rates', (status) => {
    const rows = FEDERAL_2027.schedules[status];
    expect(rows).toHaveLength(7);
    REV_PROC[status].forEach(([over, base, rate], i) => {
      expect(rows[i].over).toBe(over);
      expect(rows[i].base).toBeCloseTo(base, 2);
      expect(rows[i].rate).toBe(rate);
    });
  });
});

describe('2027 withholding matches the draft Publication 15-T, Worksheet 1A', () => {
  // Annual Percentage Method tables: [A "at least", C "tentative amount", D "plus this percentage"]
  type Table = [number, number, number][];
  const STANDARD: Record<FilingStatus, Table> = {
    married: [[0, 0, 0], [20300, 0, 0.1], [45900, 2560, 0.12], [124350, 11974, 0.22], [238550, 37098, 0.24], [436950, 84714, 0.32], [549400, 120698, 0.35], [813950, 213290.5, 0.37]],
    single: [[0, 0, 0], [8000, 0, 0.1], [20800, 1280, 0.12], [60025, 5987, 0.22], [117125, 18549, 0.24], [216325, 42357, 0.32], [272550, 60349, 0.35], [669375, 199237.75, 0.37]],
    hoh: [[0, 0, 0], [16325, 0, 0.1], [34575, 1825, 0.12], [85975, 7993, 0.22], [125425, 16672, 0.24], [224625, 40480, 0.32], [280875, 58480, 0.35], [677675, 197360, 0.37]],
  };
  const STEP_2_CHECKBOX: Record<FilingStatus, Table> = {
    married: [[0, 0, 0], [16600, 0, 0.1], [29400, 1280, 0.12], [68625, 5987, 0.22], [125725, 18549, 0.24], [224925, 42357, 0.32], [281150, 60349, 0.35], [413425, 106645.25, 0.37]],
    single: [[0, 0, 0], [8300, 0, 0.1], [14700, 640, 0.12], [34312.5, 2993.5, 0.22], [62862.5, 9274.5, 0.24], [112462.5, 21178.5, 0.32], [140575, 30174.5, 0.35], [338987.5, 99618.875, 0.37]],
    hoh: [[0, 0, 0], [12462.5, 0, 0.1], [21587.5, 912.5, 0.12], [47287.5, 3996.5, 0.22], [67012.5, 8336, 0.24], [116612.5, 20240, 0.32], [144737.5, 29240, 0.35], [343137.5, 98680, 0.37]],
  };

  /** Worksheet 1A for a 2020-or-later Form W-4, annual pay period (line numbers from the worksheet) */
  function worksheet1A(wages: number, status: FilingStatus, w4: W4Adjustments = {}, periods = 1): number {
    const line1e = wages + (w4.otherIncome ?? 0);
    const line1g = w4.multipleJobs ? 0 : status === 'married' ? 12900 : 8600;
    const line1i = Math.max(0, line1e - ((w4.deductions ?? 0) + line1g));
    const table = (w4.multipleJobs ? STEP_2_CHECKBOX : STANDARD)[status];
    let row = table[0];
    for (const r of table) if (line1i >= r[0]) row = r;
    const line2g = row[1] + (line1i - row[0]) * row[2];
    const line3c = Math.max(0, line2g - (w4.dependentsCredit ?? 0));
    return line3c + (w4.extraWithholdingPerPeriod ?? 0) * periods;
  }

  const statuses: FilingStatus[] = ['single', 'married', 'hoh'];
  const variants: [string, W4Adjustments, number][] = [
    ['standard W-4', {}, 1],
    ['Step 2 box checked', { multipleJobs: true }, 1],
    ['Step 3 credits for two children', { dependentsCredit: 4600 }, 1],
    ['Steps 4(a), 4(b) and 4(c)', { otherIncome: 10000, deductions: 5000, extraWithholdingPerPeriod: 50 }, 26],
    ['Step 2 box with Step 3 and 4(b)', { multipleJobs: true, dependentsCredit: 2300, deductions: 3000 }, 1],
  ];

  it.each(variants)('%s, every filing status, $0 to $900,000', (_name, w4, periods) => {
    for (const status of statuses) {
      for (let wages = 0; wages <= 900000; wages += 1375) {
        expect(federalIncomeTax(FEDERAL_2027, wages, status, w4, periods), `${status} $${wages}`).toBeCloseTo(worksheet1A(wages, status, w4, periods), 2);
      }
    }
  });

  it('lands exactly on the table edges', () => {
    for (const status of statuses) {
      for (const [atLeast, amount] of STANDARD[status]) {
        const wages = atLeast + (status === 'married' ? 12900 : 8600);
        expect(federalIncomeTax(FEDERAL_2027, wages, status)).toBeCloseTo(amount, 2);
      }
      for (const [atLeast, amount] of STEP_2_CHECKBOX[status]) {
        expect(federalIncomeTax(FEDERAL_2027, atLeast, status, { multipleJobs: true })).toBeCloseTo(amount, 2);
      }
    }
  });
});

describe('2027 paychecks, computed by hand', () => {
  it.each<[number, FilingStatus, number]>([
    // $52,000 single: taxable 35,400 → 1,280 + (35,400 − 12,800) × 12% = 3,992
    [52000, 'single', 3992],
    // $120,000 single: taxable 103,400 → 5,987 + (103,400 − 52,025) × 22% = 17,289.50
    [120000, 'single', 17289.5],
    // $100,000 married: taxable 66,800 → 2,560 + (66,800 − 25,600) × 12% = 7,504
    [100000, 'married', 7504],
    // $60,000 head of household: taxable 35,075 → 1,825 + (35,075 − 18,250) × 12% = 3,844
    [60000, 'hoh', 3844],
  ])('federal withholding on $%i (%s)', (wages, status, expected) => {
    expect(federalIncomeTax(FEDERAL_2027, wages, status)).toBeCloseTo(expected, 2);
  });

  it('Texas $25/hr bi-weekly single: $68 more a year than 2026', () => {
    const r = calculatePaycheck(input());
    expect(r.taxYear).toBe(2027);
    expect(r.deductions.map((d) => d.key)).toEqual(['federal', 'social-security', 'medicare']);
    expect(line(r, 'federal')!.annual).toBe(3992);
    expect(line(r, 'social-security')!.annual).toBe(3224);
    expect(line(r, 'medicare')!.annual).toBe(754);
    expect(r.netAnnual).toBe(44030); // 52,000 − 7,970
    expect(r.netPerPeriod).toBe(1693.46);
    expect(r.netAnnual - calculatePaycheck(input({ taxYear: 2026 })).netAnnual).toBe(68);
  });

  it('Social Security stops at the 2027 wage base of $192,300', () => {
    // $100/hr × 40 × 52 = $208,000
    const r = calculatePaycheck(input({ hourlyRate: 100 }));
    expect(FEDERAL_2027.socialSecurityWageBase).toBe(192300);
    expect(line(r, 'social-security')!.annual).toBe(11922.6); // the maximum SSA quotes for 2027
    expect(line(r, 'medicare')!.annual).toBeCloseTo(3088, 2); // 208,000 × 1.45% + 8,000 × 0.9%
    expect(line(calculatePaycheck(input({ hourlyRate: 100, taxYear: 2026 })), 'social-security')!.annual).toBe(11439);
  });

  it('Form W-4 Step 3 uses the 2027 child tax credit', () => {
    expect(FEDERAL_2027.w4ChildCredit).toBe(2300);
    expect(FEDERAL_2027.w4OtherDependentCredit).toBe(500);
    const r = calculatePaycheck(input({ w4: { dependentsCredit: 2300 } }));
    expect(line(r, 'federal')!.annual).toBe(1692); // 3,992 − 2,300
  });
});

describe('2027 state lines are the 2026 rules until a state publishes', () => {
  const FEDERAL_KEYS = new Set(['federal', 'social-security', 'medicare']);
  const stateSide = (r: ReturnType<typeof calculatePaycheck>) => r.deductions.filter((d) => !FEDERAL_KEYS.has(d.key));

  it('says so in the year definition', () => {
    expect(YEAR_2027.stateRulesFrom).toBe(2026);
    expect(YEAR_2027.federalPending.length).toBeGreaterThan(0);
  });

  it.each(STATE_CODES.filter((code) => !YEAR_2027.statesPublished.includes(code)))('%s: same state lines in both years, different federal tax', (state) => {
    for (const filingStatus of ['single', 'married', 'hoh'] as FilingStatus[]) {
      for (const hourlyRate of [12, 25, 60, 150]) {
        const shared = { state, filingStatus, hourlyRate, stateAllowances: 1, nycResident: state === 'NY' };
        const a = calculatePaycheck(input({ ...shared, taxYear: 2026 }));
        const b = calculatePaycheck(input({ ...shared, taxYear: 2027 }));
        expect(stateSide(b)).toEqual(stateSide(a));
        // wider 2027 brackets and a larger standard deduction can only lower federal withholding
        expect(line(b, 'federal')!.annual).toBeLessThanOrEqual(line(a, 'federal')!.annual);
      }
    }
  });
});
