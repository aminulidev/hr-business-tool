// ---------------------------------------------------------------------------
// Freelance platform fees — Phase 17: Fiverr seller earnings, Fiverr buyer
// cost and a Fiverr-vs-Upwork comparison for the Fiverr fee page.
//
// Fee facts as of Nov 2026, taken from search-engine extracts of Fiverr's and
// Upwork's own help and pricing pages (the pages themselves refuse automated
// fetches, so re-check them by hand before changing a default). Both platforms
// change fees without much notice, so every figure is an editable input in the
// UI and a parameter here:
//  - Fiverr sellers keep 80%: a 20% fee on every order, extras and tips.
//  - Fiverr buyers pay a 5.5% service fee, plus a small-order fee on purchases
//    under a threshold. Fiverr has raised this twice ($2 under $50, then $2.50
//    under $75); its 2026 material gives $3.00 under $100.
//  - Upwork freelancers pay a per-contract fee of 0%–15% (about 10% is
//    typical), locked when the proposal or offer is sent; clients on the Basic
//    plan pay a 3%–5% marketplace fee.
// ---------------------------------------------------------------------------

const round2 = (n: number) => Math.round(n * 100) / 100;
const v = (n: number) => (Number.isFinite(n) ? Math.max(0, n) : 0);

export type FiverrMode = 'seller' | 'buyer' | 'compare';
export const FIVERR_MODES: { value: FiverrMode; label: string; short: string }[] = [
  { value: 'seller', label: 'Seller earnings', short: 'Seller' },
  { value: 'buyer', label: 'Buyer cost', short: 'Buyer' },
  { value: 'compare', label: 'Fiverr vs Upwork', short: 'Compare' },
];
export const isFiverrMode = (x: string | null): x is FiverrMode => FIVERR_MODES.some((m) => m.value === x);

export interface FiverrFees {
  sellerFeePct: number;
  buyerFeePct: number;
  smallOrderFee: number;
  /** The small-order fee applies to purchases under this amount */
  smallOrderThreshold: number;
}

export const FIVERR_FEES: FiverrFees = { sellerFeePct: 20, buyerFeePct: 5.5, smallOrderFee: 3, smallOrderThreshold: 100 };

/** Earlier published versions of the buyer's small-order fee, for the article */
export const FIVERR_SMALL_ORDER_HISTORY: { fee: number; threshold: number }[] = [
  { fee: 2, threshold: 50 },
  { fee: 2.5, threshold: 75 },
  { fee: 3, threshold: 100 },
];

// ───────────────────────── buyer

export interface FiverrBuyerInput {
  orderAmount: number;
  tip: number;
  fees: FiverrFees;
}

export interface FiverrBuyerResult {
  percentageFee: number;
  smallOrderFee: number;
  /** Service fee on the tip, which is a separate payment */
  tipFee: number;
  feeTotal: number;
  total: number;
  /** All fees ÷ (order + tip) */
  effectiveFeePct: number;
  sellerReceives: number;
  /** Buyer's total less what the seller receives */
  fiverrKeeps: number;
  fiverrTakePct: number;
}

export function computeFiverrBuyer(i: FiverrBuyerInput): FiverrBuyerResult | null {
  const order = v(i.orderAmount);
  const tip = v(i.tip);
  if (order <= 0) return null;
  const pctFee = order * (v(i.fees.buyerFeePct) / 100);
  const small = order < v(i.fees.smallOrderThreshold) ? v(i.fees.smallOrderFee) : 0;
  const tipFee = tip * (v(i.fees.buyerFeePct) / 100);
  const feeTotal = pctFee + small + tipFee;
  const total = order + tip + feeTotal;
  const seller = (order + tip) * (1 - v(i.fees.sellerFeePct) / 100);
  return {
    percentageFee: round2(pctFee),
    smallOrderFee: round2(small),
    tipFee: round2(tipFee),
    feeTotal: round2(feeTotal),
    total: round2(total),
    effectiveFeePct: (feeTotal / (order + tip)) * 100,
    sellerReceives: round2(seller),
    fiverrKeeps: round2(total - seller),
    fiverrTakePct: ((total - seller) / total) * 100,
  };
}

// ───────────────────────── seller

export interface FiverrSellerInput {
  /** Gig package price */
  price: number;
  /** Gig extras added to the order */
  extras: number;
  tip: number;
  ordersPerMonth: number;
  hoursPerOrder: number;
  /** What your payout method charges per withdrawal (varies by method and country) */
  withdrawalFee: number;
  withdrawalsPerMonth: number;
  /** Net amount you want to keep from one order, for the reverse calculation */
  targetNet: number;
  fees: FiverrFees;
}

export interface FiverrSellerResult {
  orderValue: number;
  fiverrFee: number;
  /** Fee on the tip alone */
  tipFee: number;
  netPerOrder: number;
  keepPct: number;
  /** Price to list so that the order nets the target */
  priceForTarget: number | null;
  /** How much adding the fee percentage to the price would leave you short */
  shortfallIfAddingFee: number | null;
  buyerPays: number;
  fiverrKeeps: number;
  fiverrTakePct: number;
  monthlyGross: number;
  monthlyFees: number;
  monthlyWithdrawalFees: number;
  monthlyNet: number;
  annualNet: number;
  effectiveHourly: number | null;
  /** Hourly rate before fees, for comparison */
  grossHourly: number | null;
}

