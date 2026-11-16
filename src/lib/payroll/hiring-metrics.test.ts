import { describe, expect, it } from 'vitest';
import {
  computeSources,
  computeTime,
  computeTraining,
  computeTurnover,
  SOURCES_DEFAULTS,
  TIME_DEFAULTS,
  TRAINING_DEFAULTS,
  TURNOVER_DEFAULTS,
} from './hiring-metrics';

describe('computeTime', () => {
  const r = computeTime(TIME_DEFAULTS)!;
  it('separates time to fill, time to hire and time to start', () => {
    expect(r.timeToFill).toBe(5 + 12 + 7 + 14 + 6); // approval → acceptance = 44
    expect(r.timeToHire).toBe(7 + 14 + 6); // candidate enters → acceptance = 27
    expect(r.timeToStart).toBe(58);
    expect(r.bottleneck).toBe('Interviews');
    expect(r.stages.reduce((s, x) => s + x.sharePct, 0)).toBeCloseTo(100, 6);
  });
  it('the bottleneck ignores the notice period', () => {
    expect(computeTime({ ...TIME_DEFAULTS, daysNotice: 60 })!.bottleneck).toBe('Interviews');
  });
  it('vacancy cost scales with salary, multiplier, days and roles', () => {
    const daily = (85000 / 365) * 1.5;
    expect(r.dailyVacancyCost).toBeCloseTo(daily, 2);
    expect(r.vacancyCostPerRole).toBeCloseTo(daily * 58, 2);
    expect(r.vacancyCostTotal).toBeCloseTo(daily * 58 * 4, 1);
    expect(r.savingPerDay).toBeCloseTo(daily * 4, 2);
  });
  it('funnel conversion and ratios', () => {
    const f = r.funnel!;
    expect(f.steps[1].passPct).toBeCloseTo(20, 6);
    expect(f.steps[2].passPct).toBeCloseTo((16 / 48) * 100, 6);
    expect(f.offerAcceptancePct).toBeCloseTo(80, 6);
    expect(f.applicantsPerHire).toBe(60);
    expect(f.interviewsPerHire).toBe(4);
    expect(f.selectionRatePct).toBeCloseTo((4 / 240) * 100, 6);
    expect(computeTime({ ...TIME_DEFAULTS, applicants: 0 })!.funnel).toBeNull();
  });
  it('rejects an empty process', () => {
    expect(computeTime({ ...TIME_DEFAULTS, daysToPost: 0, daysSourcing: 0, daysScreening: 0, daysInterviewing: 0, daysOffer: 0, daysNotice: 0 })).toBeNull();
  });
});

describe('computeSources', () => {
  const r = computeSources(SOURCES_DEFAULTS)!;
  it('spreads internal cost by hires and prices each source per retained hire', () => {
    expect(r.hires).toBe(30);
    expect(r.totalCost).toBe(141000 + 90000);
    expect(r.costPerHire).toBe(7700);
    const referrals = r.sources[0];
    expect(referrals.totalCost).toBe(12000 + 8 * 3000);
    expect(referrals.costPerHire).toBe(4500);
    expect(referrals.retainedHires).toBe(7.2);
    expect(referrals.costPerRetainedHire).toBe(5000);
    const agency = r.sources[2];
    expect(agency.costPerHire).toBe(18000);
    expect(agency.costPerRetainedHire).toBe(22500);
    expect(agency.roiPct).toBeCloseTo(((4 * 60000 - 90000) / 90000) * 100, 6);
  });
  it('totals, ROI, payback, best and worst', () => {
    expect(r.retainedHires).toBeCloseTo(7.2 + 8.4 + 4 + 3.75, 6);
    expect(r.value).toBeCloseTo(23.35 * 60000, 2);
    expect(r.roiPct).toBeCloseTo(((1401000 - 231000) / 231000) * 100, 6);
    expect(r.costPerRetainedHire).toBeCloseTo(231000 / 23.35, 2);
    expect(r.paybackMonths).toBeCloseTo(231000 / 23.35 / 5000, 1);
    expect(r.best).toBe('Employee referrals');
    expect(r.worst).toBe('Agency');
    expect(r.sources.reduce((s, x) => s + x.hireSharePct, 0)).toBeCloseTo(100, 6);
  });
  it('needs at least one hire', () => {
    expect(computeSources({ ...SOURCES_DEFAULTS, sources: [{ name: 'Ads', spend: 5000, hires: 0, retainedPct: 0 }] })).toBeNull();
  });
});

describe('computeTurnover', () => {
  const r = computeTurnover(TURNOVER_DEFAULTS)!;
  it('builds cost per departure from five components', () => {
    const vacancy = (65000 / 365) * 45 * 0.5;
    const ramp = (65000 / 12) * 5 * 0.5;
    expect(r.components.map((c) => c.name)).toEqual(['Separation', 'Vacancy', 'Recruiting', 'Onboarding and training', 'Ramp-up productivity']);
    expect(r.components[1].amount).toBeCloseTo(vacancy, 2);
    expect(r.components[4].amount).toBeCloseTo(ramp, 2);
    expect(r.costPerDeparture).toBeCloseTo(2500 + vacancy + 4700 + 3500 + ramp, 2);
    expect(r.pctOfSalary).toBeCloseTo((r.costPerDeparture / 65000) * 100, 4);
    expect(r.largest).toBe('Ramp-up productivity');
  });
  it('annual cost and the value of reducing turnover', () => {
    expect(r.departures).toBe(36);
    expect(r.annualCost).toBeCloseTo(r.costPerDeparture * 36, 0);
    expect(r.costPerEmployee).toBeCloseTo(r.annualCost / 200, 1);
    expect(r.departuresAvoided).toBe(6);
    expect(r.saving).toBeCloseTo(r.costPerDeparture * 6, 0);
    expect(r.reducedTurnoverPct).toBeCloseTo(15, 6);
  });
  it('a reduction larger than the rate floors at zero turnover', () => {
    const z = computeTurnover({ ...TURNOVER_DEFAULTS, reductionPts: 50 })!;
    expect(z.reducedTurnoverPct).toBe(0);
    expect(z.departuresAvoided).toBe(36);
  });
});

describe('computeTraining', () => {
  const r = computeTraining(TRAINING_DEFAULTS)!;
  it('total cost includes participant time', () => {
    expect(r.participantHours).toBe(400);
    expect(r.wagesCost).toBe(15200);
    expect(r.directCost).toBe(15000 + 8000 + 1500 + 3000);
    expect(r.totalCost).toBe(42700);
    expect(r.costPerParticipant).toBe(854);
    expect(r.costPerHour).toBe(106.75);
    expect(r.wagesSharePct).toBeCloseTo((15200 / 42700) * 100, 6);
    expect(r.components.find((c) => c.name === 'Travel')).toBeUndefined();
  });
  it('ROI, payback and share of payroll', () => {
    expect(r.roiPct).toBeCloseTo(((90000 - 42700) / 42700) * 100, 6);
    expect(r.paybackMonths).toBeCloseTo(5.7, 1);
    expect(r.pctOfPayroll).toBeCloseTo((42700 / 3900000) * 100, 6);
    const bare = computeTraining({ ...TRAINING_DEFAULTS, annualBenefit: 0, annualPayroll: 0 })!;
    expect(bare.roiPct).toBeNull();
    expect(bare.pctOfPayroll).toBeNull();
  });
});
