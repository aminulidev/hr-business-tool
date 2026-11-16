// ---------------------------------------------------------------------------
// Startup equity suite (Roadmap v2, Phase 17): priced round with option-pool
// shuffle and a cap table, post-money SAFE conversion, option pool planning,
// founder split with vesting. Absorbs the startup-valuation, equity-dilution,
// cap-table, safe-note, option-pool and founder-equity-split drafts.
// Pure functions; the page article is generated from them.
// ---------------------------------------------------------------------------

export type EquityMode = 'round' | 'safe' | 'pool' | 'founders';
export const EQUITY_MODES: { value: EquityMode; label: string; short: string }[] = [
  { value: 'round', label: 'Priced round & dilution', short: 'Round' },
  { value: 'safe', label: 'SAFE conversion', short: 'SAFE' },
  { value: 'pool', label: 'Option pool', short: 'Pool' },
  { value: 'founders', label: 'Founder split & vesting', short: 'Founders' },
];
export function isEquityMode(v: string | null): v is EquityMode {
  return v === 'round' || v === 'safe' || v === 'pool' || v === 'founders';
}

const round2 = (n: number) => Math.round(n * 100) / 100;
const round4 = (n: number) => Math.round(n * 10000) / 10000;

// ───────────────────────── priced round

export interface Holder {
  name: string;
  shares: number;
}

export interface RoundInput {
  holders: Holder[];
  preMoney: number;
  investment: number;
  /** Option pool as % of post-money fully diluted shares (0 = no pool change) */
  poolPct: number;
  /** Existing unallocated pool shares already in `holders` (counted toward the target) */
  existingPoolShares: number;
  /** true = pool created before the round so only existing holders pay for it (the usual term sheet) */
  poolInPreMoney: boolean;
}

export interface RoundResult {
  postMoney: number;
  investorPct: number;
  pricePerShare: number;
  /** Pre-money price if the pool had not been created pre-money (for the "pool shuffle" cost) */
  pricePerShareNoShuffle: number | null;
  effectivePreMoney: number;
  newInvestorShares: number;
  newPoolShares: number;
  totalPoolShares: number;
  totalSharesAfter: number;
  table: { name: string; shares: number; beforePct: number; afterPct: number; value: number; dilutionPct: number }[];
  existingPctAfter: number;
  poolPctAfter: number;
}

export function computeRound(i: RoundInput): RoundResult | null {
  const holders = i.holders.filter((h) => h.shares > 0);
  const S = holders.reduce((s, h) => s + h.shares, 0);
  const pre = Math.max(0, i.preMoney);
  const inv = Math.max(0, i.investment);
  if (S <= 0 || pre <= 0) return null;
  const post = pre + inv;
  const invPct = inv / post;
  const P = Math.min(0.9, Math.max(0, i.poolPct) / 100);
  const existingPool = Math.min(S, Math.max(0, i.existingPoolShares));

  let T: number;
  let price: number;
  let newPool: number;
  if (P <= 0) {
    price = pre / S;
    T = S + (price > 0 ? inv / price : 0);
    newPool = 0;
  } else if (i.poolInPreMoney) {
    // total T: existing S = T(1 − i − P) + existingPool counted inside pool target
    // pool target P·T is met by existingPool + newPool; non-pool existing shares E = S − existingPool
    const E = S - existingPool;
    const denom = 1 - invPct - P;
    if (denom <= 0) return null;
    T = E / denom;
    newPool = Math.max(0, P * T - existingPool);
    price = post / T;
  } else {
    // pool created after the round: investor priced on S, then pool dilutes everyone
    price = pre / S;
    const N = inv / price;
    const base = S + N;
    const targetPool = (P * (base - existingPool)) / (1 - P);
    newPool = Math.max(0, targetPool - existingPool + existingPool * 0); // target measured on total incl. existing pool
    // recompute so that (existingPool + newPool) / (base + newPool) = P
    newPool = Math.max(0, (P * base - existingPool) / (1 - P));
    T = base + newPool;
  }
  const newInvestorShares = inv / price;
  const totalPool = existingPool + newPool;
  const table = holders.map((h) => {
    const before = h.shares / S;
    const after = h.shares / T;
    return { name: h.name, shares: h.shares, beforePct: before * 100, afterPct: after * 100, value: round2(h.shares * price), dilutionPct: before > 0 ? (1 - after / before) * 100 : 0 };
  });
  return {
    postMoney: round2(post),
    investorPct: invPct * 100,
    pricePerShare: round4(price),
    pricePerShareNoShuffle: P > 0 && i.poolInPreMoney ? round4(pre / S) : null,
    effectivePreMoney: round2(price * (S - existingPool)),
    newInvestorShares: Math.round(newInvestorShares),
    newPoolShares: Math.round(newPool),
    totalPoolShares: Math.round(totalPool),
    totalSharesAfter: Math.round(T),
    table,
    existingPctAfter: ((S - existingPool) / T) * 100,
    poolPctAfter: (totalPool / T) * 100,
  };
}

