import type { CalculatorSeoData } from './types';
import { SRC } from './sources';
// Worked examples are produced by computeW2(), the function the calculator runs, so the numbers in
// the article always match the tool (and the state figures match the state paycheck pages).
import { SOCIAL_SECURITY_WAGE_BASE } from '@/lib/payroll/federal-tax';
import { stateTaxName } from '@/lib/payroll/state-tax';
import { computeW2, type W2Input } from '@/lib/payroll/w2';

const usd = (n: number) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
const usd0 = (n: number) => `$${Math.round(n).toLocaleString('en-US')}`;

function w2Example(who: string, input: W2Input, periods: number, periodWord: string): string {
  const r = computeW2(input);
  const state = stateTaxName(input.state);
  const fica = `Social Security = ${usd(r.ssTax)}${r.ficaWages > SOCIAL_SECURITY_WAGE_BASE ? ` (it stops at the ${usd0(SOCIAL_SECURITY_WAGE_BASE)} wage base)` : ''}; Medicare = ${usd(r.medicareTax)}${r.addMedicare > 0 ? `, plus ${usd(r.addMedicare)} Additional Medicare on wages over $200,000` : ''}`;
  const stateText =
    r.stateTax === 0
      ? `${state} takes nothing from wages.`
      : `${state} takes ${usd(r.stateTax)} (${r.stateLines.map((l) => `${l.label}: ${usd(l.annual)}`).join('; ')}).`;
  return `${who} FICA wages = ${usd0(r.ficaWages)}. ${fica}. Box 1 wages = ${usd0(r.afterPretax)}; after the ${usd0(r.standardDeduction)} standard deduction, taxable income is ${usd0(r.taxableIncome)} and federal income tax is ${usd(r.federalTax)}. ${stateText} Total tax = ${usd(r.totalTax)}. Net annual take-home = ${usd(r.netAnnual)}, or ${usd(r.netAnnual / periods)} per ${periodWord} paycheck.`;
}

