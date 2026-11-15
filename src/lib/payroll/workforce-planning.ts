// ---------------------------------------------------------------------------
// Workforce planning engine — Phase 17: the workforce-planning, headcount,
// absenteeism, span-of-control and labor-efficiency pages fold into one suite.
// Pure functions; the component and the generated article both call these.
// ---------------------------------------------------------------------------

const round1 = (n: number) => Math.round(n * 10) / 10;
const round2 = (n: number) => Math.round(n * 100) / 100;

export type WorkforceMode = 'plan' | 'absence' | 'span' | 'efficiency';
export const WORKFORCE_MODES: { value: WorkforceMode; label: string; short: string }[] = [
  { value: 'plan', label: 'Headcount plan', short: 'Plan' },
  { value: 'absence', label: 'Absenteeism', short: 'Absence' },
  { value: 'span', label: 'Span of control', short: 'Span' },
  { value: 'efficiency', label: 'Labor efficiency', short: 'Efficiency' },
];
export const isWorkforceMode = (v: string | null): v is WorkforceMode => WORKFORCE_MODES.some((m) => m.value === v);

// ───────────────────────── headcount plan

export type TargetMethod = 'headcount' | 'revenue';

export interface PlanInput {
  currentHeadcount: number;
  /** Planning horizon, 1–5 years */
  years: number;
  targetMethod: TargetMethod;
  /** Used when targetMethod = 'headcount' */
  targetHeadcount: number;
  /** Used when targetMethod = 'revenue' */
  currentRevenue: number;
  targetRevenue: number;
  /** Annual improvement in revenue per employee, % (0 = headcount scales with revenue) */
  productivityGainPct: number;
  /** Annual attrition, % of average headcount */
  attritionPct: number;
  /** Average weekly hours, to express the end state in FTE */
  avgWeeklyHours: number;
}

export interface PlanYear {
  year: number;
  start: number;
  end: number;
  growth: number;
  departures: number;
  hires: number;
  hiresPerMonth: number;
}

export interface PlanResult {
  targetHeadcount: number;
  years: PlanYear[];
  totalGrowth: number;
  totalDepartures: number;
  totalHires: number;
  /** Share of all hires that only replace leavers */
  backfillSharePct: number;
  avgHiresPerMonth: number;
  endFte: number;
  revenuePerEmployeeNow: number | null;
  revenuePerEmployeeTarget: number | null;
  /** What the target headcount would be if revenue per employee stayed flat */
  targetIfFlatProductivity: number | null;
  /** Hires needed in the horizon if attrition were zero (growth only) */
  hiresIfNoAttrition: number;
}

export function computePlan(i: PlanInput): PlanResult | null {
  const current = Math.max(0, Math.round(i.currentHeadcount));
  const years = Math.min(10, Math.max(1, Math.round(i.years) || 1));
  const attrition = Math.min(100, Math.max(0, i.attritionPct)) / 100;
  const gain = Math.max(-50, i.productivityGainPct) / 100;
  if (current <= 0) return null;

  let target: number;
  let rpeNow: number | null = null;
  let rpeTarget: number | null = null;
  let flatTarget: number | null = null;
  if (i.targetMethod === 'revenue') {
    if (i.currentRevenue <= 0 || i.targetRevenue <= 0) return null;
    rpeNow = i.currentRevenue / current;
    rpeTarget = rpeNow * Math.pow(1 + gain, years);
    flatTarget = Math.round(i.targetRevenue / rpeNow);
    target = Math.max(0, Math.round(i.targetRevenue / rpeTarget));
  } else {
    target = Math.max(0, Math.round(i.targetHeadcount));
  }

  const rows: PlanYear[] = [];
  let start = current;
  for (let y = 1; y <= years; y++) {
    const end = Math.round(current + ((target - current) * y) / years);
    const departures = Math.round(((start + end) / 2) * attrition);
    const growth = end - start;
    const hires = Math.max(0, growth + departures);
    rows.push({ year: y, start, end, growth, departures, hires, hiresPerMonth: round1(hires / 12) });
    start = end;
  }
  const totalDepartures = rows.reduce((s, r) => s + r.departures, 0);
  const totalHires = rows.reduce((s, r) => s + r.hires, 0);
  return {
    targetHeadcount: target,
    years: rows,
    totalGrowth: target - current,
    totalDepartures,
    totalHires,
    backfillSharePct: totalHires > 0 ? (Math.min(totalDepartures, totalHires) / totalHires) * 100 : 0,
    avgHiresPerMonth: round1(totalHires / (years * 12)),
    endFte: round1((target * Math.max(0, i.avgWeeklyHours || 40)) / 40),
    revenuePerEmployeeNow: rpeNow === null ? null : Math.round(rpeNow),
    revenuePerEmployeeTarget: rpeTarget === null ? null : Math.round(rpeTarget),
    targetIfFlatProductivity: flatTarget,
    hiresIfNoAttrition: Math.max(0, target - current),
  };
}

