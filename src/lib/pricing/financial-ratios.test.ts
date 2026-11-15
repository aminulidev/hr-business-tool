import { describe, expect, it } from 'vitest';
import { computeFinancialRatios, FAMILIES, formatRatio, RATIO_DEFAULTS } from './financial-ratios';

const get = (r: ReturnType<typeof computeFinancialRatios>, key: string) => r.ratios.find((x) => x.key === key)!;

describe('computeFinancialRatios', () => {
  const r = computeFinancialRatios(RATIO_DEFAULTS);

  it('liquidity ratios from the component balances', () => {
    // current assets 180 + 40 + 260 + 310 + 30 = 820k; current liabilities 420k
    expect(get(r, 'current').value).toBeCloseTo(820000 / 420000, 6);
    expect(get(r, 'quick').value).toBeCloseTo(480000 / 420000, 6);
    expect(get(r, 'cash').value).toBeCloseTo(220000 / 420000, 6);
    expect(r.workingCapital).toBe(400000);
    expect(get(r, 'current').assessment).toBe('strong');
    expect(get(r, 'quick').assessment).toBe('strong');
  });

  it('leverage and coverage', () => {
    expect(get(r, 'debt-ratio').value).toBeCloseTo(1050000 / 1900000, 6);
    expect(get(r, 'debt-to-equity').value).toBeCloseTo(650000 / 850000, 6);
    expect(get(r, 'equity-multiplier').value).toBeCloseTo(1900000 / 850000, 6);
    expect(get(r, 'interest-coverage').value).toBeCloseTo(312000 / 48000, 6); // 6.5×
    expect(get(r, 'dscr').value).toBeCloseTo(372000 / 138000, 6);
    expect(get(r, 'net-debt-ebitda').value).toBeCloseTo((650000 - 220000) / 372000, 6);
    expect(get(r, 'interest-coverage').assessment).toBe('strong');
    expect(get(r, 'debt-ratio').assessment).toBe('ok'); // 0.55: between 0.4 and 0.6
  });

  it('profitability and the DuPont identity', () => {
    expect(get(r, 'net-margin').value).toBeCloseTo((205000 / 2400000) * 100, 6);
    expect(get(r, 'roa').value).toBeCloseTo((205000 / 1900000) * 100, 6);
    expect(get(r, 'roe').value).toBeCloseTo((205000 / 850000) * 100, 6);
    expect(r.dupont.roe).toBeCloseTo(get(r, 'roe').value!, 6); // margin × turnover × multiplier
    expect(get(r, 'roce').value).toBeCloseTo((312000 / (1900000 - 420000)) * 100, 6);
  });

  it('efficiency and the cash conversion cycle', () => {
    expect(get(r, 'asset-turnover').value).toBeCloseTo(2400000 / 1900000, 6);
    expect(get(r, 'inventory-turnover').value).toBeCloseTo(1320000 / 310000, 6);
    const dio = 365 / (1320000 / 310000);
    const dso = (260000 / 2400000) * 365;
    const dpo = (190000 / 1320000) * 365;
    expect(get(r, 'dio').value).toBeCloseTo(dio, 6);
    expect(get(r, 'dso').value).toBeCloseTo(dso, 6);
    expect(get(r, 'dpo').value).toBeCloseTo(dpo, 6);
    expect(get(r, 'ccc').value).toBeCloseTo(dio + dso - dpo, 6);
  });

  it('returns null instead of dividing by zero, and flags an unbalanced balance sheet', () => {
    const z = computeFinancialRatios({ ...RATIO_DEFAULTS, currentLiabilities: 0, interestExpense: 0, inventory: 0, equity: 0 });
    expect(get(z, 'current').value).toBeNull();
    expect(get(z, 'interest-coverage').value).toBeNull();
    expect(get(z, 'inventory-turnover').value).toBeNull();
    expect(get(z, 'roe').value).toBeNull();
    expect(z.dupont.roe).toBeNull();
    expect(r.balanceGap).toBe(0);
    expect(computeFinancialRatios({ ...RATIO_DEFAULTS, equity: 800000 }).balanceGap).toBe(50000);
  });

  it('covers every family and formats values', () => {
    for (const f of FAMILIES) expect(r.byFamily[f.value].length).toBeGreaterThanOrEqual(4);
    expect(formatRatio(1.95238, 'x')).toBe('1.95×');
    expect(formatRatio(8.54, '%')).toBe('8.5%');
    expect(formatRatio(39.6, 'days')).toBe('40 days');
    expect(formatRatio(400000, '$')).toBe('$400,000');
    expect(formatRatio(null, 'x')).toBe('—');
  });
});
