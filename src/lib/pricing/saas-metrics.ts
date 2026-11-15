// ---------------------------------------------------------------------------
// SaaS metrics engine — Phase 17: the ARR, expansion-MRR, ARPU, ACV,
// trial-conversion, free-to-paid, SaaS-pricing, GRR, LTV:CAC and MAU-value
// drafts fold into the MRR, churn-rate and CLV pages as modes. Pure functions;
// the components and the generated articles both call these.
// ---------------------------------------------------------------------------

const round2 = (n: number) => Math.round(n * 100) / 100;
const safeDiv = (a: number, b: number) => (b > 0 ? a / b : 0);

export type MrrMode = 'mrr' | 'movements' | 'funnel' | 'pricing';
export const MRR_MODES: { value: MrrMode; label: string; short: string }[] = [
  { value: 'mrr', label: 'MRR, ARR & ARPU', short: 'MRR' },
  { value: 'movements', label: 'Net new MRR', short: 'Movements' },
  { value: 'funnel', label: 'Trial & freemium', short: 'Funnel' },
  { value: 'pricing', label: 'Pricing tiers', short: 'Pricing' },
];
export const isMrrMode = (v: string | null): v is MrrMode => MRR_MODES.some((m) => m.value === v);

export type ChurnMode = 'churn' | 'retention';
export const CHURN_MODES: { value: ChurnMode; label: string; short: string }[] = [
  { value: 'churn', label: 'Logo & revenue churn', short: 'Churn' },
  { value: 'retention', label: 'GRR & NRR', short: 'Retention' },
];
export const isChurnMode = (v: string | null): v is ChurnMode => CHURN_MODES.some((m) => m.value === v);

export type ClvMode = 'clv' | 'ltv-cac' | 'mau';
export const CLV_MODES: { value: ClvMode; label: string; short: string }[] = [
  { value: 'clv', label: 'Lifetime value', short: 'CLV' },
  { value: 'ltv-cac', label: 'LTV:CAC by channel', short: 'LTV:CAC' },
  { value: 'mau', label: 'Value per active user', short: 'MAU' },
];
export const isClvMode = (v: string | null): v is ClvMode => CLV_MODES.some((m) => m.value === v);

// ───────────────────────── MRR from plans

export type Billing = 'monthly' | 'quarterly' | 'annual' | 'multi';
export const BILLING_OPTIONS: { value: Billing; label: string }[] = [
  { value: 'monthly', label: 'Billed monthly' },
  { value: 'quarterly', label: 'Billed quarterly' },
  { value: 'annual', label: 'Billed annually' },
  { value: 'multi', label: 'Multi-year contract' },
];

export interface PlanRow {
  name: string;
  customers: number;
  /** Amount billed per customer per billing period (per contract for multi-year) */
  price: number;
  billing: Billing;
  /** Only for multi-year contracts */
  termYears?: number;
}

export interface MrrInput {
  plans: PlanRow[];
}

export interface PlanResult extends PlanRow {
  months: number;
  mrrPerCustomer: number;
  acvPerCustomer: number;
  mrr: number;
  arr: number;
  customerShare: number;
  mrrShare: number;
}

export interface MrrResult {
  plans: PlanResult[];
  customers: number;
  mrr: number;
  arr: number;
  /** Average revenue per account per month */
  arpa: number;
  /** Average annual contract value per account */
  acv: number;
  /** Name of the plan with the largest MRR share */
  largestPlan: string;
  largestPlanSharePct: number;
}

export function billingMonths(billing: Billing, termYears?: number): number {
  switch (billing) {
    case 'monthly':
      return 1;
    case 'quarterly':
      return 3;
    case 'annual':
      return 12;
    case 'multi':
      return Math.max(1, Math.round((termYears ?? 1) * 12));
  }
}

