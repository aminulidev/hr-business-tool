import { describe, expect, it } from 'vitest';
import { BUDGET_DEFAULTS, computeBudget, computeFunnel, computeStages, FUNNEL_DEFAULTS, STAGE_DEFAULTS } from './marketing';

describe('computeFunnel', () => {
  const r = computeFunnel(FUNNEL_DEFAULTS);
  // $12,000 → 1.5M impressions → 18,000 clicks → 540 leads → 54 customers × $650 at 60% margin
  it('unit costs down the funnel', () => {
    expect(r.cpm).toBe(8); // 12,000 / 1,500 thousand
    expect(r.ctr).toBeCloseTo(1.2, 6);
    expect(r.cpc).toBeCloseTo(0.67, 2);
    expect(r.leadRate).toBeCloseTo(3, 6);
    expect(r.cpl).toBeCloseTo(22.22, 2);
    expect(r.closeRate).toBeCloseTo(10, 6);
    expect(r.cpa).toBeCloseTo(222.22, 2);
    expect(r.clickToCustomer).toBeCloseTo(0.3, 6);
  });
  it('returns, break-even and profit', () => {
    expect(r.revenue).toBe(35100);
    expect(r.grossProfit).toBe(21060);
    expect(r.roas).toBeCloseTo(2.93, 2);
    expect(r.roi).toBeCloseTo(192.5, 1);
    expect(r.profitRoi).toBeCloseTo(75.5, 1);
    expect(r.netProfit).toBe(9060);
    expect(r.breakEvenCpa).toBe(390); // 650 × 60%
    expect(r.breakEvenRoas).toBeCloseTo(1.67, 2);
    expect(r.costOfSale).toBeCloseTo(0.34, 2);
  });
  it('blanks ratios with a zero denominator instead of dividing by zero', () => {
    const z = computeFunnel({ ...FUNNEL_DEFAULTS, impressions: 0, clicks: 0, customers: 0 });
    expect(z.cpm).toBeNull();
    expect(z.cpc).toBeNull();
    expect(z.cpa).toBeNull();
    expect(z.roas).toBe(0);
    expect(z.roi).toBe(-100);
  });
});

describe('computeBudget', () => {
  const r = computeBudget(BUDGET_DEFAULTS)!;
  it('works back from customers to impressions and budget', () => {
    expect(r.leadsNeeded).toBe(1000); // 100 ÷ 10%
    expect(r.clicksNeeded).toBe(33334); // 1,000 ÷ 3%
    expect(r.impressionsNeeded).toBe(2777778); // ÷ 1.2%
    expect(r.budget).toBeCloseTo(33333.33 * 0.7, 0);
    expect(r.expectedCpa).toBeCloseTo(233.33, 1);
    expect(r.expectedRevenue).toBe(65000);
    expect(r.expectedRoas).toBeCloseTo(2.79, 2);
  });
  it('break-even and target ceilings cascade through the rates', () => {
    expect(r.breakEvenCpa).toBe(390);
    expect(r.breakEvenCpl).toBe(39);
    expect(r.breakEvenCpc).toBeCloseTo(1.17, 2);
    expect(r.breakEvenCpm).toBeCloseTo(14.04, 2);
    expect(r.targetCpa).toBe(162.5); // 650 ÷ 4
    expect(r.targetCpc).toBeCloseTo(0.49, 2);
    expect(r.cpaHeadroom).toBeCloseTo(233.33 / 390, 2);
  });
  it('can price on CPM instead of CPC and needs the funnel rates', () => {
    const cpm = computeBudget({ ...BUDGET_DEFAULTS, cpc: 0, cpm: 10 })!;
    expect(cpm.budget).toBeCloseTo((2777777.78 / 1000) * 10, 0);
    expect(computeBudget({ ...BUDGET_DEFAULTS, closeRatePct: 0 })).toBeNull();
  });
});

describe('computeStages', () => {
  it('stage and overall conversion, weakest stage, cost per stage', () => {
    const r = computeStages(STAGE_DEFAULTS, 5000);
    expect(r.stages.map((s) => s.fromPrevious?.toFixed(1) ?? '-')).toEqual(['-', '30.0', '40.0', '50.0', '25.0']);
    expect(r.overallRate).toBeCloseTo(1.5, 6);
    expect(r.topPerBottom).toBeCloseTo(66.67, 2);
    expect(r.stages.find((s) => s.biggestDrop)?.name).toBe('Customers');
    expect(r.stages[0].costEach).toBe(5);
    expect(r.stages[4].costEach).toBeCloseTo(333.33, 2);
    expect(r.bottomIfWeakestPlus10).toBe(17); // 15 × 1.1 = 16.5, rounded
  });
  it('handles empty input', () => {
    expect(computeStages([]).overallRate).toBeNull();
  });
});
