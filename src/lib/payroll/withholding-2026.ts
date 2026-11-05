// ---------------------------------------------------------------------------
// 2026 paycheck withholding — single source of truth for state paycheck pages
// ---------------------------------------------------------------------------
// Every figure below comes from an official 2026 publication:
// - Federal brackets & standard deduction: IRS Rev. Proc. 2025-32
// - Social Security wage base: SSA, 2026 ($184,500)
// - California: EDD 2026 Withholding Schedules, Method B; SDI 1.3%, no wage cap
// - New York State: NYS-50-T-NYS (1/26), Method II exact calculation
// - New York City: NYS-50-T-NYC (1/26), Method II exact calculation
// - New York PFL: 0.432% up to $411.91/yr; NY DBL (SDI): 0.5% up to $0.60/week
// - Illinois: 4.95% flat, $2,925 per IL-W-4 allowance (IL Comptroller bulletin 1-26)
// - Washington: 0% income tax; WA PFML employee share 0.5714% (up to $184,500); WA Cares 0.58%
// - Pennsylvania: 3.07% flat state tax; PA UC employee withholding 0.07%
// - North Carolina: 4.25% flat state tax after NC-4 standard deduction & $2,500/allowance
// - Georgia: 5.19% flat state tax after G-4 standard deduction ($12k/$24k) & $4,000/allowance
// - Michigan: 4.25% flat state tax after $5,800 per MI-W4 exemption
// - Indiana: 2.95% flat state tax after $1,000 per WH-4 exemption
// - Arizona: 2.50% flat state tax after standard deduction & $100/allowance credit
// - Colorado: 4.40% flat state tax after standard deduction; CO FAMLI employee share 0.45% (capped at $184,500)
// - Texas, Florida, Tennessee, Nevada: 0% state income tax, no employee payroll tax

export const TAX_YEAR = 2026;

export type FilingStatus = 'single' | 'married' | 'hoh';
export type PayFrequency = 'weekly' | 'bi-weekly' | 'semi-monthly' | 'monthly';
export type StateCode =
  | 'CA'
  | 'TX'
  | 'FL'
  | 'NY'
  | 'IL'
  | 'WA'
  | 'TN'
  | 'NV'
  | 'PA'
  | 'NC'
  | 'GA'
  | 'MI'
  | 'IN'
  | 'AZ'
  | 'CO';

/** StateCode plus the two generic options used by the national hourly paycheck calculator */
export type PaycheckState = StateCode | 'none' | 'other';

export const PERIODS_PER_YEAR: Record<PayFrequency, number> = {
  weekly: 52,
  'bi-weekly': 26,
  'semi-monthly': 24,
  monthly: 12,
};

// A rate schedule row: tax = base + (income − over) × rate, for the last row whose `over` ≤ income
interface ScheduleRow {
  over: number;
  base: number;
  rate: number;
}

function taxFromSchedule(income: number, schedule: ScheduleRow[]): number {
  if (income <= 0) return 0;
  let row = schedule[0];
  for (const r of schedule) {
    if (income > r.over) row = r;
  }
  return row.base + (income - row.over) * row.rate;
}

// Build a schedule from bracket tops and rates (base amounts accumulate automatically)
function scheduleFromBrackets(tops: number[], rates: number[]): ScheduleRow[] {
  const rows: ScheduleRow[] = [];
  let over = 0;
  let base = 0;
  rates.forEach((rate, i) => {
    rows.push({ over, base, rate });
    const top = tops[i];
    if (top !== undefined) {
      base += (top - over) * rate;
      over = top;
    }
  });
  return rows;
}

// ---------------------------------------------------------------------------
// Federal (W-4 2020 or later, no Step 2–4 adjustments)
// ---------------------------------------------------------------------------

const FEDERAL_RATES = [0.1, 0.12, 0.22, 0.24, 0.32, 0.35, 0.37];

const FEDERAL_SCHEDULES: Record<FilingStatus, ScheduleRow[]> = {
  single: scheduleFromBrackets([12400, 50400, 105700, 201775, 256225, 640600], FEDERAL_RATES),
  married: scheduleFromBrackets([24800, 100800, 211400, 403550, 512450, 768700], FEDERAL_RATES),
  hoh: scheduleFromBrackets([17700, 67450, 105700, 201775, 256225, 640600], FEDERAL_RATES),
};

