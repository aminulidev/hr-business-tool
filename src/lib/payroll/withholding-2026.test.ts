import { describe, expect, it } from 'vitest';
import {
  __test,
  calculatePaycheck,
  FEDERAL_STANDARD_DEDUCTION,
  PERIODS_PER_YEAR,
  SOCIAL_SECURITY_WAGE_BASE,
  TAX_YEAR,
  W4_CHILD_CREDIT,
  W4_OTHER_DEPENDENT_CREDIT,
  type FilingStatus,
  type PaycheckInput,
  type StateCode,
} from './withholding-2026';
import { STATE_CODES } from './state-pages';

// ---------------------------------------------------------------------------
// Golden values below are computed BY HAND from the published 2026 tables
// (IRS Rev. Proc. 2025-32 brackets, SSA 2026 wage base, state publications
// cited at the top of withholding-2026.ts). They deliberately do not reuse the
// engine's schedule helpers, so a wrong constant or a broken bracket walk
// fails here instead of on the live site.
// ---------------------------------------------------------------------------

const base = (over: Partial<PaycheckInput> = {}): PaycheckInput => ({
  state: 'TX',
  hourlyRate: 25,
  regularHoursPerWeek: 40,
  overtimeHoursPerWeek: 0,
  overtimeMultiplier: 1.5,
  payFrequency: 'bi-weekly',
  filingStatus: 'single',
  stateAllowances: 0,
  ...over,
});

const line = (r: ReturnType<typeof calculatePaycheck>, key: string) =>
  r.deductions.find((d) => d.key === key);

describe(`federal income tax (${TAX_YEAR} percentage method, standard W-4)`, () => {
  it('uses the 2026 standard deductions', () => {
    expect(FEDERAL_STANDARD_DEDUCTION).toEqual({ single: 16100, married: 32200, hoh: 24150 });
  });

  it.each<[number, FilingStatus, number]>([
    // $52,000 single: taxable 35,900 → 1,240 + (35,900 − 12,400) × 12% = 4,060
    [52000, 'single', 4060],
    // $31,200 single ($15/hr): taxable 15,100 → 1,240 + 2,700 × 12% = 1,564
    [31200, 'single', 1564],
    // $120,000 single: taxable 103,900 → 5,800 + (103,900 − 50,400) × 22% = 17,570
    [120000, 'single', 17570],
    // $100,000 married: taxable 67,800 → 2,480 + (67,800 − 24,800) × 12% = 7,640
    [100000, 'married', 7640],
    // $60,000 head of household: taxable 35,850 → 1,770 + (35,850 − 17,700) × 12% = 3,948
    [60000, 'hoh', 3948],
  ])('withholds the hand-computed amount for $%i (%s)', (wages, status, expected) => {
    expect(__test.federalIncomeTax(wages, status)).toBeCloseTo(expected, 2);
  });

  it('withholds nothing at or below the standard deduction', () => {
    expect(__test.federalIncomeTax(16100, 'single')).toBe(0);
    expect(__test.federalIncomeTax(15000, 'single')).toBe(0);
    expect(__test.federalIncomeTax(0, 'married')).toBe(0);
  });

  it('is monotonic in wages for every filing status', () => {
    for (const status of ['single', 'married', 'hoh'] as FilingStatus[]) {
      let prev = -1;
      for (let w = 0; w <= 800000; w += 2500) {
        const t = __test.federalIncomeTax(w, status);
        expect(t).toBeGreaterThanOrEqual(prev);
        prev = t;
      }
    }
  });
});

