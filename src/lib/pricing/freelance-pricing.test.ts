import { describe, expect, it } from 'vitest';
import {
  AGENCY_DEFAULTS,
  CLIENTS_DEFAULTS,
  computeAgency,
  computeClients,
  computeProject,
  computeRate,
  computeRetainer,
  PROJECT_DEFAULTS,
  RATE_DEFAULTS,
  RETAINER_DEFAULTS,
} from './freelance-pricing';

describe('computeProject', () => {
  const r = computeProject(PROJECT_DEFAULTS)!;
  it('builds the quote from lines, contingency, expenses and discount', () => {
    expect(r.hours).toBe(116);
    expect(r.labor).toBe(1800 + 3750 + 8400 + 1540); // 15,490
    expect(r.contingency).toBe(2323.5);
    expect(r.expensesBilled).toBe(1980);
    expect(r.subtotal).toBe(19793.5);
    expect(r.discount).toBeCloseTo(989.68, 2);
    expect(r.price).toBeCloseTo(18803.83, 1);
    expect(r.total).toBe(r.price); // no tax
    expect(r.deposit).toBeCloseTo(r.total * 0.4, 1);
    expect(r.balance).toBeCloseTo(r.total * 0.6, 1);
    expect(r.lines.reduce((s, l) => s + l.sharePct, 0)).toBeCloseTo(100, 6);
  });
  it('effective rate, overrun and cushion', () => {
    expect(r.blendedRate).toBeCloseTo(15490 / 116, 2); // 133.53
    expect(r.effectiveRate).toBeCloseTo((18803.825 - 1800) / 116, 2); // 146.58
    expect(r.overrunHours).toBeCloseTo(139.2, 1);
    expect(r.effectiveRateAtOverrun).toBeCloseTo((18803.825 - 1800) / 139.2, 2); // 122.15
    expect(r.overrunCushionPct).toBeCloseTo(((18803.825 - 1800) / (15490 / 116) / 116 - 1) * 100, 4); // 9.8%
  });
  it('sales tax is added after the discount and a deep discount removes the cushion', () => {
    const taxed = computeProject({ ...PROJECT_DEFAULTS, taxPct: 8 })!;
    expect(taxed.tax).toBeCloseTo(taxed.price * 0.08, 2);
    expect(taxed.total).toBeCloseTo(taxed.price * 1.08, 1);
    expect(computeProject({ ...PROJECT_DEFAULTS, contingencyPct: 0, discountPct: 20, expenseMarkupPct: 0 })!.overrunCushionPct).toBeNull();
    expect(computeProject({ ...PROJECT_DEFAULTS, lines: [] })).toBeNull();
  });
});

describe('computeRate', () => {
  const r = computeRate(RATE_DEFAULTS)!;
  it('revenue needed and the rate card', () => {
    expect(r.revenueNeeded).toBeCloseTo(138000 / 0.85, 2); // 162,352.94
    expect(r.billableDays).toBe(184);
    expect(r.billableHours).toBe(1196);
    expect(r.hourly).toBeCloseTo(162352.94 / 1196, 2); // 135.75
    expect(r.dayRate).toBeCloseTo(162352.94 / 184, 1); // 882.35
    expect(r.halfDay).toBeCloseTo(r.dayRate / 2, 1);
    expect(r.weekly).toBeCloseTo(r.dayRate * 4, 0);
    expect(r.monthlyAverage).toBeCloseTo(162352.94 / 12, 2);
    expect(r.perMinute).toBeCloseTo(2.26, 2);
  });
  it('compares with an employee wage and an extra billable day', () => {
    expect(r.utilizationPct).toBeCloseTo((1196 / 2080) * 100, 6);
    expect(r.employeeHourly).toBeCloseTo(57.69, 2);
    expect(r.multipleOfWage).toBeCloseTo(2.35, 2);
    expect(r.hourlyWithExtraDay).toBeCloseTo(162352.94 / (46 * 5 * 6.5), 2);
    expect(computeRate({ ...RATE_DEFAULTS, billableDaysPerWeek: 5 })!.hourlyWithExtraDay).toBeNull();
    expect(computeRate({ ...RATE_DEFAULTS, weeksOff: 52 })).toBeNull();
  });
});

