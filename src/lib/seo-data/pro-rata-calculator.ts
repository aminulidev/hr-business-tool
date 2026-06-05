const seoData = {
  breadcrumbs: [
        { label: 'Calculators' },
        { label: 'Pro Rata Salary Calculator' },
      ],
  tableOfContents: [
        { id: 'how-to-calculate', label: 'How to Calculate' },
        { id: 'formula', label: 'Pro Rata Formula' },
        { id: 'worked-examples', label: 'Worked Examples' },
        { id: 'frequently-asked-questions', label: 'FAQs' },
        { id: 'related-calculators', label: 'Related Calculators' },
      ],
  workedExamples: [
        {
          title: 'Mid-Year Start',
          description:
            'An employee earning a full-time annual salary of $80,000 starts on July 1st, working 130 of the standard 260 working days in the year. The daily rate is calculated as $80,000 / 260 = $307.69 per day. Multiplying by the 130 days worked gives a pro rata salary of $40,000 — exactly half the full-time amount.',
        },
        {
          title: 'Part-Time Equivalent',
          description:
            'A full-time role carries a salary of $60,000 per year, but the employee works only 3 days per week instead of 5. Over a full year this amounts to 156 working days out of 260. The pro rata salary is $60,000 × (156 / 260) = $36,000, which represents 60% of the full-time salary and matches the 60% fraction of hours worked.',
        },
        {
          title: 'Contract Work (90 Days)',
          description:
            'A contractor is engaged for a 90-day assignment with an annualized salary equivalent of $100,000. The daily rate is $100,000 / 260 = $384.62. The pro rata pay for the 90-day engagement is $384.62 × 90 = $34,615.38. This approach is common for fixed-term contracts and freelance engagements where the annual rate serves as the basis for short-term compensation.',
        },
      ],
  relatedTools: [
        { slug: 'commission-calculator', title: 'Sales Commission Calculator', description: 'Calculate your commission earnings', icon: 'DollarSign' },
        { slug: 'salary-increase-calculator', title: 'Salary Increase Calculator', description: 'See what a raise looks like in your paycheck', icon: 'TrendingUp' },
        { slug: 'payroll-calculator', title: 'Payroll Calculator', description: 'Calculate your take-home pay after taxes', icon: 'CreditCard' },
        { slug: 'time-card-calculator', title: 'Time Card Calculator', description: 'Convert work hours to decimal format', icon: 'Clock' },
        { slug: 'bonus-tax-calculator', title: 'Bonus Tax Calculator', description: 'Calculate net bonus after tax withholding', icon: 'Gift' },
        { slug: 'profit-margin-calculator', title: 'Profit Margin Calculator', description: 'Calculate profit margins and markup', icon: 'Percent' },
      ],
  howToSteps: [
        'Start with the full-time annual salary — this is the complete yearly salary a full-time employee working the entire year would earn.',
        'Determine the total number of working days in a full year — the standard is 260 days (52 weeks × 5 days), but adjust if your organization uses a different schedule.',
        'Count the actual number of days you will work or have worked — this includes only the days you are actively employed during the period in question.',
        'Calculate your daily rate by dividing the full annual salary by the total working days, then multiply by your actual days worked to get the pro rata salary.',
      ],
  formula: "Daily Rate = Annual Salary / Full Working Days\nPro Rata Salary = Daily Rate × Days Worked",
  formulaDescription: "The pro rata salary is calculated by first finding the daily equivalent of the full-time salary, then multiplying it by the actual number of days worked. This ensures that employees who work fewer than the standard number of days receive a fair and proportional share of the full-time salary.",
  faqs: [
        {
          question: 'When is pro rata salary used?',
          answer:
            'Pro rata salary calculations are used when an employee does not work the full standard year or full-time hours. Common scenarios include starting a job mid-year, leaving before the year ends, transitioning from full-time to part-time, or working on a fixed-term contract. Employers use pro rata to ensure compensation is fair and proportional to actual time worked.',
        },
        {
          question: 'Is a pro rata salary taxed the same as a full salary?',
          answer:
            'Yes, pro rata salaries are taxed using the same income tax brackets and rates as full-time salaries. The key difference is that since the total annual income is lower, you may fall into a lower tax bracket, resulting in a lower overall tax burden. All standard deductions, benefits, and payroll taxes still apply proportionally.',
        },
        {
          question: 'How does pro rata work for part-time employees?',
          answer:
            'For part-time employees, the pro rata calculation typically uses hours rather than days. The full-time equivalent salary is multiplied by the fraction of hours worked. For example, if you work 20 hours per week in a role that is normally 40 hours, your pro rata salary would be 50% of the full-time salary. Benefits such as holiday entitlement and pension contributions are also usually calculated on a pro rata basis.',
        },
        {
          question: 'What about pro rata and holiday entitlement?',
          answer:
            'Holiday entitlement is also calculated on a pro rata basis for part-time or mid-year starters. In most jurisdictions, full-time employees are entitled to a statutory number of paid holiday days per year. A pro rata employee receives the same proportion of those days as their working time represents. For example, working half the year typically entitles you to half the annual holiday allowance.',
        },
        {
          question: 'Does pro rata affect benefits like health insurance and retirement plans?',
          answer:
            'It depends on the employer and jurisdiction. Some benefits like health insurance may have eligibility thresholds that pro rata employees still meet. Retirement plan contributions are typically proportional to earnings, meaning lower pro rata salaries result in lower contributions. Always check your employment contract and company benefits policy to understand exactly how pro rata status affects each specific benefit.',
        },
        {
          question: 'How is pro rata different from prorated?',
          answer:
            'They refer to the exact same concept. "Pro rata" is the original Latin phrase meaning "in proportion," while "prorated" is simply the anglicized verb form of the same term. Both describe the process of allocating or reducing an amount proportionally based on time worked, usage, or another relevant factor. In everyday usage they are completely interchangeable.',
        },
        {
          question: 'Can I calculate pro rata by hours instead of days?',
          answer:
            'Yes, you can absolutely calculate pro rata using hours. Instead of dividing the annual salary by working days, divide it by annual working hours — typically 2,080 hours (40 hours × 52 weeks). This gives you the hourly rate, which you then multiply by the actual hours worked. The hourly method is especially useful for roles with variable daily hours or for contractors billing by the hour.',
        },
        {
          question: 'Does pro rata affect my pension or 401(k) contributions?',
          answer:
            'Yes, pension and 401(k) contributions are typically calculated as a percentage of your salary, so a pro rata employee will contribute less in absolute dollar terms but the same percentage as a full-time employee. For example, if the employer matches 5% of salary, a pro rata employee earning $36,000 receives $1,800 in matching contributions compared to $3,000 for a full-time $60,000 employee. The contribution rate remains identical.',
        },
      ],
};

export default seoData;
