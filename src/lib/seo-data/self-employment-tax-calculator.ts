const seoData = {
  breadcrumbs: [{ label: 'Calculators' }, { label: 'Self-Employment Tax Calculator' }],
  tableOfContents: [
    { id: 'how-to-calculate', label: 'How to Calculate' },
    { id: 'formula', label: 'SECA Tax Formulas & Rules' },
    { id: 'worked-examples', label: 'Worked Practical Scenarios' },
    { id: 'frequently-asked-questions', label: 'Frequently Asked Questions' },
    { id: 'related-calculators', label: 'Related Tax & Payroll Calculators' },
  ],
  howToSteps: [
    'Choose your calculation method: enter bottom-line net profit directly (from Schedule C, line 31) or calculate it live by entering gross 1099 revenue and deductible business expenses.',
    'If you concurrently hold a W-2 day job, input your expected W-2 wages: Social Security taxes withheld on your W-2 wages credit toward your 2026 $176,100 wage cap, preventing double taxation.',
    'Select your filing status (Single or Married Filing Jointly) to calibrate the 0.9% Additional Medicare surtax threshold ($200,000 Single / $250,000 MFJ).',
    'The calculator applies IRC § 1402(a)(12) to compute net earnings subject to SECA (92.35% factor) and assesses 12.4% Social Security and 2.9% Medicare.',
    'Review the Form 1040-ES quarterly estimated tax payment schedule (Q1–Q4 deadlines), your 50% above-the-line deduction for Form 1040 Schedule 1, and the comparative W-2 FICA parity breakdown.',
  ],
  formula: 'SECA Net Taxable = Net Schedule C Profit x 92.35% (IRC § 1402(a)(12))\nRemaining SS Cap = max(0, $176,100 - Prior W-2 Wages)\nSocial Security Tax (12.4%) = min(SECA Net Taxable, Remaining SS Cap) x 12.4%\nMedicare Tax (2.9%) = SECA Net Taxable x 2.9%\nAdditional Medicare (0.9%) = max(0, Combined Wages & SECA Taxable - Threshold) x 0.9%\nTotal SECA Tax = Social Security Tax + Medicare Tax + Additional Medicare\nAbove-the-Line Deduction = Total SECA Tax x 50% (Form 1040 Schedule 1, Line 15)\nQuarterly Form 1040-ES Installment = Total SECA Tax / 4',
  formulaDescription: 'Self-Employment Contributions Act (SECA) tax (Internal Revenue Code § 1401) is the statutory mechanism by which independent contractors, freelancers, sole proprietors, and partners fund Social Security and Medicare. Unlike traditional W-2 employees where the employer pays 7.65% and withholds 7.65% from paychecks, self-employed individuals pay both halves totaling 15.3%. To maintain tax equity, Congress instituted two structural offsets: first, under IRC § 1402(a)(12), SECA tax is calculated on 92.35% of net profit (reflecting a 7.65% reduction for the employer half); second, under IRC § 164(f), exactly 50% of the calculated SECA tax is deductible as an above-the-line adjustment to adjusted gross income (AGI) on Form 1040 Schedule 1.',
  workedExamples: [
    {
      title: 'Solo Freelance Designer ($65,000 Net Profit)',
      description: 'A freelance UX designer reports $85,000 in gross 1099 client billings and $20,000 in deductible Schedule C expenses (MacBook depreciation, Figma subscriptions, travel, home office deduction), leaving $65,000 in net profit. Net earnings subject to SECA equal $65,000 x 92.35% = $60,027.50. Because $60,027.50 is well below the $176,100 Social Security cap, Social Security tax is $60,027.50 x 12.4% = $7,443.41, and Medicare tax is $60,027.50 x 2.9% = $1,740.80. Total 2026 SECA tax is $9,184.21 (effective rate of 14.13% of net profit). The designer takes a 50% above-the-line deduction of $4,592.11 on Form 1040 Schedule 1 and schedules quarterly Form 1040-ES installments of $2,296.05.',
    },
    {
      title: 'Software Engineer Moonlighting with W-2 Job ($140k W-2 + $60k 1099)',
      description: 'A senior developer earns $140,000 on a W-2 salary and $60,000 in net 1099 consulting profit. At the day job, $140,000 has already been subjected to Social Security FICA. The 2026 wage base cap is $176,100, leaving only $176,100 - $140,000 = $36,100 of remaining Social Security capacity. Consulting SECA taxable income is $60,000 x 92.35% = $55,410. Instead of paying 12.4% on all $55,410, Social Security tax is strictly limited to $36,100 x 12.4% = $4,476.40 (saving $2,394 in overpayments). Medicare (2.9%) applies to the full $55,410 = $1,606.89. Total SECA is $6,083.29, with an above-the-line deduction of $3,041.65.',
    },
    {
      title: 'High-Earning Independent Consultant ($240,000 Net Profit)',
      description: 'A management consultant operating as a sole proprietor clears $240,000 in net Schedule C earnings (Single filer). SECA taxable earnings equal $240,000 x 92.35% = $221,640. The 2026 Social Security tax hits the statutory maximum of $176,100 x 12.4% = $21,836.40. Uncapped Medicare tax is $221,640 x 2.9% = $6,427.56. Because SECA taxable earnings exceed the $200,000 Single filer threshold by $21,640, the 0.9% Additional Medicare surtax applies: $21,640 x 0.9% = $194.76. Total SECA liability equals $28,458.72 ($7,114.68/quarter). The consultant deducts $14,229.36 on Schedule 1, reducing federal taxable income significantly.',
    },
    {
      title: 'S-Corporation Election Optimization ($180,000 Operating Income)',
      description: 'An executive coach netting $180,000 evaluates electing S-Corporation status (Form 2553) versus remaining a sole proprietor. As a sole proprietor, SECA taxable earnings are $166,230 (92.35%), yielding $20,612.52 in SS tax (12.4%) + $4,820.67 in Medicare (2.9%) = $25,433.19 in SECA tax. By forming an S-Corp, the owner pays a reasonable W-2 salary of $80,000 (FICA taxes = 15.3% on $80k = $12,240) and takes the remaining $100,000 as an S-Corp shareholder distribution (which is exempt from FICA/SECA). Total payroll tax drops from $25,433.19 to $12,240, yielding annual net FICA tax savings of $13,193.19, even after accounting for payroll administrative and corporate tax filing costs.',
    },
    {
      title: 'Micro-Business & Side Gig Under the $400 Threshold ($380 Net Profit)',
      description: 'A freelance photographer does a single weekend photoshoot earning $500 with $120 in equipment rental expenses, resulting in $380 of net profit. Under Internal Revenue Code § 1402(b)(2), self-employed individuals with net annual earnings under $400 are entirely exempt from self-employment tax and are not required to file Schedule SE. Their SECA tax is $0. However, the $380 must still be reported on Schedule C and will be factored into adjusted gross income for ordinary income tax purposes if required to file a Form 1040.',
    },
    {
      title: 'Married Joint High-Income Partnership ($350,000 Active K-1 Earnings)',
      description: 'An equity partner in a medical consulting partnership receives a $350,000 Schedule K-1 with active self-employment earnings (Married Filing Jointly). SECA taxable base is $350,000 x 92.35% = $323,225. Social Security tax is capped at $176,100 x 12.4% = $21,836.40. Uncapped Medicare tax is $323,225 x 2.9% = $9,373.53. Under MFJ rules, the 0.9% Additional Medicare surtax kicks in over $250,000: ($323,225 - $250,000) x 0.9% = $659.03. Total SECA liability equals $31,868.96 ($7,967.24/quarter), generating an above-the-line deduction of $15,934.48.',
    },
  ],
  faqs: [
    {
      question: 'What is the self-employment tax rate for 2026 and what does it fund?',
      answer: 'For tax year 2026, the self-employment tax rate under the Self-Employment Contributions Act (SECA) is 15.3% on net earnings up to the Social Security wage base of $176,100. This 15.3% is split into two statutory components: 12.4% for Social Security (Old-Age, Survivors, and Disability Insurance - OASDI) and 2.9% for Medicare (Hospital Insurance - HI). Net earnings above $176,100 are exempt from the 12.4% Social Security portion but remain subject to the 2.9% Medicare tax with no dollar ceiling. If combined earned income exceeds $200,000 for single filers or $250,000 for married couples filing jointly, an Additional Medicare Tax of 0.9% applies to the excess under IRC § 1401(b)(2).',
    },
    {
      question: 'Why is self-employment tax calculated on 92.35% of net profit instead of 100%?',
      answer: 'Internal Revenue Code § 1402(a)(12) dictates that net self-employment earnings are multiplied by 92.35% (which is 100% minus 7.65%) before applying the 15.3% tax rate. This statutory formula exists to create mathematical parity between independent contractors and W-2 corporate employees. When an employer pays a W-2 worker $100,000, the employer also pays 7.65% ($7,650) in matching payroll taxes and deducts that $7,650 as an ordinary business expense, so the employer only provided $100,000 in gross pay out of $107,650 total compensation. Applying 92.35% ensures the self-employed person is not taxed on the portion of their revenue that corresponds to the employer-half payroll deduction.',
    },
    {
      question: 'How does the 50% above-the-line deduction work on Form 1040?',
      answer: 'Under IRC § 164(f), self-employed individuals can deduct exactly one-half (50%) of their calculated SECA tax directly on Form 1040 Schedule 1, Line 15. This is an "above-the-line" adjustment that reduces Adjusted Gross Income (AGI). Unlike itemized deductions (such as mortgage interest or charitable donations), this deduction is available to all self-employed taxpayers regardless of whether they choose the standard deduction or itemize. For example, if your total SECA tax is $14,000, your AGI is reduced by $7,000, lowering your ordinary federal and state income tax brackets.',
    },
    {
      question: 'What is the $400 filing threshold rule for Schedule SE?',
      answer: 'According to IRS guidelines under IRC § 1402(b)(2), if your net earnings from self-employment (after subtracting allowable business expenses) are less than $400 for the tax year, you do not owe any self-employment tax, and you are not required to complete Schedule SE. However, if your net earnings reach $400.00 or more, your entire net earnings (multiplied by 92.35%) become subject to SECA tax. Note that even if you owe $0 in SECA tax, you must still report the income on Schedule C and pay regular income tax if your total worldwide income exceeds the standard deduction threshold.',
    },
    {
      question: 'How do concurrent W-2 wages affect self-employment tax calculations?',
      answer: 'The Social Security wage cap ($176,100 in 2026) applies across all earned income combined, whether earned as a W-2 employee or through 1099 self-employment. Because W-2 wages have Social Security taxes withheld first by your employer, every dollar of W-2 wage reduces your remaining self-employment Social Security cap. For instance, if you earn $120,000 on a W-2 and $80,000 in net 1099 income, only $56,100 ($176,100 - $120,000) of your 1099 SECA taxable income is subject to the 12.4% Social Security tax; the rest is subject only to 2.9% Medicare. If your W-2 wages exceed $176,100, you pay 0% Social Security tax on your self-employment income.',
    },
    {
      question: 'When and how do self-employed individuals pay their SECA taxes?',
      answer: 'Because self-employed taxpayers have no employer withholding taxes from their pay, the IRS requires quarterly estimated tax payments using Form 1040-ES. The statutory deadlines are April 15 (Q1), June 15 (Q2), September 15 (Q3), and January 15 of the following year (Q4). To avoid underpayment penalties under IRC § 6654 (calculated on Form 2210), you must satisfy the IRS Safe Harbor rules by paying at least 90% of your current year total tax liability or 100% of your prior year tax liability (110% if your prior-year AGI exceeded $150,000). Payments can be made electronically through IRS Direct Pay or the Electronic Federal Tax Payment System (EFTPS).',
    },
    {
      question: 'How does an S-Corporation election reduce self-employment taxes?',
      answer: 'Sole proprietors and single-member LLCs pay 15.3% SECA tax on 100% of their net business profit (multiplied by 92.35%). By filing Form 2553 to elect S-Corporation tax status, the business owner becomes an employee-shareholder. The owner pays themselves a "reasonable salary" reported on Form W-2, subject to standard 15.3% FICA payroll taxes. Any remaining business profits can then be distributed as shareholder distributions, which are completely exempt from both FICA and SECA taxes. For businesses netting over $80,000–$100,000, this strategy frequently saves $5,000 to $20,000+ annually in payroll taxes, provided the W-2 salary satisfies IRS reasonable compensation standards.',
    },
    {
      question: 'Does the 50% SECA deduction interact with the Section 199A QBI deduction?',
      answer: 'Yes, the two deductions interact systematically. Under Treasury Regulation § 1.199A-3(b)(1)(vi), when determining Qualified Business Income (QBI) for the 20% Section 199A pass-through deduction, your net Schedule C income must be reduced by both the deductible 50% portion of your self-employment tax (Form 1040 Schedule 1, Line 15) and your self-employed health insurance deduction. For example, if you have $100,000 in net Schedule C profit and a $7,066 half-SECA deduction, your tentative QBI base is $92,934, resulting in a maximum potential QBI deduction of $18,586.80 (20% of $92,934).',
    },
  ],
  relatedTools: [
    { slug: '1099-calculator', title: '1099 Tax Calculator', description: 'Comprehensive independent contractor take-home pay, federal, and state taxes', icon: 'FileText' },
    { slug: 'fica-tax-calculator', title: 'FICA Tax Calculator', description: 'Calculate employee vs employer 7.65% Social Security and Medicare taxes', icon: 'Landmark' },
    { slug: 'contractor-vs-employee-calculator', title: '1099 vs W-2 Calculator', description: 'Detailed financial comparison between independent contractor and employee offers', icon: 'Briefcase' },
    { slug: 'federal-tax-calculator', title: 'Federal Tax Calculator', description: 'Estimate 2026 federal income tax brackets, standard deduction, and effective rates', icon: 'Landmark' },
    { slug: 'w-2-calculator', title: 'W-2 Paycheck Calculator', description: 'Itemize paycheck withholdings, federal tax, state tax, and net take-home pay', icon: 'FileText' },
    { slug: 'state-tax-calculator', title: 'State Tax Calculator', description: 'State income tax liabilities across all 50 US states with relocation comparisons', icon: 'MapPin' },
  ],
};

export default seoData;
