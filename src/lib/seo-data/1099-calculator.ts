import type { CalculatorSeoData } from './types';
import { SRC } from './sources';
// Worked examples are produced by compute1099() and computeW2(), the functions the calculators run,
// so the numbers in the article always match the tool.
import { SOCIAL_SECURITY_WAGE_BASE } from '@/lib/payroll/federal-tax';
import { compute1099, type Form1099Input } from '@/lib/payroll/form-1099';
import { stateTaxName } from '@/lib/payroll/state-tax';
import { computeW2 } from '@/lib/payroll/w2';

const usd = (n: number) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
const usd0 = (n: number) => `$${Math.round(n).toLocaleString('en-US')}`;

function contractorExample(who: string, input: Form1099Input, after = ''): string {
  const r = compute1099(input);
  const capped = r.secaTaxable > SOCIAL_SECURITY_WAGE_BASE;
  const stateText =
    input.state === 'other'
      ? `State income tax at a flat ${input.customStateRatePct ?? 0}% of net profit after the self-employment tax deduction = ${usd(r.stateTax)}.`
      : r.stateTax === 0
        ? `${stateTaxName(input.state)} has no income tax.`
        : `Estimated ${stateTaxName(input.state)} income tax = ${usd(r.stateTax)}.`;
  return `${who} Net profit = ${usd0(r.netSE)}. The self-employment tax base is 92.35% of that: ${usd(r.secaTaxable)}. Self-employment tax = ${usd(r.secaTax)} (${usd(r.ssPortion)} Social Security${capped ? `, which stops at the ${usd0(SOCIAL_SECURITY_WAGE_BASE)} wage base,` : ''} plus ${usd(r.medicarePortion)} Medicare). Half of it, ${usd(r.secaDeduction)}, is deductible, and the 20% qualified business income deduction is ${usd(r.qbiDeduction)}. After the ${usd0(r.standardDeduction)} standard deduction, taxable income is ${usd(r.taxableIncome)} and federal income tax is ${usd(r.federalTax)}. ${stateText} Total tax = ${usd(r.totalTax)}, which is ${(r.effectiveRate * 100).toFixed(2)}% of net profit. Net take-home = ${usd(r.afterTax)}, with four estimated payments of ${usd(r.quarterly)}.${after}`;
}

const parityW2 = computeW2({ grossAnnual: 100000, filingStatus: 'single', state: 'TX' });
const parity1099 = compute1099({ grossIncome: 100000, filingStatus: 'single', state: 'TX' });
const parityGap = parityW2.netAnnual - parity1099.afterTax;

