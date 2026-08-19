const seoData = {
  howToSteps: [
    'Enter your total salary in the field above. You can input your annual salary, monthly salary, bi-weekly pay, or weekly pay depending on your pay frequency.',
    'Select your pay frequency from the dropdown. This tells the calculator how many pay periods you have per year so it can convert all amounts accurately.',
    'Enter your estimated federal and state tax rates as percentages. The default values of 22% federal and 5% state are common for many income brackets, but adjust these to match your actual tax situation.',
    'Include any additional monthly deductions such as health insurance premiums, 401(k) contributions, or other pre-tax/post-tax deductions that are withheld from your paycheck.',
    'Click the "Calculate" button to see your net pay per period, total deductions breakdown, effective tax rate, and projected annual take-home pay.',
  ],

  formula: 'Net Pay = Gross Pay − Federal Tax − State Tax − Deductions',
  formulaDescription:
    'The net pay formula subtracts all taxes and deductions from your gross pay to determine your actual take-home income per pay period. Your effective tax rate is the combined percentage of your gross pay that goes to taxes.',

  faqs: [
    {
      question: 'How is federal tax calculated on my paycheck?',
      answer:
        'Federal income tax is calculated based on your taxable income and the IRS tax brackets. Your employer uses the information on your W-4 form to determine the correct withholding amount. The federal tax is a percentage of your gross wages, and the rate depends on your filing status, income level, and any additional withholdings you elected. Keep in mind that this calculator uses a flat effective rate for estimation purposes, while the actual system uses progressive brackets.',
    },
    {
      question: 'What is FICA tax and is it included in this calculator?',
      answer:
        'FICA (Federal Insurance Contributions Act) tax consists of two parts: Social Security tax at 6.2% on wages up to a yearly limit, and Medicare tax at 1.45% on all wages. If you earn above a certain threshold, an additional 0.9% Medicare surtax applies. This calculator focuses on federal and state income tax only, so you may want to factor in an additional 7.65% for FICA when estimating your total deductions.',
    },
    {
      question: 'How do state taxes work and why do they vary?',
      answer:
        'State income taxes are separate from federal taxes and vary significantly by state. Some states like Texas, Florida, and Nevada have no state income tax at all, while others like California and New York have rates that can exceed 10%. The tax is typically a percentage of your taxable income, and most states use their own bracket systems similar to the federal structure. Be sure to check your specific state\'s tax rates for the most accurate estimate.',
    },
    {
      question: 'What deductions can I claim to reduce my taxable income?',
      answer:
        'Common deductions that reduce your taxable income include retirement contributions (such as 401(k), 403(b), or IRA), health savings account (HSA) contributions, flexible spending account (FSA) contributions, health and dental insurance premiums, and student loan interest. Pre-tax deductions lower your taxable income directly, while post-tax deductions like Roth 401(k) contributions do not. Maximizing pre-tax deductions can significantly increase your take-home pay.',
    },
    {
      question: 'How often should I review my paycheck?',
      answer:
        'Review every pay stub for accuracy. Check that tax withholdings match your W-4 elections, deductions are correct, and overtime or bonuses are properly calculated. Report any discrepancies to HR immediately to ensure corrections are made before tax filing season.',
    },
    {
      question: 'What is the difference between gross and net pay?',
      answer:
        'Gross pay is your total earnings before any deductions are taken out, including your base salary, overtime, bonuses, and commissions. Net pay (also called take-home pay) is what remains after federal and state taxes, insurance premiums, retirement contributions, and other deductions are subtracted. Understanding this difference helps you budget effectively and identify where your money is going.',
    },
    {
      question: 'How do bonuses affect my paycheck taxes?',
      answer:
        'Bonuses are often taxed at a flat supplemental rate of 22% federal, which may differ from your regular tax bracket. This can result in higher withholding on bonus checks, but the difference typically reconciles when you file your annual tax return. If your total annual income places you in a lower bracket, you may receive a refund for the excess withholding.',
    },
    {
      question: 'Can I change my tax withholding?',
      answer:
        'Yes, you can submit an updated W-4 form to your employer at any time to adjust your tax withholding. You can change the number of allowances, request additional dollar amounts to be withheld, or claim exemptions if eligible. Changes typically take effect within one to two pay periods, giving you flexibility to fine-tune your take-home pay throughout the year.',
    },
  ],

  workedExamples: [
    {
      title: 'Bi-Weekly Paycheck — $65,000 Annual Salary',
      description:
        'An employee earning $65,000/year on a bi-weekly schedule (26 pay periods) has gross pay of $2,500 per period. With 22% federal tax, 5% state tax, and $200/month health insurance ($100/period): Federal tax = $2,500 × 22% = $550. State tax = $2,500 × 5% = $125. Deductions = $100. Net pay per period = $2,500 − $550 − $125 − $100 = $1,725. Annual take-home ≈ $1,725 × 26 = $44,850.',
    },
    {
      title: 'Monthly Payroll — Small Business Owner Employee',
      description:
        'An employee is paid monthly with a $5,000/month gross salary. Federal tax rate 24%, state tax rate 6.5%, with a 401(k) contribution of $300/month and health insurance of $250/month. Federal tax = $5,000 × 24% = $1,200. State tax = $5,000 × 6.5% = $325. Total deductions = $300 + $250 = $550. Net monthly pay = $5,000 − $1,200 − $325 − $550 = $2,925.',
    },
    {
      title: 'Hourly Employee — Weekly Payroll',
      description:
        'An hourly employee works 45 hours at $18/hour in a week (40 regular + 5 overtime). Gross pay: 40 × $18 + 5 × $27 = $720 + $135 = $855. With 12% federal tax and 4% state tax: Federal = $855 × 12% = $102.60. State = $855 × 4% = $34.20. No other deductions. Net pay = $855 − $102.60 − $34.20 = $718.20 take-home for the week.',
    },
  ],

  relatedTools: [
    {
      slug: 'after-tax-income-calculator',
      title: 'After-Tax Income Calculator',
      description: 'Calculate your full annual net income with progressive federal tax brackets',
      icon: 'Wallet',
    },
    {
      slug: 'fica-tax-calculator',
      title: 'FICA Tax Calculator',
      description: 'Calculate Social Security and Medicare withholdings separately',
      icon: 'Shield',
    },
    {
      slug: 'payroll-deduction-calculator',
      title: 'Payroll Deduction Calculator',
      description: 'Model the impact of 401(k), health insurance, and other pre-tax deductions',
      icon: 'FileMinus',
    },
    {
      slug: 'hourly-paycheck-calculator',
      title: 'Hourly Paycheck Calculator',
      description: 'Calculate gross and net pay for hourly employees including overtime',
      icon: 'Clock',
    },
  ],

};

export default seoData;