export const ROUND_DEFAULTS: RoundInput = {
  holders: [
    { name: 'Founder A', shares: 4500000 },
    { name: 'Founder B', shares: 3500000 },
    { name: 'Angel investors', shares: 1000000 },
    { name: 'Existing option pool', shares: 1000000 },
  ],
  preMoney: 10000000,
  investment: 2500000,
  poolPct: 15,
  existingPoolShares: 1000000,
  poolInPreMoney: true,
};

// ───────────────────────── SAFE conversion

export interface SafeNote {
  name: string;
  amount: number;
  /** Post-money valuation cap (0 = uncapped) */
  cap: number;
  /** Discount to the round price, % (0 = none) */
  discountPct: number;
}

export interface SafeInput {
  safes: SafeNote[];
  /** Fully diluted shares before the SAFEs convert */
  existingShares: number;
  /** The priced round that triggers conversion */
  roundPreMoney: number;
  roundInvestment: number;
  /** Option pool % of post-money, created pre-money (dilutes founders and SAFEs, not the new investor) */
  poolPct: number;
}

export interface SafeConversion extends SafeNote {
  /** Valuation the SAFE converts at: the post-money cap, post-money × (1 − discount), or the round post-money */
  effectiveValuation: number;
  method: 'cap' | 'discount' | 'round';
  /** Ownership immediately after conversion, before the priced round */
  preRoundPct: number;
  /** Ownership after the priced round */
  postRoundPct: number;
  shares: number;
  conversionPrice: number;
  /** Discount to the round price actually realized */
  realizedDiscountPct: number;
  valueAtRound: number;
  multipleOnMoney: number;
}

export interface SafeResult {
  roundPostMoney: number;
  roundPricePerShare: number;
  investorPct: number;
  poolPct: number;
  safes: SafeConversion[];
  totalSafePctPreRound: number;
  totalSafePctPostRound: number;
  existingPctPostRound: number;
  totalSharesAfter: number;
  /** Founders' ownership had the SAFE money been raised in the priced round instead */
  existingPctIfPriced: number;
}

export function computeSafes(i: SafeInput): SafeResult | null {
  const S = Math.max(0, i.existingShares);
  const V = Math.max(0, i.roundPreMoney);
  const I = Math.max(0, i.roundInvestment);
  const P = Math.min(0.5, Math.max(0, i.poolPct) / 100);
  if (S <= 0 || V <= 0) return null;
  const post = V + I;
  const invPct = I / post;
  // What everyone who held before the round (existing holders + converted SAFEs) keeps after the new
  // investor and the pre-money pool are carved out.
  const shareOfOld = 1 - invPct - P;
  if (shareOfOld <= 0) return null;
  const safes = i.safes.filter((s) => s.amount > 0);
  // YC post-money SAFE: a cap buys amount ÷ cap of the company immediately before the round (then the
  // round dilutes it); a discount converts at the round price × (1 − discount), i.e. amount ÷ ((1 − d) × post)
  // of the post-round company; neither → round price. Each SAFE takes whichever gives it more.
  const converted = safes.map((s) => {
    const d = s.discountPct > 0 ? Math.min(99, s.discountPct) / 100 : 0;
    const viaCap = s.cap > 0 ? (s.amount / s.cap) * shareOfOld : 0;
    const viaDiscount = d > 0 ? s.amount / ((1 - d) * post) : 0;
    const viaRound = s.amount / post;
    let method: SafeConversion['method'] = 'round';
    let postPct = viaRound;
    let eff = post;
    if (viaDiscount > postPct) { method = 'discount'; postPct = viaDiscount; eff = post * (1 - d); }
    if (viaCap > postPct) { method = 'cap'; postPct = viaCap; eff = s.cap; }
    return { ...s, eff, method, postPct };
  });
  const totalPost = converted.reduce((s, c) => s + c.postPct, 0);
  const existingPost = shareOfOld - totalPost;
  if (existingPost <= 0) return null;
  const T = S / existingPost;
  const price = post / T;
  const result: SafeConversion[] = converted.map((c) => {
    const shares = c.postPct * T;
    const convPrice = c.amount / shares;
    return {
      name: c.name,
      amount: c.amount,
      cap: c.cap,
      discountPct: c.discountPct,
      effectiveValuation: round2(c.eff),
      method: c.method,
      preRoundPct: (c.postPct / shareOfOld) * 100,
      postRoundPct: c.postPct * 100,
      shares: Math.round(shares),
      conversionPrice: round4(convPrice),
      realizedDiscountPct: (1 - convPrice / price) * 100,
      valueAtRound: round2(shares * price),
      multipleOnMoney: round2((shares * price) / c.amount),
    };
  });
  const totalSafe = safes.reduce((s, x) => s + x.amount, 0);
  // Founders' share had the SAFE money simply been part of the priced round at the same pre-money.
  const existingIfPriced = Math.max(0, 1 - (I + totalSafe) / (V + I + totalSafe) - P);
  return {
    roundPostMoney: round2(post),
    roundPricePerShare: round4(price),
    investorPct: invPct * 100,
    poolPct: P * 100,
    safes: result,
    totalSafePctPreRound: (totalPost / shareOfOld) * 100,
    totalSafePctPostRound: totalPost * 100,
    existingPctPostRound: existingPost * 100,
    totalSharesAfter: Math.round(T),
    existingPctIfPriced: existingIfPriced * 100,
  };
}

