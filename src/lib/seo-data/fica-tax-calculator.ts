const seoData = {
  breadcrumbs: [
    { label: 'Calculators', href: '/calculators' },
    { label: 'FICA Tax Calculator', href: '/calculators/fica-tax-calculator' },
  ],
  tableOfContents: [
    { id: 'how-to-calculate', label: 'How to Calculate' },
    { id: 'formula', label: 'Formula' },
    { id: 'worked-examples', label: 'Worked Examples' },
    { id: 'benchmarks-reference', label: 'Benchmarks & Tables' },
    { id: 'in-depth-guide', label: 'In-Depth Guide' },
    { id: 'frequently-asked-questions', label: 'FAQs' },
    { id: 'related-calculators', label: 'Related Calculators' },
  ],
  howToSteps: [
    'Enter your annual gross wages or net self-employment income — include salary, hourly wages, tips, commissions, and taxable bonuses subject to FICA.',
    'Select your employment classification: W-2 Employee (7.65% employee share + 7.65% employer match) or 1099 Self-Employed / Independent Contractor (15.3% SECA tax on 92.35% of net earnings).',
    'Select your federal tax filing status (Single, Married Filing Jointly, or Head of Household) so the calculator applies the exact IRS Additional Medicare Tax threshold ($200,000 Single/HOH or $250,000 Married Filing Jointly).',
    'Review your itemized 2026 Social Security (OASDI) tax capped at the $184,500 wage base ($11,439.00 max employee share), standard 1.45% Medicare (HI) tax, and 0.9% Additional Medicare surtax.',
    'Compare the Employee Share, Employer Match, and Total Combined FICA liability—or inspect the 50% above-the-line Schedule SE income tax deduction if you are self-employed.',
  ],
  formula:
    'Social Security Tax (W-2 Employee) = min(Gross Wages, $184,500) × 6.2%  [Max: $11,439.00]\n' +
    'Medicare Tax (W-2 Employee) = Gross Wages × 1.45%  [No Wage Cap]\n' +
    'Additional Medicare Tax = max(0, Gross Wages − Threshold) × 0.9%\n' +
    'Self-Employment (SECA) Taxable Base = Net SE Profit × 92.35%\n' +
    'Self-Employment Tax = min(SE Base, $184,500) × 12.4% + (SE Base × 2.9%)',
  formulaDescription:
    'Under the Federal Insurance Contributions Act (FICA), payroll taxes fund two mandatory programs: Old-Age, Survivors, and Disability Insurance (Social Security / OASDI) and Hospital Insurance (Medicare / HI). For 2026, the Social Security tax rate is 6.2% for the employee and 6.2% for the employer (12.4% combined) up to the statutory wage cap of $184,500. Medicare is taxed at 1.45% each for employee and employer (2.9% combined) on every dollar of covered wages with no upper limit, plus an employee-only 0.9% Additional Medicare surtax above statutory income thresholds.',
  workedExamples: [
    {
      title: 'Standard W-2 Employee Earning $85,000 (Below Social Security Cap)',
      description:
        'A single W-2 employee earning $85,000 in 2026 is below both the $184,500 Social Security cap and the $200,000 Additional Medicare threshold. Employee Social Security = $85,000 × 6.2% = $5,270.00. Employee Medicare = $85,000 × 1.45% = $1,232.50. Total Employee FICA Withheld = $6,502.50 (7.65% effective FICA rate, or $250.10 per bi-weekly paycheck). The employer pays an identical $6,502.50 match, bringing total combined FICA remitted to the IRS to $13,005.00.',
    },
    {
      title: 'High-Earning W-2 Executive at $260,000 (Single Filer — Hits SS Cap & Additional Medicare)',
      description:
        'At $260,000 in 2026, Social Security tax stops once YTD wages reach $184,500: $184,500 × 6.2% = $11,439.00 (the 2026 maximum). Standard Medicare applies to all wages: $260,000 × 1.45% = $3,770.00. Because wages exceed the $200,000 Single threshold by $60,000, the employee also pays the 0.9% Additional Medicare Tax: $60,000 × 0.9% = $540.00. Total Employee FICA = $11,439 + $3,770 + $540 = $15,749.00 (6.06% effective FICA rate). Note that the employer does NOT match the $540 Additional Medicare tax, so the employer’s FICA share is $11,439 + $3,770 = $15,209.00.',
    },
    {
      title: '1099 Independent Contractor / Freelancer with $120,000 Net Schedule C Profit',
      description:
        'A self-employed consultant with $120,000 net business profit first multiplies net profit by 92.35% (IRS Schedule SE adjustment) to get a taxable SECA base of $110,820.00. Social Security portion (12.4%) = $110,820 × 12.4% = $13,741.68. Medicare portion (2.9%) = $110,820 × 2.9% = $3,213.78. Total Self-Employment Tax = $16,955.46 (an effective rate of 14.13% on gross net profit). On Form 1040 Schedule 1, the freelancer deducts 50% of SE tax ($8,477.73) as an above-the-line adjustment to Adjusted Gross Income (AGI).',
    },
    {
      title: 'Worker Switching Jobs Mid-Year ($130,000 at Job A + $100,000 at Job B)',
      description:
        'Each employer must withhold 6.2% Social Security independently up to $184,500 without considering wages from other employers. Job A withholds $130,000 × 6.2% = $8,060.00, and Job B withholds $100,000 × 6.2% = $6,200.00, for a combined Social Security withholding of $14,260.00 across $230,000 in total wages. Because the 2026 statutory cap is $11,439.00, the worker has overpaid Social Security tax by $2,821.00 ($14,260 − $11,439) and claims the full $2,821.00 excess as a refundable credit on Form 1040 Schedule 3, Line 11.',
    },
  ],
  benchmarkTables: [
    {
      title: '2026 FICA & SECA Tax Rates, Wage Caps, and Maximum Tax Thresholds',
      subtitle:
        'Official 2026 statutory payroll tax parameters published by the Social Security Administration (SSA) and Internal Revenue Service (IRS Publication 15).',
      headers: [
        'Tax Component',
        'W-2 Employee Rate',
        'Employer Match Rate',
        '1099 Self-Employed (SECA)',
        '2026 Wage Base / Threshold',
        '2026 Max Employee Tax',
      ],
      rows: [
        ['Social Security (OASDI)', '6.20%', '6.20%', '12.40% (on 92.35% net)', 'Up to $184,500', '$11,439.00 ($22,878 SECA)'],
        ['Regular Medicare (HI)', '1.45%', '1.45%', '2.90% (on 92.35% net)', 'No Wage Limit (All Earnings)', 'Uncapped'],
        ['Combined Base FICA', '7.65%', '7.65%', '15.30% (14.13% effective)', 'First $184,500 of Earnings', '$14,114.25 at $184,500'],
        ['Additional Medicare Surtax', '0.90%', '0.00% (No Match)', '0.90%', '>$200k Single / >$250k MFJ / >$125k MFS', 'Uncapped above threshold'],
      ],
    },
    {
      title: '2026 W-2 Employee vs. 1099 Self-Employed FICA Tax Liability by Income Level (Single Filer)',
      subtitle:
        'Side-by-side comparison of employee FICA withholding versus total 1099 self-employment tax across common income brackets in 2026.',
      headers: [
        'Annual Income / Net Profit',
        'W-2 Social Security (6.2%)',
        'W-2 Medicare (1.45% + 0.9%)',
        'Total W-2 Employee FICA',
        '1099 Total SECA Tax (15.3% on 92.35%)',
        '1099 Deductible Half (Schedule 1)',
      ],
      rows: [
        ['$50,000', '$3,100.00', '$725.00', '$3,825.00 (7.65%)', '$7,064.78 (14.13%)', '$3,532.39'],
        ['$75,000', '$4,650.00', '$1,087.50', '$5,737.50 (7.65%)', '$10,597.16 (14.13%)', '$5,298.58'],
        ['$100,000', '$6,200.00', '$1,450.00', '$7,650.00 (7.65%)', '$14,129.55 (14.13%)', '$7,064.78'],
        ['$150,000', '$9,300.00', '$2,175.00', '$11,475.00 (7.65%)', '$21,194.33 (14.13%)', '$10,597.16'],
        ['$184,500 (2026 SS Cap)', '$11,439.00', '$2,675.25', '$14,114.25 (7.65%)', '$26,068.99 (14.13%)', '$13,034.50'],
        ['$250,000', '$11,439.00', '$4,075.00 (incl. $450 Add. Med)', '$15,514.00 (6.21%)', '$29,858.38 (11.94%)', '$14,799.56'],
        ['$400,000', '$11,439.00', '$7,600.00 (incl. $1,800 Add. Med)', '$19,039.00 (4.76%)', '$35,086.13 (8.77%)', '$16,743.44'],
      ],
    },
  ],
  deepDiveSections: [
    {
      title: 'How the 2026 Social Security Wage Base Cap ($184,500) Works on Your Paycheck',
      paragraphs: [
        'Each autumn, the Social Security Administration adjusts the Old-Age, Survivors, and Disability Insurance (OASDI) contribution and benefit base according to changes in the National Average Wage Index (NAWI). For tax year 2026, the taxable maximum rises to $184,500 (up from $176,100 in 2025).',
        'If you earn more than $184,500 at a single job, your employer withholds 6.2% Social Security tax from every paycheck until your cumulative year-to-date taxable wages cross $184,500—at which point your Social Security deduction hits the $11,439.00 annual ceiling and drops to $0.00 for the remainder of the calendar year. For an executive earning $276,750 paid bi-weekly ($10,644.23 per paycheck), Social Security withholding of $659.94 per check stops halfway through the 18th paycheck in September, instantly boosting net take-home pay by $659.94 per paycheck for the final 8 pay periods of the year.',
      ],
    },
    {
      title: 'Understanding the 0.9% Additional Medicare Surtax & Employer Withholding Rule',
      paragraphs: [
        'Introduced under the Affordable Care Act, the 0.9% Additional Medicare Tax applies to earned income exceeding statutory thresholds based on filing status: $200,000 for Single, Head of Household, or Qualifying Surviving Spouse; $250,000 for Married Filing Jointly; and $125,000 for Married Filing Separately. Unlike regular FICA, there is zero employer matching contribution on the 0.9% surtax.',
        'Crucially, IRS payroll rules require employers to begin withholding the 0.9% Additional Medicare Tax as soon as an individual employee’s year-to-date wages exceed $200,000—regardless of the employee’s W-4 filing status. This creates two common tax-time surprises on IRS Form 8959: (1) A married couple where each spouse earns $140,000 ($280,000 combined) will have $0 Additional Medicare withheld by their employers because neither spouse exceeded $200,000 individually, yet they owe $270 ($30,000 × 0.9%) when filing jointly; and (2) A single-income married earner making $230,000 with a non-working spouse will have $270 withheld on the $30,000 above $200,000, but receives a full $270 credit on Form 1040 because their joint income is below the $250,000 MFJ threshold.',
      ],
    },
    {
      title: 'Why Self-Employed Workers Multiply Net Profit by 92.35% Before Calculating SECA Tax',
      paragraphs: [
        'Under the Self-Employment Contributions Act (SECA), sole proprietors, independent contractors, and general partners pay both the 7.65% employee share and the 7.65% employer share of FICA (15.3% combined). However, W-2 employees do not pay FICA tax on the 7.65% employer match paid on their behalf by their company.',
        'To put 1099 workers on equal footing with W-2 employees, the IRS allows self-employed taxpayers to subtract 7.65% from 100% of their net business profit—leaving 92.35% (1 − 0.0765 = 0.9235) as the taxable SECA base on Schedule SE. Additionally, 50% of your calculated SECA tax (excluding any 0.9% Additional Medicare Tax) is deductible as an above-the-line adjustment on Form 1040 Schedule 1, reducing your federal and state income tax liability even if you take the standard deduction.',
      ],
    },
  ],
  faqs: [
    {
      question: 'What is FICA tax and why is it deducted from my paycheck?',
      answer:
        'FICA stands for the Federal Insurance Contributions Act, the federal payroll tax law enacted in 1935 that funds Social Security retirement, disability, and survivor benefits (OASDI) as well as Medicare Hospital Insurance (HI). For W-2 employees, FICA is a mandatory 7.65% payroll deduction (6.2% Social Security + 1.45% Medicare) matched dollar-for-dollar by your employer.',
    },
    {
      question: 'What is the 2026 Social Security tax limit and maximum withholding?',
      answer:
        'For 2026, the Social Security taxable wage base limit is $184,500. Any wages you earn above $184,500 are exempt from the 6.2% Social Security tax, capping the maximum annual employee withholding at $11,439.00 (and the maximum self-employed Social Security tax at $22,878.00). Regular Medicare tax (1.45%) has no income cap.',
    },
    {
      question: 'Do 401(k) contributions or health insurance premiums reduce FICA taxes?',
      answer:
        'It depends on the benefit type! Pre-tax Section 125 cafeteria plan deductions—such as employer-sponsored medical, dental, vision insurance premiums, Health Savings Account (HSA) payroll contributions, and Flexible Spending Accounts (FSA)—are exempt from both federal income tax AND FICA taxes (saving you 7.65%). However, traditional pre-tax 401(k), 403(b), and 457(b) retirement contributions only reduce federal/state income tax; they are still 100% subject to FICA Social Security and Medicare taxes.',
    },
    {
      question: 'What happens if I worked two jobs and paid more than $11,439 in Social Security tax?',
      answer:
        'If you worked for two or more unrelated employers during 2026 and your combined wages exceeded $184,500, each employer was legally required to withhold 6.2% Social Security up to $184,500 independently. When you file your federal tax return (Form 1040), any Social Security tax withheld above $11,439.00 is claimed on Schedule 3, Line 11 ("Excess Social Security and tier 1 RRTA tax withheld") and refunded to you dollar-for-dollar.',
    },
    {
      question: 'How can S-Corp owners legally reduce self-employment FICA taxes?',
      answer:
        'Whereas a single-member LLC or sole proprietor pays 15.3% SECA tax on 92.35% of all net business profits, an LLC or corporation electing S-Corporation status (IRS Form 2553) splits owner earnings into two buckets: (1) a "reasonable W-2 salary" subject to normal FICA taxes, and (2) shareholder distributions, which are exempt from the 15.3% FICA/SECA payroll tax. The IRS strictly requires the W-2 salary to reflect fair market compensation for the services performed before any FICA-free distributions are taken.',
    },
    {
      question: 'Are anyone’s wages exempt from FICA taxes?',
      answer:
        'A few narrow statutory exemptions exist under IRC Section 3121: (1) students employed by the college or university they attend full-time (the student FICA exception); (2) certain nonresident aliens on F-1, J-1, M-1, or Q-1 visas performing authorized work; (3) children under age 18 employed by a parent’s sole proprietorship or spousal partnership; and (4) state/local government employees covered by a qualifying public pension system formed prior to mandatory Social Security coverage.',
    },
  ],
  relatedTools: [
    { slug: 'hourly-paycheck-calculator', title: 'Hourly Paycheck Calculator', description: 'Full 2026 paycheck after federal, FICA & state tax', icon: 'CreditCard' },
    { slug: 'self-employment-tax-calculator', title: 'Self-Employment Tax Calculator', description: 'Calculate 1099 SECA tax & quarterly estimates', icon: 'FileText' },
    { slug: 'contractor-vs-employee-calculator', title: '1099 vs. W-2 Calculator', description: 'Compare net pay after self-employment FICA', icon: 'ArrowLeftRight' },
    { slug: 'after-tax-income-calculator', title: 'After-Tax Income Calculator', description: 'Annual net take-home pay after all taxes', icon: 'Wallet' },
    { slug: 'payroll-deduction-calculator', title: 'Payroll Deduction Calculator', description: 'See how Section 125 & 401(k) affect FICA', icon: 'FileMinus' },
    { slug: 'tax-bracket-calculator', title: 'Tax Bracket Calculator', description: '2026 IRS marginal & effective tax brackets', icon: 'Landmark' },
  ],
};

export default seoData;
