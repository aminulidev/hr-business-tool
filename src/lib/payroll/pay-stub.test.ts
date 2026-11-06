import { describe, expect, it } from 'vitest';
import { buildPayStubHtml, defaultPeriodNumber, escapeHtml, formatPayDate, payStubLines, type PayStubData } from './pay-stub';
import { calculatePaycheck, TAX_YEAR } from './withholding-2026';
import { calculateEmployerCost } from './employer-cost-2026';

const result = calculatePaycheck({
  state: 'CA',
  hourlyRate: 25,
  regularHoursPerWeek: 40,
  overtimeHoursPerWeek: 5,
  overtimeMultiplier: 1.5,
  payFrequency: 'bi-weekly',
  filingStatus: 'single',
  stateAllowances: 1,
  preTaxRetirementAnnual: 3000,
  otherDeductionsPerPeriod: 20,
});

const data: PayStubData = {
  employeeName: 'Ada <Lovelace>',
  employerName: 'Acme & Co',
  payDate: '2026-11-06',
  periodNumber: 10,
  payFrequency: 'bi-weekly',
  payFrequencyLabel: 'Bi-weekly',
  stateName: 'California',
  taxYear: TAX_YEAR,
  isSalary: false,
  hourlyRate: 25,
  regularHoursPerWeek: 40,
  overtimeHoursPerWeek: 5,
  result,
  employer: calculateEmployerCost({ state: 'CA', grossAnnual: result.grossAnnual, ficaWagesAnnual: result.ficaWagesAnnual, payFrequency: 'bi-weekly', hoursPerYear: 45 * 52 }),
  sourceUrl: 'https://www.quickbizcalc.com/calculators/california-hourly-paycheck-calculator',
};

describe('payStubLines', () => {
  it('earnings add up to gross and YTD is per-period × period number', () => {
    const L = payStubLines(data);
    expect(L.earnings.map((e) => e.label)).toEqual(['Regular', 'Overtime (1.5×)']);
    expect(L.earnings[0].hours).toBeCloseTo(80, 10);
    expect(L.earnings[1].hours).toBeCloseTo(10, 10);
    expect(L.earnings[1].rate).toBe(37.5);
    expect(L.earnings.reduce((s, e) => s + e.current, 0)).toBeCloseTo(result.grossPerPeriod, 2);
    expect(L.gross.ytd).toBeCloseTo(result.grossPerPeriod * 10, 2);
    expect(L.net.ytd).toBeCloseTo(result.netPerPeriod * 10, 2);
  });

  it('splits deductions into pre-tax, taxes and post-tax and balances to net', () => {
    const L = payStubLines(data);
    expect(L.preTax.map((l) => l.label)).toEqual(['401(k) / retirement (pre-tax)']);
    expect(L.postTax).toHaveLength(1);
    expect(L.taxes.map((l) => l.label)).toContain('Federal income tax');
    const all = [...L.preTax, ...L.taxes, ...L.postTax].reduce((s, l) => s + l.current, 0);
    expect(all).toBeCloseTo(L.totalDeductions.current, 1);
    expect(L.gross.current - L.totalDeductions.current).toBeCloseTo(L.net.current, 1);
  });

  it('clamps the period number to the pay frequency', () => {
    expect(payStubLines({ ...data, periodNumber: 99 }).periodNumber).toBe(26);
    expect(payStubLines({ ...data, periodNumber: 0 }).periodNumber).toBe(1);
  });

  it('salary mode prints one salary line and no hours', () => {
    const L = payStubLines({ ...data, isSalary: true, annualSalary: 65000 });
    expect(L.earnings).toHaveLength(1);
    expect(L.earnings[0].label).toBe('Salary');
    expect(L.earnings[0].hours).toBeUndefined();
  });
});

describe('buildPayStubHtml', () => {
  const html = buildPayStubHtml(data);

  it('is a standalone document that escapes names and carries every line', () => {
    expect(html.startsWith('<!DOCTYPE html>')).toBe(true);
    expect(html).toContain('Ada &lt;Lovelace&gt;');
    expect(html).toContain('Acme &amp; Co');
    expect(html).not.toContain('<Lovelace>');
    expect(html).toContain('November 6, 2026');
    expect(html).toContain('Pay period 10 of 26');
    for (const d of result.deductions) expect(html).toContain(escapeHtml(d.label));
    expect(html).toContain('Employer contributions');
    expect(html).toContain('CA Employment Training Tax');
    expect(html).toContain('not an official payroll record');
  });

  it('leaves the employer section out when no employer figures are given', () => {
    const without = buildPayStubHtml({ ...data, employer: null });
    expect(without).not.toContain('Employer contributions');
  });
});

describe('helpers', () => {
  it('defaultPeriodNumber counts paydays so far this year', () => {
    expect(defaultPeriodNumber(new Date(2026, 0, 1), 26)).toBe(1);
    expect(defaultPeriodNumber(new Date(2026, 6, 1), 26)).toBe(13);
    expect(defaultPeriodNumber(new Date(2026, 11, 31), 12)).toBe(12);
  });
  it('formatPayDate reads ISO dates without timezone drift', () => {
    expect(formatPayDate('2026-03-01')).toBe('March 1, 2026');
    expect(formatPayDate('bad')).toBe('bad');
  });
});