export function computeMrr(i: MrrInput): MrrResult | null {
  const rows = i.plans.filter((p) => p.customers > 0 && p.price > 0);
  if (rows.length === 0) return null;
  const partial = rows.map((p) => {
    const months = billingMonths(p.billing, p.termYears);
    const mrrPerCustomer = p.price / months;
    return { ...p, months, mrrPerCustomer, acvPerCustomer: mrrPerCustomer * 12, mrr: mrrPerCustomer * p.customers, arr: mrrPerCustomer * p.customers * 12 };
  });
  const customers = partial.reduce((s, p) => s + p.customers, 0);
  const mrr = partial.reduce((s, p) => s + p.mrr, 0);
  if (mrr <= 0) return null;
  const plans: PlanResult[] = partial.map((p) => ({ ...p, mrrPerCustomer: round2(p.mrrPerCustomer), acvPerCustomer: round2(p.acvPerCustomer), mrr: round2(p.mrr), arr: round2(p.arr), customerShare: (p.customers / customers) * 100, mrrShare: (p.mrr / mrr) * 100 }));
  const largest = plans.reduce((a, b) => (b.mrr > a.mrr ? b : a), plans[0]);
  return {
    plans,
    customers,
    mrr: round2(mrr),
    arr: round2(mrr * 12),
    arpa: round2(mrr / customers),
    acv: round2((mrr * 12) / customers),
    largestPlan: largest.name,
    largestPlanSharePct: largest.mrrShare,
  };
}

export const MRR_DEFAULTS: MrrInput = {
  plans: [
    { name: 'Starter', customers: 420, price: 29, billing: 'monthly' },
    { name: 'Team', customers: 150, price: 99, billing: 'monthly' },
    { name: 'Business (annual)', customers: 40, price: 2988, billing: 'annual' },
    { name: 'Enterprise (annual)', customers: 6, price: 36000, billing: 'annual' },
  ],
};

export interface ContractInput {
  totalContractValue: number;
  termMonths: number;
  /** Setup, onboarding, services — excluded from recurring revenue */
  oneTimeFees: number;
}

export interface ContractResult {
  tcv: number;
  recurring: number;
  oneTimeFees: number;
  acv: number;
  mrr: number;
  termMonths: number;
}

export function normalizeContract(i: ContractInput): ContractResult | null {
  const tcv = Math.max(0, i.totalContractValue);
  const term = Math.max(0, i.termMonths);
  const oneTime = Math.min(tcv, Math.max(0, i.oneTimeFees));
  if (tcv <= 0 || term <= 0) return null;
  const recurring = tcv - oneTime;
  return { tcv, recurring, oneTimeFees: oneTime, acv: round2(recurring / (term / 12)), mrr: round2(recurring / term), termMonths: term };
}

export const CONTRACT_DEFAULTS: ContractInput = { totalContractValue: 40000, termMonths: 12, oneTimeFees: 4000 };

// ───────────────────────── net new MRR movements

export interface MovementsInput {
  startingMrr: number;
  newMrr: number;
  upsellMrr: number;
  seatMrr: number;
  crossSellMrr: number;
  reactivationMrr: number;
  contractionMrr: number;
  churnedMrr: number;
}

export interface MovementsResult {
  expansionMrr: number;
  gainedMrr: number;
  lostMrr: number;
  netNewMrr: number;
  endingMrr: number;
  growthPct: number;
  /** (new + expansion + reactivation) ÷ (churned + contraction); null when nothing was lost */
  quickRatio: number | null;
  expansionPctOfStart: number;
  /** Expansion as a share of all MRR gained */
  expansionShareOfGainsPct: number;
  grossRevenueChurnPct: number;
  netRevenueChurnPct: number;
  grrPct: number;
  nrrPct: number;
  annualizedGrowthPct: number;
  /** Months to double at this growth rate; null if not growing */
  monthsToDouble: number | null;
  mrrIn12Months: number;
  bridge: { label: string; amount: number; kind: 'start' | 'gain' | 'loss' | 'end' }[];
}