export const SAFE_DEFAULTS: SafeInput = {
  safes: [
    { name: 'Pre-seed SAFE', amount: 500000, cap: 6000000, discountPct: 20 },
    { name: 'Angel SAFE', amount: 250000, cap: 8000000, discountPct: 0 },
  ],
  existingShares: 10000000,
  roundPreMoney: 12000000,
  roundInvestment: 3000000,
  poolPct: 10,
};

// ───────────────────────── option pool planning

export interface PlannedHire {
  role: string;
  count: number;
  /** Grant per hire as % of fully diluted shares */
  grantPct: number;
}

export interface PoolInput {
  fullyDilutedShares: number;
  /** Pool already authorized, % of fully diluted */
  currentPoolPct: number;
  /** Of which already granted, % of fully diluted */
  grantedPct: number;
  hires: PlannedHire[];
  /** Buffer to keep unallocated after the plan, % of fully diluted */
  bufferPct: number;
}

export interface PoolResult {
  poolShares: number;
  grantedShares: number;
  availableShares: number;
  availablePct: number;
  plan: (PlannedHire & { totalPct: number; sharesEach: number; totalShares: number })[];
  planPct: number;
  planShares: number;
  remainingAfterPlanPct: number;
  /** Pool size needed to cover granted + plan + buffer, % of fully diluted */
  requiredPoolPct: number;
  /** Increase needed over the current pool, % points (0 if none) */
  topUpPct: number;
  topUpShares: number;
}

export function computePool(i: PoolInput): PoolResult | null {
  const FD = Math.max(0, i.fullyDilutedShares);
  if (FD <= 0) return null;
  const poolPct = Math.max(0, i.currentPoolPct);
  const grantedPct = Math.min(poolPct, Math.max(0, i.grantedPct));
  const plan = i.hires.filter((h) => h.count > 0 && h.grantPct > 0).map((h) => ({ ...h, totalPct: h.count * h.grantPct, sharesEach: Math.round(FD * (h.grantPct / 100)), totalShares: Math.round(FD * (h.count * h.grantPct) / 100) }));
  const planPct = plan.reduce((s, h) => s + h.totalPct, 0);
  const buffer = Math.max(0, i.bufferPct);
  const availablePct = poolPct - grantedPct;
  const required = grantedPct + planPct + buffer;
  const topUp = Math.max(0, required - poolPct);
  return {
    poolShares: Math.round(FD * poolPct / 100),
    grantedShares: Math.round(FD * grantedPct / 100),
    availableShares: Math.round(FD * availablePct / 100),
    availablePct,
    plan,
    planPct,
    planShares: Math.round(FD * planPct / 100),
    remainingAfterPlanPct: availablePct - planPct,
    requiredPoolPct: required,
    topUpPct: topUp,
    topUpShares: Math.round(FD * topUp / 100),
  };
}

/** Rule-of-thumb grant ranges for early-stage US startups (% of fully diluted) */
export const GRANT_RANGES: { role: string; range: string; note: string }[] = [
  { role: 'C-level executive (non-founder)', range: '1 – 5%', note: 'CEO hires at the top; CFO / CTO / COO 1–3% at seed, less later' },
  { role: 'VP (engineering, sales, product)', range: '0.5 – 2%', note: 'Higher when hired pre-Series A' },
  { role: 'Director / senior manager', range: '0.25 – 1%', note: '' },
  { role: 'Senior engineer / first ten employees', range: '0.2 – 1%', note: 'Employee #1–5 often 0.5–1%+' },
  { role: 'Mid-level engineer or specialist', range: '0.05 – 0.25%', note: '' },
  { role: 'Junior / early-career', range: '0.01 – 0.1%', note: '' },
  { role: 'Advisor', range: '0.1 – 0.5%', note: 'Usually 2-year vest, no cliff' },
];

