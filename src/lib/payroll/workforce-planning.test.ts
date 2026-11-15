import { describe, expect, it } from 'vitest';
import {
  ABSENCE_DEFAULTS,
  bradfordBand,
  computeAbsence,
  computeEfficiency,
  computePlan,
  computeSpan,
  EFFICIENCY_DEFAULTS,
  PLAN_DEFAULTS,
  SPAN_DEFAULTS,
  spanBand,
} from './workforce-planning';

describe('computePlan', () => {
  it('derives the target from revenue per employee with a productivity gain', () => {
    const r = computePlan(PLAN_DEFAULTS)!;
    expect(r.revenuePerEmployeeNow).toBe(200000);
    expect(r.revenuePerEmployeeTarget).toBe(Math.round(200000 * Math.pow(1.03, 3)));
    expect(r.targetIfFlatProductivity).toBe(225);
    expect(r.targetHeadcount).toBe(Math.round(45000000 / (200000 * Math.pow(1.03, 3)))); // 206
    expect(r.totalGrowth).toBe(r.targetHeadcount - 120);
    expect(r.years).toHaveLength(3);
    expect(r.years[0].start).toBe(120);
    expect(r.years[2].end).toBe(r.targetHeadcount);
  });
  it('charges attrition on the average headcount of each year and adds it to hires', () => {
    const r = computePlan({ ...PLAN_DEFAULTS, targetMethod: 'headcount', targetHeadcount: 180, years: 2, attritionPct: 15 })!;
    // year 1: 120 → 150, departures 15% × 135 = 20 (rounded), hires 30 + 20 = 50
    expect(r.years[0]).toMatchObject({ start: 120, end: 150, growth: 30, departures: 20, hires: 50 });
    // year 2: 150 → 180, departures 15% × 165 = 25 (rounded 24.75), hires 55
    expect(r.years[1]).toMatchObject({ start: 150, end: 180, growth: 30, departures: 25, hires: 55 });
    expect(r.totalHires).toBe(105);
    expect(r.hiresIfNoAttrition).toBe(60);
    expect(r.backfillSharePct).toBeCloseTo((45 / 105) * 100, 6);
    expect(r.avgHiresPerMonth).toBeCloseTo(105 / 24, 1);
  });
  it('a shrinking plan still needs hires when attrition outruns the cut', () => {
    const r = computePlan({ ...PLAN_DEFAULTS, targetMethod: 'headcount', targetHeadcount: 110, years: 1, attritionPct: 20 })!;
    // 120 → 110, departures 20% × 115 = 23, hires = −10 + 23 = 13
    expect(r.years[0].departures).toBe(23);
    expect(r.years[0].hires).toBe(13);
    expect(r.endFte).toBe(110);
  });
  it('rejects empty inputs', () => {
    expect(computePlan({ ...PLAN_DEFAULTS, currentHeadcount: 0 })).toBeNull();
    expect(computePlan({ ...PLAN_DEFAULTS, currentRevenue: 0 })).toBeNull();
  });
});

describe('computeAbsence', () => {
  const r = computeAbsence(ABSENCE_DEFAULTS)!;
  it('absence rate, lost FTE and cost', () => {
    expect(r.scheduledDays).toBe(34200);
    expect(r.absenceRatePct).toBeCloseTo((1100 / 34200) * 100, 6); // 3.22%
    expect(r.daysPerEmployee).toBeCloseTo(7.3, 1);
    expect(r.lostFte).toBeCloseTo(4.8, 1);
    expect(r.directCost).toBe(286000);
    expect(r.totalCost).toBe(429000);
    expect(r.costPerEmployee).toBe(2860);
    expect(r.costPerRatePoint).toBe(342 * 260 * 1.5);
  });
  it('Bradford factor is spells squared times days, with the usual bands', () => {
    expect(r.bradfordScore).toBe(6 * 6 * 9); // 324
    expect(r.bradfordBand.level).toBe('concern');
    expect(bradfordBand(1 * 1 * 10).level).toBe('low'); // one long absence
    expect(bradfordBand(10 * 10 * 10).level).toBe('formal'); // ten one-day absences
    expect(bradfordBand(60).level).toBe('monitor');
  });
  it('caps absence at scheduled days', () => {
    expect(computeAbsence({ ...ABSENCE_DEFAULTS, absenceDays: 99999 })!.absenceRatePct).toBe(100);
  });
});

describe('computeSpan', () => {
  const r = computeSpan(SPAN_DEFAULTS)!;
  it('span, management ratio, layers and cost', () => {
    expect(r.individualContributors).toBe(200);
    expect(r.span).toBe(5);
    expect(r.managementRatioPct).toBeCloseTo((40 / 240) * 100, 6);
    expect(r.layers).toBe(Math.ceil(Math.log(240) / Math.log(5))); // 4
    expect(r.managementCost).toBe(40 * 165000);
    expect(r.band.level).toBe('moderate');
  });
  it('target span: managers needed and the cost of the difference', () => {
    expect(r.target).not.toBeNull();
    expect(r.target!.managersNeeded).toBe(25); // 200 ÷ 8
    expect(r.target!.managerDelta).toBe(-15);
    expect(r.target!.costDelta).toBe(15 * (165000 - 110000)); // saving if 15 managers return to IC roles
    expect(r.target!.layers).toBe(Math.ceil(Math.log(240) / Math.log(8))); // 3
    const tighter = computeSpan({ ...SPAN_DEFAULTS, targetSpan: 4 })!;
    expect(tighter.target!.managerDelta).toBe(10);
    expect(tighter.target!.costDelta).toBe(-10 * 55000);
  });
  it('bands', () => {
    expect(spanBand(3).level).toBe('narrow');
    expect(spanBand(12).level).toBe('wide');
    expect(spanBand(20).level).toBe('very-wide');
  });
});

describe('computeEfficiency', () => {
  const r = computeEfficiency(EFFICIENCY_DEFAULTS)!;
  it('efficiency, variance and unit economics', () => {
    expect(r.efficiencyPct).toBeCloseTo((6400 / 7100) * 100, 6); // 90.1%
    expect(r.status).toBe('at');
    expect(r.varianceHours).toBe(-700);
    expect(r.varianceCost).toBe(-22400);
    expect(r.actualLaborCost).toBe(227200);
    expect(r.costPerUnit).toBe(14.2);
    expect(r.standardCostPerUnit).toBe(12.8);
    expect(r.unitsPerHour).toBeCloseTo(2.25, 2);
    expect(r.revenuePerHour).toBeCloseTo(67.61, 2);
    expect(r.laborCostPctOfRevenue).toBeCloseTo((227200 / 480000) * 100, 6);
    expect(r.revenuePerEmployee).toBeCloseTo(480000 / 42, 2);
    expect(r.recoverableHours).toBe(700);
  });
  it('status bands and optional fields', () => {
    expect(computeEfficiency({ ...EFFICIENCY_DEFAULTS, actualHours: 6000 })!.status).toBe('above');
    expect(computeEfficiency({ ...EFFICIENCY_DEFAULTS, actualHours: 8000 })!.status).toBe('below');
    const bare = computeEfficiency({ standardHours: 100, actualHours: 100, hourlyCost: 20, units: 0, revenue: 0, employees: 0 })!;
    expect(bare.costPerUnit).toBeNull();
    expect(bare.laborCostPctOfRevenue).toBeNull();
    expect(bare.recoverableHours).toBe(0);
  });
});
