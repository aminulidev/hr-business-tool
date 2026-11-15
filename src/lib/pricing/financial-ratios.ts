// ---------------------------------------------------------------------------
// Financial ratio suite (Roadmap v2, Phase 17): one set of statement inputs,
// every standard ratio grouped by family, with rule-of-thumb ranges. Absorbs
// the roe, roa, debt-ratio, current-ratio, quick-ratio, interest-coverage and
// asset-turnover drafts. Pure; the page article is generated from it.
// ---------------------------------------------------------------------------

export type RatioFamily = 'liquidity' | 'leverage' | 'profitability' | 'efficiency';
export const FAMILIES: { value: RatioFamily; label: string; question: string }[] = [
  { value: 'liquidity', label: 'Liquidity', question: 'Can it pay the bills due this year?' },
  { value: 'leverage', label: 'Leverage & coverage', question: 'How much is borrowed, and can earnings carry it?' },
  { value: 'profitability', label: 'Profitability', question: 'What does it earn on sales, assets and equity?' },
  { value: 'efficiency', label: 'Efficiency', question: 'How hard do assets, inventory and receivables work?' },
];
export function isRatioFamily(v: string | null): v is RatioFamily {
  return v === 'liquidity' || v === 'leverage' || v === 'profitability' || v === 'efficiency';
}

export interface FinancialStatementInput {
  // income statement (period)
  revenue: number;
  cogs: number;
  ebit: number;
  interestExpense: number;
  netIncome: number;
  depreciation: number;
  /** Scheduled principal repayments in the period (for debt service coverage) */
  principalRepayments: number;
  // balance sheet (period end)
  cash: number;
  marketableSecurities: number;
  receivables: number;
  inventory: number;
  otherCurrentAssets: number;
  totalAssets: number;
  currentLiabilities: number;
  totalDebt: number;
  totalLiabilities: number;
  equity: number;
  accountsPayable: number;
}

export type RatioFormat = 'x' | '%' | 'days' | '$';
export type Assessment = 'strong' | 'ok' | 'weak';

export interface RatioResult {
  key: string;
  family: RatioFamily;
  label: string;
  value: number | null;
  format: RatioFormat;
  formula: string;
  /** Rule-of-thumb reading, null when it depends entirely on the industry */
  assessment: Assessment | null;
  range: string;
  note: string;
}

export interface FinancialRatiosResult {
  ratios: RatioResult[];
  byFamily: Record<RatioFamily, RatioResult[]>;
  dupont: { netMargin: number | null; assetTurnover: number | null; equityMultiplier: number | null; roe: number | null };
  workingCapital: number;
  /** Balance-sheet identity check: assets − liabilities − equity */
  balanceGap: number;
}

const div = (a: number, b: number) => (b !== 0 ? a / b : null);
const pct = (a: number, b: number) => (b !== 0 ? (a / b) * 100 : null);
const grade = (v: number | null, weakBelow: number, strongAt: number, higherIsBetter = true): Assessment | null => {
  if (v === null) return null;
  if (higherIsBetter) return v < weakBelow ? 'weak' : v >= strongAt ? 'strong' : 'ok';
  return v > weakBelow ? 'weak' : v <= strongAt ? 'strong' : 'ok';
};

