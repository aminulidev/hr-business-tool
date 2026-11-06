// ---------------------------------------------------------------------------
// Employer-cost article content shared by the hourly paycheck and payroll
// pages (Phase 16.1). Every number is generated from calculateEmployerCost(),
// the same function the "Employer cost" toggle runs, so the article and the
// calculator can never disagree.
// ---------------------------------------------------------------------------

import { calculatePaycheck, SOCIAL_SECURITY_WAGE_BASE, TAX_YEAR, type PayFrequency } from './withholding-2026';
import { STATE_CODES, STATE_PAYCHECK_PAGES } from './state-pages';
import {
  calculateEmployerCost,
  EMPLOYER_COST_SOURCES,
  FUTA_CREDIT_REDUCTION,
  STATE_EMPLOYER_TAXES,
} from './employer-cost-2026';
import type { SeoBenchmarkTable, SeoDeepDiveSection, SeoFaq, SeoSource } from '@/lib/seo-data/types';

const usd = (n: number) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
/** Whole dollars for wage bases and round wages: $9,000 not $9,000.00 */
const usd0 = (n: number) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
const money = (n: number) => (Number.isInteger(n) ? usd0(n) : usd(n));
const pct1 = (n: number) => `${(n * 100).toFixed(1)}%`;

export interface EmployerCostContentInput {
  hourlyRate: number;
  hoursPerWeek: number;
  payFrequency: PayFrequency;
  /** When set, the copy talks about a salary instead of an hourly wage */
  salary?: number;
}

export interface EmployerCostContent {
  table: SeoBenchmarkTable;
  deepDive: SeoDeepDiveSection;
  faqs: SeoFaq[];
  sources: SeoSource[];
}

