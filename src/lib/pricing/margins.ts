// ---------------------------------------------------------------------------
// Margin suite math (Roadmap v2, Phase 17): the three modes added to the
// Profit Margin & Markup Calculator when the net-margin, operating-margin,
// contribution-margin, selling-price and wholesale-price drafts were folded
// in. Pure functions; the article on the page is generated from them.
// ---------------------------------------------------------------------------

const round2 = (n: number) => Math.round(n * 100) / 100;
const pct = (num: number, den: number) => (den > 0 ? (num / den) * 100 : 0);

// ───────────────────────── margin ladder (gross → operating → net)

export interface MarginLadderInput {
  revenue: number;
  /** Cost of goods sold / cost of sales */
  cogs: number;
  /** Selling, general & administrative and other operating expenses (excluding D&A below) */
  operatingExpenses: number;
  depreciation: number;
  interest: number;
  taxes: number;
}

export interface MarginLadderResult {
  grossProfit: number;
  grossMargin: number;
  ebitda: number;
  ebitdaMargin: number;
  operatingIncome: number;
  operatingMargin: number;
  pretaxIncome: number;
  pretaxMargin: number;
  netIncome: number;
  netMargin: number;
  /** Each cost layer as % of revenue, in statement order */
  layers: { key: string; label: string; amount: number; pctOfRevenue: number }[];
}

export function computeMarginLadder(i: MarginLadderInput): MarginLadderResult {
  const revenue = Math.max(0, i.revenue);
  const cogs = Math.max(0, i.cogs);
  const opex = Math.max(0, i.operatingExpenses);
  const da = Math.max(0, i.depreciation);
  const interest = Math.max(0, i.interest);
  const taxes = Math.max(0, i.taxes);
  const grossProfit = revenue - cogs;
  const ebitda = grossProfit - opex;
  const operatingIncome = ebitda - da;
  const pretaxIncome = operatingIncome - interest;
  const netIncome = pretaxIncome - taxes;
  return {
    grossProfit: round2(grossProfit),
    grossMargin: pct(grossProfit, revenue),
    ebitda: round2(ebitda),
    ebitdaMargin: pct(ebitda, revenue),
    operatingIncome: round2(operatingIncome),
    operatingMargin: pct(operatingIncome, revenue),
    pretaxIncome: round2(pretaxIncome),
    pretaxMargin: pct(pretaxIncome, revenue),
    netIncome: round2(netIncome),
    netMargin: pct(netIncome, revenue),
    layers: [
      { key: 'cogs', label: 'Cost of goods sold', amount: round2(cogs), pctOfRevenue: pct(cogs, revenue) },
      { key: 'opex', label: 'Operating expenses (SG&A)', amount: round2(opex), pctOfRevenue: pct(opex, revenue) },
      { key: 'da', label: 'Depreciation & amortization', amount: round2(da), pctOfRevenue: pct(da, revenue) },
      { key: 'interest', label: 'Interest', amount: round2(interest), pctOfRevenue: pct(interest, revenue) },
      { key: 'taxes', label: 'Income taxes', amount: round2(taxes), pctOfRevenue: pct(taxes, revenue) },
    ],
  };
}

export const MARGIN_LADDER_DEFAULTS: MarginLadderInput = {
  revenue: 1200000,
  cogs: 540000,
  operatingExpenses: 420000,
  depreciation: 30000,
  interest: 18000,
  taxes: 40000,
};

/**
 * Typical ranges by sector for the three margins. Rules of thumb, not data:
 * for exact figures by industry use the NYU Stern (Damodaran) margin dataset,
 * which is linked from the page.
 */
export const MARGIN_RANGES: { label: string; gross: string; operating: string; net: string; note: string }[] = [
  { label: 'Software / SaaS', gross: '70–85%', operating: '10–30%', net: '5–25%', note: 'Low cost to serve; operating margin depends on how much is reinvested in sales and R&D' },
  { label: 'Retail (general)', gross: '25–45%', operating: '3–8%', net: '2–5%', note: 'Thin net margins made up in volume; grocery sits at the bottom, specialty at the top' },
  { label: 'Restaurants', gross: '60–70%*', operating: '5–12%', net: '3–8%', note: '*Food cost only; once labor is counted the "prime cost" leaves 30–40% before rent and overhead' },
  { label: 'Manufacturing', gross: '20–35%', operating: '8–15%', net: '5–10%', note: 'Capital-heavy; depreciation separates EBITDA from operating margin' },
  { label: 'Professional services', gross: '40–60%', operating: '10–25%', net: '8–20%', note: 'Billable staff cost is COGS; partner draws blur the line between pay and profit' },
  { label: 'Construction', gross: '15–30%', operating: '4–10%', net: '2–6%', note: 'Project accounting; change orders and overruns swing the gross line' },
  { label: 'Healthcare providers', gross: '30–50%', operating: '5–15%', net: '3–10%', note: 'Reimbursement rates drive the top line; staffing drives the cost line' },
];

// ───────────────────────── contribution margin & break-even

