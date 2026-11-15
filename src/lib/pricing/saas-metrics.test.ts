import { describe, expect, it } from 'vitest';
import {
  CHURN_DEFAULTS,
  churnConversionRow,
  CLV_DEFAULTS,
  computeChurn,
  computeClv,
  computeFunnel,
  computeLtvCac,
  computeMau,
  computeMovements,
  computeMrr,
  computePricing,
  CONTRACT_DEFAULTS,
  FUNNEL_DEFAULTS,
  LTV_CAC_DEFAULTS,
  MAU_DEFAULTS,
  MOVEMENTS_DEFAULTS,
  MRR_DEFAULTS,
  normalizeContract,
  PRICING_DEFAULTS,
  ratioVerdict,
} from './saas-metrics';

describe('computeMrr', () => {
  const r = computeMrr(MRR_DEFAULTS)!;
  it('normalises annual plans to monthly and totals MRR, ARR and ARPA', () => {
    expect(r.plans[2].mrrPerCustomer).toBe(249); // $2,988 ÷ 12
    expect(r.plans[2].acvPerCustomer).toBe(2988);
    expect(r.plans[3].mrr).toBe(18000); // 6 × $36,000 ÷ 12
    expect(r.mrr).toBe(12180 + 14850 + 9960 + 18000);
    expect(r.arr).toBe(r.mrr * 12);
    expect(r.customers).toBe(616);
    expect(r.arpa).toBeCloseTo(54990 / 616, 2);
    expect(r.largestPlan).toBe('Enterprise (annual)');
    expect(r.plans.reduce((s, p) => s + p.mrrShare, 0)).toBeCloseTo(100, 6);
  });
  it('handles quarterly and multi-year billing', () => {
    const q = computeMrr({ plans: [{ name: 'Q', customers: 10, price: 300, billing: 'quarterly' }, { name: '3y', customers: 1, price: 36000, billing: 'multi', termYears: 3 }] })!;
    expect(q.plans[0].mrr).toBe(1000);
    expect(q.plans[1].mrr).toBe(1000);
  });
  it('rejects empty tables', () => {
    expect(computeMrr({ plans: [{ name: 'x', customers: 0, price: 10, billing: 'monthly' }] })).toBeNull();
  });
});

describe('normalizeContract', () => {
  it('excludes one-time fees and spreads the rest over the term', () => {
    const c = normalizeContract(CONTRACT_DEFAULTS)!;
    expect(c.recurring).toBe(36000);
    expect(c.acv).toBe(36000);
    expect(c.mrr).toBe(3000);
    const three = normalizeContract({ totalContractValue: 150000, termMonths: 36, oneTimeFees: 0 })!;
    expect(three.acv).toBe(50000);
    expect(three.mrr).toBeCloseTo(4166.67, 2);
  });
});

describe('computeMovements', () => {
  const r = computeMovements(MOVEMENTS_DEFAULTS)!;
  it('builds the net new MRR bridge', () => {
    expect(r.expansionMrr).toBe(6000);
    expect(r.gainedMrr).toBe(12500);
    expect(r.lostMrr).toBe(4500);
    expect(r.netNewMrr).toBe(8000);
    expect(r.endingMrr).toBe(108000);
    expect(r.growthPct).toBeCloseTo(8, 6);
    expect(r.quickRatio).toBeCloseTo(2.78, 2);
    expect(r.grrPct).toBeCloseTo(95.5, 6);
    expect(r.nrrPct).toBeCloseTo(101.5, 6);
    expect(r.netRevenueChurnPct).toBeCloseTo(-1.5, 6);
    expect(r.bridge.reduce((s, b) => (b.kind === 'start' || b.kind === 'end' ? s : s + b.amount), 0)).toBe(8000);
  });
  it('annualises growth and reports doubling time', () => {
    expect(r.annualizedGrowthPct).toBeCloseTo((Math.pow(1.08, 12) - 1) * 100, 6);
    expect(r.monthsToDouble).toBe(9); // ln 2 ÷ ln 1.08 = 9.006, shown to one decimal
    expect(computeMovements({ ...MOVEMENTS_DEFAULTS, newMrr: 0, upsellMrr: 0, seatMrr: 0, crossSellMrr: 0, reactivationMrr: 0 })!.monthsToDouble).toBeNull();
    expect(computeMovements({ ...MOVEMENTS_DEFAULTS, contractionMrr: 0, churnedMrr: 0 })!.quickRatio).toBeNull();
  });
});

