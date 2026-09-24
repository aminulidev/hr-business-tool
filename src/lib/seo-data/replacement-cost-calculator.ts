const seoData = {
  breadcrumbs: [{ label: 'Calculators' }, { label: 'Replacement Cost Calculator' }],
  tableOfContents: [
    { id: 'how-to-calculate', label: 'How to Calculate' },
    { id: 'formula', label: 'Formula' },
    { id: 'worked-examples', label: 'Worked Examples' },
    { id: 'frequently-asked-questions', label: 'FAQs' },
    { id: 'related-calculators', label: 'Related Calculators' },
  ],
  howToSteps: [
    'Enter annual salary of the departing employee.',
    'Enter recruiting cost as % of salary (typically 15-25%).',
    'Enter onboarding cost as % of salary (typically 8-12%).',
    'Enter training/ramp-up cost as % of salary (typically 20-40%).',
    'Enter vacancy duration in weeks.',
    'Enter coverage overtime cost ($).',
  ],
  formula: 'Recruiting = Salary x (Recruiting% / 100)\nOnboarding = Salary x (Onboarding% / 100)\nTraining = Salary x (Training% / 100)\nVacancy Cost = Salary x (Weeks / 52)\nTotal = Recruiting + Onboarding + Training + Vacancy + OT',
  formulaDescription: 'Replacement cost = recruiting + onboarding + training + vacancy cost + coverage overtime. Ranges from 50% (entry-level) to 200% (executive/specialized) of annual salary. Vacancy cost = salary × (weeks vacant / 52). Reduce by improving retention and building internal pipeline.',
  workedExamples: [
    { title: 'Entry-Level Worker', description: '$45k salary, 20% recruiting, 10% onboarding, 20% training, 4 weeks vacancy, $2k OT. Total = $9k + $4.5k + $9k + $3.5k + $2k = $28k. 62% of salary.' },
    { title: 'Mid-Level Professional', description: '$80k salary, 20% recruiting, 10% onboarding, 30% training, 6 weeks, $5k OT. Total = $16k + $8k + $24k + $9.2k + $5k = $62.2k. 78% of salary.' },
    { title: 'Senior Engineer', description: '$150k salary, 25% recruiting, 10% onboarding, 40% training, 8 weeks, $10k OT. Total = $37.5k + $15k + $60k + $23k + $10k = $145.5k. 97% of salary.' },
    { title: 'Sales Rep', description: '$70k salary, 25% recruiting, 5% onboarding, 30% training, 4 weeks, $8k OT (lost deals). Total = $17.5k + $3.5k + $21k + $5.4k + $8k = $55.4k. 79% of salary.' },
    { title: 'Executive', description: '$250k salary, 30% recruiting (search firm), 5% onboarding, 20% training, 12 weeks, $15k OT. Total = $75k + $12.5k + $50k + $57.7k + $15k = $210.2k. 84% of salary.' },
  ],
  faqs: [
    { question: 'What is replacement cost?', answer: 'Total cost to replace a departing employee: recruiting (job ads, agency, HR time) + onboarding (orientation, setup) + training (ramp-up to full productivity) + vacancy cost (lost productivity during vacancy) + coverage overtime. Range: 50-200% of annual salary.' },
    { question: 'How much does it cost to replace an employee?', answer: 'Typical: 50-200% of annual salary. Entry-level: 50% ($25k on $50k). Mid-level: 75-100% ($60-80k on $80k). Senior/specialized: 150-200% ($150-200k on $100k). Executive: 200%+ ($300k+ on $150k). See our Cost of Turnover Calculator for company-wide impact.' },
    { question: 'What is vacancy cost?', answer: 'Cost of an unfilled position = (annual salary / 52) × weeks vacant + lost revenue + overtime for coverage + manager time on hiring. Example: $80k salary × 6 weeks vacant / 52 = $9,231 salary cost. Add $5k OT + lost productivity = $15-20k vacancy cost.' },
    { question: 'How do you reduce replacement cost?', answer: 'Strategies: (1) Improve retention (best way — see our Retention Calculator), (2) Build internal talent pipeline (succession planning), (3) Cross-train employees (coverage during vacancy), (4) Reduce time-to-fill, (5) Employee referral program (faster, cheaper sourcing), (6) Onboarding program (faster ramp-up).' },
    { question: 'What is the difference between replacement cost and turnover cost?', answer: 'Replacement cost = cost to replace ONE employee. Turnover cost = total cost of ALL departures in a period = replacement cost × number of departures. Example: 10 departures × $60k replacement = $600k turnover cost. Track both metrics for full picture.' },
    { question: 'How do you calculate replacement cost by role?', answer: 'Adjust percentages by role: high-turnover transactional roles (retail, food service) = 50% salary. Knowledge workers (engineers, analysts) = 100-150%. Sales (lost pipeline) = 100-150%. Executives (search firm, transition) = 200-300%. Specialist roles with scarce talent = 200%+. Track actual costs by role to refine estimates.' },
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
