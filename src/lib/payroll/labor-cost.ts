// ---------------------------------------------------------------------------
// Labor cost suite (Roadmap v2, Phase 17): one page, four modes.
//   employee — fully loaded cost of one employee (taxes from the 2026 employer
//              engine, benefits, insurance, equipment, overhead, PTO-adjusted
//              hourly cost)
//   team     — project / team cost from hours × rates with burden and overhead
//   revenue  — total labor cost as a share of revenue against industry ranges
//   budget   — HR department budget per employee and as a share of revenue
// Everything here is pure so the SEO article is generated from the same code.
// ---------------------------------------------------------------------------

import { calculateEmployerCost, type EmployerCostResult } from './employer-cost-2026';
import type { PaycheckState } from './withholding';

export type LaborMode = 'employee' | 'team' | 'revenue' | 'budget';
export const LABOR_MODES: { value: LaborMode; label: string; short: string }[] = [
  { value: 'employee', label: 'Cost per employee', short: 'Employee' },
  { value: 'team', label: 'Team / project cost', short: 'Team' },
  { value: 'revenue', label: 'Labor % of revenue', short: '% of revenue' },
  { value: 'budget', label: 'HR budget', short: 'HR budget' },
];
export function isLaborMode(v: string | null): v is LaborMode {
  return v === 'employee' || v === 'team' || v === 'revenue' || v === 'budget';
}

const round2 = (n: number) => Math.round(n * 100) / 100;

// ───────────────────────── employee: fully loaded cost

export interface LoadedCostInput {
  state: PaycheckState;
  payType: 'hourly' | 'salary';
  hourlyRate: number;
  hoursPerWeek: number;
  annualSalary: number;
  /** Employer share of health, dental and vision premiums, $ per month */
  healthMonthly: number;
  /** 401(k) / retirement match as % of wages */
  retirementMatchPct: number;
  /** Life, disability, wellness, stipends and other benefits, $ per year */
  otherBenefitsAnnual: number;
  /** Paid days off per year (vacation, sick, holidays) — lowers hours actually worked */
  paidDaysOff: number;
  /** Workers' compensation premium per $100 of payroll */
  workersCompPer100: number;
  equipmentAnnual: number;
  overheadAnnual: number;
  /** Assigned SUI rate (decimal); omit for the state's new-employer rate */
  suiRate?: number | null;
}

export type LoadedCostGroup = 'wages' | 'taxes' | 'benefits' | 'insurance' | 'overhead';

export interface LoadedCostLine {
  key: string;
  label: string;
  annual: number;
  group: LoadedCostGroup;
}

export interface LoadedCostResult {
  wages: number;
  paidHoursPerYear: number;
  workedHoursPerYear: number;
  taxes: EmployerCostResult;
  taxesTotal: number;
  health: number;
  retirement: number;
  otherBenefits: number;
  benefitsTotal: number;
  workersComp: number;
  equipment: number;
  overhead: number;
  total: number;
  /** Everything above wages */
  burden: number;
  /** burden ÷ wages, e.g. 0.38 */
  burdenRate: number;
  /** total ÷ wages, e.g. 1.38 */
  multiplier: number;
  costPerPaidHour: number;
  costPerWorkedHour: number;
  lines: LoadedCostLine[];
}

export const LOADED_COST_DEFAULTS: LoadedCostInput = {
  state: 'TX',
  payType: 'salary',
  hourlyRate: 36.06,
  hoursPerWeek: 40,
  annualSalary: 75000,
  healthMonthly: 650,
  retirementMatchPct: 4,
  otherBenefitsAnnual: 1200,
  paidDaysOff: 25,
  workersCompPer100: 0.5,
  equipmentAnnual: 3500,
  overheadAnnual: 5000,
};