export function computeMovements(i: MovementsInput): MovementsResult | null {
  const start = Math.max(0, i.startingMrr);
  if (start <= 0) return null;
  const v = (n: number) => Math.max(0, n);
  const expansion = v(i.upsellMrr) + v(i.seatMrr) + v(i.crossSellMrr);
  const gained = v(i.newMrr) + expansion + v(i.reactivationMrr);
  const lost = v(i.contractionMrr) + v(i.churnedMrr);
  const net = gained - lost;
  const ending = start + net;
  const g = net / start;
  return {
    expansionMrr: expansion,
    gainedMrr: gained,
    lostMrr: lost,
    netNewMrr: net,
    endingMrr: ending,
    growthPct: g * 100,
    quickRatio: lost > 0 ? round2(gained / lost) : null,
    expansionPctOfStart: (expansion / start) * 100,
    expansionShareOfGainsPct: gained > 0 ? (expansion / gained) * 100 : 0,
    grossRevenueChurnPct: (lost / start) * 100,
    netRevenueChurnPct: ((lost - expansion) / start) * 100,
    grrPct: ((start - lost) / start) * 100,
    nrrPct: ((start - lost + expansion) / start) * 100,
    annualizedGrowthPct: (Math.pow(1 + g, 12) - 1) * 100,
    monthsToDouble: g > 0 ? Math.round((Math.log(2) / Math.log(1 + g)) * 10) / 10 : null,
    mrrIn12Months: round2(ending * Math.pow(1 + g, 12)),
    bridge: [
      { label: 'Starting MRR', amount: start, kind: 'start' },
      { label: 'New business', amount: v(i.newMrr), kind: 'gain' },
      { label: 'Expansion (upsell, seats, cross-sell)', amount: expansion, kind: 'gain' },
      { label: 'Reactivation', amount: v(i.reactivationMrr), kind: 'gain' },
      { label: 'Contraction (downgrades)', amount: -v(i.contractionMrr), kind: 'loss' },
      { label: 'Churned', amount: -v(i.churnedMrr), kind: 'loss' },
      { label: 'Ending MRR', amount: ending, kind: 'end' },
    ],
  };
}

export const MOVEMENTS_DEFAULTS: MovementsInput = {
  startingMrr: 100000,
  newMrr: 6000,
  upsellMrr: 3000,
  seatMrr: 2000,
  crossSellMrr: 1000,
  reactivationMrr: 500,
  contractionMrr: 1500,
  churnedMrr: 3000,
};

// ───────────────────────── trial / freemium funnel

export type FunnelModel = 'trial' | 'freemium';

export interface FunnelInput {
  model: FunnelModel;
  /** Trial sign-ups in the period, or free users at the start of it */
  signups: number;
  /** Conversions to a paid plan in the period */
  conversions: number;
  /** Monthly revenue per converted customer */
  arpu: number;
  /** New MRR you want from this funnel in a period */
  targetNewMrr: number;
}

export interface FunnelResult {
  conversionRatePct: number;
  newMrr: number;
  newArr: number;
  /** MRR each sign-up / free user is worth at this conversion rate */
  valuePerSignup: number;
  conversionsNeeded: number;
  signupsNeeded: number;
  extraSignupsNeeded: number;
  /** Conversion rate that would hit the target with today's sign-ups */
  rateNeededPct: number;
  /** Extra MRR from one more percentage point of conversion */
  mrrPerRatePoint: number;
}

