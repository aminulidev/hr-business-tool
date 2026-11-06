import { describe, expect, it } from 'vitest';
import { BULK_EXAMPLE_CSV, BULK_MAX_ROWS, BULK_OUTPUT_HEADERS, bulkToCsv, parseBulkCsv, runBulkPayroll, splitCsvLine } from './bulk-payroll';
import { calculatePaycheck } from './withholding-2026';

describe('splitCsvLine', () => {
  it('handles quotes, embedded commas, tabs and semicolons', () => {
    expect(splitCsvLine('"Lopez, Maria",hourly,24.5')).toEqual(['Lopez, Maria', 'hourly', '24.5']);
    expect(splitCsvLine('a\tb\tc')).toEqual(['a', 'b', 'c']);
    expect(splitCsvLine('a;b;c')).toEqual(['a', 'b', 'c']);
    expect(splitCsvLine('"say ""hi""",x')).toEqual(['say "hi"', 'x']);
  });
});

describe('parseBulkCsv', () => {
  it('reads the example with a header row and fills defaults', () => {
    const { rows, errors, truncated } = parseBulkCsv(BULK_EXAMPLE_CSV);
    expect(errors).toEqual([]);
    expect(truncated).toBe(false);
    expect(rows).toHaveLength(3);
    expect(rows[0]).toMatchObject({ name: 'Maria Lopez', type: 'hourly', pay: 24.5, hours: 40, overtime: 4, state: 'TX', status: 'single', allowances: 0, retirementPct: 5, benefitsPerPeriod: 80 });
    expect(rows[1]).toMatchObject({ type: 'salary', pay: 68000, hours: 40, overtime: 0, state: 'CA', status: 'married', allowances: 2 });
    expect(rows[2]).toMatchObject({ state: 'FL', status: 'hoh', hours: 32 });
  });

  it('accepts reordered header names and positional rows without a header', () => {
    const reordered = parseBulkCsv('state,rate,employee\nCA,30,Ana');
    expect(reordered.rows[0]).toMatchObject({ name: 'Ana', pay: 30, state: 'CA', allowances: 1 });
    const positional = parseBulkCsv('Bob,hourly,22,40,0,NY,single');
    expect(positional.rows[0]).toMatchObject({ name: 'Bob', pay: 22, state: 'NY', allowances: 0 }); // NY IT-2104 default is 0
  });

  it('reports bad rows by line and keeps the good ones', () => {
    const { rows, errors } = parseBulkCsv('name,pay,state\nOk,20,TX\nNoPay,,TX\nBadState,20,ZZ\nBadStatus,20,TX,divorced'.replace('BadStatus,20,TX,divorced', 'BadStatus,20,TX'));
    expect(rows.map((r) => r.name)).toEqual(['Ok', 'BadStatus']);
    expect(errors.map((e) => e.line)).toEqual([3, 4]);
    expect(errors[1].message).toContain('unknown state');
  });

  it('caps at 25 employees and ignores blank and # lines', () => {
    const text = '# comment\n' + Array.from({ length: 30 }, (_, i) => `E${i},hourly,20,40,0,TX`).join('\n\n');
    const { rows, truncated } = parseBulkCsv(text);
    expect(rows).toHaveLength(BULK_MAX_ROWS);
    expect(truncated).toBe(true);
  });
});

describe('runBulkPayroll + bulkToCsv', () => {
  const { rows } = parseBulkCsv(BULK_EXAMPLE_CSV);
  const results = runBulkPayroll(rows, 'bi-weekly');

  it('matches the single-employee engine row by row', () => {
    const maria = results[0];
    const direct = calculatePaycheck({
      state: 'TX',
      hourlyRate: 24.5,
      regularHoursPerWeek: 40,
      overtimeHoursPerWeek: 4,
      overtimeMultiplier: 1.5,
      payFrequency: 'bi-weekly',
      filingStatus: 'single',
      stateAllowances: 0,
      preTaxRetirementAnnual: (24.5 * 40 + 24.5 * 1.5 * 4) * 52 * 0.05,
      preTaxBenefitsAnnual: 80 * 26,
    });
    expect(maria.paycheck.netPerPeriod).toBe(direct.netPerPeriod);
    expect(maria.federal + maria.fica + maria.stateTax + maria.otherWithholding + maria.preTax).toBeCloseTo(maria.paycheck.grossPerPeriod - maria.paycheck.netPerPeriod, 1);
    expect(results[1].paycheck.grossAnnual).toBeCloseTo(68000, 0);
    expect(results[1].stateTax).toBeGreaterThan(0); // California
    expect(results[1].otherWithholding).toBeGreaterThan(0); // CA SDI
    expect(results[2].stateTax).toBe(0); // Florida
    expect(results[0].employer.totalCostPerPeriod).toBeGreaterThan(results[0].paycheck.grossPerPeriod);
  });

  it('writes one CSV line per employee with the documented headers', () => {
    const csv = bulkToCsv(results);
    const lines = csv.split('\n');
    expect(lines[0]).toBe(BULK_OUTPUT_HEADERS.join(','));
    expect(lines).toHaveLength(4);
    expect(lines[1].split(',')).toHaveLength(BULK_OUTPUT_HEADERS.length);
    expect(lines[1]).toContain(results[0].paycheck.netPerPeriod.toFixed(2));
    const quoted = bulkToCsv(runBulkPayroll(parseBulkCsv('"Lopez, Maria",hourly,20,40,0,TX').rows, 'weekly'));
    expect(quoted.split('\n')[1].startsWith('"Lopez, Maria",')).toBe(true);
  });
});
