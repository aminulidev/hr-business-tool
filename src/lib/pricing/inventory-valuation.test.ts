import { describe, expect, it } from 'vitest';
import { computeInventoryValuation, INVENTORY_DEFAULTS } from './inventory-valuation';

describe('computeInventoryValuation', () => {
  const r = computeInventoryValuation(INVENTORY_DEFAULTS);
  // 100 @ $10, 150 @ $12, 120 @ $13.50 = 370 units, $4,420; sell 260 at $24

  it('totals and weighted average', () => {
    expect(r.totalUnits).toBe(370);
    expect(r.totalCost).toBe(4420);
    expect(r.unitsRemaining).toBe(110);
    expect(r.weightedAverageCost).toBeCloseTo(4420 / 370, 4); // 11.9459
    expect(r.costTrend).toBe('rising');
    expect(r.shortfall).toBe(0);
  });

  it('FIFO takes the oldest layers first', () => {
    expect(r.fifo.cogs).toBe(100 * 10 + 150 * 12 + 10 * 13.5); // 2,935
    expect(r.fifo.endingInventory).toBe(110 * 13.5); // 1,485
    expect(r.fifo.layers.map((l) => l.sold)).toEqual([100, 150, 10]);
    expect(r.fifo.cogs + r.fifo.endingInventory).toBeCloseTo(r.totalCost, 2);
  });

  it('LIFO takes the newest layers first', () => {
    expect(r.lifo.cogs).toBe(120 * 13.5 + 140 * 12); // 3,300
    expect(r.lifo.endingInventory).toBe(100 * 10 + 10 * 12); // 1,120
    expect(r.lifo.layers.map((l) => l.sold)).toEqual([0, 140, 120]);
    expect(r.lifoReserve).toBe(r.fifo.endingInventory - r.lifo.endingInventory); // 365
  });

  it('weighted average applies one cost to everything', () => {
    expect(r.average.cogs).toBeCloseTo((4420 / 370) * 260, 2);
    expect(r.average.endingInventory).toBeCloseTo((4420 / 370) * 110, 2);
    expect(r.average.cogs + r.average.endingInventory).toBeCloseTo(r.totalCost, 1);
    expect(r.average.cogs).toBeGreaterThan(r.fifo.cogs);
    expect(r.average.cogs).toBeLessThan(r.lifo.cogs);
  });

  it('gross profit and tax follow the method when a price and rate are given', () => {
    const revenue = 260 * 24;
    expect(r.fifo.grossProfit).toBe(revenue - 2935);
    expect(r.lifo.grossProfit).toBe(revenue - 3300);
    expect(r.fifo.incomeTax).toBe(Math.round((revenue - 2935) * 0.21 * 100) / 100);
    expect(r.lifoTaxSaving).toBeCloseTo((3300 - 2935) * 0.21, 2);
    const noPrice = computeInventoryValuation({ ...INVENTORY_DEFAULTS, sellingPrice: undefined, taxRatePct: undefined });
    expect(noPrice.fifo.grossProfit).toBeNull();
    expect(noPrice.lifoTaxSaving).toBeNull();
  });

  it('caps the sale at the units available and reports the shortfall', () => {
    const over = computeInventoryValuation({ ...INVENTORY_DEFAULTS, unitsSold: 500 });
    expect(over.unitsSold).toBe(370);
    expect(over.shortfall).toBe(130);
    expect(over.fifo.endingInventory).toBe(0);
    expect(over.lifo.cogs).toBe(4420);
  });

  it('falling costs flip the ranking and empty layers are ignored', () => {
    const falling = computeInventoryValuation({ layers: [{ label: 'A', units: 100, unitCost: 15 }, { label: 'B', units: 100, unitCost: 10 }, { label: 'empty', units: 0, unitCost: 99 }], unitsSold: 120 });
    expect(falling.costTrend).toBe('falling');
    expect(falling.fifo.cogs).toBeGreaterThan(falling.lifo.cogs);
    expect(falling.fifo.layers).toHaveLength(2);
  });
});
