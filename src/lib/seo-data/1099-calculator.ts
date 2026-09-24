const seoData = {
  breadcrumbs: [{ label: 'Calculators' }, { label: '1099 Calculator' }],
  tableOfContents: [
    { id: 'how-to-calculate', label: 'How to Calculate' },
    { id: 'formula', label: 'SECA & Income Tax Formulas' },
    { id: 'worked-examples', label: 'Worked Examples & Contractor Scenarios' },
    { id: 'frequently-asked-questions', label: 'FAQs' },
    { id: 'statutory-sources', label: 'Statutory Sources' },
    { id: 'related-calculators', label: 'Related Calculators' },
  ],
  howToSteps: [
    'Enter your total 1099 gross revenue — all client payments, contract compensation, and gross invoices reported on Form 1099-NEC or Form 1099-K.',
    'Enter total deductible business expenses from Schedule C (Form 1040), such as home office deductions, mileage, software, supplies, equipment depreciation, and subcontractor costs.',
    'Select your federal tax filing status: Single, Married Filing Jointly, Head of Household, or Married Filing Separately.',
    'Select your state of business operation to auto-populate applicable state income tax rates, or customize the state flat tax percentage.',
    'Click "Calculate 1099 Taxes" to compute net business profit, 15.3% SECA self-employment tax, 20% Section 199A QBI deduction, federal income tax, and net spendable take-home pay.',
    'Inspect the IRS Form 1040-ES quarterly estimated tax payment schedule to see exact payment amounts and calendar deadlines (April 15, June 15, September 15, January 15).',
    'Review the detailed reconciliation breakdown to observe how above-the-line half-SECA deduction and QBI reduce your taxable income.',
  ],
  formula: 'Schedule C Net Profit:\nNet Self-Employment Income = 1099 Gross Revenue - Allowable Business Expenses\n\nSECA Self-Employment Tax (IRC § 1401):\nSECA Taxable Base = Net Profit × 92.35% (0.9235)\nSocial Security Portion (OASDI) = 12.4% × Min(SECA Taxable Base, $176,100 Statutory Cap)\nMedicare Portion (HI) = 2.9% × SECA Taxable Base + 0.9% Additional Medicare on earnings exceeding $200k (Single) / $250k (MFJ)\nTotal SECA Tax = Social Security Portion + Medicare Portion\n\nAbove-the-Line Tax Deduction:\nOne-Half SECA Deduction (IRC § 164(f)) = Total SECA Tax ÷ 2\n\nSection 199A Qualified Business Income (QBI) Deduction:\nQBI Deduction = Net Profit × 20% (subject to taxable income phase-out thresholds: $241,950 Single / $483,900 MFJ for SSTBs)\n\nFederal Income Tax Withholding:\nTaxable Federal Income = Max(0, Net Profit - Half-SECA Deduction - QBI Deduction - Standard Deduction)\nFederal Income Tax = ∑ (Taxable Federal Income in Bracket_i × Statutory Rate_i)\n\nQuarterly Form 1040-ES Estimated Payments:\nQuarterly Payment = (Total SECA Tax + Federal Income Tax + State Tax) ÷ 4',
  formulaDescription: 'Independent contractors and freelancers receiving 1099-NEC compensation are considered self-employed sole proprietors under the Internal Revenue Code. Unlike W-2 employees whose employers absorb half of FICA taxes, 1099 contractors pay the entire 15.3% Self-Employment Contributions Act (SECA) tax (12.4% Social Security up to $176,100 + 2.9% Medicare uncapped). To offset this burden, the IRS grants two substantial statutory tax deductions: (1) An above-the-line deduction equal to 50% of your SECA tax liability under IRC § 164(f), and (2) The Section 199A Qualified Business Income (QBI) deduction, allowing eligible pass-through businesses to deduct 20% of net profits from federal income tax.',
  workedExamples: [
    {
      title: 'Freelance Software Developer Earning $110,000 with $15,000 Expenses',
      description: 'A freelance developer earns $110,000 on 1099-NEC contracts and incurs $15,000 in legitimate Schedule C deductible expenses (equipment, cloud hosting, home office, software). Net profit = $95,000. SECA taxable base = $95,000 × 0.9235 = $87,732.50. SECA tax = $87,732.50 × 15.3% = $13,423.07 ($10,878.83 Social Security + $2,544.24 Medicare). Statutory half-SECA deduction = $6,711.54. Section 199A QBI deduction (20%) = $19,000. Taxable income after $15,300 Single standard deduction = $53,988.46 ($95,000 - $6,711.54 - $19,000 - $15,300). Federal income tax = $6,700.46. Total federal taxes = $20,123.53. Net annual take-home = $74,876.47, requiring quarterly estimated tax payments of $5,030.88.',
    },
    {
      title: 'Independent Management Consultant at $180,000 (Single, Texas - No State Tax)',
      description: 'A 1099 strategic consultant in Texas earns $180,000 with $20,000 in business expenses. Net Schedule C earnings = $160,000. SECA taxable base = $147,760. SECA tax: Social Security (12.4% on $147,760) = $18,322.24; Medicare (2.9% on $147,760) = $4,285.04. Total SECA = $22,607.28. Deductions: 50% SECA deduction = $11,303.64; 20% QBI deduction = $32,000; Standard deduction = $15,300. Federal taxable income = $101,396.36. Federal income tax = $17,043.13. Texas state tax = $0.00. Total annual tax = $39,650.41 (effective tax rate 24.78% of net profit). Net annual take-home = $120,349.59 ($10,029.13/month). Form 1040-ES quarterly payment = $9,912.60.',
    },
    {
      title: 'High-Earning 1099 Medical Specialist at $350,000 (Exceeds Social Security Wage Base)',
      description: 'A locum tenens physician earns $350,000 gross with $30,000 in expenses, yielding $320,000 net profit. SECA base = $320,000 × 0.9235 = $295,520. Because earnings exceed the $176,100 cap, Social Security tax is capped at $21,836.40 ($176,100 × 12.4%). Medicare tax includes 2.9% on all $295,520 ($8,570.08) plus 0.9% Additional Medicare on earnings exceeding $200,000 ($859.68), totaling $31,266.16 in SECA tax. Half-SECA deduction = $15,633.08. Note: As a healthcare Specified Service Trade or Business (SSTB) earning over $241,950, the Section 199A QBI deduction phases out completely to $0. Federal taxable income = $289,066.92. Federal tax = $67,738.92. Total taxes = $99,005.08. Quarterly payment = $24,751.27.',
    },
    {
      title: 'Creative Marketing Contractor at $65,000 with Modest Expenses ($5,000)',
      description: 'A freelance copywriter earns $65,000 on 1099s with $5,000 in Schedule C expenses. Net profit = $60,000. SECA taxable base = $55,410. SECA tax = $8,477.73. Deductions: Half-SECA = $4,238.87; 20% QBI = $12,000; Standard deduction = $15,300. Taxable income = $28,461.13. Federal income tax = $3,172.34. State tax (5%) = $2,250.00. Total tax = $13,899.07. Net annual spendable take-home = $46,100.93. Form 1040-ES quarterly estimated voucher = $3,474.77.',
    },
    {
      title: '1099 Contractor vs. W-2 Employee Compensation Parity ($100k Benchmark)',
      description: 'Comparing a $100,000 W-2 job offer versus a $100,000 1099 contract. For W-2, employee FICA is 7.65% ($7,650), leaving ~$76,500 after taxes. For 1099 with $0 expenses, SECA tax is 15.3% on $92,350 ($14,129.55). Even after a $20,000 QBI deduction and half-SECA deduction, 1099 net take-home is roughly $72,200 — approx. $4,300 lower than W-2. To achieve true take-home and benefits parity with a $100,000 W-2 salary, a 1099 contractor must bill between $125,000 and $135,000 to cover self-employment tax, uncompensated health insurance, PTO, and retirement match.',
    },
  ],
  faqs: [
    {
      question: 'What is a 1099 contractor and how does nonemployee compensation differ from W-2?',
      answer: 'A 1099 independent contractor is a self-employed business owner or freelance professional hired by companies to perform specific projects. Employers report contractor earnings on IRS Form 1099-NEC (Nonemployee Compensation) rather than Form W-2. Crucially, clients do not withhold federal income tax, state income tax, or FICA payroll taxes from 1099 checks. Contractors receive gross payments and must budget for and pay their own taxes quarterly using Form 1040-ES.',
    },
    {
      question: 'What is the SECA self-employment tax rate and why is it 15.3%?',
      answer: 'The Self-Employment Contributions Act (SECA) tax is 15.3% on net self-employment earnings. It comprises 12.4% for Social Security (OASDI) on earnings up to the annual statutory cap ($176,100 in 2026) and 2.9% for Medicare (HI) on all net earnings with no limit. W-2 employees split this 15.3% equally with their employer (7.65% each); independent contractors must pay both halves because they function as both the employer and employee.',
    },
    {
      question: 'Why is SECA tax calculated on 92.35% (0.9235) of net profit instead of 100%?',
      answer: 'Under Internal Revenue Code § 1402(a)(12), self-employed individuals calculate SECA tax on 92.35% of their net profit (100% minus 7.65%). This statutory adjustment ensures tax parity with W-2 employees, whose employer-paid half of FICA (7.65%) is not counted as taxable employee compensation.',
    },
    {
      question: 'How does the 20% Section 199A Qualified Business Income (QBI) deduction work?',
      answer: 'Enacted under the Tax Cuts and Jobs Act (TCJA), the Section 199A QBI deduction permits eligible sole proprietors, single-member LLCs, and S-corporation owners to deduct up to 20% of their qualified net business profit directly from their federal taxable income. For 2026, the full 20% deduction is available for all businesses with taxable income under $241,950 (Single) or $483,900 (Married Filing Jointly). Above these limits, the deduction phases out for Specified Service Trades or Businesses (SSTBs), including health, law, accounting, consulting, athletics, and financial services.',
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
      answer: 'Legitimate business deductions include: home office expenses (simplified deduction of $5/sq ft up to 300 sq ft, or actual allocated housing costs), business vehicle mileage (standard IRS rate of 67¢/mile), software and SaaS subscriptions, advertising and website hosting, professional liability insurance, legal and accounting fees, equipment depreciation (Section 179 expensing), contractor labor, and self-employed health insurance premiums.',
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
      description: 'Compute state personal income taxes across all 50 states and flat-tax jurisdictions',
      icon: 'FileSpreadsheet',
    },
    {
      slug: 'fica-tax-calculator',
      title: 'FICA Tax Calculator',
      description: 'Calculate employee vs. employer mandatory FICA payroll contributions',
      icon: 'Shield',
    },
  ],
};

export default seoData;