describe(`W-4 Steps 2–4 (${TAX_YEAR} Pub. 15-T Worksheet 1A)`, () => {
  it('Step 2 checkbox uses the half-width schedule: $52,000 single → $7,025 (table: 2,900 + 22% over 33,250)', () => {
    expect(__test.federalIncomeTax(52000, 'single', { multipleJobs: true })).toBeCloseTo(7025, 2);
    // $100,000 married, box checked → 5,800 + (100,000 − 66,500) × 22% = 13,170
    expect(__test.federalIncomeTax(100000, 'married', { multipleJobs: true })).toBeCloseTo(13170, 2);
    // the checkbox 0% band is half the standard deduction: $8,050 single, $16,100 married
    expect(__test.federalIncomeTax(8050, 'single', { multipleJobs: true })).toBe(0);
    expect(__test.federalIncomeTax(8060, 'single', { multipleJobs: true })).toBeCloseTo(1, 2);
    expect(__test.federalIncomeTax(16100, 'married', { multipleJobs: true })).toBe(0);
  });

  it('Step 3 credits reduce annual withholding but never below zero', () => {
    expect(W4_CHILD_CREDIT).toBe(2200);
    expect(W4_OTHER_DEPENDENT_CREDIT).toBe(500);
    expect(__test.federalIncomeTax(52000, 'single', { dependentsCredit: 2200 })).toBeCloseTo(1860, 2); // 4,060 − 2,200
    expect(__test.federalIncomeTax(52000, 'single', { dependentsCredit: 4400 })).toBe(0);
  });

  it('Step 4(a) other income and 4(b) deductions move the taxable amount', () => {
    // 52,000 + 10,000 − 16,100 = 45,900 → 1,240 + 33,500 × 12% = 5,260
    expect(__test.federalIncomeTax(52000, 'single', { otherIncome: 10000 })).toBeCloseTo(5260, 2);
    // 52,000 − 5,000 − 16,100 = 30,900 → 1,240 + 18,500 × 12% = 3,460
    expect(__test.federalIncomeTax(52000, 'single', { deductions: 5000 })).toBeCloseTo(3460, 2);
  });

  it('Step 4(c) adds the flat amount every paycheck and flows through calculatePaycheck', () => {
    expect(__test.federalIncomeTax(52000, 'single', { extraWithholdingPerPeriod: 50 }, 26)).toBeCloseTo(4060 + 1300, 2);
    const plain = calculatePaycheck(base());
    const withW4 = calculatePaycheck(base({ w4: { multipleJobs: true, dependentsCredit: 2200, extraWithholdingPerPeriod: 50 } }));
    expect(line(plain, 'federal')?.annual).toBe(4060);
    expect(line(withW4, 'federal')?.annual).toBe(7025 - 2200 + 1300);
    expect(line(withW4, 'federal')?.label).toContain('W-4 Steps 2–4');
    expect(line(withW4, 'social-security')?.annual).toBe(line(plain, 'social-security')?.annual);
  });
});

describe('FICA', () => {
  it('caps Social Security at the 2026 wage base and adds 0.9% Medicare above $200k', () => {
    // $100/hr × 40 × 52 = $208,000
    const r = calculatePaycheck(base({ hourlyRate: 100 }));
    expect(SOCIAL_SECURITY_WAGE_BASE).toBe(184500);
    expect(line(r, 'social-security')!.annual).toBeCloseTo(184500 * 0.062, 2); // 11,439.00
    // 208,000 × 1.45% + (208,000 − 200,000) × 0.9% = 3,016 + 72
    expect(line(r, 'medicare')!.annual).toBeCloseTo(3088, 2);
  });

  it('applies the full 6.2% + 1.45% below the caps', () => {
    const r = calculatePaycheck(base());
    expect(line(r, 'social-security')!.annual).toBeCloseTo(3224, 2);
    expect(line(r, 'medicare')!.annual).toBeCloseTo(754, 2);
  });
});

describe('calculatePaycheck — full paycheck, Texas $25/hr bi-weekly single', () => {
  const r = calculatePaycheck(base());

  it('has only federal + FICA lines in a no-income-tax state', () => {
    expect(r.deductions.map((d) => d.key)).toEqual(['federal', 'social-security', 'medicare']);
  });

  it('matches hand-computed gross, deductions and net', () => {
    expect(r.grossAnnual).toBe(52000);
    expect(r.grossPerPeriod).toBe(2000);
    expect(line(r, 'federal')!.annual).toBeCloseTo(4060, 2);
    expect(r.totalDeductionsAnnual).toBeCloseTo(8038, 2);
    expect(r.netAnnual).toBeCloseTo(43962, 2);
    expect(r.netPerPeriod).toBeCloseTo(1690.85, 2);
    expect(r.netPerHour).toBeCloseTo(43962 / 2080, 2);
    expect(r.effectiveRate).toBeCloseTo(8038 / 52000, 6);
  });
});

