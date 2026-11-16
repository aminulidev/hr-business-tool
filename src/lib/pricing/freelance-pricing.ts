// ---------------------------------------------------------------------------
// Freelance pricing engine — Phase 17: the project-pricing, proposal-price,
// quote, estimate, consultant-fee, time-value, retainer, profit-per-client,
// client-profit, monthly-revenue and agency-margin pages fold into one suite.
// Pure functions; the component and the generated article both call these.
// ---------------------------------------------------------------------------

const round1 = (n: number) => Math.round(n * 10) / 10;
const round2 = (n: number) => Math.round(n * 100) / 100;
const v = (n: number) => (Number.isFinite(n) ? Math.max(0, n) : 0);
const frac = (pctValue: number, cap = 100) => Math.min(cap, v(pctValue)) / 100;

export type FreelanceMode = 'project' | 'rate' | 'retainer' | 'clients' | 'agency';
export const FREELANCE_MODES: { value: FreelanceMode; label: string; short: string }[] = [
  { value: 'project', label: 'Project quote', short: 'Quote' },
  { value: 'rate', label: 'Day rate card', short: 'Rates' },
  { value: 'retainer', label: 'Retainer', short: 'Retainer' },
  { value: 'clients', label: 'Client profit', short: 'Clients' },
  { value: 'agency', label: 'Agency margin', short: 'Agency' },
];
export const isFreelanceMode = (x: string | null): x is FreelanceMode => FREELANCE_MODES.some((m) => m.value === x);

// ───────────────────────── project quote

export interface QuoteLine {
  name: string;
  hours: number;
  rate: number;
}

export interface ProjectInput {
  lines: QuoteLine[];
  /** Pass-through costs you pay on the client's behalf (stock, licenses, subcontractors) */
  expenses: number;
  expenseMarkupPct: number;
  /** Contingency added to labor for scope you cannot see yet */
  contingencyPct: number;
  discountPct: number;
  /** Sales tax, where the service is taxable (0 = none) */
  taxPct: number;
  depositPct: number;
  /** What-if: hours run over the estimate by this much on a fixed price */
  overrunPct: number;
}

export interface ProjectResult {
  lines: (QuoteLine & { amount: number; sharePct: number })[];
  hours: number;
  labor: number;
  contingency: number;
  expensesBilled: number;
  subtotal: number;
  discount: number;
  /** Price before tax */
  price: number;
  tax: number;
  total: number;
  deposit: number;
  balance: number;
  /** Labor ÷ hours: the rate card behind the quote */
  blendedRate: number;
  /** (Price − expense cost) ÷ estimated hours */
  effectiveRate: number;
  overrunHours: number;
  /** Effective rate if the hours overrun on a fixed price */
  effectiveRateAtOverrun: number;
  /** Overrun at which the effective rate falls back to the blended rate, % (null if already below) */
  overrunCushionPct: number | null;
}

export function computeProject(i: ProjectInput): ProjectResult | null {
  const rows = i.lines.filter((l) => l.hours > 0 && l.rate > 0);
  if (rows.length === 0) return null;
  const labor = rows.reduce((s, l) => s + l.hours * l.rate, 0);
  const hours = rows.reduce((s, l) => s + l.hours, 0);
  const expenses = v(i.expenses);
  const contingency = labor * frac(i.contingencyPct, 1000);
  const expensesBilled = expenses * (1 + frac(i.expenseMarkupPct, 1000));
  const subtotal = labor + contingency + expensesBilled;
  const discount = subtotal * frac(i.discountPct);
  const price = subtotal - discount;
  const tax = price * frac(i.taxPct);
  const total = price + tax;
  const deposit = total * frac(i.depositPct);
  const blended = labor / hours;
  const fee = price - expenses;
  const overrunHours = hours * (1 + frac(i.overrunPct, 1000));
  const cushion = fee / blended / hours - 1;
  return {
    lines: rows.map((l) => ({ ...l, amount: round2(l.hours * l.rate), sharePct: ((l.hours * l.rate) / labor) * 100 })),
    hours,
    labor: round2(labor),
    contingency: round2(contingency),
    expensesBilled: round2(expensesBilled),
    subtotal: round2(subtotal),
    discount: round2(discount),
    price: round2(price),
    tax: round2(tax),
    total: round2(total),
    deposit: round2(deposit),
    balance: round2(total - deposit),
    blendedRate: round2(blended),
    effectiveRate: round2(fee / hours),
    overrunHours: round1(overrunHours),
    effectiveRateAtOverrun: round2(fee / overrunHours),
    overrunCushionPct: cushion > 0 ? cushion * 100 : null,
  };
}