const seoData = {
  breadcrumbs: [{ label: 'Calculators' }, { label: '1099 Calculator' }],
  tableOfContents: [
    { id: 'how-to-calculate', label: 'How to Calculate' },
    { id: 'formula', label: 'SECA & Income Tax Formulas' },
    { id: 'worked-examples', label: 'Worked Examples & Contractor Scenarios' },
    { id: 'benchmarks', label: '2026 1099 Tax Reserve & Take-Home Table' },
    { id: 'deep-dive', label: 'Deep Dive: High-ROI Schedule C Deductions' },
    { id: 'frequently-asked-questions', label: 'FAQs' },
    { id: 'related-calculators', label: 'Related Calculators' },
  ],
  howToSteps: [
    'Enter your total 1099 gross revenue — all client payments, contract compensation, and gross invoices reported on Form 1099-NEC or Form 1099-K.',
    'Enter total deductible business expenses from Schedule C (Form 1040), such as home office deductions, mileage, software, supplies, equipment depreciation, and subcontractor costs.',
    'Select your federal tax filing status: Single, Married Filing Jointly, Head of Household, or Married Filing Separately.',
    'Select your state. For the states the calculator models it estimates state income tax with that state\'s own formula; for any other state choose "Another state" and enter a flat rate.',
    'Click "Calculate 1099 Taxes" to compute net business profit, 15.3% SECA self-employment tax, 20% Section 199A QBI deduction, federal income tax, and net spendable take-home pay.',
    'Inspect the IRS Form 1040-ES quarterly estimated tax payment schedule to see exact payment amounts and calendar deadlines (April 15, June 15, September 15, January 15).',
    'Review the detailed reconciliation breakdown to observe how above-the-line half-SECA deduction and QBI reduce your taxable income.',
  ],
  formula: 'Schedule C Net Profit:\nNet Self-Employment Income = 1099 Gross Revenue - Allowable Business Expenses\n\nSECA Self-Employment Tax (IRC § 1401):\nSECA Taxable Base = Net Profit × 92.35% (0.9235)\nSocial Security Portion (OASDI) = 12.4% × Min(SECA Taxable Base, $184,500 Statutory Cap)\nMedicare Portion (HI) = 2.9% × SECA Taxable Base (the 0.9% Additional Medicare Tax on high earnings is not included)\nTotal SECA Tax = Social Security Portion + Medicare Portion\n\nAbove-the-Line Tax Deduction:\nOne-Half SECA Deduction (IRC § 164(f)) = Total SECA Tax ÷ 2\n\nSection 199A Qualified Business Income (QBI) Deduction:\nQBI Deduction = Net Profit × 20% (taken in full; the limits that reduce it for high earners and service businesses are not modeled)\n\nFederal Income Tax Withholding:\nTaxable Federal Income = Max(0, Net Profit - Half-SECA Deduction - QBI Deduction - Standard Deduction)\nFederal Income Tax = ∑ (Taxable Federal Income in Bracket_i × Statutory Rate_i)\n\nQuarterly Form 1040-ES Estimated Payments:\nQuarterly Payment = (Total SECA Tax + Federal Income Tax + State Tax) ÷ 4',
  formulaDescription: 'Independent contractors and freelancers receiving 1099-NEC compensation are considered self-employed sole proprietors under the Internal Revenue Code. Unlike W-2 employees whose employers absorb half of FICA taxes, 1099 contractors pay the entire 15.3% Self-Employment Contributions Act (SECA) tax (12.4% Social Security up to $184,500 + 2.9% Medicare uncapped). To offset this burden, the IRS grants two substantial statutory tax deductions: (1) An above-the-line deduction equal to 50% of your SECA tax liability under IRC § 164(f), and (2) The Section 199A Qualified Business Income (QBI) deduction, allowing eligible pass-through businesses to deduct 20% of net profits from federal income tax.',
  workedExamples: [
    {
      title: 'Freelance Software Developer Earning $110,000 with $15,000 Expenses',
      description: contractorExample(
        'A single freelance developer in California earns $110,000 on 1099-NEC contracts and has $15,000 of deductible Schedule C expenses (equipment, cloud hosting, home office, software).',
        { grossIncome: 110000, businessExpenses: 15000, filingStatus: 'single', state: 'CA' },
      ),
    },
    {
      title: 'Independent Management Consultant at $180,000 (Single, Texas - No State Tax)',
      description: contractorExample(
        'A single 1099 consultant in Texas earns $180,000 with $20,000 in business expenses.',
        { grossIncome: 180000, businessExpenses: 20000, filingStatus: 'single', state: 'TX' },
      ),
    },
    {
      title: 'High-Earning 1099 Medical Specialist at $350,000 (Exceeds Social Security Wage Base)',
      description: contractorExample(
        'A single locum tenens physician in Florida earns $350,000 with $30,000 in expenses.',
        { grossIncome: 350000, businessExpenses: 30000, filingStatus: 'single', state: 'FL' },
        ' At this income the result understates the tax: the calculator takes the 20% qualified business income deduction in full and leaves out the 0.9% Additional Medicare Tax, while a service business with high income can lose part or all of that deduction.',
      ),
    },
    {
      title: 'Creative Marketing Contractor at $65,000 with Modest Expenses ($5,000)',
      description: contractorExample(
        'A single freelance copywriter earns $65,000 on 1099s with $5,000 in Schedule C expenses, in a state the calculator does not model, entered as "Another state" at 5%.',
        { grossIncome: 65000, businessExpenses: 5000, filingStatus: 'single', state: 'other', customStateRatePct: 5 },
      ),
    },
    {
      title: '1099 Contractor vs. W-2 Employee Compensation Parity ($100k Benchmark)',
      description: `A $100,000 W-2 salary against a $100,000 1099 contract, both for a single filer in Texas with no pre-tax deductions and no business expenses. The employee pays ${usd(parityW2.totalFica)} in FICA and ${usd(parityW2.federalTax)} in federal income tax and keeps ${usd(parityW2.netAnnual)}. The contractor pays ${usd(parity1099.secaTax)} in self-employment tax and, after the half-SECA and 20% qualified business income deductions, ${usd(parity1099.federalTax)} in federal income tax, and keeps ${usd(parity1099.afterTax)}: ${usd(Math.abs(parityGap))} ${parityGap >= 0 ? 'less' : 'more'} than the employee. Tax is only part of the gap. The contractor also pays for health insurance, time off and retirement savings without an employer contribution, which this comparison does not price.`,
    },
  ],
  benchmarkTables: [
    {
      title: '2026 1099 Contractor Tax & Take-Home Pay Benchmarks (Single Filer, 15% Expenses, 5% State Tax)',
      description: 'Reference guide showing how much of every 1099 invoice to set aside in a dedicated tax savings account across common gross contractor income tiers.',
      headers: ['Gross 1099 Income', 'Net Schedule C (85%)', 'SECA Tax (15.3%)', 'Fed + 5% State Tax', 'Recommended Tax Reserve %', 'Net Annual Take-Home'],
      rows: [
        ['$50,000', '$42,500', '$6,005', '$2,980', '21.1% of Net', '$33,515'],
        ['$75,000', '$63,750', '$9,008', '$5,890', '23.4% of Net', '$48,852'],
        ['$100,000', '$85,000', '$12,010', '$9,420', '25.2% of Net', '$63,570'],
        ['$150,000', '$127,500', '$18,015', '$18,650', '28.8% of Net', '$90,835'],
        ['$200,000', '$170,000', '$24,020', '$28,900', '31.1% of Net', '$117,080'],
        ['$300,000', '$255,000', '$29,962', '$58,400', '34.7% of Net', '$166,638'],
      ],
    },
  ],
  deepDiveSections: [
    {
      id: 'deep-dive',
      title: 'High-Impact Schedule C & Above-the-Line Deductions for 1099 Contractors',
      paragraphs: [
        'Every $1,000 in legitimate Schedule C business expenses reduces both your 15.3% SECA tax and your marginal federal/state income tax—yielding a combined tax savings of $320 to $450 per $1,000 deducted. Unlike W-2 employees (who cannot deduct unreimbursed work expenses), 1099 contractors can deduct any "ordinary and necessary" expense incurred to operate their business under IRC § 162.',
        'Beyond standard Schedule C operational write-offs (software, laptops, travel, home office, and business mileage), high-earning 1099 contractors can shelter up to $70,000+ per year from federal and state income tax using a Solo 401(k) or SEP IRA, while deducting 100% of self-employed health, dental, and vision insurance premiums on Form 1040 Schedule 1.',
      ],
      highlights: [
        'Home Office Deduction (Form 8829): Deduct $5/sq ft up to 300 sq ft ($1,500 simplified) or the exact square-footage percentage of your rent, mortgage interest, utilities, and home insurance.',
        'Solo 401(k) Contributions: Contribute up to $23,500 as an "employee" plus up to 20% of net self-employment earnings as the "employer" to slash taxable income.',
        '100% Self-Employed Health Insurance Deduction: Deduct medical, dental, and long-term care premiums for yourself, your spouse, and dependents above-the-line without itemizing.',
      ],
    },
  ],
  faqs: [
    {
      question: 'What is a 1099 contractor and how does nonemployee compensation differ from W-2?',
      answer: 'A 1099 independent contractor is a self-employed business owner or freelance professional hired by companies to perform specific projects. Employers report contractor earnings on IRS Form 1099-NEC (Nonemployee Compensation) rather than Form W-2. Crucially, clients do not withhold federal income tax, state income tax, or FICA payroll taxes from 1099 checks. Contractors receive gross payments and must budget for and pay their own taxes quarterly using Form 1040-ES.',
    },
    {
      question: 'What is the SECA self-employment tax rate and why is it 15.3%?',
      answer: 'The Self-Employment Contributions Act (SECA) tax is 15.3% on net self-employment earnings. It comprises 12.4% for Social Security (OASDI) on earnings up to the annual statutory cap ($184,500 in 2026) and 2.9% for Medicare (HI) on all net earnings with no limit. W-2 employees split this 15.3% equally with their employer (7.65% each); independent contractors must pay both halves because they function as both the employer and employee.',
    },
    {
      question: 'Why is SECA tax calculated on 92.35% (0.9235) of net profit instead of 100%?',
      answer: 'Under Internal Revenue Code § 1402(a)(12), self-employed individuals calculate SECA tax on 92.35% of their net profit (100% minus 7.65%). This statutory adjustment ensures tax parity with W-2 employees, whose employer-paid half of FICA (7.65%) is not counted as taxable employee compensation.',
    },
    {
      question: 'How does the 20% Section 199A Qualified Business Income (QBI) deduction work?',
      answer: 'Enacted under the Tax Cuts and Jobs Act (TCJA), the Section 199A QBI deduction permits eligible sole proprietors, single-member LLCs, and S-corporation owners to deduct up to 20% of their qualified net business profit directly from their federal taxable income. For 2026, the full 20% deduction is available for all businesses with 2026 taxable income under $201,750 (Single) or $403,500 (Married Filing Jointly). Above these limits, the deduction phases out for Specified Service Trades or Businesses (SSTBs), including health, law, accounting, consulting, athletics, and financial services.',
    },
    {
      question: 'When are IRS Form 1040-ES quarterly estimated tax payments due?',
      answer: 'The IRS mandates four quarterly estimated tax payment deadlines: (1) Q1: April 15 (for income earned Jan 1 – Mar 31); (2) Q2: June 15 (for income earned Apr 1 – May 31); (3) Q3: September 15 (for income earned Jun 1 – Aug 31); (4) Q4: January 15 of the following year (for income earned Sep 1 – Dec 31). If a deadline falls on a weekend or legal holiday, payment is due the next business day.',
    },
    {
      question: 'How do I avoid IRS underpayment penalties on 1099 self-employment income?',
      answer: 'To avoid IRS underpayment penalties under Form 2210, you must meet the "Safe Harbor" withholding rules: Pay at least 90% of your current tax year\'s total liability, OR pay 100% of the total tax shown on your prior year\'s tax return (increased to 110% if your prior year Adjusted Gross Income exceeded $150,000 for Single or MFJ). Paying your safe harbor amount in four equal installments shields you from penalties, regardless of how much you owe on April 15.',
    },
    {
      question: 'What business expenses can 1099 independent contractors deduct on Schedule C?',
      answer: 'Legitimate business deductions include: home office expenses (simplified deduction of $5/sq ft up to 300 sq ft, or actual allocated housing costs), business vehicle mileage (standard IRS rate), software and SaaS subscriptions, advertising and website hosting, professional liability insurance, legal and accounting fees, equipment depreciation (Section 179 expensing), contractor labor, and self-employed health insurance premiums.',
    },
    {
      question: 'How much higher should a 1099 contractor rate be compared to a W-2 salary?',
      answer: 'A common rule of thumb is that a 1099 contractor should charge 25% to 40% more than an equivalent W-2 hourly wage. The premium is necessary to account for the employer-half of FICA (7.65%), lack of employer-paid health/dental insurance, absence of paid time off (holidays, vacation, sick leave), no 401(k) employer match, and unpaid administrative time spent invoicing, marketing, and managing business operations.',
    },
  ],
  relatedTools: [
    {
      slug: 'contractor-vs-employee-calculator',
      title: '1099 vs. W-2 Calculator',
      description: 'Side-by-side compensation comparison modeling taxes, benefits, and true take-home parity',
      icon: 'Briefcase',
    },
    {
      slug: 'self-employment-tax-calculator',
      title: 'Self-Employment Tax Calculator',
      description: 'Calculate 15.3% SECA Social Security and Medicare liability for sole proprietors',
      icon: 'FileText',
    },
    {
      slug: 'w-2-calculator',
      title: 'W-2 Paycheck Calculator',
      description: 'Estimate net take-home pay, federal withholding, and FICA for corporate employees',
      icon: 'FileCheck',
    },
    {
      slug: 'federal-tax-calculator',
      title: 'Federal Tax Calculator',
      description: '2026 progressive IRS tax bracket liability modeling across all filing statuses',
      icon: 'Landmark',
    },
    {
      slug: 'state-tax-calculator',
      title: 'State Tax Calculator',
      description: "State income tax on your wages under each state's own rules, with two states compared side by side",
      icon: 'FileSpreadsheet',
    },
    {
      slug: 'fica-tax-calculator',
      title: 'FICA Tax Calculator',
      description: 'Calculate employee vs. employer mandatory FICA payroll contributions',
      icon: 'Shield',
    },
  ],
  sources: [SRC.irsSelfEmploymentTax, SRC.irsScheduleSE, SRC.irsForm1099Nec, SRC.irsRevProc2025_32],
} satisfies CalculatorSeoData;

export default seoData;