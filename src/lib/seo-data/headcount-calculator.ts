const seoData = {
  breadcrumbs: [{ label: 'Calculators' }, { label: 'Headcount Calculator' }],
  tableOfContents: [
    { id: 'how-to-calculate', label: 'How to Calculate' },
    { id: 'formula', label: 'Formula' },
    { id: 'worked-examples', label: 'Worked Examples' },
    { id: 'frequently-asked-questions', label: 'FAQs' },
    { id: 'related-calculators', label: 'Related Calculators' },
  ],
  howToSteps: [
    'Enter current headcount (today\'s total employees).',
    'Enter planned hires for the projection period.',
    'Enter annual attrition rate (% per year, e.g., 15).',
    'Enter projection period in months (12 for annual, 36 for 3-year).',
    'Click Project Headcount to see expected year-end headcount.',
  ],
  formula: 'Departures = Current x (Attrition% / 100) x (Months / 12)\nProjected = Current + Hires - Departures\nNet Growth = Projected - Current',
  formulaDescription: 'Headcount projection = current + planned hires - expected departures. Departures calculated using annualized attrition rate scaled to projection period. Used for budgeting, capacity planning, and workforce strategy.',
  workedExamples: [
    { title: 'Annual Plan', description: '100 current, 20 planned hires, 15% attrition, 12 months. Departures = 100 x 0.15 = 15. Projected = 100 + 20 - 15 = 105. Net growth +5.' },
    { title: '3-Year Growth', description: '50 current, 60 hires over 3yr, 15% attrition. Departures = 50 x 0.15 x 3 = 22.5. Projected = 50 + 60 - 22.5 = 87.5.' },
    { title: 'Steady State', description: '200 current, 30 hires, 15% attrition, 12 months. Departures = 30. Projected = 200. No net growth.' },
    { title: 'Shrinking Org', description: '100 current, 0 hires, 15% attrition, 12 months. Departures = 15. Projected = 85. Net -15.' },
    { title: 'Department Roll-up', description: 'Eng: 50 + 8 hires - 6 dep = 52. Sales: 30 + 5 - 9 = 26. Total: 78 (was 80).' },
  ],
  faqs: [
    { question: 'What is headcount?', answer: 'Headcount = total number of active employees on payroll at a point in time. Includes full-time, part-time, and temporary workers. Excludes contractors and 1099 workers. Used for budgeting, org design, and reporting.' },
    { question: 'Active vs total headcount?', answer: 'Active = currently on payroll. Total = active + on-leave (FMLA, sabbatical, military) + terminated-but-in-system. For most reporting, use active headcount. Some metrics use "average headcount" over a period = (start + end) / 2.' },
    { question: 'How do you project headcount?', answer: 'Projected = Current + Planned Hires - Expected Departures. Expected departures = current × annual attrition rate × (months / 12). For multi-year, compound the calculation. See our Workforce Planning Calculator for revenue-based projection.' },
    { question: 'Does headcount include contractors?', answer: 'No — contractors (1099) are not employees. Headcount typically includes W-2 workers only: full-time, part-time, and temporary employees. Some companies track "extended workforce" separately, including contractors, consultants, and outsourced staff.' },
    { question: 'What is the difference between headcount and FTE?', answer: 'Headcount = number of people. FTE = full-time equivalent (standardizes part-time to full-time units). Example: 100 headcount (50 FT + 50 PT at 20h) = 75 FTE. Use FTE for budgeting and productivity; headcount for org design and benefits administration.' },
    { question: 'How often should headcount be reported?', answer: 'Monthly minimum for HR. Quarterly for executive review. Annual for board/strategic planning. Real-time headcount dashboards are common in mid/large companies (Workday, BambooHR, ADP). Track by department, location, and employment type for actionable insights.' },
  ],
  relatedTools: [
    { slug: 'employee-turnover-calculator', title: 'Employee Turnover Calculator', description: 'Turnover rate and cost', icon: 'Users' },
    { slug: 'cost-of-turnover-calculator', title: 'Cost of Turnover Calculator', description: 'Financial impact of attrition', icon: 'DollarSign' },
    { slug: 'employee-retention-calculator', title: 'Employee Retention Calculator', description: 'Retention rate tracking', icon: 'Users' },
    { slug: 'employee-cost-calculator', title: 'Employee Cost Calculator', description: 'True cost per employee', icon: 'DollarSign' },
    { slug: 'labor-cost-calculator', title: 'Labor Cost Calculator', description: 'Total labor as % of revenue', icon: 'Wallet' },
  ],
};
export default seoData;
