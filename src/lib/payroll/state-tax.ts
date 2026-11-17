// ---------------------------------------------------------------------------
// State income tax for the calculators that are not paycheck pages
// ---------------------------------------------------------------------------
// One answer to "what does this state take from these wages", read from the
// paycheck engine's state rules (./withholding), so the state tax calculator,
// the W-2 calculator and the 1099 calculator show the same figure as the
// state's own paycheck page. No rate is typed in this file.
//
// Coverage is what the engine can back up: the 30 states with a paycheck page,
// the four other states with no tax on wages, and each of the remaining 16
// states and the District of Columbia once the engine has a verified rule for
// it (withholding/2026-more-states.ts). One without a rule is not offered by
// name; the calculators keep "another state" with a rate the visitor enters
// instead of guessing one. A state becomes available here by getting a rule in
// the engine, never by typing a rate into this file.
//
// This file deliberately does not import state-pages.ts (100 kB of article
// copy): the names and default allowances below are repeated, and
// state-tax.test.ts fails if they drift from STATE_PAYCHECK_PAGES.

import { getTaxYear, isStateLineKey, TAX_YEAR, type FilingStatus, type StateCode, type WithholdingOnlyState } from './withholding';

/** States with no tax on wages that the paycheck engine has no page for */
export type NoWageTaxState = 'AK' | 'NH' | 'SD' | 'WY';
export type StateTaxCode = StateCode | NoWageTaxState | WithholdingOnlyState;
/** A modeled state, or a flat rate the visitor enters */
export type StateTaxChoice = StateTaxCode | 'other';

interface StateTaxEntry {
  name: string;
  /** Default withholding allowances [single, married, head of household if it differs from single]; null = the state's formula takes none */
  allowances: [single: number, married: number, hoh?: number] | null;
  /** No state income tax on wages */
  noIncomeTax?: true;
}

const BASE_STATES: Record<StateCode | NoWageTaxState, StateTaxEntry> = {
  AK: { name: 'Alaska', allowances: null, noIncomeTax: true },
  AZ: { name: 'Arizona', allowances: [0, 0] },
  CA: { name: 'California', allowances: [1, 2] },
  CO: { name: 'Colorado', allowances: [0, 0] },
  FL: { name: 'Florida', allowances: null, noIncomeTax: true },
  GA: { name: 'Georgia', allowances: [0, 0] },
  ID: { name: 'Idaho', allowances: [0, 0] },
  IL: { name: 'Illinois', allowances: [1, 2] },
  IN: { name: 'Indiana', allowances: [1, 2] },
  IA: { name: 'Iowa', allowances: [1, 2] },
  KY: { name: 'Kentucky', allowances: null },
  LA: { name: 'Louisiana', allowances: [0, 0] },
  MD: { name: 'Maryland', allowances: [1, 2] },
  MA: { name: 'Massachusetts', allowances: [1, 2] },
  MI: { name: 'Michigan', allowances: [1, 2] },
  MN: { name: 'Minnesota', allowances: [0, 0] },
  MO: { name: 'Missouri', allowances: null },
  NV: { name: 'Nevada', allowances: null, noIncomeTax: true },
  NH: { name: 'New Hampshire', allowances: null, noIncomeTax: true },
  NJ: { name: 'New Jersey', allowances: [1, 2] },
  NY: { name: 'New York', allowances: [0, 0] },
  NC: { name: 'North Carolina', allowances: [0, 0] },
  OH: { name: 'Ohio', allowances: [1, 2] },
  OR: { name: 'Oregon', allowances: [1, 2] },
  PA: { name: 'Pennsylvania', allowances: null },
  SC: { name: 'South Carolina', allowances: [1, 2] },
  SD: { name: 'South Dakota', allowances: null, noIncomeTax: true },
  TN: { name: 'Tennessee', allowances: null, noIncomeTax: true },
  TX: { name: 'Texas', allowances: null, noIncomeTax: true },
  UT: { name: 'Utah', allowances: [0, 0] },
  VA: { name: 'Virginia', allowances: [1, 2] },
  WA: { name: 'Washington', allowances: null, noIncomeTax: true },
  WI: { name: 'Wisconsin', allowances: [1, 2] },
  WY: { name: 'Wyoming', allowances: null, noIncomeTax: true },
};

/**
 * The jurisdictions without a paycheck page. `allowances` is what a filer with no
 * dependents claims on the state's own form [single or head of household, married],
 * in the unit that state's rule counts (exemptions, allowances or credits); null
 * where the state's formula takes none.
 */