export const POOL_DEFAULTS: PoolInput = {
  fullyDilutedShares: 12500000,
  currentPoolPct: 10,
  grantedPct: 3.5,
  hires: [
    { role: 'VP Engineering', count: 1, grantPct: 1 },
    { role: 'Senior engineers', count: 3, grantPct: 0.4 },
    { role: 'Account executives', count: 2, grantPct: 0.15 },
    { role: 'Designer', count: 1, grantPct: 0.25 },
  ],
  bufferPct: 2,
};

// ───────────────────────── founder split & vesting

export interface SplitFactor {
  key: string;
  label: string;
  weight: number;
}
export const SPLIT_FACTORS: SplitFactor[] = [
  { key: 'idea', label: 'Idea & early work', weight: 10 },
  { key: 'capital', label: 'Capital invested', weight: 15 },
  { key: 'time', label: 'Time commitment going forward', weight: 35 },
  { key: 'role', label: 'Role, skills & experience', weight: 25 },
  { key: 'ip', label: 'IP, assets & network brought in', weight: 15 },
];

export interface FounderInput {
  name: string;
  /** Score 0–10 per factor key */
  scores: Record<string, number>;
}

export interface FounderSplitInput {
  founders: FounderInput[];
  weights: Record<string, number>;
  /** Total founder shares to allocate (optional) */
  totalShares: number;
  /** Vesting: months elapsed, total months, cliff months */
  monthsElapsed: number;
  vestingMonths: number;
  cliffMonths: number;
}

export interface FounderSplitResult {
  founders: { name: string; weightedScore: number; pct: number; shares: number | null; vestedPct: number; vestedShares: number | null; unvestedShares: number | null }[];
  totalWeight: number;
  vestedFraction: number;
  /** % of total founder shares that would be unvested if a founder left now */
  unvestedFraction: number;
  byFactor: { key: string; label: string; weight: number; shares: { name: string; contribution: number }[] }[];
}

export function vestedFraction(monthsElapsed: number, vestingMonths: number, cliffMonths: number): number {
  const m = Math.max(0, monthsElapsed);
  const total = Math.max(1, vestingMonths);
  if (m < Math.max(0, cliffMonths)) return 0;
  return Math.min(1, Math.floor(m) / total);
}

export function computeFounderSplit(i: FounderSplitInput): FounderSplitResult | null {
  const founders = i.founders.filter((f) => f.name.trim() !== '');
  if (founders.length === 0) return null;
  const factors = SPLIT_FACTORS.map((f) => ({ ...f, weight: Math.max(0, i.weights[f.key] ?? f.weight) }));
  const totalWeight = factors.reduce((s, f) => s + f.weight, 0);
  if (totalWeight <= 0) return null;
  // each factor's weight is split among founders in proportion to their scores
  const contributions = founders.map(() => 0);
  const byFactor = factors.map((f) => {
    const scores = founders.map((fd) => Math.min(10, Math.max(0, fd.scores[f.key] ?? 0)));
    const sum = scores.reduce((s, x) => s + x, 0);
    const shares = founders.map((fd, idx) => {
      const c = sum > 0 ? (scores[idx] / sum) * f.weight : f.weight / founders.length;
      contributions[idx] += c;
      return { name: fd.name, contribution: c };
    });
    return { key: f.key, label: f.label, weight: f.weight, shares };
  });
  const vested = vestedFraction(i.monthsElapsed, i.vestingMonths, i.cliffMonths);
  const total = i.totalShares > 0 ? i.totalShares : null;
  return {
    founders: founders.map((fd, idx) => {
      const pct = (contributions[idx] / totalWeight) * 100;
      const shares = total !== null ? Math.round(total * (pct / 100)) : null;
      return { name: fd.name, weightedScore: round2(contributions[idx]), pct, shares, vestedPct: vested * 100, vestedShares: shares !== null ? Math.round(shares * vested) : null, unvestedShares: shares !== null ? shares - Math.round(shares * vested) : null };
    }),
    totalWeight,
    vestedFraction: vested,
    unvestedFraction: 1 - vested,
    byFactor,
  };
}

export const FOUNDER_DEFAULTS: FounderSplitInput = {
  founders: [
    { name: 'Alex (CEO)', scores: { idea: 8, capital: 6, time: 10, role: 8, ip: 5 } },
    { name: 'Sam (CTO)', scores: { idea: 5, capital: 2, time: 10, role: 9, ip: 9 } },
    { name: 'Jordan (part-time)', scores: { idea: 3, capital: 8, time: 4, role: 6, ip: 3 } },
  ],
  weights: Object.fromEntries(SPLIT_FACTORS.map((f) => [f.key, f.weight])),
  totalShares: 8000000,
  monthsElapsed: 18,
  vestingMonths: 48,
  cliffMonths: 12,
};
