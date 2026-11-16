// ---------------------------------------------------------------------------
// VAT / GST engine — Phase 17: one page with country presets replaces the
// separate vat-calculator and gst-calculator drafts.
//
// Rates (checked Nov 2026):
//  - Europe: Tax Foundation, "VAT Rates in Europe, as of January 2026"
//    (standard, reduced and super-reduced rates for the 27 EU members, the UK,
//    Norway, Switzerland, Iceland and Turkey).
//  - United Kingdom: GOV.UK "VAT rates" (20% standard, 5% reduced, 0% zero).
//  - Canada: 2026 GST/HST/PST/QST by province; Nova Scotia's 14% HST (from
//    April 1, 2025) confirmed on canada.ca.
//  - India: 5% and 18% slabs plus 40% on luxury and sin goods since
//    September 22, 2025.
//  - Australia 10%, New Zealand 15%, Singapore 9%, Japan 10% (8% reduced),
//    South Africa 15%, United Arab Emirates 5%: national standard rates in
//    force in 2026.
// Rates change; every rate is also a free input in the UI.
// ---------------------------------------------------------------------------

const round2 = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;
const v = (n: number) => (Number.isFinite(n) ? Math.max(0, n) : 0);

export type VatMode = 'calc' | 'return';
export const VAT_MODES: { value: VatMode; label: string; short: string }[] = [
  { value: 'calc', label: 'Add or remove tax', short: 'Calculate' },
  { value: 'return', label: 'VAT / GST return', short: 'Return' },
];
export const isVatMode = (x: string | null): x is VatMode => VAT_MODES.some((m) => m.value === x);

export interface TaxComponent {
  label: string;
  rate: number;
}

export interface TaxRegion {
  code: string;
  name: string;
  components: TaxComponent[];
}

export type TaxGroup = 'Europe' | 'Americas' | 'Asia-Pacific' | 'Africa and Middle East';

export interface TaxCountry {
  code: string;
  name: string;
  /** What the tax is called locally */
  taxName: string;
  currency: string;
  group: TaxGroup;
  standard: number;
  reduced: number[];
  superReduced?: number;
  /** Other rates worth offering as presets (zero, luxury) */
  other?: number[];
  note?: string;
  regions?: TaxRegion[];
}

const eu = (code: string, name: string, standard: number, reduced: number[], currency = 'EUR', superReduced?: number): TaxCountry => ({ code, name, taxName: 'VAT', currency, group: 'Europe', standard, reduced, superReduced });
const gstPst = (code: string, name: string, pst: number, pstLabel = 'PST'): TaxRegion => ({ code, name, components: [{ label: 'GST', rate: 5 }, { label: pstLabel, rate: pst }] });
const hst = (code: string, name: string, rate: number): TaxRegion => ({ code, name, components: [{ label: 'HST', rate }] });
const gstOnly = (code: string, name: string): TaxRegion => ({ code, name, components: [{ label: 'GST', rate: 5 }] });

