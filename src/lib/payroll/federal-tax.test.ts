import { describe, expect, it } from 'vitest';
import {
  ADDITIONAL_MEDICARE_RATE,
  ADDITIONAL_MEDICARE_THRESHOLDS,
  ADDITIONAL_MEDICARE_WITHHOLDING_THRESHOLD,
  FEDERAL_BRACKETS,
  FEDERAL_STANDARD_DEDUCTIONS,
  federalBrackets,
  federalIncomeTaxOn,
  federalStandardDeduction,
  MEDICARE_RATE,
  SECA_MEDICARE_RATE,
  SECA_NET_EARNINGS_FACTOR,
  SECA_SOCIAL_SECURITY_RATE,
  SOCIAL_SECURITY_RATE,
  SOCIAL_SECURITY_WAGE_BASE,
  toWithholdingStatus,
  type ReturnFilingStatus,
} from './federal-tax';
import { federalIncomeTax, getTaxYear, TAX_YEAR } from './withholding';

// The standalone tax calculators read their federal figures from federal-tax.ts,
// which derives them from the paycheck engine. These tables are typed from the
// IRS documents, independently of the engine, so a wrong derivation fails here.

const STATUSES: ReturnFilingStatus[] = ['single', 'mfj', 'mfs', 'hoh'];
const RATES = [0.1, 0.12, 0.22, 0.24, 0.32, 0.35, 0.37];
const fromTops = (tops: number[]) => RATES.map((rate, i) => ({ min: i === 0 ? 0 : tops[i - 1], max: tops[i] ?? Infinity, rate }));

describe('2026 return figures (IRS Rev. Proc. 2025-32)', () => {
  it('brackets for all four filing statuses', () => {
    expect(federalBrackets(2026)).toEqual({
      single: fromTops([12400, 50400, 105700, 201775, 256225, 640600]),
      mfj: fromTops([24800, 100800, 211400, 403550, 512450, 768700]),
      mfs: fromTops([12400, 50400, 105700, 201775, 256225, 384350]),
      hoh: fromTops([17700, 67450, 105700, 201775, 256225, 640600]),
    });
  });

  it('standard deductions', () => {
    expect(federalStandardDeduction(2026)).toEqual({ single: 16100, mfj: 32200, mfs: 16100, hoh: 24150 });
  });

  it.each<[number, ReturnFilingStatus, number]>([
    // 35,900 single → 1,240 + (35,900 − 12,400) × 12% = 4,060
    [35900, 'single', 4060],
    // 67,800 jointly → 2,480 + (67,800 − 24,800) × 12% = 7,640
    [67800, 'mfj', 7640],
    // 300,000 separately → 12,400×10% + 38,000×12% + 55,300×22% + 96,075×24% + 54,450×32% + 43,775×35% = 73,769.25
    [300000, 'mfs', 73769.25],
    // 35,850 head of household → 1,770 + (35,850 − 17,700) × 12% = 3,948
    [35850, 'hoh', 3948],
    [0, 'single', 0],
    [-500, 'mfj', 0],
  ])('tax on $%i of taxable income (%s)', (income, status, expected) => {
    expect(federalIncomeTaxOn(income, status, 2026)).toBeCloseTo(expected, 2);
  });
});

describe('2027 return figures (IRS Rev. Proc. 2026-35)', () => {
  it('married filing separately is Table 4 of the revenue procedure', () => {
    expect(federalBrackets(2027).mfs).toEqual(fromTops([12800, 52025, 109125, 208325, 264550, 396825]));
    // "Over $396,825: $106,645.25 plus 37% of the excess"
    expect(federalIncomeTaxOn(396825, 'mfs', 2027)).toBeCloseTo(106645.25, 2);
    expect(federalIncomeTaxOn(264550, 'mfs', 2027)).toBeCloseTo(60349, 2);
  });

  it('standard deductions', () => {
    expect(federalStandardDeduction(2027)).toEqual({ single: 16600, mfj: 33200, mfs: 16600, hoh: 24925 });
  });
});

describe('agreement with the paycheck engine', () => {
  it.each([2026, 2027])('%i: tax on (wages − standard deduction) equals the engine’s withholding on those wages', (year) => {
    const federal = getTaxYear(year).federal;
    const deduction = federalStandardDeduction(year);
    for (const status of ['single', 'mfj', 'hoh'] as const) {
      for (let wages = 0; wages <= 900000; wages += 7300) {
        expect(federalIncomeTaxOn(wages - deduction[status], status, year)).toBeCloseTo(federalIncomeTax(federal, wages, toWithholdingStatus(status)), 2);
      }
    }
  });

  it('brackets are contiguous and end at infinity for every status and year', () => {
    for (const year of [2026, 2027]) {
      for (const status of STATUSES) {
        const b = federalBrackets(year)[status];
        expect(b).toHaveLength(7);
        expect(b[0].min).toBe(0);
        expect(b[6].max).toBe(Infinity);
        for (let i = 1; i < b.length; i++) expect(b[i].min).toBe(b[i - 1].max);
      }
    }
  });

  it('the unqualified constants are the site year’s figures', () => {
    const federal = getTaxYear(TAX_YEAR).federal;
    expect(FEDERAL_BRACKETS).toEqual(federalBrackets(TAX_YEAR));
    expect(FEDERAL_STANDARD_DEDUCTIONS).toEqual(federalStandardDeduction(TAX_YEAR));
    expect(SOCIAL_SECURITY_WAGE_BASE).toBe(federal.socialSecurityWageBase);
    expect(SOCIAL_SECURITY_RATE).toBe(0.062);
    expect(MEDICARE_RATE).toBe(0.0145);
    expect(ADDITIONAL_MEDICARE_RATE).toBe(0.009);
    expect(ADDITIONAL_MEDICARE_WITHHOLDING_THRESHOLD).toBe(200000);
  });
});

describe('statutory figures', () => {
  it('self-employment tax is both halves of FICA on 92.35% of net earnings', () => {
    expect(SECA_SOCIAL_SECURITY_RATE).toBe(0.124);
    expect(SECA_MEDICARE_RATE).toBe(0.029);
    expect(SECA_NET_EARNINGS_FACTOR).toBe(0.9235);
  });

  it('Additional Medicare Tax thresholds by return status', () => {
    expect(ADDITIONAL_MEDICARE_THRESHOLDS).toEqual({ single: 200000, hoh: 200000, mfj: 250000, mfs: 125000 });
  });

  it('separate filers use the single withholding schedule', () => {
    expect(STATUSES.map(toWithholdingStatus)).toEqual(['single', 'married', 'single', 'hoh']);
  });
});
