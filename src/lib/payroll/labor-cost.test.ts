import { describe, expect, it } from 'vitest';
import {
  computeHrBudget,
  computeLaborShare,
  computeLoadedCost,
  computeTeamCost,
  HR_BUDGET_DEFAULTS,
  INDUSTRY_LABOR_BENCHMARKS,
  LABOR_SHARE_DEFAULTS,
  LOADED_COST_DEFAULTS,
  TEAM_DEFAULTS,
} from './labor-cost';
import { calculateEmployerCost } from './employer-cost-2026';

describe('computeLoadedCost', () => {
  const r = computeLoadedCost(LOADED_COST_DEFAULTS);

  it('matches the hand-computed $75,000 Texas example', () => {
    // taxes: 4,650 SS + 1,087.50 Medicare + 42 FUTA + 243 SUI = 6,022.50
    expect(r.taxesTotal).toBe(6022.5);
    expect(r.health).toBe(7800); // 650 × 12
    expect(r.retirement).toBe(3000); // 4%
    expect(r.otherBenefits).toBe(1200);
    expect(r.workersComp).toBe(375); // 0.50 per $100
    expect(r.total).toBe(75000 + 6022.5 + 7800 + 3000 + 1200 + 375 + 3500 + 5000); // 101,897.50
    expect(r.multiplier).toBeCloseTo(1.3586, 3);
    expect(r.burdenRate).toBeCloseTo(0.3586, 3);
  });

  it('PTO raises the cost per hour actually worked', () => {
    expect(r.paidHoursPerYear).toBe(2080);
    expect(r.workedHoursPerYear).toBe(2080 - 25 * 8); // 1,880
    expect(r.costPerPaidHour).toBe(Math.round((r.total / 2080) * 100) / 100);
    expect(r.costPerWorkedHour).toBeGreaterThan(r.costPerPaidHour);
  });

  it('uses the employer-cost engine for taxes, state by state', () => {
    const ca = computeLoadedCost({ ...LOADED_COST_DEFAULTS, state: 'CA' });
    const direct = calculateEmployerCost({ state: 'CA', grossAnnual: 75000, ficaWagesAnnual: 75000, payFrequency: 'monthly', hoursPerYear: 2080 });
    expect(ca.taxesTotal).toBe(direct.employerTaxesAnnual);
    expect(ca.lines.some((l) => l.key === 'ett')).toBe(true);
    expect(ca.total).toBeGreaterThan(r.total);
  });

  it('hourly mode annualises rate × hours and respects part-time hours', () => {
    const pt = computeLoadedCost({ ...LOADED_COST_DEFAULTS, payType: 'hourly', hourlyRate: 20, hoursPerWeek: 30, paidDaysOff: 10 });
    expect(pt.wages).toBe(20 * 30 * 52);
    expect(pt.paidHoursPerYear).toBe(1560);
    expect(pt.workedHoursPerYear).toBe(1560 - 10 * 6);
  });

  it('the lines add up to the total and are grouped', () => {
    expect(r.lines.reduce((s, l) => s + l.annual, 0)).toBeCloseTo(r.total, 2);
    expect(new Set(r.lines.map((l) => l.group))).toEqual(new Set(['wages', 'taxes', 'benefits', 'insurance', 'overhead']));
    const bare = computeLoadedCost({ ...LOADED_COST_DEFAULTS, healthMonthly: 0, retirementMatchPct: 0, otherBenefitsAnnual: 0, workersCompPer100: 0, equipmentAnnual: 0, overheadAnnual: 0 });
    expect(bare.total).toBe(75000 + 6022.5);
    expect(bare.lines.map((l) => l.group)).not.toContain('benefits');
  });
});