export function computeFinancialRatios(i: FinancialStatementInput): FinancialRatiosResult {
  const currentAssets = i.cash + i.marketableSecurities + i.receivables + i.inventory + i.otherCurrentAssets;
  const quickAssets = i.cash + i.marketableSecurities + i.receivables;
  const workingCapital = currentAssets - i.currentLiabilities;
  const ebitda = i.ebit + i.depreciation;
  const debtService = i.interestExpense + i.principalRepayments;

  const current = div(currentAssets, i.currentLiabilities);
  const quick = div(quickAssets, i.currentLiabilities);
  const cashRatio = div(i.cash + i.marketableSecurities, i.currentLiabilities);
  const debtRatio = div(i.totalLiabilities, i.totalAssets);
  const debtToEquity = div(i.totalDebt, i.equity);
  const liabilitiesToEquity = div(i.totalLiabilities, i.equity);
  const equityMultiplier = div(i.totalAssets, i.equity);
  const interestCoverage = i.interestExpense > 0 ? i.ebit / i.interestExpense : null;
  const dscr = debtService > 0 ? ebitda / debtService : null;
  const netDebtToEbitda = ebitda > 0 ? (i.totalDebt - i.cash - i.marketableSecurities) / ebitda : null;
  const grossMargin = pct(i.revenue - i.cogs, i.revenue);
  const operatingMargin = pct(i.ebit, i.revenue);
  const netMargin = pct(i.netIncome, i.revenue);
  const roa = pct(i.netIncome, i.totalAssets);
  const roe = pct(i.netIncome, i.equity);
  const roce = i.totalAssets - i.currentLiabilities > 0 ? (i.ebit / (i.totalAssets - i.currentLiabilities)) * 100 : null;
  const assetTurnover = div(i.revenue, i.totalAssets);
  const inventoryTurnover = i.inventory > 0 ? i.cogs / i.inventory : null;
  const dio = inventoryTurnover !== null && inventoryTurnover > 0 ? 365 / inventoryTurnover : null;
  const dso = i.revenue > 0 ? (i.receivables / i.revenue) * 365 : null;
  const dpo = i.cogs > 0 ? (i.accountsPayable / i.cogs) * 365 : null;
  const ccc = dio !== null && dso !== null && dpo !== null ? dio + dso - dpo : null;

  const ratios: RatioResult[] = [
    { key: 'current', family: 'liquidity', label: 'Current ratio', value: current, format: 'x', formula: 'Current assets ÷ Current liabilities', assessment: grade(current, 1, 1.5), range: '1.5 – 3.0', note: 'Below 1 means current liabilities exceed current assets; far above 3 can mean idle cash or bloated inventory.' },
    { key: 'quick', family: 'liquidity', label: 'Quick (acid-test) ratio', value: quick, format: 'x', formula: '(Cash + Securities + Receivables) ÷ Current liabilities', assessment: grade(quick, 0.8, 1), range: '≥ 1.0', note: 'Leaves inventory out, so it shows whether bills can be paid without a sale.' },
    { key: 'cash', family: 'liquidity', label: 'Cash ratio', value: cashRatio, format: 'x', formula: '(Cash + Securities) ÷ Current liabilities', assessment: grade(cashRatio, 0.2, 0.5), range: '0.5 – 1.0', note: 'The strictest test; most healthy operating businesses sit well below 1.' },
    { key: 'working-capital', family: 'liquidity', label: 'Working capital', value: workingCapital, format: '$', formula: 'Current assets − Current liabilities', assessment: workingCapital < 0 ? 'weak' : 'ok', range: 'Positive', note: 'The dollar cushion behind the current ratio.' },
    { key: 'debt-ratio', family: 'leverage', label: 'Debt ratio', value: debtRatio, format: 'x', formula: 'Total liabilities ÷ Total assets', assessment: grade(debtRatio, 0.6, 0.4, false), range: '≤ 0.5', note: 'Share of assets financed by creditors; lenders get nervous above about 0.6.' },
    { key: 'debt-to-equity', family: 'leverage', label: 'Debt-to-equity', value: debtToEquity, format: 'x', formula: 'Total debt ÷ Shareholders\' equity', assessment: grade(debtToEquity, 2, 1, false), range: '≤ 1.0 – 2.0', note: 'Interest-bearing debt only; capital-heavy industries run higher.' },
    { key: 'liabilities-to-equity', family: 'leverage', label: 'Liabilities-to-equity', value: liabilitiesToEquity, format: 'x', formula: 'Total liabilities ÷ Shareholders\' equity', assessment: null, range: 'Industry-dependent', note: 'Includes payables and accruals; useful alongside debt-to-equity.' },
    { key: 'equity-multiplier', family: 'leverage', label: 'Equity multiplier', value: equityMultiplier, format: 'x', formula: 'Total assets ÷ Shareholders\' equity', assessment: grade(equityMultiplier, 3, 2, false), range: '≤ 2.0 – 3.0', note: 'The leverage leg of the DuPont identity; 1.0 means no debt at all.' },
    { key: 'interest-coverage', family: 'leverage', label: 'Interest coverage (TIE)', value: interestCoverage, format: 'x', formula: 'EBIT ÷ Interest expense', assessment: grade(interestCoverage, 1.5, 3), range: '≥ 3.0', note: 'Times interest earned; below 1.5 the business cannot comfortably pay interest from operating profit.' },
    { key: 'dscr', family: 'leverage', label: 'Debt service coverage (DSCR)', value: dscr, format: 'x', formula: 'EBITDA ÷ (Interest + Principal repayments)', assessment: grade(dscr, 1, 1.25), range: '≥ 1.25', note: 'What a bank tests on a term loan; most covenants sit at 1.20 – 1.35.' },
    { key: 'net-debt-ebitda', family: 'leverage', label: 'Net debt ÷ EBITDA', value: netDebtToEbitda, format: 'x', formula: '(Total debt − Cash − Securities) ÷ EBITDA', assessment: grade(netDebtToEbitda, 4, 2.5, false), range: '≤ 2.5 – 3.0', note: 'Years of EBITDA needed to clear net debt; above 4 is highly levered.' },
    { key: 'gross-margin', family: 'profitability', label: 'Gross margin', value: grossMargin, format: '%', formula: '(Revenue − COGS) ÷ Revenue', assessment: null, range: 'Industry-dependent', note: 'See the Profit Margin Calculator for sector ranges.' },
    { key: 'operating-margin', family: 'profitability', label: 'Operating margin', value: operatingMargin, format: '%', formula: 'EBIT ÷ Revenue', assessment: grade(operatingMargin, 5, 15), range: '10 – 20%', note: 'Profit from running the business before financing and tax.' },
    { key: 'net-margin', family: 'profitability', label: 'Net margin', value: netMargin, format: '%', formula: 'Net income ÷ Revenue', assessment: grade(netMargin, 3, 10), range: '5 – 15%', note: 'What the owners keep from each dollar of sales.' },
    { key: 'roa', family: 'profitability', label: 'Return on assets (ROA)', value: roa, format: '%', formula: 'Net income ÷ Total assets', assessment: grade(roa, 2, 5), range: '≥ 5%', note: 'How productively the whole asset base earns; asset-light businesses score higher.' },
    { key: 'roe', family: 'profitability', label: 'Return on equity (ROE)', value: roe, format: '%', formula: 'Net income ÷ Shareholders\' equity', assessment: grade(roe, 8, 15), range: '15 – 20%', note: 'Owners\' return; leverage inflates it, which DuPont makes visible.' },
    { key: 'roce', family: 'profitability', label: 'Return on capital employed (ROCE)', value: roce, format: '%', formula: 'EBIT ÷ (Total assets − Current liabilities)', assessment: grade(roce, 8, 15), range: '≥ 12 – 15%', note: 'Pre-tax return on long-term capital; compare with the cost of borrowing.' },
    { key: 'asset-turnover', family: 'efficiency', label: 'Asset turnover', value: assetTurnover, format: 'x', formula: 'Revenue ÷ Total assets', assessment: null, range: 'Industry-dependent (0.3 utilities – 3+ grocery)', note: 'Dollars of sales per dollar of assets; the second DuPont leg.' },
    { key: 'inventory-turnover', family: 'efficiency', label: 'Inventory turnover', value: inventoryTurnover, format: 'x', formula: 'COGS ÷ Inventory', assessment: null, range: 'Industry-dependent (4 – 12 typical)', note: 'Times the stock sells through in a year.' },
    { key: 'dio', family: 'efficiency', label: 'Days inventory outstanding', value: dio, format: 'days', formula: '365 ÷ Inventory turnover', assessment: null, range: 'Industry-dependent', note: 'Average days a unit sits before it sells.' },
    { key: 'dso', family: 'efficiency', label: 'Days sales outstanding (DSO)', value: dso, format: 'days', formula: 'Receivables ÷ Revenue × 365', assessment: grade(dso, 60, 40, false), range: '30 – 45 days on net-30 terms', note: 'Average collection time; compare with your payment terms.' },
    { key: 'dpo', family: 'efficiency', label: 'Days payables outstanding (DPO)', value: dpo, format: 'days', formula: 'Accounts payable ÷ COGS × 365', assessment: null, range: '30 – 60 days', note: 'How long you take to pay suppliers; longer helps cash but strains relationships.' },
    { key: 'ccc', family: 'efficiency', label: 'Cash conversion cycle', value: ccc, format: 'days', formula: 'DIO + DSO − DPO', assessment: ccc === null ? null : ccc < 0 ? 'strong' : ccc <= 60 ? 'ok' : 'weak', range: 'Shorter is better; negative is excellent', note: 'Days between paying for inventory and collecting the sale.' },
  ];

  const byFamily = { liquidity: [], leverage: [], profitability: [], efficiency: [] } as Record<RatioFamily, RatioResult[]>;
  for (const r of ratios) byFamily[r.family].push(r);

  return {
    ratios,
    byFamily,
    dupont: { netMargin, assetTurnover, equityMultiplier, roe: netMargin !== null && assetTurnover !== null && equityMultiplier !== null ? (netMargin / 100) * assetTurnover * equityMultiplier * 100 : null },
    workingCapital,
    balanceGap: i.totalAssets - i.totalLiabilities - i.equity,
  };
}

export function formatRatio(value: number | null, format: RatioFormat): string {
  if (value === null) return '—';
  if (format === 'x') return `${value.toFixed(2)}×`;
  if (format === '%') return `${value.toFixed(1)}%`;
  if (format === 'days') return `${Math.round(value)} days`;
  return value.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
}

export const RATIO_DEFAULTS: FinancialStatementInput = {
  revenue: 2400000,
  cogs: 1320000,
  ebit: 312000,
  interestExpense: 48000,
  netIncome: 205000,
  depreciation: 60000,
  principalRepayments: 90000,
  cash: 180000,
  marketableSecurities: 40000,
  receivables: 260000,
  inventory: 310000,
  otherCurrentAssets: 30000,
  totalAssets: 1900000,
  currentLiabilities: 420000,
  totalDebt: 650000,
  totalLiabilities: 1050000,
  equity: 850000,
  accountsPayable: 190000,
};