const seoData = {
  breadcrumbs: [{ label: 'Calculators' }, { label: 'W-2 Calculator' }],
  tableOfContents: [
    { id: 'how-to-calculate', label: 'How to Calculate' },
    { id: 'formula', label: 'W-2 Formulas & FICA Mechanics' },
    { id: 'worked-examples', label: 'Worked Examples & Paycheck Scenarios' },
    { id: 'frequently-asked-questions', label: 'FAQs' },
    { id: 'statutory-sources', label: 'Statutory Sources' },
    { id: 'related-calculators', label: 'Related Calculators' },
  ],
  howToSteps: [
    'Enter your annual contractual gross salary or hourly annualized compensation.',
    'Select your federal income tax filing status: Single, Married Filing Jointly, Head of Household, or Married Filing Separately.',
    'Select your state. For the states the calculator models it applies that state\'s own withholding rule; for any other state choose "Another state" and enter a flat rate.',
    'Choose your exact paycheck disbursement frequency: Weekly (52 pay periods), Bi-weekly (26 pay periods), Semi-monthly (24 pay periods), or Monthly (12 pay periods).',
    'Input voluntary pre-tax deductions: Traditional 401(k)/403(b), Health Savings Account (HSA), and Section 125 cafeteria plans (medical, dental, vision premiums, flexible spending accounts).',
    'Click "Calculate W-2 Take-Home" to view your exact per-paycheck net take-home pay, total annual tax liability, and line-item withholding statement.',
    'Review the W-2 Box 1 vs. Boxes 3 & 5 wage reconciliation table to understand how different benefits reduce income taxes versus FICA taxes.',
  ],
  formula: 'FICA Payroll Tax Breakdown:\nFICA Wages = Gross Pay - Section 125 Cafeteria Benefits - Pre-Tax HSA\nSocial Security (OASDI) = 6.2% × Min(FICA Wages, $184,500 Statutory Wage Base)\nMedicare (HI) = 1.45% × FICA Wages + 0.9% Additional Medicare on wages exceeding $200,000 (the amount employers withhold on, whatever the filing status)\n\nFederal Income Tax Withholding:\nTaxable Federal Wages (W-2 Box 1) = Gross Wages - Pre-Tax 401(k) - Pre-Tax HSA - Section 125 Benefits\nTaxable Income = Max(0, Taxable Federal Wages - Standard Deduction)\nFederal Income Tax = ∑ (Taxable Income in Bracket_i × Statutory Rate_i)\n\nState Taxes:\nState Taxes = the state\'s own withholding formula applied to Taxable Federal Wages, plus employee-paid state programs on FICA Wages\n(another state: Taxable Federal Wages × the flat rate you enter)\n\nNet Paycheck Formula:\nAnnual Net Pay = Gross Wages - Total Federal Tax - Total FICA Tax - State Tax - Pre-Tax Deductions\nNet Pay Per Paycheck = Annual Net Pay ÷ Pay Periods per Year (52, 26, 24, or 12)',
  formulaDescription: 'Form W-2 (Wage and Tax Statement) reflects statutory payroll tax withholdings and employer-sponsored benefit deductions. W-2 employees split mandatory Federal Insurance Contributions Act (FICA) taxes equally with employers (7.65% employee + 7.65% employer = 15.3% total). Crucially, retirement contributions (traditional 401(k) and 403(b)) are exempt from federal and state income taxes but remain 100% subject to FICA taxes. In contrast, Section 125 cafeteria plans (employer group health, dental, and vision insurance) and Health Savings Accounts (HSAs) enjoy triple tax-advantaged status, exempting contributions from federal income tax, state income tax, and employee FICA taxes.',
  workedExamples: [
    {
      title: 'Single Software Engineer Earning $95,000 (Bi-Weekly, California)',
      description: w2Example(
        'A single tech worker in California earns $95,000 paid bi-weekly (26 paychecks) and contributes $6,500 a year to a traditional 401(k), $2,000 to an HSA and $1,800 to Section 125 health insurance.',
        { grossAnnual: 95000, filingStatus: 'single', state: 'CA', pretax401k: 6500, pretaxHsa: 2000, pretaxOther: 1800 },
        26,
        'bi-weekly',
      ),
    },
    {
      title: 'Married Healthcare Worker at $120,000 (Bi-Weekly, Texas - No State Tax)',
      description: w2Example(
        'A married nurse filing jointly in Texas earns $120,000 paid bi-weekly (26 paychecks), with $8,000 going to a traditional 401(k) and $3,600 to Section 125 medical premiums.',
        { grossAnnual: 120000, filingStatus: 'mfj', state: 'TX', pretax401k: 8000, pretaxOther: 3600 },
        26,
        'bi-weekly',
      ),
    },
    {
      title: 'High-Income Professional Earning $240,000 (Semi-Monthly, New York)',
      description: w2Example(
        'A single executive in New York earns $240,000 paid semi-monthly (24 paychecks) and puts $24,500 into a 401(k), $4,400 into an HSA and $3,000 into medical insurance.',
        { grossAnnual: 240000, filingStatus: 'single', state: 'NY', pretax401k: 24500, pretaxHsa: 4400, pretaxOther: 3000 },
        24,
        'semi-monthly',
      ),
    },
    {
      title: 'Mid-Level Marketing Manager Earning $72,000 (Bi-Weekly, Florida)',
      description: w2Example(
        'A single marketing manager in Florida earns $72,000 paid bi-weekly, with 5% ($3,600) going to a 401(k) and $1,200 to Section 125 health insurance.',
        { grossAnnual: 72000, filingStatus: 'single', state: 'FL', pretax401k: 3600, pretaxOther: 1200 },
        26,
        'bi-weekly',
      ),
    },
    {
      title: 'Head of Household Single Parent at $58,000 (Weekly, Illinois)',
      description: w2Example(
        'A single parent in Illinois, filing as head of household, earns $58,000 paid weekly (52 paychecks) and contributes $2,000 to a 401(k) and $1,500 to Section 125 insurance.',
        { grossAnnual: 58000, filingStatus: 'hoh', state: 'IL', pretax401k: 2000, pretaxOther: 1500 },
        52,
        'weekly',
      ),
    },
  ],
  faqs: [
    {
      question: 'What is IRS Form W-2 and what do the different wage boxes represent?',
      answer: 'Form W-2 (Wage and Tax Statement) is the official IRS tax document provided annually by employers detailing gross compensation, statutory tax withholdings, and pre-tax benefit deductions. Key boxes include: Box 1 (Taxable Federal Wages, which excludes pre-tax 401(k), HSA, and Section 125 deductions); Box 2 (Federal Income Tax Withheld); Box 3 (Social Security Wages, capped at $184,500 for 2026, which includes 401(k) contributions); Box 4 (Social Security Tax Withheld at 6.2%); Box 5 (Medicare Wages, uncapped); Box 6 (Medicare Tax Withheld at 1.45% + 0.9% additional); Box 16 (State Taxable Wages); and Box 17 (State Income Tax Withheld).',
    },
    {
      question: 'Why is Box 1 (Federal Wages) different from Box 3 (Social Security Wages) on my W-2?',
      answer: 'Box 1 and Box 3 differ primarily because of employer-sponsored retirement plans. Under Internal Revenue Code § 3121(v), contributions to traditional 401(k) or 403(b) retirement plans reduce your federal income taxable wages (Box 1), but are NOT exempt from FICA payroll taxes (Boxes 3 and 5). Consequently, if you earn $100,000 and contribute $10,000 to a 401(k), Box 1 will report $90,000 while Box 3 and Box 5 will report $100,000.',
    },
    {
      question: 'What are the 2026 FICA tax rates and statutory wage limits?',
      answer: 'Under the Federal Insurance Contributions Act (FICA), employee payroll taxes consist of: (1) Social Security (OASDI): 6.2% on earnings up to the 2026 wage base cap of $184,500 (maximum employee withholding of $11,439.00); (2) Medicare (HI): 1.45% on all earnings without any dollar cap; (3) Additional Medicare Tax: 0.9% on wages exceeding $200,000 (Single/HoH) or $250,000 (Married Filing Jointly). Employers match the 6.2% Social Security and 1.45% Medicare taxes dollar-for-dollar, but do not match the 0.9% Additional Medicare surtax.',
    },
    {
      question: 'What is the employee 401(k) contribution limit for 2026?',
      answer: 'For tax year 2026, the elective employee deferral limit for traditional and Roth 401(k), 403(b), and most 457 plans is $24,500. Workers aged 50 and older can make an additional standard catch-up contribution of $7,500 ($32,000 total). Under the SECURE 2.0 Act, employees aged 60 through 63 qualify for an enhanced "super catch-up" limit of $11,250 ($35,750 total). Total combined contributions (employee elective deferrals plus employer match and profit sharing) cannot exceed $70,000 in 2026.',
    },
    {
      question: 'How do Section 125 cafeteria plans and HSAs reduce both income and payroll taxes?',
      answer: 'Internal Revenue Code Section 125 authorizes "cafeteria plans," which allow employees to pay for qualified benefits using pre-tax payroll deductions. These benefits — including employer-sponsored health, dental, and vision insurance premiums, healthcare flexible spending accounts (FSAs), and Health Savings Accounts (HSAs) — are uniquely exempt from federal income tax, state income tax, AND employee/employer FICA payroll taxes (7.65%), providing the highest statutory tax savings of any workplace benefit.',
    },
    {
      question: 'How does paycheck frequency affect annual take-home pay and tax withholding?',
      answer: 'Paycheck frequency does not alter your total annual federal or state tax liability, but it dictates how much is deducted on each pay date. Annual compensation is divided across pay dates: Weekly (52 pay periods), Bi-weekly (26 pay periods, every two weeks), Semi-monthly (24 pay periods, typically the 15th and last day of the month), or Monthly (12 pay periods). Bi-weekly employees experience two months each year with three paychecks ("three-paycheck months"), which can provide temporary budget surpluses.',
    },
    {
      question: 'What is the difference between a W-2 employee and a 1099 independent contractor?',
      answer: 'A W-2 employee has federal and state taxes withheld automatically by their employer and only pays the 7.65% employee share of FICA, with the employer funding the other 7.65%. A 1099 independent contractor receives gross payments with zero tax withheld and is personally responsible for paying the entire 15.3% Self-Employment Tax (SECA) via quarterly estimated payments, in addition to federal and state income taxes.',
    },
    {
      question: 'How should I update my tax withholdings if I receive a large refund or owe taxes?',
      answer: 'To adjust your per-paycheck tax withholding, submit a revised IRS Form W-4 (Employee\'s Withholding Certificate) to your employer\'s HR or payroll department. You can increase withholding by claiming an additional dollar amount on Step 4(c) to avoid year-end tax penalties, or decrease withholding by accounting for eligible dependents on Step 3 or itemized deductions on Step 4(b).',
    },
  ],
  relatedTools: [
    {
      slug: 'federal-tax-calculator',
      title: 'Federal Tax Calculator',
      description: 'Model 2026 IRS progressive brackets, standard deductions, and marginal rates',
      icon: 'Landmark',
    },
    {
      slug: 'state-tax-calculator',
      title: 'State Tax Calculator',
      description: "State income tax on your wages under each state's own rules, with two states compared side by side",
      icon: 'FileText',
    },
    {
      slug: 'fica-tax-calculator',
      title: 'FICA Tax Calculator',
      description: 'Detailed Social Security (6.2%) and Medicare (1.45%) mandatory payroll tax withholding',
      icon: 'Shield',
    },
    {
      slug: 'payroll-calculator',
      title: 'Payroll Calculator',
      description: 'Comprehensive paycheck gross-to-net estimator for employers and employees',
      icon: 'CreditCard',
    },
    {
      slug: 'salary-tax-calculator',
      title: 'Salary Tax Calculator',
      description: 'Annual salary tax burden modeling showing employee and employer statutory obligations',
      icon: 'Wallet',
    },
    {
      slug: '1099-calculator',
      title: '1099 Tax Calculator',
      description: 'Compare W-2 employee net earnings against 1099 contractor self-employment tax burden',
      icon: 'FileCheck',
    },
  ],
  sources: [SRC.irsW2Instructions, SRC.irsPub15T, SRC.irsTopic751],
} satisfies CalculatorSeoData;

export default seoData;