describe('pre-tax deductions', () => {
  it('401(k) lowers income tax but not FICA', () => {
    const r = calculatePaycheck(base({ preTaxRetirementAnnual: 5200 }));
    // federal on 46,800: taxable 30,700 → 1,240 + 18,300 × 12% = 3,436
    expect(line(r, 'federal')!.annual).toBeCloseTo(3436, 2);
    expect(line(r, 'social-security')!.annual).toBeCloseTo(3224, 2);
    expect(line(r, 'retirement')!.annual).toBe(5200);
  });

  it('Section 125 benefits lower both income tax and FICA', () => {
    const r = calculatePaycheck(base({ preTaxBenefitsAnnual: 2600 }));
    // federal on 49,400: taxable 33,300 → 1,240 + 20,900 × 12% = 3,748
    expect(line(r, 'federal')!.annual).toBeCloseTo(3748, 2);
    expect(line(r, 'social-security')!.annual).toBeCloseTo(49400 * 0.062, 2);
    expect(line(r, 'medicare')!.annual).toBeCloseTo(49400 * 0.0145, 2);
  });

  it('never lets pre-tax amounts exceed gross', () => {
    const r = calculatePaycheck(base({ preTaxRetirementAnnual: 1e9, preTaxBenefitsAnnual: 1e9 }));
    expect(line(r, 'federal')!.annual).toBe(0);
    expect(line(r, 'social-security')!.annual).toBe(0);
    expect(r.netAnnual).toBeGreaterThanOrEqual(0);
  });
});

describe('overtime and pay frequency', () => {
  it('pays overtime at the multiplier on top of regular hours', () => {
    const r = calculatePaycheck(base({ hourlyRate: 32, overtimeHoursPerWeek: 5, payFrequency: 'weekly' }));
    // (32 × 40) + (32 × 1.5 × 5) = 1,280 + 240 = 1,520 / week
    expect(r.grossPerPeriod).toBe(1520);
    expect(r.grossAnnual).toBe(1520 * 52);
  });

  it('annual totals do not depend on pay frequency', () => {
    const annuals = (Object.keys(PERIODS_PER_YEAR) as PaycheckInput['payFrequency'][]).map(
      (payFrequency) => calculatePaycheck(base({ payFrequency })).netAnnual,
    );
    expect(new Set(annuals).size).toBe(1);
  });
});

describe('state engines — hand-computed flat-tax checks on $52,000', () => {
  it('Illinois: 4.95% after $2,925 per allowance', () => {
    expect(__test.illinoisIncomeTax(52000, 1)).toBeCloseTo((52000 - 2925) * 0.0495, 2); // 2,429.21
    expect(__test.illinoisIncomeTax(52000, 0)).toBeCloseTo(2574, 2);
  });
  it('Michigan: 4.25% after $5,800 per exemption', () => {
    expect(__test.michiganIncomeTax(52000, 1)).toBeCloseTo(1963.5, 2);
  });
  it('Indiana: 2.95% after $1,000 per exemption', () => {
    expect(__test.indianaIncomeTax(52000, 1)).toBeCloseTo(1504.5, 2);
  });
  it('Colorado: 4.40% after the federal standard deduction', () => {
    expect(__test.coloradoIncomeTax(52000, 'single', 0)).toBeCloseTo((52000 - 16100) * 0.044, 2); // 1,579.60
  });
  it('Pennsylvania: 3.07% flat + 0.07% UC employee tax', () => {
    const r = calculatePaycheck(base({ state: 'PA' }));
    expect(line(r, 'state')!.annual).toBeCloseTo(1596.4, 2);
    expect(line(r, 'sdi')!.annual).toBeCloseTo(36.4, 2);
  });
  it('Colorado FAMLI is 0.44% of FICA wages (2026 premium 0.88%, half employee)', () => {
    const r = calculatePaycheck(base({ state: 'CO' }));
    expect(line(r, 'pfl')!.annual).toBeCloseTo(228.8, 2);
  });
  // 2026 rate changes verified Nov 6 2026 (state DOR publications / EY payroll alerts)
  it('Kentucky: 3.50% after the $3,270 standard deduction (H.B. 1)', () => {
    const r = calculatePaycheck(base({ state: 'KY' }));
    expect(line(r, 'state')!.annual).toBeCloseTo((52000 - 3270) * 0.035, 2); // 1,705.55
  });
  it('North Carolina: withholds at 4.09% (3.99% tax + 0.10) after the $12,750 single deduction', () => {
    const r = calculatePaycheck(base({ state: 'NC' }));
    expect(line(r, 'state')!.annual).toBeCloseTo((52000 - 12750) * 0.0409, 2); // 1,605.33
  });
  it('Georgia: 4.99% after the $12,000 single deduction (H.B. 463)', () => {
    const r = calculatePaycheck(base({ state: 'GA' }));
    expect(line(r, 'state')!.annual).toBeCloseTo((52000 - 12000) * 0.0499, 2); // 1,996.00
  });
  it('Idaho: 5.30% after the federal standard deduction (H.B. 40)', () => {
    const r = calculatePaycheck(base({ state: 'ID' }));
    expect(line(r, 'state')!.annual).toBeCloseTo((52000 - 16100) * 0.053, 2); // 1,902.70
  });
  it('Ohio: flat 2.75% above $26,050 and nothing more at $120,000 (H.B. 96)', () => {
    const r = calculatePaycheck(base({ state: 'OH' }));
    expect(line(r, 'state')!.annual).toBeCloseTo((52000 - 26050) * 0.0275, 2); // 713.63
    const high = calculatePaycheck(base({ state: 'OH', hourlyRate: 57.6923 })); // ≈ $120,000
    expect(line(high, 'state')!.annual).toBeCloseTo((high.grossAnnual - 26050) * 0.0275, 1);
  });
  it('Utah: 4.45% less the Publication 14 credit (S.B. 60)', () => {
    const r = calculatePaycheck(base({ state: 'UT' }));
    // credit = 446 − (52,000 − 18,278) × 1.3% = 446 − 438.386 = 7.614
    expect(line(r, 'state')!.annual).toBeCloseTo(52000 * 0.0445 - 7.614, 2); // 2,306.39
  });
  it('Washington: PFML employee share is 0.8072% of wages up to the SS cap, WA Cares 0.58%', () => {
    const r = calculatePaycheck(base({ state: 'WA' }));
    expect(line(r, 'pfl')!.annual).toBeCloseTo(52000 * 0.008072, 2); // 419.74
    expect(line(r, 'sdi')!.annual).toBeCloseTo(52000 * 0.0058, 2); // 301.60
  });
  it("'other' state applies the custom flat rate to taxable wages", () => {
    const r = calculatePaycheck(base({ state: 'other', customStateRate: 0.05 }));
    expect(line(r, 'state')!.annual).toBeCloseTo(2600, 2);
  });
  it("'none' and the four no-income-tax states withhold no state tax", () => {
    for (const state of ['none', 'TX', 'FL', 'TN', 'NV'] as PaycheckInput['state'][]) {
      const r = calculatePaycheck(base({ state }));
      expect(r.deductions.map((d) => d.key)).toEqual(['federal', 'social-security', 'medicare']);
    }
  });
});

