import { describe, expect, it } from 'vitest';
import { solveHourlyRateForNet, solveSalaryForNet, targetPerPeriod } from './reverse-solver';
import { calculatePaycheck, type PaycheckInput } from './withholding-2026';
import { STATE_CODES } from './state-pages';

const builder =
  (over: Partial<PaycheckInput> = {}) =>
  (hourlyRate: number): PaycheckInput => ({
    state: 'TX',
    hourlyRate,
    regularHoursPerWeek: 40,
    overtimeHoursPerWeek: 0,
    overtimeMultiplier: 1.5,
    payFrequency: 'bi-weekly',
    filingStatus: 'single',
    stateAllowances: 0,
    ...over,
  });

describe('solveHourlyRateForNet', () => {
  it('finds the rate whose take-home meets the target within one cent of hourly rate', () => {
    const r = solveHourlyRateForNet(builder(), 1500)!;
    expect(r.converged).toBe(true);
    expect(r.result.netPerPeriod).toBeGreaterThanOrEqual(1500);
    // one cent less per hour must fall short — the answer is the smallest cent-rounded rate
    const oneCentLess = calculatePaycheck(builder()(r.hourlyRate - 0.01)).netPerPeriod;
    expect(oneCentLess).toBeLessThan(1500);
  });

  it('round-trips the forward calculation', () => {
    const forward = calculatePaycheck(builder({ state: 'CA', stateAllowances: 1 })(31.4));
    const back = solveHourlyRateForNet(builder({ state: 'CA', stateAllowances: 1 }), forward.netPerPeriod)!;
    expect(back.hourlyRate).toBe(31.4);
  });

  it('handles percentage and flat deductions supplied by the builder', () => {
    const build = (rate: number): PaycheckInput => ({
      ...builder()(rate),
      preTaxRetirementAnnual: rate * 40 * 52 * 0.06,
      preTaxBenefitsAnnual: 120 * 26,
      otherDeductionsPerPeriod: 45,
    });
    const r = solveHourlyRateForNet(build, 1200)!;
    expect(r.converged).toBe(true);
    expect(r.result.netPerPeriod).toBeGreaterThanOrEqual(1200);
    expect(r.result.netPerPeriod).toBeLessThan(1200 + 2); // overshoot from cent rounding only
    expect(r.hourlyRate).toBeGreaterThan(solveHourlyRateForNet(builder(), 1200)!.hourlyRate);
  });

  it('is monotonic: a bigger target needs a bigger rate, in every state', () => {
    for (const code of STATE_CODES) {
      const a = solveHourlyRateForNet(builder({ state: code }), 1000)!;
      const b = solveHourlyRateForNet(builder({ state: code }), 2500)!;
      expect(a.converged && b.converged, code).toBe(true);
      expect(b.hourlyRate, code).toBeGreaterThan(a.hourlyRate);
    }
  });

  it('rejects impossible inputs instead of looping', () => {
    expect(solveHourlyRateForNet(builder(), 0)).toBeNull();
    expect(solveHourlyRateForNet(builder(), -5)).toBeNull();
    expect(solveHourlyRateForNet(builder({ regularHoursPerWeek: 0 }), 100)).toBeNull();
  });

  it('weekly and monthly pay land on the same annual gross for the same annual target', () => {
    const weekly = solveHourlyRateForNet(builder({ payFrequency: 'weekly' }), targetPerPeriod(45000, 'year', 52))!;
    const monthly = solveHourlyRateForNet(builder({ payFrequency: 'monthly' }), targetPerPeriod(45000, 'year', 12))!;
    expect(Math.abs(weekly.hourlyRate - monthly.hourlyRate)).toBeLessThanOrEqual(0.01);
  });
});

describe('targetPerPeriod', () => {
  it('converts month and year targets into per-paycheck figures', () => {
    expect(targetPerPeriod(3000, 'month', 26)).toBeCloseTo((3000 * 12) / 26, 10);
    expect(targetPerPeriod(52000, 'year', 52)).toBe(1000);
    expect(targetPerPeriod(1234, 'paycheck', 24)).toBe(1234);
  });
});

describe('solveSalaryForNet', () => {
  it('returns a whole-dollar salary whose paychecks meet the target', () => {
    const r = solveSalaryForNet(builder({ payFrequency: 'semi-monthly' }), 2500)!;
    expect(Number.isInteger(r.salary)).toBe(true);
    expect(r.hourlyRate).toBeCloseTo(r.salary / 2080, 10);
    expect(r.result.netPerPeriod).toBeGreaterThanOrEqual(2500);
    expect(r.converged).toBe(true);
    const forward = calculatePaycheck(builder({ payFrequency: 'semi-monthly' })((r.salary - 1) / 2080));
    expect(forward.netPerPeriod).toBeLessThan(2500);
  });
});
