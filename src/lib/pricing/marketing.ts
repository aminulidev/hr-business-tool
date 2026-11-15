// ---------------------------------------------------------------------------
// Marketing cost suite (Roadmap v2, Phase 17): the paid-media funnel (CPM, CTR,
// CPC, CPL, CPA, ROAS, ROI), a budget / target planner with break-even
// acquisition costs, and a multi-stage sales funnel. Absorbs the cpm, cpc,
// cpl, cpa, marketing-roi and conversion-rate drafts. Pure; article generated.
// ---------------------------------------------------------------------------

export type MarketingMode = 'funnel' | 'budget' | 'stages';
export const MARKETING_MODES: { value: MarketingMode; label: string; short: string }[] = [
  { value: 'funnel', label: 'Campaign metrics (CPM → CPA → ROI)', short: 'Campaign' },
  { value: 'budget', label: 'Budget & break-even targets', short: 'Budget' },
  { value: 'stages', label: 'Funnel stage conversion', short: 'Stages' },
];
export function isMarketingMode(v: string | null): v is MarketingMode {
  return v === 'funnel' || v === 'budget' || v === 'stages';
}

const round2 = (n: number) => Math.round(n * 100) / 100;
const div = (a: number, b: number) => (b > 0 ? a / b : null);

// ───────────────────────── campaign funnel

export interface FunnelInput {
  spend: number;
  impressions: number;
  clicks: number;
  leads: number;
  customers: number;
  /** Revenue per customer (first order or first-year value) */
  revenuePerCustomer: number;
  /** Gross margin on that revenue, % — profit-based ROI uses it */
  grossMarginPct: number;
}

export interface FunnelResult {
  cpm: number | null;
  ctr: number | null;
  cpc: number | null;
  leadRate: number | null;
  cpl: number | null;
  closeRate: number | null;
  cpa: number | null;
  /** Customers ÷ clicks */
  clickToCustomer: number | null;
  revenue: number;
  grossProfit: number;
  roas: number | null;
  /** Revenue-based ROI: (revenue − spend) ÷ spend */
  roi: number | null;
  /** Profit-based ROI: (gross profit − spend) ÷ spend */
  profitRoi: number | null;
  netProfit: number;
  /** The most you could pay per customer and still break even on gross profit */
  breakEvenCpa: number;
  breakEvenRoas: number | null;
  /** Spend per $1 of revenue */
  costOfSale: number | null;
}

export function computeFunnel(i: FunnelInput): FunnelResult {
  const spend = Math.max(0, i.spend);
  const imp = Math.max(0, i.impressions);
  const clicks = Math.max(0, i.clicks);
  const leads = Math.max(0, i.leads);
  const cust = Math.max(0, i.customers);
  const rpc = Math.max(0, i.revenuePerCustomer);
  const gm = Math.min(100, Math.max(0, i.grossMarginPct)) / 100;
  const revenue = cust * rpc;
  const grossProfit = revenue * gm;
  const r = (n: number | null) => (n === null ? null : round2(n));
  return {
    cpm: r(imp > 0 ? (spend / imp) * 1000 : null),
    ctr: imp > 0 ? (clicks / imp) * 100 : null,
    cpc: r(div(spend, clicks)),
    leadRate: clicks > 0 ? (leads / clicks) * 100 : null,
    cpl: r(div(spend, leads)),
    closeRate: leads > 0 ? (cust / leads) * 100 : null,
    cpa: r(div(spend, cust)),
    clickToCustomer: clicks > 0 ? (cust / clicks) * 100 : null,
    revenue: round2(revenue),
    grossProfit: round2(grossProfit),
    roas: r(div(revenue, spend)),
    roi: spend > 0 ? ((revenue - spend) / spend) * 100 : null,
    profitRoi: spend > 0 ? ((grossProfit - spend) / spend) * 100 : null,
    netProfit: round2(grossProfit - spend),
    breakEvenCpa: round2(rpc * gm),
    breakEvenRoas: gm > 0 ? round2(1 / gm) : null,
    costOfSale: r(div(spend, revenue)),
  };
}

export const FUNNEL_DEFAULTS: FunnelInput = { spend: 12000, impressions: 1500000, clicks: 18000, leads: 540, customers: 54, revenuePerCustomer: 650, grossMarginPct: 60 };

// ───────────────────────── budget & targets

export interface BudgetInput {
  /** What you want: number of customers in the period */
  targetCustomers: number;
  /** Expected funnel rates, % */
  ctrPct: number;
  leadRatePct: number;
  closeRatePct: number;
  /** What you expect to pay per click (or per 1,000 impressions if cpc is 0) */
  cpc: number;
  cpm: number;
  revenuePerCustomer: number;
  grossMarginPct: number;
  /** Target return on ad spend, e.g. 4 = $4 revenue per $1 */
  targetRoas: number;
}

export interface BudgetResult {
  leadsNeeded: number;
  clicksNeeded: number;
  impressionsNeeded: number;
  budget: number;
  expectedCpa: number | null;
  expectedCpl: number | null;
  expectedRevenue: number;
  expectedRoas: number | null;
  /** Ceilings that keep the campaign at break-even on gross profit */
  breakEvenCpa: number;
  breakEvenCpl: number;
  breakEvenCpc: number;
  breakEvenCpm: number;
  /** Ceilings that hit the target ROAS */
  targetCpa: number | null;
  targetCpc: number | null;
  /** Expected CPA versus the break-even ceiling, as a share (1 = at break-even) */
  cpaHeadroom: number | null;
}

