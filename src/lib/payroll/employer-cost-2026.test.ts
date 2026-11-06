import { describe, expect, it } from 'vitest';
import {
  calculateEmployerCost,
  EMPLOYER_COST_SOURCES,
  FUTA_CREDIT_REDUCTION,
  FUTA_NET_RATE,
  FUTA_WAGE_BASE,
  STATE_EMPLOYER_TAXES,
  WA_PFML_EMPLOYER_RATE,
} from './employer-cost-2026';
import { calculatePaycheck, SOCIAL_SECURITY_WAGE_BASE, type StateCode } from './withholding-2026';
import { STATE_CODES } from './state-pages';

// ---------------------------------------------------------------------------
// Golden values are computed BY HAND from IRS Topic 759 (FUTA), Pub. 15 (FICA
// match) and the state new-employer rates documented in employer-cost-2026.ts.
// ---------------------------------------------------------------------------

const line = (r: ReturnType<typeof calculateEmployerCost>, key: string) => r.lines.find((l) => l.key === key)?.annual;

const base = (state: StateCode | 'none' | 'other', over: Partial<Parameters<typeof calculateEmployerCost>[0]> = {}) => ({
  state,
  grossAnnual: 52000,
  ficaWagesAnnual: 52000,
  payFrequency: 'bi-weekly' as const,
  hoursPerYear: 2080,
  ...over,
});

describe('federal employer taxes', () => {
  it('FUTA is 0.6% of the first $7,000 and the FICA match mirrors the employee side', () => {
    expect(FUTA_NET_RATE).toBe(0.006);
    expect(FUTA_WAGE_BASE).toBe(7000);
    const r = calculateEmployerCost(base('TX'));
    expect(line(r, 'er-social-security')).toBe(3224); // 52,000 × 6.2%
    expect(line(r, 'er-medicare')).toBe(754); // 52,000 × 1.45%
    expect(line(r, 'futa')).toBe(42); // 7,000 × 0.6%
  });

  it('caps the Social Security match at the 2026 wage base and never adds the 0.9% Medicare surtax', () => {
    const r = calculateEmployerCost(base('TX', { grossAnnual: 300000, ficaWagesAnnual: 300000 }));
    expect(line(r, 'er-social-security')).toBe(Math.round(SOCIAL_SECURITY_WAGE_BASE * 0.062 * 100) / 100);
    expect(line(r, 'er-medicare')).toBe(4350); // 300,000 × 1.45%, no additional Medicare on the employer
  });

  it('applies the potential 2026 credit reduction only in California', () => {
    expect(FUTA_CREDIT_REDUCTION).toEqual({ CA: 0.015 });
    const ca = calculateEmployerCost(base('CA'));
    expect(ca.futaRateApplied).toBeCloseTo(0.021, 10);
    expect(line(ca, 'futa')).toBe(147); // 7,000 × 2.1%
    expect(ca.lines.find((l) => l.key === 'futa')?.label).toContain('1.5% credit reduction');
  });

  it('Section 125 benefits reduce the wage base for every employer tax', () => {
    const full = calculateEmployerCost(base('TX'));
    const less = calculateEmployerCost(base('TX', { ficaWagesAnnual: 47000 }));
    expect(line(less, 'er-social-security')).toBe(2914); // 47,000 × 6.2%
    expect(less.employerTaxesAnnual).toBeLessThan(full.employerTaxesAnnual);
    expect(less.grossAnnual).toBe(52000);
  });
});

describe('state unemployment insurance at the new-employer rate', () => {
  it('Texas: 2.7% on $9,000 → $4,263 of employer taxes on a $52,000 wage, $27.05 an hour all-in', () => {
    const r = calculateEmployerCost(base('TX'));
    expect(line(r, 'sui')).toBe(243);
    expect(r.employerTaxesAnnual).toBe(4263); // 3,224 + 754 + 42 + 243
    expect(r.totalCostAnnual).toBe(56263);
    expect(r.totalCostPerPeriod).toBe(2163.96); // 56,263 ÷ 26
    expect(r.totalCostPerHour).toBe(27.05);
    expect(r.loadRate).toBeCloseTo(4263 / 52000, 10);
  });

  it('California adds the 0.1% ETT on the same $7,000 base', () => {
    const r = calculateEmployerCost(base('CA'));
    expect(line(r, 'sui')).toBe(238); // 7,000 × 3.4%
    expect(line(r, 'ett')).toBe(7);
    expect(r.employerTaxesAnnual).toBe(4370); // 3,224 + 754 + 147 + 238 + 7
  });

  it('New York: 4.1% on the new $17,600 base', () => {
    expect(line(calculateEmployerCost(base('NY')), 'sui')).toBe(721.6);
  });

  it('wage bases cap the SUI line', () => {
    const r = calculateEmployerCost(base('ID', { grossAnnual: 40000, ficaWagesAnnual: 40000 }));
    expect(line(r, 'sui')).toBe(400); // under the $58,300 base, 1% of all wages
    const capped = calculateEmployerCost(base('ID', { grossAnnual: 80000, ficaWagesAnnual: 80000 }));
    expect(line(capped, 'sui')).toBe(583);
  });

  it('industry-rated states apply no SUI until a rate is entered', () => {
    for (const code of ['WA', 'UT', 'LA', 'MN'] as const) {
      expect(STATE_EMPLOYER_TAXES[code].sui.rate, code).toBeNull();
      const r = calculateEmployerCost(base(code));
      expect(r.suiRateApplied, code).toBeNull();
      expect(line(r, 'sui'), code).toBeUndefined();
    }
    const wa = calculateEmployerCost(base('WA', { suiRate: 0.012 }));
    expect(line(wa, 'sui')).toBe(624); // 52,000 × 1.2%, well under the $78,200 base
  });

  it('an entered rate overrides the state default', () => {
    const r = calculateEmployerCost(base('TX', { suiRate: 0.0632 }));
    expect(line(r, 'sui')).toBe(568.8); // 9,000 × 6.32% (Texas maximum)
    expect(r.suiRateApplied).toBe(0.0632);
  });

  it("'none' and 'other' have no SUI line unless a rate is entered, then use the $7,000 floor", () => {
    expect(calculateEmployerCost(base('none')).lines.map((l) => l.key)).toEqual(['er-social-security', 'er-medicare', 'futa']);
    const r = calculateEmployerCost(base('other', { suiRate: 0.027 }));
    expect(line(r, 'sui')).toBe(189);
    expect(r.suiWageBase).toBe(7000);
  });
});

