import { describe, expect, it } from 'vitest';
import { computeEoq, computeHolding, computeReorder, computeTurnover, EOQ_DEFAULTS, HOLDING_DEFAULTS, REORDER_DEFAULTS, TURNOVER_DEFAULTS, zFor } from './inventory-planning';

describe('computeEoq', () => {
  it('textbook: D = 12,000, S = $50, H = $3 → EOQ 632.46', () => {
    const r = computeEoq({ ...EOQ_DEFAULTS, holdingCostPerUnit: 3 })!;
    expect(r.holdingPerUnit).toBe(3);
    expect(r.eoq).toBe(632.46);
    expect(r.ordersPerYear).toBe(18.97);
    expect(r.annualOrderingCost).toBeCloseTo(948.68, 1);
    expect(r.annualHoldingCost).toBeCloseTo(948.68, 1); // equal at the optimum
    expect(r.totalAnnualCost).toBeCloseTo(1897.37, 1);
    expect(r.daysBetweenOrders).toBeCloseTo(250 / 18.97, 1);
  });
  it('derives H from unit cost × carrying rate and the sensitivity table bottoms out at EOQ', () => {
    const r = computeEoq(EOQ_DEFAULTS)!; // H = 15 × 20% = 3
    expect(r.holdingPerUnit).toBe(3);
    expect(r.eoq).toBe(632.46);
    const atEoq = r.sensitivity.find((s) => s.quantity === Math.round(r.eoq))!;
    for (const s of r.sensitivity) expect(s.total).toBeGreaterThanOrEqual(atEoq.total - 0.01);
    expect(r.sensitivity[0].quantity).toBe(316);
  });
  it('returns null without demand, order cost or holding cost', () => {
    expect(computeEoq({ ...EOQ_DEFAULTS, annualDemand: 0 })).toBeNull();
    expect(computeEoq({ ...EOQ_DEFAULTS, unitCost: 0, holdingCostPerUnit: null })).toBeNull();
  });
});

describe('computeReorder', () => {
  it('safety stock with demand variability only: z × σd × √LT', () => {
    const r = computeReorder({ ...REORDER_DEFAULTS, leadTimeStdDev: 0 })!;
    expect(zFor(95)).toBe(1.6449);
    // 1.6449 × 20 × √7 = 87.04 → 88 units
    expect(r.safetyStock).toBe(88);
    expect(r.leadTimeDemand).toBe(700);
    expect(r.reorderPoint).toBe(788);
    expect(r.safetyDays).toBeCloseTo(0.87, 2);
  });
  it('adds lead-time variability under the root and reports stock levels', () => {
    const r = computeReorder(REORDER_DEFAULTS)!;
    // variance = 7 × 400 + 10,000 × 1 = 12,800; σ = 113.14; SS = 186.1 → 187
    expect(r.demandVariance).toBe(2800);
    expect(r.leadTimeVariance).toBe(10000);
    expect(r.safetyStock).toBe(187);
    expect(r.reorderPoint).toBe(887);
    expect(r.averageInventory).toBeCloseTo(1400 / 2 + 186.1, 0);
    expect(r.maximumInventory).toBeCloseTo(1400 + 186.1, 0);
    expect(r.ladder.map((l) => l.level)).toEqual([90, 95, 98, 99, 99.9]);
    expect(r.ladder[4].safetyStock).toBeGreaterThan(r.ladder[0].safetyStock);
  });
  it('needs demand and lead time', () => {
    expect(computeReorder({ ...REORDER_DEFAULTS, avgLeadTimeDays: 0 })).toBeNull();
  });
});

describe('computeHolding', () => {
  it('sums the four components into a carrying rate and cost', () => {
    const r = computeHolding(HOLDING_DEFAULTS);
    expect(r.totalRatePct).toBe(25);
    expect(r.annualCost).toBe(50000);
    expect(r.monthlyCost).toBeCloseTo(4166.67, 2);
    expect(r.components.find((c) => c.key === 'capital')?.amount).toBe(20000);
    expect(r.perUnitPerYear).toBeCloseTo(50000 / 13333, 2);
    expect(r.costPer30Days).toBeCloseTo((50000 / 365) * 30, 2);
  });
});

describe('computeTurnover', () => {
  it('turnover, days and the cash conversion cycle', () => {
    const r = computeTurnover(TURNOVER_DEFAULTS);
    expect(r.averageInventory).toBe(110000);
    expect(r.turnover).toBeCloseTo(600000 / 110000, 2); // 5.45
    expect(r.daysInventory).toBeCloseTo(365 / (600000 / 110000), 1); // 66.9
    expect(r.monthsOfSupply).toBeCloseTo(12 / 5.4545, 1);
    expect(r.dso).toBeCloseTo((120000 / 1000000) * 365, 2); // 43.8
    expect(r.dpo).toBeCloseTo((50000 / 600000) * 365, 2); // 30.4
    expect(r.cashConversionCycle).toBeCloseTo(66.92 + 43.8 - 30.42, 1);
    expect(r.cashTiedUp).toBeCloseTo(r.cashConversionCycle! * (600000 / 365), 0);
    expect(r.releaseAtTurnover[0].released).toBeGreaterThan(0);
  });
  it('blanks the ratios it cannot compute', () => {
    const r = computeTurnover({ ...TURNOVER_DEFAULTS, revenue: 0, beginningInventory: 0, endingInventory: 0 });
    expect(r.turnover).toBeNull();
    expect(r.dso).toBeNull();
    expect(r.cashConversionCycle).toBeNull();
    expect(r.releaseAtTurnover).toEqual([]);
  });
});
