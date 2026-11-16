import { describe, expect, it } from 'vitest';
import { componentsFor, computeReturn, computeTax, findCountry, presetRates, RETURN_DEFAULTS, TAX_COUNTRIES, totalRate, vatFraction } from './vat';

const rate = (code: string) => findCountry(code)!.standard;
const region = (code: string) => totalRate(componentsFor(findCountry('CA')!, code));

describe('rate table', () => {
  it('has the 27 EU members, each with a unique code', () => {
    const EU = ['AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE'];
    for (const c of EU) expect(findCountry(c), c).toBeDefined();
    expect(new Set(TAX_COUNTRIES.map((c) => c.code)).size).toBe(TAX_COUNTRIES.length);
  });
  it('standard rates match the January 2026 table', () => {
    expect([rate('GB'), rate('DE'), rate('FR'), rate('IT'), rate('ES'), rate('NL'), rate('IE')]).toEqual([20, 19, 20, 22, 21, 21, 23]);
    expect([rate('HU'), rate('FI'), rate('DK'), rate('SE'), rate('HR')]).toEqual([27, 25.5, 25, 25, 25]); // the highest
    expect([rate('EE'), rate('RO'), rate('SK')]).toEqual([24, 21, 23]); // the 2025 changes
    expect([rate('LU'), rate('MT'), rate('CH')]).toEqual([17, 18, 8.1]); // the lowest
    expect(findCountry('RO')!.reduced).toEqual([11]);
    expect(findCountry('FI')!.reduced).toEqual([10, 13.5]);
    expect(findCountry('FR')!.superReduced).toBe(2.1);
  });
  it('GST and other countries', () => {
    expect([rate('AU'), rate('NZ'), rate('SG'), rate('IN'), rate('JP'), rate('ZA'), rate('AE')]).toEqual([10, 15, 9, 18, 10, 15, 5]);
    expect(presetRates(findCountry('IN')!)).toEqual([40, 18, 5, 0]);
    expect(presetRates(findCountry('GB')!)).toEqual([20, 5, 0]);
    expect(findCountry('gb')?.name).toBe('United Kingdom');
    expect(findCountry('US')).toBeUndefined();
  });
  it('Canada: GST plus provincial tax, or a single HST', () => {
    expect(region('ON')).toBe(13);
    expect(region('NS')).toBe(14);
    expect([region('NB'), region('NL'), region('PE')]).toEqual([15, 15, 15]);
    expect(region('QC')).toBe(14.975);
    expect([region('BC'), region('MB'), region('SK')]).toEqual([12, 12, 11]);
    expect([region('AB'), region('YT'), region('NT'), region('NU')]).toEqual([5, 5, 5, 5]);
    expect(findCountry('CA')!.regions).toHaveLength(13);
    expect(componentsFor(findCountry('CA')!, 'QC').map((c) => c.label)).toEqual(['GST', 'QST']);
  });
});

describe('computeTax', () => {
  const uk = [{ label: 'VAT', rate: 20 }];
  it('adds tax to a net price', () => {
    const r = computeTax({ amount: 100, components: uk, direction: 'add' })!;
    expect(r).toMatchObject({ net: 100, tax: 20, gross: 120, ratePct: 20, fraction: '1/6' });
    expect(r.taxShareOfGrossPct).toBeCloseTo(16.667, 3);
  });
  it('removes tax from a gross price by dividing, not by taking the rate off', () => {
    const r = computeTax({ amount: 120, components: uk, direction: 'remove' })!;
    expect(r).toMatchObject({ net: 100, tax: 20, gross: 120 });
    const wrong = 120 * 0.2; // the common mistake
    expect(wrong).toBe(24);
    expect(r.tax).not.toBe(wrong);
  });
  it('splits Canadian tax into its components and keeps net + tax = gross', () => {
    const bc = componentsFor(findCountry('CA')!, 'BC');
    const add = computeTax({ amount: 100, components: bc, direction: 'add' })!;
    expect(add.components).toEqual([{ label: 'GST', rate: 5, amount: 5 }, { label: 'PST', rate: 7, amount: 7 }]);
    expect(add.gross).toBe(112);
    const qc = computeTax({ amount: 114.98, components: componentsFor(findCountry('CA')!, 'QC'), direction: 'remove' })!;
    expect(qc.components.map((c) => c.amount)).toEqual([5, 9.98]); // GST $5.00, QST $9.98 on a $100.00 net
    expect(qc.net + qc.tax).toBeCloseTo(qc.gross, 2);
    expect(qc.net).toBe(100);
  });
  it('a custom rate overrides the region', () => {
    expect(componentsFor(findCountry('CA')!, 'ON', 0)).toEqual([{ label: 'GST/HST', rate: 0 }]);
    expect(componentsFor(findCountry('DE')!, null)).toEqual([{ label: 'VAT', rate: 19 }]);
  });
  it('rounds to cents and rejects an empty amount', () => {
    const r = computeTax({ amount: 19.99, components: [{ label: 'VAT', rate: 23 }], direction: 'add' })!;
    expect(r.tax).toBe(4.6);
    expect(r.gross).toBe(24.59);
    expect(computeTax({ amount: 0, components: uk, direction: 'add' })).toBeNull();
  });
  it('tax-inclusive fractions', () => {
    expect(vatFraction(20)).toBe('1/6');
    expect(vatFraction(5)).toBe('1/21');
    expect(vatFraction(10)).toBe('1/11');
    expect(vatFraction(15)).toBe('3/23');
    expect(vatFraction(25)).toBe('1/5');
    expect(vatFraction(23)).toBe('23/123');
    expect(vatFraction(0)).toBe('0');
  });
});

describe('computeReturn', () => {
  it('output tax less input tax is what is owed', () => {
    const r = computeReturn(RETURN_DEFAULTS)!; // £48,000 sales and £18,000 purchases, both including 20%
    expect(r.netSales).toBe(40000);
    expect(r.outputTax).toBe(8000);
    expect(r.netPurchases).toBe(15000);
    expect(r.inputTax).toBe(3000);
    expect(r.payable).toBe(5000);
    expect(r.valueAdded).toBe(25000);
    expect(r.effectiveRatePct).toBeCloseTo(12.5, 6);
  });
  it('the amount owed is the rate applied to the value added when both sides use one rate', () => {
    const r = computeReturn(RETURN_DEFAULTS)!;
    expect(r.payable).toBe(r.valueAdded * 0.2);
  });
  it('more input tax than output tax is a refund', () => {
    const r = computeReturn({ sales: 10000, salesIncludeTax: false, salesRatePct: 0, purchases: 6000, purchasesIncludeTax: false, purchasesRatePct: 20 })!;
    expect(r.outputTax).toBe(0);
    expect(r.inputTax).toBe(1200);
    expect(r.payable).toBe(-1200);
    expect(computeReturn({ ...RETURN_DEFAULTS, sales: 0, purchases: 0 })).toBeNull();
  });
});