export const FEDERAL_STANDARD_DEDUCTION: Record<FilingStatus, number> = {
  single: 16100,
  married: 32200,
  hoh: 24150,
};

export const SOCIAL_SECURITY_RATE = 0.062;
export const SOCIAL_SECURITY_WAGE_BASE = 184500;
export const MEDICARE_RATE = 0.0145;
export const ADDITIONAL_MEDICARE_RATE = 0.009;
// Employers must withhold Additional Medicare on wages over $200,000 regardless of filing status
export const ADDITIONAL_MEDICARE_THRESHOLD = 200000;

function federalIncomeTax(annualWages: number, status: FilingStatus): number {
  return taxFromSchedule(annualWages - FEDERAL_STANDARD_DEDUCTION[status], FEDERAL_SCHEDULES[status]);
}

// ---------------------------------------------------------------------------
// California — EDD Method B, annual payroll period
// ---------------------------------------------------------------------------

const CA_SCHEDULES: Record<FilingStatus, ScheduleRow[]> = {
  single: [
    { over: 0, base: 0, rate: 0.011 },
    { over: 11079, base: 121.87, rate: 0.022 },
    { over: 26264, base: 455.94, rate: 0.044 },
    { over: 41452, base: 1124.21, rate: 0.066 },
    { over: 57542, base: 2186.15, rate: 0.088 },
    { over: 72724, base: 3522.17, rate: 0.1023 },
    { over: 371479, base: 34084.81, rate: 0.1133 },
    { over: 445771, base: 42502.09, rate: 0.1243 },
    { over: 742953, base: 79441.81, rate: 0.1353 },
    { over: 1000000, base: 114220.27, rate: 0.1463 },
  ],
  married: [
    { over: 0, base: 0, rate: 0.011 },
    { over: 22158, base: 243.74, rate: 0.022 },
    { over: 52528, base: 911.88, rate: 0.044 },
    { over: 82904, base: 2248.42, rate: 0.066 },
    { over: 115084, base: 4372.3, rate: 0.088 },
    { over: 145448, base: 7044.33, rate: 0.1023 },
    { over: 742958, base: 68169.6, rate: 0.1133 },
    { over: 891542, base: 85004.17, rate: 0.1243 },
    { over: 1000000, base: 98485.5, rate: 0.1353 },
    { over: 1485906, base: 164228.58, rate: 0.1463 },
  ],
  hoh: [
    { over: 0, base: 0, rate: 0.011 },
    { over: 22173, base: 243.9, rate: 0.022 },
    { over: 52530, base: 911.75, rate: 0.044 },
    { over: 67716, base: 1579.93, rate: 0.066 },
    { over: 83805, base: 2641.8, rate: 0.088 },
    { over: 98990, base: 3978.08, rate: 0.1023 },
    { over: 505208, base: 45534.18, rate: 0.1133 },
    { over: 606251, base: 56982.35, rate: 0.1243 },
    { over: 1000000, base: 105925.35, rate: 0.1353 },
    { over: 1010417, base: 107334.77, rate: 0.1463 },
  ],
};

const CA_EXEMPTION_CREDIT_PER_ALLOWANCE = 168.3;
export const CA_SDI_RATE = 0.013;

function caUsesDoubleAmounts(status: FilingStatus, allowances: number): boolean {
  return status === 'hoh' || (status === 'married' && allowances >= 2);
}

function californiaIncomeTax(annualWages: number, status: FilingStatus, allowances: number): number {
  const double = caUsesDoubleAmounts(status, allowances);
  const lowIncomeExemption = double ? 37791 : 18896;
  if (annualWages <= lowIncomeExemption) return 0;
  const standardDeduction = double ? 11412 : 5706;
  const tax = taxFromSchedule(annualWages - standardDeduction, CA_SCHEDULES[status]);
  return Math.max(0, tax - allowances * CA_EXEMPTION_CREDIT_PER_ALLOWANCE);
}