describe('computeFunnel', () => {
  it('conversion rate, MRR and what the target needs', () => {
    const r = computeFunnel(FUNNEL_DEFAULTS)!;
    expect(r.conversionRatePct).toBeCloseTo(18, 6);
    expect(r.newMrr).toBe(8820);
    expect(r.valuePerSignup).toBe(8.82);
    expect(r.conversionsNeeded).toBe(307); // ceil(15,000 ÷ 49)
    expect(r.signupsNeeded).toBe(1706); // ceil(307 ÷ 0.18)
    expect(r.extraSignupsNeeded).toBe(706);
    expect(r.rateNeededPct).toBeCloseTo(30.7, 6);
    expect(r.mrrPerRatePoint).toBe(490);
  });
  it('caps conversions at sign-ups', () => {
    expect(computeFunnel({ ...FUNNEL_DEFAULTS, conversions: 5000 })!.conversionRatePct).toBe(100);
  });
});

describe('computePricing', () => {
  const r = computePricing(PRICING_DEFAULTS)!;
  it('margin per tier, step-ups and blended figures', () => {
    expect(r.tiers[0].grossMarginPct).toBeCloseTo((13 / 19) * 100, 6);
    expect(r.tiers[1].stepUp).toBeCloseTo(2.58, 2);
    expect(r.tiers[2].stepUp).toBeCloseTo(2.63, 2);
    expect(r.ladderRatio).toBeCloseTo(6.79, 2);
    expect(r.mrr).toBe(11400 + 12250 + 7740);
    expect(r.customers).toBe(910);
    expect(r.blendedArpu).toBeCloseTo(31390 / 910, 2);
    expect(r.grossProfit).toBe(31390 - 910 * 6);
    expect(r.blendedMarginPct).toBeCloseTo(((31390 - 5460) / 31390) * 100, 6);
  });
  it('flags a tier priced below cost', () => {
    const low = computePricing({ costPerUser: 10, tiers: [{ name: 'Free-ish', price: 5, customers: 100 }] })!;
    expect(low.tiers[0].grossMarginPct).toBeLessThan(0);
    expect(low.breakEvenPrice).toBe(10);
  });
});

describe('computeChurn', () => {
  const r = computeChurn(CHURN_DEFAULTS)!;
  it('logo churn, annualisation and lifetime', () => {
    expect(r.logoChurnPct).toBeCloseTo(4, 6);
    expect(r.endCustomers).toBe(515);
    expect(r.monthlyLogoChurnPct).toBeCloseTo(4, 6);
    expect(r.annualLogoChurnPct).toBeCloseTo((1 - Math.pow(0.96, 12)) * 100, 6);
    expect(r.avgLifetimeMonths).toBe(25);
    expect(r.cohortAfter12Months).toBe(Math.round(500 * Math.pow(0.96, 12)));
  });
  it('revenue churn, GRR and NRR', () => {
    expect(r.grossRevenueChurnPct).toBeCloseTo(4.2, 6);
    expect(r.netRevenueChurnPct).toBeCloseTo(-0.3, 6);
    expect(r.grrPct).toBeCloseTo(95.8, 6);
    expect(r.nrrPct).toBeCloseTo(100.3, 6);
    expect(r.annualGrrPct).toBeCloseTo(Math.pow(0.958, 12) * 100, 6);
    expect(r.churnerSizeRatio).toBe(0.75); // $150 per lost customer vs $200 average
  });
  it('converts a quarterly figure to monthly before annualising', () => {
    const q = computeChurn({ ...CHURN_DEFAULTS, periodMonths: 3, lostCustomers: 60 })!;
    expect(q.logoChurnPct).toBeCloseTo(12, 6);
    expect(q.monthlyLogoChurnPct).toBeCloseTo((1 - Math.pow(0.88, 1 / 3)) * 100, 6);
    expect(q.annualGrrPct).toBeCloseTo(Math.pow(0.958, 4) * 100, 6);
  });
  it('reference row: 3% monthly is 30.6% a year, not 36%', () => {
    const row = churnConversionRow(3);
    expect(row.simpleAnnualPct).toBe(36);
    expect(row.annualPct).toBeCloseTo(30.62, 2);
    expect(row.lifetimeMonths).toBeCloseTo(33.33, 2);
  });
});