export const PROJECT_DEFAULTS: ProjectInput = {
  lines: [
    { name: 'Discovery and strategy', hours: 12, rate: 150 },
    { name: 'Design', hours: 30, rate: 125 },
    { name: 'Development', hours: 60, rate: 140 },
    { name: 'QA and launch', hours: 14, rate: 110 },
  ],
  expenses: 1800,
  expenseMarkupPct: 10,
  contingencyPct: 15,
  discountPct: 5,
  taxPct: 0,
  depositPct: 40,
  overrunPct: 20,
};

// ───────────────────────── day rate card

export interface RateInput {
  /** What you want to pay yourself before income tax */
  targetIncome: number;
  businessExpenses: number;
  /** Profit kept in the business on top of your pay, % of revenue */
  profitMarginPct: number;
  weeksOff: number;
  billableDaysPerWeek: number;
  billableHoursPerDay: number;
}

export interface RateResult {
  revenueNeeded: number;
  billableDays: number;
  billableHours: number;
  hourly: number;
  halfDay: number;
  dayRate: number;
  weekly: number;
  monthlyAverage: number;
  perMinute: number;
  /** Billable hours as a share of a 2,080-hour employee year */
  utilizationPct: number;
  /** The same income as an employee's hourly wage (÷ 2,080) */
  employeeHourly: number;
  /** Hourly rate ÷ employee-equivalent hourly wage */
  multipleOfWage: number;
  /** Rate needed if one more billable day a week were sold */
  hourlyWithExtraDay: number | null;
}

export function computeRate(i: RateInput): RateResult | null {
  const income = v(i.targetIncome);
  const margin = frac(i.profitMarginPct, 95);
  const weeks = Math.max(0, 52 - v(i.weeksOff));
  const daysPerWeek = Math.min(7, v(i.billableDaysPerWeek));
  const hoursPerDay = Math.min(24, v(i.billableHoursPerDay));
  const days = weeks * daysPerWeek;
  const hours = days * hoursPerDay;
  if (income <= 0 || hours <= 0) return null;
  const needed = (income + v(i.businessExpenses)) / (1 - margin);
  const hourly = needed / hours;
  const employeeHourly = income / 2080;
  const extraDays = daysPerWeek < 5 ? weeks * (daysPerWeek + 1) * hoursPerDay : 0;
  return {
    revenueNeeded: round2(needed),
    billableDays: round1(days),
    billableHours: round1(hours),
    hourly: round2(hourly),
    halfDay: round2((hourly * hoursPerDay) / 2),
    dayRate: round2(hourly * hoursPerDay),
    weekly: round2(hourly * hoursPerDay * daysPerWeek),
    monthlyAverage: round2(needed / 12),
    perMinute: round2(hourly / 60),
    utilizationPct: (hours / 2080) * 100,
    employeeHourly: round2(employeeHourly),
    multipleOfWage: round2(hourly / employeeHourly),
    hourlyWithExtraDay: extraDays > 0 ? round2(needed / extraDays) : null,
  };
}

export const RATE_DEFAULTS: RateInput = {
  targetIncome: 120000,
  businessExpenses: 18000,
  profitMarginPct: 15,
  weeksOff: 6,
  billableDaysPerWeek: 4,
  billableHoursPerDay: 6.5,
};

// ───────────────────────── retainer

export interface RetainerInput {
  hourlyRate: number;
  includedHours: number;
  discountPct: number;
  /** Hours you expect the client to actually use in a typical month */
  expectedHours: number;
  /** Rate for hours beyond the allowance (0 = standard rate) */
  overageRate: number;
  termMonths: number;
}

export interface RetainerScenario {
  usagePct: number;
  hours: number;
  billed: number;
  effectiveRate: number;
}

export interface RetainerResult {
  standardValue: number;
  discountAmount: number;
  monthlyFee: number;
  /** Fee ÷ included hours */
  includedRate: number;
  overageHours: number;
  overageBilling: number;
  unusedHours: number;
  monthlyBilled: number;
  /** What the client really pays per hour at the expected usage */
  effectiveRate: number;
  annualValue: number;
  termValue: number;
  /** Usage below which the retainer earns more per hour than your standard rate */
  breakEvenHours: number;
  scenarios: RetainerScenario[];
}

