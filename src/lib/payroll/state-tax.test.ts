import { describe, expect, it } from 'vitest';
import {
  defaultStateAllowances,
  hasPaycheckPage,
  isStateTaxChoice,
  isStateTaxCode,
  listStateNames,
  STATE_TAX_CODES,
  STATE_TAX_STATES,
  stateMarginalRate,
  statePaycheckPath,
  stateTaxName,
  stateTaxOnWages,
  UNMODELED_STATES,
  type StateTaxCode,
} from './state-tax';
import { STATE_CODES, STATE_PAYCHECK_PAGES } from './state-pages';
import { calculatePaycheck, getTaxYear, isStateLineKey, type FilingStatus } from './withholding';

const STATUSES: FilingStatus[] = ['single', 'married', 'hoh'];
const on = (state: StateTaxCode | 'other', taxableWages: number, over: Partial<Parameters<typeof stateTaxOnWages>[0]> = {}) =>
  stateTaxOnWages({ state, taxableWages, filingStatus: 'single', ...over });

describe('the state list', () => {
  const MORE = ['AL', 'AR', 'CT', 'DC', 'DE', 'HI', 'KS', 'ME', 'MS', 'MT', 'ND', 'NE', 'NM', 'OK', 'RI', 'VT', 'WV'];
  const moreRules = getTaxYear().moreStateRules;

  it('covers the 30 page states, the four other states with no tax on wages, and every state the engine has a rule for', () => {
    for (const code of STATE_CODES) expect(isStateTaxCode(code)).toBe(true);
    for (const code of ['AK', 'NH', 'SD', 'WY']) expect(isStateTaxCode(code)).toBe(true);
    const modeledMore = MORE.filter((code) => code in moreRules);
    expect(STATE_TAX_CODES.filter((c) => !hasPaycheckPage(c)).sort()).toEqual([...modeledMore, 'AK', 'NH', 'SD', 'WY'].sort());
    expect(STATE_TAX_CODES).toHaveLength(34 + modeledMore.length);
  });

  it('a jurisdiction is offered by name exactly when the engine has a rule for it', () => {
    for (const code of MORE) {
      const modeled = code in moreRules;
      expect(isStateTaxCode(code), code).toBe(modeled);
      expect(UNMODELED_STATES.includes(STATE_TAX_STATES[code as StateTaxCode].name), code).toBe(!modeled);
      // and one without a rule computes nothing rather than something made up
      if (!modeled) expect(on(code as StateTaxCode, 80000).total).toBe(0);
    }
  });

  it('modeled and unmodeled together are all 50 states and the District of Columbia, each once', () => {
    const names = [...STATE_TAX_CODES.map((c) => STATE_TAX_STATES[c].name), ...UNMODELED_STATES];
    expect(names).toHaveLength(51);
    expect(new Set(names).size).toBe(51);
    expect(Object.keys(STATE_TAX_STATES)).toHaveLength(51);
  });

  it('the registry copy for the state tax page states the real counts', async () => {
    const { calculators } = await import('../calculator-meta');
    const entry = calculators.find((c) => c.slug === 'state-tax-calculator')!;
    const withIncomeTax = STATE_TAX_CODES.filter((c) => !STATE_TAX_STATES[c].noIncomeTax).length;
    expect(entry.shortDescription).toContain(`income tax for ${withIncomeTax} states`);
    expect(entry.shortDescription).toContain('the nine states with no tax on wages');
    expect(STATE_TAX_CODES.length - withIncomeTax).toBe(9);
    expect(entry.metaDescription).toContain(`in ${STATE_TAX_CODES.length} states`);
    expect(`${entry.metaTitle} ${entry.metaDescription} ${entry.shortDescription}`).not.toMatch(/all 50|every state/i);
  });

  it('lists names in prose with the right article for the District', () => {
    expect(listStateNames([])).toBe('');
    expect(listStateNames(['Maine'])).toBe('Maine');
    expect(listStateNames(['Maine', 'Vermont', 'District of Columbia'])).toBe('Maine, Vermont and the District of Columbia');
  });

  it('names, default allowances and paycheck-page links match STATE_PAYCHECK_PAGES', () => {
    for (const code of STATE_CODES) {
      const page = STATE_PAYCHECK_PAGES[code];
      expect(STATE_TAX_STATES[code].name).toBe(page.name);
      expect(STATE_TAX_STATES[code].allowances).toEqual(page.allowances ? [page.allowances.defaultSingle, page.allowances.defaultMarried] : null);
      expect(statePaycheckPath(code)).toBe(`/calculators/${page.slug}`);
    }
  });

  it('marks exactly the states whose rule produces no income tax line', () => {
    for (const code of STATE_TAX_CODES) {
      const taxed = on(code, 150000).incomeTax > 0;
      expect(!taxed, code).toBe(STATE_TAX_STATES[code].noIncomeTax === true);
    }
    // the same for the names not offered: none of them is a no-tax state
    for (const code of MORE) expect(STATE_TAX_STATES[code as StateTaxCode].noIncomeTax).toBeUndefined();
    expect(STATE_TAX_CODES.filter((c) => STATE_TAX_STATES[c].noIncomeTax).map((c) => STATE_TAX_STATES[c].name)).toEqual([
      'Alaska', 'Florida', 'Nevada', 'New Hampshire', 'South Dakota', 'Tennessee', 'Texas', 'Washington', 'Wyoming',
    ]);
  });

  it('is sorted by name and recognizes the choices', () => {
    const names = STATE_TAX_CODES.map((c) => STATE_TAX_STATES[c].name);
    expect(names).toEqual([...names].sort());
    expect(isStateTaxChoice('other')).toBe(true);
    expect(isStateTaxChoice('ZZ')).toBe(false);
    expect(isStateTaxChoice('PR')).toBe(false);
    expect(isStateTaxChoice(null)).toBe(false);
    expect(stateTaxName('other')).toBe('Another state');
    expect(stateTaxName('NH')).toBe('New Hampshire');
  });
});