export function computeLoadedCost(input: LoadedCostInput): LoadedCostResult {
  const hoursPerWeek = input.payType === 'salary' ? 40 : Math.max(0, input.hoursPerWeek);
  const wages = input.payType === 'salary' ? Math.max(0, input.annualSalary) : Math.max(0, input.hourlyRate) * hoursPerWeek * 52;
  const paidHoursPerYear = hoursPerWeek * 52;
  const workedHoursPerYear = Math.max(0, paidHoursPerYear - Math.max(0, input.paidDaysOff) * (hoursPerWeek / 5));

  const taxes = calculateEmployerCost({
    state: input.state,
    grossAnnual: wages,
    ficaWagesAnnual: wages,
    payFrequency: 'monthly',
    hoursPerYear: paidHoursPerYear,
    suiRate: input.suiRate,
  });
  const health = Math.max(0, input.healthMonthly) * 12;
  const retirement = wages * (Math.max(0, input.retirementMatchPct) / 100);
  const otherBenefits = Math.max(0, input.otherBenefitsAnnual);
  const workersComp = (wages / 100) * Math.max(0, input.workersCompPer100);
  const equipment = Math.max(0, input.equipmentAnnual);
  const overhead = Math.max(0, input.overheadAnnual);

  const rawLines: LoadedCostLine[] = [
    { key: 'wages', label: input.payType === 'salary' ? 'Base salary' : 'Wages', annual: wages, group: 'wages' },
    ...taxes.lines.map((l) => ({ key: l.key, label: l.label, annual: l.annual, group: 'taxes' as const })),
    ...(health > 0 ? [{ key: 'health', label: 'Health, dental & vision (employer share)', annual: health, group: 'benefits' as const }] : []),
    ...(retirement > 0 ? [{ key: 'retirement', label: `401(k) match (${input.retirementMatchPct}%)`, annual: retirement, group: 'benefits' as const }] : []),
    ...(otherBenefits > 0 ? [{ key: 'other-benefits', label: 'Other benefits & perks', annual: otherBenefits, group: 'benefits' as const }] : []),
    ...(workersComp > 0 ? [{ key: 'workers-comp', label: `Workers' compensation ($${input.workersCompPer100.toFixed(2)} per $100)`, annual: workersComp, group: 'insurance' as const }] : []),
    ...(equipment > 0 ? [{ key: 'equipment', label: 'Equipment & software', annual: equipment, group: 'overhead' as const }] : []),
    ...(overhead > 0 ? [{ key: 'overhead', label: 'Facilities & admin overhead', annual: overhead, group: 'overhead' as const }] : []),
  ];
  const lines: LoadedCostLine[] = rawLines.map((l) => ({ ...l, annual: round2(l.annual) }));

  const total = round2(lines.reduce((s, l) => s + l.annual, 0));
  const burden = round2(total - round2(wages));
  return {
    wages: round2(wages),
    paidHoursPerYear,
    workedHoursPerYear,
    taxes,
    taxesTotal: taxes.employerTaxesAnnual,
    health: round2(health),
    retirement: round2(retirement),
    otherBenefits: round2(otherBenefits),
    benefitsTotal: round2(health + retirement + otherBenefits),
    workersComp: round2(workersComp),
    equipment: round2(equipment),
    overhead: round2(overhead),
    total,
    burden,
    burdenRate: wages > 0 ? burden / wages : 0,
    multiplier: wages > 0 ? total / wages : 0,
    costPerPaidHour: paidHoursPerYear > 0 ? round2(total / paidHoursPerYear) : 0,
    costPerWorkedHour: workedHoursPerYear > 0 ? round2(total / workedHoursPerYear) : 0,
    lines,
  };
}

// ───────────────────────── team / project cost

export interface TeamMember {
  name: string;
  hours: number;
  rate: number;
  /** Burden on top of the rate (taxes + benefits), % — 0 for contractors */
  burdenPct: number;
}

export interface TeamCostResult {
  members: (TeamMember & { base: number; burden: number; cost: number; share: number })[];
  totalHours: number;
  baseCost: number;
  burdenCost: number;
  laborCost: number;
  overhead: number;
  total: number;
  avgLoadedRate: number;
  /** Price needed for a target margin, if one was given */
  priceForMargin: number | null;
}