export const TAX_COUNTRIES: TaxCountry[] = [
  // ---- Europe (Tax Foundation, January 2026) ----
  { ...eu('GB', 'United Kingdom', 20, [5], 'GBP'), other: [0], note: 'Zero rate covers most food and children\'s clothes; the 5% rate covers home energy and children\'s car seats.' },
  eu('IE', 'Ireland', 23, [9, 13.5], 'EUR', 4.8),
  eu('DE', 'Germany', 19, [7]),
  eu('FR', 'France', 20, [5.5, 10], 'EUR', 2.1),
  eu('IT', 'Italy', 22, [5, 10], 'EUR', 4),
  eu('ES', 'Spain', 21, [10], 'EUR', 4),
  eu('NL', 'Netherlands', 21, [9]),
  eu('BE', 'Belgium', 21, [6, 12]),
  eu('AT', 'Austria', 20, [10, 13]),
  eu('PT', 'Portugal', 23, [6, 13]),
  eu('SE', 'Sweden', 25, [6, 12], 'SEK'),
  eu('DK', 'Denmark', 25, [], 'DKK'),
  eu('FI', 'Finland', 25.5, [10, 13.5]),
  eu('PL', 'Poland', 23, [5, 8], 'PLN'),
  eu('CZ', 'Czech Republic', 21, [12], 'CZK'),
  eu('GR', 'Greece', 24, [6, 13]),
  eu('HU', 'Hungary', 27, [5, 18], 'HUF'),
  eu('RO', 'Romania', 21, [11], 'RON'),
  eu('BG', 'Bulgaria', 20, [9]),
  eu('HR', 'Croatia', 25, [5, 13]),
  eu('SK', 'Slovakia', 23, [5, 19]),
  eu('SI', 'Slovenia', 22, [5, 9.5]),
  eu('EE', 'Estonia', 24, [9, 13]),
  eu('LV', 'Latvia', 21, [5, 12]),
  eu('LT', 'Lithuania', 21, [5, 9]),
  eu('LU', 'Luxembourg', 17, [8], 'EUR', 3),
  eu('MT', 'Malta', 18, [5, 7]),
  eu('CY', 'Cyprus', 19, [5, 9]),
  eu('NO', 'Norway', 25, [12, 15], 'NOK'),
  eu('CH', 'Switzerland', 8.1, [2.6, 3.8], 'CHF'),
  eu('IS', 'Iceland', 24, [11], 'ISK'),
  { ...eu('TR', 'Turkey', 20, [10], 'TRY', 1), taxName: 'KDV (VAT)' },
  // ---- Americas ----
  {
    code: 'CA', name: 'Canada', taxName: 'GST/HST', currency: 'CAD', group: 'Americas', standard: 5, reduced: [], other: [0],
    note: 'The federal GST is 5% everywhere. HST provinces charge one combined rate; other provinces add their own PST, RST or QST.',
    regions: [
      hst('ON', 'Ontario', 13),
      gstPst('QC', 'Quebec', 9.975, 'QST'),
      gstPst('BC', 'British Columbia', 7),
      gstOnly('AB', 'Alberta'),
      gstPst('MB', 'Manitoba', 7, 'RST'),
      gstPst('SK', 'Saskatchewan', 6),
      hst('NS', 'Nova Scotia', 14),
      hst('NB', 'New Brunswick', 15),
      hst('NL', 'Newfoundland and Labrador', 15),
      hst('PE', 'Prince Edward Island', 15),
      gstOnly('NT', 'Northwest Territories'),
      gstOnly('NU', 'Nunavut'),
      gstOnly('YT', 'Yukon'),
    ],
  },
  // ---- Asia-Pacific ----
  { code: 'AU', name: 'Australia', taxName: 'GST', currency: 'AUD', group: 'Asia-Pacific', standard: 10, reduced: [], other: [0], note: 'Most basic food, some health and education services are GST-free.' },
  { code: 'NZ', name: 'New Zealand', taxName: 'GST', currency: 'NZD', group: 'Asia-Pacific', standard: 15, reduced: [], other: [0] },
  { code: 'IN', name: 'India', taxName: 'GST', currency: 'INR', group: 'Asia-Pacific', standard: 18, reduced: [5], other: [0, 40], note: 'Since September 22, 2025 most goods and services fall in the 5% or 18% slab, with 40% on luxury and sin goods. Within a state the tax is split equally into CGST and SGST.' },
  { code: 'SG', name: 'Singapore', taxName: 'GST', currency: 'SGD', group: 'Asia-Pacific', standard: 9, reduced: [], other: [0] },
  { code: 'JP', name: 'Japan', taxName: 'Consumption tax', currency: 'JPY', group: 'Asia-Pacific', standard: 10, reduced: [8], note: 'The 8% rate applies to food and non-alcoholic drinks.' },
  // ---- Africa and Middle East ----
  { code: 'ZA', name: 'South Africa', taxName: 'VAT', currency: 'ZAR', group: 'Africa and Middle East', standard: 15, reduced: [], other: [0] },
  { code: 'AE', name: 'United Arab Emirates', taxName: 'VAT', currency: 'AED', group: 'Africa and Middle East', standard: 5, reduced: [], other: [0] },
];

export const TAX_GROUPS: TaxGroup[] = ['Europe', 'Americas', 'Asia-Pacific', 'Africa and Middle East'];
export const findCountry = (code: string | null | undefined): TaxCountry | undefined => TAX_COUNTRIES.find((c) => c.code === (code ?? '').toUpperCase());

/** Every preset rate for a country, highest first, without duplicates */
export function presetRates(c: TaxCountry): number[] {
  return [...new Set([c.standard, ...c.reduced, ...(c.superReduced !== undefined ? [c.superReduced] : []), ...(c.other ?? [])])].sort((a, b) => b - a);
}

