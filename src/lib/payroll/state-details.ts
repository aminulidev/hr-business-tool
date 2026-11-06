// ---------------------------------------------------------------------------
// Per-state facts that make each state paycheck page different from the others
// (Roadmap v2, Phase 15.3). Everything here is state-specific by construction:
// the uniqueness test in state-pages.test.ts fails if two states share a bullet.
//
// Rates that the calculator also uses are imported from the engine so the
// article can never disagree with the tool. Dollar figures that the engine does
// not model (local minimum wages, local income tax rates) are quoted from the
// source listed in STATE_PAYCHECK_PAGES[code].sources and dated 2026.
//
// medianHourlyWage = BLS Occupational Employment and Wage Statistics, May 2025,
// "All Occupations" annual median for the state ÷ 2,080 hours.
// ---------------------------------------------------------------------------
import {
  CA_SDI_RATE,
  CO_FAMLI_RATE,
  MA_PFML_EMPLOYEE_RATE,
  MN_PAID_LEAVE_RATE,
  NJ_SUI_FLI_RATE,
  NY_PFL_ANNUAL_CAP,
  NY_PFL_RATE,
  NY_SDI_WEEKLY_CAP,
  OR_PAID_LEAVE_RATE,
  OR_TRANSIT_TAX_RATE,
  PA_UC_EMPLOYEE_RATE,
  SOCIAL_SECURITY_WAGE_BASE,
  WA_CARES_RATE,
  WA_PFML_EMPLOYEE_RATE,
  type StateCode,
} from './withholding-2026';

export interface LocalMinimumWage {
  jurisdiction: string;
  /** Printed as-is, e.g. "$18.00 (51+ employees)" */
  rate: string;
  note?: string;
}

export interface PayrollProgram {
  name: string;
  /** Employee share as printed, e.g. "0.44% of wages up to $184,500" */
  rate: string;
  what: string;
}

export interface StateDetails {
  /** BLS OEWS May 2025 all-occupations median, $/hour */
  medianHourlyWage: number;
  /** Neighbouring states that also have a page; used for the engine-generated comparison */
  neighbors: StateCode[];
  /** Local minimum wages above the state floor; omit when the state pre-empts local minimums */
  localMinimumWages?: LocalMinimumWage[];
  /** One sentence used when there are no local minimum wages */
  localMinimumWageNote?: string;
  /** Employee-paid state programs withheld from the paycheck (empty = none) */
  payrollPrograms: PayrollProgram[];
  /** Local income or wage taxes withheld from employees; null = none in this state */
  localIncomeTax: { summary: string; examples?: { place: string; rate: string }[] } | null;
  /** State overtime rules beyond "1.5× after 40 hours" */
  overtimeDetail: string[];
  /** What is different on a 2026 paycheck compared with 2025 */
  changes2026: string[];
}

const pct = (rate: number, digits = 2) => `${(rate * 100).toFixed(digits)}%`;
const cap = SOCIAL_SECURITY_WAGE_BASE.toLocaleString('en-US');

