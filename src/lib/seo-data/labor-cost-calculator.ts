import type { CalculatorSeoData } from './types';
import { SRC } from './sources';
// ---------------------------------------------------------------------------
// Labor Cost Calculator (suite) — SEO content. Phase 17: absorbs the former
// employee-cost, team-cost and hr-budget pages. Every figure below is produced
// by the same functions the calculator runs, so article and tool agree.
// ---------------------------------------------------------------------------
import { TAX_YEAR } from '@/lib/payroll/withholding-2026';
import { STATE_EMPLOYER_TAXES } from '@/lib/payroll/employer-cost-2026';
import { buildEmployerCostContent } from '@/lib/payroll/employer-cost-content';
import {
  computeHrBudget,
  computeLaborShare,
  computeLoadedCost,
  computeTeamCost,
  HR_BUDGET_DEFAULTS,
  INDUSTRY_LABOR_BENCHMARKS,
  LABOR_SHARE_DEFAULTS,
  LOADED_COST_DEFAULTS,
  TEAM_DEFAULTS,
  type LoadedCostInput,
} from '@/lib/payroll/labor-cost';

const usd = (n: number) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
const usd0 = (n: number) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
const pct = (n: number, d = 1) => `${(n * 100).toFixed(d)}%`;

// ── worked examples from the engine
const office = computeLoadedCost(LOADED_COST_DEFAULTS); // $75k TX
const engineer = computeLoadedCost({ ...LOADED_COST_DEFAULTS, state: 'CA', annualSalary: 140000, healthMonthly: 900, retirementMatchPct: 4, otherBenefitsAnnual: 2400, paidDaysOff: 28, workersCompPer100: 0.15, equipmentAnnual: 4500, overheadAnnual: 1500 });
const retail = computeLoadedCost({ ...LOADED_COST_DEFAULTS, state: 'FL', payType: 'hourly', hourlyRate: 17, hoursPerWeek: 32, healthMonthly: 0, retirementMatchPct: 0, otherBenefitsAnnual: 0, paidDaysOff: 6, workersCompPer100: 1.2, equipmentAnnual: 300, overheadAnnual: 1200 });
const trades = computeLoadedCost({ ...LOADED_COST_DEFAULTS, state: 'OH', payType: 'hourly', hourlyRate: 32, hoursPerWeek: 42, healthMonthly: 700, retirementMatchPct: 3, otherBenefitsAnnual: 800, paidDaysOff: 15, workersCompPer100: 6.5, equipmentAnnual: 2500, overheadAnnual: 4000 });
const team = computeTeamCost(TEAM_DEFAULTS, 20, 40);
const share = computeLaborShare(LABOR_SHARE_DEFAULTS);
const restaurant = computeLaborShare({ wages: 620000, benefitsPct: 12, payrollTaxPct: 10, workersCompAnnual: 14000, contractorsAnnual: 0, revenue: 2100000, industry: 'restaurant' });
const budget = computeHrBudget(HR_BUDGET_DEFAULTS);
const employerTable = buildEmployerCostContent({ hourlyRate: 75000 / 2080, hoursPerWeek: 40, payFrequency: 'monthly', salary: 75000 }).table;

const describeLoaded = (title: string, i: LoadedCostInput, r: ReturnType<typeof computeLoadedCost>, where: string) => ({
  title,
  description:
    `${i.payType === 'salary' ? `${usd0(i.annualSalary)} salary` : `${usd(i.hourlyRate)} an hour for ${i.hoursPerWeek} hours a week (${usd0(r.wages)} a year)`} in ${where}. ` +
    `Employer payroll taxes ${usd(r.taxesTotal)} (${r.taxes.lines.map((l) => `${l.label.replace(/ \(.*\)$/, '')} ${usd(l.annual)}`).join(', ')}); ` +
    `benefits ${usd(r.benefitsTotal)} (${i.healthMonthly > 0 ? `health ${usd0(i.healthMonthly)} a month` : 'no health plan'}${i.retirementMatchPct > 0 ? `, ${i.retirementMatchPct}% 401(k) match` : ''}${i.otherBenefitsAnnual > 0 ? `, ${usd0(i.otherBenefitsAnnual)} other` : ''}); ` +
    `workers' comp ${usd(r.workersComp)} at $${i.workersCompPer100.toFixed(2)} per $100 of payroll; equipment ${usd0(i.equipmentAnnual)} and overhead ${usd0(i.overheadAnnual)}. ` +
    `Total cost to employ: ${usd(r.total)} a year, ${r.multiplier.toFixed(2)}× wages (burden ${pct(r.burdenRate)}), ${usd(r.costPerPaidHour)} per paid hour and ${usd(r.costPerWorkedHour)} per hour actually worked after ${i.paidDaysOff} paid days off.`,
});

