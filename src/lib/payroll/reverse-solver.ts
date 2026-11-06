// ---------------------------------------------------------------------------
// Reverse paycheck solver (Roadmap v2, Phase 16.1): "I need $X take-home —
// what gross do I have to earn?" Bisection on calculatePaycheck(), which is
// monotonic in the hourly rate, so no tax formula is duplicated here.
// ---------------------------------------------------------------------------

import { calculatePaycheck, PERIODS_PER_YEAR, type PaycheckInput, type PaycheckResult } from './withholding-2026';

export type TargetBasis = 'paycheck' | 'month' | 'year';

export interface ReverseSolveResult {
  /** Hourly rate, rounded UP to the cent so take-home meets the target */
  hourlyRate: number;
  /** The paycheck at that rate (same engine the calculator shows) */
  result: PaycheckResult;
  targetNetPerPeriod: number;
  iterations: number;
  /** false only if the search could not bracket the target (absurd inputs) */
  converged: boolean;
}

/** Convert a target expressed per paycheck / month / year into a per-paycheck figure */
export function targetPerPeriod(amount: number, basis: TargetBasis, periodsPerYear: number): number {
  if (basis === 'paycheck') return amount;
  if (basis === 'month') return (amount * 12) / periodsPerYear;
  return amount / periodsPerYear;
}

/** Raw bisection: the smallest hourly rate (to 1e-5) whose net meets the target */
function bisect(build: (hourlyRate: number) => PaycheckInput, target: number): { rate: number; iterations: number } | null {
  if (!Number.isFinite(target) || target <= 0) return null;
  const probe = build(1);
  const paidHoursPerWeek = probe.regularHoursPerWeek + probe.overtimeHoursPerWeek * probe.overtimeMultiplier;
  if (!(paidHoursPerWeek > 0)) return null;
  const periods = PERIODS_PER_YEAR[probe.payFrequency];
  const netAt = (rate: number) => calculatePaycheck(build(rate)).netPerPeriod;

  // Gross-equivalent rate is a lower bound (taxes only lower net); double until bracketed
  let lo = 0;
  let hi = Math.max(1, (target * periods) / (paidHoursPerWeek * 52));
  let guard = 0;
  while (netAt(hi) < target && guard < 40) {
    hi *= 2;
    guard++;
  }
  if (netAt(hi) < target) return null;

  let iterations = 0;
  while (hi - lo > 1e-5 && iterations < 100) {
    const mid = (lo + hi) / 2;
    if (netAt(mid) < target) lo = mid;
    else hi = mid;
    iterations++;
  }

  return { rate: hi, iterations };
}

/**
 * Find the hourly rate whose take-home pay per paycheck is at least `target`.
 * `build` turns a candidate rate into the full PaycheckInput, so percentage
 * deductions (401(k) as % of gross) and flat per-paycheck deductions are
 * handled by the caller exactly as the calculator applies them.
 */
export function solveHourlyRateForNet(
  build: (hourlyRate: number) => PaycheckInput,
  target: number,
): ReverseSolveResult | null {
  const raw = bisect(build, target);
  if (!raw) return null;
  const hourlyRate = Math.ceil(raw.rate * 100 - 1e-9) / 100;
  const result = calculatePaycheck(build(hourlyRate));
  return {
    hourlyRate,
    result,
    targetNetPerPeriod: target,
    iterations: raw.iterations,
    converged: result.netPerPeriod >= target - 0.01,
  };
}

/**
 * Salary flavour: returns the annual salary (whole dollars, rounded up) that
 * yields the target take-home when run as 40 hours a week at salary ÷ 2,080.
 */
export function solveSalaryForNet(
  build: (hourlyRate: number) => PaycheckInput,
  target: number,
): (ReverseSolveResult & { salary: number }) | null {
  const raw = bisect(build, target);
  if (!raw) return null;
  const salary = Math.ceil(raw.rate * 2080 - 1e-6);
  const hourlyRate = salary / 2080;
  const result = calculatePaycheck(build(hourlyRate));
  return { hourlyRate, salary, result, targetNetPerPeriod: target, iterations: raw.iterations, converged: result.netPerPeriod >= target - 0.01 };
}
