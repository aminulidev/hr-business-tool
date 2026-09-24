const seoData = {
  breadcrumbs: [{ label: 'Calculators' }, { label: 'Cost of Turnover Calculator' }],
  tableOfContents: [
    { id: 'how-to-calculate', label: 'How to Calculate' },
    { id: 'formula', label: 'Formula' },
    { id: 'worked-examples', label: 'Worked Examples' },
    { id: 'frequently-asked-questions', label: 'FAQs' },
    { id: 'related-calculators', label: 'Related Calculators' },
  ],
  howToSteps: [
    'Enter number of departures in the period.',
    'Enter average annual salary of departed employees.',
    'Enter replacement cost as % of salary (recruiting + agency fees, typically 15-25%).',
    'Enter lost productivity % (vacancy + ramp-up, typically 25-50%).',
    'Enter onboarding/training % (typically 10-20%).',
    'Click Calculate to see total turnover cost and cost per departure.',
  ],
  formula: 'Total Cost % = Replacement% + Productivity% + Onboarding%\nCost per Departure = Salary x (Total Cost% / 100)\nTotal Turnover Cost = Departures x Cost per Departure',
  formulaDescription: 'Total turnover cost = replacement + lost productivity + onboarding + lost knowledge. Industry estimate: 50% (entry-level) to 200% (executive/specialized) of annual salary per departure. Components: recruiting 15-25%, lost productivity 25-50%, onboarding 10-20%, lost knowledge 5-15%.',
  workedExamples: [
    { title: 'Entry-Level Workers', description: '10 departures at $45k salary, 50% total cost. Cost/departure = $22,500. Total = $225,000. Low-skill roles have lower turnover cost.' },
    { title: 'Mid-Level Professional', description: '5 departures at $80k, 100% total cost. Cost/departure = $80,000. Total = $400,000. Replacement + 3-month ramp-up + lost productivity.' },
    { title: 'Senior Engineer', description: '2 departures at $150k, 200% total cost. Cost/departure = $300,000. Total = $600,000. Specialized roles have high recruitment + long ramp-up.' },
    { title: 'Executive', description: '1 departure at $250k, 250% total cost. Cost/departure = $625,000. Executive search + lost strategic momentum + transition.' },
    { title: 'Company-Wide Annual', description: '50 departures, avg salary $75k, 100% cost. Total = $3.75M annual turnover cost. Reducing attrition by 5% saves ~$937k/yr.' },
  ],
  faqs: [
    { question: 'What is the cost of employee turnover?', answer: 'Cost of turnover = replacement cost + lost productivity + onboarding + lost knowledge. Industry estimate: 50-200% of annual salary per departure. Entry-level: 50%, mid-level: 100%, executive: 200%+. Calculate: cost per departure = salary × (total cost % / 100).' },
    { question: 'How much does it cost to replace an employee?', answer: 'Typical: 50-200% of annual salary. Breakdown: recruiting 15-25%, lost productivity during vacancy 25-50%, onboarding/ramp-up 10-20%, lost institutional knowledge 5-15%. Entry-level: $15-25k. Mid-level: $50-100k. Executive: $200k+. See our Replacement Cost Calculator for per-role detail.' },
    { question: 'What are the hidden costs of turnover?', answer: 'Beyond direct costs: (1) Overtime for remaining staff covering workload, (2) Manager time on hiring instead of coaching, (3) Team morale/engagement drop, (4) Customer relationship disruption, (5) Knowledge walkout (especially in sales/tech), (6) Training investment lost, (7) Delayed projects/initiatives.' },
    { question: 'How do you calculate cost per departure?', answer: 'Cost per departure = Annual Salary × (Replacement % + Productivity % + Onboarding %) / 100. Example: $75k × (20% + 50% + 15%) = $75k × 0.85 = $63,750 per departure. Adjust percentages by role: higher for specialized, lower for transactional.' },
    { question: 'What is the ROI of retention initiatives?', answer: 'ROI = (Turnover Cost Saved - Retention Program Cost) / Retention Program Cost × 100. Example: $500k retention program reduces turnover by 5 departures × $75k = $375k saved. ROI = ($375k - $500k) / $500k = -25% (year 1). Year 2-3 typically positive as program scales.' },
    { question: 'Which industries have the highest turnover cost?', answer: 'Highest: Tech (200%+ for engineers), Healthcare (150% for nurses), Finance (200% for quants). Lowest: Retail (50%), Hospitality (40%), Food service (30%). High-skill, high-knowledge roles have highest replacement cost due to scarce talent and long ramp-up.' },
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