const seoData = {
  breadcrumbs: [{ label: 'Calculators' }, { label: 'Labor Cost Calculator' }],
  tableOfContents: [
    { id: 'how-to-calculate', label: 'How to Calculate' },
    { id: 'formula', label: 'Formula' },
    { id: 'industry-benchmarks', label: 'Benchmarks' },
    { id: 'deep-dive-guide', label: 'Guide' },
    { id: 'worked-examples', label: 'Worked Examples' },
    { id: 'frequently-asked-questions', label: 'FAQs' },
    { id: 'related-calculators', label: 'Related Calculators' },
  ],

  howToSteps: [
    `Cost per employee: pick the work state (it sets the ${TAX_YEAR} employer payroll taxes: FICA match, FUTA, state unemployment at the new-employer rate and any paid-leave employer share), choose salary or hourly pay, then add the employer share of health premiums per month, the 401(k) match, other benefits, paid days off, the workers' comp rate per $100 of payroll, equipment and overhead. The fully loaded cost, multiplier, burden rate and cost per paid and worked hour update as you type.`,
    'Team / project cost: list each role with hours, hourly rate and burden percentage (0% for contractors who invoice you), add overhead on labor and, optionally, a target margin to get the price you should quote. Add up to 12 roles.',
    'Labor % of revenue: enter total annual wages, benefits and payroll taxes as percentages, workers\' comp, optional contractor spend and revenue, then choose your industry. The result is placed against the commonly cited range for that industry, with the revenue or cost change needed to get back inside it.',
    'HR budget: enter the department\'s spend by category, company headcount, HR team size and revenue to get budget per employee, HR as a share of revenue and the employee-to-HR ratio.',
    'Use the tabs at the top to switch modes; each mode keeps its own history. Old links to the employee cost, team cost and HR budget calculators open the matching tab.',
  ],

  formula:
    'Loaded Cost = Wages + Employer Payroll Taxes + Benefits + Workers\' Comp + Equipment + Overhead\nMultiplier = Loaded Cost ÷ Wages   ·   Burden Rate = (Loaded Cost − Wages) ÷ Wages\nCost per Worked Hour = Loaded Cost ÷ (Paid Hours − Paid Days Off × Hours per Day)\nLabor % of Revenue = (Wages + Benefits + Payroll Taxes + Workers\' Comp) ÷ Revenue × 100\nTeam Cost = Σ Hours × Rate × (1 + Burden %) × (1 + Overhead %)',

  formulaDescription:
    `Employer payroll taxes are not a flat percentage: Social Security (6.2%) stops at ${usd0(184500)}, FUTA applies only to the first $7,000 and state unemployment only to each state's taxable wage base, so the calculator computes them line by line with the same ${TAX_YEAR} engine as the paycheck calculators instead of asking for a single "taxes %". ` +
    'Benefits are entered the way employers are billed: health as a monthly premium share, retirement as a match percentage, everything else as a yearly amount. Workers\' compensation is priced per $100 of payroll, which is how insurers quote it. ' +
    'Paid days off do not change what the employer spends, but they change what each hour of actual work costs, which is the number to use when pricing billable time or comparing with a contractor\'s hourly invoice.',

  benchmarkTables: [
    {
      title: `What a ${usd0(75000)} Salary Really Costs in ${TAX_YEAR} (Texas, standard benefits)`,
      description: 'The calculator\'s default example, line by line. Change the state and the tax lines change; change the benefits and everything else follows.',
      headers: ['Cost line', 'Per year', 'Per month', '% of salary'],
      rows: [
        ...office.lines.map((l) => [l.label, usd(l.annual), usd(l.annual / 12), `${((l.annual / office.wages) * 100).toFixed(2)}%`]),
        ['Total cost to employ', usd(office.total), usd(office.total / 12), `${(office.multiplier * 100).toFixed(1)}%`],
      ],
      note: `Health ${usd0(LOADED_COST_DEFAULTS.healthMonthly)} a month employer share, ${LOADED_COST_DEFAULTS.retirementMatchPct}% 401(k) match, ${usd0(LOADED_COST_DEFAULTS.otherBenefitsAnnual)} other benefits, workers' comp at $${LOADED_COST_DEFAULTS.workersCompPer100} per $100, ${usd0(LOADED_COST_DEFAULTS.equipmentAnnual)} equipment, ${usd0(LOADED_COST_DEFAULTS.overheadAnnual)} overhead, ${LOADED_COST_DEFAULTS.paidDaysOff} paid days off. Per paid hour ${usd(office.costPerPaidHour)}; per hour worked ${usd(office.costPerWorkedHour)}.`,
    },
    employerTable,
    {
      title: 'Labor Cost as a Share of Revenue: Commonly Cited Operating Ranges by Industry',
      description: 'Rules of thumb that lenders, franchisors and trade associations use when they talk about labor cost. They are targets, not statistics; your own history and your competitors\' filings are better benchmarks when you have them.',
      headers: ['Industry', 'Typical range', 'What moves it'],
      rows: INDUSTRY_LABOR_BENCHMARKS.map((b) => [b.label, `${b.low}–${b.high}%`, b.note]),
      note: 'Labor cost here means wages plus benefits, employer payroll taxes and workers\' compensation for W-2 staff. Contractor spend is shown separately as "workforce cost" because most benchmarks exclude it.',
    },
    {
      title: 'HR Department Budget: Rules of Thumb',
      headers: ['Measure', 'Typical range', 'Notes'],
      rows: [
        ['HR spend as % of revenue', '1% – 3%', 'Lower at large companies with scale, higher at small and fast-growing ones'],
        ['HR spend per employee per year', '$1,000 – $3,500', 'Excludes the benefits themselves; includes HR salaries, recruiting, training, technology'],
        ['Employees per HR team member', '50 – 100', 'Small companies often sit near 1:40 because one generalist covers everything'],
        ['HR team pay as share of HR budget', '50% – 65%', 'The rest splits across recruiting (10–20%), training (10–15%), technology (5–10%) and admin'],
        ['HR technology per employee per year', '$100 – $300', 'HRIS, payroll, ATS and LMS seats combined'],
      ],
      note: `The calculator's sample department (${HR_BUDGET_DEFAULTS.headcount} employees, ${HR_BUDGET_DEFAULTS.hrHeadcount} in HR) spends ${usd0(budget.total)}: ${usd(budget.perEmployee)} per employee, ${budget.pctRevenue.toFixed(2)}% of ${usd0(HR_BUDGET_DEFAULTS.revenue)} revenue, ${budget.employeesPerHr} employees per HR team member.`,
    },
  ],

  deepDiveSections: [
    {
      title: 'Why the Offer Letter Is Only About 70% of the Real Cost',
      paragraphs: [
        `Founders and department heads routinely budget a hire at the salary in the offer letter. The Bureau of Labor Statistics' Employer Costs for Employee Compensation survey puts wages at roughly 70% of total private-industry compensation, with legally required payroll taxes, insurance and paid leave making up the rest — before a laptop, a software seat or a desk is counted. On the calculator's ${usd0(75000)} Texas example the gap is ${usd(office.burden)} a year: ${usd(office.taxesTotal)} of employer payroll taxes, ${usd(office.benefitsTotal)} of benefits, ${usd(office.workersComp)} of workers' compensation and ${usd(office.equipment + office.overhead)} of equipment and overhead, for a ${office.multiplier.toFixed(2)}× multiplier.`,
        `The multiplier is not a constant. The same ${usd0(140000)} engineer in California costs ${usd(engineer.total)} (${engineer.multiplier.toFixed(2)}×) because Social Security stops at the wage base, FUTA and state unemployment stop at a few thousand dollars, and a remote worker needs little office space — while a ${usd(17)}-an-hour part-time retail associate in Florida with no health plan costs ${usd(retail.total)} on ${usd0(retail.wages)} of wages (${retail.multiplier.toFixed(2)}×), and an Ohio tradesperson at ${usd(32)} an hour with a workers' comp rate of $6.50 per $100 comes to ${usd(trades.total)} (${trades.multiplier.toFixed(2)}×). Burden rates cluster between 20% and 45%, and the spread is mostly health premiums and workers' comp class.`,
      ],
      bullets: [
        `Statutory employer taxes (${TAX_YEAR}): 6.2% Social Security match up to ${usd0(184500)}, 1.45% Medicare match on all wages, 0.6% FUTA on the first $7,000 (2.1% in California while the potential credit reduction stands), state unemployment at the new-employer rate on the state wage base, and the employer share of paid-leave programs in WA, CO, MA, OR, MN and NJ.`,
        'Benefits: the employer share of group health, dental and vision (entered per month because that is how it is billed), the retirement match as a percentage of pay, and life, disability and perks as a yearly amount.',
        'Insurance and overhead: workers\' compensation per $100 of payroll by class code, equipment and software seats, and an allocation of rent, utilities and admin support.',
        'Hours: paid days off shrink the hours actually worked, so cost per worked hour is always higher than cost per paid hour. Use the worked-hour figure when you compare an employee with a contractor\'s invoice.',
      ],
    },
    {
      title: 'Pricing a Team: From Loaded Hourly Cost to a Quote',
      paragraphs: [
        `The team mode turns a staffing plan into a cost and a price. The sample project — a lead at ${usd(TEAM_DEFAULTS[0].rate)} an hour for ${TEAM_DEFAULTS[0].hours} hours, a developer at ${usd(TEAM_DEFAULTS[1].rate)} for ${TEAM_DEFAULTS[1].hours}, a designer at ${usd(TEAM_DEFAULTS[2].rate)} for ${TEAM_DEFAULTS[2].hours}, each carrying a 30% burden, plus a contractor at ${usd(TEAM_DEFAULTS[3].rate)} for ${TEAM_DEFAULTS[3].hours} hours with no burden — costs ${usd(team.baseCost)} in base pay, ${usd(team.burdenCost)} in burden and ${usd(team.overhead)} in 20% overhead, ${usd(team.total)} in total or ${usd(team.avgLoadedRate)} per hour. To earn a 40% margin on it the quote has to be ${usd(team.priceForMargin ?? 0)}.`,
        'Two rules keep the number honest. Burden applies only to employees: a contractor\'s invoice already includes their taxes and benefits. And margin is applied to the loaded cost including overhead, not to base pay, because rent and tools are real money the project has to recover — agencies that mark up base rates by 3× are doing exactly this arithmetic with a 20–30% overhead and a 40–50% margin folded in.',
      ],
    },
    {
      title: 'Reading Labor Cost as a Share of Revenue',
      paragraphs: [
        `Labor cost percentage is the ratio operators actually manage: total W-2 labor cost (wages, benefits, employer payroll taxes and workers' comp) divided by revenue. The sample services firm with ${usd0(LABOR_SHARE_DEFAULTS.wages)} of wages, ${LABOR_SHARE_DEFAULTS.benefitsPct}% benefits, ${LABOR_SHARE_DEFAULTS.payrollTaxPct}% payroll taxes and ${usd0(LABOR_SHARE_DEFAULTS.workersCompAnnual)} of workers' comp carries ${usd(share.laborCost)} of labor cost (${share.multiplier.toFixed(2)}× wages) on ${usd0(LABOR_SHARE_DEFAULTS.revenue)} of revenue — ${share.laborPct.toFixed(1)}%, under the 45–60% range most professional-services firms live in, which usually means strong pricing or high utilization.`,
        `The opposite case: a restaurant with ${usd0(620000)} of wages, 12% benefits, 10% payroll taxes and ${usd0(14000)} of workers' comp on ${usd0(2100000)} of sales runs ${restaurant.laborPct.toFixed(1)}% labor, above the 25–35% range. The calculator says what it would take to get back to 35%: ${usd0(restaurant.revenueForRange ?? 0)} of revenue at today's payroll, or ${usd0(restaurant.laborCutForRange ?? 0)} less labor cost. Most operators look at both, because the ratio moves with scheduling and menu prices as much as with wage rates.`,
        'Two cautions. A ratio below the range is not automatically good: it can mean understaffing that surfaces later as overtime, turnover and lost sales. And contractors are excluded from labor cost in most benchmarks, so the calculator reports them separately as workforce cost; a business that has shifted work to 1099 contractors can show a flattering labor ratio while total workforce spend has gone up.',
      ],
    },
  ],

  workedExamples: [
    describeLoaded(`Corporate Office Worker, ${usd0(75000)} Salary, Texas`, LOADED_COST_DEFAULTS, office, 'Texas (no state income tax, 2.7% new-employer SUI on $9,000)'),
    describeLoaded(`Remote Software Engineer, ${usd0(140000)} Salary, California`, { ...LOADED_COST_DEFAULTS, state: 'CA', annualSalary: 140000, healthMonthly: 900, retirementMatchPct: 4, otherBenefitsAnnual: 2400, paidDaysOff: 28, workersCompPer100: 0.15, equipmentAnnual: 4500, overheadAnnual: 1500 }, engineer, 'California (3.4% SUI and 0.1% ETT on $7,000, FUTA with the potential 1.5% credit reduction)'),
    describeLoaded(`Part-Time Retail Associate, ${usd(17)} an Hour, Florida`, { ...LOADED_COST_DEFAULTS, state: 'FL', payType: 'hourly', hourlyRate: 17, hoursPerWeek: 32, healthMonthly: 0, retirementMatchPct: 0, otherBenefitsAnnual: 0, paidDaysOff: 6, workersCompPer100: 1.2, equipmentAnnual: 300, overheadAnnual: 1200 }, retail, 'Florida (2.7% new-employer reemployment tax on $7,000, no benefits offered)'),
    describeLoaded(`Field Tradesperson, ${usd(32)} an Hour, Ohio`, { ...LOADED_COST_DEFAULTS, state: 'OH', payType: 'hourly', hourlyRate: 32, hoursPerWeek: 42, healthMonthly: 700, retirementMatchPct: 3, otherBenefitsAnnual: 800, paidDaysOff: 15, workersCompPer100: 6.5, equipmentAnnual: 2500, overheadAnnual: 4000 }, trades, 'Ohio (2.85% new-employer SUI on $9,000, workers\' comp at a trades class rate)'),
    {
      title: 'Four-Person Project Team Priced at a 40% Margin',
      description: `${TEAM_DEFAULTS.map((m) => `${m.name} ${m.hours}h × ${usd(m.rate)}${m.burdenPct ? ` + ${m.burdenPct}% burden` : ''}`).join('; ')}; 20% overhead on labor. Base labor ${usd(team.baseCost)}, burden ${usd(team.burdenCost)}, overhead ${usd(team.overhead)}, total ${usd(team.total)} for ${team.totalHours} hours (${usd(team.avgLoadedRate)} per hour). Quote for a 40% margin: ${usd(team.priceForMargin ?? 0)}.`,
    },
    {
      title: 'Restaurant Above the Labor Range',
      description: `${usd0(620000)} wages, 12% benefits (${usd(restaurant.benefits)}), 10% payroll taxes (${usd(restaurant.payrollTaxes)}), ${usd0(14000)} workers' comp: labor cost ${usd(restaurant.laborCost)} on ${usd0(2100000)} of sales = ${restaurant.laborPct.toFixed(1)}%, above the 25–35% restaurant range. Back to 35% needs ${usd0(restaurant.revenueForRange ?? 0)} of sales or ${usd0(restaurant.laborCutForRange ?? 0)} less labor.`,
    },
    {
      title: `HR Department for ${HR_BUDGET_DEFAULTS.headcount} Employees`,
      description: `${budget.shares.map((s) => `${s.label} ${usd0(s.amount)}`).join(', ')}: ${usd0(budget.total)} in total, ${usd(budget.perEmployee)} per employee, ${budget.pctRevenue.toFixed(2)}% of ${usd0(HR_BUDGET_DEFAULTS.revenue)} revenue, ${budget.employeesPerHr} employees per HR team member. The HR team's own pay is ${pct(budget.shares.find((s) => s.key === 'hrStaff')!.share, 0)} of the budget.`,
    },
  ],

  faqs: [
    {
      question: `What is the true cost of an employee in ${TAX_YEAR}?`,
      answer:
        `Typically 1.25 to 1.45 times wages once employer payroll taxes, benefits, workers' compensation, equipment and overhead are added. The calculator's ${usd0(75000)} Texas example comes to ${usd(office.total)} (${office.multiplier.toFixed(2)}×): ${usd(office.taxesTotal)} of ${TAX_YEAR} employer taxes, ${usd(office.benefitsTotal)} of benefits, ${usd(office.workersComp)} of workers' comp and ${usd(office.equipment + office.overhead)} of equipment and overhead. ` +
        `The same pay with a richer health plan, a higher workers' comp class or an office allocation moves the multiplier quickly, which is why the tool asks for each piece rather than a single percentage.`,
    },
    {
      question: 'What is a labor burden rate and how is it different from the loaded multiplier?',
      answer:
        `Burden rate is everything above wages divided by wages; the loaded multiplier is total cost divided by wages, so a 35.9% burden is a 1.359× multiplier. Both are shown for every result. Burden rates of 20–30% are common for roles with modest benefits, 30–45% for full benefits or high workers' comp classes, and contractors have a burden of zero on the employer's side because their invoice already covers their taxes and benefits.`,
    },
    {
      question: 'How much are mandatory employer payroll taxes?',
      answer:
        `For ${TAX_YEAR}: 6.2% Social Security on wages up to ${usd0(184500)}, 1.45% Medicare on all wages (the employer pays no share of the 0.9% surtax), FUTA at 0.6% of the first $7,000 (${usd(42)} a year, 2.1% in California while its credit reduction stands), state unemployment insurance at your assigned rate on the state's taxable wage base (new employers: 2.7% on $9,000 in Texas, 3.4% on $7,000 in California, 4.1% on $17,600 in New York), plus the employer share of paid-leave programs in a few states. ` +
        `On ${usd0(75000)} that is ${usd(office.taxesTotal)} in Texas (${pct(office.taxesTotal / 75000, 2)}). The calculator pulls the state's figures from the same table the paycheck calculators use; experience-rated employers can type their own SUI rate.`,
    },
    {
      question: 'Is a 1099 contractor cheaper than a W-2 employee?',
      answer:
        `Compare the contractor's hourly invoice with the employee's cost per hour actually worked, not with the hourly wage. The ${usd0(75000)} example costs ${usd(office.costPerWorkedHour)} per hour worked after ${LOADED_COST_DEFAULTS.paidDaysOff} paid days off, versus a ${usd(office.wages / 2080)} nominal hourly wage. A contractor quoting ${usd(60)} an hour is cheaper per hour of work but gives up control, continuity and institutional knowledge, and misclassifying an employee as a contractor carries back taxes and penalties. The team mode lets you mix both with the right burden on each.`,
    },
    {
      question: 'What is a good labor cost percentage?',
      answer:
        `It depends on the industry: ${INDUSTRY_LABOR_BENCHMARKS.map((b) => `${b.label.toLowerCase()} ${b.low}–${b.high}%`).join(', ')}. These are the operating ranges owners and lenders quote, not statistics, so treat the edges as prompts to look closer rather than pass/fail lines. The calculator places your ratio on the range and, if you are above it, shows the revenue or labor change that would bring you back to the top of the range.`,
    },
    {
      question: 'How do I calculate labor cost as a percentage of revenue?',
      answer:
        `Add wages, benefits, employer payroll taxes and workers' compensation for your W-2 staff, divide by revenue for the same period and multiply by 100. Example: ${usd0(LABOR_SHARE_DEFAULTS.wages)} wages × (1 + ${LABOR_SHARE_DEFAULTS.benefitsPct}% + ${LABOR_SHARE_DEFAULTS.payrollTaxPct}%) + ${usd0(LABOR_SHARE_DEFAULTS.workersCompAnnual)} = ${usd(share.laborCost)}; ÷ ${usd0(LABOR_SHARE_DEFAULTS.revenue)} = ${share.laborPct.toFixed(1)}%. Keep contractors out of the numerator unless your benchmark includes them; the calculator shows a separate "workforce cost" that does include them.`,
    },
    {
      question: 'How do I cost a project team or a proposal?',
      answer:
        `For each role multiply hours by the hourly rate, add the burden percentage for employees (0% for contractors), sum the roles, add overhead as a percentage of labor and then divide by (1 − target margin) to get the price. The sample four-role project costs ${usd(team.total)} for ${team.totalHours} hours and needs a ${usd(team.priceForMargin ?? 0)} quote for a 40% margin. The average loaded rate (${usd(team.avgLoadedRate)} here) is the single number to compare against a client's hourly budget.`,
    },
    {
      question: 'What should an HR department budget be?',
      answer:
        `Common yardsticks are 1–3% of revenue, $1,000–$3,500 per employee per year and one HR team member per 50–100 employees, with the team's own pay taking half or more of the budget. The sample ${HR_BUDGET_DEFAULTS.headcount}-person company spends ${usd0(budget.total)}: ${usd(budget.perEmployee)} per employee and ${budget.pctRevenue.toFixed(2)}% of revenue with ${budget.employeesPerHr} employees per HR team member. Benefits premiums themselves belong in the per-employee cost, not the HR budget; benefits administration (brokers, platforms) does.`,
    },
    {
      question: 'Does the calculator include workers\' compensation, and how do I find my rate?',
      answer:
        'Yes, as a rate per $100 of payroll, which is how insurers quote it. Clerical and office classes often run $0.10–$0.50 per $100, retail and light trades $1–$3, and roofing, framing or heavy construction $5–$15 or more. Your policy declarations page lists the class code and rate; your experience modification factor then scales it. The default $0.50 is an office-type rate and will understate the cost for field work.',
    },
    {
      question: 'Where did the Employee Cost, Team Cost and HR Budget calculators go?',
      answer:
        'They are the four tabs of this page. Their links redirect here and open the matching tab, saved history from the old pages is still available in each tab, and the math is the same or better: the per-employee tab now uses the real 2026 employer tax engine by state instead of a single "payroll tax %" guess.',
    },
  ],

  relatedTools: [
    { slug: 'hourly-paycheck-calculator', title: 'Hourly Paycheck Calculator', description: 'The employee side of the same paycheck, with an employer-cost toggle', icon: 'BadgeDollarSign' },
    { slug: 'payroll-calculator', title: 'Payroll Calculator', description: 'Salary take-home, bulk payroll for up to 25 employees and pay stubs', icon: 'CreditCard' },
    { slug: 'fte-calculator', title: 'FTE Calculator', description: 'Full-time equivalents, ACA counts and headcount projection', icon: 'Users' },
    { slug: 'employee-turnover-calculator', title: 'Employee Turnover Calculator', description: 'Turnover rate and the cost of replacing people', icon: 'Users' },
    { slug: 'billable-hours-calculator', title: 'Billable Hours Calculator', description: 'Utilization and the charge rate that covers loaded cost', icon: 'Clock' },
    { slug: 'profit-margin-calculator', title: 'Profit Margin Calculator', description: 'Margin, markup and pricing for the quote the team mode produces', icon: 'Percent' },
  ],
  sources: [SRC.irsPub15, SRC.irsTopic759, SRC.dolFutaCreditReduction, SRC.dolStateUiLaws, SRC.blsEcec, SRC.ncci],
} satisfies CalculatorSeoData;
export default seoData;