export const PLAN_DEFAULTS: PlanInput = {
  currentHeadcount: 120,
  years: 3,
  targetMethod: 'revenue',
  targetHeadcount: 200,
  currentRevenue: 24000000,
  targetRevenue: 45000000,
  productivityGainPct: 3,
  attritionPct: 15,
  avgWeeklyHours: 40,
};

// ───────────────────────── absenteeism

export interface AbsenceInput {
  employees: number;
  /** Scheduled working days per employee in the period (≈ 250 a year before PTO, 220–230 after) */
  scheduledDaysPerEmployee: number;
  /** Unplanned absence days across the workforce in the period */
  absenceDays: number;
  /** Average daily pay of an absent employee */
  dailyPay: number;
  /** Indirect cost as a multiple of pay: cover, overtime, lost output (1 = pay only) */
  indirectMultiplier: number;
  /** Bradford factor for one employee */
  bradfordSpells: number;
  bradfordDays: number;
}

export type BradfordBand = { level: 'low' | 'monitor' | 'concern' | 'formal'; label: string };

export function bradfordBand(score: number): BradfordBand {
  if (score < 51) return { level: 'low', label: 'Low — no action beyond normal return-to-work conversations' };
  if (score < 125) return { level: 'monitor', label: 'Monitor — a common informal trigger point' };
  if (score < 400) return { level: 'concern', label: 'Concern — a common trigger for a formal attendance review' };
  return { level: 'formal', label: 'High — frequent short absences; most policies trigger formal action' };
}

export interface AbsenceResult {
  scheduledDays: number;
  absenceRatePct: number;
  daysPerEmployee: number;
  /** Absence expressed as full-time equivalents missing on an average day */
  lostFte: number;
  directCost: number;
  totalCost: number;
  costPerEmployee: number;
  /** Cost of one percentage point of absence rate */
  costPerRatePoint: number;
  bradfordScore: number;
  bradfordBand: BradfordBand;
}

export function computeAbsence(i: AbsenceInput): AbsenceResult | null {
  const emps = Math.max(0, i.employees);
  const days = Math.max(0, i.scheduledDaysPerEmployee);
  if (emps <= 0 || days <= 0) return null;
  const scheduled = emps * days;
  const absent = Math.min(scheduled, Math.max(0, i.absenceDays));
  const pay = Math.max(0, i.dailyPay);
  const mult = Math.max(1, i.indirectMultiplier || 1);
  const direct = absent * pay;
  const total = direct * mult;
  const spells = Math.max(0, Math.round(i.bradfordSpells));
  const bDays = Math.max(0, i.bradfordDays);
  const score = Math.round(spells * spells * bDays);
  return {
    scheduledDays: scheduled,
    absenceRatePct: (absent / scheduled) * 100,
    daysPerEmployee: round1(absent / emps),
    lostFte: round1(absent / days),
    directCost: round2(direct),
    totalCost: round2(total),
    costPerEmployee: round2(total / emps),
    costPerRatePoint: round2(scheduled * 0.01 * pay * mult),
    bradfordScore: score,
    bradfordBand: bradfordBand(score),
  };
}

export const ABSENCE_DEFAULTS: AbsenceInput = {
  employees: 150,
  scheduledDaysPerEmployee: 228,
  absenceDays: 1100,
  dailyPay: 260,
  indirectMultiplier: 1.5,
  bradfordSpells: 6,
  bradfordDays: 9,
};

// ───────────────────────── span of control

export interface SpanInput {
  totalEmployees: number;
  managers: number;
  /** Fully loaded annual cost of a manager and of an individual contributor */
  managerCost: number;
  icCost: number;
  /** Span you want to test (0 = skip) */
  targetSpan: number;
}

export type SpanBand = { level: 'narrow' | 'moderate' | 'wide' | 'very-wide'; label: string };

export function spanBand(span: number): SpanBand {
  if (span < 5) return { level: 'narrow', label: 'Narrow — typical where work is complex, novel or needs close coaching' };
  if (span < 9) return { level: 'moderate', label: 'Moderate — the most common range for knowledge work' };
  if (span < 16) return { level: 'wide', label: 'Wide — suits experienced teams doing similar, well-defined work' };
  return { level: 'very-wide', label: 'Very wide — transactional or self-directed work; managers mostly schedule and escalate' };
}

