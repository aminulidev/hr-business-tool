import type { CalculatorSeoData, SeoSource } from './types';
import { SRC } from './sources';
// ---------------------------------------------------------------------------
// State Tax Calculator — SEO content
// ---------------------------------------------------------------------------
// Every dollar figure and rate in this article is produced by stateTaxOnWages(),
// the function the calculator runs, which reads the paycheck engine's state
// rules. Nothing is typed by hand, so the article cannot disagree with the tool
// or with the state paycheck pages, and it follows the engine when a figure
// changes. Statements the engine cannot back up (rates of states it does not
// model, federal deduction limits, retirement-income rules) are left out.

import { TAX_YEAR, type FilingStatus, type WithholdingOnlyState } from '@/lib/payroll/withholding';
import { MORE_STATE_SOURCES } from '@/lib/payroll/withholding/2026-more-states';
import { STATE_PAYCHECK_PAGES } from '@/lib/payroll/state-pages';
import {
  defaultStateAllowances,
  hasPaycheckPage,
  listStateNames,
  STATE_TAX_CODES,
  STATE_TAX_STATES,
  stateMarginalRate,
  stateTaxOnWages,
  UNMODELED_STATES,
  type StateTaxCode,
} from '@/lib/payroll/state-tax';

const usd = (n: number) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
const usd0 = (n: number) => `$${Math.round(n).toLocaleString('en-US')}`;
const pct = (rate: number, digits = 2) => `${(rate * 100).toFixed(digits)}%`;
const list = (items: readonly string[]) => (items.length < 2 ? items.join('') : `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`);

const name = (code: StateTaxCode) => STATE_TAX_STATES[code].name;
const on = (state: StateTaxCode, wages: number, filingStatus: FilingStatus = 'single') => stateTaxOnWages({ state, taxableWages: wages, filingStatus });
const marginal = (state: StateTaxCode, wages: number, filingStatus: FilingStatus = 'single') => stateMarginalRate({ state, taxableWages: wages, filingStatus });

const INCOME_TAX_STATES = STATE_TAX_CODES.filter((c) => !STATE_TAX_STATES[c].noIncomeTax);
const NO_TAX_NAMES = STATE_TAX_CODES.filter((c) => STATE_TAX_STATES[c].noIncomeTax).map(name);

/**
 * States that withhold at one rate on every dollar above their deduction, found by
 * walking the formula: the rate on each further $1,000 from $5,000 to $600,000,
 * ignoring the step that crosses from no tax into tax. A state with brackets, or
 * with a credit that phases out, shows more than one rate and is left out.
 */
const STEPS = [...Array.from({ length: 56 }, (_, i) => 5000 + i * 1000), 80000, 120000, 200000, 300000, 450000, 600000];
const ONE_RATE_STATES = INCOME_TAX_STATES.map((code) => {
  const rates = new Set<number>();
  for (const wages of STEPS) {
    if (on(code, wages).incomeTax > 0) rates.add(Math.round(marginal(code, wages) * 1e4) / 1e4);
  }
  return { code, rates: [...rates] };
})
  .filter(({ rates }) => rates.length === 1)
  .map(({ code, rates }) => ({ code, rate: rates[0] }))
  .sort((a, b) => a.rate - b.rate);

/** The 30 modeled income-tax states ranked by income tax on $100,000, single */
const RANKED = INCOME_TAX_STATES.map((code) => ({ code, tax: on(code, 100000).incomeTax })).sort((a, b) => b.tax - a.tax);
const top = RANKED.slice(0, 5);
const bottom = RANKED.slice(-5).reverse();

/** States that take something besides income tax from wages, at $100,000 */
const PAYROLL_STATES = STATE_TAX_CODES.map((code) => ({ code, r: on(code, 100000) })).filter(({ r }) => r.payrollTotal > 0 || r.localTax > 0);

const allowanceNote = (code: StateTaxCode, status: FilingStatus) => {
  const n = defaultStateAllowances(code, status);
  return n > 0 ? ` with ${n} withholding allowance${n === 1 ? '' : 's'}` : '';
};

