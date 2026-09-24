const seoData = {
  breadcrumbs: [{ label: 'Calculators' }, { label: 'Workforce Planning Calculator' }],
  tableOfContents: [
    { id: 'how-to-calculate', label: 'How to Calculate' },
    { id: 'formula', label: 'Formula' },
    { id: 'worked-examples', label: 'Worked Examples' },
    { id: 'frequently-asked-questions', label: 'FAQs' },
    { id: 'related-calculators', label: 'Related Calculators' },
  ],
  howToSteps: [
    'Enter current annual revenue.',
    'Enter target revenue (in N years).',
    'Enter current headcount.',
    'Enter years to reach target.',
    'Enter annual attrition rate (%).',
    'Click Plan Workforce to see projected headcount need and hiring plan.',
  ],
  formula: 'Revenue per Employee = Current Revenue / Current Headcount\nTarget Headcount = Target Revenue / Revenue per Employee\nGrowth Needed = Target - Current\nAttrition Loss = Current x (Attrition% / 100) x Years\nTotal Hires = Growth + Attrition Loss',
  formulaDescription: 'Workforce planning: target headcount = target revenue / current revenue per employee. Add attrition losses (current HC × annual rate × years). Assumes constant revenue per employee — adjust for productivity gains. For capacity analysis, see Workforce Capacity Calculator.',
  workedExamples: [
    { title: 'Growth Plan', description: '$10M current rev, $20M target, 50 current HC, 3 years, 15% attrition. Rev/emp = $200k. Target HC = 100. Growth = 50. Attrition loss = 22.5. Total hires = 72.5. ~24/year.' },
    { title: 'Steady State', description: '$5M current, $5M target, 25 HC, 1 year, 12% attrition. Target HC = 25. Growth = 0. Attrition = 3. Total hires = 3. Replacement hiring only.' },
    { title: 'Aggressive Growth', description: '$2M current, $10M target, 10 HC, 2 years, 20% attrition. Rev/emp = $200k. Target = 50. Growth = 40. Attrition = 4. Total = 44. 22/year.' },
    { title: 'Downsizing', description: '$20M current, $15M target, 100 HC, 1 year, 10% attrition. Target = 75. Growth = -25. Attrition = 10. Total hires = -15 (no hiring, natural attrition).' },
    { title: 'Productivity Improvement', description: '$10M current, $15M target, 50 HC, 2 years, 15% attrition. If rev/emp grows 20%: target HC = 63 (not 75). Growth = 13. Attrition = 15. Total = 28.' },
  ],
  faqs: [
    { question: 'What is workforce planning?', answer: 'Workforce planning = forecasting future headcount needs based on business strategy. Target headcount = target revenue / current revenue per employee. Add attrition losses. Build hiring plan, budget, and training plan. Strategic (3-5 year) vs operational (annual) planning. See our Headcount Calculator.' },
    { question: 'How do you forecast headcount needs?', answer: 'Methods: (1) Revenue-based (target revenue / revenue per employee), (2) Workload-based (forecast output / productivity per employee), (3) Ratio-based (e.g., 1 manager per 8 ICs), (4) Bottom-up (department-level forecasts), (5) Scenario planning (base/optimistic/conservative). Combine methods for accuracy.' },
    { question: 'What is strategic workforce planning?', answer: 'Strategic workforce planning = 3-5 year horizon. Aligns workforce with business strategy. Identifies: (1) Critical roles to fill, (2) Skills gaps, (3) Build vs buy vs borrow decisions, (4) Geographic expansion, (5) Org structure changes, (6) Succession planning. Usually annual cycle with quarterly updates.' },
    { question: 'How do you account for productivity gains?', answer: 'Productivity improvement (3-5%/year typical) reduces headcount needs. Formula: adjusted target HC = target revenue / (current rev per emp × (1 + productivity growth)^years). Example: $20M target, $200k current rev/emp, 5% productivity × 3 years = $231k. Target HC = 87 (not 100).' },
    { question: 'What is the cost of workforce planning?', answer: 'Cost of over-hiring: salary + benefits + overhead × excess headcount × time. Cost of under-hiring: lost revenue, burnout, turnover, missed opportunities. Workforce planning ROI: avoiding even 1-2 unnecessary hires saves $100k-$300k/year. Most workforce planning pays for itself within 6-12 months.' },
    { question: 'How do you build a hiring plan?', answer: 'Steps: (1) Forecast headcount need by role/department, (2) Subtract current headcount = open requisitions, (3) Add attrition backfill (current HC × annual rate), (4) Sequence by priority and timing, (5) Budget recruiting cost (cost per hire × total), (6) Build talent pipeline (referrals, university, sourcing), (7) Set quarterly milestones.' },
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