export interface SpanResult {
  individualContributors: number;
  span: number;
  managementRatioPct: number;
  /** Approximate layers from the top to the front line at this span */
  layers: number;
  managementCost: number;
  band: SpanBand;
  target: null | {
    span: number;
    managersNeeded: number;
    managerDelta: number;
    layers: number;
    /** Annual saving (positive) or extra cost if surplus managers return to IC roles */
    costDelta: number;
  };
}

export function computeSpan(i: SpanInput): SpanResult | null {
  const total = Math.max(0, Math.round(i.totalEmployees));
  const mgrs = Math.min(total, Math.max(0, Math.round(i.managers)));
  if (total <= 0 || mgrs <= 0) return null;
  const ics = total - mgrs;
  const span = ics / mgrs;
  const layersAt = (s: number) => (s <= 1 ? 1 : Math.max(1, Math.ceil(Math.log(total) / Math.log(s))));
  const mCost = Math.max(0, i.managerCost);
  const icCost = Math.max(0, i.icCost);
  let target: SpanResult['target'] = null;
  if (i.targetSpan > 0) {
    const needed = Math.max(1, Math.ceil(ics / i.targetSpan));
    const delta = needed - mgrs;
    target = { span: i.targetSpan, managersNeeded: needed, managerDelta: delta, layers: layersAt(i.targetSpan), costDelta: round2(-delta * (mCost - icCost)) };
  }
  return {
    individualContributors: ics,
    span: round1(span),
    managementRatioPct: (mgrs / total) * 100,
    layers: layersAt(span),
    managementCost: round2(mgrs * mCost),
    band: spanBand(span),
    target,
  };
}

export const SPAN_DEFAULTS: SpanInput = { totalEmployees: 240, managers: 40, managerCost: 165000, icCost: 110000, targetSpan: 8 };

// ───────────────────────── labor efficiency & productivity

export interface EfficiencyInput {
  /** Standard (budgeted) hours for the output actually produced */
  standardHours: number;
  actualHours: number;
  hourlyCost: number;
  /** Units produced (optional, for cost per unit) */
  units: number;
  /** Revenue in the period (optional, for labor cost ratio) */
  revenue: number;
  employees: number;
}

export interface EfficiencyResult {
  efficiencyPct: number;
  varianceHours: number;
  varianceCost: number;
  actualLaborCost: number;
  standardLaborCost: number;
  status: 'above' | 'at' | 'below';
  costPerUnit: number | null;
  standardCostPerUnit: number | null;
  unitsPerHour: number | null;
  revenuePerHour: number | null;
  laborCostPctOfRevenue: number | null;
  revenuePerEmployee: number | null;
  hoursPerEmployee: number | null;
  /** Hours that would be freed at 100% efficiency */
  recoverableHours: number;
}

export function computeEfficiency(i: EfficiencyInput): EfficiencyResult | null {
  const std = Math.max(0, i.standardHours);
  const actual = Math.max(0, i.actualHours);
  const rate = Math.max(0, i.hourlyCost);
  if (std <= 0 || actual <= 0) return null;
  const eff = std / actual;
  const variance = std - actual;
  const units = Math.max(0, i.units);
  const revenue = Math.max(0, i.revenue);
  const emps = Math.max(0, i.employees);
  return {
    efficiencyPct: eff * 100,
    varianceHours: round1(variance),
    varianceCost: round2(variance * rate),
    actualLaborCost: round2(actual * rate),
    standardLaborCost: round2(std * rate),
    status: eff >= 1 ? 'above' : eff >= 0.9 ? 'at' : 'below',
    costPerUnit: units > 0 ? round2((actual * rate) / units) : null,
    standardCostPerUnit: units > 0 ? round2((std * rate) / units) : null,
    unitsPerHour: units > 0 ? round2(units / actual) : null,
    revenuePerHour: revenue > 0 ? round2(revenue / actual) : null,
    laborCostPctOfRevenue: revenue > 0 ? ((actual * rate) / revenue) * 100 : null,
    revenuePerEmployee: revenue > 0 && emps > 0 ? round2(revenue / emps) : null,
    hoursPerEmployee: emps > 0 ? round1(actual / emps) : null,
    recoverableHours: round1(Math.max(0, actual - std)),
  };
}

export const EFFICIENCY_DEFAULTS: EfficiencyInput = { standardHours: 6400, actualHours: 7100, hourlyCost: 32, units: 16000, revenue: 480000, employees: 42 };
