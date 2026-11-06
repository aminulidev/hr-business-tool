// ---------------------------------------------------------------------------
// Shared primary sources (Roadmap v2, Phase 13.2).
//
// Each SEO file picks the entries its numbers actually come from:
//   import { SRC } from './sources';
//   sources: [SRC.irsPub15T, SRC.ssaCola],
// Keep links to the specific publication, not an agency home page. When a
// figure changes (new tax year), update the label here once.
// ---------------------------------------------------------------------------
import type { SeoSource } from './types';

const IRS = 'Internal Revenue Service';
const SSA = 'Social Security Administration';
const DOL = 'U.S. Department of Labor, Wage and Hour Division';
const ECFR = 'Electronic Code of Federal Regulations';
const OPM = 'U.S. Office of Personnel Management';
const BLS = 'U.S. Bureau of Labor Statistics';

export const SRC = {
  // ---- Federal income tax & withholding ----
  irsPub15T: {
    label: 'IRS Publication 15-T, Federal Income Tax Withholding Methods',
    url: 'https://www.irs.gov/publications/p15t',
    publisher: IRS,
    note: 'Percentage-method withholding tables used for federal income tax per paycheck',
  },
  irsPub15: {
    label: "IRS Publication 15 (Circular E), Employer's Tax Guide",
    url: 'https://www.irs.gov/publications/p15',
    publisher: IRS,
    note: 'FICA rates, supplemental-wage (bonus) withholding and employer deposit rules',
  },
  irsRevProc2025_32: {
    label: 'IRS Rev. Proc. 2025-32, 2026 inflation adjustments',
    url: 'https://www.irs.gov/pub/irs-drop/rp-25-32.pdf',
    publisher: IRS,
    note: '2026 federal tax brackets and standard deduction amounts',
  },
  irsBrackets: {
    label: 'IRS, Federal income tax rates and brackets',
    url: 'https://www.irs.gov/filing/federal-income-tax-rates-and-brackets',
    publisher: IRS,
    note: 'Marginal rates by filing status',
  },
  irsTopic751: {
    label: 'IRS Tax Topic 751, Social Security and Medicare withholding rates',
    url: 'https://www.irs.gov/taxtopics/tc751',
    publisher: IRS,
    note: '6.2% Social Security and 1.45% Medicare employee rates',
  },
  irsTopic560: {
    label: 'IRS Tax Topic 560, Additional Medicare Tax',
    url: 'https://www.irs.gov/taxtopics/tc560',
    publisher: IRS,
    note: '0.9% Additional Medicare Tax above the $200,000 / $250,000 thresholds',
  },
  irsTopic503: {
    label: 'IRS Tax Topic 503, Deductible taxes',
    url: 'https://www.irs.gov/taxtopics/tc503',
    publisher: IRS,
    note: 'Federal deductibility of state and local property taxes (SALT cap)',
  },
  irsTopic759: {
    label: 'IRS Tax Topic 759, Form 940 - Federal Unemployment Tax (FUTA)',
    url: 'https://www.irs.gov/taxtopics/tc759',
    publisher: IRS,
    note: '6.0% FUTA rate on the first $7,000 of wages and the 5.4% state credit',
  },
  irsW2Instructions: {
    label: 'IRS General Instructions for Forms W-2 and W-3',
    url: 'https://www.irs.gov/instructions/iw2w3',
    publisher: IRS,
    note: 'What each W-2 box reports',
  },
  // ---- Self-employment / contractors ----
  irsSelfEmploymentTax: {
    label: 'IRS, Self-Employment Tax (Social Security and Medicare Taxes)',
    url: 'https://www.irs.gov/businesses/small-businesses-self-employed/self-employment-tax-social-security-and-medicare-taxes',
    publisher: IRS,
    note: '15.3% combined rate, 92.35% net-earnings factor and the deductible half',
  },
  irsScheduleSE: {
    label: 'IRS Instructions for Schedule SE (Form 1040)',
    url: 'https://www.irs.gov/instructions/i1040sse',
    publisher: IRS,
    note: 'Line-by-line self-employment tax computation',
  },
  irsContractorVsEmployee: {
    label: 'IRS, Independent Contractor (Self-Employed) or Employee?',
    url: 'https://www.irs.gov/businesses/small-businesses-self-employed/independent-contractor-self-employed-or-employee',
    publisher: IRS,
    note: 'Common-law tests for worker classification',
  },
  irsForm1099Nec: {
    label: 'IRS, About Form 1099-NEC, Nonemployee Compensation',
    url: 'https://www.irs.gov/forms-pubs/about-form-1099-nec',
    publisher: IRS,
    note: 'Reporting threshold and filing requirements for contractor payments',
  },
  irsAleFte: {
    label: 'IRS, Determining if an Employer is an Applicable Large Employer',
    url: 'https://www.irs.gov/affordable-care-act/employers/determining-if-an-employer-is-an-applicable-large-employer',
    publisher: IRS,
    note: 'Full-time equivalent (FTE) definition: 30 hours/week, 130 hours/month',
  },
  // ---- Business / accounting ----
  irsPub946: {
    label: 'IRS Publication 946, How To Depreciate Property',
    url: 'https://www.irs.gov/publications/p946',
    publisher: IRS,
    note: 'MACRS recovery periods, Section 179 limits and bonus depreciation',
  },
  irsPub334: {
    label: 'IRS Publication 334, Tax Guide for Small Business - Chapter 6, Cost of Goods Sold',
    url: 'https://www.irs.gov/publications/p334',
    publisher: IRS,
    note: 'Beginning inventory + purchases - ending inventory',
  },
  irsPub538: {
    label: 'IRS Publication 538, Accounting Periods and Methods',
    url: 'https://www.irs.gov/publications/p538',
    publisher: IRS,
    note: 'Permitted inventory valuation methods (FIFO, LIFO, specific identification)',
  },
  secNonGaap: {
    label: 'SEC Compliance & Disclosure Interpretations, Non-GAAP Financial Measures',
    url: 'https://www.sec.gov/rules-regulations/staff-guidance/compliance-disclosure-interpretations/non-gaap-financial-measures',
    publisher: 'U.S. Securities and Exchange Commission',
    note: 'EBITDA is a non-GAAP measure and must be reconciled to net income',
  },
  // ---- Social Security ----
  ssaCola: {
    label: 'SSA, Cost-of-Living Adjustment (COLA) Information for 2026',
    url: 'https://www.ssa.gov/cola/',
    publisher: SSA,
    note: '2026 Social Security taxable maximum (wage base)',
  },
  ssaWageBase: {
    label: 'SSA, Contribution and Benefit Base',
    url: 'https://www.ssa.gov/oact/cola/cbb.html',
    publisher: SSA,
    note: 'Historical and current taxable-maximum table',
  },
  ssaBendPoints: {
    label: 'SSA, Primary Insurance Amount bend points',
    url: 'https://www.ssa.gov/oact/cola/bendpoints.html',
    publisher: SSA,
    note: '90% / 32% / 15% PIA formula bend points by year',
  },
  ssaRetirementPlanner: {
    label: 'SSA, Retirement Benefits Planner',
    url: 'https://www.ssa.gov/benefits/retirement/planner/',
    publisher: SSA,
    note: 'Full retirement age, early-claiming reductions and delayed-retirement credits',
  },
  // ---- Department of Labor / FLSA ----
  dolOvertime: {
    label: 'DOL, Overtime Pay (Fair Labor Standards Act)',
    url: 'https://www.dol.gov/agencies/whd/overtime',
    publisher: DOL,
    note: 'Time-and-a-half after 40 hours in a workweek for non-exempt employees',
  },
  dolFactSheet23: {
    label: 'DOL Fact Sheet #23, Overtime Pay Requirements of the FLSA',
    url: 'https://www.dol.gov/agencies/whd/fact-sheets/23-flsa-overtime',
    publisher: DOL,
    note: 'Regular-rate computation and what counts toward it',
  },
  dolFactSheet21: {
    label: 'DOL Fact Sheet #21, Recordkeeping Requirements under the FLSA',
    url: 'https://www.dol.gov/agencies/whd/fact-sheets/21-flsa-recordkeeping',
    publisher: DOL,
    note: 'Hours-worked records employers must keep',
  },
  dolFactSheet20: {
    label: 'DOL Fact Sheet #20, Employees Paid Commissions by Retail Establishments',
    url: 'https://www.dol.gov/agencies/whd/fact-sheets/20-flsa-commissions',
    publisher: DOL,
    note: 'Section 7(i) overtime exemption for commissioned retail employees',
  },
  dolStateMinWage: {
    label: 'DOL, State Minimum Wage Laws',
    url: 'https://www.dol.gov/agencies/whd/minimum-wage/state',
    publisher: DOL,
    note: 'Current minimum wage in every state and the federal $7.25 floor',
  },
  dolMinWage: {
    label: 'DOL, Minimum Wage',
    url: 'https://www.dol.gov/agencies/whd/minimum-wage',
    publisher: DOL,
    note: 'Federal minimum wage of $7.25 per hour',
  },
  dolHolidays: {
    label: 'DOL, Holidays (Work Hours)',
    url: 'https://www.dol.gov/general/topic/workhours/holidays',
    publisher: DOL,
    note: 'The FLSA does not require premium pay for holidays; it is an employer policy',
  },
  dolNightWork: {
    label: 'DOL, Night Work and Shift Work',
    url: 'https://www.dol.gov/general/topic/workhours/nightwork',
    publisher: DOL,
    note: 'Shift differentials are a matter of agreement, not federal law',
  },
  dolHazardPay: {
    label: 'DOL, Hazard Pay',
    url: 'https://www.dol.gov/general/topic/wages/hazardpay',
    publisher: DOL,
    note: 'Hazard pay is not required by the FLSA but counts toward the regular rate',
  },
  dolSeverance: {
    label: 'DOL, Severance Pay',
    url: 'https://www.dol.gov/general/topic/wages/severancepay',
    publisher: DOL,
    note: 'Severance is not required by the FLSA; it depends on agreement or policy',
  },
  dolWarn: {
    label: 'DOL, Worker Adjustment and Retraining Notification (WARN) Act',
    url: 'https://www.dol.gov/agencies/eta/layoffs/warn',
    publisher: 'U.S. Department of Labor, Employment and Training Administration',
    note: '60-day notice rule for mass layoffs at employers with 100+ employees',
  },
  dolBreaks: {
    label: 'DOL, Breaks and Meal Periods',
    url: 'https://www.dol.gov/general/topic/workhours/breaks',
    publisher: DOL,
    note: 'Short rest breaks (5-20 minutes) are paid; bona fide meal periods (30+ minutes) are not',
  },
  dolStateMealBreaks: {
    label: 'DOL, Minimum Length of Meal Period Required under State Law',
    url: 'https://www.dol.gov/agencies/whd/state/meal-breaks',
    publisher: DOL,
    note: 'State-by-state meal period requirements',
  },
  dolVacation: {
    label: 'DOL, Vacation Leave',
    url: 'https://www.dol.gov/general/topic/workhours/vacation_leave',
    publisher: DOL,
    note: 'Paid vacation is not required by the FLSA',
  },
  dolSickLeave: {
    label: 'DOL, Sick Leave',
    url: 'https://www.dol.gov/general/topic/workhours/sickleave',
    publisher: DOL,
    note: 'Paid sick leave is governed by state and local law, not the FLSA',
  },
  dolMisclassification: {
    label: 'DOL, Misclassification of Employees as Independent Contractors',
    url: 'https://www.dol.gov/agencies/whd/flsa/misclassification',
    publisher: DOL,
    note: 'Economic-reality test under the FLSA',
  },
  dolOwcp: {
    label: "DOL, Office of Workers' Compensation Programs",
    url: 'https://www.dol.gov/agencies/owcp',
    publisher: 'U.S. Department of Labor',
    note: "Federal workers' compensation programs; state programs set private-sector rates",
  },
  cfr778: {
    label: '29 CFR Part 778, Overtime Compensation',
    url: 'https://www.ecfr.gov/current/title-29/subtitle-B/chapter-V/subchapter-A/part-778',
    publisher: ECFR,
    note: 'Regular rate of pay, including bonuses, commissions and shift differentials',
  },
  cfr778_117: {
    label: '29 CFR 778.117, Commission payments - general',
    url: 'https://www.ecfr.gov/current/title-29/section-778.117',
    publisher: ECFR,
    note: 'Commissions must be included in the regular rate for overtime',
  },
  cfr785_48: {
    label: '29 CFR 785.48, Use of time clocks',
    url: 'https://www.ecfr.gov/current/title-29/section-785.48',
    publisher: ECFR,
    note: 'Rounding to the nearest 5, 6 or 15 minutes is permitted if neutral over time',
  },
  cfr785_18: {
    label: '29 CFR 785.18, Rest periods',
    url: 'https://www.ecfr.gov/current/title-29/section-785.18',
    publisher: ECFR,
    note: 'Rest periods of 5 to 20 minutes are compensable hours worked',
  },
  // ---- Other federal ----
  opmFederalHolidays: {
    label: 'OPM, Federal Holidays',
    url: 'https://www.opm.gov/policy-data-oversight/pay-leave/federal-holidays/',
    publisher: OPM,
    note: 'Official list of the 11 federal holidays by year',
  },
  opm2087: {
    label: 'OPM, Computing Hourly Rates of Pay Using the 2,087-Hour Divisor',
    url: 'https://www.opm.gov/policy-data-oversight/pay-leave/pay-administration/fact-sheets/computing-hourly-rates-of-pay-using-the-2087-hour-divisor/',
    publisher: OPM,
    note: 'Why 2,080 (52 x 40) and 2,087 are both used to annualise an hourly wage',
  },
  blsEci: {
    label: 'BLS, Employment Cost Index',
    url: 'https://www.bls.gov/eci/',
    publisher: BLS,
    note: 'Quarterly wage and salary growth used for "average raise" benchmarks',
  },
  blsJolts: {
    label: 'BLS, Job Openings and Labor Turnover Survey (JOLTS)',
    url: 'https://www.bls.gov/jlt/',
    publisher: BLS,
    note: 'Monthly hires, quits and separations rates by industry',
  },
  blsEcec: {
    label: 'BLS, Employer Costs for Employee Compensation',
    url: 'https://www.bls.gov/ecec/',
    publisher: BLS,
    note: 'Benefits as a share of total compensation by industry',
  },
  // ---- Non-government reference data ----
  taxFoundationStateIncome: {
    label: 'Tax Foundation, State Individual Income Tax Rates and Brackets',
    url: 'https://taxfoundation.org/data/all/state/state-income-tax-rates/',
    publisher: 'Tax Foundation',
    note: 'Side-by-side state income tax rates for the current year',
  },
  taxFoundationSalesTax: {
    label: 'Tax Foundation, State and Local Sales Tax Rates',
    url: 'https://taxfoundation.org/data/all/state/sales-tax-rates/',
    publisher: 'Tax Foundation',
    note: 'Combined state and average local sales tax rates',
  },
  taxFoundationPropertyTax: {
    label: 'Tax Foundation, Property Taxes by State and County',
    url: 'https://taxfoundation.org/data/all/state/property-taxes-by-state-county/',
    publisher: 'Tax Foundation',
    note: 'Median effective property tax rates by state',
  },
  ftaStateAgencies: {
    label: 'Federation of Tax Administrators, State Tax Agencies',
    url: 'https://taxadmin.org/state-tax-agencies/',
    publisher: 'Federation of Tax Administrators',
    note: 'Directory of every state revenue department',
  },
  ncci: {
    label: 'NCCI, National Council on Compensation Insurance',
    url: 'https://www.ncci.com/',
    publisher: 'NCCI',
    note: "Workers' compensation class codes and rating methodology used in most states",
  },
  upworkFees: {
    label: 'Upwork Help Center, Freelancer Service Fees',
    url: 'https://support.upwork.com/hc/en-us/articles/211062538-Freelancer-Service-Fees',
    publisher: 'Upwork',
    note: 'Current freelancer service fee percentage',
  },
} satisfies Record<string, SeoSource>;

export type SourceKey = keyof typeof SRC;

/** The federal set every paycheck calculator relies on */
export const FEDERAL_PAYCHECK_SOURCES: SeoSource[] = [
  SRC.irsPub15T,
  SRC.irsRevProc2025_32,
  SRC.irsTopic751,
  SRC.ssaCola,
  SRC.dolOvertime,
];
