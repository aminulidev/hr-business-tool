const seoData = {
  breadcrumbs: [
        { label: 'Calculators' },
        { label: 'Salary Increase Calculator' },
      ],
  tableOfContents: [
        { id: 'how-to-calculate', label: 'How to Calculate' },
        { id: 'formula', label: 'Salary Increase Formula' },
        { id: 'worked-examples', label: 'Worked Examples' },
        { id: 'frequently-asked-questions', label: 'FAQs' },
        { id: 'related-calculators', label: 'Related Calculators' },
      ],
  workedExamples: [
        {
          title: '3% Annual Raise',
          description:
            'An employee currently earning $65,000 per year receives a standard 3% annual raise. The increase amount is $65,000 × 3% = $1,950, bringing the new salary to $66,950. However, with inflation also at 3%, the real increase is exactly 0% — meaning the employee\'s purchasing power remains unchanged despite the higher paycheck.',
        },
        {
          title: 'Promotion Raise (15%)',
          description:
            'After earning a promotion, an employee earning $55,000 receives a 15% raise. The increase is $55,000 × 15% = $8,250, resulting in a new salary of $63,250. On a monthly basis, this translates to an extra $687.50 per month ($8,250 / 12). A 15% raise is typical for promotions and significantly outpaces average inflation.',
        },
        {
          title: 'Below-Inflation Raise',
          description:
            'An employee earning $70,000 receives a 2% raise in a year where inflation is running at 4.5%. The nominal increase is $1,400, bringing the salary to $71,400. However, the real wage decrease is 2.5% (2% - 4.5%), meaning the employee\'s purchasing power actually declines despite receiving a raise. This scenario highlights why understanding inflation-adjusted growth is critical.',
        },
      ],
  relatedTools: [
        { slug: 'commission-calculator', title: 'Sales Commission Calculator', description: 'Calculate commission from sales revenue', icon: 'DollarSign' },
        { slug: 'pro-rata-calculator', title: 'Pro Rata Salary Calculator', description: 'Calculate prorated salary for partial periods', icon: 'CalendarClock' },
        { slug: 'payroll-calculator', title: 'Payroll Calculator', description: 'Calculate your take-home pay after taxes', icon: 'CreditCard' },
        { slug: 'bonus-tax-calculator', title: 'Bonus Tax Calculator', description: 'Calculate net bonus after tax withholding', icon: 'Gift' },
        { slug: 'profit-margin-calculator', title: 'Profit Margin Calculator', description: 'Calculate profit margins and markup', icon: 'Percent' },
        { slug: 'roi-calculator', title: 'ROI Calculator', description: 'Calculate return on investment', icon: 'BarChart3' },
      ],
  howToSteps: [
        'Enter your current annual salary — this is the total amount you earn before any increase is applied, including base pay and any existing allowances.',
        'Input the salary increase percentage — this is the raise you received or are expecting, expressed as a percentage of your current salary.',
        'Optionally, enter the current inflation rate — this allows you to see the real (inflation-adjusted) purchasing power of your raise rather than just the nominal increase.',
        'Calculate your new salary and compare the nominal increase against inflation to understand your true wage growth in terms of purchasing power.',
      ],
  formula: `New Salary = Current Salary × (1 + Increase% / 100)\nReal Increase = Nominal Increase - Inflation Rate`,
  formulaDescription: "The salary increase formula applies the raise percentage to your current salary to determine your new earnings. The real increase subtracts the inflation rate from your nominal raise, revealing how much your purchasing power actually grows. A raise that is lower than inflation means your real wages are decreasing, even though your paycheck amount increases.",
  faqs: [
        {
          question: 'What is a good salary increase percentage?',
          answer:
            'A good salary increase typically ranges from 3% to 5% for annual merit raises, which roughly keeps pace with or slightly exceeds inflation. Promotions often come with larger increases of 10% to 20%. Exceptional performers or those changing jobs may negotiate increases of 15% to 30% or more. The key benchmark is whether your raise exceeds inflation — if it does, your real purchasing power is growing.',
        },
        {
          question: 'How does inflation affect my salary increase?',
          answer:
            'Inflation erodes the purchasing power of your money over time, meaning even with a nominal raise, you could effectively be earning less in real terms. For example, a 3% raise with 4% inflation means your real wages decreased by 1%. To truly benefit from a raise, it must exceed the inflation rate. Understanding the difference between nominal and real income growth is essential for evaluating whether your compensation is truly improving.',
        },
        {
          question: 'How often should you ask for a raise?',
          answer:
            'Most experts recommend asking for a raise at least annually during performance reviews, or whenever you take on significantly more responsibility. A good rule of thumb is to request a raise after 6 to 12 months of consistently exceeding expectations in your role. Timing matters — consider asking after a major accomplishment, during the company budget planning cycle, or when you have market data showing you are underpaid relative to peers.',
        },
        {
          question: "What is the average salary increase per year?",
          answer:
            'The average annual salary increase in the United States typically ranges from 2.5% to 3.5% for cost-of-living adjustments and merit raises. However, this varies significantly by industry, region, and economic conditions. In high-demand fields like technology and healthcare, increases of 4% to 6% are more common. Job switchers tend to see larger increases of 10% to 15% on average compared to those who stay at the same company.',
        },
        {
          question: 'Should I negotiate my salary increase?',
          answer:
            'Absolutely. Research shows that employees who negotiate their salary increases typically receive 5% to 10% more than those who accept the initial offer. Come prepared with data on market rates, a record of your accomplishments, and a clear justification for why you deserve more. Approach the conversation professionally, focus on the value you bring to the organization, and be willing to discuss alternative compensation like bonuses or additional benefits if a higher base salary is not immediately possible.',
        },
        {
          question: 'How do I convert my hourly wage to an annual salary?',
          answer:
            'To convert an hourly wage to an annual salary, multiply your hourly rate by the number of hours you work per week, then multiply by 52 weeks in a year. For example, $30 per hour × 40 hours per week × 52 weeks = $62,400 per year. Once you have the annual equivalent, you can apply the raise percentage using this calculator to see what your increased hourly rate would be.',
        },
        {
          question: 'What is a cost-of-living adjustment (COLA)?',
          answer:
            'A cost-of-living adjustment (COLA) is an automatic salary increase tied to a measure of inflation, most commonly the Consumer Price Index (CPI). COLAs are standard in government employment, union contracts, Social Security benefits, and some private-sector pensions. Their purpose is to ensure that wages and benefits keep pace with rising prices, preserving the recipient\'s purchasing power over time without requiring individual negotiation.',
        },
        {
          question: 'Does my raise affect my tax bracket?',
          answer:
            'A raise could push you into a higher marginal tax bracket, but a common misconception is that your entire salary gets taxed at the new higher rate. In reality, only the income that falls above the bracket threshold is taxed at the higher rate, while income below it continues to be taxed at the lower rates. For example, if you earn $50,000 and get a raise to $55,000, only the $5,000 above the bracket threshold is taxed at the higher marginal rate, not the full $55,000.',
        },
      ],
};

export default seoData;
