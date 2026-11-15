// ---------------------------------------------------------------------------
// Inventory planning suite (Roadmap v2, Phase 17): EOQ, reorder point with
// safety stock, carrying cost, and turnover / cash conversion cycle. Absorbs
// the eoq, safety-stock, reorder-point, inventory-holding-cost,
// inventory-turnover and cash-conversion-cycle drafts. Pure functions; the
// page article is generated from them.
// ---------------------------------------------------------------------------

export type PlanningMode = 'eoq' | 'reorder' | 'holding' | 'turnover';
export const PLANNING_MODES: { value: PlanningMode; label: string; short: string }[] = [
  { value: 'eoq', label: 'Order quantity (EOQ)', short: 'EOQ' },
  { value: 'reorder', label: 'Reorder point & safety stock', short: 'Reorder' },
  { value: 'holding', label: 'Carrying cost', short: 'Carrying' },
  { value: 'turnover', label: 'Turnover & cash cycle', short: 'Turnover' },
];
export function isPlanningMode(v: string | null): v is PlanningMode {
  return v === 'eoq' || v === 'reorder' || v === 'holding' || v === 'turnover';
}

const round2 = (n: number) => Math.round(n * 100) / 100;

// ───────────────────────── EOQ

export interface EoqInput {
  annualDemand: number;
  /** Cost to place one order (admin, freight, receiving) */
  orderCost: number;
  /** Holding cost per unit per year — either entered directly… */
  holdingCostPerUnit: number | null;
  /** …or as unit cost × carrying rate % */
  unitCost: number;
  carryingRatePct: number;
  /** Working days per year for the "order every N days" figure */
  workingDays: number;
}

export interface EoqResult {
  holdingPerUnit: number;
  eoq: number;
  ordersPerYear: number;
  daysBetweenOrders: number;
  annualOrderingCost: number;
  annualHoldingCost: number;
  totalAnnualCost: number;
  /** Total cost at other order sizes, for the sensitivity table */
  sensitivity: { quantity: number; ordering: number; holding: number; total: number; vsEoq: number }[];
}

export function computeEoq(i: EoqInput): EoqResult | null {
  const D = Math.max(0, i.annualDemand);
  const S = Math.max(0, i.orderCost);
  const H = i.holdingCostPerUnit !== null && i.holdingCostPerUnit > 0 ? i.holdingCostPerUnit : Math.max(0, i.unitCost) * (Math.max(0, i.carryingRatePct) / 100);
  if (D <= 0 || S <= 0 || H <= 0) return null;
  const eoq = Math.sqrt((2 * D * S) / H);
  const orders = D / eoq;
  const days = Math.max(1, i.workingDays) / orders;
  const ordering = orders * S;
  const holding = (eoq / 2) * H;
  const cost = (q: number) => ({ ordering: (D / q) * S, holding: (q / 2) * H });
  const multipliers = [0.5, 0.75, 1, 1.25, 1.5, 2];
  const sensitivity = multipliers.map((m) => {
    const q = Math.round(eoq * m);
    const c = cost(q);
    return { quantity: q, ordering: round2(c.ordering), holding: round2(c.holding), total: round2(c.ordering + c.holding), vsEoq: round2(c.ordering + c.holding - (ordering + holding)) };
  });
  return {
    holdingPerUnit: round2(H),
    eoq: round2(eoq),
    ordersPerYear: round2(orders),
    daysBetweenOrders: round2(days),
    annualOrderingCost: round2(ordering),
    annualHoldingCost: round2(holding),
    totalAnnualCost: round2(ordering + holding),
    sensitivity,
  };
}

export const EOQ_DEFAULTS: EoqInput = { annualDemand: 12000, orderCost: 50, holdingCostPerUnit: null, unitCost: 15, carryingRatePct: 20, workingDays: 250 };

// ───────────────────────── reorder point & safety stock

