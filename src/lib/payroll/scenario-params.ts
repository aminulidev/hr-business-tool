// ---------------------------------------------------------------------------
// Scenario compare (Roadmap v2, Phase 16.1): a second paycheck ("B") kept in
// the URL next to the main one, so a shared link opens both side by side.
// Parameters are prefixed b_ (b_state, b_rate | b_salary, b_hours, b_ot,
// b_status, b_freq, b_ret).
// ---------------------------------------------------------------------------

import { STATE_CODES, STATE_PAYCHECK_PAGES } from './state-pages';
import type { FilingStatus, PaycheckState, PayFrequency, StateCode } from './withholding-2026';

export interface CompareScenario {
  state: PaycheckState;
  /** Hourly mode */
  hourlyRate: string;
  regularHours: string;
  overtimeHours: string;
  /** Salary mode */
  annualSalary: string;
  filingStatus: FilingStatus;
  payFrequency: PayFrequency;
  /** 401(k) as % of gross, '' = none */
  retirementPct: string;
}

const FREQS: PayFrequency[] = ['weekly', 'bi-weekly', 'semi-monthly', 'monthly'];
const STATUSES: FilingStatus[] = ['single', 'married', 'hoh'];

export function isPaycheckState(s: string | null): s is PaycheckState {
  return s === 'none' || s === 'other' || (STATE_CODES as readonly string[]).includes(s ?? '');
}

/** Default state allowances for a scenario, mirroring the main form */
export function scenarioAllowances(state: PaycheckState, status: FilingStatus): number {
  if (state === 'none' || state === 'other') return 0;
  const a = STATE_PAYCHECK_PAGES[state as StateCode].allowances;
  if (!a) return 0;
  return status === 'married' ? a.defaultMarried : a.defaultSingle;
}

/** Read scenario B from a query string; null when no b_ parameter is present */
export function parseScenarioParams(params: URLSearchParams | null, fallback: CompareScenario): CompareScenario | null {
  if (!params) return null;
  const has = ['b_state', 'b_rate', 'b_salary', 'b_hours', 'b_ot', 'b_status', 'b_freq', 'b_ret'].some((k) => params.has(k));
  if (!has) return null;
  const s: CompareScenario = { ...fallback };
  const state = params.get('b_state');
  if (isPaycheckState(state)) s.state = state;
  const num = (k: string) => {
    const v = params.get(k);
    if (v === null) return null;
    const n = parseFloat(v);
    return Number.isFinite(n) && n >= 0 ? v : null;
  };
  const rate = num('b_rate');
  if (rate !== null) s.hourlyRate = rate;
  const salary = num('b_salary');
  if (salary !== null) s.annualSalary = salary;
  const hours = num('b_hours');
  if (hours !== null) s.regularHours = hours;
  const ot = num('b_ot');
  if (ot !== null) s.overtimeHours = ot;
  const ret = num('b_ret');
  if (ret !== null) s.retirementPct = ret;
  const status = params.get('b_status');
  if (status && (STATUSES as string[]).includes(status)) s.filingStatus = status as FilingStatus;
  const freq = params.get('b_freq');
  if (freq && (FREQS as string[]).includes(freq)) s.payFrequency = freq as PayFrequency;
  return s;
}

/** Append scenario B to a share URL */
export function writeScenarioParams(url: URL, s: CompareScenario | null, mode: 'hourly' | 'salary'): void {
  if (!s) return;
  url.searchParams.set('b_state', s.state);
  if (mode === 'salary') {
    url.searchParams.set('b_salary', s.annualSalary);
  } else {
    url.searchParams.set('b_rate', s.hourlyRate);
    url.searchParams.set('b_hours', s.regularHours);
    if (parseFloat(s.overtimeHours || '0') > 0) url.searchParams.set('b_ot', s.overtimeHours);
  }
  url.searchParams.set('b_status', s.filingStatus);
  url.searchParams.set('b_freq', s.payFrequency);
  if (s.retirementPct && parseFloat(s.retirementPct) > 0) url.searchParams.set('b_ret', s.retirementPct);
}
