import { describe, expect, it } from 'vitest';
import {
  computeFounderSplit,
  computePool,
  computeRound,
  computeSafes,
  FOUNDER_DEFAULTS,
  POOL_DEFAULTS,
  ROUND_DEFAULTS,
  SAFE_DEFAULTS,
  vestedFraction,
} from './startup-equity';

describe('computeRound', () => {
  it('no pool: price = pre ÷ existing shares, investor gets investment ÷ post', () => {
    const r = computeRound({ ...ROUND_DEFAULTS, poolPct: 0, existingPoolShares: 0 })!;
    expect(r.postMoney).toBe(12500000);
    expect(r.investorPct).toBeCloseTo(20, 6);
    expect(r.pricePerShare).toBe(1); // 10M ÷ 10M shares
    expect(r.newInvestorShares).toBe(2500000);
    expect(r.table[0].afterPct).toBeCloseTo((4500000 / 12500000) * 100, 6);
    expect(r.table[0].dilutionPct).toBeCloseTo(20, 6);
  });
  it('pool shuffle: 15% post pool created pre-money dilutes only existing holders', () => {
    const r = computeRound(ROUND_DEFAULTS)!;
    // E = 9M non-pool shares = T × (1 − 0.2 − 0.15) → T = 13,846,154
    expect(r.totalSharesAfter).toBe(13846154);
    expect(r.poolPctAfter).toBeCloseTo(15, 4);
    expect(r.investorPct).toBeCloseTo(20, 6);
    expect(r.existingPctAfter).toBeCloseTo(65, 4);
    expect(r.newPoolShares).toBe(1076923); // 15% × T − 1M existing pool
    expect(r.pricePerShare).toBeCloseTo(12500000 / 13846154, 3); // 0.9028
    expect(r.pricePerShareNoShuffle).toBe(1);
    expect(r.effectivePreMoney).toBeCloseTo(0.9028 * 9000000, -3); // ≈ $8.1M for the founders
    const founderA = r.table[0];
    expect(founderA.afterPct).toBeCloseTo((4500000 / 13846154) * 100, 4); // 32.5%
    expect(founderA.dilutionPct).toBeCloseTo((1 - 4500000 / 13846154 / 0.45) * 100, 3);
  });
  it('pool after the round dilutes the investor too', () => {
    const r = computeRound({ ...ROUND_DEFAULTS, poolInPreMoney: false })!;
    expect(r.pricePerShare).toBe(1);
    expect(r.poolPctAfter).toBeCloseTo(15, 4);
    expect(r.investorPct).toBeCloseTo(20, 6); // paid 20% …
    const investorShare = r.newInvestorShares / r.totalSharesAfter;
    expect(investorShare).toBeLessThan(0.2); // … but owns less after the pool
    expect(investorShare).toBeCloseTo(0.2 * (1 - 0.15) / (1 - 0.15 + (0.15 - 1000000 / 12500000)) , 1);
  });
  it('rejects impossible inputs', () => {
    expect(computeRound({ ...ROUND_DEFAULTS, holders: [] })).toBeNull();
    expect(computeRound({ ...ROUND_DEFAULTS, poolPct: 85 })).toBeNull();
  });
});