const MORE_STATES: Record<WithholdingOnlyState, StateTaxEntry> = {
  AL: { name: 'Alabama', allowances: null },
  AR: { name: 'Arkansas', allowances: [1, 2, 2] }, // Form AR4EC: yourself; yourself and spouse; head of household
  CT: { name: 'Connecticut', allowances: null },
  DE: { name: 'Delaware', allowances: [1, 2] }, // Form DE-W4: yourself; yourself and spouse
  DC: { name: 'District of Columbia', allowances: null },
  HI: { name: 'Hawaii', allowances: [2, 3, 3] }, // Form HW-4: self, one job; plus spouse; plus head of household
  KS: { name: 'Kansas', allowances: [1, 2, 2] }, // Form K-4: one; two at the joint rate; head of household one more
  ME: { name: 'Maine', allowances: [1, 2, 2] }, // Form W-4ME worksheet: yourself; spouse; head of household
  MS: { name: 'Mississippi', allowances: null },
  MT: { name: 'Montana', allowances: null },
  NE: { name: 'Nebraska', allowances: [2, 3, 3] }, // Form W-4N worksheet, one job
  NM: { name: 'New Mexico', allowances: null },
  ND: { name: 'North Dakota', allowances: null },
  OK: { name: 'Oklahoma', allowances: [1, 2] }, // Form OK-W-4: yourself; yourself and a non-working spouse
  RI: { name: 'Rhode Island', allowances: null },
  VT: { name: 'Vermont', allowances: [1, 2, 2] }, // Form W-4VT worksheet: yourself; non-working spouse; head of household
  WV: { name: 'West Virginia', allowances: [1, 2] }, // Form IT-104: one exemption each for the filer and spouse
};

/** Every state and the District of Columbia, by code. Use STATE_TAX_CODES for the ones a calculator may offer. */
export const STATE_TAX_STATES: Record<StateTaxCode, StateTaxEntry> = { ...BASE_STATES, ...MORE_STATES };

const MORE_CODES = Object.keys(MORE_STATES) as WithholdingOnlyState[];
const isMoreState = (code: string): code is WithholdingOnlyState => Object.prototype.hasOwnProperty.call(MORE_STATES, code);
/** True when the engine has a rule for the jurisdiction in the site's tax year */
const hasEngineRule = (code: WithholdingOnlyState) => typeof getTaxYear(TAX_YEAR).moreStateRules[code] === 'function';
const byName = (a: StateTaxCode, b: StateTaxCode) => STATE_TAX_STATES[a].name.localeCompare(STATE_TAX_STATES[b].name);

/** Modeled jurisdictions in alphabetical order of name, for dropdowns */
export const STATE_TAX_CODES: StateTaxCode[] = [...(Object.keys(BASE_STATES) as StateTaxCode[]), ...MORE_CODES.filter(hasEngineRule)].sort(byName);

/** Jurisdictions with an income tax that the engine has no rule for; they use the "another state" rate */
export const UNMODELED_STATES: string[] = MORE_CODES.filter((c) => !hasEngineRule(c))
  .sort(byName)
  .map((c) => MORE_STATES[c].name);

/** "Maine, Vermont and the District of Columbia" */
export function listStateNames(names: readonly string[]): string {
  const said = names.map((n) => (n === 'District of Columbia' ? 'the District of Columbia' : n));
  return said.length < 2 ? said.join('') : `${said.slice(0, -1).join(', ')} and ${said[said.length - 1]}`;
}

const NO_ENGINE_RULE: Record<NoWageTaxState, true> = { AK: true, NH: true, SD: true, WY: true };

/** A jurisdiction the calculators can offer by name */
export function isStateTaxCode(value: string | null | undefined): value is StateTaxCode {
  return !!value && (STATE_TAX_CODES as string[]).includes(value);
}

export function isStateTaxChoice(value: string | null | undefined): value is StateTaxChoice {
  return value === 'other' || isStateTaxCode(value);
}

/** True for the 30 states that have their own paycheck page */
export function hasPaycheckPage(code: StateTaxChoice): code is StateCode {
  return code !== 'other' && !(code in NO_ENGINE_RULE) && !isMoreState(code);
}

/** The state's own paycheck calculator, where allowances, overtime and pay frequency can be set */
export function statePaycheckPath(code: StateCode): string {
  return `/calculators/${STATE_TAX_STATES[code].name.toLowerCase().replace(/ /g, '-')}-hourly-paycheck-calculator`;
}

export function stateTaxName(choice: StateTaxChoice): string {
  return choice === 'other' ? 'Another state' : STATE_TAX_STATES[choice].name;
}