export function computeTeamCost(members: TeamMember[], overheadPct: number, targetMarginPct: number | null = null): TeamCostResult {
  const rows = members
    .filter((m) => m.hours > 0 && m.rate > 0)
    .map((m) => {
      const base = m.hours * m.rate;
      const burden = base * (Math.max(0, m.burdenPct) / 100);
      return { ...m, base: round2(base), burden: round2(burden), cost: round2(base + burden), share: 0 };
    });
  const baseCost = round2(rows.reduce((s, r) => s + r.base, 0));
  const burdenCost = round2(rows.reduce((s, r) => s + r.burden, 0));
  const laborCost = round2(baseCost + burdenCost);
  const overhead = round2(laborCost * (Math.max(0, overheadPct) / 100));
  const total = round2(laborCost + overhead);
  const totalHours = rows.reduce((s, r) => s + r.hours, 0);
  for (const r of rows) r.share = total > 0 ? (r.cost * (1 + Math.max(0, overheadPct) / 100)) / total : 0;
  const margin = targetMarginPct !== null && targetMarginPct >= 0 && targetMarginPct < 100 ? targetMarginPct : null;
  return {
    members: rows,
    totalHours,
    baseCost,
    burdenCost,
    laborCost,
    overhead,
    total,
    avgLoadedRate: totalHours > 0 ? round2(total / totalHours) : 0,
    priceForMargin: margin !== null && total > 0 ? round2(total / (1 - margin / 100)) : null,
  };
}

export const TEAM_DEFAULTS: TeamMember[] = [
  { name: 'Project lead', hours: 40, rate: 95, burdenPct: 30 },
  { name: 'Developer', hours: 120, rate: 70, burdenPct: 30 },
  { name: 'Designer', hours: 40, rate: 60, burdenPct: 30 },
  { name: 'Contractor (1099)', hours: 20, rate: 85, burdenPct: 0 },
];

// ───────────────────────── labor cost as % of revenue

export interface IndustryBenchmark {
  key: string;
  label: string;
  /** Commonly cited operating range for total labor cost as % of revenue */
  low: number;
  high: number;
  note: string;
}

/**
 * Typical operating ranges used by lenders, franchisors and industry
 * associations when they talk about labor cost. They are rules of thumb, not
 * statistics: a restaurant at 38% is not "wrong", it is above the range most
 * operators target.
 */
export const INDUSTRY_LABOR_BENCHMARKS: IndustryBenchmark[] = [
  { key: 'restaurant', label: 'Restaurants & food service', low: 25, high: 35, note: 'Full-service sits at the top of the range, quick-service and counter formats at the bottom; most operators manage labor and food cost together as a "prime cost" under 60–65%.' },
  { key: 'retail', label: 'Retail', low: 15, high: 25, note: 'Grocery and big-box run lean (10–15%); specialty and luxury retail with high service levels run higher.' },
  { key: 'hospitality', label: 'Hotels & hospitality', low: 30, high: 40, note: 'Housekeeping, front desk and F&B make hotels labor-heavy; limited-service properties sit near 30%.' },
  { key: 'manufacturing', label: 'Manufacturing', low: 20, high: 35, note: 'Direct labor is a smaller share in automated plants; contract and job-shop manufacturing run higher.' },
  { key: 'construction', label: 'Construction & trades', low: 20, high: 40, note: 'Labor share depends on the materials mix; service and remodel work is more labor-intensive than new build.' },
  { key: 'healthcare', label: 'Healthcare & clinics', low: 45, high: 55, note: 'Clinical staff dominate costs; hospitals and dental practices both land in this band.' },
  { key: 'services', label: 'Professional services & agencies', low: 45, high: 60, note: 'Billable staff are the product; firms above 60% usually have a utilization or pricing problem.' },
  { key: 'software', label: 'Software & tech', low: 25, high: 40, note: 'Engineering payroll is the main cost, but high gross margins keep the ratio moderate at scale; early-stage companies run far above it.' },
  { key: 'nonprofit', label: 'Non-profits', low: 50, high: 70, note: 'Program staff are the mission, so labor is most of the budget; funders look at program vs. admin split rather than the ratio itself.' },
];

export interface LaborShareInput {
  wages: number;
  /** Benefits as % of wages */
  benefitsPct: number;
  /** Employer payroll taxes as % of wages */
  payrollTaxPct: number;
  workersCompAnnual: number;
  /** 1099 / agency spend to include in "total workforce cost" */
  contractorsAnnual: number;
  revenue: number;
  industry: string;
}

export interface LaborShareResult {
  benefits: number;
  payrollTaxes: number;
  laborCost: number;
  workforceCost: number;
  laborPct: number;
  workforcePct: number;
  multiplier: number;
  benchmark: IndustryBenchmark | null;
  /** 'below' | 'within' | 'above' the benchmark range, by laborPct */
  position: 'below' | 'within' | 'above' | null;
  /** Revenue needed to bring labor to the top of the range, if above */
  revenueForRange: number | null;
  /** Labor cut needed to reach the top of the range, if above */
  laborCutForRange: number | null;
}