export function computeBudget(i: BudgetInput): BudgetResult | null {
  const cust = Math.max(0, i.targetCustomers);
  const ctr = Math.max(0, i.ctrPct) / 100;
  const lr = Math.max(0, i.leadRatePct) / 100;
  const cr = Math.max(0, i.closeRatePct) / 100;
  if (cust <= 0 || lr <= 0 || cr <= 0) return null;
  const leads = cust / cr;
  const clicks = leads / lr;
  const impressions = ctr > 0 ? clicks / ctr : 0;
  const useCpm = !(i.cpc > 0) && i.cpm > 0 && impressions > 0;
  const budget = useCpm ? (impressions / 1000) * i.cpm : clicks * Math.max(0, i.cpc);
  const rpc = Math.max(0, i.revenuePerCustomer);
  const gm = Math.min(100, Math.max(0, i.grossMarginPct)) / 100;
  const revenue = cust * rpc;
  const beCpa = rpc * gm;
  const beCpl = beCpa * cr;
  const beCpc = beCpl * lr;
  const beCpm = ctr > 0 ? beCpc * ctr * 1000 : 0;
  const tRoas = Math.max(0, i.targetRoas);
  const targetCpa = tRoas > 0 ? rpc / tRoas : null;
  const targetCpc = targetCpa !== null ? targetCpa * cr * lr : null;
  const expectedCpa = cust > 0 && budget > 0 ? budget / cust : null;
  return {
    leadsNeeded: Math.ceil(leads - 1e-9),
    clicksNeeded: Math.ceil(clicks - 1e-9),
    impressionsNeeded: Math.ceil(impressions - 1e-9),
    budget: round2(budget),
    expectedCpa: expectedCpa !== null ? round2(expectedCpa) : null,
    expectedCpl: budget > 0 ? round2(budget / leads) : null,
    expectedRevenue: round2(revenue),
    expectedRoas: budget > 0 ? round2(revenue / budget) : null,
    breakEvenCpa: round2(beCpa),
    breakEvenCpl: round2(beCpl),
    breakEvenCpc: round2(beCpc),
    breakEvenCpm: round2(beCpm),
    targetCpa: targetCpa !== null ? round2(targetCpa) : null,
    targetCpc: targetCpc !== null ? round2(targetCpc) : null,
    cpaHeadroom: expectedCpa !== null && beCpa > 0 ? expectedCpa / beCpa : null,
  };
}

export const BUDGET_DEFAULTS: BudgetInput = { targetCustomers: 100, ctrPct: 1.2, leadRatePct: 3, closeRatePct: 10, cpc: 0.7, cpm: 0, revenuePerCustomer: 650, grossMarginPct: 60, targetRoas: 4 };

// ───────────────────────── multi-stage funnel

export interface StageInput {
  name: string;
  count: number;
}

export interface StageResult {
  name: string;
  count: number;
  /** Conversion from the previous stage, % */
  fromPrevious: number | null;
  /** Conversion from the first stage, % */
  fromTop: number | null;
  /** Spend ÷ count, when spend is given */
  costEach: number | null;
  /** Largest drop-off flag */
  biggestDrop: boolean;
}

export interface StagesResult {
  stages: StageResult[];
  overallRate: number | null;
  /** Top-of-funnel volume needed for one unit at the bottom */
  topPerBottom: number | null;
  /** Bottom-stage count if the weakest stage improved by 10% relative */
  bottomIfWeakestPlus10: number | null;
}

export function computeStages(stages: StageInput[], spend = 0): StagesResult {
  const list = stages.filter((s) => s.count >= 0 && s.name.trim() !== '');
  if (list.length === 0) return { stages: [], overallRate: null, topPerBottom: null, bottomIfWeakestPlus10: null };
  const top = list[0].count;
  const bottom = list[list.length - 1].count;
  const rates = list.map((s, i) => (i === 0 ? null : div(s.count, list[i - 1].count)));
  let weakest = -1;
  let weakestRate = Infinity;
  rates.forEach((r, i) => {
    if (r !== null && r < weakestRate) {
      weakestRate = r;
      weakest = i;
    }
  });
  const out: StageResult[] = list.map((s, i) => ({
    name: s.name,
    count: s.count,
    fromPrevious: rates[i] !== null ? rates[i]! * 100 : null,
    fromTop: top > 0 ? (s.count / top) * 100 : null,
    costEach: spend > 0 && s.count > 0 ? round2(spend / s.count) : null,
    biggestDrop: i === weakest,
  }));
  return {
    stages: out,
    overallRate: top > 0 ? (bottom / top) * 100 : null,
    topPerBottom: bottom > 0 ? round2(top / bottom) : null,
    bottomIfWeakestPlus10: weakest > 0 ? Math.round(bottom * 1.1) : null,
  };
}

export const STAGE_DEFAULTS: StageInput[] = [
  { name: 'Leads', count: 1000 },
  { name: 'Marketing qualified (MQL)', count: 300 },
  { name: 'Sales qualified (SQL)', count: 120 },
  { name: 'Opportunities', count: 60 },
  { name: 'Customers', count: 15 },
];
