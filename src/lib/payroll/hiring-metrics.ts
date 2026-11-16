// ---------------------------------------------------------------------------
// Hiring metrics engine — Phase 17: the time-to-hire, time-to-fill,
// recruiting-roi, cost-of-turnover, replacement-cost and training-cost pages
// fold into one suite. Pure functions; the component and the generated
// article both call these.
// ---------------------------------------------------------------------------

const round1 = (n: number) => Math.round(n * 10) / 10;
const round2 = (n: number) => Math.round(n * 100) / 100;
const v = (n: number) => (Number.isFinite(n) ? Math.max(0, n) : 0);

export type HiringMode = 'time' | 'sources' | 'turnover' | 'training';
export const HIRING_MODES: { value: HiringMode; label: string; short: string }[] = [
  { value: 'time', label: 'Time to fill & funnel', short: 'Time' },
  { value: 'sources', label: 'Source ROI', short: 'Sources' },
  { value: 'turnover', label: 'Cost of turnover', short: 'Turnover' },
  { value: 'training', label: 'Training cost', short: 'Training' },
];
export const isHiringMode = (x: string | null): x is HiringMode => HIRING_MODES.some((m) => m.value === x);

// ───────────────────────── time to fill, time to hire, funnel

export interface TimeInput {
  /** Requisition approved → job posted */
  daysToPost: number;
  /** Posted → the eventual hire enters the pipeline (applies or is sourced) */
  daysSourcing: number;
  /** Application → end of screening */
  daysScreening: number;
  /** Interviews and assessment */
  daysInterviewing: number;
  /** Offer made → offer accepted */
  daysOffer: number;
  /** Acceptance → first day (notice period) */
  daysNotice: number;
  openRoles: number;
  annualSalary: number;
  /** Daily cost of the empty seat as a multiple of daily salary (lost output, cover, overtime) */
  vacancyCostMultiplier: number;
  applicants: number;
  screened: number;
  interviewed: number;
  offers: number;
  accepted: number;
}

export interface TimeResult {
  /** Requisition approval → offer accepted */
  timeToFill: number;
  /** Candidate enters pipeline → offer accepted */
  timeToHire: number;
  /** Requisition approval → first day */
  timeToStart: number;
  stages: { name: string; days: number; sharePct: number; inTimeToHire: boolean }[];
  bottleneck: string;
  dailyVacancyCost: number;
  vacancyCostPerRole: number;
  vacancyCostTotal: number;
  /** Saved across all open roles for each day cut from the process */
  savingPerDay: number;
  funnel: null | {
    steps: { name: string; count: number; passPct: number | null }[];
    offerAcceptancePct: number | null;
    applicantsPerHire: number | null;
    interviewsPerHire: number | null;
    /** Hires ÷ applicants */
    selectionRatePct: number | null;
  };
}

export function computeTime(i: TimeInput): TimeResult | null {
  const raw = [
    { name: 'Approval to posting', days: v(i.daysToPost), inTimeToHire: false },
    { name: 'Sourcing', days: v(i.daysSourcing), inTimeToHire: false },
    { name: 'Screening', days: v(i.daysScreening), inTimeToHire: true },
    { name: 'Interviews', days: v(i.daysInterviewing), inTimeToHire: true },
    { name: 'Offer to acceptance', days: v(i.daysOffer), inTimeToHire: true },
    { name: 'Notice period', days: v(i.daysNotice), inTimeToHire: false },
  ];
  const timeToStart = raw.reduce((s, x) => s + x.days, 0);
  if (timeToStart <= 0) return null;
  const timeToFill = timeToStart - v(i.daysNotice);
  const timeToHire = raw.filter((x) => x.inTimeToHire).reduce((s, x) => s + x.days, 0);
  const daily = (v(i.annualSalary) / 365) * v(i.vacancyCostMultiplier);
  const roles = v(i.openRoles);
  // Notice is outside the recruiter's control, so the bottleneck is picked from the stages before acceptance.
  const controllable = raw.slice(0, 5);
  const bottleneck = controllable.reduce((a, b) => (b.days > a.days ? b : a), controllable[0]).name;

  const counts = [v(i.applicants), v(i.screened), v(i.interviewed), v(i.offers), v(i.accepted)];
  const names = ['Applicants', 'Passed screening', 'Interviewed', 'Offers made', 'Offers accepted'];
  const funnel = counts[0] > 0
    ? {
        steps: counts.map((c, idx) => ({ name: names[idx], count: c, passPct: idx === 0 ? null : counts[idx - 1] > 0 ? (c / counts[idx - 1]) * 100 : null })),
        offerAcceptancePct: counts[3] > 0 ? (counts[4] / counts[3]) * 100 : null,
        applicantsPerHire: counts[4] > 0 ? round1(counts[0] / counts[4]) : null,
        interviewsPerHire: counts[4] > 0 ? round1(counts[2] / counts[4]) : null,
        selectionRatePct: counts[4] > 0 ? (counts[4] / counts[0]) * 100 : null,
      }
    : null;

  return {
    timeToFill,
    timeToHire,
    timeToStart,
    stages: raw.map((x) => ({ ...x, sharePct: (x.days / timeToStart) * 100 })),
    bottleneck,
    dailyVacancyCost: round2(daily),
    vacancyCostPerRole: round2(daily * timeToStart),
    vacancyCostTotal: round2(daily * timeToStart * roles),
    savingPerDay: round2(daily * roles),
    funnel,
  };
}

