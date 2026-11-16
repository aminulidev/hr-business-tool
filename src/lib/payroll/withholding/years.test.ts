import { describe, expect, it } from 'vitest';
import {
  ADDITIONAL_MEDICARE_THRESHOLD,
  calculatePaycheck,
  FEDERAL_STANDARD_DEDUCTION,
  getTaxYear,
  isTaxYear,
  parseTaxYear,
  SELECTABLE_TAX_YEARS,
  SOCIAL_SECURITY_WAGE_BASE,
  stateIsPublished,
  stateRulesYear,
  TAX_YEAR,
  TAX_YEARS,
  taxYearLabel,
  taxYearNote,
  W4_CHILD_CREDIT,
  type FilingStatus,
  type PaycheckInput,
  type TaxYear,
  type TaxYearDefinition,
} from './index';
import { STATE_CODES } from '../state-pages';

// The tax-year switch: what every registered year must provide, and what a year
// is allowed to claim about itself.

const years = (Object.keys(TAX_YEARS).map(Number) as TaxYear[]).sort();
const defs = years.map((y) => [y, TAX_YEARS[y] as TaxYearDefinition] as const);

const input = (over: Partial<PaycheckInput> = {}): PaycheckInput => ({
  state: 'CA',
  hourlyRate: 30,
  regularHoursPerWeek: 40,
  overtimeHoursPerWeek: 0,
  overtimeMultiplier: 1.5,
  payFrequency: 'bi-weekly',
  filingStatus: 'single',
  stateAllowances: 1,
  ...over,
});

