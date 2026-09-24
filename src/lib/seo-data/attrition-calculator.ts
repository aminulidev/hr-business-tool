const seoData = {
  breadcrumbs: [{ label: 'Calculators' }, { label: 'Attrition Calculator' }],
  tableOfContents: [
    { id: 'how-to-calculate', label: 'How to Calculate' },
    { id: 'formula', label: 'Formula' },
    { id: 'worked-examples', label: 'Worked Examples' },
    { id: 'frequently-asked-questions', label: 'FAQs' },
    { id: 'related-calculators', label: 'Related Calculators' },
  ],
  howToSteps: [
    'Enter total departures in the period (voluntary + involuntary).',
    'Enter average headcount during the period ((start + end) / 2).',
    'Enter period length in months (12 for annual, 3 for quarterly).',
    'Click Calculate to see attrition rate and annualized rate.',
  ],
  formula: 'Attrition Rate = Departures / Average Headcount x 100\nAnnualized = (Attrition Rate / Months) x 12',
  formulaDescription: 'Attrition rate includes all departures (resignations, terminations, layoffs, retirements). Annualized rate scales period rate to full year for comparison. US average: 13-18% depending on industry.',
  workedExamples: [
    { title: 'Tech Company Q3', description: '12 departures, avg 100 headcount, 3 months. Attrition = 12/100 = 12% for Q3. Annualized = (12/3) x 12 = 48%. Very high annualized rate.' },
    { title: 'Annual Calculation', description: '15 departures over 12 months, avg 100. Attrition = 15/100 = 15%. Annualized = 15% (already annual).' },
    { title: 'Monthly Run Rate', description: '2 departures in month 1, avg 100. Monthly rate = 2%. Annualized = 2% x 12 = 24% projected.' },
    { title: 'Industry Benchmarks', description: 'Tech 13-18%, healthcare 18-22%, retail 30-60%, manufacturing 12-15%, government 8-10%.' },
    { title: 'Department Comparison', description: 'Engineering: 5 dep / 40 avg = 12.5%. Sales: 8 dep / 30 avg = 26.7%. Sales attrition is 2x engineering.' },
  ],
  faqs: [
    { question: 'What is employee attrition rate?', answer: 'Attrition rate = departures / average headcount × 100. Includes all departures (voluntary resignations, involuntary terminations, layoffs, retirements). Annualized scales period rate to full year. US average: 13-18% depending on industry.' },
    { question: 'Attrition vs turnover vs retention?', answer: 'Attrition = departures / average headcount. Turnover = often used interchangeably, sometimes specifically for replacements. Retention = % who stayed (inverse). All measure workforce stability.' },
    { question: 'What is a good attrition rate?', answer: 'Depends on industry. Healthy: tech 13-18%, healthcare 18-22%, retail 30-60% (high churn), manufacturing 12-15%, government 8-10%. Below industry average is good. Very low (<5%) may indicate stagnant culture.' },
    { question: 'How do you annualize attrition?', answer: 'Annualized = (period attrition rate / months in period) × 12. Example: 6% over 3 months = (6/3) × 12 = 24% annualized. Useful for comparing different period lengths.' },
    { question: 'Voluntary vs involuntary attrition?', answer: 'Voluntary = employee resignations (often 60-80% of total). Involuntary = terminations, layoffs, retirements. Track separately: high voluntary suggests culture/comp issues; high involuntary suggests hiring mismatch or performance management.' },
    { question: 'What causes high attrition?', answer: 'Top causes: (1) Poor management (70% variance per Gallup), (2) Inadequate compensation (below P50 market), (3) Lack of career growth, (4) Burnout/overwork, (5) Poor work-life balance, (6) Bad cultural fit, (7) Lack of recognition, (8) Better offers elsewhere.' },
  ],
  relatedTools: [
    { slug: 'headcount-calculator', title: 'Headcount Calculator', description: 'Project year-end headcount', icon: 'Users' },
    { slug: 'employee-turnover-calculator', title: 'Employee Turnover', description: 'Turnover rate and cost', icon: 'Users' },
    { slug: 'labor-cost-calculator', title: 'Labor Cost Calculator', description: 'Total labor cost as % of revenue', icon: 'Wallet' },
    { slug: 'payroll-cost-calculator', title: 'Payroll Cost Calculator', description: 'Total cost of running payroll', icon: 'CreditCard' },
    { slug: 'workforce-planning-calculator', title: 'Workforce Planning', description: 'Project future headcount needs', icon: 'CalendarRange' },
  ],
};
export default seoData;