describe('computeTeamCost', () => {
  const r = computeTeamCost(TEAM_DEFAULTS, 20, 40);

  it('applies burden per member, overhead on labor, and a target margin', () => {
    const lead = r.members[0];
    expect(lead.base).toBe(3800);
    expect(lead.burden).toBe(1140);
    expect(lead.cost).toBe(4940);
    const contractor = r.members[3];
    expect(contractor.burden).toBe(0);
    expect(r.baseCost).toBe(3800 + 8400 + 2400 + 1700);
    expect(r.laborCost).toBe(r.baseCost + r.burdenCost);
    expect(r.overhead).toBe(Math.round(r.laborCost * 0.2 * 100) / 100);
    expect(r.total).toBe(Math.round((r.laborCost + r.overhead) * 100) / 100);
    expect(r.priceForMargin).toBe(Math.round((r.total / 0.6) * 100) / 100);
    expect(r.members.reduce((s, m) => s + m.share, 0)).toBeCloseTo(1, 6);
  });

  it('skips empty rows and copes with no margin', () => {
    const r2 = computeTeamCost([{ name: '', hours: 0, rate: 50, burdenPct: 0 }, { name: 'A', hours: 10, rate: 50, burdenPct: 0 }], 0, null);
    expect(r2.members).toHaveLength(1);
    expect(r2.total).toBe(500);
    expect(r2.avgLoadedRate).toBe(50);
    expect(r2.priceForMargin).toBeNull();
  });
});

describe('computeLaborShare', () => {
  it('computes the share and positions it against the industry range', () => {
    const r = computeLaborShare(LABOR_SHARE_DEFAULTS);
    expect(r.laborCost).toBeCloseTo(3450000, 2); // 2.5M × 1.37 + 25k
    expect(r.laborPct).toBeCloseTo((3450000 / 8000000) * 100, 6);
    expect(r.benchmark?.key).toBe('services');
    expect(r.position).toBe('below');
    const heavy = computeLaborShare({ ...LABOR_SHARE_DEFAULTS, industry: 'retail', revenue: 6000000 });
    expect(heavy.position).toBe('above');
    expect(heavy.revenueForRange).toBe(Math.round((heavy.laborCost / 0.25) * 100) / 100);
    expect(heavy.laborCutForRange).toBe(Math.round((heavy.laborCost - 6000000 * 0.25) * 100) / 100);
  });

  it('includes contractors only in the workforce figure', () => {
    const r = computeLaborShare({ ...LABOR_SHARE_DEFAULTS, contractorsAnnual: 400000 });
    expect(r.workforceCost - r.laborCost).toBe(400000);
    expect(r.workforcePct).toBeGreaterThan(r.laborPct);
  });

  it('every benchmark has a sensible range and a note', () => {
    for (const b of INDUSTRY_LABOR_BENCHMARKS) {
      expect(b.low).toBeGreaterThan(0);
      expect(b.high).toBeGreaterThan(b.low);
      expect(b.high).toBeLessThanOrEqual(80);
      expect(b.note.length).toBeGreaterThan(40);
    }
  });
});

describe('computeHrBudget', () => {
  it('totals the categories and derives per-employee, % of revenue and HR ratio', () => {
    const r = computeHrBudget(HR_BUDGET_DEFAULTS);
    expect(r.total).toBe(760000);
    expect(r.perEmployee).toBe(Math.round((760000 / 300) * 100) / 100);
    expect(r.pctRevenue).toBeCloseTo((760000 / 45000000) * 100, 6);
    expect(r.employeesPerHr).toBe(75);
    expect(r.shares.reduce((s, x) => s + x.share, 0)).toBeCloseTo(1, 6);
    expect(r.shares.find((s) => s.key === 'hrStaff')?.share).toBeCloseTo(420000 / 760000, 6);
  });
  it('handles zero headcount and revenue', () => {
    const r = computeHrBudget({ ...HR_BUDGET_DEFAULTS, headcount: 0, hrHeadcount: 0, revenue: 0 });
    expect(r.perEmployee).toBe(0);
    expect(r.pctRevenue).toBe(0);
    expect(r.employeesPerHr).toBeNull();
  });
});
