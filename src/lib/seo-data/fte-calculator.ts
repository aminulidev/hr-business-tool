const seoData = {
  breadcrumbs: [{ label: 'Calculators' }, { label: 'FTE Calculator' }],
  tableOfContents: [
    { id: 'how-to-calculate', label: 'How to Calculate' },
    { id: 'formula', label: 'Formula' },
    { id: 'worked-examples', label: 'Worked Examples' },
    { id: 'frequently-asked-questions', label: 'FAQs' },
    { id: 'related-calculators', label: 'Related Calculators' },
  ],
  howToSteps: [
    'Enter number of full-time employees (typically 40h/week).',
    'Enter total part-time hours per week (sum across all PT employees).',
    'Enter standard full-time hours per week (default 40; ACA uses 30).',
    'Click Calculate FTE to see total full-time equivalents and ACA FTE count.',
  ],
  formula: 'Part-Time FTE = Total PT Hours / Full-Time Hours\nTotal FTE = Full-Time Employees + PT FTE\nACA FTE = FT + (PT Hours / 30)',
  formulaDescription: 'FTE (Full-Time Equivalent) standardizes part-time hours to full-time units. ACA counts 30h+/week as full-time. Employers with 50+ FTEs must offer health insurance (ACA employer mandate).',
  workedExamples: [
    { title: 'Small Business', description: '10 FT + 120 PT hours / 40 = 3 PT FTE. Total = 13 FTE. Below ACA 50-FTE threshold.' },
    { title: 'ACA Threshold', description: '30 FT + 600 PT hours / 40 = 15 PT FTE. Total = 45 FTE. ACA FTE = 30 + (600/30) = 50. Hits ACA threshold.' },
    { title: 'Restaurant', description: '5 FT managers + 25 PT servers x 25h = 625 PT hours. PT FTE = 625/40 = 15.6. Total = 20.6 FTE.' },
    { title: 'Tech Company', description: '50 FT engineers + 5 PT contractors x 20h = 100 PT hours. PT FTE = 100/40 = 2.5. Total = 52.5 FTE.' },
    { title: 'Manufacturing', description: '100 FT + 50 PT x 30h = 1500 PT hours. PT FTE = 1500/40 = 37.5. Total = 137.5 FTE. ACA FTE = 100 + (1500/30) = 150.' },
  ],
  faqs: [
    { question: 'What is FTE?', answer: 'FTE (Full-Time Equivalent) converts part-time hours to full-time units. 1 FTE = 1 full-time worker (typically 40h/week or 2,080h/year). 2 part-timers at 20h/week each = 1.0 FTE combined. Used for budgeting, ACA compliance, and workforce planning.' },
    { question: 'How is FTE calculated?', answer: 'FTE = Total Hours / Standard Full-Time Hours. For part-time: PT FTE = Total PT Hours / 40 (or your standard FT hours). Total FTE = Full-Time Employees + PT FTE. ACA uses 30h/week as the FT threshold.' },
    { question: 'What is the ACA FTE threshold?', answer: 'ACA (Affordable Care Act) requires employers with 50+ full-time equivalent employees to offer health insurance. ACA counts employees working 30h+/week as full-time. Part-time hours are converted at 30h/week (not 40h). Calculate: ACA FTE = FT employees + (total PT hours / 30).' },
    { question: 'FTE vs headcount?', answer: 'Headcount = total number of employees regardless of hours. FTE = standardized to full-time equivalent. Example: 100 headcount with 50 FT + 50 PT (20h each) = 50 + 25 = 75 FTE. FTE is better for budgeting and productivity metrics.' },
    { question: 'What is 0.5 FTE?', answer: '0.5 FTE = half-time = 20 hours/week (assuming 40h standard). Common for part-time roles. 0.75 FTE = 30h/week. 1.0 FTE = 40h/week. 1.5 FTE would be 60h/week (one person doing 1.5 jobs, or overtime).' },
    { question: 'How do I calculate FTE for budgeting?', answer: 'Total FTE × loaded cost per FTE = total labor budget. Example: 50 FTE × $100,000 loaded cost = $5M labor budget. Use FTE (not headcount) because part-time roles cost less. Standard FT = 2,080 hours/year (40h × 52 weeks).' },
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