export interface ContributionInput {
  price: number;
  variableCost: number;
  units: number;
  fixedCosts: number;
}

export interface ContributionResult {
  cmPerUnit: number;
  cmRatio: number;
  variableCostRatio: number;
  totalRevenue: number;
  totalVariableCost: number;
  totalContribution: number;
  operatingIncome: number;
  breakEvenUnits: number | null;
  breakEvenRevenue: number | null;
  /** Units above break-even as a share of units sold */
  marginOfSafety: number | null;
  /** Degree of operating leverage = total CM ÷ operating income */
  operatingLeverage: number | null;
}

export function computeContribution(i: ContributionInput): ContributionResult {
  const price = Math.max(0, i.price);
  const vc = Math.max(0, i.variableCost);
  const units = Math.max(0, i.units);
  const fixed = Math.max(0, i.fixedCosts);
  const cmPerUnit = price - vc;
  const totalRevenue = price * units;
  const totalVariableCost = vc * units;
  const totalContribution = cmPerUnit * units;
  const operatingIncome = totalContribution - fixed;
  const breakEvenUnits = cmPerUnit > 0 ? fixed / cmPerUnit : null;
  return {
    cmPerUnit: round2(cmPerUnit),
    cmRatio: pct(cmPerUnit, price),
    variableCostRatio: pct(vc, price),
    totalRevenue: round2(totalRevenue),
    totalVariableCost: round2(totalVariableCost),
    totalContribution: round2(totalContribution),
    operatingIncome: round2(operatingIncome),
    breakEvenUnits: breakEvenUnits !== null ? Math.ceil(breakEvenUnits - 1e-9) : null,
    breakEvenRevenue: breakEvenUnits !== null ? round2(breakEvenUnits * price) : null,
    marginOfSafety: breakEvenUnits !== null && units > 0 ? ((units - breakEvenUnits) / units) * 100 : null,
    operatingLeverage: operatingIncome > 0 ? round2(totalContribution / operatingIncome) : null,
  };
}

export const CONTRIBUTION_DEFAULTS: ContributionInput = { price: 50, variableCost: 20, units: 1000, fixedCosts: 18000 };

// ───────────────────────── wholesale → retail price chain

export interface WholesaleChainInput {
  /** Cost to make or buy one unit */
  unitCost: number;
  /** Maker's margin on the wholesale price, % */
  wholesaleMarginPct: number;
  /** Retailer multiplier on wholesale (2 = keystone) */
  retailMultiplier: number;
  /** Optional distributor between maker and retailer, margin % on the distributor price (0 = none) */
  distributorMarginPct: number;
}

export interface WholesaleChainResult {
  wholesalePrice: number;
  distributorPrice: number | null;
  retailPrice: number;
  makerProfit: number;
  makerMarkup: number;
  distributorProfit: number | null;
  retailerProfit: number;
  retailerMargin: number;
  /** Shares of the retail dollar */
  shares: { label: string; amount: number; share: number }[];
}

export function computeWholesaleChain(i: WholesaleChainInput): WholesaleChainResult {
  const cost = Math.max(0, i.unitCost);
  const wm = Math.min(99.9, Math.max(0, i.wholesaleMarginPct));
  const dm = Math.min(99.9, Math.max(0, i.distributorMarginPct));
  const mult = Math.max(1, i.retailMultiplier);
  const wholesalePrice = cost / (1 - wm / 100);
  const distributorPrice = dm > 0 ? wholesalePrice / (1 - dm / 100) : null;
  const retailBase = distributorPrice ?? wholesalePrice;
  const retailPrice = retailBase * mult;
  const makerProfit = wholesalePrice - cost;
  const distributorProfit = distributorPrice !== null ? distributorPrice - wholesalePrice : null;
  const retailerProfit = retailPrice - retailBase;
  const shares = [
    { label: 'Cost to make', amount: round2(cost), share: retailPrice > 0 ? cost / retailPrice : 0 },
    { label: 'Maker profit', amount: round2(makerProfit), share: retailPrice > 0 ? makerProfit / retailPrice : 0 },
    ...(distributorProfit !== null ? [{ label: 'Distributor profit', amount: round2(distributorProfit), share: retailPrice > 0 ? distributorProfit / retailPrice : 0 }] : []),
    { label: 'Retailer profit', amount: round2(retailerProfit), share: retailPrice > 0 ? retailerProfit / retailPrice : 0 },
  ];
  return {
    wholesalePrice: round2(wholesalePrice),
    distributorPrice: distributorPrice !== null ? round2(distributorPrice) : null,
    retailPrice: round2(retailPrice),
    makerProfit: round2(makerProfit),
    makerMarkup: pct(makerProfit, cost),
    distributorProfit: distributorProfit !== null ? round2(distributorProfit) : null,
    retailerProfit: round2(retailerProfit),
    retailerMargin: pct(retailerProfit, retailPrice),
    shares,
  };
}

export const WHOLESALE_DEFAULTS: WholesaleChainInput = { unitCost: 12, wholesaleMarginPct: 50, retailMultiplier: 2, distributorMarginPct: 0 };
