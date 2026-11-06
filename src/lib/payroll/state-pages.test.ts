import { describe, expect, it } from 'vitest';
import { buildStatePaycheckSeo, STATE_CODES, STATE_PAYCHECK_PAGES } from './state-pages';
import { STATE_DETAILS } from './state-details';
import { calculatePaycheck, PERIODS_PER_YEAR, type StateCode } from './withholding-2026';

// The state pages' article text is generated from the engine. These tests make
// sure the numbers a reader sees agree with each other and with the engine —
// a reader can check "gross − withheld = take-home" on the page, so we do too.

const NO_INCOME_TAX: StateCode[] = ['TX', 'FL', 'TN', 'NV'];

/** "$1,234.56" → 1234.56 */
const money = (s: string) => Number(s.replace(/[$,]/g, ''));
const allMoney = (s: string) => [...s.matchAll(/\$[\d,]+\.\d{2}/g)].map((m) => money(m[0]));

describe.each(STATE_CODES)('%s state paycheck page', (code) => {
  const page = STATE_PAYCHECK_PAGES[code];
  const seo = buildStatePaycheckSeo(code);

  it('has the sections the layout renders', () => {
    expect(seo.howToSteps.length).toBeGreaterThanOrEqual(4);
    expect(seo.workedExamples.length).toBeGreaterThanOrEqual(3);
    expect(seo.faqs.length).toBeGreaterThanOrEqual(5);
    expect(seo.benchmarkTables![0].rows.length).toBeGreaterThanOrEqual(8);
    expect(seo.relatedTools.length).toBeGreaterThanOrEqual(3);
    expect(page.sources.length).toBeGreaterThanOrEqual(1);
  });

  it('worked examples: gross − withheld = take-home, per paycheck and per year', () => {
    for (const ex of seo.workedExamples) {
      const gross = ex.description.match(/Gross pay is (\$[\d,]+\.\d{2}) per paycheck \((\$[\d,]+\.\d{2}) a year\)/);
      const net = ex.description.match(/Take-home pay: (\$[\d,]+\.\d{2}) per paycheck, or (\$[\d,]+\.\d{2}) a year/);
      const withheld = ex.description.match(/Withheld per paycheck: (.*?)\. Take-home/);
      expect(gross, ex.title).not.toBeNull();
      expect(net, ex.title).not.toBeNull();
      expect(withheld, ex.title).not.toBeNull();

      const [grossPer, grossYear] = [money(gross![1]), money(gross![2])];
      const [netPer, netYear] = [money(net![1]), money(net![2])];
      const periods = Math.round(grossYear / grossPer);
      expect(Object.values(PERIODS_PER_YEAR), `${ex.title}: periods ${periods}`).toContain(periods);

      const withheldPer = allMoney(withheld![1]).reduce((a, b) => a + b, 0);
      // per-paycheck lines are each rounded to cents, so allow a cent per line
      const lines = allMoney(withheld![1]).length;
      expect(Math.abs(grossPer - withheldPer - netPer), `${ex.title}: per-paycheck arithmetic`).toBeLessThanOrEqual(
        0.01 * (lines + 1),
      );
      // annual figures: netYear is exact, netPer is rounded → ±0.5¢ × periods
      expect(Math.abs(netPer * periods - netYear), `${ex.title}: annual vs per-paycheck`).toBeLessThanOrEqual(
        0.006 * periods,
      );
    }
  });

  it('benchmark table: each row balances and the state column is only state money', () => {
    const table = seo.benchmarkTables![0];
    expect(table.headers).toHaveLength(7);
    for (const row of table.rows) {
      const [label, grossAnnual, grossPer, fedFica, stateTax, netPer, netAnnual] = row.map((c, i) =>
        i === 0 ? c : money(c),
      ) as [string, number, number, number, number, number, number];
      expect(Math.abs(grossPer - fedFica - stateTax - netPer), `${code} ${label}`).toBeLessThanOrEqual(0.05);
      expect(Math.abs(grossAnnual - grossPer * 26), `${code} ${label}`).toBeLessThanOrEqual(0.5);
      expect(Math.abs(netAnnual - netPer * 26), `${code} ${label}`).toBeLessThanOrEqual(0.5);

      // Recompute Federal + FICA from the engine; the column must contain
      // federal income tax, Social Security AND Medicare — nothing else.
      const rate = money(label.replace(/\/hr.*$/, ''));
      const r = calculatePaycheck({
        state: code,
        hourlyRate: rate,
        regularHoursPerWeek: 40,
        overtimeHoursPerWeek: 0,
        overtimeMultiplier: 1.5,
        payFrequency: 'bi-weekly',
        filingStatus: 'single',
        stateAllowances: page.allowances?.defaultSingle ?? 0,
      });
      const expectedFedFica = r.deductions
        .filter((d) => ['federal', 'social-security', 'medicare'].includes(d.key))
        .reduce((s, d) => s + d.perPeriod, 0);
      expect(fedFica, `${code} ${label}: Federal + FICA column`).toBeCloseTo(expectedFedFica, 1);

      if (NO_INCOME_TAX.includes(code)) {
        expect(stateTax, `${code} ${label}: no-income-tax state must show $0 state tax`).toBe(0);
      }
    }
  });

  it('cites the right tax year and the state name, not another state', () => {
    const text = JSON.stringify(seo);
    expect(text).toContain('2026');
    expect(text).toContain(page.name);
    expect(seo.howToSteps[0]).toContain(page.name);
  });
});

