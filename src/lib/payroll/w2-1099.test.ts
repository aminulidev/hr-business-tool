import { describe, expect, it } from 'vitest';
import { compute1099 } from './form-1099';
import { stateTaxOnWages } from './state-tax';
import { computeW2 } from './w2';

// Hand-computed from the 2026 figures (Rev. Proc. 2025-32 brackets, $184,500
// Social Security wage base). The W-2 and 1099 calculators and the worked
// examples in their articles all run these two functions.

describe('computeW2', () => {
  it('married, Texas, $120,000 with a 401(k) and Section 125 premiums', () => {
    const r = computeW2({ grossAnnual: 120000, filingStatus: 'mfj', state: 'TX', pretax401k: 8000, pretaxOther: 3600 });
    expect(r.ficaWages).toBe(116400);
    expect(r.ssTax).toBeCloseTo(7216.8, 2);
    expect(r.medicareTax).toBeCloseTo(1687.8, 2);
    expect(r.afterPretax).toBe(108400);
    expect(r.taxableIncome).toBe(76200); // 108,400 − 32,200
    expect(r.federalTax).toBeCloseTo(8648, 2); // 2,480 + (76,200 − 24,800) × 12%
    expect(r.stateTax).toBe(0);
    expect(r.totalTax).toBeCloseTo(17552.6, 2);
    expect(r.netAnnual).toBeCloseTo(90847.4, 2);
    expect(r.marginalRate).toBe(0.12);
  });

  it('single, New York, $240,000: Social Security cap and Additional Medicare', () => {
    const r = computeW2({ grossAnnual: 240000, filingStatus: 'single', state: 'NY', pretax401k: 24500, pretaxHsa: 4400, pretaxOther: 3000 });
    expect(r.ficaWages).toBe(232600);
    expect(r.ssTax).toBeCloseTo(11439, 2); // 184,500 × 6.2%
    expect(r.medicareTax).toBeCloseTo(3372.7, 2);
    expect(r.addMedicare).toBeCloseTo(293.4, 2); // (232,600 − 200,000) × 0.9%
    expect(r.taxableIncome).toBe(192000);
    expect(r.federalTax).toBeCloseTo(38678, 2);
    expect(r.marginalRate).toBe(0.24);
    // the state part is the New York rule on the same wages
    expect(r.stateTax).toBe(stateTaxOnWages({ state: 'NY', taxableWages: 208100, ficaWages: 232600, filingStatus: 'single' }).total);
    expect(r.stateLines.map((l) => l.key)).toEqual(['state', 'pfl', 'sdi']);
  });

  it('single, Pennsylvania, $72,000 with no deductions', () => {
    const r = computeW2({ grossAnnual: 72000, filingStatus: 'single', state: 'PA' });
    expect(r.federalTax).toBeCloseTo(7010, 2); // 5,800 + (55,900 − 50,400) × 22%
    expect(r.totalFica).toBeCloseTo(5508, 2); // 4,464 + 1,044
    expect(r.stateTax).toBeCloseTo(2260.8, 2); // 3.07% income tax + 0.07% unemployment
    expect(r.netAnnual).toBeCloseTo(57221.2, 2);
    expect(r.effectiveRate).toBeCloseTo(14778.8 / 72000, 6);
  });

  it('California includes SDI on FICA wages', () => {
    const r = computeW2({ grossAnnual: 95000, filingStatus: 'single', state: 'CA', pretax401k: 6500, pretaxHsa: 2000, pretaxOther: 1800 });
    expect(r.taxableIncome).toBe(68600);
    expect(r.federalTax).toBeCloseTo(9804, 2);
    expect(r.stateLines.find((l) => l.key === 'sdi')!.annual).toBe(1185.6); // 91,200 × 1.3%
    expect(r.stateTax).toBe(stateTaxOnWages({ state: 'CA', taxableWages: 84700, ficaWages: 91200, filingStatus: 'single' }).total);
  });

  it('another state uses the entered rate on wages after pre-tax deductions', () => {
    expect(computeW2({ grossAnnual: 60000, filingStatus: 'single', state: 'other', customStateRatePct: 5 }).stateTax).toBe(3000);
    expect(computeW2({ grossAnnual: 60000, filingStatus: 'single', state: 'other', customStateRatePct: 5, pretax401k: 10000 }).stateTax).toBe(2500);
    expect(computeW2({ grossAnnual: 60000, filingStatus: 'single', state: 'other' }).stateTax).toBe(0);
  });

  it('married filing separately: separate federal brackets, single state schedule', () => {
    const mfs = computeW2({ grossAnnual: 500000, filingStatus: 'mfs', state: 'IL' });
    const single = computeW2({ grossAnnual: 500000, filingStatus: 'single', state: 'IL' });
    expect(mfs.federalTax).toBeGreaterThan(single.federalTax); // 37% starts at $384,350 instead of $640,600
    expect(mfs.stateTax).toBe(single.stateTax);
  });

  it('zero and negative inputs do not produce negative tax', () => {
    const r = computeW2({ grossAnnual: 0, filingStatus: 'single', state: 'CA', pretax401k: 5000 });
    expect(r.totalTax).toBe(0);
    expect(r.effectiveRate).toBe(0);
  });
});