describe('tax-year registry', () => {
  it('the site year is registered, selectable and final on the federal side', () => {
    expect(isTaxYear(TAX_YEAR)).toBe(true);
    expect(SELECTABLE_TAX_YEARS).toContain(TAX_YEAR);
    // Do not make a year the site default while its federal figures still rest on a draft.
    expect(getTaxYear(TAX_YEAR).federalPending).toEqual([]);
  });

  it('selectable years are registered, unique and in order', () => {
    expect([...SELECTABLE_TAX_YEARS]).toEqual([...new Set(SELECTABLE_TAX_YEARS)].sort());
    for (const y of SELECTABLE_TAX_YEARS) expect(isTaxYear(y)).toBe(true);
  });

  it.each(defs)('%i: complete, and honest about what is carried over', (year, def) => {
    expect(def.year).toBe(year);
    expect(Object.keys(def.stateRules).sort()).toEqual([...STATE_CODES].sort());
    expect(new Set(def.statesPublished).size).toBe(def.statesPublished.length);
    for (const code of def.statesPublished) expect(STATE_CODES).toContain(code);
    expect(def.federalBasis.length).toBeGreaterThan(20);
    expect(def.federalSources.length).toBeGreaterThan(0);
    for (const s of def.federalSources) {
      expect(s.label.trim()).not.toBe('');
      expect(s.url).toMatch(/^https:\/\/[a-z0-9.-]+\.(gov)\//);
    }
    expect(def.asOf).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    // not a future date (one day of slack: the date is local, the clock here is UTC)
    expect(new Date(`${def.asOf}T00:00:00Z`).getTime()).toBeLessThanOrEqual(Date.now() + 24 * 60 * 60 * 1000);

    const unpublished = STATE_CODES.filter((code) => !def.statesPublished.includes(code));
    if (unpublished.length === 0) {
      expect(def.stateRulesFrom).toBe(year);
    } else {
      // A state that has not published must run on the very rule of the year it is carried from.
      expect(def.stateRulesFrom).toBeLessThan(year);
      expect(isTaxYear(def.stateRulesFrom)).toBe(true);
      const source = getTaxYear(def.stateRulesFrom);
      expect(STATE_CODES.filter((code) => !source.statesPublished.includes(code))).toEqual([]);
      // ...and a state listed as published must have a rule of its own, not the carried-over one
      for (const code of def.statesPublished) {
        expect(def.stateRules[code], `${year} ${code} is listed as published but still runs the ${def.stateRulesFrom} rule`).not.toBe(source.stateRules[code]);
      }
      for (const code of unpublished) {
        expect(def.stateRules[code], `${year} ${code} is not listed as published, so it must be the ${def.stateRulesFrom} rule`).toBe(source.stateRules[code]);
        expect(stateIsPublished(year, code)).toBe(false);
      }
    }
  });

  it.each(defs)('%i: federal tables are well formed', (_year, def) => {
    for (const status of ['single', 'married', 'hoh'] as FilingStatus[]) {
      const rows = def.federal.schedules[status];
      expect(rows.map((r) => r.rate)).toEqual([0.1, 0.12, 0.22, 0.24, 0.32, 0.35, 0.37]);
      expect(rows[0]).toEqual({ over: 0, base: 0, rate: 0.1 });
      for (let i = 1; i < rows.length; i++) {
        expect(rows[i].over).toBeGreaterThan(rows[i - 1].over);
        expect(rows[i].base).toBeCloseTo(rows[i - 1].base + (rows[i].over - rows[i - 1].over) * rows[i - 1].rate, 2);
      }
      expect(def.federal.standardDeduction[status]).toBeGreaterThan(0);
    }
    expect(def.federal.standardDeduction.married).toBe(2 * def.federal.standardDeduction.single);
    expect(def.federal.socialSecurityRate).toBe(0.062);
    expect(def.federal.medicareRate).toBe(0.0145);
  });

  it('indexed figures do not shrink from one year to the next (catches a mistyped digit)', () => {
    for (let i = 1; i < defs.length; i++) {
      const [, prev] = defs[i - 1];
      const [, next] = defs[i];
      expect(next.federal.socialSecurityWageBase).toBeGreaterThanOrEqual(prev.federal.socialSecurityWageBase);
      for (const status of ['single', 'married', 'hoh'] as FilingStatus[]) {
        expect(next.federal.standardDeduction[status]).toBeGreaterThanOrEqual(prev.federal.standardDeduction[status]);
        next.federal.schedules[status].forEach((row, j) => {
          expect(row.over).toBeGreaterThanOrEqual(prev.federal.schedules[status][j].over);
          // a few percent a year, never a different order of magnitude
          expect(row.over).toBeLessThanOrEqual(prev.federal.schedules[status][j].over * 1.1);
        });
      }
    }
  });
});

describe('choosing the year', () => {
  it('calculatePaycheck defaults to the site year and reports the year it used', () => {
    const plain = calculatePaycheck(input());
    expect(plain.taxYear).toBe(TAX_YEAR);
    expect(calculatePaycheck(input({ taxYear: TAX_YEAR }))).toEqual(plain);
    for (const y of years) expect(calculatePaycheck(input({ taxYear: y })).taxYear).toBe(y);
  });

  it('an unknown year falls back to the site year instead of failing', () => {
    expect(calculatePaycheck(input({ taxYear: 1999 }))).toEqual(calculatePaycheck(input()));
    expect(getTaxYear(null).year).toBe(TAX_YEAR);
    expect(getTaxYear(2099).year).toBe(TAX_YEAR);
  });

  it('parseTaxYear accepts only selectable years', () => {
    for (const y of SELECTABLE_TAX_YEARS) {
      expect(parseTaxYear(String(y))).toBe(y);
      expect(parseTaxYear(y)).toBe(y);
    }
    for (const bad of [null, undefined, '', 'next', '1999', '20270', '2027.5', ' 2027', '-2027', 2099]) {
      expect(parseTaxYear(bad)).toBe(TAX_YEAR);
    }
  });

  it('a finished year needs no note; a preview year says what is a draft and what is carried over', () => {
    expect(taxYearNote(2026, 'CA', 'California', true)).toBeNull();
    expect(taxYearLabel(TAX_YEAR)).toBe(String(TAX_YEAR));

    const ca = taxYearNote(2027, 'CA', 'California', true)!;
    expect(taxYearLabel(2027)).toBe('2027 preview');
    expect(ca.title).toBe('2027 preview.');
    expect(ca.sentences.join(' ')).toContain('Rev. Proc. 2026-35');
    expect(ca.sentences.join(' ')).toContain('draft');
    expect(ca.sentences).toContain('California had not published 2027 withholding figures as of November 17, 2026, so the California lines use 2026 rules.');
    expect(ca.sources.map((s) => s.url)).toContain('https://www.irs.gov/pub/irs-drop/rp-26-35.pdf');
    expect(stateRulesYear(2027, 'CA')).toBe(2026);

    // No state lines (Texas, the generic options): nothing is carried over, the federal draft note remains
    for (const [state, name, lines] of [['TX', 'Texas', false], ['none', null, false], ['other', null, true]] as const) {
      const note = taxYearNote(2027, state, name, lines)!;
      expect(note.sentences.join(' ')).not.toContain('had not published');
      expect(note.sentences.join(' ')).toContain('draft');
    }
    expect(stateRulesYear(2027, 'none')).toBe(2027);
    expect(stateRulesYear(2026, 'CA')).toBe(2026);
  });

  it('the named federal constants are the site year’s figures', () => {
    const federal = getTaxYear(TAX_YEAR).federal;
    expect(FEDERAL_STANDARD_DEDUCTION).toBe(federal.standardDeduction);
    expect(SOCIAL_SECURITY_WAGE_BASE).toBe(federal.socialSecurityWageBase);
    expect(ADDITIONAL_MEDICARE_THRESHOLD).toBe(federal.additionalMedicareThreshold);
    expect(W4_CHILD_CREDIT).toBe(federal.w4ChildCredit);
  });
});
