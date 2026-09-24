const seoData = {
  breadcrumbs: [{ label: 'Calculators' }, { label: 'Labor Efficiency Calculator' }],
  tableOfContents: [
    { id: 'how-to-calculate', label: 'How to Calculate' },
    { id: 'formula', label: 'Formula' },
    { id: 'worked-examples', label: 'Worked Examples' },
    { id: 'frequently-asked-questions', label: 'FAQs' },
    { id: 'related-calculators', label: 'Related Calculators' },
  ],
  howToSteps: [
    'Enter standard hours for actual output (expected hours based on standard).',
    'Enter actual hours worked.',
    'Enter hourly rate for variance cost calculation.',
    'Click Calculate to see efficiency rate and variance cost.',
  ],
  formula: 'Efficiency = (Standard Hours / Actual Hours) x 100\nVariance = Standard - Actual (hours)\nVariance Cost = Variance x Hourly Rate\nStatus: >=100% Above, 90-100% At, <90% Below Standard',
  formulaDescription: 'Labor efficiency = (standard hours for actual output / actual hours worked) × 100. Above 100% = outperforming standard. Below 90% = underperforming. Variance cost = (standard - actual) × hourly rate. Used in manufacturing (machine-paced work) and professional services.',
  workedExamples: [
    { title: 'Above Standard', description: '1,600 standard hours for output, 1,500 actual. Efficiency = 106.7%. Variance = +100 hours. At $25/hr = $2,500 favorable variance.' },
    { title: 'At Standard', description: '1,600 standard, 1,620 actual. Efficiency = 98.8%. Variance = -20 hours. $500 unfavorable. Close to standard.' },
    { title: 'Below Standard', description: '1,600 standard, 1,900 actual. Efficiency = 84.2%. Variance = -300 hours. $7,500 unfavorable. Investigate.' },
    { title: 'Manufacturing Line', description: '800 standard units × 2h = 1,600 standard. Actual 1,750 hours. Efficiency = 91.4%. $3,750 unfavorable at $25/hr.' },
    { title: 'Consulting Project', description: '100 standard hours for project, actual 85 hours. Efficiency = 117.6%. Favorable — team performed above standard.' },
  ],
  faqs: [
    { question: 'What is labor efficiency?', answer: 'Labor efficiency = (standard hours for actual output / actual hours worked) × 100. Measures how actual performance compares to expected (standard) performance. Above 100% = outperforming standard. Below 100% = underperforming. Used in manufacturing, services, and project work.' },
    { question: 'What is standard hours?', answer: 'Standard hours = expected hours required to produce actual output, based on engineered standards or historical averages. Example: 2 standard hours per unit × 800 units produced = 1,600 standard hours. If actual was 1,750 hours, efficiency = 1,600/1,750 = 91.4%.' },
    { question: 'What is labor efficiency variance?', answer: 'Variance = standard hours - actual hours. Favorable (positive) = fewer hours than standard (efficient). Unfavorable (negative) = more hours than standard (inefficient). Variance cost = variance × hourly rate. Example: -300 hours × $25 = $7,500 unfavorable variance cost.' },
    { question: 'Efficiency vs productivity?', answer: 'Efficiency = actual output / standard output (ratio to expectation). Productivity = output / input (volume, no expectation). You can be productive but inefficient (high output at high input) or efficient but not productive (meets standard at low volume). Both matter — efficiency is relative to standard, productivity is absolute.' },
    { question: 'What causes low labor efficiency?', answer: 'Causes: (1) Insufficient training/skills, (2) Poor processes/workflow, (3) Equipment downtime or quality issues, (4) Material shortages, (5) Fatigue/low morale, (6) Inadequate supervision, (7) Unrealistic standards, (8) Rework/defects, (9) Setup/changeover time, (10) Distractions/interruptions.' },
    { question: 'How do you improve labor efficiency?', answer: 'Strategies: (1) Training and skill development, (2) Process improvement (Lean, Six Sigma), (3) Better tools and equipment, (4) Standard work procedures, (5) Quality at source (reduce rework), (6) Predictive maintenance (reduce downtime), (7) Workforce scheduling (right people, right time), (8) Incentive systems (gainsharing), (9) Performance feedback.' },
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