export function computeFiverrSeller(i: FiverrSellerInput): FiverrSellerResult | null {
  const price = v(i.price);
  const extras = v(i.extras);
  const tip = v(i.tip);
  const order = price + extras;
  if (order <= 0) return null;
  const rate = Math.min(100, v(i.fees.sellerFeePct)) / 100;
  const fee = (order + tip) * rate;
  const net = order + tip - fee;
  const orders = v(i.ordersPerMonth);
  const hours = v(i.hoursPerOrder);
  const wFees = v(i.withdrawalFee) * v(i.withdrawalsPerMonth);
  const buyer = computeFiverrBuyer({ orderAmount: order, tip, fees: i.fees })!;
  const target = v(i.targetNet);
  const priceForTarget = target > 0 && rate < 1 ? target / (1 - rate) : null;
  const monthlyNet = net * orders - wFees;
  return {
    orderValue: round2(order + tip),
    fiverrFee: round2(fee),
    tipFee: round2(tip * rate),
    netPerOrder: round2(net),
    keepPct: (1 - rate) * 100,
    priceForTarget: priceForTarget === null ? null : round2(priceForTarget),
    shortfallIfAddingFee: target > 0 ? round2(target - target * (1 + rate) * (1 - rate)) : null,
    buyerPays: buyer.total,
    fiverrKeeps: round2(buyer.total - net),
    fiverrTakePct: ((buyer.total - net) / buyer.total) * 100,
    monthlyGross: round2((order + tip) * orders),
    monthlyFees: round2(fee * orders),
    monthlyWithdrawalFees: round2(wFees),
    monthlyNet: round2(monthlyNet),
    annualNet: round2(monthlyNet * 12),
    effectiveHourly: hours > 0 ? round2(net / hours) : null,
    grossHourly: hours > 0 ? round2((order + tip) / hours) : null,
  };
}

export const FIVERR_SELLER_DEFAULTS: FiverrSellerInput = {
  price: 150,
  extras: 40,
  tip: 10,
  ordersPerMonth: 12,
  hoursPerOrder: 4,
  withdrawalFee: 0,
  withdrawalsPerMonth: 2,
  targetNet: 200,
  fees: FIVERR_FEES,
};

export const FIVERR_BUYER_DEFAULTS: FiverrBuyerInput = { orderAmount: 80, tip: 10, fees: FIVERR_FEES };

// ───────────────────────── Fiverr vs Upwork

export interface CompareInput {
  /** Price of the job as quoted to the client, before platform fees */
  projectPrice: number;
  /** What the freelancer wants to keep, for the reverse calculation */
  targetNet: number;
  fiverr: FiverrFees;
  /** Upwork freelancer service fee for this contract, 0–15% */
  upworkFreelancerFeePct: number;
  /** Upwork client marketplace fee, 3–5% on the Basic plan */
  upworkClientFeePct: number;
}

export interface PlatformResult {
  platform: 'Fiverr' | 'Upwork';
  clientPays: number;
  clientFee: number;
  freelancerFee: number;
  freelancerNets: number;
  platformKeeps: number;
  /** Platform's share of everything the client pays */
  takePct: number;
  /** Quote needed for the freelancer to net the target */
  priceForTarget: number | null;
  /** What the client pays at that quote */
  clientPaysForTarget: number | null;
}

export interface CompareResult {
  fiverr: PlatformResult;
  upwork: PlatformResult;
  /** Positive = the freelancer keeps more on Upwork */
  freelancerDifference: number;
  /** Positive = the client pays more on Fiverr */
  clientDifference: number;
  /** Upwork freelancer fee at which both platforms pay the freelancer the same */
  breakEvenUpworkFeePct: number;
}

export function computeCompare(i: CompareInput): CompareResult | null {
  const price = v(i.projectPrice);
  if (price <= 0) return null;
  const target = v(i.targetNet);
  const fRate = Math.min(100, v(i.fiverr.sellerFeePct)) / 100;
  const uRate = Math.min(100, v(i.upworkFreelancerFeePct)) / 100;
  const uClient = v(i.upworkClientFeePct) / 100;
  const fiverrClientFee = (p: number) => p * (v(i.fiverr.buyerFeePct) / 100) + (p < v(i.fiverr.smallOrderThreshold) ? v(i.fiverr.smallOrderFee) : 0);
  const build = (platform: 'Fiverr' | 'Upwork', rate: number, clientFee: (p: number) => number): PlatformResult => {
    const cf = clientFee(price);
    const net = price * (1 - rate);
    const pt = target > 0 && rate < 1 ? target / (1 - rate) : null;
    return {
      platform,
      clientPays: round2(price + cf),
      clientFee: round2(cf),
      freelancerFee: round2(price * rate),
      freelancerNets: round2(net),
      platformKeeps: round2(price + cf - net),
      takePct: ((price + cf - net) / (price + cf)) * 100,
      priceForTarget: pt === null ? null : round2(pt),
      clientPaysForTarget: pt === null ? null : round2(pt + clientFee(pt)),
    };
  };
  const fiverr = build('Fiverr', fRate, fiverrClientFee);
  const upwork = build('Upwork', uRate, (p) => p * uClient);
  return {
    fiverr,
    upwork,
    freelancerDifference: round2(upwork.freelancerNets - fiverr.freelancerNets),
    clientDifference: round2(fiverr.clientPays - upwork.clientPays),
    breakEvenUpworkFeePct: fRate * 100,
  };
}

export const COMPARE_DEFAULTS: CompareInput = { projectPrice: 500, targetNet: 500, fiverr: FIVERR_FEES, upworkFreelancerFeePct: 10, upworkClientFeePct: 5 };