/** The tax components to apply: a region's components, or the single national rate */
export function componentsFor(c: TaxCountry, regionCode: string | null | undefined, rate?: number): TaxComponent[] {
  const region = c.regions?.find((r) => r.code === regionCode);
  if (region && rate === undefined) return region.components;
  return [{ label: c.taxName, rate: rate ?? c.standard }];
}

export const totalRate = (components: TaxComponent[]) => round2(components.reduce((s, c) => s + v(c.rate), 0) * 1000) / 1000;

// ───────────────────────── add / remove

export type Direction = 'add' | 'remove';

export interface TaxInput {
  amount: number;
  components: TaxComponent[];
  /** add: the amount excludes tax. remove: the amount includes tax. */
  direction: Direction;
}

export interface TaxResult {
  net: number;
  tax: number;
  gross: number;
  ratePct: number;
  components: { label: string; rate: number; amount: number }[];
  /** Tax as a share of the tax-inclusive price */
  taxShareOfGrossPct: number;
  /** The fraction of a tax-inclusive price that is tax, e.g. 1/6 at 20% */
  fraction: string;
}

const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));

/** Tax-inclusive fraction: rate ÷ (100 + rate) in lowest terms, e.g. 20% → 1/6 */
export function vatFraction(ratePct: number): string {
  const scaled = Math.round(v(ratePct) * 1000);
  if (scaled === 0) return '0';
  const num = scaled;
  const den = 100000 + scaled;
  const g = gcd(num, den);
  return `${num / g}/${den / g}`;
}

export function computeTax(i: TaxInput): TaxResult | null {
  const amount = v(i.amount);
  if (amount <= 0) return null;
  const comps = i.components.map((c) => ({ label: c.label, rate: v(c.rate) }));
  const rate = comps.reduce((s, c) => s + c.rate, 0);
  const net = i.direction === 'add' ? amount : amount / (1 + rate / 100);
  const parts = comps.map((c) => ({ ...c, amount: round2(net * (c.rate / 100)) }));
  const tax = round2(parts.reduce((s, p) => s + p.amount, 0));
  const netR = i.direction === 'add' ? round2(amount) : round2(amount - tax);
  const gross = i.direction === 'add' ? round2(amount + tax) : round2(amount);
  return {
    net: netR,
    tax,
    gross,
    ratePct: round2(rate * 1000) / 1000,
    components: parts,
    taxShareOfGrossPct: gross > 0 ? (tax / gross) * 100 : 0,
    fraction: vatFraction(rate),
  };
}

// ───────────────────────── VAT / GST return

export interface ReturnInput {
  sales: number;
  salesIncludeTax: boolean;
  salesRatePct: number;
  purchases: number;
  purchasesIncludeTax: boolean;
  purchasesRatePct: number;
}

export interface ReturnResult {
  netSales: number;
  /** Tax charged to customers */
  outputTax: number;
  netPurchases: number;
  /** Tax paid to suppliers that can be reclaimed */
  inputTax: number;
  /** Output − input: positive is owed to the tax authority, negative is a refund */
  payable: number;
  valueAdded: number;
  /** Payable ÷ net sales */
  effectiveRatePct: number | null;
}

export function computeReturn(i: ReturnInput): ReturnResult | null {
  const sales = v(i.sales);
  const purchases = v(i.purchases);
  if (sales <= 0 && purchases <= 0) return null;
  const split = (amount: number, rate: number, inclusive: boolean) => {
    const r = v(rate) / 100;
    const net = inclusive ? amount / (1 + r) : amount;
    return { net: round2(net), tax: round2(net * r) };
  };
  const s = split(sales, i.salesRatePct, i.salesIncludeTax);
  const p = split(purchases, i.purchasesRatePct, i.purchasesIncludeTax);
  return {
    netSales: s.net,
    outputTax: s.tax,
    netPurchases: p.net,
    inputTax: p.tax,
    payable: round2(s.tax - p.tax),
    valueAdded: round2(s.net - p.net),
    effectiveRatePct: s.net > 0 ? ((s.tax - p.tax) / s.net) * 100 : null,
  };
}

export const VAT_DEFAULTS = { country: 'GB', amount: 100, direction: 'add' as Direction };
export const RETURN_DEFAULTS: ReturnInput = { sales: 48000, salesIncludeTax: true, salesRatePct: 20, purchases: 18000, purchasesIncludeTax: true, purchasesRatePct: 20 };

export function formatMoney(n: number, currency: string): string {
  try {
    return n.toLocaleString('en-US', { style: 'currency', currency });
  } catch {
    return `${currency} ${n.toFixed(2)}`;
  }
}
