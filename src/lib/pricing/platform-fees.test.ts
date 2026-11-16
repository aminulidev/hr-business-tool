import { describe, expect, it } from 'vitest';
import {
  COMPARE_DEFAULTS,
  computeCompare,
  computeFiverrBuyer,
  computeFiverrSeller,
  FIVERR_BUYER_DEFAULTS,
  FIVERR_FEES,
  FIVERR_SELLER_DEFAULTS,
} from './platform-fees';

describe('computeFiverrBuyer', () => {
  it('adds 5.5% plus the small-order fee under the threshold, and 5.5% on the tip', () => {
    const r = computeFiverrBuyer(FIVERR_BUYER_DEFAULTS)!; // $80 order, $10 tip
    expect(r.percentageFee).toBe(4.4);
    expect(r.smallOrderFee).toBe(3);
    expect(r.tipFee).toBe(0.55);
    expect(r.feeTotal).toBe(7.95);
    expect(r.total).toBe(97.95);
    expect(r.effectiveFeePct).toBeCloseTo((7.95 / 90) * 100, 6);
    expect(r.sellerReceives).toBe(72); // 80% of $90
    expect(r.fiverrKeeps).toBe(25.95);
    expect(r.fiverrTakePct).toBeCloseTo((25.95 / 97.95) * 100, 6);
  });
  it('no small-order fee at or above the threshold', () => {
    const at = computeFiverrBuyer({ orderAmount: 100, tip: 0, fees: FIVERR_FEES })!;
    expect(at.smallOrderFee).toBe(0);
    expect(at.total).toBe(105.5);
    const five = computeFiverrBuyer({ orderAmount: 5, tip: 0, fees: FIVERR_FEES })!;
    expect(five.total).toBeCloseTo(5 + 0.28 + 3, 2); // a $5 gig costs $8.28
    expect(five.effectiveFeePct).toBeCloseTo(65.5, 1);
  });
  it('fees are parameters, so an older schedule can be modelled', () => {
    const old = computeFiverrBuyer({ orderAmount: 40, tip: 0, fees: { ...FIVERR_FEES, smallOrderFee: 2, smallOrderThreshold: 50 } })!;
    expect(old.total).toBe(44.2);
    expect(computeFiverrBuyer({ orderAmount: 0, tip: 5, fees: FIVERR_FEES })).toBeNull();
  });
});

describe('computeFiverrSeller', () => {
  const r = computeFiverrSeller(FIVERR_SELLER_DEFAULTS)!; // $150 + $40 extras + $10 tip
  it('20% comes off the order, the extras and the tip', () => {
    expect(r.orderValue).toBe(200);
    expect(r.fiverrFee).toBe(40);
    expect(r.tipFee).toBe(2);
    expect(r.netPerOrder).toBe(160);
    expect(r.keepPct).toBe(80);
  });
  it('reverse price: divide by 0.80, do not add 20%', () => {
    expect(r.priceForTarget).toBe(250); // $200 ÷ 0.80
    expect(r.shortfallIfAddingFee).toBe(8); // $240 × 0.80 = $192
  });
  it('what the buyer pays and what Fiverr keeps in total', () => {
    // buyer: $190 order (no small fee) + 5.5% = $200.45, tip $10 + $0.55
    expect(r.buyerPays).toBe(211);
    expect(r.fiverrKeeps).toBe(51);
    expect(r.fiverrTakePct).toBeCloseTo((51 / 211) * 100, 6);
  });
  it('monthly figures and effective hourly rate', () => {
    expect(r.monthlyGross).toBe(2400);
    expect(r.monthlyFees).toBe(480);
    expect(r.monthlyNet).toBe(1920);
    expect(r.annualNet).toBe(23040);
    expect(r.effectiveHourly).toBe(40);
    expect(r.grossHourly).toBe(50);
    const withFees = computeFiverrSeller({ ...FIVERR_SELLER_DEFAULTS, withdrawalFee: 3, withdrawalsPerMonth: 4 })!;
    expect(withFees.monthlyNet).toBe(1908);
    expect(computeFiverrSeller({ ...FIVERR_SELLER_DEFAULTS, price: 0, extras: 0 })).toBeNull();
  });
});

describe('computeCompare', () => {
  const r = computeCompare(COMPARE_DEFAULTS)!; // $500 job, Upwork 10% / 5%
  it('same quote on both platforms', () => {
    expect(r.fiverr.freelancerNets).toBe(400);
    expect(r.fiverr.clientPays).toBe(527.5);
    expect(r.fiverr.platformKeeps).toBe(127.5);
    expect(r.fiverr.takePct).toBeCloseTo((127.5 / 527.5) * 100, 6);
    expect(r.upwork.freelancerNets).toBe(450);
    expect(r.upwork.clientPays).toBe(525);
    expect(r.upwork.platformKeeps).toBe(75);
    expect(r.freelancerDifference).toBe(50);
    expect(r.clientDifference).toBe(2.5);
  });
  it('quote needed to net the target on each platform', () => {
    expect(r.fiverr.priceForTarget).toBe(625);
    expect(r.fiverr.clientPaysForTarget).toBeCloseTo(625 * 1.055, 2);
    expect(r.upwork.priceForTarget).toBeCloseTo(555.56, 2);
    expect(r.upwork.clientPaysForTarget).toBeCloseTo(555.56 * 1.05, 1);
  });
  it('small jobs carry the Fiverr small-order fee; Upwork matches Fiverr only at a 20% fee', () => {
    const small = computeCompare({ ...COMPARE_DEFAULTS, projectPrice: 50 })!;
    expect(small.fiverr.clientFee).toBe(5.75);
    expect(small.upwork.clientFee).toBe(2.5);
    expect(r.breakEvenUpworkFeePct).toBe(20);
    const top = computeCompare({ ...COMPARE_DEFAULTS, upworkFreelancerFeePct: 15 })!;
    expect(top.upwork.freelancerNets).toBe(425);
  });
});