export function computeFunnel(i: FunnelInput): FunnelResult | null {
  const signups = Math.max(0, i.signups);
  const conversions = Math.min(signups, Math.max(0, i.conversions));
  const arpu = Math.max(0, i.arpu);
  if (signups <= 0) return null;
  const rate = conversions / signups;
  const newMrr = conversions * arpu;
  const target = Math.max(0, i.targetNewMrr);
  const conversionsNeeded = arpu > 0 ? Math.ceil(target / arpu) : 0;
  const signupsNeeded = rate > 0 ? Math.ceil(conversionsNeeded / rate) : 0;
  return {
    conversionRatePct: rate * 100,
    newMrr: round2(newMrr),
    newArr: round2(newMrr * 12),
    valuePerSignup: round2(newMrr / signups),
    conversionsNeeded,
    signupsNeeded,
    extraSignupsNeeded: Math.max(0, signupsNeeded - signups),
    rateNeededPct: (conversionsNeeded / signups) * 100,
    mrrPerRatePoint: round2(signups * 0.01 * arpu),
  };
}

export const FUNNEL_DEFAULTS: FunnelInput = { model: 'trial', signups: 1000, conversions: 180, arpu: 49, targetNewMrr: 15000 };

// ───────────────────────── pricing tiers

export interface PricingTier {
  name: string;
  /** Monthly price per customer */
  price: number;
  /** Customers on this tier (optional, for the blended figures) */
  customers: number;
}

export interface PricingInput {
  /** Monthly cost to serve one customer (hosting, support, payment fees, third-party APIs) */
  costPerUser: number;
  tiers: PricingTier[];
}

export interface PricingTierResult extends PricingTier {
  grossProfitPerUser: number;
  grossMarginPct: number;
  /** Price ÷ previous tier's price; null for the first tier */
  stepUp: number | null;
  mrr: number;
  grossProfit: number;
  customerSharePct: number;
  mrrSharePct: number;
}

export interface PricingResult {
  tiers: PricingTierResult[];
  customers: number;
  mrr: number;
  cost: number;
  grossProfit: number;
  blendedArpu: number;
  blendedMarginPct: number;
  /** Top tier price ÷ bottom tier price */
  ladderRatio: number;
  /** Price below which a tier loses money per user */
  breakEvenPrice: number;
}

export function computePricing(i: PricingInput): PricingResult | null {
  const cost = Math.max(0, i.costPerUser);
  const tiers = i.tiers.filter((t) => t.price > 0);
  if (tiers.length === 0) return null;
  const customers = tiers.reduce((s, t) => s + Math.max(0, t.customers), 0);
  const mrr = tiers.reduce((s, t) => s + Math.max(0, t.customers) * t.price, 0);
  const totalCost = customers * cost;
  const result: PricingTierResult[] = tiers.map((t, idx) => {
    const c = Math.max(0, t.customers);
    return {
      ...t,
      customers: c,
      grossProfitPerUser: round2(t.price - cost),
      grossMarginPct: ((t.price - cost) / t.price) * 100,
      stepUp: idx > 0 ? round2(t.price / tiers[idx - 1].price) : null,
      mrr: round2(c * t.price),
      grossProfit: round2(c * (t.price - cost)),
      customerSharePct: customers > 0 ? (c / customers) * 100 : 0,
      mrrSharePct: mrr > 0 ? ((c * t.price) / mrr) * 100 : 0,
    };
  });
  return {
    tiers: result,
    customers,
    mrr: round2(mrr),
    cost: round2(totalCost),
    grossProfit: round2(mrr - totalCost),
    blendedArpu: round2(safeDiv(mrr, customers)),
    blendedMarginPct: mrr > 0 ? ((mrr - totalCost) / mrr) * 100 : 0,
    ladderRatio: round2(tiers[tiers.length - 1].price / tiers[0].price),
    breakEvenPrice: cost,
  };
}

export const PRICING_DEFAULTS: PricingInput = {
  costPerUser: 6,
  tiers: [
    { name: 'Starter', price: 19, customers: 600 },
    { name: 'Pro', price: 49, customers: 250 },
    { name: 'Business', price: 129, customers: 60 },
  ],
};

// ───────────────────────── churn & retention

export interface ChurnInput {
  periodMonths: number;
  startCustomers: number;
  lostCustomers: number;
  newCustomers: number;
  startMrr: number;
  churnedMrr: number;
  contractionMrr: number;
  expansionMrr: number;
}

