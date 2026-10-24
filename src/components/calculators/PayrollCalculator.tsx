'use client';

import HourlyPaycheckCalculator from './HourlyPaycheckCalculator';

/**
 * Payroll & Paycheck Calculator — the salary-based mode of the shared paycheck
 * calculator. Uses the same 2026 withholding engine as the hourly and state pages.
 */
export default function PayrollCalculator() {
  return <HourlyPaycheckCalculator mode="salary" />;
}
