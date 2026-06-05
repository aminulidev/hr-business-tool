const seoData = {
  breadcrumbs: [
        { label: 'Calculators' },
        { label: 'Post-Tax & Bonus Calculator' },
      ],
  tableOfContents: [
        { id: 'how-to-calculate', label: 'How to Calculate' },
        { id: 'formula', label: 'Tax Formula' },
        { id: 'worked-examples', label: 'Worked Examples' },
        { id: 'frequently-asked-questions', label: 'FAQs' },
        { id: 'related-calculators', label: 'Related Calculators' },
      ],
  workedExamples: [
        {
          title: '$10,000 Year-End Bonus',
          description:
            'With a $10,000 gross bonus and 22% federal tax, 5% state tax, and 0% additional withholding, the total tax rate is 27%. That means $2,700 goes to taxes, leaving you with a net bonus of $7,300.',
        },
        {
          title: 'Reverse: Need $8,000 Net',
          description:
            'If you need exactly $8,000 after taxes and your combined tax rate is 27%, the required gross bonus is $8,000 ÷ (1 − 0.27) = $10,959. Taxes withheld total $2,959, and your take-home amount is $8,000 as desired.',
        },
        {
          title: '$5,000 Bonus with 10% Additional Withholding',
          description:
            'A $5,000 bonus with 22% federal tax, 5% state tax, and 10% additional withholding results in a 37% total tax rate. Total taxes are $1,850, giving you a net bonus of $3,150.',
        },
      ],
  relatedTools: [
        { slug: 'payroll-calculator', title: 'Payroll Calculator', description: 'Calculate your regular take-home pay', icon: 'CreditCard' },
        { slug: 'commission-calculator', title: 'Sales Commission Calculator', description: 'Calculate commission after deductions', icon: 'DollarSign' },
        { slug: 'salary-increase-calculator', title: 'Salary Increase Calculator', description: 'See how a raise affects your paycheck', icon: 'TrendingUp' },
        { slug: 'pro-rata-calculator', title: 'Pro Rata Salary Calculator', description: 'Calculate prorated salary', icon: 'CalendarClock' },
        { slug: 'profit-margin-calculator', title: 'Profit Margin Calculator', description: 'Calculate profit margins and markup', icon: 'Percent' },
        { slug: 'roi-calculator', title: 'ROI Calculator', description: 'Calculate return on investment', icon: 'BarChart3' },
      ],
  howToSteps: [
        'Select your calculation mode: "Gross to Net" to find your take-home pay, or "Net to Gross" to find the gross bonus needed for a desired net amount.',
        'Enter your bonus amount — either the gross bonus (before taxes) or the net amount you want to receive after taxes.',
        'Input your federal tax rate (default 22% for supplemental income), your state tax rate, and any additional voluntary withholding.',
        'Click "Calculate" to see a detailed breakdown of taxes withheld and your final net bonus amount.',
      ],
  formula: 'Gross to Net: Net Bonus = Gross Bonus × (1 - Total Tax Rate / 100) | Net to Gross: Gross Bonus = Net Bonus / (1 - Total Tax Rate / 100)',
  formulaDescription: 'Gross to Net: Multiply your gross bonus by the inverse of the combined tax rate to determine how much you take home after all withholding taxes are applied. Net to Gross: Divide your desired net bonus by the inverse of the combined tax rate to determine the gross bonus your employer needs to pay before withholding.',
  faqs: [
        {
          question: 'Are bonuses taxed at a higher rate than regular salary?',
          answer:
            'Bonuses are not technically taxed at a higher rate, but the IRS requires employers to use a supplemental withholding rate — typically a flat 22% for federal taxes. This flat rate may be higher or lower than your regular income tax bracket. When you file your tax return, the bonus is combined with your regular income and taxed at your marginal rate, so any excess withholding is refunded or any shortfall is owed.',
        },
        {
          question: 'What is the supplemental withholding rate?',
          answer:
            'The federal supplemental withholding rate for bonuses is 22% for amounts under $1 million. If your bonus exceeds $1 million, the excess is taxed at the highest federal rate of 37%. Employers can choose to use either this flat supplemental rate or aggregate the bonus with your regular wages and use standard withholding tables. Most employers use the flat rate for simplicity.',
        },
        {
          question: 'Can I change my bonus withholding?',
          answer:
            'Yes, you can adjust your withholding by submitting a new Form W-4 to your employer before the bonus is paid. You can request additional withholding by specifying an extra amount on Line 4(c) of the W-4. Note that you cannot reduce the mandatory federal supplemental withholding rate below 22%, but you can elect to have more withheld to avoid owing at tax time.',
        },
        {
          question: 'How are bonuses taxed in different states?',
          answer:
            'State tax treatment of bonuses varies significantly. Some states like Texas, Florida, and Nevada have no state income tax, so only federal taxes apply. Others like California (up to 13.3%), New York (up to 10.9%), and Oregon (up to 9.9%) have high state tax rates that substantially reduce your net bonus. Some states follow the federal supplemental flat-rate method, while others aggregate bonuses with regular wages for state withholding purposes.',
        },
        {
          question: 'Why is my bonus taxed at 22% instead of my normal rate?',
          answer:
            'The IRS requires employers to withhold bonuses at a flat supplemental rate of 22% (up to $1M) or 37% (above $1M). This is different from your regular income tax bracket. The difference reconciles when you file your annual return — you may get a refund if too much was withheld.',
        },
        {
          question: 'Are bonuses subject to Social Security and Medicare taxes?',
          answer:
            'Yes. Bonuses are considered supplemental wages and are subject to FICA taxes: 6.2% for Social Security (up to the annual wage base) and 1.45% for Medicare (no cap). Your employer also matches these contributions, totaling 15.3%.',
        },
        {
          question: 'Can I contribute my bonus to my 401(k)?',
          answer:
            'Yes, and this is often a smart move. You can direct part or all of your bonus to your 401(k) to reduce current taxable income. Note that 401(k) contributions have an annual limit ($23,500 for 2025, $31,000 if 50+). Check if your plan allows bonus-only contributions.',
        },
        {
          question: 'How does a signing bonus differ from a regular bonus?',
          answer:
            'A signing bonus is a one-time payment given when you join a company, while regular bonuses are periodic (annual, quarterly, or performance-based). Both are taxed as supplemental income at the 22% flat rate. Signing bonuses may have repayment clauses if you leave within a certain period.',
        },
      ],
};

export default seoData;