export interface ChurnResult {
  logoChurnPct: number;
  logoRetentionPct: number;
  endCustomers: number;
  netLogoGrowthPct: number;
  monthlyLogoChurnPct: number;
  annualLogoChurnPct: number;
  /** 1 ÷ monthly churn; null when nothing churned */
  avgLifetimeMonths: number | null;
  /** Of the starting customers, how many are still there after 12 months at this churn */
  cohortAfter12Months: number;
  grossRevenueChurnPct: number;
  netRevenueChurnPct: number;
  grrPct: number;
  nrrPct: number;
  annualGrrPct: number;
  annualNrrPct: number;
  /** Churned MRR per lost customer ÷ starting MRR per customer (1 = average-sized customers are leaving) */
  churnerSizeRatio: number | null;
  avgMrrPerCustomer: number;
  avgMrrPerLostCustomer: number | null;
  /** Customers needed each period just to replace churn */
  replacementCustomers: number;
}

export function computeChurn(i: ChurnInput): ChurnResult | null {
  const m = Math.max(0.01, i.periodMonths || 1);
  const start = Math.max(0, i.startCustomers);
  if (start <= 0) return null;
  const lost = Math.min(start, Math.max(0, i.lostCustomers));
  const added = Math.max(0, i.newCustomers);
  const logo = lost / start;
  const monthly = 1 - Math.pow(1 - logo, 1 / m);
  const startMrr = Math.max(0, i.startMrr);
  const churned = Math.max(0, i.churnedMrr);
  const contraction = Math.max(0, i.contractionMrr);
  const expansion = Math.max(0, i.expansionMrr);
  const grr = startMrr > 0 ? (startMrr - churned - contraction) / startMrr : 1;
  const nrr = startMrr > 0 ? (startMrr - churned - contraction + expansion) / startMrr : 1;
  const avgMrr = safeDiv(startMrr, start);
  const avgLost = lost > 0 && startMrr > 0 ? churned / lost : null;
  return {
    logoChurnPct: logo * 100,
    logoRetentionPct: (1 - logo) * 100,
    endCustomers: start - lost + added,
    netLogoGrowthPct: ((added - lost) / start) * 100,
    monthlyLogoChurnPct: monthly * 100,
    annualLogoChurnPct: (1 - Math.pow(1 - monthly, 12)) * 100,
    avgLifetimeMonths: monthly > 0 ? round2(1 / monthly) : null,
    cohortAfter12Months: Math.round(start * Math.pow(1 - monthly, 12)),
    grossRevenueChurnPct: startMrr > 0 ? ((churned + contraction) / startMrr) * 100 : 0,
    netRevenueChurnPct: startMrr > 0 ? ((churned + contraction - expansion) / startMrr) * 100 : 0,
    grrPct: grr * 100,
    nrrPct: nrr * 100,
    annualGrrPct: Math.pow(Math.max(0, grr), 12 / m) * 100,
    annualNrrPct: Math.pow(Math.max(0, nrr), 12 / m) * 100,
    churnerSizeRatio: avgLost !== null && avgMrr > 0 ? round2(avgLost / avgMrr) : null,
    avgMrrPerCustomer: round2(avgMrr),
    avgMrrPerLostCustomer: avgLost === null ? null : round2(avgLost),
    replacementCustomers: lost,
  };
}

export const CHURN_DEFAULTS: ChurnInput = {
  periodMonths: 1,
  startCustomers: 500,
  lostCustomers: 20,
  newCustomers: 35,
  startMrr: 100000,
  churnedMrr: 3000,
  contractionMrr: 1200,
  expansionMrr: 4500,
};

/** Monthly churn → compound annual churn, remaining cohort and lifetime, for the reference table */
export function churnConversionRow(monthlyPct: number) {
  const c = monthlyPct / 100;
  const annual = 1 - Math.pow(1 - c, 12);
  return { monthlyPct, simpleAnnualPct: monthlyPct * 12, annualPct: annual * 100, retainedPct: (1 - annual) * 100, lifetimeMonths: c > 0 ? 1 / c : null };
}

