// ---------------------------------------------------------------------------
// Inventory valuation (Roadmap v2, Phase 17): FIFO, LIFO and weighted average
// cost under the periodic system, from any number of purchase layers. The
// fifo-, lifo- and weighted-average-cost pages were folded into this one.
// Pure functions; the page article is generated from them.
// ---------------------------------------------------------------------------

export type ValuationMethod = 'fifo' | 'lifo' | 'average';
export const METHODS: { value: ValuationMethod; label: string; short: string }[] = [
  { value: 'fifo', label: 'FIFO (first in, first out)', short: 'FIFO' },
  { value: 'lifo', label: 'LIFO (last in, first out)', short: 'LIFO' },
  { value: 'average', label: 'Weighted average cost', short: 'Weighted avg' },
];
export function isValuationMethod(v: string | null): v is ValuationMethod {
  return v === 'fifo' || v === 'lifo' || v === 'average';
}

export interface InventoryLayer {
  label: string;
  units: number;
  unitCost: number;
}

export interface InventoryValuationInput {
  /** Beginning inventory first, then purchases in date order */
  layers: InventoryLayer[];
  unitsSold: number;
  /** Optional: selling price per unit, for gross profit by method */
  sellingPrice?: number;
  /** Optional: income tax rate %, for the cash-tax difference between methods */
  taxRatePct?: number;
}

export interface LayerUse {
  label: string;
  units: number;
  unitCost: number;
  /** Units taken into COGS from this layer */
  sold: number;
  /** Units left in ending inventory from this layer */
  remaining: number;
  cogs: number;
  ending: number;
}

export interface MethodResult {
  method: ValuationMethod;
  cogs: number;
  endingInventory: number;
  /** Average unit cost used (weighted average only) or COGS ÷ units sold */
  costPerUnitSold: number;
  layers: LayerUse[];
  grossProfit: number | null;
  grossMargin: number | null;
  incomeTax: number | null;
}

export interface InventoryValuationResult {
  totalUnits: number;
  totalCost: number;
  unitsSold: number;
  unitsRemaining: number;
  /** Units sold beyond what was available (0 when the sale is feasible) */
  shortfall: number;
  weightedAverageCost: number;
  fifo: MethodResult;
  lifo: MethodResult;
  average: MethodResult;
  /** FIFO ending inventory − LIFO ending inventory (the "LIFO reserve") */
  lifoReserve: number;
  /** Cash tax saved by LIFO vs FIFO at the given rate (null without a rate) */
  lifoTaxSaving: number | null;
  /** 'rising' | 'falling' | 'flat' unit costs across layers */
  costTrend: 'rising' | 'falling' | 'flat';
}

const round2 = (n: number) => Math.round(n * 100) / 100;

function consume(layers: InventoryLayer[], unitsSold: number, order: 'first' | 'last'): LayerUse[] {
  const idx = layers.map((_, i) => i);
  if (order === 'last') idx.reverse();
  let left = unitsSold;
  const uses: LayerUse[] = layers.map((l) => ({ label: l.label, units: l.units, unitCost: l.unitCost, sold: 0, remaining: l.units, cogs: 0, ending: round2(l.units * l.unitCost) }));
  for (const i of idx) {
    if (left <= 0) break;
    const take = Math.min(left, layers[i].units);
    uses[i].sold = take;
    uses[i].remaining = layers[i].units - take;
    uses[i].cogs = round2(take * layers[i].unitCost);
    uses[i].ending = round2(uses[i].remaining * layers[i].unitCost);
    left -= take;
  }
  return uses;
}

export function computeInventoryValuation(input: InventoryValuationInput): InventoryValuationResult {
  const layers = input.layers.filter((l) => l.units > 0 && l.unitCost >= 0).map((l) => ({ ...l, units: Math.max(0, l.units), unitCost: Math.max(0, l.unitCost) }));
  const totalUnits = layers.reduce((s, l) => s + l.units, 0);
  const totalCost = layers.reduce((s, l) => s + l.units * l.unitCost, 0);
  const wanted = Math.max(0, input.unitsSold);
  const unitsSold = Math.min(wanted, totalUnits);
  const shortfall = wanted - unitsSold;
  const unitsRemaining = totalUnits - unitsSold;
  const wac = totalUnits > 0 ? totalCost / totalUnits : 0;
  const price = input.sellingPrice !== undefined && input.sellingPrice > 0 ? input.sellingPrice : null;
  const taxRate = input.taxRatePct !== undefined && input.taxRatePct > 0 ? input.taxRatePct / 100 : null;
  const revenue = price !== null ? price * unitsSold : null;

  const finish = (method: ValuationMethod, uses: LayerUse[], cogs: number, ending: number): MethodResult => {
    const gp = revenue !== null ? revenue - cogs : null;
    return {
      method,
      cogs: round2(cogs),
      endingInventory: round2(ending),
      costPerUnitSold: unitsSold > 0 ? round2(cogs / unitsSold) : 0,
      layers: uses,
      grossProfit: gp !== null ? round2(gp) : null,
      grossMargin: gp !== null && revenue ? (gp / revenue) * 100 : null,
      incomeTax: gp !== null && taxRate !== null ? round2(Math.max(0, gp) * taxRate) : null,
    };
  };

  const fifoUses = consume(layers, unitsSold, 'first');
  const lifoUses = consume(layers, unitsSold, 'last');
  const fifo = finish('fifo', fifoUses, fifoUses.reduce((s, u) => s + u.sold * u.unitCost, 0), fifoUses.reduce((s, u) => s + u.remaining * u.unitCost, 0));
  const lifo = finish('lifo', lifoUses, lifoUses.reduce((s, u) => s + u.sold * u.unitCost, 0), lifoUses.reduce((s, u) => s + u.remaining * u.unitCost, 0));
  const avgUses: LayerUse[] = layers.map((l) => {
    const share = totalUnits > 0 ? l.units / totalUnits : 0;
    const sold = unitsSold * share;
    return { label: l.label, units: l.units, unitCost: l.unitCost, sold: round2(sold), remaining: round2(l.units - sold), cogs: round2(sold * wac), ending: round2((l.units - sold) * wac) };
  });
  const average = finish('average', avgUses, wac * unitsSold, wac * unitsRemaining);

  const costs = layers.map((l) => l.unitCost);
  const costTrend: InventoryValuationResult['costTrend'] =
    costs.length < 2 || costs[costs.length - 1] === costs[0] ? 'flat' : costs[costs.length - 1] > costs[0] ? 'rising' : 'falling';

  return {
    totalUnits,
    totalCost: round2(totalCost),
    unitsSold,
    unitsRemaining,
    shortfall,
    weightedAverageCost: round2(wac * 10000) / 10000,
    fifo,
    lifo,
    average,
    lifoReserve: round2(fifo.endingInventory - lifo.endingInventory),
    lifoTaxSaving: taxRate !== null && fifo.incomeTax !== null && lifo.incomeTax !== null ? round2(fifo.incomeTax - lifo.incomeTax) : null,
    costTrend,
  };
}

export const INVENTORY_DEFAULTS: InventoryValuationInput = {
  layers: [
    { label: 'Beginning inventory', units: 100, unitCost: 10 },
    { label: 'Purchase 1', units: 150, unitCost: 12 },
    { label: 'Purchase 2', units: 120, unitCost: 13.5 },
  ],
  unitsSold: 260,
  sellingPrice: 24,
  taxRatePct: 21,
};