export function computeRetainer(i: RetainerInput): RetainerResult | null {
  const rate = v(i.hourlyRate);
  const included = v(i.includedHours);
  if (rate <= 0 || included <= 0) return null;
  const value = rate * included;
  const fee = value * (1 - frac(i.discountPct));
  const overRate = v(i.overageRate) > 0 ? v(i.overageRate) : rate;
  const bill = (hours: number) => fee + Math.max(0, hours - included) * overRate;
  const expected = v(i.expectedHours) > 0 ? v(i.expectedHours) : included;
  const billed = bill(expected);
  return {
    standardValue: round2(value),
    discountAmount: round2(value - fee),
    monthlyFee: round2(fee),
    includedRate: round2(fee / included),
    overageHours: round1(Math.max(0, expected - included)),
    overageBilling: round2(Math.max(0, expected - included) * overRate),
    unusedHours: round1(Math.max(0, included - expected)),
    monthlyBilled: round2(billed),
    effectiveRate: round2(billed / expected),
    annualValue: round2(fee * 12),
    termValue: round2(fee * v(i.termMonths)),
    breakEvenHours: round1(fee / rate),
    scenarios: [50, 75, 100, 125, 150].map((u) => {
      const h = (included * u) / 100;
      return { usagePct: u, hours: round1(h), billed: round2(bill(h)), effectiveRate: round2(bill(h) / h) };
    }),
  };
}

export const RETAINER_DEFAULTS: RetainerInput = { hourlyRate: 125, includedHours: 30, discountPct: 10, expectedHours: 34, overageRate: 125, termMonths: 12 };

// ───────────────────────── client profitability & revenue mix

export interface ClientRow {
  name: string;
  monthlyRevenue: number;
  /** Retainer or subscription revenue you can count on next month */
  recurring: boolean;
  hours: number;
  /** Subcontractors, software, ads bought for this client */
  directCosts: number;
}

export interface ClientsInput {
  clients: ClientRow[];
  /** What an hour of delivery costs you: your own target pay per hour or blended staff cost */
  costPerHour: number;
  overheadMonthly: number;
}

export interface ClientResult extends ClientRow {
  laborCost: number;
  profit: number;
  marginPct: number;
  /** (Revenue − direct costs) ÷ hours */
  effectiveRate: number | null;
  revenueSharePct: number;
  hoursSharePct: number;
}

export interface ClientsResult {
  clients: ClientResult[];
  revenue: number;
  annualRevenue: number;
  recurringRevenue: number;
  recurringPct: number;
  hours: number;
  /** Revenue net of direct costs per hour across all clients */
  blendedRate: number | null;
  contribution: number;
  overhead: number;
  netProfit: number;
  netMarginPct: number;
  largestClient: string;
  largestSharePct: number;
  best: string | null;
  worst: string | null;
  /** Clients whose effective rate is below the cost of an hour */
  belowCost: string[];
}

export function computeClients(i: ClientsInput): ClientsResult | null {
  const rows = i.clients.filter((c) => c.monthlyRevenue > 0);
  if (rows.length === 0) return null;
  const cost = v(i.costPerHour);
  const revenue = rows.reduce((s, c) => s + c.monthlyRevenue, 0);
  const hours = rows.reduce((s, c) => s + v(c.hours), 0);
  const clients: ClientResult[] = rows.map((c) => {
    const h = v(c.hours);
    const direct = v(c.directCosts);
    const labor = h * cost;
    const profit = c.monthlyRevenue - labor - direct;
    return {
      ...c,
      hours: h,
      directCosts: direct,
      laborCost: round2(labor),
      profit: round2(profit),
      marginPct: (profit / c.monthlyRevenue) * 100,
      effectiveRate: h > 0 ? round2((c.monthlyRevenue - direct) / h) : null,
      revenueSharePct: (c.monthlyRevenue / revenue) * 100,
      hoursSharePct: hours > 0 ? (h / hours) * 100 : 0,
    };
  });
  const recurring = rows.filter((c) => c.recurring).reduce((s, c) => s + c.monthlyRevenue, 0);
  const contribution = clients.reduce((s, c) => s + c.profit, 0);
  const overhead = v(i.overheadMonthly);
  const net = contribution - overhead;
  const direct = clients.reduce((s, c) => s + c.directCosts, 0);
  const largest = clients.reduce((a, b) => (b.monthlyRevenue > a.monthlyRevenue ? b : a), clients[0]);
  const rated = clients.filter((c) => c.effectiveRate !== null);
  const best = rated.length ? rated.reduce((a, b) => ((b.effectiveRate ?? 0) > (a.effectiveRate ?? 0) ? b : a)) : null;
  const worst = rated.length ? rated.reduce((a, b) => ((b.effectiveRate ?? 0) < (a.effectiveRate ?? 0) ? b : a)) : null;
  return {
    clients,
    revenue: round2(revenue),
    annualRevenue: round2(revenue * 12),
    recurringRevenue: round2(recurring),
    recurringPct: (recurring / revenue) * 100,
    hours: round1(hours),
    blendedRate: hours > 0 ? round2((revenue - direct) / hours) : null,
    contribution: round2(contribution),
    overhead,
    netProfit: round2(net),
    netMarginPct: (net / revenue) * 100,
    largestClient: largest.name,
    largestSharePct: largest.revenueSharePct,
    best: best?.name ?? null,
    worst: worst && worst !== best ? worst.name : null,
    belowCost: rated.filter((c) => (c.effectiveRate ?? 0) < cost).map((c) => c.name),
  };
}