// ---------------------------------------------------------------------------
// New York State and New York City — Method II exact calculation, annual
// ---------------------------------------------------------------------------

const NY_SCHEDULES: Record<'single' | 'married', ScheduleRow[]> = {
  single: [
    { over: 0, base: 0, rate: 0.039 },
    { over: 8500, base: 332, rate: 0.044 },
    { over: 11700, base: 472, rate: 0.0515 },
    { over: 13900, base: 586, rate: 0.054 },
    { over: 80650, base: 4190, rate: 0.059 },
    { over: 96800, base: 5143, rate: 0.0703 },
    { over: 107650, base: 5906, rate: 0.0753 },
    { over: 157650, base: 9673, rate: 0.064 },
    { over: 215400, base: 13369, rate: 0.1144 },
    { over: 265400, base: 19091, rate: 0.0735 },
  ],
  married: [
    { over: 0, base: 0, rate: 0.039 },
    { over: 8500, base: 332, rate: 0.044 },
    { over: 11700, base: 472, rate: 0.0515 },
    { over: 13900, base: 586, rate: 0.054 },
    { over: 80650, base: 4190, rate: 0.059 },
    { over: 96800, base: 5143, rate: 0.0657 },
    { over: 107650, base: 5855, rate: 0.0707 },
    { over: 157650, base: 9388, rate: 0.0801 },
    { over: 211550, base: 13708, rate: 0.064 },
    { over: 323200, base: 20854, rate: 0.1349 },
    { over: 373200, base: 27600, rate: 0.0735 },
    { over: 1077550, base: 79369, rate: 0.0765 },
  ],
};

const NYC_SCHEDULE: ScheduleRow[] = [
  { over: 0, base: 0, rate: 0.0205 },
  { over: 8000, base: 164, rate: 0.028 },
  { over: 8700, base: 184, rate: 0.0325 },
  { over: 15000, base: 388, rate: 0.0395 },
  { over: 25000, base: 783, rate: 0.0415 },
  { over: 60000, base: 2236, rate: 0.0425 },
];

const NY_EXEMPTION_AMOUNT = 1000;
export const NY_PFL_RATE = 0.00432;
export const NY_PFL_ANNUAL_CAP = 411.91;
export const NY_SDI_RATE = 0.005;
export const NY_SDI_WEEKLY_CAP = 0.6;

function nyStatus(status: FilingStatus): 'single' | 'married' {
  return status === 'married' ? 'married' : 'single';
}

function newYorkStateIncomeTax(annualWages: number, status: FilingStatus, exemptions: number): number {
  const s = nyStatus(status);
  const deduction = (s === 'married' ? 7950 : 7400) + exemptions * NY_EXEMPTION_AMOUNT;
  return taxFromSchedule(annualWages - deduction, NY_SCHEDULES[s]);
}

function newYorkCityIncomeTax(annualWages: number, status: FilingStatus, exemptions: number): number {
  const deduction = (nyStatus(status) === 'married' ? 5500 : 5000) + exemptions * NY_EXEMPTION_AMOUNT;
  return taxFromSchedule(annualWages - deduction, NYC_SCHEDULE);
}

// ---------------------------------------------------------------------------
// Illinois — flat rate after IL-W-4 allowances
// ---------------------------------------------------------------------------

export const IL_RATE = 0.0495;
export const IL_ALLOWANCE = 2925;

function illinoisIncomeTax(annualWages: number, allowances: number): number {
  return Math.max(0, annualWages - allowances * IL_ALLOWANCE) * IL_RATE;
}

// ---------------------------------------------------------------------------
// Additional Exact 2026 State Withholding Engines
// ---------------------------------------------------------------------------

// Washington: 0% income tax, WA PFML employee share ~0.5714% (71.43% of 0.80% up to SS cap), WA Cares 0.58%
export const WA_PFML_EMPLOYEE_RATE = 0.005714;
export const WA_CARES_RATE = 0.0058;

// Pennsylvania: 3.07% flat income tax + 0.07% PA UC employee withholding
export const PA_INCOME_TAX_RATE = 0.0307;
export const PA_UC_EMPLOYEE_RATE = 0.0007;

