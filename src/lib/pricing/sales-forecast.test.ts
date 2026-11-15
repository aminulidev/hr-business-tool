import { describe, expect, it } from 'vitest';
import { computeGrowth, computePipeline, computeRetention, GROWTH_DEFAULTS, PIPELINE_DEFAULTS, RETENTION_DEFAULTS } from './sales-forecast';

describe('computePipeline', () => {
  const r = computePipeline(PIPELINE_DEFAULTS);
  it('weights each stage and sums', () => {
    expect(r.totalPipeline).toBe(1900000);
    // 60k + 125k + 200k + 187.5k + 135k
    expect(r.weightedPipeline).toBe(707500);
    expect(r.stages[2].weighted).toBe(200000);
    expect(r.stages.reduce((s, x) => s + x.share, 0)).toBeCloseTo(1, 6);
    expect(r.totalDeals).toBe(56);
  });
  it('win rate, coverage, timing and gap', () => {
    expect(r.winRate).toBeCloseTo((25 / 85) * 100, 6);
    expect(r.lossRate).toBeCloseTo((60 / 85) * 100, 6);
    expect(r.winRateForecast).toBeCloseTo(1900000 * (25 / 85), 0);
    expect(r.timingFactor).toBe(1); // 90-day window, 90-day cycle
    expect(r.forecastInWindow).toBe(707500);
    expect(r.coverage).toBeCloseTo(1900000 / 600000, 6);
    expect(r.gap).toBe(-107500); // ahead of quota
    expect(r.pipelineToAdd).toBe(0);
    expect(r.pipelineNeeded).toBeCloseTo(600000 / (25 / 85), 0);
    expect(r.dealsNeeded).toBe(20);
  });
  it('a short window scales the forecast and a shortfall asks for more pipeline', () => {
    const short = computePipeline({ ...PIPELINE_DEFAULTS, forecastDays: 45, quota: 900000 });
    expect(short.timingFactor).toBe(0.5);
    expect(short.forecastInWindow).toBe(353750);
    expect(short.gap).toBe(546250);
    expect(short.pipelineToAdd).toBeCloseTo(546250 / (25 / 85) / 0.5, 0);
  });
  it('falls back to the weighted probability when there is no closed history', () => {
    const noHist = computePipeline({ ...PIPELINE_DEFAULTS, wonDeals: 0, lostDeals: 0 });
    expect(noHist.winRate).toBeNull();
    expect(noHist.pipelineNeeded).toBeCloseTo(600000 / (707500 / 1900000), 0);
  });
});

describe('computeGrowth', () => {
  const r = computeGrowth(GROWTH_DEFAULTS);
  it('growth, annualised and monthly rates', () => {
    expect(r.growthPct).toBeCloseTo(20, 6);
    expect(r.absoluteGrowth).toBe(200000);
    expect(r.annualizedPct).toBeCloseTo(20, 6); // already annual
    expect(r.monthlyPct).toBeCloseTo((Math.pow(1.2, 1 / 12) - 1) * 100, 6);
    expect(r.doublingPeriods).toBeCloseTo(Math.log(2) / Math.log(1.2), 2);
  });
  it('projects with bands at the measured rate by default', () => {
    expect(r.rateUsedPct).toBe(20);
    expect(r.projection).toHaveLength(3);
    expect(r.endBase).toBeCloseTo(1200000 * 1.2 ** 3, 0);
    expect(r.endOptimistic).toBeCloseTo(1200000 * 1.25 ** 3, 0);
    expect(r.endConservative).toBeCloseTo(1200000 * 1.15 ** 3, 0);
  });
  it('monthly periods annualise correctly and a custom rate overrides', () => {
    const m = computeGrowth({ previousRevenue: 100000, currentRevenue: 105000, periodMonths: 1, projectPeriods: 12, projectionRatePct: 5, bandPts: 2 });
    expect(m.annualizedPct).toBeCloseTo((Math.pow(1.05, 12) - 1) * 100, 4);
    expect(m.endBase).toBeCloseTo(105000 * 1.05 ** 12, 0);
    expect(computeGrowth({ ...GROWTH_DEFAULTS, previousRevenue: 0 }).growthPct).toBeNull();
  });
});

describe('computeRetention', () => {
  const r = computeRetention(RETENTION_DEFAULTS);
  it('retained, churned and rates for a monthly period', () => {
    expect(r.retained).toBe(430); // 480 − 50
    expect(r.churned).toBe(70);
    expect(r.retentionPct).toBeCloseTo(86, 6);
    expect(r.churnPct).toBeCloseTo(14, 6);
    expect(r.annualRetentionPct).toBeCloseTo(Math.pow(0.86, 12) * 100, 4);
    expect(r.averageLifetimeMonths).toBeCloseTo(1 / 0.14, 2);
    expect(r.netGrowthPct).toBeCloseTo(-4, 6);
    expect(r.replacementPerPeriod).toBe(70);
  });
  it('prices the churn and projects the cohort', () => {
    expect(r.churnedRevenuePeriod).toBe(70 * 120);
    expect(r.churnedRevenueAnnual).toBeCloseTo(500 * (1 - Math.pow(0.86, 12)) * 120 * 12, 0);
    expect(r.cohortAfter12Months).toBe(Math.round(500 * Math.pow(0.86, 12)));
  });
  it('annual periods and perfect retention', () => {
    const a = computeRetention({ startCustomers: 1000, endCustomers: 1000, newCustomers: 0, periodMonths: 12, revenuePerCustomerMonthly: 0 });
    expect(a.retentionPct).toBe(100);
    expect(a.averageLifetimeMonths).toBeNull();
    expect(a.churnedRevenuePeriod).toBeNull();
    const clamp = computeRetention({ startCustomers: 100, endCustomers: 300, newCustomers: 50, periodMonths: 1, revenuePerCustomerMonthly: 0 });
    expect(clamp.retained).toBe(100); // cannot retain more than you started with
  });
});
