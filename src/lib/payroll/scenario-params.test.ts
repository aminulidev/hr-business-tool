import { describe, expect, it } from 'vitest';
import { parseScenarioParams, scenarioAllowances, writeScenarioParams, type CompareScenario } from './scenario-params';

const fallback: CompareScenario = {
  state: 'CA',
  hourlyRate: '25',
  regularHours: '40',
  overtimeHours: '0',
  annualSalary: '65000',
  filingStatus: 'single',
  payFrequency: 'bi-weekly',
  retirementPct: '',
};

describe('scenario B in the URL', () => {
  it('is absent until a b_ parameter appears', () => {
    expect(parseScenarioParams(null, fallback)).toBeNull();
    expect(parseScenarioParams(new URLSearchParams('rate=25&state=TX'), fallback)).toBeNull();
  });

  it('round-trips through a share URL in hourly mode', () => {
    const b: CompareScenario = { ...fallback, state: 'TX', hourlyRate: '27.5', overtimeHours: '5', filingStatus: 'married', payFrequency: 'weekly', retirementPct: '6' };
    const url = new URL('https://www.quickbizcalc.com/calculators/hourly-paycheck-calculator?rate=25');
    writeScenarioParams(url, b, 'hourly');
    expect(url.searchParams.get('b_rate')).toBe('27.5');
    expect(url.searchParams.has('b_salary')).toBe(false);
    expect(parseScenarioParams(url.searchParams, fallback)).toEqual(b);
  });

  it('round-trips in salary mode and ignores the hourly fields', () => {
    const b: CompareScenario = { ...fallback, state: 'none', annualSalary: '72000', retirementPct: '0' };
    const url = new URL('https://www.quickbizcalc.com/calculators/payroll-calculator');
    writeScenarioParams(url, b, 'salary');
    expect(url.searchParams.get('b_salary')).toBe('72000');
    expect(url.searchParams.has('b_rate')).toBe(false);
    expect(url.searchParams.has('b_ret')).toBe(false);
    expect(parseScenarioParams(url.searchParams, fallback)).toEqual({ ...b, retirementPct: '' });
  });

  it('falls back field by field on junk values', () => {
    const s = parseScenarioParams(new URLSearchParams('b_state=ZZ&b_rate=-4&b_status=divorced&b_freq=daily&b_ret=abc'), fallback)!;
    expect(s).toEqual(fallback);
  });

  it('uses the state default allowances for the scenario', () => {
    expect(scenarioAllowances('CA', 'single')).toBe(1);
    expect(scenarioAllowances('CA', 'married')).toBe(2);
    expect(scenarioAllowances('TX', 'single')).toBe(0);
    expect(scenarioAllowances('none', 'married')).toBe(0);
  });
});