describe('computeClv', () => {
  it('gross-margin CLV, LTV:CAC and payback', () => {
    const r = computeClv(CLV_DEFAULTS)!;
    expect(r.grossProfitMonthly).toBe(80);
    expect(r.lifetimeMonths).toBeCloseTo(33.33, 2);
    expect(r.capped).toBe(false);
    expect(r.clv).toBeCloseTo(2666.67, 2);
    expect(r.ltvCac).toBeCloseTo(3.33, 2);
    expect(r.paybackMonths).toBe(10);
    expect(r.maxCacAt3x).toBeCloseTo(888.89, 2);
    expect(r.verdict.level).toBe('healthy');
  });
  it('caps long lifetimes and handles zero churn', () => {
    const ent = computeClv({ arpu: 4000, grossMarginPct: 85, monthlyChurnPct: 0.8, cac: 20000, capMonths: 60 })!;
    expect(ent.lifetimeMonths).toBe(125);
    expect(ent.capped).toBe(true);
    expect(ent.clv).toBe(3400 * 60);
    const zero = computeClv({ ...CLV_DEFAULTS, monthlyChurnPct: 0, capMonths: 0 })!;
    expect(zero.lifetimeUsedMonths).toBe(60);
    expect(zero.capped).toBe(true);
  });
  it('verdict bands', () => {
    expect(ratioVerdict(0.8).level).toBe('bad');
    expect(ratioVerdict(2).level).toBe('thin');
    expect(ratioVerdict(4).level).toBe('healthy');
    expect(ratioVerdict(7).level).toBe('under-investing');
  });
});

describe('computeLtvCac', () => {
  const r = computeLtvCac(LTV_CAC_DEFAULTS)!;
  it('CAC and ratio per channel, blended, best and worst', () => {
    expect(r.channels[0].cac).toBe(800);
    expect(r.channels[1].cac).toBe(300);
    expect(r.channels[2].cac).toBe(1200);
    expect(r.channels[1].ratio).toBe(9);
    expect(r.channels[2].ratio).toBe(2.25);
    expect(r.blendedCac).toBe(800);
    expect(r.blendedRatio).toBeCloseTo(3.38, 2);
    expect(r.bestChannel).toBe('Content & SEO');
    expect(r.worstChannel).toBe('Outbound sales');
    expect(r.channels[2].netReturn).toBe(25 * 2700 - 30000);
    expect(r.maxCacAt3x).toBe(900);
  });
  it('a channel with spend but no customers has no ratio', () => {
    const z = computeLtvCac({ ltv: 1000, channels: [{ name: 'Events', spend: 5000, customers: 0 }] })!;
    expect(z.channels[0].cac).toBeNull();
    expect(z.blendedRatio).toBeNull();
  });
});

describe('computeMau', () => {
  it('value per MAU, ARPPU, paying share and stickiness', () => {
    const r = computeMau(MAU_DEFAULTS)!;
    expect(r.arpuPerMau).toBe(1);
    expect(r.annualValuePerMau).toBe(12);
    expect(r.arppu).toBe(25);
    expect(r.payingSharePct).toBeCloseTo(4, 6);
    expect(r.stickinessPct).toBeCloseTo(24, 6);
    expect(r.revenuePerDau).toBeCloseTo(4.17, 2);
    expect(r.revenuePerPayingPoint).toBe(12500);
  });
});