export const STATE_DETAILS: Record<StateCode, StateDetails> = {
  CA: {
    medianHourlyWage: 28.0,
    neighbors: ['NV', 'AZ', 'OR'],
    localMinimumWages: [
      { jurisdiction: 'California (statewide)', rate: '$16.90' },
      { jurisdiction: 'Fast-food workers at chains with 60+ locations (statewide)', rate: '$20.00', note: 'AB 1228' },
      { jurisdiction: 'San Francisco', rate: '$19.61', note: 'from July 1, 2026' },
      { jurisdiction: 'San Jose', rate: '$18.45', note: 'from January 1, 2026' },
      { jurisdiction: 'Los Angeles (city)', rate: '$18.42', note: 'from July 1, 2026; hotel workers $25.00 with benefits' },
      { jurisdiction: 'San Diego', rate: '$17.75', note: 'from January 1, 2026' },
      { jurisdiction: 'Oakland', rate: '$17.34', note: 'from January 1, 2026' },
    ],
    payrollPrograms: [
      {
        name: 'State Disability Insurance (SDI)',
        rate: `${pct(CA_SDI_RATE, 1)} of all wages, no cap`,
        what: 'Funds disability and Paid Family Leave benefits of up to 70–90% of pay for eligible workers.',
      },
    ],
    localIncomeTax: null,
    overtimeDetail: [
      'Daily overtime: 1.5× after 8 hours in a workday and 2× after 12 hours, on top of the 40-hour weekly rule (Labor Code § 510).',
      'Seventh consecutive day in a workweek: 1.5× for the first 8 hours and 2× after that.',
      'Alternative workweek schedules (for example four 10-hour days) can be adopted by a two-thirds vote of the affected employees and suspend daily overtime up to 10 hours.',
      'Meal periods: an unpaid 30-minute meal break is due before the end of the fifth hour; missing it earns one extra hour of pay (premium pay), which is taxable wages.',
    ],
    changes2026: [
      'Statewide minimum wage rose from $16.50 to $16.90 on January 1, 2026 (CPI adjustment).',
      `SDI withholding rose from 1.2% to ${pct(CA_SDI_RATE, 1)} of all wages, with no taxable wage limit for the third year running.`,
      'EDD withholding schedules, the low-income exemption and the $168.30 per-allowance credit were indexed for 2026.',
      'Local minimums in Los Angeles and San Francisco step up each July 1, so a worker there saw a second raise mid-year.',
    ],
  },

  TX: {
    medianHourlyWage: 23.38,
    neighbors: ['LA'],
    localMinimumWageNote:
      'Texas law (Labor Code § 62.0515) stops cities and counties from setting their own minimum wage for private employers, so $7.25 applies in Houston, Dallas, Austin and San Antonio alike.',
    payrollPrograms: [],
    localIncomeTax: null,
    overtimeDetail: [
      'No state overtime statute: the federal FLSA 40-hour rule is the only one that applies.',
      'Texas Payday Law requires at least semi-monthly pay for non-exempt employees and sets the deadline for final paychecks (six days after an involuntary termination).',
    ],
    changes2026: [
      'Nothing changed on the Texas side: no state income tax, no state payroll programs, and the $7.25 minimum wage has been unchanged since 2009.',
      'The only differences on a 2026 Texas paycheck come from federal indexing: higher standard deduction, wider brackets and the $184,500 Social Security wage base.',
    ],
  },

  FL: {
    medianHourlyWage: 23.02,
    neighbors: ['GA'],
    localMinimumWageNote:
      'Florida pre-empts local minimum wage ordinances for private employers (Fla. Stat. § 218.077), so the $15.00 state rate applies in Miami, Orlando, Tampa and Jacksonville.',
    payrollPrograms: [],
    localIncomeTax: null,
    overtimeDetail: [
      'Florida has no state overtime law; the federal FLSA 40-hour rule applies.',
      'Florida has no state-mandated meal or rest breaks for adults, so unpaid lunch time only comes off your hours if your employer provides a bona fide 30-minute break.',
    ],
    changes2026: [
      'The minimum wage reached $15.00 on September 30, 2026, the last of the $1-a-year steps approved by voters in Amendment 2 (2020). It was $14.00 for the first nine months of 2026.',
      'Tipped cash wage rose to $11.98 on the same date.',
      'From September 30, 2027 the rate will be indexed to inflation each year instead of rising by a fixed dollar.',
    ],
  },

  NY: {
    medianHourlyWage: 28.69,
    neighbors: ['NJ', 'PA', 'MA'],
    localMinimumWages: [
      { jurisdiction: 'New York City, Long Island and Westchester County', rate: '$17.00' },
      { jurisdiction: 'Rest of New York State', rate: '$16.00' },
      { jurisdiction: 'Tipped food-service workers (NYC, LI, Westchester)', rate: '$11.35 cash + $5.65 tip credit' },
    ],
    payrollPrograms: [
      {
        name: 'Paid Family Leave (PFL)',
        rate: `${pct(NY_PFL_RATE, 3)} of wages, capped at $${NY_PFL_ANNUAL_CAP.toFixed(2)} a year`,
        what: 'Up to 12 weeks of job-protected leave at 67% of pay to bond with a child or care for a relative.',
      },
      {
        name: 'Disability Benefits Law (DBL) insurance',
        rate: `0.5% of wages, capped at $${NY_SDI_WEEKLY_CAP.toFixed(2)} a week`,
        what: 'Short-term disability for off-the-job injury or illness.',
      },
    ],
    localIncomeTax: {
      summary:
        'New York City residents pay a city income tax of 3.078% to 3.876%, withheld with state tax; the calculator applies it when you switch on the NYC resident option. Yonkers residents pay a surcharge of 16.75% of their state tax, and non-residents who work in Yonkers pay 0.5% of wages; neither is modelled here.',
      examples: [
        { place: 'New York City (residents)', rate: '3.078%–3.876%' },
        { place: 'Yonkers (residents)', rate: '16.75% of NY State tax' },
        { place: 'Yonkers (non-resident workers)', rate: '0.50% of wages' },
      ],
    },
    overtimeDetail: [
      '"Spread of hours" pay: if your workday spans more than 10 hours from first clock-in to last clock-out, including breaks, you are owed one extra hour at the minimum wage.',
      'Call-in pay: hospitality workers who report to work and are sent home early are owed at least three hours at the minimum wage.',
      'Residential (live-in) employees reach overtime at 44 hours instead of 40.',
    ],
    changes2026: [
      'Minimum wage rose $0.50 on January 1, 2026: $17.00 in NYC, Long Island and Westchester (from $16.50) and $16.00 upstate (from $15.50). From 2027 both rates are indexed to inflation.',
      `PFL withholding rose to ${pct(NY_PFL_RATE, 3)} of wages (from 0.388%) with a higher annual cap of $${NY_PFL_ANNUAL_CAP.toFixed(2)}.`,
      'State income tax rates for the five lowest brackets were cut by 0.1 percentage point for 2026 under the FY2026 budget, which lowers withholding slightly for most hourly workers.',
    ],
  },

  IL: {
    medianHourlyWage: 24.98,
    neighbors: ['IN', 'WI', 'MO'],
    localMinimumWages: [
      { jurisdiction: 'Illinois (statewide)', rate: '$15.00' },
      { jurisdiction: 'Chicago (employers with 4+ workers)', rate: '$17.05', note: 'from July 1, 2026; tipped cash wage $12.96' },
      { jurisdiction: 'Suburban Cook County (non-opt-out municipalities)', rate: '$15.40', note: 'from July 1, 2026' },
    ],
    payrollPrograms: [],
    localIncomeTax: null,
    overtimeDetail: [
      'The Illinois Minimum Wage Law mirrors the federal rule: 1.5× after 40 hours, no daily overtime.',
      'One Day Rest in Seven Act: employees must get 24 consecutive hours off every calendar week and a 20-minute meal break for a shift of 7.5 hours or more (unpaid, so it comes off your hours).',
      'Chicago\'s Paid Leave and Paid Sick Leave ordinance gives up to 40 hours of each per year, accrued at one hour per 35 worked.',
    ],
    changes2026: [
      'The IL-W-4 allowance amount rose from $2,850 to $2,925, so each allowance now shields $2,925 of wages from the 4.95% tax.',
      'The statewide minimum wage stayed at $15.00 — the schedule from the 2019 law ended in 2025 and Illinois does not index it.',
      'Chicago\'s minimum wage rose to $17.05 on July 1, 2026 and the tipped cash wage continued its phase-out toward the full minimum (reached in 2028).',
    ],
  },

  WA: {
    medianHourlyWage: 30.28,
    neighbors: ['OR', 'ID'],
    localMinimumWages: [
      { jurisdiction: 'Washington (statewide)', rate: '$17.13' },
      { jurisdiction: 'Tukwila', rate: '$21.65', note: '15+ employees or $2M+ Tukwila revenue' },
      { jurisdiction: 'Renton', rate: '$21.57', note: '500+ employees; $20.57 then $21.57 from July 1 for 15–500 employees' },
      { jurisdiction: 'Seattle', rate: '$21.30', note: 'all employers' },
      { jurisdiction: 'SeaTac', rate: '$20.74', note: 'hospitality and transportation employers only' },
    ],
    payrollPrograms: [
      {
        name: 'Paid Family & Medical Leave (PFML)',
        rate: `${pct(WA_PFML_EMPLOYEE_RATE, 4)} of wages up to $${cap} (71.43% of the 1.13% premium)`,
        what: 'Up to 12–16 weeks of paid leave for your own serious health condition, a new child or a family member\'s illness.',
      },
      {
        name: 'WA Cares Fund',
        rate: `${pct(WA_CARES_RATE, 2)} of all wages, no cap`,
        what: 'Long-term care insurance benefit of up to $36,500 (indexed); workers with an approved private-insurance exemption do not pay it.',
      },
    ],
    localIncomeTax: null,
    overtimeDetail: [
      'Washington has no daily overtime for most workers; agricultural workers gained the 40-hour overtime threshold in 2024.',
      'Rest breaks of 10 paid minutes for every 4 hours worked and a 30-minute meal break for shifts over 5 hours are required by L&I rules (WAC 296-126-092).',
      'The salary threshold for the overtime exemption is 2.25× the minimum wage — $80,168 in 2026 — so many salaried supervisors are owed overtime.',
    ],
    changes2026: [
      'Minimum wage rose from $16.66 to $17.13 on January 1, 2026 (CPI-W), still the highest statewide rate in the country.',
      'The PFML premium jumped from 0.92% to 1.13% of wages, the largest increase since the program began; the employee share of a $25/hour paycheck went up by about $4 a month.',
      'Seattle moved to a single $21.30 rate for every employer size, ending the two-tier system.',
    ],
  },

  TN: {
    medianHourlyWage: 22.78,
    neighbors: ['KY', 'GA', 'NC'],
    localMinimumWageNote:
      'Tennessee has no minimum wage law of its own and bars local governments from setting one (Tenn. Code § 50-2-112), so the federal $7.25 applies in Nashville, Memphis and Knoxville.',
    payrollPrograms: [],
    localIncomeTax: null,
    overtimeDetail: [
      'No state overtime law; the federal FLSA 40-hour rule applies.',
      'Tennessee does require a 30-minute unpaid meal break for shifts of six consecutive hours or more (Tenn. Code § 50-2-103), which is deducted from hours worked.',
    ],
    changes2026: [
      'No state-level changes: Tennessee has had no wage tax since the Hall tax on investment income ended in 2021, and the $7.25 minimum wage is unchanged.',
      'A 2026 Tennessee paycheck differs from 2025 only through federal indexing of brackets, the standard deduction and the Social Security wage base.',
    ],
  },

  NV: {
    medianHourlyWage: 22.91,
    neighbors: ['CA', 'AZ', 'UT'],
    localMinimumWageNote:
      'Nevada\'s minimum wage is set by the state constitution (Article 15, § 16) and no city or county has a separate rate, so $12.00 applies in Las Vegas, Henderson and Reno.',
    payrollPrograms: [],
    localIncomeTax: null,
    overtimeDetail: [
      'Daily overtime for lower-paid workers: if you earn less than 1.5× the minimum wage ($18.00 an hour), you get 1.5× for hours over 8 in any rolling 24-hour period, not just over 40 in a week (NRS 608.018).',
      'Employees earning $18.00 or more only get weekly overtime after 40 hours.',
      'Nevada law requires a paid 10-minute rest break per 4 hours and a 30-minute unpaid meal break for a continuous 8-hour shift.',
    ],
    changes2026: [
      'Minimum wage stayed at $12.00 for all employers; the old $11.25 "offers health insurance" tier was abolished on July 1, 2024 and there is no further scheduled increase.',
      'Because the $12.00 rate did not move, the daily-overtime threshold stayed at $18.00 an hour in 2026.',
      'No state income tax or employee payroll programs, so the only 2026 changes are federal.',
    ],
  },

  PA: {
    medianHourlyWage: 23.89,
    neighbors: ['NJ', 'OH', 'MD'],
    localMinimumWageNote:
      'Pennsylvania\'s minimum wage has been the federal $7.25 since 2009, and state law pre-empts local rates, so Philadelphia and Pittsburgh cannot set a higher private-sector minimum.',
    payrollPrograms: [
      {
        name: 'Unemployment Compensation (UC) employee tax',
        rate: `${pct(PA_UC_EMPLOYEE_RATE, 2)} of all wages`,
        what: 'Pennsylvania is one of three states where employees pay into the unemployment fund; it shows as a small line on every pay stub.',
      },
    ],
    localIncomeTax: {
      summary:
        'Almost every Pennsylvania municipality levies an Earned Income Tax (EIT) withheld by the employer, typically 1% split between the municipality and school district, and up to about 3.7% in Philadelphia. The calculator does not include EIT because it depends on where you live and work.',
      examples: [
        { place: 'Philadelphia (residents)', rate: '≈3.74% wage tax' },
        { place: 'Philadelphia (non-resident workers)', rate: '≈3.43% wage tax' },
        { place: 'Pittsburgh (residents)', rate: '3.00% (city + school district)' },
        { place: 'Most townships and boroughs', rate: '1.00%' },
      ],
    },
    overtimeDetail: [
      'The Pennsylvania Minimum Wage Act requires 1.5× after 40 hours and, unlike the FLSA, does not allow the fluctuating-workweek method for salaried non-exempt workers.',
      'Pennsylvania requires tipped employees to earn at least $135 a month in tips before the $2.83 tip credit wage can be used.',
    ],
    changes2026: [
      'No change to the 3.07% flat income tax or the 0.07% UC employee rate; both have been unchanged since 2004 and 2018 respectively.',
      'The minimum wage remained $7.25 for a 17th year despite House-passed increases that stalled in the Senate.',
      'Philadelphia trimmed its wage tax slightly on July 1, 2026 as part of its annual schedule of small reductions.',
    ],
  },

  NC: {
    medianHourlyWage: 23.06,
    neighbors: ['VA', 'SC', 'TN'],
    localMinimumWageNote:
      'North Carolina law (G.S. 95-25.1) pre-empts local minimum wages for private employers, so the $7.25 rate applies in Charlotte, Raleigh and Durham.',
    payrollPrograms: [],
    localIncomeTax: null,
    overtimeDetail: [
      'The North Carolina Wage and Hour Act mirrors the FLSA: 1.5× after 40 hours, no daily overtime.',
      'Seasonal amusement and recreational employees reach overtime at 45 hours rather than 40.',
    ],
    changes2026: [
      'The flat income tax rate fell from 4.25% to 3.99% for 2026 under Session Law 2023-134. Employers withhold at 4.09% (the statute sets withholding 0.10 point above the tax rate), so you will normally get a small refund.',
      'The NC-4 standard deduction amounts ($12,750 single, $25,500 married, $19,125 head of household) were unchanged.',
      'Further cuts to 3.49% are scheduled from 2027 under 2026 legislation (S.B. 257).',
    ],
  },

  GA: {
    medianHourlyWage: 23.16,
    neighbors: ['FL', 'SC', 'TN'],
    localMinimumWageNote:
      'Georgia\'s own minimum wage law still says $5.15, but nearly every employer is covered by the FLSA\'s $7.25, and state law (O.C.G.A. § 34-4-3.1) bars cities such as Atlanta from setting a higher private-sector rate.',
    payrollPrograms: [],
    localIncomeTax: null,
    overtimeDetail: [
      'Georgia has no state overtime or meal-break law; the FLSA 40-hour rule is the only one that applies.',
    ],
    changes2026: [
      'House Bill 463 cut the flat income tax rate from 5.19% to 4.99%, retroactive to January 1, 2026. The Department of Revenue issued revised withholding tables in June 2026, so paychecks in the first half of the year were over-withheld and the difference comes back as a refund.',
      'The rate is scheduled to fall a further 0.125 point a year until it reaches 3.99%, subject to revenue triggers.',
      'The G-4 standard deduction ($12,000 single, $24,000 married) and $4,000 dependent allowance were unchanged.',
    ],
  },

  MI: {
    medianHourlyWage: 23.69,
    neighbors: ['OH', 'IN', 'WI'],
    localMinimumWageNote:
      'Michigan pre-empts local minimum wage ordinances (the 2015 Local Government Labor Regulatory Limitation Act), so the $13.73 state rate applies in Detroit, Grand Rapids and Ann Arbor.',
    payrollPrograms: [],
    localIncomeTax: {
      summary:
        '24 Michigan cities levy a city income tax that employers in the city must withhold: residents pay the full rate and non-residents who work in the city pay half. The calculator does not include it.',
      examples: [
        { place: 'Detroit', rate: '2.40% residents / 1.20% non-residents' },
        { place: 'Grand Rapids', rate: '1.50% / 0.75%' },
        { place: 'Lansing, Flint, Saginaw', rate: '1.00%–1.50% / half for non-residents' },
      ],
    },
    overtimeDetail: [
      'The Improved Workforce Opportunity Wage Act requires 1.5× after 40 hours, with no daily overtime.',
      'Michigan\'s Earned Sick Time Act (effective February 21, 2025) gives up to 72 hours of paid sick time a year at employers with 11+ workers, accrued at one hour per 30 worked.',
    ],
    changes2026: [
      'Minimum wage rose from $12.48 to $13.73 on January 1, 2026 under the 2025 amendments to the wage act, and goes to $15.00 on January 1, 2027.',
      'The tipped cash wage rose to $5.49 (40% of the minimum); it reaches 50% in 2027 and 60% by 2031.',
      'The 4.25% flat income tax and $5,800 MI-W4 exemption were unchanged.',
    ],
  },

  IN: {
    medianHourlyWage: 23.01,
    neighbors: ['IL', 'OH', 'KY'],
    localMinimumWageNote:
      'Indiana pre-empts local minimum wages (IC 22-2-2-10.5), so the federal $7.25 applies in Indianapolis, Fort Wayne and Evansville.',
    payrollPrograms: [],
    localIncomeTax: {
      summary:
        'Every one of Indiana\'s 92 counties levies a Local Income Tax (LIT) withheld alongside state tax, based on the county where you lived on January 1 (or worked, if you live out of state). Rates run from about 0.5% to 3%, so it can be as large as the state tax itself. The calculator does not include it.',
      examples: [
        { place: 'Marion County (Indianapolis)', rate: '2.02%' },
        { place: 'Allen County (Fort Wayne)', rate: '1.48%' },
        { place: 'Lake County (Gary, Hammond)', rate: '1.50%' },
      ],
    },
    overtimeDetail: [
      'Indiana\'s Minimum Wage Law follows the FLSA: 1.5× after 40 hours, no daily overtime.',
      'Indiana has no required meal or rest breaks for adult workers, so only breaks your employer actually gives come off your paid hours.',
    ],
    changes2026: [
      'The state income tax rate fell from 3.00% to 2.95% on January 1, 2026, the last step of the cuts in Senate Enrolled Act 2 (2023); the WH-4 exemption stayed at $1,000.',
      'Several counties changed their local income tax rates for 2026; check the Department of Revenue\'s Departmental Notice #1 for your county.',
      'Indiana\'s minimum wage stayed at the federal $7.25, where it has been since 2009; bills to raise it did not advance in the 2026 session.',
    ],
  },

  AZ: {
    medianHourlyWage: 24.07,
    neighbors: ['CA', 'NV', 'UT'],
    localMinimumWages: [
      { jurisdiction: 'Arizona (statewide)', rate: '$15.15' },
      { jurisdiction: 'Flagstaff', rate: '$18.35', note: 'no tip credit from 2026' },
      { jurisdiction: 'Tucson', rate: '$15.45', note: '$3.00 tip credit allowed' },
    ],
    payrollPrograms: [],
    localIncomeTax: null,
    overtimeDetail: [
      'Arizona has no state overtime law; the FLSA 40-hour rule applies.',
      'The Fair Wages and Healthy Families Act guarantees paid sick time: 1 hour per 30 worked, up to 40 hours a year at employers with 15+ workers (24 hours at smaller ones).',
    ],
    changes2026: [
      'Minimum wage rose from $14.70 to $15.15 on January 1, 2026 (CPI adjustment under Proposition 206).',
      'Flagstaff eliminated its tip credit, so tipped workers there now receive the full $18.35 in cash wages.',
      'The 2.5% flat income tax, the Form A-4 withholding percentages and the $100 dependent credit were unchanged.',
    ],
  },

  CO: {
    medianHourlyWage: 28.75,
    neighbors: ['UT', 'AZ'],
    localMinimumWages: [
      { jurisdiction: 'Colorado (statewide)', rate: '$15.16' },
      { jurisdiction: 'Denver', rate: '$19.29', note: 'tipped $16.27' },
      { jurisdiction: 'Edgewater', rate: '$18.17' },
      { jurisdiction: 'Boulder (city) and unincorporated Boulder County', rate: '$16.82' },
    ],
    payrollPrograms: [
      {
        name: 'FAMLI (Family and Medical Leave Insurance)',
        rate: `${pct(CO_FAMLI_RATE, 2)} of wages up to $${cap} (half of the 0.88% premium)`,
        what: 'Up to 12 weeks of paid leave (16 for pregnancy complications) at up to 90% of pay for lower earners.',
      },
    ],
    localIncomeTax: {
      summary:
        'Colorado has no local income tax, but five cities charge a flat Occupational Privilege Tax ("head tax") withheld monthly from employees who earn above a small threshold. It is a fixed dollar amount, not a percentage.',
      examples: [
        { place: 'Denver', rate: '$5.75 per month (earnings of $500+)' },
        { place: 'Aurora', rate: '$2.00 per month' },
        { place: 'Glendale, Greenwood Village, Sheridan', rate: '$2.00–$5.00 per month' },
      ],
    },
    overtimeDetail: [
      'The COMPS Order adds daily overtime: 1.5× after 12 hours in a workday or 12 consecutive hours, as well as after 40 in a week.',
      'A paid 10-minute rest break is required for every 4 hours worked and a 30-minute meal break for shifts over 5 hours.',
      'Colorado\'s Healthy Families and Workplaces Act gives 1 hour of paid sick leave per 30 hours worked, up to 48 hours a year.',
    ],
    changes2026: [
      'Minimum wage rose from $14.81 to $15.16 on January 1, 2026; Denver rose to $19.29 and Boulder city and county moved to a single $16.82 rate.',
      `The FAMLI premium fell from 0.90% to 0.88% of wages, so the employee share dropped from 0.45% to ${pct(CO_FAMLI_RATE, 2)}.`,
      'The 4.40% flat income tax and DR 0004 withholding worksheet were unchanged.',
    ],
  },

  UT: {
    medianHourlyWage: 24.09,
    neighbors: ['ID', 'NV', 'AZ'],
    localMinimumWageNote:
      'Utah law (Utah Code § 34-40-106) pre-empts local minimum wages, so the federal $7.25 applies in Salt Lake City, Provo and Ogden.',
    payrollPrograms: [],
    localIncomeTax: null,
    overtimeDetail: [
      'Utah has no state overtime law; the FLSA 40-hour rule applies.',
      'Utah requires no meal or rest breaks for adults (minors get a 30-minute meal break per 5 hours), so your hours are what you clock.',
    ],
    changes2026: [
      'Senate Bill 60 cut the flat income tax rate from 4.50% to 4.45%, retroactive to January 1, 2026; the Tax Commission\'s revised Publication 14 withholding tables took effect for pay periods from June 1, 2026.',
      'The withholding base allowance that is subtracted from the tax was raised in the June 2026 tables, trimming withholding for lower earners.',
      'Utah\'s minimum wage stayed at $7.25; the state has never set a rate above the federal floor and the 2026 legislature did not take up an increase.',
    ],
  },

  KY: {
    medianHourlyWage: 22.56,
    neighbors: ['TN', 'IN', 'OH'],
    localMinimumWageNote:
      'Kentucky\'s minimum wage is the federal $7.25, and the Kentucky Supreme Court struck down Louisville\'s and Lexington\'s local minimum wage ordinances in 2016, so no city may set its own.',
    payrollPrograms: [],
    localIncomeTax: {
      summary:
        'Most Kentucky cities, counties and some school districts levy an occupational license fee — a flat percentage of wages withheld by the employer with no exemptions — which the calculator does not include.',
      examples: [
        { place: 'Louisville Metro (residents)', rate: '2.20% (1.45% metro + 0.75% school board)' },
        { place: 'Lexington-Fayette', rate: '2.25%' },
        { place: 'Covington / Bowling Green', rate: '2.45% / 2.00%' },
      ],
    },
    overtimeDetail: [
      'Seventh-day overtime: KRS 337.285 requires 1.5× for all hours worked on the seventh consecutive day of a workweek in which you worked 40 hours or more.',
      'Kentucky requires a paid 10-minute rest break for every 4 hours worked and a "reasonable" meal period between the third and fifth hour of a shift.',
    ],
    changes2026: [
      'House Bill 1 (2025) cut the flat income tax rate from 4.00% to 3.50% on January 1, 2026 — the largest single-year cut among the 30 states covered here.',
      'The Kentucky standard deduction used in withholding stayed at $3,270.',
      'Further half-point cuts depend on budget-reserve triggers being met in future sessions.',
    ],
  },

  LA: {
    medianHourlyWage: 21.88,
    neighbors: ['TX'],
    localMinimumWageNote:
      'Louisiana has no state minimum wage law and pre-empts local ones (La. R.S. 23:642), so the federal $7.25 applies in New Orleans, Baton Rouge and Shreveport.',
    payrollPrograms: [],
    localIncomeTax: null,
    overtimeDetail: [
      'Louisiana has no state overtime law; non-exempt workers rely entirely on the federal FLSA 40-hour rule.',
      'Louisiana requires no meal or rest breaks for adults; minors get a 30-minute break per 5 hours.',
    ],
    changes2026: [
      '2026 is the second year of the flat 3.00% income tax from Act 11 (2024), which replaced the 1.85%/3.5%/4.25% brackets and tripled the standard deduction to $12,500 single / $25,000 married.',
      'No change to the minimum wage; Louisiana has never set one above the federal rate.',
    ],
  },

  IA: {
    medianHourlyWage: 23.34,
    neighbors: ['IL', 'MN', 'MO'],
    localMinimumWageNote:
      'Iowa pre-empted local minimum wages in 2017 (HF 295), which rolled back the higher rates Johnson, Linn, Polk and Wapello counties had adopted, so $7.25 applies statewide.',
    payrollPrograms: [],
    localIncomeTax: {
      summary:
        'About a third of Iowa school districts levy an income surtax of 1% to 20% of your state income tax. It is paid on your return, not withheld from your paycheck, so it does not appear in the calculator.',
    },
    overtimeDetail: [
      'Iowa has no state overtime law; the FLSA 40-hour rule applies.',
      'Iowa requires no meal or rest breaks for adults.',
    ],
    changes2026: [
      '2026 is the second year of Iowa\'s flat 3.80% income tax (SF 2442), down from a 5.7% top rate in 2024; withholding uses the federal-aligned $16,100 / $32,200 standard deduction.',
      'The $40 per-allowance credit on the IA W-4 was unchanged.',
      'Iowa\'s minimum wage stayed at $7.25, the same rate it has had since the 2008 state increase matched the federal one.',
    ],
  },

  ID: {
    medianHourlyWage: 23.06,
    neighbors: ['WA', 'OR', 'UT'],
    localMinimumWageNote:
      'Idaho Code § 44-1502 pre-empts local minimum wages, so the federal $7.25 applies in Boise, Meridian and Idaho Falls.',
    payrollPrograms: [],
    localIncomeTax: null,
    overtimeDetail: [
      'Idaho has no state overtime law; the FLSA 40-hour rule applies.',
      'Idaho requires no meal or rest breaks for adults.',
    ],
    changes2026: [
      'House Bill 40 (2025) cut the flat income tax rate from 5.695% to 5.30%, and 2026 is the first full year the withholding tables reflect it.',
      'The $3,600 per-child allowance on the ID W-4 was unchanged.',
      'Idaho\'s minimum wage stayed at $7.25; a 2026 ballot initiative to raise it did not qualify.',
    ],
  },

  OH: {
    medianHourlyWage: 23.74,
    neighbors: ['PA', 'MI', 'KY'],
    localMinimumWageNote:
      'Ohio\'s constitution sets a single statewide minimum wage ($11.00 in 2026 for employers grossing over $405,000; $7.25 for smaller ones) and state law pre-empts local rates.',
    payrollPrograms: [],
    localIncomeTax: {
      summary:
        'Roughly 600 Ohio municipalities levy an income tax on wages earned inside their boundaries, withheld by the employer, and your home city may charge the difference if its rate is higher. Collected through RITA, CCA or the city itself. The calculator does not include it.',
      examples: [
        { place: 'Columbus, Cleveland, Toledo, Dayton', rate: '2.50%' },
        { place: 'Akron', rate: '2.50%' },
        { place: 'Cincinnati', rate: '1.80%' },
      ],
    },
    overtimeDetail: [
      'Ohio follows the FLSA 40-hour rule; employers grossing under $150,000 are exempt from the state overtime law.',
      'Ohio requires no meal or rest breaks for adults.',
    ],
    changes2026: [
      'House Bill 96 (the 2025–2027 budget) replaced the 2.75%/3.5% brackets with a single 2.75% rate on taxable income above $26,050 for 2026, so the top rate fell by 0.75 point; revised withholding tables took effect August 1, 2026.',
      'The minimum wage rose from $10.70 to $11.00 on January 1, 2026 (CPI adjustment).',
      'The $2,400 per-exemption amount on Form IT 4 was unchanged.',
    ],
  },

  VA: {
    medianHourlyWage: 26.77,
    neighbors: ['NC', 'MD', 'TN'],
    localMinimumWageNote:
      'Virginia sets one statewide minimum wage ($12.77 in 2026) and localities may not set their own, so the same rate applies in Northern Virginia, Richmond and Hampton Roads.',
    payrollPrograms: [],
    localIncomeTax: null,
    overtimeDetail: [
      'The Virginia Overtime Wage Act (2021) was amended in 2022 to follow the FLSA: 1.5× after 40 hours, no daily overtime.',
      'Virginia requires no meal or rest breaks for adults (minors under 16 get a 30-minute break per 5 hours).',
    ],
    changes2026: [
      'Minimum wage rose from $12.41 to $12.77 on January 1, 2026 under the annual CPI adjustment in the Virginia Minimum Wage Act.',
      'The 2%/3%/5%/5.75% brackets have not changed since 1990, so every full-time worker is in the 5.75% bracket.',
    ],
  },

  NJ: {
    medianHourlyWage: 28.16,
    neighbors: ['NY', 'PA'],
    localMinimumWageNote:
      'New Jersey\'s $15.92 rate applies statewide for most employers (seasonal and small employers with fewer than six workers have a lower rate that catches up in 2028); no city sets its own minimum.',
    payrollPrograms: [
      {
        name: 'Unemployment Insurance, Workforce Development and Family Leave Insurance (SUI/WF/FLI)',
        rate: `${pct(NJ_SUI_FLI_RATE, 3)} of wages up to the annual taxable wage caps`,
        what: 'Employee share of unemployment insurance plus up to 12 weeks of Family Leave Insurance at 85% of pay. The TDI employee rate is 0% in 2026.',
      },
    ],
    localIncomeTax: {
      summary:
        'New Jersey has no local income tax on employees. Newark and Jersey City levy a 1% payroll tax, but it is paid by the employer and never appears on your pay stub.',
    },
    overtimeDetail: [
      'The New Jersey Wage and Hour Law requires 1.5× after 40 hours, no daily overtime.',
      'New Jersey Earned Sick Leave gives 1 hour per 30 worked, up to 40 hours a year, at every employer regardless of size.',
    ],
    changes2026: [
      'Minimum wage rose from $15.49 to $15.92 on January 1, 2026 (CPI-W adjustment).',
      `The employee TDI contribution rate stayed at 0% for 2026, so the SUI/WF/FLI deductions total ${pct(NJ_SUI_FLI_RATE, 3)} of wages up to the caps.`,
      'Income tax brackets are not indexed, so a raise can push more wages into the next bracket even though the rates did not change.',
    ],
  },

  MA: {
    medianHourlyWage: 30.57,
    neighbors: ['NY'],
    localMinimumWageNote:
      'Massachusetts has one statewide minimum wage ($15.00) and no city or town sets its own; Boston and Cambridge use the state rate.',
    payrollPrograms: [
      {
        name: 'Paid Family and Medical Leave (PFML)',
        rate: `${pct(MA_PFML_EMPLOYEE_RATE, 2)} of wages up to $${cap} (employee share of the 0.88% contribution)`,
        what: 'Up to 26 weeks combined of paid family and medical leave a year at up to 80% of pay for lower earners.',
      },
    ],
    localIncomeTax: null,
    overtimeDetail: [
      'Massachusetts requires 1.5× after 40 hours and, since 2023, no longer requires premium pay for Sunday or holiday work in retail.',
      'A 30-minute meal break is required for shifts over 6 hours (M.G.L. c. 149 § 100).',
    ],
    changes2026: [
      'The minimum wage stayed at $15.00 for a fourth year; a ballot question to raise it to $20 by 2030 is pending for November 2026.',
      'The PFML contribution rate stayed at 0.88% of wages (employee share about 0.46%) for 2026.',
      'The 4% surtax threshold rose to $1,083,150 of income for 2025 returns and continues to be indexed.',
    ],
  },

  MD: {
    medianHourlyWage: 28.61,
    neighbors: ['PA', 'VA'],
    localMinimumWages: [
      { jurisdiction: 'Maryland (statewide)', rate: '$15.00' },
      { jurisdiction: 'Montgomery County (51+ employees)', rate: '$18.00', note: 'from July 1, 2026' },
      { jurisdiction: 'Montgomery County (11–50 employees)', rate: '$16.50', note: 'from July 1, 2026' },
      { jurisdiction: 'Montgomery County (10 or fewer employees)', rate: '$15.95', note: 'from July 1, 2026' },
      { jurisdiction: 'Howard County (all employers)', rate: '$16.00' },
    ],
    payrollPrograms: [],
    localIncomeTax: {
      summary:
        'Every Maryland county and Baltimore City levies a local income tax that is withheld with state tax and based on where you live. Rates run from 2.25% to 3.20%; the calculator uses the 3.05% statewide average, so your pay stub may differ by up to about 0.8% of wages.',
      examples: [
        { place: 'Montgomery, Prince George\'s, Howard, Baltimore City & County', rate: '3.20%' },
        { place: 'Anne Arundel', rate: '2.81% (2.70% on the first $50,000)' },
        { place: 'Worcester County', rate: '2.25%' },
      ],
    },
    overtimeDetail: [
      'Maryland follows the 40-hour rule; bowling alleys and some residential-care institutions have a 48-hour threshold and agricultural workers 60 hours.',
      'The Healthy Working Families Act gives 1 hour of sick leave per 30 worked, up to 40 hours a year (paid at employers with 15+ workers).',
    ],
    changes2026: [
      'Montgomery County\'s large-employer minimum rose from $17.65 to $18.00 on July 1, 2026, and Howard County unified at $16.00 for all employer sizes.',
      'The statewide $15.00 minimum did not change and no further increase is scheduled.',
      'Maryland\'s paid family leave program (FAMLI) was delayed again by the 2025 legislature; payroll contributions now start January 1, 2027, so no FAMLI deduction appears in 2026.',
    ],
  },

  MN: {
    medianHourlyWage: 27.37,
    neighbors: ['IA', 'WI'],
    localMinimumWages: [
      { jurisdiction: 'Minnesota (statewide)', rate: '$11.41' },
      { jurisdiction: 'Minneapolis (all employers)', rate: '$16.37' },
      { jurisdiction: 'St. Paul (6+ employees)', rate: '$16.37', note: 'small employers from July 1, 2026' },
      { jurisdiction: 'St. Paul (5 or fewer employees)', rate: '$14.25', note: 'from July 1, 2026' },
    ],
    payrollPrograms: [
      {
        name: 'Minnesota Paid Leave',
        rate: `${pct(MN_PAID_LEAVE_RATE, 2)} of wages up to $${cap} (half of the 0.88% premium)`,
        what: 'Up to 20 weeks a year of combined medical and family leave at up to 90% of pay for lower earners; benefits began January 1, 2026.',
      },
    ],
    localIncomeTax: null,
    overtimeDetail: [
      'Minnesota\'s own overtime law starts at 48 hours a week, but almost every employer is covered by the FLSA\'s 40-hour rule, which takes precedence.',
      'No tip credit: tipped workers must receive the full minimum wage before tips.',
      'Minnesota Earned Sick and Safe Time (2024) gives 1 hour per 30 worked, up to 48 hours a year, at every employer.',
    ],
    changes2026: [
      `Minnesota Paid Leave payroll deductions began January 1, 2026: employers may withhold up to ${pct(MN_PAID_LEAVE_RATE, 2)} of wages, the employee half of the 0.88% premium. This is a brand-new line on every 2026 pay stub.`,
      'Minimum wage rose from $11.13 to $11.41 (inflation adjustment), with Minneapolis and St. Paul at $16.37.',
      'Income tax brackets and the $14,950 / $29,900 standard deduction were indexed for inflation.',
    ],
  },

  MO: {
    medianHourlyWage: 22.98,
    neighbors: ['IL', 'IA', 'KY'],
    localMinimumWageNote:
      'Missouri pre-empts local minimum wages (RSMo 285.055), so the $15.00 state rate applies in Kansas City, St. Louis and Springfield.',
    payrollPrograms: [],
    localIncomeTax: {
      summary:
        'Kansas City and the City of St. Louis each levy a 1% earnings tax on everyone who lives or works in the city, withheld by employers located there. The calculator does not include it.',
      examples: [
        { place: 'Kansas City', rate: '1.00%' },
        { place: 'City of St. Louis', rate: '1.00%' },
      ],
    },
    overtimeDetail: [
      'Missouri requires 1.5× after 40 hours and exempts retail and service businesses grossing under $500,000 from the state minimum wage law (the FLSA may still apply).',
      'Proposition A (2024) also created paid sick leave of 1 hour per 30 worked, which the legislature repealed effective August 28, 2025.',
    ],
    changes2026: [
      'Minimum wage rose from $13.75 to $15.00 on January 1, 2026, the final step of Proposition A; from 2027 it is indexed to inflation.',
      'The tipped cash wage rose to $7.50 (50% of the minimum).',
      'The 4.70% top income tax rate and the federal-aligned standard deduction continue for 2026.',
    ],
  },

  WI: {
    medianHourlyWage: 24.17,
    neighbors: ['MN', 'IL', 'MI'],
    localMinimumWageNote:
      'Wisconsin pre-empts local minimum wages (Wis. Stat. § 104.001), so the federal $7.25 applies in Milwaukee, Madison and Green Bay.',
    payrollPrograms: [],
    localIncomeTax: null,
    overtimeDetail: [
      'Wisconsin requires 1.5× after 40 hours, with no daily overtime.',
      'Wisconsin has a "one day of rest in seven" rule for factory and retail workers (Wis. Stat. § 103.85), though the day off need not fall in every calendar week.',
    ],
    changes2026: [
      'The 3.50%/4.40%/5.30%/7.65% brackets and the sliding standard deduction were indexed for inflation; no rate changed.',
      'The $700 per-exemption amount on Form WT-4 was unchanged.',
      'Wisconsin\'s minimum wage stayed at $7.25 for the 17th year; Governor Evers\' budget proposal to raise it was removed by the legislature.',
    ],
  },

  OR: {
    medianHourlyWage: 27.4,
    neighbors: ['WA', 'CA', 'ID'],
    localMinimumWages: [
      { jurisdiction: 'Portland metro (inside the urban growth boundary)', rate: '$16.80', note: 'from July 1, 2026' },
      { jurisdiction: 'Standard (most of the state)', rate: '$15.55', note: 'from July 1, 2026' },
      { jurisdiction: 'Nonurban counties (18 counties)', rate: '$14.55', note: 'from July 1, 2026' },
    ],
    payrollPrograms: [
      {
        name: 'Paid Leave Oregon',
        rate: `${pct(OR_PAID_LEAVE_RATE, 2)} of wages up to $${cap} (60% of the 1% contribution)`,
        what: 'Up to 12 weeks of paid family, medical or safe leave at up to 100% of pay for lower earners.',
      },
      {
        name: 'Statewide Transit Tax',
        rate: `${pct(OR_TRANSIT_TAX_RATE, 1)} of all wages`,
        what: 'Funds public transit; it is an employee-only tax withheld from every Oregon paycheck.',
      },
    ],
    localIncomeTax: {
      summary:
        'Two Portland-area income taxes apply only above high thresholds and are withheld only if you opt in or earn above the threshold: Multnomah County\'s Preschool for All tax and the Metro Supportive Housing Services tax. Neither affects a typical hourly paycheck and neither is modelled here.',
      examples: [
        { place: 'Multnomah County Preschool for All', rate: '1.5% over $125,000 single / $200,000 joint (3% over $250,000 / $400,000)' },
        { place: 'Metro Supportive Housing Services', rate: '1% over $125,000 single / $200,000 joint' },
      ],
    },
    overtimeDetail: [
      'Manufacturing employees get daily overtime after 10 hours in a day (ORS 652.020), on top of the 40-hour weekly rule.',
      'Oregon has no tip credit, so tipped workers earn the full minimum wage before tips.',
      'Oregon\'s minimum wage adjusts every July 1, so the second half of each year has a different rate from the first half.',
    ],
    changes2026: [
      'All three minimum wage tiers rose $0.50 on July 1, 2026: standard $15.05 → $15.55, Portland metro $16.30 → $16.80, nonurban $14.05 → $14.55.',
      `Paid Leave Oregon kept its 1% total contribution with the employee share at ${pct(OR_PAID_LEAVE_RATE, 2)}.`,
      'Oregon\'s federal tax subtraction limit and standard deduction were indexed for 2026.',
    ],
  },

  SC: {
    medianHourlyWage: 22.35,
    neighbors: ['NC', 'GA'],
    localMinimumWageNote:
      'South Carolina has no state minimum wage law and pre-empts local ones (S.C. Code § 6-1-130), so the federal $7.25 applies in Charleston, Columbia and Greenville.',
    payrollPrograms: [],
    localIncomeTax: null,
    overtimeDetail: [
      'South Carolina has no overtime statute of its own, so the federal FLSA 40-hour rule is the only overtime protection for private-sector workers.',
      'South Carolina requires no meal or rest breaks for adults.',
    ],
    changes2026: [
      'The top income tax rate is 6.0% for 2026 after the scheduled cut from 6.2%; the 0% and 3% brackets below it were indexed.',
      'The per-allowance amount on the SC W-4 and the standard deduction used in withholding were indexed for inflation.',
      'South Carolina still has no minimum wage law of its own, so the federal $7.25 continued to apply in 2026.',
    ],
  },
};