describe('agreement with the paycheck pages', () => {
  it.each(STATE_CODES)('%s: the same state lines as calculatePaycheck with the page defaults', (state) => {
    for (const filingStatus of STATUSES) {
      for (const wages of [18000, 41600, 60000, 95000, 180000, 420000]) {
        const paycheck = calculatePaycheck({
          state,
          hourlyRate: wages / 2080,
          regularHoursPerWeek: 40,
          overtimeHoursPerWeek: 0,
          overtimeMultiplier: 1.5,
          payFrequency: 'bi-weekly',
          filingStatus,
          stateAllowances: defaultStateAllowances(state, filingStatus),
        });
        const expected = paycheck.deductions.filter((d) => isStateLineKey(d.key)).map(({ key, label, annual }) => ({ key, label, annual }));
        const got = on(state, paycheck.grossAnnual, { filingStatus });
        // same lines in the same order; amounts within a cent (the paycheck starts from an hourly rate, this from annual wages)
        expect(got.lines.map(({ key, label }) => ({ key, label })), `${state} ${filingStatus} ${wages}`).toEqual(expected.map(({ key, label }) => ({ key, label })));
        got.lines.forEach((l, i) => expect(Math.abs(l.annual - expected[i].annual), `${state} ${filingStatus} ${wages} ${l.key}`).toBeLessThanOrEqual(0.011));
        expect(got.incomeTax + got.localTax + got.payrollTotal).toBeCloseTo(got.total, 2);
      }
    }
  });
});