export function buildEmployerCostContent(input: EmployerCostContentInput): EmployerCostContent {
  const hoursPerYear = input.hoursPerWeek * 52;
  const wageText = input.salary ? `a ${usd0(input.salary)} salary` : `${money(input.hourlyRate)} an hour full time`;

  const costFor = (code: (typeof STATE_CODES)[number]) => {
    const pc = calculatePaycheck({
      state: code,
      hourlyRate: input.hourlyRate,
      regularHoursPerWeek: input.hoursPerWeek,
      overtimeHoursPerWeek: 0,
      overtimeMultiplier: 1.5,
      payFrequency: input.payFrequency,
      filingStatus: 'single',
      stateAllowances: 0,
    });
    return {
      code,
      name: STATE_PAYCHECK_PAGES[code].name,
      profile: STATE_EMPLOYER_TAXES[code],
      paycheck: pc,
      cost: calculateEmployerCost({
        state: code,
        grossAnnual: pc.grossAnnual,
        ficaWagesAnnual: pc.ficaWagesAnnual,
        payFrequency: input.payFrequency,
        hoursPerYear,
      }),
    };
  };

  const rows = STATE_CODES.map(costFor).sort((a, b) => b.cost.employerTaxesAnnual - a.cost.employerTaxesAnnual || a.name.localeCompare(b.name));
  const tx = rows.find((r) => r.code === 'TX')!;
  const ca = rows.find((r) => r.code === 'CA')!;
  const ny = rows.find((r) => r.code === 'NY')!;
  const wa = rows.find((r) => r.code === 'WA')!;
  const gross = tx.cost.grossAnnual;
  const industryStates = rows.filter((r) => r.profile.sui.rate === null).map((r) => r.name).sort();
  const fica = tx.cost.lines.filter((l) => l.key === 'er-social-security' || l.key === 'er-medicare').reduce((s, l) => s + l.annual, 0);
  const futa = tx.cost.lines.find((l) => l.key === 'futa')!.annual;

  const table: SeoBenchmarkTable = {
    title: `${TAX_YEAR} Employer Payroll Taxes on ${usd0(gross)} of Wages, by State (New-Employer Rates)`,
    subtitle: `What a new employer pays on top of ${wageText} (${usd0(gross)} a year): FICA match, FUTA, state unemployment insurance and the employer share of state paid-leave programs`,
    headers: ['State', 'SUI New-Employer Rate × Wage Base', 'State UI & Programs / Year', 'Employer Taxes / Year', 'Load on Wages', 'Total Cost to Employ'],
    rows: rows.map((r) => {
      const stateLines = r.cost.lines.filter((l) => !['er-social-security', 'er-medicare', 'futa'].includes(l.key));
      const stateTotal = stateLines.reduce((s, l) => s + l.annual, 0);
      const suiText =
        r.profile.sui.rate === null
          ? `industry rate × ${usd0(r.profile.sui.wageBase)}*`
          : `${r.profile.sui.rateText} × ${usd0(r.profile.sui.wageBase)}`;
      return [r.name, suiText, usd(stateTotal), usd(r.cost.employerTaxesAnnual), pct1(r.cost.loadRate), usd(r.cost.totalCostAnnual)];
    }),
    note:
      `Single filer, ${input.hoursPerWeek} hours a week, no pre-tax deductions, ${TAX_YEAR} new-employer SUI rates and taxable wage bases. ` +
      `Federal lines are identical everywhere: ${usd(fica)} FICA match and ${usd(futa)} FUTA (${usd(ca.cost.lines.find((l) => l.key === 'futa')!.annual)} in California, which carries the U.S. DOL's potential ${pct1(FUTA_CREDIT_REDUCTION.CA ?? 0)} credit reduction). ` +
      `*${industryStates.join(', ')} assign new employers an industry-average rate, so their SUI is left out of the table; the calculator takes your rate. Workers' compensation and benefits are not included.`,
  };

  const deepDive: SeoDeepDiveSection = {
    title: `What ${input.salary ? `a ${usd0(input.salary)} Employee` : `a ${money(input.hourlyRate)}-an-Hour Employee`} Really Costs the Employer in ${TAX_YEAR}`,
    paragraphs: [
      `The take-home number above is the employee's side. Switch the result to "Employer cost" and the same paycheck shows what the business pays: ${wageText} is ${usd0(gross)} in wages, and in Texas a new employer adds ${usd(tx.cost.employerTaxesAnnual)} of payroll taxes (${pct1(tx.cost.loadRate)}), for a total cost to employ of ${usd(tx.cost.totalCostAnnual)} a year or ${usd(tx.cost.totalCostPerHour)} per hour worked. ` +
        `The same worker costs ${usd(ca.cost.totalCostAnnual)} in California and ${usd(ny.cost.totalCostAnnual)} in New York, where the unemployment wage base jumped to ${usd0(ny.profile.sui.wageBase)} in ${TAX_YEAR}.`,
      `Three lines are the same in every state. The employer matches the employee's Social Security (6.2% up to the wage base) and Medicare (1.45%, with no employer share of the 0.9% surtax), which is ${usd(fica)} on ${usd0(gross)}. Federal unemployment tax (FUTA) is 6.0% of the first $7,000 of each worker's wages less a 5.4% credit for paying state unemployment tax on time, so ${usd(futa)} a year per employee; employers in a state that still owes the federal government for its unemployment loans lose part of that credit, and California is the only state on the U.S. DOL's potential ${TAX_YEAR} list.`,
      `State unemployment insurance is where the gap between states comes from. New employers get a fixed rate for their first two to four years — ${tx.profile.sui.rateText} in Texas on the first ${usd0(tx.profile.sui.wageBase)}, ${ca.profile.sui.rateText} in California on the first ${usd0(ca.profile.sui.wageBase)}, ${ny.profile.sui.rateText} in New York on the first ${usd0(ny.profile.sui.wageBase)} — and then an experience rate based on how many former employees claimed benefits. ${industryStates.join(', ')} assign the average rate of the employer's industry instead of a single figure, so the calculator asks for the rate from your notice. Washington's wage base of ${usd0(wa.profile.sui.wageBase)} is the highest in the country, so even a low rate there costs more than Texas's 2.7% on $9,000.`,
      `States with paid family and medical leave also charge employers a share: Washington (28.57% of the 1.13% premium at 50+ employees), Colorado and Minnesota (half of 0.88%), Massachusetts (0.42% medical at 25+ workers), Oregon (40% of 1.0% at 25+ employees) and New Jersey's temporary disability insurance (0.5% for new employers). California's 0.1% Employment Training Tax and Nevada's 0.05% Career Enhancement Program are small add-ons on the same wage base as SUI.`,
      `What the employer view leaves out: workers' compensation insurance (rated by job class and insurer), health, dental and retirement contributions, paid time off, and local employer payroll taxes such as Oregon's transit taxes or the Newark and Jersey City 1% payroll taxes. For a fully loaded cost, add those to the total shown.`,
    ],
    bullets: [
      `Social Security match: 6.2% of FICA wages up to ${usd0(SOCIAL_SECURITY_WAGE_BASE)}; Medicare match: 1.45% of all FICA wages (Section 125 benefits reduce both).`,
      `FUTA: 0.6% of the first $7,000 per employee after the 5.4% credit; ${pct1(0.006 + (FUTA_CREDIT_REDUCTION.CA ?? 0))} in California if the DOL's potential ${TAX_YEAR} credit reduction is confirmed after November 10, ${TAX_YEAR}.`,
      `SUI: the state's ${TAX_YEAR} new-employer rate × its taxable wage base, or the rate you enter.`,
      `State paid-leave employer shares and small add-on taxes where they apply (WA, CO, MA, OR, MN, NJ, CA, NV).`,
      `Total cost to employ = wages + all of the above; cost per hour = total ÷ hours worked in the year.`,
    ],
  };

  const faqs: SeoFaq[] = [
    {
      question: `How much does an employee cost an employer beyond ${input.salary ? 'salary' : 'wages'}?`,
      answer:
        `For ${wageText} (${usd0(gross)} a year), employer payroll taxes at ${TAX_YEAR} new-employer rates run from ${usd(rows[rows.length - 1].cost.employerTaxesAnnual)} in ${rows[rows.length - 1].name} to ${usd(rows[0].cost.employerTaxesAnnual)} in ${rows[0].name} among the states this calculator models exactly, ` +
        `which is ${pct1(rows[rows.length - 1].cost.loadRate)} to ${pct1(rows[0].cost.loadRate)} on top of wages. The FICA match alone is 7.65% everywhere; the rest is federal and state unemployment tax and any state paid-leave employer share. ` +
        `Switch the calculator to "Employer cost" to see the exact split for your state, wage and pay frequency.`,
    },
    {
      question: 'What is FUTA and who pays it?',
      answer:
        `The Federal Unemployment Tax Act tax is paid only by the employer and is never withheld from the employee. The rate is 6.0% of the first $7,000 of each employee's wages, but employers that pay their state unemployment tax on time get a 5.4% credit, so the normal cost is 0.6%, or ${usd(futa)} per employee per year. ` +
        `If a state has borrowed from the federal government to pay benefits and has not repaid, its employers lose part of the credit; the U.S. DOL's potential list for ${TAX_YEAR} names California (${pct1(FUTA_CREDIT_REDUCTION.CA ?? 0)}) and the Virgin Islands, with the final determination made after November 10, ${TAX_YEAR}. FUTA is reported annually on Form 940 (IRS Tax Topic 759).`,
    },
    {
      question: 'What is the new-employer SUI rate and why can I change it?',
      answer:
        `Every state assigns new businesses a fixed state unemployment insurance (SUI) rate for their first few years, such as Texas 2.7% on the first $9,000 of each employee's wages or New York 4.1% on the first ${usd0(ny.profile.sui.wageBase)}; after that the rate depends on the employer's own layoff history. ` +
        `The calculator pre-fills the ${TAX_YEAR} new-employer rate and wage base for each state and lets you type the rate from your state's annual rate notice instead, which is what experience-rated employers and businesses in ${industryStates.join(', ')} (industry-average rates) should do. The SUI line and the total cost to employ update as you type.`,
    },
  ];

  return { table, deepDive, faqs, sources: EMPLOYER_COST_SOURCES };
}