export interface StateTaxLine {
  key: string;
  label: string;
  annual: number;
}

export interface StateTaxInput {
  state: StateTaxChoice;
  /** Annual wages subject to income tax (after pre-tax retirement and Section 125 benefits) */
  taxableWages: number;
  /** Annual wages subject to payroll taxes; defaults to taxableWages */
  ficaWages?: number;
  filingStatus: FilingStatus;
  /** 'other' only: flat rate as a decimal (0.05 = 5%) */
  customRate?: number;
  /** State withholding allowances; defaults to the state's paycheck-page default for the filing status */
  allowances?: number;
  /** Defaults to the site's tax year */
  taxYear?: number;
}

export interface StateTaxResult {
  /** State income tax for the year */
  incomeTax: number;
  /** Local income tax the engine includes with the state: Maryland's county tax at the average rate. It applies to all income, like the state tax. */
  localTax: number;
  /** Deductions that apply to wages only: disability, paid leave, employee unemployment tax, Oregon's statewide transit tax */
  payroll: StateTaxLine[];
  payrollTotal: number;
  /** incomeTax + localTax + payrollTotal */
  total: number;
  /** Every line, in the order the paycheck pages print them */
  lines: StateTaxLine[];
  /** The year the state's rule was published for (a later year can run on a carried-over rule) */
  rulesYear: number;
}

const round2 = (n: number) => Math.round(n * 100) / 100;

export function defaultStateAllowances(code: StateTaxCode, status: FilingStatus): number {
  const a = STATE_TAX_STATES[code].allowances;
  return a ? (status === 'married' ? a[1] : status === 'hoh' ? (a[2] ?? a[0]) : a[0]) : 0;
}

/** What a state takes from a year of wages, by the same rule its paycheck page uses */
export function stateTaxOnWages(input: StateTaxInput): StateTaxResult {
  const year = getTaxYear(input.taxYear ?? TAX_YEAR);
  const taxableWages = Math.max(0, input.taxableWages);
  const ficaWages = Math.max(0, input.ficaWages ?? input.taxableWages);

  let raw: StateTaxLine[] = [];
  let rulesYear = year.year;
  if (input.state === 'other') {
    const rate = Math.max(0, input.customRate ?? 0);
    if (rate > 0) raw = [{ key: 'state', label: `State income tax (${+(rate * 100).toFixed(2)}%)`, annual: taxableWages * rate }];
  } else if (!(input.state in NO_ENGINE_RULE)) {
    const context = {
      taxableWages,
      ficaWages,
      filingStatus: input.filingStatus,
      allowances: input.allowances ?? defaultStateAllowances(input.state, input.filingStatus),
      nycResident: false,
    };
    if (isMoreState(input.state)) {
      // a jurisdiction without a rule yields nothing; the calculators do not offer it (isStateTaxCode)
      raw = year.moreStateRules[input.state]?.(context) ?? [];
      if (!year.moreStatesPublished.includes(input.state)) rulesYear = year.stateRulesFrom;
    } else if (hasPaycheckPage(input.state)) {
      raw = year.stateRules[input.state](context);
      if (!year.statesPublished.includes(input.state)) rulesYear = year.stateRulesFrom;
    }
    raw = raw.filter((l) => isStateLineKey(l.key));
  }

  const lines = raw.map((l) => ({ ...l, annual: round2(l.annual) }));
  const total = (of: StateTaxLine[]) => round2(of.reduce((s, l) => s + l.annual, 0));
  // The engine files Maryland's county income tax and Oregon's transit tax under the same key; only Maryland's is an income tax
  const isLocalIncomeTax = (l: StateTaxLine) => l.key === 'local' && input.state === 'MD';
  const payroll = lines.filter((l) => l.key !== 'state' && !isLocalIncomeTax(l));
  const incomeTax = total(lines.filter((l) => l.key === 'state'));
  const localTax = total(lines.filter(isLocalIncomeTax));
  const payrollTotal = total(payroll);
  return { incomeTax, localTax, payroll, payrollTotal, total: round2(incomeTax + localTax + payrollTotal), lines, rulesYear };
}

/** State income tax on the next $1,000 of wages, as a rate: what a raise is taxed at */
export function stateMarginalRate(input: StateTaxInput): number {
  const step = 1000;
  const more = { ...input, taxableWages: input.taxableWages + step, ficaWages: (input.ficaWages ?? input.taxableWages) + step };
  return (stateTaxOnWages(more).incomeTax - stateTaxOnWages(input).incomeTax) / step;
}