/** One-sided normal z for common cycle service levels */
export const SERVICE_LEVELS: { level: number; z: number }[] = [
  { level: 80, z: 0.8416 },
  { level: 85, z: 1.0364 },
  { level: 90, z: 1.2816 },
  { level: 95, z: 1.6449 },
  { level: 97.5, z: 1.96 },
  { level: 98, z: 2.0537 },
  { level: 99, z: 2.3263 },
  { level: 99.5, z: 2.5758 },
  { level: 99.9, z: 3.0902 },
];
export const zFor = (level: number) => (SERVICE_LEVELS.find((s) => s.level === level) ?? SERVICE_LEVELS[3]).z;

export interface ReorderInput {
  avgDailyDemand: number;
  /** Standard deviation of daily demand (0 = constant demand) */
  demandStdDev: number;
  avgLeadTimeDays: number;
  /** Standard deviation of lead time in days (0 = reliable supplier) */
  leadTimeStdDev: number;
  serviceLevel: number;
  /** Optional: order quantity, to report average and maximum stock */
  orderQuantity: number | null;
}

export interface ReorderResult {
  z: number;
  leadTimeDemand: number;
  safetyStock: number;
  /** The two parts under the square root, for the explanation */
  demandVariance: number;
  leadTimeVariance: number;
  reorderPoint: number;
  /** Days of demand the safety stock covers */
  safetyDays: number;
  averageInventory: number | null;
  maximumInventory: number | null;
  /** Safety stock at the other service levels, for the trade-off table */
  ladder: { level: number; z: number; safetyStock: number; reorderPoint: number }[];
}

export function computeReorder(i: ReorderInput): ReorderResult | null {
  const d = Math.max(0, i.avgDailyDemand);
  const sd = Math.max(0, i.demandStdDev);
  const lt = Math.max(0, i.avgLeadTimeDays);
  const slt = Math.max(0, i.leadTimeStdDev);
  if (d <= 0 || lt <= 0) return null;
  const z = zFor(i.serviceLevel);
  const demandVariance = lt * sd * sd;
  const leadTimeVariance = d * d * slt * slt;
  const sigma = Math.sqrt(demandVariance + leadTimeVariance);
  const ss = z * sigma;
  const ltd = d * lt;
  const q = i.orderQuantity !== null && i.orderQuantity > 0 ? i.orderQuantity : null;
  return {
    z,
    leadTimeDemand: round2(ltd),
    safetyStock: Math.ceil(ss - 1e-9),
    demandVariance: round2(demandVariance),
    leadTimeVariance: round2(leadTimeVariance),
    reorderPoint: Math.ceil(ltd + ss - 1e-9),
    safetyDays: round2(ss / d),
    averageInventory: q !== null ? round2(q / 2 + ss) : null,
    maximumInventory: q !== null ? round2(q + ss) : null,
    ladder: SERVICE_LEVELS.filter((s) => [90, 95, 98, 99, 99.9].includes(s.level)).map((s) => ({ level: s.level, z: s.z, safetyStock: Math.ceil(s.z * sigma - 1e-9), reorderPoint: Math.ceil(ltd + s.z * sigma - 1e-9) })),
  };
}

export const REORDER_DEFAULTS: ReorderInput = { avgDailyDemand: 100, demandStdDev: 20, avgLeadTimeDays: 7, leadTimeStdDev: 1, serviceLevel: 95, orderQuantity: 1400 };

// ───────────────────────── carrying (holding) cost

export interface HoldingInput {
  averageInventoryValue: number;
  capitalPct: number;
  storagePct: number;
  servicePct: number;
  riskPct: number;
  /** Optional: units on hand, for the per-unit figure */
  averageUnits: number | null;
}

export interface HoldingResult {
  totalRatePct: number;
  annualCost: number;
  monthlyCost: number;
  components: { key: string; label: string; pct: number; amount: number }[];
  perUnitPerYear: number | null;
  /** Cost of holding the stock for one extra 30-day period */
  costPer30Days: number;
}