// ───────────────────────── customer lifetime value

export interface ClvInput {
  arpu: number;
  grossMarginPct: number;
  monthlyChurnPct: number;
  cac: number;
  /** Cap on lifetime in months (0 = uncapped). Investors often cap at 36–60. */
  capMonths: number;
}

export interface ClvResult {
  grossProfitMonthly: number;
  /** 1 ÷ churn; null when churn is 0 */
  lifetimeMonths: number | null;
  lifetimeUsedMonths: number;
  capped: boolean;
  clvRevenue: number;
  clv: number;
  ltvCac: number | null;
  paybackMonths: number | null;
  maxCacAt3x: number;
  annualChurnPct: number;
  verdict: Verdict;
}

export type Verdict = { level: 'bad' | 'thin' | 'healthy' | 'under-investing'; label: string };

export function ratioVerdict(ratio: number | null): Verdict {
  if (ratio === null) return { level: 'thin', label: 'Enter a CAC to judge the ratio' };
  if (ratio < 1) return { level: 'bad', label: 'Below 1:1 — each customer costs more to acquire than they ever return' };
  if (ratio < 3) return { level: 'thin', label: 'Between 1:1 and 3:1 — acquisition pays back but leaves little for R&D and overhead' };
  if (ratio <= 5) return { level: 'healthy', label: '3:1 to 5:1 — the range investors treat as healthy unit economics' };
  return { level: 'under-investing', label: 'Above 5:1 — strong economics; you may be able to spend more to grow faster' };
}

export function computeClv(i: ClvInput): ClvResult | null {
  const arpu = Math.max(0, i.arpu);
  const gm = Math.min(100, Math.max(0, i.grossMarginPct)) / 100;
  const churn = Math.min(100, Math.max(0, i.monthlyChurnPct)) / 100;
  const cac = Math.max(0, i.cac);
  const cap = Math.max(0, i.capMonths);
  if (arpu <= 0) return null;
  const gp = arpu * gm;
  const lifetime = churn > 0 ? 1 / churn : null;
  const used = lifetime === null ? (cap > 0 ? cap : 60) : cap > 0 ? Math.min(lifetime, cap) : lifetime;
  const clv = gp * used;
  const ratio = cac > 0 ? clv / cac : null;
  return {
    grossProfitMonthly: round2(gp),
    lifetimeMonths: lifetime === null ? null : round2(lifetime),
    lifetimeUsedMonths: round2(used),
    capped: lifetime === null || (cap > 0 && lifetime > cap),
    clvRevenue: round2(arpu * used),
    clv: round2(clv),
    ltvCac: ratio === null ? null : round2(ratio),
    paybackMonths: cac > 0 && gp > 0 ? round2(cac / gp) : null,
    maxCacAt3x: round2(clv / 3),
    annualChurnPct: (1 - Math.pow(1 - churn, 12)) * 100,
    verdict: ratioVerdict(ratio),
  };
}

export const CLV_DEFAULTS: ClvInput = { arpu: 100, grossMarginPct: 80, monthlyChurnPct: 3, cac: 800, capMonths: 60 };

// ───────────────────────── LTV:CAC by channel

export interface ChannelRow {
  name: string;
  spend: number;
  customers: number;
}

export interface LtvCacInput {
  ltv: number;
  channels: ChannelRow[];
}

export interface ChannelResult extends ChannelRow {
  cac: number | null;
  ratio: number | null;
  verdict: Verdict;
  /** Gross lifetime profit the channel's customers return, less what they cost */
  netReturn: number;
}

export interface LtvCacResult {
  channels: ChannelResult[];
  totalSpend: number;
  totalCustomers: number;
  blendedCac: number | null;
  blendedRatio: number | null;
  verdict: Verdict;
  maxCacAt3x: number;
  bestChannel: string | null;
  worstChannel: string | null;
}

