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
// - Utah: 4.55% flat state tax with UT taxpayer tax credit phaseout (Publication 14)
// - Kentucky: 4.00% flat state tax after $3,270 standard deduction
// - Louisiana: 3.00% flat state tax after $12,500 Single / $25,000 Married standard deduction
// - Iowa: 3.80% flat state tax after standard deduction & $40 per IA W-4 allowance credit
// - Idaho: 5.695% flat state tax after standard deduction
// - Ohio: 0% up to $26,050, 2.75% up to $100k, 3.50% over $100k after $2,400/exemption
// - Virginia: 2%–5.75% progressive brackets after $8,500/$17,000 standard deduction & $930/exemption
// - New Jersey: 1.4%–10.75% progressive schedules + 0.515% NJ SUI/SDI/FLI employee payroll deductions
// - Massachusetts: 5.00% flat tax after M-4 exemption (+4% over $1M) + 0.46% MA PFML
// - Maryland: 2%–5.75% state brackets + 3.05% avg county local tax after standard deduction & $3,200/exemption
// - Minnesota: 5.35%–9.85% progressive brackets + 0.44% MN Paid Leave employee share
// - Missouri: 2%–4.70% progressive brackets after federal standard deduction
// - Wisconsin: 3.50%–7.65% progressive brackets after sliding standard deduction & $700/exemption
// - Oregon: 4.75%–9.90% brackets after federal tax subtraction & standard deduction + 0.60% Paid Leave OR + 0.10% Transit
// - South Carolina: 0%, 3%, 6.0% progressive brackets after standard deduction & $4,700/allowance
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
  | 'CO'
  | 'UT'
  | 'KY'
  | 'LA'
  | 'IA'
  | 'ID'
  | 'OH'
  | 'VA'
  | 'NJ'
  | 'MA'
  | 'MD'
  | 'MN'
  | 'MO'
  | 'WI'
  | 'OR'
  | 'SC';

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
// Phase 3 State Withholding Engines (WA, PA, NC, GA, MI, IN, AZ, CO)
// ---------------------------------------------------------------------------

// Washington: 0% income tax, WA PFML employee share ~0.5714% (up to SS cap), WA Cares 0.58%
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
// Phase 9 State Withholding Engines (UT, KY, LA, IA, ID, OH, VA, NJ, MA, MD, MN, MO, WI, OR, SC)
// ---------------------------------------------------------------------------

// Utah: 4.55% flat tax with Utah Publication 14 withholding credit phaseout (1.3% phaseout above threshold)
export const UT_RATE = 0.0455;
function utahIncomeTax(annualWages: number, status: FilingStatus): number {
  const baseTax = Math.max(0, annualWages) * UT_RATE;
  const baseAllowance = status === 'married' ? 892 : 446;
  const phaseoutThreshold = status === 'married' ? 36556 : 18278;
  const reduction = Math.max(0, (annualWages - phaseoutThreshold) * 0.013);
  const credit = Math.max(0, baseAllowance - reduction);
  return Math.max(0, baseTax - credit);
}

// Kentucky: 4.00% flat tax in 2026 after $3,270 Kentucky standard deduction
export const KY_RATE = 0.04;
export const KY_STD_DEDUCTION = 3270;
function kentuckyIncomeTax(annualWages: number): number {
  return Math.max(0, annualWages - KY_STD_DEDUCTION) * KY_RATE;
}

// Louisiana: 3.00% flat tax reform (Act 11) after $12,500 Single/HOH and $25,000 Married standard deduction
export const LA_RATE = 0.03;
export const LA_STD_DEDUCTION: Record<FilingStatus, number> = {
  single: 12500,
  married: 25000,
  hoh: 12500,
};
function louisianaIncomeTax(annualWages: number, status: FilingStatus): number {
  return Math.max(0, annualWages - LA_STD_DEDUCTION[status]) * LA_RATE;
}

// Iowa: 3.80% flat state income tax after standard deduction & $40 per IA W-4 allowance credit
export const IA_RATE = 0.038;
export const IA_ALLOWANCE_CREDIT = 40;
function iowaIncomeTax(annualWages: number, status: FilingStatus, allowances: number): number {
  const taxable = Math.max(0, annualWages - FEDERAL_STANDARD_DEDUCTION[status]);
  return Math.max(0, taxable * IA_RATE - allowances * IA_ALLOWANCE_CREDIT);
}

// Idaho: 5.695% flat state income tax above standard deduction & $3,600 per ID W-4 child allowance
export const ID_RATE = 0.05695;
function idahoIncomeTax(annualWages: number, status: FilingStatus, allowances: number): number {
  const taxable = Math.max(0, annualWages - FEDERAL_STANDARD_DEDUCTION[status] - allowances * 3600);
  return taxable * ID_RATE;
}