function relocation(from: StateTaxCode, to: StateTaxCode, wages: number, status: FilingStatus, who: string): string {
  const a = on(from, wages, status);
  const b = on(to, wages, status);
  const diff = a.incomeTax - b.incomeTax;
  const other = (code: StateTaxCode, r: typeof a) =>
    r.total - r.incomeTax > 0 ? ` ${name(code)} also takes ${usd(r.total - r.incomeTax)} in other state deductions (${r.lines.filter((l) => l.key !== 'state').map((l) => l.label).join(', ')}).` : '';
  return `${who} earns ${usd0(wages)} a year. In ${name(from)}${allowanceNote(from, status)}, state income tax for the year is ${usd(a.incomeTax)}, an effective rate of ${pct(a.incomeTax / wages)}.${other(from, a)} In ${name(to)}${allowanceNote(to, status)} it is ${b.incomeTax === 0 ? '$0.00, because the state has no income tax on wages' : `${usd(b.incomeTax)}, an effective rate of ${pct(b.incomeTax / wages)}`}.${other(to, b)} ${diff === 0 ? 'The two states take the same income tax.' : `${name(diff > 0 ? to : from)} takes ${usd(Math.abs(diff))} less a year, about ${usd(Math.abs(diff) / 12)} a month.`}`;
}

function single(state: StateTaxCode, wages: number, status: FilingStatus, who: string): string {
  const r = on(state, wages, status);
  const rest = r.lines.filter((l) => l.key !== 'state');
  return `${who} earns ${usd0(wages)} in ${name(state)}. ${name(state)} income tax for the year${allowanceNote(state, status)} is ${usd(r.incomeTax)}: ${pct(r.incomeTax / wages)} of gross pay, or ${usd(r.incomeTax / 26)} from each bi-weekly paycheck. The next $1,000 of wages would be taxed at ${pct(marginal(state, wages, status))}.${rest.length ? ` On top of income tax, ${rest.map((l) => `${l.label} takes ${usd(l.annual)}`).join(' and ')}, so ${name(state)} takes ${usd(r.total)} in all.` : ''}`;
}

// Each state's own withholding publication: the one linked on its paycheck page, or the one cited with its engine rule
const stateSources: SeoSource[] = INCOME_TAX_STATES.map((code) =>
  hasPaycheckPage(code) ? STATE_PAYCHECK_PAGES[code].sources[0] : MORE_STATE_SOURCES[code as WithholdingOnlyState]!,
);

/** Lines the calculator shows at the most an employer may deduct */
const UP_TO_STATES = PAYROLL_STATES.filter(({ r }) => r.lines.some((l) => l.label.includes('up to'))).map(({ code }) => name(code));