describe('every state × filing status × frequency — internal consistency', () => {
  const statuses: FilingStatus[] = ['single', 'married', 'hoh'];
  const freqs = Object.keys(PERIODS_PER_YEAR) as PaycheckInput['payFrequency'][];
  const rates = [7.25, 18, 25, 60, 150];

  it.each(STATE_CODES)('%s produces a coherent paycheck for all inputs', (state: StateCode) => {
    for (const filingStatus of statuses) {
      for (const payFrequency of freqs) {
        for (const hourlyRate of rates) {
          const r = calculatePaycheck(base({ state, filingStatus, payFrequency, hourlyRate, stateAllowances: 1 }));
          const periods = PERIODS_PER_YEAR[payFrequency];
          expect(r.periodsPerYear).toBe(periods);
          expect(r.grossAnnual).toBeCloseTo(hourlyRate * 40 * 52, 2);
          const sum = r.deductions.reduce((s, d) => s + d.annual, 0);
          expect(r.totalDeductionsAnnual).toBeCloseTo(sum, 1);
          expect(r.netAnnual).toBeCloseTo(r.grossAnnual - r.totalDeductionsAnnual, 1);
          expect(r.netPerPeriod).toBeCloseTo(r.netAnnual / periods, 1);
          for (const d of r.deductions) {
            expect(d.annual).toBeGreaterThanOrEqual(0);
            expect(d.perPeriod).toBeCloseTo(d.annual / periods, 1);
          }
          expect(r.effectiveRate).toBeGreaterThanOrEqual(0);
          expect(r.effectiveRate).toBeLessThan(0.6);
          // No state should withhold more state tax than federal at these wages
          const st = line(r, 'state');
          if (st) expect(st.annual).toBeLessThanOrEqual(line(r, 'federal')!.annual + r.grossAnnual * 0.05);
        }
      }
    }
  });

  it('allowances never increase state tax', () => {
    for (const state of STATE_CODES) {
      const a0 = line(calculatePaycheck(base({ state, stateAllowances: 0 })), 'state')?.annual ?? 0;
      const a3 = line(calculatePaycheck(base({ state, stateAllowances: 3 })), 'state')?.annual ?? 0;
      expect(a3).toBeLessThanOrEqual(a0 + 0.005);
    }
  });
});