// Ohio: 0% up to $26,050, 2.75% up to $100,000, 3.50% over $100,000 after $2,400 per OH IT 4 exemption
const OH_SCHEDULE = scheduleFromBrackets([26050, 100000], [0, 0.0275, 0.035]);
function ohioIncomeTax(annualWages: number, exemptions: number): number {
  const taxable = Math.max(0, annualWages - exemptions * 2400);
  return taxFromSchedule(taxable, OH_SCHEDULE);
}

// Virginia: 2% up to $3,000, 3% $3,000–$5,000, 5% $5,000–$17,000, 5.75% over $17,000 after $8,500/$17,000 std deduction & $930/exemption
const VA_SCHEDULE = scheduleFromBrackets([3000, 5000, 17000], [0.02, 0.03, 0.05, 0.0575]);
function virginiaIncomeTax(annualWages: number, status: FilingStatus, exemptions: number): number {
  const stdDed = status === 'married' ? 17000 : 8500;
  const taxable = Math.max(0, annualWages - stdDed - exemptions * 930);
  return taxFromSchedule(taxable, VA_SCHEDULE);
}

// New Jersey: Progressive brackets after $1,000 per NJ-W4 allowance + NJ SUI/SDI/FLI employee payroll taxes
const NJ_SCHEDULES: Record<'single' | 'married', ScheduleRow[]> = {
  single: scheduleFromBrackets(
    [20000, 35000, 40000, 75000, 500000, 1000000],
    [0.014, 0.0175, 0.035, 0.05525, 0.0637, 0.0897, 0.1075]
  ),
  married: scheduleFromBrackets(
    [20000, 50000, 70000, 80000, 150000, 500000, 1000000],
    [0.014, 0.0175, 0.0245, 0.035, 0.05525, 0.0637, 0.0897, 0.1075]
  ),
};
export const NJ_SUI_FLI_RATE = 0.00515; // 0.425% SUI/WF + 0.09% FLI employee withholding
export const NJ_WAGE_CAP = 168600;
function newJerseyIncomeTax(annualWages: number, status: FilingStatus, allowances: number): number {
  const s = status === 'married' || status === 'hoh' ? 'married' : 'single';
  const taxable = Math.max(0, annualWages - allowances * 1000);
  return taxFromSchedule(taxable, NJ_SCHEDULES[s]);
}

// Massachusetts: 5.00% flat income tax after M-4 exemption ($4,400 Single, $8,800 Married, $6,800 HOH + $1,000/allowance) + 4% over $1M + 0.46% MA PFML
export const MA_RATE = 0.05;
export const MA_PFML_EMPLOYEE_RATE = 0.0046;
function massachusettsIncomeTax(annualWages: number, status: FilingStatus, exemptions: number): number {
  const baseExemption = status === 'married' ? 8800 : status === 'hoh' ? 6800 : 4400;
  const extraExemptions = Math.max(0, exemptions - 1) * 1000;
  const taxable = Math.max(0, annualWages - baseExemption - extraExemptions);
  const surtax = Math.max(0, taxable - 1000000) * 0.04;
  return taxable * MA_RATE + surtax;
}

// Maryland: State brackets (2%–5.75%) + 3.05% avg county local tax after $2,550/$5,150 std deduction & $3,200/exemption
const MD_SCHEDULES: Record<'single' | 'married', ScheduleRow[]> = {
  single: scheduleFromBrackets(
    [1000, 2000, 3000, 100000, 125000, 150000, 250000],
    [0.02, 0.03, 0.04, 0.0475, 0.05, 0.0525, 0.055, 0.0575]
  ),
  married: scheduleFromBrackets(
    [1000, 2000, 3000, 150000, 175000, 225000, 300000],
    [0.02, 0.03, 0.04, 0.0475, 0.05, 0.0525, 0.055, 0.0575]
  ),
};
export const MD_AVG_LOCAL_RATE = 0.0305;
function marylandTaxableIncome(annualWages: number, status: FilingStatus, exemptions: number): number {
  const stdDed = status === 'married' || status === 'hoh' ? 5150 : 2550;
  return Math.max(0, annualWages - stdDed - exemptions * 3200);
}
function marylandStateIncomeTax(annualWages: number, status: FilingStatus, exemptions: number): number {
  const s = status === 'married' || status === 'hoh' ? 'married' : 'single';
  return taxFromSchedule(marylandTaxableIncome(annualWages, status, exemptions), MD_SCHEDULES[s]);
}
function marylandLocalIncomeTax(annualWages: number, status: FilingStatus, exemptions: number): number {
  return marylandTaxableIncome(annualWages, status, exemptions) * MD_AVG_LOCAL_RATE;
}