export function computeLtvCac(i: LtvCacInput): LtvCacResult | null {
  const ltv = Math.max(0, i.ltv);
  if (ltv <= 0) return null;
  const rows = i.channels.filter((c) => c.spend > 0 || c.customers > 0);
  const channels: ChannelResult[] = rows.map((c) => {
    const cac = c.customers > 0 ? c.spend / c.customers : null;
    const ratio = cac !== null && cac > 0 ? ltv / cac : null;
    return { ...c, cac: cac === null ? null : round2(cac), ratio: ratio === null ? null : round2(ratio), verdict: ratioVerdict(ratio), netReturn: round2(c.customers * ltv - c.spend) };
  });
  const totalSpend = rows.reduce((s, c) => s + Math.max(0, c.spend), 0);
  const totalCustomers = rows.reduce((s, c) => s + Math.max(0, c.customers), 0);
  const blendedCac = totalCustomers > 0 ? totalSpend / totalCustomers : null;
  const blendedRatio = blendedCac !== null && blendedCac > 0 ? ltv / blendedCac : null;
  const rated = channels.filter((c) => c.ratio !== null);
  const best = rated.length ? rated.reduce((a, b) => ((b.ratio ?? 0) > (a.ratio ?? 0) ? b : a)) : null;
  const worst = rated.length ? rated.reduce((a, b) => ((b.ratio ?? 0) < (a.ratio ?? 0) ? b : a)) : null;
  return {
    channels,
    totalSpend,
    totalCustomers,
    blendedCac: blendedCac === null ? null : round2(blendedCac),
    blendedRatio: blendedRatio === null ? null : round2(blendedRatio),
    verdict: ratioVerdict(blendedRatio),
    maxCacAt3x: round2(ltv / 3),
    bestChannel: best?.name ?? null,
    worstChannel: worst && worst !== best ? worst.name : null,
  };
}

export const LTV_CAC_DEFAULTS: LtvCacInput = {
  ltv: 2700,
  channels: [
    { name: 'Paid search', spend: 24000, customers: 30 },
    { name: 'Content & SEO', spend: 6000, customers: 20 },
    { name: 'Outbound sales', spend: 30000, customers: 25 },
  ],
};

// ───────────────────────── value per active user

export interface MauInput {
  monthlyRevenue: number;
  mau: number;
  dau: number;
  payingUsers: number;
}

export interface MauResult {
  arpuPerMau: number;
  annualValuePerMau: number;
  arppu: number | null;
  payingSharePct: number | null;
  stickinessPct: number | null;
  revenuePerDau: number | null;
  /** Extra monthly revenue from converting one more percent of MAU at the current ARPPU */
  revenuePerPayingPoint: number | null;
}

export function computeMau(i: MauInput): MauResult | null {
  const rev = Math.max(0, i.monthlyRevenue);
  const mau = Math.max(0, i.mau);
  if (mau <= 0) return null;
  const dau = Math.min(mau, Math.max(0, i.dau));
  const paying = Math.min(mau, Math.max(0, i.payingUsers));
  const arppu = paying > 0 ? rev / paying : null;
  return {
    arpuPerMau: round2(rev / mau),
    annualValuePerMau: round2((rev / mau) * 12),
    arppu: arppu === null ? null : round2(arppu),
    payingSharePct: paying > 0 ? (paying / mau) * 100 : null,
    stickinessPct: dau > 0 ? (dau / mau) * 100 : null,
    revenuePerDau: dau > 0 ? round2(rev / dau) : null,
    revenuePerPayingPoint: arppu === null ? null : round2(mau * 0.01 * arppu),
  };
}

export const MAU_DEFAULTS: MauInput = { monthlyRevenue: 50000, mau: 50000, dau: 12000, payingUsers: 2000 };
