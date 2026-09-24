const seoData = {
  breadcrumbs: [{ label: 'Calculators' }, { label: 'Absenteeism Calculator' }],
  tableOfContents: [
    { id: 'how-to-calculate', label: 'How to Calculate' },
    { id: 'formula', label: 'Formula' },
    { id: 'worked-examples', label: 'Worked Examples' },
    { id: 'frequently-asked-questions', label: 'FAQs' },
    { id: 'related-calculators', label: 'Related Calculators' },
  ],
  howToSteps: [
    'Enter total absent days across all employees in the period.',
    'Enter total number of employees.',
    'Enter work days in the period (typical year: 220 after holidays/PTO).',
    'Enter cost per absence day (lost productivity + replacement labor).',
    'Click Calculate to see absenteeism rate, total cost, and Bradford Factor.',
  ],
  formula: 'Total Scheduled = Employees x Work Days\nAbsenteeism Rate = Absent Days / Total Scheduled x 100\nTotal Cost = Absent Days x Cost per Day\nBradford Factor = Spells x Spells x Days',
  formulaDescription: 'Absenteeism rate = absent days / (employees × work days) × 100. SHRM benchmark: 3.2% (US average). Bradford Factor = S² × D (spells × days) — weights frequent short absences higher. Bradford >100 = concern, >400 = disciplinary action.',
  workedExamples: [
    { title: 'Average Company', description: '70 absent days, 100 employees, 220 work days, $350/day. Total scheduled = 22,000. Rate = 0.32%. Cost = $24,500. Below SHRM 3.2% benchmark.' },
    { title: 'High Absenteeism', description: '350 absent days, 100 employees, 220 work days. Rate = 1.59%. Cost = $122,500. Above benchmark — investigate root causes.' },
    { title: 'Bradford Factor', description: '10 spells of 1 day each = 10×10×10 = 1,000. Concern. 1 spell of 10 days = 1×1×10 = 10. Not concerning. Frequency matters more than total days.' },
    { title: 'Department Comparison', description: 'Manufacturing: 50 days / 5,500 scheduled = 0.9%. Customer Service: 80 days / 4,400 = 1.8%. CS has 2x absenteeism — investigate burnout.' },
    { title: 'Industry Benchmarks', description: 'Healthcare 4.5%, retail 4.0%, manufacturing 2.8%, professional services 2.5%, government 3.5%. Company at 3.2% matches national average.' },
  ],
  faqs: [
    { question: 'What is absenteeism rate?', answer: 'Absenteeism rate = unscheduled absent days / (employees × work days) × 100. SHRM benchmark: 3.2% (US average). Includes sick days, personal days, no-call/no-show. Excludes approved PTO, vacation, FMLA, jury duty. Track by department and individual to identify issues.' },
    { question: 'What is the Bradford Factor?', answer: 'Bradford Factor = S² × D, where S = number of absence spells (occurrences), D = total days absent. Weights frequent short absences higher than rare long ones. Example: 6 × 1-day absences = 36 × 6 = 216. 1 × 6-day absence = 1 × 6 = 6. Frequent absences more disruptive.' },
    { question: 'What is a good absenteeism rate?', answer: 'SHRM benchmark: 3.2% (US average). Below 2% = excellent. 2-4% = average. Above 5% = concern. Industry: healthcare 4.5%, retail 4.0%, manufacturing 2.8%, professional services 2.5%. Track trend — rising rate indicates engagement/health issues.' },
    { question: 'What causes high absenteeism?', answer: 'Top causes: (1) Health issues (chronic illness, mental health), (2) Burnout (overwork, poor work-life balance), (3) Workplace culture (poor management, harassment), (4) Childcare/eldercare gaps, (5) Disengagement (boring/meaningless work), (6) Commute challenges, (7) Toxic team dynamics.' },
    { question: 'How much does absenteeism cost?', answer: 'Cost per absence day = lost productivity (employee salary / work days) + replacement labor (overtime or temp) + manager time + customer service impact. Typical: $250-$500/day for mid-level. 100 employees × 3.2% × 220 days × $350 = $24,640/year. Add indirect costs (team disruption, morale) for total impact.' },
    { question: 'How do you reduce absenteeism?', answer: 'Strategies: (1) Address root causes (health, burnout, culture), (2) Flexible work arrangements (remote, flexible hours), (3) Wellness programs (gym, EAP, mental health), (4) Recognition and engagement, (5) Clear attendance policy with consequences, (6) Return-to-work interviews, (7) Manager training on absence management.' },
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