// Minnesota: 5.35%, 6.80%, 7.85%, 9.85% brackets after standard deduction & $5,150/allowance + 0.44% MN Paid Leave
const MN_SCHEDULES: Record<FilingStatus, ScheduleRow[]> = {
  single: scheduleFromBrackets([32570, 106990, 198630], [0.0535, 0.068, 0.0785, 0.0985]),
  married: scheduleFromBrackets([47620, 189180, 330410], [0.0535, 0.068, 0.0785, 0.0985]),
  hoh: scheduleFromBrackets([40100, 161130, 264050], [0.0535, 0.068, 0.0785, 0.0985]),
};
export const MN_STD_DEDUCTION: Record<FilingStatus, number> = {
  single: 14950,
  married: 29900,
  hoh: 22500,
};
export const MN_PAID_LEAVE_RATE = 0.0044;
function minnesotaIncomeTax(annualWages: number, status: FilingStatus, allowances: number): number {
  const taxable = Math.max(0, annualWages - MN_STD_DEDUCTION[status] - allowances * 5150);
  return taxFromSchedule(taxable, MN_SCHEDULES[status]);
}

// Missouri: Progressive brackets up to 4.70% top rate in 2026 after federal standard deduction
const MO_SCHEDULE = scheduleFromBrackets(
  [1313, 2626, 3939, 5252, 6565, 7878, 9191],
  [0, 0.02, 0.025, 0.03, 0.035, 0.04, 0.045, 0.047]
);
function missouriIncomeTax(annualWages: number, status: FilingStatus): number {
  const taxable = Math.max(0, annualWages - FEDERAL_STANDARD_DEDUCTION[status]);
  return taxFromSchedule(taxable, MO_SCHEDULE);
}

// Wisconsin: 3.50%, 4.40%, 5.30%, 7.65% brackets after standard deduction & $700 per WT-4 exemption
const WI_SCHEDULES: Record<'single' | 'married', ScheduleRow[]> = {
  single: scheduleFromBrackets([14320, 28640, 315310], [0.035, 0.044, 0.053, 0.0765]),
  married: scheduleFromBrackets([19090, 38190, 420420], [0.035, 0.044, 0.053, 0.0765]),
};
function wisconsinIncomeTax(annualWages: number, status: FilingStatus, exemptions: number): number {
  const s = status === 'married' ? 'married' : 'single';
  const stdDed = status === 'married' ? 24590 : status === 'hoh' ? 17090 : 13230;
  const taxable = Math.max(0, annualWages - stdDed - exemptions * 700);
  return taxFromSchedule(taxable, WI_SCHEDULES[s]);
}

// Oregon: 4.75%, 6.75%, 8.75%, 9.90% after federal tax subtraction (up to $8,250) & std deduction + 0.60% Paid Leave OR + 0.10% Transit
const OR_SCHEDULES: Record<'single' | 'married', ScheduleRow[]> = {
  single: scheduleFromBrackets([4400, 11050, 125000], [0.0475, 0.0675, 0.0875, 0.099]),
  married: scheduleFromBrackets([8800, 22100, 250000], [0.0475, 0.0675, 0.0875, 0.099]),
};
export const OR_PAID_LEAVE_RATE = 0.006;
export const OR_TRANSIT_TAX_RATE = 0.001;
function oregonIncomeTax(annualWages: number, status: FilingStatus, allowances: number): number {
  const s = status === 'married' || status === 'hoh' ? 'married' : 'single';
  const fedSub = Math.min(8250, federalIncomeTax(annualWages, status));
  const stdDed = status === 'married' ? 5670 : status === 'hoh' ? 4560 : 2835;
  const taxable = Math.max(0, annualWages - fedSub - stdDed);
  const tax = taxFromSchedule(taxable, OR_SCHEDULES[s]);
  return Math.max(0, tax - allowances * 249);
}