export function computeLaborShare(input: LaborShareInput): LaborShareResult {
  const wages = Math.max(0, input.wages);
  const benefits = wages * (Math.max(0, input.benefitsPct) / 100);
  const payrollTaxes = wages * (Math.max(0, input.payrollTaxPct) / 100);
  const laborCost = wages + benefits + payrollTaxes + Math.max(0, input.workersCompAnnual);
  const workforceCost = laborCost + Math.max(0, input.contractorsAnnual);
  const revenue = Math.max(0, input.revenue);
  const laborPct = revenue > 0 ? (laborCost / revenue) * 100 : 0;
  const workforcePct = revenue > 0 ? (workforceCost / revenue) * 100 : 0;
  const benchmark = INDUSTRY_LABOR_BENCHMARKS.find((b) => b.key === input.industry) ?? null;
  let position: LaborShareResult['position'] = null;
  if (benchmark && revenue > 0) position = laborPct < benchmark.low ? 'below' : laborPct > benchmark.high ? 'above' : 'within';
  return {
    benefits: round2(benefits),
    payrollTaxes: round2(payrollTaxes),
    laborCost: round2(laborCost),
    workforceCost: round2(workforceCost),
    laborPct,
    workforcePct,
    multiplier: wages > 0 ? laborCost / wages : 0,
    benchmark,
    position,
    revenueForRange: benchmark && position === 'above' ? round2(laborCost / (benchmark.high / 100)) : null,
    laborCutForRange: benchmark && position === 'above' ? round2(laborCost - revenue * (benchmark.high / 100)) : null,
  };
}

export const LABOR_SHARE_DEFAULTS: LaborShareInput = {
  wages: 2500000,
  benefitsPct: 28,
  payrollTaxPct: 9,
  workersCompAnnual: 25000,
  contractorsAnnual: 0,
  revenue: 8000000,
  industry: 'services',
};

// ───────────────────────── HR department budget

export interface HrBudgetInput {
  recruiting: number;
  training: number;
  benefitsAdmin: number;
  hrStaff: number;
  technology: number;
  other: number;
  headcount: number;
  hrHeadcount: number;
  revenue: number;
}

export interface HrBudgetResult {
  total: number;
  perEmployee: number;
  pctRevenue: number;
  /** Employees supported per HR team member */
  employeesPerHr: number | null;
  shares: { key: keyof Omit<HrBudgetInput, 'headcount' | 'hrHeadcount' | 'revenue'>; label: string; amount: number; share: number }[];
}

const HR_LABELS: Record<HrBudgetResult['shares'][number]['key'], string> = {
  recruiting: 'Recruiting & hiring',
  training: 'Training & development',
  benefitsAdmin: 'Benefits administration',
  hrStaff: 'HR team salaries & benefits',
  technology: 'HR technology (HRIS, payroll, ATS)',
  other: 'Other (compliance, engagement, events)',
};

export function computeHrBudget(input: HrBudgetInput): HrBudgetResult {
  const keys = Object.keys(HR_LABELS) as HrBudgetResult['shares'][number]['key'][];
  const total = round2(keys.reduce((s, k) => s + Math.max(0, input[k]), 0));
  return {
    total,
    perEmployee: input.headcount > 0 ? round2(total / input.headcount) : 0,
    pctRevenue: input.revenue > 0 ? (total / input.revenue) * 100 : 0,
    employeesPerHr: input.hrHeadcount > 0 ? round2(input.headcount / input.hrHeadcount) : null,
    shares: keys.map((k) => ({ key: k, label: HR_LABELS[k], amount: round2(Math.max(0, input[k])), share: total > 0 ? Math.max(0, input[k]) / total : 0 })),
  };
}

export const HR_BUDGET_DEFAULTS: HrBudgetInput = {
  recruiting: 120000,
  training: 90000,
  benefitsAdmin: 40000,
  hrStaff: 420000,
  technology: 60000,
  other: 30000,
  headcount: 300,
  hrHeadcount: 4,
  revenue: 45000000,
};
