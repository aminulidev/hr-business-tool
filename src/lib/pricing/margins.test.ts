import { describe, expect, it } from 'vitest';
import { computeContribution, computeMarginLadder, computeWholesaleChain, CONTRIBUTION_DEFAULTS, MARGIN_LADDER_DEFAULTS, MARGIN_RANGES, WHOLESALE_DEFAULTS } from './margins';

describe('computeMarginLadder', () => {
  it('walks revenue down to net income with the right margins', () => {
    const r = computeMarginLadder(MARGIN_LADDER_DEFAULTS);
    expect(r.grossProfit).toBe(660000);
    expect(r.grossMargin).toBeCloseTo(55, 6);
    expect(r.ebitda).toBe(240000);
    expect(r.operatingIncome).toBe(210000);
    expect(r.operatingMargin).toBeCloseTo(17.5, 6);
    expect(r.pretaxIncome).toBe(192000);
    expect(r.netIncome).toBe(152000);
    expect(r.netMargin).toBeCloseTo(12.6667, 3);
    expect(r.layers.reduce((s, l) => s + l.pctOfRevenue, 0) + r.netMargin).toBeCloseTo(100, 6);
  });
  it('allows losses and zero revenue', () => {
    const r = computeMarginLadder({ ...MARGIN_LADDER_DEFAULTS, revenue: 500000 });
    expect(r.netIncome).toBe(-548000);
    expect(r.netMargin).toBeLessThan(0);
    expect(computeMarginLadder({ ...MARGIN_LADDER_DEFAULTS, revenue: 0 }).grossMargin).toBe(0);
  });
  it('ranges table is complete', () => {
    for (const row of MARGIN_RANGES) expect(row.gross && row.operating && row.net && row.note).toBeTruthy();
  });
});

describe('computeContribution', () => {
  it('matches the textbook example: $50 price, $20 variable, 1,000 units, $18,000 fixed', () => {
    const r = computeContribution(CONTRIBUTION_DEFAULTS);
    expect(r.cmPerUnit).toBe(30);
    expect(r.cmRatio).toBeCloseTo(60, 6);
    expect(r.totalContribution).toBe(30000);
    expect(r.operatingIncome).toBe(12000);
    expect(r.breakEvenUnits).toBe(600);
    expect(r.breakEvenRevenue).toBe(30000);
    expect(r.marginOfSafety).toBeCloseTo(40, 6);
    expect(r.operatingLeverage).toBe(2.5);
  });
  it('rounds break-even units up and reports no break-even when the unit loses money', () => {
    expect(computeContribution({ price: 50, variableCost: 20, units: 100, fixedCosts: 1000 }).breakEvenUnits).toBe(34); // 33.33 → 34
    const bad = computeContribution({ price: 10, variableCost: 12, units: 100, fixedCosts: 1000 });
    expect(bad.breakEvenUnits).toBeNull();
    expect(bad.operatingLeverage).toBeNull();
  });
});

describe('computeWholesaleChain', () => {
  it('keystone: $12 cost, 50% wholesale margin, 2× retail', () => {
    const r = computeWholesaleChain(WHOLESALE_DEFAULTS);
    expect(r.wholesalePrice).toBe(24);
    expect(r.retailPrice).toBe(48);
    expect(r.makerProfit).toBe(12);
    expect(r.makerMarkup).toBeCloseTo(100, 6);
    expect(r.retailerProfit).toBe(24);
    expect(r.retailerMargin).toBeCloseTo(50, 6);
    expect(r.distributorPrice).toBeNull();
    expect(r.shares.reduce((s, x) => s + x.share, 0)).toBeCloseTo(1, 6);
  });
  it('inserts a distributor layer when a distributor margin is given', () => {
    const r = computeWholesaleChain({ ...WHOLESALE_DEFAULTS, distributorMarginPct: 20 });
    expect(r.distributorPrice).toBe(30);
    expect(r.retailPrice).toBe(60);
    expect(r.distributorProfit).toBe(6);
    expect(r.shares).toHaveLength(4);
  });
  it('clamps impossible margins and multipliers', () => {
    const r = computeWholesaleChain({ unitCost: 10, wholesaleMarginPct: 150, retailMultiplier: 0.5, distributorMarginPct: 0 });
    expect(Number.isFinite(r.wholesalePrice)).toBe(true);
    expect(r.retailPrice).toBe(r.wholesalePrice);
  });
});
