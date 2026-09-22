const seoData = {
  // ---------------------------------------------------------------------------

  howToSteps: [
    'Enter your total annual gross income in the field above. This is your income before any deductions or taxes.',
    'Select your filing status from the dropdown menu. Choose Single, Married Filing Jointly, Married Filing Separately, or Head of Household based on your tax situation.',
    'Toggle the standard deduction switch if you want the calculator to automatically subtract the 2026 standard deduction for your filing status. This reduces your taxable income before the bracket calculation.',
    'Click the "Calculate Federal Tax" button to see your total tax owed, effective tax rate, marginal tax rate, and a detailed bracket-by-bracket breakdown.',
    'Review the results to understand how much tax you owe in each bracket, your monthly and bi-weekly withholding equivalents, and strategies to optimize your tax situation.',
  ],

  formula: 'Tax = Σ(Income in Bracket × Bracket Rate)',
  formulaDescription:
    'The US federal income tax uses a progressive (marginal) system. Each portion of your taxable income is taxed at the rate of the bracket it falls into. Your effective tax rate is the average rate across all brackets, while your marginal tax rate is the rate applied to your last dollar of income. This means earning more money only increases the tax rate on income above your current bracket threshold — not on all of your income.',

  workedExamples: [
    {
      title: '$65,000 Single Filer (2026)',
      description:
        'With a $65,000 gross income and the 2026 $15,300 standard deduction, the taxable income is $49,700. Tax is calculated as: 10% on the first $12,150 ($1,215.00), 12% on the next $37,200 ($4,464.00), and 22% on the remaining $350 ($77.00). Total federal tax is $5,756.00, with an effective rate of 11.51% and a marginal rate of 22%. Monthly withholding equivalent is $479.67 and bi-weekly is $221.38.',
    },
    {
      title: '$120,000 Married Filing Jointly (2026)',
      description:
        'With a $120,000 gross income and the 2026 $30,600 standard deduction, the taxable income is $89,400. Tax is calculated as: 10% on the first $24,300 ($2,430.00) and 12% on the remaining $65,100 ($7,812.00). Total federal tax is $10,242.00, with an effective rate of 11.38% and a marginal rate of 12%. Monthly withholding equivalent is $853.50 and bi-weekly is $393.92.',
    },
    {
      title: '$250,000 Single Filer (High Earner, 2026)',
      description:
        'With a $250,000 gross income and the 2026 $15,300 standard deduction, the taxable income is $234,700. Tax is calculated across five brackets: 10% on $12,150 ($1,215.00), 12% on $37,200 ($4,464.00), 22% on $55,900 ($12,298.00), 24% on $95,650 ($22,956.00), and 32% on $33,800 ($10,816.00). Total federal tax is $51,749.00, with an effective rate of 22.00% and a marginal rate of 32%. Monthly withholding equivalent is $4,312.42 and bi-weekly is $1,990.35.',
    },
  ],

  faqs: [
    {
      question: 'What is the difference between marginal and effective tax rates?',
      answer:
        'Your marginal tax rate is the rate applied to your last (highest) dollar of taxable income. For example, if you are single and your taxable income is $60,000, your marginal rate is 22% because your last dollars fall in the 22% bracket. Your effective tax rate is the average rate across all your income — calculated by dividing total tax by total taxable income. In this example, the effective rate would be approximately 13.5%, significantly lower than the 22% marginal rate. This distinction is important because many people mistakenly believe a raise will be taxed at their marginal rate on all income, when in reality only the income above the bracket threshold is taxed at the higher rate.',
    },
    {
      question: 'What happens when my income crosses into a new tax bracket?',
      answer:
        'Only the portion of your income that falls within the new bracket is taxed at the higher rate — not your entire income. For example, if you are single and your taxable income increases from $47,000 to $50,000, only the $1,525 that exceeds the $48,475 threshold is taxed at 22%. The first $11,925 is still taxed at 10% and the next $36,550 is still taxed at 12%. This is the nature of a progressive tax system. You will never have less take-home pay due to crossing a bracket boundary.',
    },
    {
      question: 'Should I take the standard deduction or itemize?',
      answer:
        'You should choose whichever option gives you the larger deduction. The 2026 standard deduction is $15,000 for single filers, $30,000 for married filing jointly, $15,000 for married filing separately, and $22,500 for head of household. You should itemize if your qualifying expenses — such as mortgage interest, state and local taxes (SALT, capped at $10,000), charitable donations, and medical expenses exceeding 7.5% of AGI — exceed the standard deduction. Since the Tax Cuts and Jobs Act of 2017 roughly doubled the standard deduction, about 90% of taxpayers now take the standard deduction.',
    },
    {
      question: 'Does this calculator include state taxes?',
      answer:
        'No, this calculator only computes federal income tax using the 2025 IRS brackets. State income tax is a separate calculation that varies significantly by state — some states like Texas, Florida, and Nevada have no state income tax, while others like California (up to 13.3%) and New York (up to 10.9%) have substantial rates. To estimate your total tax burden, you would need to run your taxable income through your specific state\'s tax brackets as well. Keep in mind that some states allow you to deduct federal taxes paid, further complicating the calculation.',
    },
    {
      question: 'How are capital gains taxed versus ordinary income?',
      answer:
        'Long-term capital gains (assets held over one year) are taxed at preferential rates of 0%, 15%, or 20% depending on your taxable income level, which is generally lower than ordinary income rates. Short-term capital gains (assets held one year or less) are taxed at your ordinary income tax rates — the same brackets this calculator uses. Additionally, high-income earners may be subject to the 3.8% Net Investment Income Tax (NIIT) on investment income. Qualified dividends are also taxed at the long-term capital gains rates, making tax-advantaged investing an important consideration for overall tax planning.',
    },
    {
      question: 'How can I lower my tax bracket?',
      answer:
        'There are several strategies to reduce your taxable income and potentially drop into a lower tax bracket: (1) Maximize pre-tax retirement contributions like a 401(k) ($23,500 limit in 2025, $31,000 if age 50+) or traditional IRA. (2) Contribute to a Health Savings Account (HSA) if you have a high-deductible health plan ($4,300 individual / $8,550 family in 2025). (3) Use flexible spending accounts (FSA) for healthcare and dependent care. (4) Harvest tax losses by selling investments at a loss to offset gains. (5) Consider timing — defer income or accelerate deductions if you are close to a bracket threshold. (6) If self-employed, maximize business deductions like the home office deduction, equipment expenses, and retirement plans like a SEP-IRA or Solo 401(k).',
    },
  ],

  relatedTools: [
    {
      slug: 'payroll-calculator',
      title: 'Payroll Calculator',
      description: 'Calculate your take-home pay after all deductions',
      icon: 'CreditCard',
    },
    {
      slug: 'after-tax-income-calculator',
      title: 'After-Tax Income Calculator',
      description: 'Estimate your income after federal and state taxes',
      icon: 'DollarSign',
    },
    {
      slug: 'bonus-tax-calculator',
      title: 'Bonus Tax Calculator',
      description: 'Calculate net bonus after supplemental withholding',
      icon: 'Gift',
    },
    {
      slug: 'salary-converter',
      title: 'Salary Converter',
      description: 'Convert salary between hourly, monthly, and annual',
      icon: 'TrendingUp',
    },
    {
      slug: 'salary-increase-calculator',
      title: 'Salary Increase Calculator',
      description: 'See how a raise affects your paycheck and taxes',
      icon: 'TrendingUp',
    },
  ],

  // ---------------------------------------------------------------------------
  // Render
  
};

export default seoData;