export function computeHolding(i: HoldingInput): HoldingResult {
  const inv = Math.max(0, i.averageInventoryValue);
  const parts = [
    { key: 'capital', label: 'Cost of capital (interest or opportunity cost)', pct: Math.max(0, i.capitalPct) },
    { key: 'storage', label: 'Storage & handling (space, labor, equipment)', pct: Math.max(0, i.storagePct) },
    { key: 'service', label: 'Inventory service (insurance, taxes, systems)', pct: Math.max(0, i.servicePct) },
    { key: 'risk', label: 'Risk (shrinkage, damage, obsolescence)', pct: Math.max(0, i.riskPct) },
  ];
  const totalRatePct = parts.reduce((s, p) => s + p.pct, 0);
  const annual = inv * (totalRatePct / 100);
  return {
    totalRatePct,
    annualCost: round2(annual),
    monthlyCost: round2(annual / 12),
    components: parts.map((p) => ({ ...p, amount: round2(inv * (p.pct / 100)) })),
    perUnitPerYear: i.averageUnits !== null && i.averageUnits > 0 ? round2(annual / i.averageUnits) : null,
    costPer30Days: round2((annual / 365) * 30),
  };
}

export const HOLDING_DEFAULTS: HoldingInput = { averageInventoryValue: 200000, capitalPct: 10, storagePct: 6, servicePct: 3, riskPct: 6, averageUnits: 13333 };

// ───────────────────────── turnover & cash conversion cycle

export interface TurnoverInput {
  cogs: number;
  beginningInventory: number;
  endingInventory: number;
  /** For DSO / DPO / cash conversion cycle (optional) */
  revenue: number;
  receivables: number;
  payables: number;
  periodDays: number;
}

export interface TurnoverResult {
  averageInventory: number;
  turnover: number | null;
  daysInventory: number | null;
  /** Inventory as a share of COGS: months of supply */
  monthsOfSupply: number | null;
  dso: number | null;
  dpo: number | null;
  cashConversionCycle: number | null;
  /** Working capital tied up per day of the cycle, and in total */
  dailyCogs: number;
  cashTiedUp: number | null;
  /** Inventory that could be released by matching a faster turnover */
  releaseAtTurnover: { turnover: number; inventory: number; released: number }[];
}

export function computeTurnover(i: TurnoverInput): TurnoverResult {
  const cogs = Math.max(0, i.cogs);
  const avgInv = (Math.max(0, i.beginningInventory) + Math.max(0, i.endingInventory)) / 2;
  const days = Math.max(1, i.periodDays);
  const turnover = avgInv > 0 && cogs > 0 ? cogs / avgInv : null;
  const dio = turnover !== null ? days / turnover : null;
  const dso = i.revenue > 0 ? (Math.max(0, i.receivables) / i.revenue) * days : null;
  const dpo = cogs > 0 ? (Math.max(0, i.payables) / cogs) * days : null;
  const ccc = dio !== null && dso !== null && dpo !== null ? dio + dso - dpo : null;
  const dailyCogs = cogs / days;
  const targets = turnover !== null ? [1.25, 1.5, 2].map((m) => round2(turnover * m)) : [];
  return {
    averageInventory: round2(avgInv),
    turnover: turnover !== null ? round2(turnover) : null,
    daysInventory: dio !== null ? round2(dio) : null,
    monthsOfSupply: turnover !== null ? round2(12 / turnover) : null,
    dso: dso !== null ? round2(dso) : null,
    dpo: dpo !== null ? round2(dpo) : null,
    cashConversionCycle: ccc !== null ? round2(ccc) : null,
    dailyCogs: round2(dailyCogs),
    cashTiedUp: ccc !== null ? round2(ccc * dailyCogs) : null,
    releaseAtTurnover: targets.map((t) => ({ turnover: t, inventory: round2(cogs / t), released: round2(avgInv - cogs / t) })),
  };
}

export const TURNOVER_DEFAULTS: TurnoverInput = { cogs: 600000, beginningInventory: 100000, endingInventory: 120000, revenue: 1000000, receivables: 120000, payables: 50000, periodDays: 365 };