describe('computeSafes', () => {
  const r = computeSafes(SAFE_DEFAULTS)!;
  it('each SAFE converts at the better of cap and discount', () => {
    // SAFE 1: cap → 500k/6M × 70% = 5.83% post; discount → 500k/(0.8 × 15M) = 4.17% → cap wins; pre-round 8.33%
    expect(r.safes[0].method).toBe('cap');
    expect(r.safes[0].effectiveValuation).toBe(6000000);
    expect(r.safes[0].preRoundPct).toBeCloseTo(8.3333, 3);
    // SAFE 2: cap 8M, no discount → cap; f = 250k/8M = 3.125%
    expect(r.safes[1].method).toBe('cap');
    expect(r.safes[1].preRoundPct).toBeCloseTo(3.125, 6);
  });
  it('the priced round and pool dilute SAFEs and founders alike', () => {
    expect(r.investorPct).toBeCloseTo(20, 6);
    expect(r.poolPct).toBe(10);
    const shareOfOld = 0.7;
    expect(r.safes[0].postRoundPct).toBeCloseTo(8.3333 * shareOfOld, 2);
    expect(r.existingPctPostRound).toBeCloseTo((1 - 0.083333 - 0.03125) * 70, 2);
    expect(r.safes[0].postRoundPct + r.safes[1].postRoundPct + r.existingPctPostRound + r.investorPct + r.poolPct).toBeCloseTo(100, 6);
  });
  it('conversion price, realized discount and paper multiple', () => {
    expect(r.safes[0].conversionPrice).toBeLessThan(r.roundPricePerShare);
    // cap 6M against the effective pre-money the old holders get (12M − 10% × 15M = 10.5M) → 42.9% off the round price
    expect(r.safes[0].realizedDiscountPct).toBeCloseTo((1 - 6000000 / 10500000) * 100, 3);
    expect(r.safes[0].multipleOnMoney).toBeCloseTo(1.75, 2); // 5.83% × 15M ÷ 500k
    expect(r.safes[1].multipleOnMoney).toBeCloseTo(1.31, 2);
    expect(r.roundPricePerShare).toBeCloseTo(15000000 / r.totalSharesAfter, 3);
  });
  it('discount wins when the cap is high, and uncapped no-discount converts at the round price', () => {
    const d = computeSafes({ ...SAFE_DEFAULTS, safes: [{ name: 'D', amount: 100000, cap: 20000000, discountPct: 20 }, { name: 'U', amount: 100000, cap: 0, discountPct: 0 }] })!;
    expect(d.safes[0].method).toBe('discount');
    expect(d.safes[0].effectiveValuation).toBe(12000000); // 15M post × 0.8
    expect(d.safes[0].realizedDiscountPct).toBeCloseTo(20, 6);
    expect(d.safes[0].postRoundPct).toBeCloseTo((100000 / 12000000) * 100, 6);
    expect(d.safes[1].method).toBe('round');
    expect(d.safes[1].realizedDiscountPct).toBeCloseTo(0, 6);
    expect(d.safes[1].conversionPrice).toBe(d.roundPricePerShare);
  });
  it('reports what founders would have kept had the SAFE money been raised in the round', () => {
    // 750k + 3M on 12M pre → old holders 76.2%, less the 10% pool
    expect(r.existingPctIfPriced).toBeCloseTo((1 - 3750000 / 15750000 - 0.1) * 100, 6);
    expect(r.existingPctIfPriced).toBeGreaterThan(r.existingPctPostRound); // the SAFE caps cost them
  });
  it('refuses a SAFE stack that would leave founders nothing', () => {
    expect(computeSafes({ ...SAFE_DEFAULTS, safes: [{ name: 'X', amount: 5000000, cap: 5000000, discountPct: 0 }] })).toBeNull();
  });
});

describe('computePool', () => {
  const r = computePool(POOL_DEFAULTS)!;
  it('plan consumption and top-up', () => {
    expect(r.poolShares).toBe(1250000);
    expect(r.grantedShares).toBe(437500);
    expect(r.availablePct).toBeCloseTo(6.5, 6);
    // 1 + 1.2 + 0.3 + 0.25 = 2.75%
    expect(r.planPct).toBeCloseTo(2.75, 6);
    expect(r.plan[1].sharesEach).toBe(50000);
    expect(r.plan[1].totalShares).toBe(150000);
    expect(r.remainingAfterPlanPct).toBeCloseTo(3.75, 6);
    expect(r.requiredPoolPct).toBeCloseTo(3.5 + 2.75 + 2, 6);
    expect(r.topUpPct).toBe(0);
  });
  it('asks for a top-up when the plan exceeds the pool', () => {
    const big = computePool({ ...POOL_DEFAULTS, hires: [{ role: 'CEO', count: 1, grantPct: 5 }, { role: 'VPs', count: 3, grantPct: 1.5 }] })!;
    expect(big.planPct).toBeCloseTo(9.5, 6);
    expect(big.topUpPct).toBeCloseTo(3.5 + 9.5 + 2 - 10, 6); // 5 points
    expect(big.topUpShares).toBe(625000);
  });
});

describe('computeFounderSplit', () => {
  it('splits each factor weight by score and vests on a cliff schedule', () => {
    const r = computeFounderSplit(FOUNDER_DEFAULTS)!;
    expect(r.totalWeight).toBe(100);
    expect(r.founders.reduce((s, f) => s + f.pct, 0)).toBeCloseTo(100, 6);
    expect(r.founders[0].pct).toBeGreaterThan(r.founders[2].pct); // full-time CEO over part-timer
    // time factor (35) split 10:10:4 → 14.58 / 14.58 / 5.83
    const time = r.byFactor.find((f) => f.key === 'time')!;
    expect(time.shares[0].contribution).toBeCloseTo(35 * (10 / 24), 6);
    expect(r.founders.reduce((s, f) => s + (f.shares ?? 0), 0)).toBeCloseTo(8000000, -1);
    expect(r.vestedFraction).toBeCloseTo(18 / 48, 6);
    expect(r.founders[0].vestedShares).toBe(Math.round(r.founders[0].shares! * (18 / 48)));
  });
  it('vesting cliff and cap', () => {
    expect(vestedFraction(11, 48, 12)).toBe(0);
    expect(vestedFraction(12, 48, 12)).toBeCloseTo(0.25, 6);
    expect(vestedFraction(60, 48, 12)).toBe(1);
  });
  it('equal weights fall back to an even split when nobody scores', () => {
    const r = computeFounderSplit({ ...FOUNDER_DEFAULTS, founders: [{ name: 'A', scores: {} }, { name: 'B', scores: {} }] })!;
    expect(r.founders[0].pct).toBeCloseTo(50, 6);
  });
});
