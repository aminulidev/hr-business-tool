const seoData = {
  // ------ SEO content ------

  howToSteps: [
    'Select your filing status: Single, Married Filing Jointly, Married Filing Separately, or Head of Household. This determines your tax brackets and standard deduction.',
    'Enter your annual gross income — this is your total income before any taxes, deductions, or exemptions are applied. Include wages, salaries, tips, and other taxable income.',
    'Enter the federal and state tax amounts withheld year-to-date (YTD). You can find these on your pay stubs or W-2 form in boxes 2 (federal) and 17 (state).',
    'Choose between the standard deduction or itemized deductions. The standard deduction is a flat amount based on your filing status. Itemized deductions include mortgage interest, charitable contributions, and state/local taxes (SALT, capped at $10,000). Enter any applicable tax credits.',
    'Click "Calculate Refund" to see your estimated federal and state tax liability, total withholding, and whether you will receive a refund or owe additional taxes. Review the bracket-by-bracket breakdown for a detailed view.',
  ],

  formula: 'Refund = Total Tax Withheld − Total Tax Liability',
  formulaDescription:
    'Your tax refund is the difference between what was withheld from your paychecks (federal and state) and your actual tax liability. Tax liability is calculated using progressive tax brackets — each portion of your taxable income is taxed at a different rate. Your taxable income is your gross income minus deductions (standard or itemized). Tax credits are then subtracted directly from your federal tax liability, reducing it dollar-for-dollar. If your total withholding exceeds your total tax, you receive a refund. If your withholding falls short, you owe additional taxes. The 2025 standard deductions are: Single $15,000, Married Filing Jointly $30,000, Married Filing Separately $15,000, Head of Household $22,500.',

  workedExamples: [
    {
      title: 'Single, $65,000 Income, $8,500 Federal Withheld',
      description:
        'A single filer earning $65,000 with $8,500 federal tax withheld and no state tax withheld. Standard deduction: $14,600. Taxable income: $65,000 - $14,600 = $50,400. Federal tax: $1,160 (10% bracket on first $11,600) + $4,266 (12% bracket on $35,550) + $719 (22% bracket on $3,270) = $6,145. State tax estimate (5%): $2,520. Total tax: $8,665. Total withholding: $8,500. Amount owed: $165.',
    },
    {
      title: 'Married Filing Jointly, $120,000, $15,000 Federal + $5,000 State Withheld',
      description:
        'A married couple filing jointly with $120,000 combined income. Federal withheld: $15,000. State withheld: $5,000. Standard deduction: $29,200. Taxable income: $90,800. Federal tax: $2,320 (10% on first $23,200) + $8,532 (12% on $71,100) + $1,353 (22% on $6,150) = $12,205. State tax (5%): $4,540. Total tax: $16,745. Total withholding: $20,000. Estimated refund: $3,255.',
    },
    {
      title: 'Head of Household, $45,000 Income, $4,200 Federal Withheld, $1,000 Credits',
      description:
        'A head of household filer earning $45,000 with $4,200 federal tax withheld and $1,000 in tax credits. Standard deduction: $21,900. Taxable income: $23,100. Federal tax: $1,655 (10% on first $16,550) + $723 (12% on $6,025) = $2,378. After $1,000 in credits: $1,378. State tax (5%): $1,155. Total tax: $2,533. Total withholding: $4,200. Estimated refund: $1,667.',
    },
  ],

  faqs: [
    {
      question: 'When will I get my tax refund?',
      answer:
        'The IRS typically issues most refunds within 21 calendar days after accepting your e-filed return. Paper returns take longer — usually 6-8 weeks. You can check your refund status using the IRS "Where\'s My Refund?" tool on their website or the IRS2Go mobile app. Your refund may be delayed if there are errors on your return, if you claimed the Earned Income Tax Credit (EITC) or Additional Child Tax Credit (ACTC — these refunds are not issued before mid-February), if your return requires manual review, or if you are affected by identity theft protections. Filing electronically with direct deposit is the fastest way to receive your refund.',
    },
    {
      question: 'How do I check my tax refund status?',
      answer:
        'You can check your federal refund status online using the IRS "Where\'s My Refund?" tool at irs.gov/refunds. You will need your Social Security number, filing status, and the exact refund amount shown on your return. The tool updates once per day, usually overnight. For state refunds, check your state\'s department of revenue or taxation website — most states have their own refund tracking tools. You can also call the IRS refund hotline at 1-800-829-1954, but online tools are generally faster and more detailed.',
    },
    {
      question: 'What if I owe money instead of getting a refund?',
      answer:
        'If your calculation shows you owe taxes, you still need to file your return by the deadline (typically April 15). You can pay online through the IRS Direct Pay system, by credit or debit card, by electronic funds withdrawal, or by check or money order. If you cannot pay the full amount, you can request an installment agreement with the IRS. The penalty for failing to file is much higher than the penalty for failing to pay, so always file on time even if you cannot pay. You may also be able to reduce your balance through an offer in compromise or by applying for currently not collectible status if you are experiencing financial hardship.',
    },
    {
      question: 'Should I take the standard deduction or itemize?',
      answer:
        'You should choose whichever deduction amount is larger. The 2025 standard deductions are: Single $15,000, Married Filing Jointly $30,000, Married Filing Separately $15,000, Head of Household $22,500. You should itemize if your qualifying expenses exceed these amounts. Common itemized deductions include: mortgage interest (on up to $750,000 of mortgage debt), state and local taxes (SALT deduction, capped at $10,000), charitable contributions, medical expenses exceeding 7.5% of your AGI, and casualty and theft losses from federally declared disasters. Since the Tax Cuts and Jobs Act of 2017, roughly 90% of taxpayers take the standard deduction because it was nearly doubled.',
    },
    {
      question: 'What is the difference between tax credits and tax deductions?',
      answer:
        'Tax deductions reduce your taxable income, while tax credits reduce your tax liability directly. Deductions lower the amount of income subject to tax — for example, a $10,000 deduction saves you $1,200 in taxes if you are in the 12% bracket. Credits reduce your actual tax bill dollar-for-dollar — a $1,000 credit saves exactly $1,000 regardless of your bracket. Some credits are refundable (like the Earned Income Tax Credit and the Additional Child Tax Credit), meaning if the credit exceeds your tax liability, you receive the difference as a refund. Non-refundable credits (like the Child and Dependent Care Credit) can only reduce your tax to zero — any excess is lost. Credits are generally more valuable than deductions of the same amount.',
    },
    {
      question: 'How can I increase my tax refund?',
      answer:
        'To increase your refund, you can: (1) Maximize your deductions — contribute to a traditional IRA or 401(k), donate to charity, track medical expenses, and bundle deductions into one tax year if close to the itemization threshold. (2) Claim all eligible tax credits — child tax credit, education credits (American Opportunity and Lifetime Learning), earned income credit, and saver\'s credit. (3) Adjust your W-4 withholding — increasing withholding reduces your paycheck but increases your refund. However, getting a large refund means you are essentially giving the government an interest-free loan. It may be better to reduce withholding and invest the difference. (4) File jointly if married — this often results in a lower tax liability than filing separately, thanks to wider tax brackets. (5) Contribute to an HSA if you have a high-deductible health plan — contributions are tax-deductible.',
    },
  ],

  relatedTools: [
    { slug: 'tax-bracket-calculator', title: 'Tax Bracket Calculator', description: 'Find your federal tax bracket and effective tax rate', icon: 'FileText' },
    { slug: 'after-tax-income-calculator', title: 'After-Tax Income Calculator', description: 'Calculate your net income after federal and state taxes', icon: 'Wallet' },
    { slug: 'salary-tax-calculator', title: 'Salary Tax Calculator', description: 'See your total tax burden broken down by tax type', icon: 'Shield' },
    { slug: 'payroll-calculator', title: 'Payroll Calculator', description: 'Estimate your take-home pay after taxes and deductions', icon: 'CreditCard' },
    { slug: 'hourly-paycheck-calculator', title: 'Hourly Paycheck Calculator', description: 'Calculate your hourly take-home pay after taxes', icon: 'BadgeDollarSign' },
  ],

  
};

export default seoData;