describe('state slugs', () => {
  it('match the registry naming convention', () => {
    for (const code of STATE_CODES) {
      const page = STATE_PAYCHECK_PAGES[code];
      expect(page.slug).toBe(`${page.name.toLowerCase().replace(/\s+/g, '-')}-hourly-paycheck-calculator`);
      expect(page.code).toBe(code);
    }
  });
});

// ---------------------------------------------------------------------------
// Phase 15.3 — every state page must differ from every other state page in the
// parts a template could otherwise stamp out: FAQs, 2026 changes, overtime
// details, local wage tables. The neighbour comparison is engine-generated, so
// it is checked against the engine like the other tables.
// ---------------------------------------------------------------------------
describe('state pages are not templated (Phase 15.3)', () => {
  const seos = Object.fromEntries(STATE_CODES.map((c) => [c, buildStatePaycheckSeo(c)])) as Record<
    StateCode,
    ReturnType<typeof buildStatePaycheckSeo>
  >;

  const duplicates = (items: { code: StateCode; text: string }[]) => {
    const seen = new Map<string, StateCode>();
    const out: string[] = [];
    for (const { code, text } of items) {
      const key = text.trim().toLowerCase();
      if (seen.has(key) && seen.get(key) !== code) out.push(`${seen.get(key)} & ${code}: "${text.slice(0, 70)}"`);
      seen.set(key, code);
    }
    return out;
  };

  it('each state has at least two hand-written FAQs that appear on no other state page', () => {
    for (const code of STATE_CODES) {
      expect(STATE_PAYCHECK_PAGES[code].extraFaqs.length, `${code} extraFaqs`).toBeGreaterThanOrEqual(2);
    }
    const qs = STATE_CODES.flatMap((code) => STATE_PAYCHECK_PAGES[code].extraFaqs.map((f) => ({ code, text: f.question })));
    const as = STATE_CODES.flatMap((code) => STATE_PAYCHECK_PAGES[code].extraFaqs.map((f) => ({ code, text: f.answer })));
    expect([...duplicates(qs), ...duplicates(as)].join('\n')).toBe('');
  });

  it('2026 change bullets, overtime details and tax summaries are unique per state', () => {
    const changes = STATE_CODES.flatMap((code) => STATE_DETAILS[code].changes2026.map((text) => ({ code, text })));
    const overtime = STATE_CODES.flatMap((code) => STATE_DETAILS[code].overtimeDetail.map((text) => ({ code, text })));
    const summaries = STATE_CODES.map((code) => ({ code, text: STATE_PAYCHECK_PAGES[code].stateTaxSummary }));
    const minWage = STATE_CODES.map((code) => ({ code, text: STATE_PAYCHECK_PAGES[code].minimumWageNote }));
    for (const code of STATE_CODES) {
      expect(STATE_DETAILS[code].changes2026.length, `${code} changes2026`).toBeGreaterThanOrEqual(2);
      expect(STATE_DETAILS[code].overtimeDetail.length, `${code} overtimeDetail`).toBeGreaterThanOrEqual(1);
      expect(STATE_DETAILS[code].neighbors.length, `${code} neighbors`).toBeGreaterThanOrEqual(1);
      for (const n of STATE_DETAILS[code].neighbors) expect(STATE_CODES, `${code} neighbour ${n}`).toContain(n);
    }
    expect([...duplicates(changes), ...duplicates(overtime), ...duplicates(summaries), ...duplicates(minWage)].join('\n')).toBe('');
  });

  it('worked examples use the state median wage, so no two states share a scenario', () => {
    const titles = STATE_CODES.flatMap((code) => seos[code].workedExamples.map((e) => ({ code, text: e.title })));
    expect(duplicates(titles).join('\n')).toBe('');
    for (const code of STATE_CODES) {
      const { medianHourlyWage } = STATE_DETAILS[code];
      expect(medianHourlyWage, code).toBeGreaterThan(STATE_PAYCHECK_PAGES[code].minimumWage);
      expect(medianHourlyWage, code).toBeLessThan(45);
      expect(JSON.stringify(seos[code].workedExamples)).toContain(medianHourlyWage.toFixed(2));
    }
  });

  it('local minimum wage tables never repeat a row across states; every state has a table or a pre-emption note', () => {
    const rows = STATE_CODES.flatMap((code) =>
      (STATE_DETAILS[code].localMinimumWages ?? []).map((l) => ({ code, text: `${l.jurisdiction} ${l.rate}` })),
    );
    expect(duplicates(rows).join('\n')).toBe('');
    for (const code of STATE_CODES) {
      const d = STATE_DETAILS[code];
      expect(!!d.localMinimumWages !== !!d.localMinimumWageNote, `${code}: either a local table or a pre-emption note`).toBe(true);
    }
  });

  it.each(STATE_CODES)('%s neighbour comparison table balances against the engine', (code) => {
    const table = seos[code].benchmarkTables!.find((t) => t.title.includes('Neighboring States'))!;
    expect(table).toBeDefined();
    const median = STATE_DETAILS[code].medianHourlyWage;
    for (const row of table.rows) {
      const [name, statePer, netPer, netAnnual] = row;
      const rowCode = STATE_CODES.find((c) => STATE_PAYCHECK_PAGES[c].name === name)!;
      expect(rowCode, `${code}: row "${name}"`).toBeDefined();
      const r = calculatePaycheck({
        state: rowCode,
        hourlyRate: median,
        regularHoursPerWeek: 40,
        overtimeHoursPerWeek: 0,
        overtimeMultiplier: 1.5,
        payFrequency: 'bi-weekly',
        filingStatus: 'single',
        stateAllowances: STATE_PAYCHECK_PAGES[rowCode].allowances?.defaultSingle ?? 0,
      });
      const expectedState = r.deductions
        .filter((d) => !['federal', 'social-security', 'medicare'].includes(d.key))
        .reduce((s, d) => s + d.perPeriod, 0);
      expect(money(statePer), `${code}/${name} state column`).toBeCloseTo(expectedState, 1);
      expect(money(netPer), `${code}/${name} net per period`).toBeCloseTo(r.netPerPeriod, 1);
      expect(money(netAnnual), `${code}/${name} net annual`).toBeCloseTo(r.netAnnual, 0);
    }
    // first row is the state itself, every other row a declared neighbour
    expect(table.rows[0][0]).toBe(STATE_PAYCHECK_PAGES[code].name);
    expect(table.rows.length).toBe(STATE_DETAILS[code].neighbors.length + 1);
  });
});