// North Carolina: 4.25% flat tax in 2026 after NC-4 standard deduction & $2,500 per allowance
export const NC_RATE = 0.0425;
export const NC_STD_DEDUCTION: Record<FilingStatus, number> = {
  single: 12750,
  married: 25500,
  hoh: 19125,
};
export const NC_ALLOWANCE = 2500;

function northCarolinaIncomeTax(annualWages: number, status: FilingStatus, allowances: number): number {
  const deduction = NC_STD_DEDUCTION[status] + allowances * NC_ALLOWANCE;
  return Math.max(0, annualWages - deduction) * NC_RATE;
}

// Georgia: 5.19% flat tax in 2026 after G-4 standard deduction ($12k single/hoh, $24k married) & $4,000 per allowance
export const GA_RATE = 0.0519;
export const GA_STD_DEDUCTION: Record<FilingStatus, number> = {
  single: 12000,
  married: 24000,
  hoh: 12000,
};
export const GA_ALLOWANCE = 4000;

function georgiaIncomeTax(annualWages: number, status: FilingStatus, allowances: number): number {
  const deduction = GA_STD_DEDUCTION[status] + allowances * GA_ALLOWANCE;
  return Math.max(0, annualWages - deduction) * GA_RATE;
}

// Michigan: 4.25% flat tax after $5,800 per MI-W4 exemption
export const MI_RATE = 0.0425;
export const MI_EXEMPTION = 5800;

function michiganIncomeTax(annualWages: number, allowances: number): number {
  return Math.max(0, annualWages - allowances * MI_EXEMPTION) * MI_RATE;
}

// Indiana: 2.95% flat state tax in 2026 after $1,000 per WH-4 exemption
export const IN_RATE = 0.0295;
export const IN_EXEMPTION = 1000;

function indianaIncomeTax(annualWages: number, allowances: number): number {
  return Math.max(0, annualWages - allowances * IN_EXEMPTION) * IN_RATE;
}

// Arizona: 2.50% flat state tax after standard deduction ($16,100 / $32,200 / $24,150) & $100 per dependent credit
export const AZ_RATE = 0.025;
export const AZ_DEPENDENT_CREDIT = 100;

function arizonaIncomeTax(annualWages: number, status: FilingStatus, allowances: number): number {
  const taxable = Math.max(0, annualWages - FEDERAL_STANDARD_DEDUCTION[status]);
  return Math.max(0, taxable * AZ_RATE - allowances * AZ_DEPENDENT_CREDIT);
}

// Colorado: 4.40% flat state tax after federal standard deduction; CO FAMLI employee share 0.45% up to SS wage cap
export const CO_RATE = 0.044;
export const CO_FAMLI_RATE = 0.0045;

function coloradoIncomeTax(annualWages: number, status: FilingStatus, allowances: number): number {
  const taxable = Math.max(0, annualWages - FEDERAL_STANDARD_DEDUCTION[status] - allowances * 1000);
  return taxable * CO_RATE;
}

// ---------------------------------------------------------------------------
// Paycheck calculation
// ---------------------------------------------------------------------------

export interface PaycheckInput {
  state: PaycheckState;
  /** 'other' state only: flat state income tax rate as a decimal (0.05 = 5%) */
  customStateRate?: number;
  /** Flat after-tax deductions taken from every paycheck (union dues, garnishments, post-tax insurance) */
  otherDeductionsPerPeriod?: number;
  /** Annual pre-tax retirement contributions (401(k), 403(b)): exempt from income tax, still subject to FICA */
  preTaxRetirementAnnual?: number;
  /** Annual Section 125 benefits (health, dental, FSA, HSA through payroll): exempt from income tax and FICA */
  preTaxBenefitsAnnual?: number;
  hourlyRate: number;
  regularHoursPerWeek: number;
  overtimeHoursPerWeek: number;
  overtimeMultiplier: number;
  payFrequency: PayFrequency;
  filingStatus: FilingStatus;
  /** State withholding allowances / exemptions. Ignored in no-income-tax states. */
  stateAllowances: number;
  /** New York only: employee lives in New York City */
  nycResident?: boolean;
}

