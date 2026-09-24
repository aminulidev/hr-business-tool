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
    'Select your state of residence to auto-fill current state income tax parameters, or customize the state percentage directly.',
    'Choose your exact paycheck disbursement frequency: Weekly (52 pay periods), Bi-weekly (26 pay periods), Semi-monthly (24 pay periods), or Monthly (12 pay periods).',
    'Input voluntary pre-tax deductions: Traditional 401(k)/403(b), Health Savings Account (HSA), and Section 125 cafeteria plans (medical, dental, vision premiums, flexible spending accounts).',
    'Click "Calculate W-2 Take-Home" to view your exact per-paycheck net take-home pay, total annual tax liability, and line-item withholding statement.',
    'Review the W-2 Box 1 vs. Boxes 3 & 5 wage reconciliation table to understand how different benefits reduce income taxes versus FICA taxes.',
  ],
  formula: 'FICA Payroll Tax Breakdown:\nFICA Wages = Gross Pay - Section 125 Cafeteria Benefits - Pre-Tax HSA\nSocial Security (OASDI) = 6.2% × Min(FICA Wages, $176,100 Statutory Wage Base)\nMedicare (HI) = 1.45% × FICA Wages + 0.9% Additional Medicare on wages exceeding $200,000 (Single) / $250,000 (MFJ)\n\nFederal Income Tax Withholding:\nTaxable Federal Wages (W-2 Box 1) = Gross Wages - Pre-Tax 401(k) - Pre-Tax HSA - Section 125 Benefits\nTaxable Income = Max(0, Taxable Federal Wages - Standard Deduction)\nFederal Income Tax = ∑ (Taxable Income in Bracket_i × Statutory Rate_i)\n\nState Income Tax Withholding:\nState Taxable Wages = Max(0, Taxable Federal Wages - State Standard Deduction)\nState Income Tax = State Taxable Wages × State Effective Tax Rate\n\nNet Paycheck Formula:\nAnnual Net Pay = Gross Wages - Total Federal Tax - Total FICA Tax - State Tax - Pre-Tax Deductions\nNet Pay Per Paycheck = Annual Net Pay ÷ Pay Periods per Year (52, 26, 24, or 12)',
  formulaDescription: 'Form W-2 (Wage and Tax Statement) reflects statutory payroll tax withholdings and employer-sponsored benefit deductions. W-2 employees split mandatory Federal Insurance Contributions Act (FICA) taxes equally with employers (7.65% employee + 7.65% employer = 15.3% total). Crucially, retirement contributions (traditional 401(k) and 403(b)) are exempt from federal and state income taxes but remain 100% subject to FICA taxes. In contrast, Section 125 cafeteria plans (employer group health, dental, and vision insurance) and Health Savings Accounts (HSAs) enjoy triple tax-advantaged status, exempting contributions from federal income tax, state income tax, and employee FICA taxes.',
  workedExamples: [
    {
      title: 'Single Software Engineer Earning $95,000 (Bi-Weekly, California)',
      description: 'A single tech worker in California earns $95,000 gross salary paid bi-weekly (26 paychecks). They contribute $6,500/year to a traditional 401(k), $2,000 to an HSA, and $1,800 to Section 125 health insurance. FICA wages = $91,200 ($95,000 - $2,000 - $1,800). FICA taxes = $5,654.40 Social Security (6.2%) + $1,322.40 Medicare (1.45%) = $6,976.80. Federal taxable income after $15,300 standard deduction = $69,400, generating $10,090.00 in federal income tax. California state tax (~6.5%) = $5,479.50. Total annual deductions and taxes = $32,846.30. Net annual take-home = $62,153.70, or $2,390.53 net per bi-weekly paycheck.',
    },
    {
      title: 'Married Healthcare Worker at $120,000 (Bi-Weekly, Texas - No State Tax)',
      description: 'A married nurse filing jointly in Texas earns $120,000 paid bi-weekly (26 pay periods) with no state income tax. Deductions include $8,000 in traditional 401(k) and $3,600 in Section 125 medical premiums. FICA wages = $116,400. FICA taxes: Social Security = $7,216.80; Medicare = $1,687.80. Federal taxable income after $30,600 standard deduction = $77,800 ($108,400 Box 1 - $30,600), producing $8,850.00 in federal income tax. Texas state income tax = $0.00. Total taxes = $17,754.60. Total pre-tax retirement and benefits = $11,600.00. Net annual take-home = $90,645.40, yielding $3,486.36 per bi-weekly paycheck.',
    },
    {
      title: 'High-Income Professional Earning $240,000 (Semi-Monthly, New York)',
      description: 'An executive in New York earns $240,000 gross salary paid semi-monthly (24 pay periods). Pre-tax contributions: $24,500 maximum 401(k), $4,400 HSA, and $3,000 medical insurance. FICA wages = $232,600. Because FICA wages exceed the $176,100 OASDI cap, Social Security tax is capped at $10,918.20. Medicare tax includes 1.45% on all $232,600 ($3,372.70) plus 0.9% Additional Medicare on wages exceeding $200,000 ($293.40), totaling $3,666.10 in Medicare. Federal income tax = $36,250.00. New York state tax = $12,450.00. Total annual take-home = $144,815.70, resulting in $6,033.99 net take-home per semi-monthly paycheck.',
    },
    {
      title: 'Mid-Level Marketing Manager Earning $72,000 (Bi-Weekly, Florida)',
      description: 'A marketing manager in Florida earns $72,000 paid bi-weekly. Voluntary deductions: 5% 401(k) ($3,600) and $1,200 Section 125 health insurance. FICA wages = $70,800. Social Security = $4,389.60; Medicare = $1,026.60. Federal taxable income after $15,300 standard deduction = $51,900 ($67,200 - $15,300), producing $6,252.00 in federal income tax. Florida state tax = $0.00. Net annual pay = $55,531.80 ($2,135.84 per bi-weekly paycheck), retaining over 77.1% of contractual gross earnings.',
    },
    {
      title: 'Head of Household Single Parent at $58,000 (Weekly, Illinois)',
      description: 'A single parent in Illinois earns $58,000 paid weekly (52 paychecks). They contribute $2,000 to a 401(k) and $1,500 to Section 125 insurance. FICA wages = $56,500. FICA taxes: Social Security = $3,503.00; Medicare = $819.25. Federal taxable income after $22,950 HoH standard deduction = $31,550, generating $3,440.00 in federal tax. Illinois flat tax (4.95%) after basic exemption = $2,640.00. Net annual take-home = $44,097.75, delivering $848.03 take-home pay every Friday.',
    },
  ],
  faqs: [
    {
      question: 'What is IRS Form W-2 and what do the different wage boxes represent?',
      answer: 'Form W-2 (Wage and Tax Statement) is the official IRS tax document provided annually by employers detailing gross compensation, statutory tax withholdings, and pre-tax benefit deductions. Key boxes include: Box 1 (Taxable Federal Wages, which excludes pre-tax 401(k), HSA, and Section 125 deductions); Box 2 (Federal Income Tax Withheld); Box 3 (Social Security Wages, capped at $176,100 for 2026, which includes 401(k) contributions); Box 4 (Social Security Tax Withheld at 6.2%); Box 5 (Medicare Wages, uncapped); Box 6 (Medicare Tax Withheld at 1.45% + 0.9% additional); Box 16 (State Taxable Wages); and Box 17 (State Income Tax Withheld).',
    },
    {
      question: 'Why is Box 1 (Federal Wages) different from Box 3 (Social Security Wages) on my W-2?',
      answer: 'Box 1 and Box 3 differ primarily because of employer-sponsored retirement plans. Under Internal Revenue Code § 3121(v), contributions to traditional 401(k) or 403(b) retirement plans reduce your federal income taxable wages (Box 1), but are NOT exempt from FICA payroll taxes (Boxes 3 and 5). Consequently, if you earn $100,000 and contribute $10,000 to a 401(k), Box 1 will report $90,000 while Box 3 and Box 5 will report $100,000.',
    },
    {
      question: 'What are the 2026 FICA tax rates and statutory wage limits?',
      answer: 'Under the Federal Insurance Contributions Act (FICA), employee payroll taxes consist of: (1) Social Security (OASDI): 6.2% on earnings up to the 2026 wage base cap of $176,100 (maximum employee withholding of $10,918.20); (2) Medicare (HI): 1.45% on all earnings without any dollar cap; (3) Additional Medicare Tax: 0.9% on wages exceeding $200,000 (Single/HoH) or $250,000 (Married Filing Jointly). Employers match the 6.2% Social Security and 1.45% Medicare taxes dollar-for-dollar, but do not match the 0.9% Additional Medicare surtax.',
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
      description: 'Calculate state income tax liabilities and cross-state relocation savings across all 50 states',
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
};

export default seoData;