// South Carolina: 0% up to $3,560, 3.0% $3,560–$17,830, 6.0% over $17,830 after standard deduction & $4,700 per SC W-4 allowance
const SC_SCHEDULE = scheduleFromBrackets([3560, 17830], [0, 0.03, 0.06]);
function southCarolinaIncomeTax(annualWages: number, status: FilingStatus, allowances: number): number {
  const taxable = Math.max(0, annualWages - FEDERAL_STANDARD_DEDUCTION[status] - allowances * 4700);
  return taxFromSchedule(taxable, SC_SCHEDULE);
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
    case 'UT':
      lines.push({
        key: 'state',
        label: 'Utah income tax (4.55%)',
        annual: utahIncomeTax(taxableWages, input.filingStatus),
      });
      break;
    case 'KY':
      lines.push({
        key: 'state',
        label: 'Kentucky income tax (4.00%)',
        annual: kentuckyIncomeTax(taxableWages),
      });
      break;
    case 'LA':
      lines.push({
        key: 'state',
        label: 'Louisiana income tax (3.00%)',
        annual: louisianaIncomeTax(taxableWages, input.filingStatus),
      });
      break;
    case 'IA':
      lines.push({
        key: 'state',
        label: 'Iowa income tax (3.80%)',
        annual: iowaIncomeTax(taxableWages, input.filingStatus, input.stateAllowances),
      });
      break;
    case 'ID':
      lines.push({
        key: 'state',
        label: 'Idaho income tax (5.695%)',
        annual: idahoIncomeTax(taxableWages, input.filingStatus, input.stateAllowances),
      });
      break;
    case 'OH':
      lines.push({
        key: 'state',
        label: 'Ohio state income tax',
        annual: ohioIncomeTax(taxableWages, input.stateAllowances),
      });
      break;
    case 'VA':
      lines.push({
        key: 'state',
        label: 'Virginia income tax',
        annual: virginiaIncomeTax(taxableWages, input.filingStatus, input.stateAllowances),
      });
      break;
    case 'NJ':
      lines.push(
        {
          key: 'state',
          label: 'New Jersey income tax',
          annual: newJerseyIncomeTax(taxableWages, input.filingStatus, input.stateAllowances),
        },
        {
          key: 'sdi',
          label: 'NJ SUI/SDI/FLI Payroll Tax (0.515%)',
          annual: Math.min(ficaWages, NJ_WAGE_CAP) * NJ_SUI_FLI_RATE,
        },
      );
      break;
    case 'MA':
      lines.push(
        {
          key: 'state',
          label: 'Massachusetts income tax (5.00%)',
          annual: massachusettsIncomeTax(taxableWages, input.filingStatus, input.stateAllowances),
        },
        {
          key: 'pfl',
          label: 'MA Paid Family & Medical Leave (0.46%)',
          annual: Math.min(ficaWages, SOCIAL_SECURITY_WAGE_BASE) * MA_PFML_EMPLOYEE_RATE,
        },
      );
      break;
    case 'MD':
      lines.push(
        {
          key: 'state',
          label: 'Maryland state income tax',
          annual: marylandStateIncomeTax(taxableWages, input.filingStatus, input.stateAllowances),
        },
        {
          key: 'local',
          label: 'MD Avg County Local Tax (3.05%)',
          annual: marylandLocalIncomeTax(taxableWages, input.filingStatus, input.stateAllowances),
        },
      );
      break;
    case 'MN':
      lines.push(
        {
          key: 'state',
          label: 'Minnesota income tax',
          annual: minnesotaIncomeTax(taxableWages, input.filingStatus, input.stateAllowances),
        },
        {
          key: 'pfl',
          label: 'MN Paid Leave (0.44%)',
          annual: Math.min(ficaWages, SOCIAL_SECURITY_WAGE_BASE) * MN_PAID_LEAVE_RATE,
        },
      );
      break;
    case 'MO':
      lines.push({
        key: 'state',
        label: 'Missouri income tax',
        annual: missouriIncomeTax(taxableWages, input.filingStatus),
      });
      break;
    case 'WI':
      lines.push({
        key: 'state',
        label: 'Wisconsin income tax',
        annual: wisconsinIncomeTax(taxableWages, input.filingStatus, input.stateAllowances),
      });
      break;
    case 'OR':
      lines.push(
        {
          key: 'state',
          label: 'Oregon income tax',
          annual: oregonIncomeTax(taxableWages, input.filingStatus, input.stateAllowances),
        },
        {
          key: 'pfl',
          label: 'Paid Leave Oregon (0.60%)',
          annual: Math.min(ficaWages, SOCIAL_SECURITY_WAGE_BASE) * OR_PAID_LEAVE_RATE,
        },
        {
          key: 'local',
          label: 'OR Statewide Transit Tax (0.10%)',
          annual: ficaWages * OR_TRANSIT_TAX_RATE,
        },
      );
      break;
    case 'SC':
      lines.push({
        key: 'state',
        label: 'South Carolina income tax',
        annual: southCarolinaIncomeTax(taxableWages, input.filingStatus, input.stateAllowances),
      });
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
  utahIncomeTax,
  kentuckyIncomeTax,
  louisianaIncomeTax,
  iowaIncomeTax,
  idahoIncomeTax,
  ohioIncomeTax,
  virginiaIncomeTax,
  newJerseyIncomeTax,
  massachusettsIncomeTax,
  marylandStateIncomeTax,
  minnesotaIncomeTax,
  missouriIncomeTax,
  wisconsinIncomeTax,
  oregonIncomeTax,
  southCarolinaIncomeTax,
};