const seoData = {
  howToSteps: [
    'Enter your annual gross wages or salary, before any deductions.',
    'Choose your filing status. It sets the deduction and the bracket schedule each state applies.',
    `Pick your state. The list has the ${INCOME_TAX_STATES.length} states with an income tax that this calculator models and the ${NO_TAX_NAMES.length} states with no income tax on wages.`,
    'Pick a second state to compare with, for example the state you may move to or the state where your employer is.',
    'Read the state income tax for the year, the effective rate, and the rate on your next $1,000 of wages. The result updates as you type.',
    'Switch between annual, monthly and bi-weekly to see what the tax means per paycheck.',
    'Check the line-by-line cards for other state deductions, such as disability insurance or paid family leave, and the table that repeats the comparison at other incomes.',
    'If your state is not listed, choose "Another state" and enter a flat rate from your state revenue department.',
  ],
  formula:
    `States with no income tax on wages (${NO_TAX_NAMES.join(', ')}):\nState Income Tax = $0\n\nStates with an income tax:\nState Income Tax = the state's ${TAX_YEAR} withholding formula applied to a full year of wages\n(wages − the state's standard deduction and allowances, then the state's rate or bracket schedule, less any credits the formula gives)\n\nAnother state:\nState Income Tax = Annual Wages × the flat rate you enter\n\nEffective Rate = State Income Tax ÷ Annual Wages\nRate on the next $1,000 = (Tax on Wages + $1,000 − Tax on Wages) ÷ $1,000`,
  formulaDescription:
    `State income tax is worked out differently in every state: some take one flat rate after a deduction, some use brackets, and ${NO_TAX_NAMES.length} take nothing from wages. This calculator does not carry its own table of rates. For each state it runs the ${TAX_YEAR} withholding formula from that state's revenue department, the same formula an employer's payroll system uses, over a full year of wages. For the 30 states that have a paycheck calculator on this site it is the same code, so the two always agree. The figure is what would be withheld from your pay in a year. The tax on your state return can differ, because a return also counts other income, itemized deductions and credits.`,
  workedExamples: [
    {
      title: `California to Texas at $120,000`,
      description: relocation('CA', 'TX', 120000, 'single', 'A single software engineer'),
    },
    {
      title: 'New York at $160,000',
      description: `${single('NY', 160000, 'single', 'A single financial analyst')} Residents of New York City pay a city income tax as well, which this calculator does not include; the New York paycheck calculator has a switch for it.`,
    },
    {
      title: 'Pennsylvania at $85,000',
      description: single('PA', 85000, 'single', 'A registered nurse'),
    },
    {
      title: 'Illinois or Wisconsin at $90,000',
      description: relocation('IL', 'WI', 90000, 'single', 'A single employee choosing between Chicago and Milwaukee'),
    },
    {
      title: 'A married couple at $150,000: Colorado or Arizona',
      description: relocation('CO', 'AZ', 150000, 'married', 'A married couple filing jointly, with one earner,'),
    },
    {
      title: 'Kansas or Oklahoma at $70,000',
      description: relocation('KS', 'OK', 70000, 'single', 'A single teacher choosing between Wichita and Tulsa'),
    },
    {
      title: 'New Jersey at $600,000',
      description: single('NJ', 600000, 'single', 'A corporate director'),
    },
  ],
  benchmarkTables: [
    {
      title: `State income tax on wages, single filer, ${TAX_YEAR}`,
      subtitle: 'Annual state income tax at three incomes, highest to lowest at $100,000',
      headers: ['State', '$60,000', '$100,000', '$150,000', 'Rate at $100,000', 'Next $1,000 at $100,000'],
      rows: RANKED.map(({ code }) => [
        name(code),
        usd0(on(code, 60000).incomeTax),
        usd0(on(code, 100000).incomeTax),
        usd0(on(code, 150000).incomeTax),
        pct(on(code, 100000).incomeTax / 100000),
        pct(marginal(code, 100000)),
      ]),
      description: `Each figure is the state's ${TAX_YEAR} withholding formula over a full year of wages, with the number of allowances a filer with no dependents normally claims on that state's form.`,
      note: `${list(NO_TAX_NAMES)} have no income tax on wages and are not in the table.`,
    },
    {
      title: `Other state deductions from $100,000 of wages, ${TAX_YEAR}`,
      subtitle: 'What a state takes from an employee besides income tax',
      headers: ['State', 'Deduction', 'Per year'],
      rows: PAYROLL_STATES.flatMap(({ code, r }) => r.lines.filter((l) => l.key !== 'state').map((l) => [name(code), l.label, usd(l.annual)])),
      description: 'Disability insurance, paid family and medical leave, employee unemployment tax and local income tax that the calculator shows as separate lines.',
    },
  ],
  faqs: [
    {
      question: `Which states have no income tax on wages in ${TAX_YEAR}?`,
      answer: `${list(NO_TAX_NAMES)} do not tax wages. No income tax does not always mean nothing comes out of a paycheck at the state level: on $100,000 of wages Washington takes ${usd(on('WA', 100000).payrollTotal)} for its Paid Family and Medical Leave and WA Cares programs.`,
    },
    {
      question: 'Which states take the most and the least income tax from a $100,000 salary?',
      answer: `Among the ${INCOME_TAX_STATES.length} income-tax states this calculator models, a single filer earning $100,000 has the most withheld in ${list(top.map((s) => `${name(s.code)} (${usd0(s.tax)})`))}. The least is withheld in ${list(bottom.map((s) => `${name(s.code)} (${usd0(s.tax)})`))}. The table above lists every modeled state at three incomes.`,
    },
    {
      question: 'Which states withhold at a single flat rate?',
      answer: `In ${ONE_RATE_STATES.length} of the modeled states, every dollar of wages between the state's deduction and $600,000 is withheld at one rate: ${list(ONE_RATE_STATES.map((s) => `${name(s.code)} (${pct(s.rate)})`))}. A flat rate does not mean the same share of pay at every income, because the rate applies only after a deduction or exemption. The other modeled states use brackets or a credit that shrinks as income rises.${ONE_RATE_STATES.some((s) => s.code === 'NC') ? " North Carolina's figure is its withholding rate, which the state sets slightly above the tax rate." : ''}`,
    },
    {
      question: 'How does this calculator work out state income tax?',
      answer: `It runs each state's ${TAX_YEAR} withholding formula, the method the state revenue department publishes for employers, over a full year of your wages, using the number of allowances a filer with no dependents normally claims on that state's form. For the 30 states that have a paycheck calculator on this site it is the same engine, so the two always agree. The result is the tax withheld from pay in a year, not the final tax on a return.`,
    },
    {
      question: 'Does the calculator include city and county income taxes?',
      answer: `Only one. Every Maryland county charges its own income tax, so the calculator shows it as a separate line at the average county rate: ${usd(on('MD', 100000).localTax)} on $100,000 of wages. Other local income taxes, such as New York City's, are not included. The state paycheck calculators say which local taxes apply in each state.`,
    },
    {
      question: 'What else do states take from a paycheck besides income tax?',
      answer: `Several states fund disability insurance, paid family leave, unemployment benefits or workers' compensation with a deduction from wages. On $100,000 of wages the calculator shows such a deduction in ${list(PAYROLL_STATES.filter(({ r }) => r.payrollTotal > 0).map(({ code }) => name(code)))}. The largest is in ${name(PAYROLL_STATES.reduce((a, b) => (b.r.payrollTotal > a.r.payrollTotal ? b : a)).code)}: ${usd(Math.max(...PAYROLL_STATES.map(({ r }) => r.payrollTotal)))} a year. These are listed line by line under the result and in the second table above.${UP_TO_STATES.length ? ` In ${list(UP_TO_STATES)} the law lets the employer take up to a set share from wages; the calculator shows that maximum, so your own deduction can be lower.` : ''}`,
    },
    {
      question: UNMODELED_STATES.length ? 'My state is not in the list. What should I do?' : 'Does the calculator cover every state?',
      answer: UNMODELED_STATES.length
        ? `The calculator does not model ${listStateNames(UNMODELED_STATES)}. For ${UNMODELED_STATES.length === 1 ? 'it' : 'each of them'} we could not confirm a ${TAX_YEAR} withholding formula from the tax agency's own publication, and rather than show a figure we have not verified, the calculator offers "Another state": enter a flat rate from that agency and the calculator applies it to your wages. A state is added by name once its withholding formula has been checked.`
        : `Yes: every state and the District of Columbia, each from its own ${TAX_YEAR} withholding publication. "Another state" remains for trying a flat rate of your own.`,
    },
    {
      question: 'Do I pay state income tax where I live or where I work?',
      answer: 'Usually both states have a claim: the state where the work is done taxes the wages, and your home state taxes all your income and gives a credit for tax paid to the other state, so the same wages are not taxed twice in full. Some neighboring states have reciprocity agreements that let you pay only your home state. The rules differ by pair of states, so check both revenue departments before relying on a comparison here.',
    },
  ],
  relatedTools: [
    {
      slug: 'payroll-calculator',
      title: 'Payroll Calculator',
      description: 'Salary to take-home pay with federal tax, FICA and your state in one result',
      icon: 'Wallet',
    },
    {
      slug: 'hourly-paycheck-calculator',
      title: 'Hourly Paycheck Calculator',
      description: 'Hourly wage to net paycheck with overtime, W-4 options and state withholding',
      icon: 'DollarSign',
    },
    {
      slug: 'federal-tax-calculator',
      title: 'Federal Tax Calculator',
      description: `Federal income tax by bracket and filing status for ${TAX_YEAR}`,
      icon: 'Landmark',
    },
    {
      slug: 'w-2-calculator',
      title: 'W-2 Paycheck Calculator',
      description: 'Net pay with 401(k), HSA and Section 125 deductions',
      icon: 'FileText',
    },
    {
      slug: 'tax-bracket-calculator',
      title: 'Tax Bracket Calculator',
      description: 'Marginal and effective federal rates, bracket by bracket',
      icon: 'BarChart3',
    },
    {
      slug: 'fica-tax-calculator',
      title: 'FICA Tax Calculator',
      description: 'Social Security and Medicare deductions from wages',
      icon: 'Shield',
    },
  ],
  sources: [...stateSources, SRC.ftaStateAgencies],
} satisfies CalculatorSeoData;

export default seoData;
