// ---------------------------------------------------------------------------
// Commission suite math (Roadmap v2, Phase 17): the two modes added to the
// Sales Commission Calculator when the commission-split, sales-bonus and
// incentive drafts were folded in (tiered and quota already existed as tabs).
// ---------------------------------------------------------------------------

const round2 = (n: number) => Math.round(n * 100) / 100;

// ───────────────────────── commission split (team / brokerage / override)

export interface SplitParty {
  name: string;
  /** Share of the commission pool, % */
  sharePct: number;
}

export interface CommissionSplitInput {
  /** Sale amount the commission is calculated on */
  saleAmount: number;
  /** Commission rate on the sale, % */
  commissionRatePct: number;
  /** Taken off the top before the split (brokerage fee, house cut), % of gross commission */
  houseCutPct: number;
  /** Flat fees off the top (transaction fee, desk fee), $ */
  flatFees: number;
  /** Manager / team-lead override paid on top of the pool from the house share, % of gross commission */
  managerOverridePct: number;
  parties: SplitParty[];
}

export interface CommissionSplitResult {
  grossCommission: number;
  houseCut: number;
  flatFees: number;
  managerOverride: number;
  /** What is left to split among the parties */
  pool: number;
  parties: (SplitParty & { amount: number; pctOfGross: number })[];
  totalSharePct: number;
  /** Difference between 100% and the parties' shares (positive = unallocated) */
  unallocatedPct: number;
  unallocatedAmount: number;
  /** Rep's share as % of the sale amount (useful for "what rate am I really earning") */
  effectiveRateOnSale: number | null;
}

export function computeCommissionSplit(i: CommissionSplitInput): CommissionSplitResult {
  const gross = Math.max(0, i.saleAmount) * (Math.max(0, i.commissionRatePct) / 100);
  const houseCut = gross * (Math.min(100, Math.max(0, i.houseCutPct)) / 100);
  const managerOverride = gross * (Math.min(100, Math.max(0, i.managerOverridePct)) / 100);
  const flatFees = Math.min(Math.max(0, i.flatFees), Math.max(0, gross - houseCut - managerOverride));
  const pool = Math.max(0, gross - houseCut - managerOverride - flatFees);
  const parties = i.parties
    .filter((p) => p.sharePct > 0)
    .map((p) => ({ ...p, amount: round2(pool * (p.sharePct / 100)), pctOfGross: gross > 0 ? (pool * (p.sharePct / 100)) / gross * 100 : 0 }));
  const totalSharePct = parties.reduce((s, p) => s + p.sharePct, 0);
  const unallocatedPct = 100 - totalSharePct;
  const first = parties[0];
  return {
    grossCommission: round2(gross),
    houseCut: round2(houseCut),
    flatFees: round2(flatFees),
    managerOverride: round2(managerOverride),
    pool: round2(pool),
    parties,
    totalSharePct,
    unallocatedPct,
    unallocatedAmount: round2(pool * (unallocatedPct / 100)),
    effectiveRateOnSale: first && i.saleAmount > 0 ? (first.amount / i.saleAmount) * 100 : null,
  };
}

export const SPLIT_DEFAULTS: CommissionSplitInput = {
  saleAmount: 450000,
  commissionRatePct: 3,
  houseCutPct: 20,
  flatFees: 395,
  managerOverridePct: 0,
  parties: [
    { name: 'Listing agent', sharePct: 60 },
    { name: 'Co-agent / referral', sharePct: 40 },
  ],
};

// ───────────────────────── bonus, accelerators & on-target earnings

export interface BonusOteInput {
  baseSalary: number;
  /** Annual quota */
  quota: number;
  /** Commission rate up to quota, % of sales */
  commissionRatePct: number;
  /** Multiplier on the rate above quota (1.5 = 150%) */
  acceleratorMultiplier: number;
  /** Bonus paid at 100% attainment, $ (0 for pure commission plans) */
  bonusAtQuota: number;
  /** Extra bonus per full 10 points above 100%, $ (kicker) */
  bonusPer10PtsOver: number;
  /** Attainment below which no bonus is paid, % */
  bonusThresholdPct: number;
  /** SPIFFs and other flat incentives expected, $ */
  spiffs: number;
  /** Attainment to evaluate, % of quota */
  attainmentPct: number;
}

export interface BonusOteResult {
  /** On-target earnings at 100% attainment */
  ote: number;
  variableAtTarget: number;
  /** Variable share of OTE at target, % (pay mix) */
  payMixVariablePct: number;
  actualSales: number;
  commissionToQuota: number;
  commissionAbove: number;
  commission: number;
  bonus: number;
  spiffs: number;
  variable: number;
  totalEarnings: number;
  /** Total earnings as % of OTE */
  pctOfOte: number;
  /** Earnings per $1 of sales at the attainment given */
  earningsPerSalesDollar: number;
}

export function computeBonusOte(i: BonusOteInput): BonusOteResult {
  const base = Math.max(0, i.baseSalary);
  const quota = Math.max(0, i.quota);
  const rate = Math.max(0, i.commissionRatePct) / 100;
  const accel = Math.max(1, i.acceleratorMultiplier);
  const bonusAtQuota = Math.max(0, i.bonusAtQuota);
  const kicker = Math.max(0, i.bonusPer10PtsOver);
  const threshold = Math.max(0, i.bonusThresholdPct);
  const spiffs = Math.max(0, i.spiffs);
  const att = Math.max(0, i.attainmentPct);

  const variableAtTarget = quota * rate + bonusAtQuota + spiffs;
  const ote = base + variableAtTarget;
  const actualSales = quota * (att / 100);
  const commissionToQuota = Math.min(actualSales, quota) * rate;
  const commissionAbove = Math.max(0, actualSales - quota) * rate * accel;
  const commission = commissionToQuota + commissionAbove;
  // Bonus: nothing below the threshold, pro-rata between threshold and 100%, full at 100%, kicker per 10 points above
  let bonus = 0;
  if (att >= 100) bonus = bonusAtQuota + Math.floor((att - 100) / 10) * kicker;
  else if (att >= threshold && threshold < 100) bonus = bonusAtQuota * ((att - threshold) / (100 - threshold));
  const variable = commission + bonus + spiffs;
  const total = base + variable;
  return {
    ote: round2(ote),
    variableAtTarget: round2(variableAtTarget),
    payMixVariablePct: ote > 0 ? (variableAtTarget / ote) * 100 : 0,
    actualSales: round2(actualSales),
    commissionToQuota: round2(commissionToQuota),
    commissionAbove: round2(commissionAbove),
    commission: round2(commission),
    bonus: round2(bonus),
    spiffs: round2(spiffs),
    variable: round2(variable),
    totalEarnings: round2(total),
    pctOfOte: ote > 0 ? (total / ote) * 100 : 0,
    earningsPerSalesDollar: actualSales > 0 ? variable / actualSales : 0,
  };
}

export const BONUS_DEFAULTS: BonusOteInput = {
  baseSalary: 70000,
  quota: 800000,
  commissionRatePct: 7,
  acceleratorMultiplier: 1.5,
  bonusAtQuota: 10000,
  bonusPer10PtsOver: 2500,
  bonusThresholdPct: 80,
  spiffs: 3000,
  attainmentPct: 110,
};

/** Attainment ladder for the earnings curve shown on the page */
export const ATTAINMENT_STEPS = [50, 70, 80, 90, 100, 110, 120, 150];
