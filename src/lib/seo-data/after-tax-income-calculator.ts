const seoData = {
  breadcrumbs: [
    { label: 'Calculators' },
    { label: 'After-Tax Income Calculator' },
  ],

  tableOfContents: [
    { id: 'how-to-calculate', label: 'How to Calculate' },
    { id: 'formula', label: 'Formula' },
    { id: 'worked-examples', label: 'Worked Examples' },
    { id: 'frequently-asked-questions', label: 'FAQs' },
    { id: 'related-calculators', label: 'Related Calculators' },
  ],

  howToSteps: [
    'Enter your gross income in the primary input field. You can specify it as an annual salary, monthly pay, bi-weekly or weekly paycheck, or an hourly wage.',
    'Select your pay frequency to tell the calculator how your income amount should be interpreted. If you choose hourly, also enter your typical hours per week.',
    'Choose your federal tax filing status: Single, Married Filing Jointly, or Head of Household. This determines which 2025 tax brackets apply.',
    'Set your state income tax rate. Use the quick-preset buttons for common states (e.g., 0% for Texas or Florida, 9.3% for California) or type a custom percentage.',
    'Enter any additional monthly pre-tax deductions such as health insurance premiums, 401(k) contributions, or HSA contributions.',
    'Click "Calculate" to see your detailed after-tax income breakdown including federal tax, state tax, Social Security, Medicare, and your net take-home pay.',
  ],

  formulaDescription:
    'After-tax income (also called net income or take-home pay) is the amount of money you actually receive after all required taxes and deductions are subtracted from your gross earnings. Federal income tax is calculated using the 2025 progressive bracket system based on your filing status. State income tax varies by state. FICA taxes include Social Security (6.2% on earnings up to $176,100) and Medicare (1.45% on all earnings, plus an additional 0.9% on earnings above $200,000). Additional deductions reduce your taxable income further.',

  workedExamples: [
    {
      title: 'Example 1: $75,000 Single in California (9.3% state tax)',
      description:
        'Federal tax on $75,000 (Single 2025 brackets): 10% on first $11,925 ($1,192.50) + 12% on $36,550 ($4,386.00) + 22% on remaining $26,525 ($5,835.50) = $11,414.00. State tax: $75,000 × 9.3% = $6,975. Social Security: $75,000 × 6.2% = $4,650. Medicare: $75,000 × 1.45% = $1,087.50. Total deductions: $24,126.50. Net annual income: $50,873.50 ($4,239.46/month).',
    },
    {
      title: 'Example 2: $100,000 Married Filing Jointly in Texas (0% state tax)',
      description:
        'Federal tax on $100,000 (MFJ 2025 brackets): 10% on first $23,850 ($2,385.00) + 12% on $71,100 ($8,532.00) + 22% on remaining $5,050 ($1,111.00) = $12,028.00. State tax: $0 (Texas has no state income tax). Social Security: $100,000 × 6.2% = $6,200. Medicare: $100,000 × 1.45% = $1,450. Total deductions: $19,678. Net annual income: $80,322 ($6,693.50/month).',
    },
    {
      title: 'Example 3: $55,000 hourly at $26.44/hr, Single, 5% state tax',
      description:
        'Annual gross: $26.44/hr × 40 hrs/week × 52 weeks = $54,995.20. Federal tax: 10% on $11,925 ($1,192.50) + 12% on $36,550 ($4,386.00) + 22% on remaining $6,520.20 ($1,434.44) = $7,012.94. State tax: $54,995.20 × 5% = $2,749.76. Social Security: $54,995.20 × 6.2% = $3,409.70. Medicare: $54,995.20 × 1.45% = $797.43. Total deductions: $13,969.83. Net annual income: $41,025.37 ($3,418.78/month).',
    },
  ],

  faqs: [
    {
      question: 'What is after-tax income?',
      answer:
        'After-tax income, also known as net income or take-home pay, is the amount of money you receive after all taxes and deductions have been subtracted from your gross earnings. This includes federal income tax, state income tax, Social Security, Medicare, and any additional deductions such as retirement contributions or health insurance premiums. It represents the actual money available for you to spend, save, or invest.',
    },
    {
      question: 'What is FICA and how much does it take from my paycheck?',
      answer:
        'FICA (Federal Insurance Contributions Act) consists of two components: Social Security and Medicare. Social Security tax is 6.2% of your wages up to a wage base limit of $176,100 (for 2025). Medicare tax is 1.45% on all wages with no cap. Additionally, if your earnings exceed $200,000, an Additional Medicare Tax of 0.9% applies to the amount over $200,000. Your employer matches both the Social Security and Medicare contributions, effectively doubling the total FICA contribution.',
    },
    {
      question: 'How does filing status affect my federal taxes?',
      answer:
        'Your filing status determines which tax brackets apply to your income and the size of each bracket. Single filers have the narrowest brackets, meaning they enter higher tax brackets at lower income levels. Married Filing Jointly couples enjoy the widest brackets, so each dollar is taxed at a lower rate compared to single filers at the same total income. Head of Household status (for unmarried individuals supporting a qualifying dependent) offers brackets between Single and Married Filing Jointly. Choosing the correct filing status can significantly impact your tax liability.',
    },
    {
      question: 'What is the difference between gross and net income?',
      answer:
        'Gross income is your total earnings before any taxes, deductions, or withholdings are applied. This includes your salary, wages, bonuses, tips, and other compensation. Net income (also called take-home pay) is what remains after subtracting federal income tax, state income tax, FICA taxes (Social Security and Medicare), and any additional deductions like retirement plan contributions, health insurance premiums, or garnishments. The difference between gross and net income can be 20-40% or more depending on your income level, filing status, location, and deductions.',
    },
    {
      question: 'How can I increase my take-home pay?',
      answer:
        'There are several strategies to increase your take-home pay: (1) Contribute to tax-advantaged accounts like a 401(k) or traditional IRA, which reduce your taxable income. (2) Use a Flexible Spending Account (FSA) or Health Savings Account (HSA) for eligible medical expenses with pre-tax dollars. (3) Adjust your W-4 withholding if you consistently receive large tax refunds. (4) Claim all eligible tax credits and deductions. (5) Consider moving to a state with lower or no income tax. (6) Negotiate a higher salary or seek additional income sources. (7) Review your paycheck regularly for errors in withholding.',
    },
    {
      question: 'What is the difference between tax withholding and actual tax liability?',
      answer:
        'Tax withholding is the amount your employer deducts from each paycheck and sends to the IRS on your behalf, based on information you provide on your W-4 form. Your actual tax liability is the total amount you owe for the year based on your taxable income, deductions, and credits as calculated on your tax return. If your withholding exceeds your tax liability, you receive a refund. If it is less than your liability, you owe additional taxes and may face penalties. This calculator estimates your actual tax liability, not your withholding amount, though they should be similar if your W-4 is properly configured.',
    },
  ],

  relatedTools: [
    {
      slug: 'payroll-calculator',
      title: 'Payroll Calculator',
      description: 'Calculate your paycheck details including taxes and deductions.',
      icon: 'DollarSign',
    },
    {
      slug: 'tax-bracket-calculator',
      title: 'Tax Bracket Calculator',
      description: 'Find your federal tax bracket and marginal tax rate.',
      icon: 'Percent',
    },
    {
      slug: 'bonus-tax-calculator',
      title: 'Post-Tax Bonus Calculator',
      description: 'Estimate your take-home bonus after federal and state taxes.',
      icon: 'Gift',
    },
    {
      slug: 'salary-converter',
      title: 'Salary Converter',
      description: 'Convert salary between hourly, weekly, monthly, and annual pay.',
      icon: 'CalendarClock',
    },
    {
      slug: 'salary-increase-calculator',
      title: 'Salary Increase Calculator',
      description: 'Calculate your raise amount in percentage and actual dollars.',
      icon: 'TrendingUp',
    },
    {
      slug: 'property-tax-calculator',
      title: 'Property Tax Calculator',
      description: 'Estimate your annual property tax from assessed value and tax rate.',
      icon: 'Building2',
    },
  ],

  
};

export default seoData;
