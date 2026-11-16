// ---------------------------------------------------------------------------
// Sales forecast suite (Roadmap v2, Phase 17): stage-weighted pipeline with
// win rate, coverage and gap-to-quota; revenue growth with a compounding
// projection and bands; customer retention with churn and lifetime. Absorbs
// the revenue-forecast, pipeline, win-rate, revenue-growth and
// customer-retention drafts. Pure functions; the page article is generated.
// ---------------------------------------------------------------------------

export type ForecastMode = 'pipeline' | 'growth' | 'retention';
export const FORECAST_MODES: { value: ForecastMode; label: string; short: string }[] = [
  { value: 'pipeline', label: 'Pipeline, win rate & quota', short: 'Pipeline' },
  { value: 'growth', label: 'Revenue growth & projection', short: 'Growth' },
  { value: 'retention', label: 'Customer retention & churn', short: 'Retention' },
];
export function isForecastMode(v: string | null): v is ForecastMode {
  return v === 'pipeline' || v === 'growth' || v === 'retention';
}

const round2 = (n: number) => Math.round(n * 100) / 100;

// ───────────────────────── pipeline

export interface PipelineStage {
  name: string;
  /** Total deal value sitting in this stage */
  value: number;
  /** Historical probability that a deal here closes, % */
  probabilityPct: number;
  deals: number;
}

export interface PipelineInput {
  stages: PipelineStage[];
  /** Quota or target for the forecast period */
  quota: number;
  /** Closed-won and closed-lost counts for the trailing period, for the win rate */
  wonDeals: number;
  lostDeals: number;
  /** Average sales cycle in days and the forecast window, to time the closings */
  salesCycleDays: number;
  forecastDays: number;
  averageDealSize: number;
}

export interface PipelineResult {
  totalPipeline: number;
  totalDeals: number;
  weightedPipeline: number;
  stages: (PipelineStage & { weighted: number; share: number })[];
  winRate: number | null;
  lossRate: number | null;
  /** Pipeline × win rate, the "unweighted" forecast */
  winRateForecast: number | null;
  /** Share of the weighted pipeline expected to close inside the forecast window */
  timingFactor: number;
  forecastInWindow: number;
  coverage: number | null;
  gap: number;
  pipelineNeeded: number | null;
  dealsNeeded: number | null;
  /** Additional pipeline to source now to close the gap, at the current win rate */
  pipelineToAdd: number | null;
}

export function computePipeline(i: PipelineInput): PipelineResult {
  const stages = i.stages.filter((s) => s.value > 0 || s.deals > 0).map((s) => ({ ...s, value: Math.max(0, s.value), probabilityPct: Math.min(100, Math.max(0, s.probabilityPct)), deals: Math.max(0, s.deals) }));
  const total = stages.reduce((s, x) => s + x.value, 0);
  const weighted = stages.reduce((s, x) => s + x.value * (x.probabilityPct / 100), 0);
  const closed = Math.max(0, i.wonDeals) + Math.max(0, i.lostDeals);
  const winRate = closed > 0 ? (Math.max(0, i.wonDeals) / closed) * 100 : null;
  const timing = i.salesCycleDays > 0 ? Math.min(1, Math.max(0, i.forecastDays) / i.salesCycleDays) : 1;
  const inWindow = weighted * timing;
  const quota = Math.max(0, i.quota);
  const gap = quota - inWindow;
  const effectiveWin = winRate !== null && winRate > 0 ? winRate / 100 : total > 0 ? weighted / total : null;
  return {
    totalPipeline: round2(total),
    totalDeals: stages.reduce((s, x) => s + x.deals, 0),
    weightedPipeline: round2(weighted),
    stages: stages.map((s) => ({ ...s, weighted: round2(s.value * (s.probabilityPct / 100)), share: total > 0 ? s.value / total : 0 })),
    winRate,
    lossRate: closed > 0 ? (Math.max(0, i.lostDeals) / closed) * 100 : null,
    winRateForecast: winRate !== null ? round2(total * (winRate / 100)) : null,
    timingFactor: timing,
    forecastInWindow: round2(inWindow),
    coverage: quota > 0 ? total / quota : null,
    gap: round2(gap),
    pipelineNeeded: effectiveWin && quota > 0 ? round2(quota / effectiveWin) : null,
    dealsNeeded: i.averageDealSize > 0 && quota > 0 ? Math.ceil(quota / i.averageDealSize - 1e-9) : null,
    pipelineToAdd: effectiveWin && gap > 0 ? round2(gap / effectiveWin / (timing || 1)) : gap > 0 ? null : 0,
  };
}

export const PIPELINE_DEFAULTS: PipelineInput = {
  stages: [
    { name: 'Qualified', value: 600000, probabilityPct: 10, deals: 24 },
    { name: 'Discovery / demo', value: 500000, probabilityPct: 25, deals: 15 },
    { name: 'Proposal', value: 400000, probabilityPct: 50, deals: 9 },
    { name: 'Negotiation', value: 250000, probabilityPct: 75, deals: 5 },
    { name: 'Verbal commit', value: 150000, probabilityPct: 90, deals: 3 },
  ],
  quota: 600000,
  wonDeals: 25,
  lostDeals: 60,
  salesCycleDays: 90,
  forecastDays: 90,
  averageDealSize: 30000,
};

// ───────────────────────── revenue growth & projection