export const TIME_DEFAULTS: TimeInput = {
  daysToPost: 5,
  daysSourcing: 12,
  daysScreening: 7,
  daysInterviewing: 14,
  daysOffer: 6,
  daysNotice: 14,
  openRoles: 4,
  annualSalary: 85000,
  vacancyCostMultiplier: 1.5,
  applicants: 240,
  screened: 48,
  interviewed: 16,
  offers: 5,
  accepted: 4,
};

// ───────────────────────── recruiting ROI by source

export interface SourceRow {
  name: string;
  /** External spend on this source: ads, agency fees, referral bonuses */
  spend: number;
  hires: number;
  /** Share of this source's hires still employed after a year, % */
  retainedPct: number;
}

export interface SourcesInput {
  sources: SourceRow[];
  /** Internal recruiting cost (recruiter pay, tools) to spread across hires */
  internalCost: number;
  /** First-year value of a hire who stays (contribution net of their pay) */
  valuePerRetainedHire: number;
}

export interface SourceResult extends SourceRow {
  totalCost: number;
  costPerHire: number | null;
  retainedHires: number;
  costPerRetainedHire: number | null;
  value: number;
  roiPct: number | null;
  hireSharePct: number;
  spendSharePct: number;
}

export interface SourcesResult {
  sources: SourceResult[];
  totalSpend: number;
  totalCost: number;
  hires: number;
  retainedHires: number;
  costPerHire: number | null;
  costPerRetainedHire: number | null;
  retentionPct: number | null;
  value: number;
  roiPct: number | null;
  /** Months of value from a retained hire needed to repay the average cost per retained hire */
  paybackMonths: number | null;
  best: string | null;
  worst: string | null;
}

