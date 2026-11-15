import { describe, expect, it } from 'vitest';
import { BONUS_DEFAULTS, computeBonusOte, computeCommissionSplit, SPLIT_DEFAULTS } from './commission';

describe('computeCommissionSplit', () => {
  it('splits a real-estate commission after the house cut and fees', () => {
    const r = computeCommissionSplit(SPLIT_DEFAULTS);
    expect(r.grossCommission).toBe(13500); // 450,000 × 3%
    expect(r.houseCut).toBe(2700); // 20%
    expect(r.flatFees).toBe(395);
    expect(r.pool).toBe(10405);
    expect(r.parties[0].amount).toBe(6243); // 60%
    expect(r.parties[1].amount).toBe(4162);
    expect(r.unallocatedPct).toBe(0);
    expect(r.effectiveRateOnSale).toBeCloseTo((6243 / 450000) * 100, 6);
  });
  it('reports unallocated share and caps flat fees at what is left', () => {
    const r = computeCommissionSplit({ ...SPLIT_DEFAULTS, parties: [{ name: 'Rep', sharePct: 70 }], managerOverridePct: 5 });
    expect(r.managerOverride).toBe(675);
    expect(r.unallocatedPct).toBe(30);
    expect(r.unallocatedAmount).toBeCloseTo(r.pool * 0.3, 2);
    const capped = computeCommissionSplit({ ...SPLIT_DEFAULTS, flatFees: 50000 });
    expect(capped.pool).toBe(0);
    expect(capped.flatFees).toBe(13500 - 2700);
  });
});

describe('computeBonusOte', () => {
  const r = computeBonusOte(BONUS_DEFAULTS);
  it('OTE and pay mix at target', () => {
    expect(r.variableAtTarget).toBe(800000 * 0.07 + 10000 + 3000); // 69,000
    expect(r.ote).toBe(139000);
    expect(r.payMixVariablePct).toBeCloseTo((69000 / 139000) * 100, 6);
  });
  it('110% attainment: accelerator above quota, bonus plus one kicker', () => {
    expect(r.actualSales).toBe(880000);
    expect(r.commissionToQuota).toBe(56000);
    expect(r.commissionAbove).toBe(8400); // 80,000 × 7% × 1.5
    expect(r.bonus).toBe(12500); // 10,000 + 1 × 2,500
    expect(r.totalEarnings).toBe(70000 + 56000 + 8400 + 12500 + 3000);
    expect(r.pctOfOte).toBeGreaterThan(100);
  });
  it('bonus is pro-rata between threshold and quota and zero below the threshold', () => {
    expect(computeBonusOte({ ...BONUS_DEFAULTS, attainmentPct: 90 }).bonus).toBe(5000); // halfway from 80 to 100
    expect(computeBonusOte({ ...BONUS_DEFAULTS, attainmentPct: 79 }).bonus).toBe(0);
    expect(computeBonusOte({ ...BONUS_DEFAULTS, attainmentPct: 100 }).bonus).toBe(10000);
    expect(computeBonusOte({ ...BONUS_DEFAULTS, attainmentPct: 129 }).bonus).toBe(15000); // two full 10-point steps
  });
  it('no accelerator below 1×, and earnings per sales dollar is defined', () => {
    const flat = computeBonusOte({ ...BONUS_DEFAULTS, acceleratorMultiplier: 0.5, attainmentPct: 120 });
    expect(flat.commissionAbove).toBe(11200); // 160,000 × 7%, multiplier floored at 1
    expect(r.earningsPerSalesDollar).toBeCloseTo(r.variable / 880000, 10);
  });
});