export const CLIENTS_DEFAULTS: ClientsInput = {
  clients: [
    { name: 'Acme (retainer)', monthlyRevenue: 4000, recurring: true, hours: 28, directCosts: 150 },
    { name: 'Northwind (project)', monthlyRevenue: 6500, recurring: false, hours: 62, directCosts: 900 },
    { name: 'Beacon (retainer)', monthlyRevenue: 2200, recurring: true, hours: 26, directCosts: 0 },
    { name: 'Summit (hourly)', monthlyRevenue: 1800, recurring: false, hours: 10, directCosts: 0 },
  ],
  costPerHour: 60,
  overheadMonthly: 1500,
};

// ───────────────────────── agency margin

export interface AgencyInput {
  /** Rate charged to the client per hour */
  billRate: number;
  /** What you pay per hour: contractor rate or loaded employee cost */
  costRate: number;
  /** Hours billed to clients in the month */
  billableHours: number;
  /** Share of paid hours that are billed (100 for contractors paid only for billed hours) */
  utilizationPct: number;
  /** Overhead as a share of revenue: account management, sales, tools, rent */
  overheadPct: number;
  targetMarginPct: number;
}

export interface AgencyResult {
  revenue: number;
  /** Cost of a billed hour once unbilled paid time is included */
  costPerBilledHour: number;
  deliveryCost: number;
  grossProfit: number;
  grossMarginPct: number;
  /** Markup on the cost of a billed hour */
  markupPct: number;
  /** Bill rate ÷ pay rate */
  multiplier: number;
  marginPerHour: number;
  overhead: number;
  netProfit: number;
  netMarginPct: number;
  /** Bill rate that reaches the target gross margin */
  requiredBillRate: number | null;
  /** Utilization that reaches the target gross margin at the current bill rate (null if out of reach) */
  requiredUtilizationPct: number | null;
}

export function computeAgency(i: AgencyInput): AgencyResult | null {
  const bill = v(i.billRate);
  const cost = v(i.costRate);
  const hours = v(i.billableHours);
  const util = frac(i.utilizationPct) || 1;
  if (bill <= 0 || cost <= 0) return null;
  const costPerBilled = cost / util;
  const revenue = bill * hours;
  const delivery = costPerBilled * hours;
  const gross = revenue - delivery;
  const overhead = revenue * frac(i.overheadPct);
  const target = frac(i.targetMarginPct, 95);
  const neededUtil = target < 1 ? cost / (bill * (1 - target)) : null;
  return {
    revenue: round2(revenue),
    costPerBilledHour: round2(costPerBilled),
    deliveryCost: round2(delivery),
    grossProfit: round2(gross),
    grossMarginPct: ((bill - costPerBilled) / bill) * 100,
    markupPct: ((bill - costPerBilled) / costPerBilled) * 100,
    multiplier: round2(bill / cost),
    marginPerHour: round2(bill - costPerBilled),
    overhead: round2(overhead),
    netProfit: round2(gross - overhead),
    netMarginPct: revenue > 0 ? ((gross - overhead) / revenue) * 100 : ((bill - costPerBilled) / bill - frac(i.overheadPct)) * 100,
    requiredBillRate: target > 0 ? round2(costPerBilled / (1 - target)) : null,
    requiredUtilizationPct: neededUtil !== null && neededUtil <= 1 ? neededUtil * 100 : null,
  };
}

export const AGENCY_DEFAULTS: AgencyInput = { billRate: 150, costRate: 70, billableHours: 320, utilizationPct: 80, overheadPct: 20, targetMarginPct: 50 };