export function computeSources(i: SourcesInput): SourcesResult | null {
  const rows = i.sources.filter((s) => s.spend > 0 || s.hires > 0);
  const hires = rows.reduce((s, r) => s + v(r.hires), 0);
  if (rows.length === 0 || hires <= 0) return null;
  const internal = v(i.internalCost);
  const value = v(i.valuePerRetainedHire);
  const totalSpend = rows.reduce((s, r) => s + v(r.spend), 0);
  const sources: SourceResult[] = rows.map((r) => {
    const h = v(r.hires);
    const cost = v(r.spend) + (internal * h) / hires;
    const retained = h * (Math.min(100, v(r.retainedPct)) / 100);
    const val = retained * value;
    return {
      ...r,
      totalCost: round2(cost),
      costPerHire: h > 0 ? round2(cost / h) : null,
      retainedHires: round2(retained),
      costPerRetainedHire: retained > 0 ? round2(cost / retained) : null,
      value: round2(val),
      roiPct: cost > 0 ? ((val - cost) / cost) * 100 : null,
      hireSharePct: (h / hires) * 100,
      spendSharePct: totalSpend > 0 ? (v(r.spend) / totalSpend) * 100 : 0,
    };
  });
  const totalCost = totalSpend + internal;
  const retained = sources.reduce((s, r) => s + r.retainedHires, 0);
  const totalValue = retained * value;
  const rated = sources.filter((s) => s.costPerRetainedHire !== null);
  const best = rated.length ? rated.reduce((a, b) => ((b.costPerRetainedHire ?? 0) < (a.costPerRetainedHire ?? 0) ? b : a)) : null;
  const worst = rated.length ? rated.reduce((a, b) => ((b.costPerRetainedHire ?? 0) > (a.costPerRetainedHire ?? 0) ? b : a)) : null;
  const cpr = retained > 0 ? totalCost / retained : null;
  return {
    sources,
    totalSpend,
    totalCost,
    hires,
    retainedHires: round2(retained),
    costPerHire: round2(totalCost / hires),
    costPerRetainedHire: cpr === null ? null : round2(cpr),
    retentionPct: (retained / hires) * 100,
    value: round2(totalValue),
    roiPct: totalCost > 0 ? ((totalValue - totalCost) / totalCost) * 100 : null,
    paybackMonths: cpr !== null && value > 0 ? round1(cpr / (value / 12)) : null,
    best: best?.name ?? null,
    worst: worst && worst !== best ? worst.name : null,
  };
}

export const SOURCES_DEFAULTS: SourcesInput = {
  sources: [
    { name: 'Employee referrals', spend: 12000, hires: 8, retainedPct: 90 },
    { name: 'Job boards', spend: 30000, hires: 12, retainedPct: 70 },
    { name: 'Agency', spend: 75000, hires: 5, retainedPct: 80 },
    { name: 'Outbound sourcing', spend: 24000, hires: 5, retainedPct: 75 },
  ],
  internalCost: 90000,
  valuePerRetainedHire: 60000,
};

// ───────────────────────── cost of turnover

export interface TurnoverInput {
  headcount: number;
  annualTurnoverPct: number;
  avgSalary: number;
  /** Exit admin, accrued-leave payout, severance per leaver */
  separationCost: number;
  /** Days the seat stays empty */
  vacancyDays: number;
  /** Net daily cost of the empty seat as % of daily salary (lost output and cover, less the pay saved) */
  vacancyCostPct: number;
  /** Recruiting cost per replacement hire */
  recruitingCost: number;
  /** Onboarding, equipment and formal training per replacement */
  onboardingCost: number;
  /** Months until the replacement is fully productive */
  rampMonths: number;
  /** Average productivity during the ramp, % of a fully productive employee */
  rampProductivityPct: number;
  /** What-if: turnover reduced by this many percentage points */
  reductionPts: number;
}

export interface TurnoverResult {
  components: { name: string; amount: number; sharePct: number }[];
  costPerDeparture: number;
  pctOfSalary: number;
  departures: number;
  annualCost: number;
  costPerEmployee: number;
  largest: string;
  /** Departures avoided and money saved by the what-if reduction */
  departuresAvoided: number;
  saving: number;
  reducedTurnoverPct: number;
}

export function computeTurnover(i: TurnoverInput): TurnoverResult | null {
  const salary = v(i.avgSalary);
  const headcount = v(i.headcount);
  if (salary <= 0 || headcount <= 0) return null;
  const rate = Math.min(100, v(i.annualTurnoverPct)) / 100;
  const parts = [
    { name: 'Separation', amount: v(i.separationCost) },
    { name: 'Vacancy', amount: (salary / 365) * v(i.vacancyDays) * (v(i.vacancyCostPct) / 100) },
    { name: 'Recruiting', amount: v(i.recruitingCost) },
    { name: 'Onboarding and training', amount: v(i.onboardingCost) },
    { name: 'Ramp-up productivity', amount: (salary / 12) * v(i.rampMonths) * (1 - Math.min(100, v(i.rampProductivityPct)) / 100) },
  ];
  const per = parts.reduce((s, p) => s + p.amount, 0);
  const departures = headcount * rate;
  const reduced = Math.max(0, rate - v(i.reductionPts) / 100);
  const avoided = departures - headcount * reduced;
  return {
    components: parts.map((p) => ({ name: p.name, amount: round2(p.amount), sharePct: per > 0 ? (p.amount / per) * 100 : 0 })),
    costPerDeparture: round2(per),
    pctOfSalary: (per / salary) * 100,
    departures: round1(departures),
    annualCost: round2(per * departures),
    costPerEmployee: round2((per * departures) / headcount),
    largest: parts.reduce((a, b) => (b.amount > a.amount ? b : a), parts[0]).name,
    departuresAvoided: round1(avoided),
    saving: round2(per * avoided),
    reducedTurnoverPct: reduced * 100,
  };
}