export interface GrowthInput {
  previousRevenue: number;
  currentRevenue: number;
  /** Length of each of those periods in months (12 = annual figures, 1 = monthly) */
  periodMonths: number;
  /** Periods to project forward and the growth rate per period to use (% ; null = use the measured rate) */
  projectPeriods: number;
  projectionRatePct: number | null;
  /** Width of the optimistic / conservative band, in percentage points per period */
  bandPts: number;
}

export interface GrowthResult {
  growthPct: number | null;
  absoluteGrowth: number;
  /** Growth restated as an annual compound rate */
  annualizedPct: number | null;
  /** Growth restated as a monthly compound rate */
  monthlyPct: number | null;
  rateUsedPct: number;
  projection: { period: number; conservative: number; base: number; optimistic: number }[];
  endBase: number;
  endConservative: number;
  endOptimistic: number;
  /** Periods until revenue doubles at the base rate */
  doublingPeriods: number | null;
}

export function computeGrowth(i: GrowthInput): GrowthResult {
  const prev = Math.max(0, i.previousRevenue);
  const curr = Math.max(0, i.currentRevenue);
  const months = Math.max(0.25, i.periodMonths);
  const growth = prev > 0 ? ((curr - prev) / prev) * 100 : null;
  const ratio = prev > 0 && curr > 0 ? curr / prev : null;
  const annualized = ratio !== null ? (Math.pow(ratio, 12 / months) - 1) * 100 : null;
  const monthly = ratio !== null ? (Math.pow(ratio, 1 / months) - 1) * 100 : null;
  const rate = i.projectionRatePct !== null ? i.projectionRatePct : (growth ?? 0);
  const band = Math.max(0, i.bandPts);
  const n = Math.min(120, Math.max(0, Math.round(i.projectPeriods)));
  const projection = Array.from({ length: n }, (_, k) => {
    const p = k + 1;
    return {
      period: p,
      conservative: round2(curr * Math.pow(1 + Math.max(-100, rate - band) / 100, p)),
      base: round2(curr * Math.pow(1 + rate / 100, p)),
      optimistic: round2(curr * Math.pow(1 + (rate + band) / 100, p)),
    };
  });
  const last = projection[projection.length - 1];
  return {
    growthPct: growth,
    absoluteGrowth: round2(curr - prev),
    annualizedPct: annualized,
    monthlyPct: monthly,
    rateUsedPct: rate,
    projection,
    endBase: last ? last.base : round2(curr),
    endConservative: last ? last.conservative : round2(curr),
    endOptimistic: last ? last.optimistic : round2(curr),
    doublingPeriods: rate > 0 ? round2(Math.log(2) / Math.log(1 + rate / 100)) : null,
  };
}

export const GROWTH_DEFAULTS: GrowthInput = { previousRevenue: 1000000, currentRevenue: 1200000, periodMonths: 12, projectPeriods: 3, projectionRatePct: null, bandPts: 5 };

// ───────────────────────── customer retention

export interface RetentionInput {
  startCustomers: number;
  endCustomers: number;
  newCustomers: number;
  /** Length of the period in months, to annualize */
  periodMonths: number;
  /** Optional: average revenue per customer per month, to price the churn */
  revenuePerCustomerMonthly: number;
}

export interface RetentionResult {
  retained: number;
  churned: number;
  retentionPct: number | null;
  churnPct: number | null;
  annualRetentionPct: number | null;
  annualChurnPct: number | null;
  /** 1 ÷ periodic churn, in months */
  averageLifetimeMonths: number | null;
  netGrowthPct: number | null;
  /** New customers needed per period just to stand still */
  replacementPerPeriod: number;
  /** Revenue lost to churn in the period and over a year, when a per-customer figure is given */
  churnedRevenuePeriod: number | null;
  churnedRevenueAnnual: number | null;
  /** Customers remaining after 12 months at this churn with no new ones */
  cohortAfter12Months: number | null;
}

export function computeRetention(i: RetentionInput): RetentionResult {
  const start = Math.max(0, i.startCustomers);
  const end = Math.max(0, i.endCustomers);
  const added = Math.max(0, i.newCustomers);
  const months = Math.max(0.25, i.periodMonths);
  const retained = Math.max(0, Math.min(start, end - added));
  const churned = start - retained;
  const retention = start > 0 ? retained / start : null;
  const churn = retention !== null ? 1 - retention : null;
  const monthlyRetention = retention !== null ? Math.pow(retention, 1 / months) : null;
  const annualRetention = retention !== null ? Math.pow(retention, 12 / months) : null;
  const rpc = Math.max(0, i.revenuePerCustomerMonthly);
  return {
    retained,
    churned,
    retentionPct: retention !== null ? retention * 100 : null,
    churnPct: churn !== null ? churn * 100 : null,
    annualRetentionPct: annualRetention !== null ? annualRetention * 100 : null,
    annualChurnPct: annualRetention !== null ? (1 - annualRetention) * 100 : null,
    averageLifetimeMonths: monthlyRetention !== null && monthlyRetention < 1 ? round2(1 / (1 - monthlyRetention)) : null,
    netGrowthPct: start > 0 ? ((end - start) / start) * 100 : null,
    replacementPerPeriod: churned,
    churnedRevenuePeriod: rpc > 0 ? round2(churned * rpc * months) : null,
    churnedRevenueAnnual: rpc > 0 && annualRetention !== null ? round2(start * (1 - annualRetention) * rpc * 12) : null,
    cohortAfter12Months: annualRetention !== null ? Math.round(start * annualRetention) : null,
  };
}

export const RETENTION_DEFAULTS: RetentionInput = { startCustomers: 500, endCustomers: 480, newCustomers: 50, periodMonths: 1, revenuePerCustomerMonthly: 120 };