describe('computeRetainer', () => {
  const r = computeRetainer(RETAINER_DEFAULTS)!;
  it('fee, overage and effective rate at expected usage', () => {
    expect(r.standardValue).toBe(3750);
    expect(r.monthlyFee).toBe(3375);
    expect(r.includedRate).toBe(112.5);
    expect(r.overageHours).toBe(4);
    expect(r.overageBilling).toBe(500);
    expect(r.monthlyBilled).toBe(3875);
    expect(r.effectiveRate).toBeCloseTo(3875 / 34, 2);
    expect(r.annualValue).toBe(40500);
    expect(r.breakEvenHours).toBe(27);
  });
  it('under-use raises the effective rate, over-use pulls it toward the overage rate', () => {
    const half = r.scenarios.find((s) => s.usagePct === 50)!;
    expect(half.billed).toBe(3375);
    expect(half.effectiveRate).toBe(225);
    const over = r.scenarios.find((s) => s.usagePct === 150)!;
    expect(over.billed).toBe(3375 + 15 * 125);
    expect(over.effectiveRate).toBeCloseTo(5250 / 45, 2);
    const under = computeRetainer({ ...RETAINER_DEFAULTS, expectedHours: 20 })!;
    expect(under.unusedHours).toBe(10);
    expect(under.effectiveRate).toBe(168.75);
  });
});

describe('computeClients', () => {
  const r = computeClients(CLIENTS_DEFAULTS)!;
  it('profit, margin and effective rate per client', () => {
    const acme = r.clients[0];
    expect(acme.laborCost).toBe(1680);
    expect(acme.profit).toBe(2170);
    expect(acme.effectiveRate).toBe(137.5);
    const northwind = r.clients[1];
    expect(northwind.profit).toBe(6500 - 3720 - 900);
    expect(northwind.effectiveRate).toBeCloseTo(5600 / 62, 2);
  });
  it('revenue mix, concentration and net profit', () => {
    expect(r.revenue).toBe(14500);
    expect(r.annualRevenue).toBe(174000);
    expect(r.recurringRevenue).toBe(6200);
    expect(r.recurringPct).toBeCloseTo((6200 / 14500) * 100, 6);
    expect(r.hours).toBe(126);
    expect(r.contribution).toBe(2170 + 1880 + 640 + 1200);
    expect(r.netProfit).toBe(5890 - 1500);
    expect(r.largestClient).toBe('Northwind (project)');
    expect(r.largestSharePct).toBeCloseTo((6500 / 14500) * 100, 6);
    expect(r.best).toBe('Summit (hourly)');
    expect(r.worst).toBe('Beacon (retainer)');
    expect(r.belowCost).toEqual([]);
  });
  it('flags a client whose effective rate is below the cost of an hour', () => {
    const bad = computeClients({ ...CLIENTS_DEFAULTS, clients: [...CLIENTS_DEFAULTS.clients, { name: 'Favor', monthlyRevenue: 500, recurring: false, hours: 12, directCosts: 0 }] })!;
    expect(bad.belowCost).toEqual(['Favor']);
    expect(bad.worst).toBe('Favor');
  });
});

describe('computeAgency', () => {
  const r = computeAgency(AGENCY_DEFAULTS)!;
  it('margin after unbilled time and overhead', () => {
    expect(r.costPerBilledHour).toBe(87.5); // $70 ÷ 80% utilization
    expect(r.revenue).toBe(48000);
    expect(r.deliveryCost).toBe(28000);
    expect(r.grossProfit).toBe(20000);
    expect(r.grossMarginPct).toBeCloseTo(41.667, 2);
    expect(r.markupPct).toBeCloseTo(71.43, 2);
    expect(r.multiplier).toBeCloseTo(2.14, 2);
    expect(r.overhead).toBe(9600);
    expect(r.netProfit).toBe(10400);
    expect(r.netMarginPct).toBeCloseTo(21.667, 2);
  });
  it('bill rate or utilization needed for the target margin', () => {
    expect(r.requiredBillRate).toBe(175); // $87.50 ÷ (1 − 50%)
    expect(r.requiredUtilizationPct).toBeCloseTo((70 / 75) * 100, 4); // 93.3%
    const contractor = computeAgency({ ...AGENCY_DEFAULTS, utilizationPct: 100 })!;
    expect(contractor.grossMarginPct).toBeCloseTo((80 / 150) * 100, 4);
    expect(computeAgency({ ...AGENCY_DEFAULTS, targetMarginPct: 60 })!.requiredUtilizationPct).toBeNull(); // would need 116.7%
  });
});