export const TURNOVER_DEFAULTS: TurnoverInput = {
  headcount: 200,
  annualTurnoverPct: 18,
  avgSalary: 65000,
  separationCost: 2500,
  vacancyDays: 45,
  vacancyCostPct: 50,
  recruitingCost: 4700,
  onboardingCost: 3500,
  rampMonths: 5,
  rampProductivityPct: 50,
  reductionPts: 3,
};

// ───────────────────────── training cost & ROI

export interface TrainingInput {
  participants: number;
  hoursPerParticipant: number;
  /** Loaded hourly cost of a participant's time */
  hourlyWage: number;
  /** One-off content development or license */
  developmentCost: number;
  /** Trainer or vendor delivery fees */
  deliveryCost: number;
  facilityCost: number;
  materialsPerParticipant: number;
  travelPerParticipant: number;
  /** Annual benefit attributed to the training (optional) */
  annualBenefit: number;
  /** Annual payroll, to express the spend as a share of payroll (optional) */
  annualPayroll: number;
}

export interface TrainingResult {
  participantHours: number;
  wagesCost: number;
  directCost: number;
  totalCost: number;
  costPerParticipant: number;
  costPerHour: number;
  directCostPerParticipant: number;
  wagesSharePct: number;
  components: { name: string; amount: number; sharePct: number }[];
  pctOfPayroll: number | null;
  roiPct: number | null;
  paybackMonths: number | null;
  /** Annual benefit per participant needed to break even in a year */
  breakEvenBenefitPerParticipant: number;
}

export function computeTraining(i: TrainingInput): TrainingResult | null {
  const n = v(i.participants);
  const hours = v(i.hoursPerParticipant);
  if (n <= 0) return null;
  const parts = [
    { name: 'Participant time', amount: n * hours * v(i.hourlyWage) },
    { name: 'Development or license', amount: v(i.developmentCost) },
    { name: 'Delivery (trainer, vendor)', amount: v(i.deliveryCost) },
    { name: 'Facility', amount: v(i.facilityCost) },
    { name: 'Materials', amount: n * v(i.materialsPerParticipant) },
    { name: 'Travel', amount: n * v(i.travelPerParticipant) },
  ];
  const total = parts.reduce((s, p) => s + p.amount, 0);
  if (total <= 0) return null;
  const wages = parts[0].amount;
  const benefit = v(i.annualBenefit);
  const payroll = v(i.annualPayroll);
  return {
    participantHours: n * hours,
    wagesCost: round2(wages),
    directCost: round2(total - wages),
    totalCost: round2(total),
    costPerParticipant: round2(total / n),
    costPerHour: n * hours > 0 ? round2(total / (n * hours)) : 0,
    directCostPerParticipant: round2((total - wages) / n),
    wagesSharePct: (wages / total) * 100,
    components: parts.filter((p) => p.amount > 0).map((p) => ({ name: p.name, amount: round2(p.amount), sharePct: (p.amount / total) * 100 })),
    pctOfPayroll: payroll > 0 ? (total / payroll) * 100 : null,
    roiPct: benefit > 0 ? ((benefit - total) / total) * 100 : null,
    paybackMonths: benefit > 0 ? round1(total / (benefit / 12)) : null,
    breakEvenBenefitPerParticipant: round2(total / n),
  };
}

export const TRAINING_DEFAULTS: TrainingInput = {
  participants: 50,
  hoursPerParticipant: 8,
  hourlyWage: 38,
  developmentCost: 15000,
  deliveryCost: 8000,
  facilityCost: 1500,
  materialsPerParticipant: 60,
  travelPerParticipant: 0,
  annualBenefit: 90000,
  annualPayroll: 3900000,
};