export interface PaycheckLine {
  key: string;
  label: string;
  annual: number;
  perPeriod: number;
}

export interface PaycheckResult {
  periodsPerYear: number;
  grossAnnual: number;
  grossPerPeriod: number;
  deductions: PaycheckLine[];
  totalDeductionsAnnual: number;
  netAnnual: number;
  netPerPeriod: number;
  /** Take-home pay divided by hours worked */
  netPerHour: number;
  /** Total deductions as a share of gross pay */
  effectiveRate: number;
}

const round2 = (n: number) => Math.round(n * 100) / 100;

export function calculatePaycheck(input: PaycheckInput): PaycheckResult {
  const periodsPerYear = PERIODS_PER_YEAR[input.payFrequency];
  const weeklyGross =
    input.hourlyRate * input.regularHoursPerWeek +
    input.hourlyRate * input.overtimeMultiplier * input.overtimeHoursPerWeek;
  const grossAnnual = weeklyGross * 52;

  const benefits = Math.min(grossAnnual, Math.max(0, input.preTaxBenefitsAnnual ?? 0));
  const retirement = Math.min(grossAnnual - benefits, Math.max(0, input.preTaxRetirementAnnual ?? 0));
  const ficaWages = grossAnnual - benefits;
  const taxableWages = ficaWages - retirement;

  const lines: { key: string; label: string; annual: number }[] = [];
  if (retirement > 0) {
    lines.push({ key: 'retirement', label: '401(k) / retirement (pre-tax)', annual: retirement });
  }
  if (benefits > 0) {
    lines.push({ key: 'benefits', label: 'Health & Section 125 benefits (pre-tax)', annual: benefits });
  }
  lines.push(
    { key: 'federal', label: 'Federal income tax', annual: federalIncomeTax(taxableWages, input.filingStatus) },
    {
      key: 'social-security',
      label: 'Social Security (6.2%)',
      annual: Math.min(ficaWages, SOCIAL_SECURITY_WAGE_BASE) * SOCIAL_SECURITY_RATE,
    },
    {
      key: 'medicare',
      label: 'Medicare (1.45%)',
      annual:
        ficaWages * MEDICARE_RATE +
        Math.max(0, ficaWages - ADDITIONAL_MEDICARE_THRESHOLD) * ADDITIONAL_MEDICARE_RATE,
    },
  );

  switch (input.state) {
    case 'CA':
      lines.push(
        {
          key: 'state',
          label: 'California income tax',
          annual: californiaIncomeTax(taxableWages, input.filingStatus, input.stateAllowances),
        },
        { key: 'sdi', label: 'CA SDI (1.3%)', annual: ficaWages * CA_SDI_RATE },
      );
      break;
    case 'NY':
      lines.push({
        key: 'state',
        label: 'New York State income tax',
        annual: newYorkStateIncomeTax(taxableWages, input.filingStatus, input.stateAllowances),
      });
      if (input.nycResident) {
        lines.push({
          key: 'local',
          label: 'New York City income tax',
          annual: newYorkCityIncomeTax(taxableWages, input.filingStatus, input.stateAllowances),
        });
      }
      lines.push(
        {
          key: 'pfl',
          label: 'NY Paid Family Leave (0.432%)',
          annual: Math.min(ficaWages * NY_PFL_RATE, NY_PFL_ANNUAL_CAP),
        },
        {
          key: 'sdi',
          label: 'NY Disability (SDI)',
          annual: Math.min(ficaWages * NY_SDI_RATE, NY_SDI_WEEKLY_CAP * 52),
        },
      );
      break;
    case 'IL':
      lines.push({
        key: 'state',
        label: 'Illinois income tax (4.95%)',
        annual: illinoisIncomeTax(taxableWages, input.stateAllowances),
      });
      break;
    case 'WA':
      lines.push(
        {
          key: 'pfl',
          label: 'WA Paid Family & Medical Leave (0.57%)',
          annual: Math.min(ficaWages, SOCIAL_SECURITY_WAGE_BASE) * WA_PFML_EMPLOYEE_RATE,
        },
        {
          key: 'sdi',
          label: 'WA Cares Fund (0.58%)',
          annual: ficaWages * WA_CARES_RATE,
        },
      );
      break;
    case 'PA':
      lines.push(
        {
          key: 'state',
          label: 'Pennsylvania income tax (3.07%)',
          annual: taxableWages * PA_INCOME_TAX_RATE,
        },
        {
          key: 'sdi',
          label: 'PA Unemployment Employee Tax (0.07%)',
          annual: ficaWages * PA_UC_EMPLOYEE_RATE,
        },
      );
      break;
    case 'NC':
      lines.push({
        key: 'state',
        label: 'North Carolina income tax (4.25%)',
        annual: northCarolinaIncomeTax(taxableWages, input.filingStatus, input.stateAllowances),
      });
      break;
    case 'GA':
      lines.push({
        key: 'state',
        label: 'Georgia income tax (5.19%)',
        annual: georgiaIncomeTax(taxableWages, input.filingStatus, input.stateAllowances),
      });
      break;
    case 'MI':
      lines.push({
        key: 'state',
        label: 'Michigan income tax (4.25%)',
        annual: michiganIncomeTax(taxableWages, input.stateAllowances),
      });
      break;
    case 'IN':
      lines.push({
        key: 'state',
        label: 'Indiana state income tax (2.95%)',
        annual: indianaIncomeTax(taxableWages, input.stateAllowances),
      });
      break;
    case 'AZ':
      lines.push({
        key: 'state',
        label: 'Arizona income tax (2.50%)',
        annual: arizonaIncomeTax(taxableWages, input.filingStatus, input.stateAllowances),
      });
      break;
    case 'CO':
      lines.push(
        {
          key: 'state',
          label: 'Colorado income tax (4.40%)',
          annual: coloradoIncomeTax(taxableWages, input.filingStatus, input.stateAllowances),
        },
        {
          key: 'pfl',
          label: 'CO FAMLI Paid Leave (0.45%)',
          annual: Math.min(ficaWages, SOCIAL_SECURITY_WAGE_BASE) * CO_FAMLI_RATE,
        },
      );
      break;
    case 'TX':
    case 'FL':
    case 'TN':
    case 'NV':
    case 'none':
      // No state income tax and no employee-paid state payroll taxes
      break;
    case 'other': {
      const rate = input.customStateRate ?? 0;
      if (rate > 0) {
        lines.push({
          key: 'state',
          label: `State income tax (${+(rate * 100).toFixed(2)}%)`,
          annual: taxableWages * rate,
        });
      }
      break;
    }
  }

  if (input.otherDeductionsPerPeriod && input.otherDeductionsPerPeriod > 0) {
    lines.push({
      key: 'other',
      label: 'Other deductions',
      annual: input.otherDeductionsPerPeriod * periodsPerYear,
    });
  }

  const deductions = lines.map((l) => ({
    ...l,
    annual: round2(l.annual),
    perPeriod: round2(l.annual / periodsPerYear),
  }));
  const totalDeductionsAnnual = round2(deductions.reduce((sum, l) => sum + l.annual, 0));
  const netAnnual = round2(grossAnnual - totalDeductionsAnnual);
  const hoursPerYear = (input.regularHoursPerWeek + input.overtimeHoursPerWeek) * 52;

  return {
    periodsPerYear,
    grossAnnual: round2(grossAnnual),
    grossPerPeriod: round2(grossAnnual / periodsPerYear),
    deductions,
    totalDeductionsAnnual,
    netAnnual,
    netPerPeriod: round2(netAnnual / periodsPerYear),
    netPerHour: hoursPerYear > 0 ? round2(netAnnual / hoursPerYear) : 0,
    effectiveRate: grossAnnual > 0 ? totalDeductionsAnnual / grossAnnual : 0,
  };
}

export const __test = {
  federalIncomeTax,
  californiaIncomeTax,
  newYorkStateIncomeTax,
  newYorkCityIncomeTax,
  illinoisIncomeTax,
  northCarolinaIncomeTax,
  georgiaIncomeTax,
  michiganIncomeTax,
  indianaIncomeTax,
  arizonaIncomeTax,
  coloradoIncomeTax,
};