describe('hand-computed 2026 figures on $60,000, single', () => {
  it('Kentucky: 3.5% after the $3,270 deduction', () => {
    expect(on('KY', 60000).incomeTax).toBe(1985.55);
  });
  it('Idaho: 5.3% after the federal standard deduction', () => {
    expect(on('ID', 60000).incomeTax).toBe(2326.7); // (60,000 − 16,100) × 5.3%
  });
  it('Georgia: 4.99% after the $12,000 deduction', () => {
    expect(on('GA', 60000).incomeTax).toBe(2395.2);
  });
  it('North Carolina: withheld at 4.09% after the $12,750 deduction', () => {
    expect(on('NC', 60000).incomeTax).toBeCloseTo(1932.53, 1); // 47,250 × 4.09%
  });
  it('Utah: 4.45%, the withholding credit is phased out at this income', () => {
    expect(on('UT', 60000).incomeTax).toBe(2670);
  });
  it('Pennsylvania: 3.07% income tax, and the 0.07% unemployment tax is a payroll line', () => {
    const r = on('PA', 60000);
    expect(r.incomeTax).toBe(1842);
    expect(r.localTax).toBe(0);
    expect(r.payroll.map((l) => l.annual)).toEqual([42]);
    expect(r.total).toBe(1884);
  });
  it('Maryland: county tax at the 3.05% average is a local income tax, not a payroll line', () => {
    // one exemption by default: 60,000 − 2,550 − 3,200 = 54,250 taxable
    const r = on('MD', 60000);
    expect(r.incomeTax).toBeCloseTo(90 + (54250 - 3000) * 0.0475, 1); // 2,524.38
    expect(r.localTax).toBeCloseTo(54250 * 0.0305, 1); // 1,654.63
    expect(r.payroll).toEqual([]);
  });
  it('Oregon: the 0.1% statewide transit tax and 0.6% Paid Leave are payroll lines', () => {
    const r = on('OR', 60000);
    expect(r.localTax).toBe(0);
    expect(r.payrollTotal).toBe(420); // 360 + 60
    expect(r.incomeTax).toBeGreaterThan(0);
  });
  it('Washington: no income tax, but PFML and WA Cares come out of wages', () => {
    const r = on('WA', 60000);
    expect(r.incomeTax).toBe(0);
    expect(r.payrollTotal).toBeCloseTo(60000 * 0.008072 + 60000 * 0.0058, 2); // 832.32
  });
  it('the states with no tax on wages and no employee payroll tax take nothing', () => {
    for (const state of ['AK', 'NH', 'SD', 'WY', 'TX', 'FL', 'TN', 'NV'] as StateTaxCode[]) {
      expect(on(state, 60000)).toMatchObject({ incomeTax: 0, localTax: 0, payrollTotal: 0, total: 0, lines: [] });
    }
  });
});

describe('options', () => {
  it('another state applies the entered flat rate, and nothing without one', () => {
    expect(on('other', 60000, { customRate: 0.05 }).incomeTax).toBe(3000);
    expect(on('other', 60000).total).toBe(0);
    expect(on('other', 60000, { customRate: -1 }).total).toBe(0);
  });

  it('allowances default to the paycheck-page default and can be overridden', () => {
    expect(defaultStateAllowances('IL', 'single')).toBe(1);
    expect(defaultStateAllowances('IL', 'married')).toBe(2);
    expect(defaultStateAllowances('KY', 'married')).toBe(0);
    expect(on('IL', 60000).incomeTax).toBeCloseTo((60000 - 2925) * 0.0495, 2);
    expect(on('IL', 60000, { allowances: 0 }).incomeTax).toBe(2970);
  });

  it('payroll lines use FICA wages, income tax uses taxable wages', () => {
    const r = on('CA', 50000, { ficaWages: 60000 });
    expect(r.payrollTotal).toBe(780); // 60,000 × 1.3% SDI
    expect(r.incomeTax).toBe(on('CA', 50000).incomeTax);
  });

  it('negative wages are treated as zero', () => {
    expect(on('CA', -5).total).toBe(0);
  });

  it('a later year runs on the 2026 rule until the state publishes, and says so', () => {
    const y2026 = on('CA', 60000, { taxYear: 2026 });
    const y2027 = on('CA', 60000, { taxYear: 2027 });
    expect(y2026.rulesYear).toBe(2026);
    expect(y2027.rulesYear).toBe(2026);
    expect(y2027.lines).toEqual(y2026.lines);
    expect(on('AK', 60000, { taxYear: 2027 }).rulesYear).toBe(2027);
  });

  it('marginal rate is the tax on the next $1,000', () => {
    expect(stateMarginalRate({ state: 'PA', taxableWages: 60000, filingStatus: 'single' })).toBeCloseTo(0.0307, 6);
    expect(stateMarginalRate({ state: 'IL', taxableWages: 60000, filingStatus: 'single' })).toBeCloseTo(0.0495, 6);
    expect(stateMarginalRate({ state: 'TX', taxableWages: 60000, filingStatus: 'single' })).toBe(0);
    expect(stateMarginalRate({ state: 'other', taxableWages: 60000, filingStatus: 'single', customRate: 0.04 })).toBeCloseTo(0.04, 6);
  });
});