describe('compute1099', () => {
  it('single, Texas, $110,000 with $15,000 of expenses', () => {
    const r = compute1099({ grossIncome: 110000, businessExpenses: 15000, filingStatus: 'single', state: 'TX' });
    expect(r.netSE).toBe(95000);
    expect(r.secaTaxable).toBeCloseTo(87732.5, 2);
    expect(r.ssPortion).toBeCloseTo(10878.83, 2);
    expect(r.medicarePortion).toBeCloseTo(2544.24, 2);
    expect(r.secaTax).toBeCloseTo(13423.07, 2);
    expect(r.secaDeduction).toBeCloseTo(6711.54, 2);
    expect(r.qbiDeduction).toBe(19000);
    expect(r.taxableIncome).toBeCloseTo(53188.46, 2);
    expect(r.federalTax).toBeCloseTo(6413.46, 2); // 5,800 + (53,188.46 − 50,400) × 22%
    expect(r.stateTax).toBe(0);
    expect(r.totalTax).toBeCloseTo(19836.53, 2);
    expect(r.afterTax).toBeCloseTo(75163.47, 2);
    expect(r.quarterly).toBeCloseTo(4959.13, 2);
  });

  it('caps the Social Security part at the wage base', () => {
    const r = compute1099({ grossIncome: 350000, businessExpenses: 30000, filingStatus: 'single', state: 'FL' });
    expect(r.secaTaxable).toBeCloseTo(295520, 2);
    expect(r.ssPortion).toBeCloseTo(22878, 2); // 184,500 × 12.4%
    expect(r.medicarePortion).toBeCloseTo(8570.08, 2);
    expect(r.secaTax).toBeCloseTo(31448.08, 2);
  });

  it('state income tax applies to net profit after the SE tax deduction', () => {
    const other = compute1099({ grossIncome: 65000, businessExpenses: 5000, filingStatus: 'single', state: 'other', customStateRatePct: 5 });
    expect(other.secaTax).toBeCloseTo(8477.73, 2);
    expect(other.stateTax).toBeCloseTo(0.05 * (60000 - 8477.73 / 2), 1); // 2,788.06

    const ky = compute1099({ grossIncome: 65000, businessExpenses: 5000, filingStatus: 'single', state: 'KY' });
    expect(ky.stateTax).toBeCloseTo((60000 - 8477.73 / 2 - 3270) * 0.035, 1); // 1,837.19
  });

  it('leaves employee payroll programs out: California has income tax but no SDI', () => {
    const r = compute1099({ grossIncome: 100000, filingStatus: 'single', state: 'CA' });
    const state = stateTaxOnWages({ state: 'CA', taxableWages: 100000 - r.secaDeduction, filingStatus: 'single' });
    expect(r.stateTax).toBe(state.incomeTax);
    expect(state.payrollTotal).toBeGreaterThan(0);
  });

  it('Maryland includes the county income tax', () => {
    const r = compute1099({ grossIncome: 100000, filingStatus: 'single', state: 'MD' });
    const state = stateTaxOnWages({ state: 'MD', taxableWages: 100000 - r.secaDeduction, filingStatus: 'single' });
    expect(state.localTax).toBeGreaterThan(0);
    expect(r.stateTax).toBeCloseTo(state.incomeTax + state.localTax, 2);
  });

  it('expenses above income leave nothing to tax', () => {
    const r = compute1099({ grossIncome: 20000, businessExpenses: 50000, filingStatus: 'single', state: 'CA' });
    expect(r.netSE).toBe(0);
    expect(r.totalTax).toBe(0);
    expect(r.effectiveRate).toBe(0);
  });
});