describe('employer share of state paid-leave programs', () => {
  it('Washington PFML employer share is 28.57% of the 1.13% premium (0.3228%) up to the SS cap', () => {
    expect(WA_PFML_EMPLOYER_RATE).toBeCloseTo(0.003228, 6);
    const r = calculateEmployerCost(base('WA'));
    expect(line(r, 'pfml')).toBe(167.86); // 52,000 × 0.3228%
  });

  it('Colorado FAMLI, Massachusetts PFML, Paid Leave Oregon, Minnesota Paid Leave and NJ TDI are present at the documented rates', () => {
    expect(line(calculateEmployerCost(base('CO')), 'famli')).toBe(228.8); // 0.44%
    expect(line(calculateEmployerCost(base('MA')), 'pfml')).toBe(218.4); // 0.42%
    expect(line(calculateEmployerCost(base('OR')), 'pfl')).toBe(208); // 0.40%
    expect(line(calculateEmployerCost(base('MN')), 'pfml')).toBe(228.8); // 0.44%
    expect(line(calculateEmployerCost(base('NJ')), 'tdi')).toBe(224); // 44,800 × 0.5%
    expect(line(calculateEmployerCost(base('NV')), 'cep')).toBe(21.85); // 43,700 × 0.05%
  });

  it('states without an employer-paid program have only FICA, FUTA and SUI', () => {
    for (const code of ['TX', 'FL', 'PA', 'GA', 'OH'] as const) {
      expect(calculateEmployerCost(base(code)).lines.map((l) => l.key), code).toEqual(['er-social-security', 'er-medicare', 'futa', 'sui']);
    }
  });
});

describe('STATE_EMPLOYER_TAXES table invariants', () => {
  it('covers every engine state with a wage base at or above the federal $7,000 floor and a documented note', () => {
    for (const code of STATE_CODES) {
      const p = STATE_EMPLOYER_TAXES[code];
      expect(p.sui.wageBase, code).toBeGreaterThanOrEqual(7000);
      expect(p.sui.note, code).toContain(p.sui.wageBase.toLocaleString('en-US'));
      if (p.sui.rate !== null) {
        expect(p.sui.rate, code).toBeGreaterThan(0);
        expect(p.sui.rate, code).toBeLessThan(0.11);
        expect(p.sui.note, code).toContain(p.sui.rateText.replace(/0+%$/, '').replace(/\.$/, ''));
      }
      expect(p.source.url, code).toMatch(/^https:\/\//);
      for (const e of p.extras) {
        expect(e.rate, `${code} ${e.key}`).toBeGreaterThan(0);
        expect(e.rate, `${code} ${e.key}`).toBeLessThan(0.02);
      }
    }
  });

  it('every employer-cost source is an https link with a label', () => {
    for (const s of EMPLOYER_COST_SOURCES) {
      expect(s.url).toMatch(/^https:\/\//);
      expect(s.label.length).toBeGreaterThan(10);
    }
  });
});

describe('agreement with calculatePaycheck', () => {
  it('the employer FICA match equals the employee FICA lines for the same wages', () => {
    for (const code of STATE_CODES) {
      const pc = calculatePaycheck({
        state: code,
        hourlyRate: 31.25,
        regularHoursPerWeek: 40,
        overtimeHoursPerWeek: 4,
        overtimeMultiplier: 1.5,
        payFrequency: 'weekly',
        filingStatus: 'single',
        stateAllowances: 0,
        preTaxBenefitsAnnual: 3000,
      });
      const er = calculateEmployerCost({
        state: code,
        grossAnnual: pc.grossAnnual,
        ficaWagesAnnual: pc.ficaWagesAnnual,
        payFrequency: 'weekly',
        hoursPerYear: 44 * 52,
      });
      expect(pc.ficaWagesAnnual).toBe(pc.grossAnnual - 3000);
      expect(line(er, 'er-social-security'), code).toBe(pc.deductions.find((d) => d.key === 'social-security')?.annual);
      expect(line(er, 'er-medicare'), code).toBe(pc.deductions.find((d) => d.key === 'medicare')?.annual);
      expect(er.totalCostAnnual, code).toBeGreaterThan(pc.grossAnnual);
    }
  });
});
