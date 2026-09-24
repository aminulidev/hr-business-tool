const seoData = {
  breadcrumbs: [{ label: 'Calculators' }, { label: 'Workforce Capacity Calculator' }],
  tableOfContents: [
    { id: 'how-to-calculate', label: 'How to Calculate' },
    { id: 'formula', label: 'Formula' },
    { id: 'worked-examples', label: 'Worked Examples' },
    { id: 'frequently-asked-questions', label: 'FAQs' },
    { id: 'related-calculators', label: 'Related Calculators' },
  ],
  howToSteps: [
    'Enter headcount.',
    'Enter hours per week per employee.',
    'Enter output per hour (units, $ revenue, tickets).',
    'Enter utilization rate (%) — productive vs available hours.',
    'Click Calculate to see weekly, monthly, and annual capacity.',
  ],
  formula: 'Weekly Hours = Headcount x Hours/Week\nProductive Hours = Weekly Hours x (Utilization% / 100)\nWeekly Capacity = Productive Hours x Output/Hour\nAnnual Capacity = Weekly Capacity x 52\nMonthly = Annual / 12',
  formulaDescription: 'Workforce capacity = headcount × hours/week × utilization × output/hour. Use to identify capacity gaps (capacity vs forecast demand) and plan hiring. For headcount planning based on revenue targets, see Workforce Planning Calculator.',
  workedExamples: [
    { title: 'Manufacturing Plant', description: '50 HC, 40h/week, 100 units/hour, 85% util. Weekly = 2,000h × 0.85 = 1,700 productive. Weekly cap = 170k units. Annual = 8.84M units.' },
    { title: 'Call Center', description: '100 HC, 40h, 8 calls/hour, 75% util (after breaks/training). Weekly = 4,000 × 0.75 = 3,000. Cap = 24k calls/week. Annual = 1.25M calls.' },
    { title: 'Consulting Firm', description: '25 HC, 40h, $200/hour billable, 75% billable util. Weekly = 1,000 × 0.75 = 750 billable. Cap = $150k/week. Annual = $7.8M.' },
    { title: 'Software Team', description: '20 HC, 40h, 0.5 features/hour, 70% util (rest is meetings/admin). Weekly = 800 × 0.70 = 560. Cap = 280 features/week. Annual = 14,560.' },
    { title: 'Warehouse', description: '80 HC, 40h, 50 orders/hour, 80% util. Weekly = 3,200 × 0.80 = 2,560. Cap = 128k orders/week. Annual = 6.66M orders.' },
  ],
  faqs: [
    { question: 'What is workforce capacity?', answer: 'Maximum output a workforce can produce = headcount × hours/week × utilization × output/hour. Measures theoretical maximum. Compare to actual demand forecast to identify capacity gaps (need more headcount) or surplus (redeploy or reduce). Critical for sales/inventory planning.' },
    { question: 'How do you calculate capacity utilization?', answer: 'Capacity utilization = actual output / maximum capacity × 100. Example: producing 8,000 units/week when capacity is 10,000 = 80% utilization. Below 70% = underutilized (high fixed cost per unit). Above 95% = no slack for spikes/maintenance. Target: 80-90% for most industries.' },
    { question: 'What is a capacity gap?', answer: 'Capacity gap = forecast demand - current capacity. Positive gap = need more capacity (hire, automate, outsource). Negative gap = surplus capacity (redeploy, reduce headcount, take on more work). Track by department, skill, and timeframe. Address proactively — reactive hiring is expensive.' },
    { question: 'How do you increase workforce capacity?', answer: 'Options: (1) Add headcount (most expensive, slowest), (2) Increase hours (overtime — 1.5x cost, burnout risk), (3) Improve utilization (reduce admin, meetings — free), (4) Improve productivity (training, tools — medium cost), (5) Automation (high upfront, long-term savings), (6) Outsource (variable cost).' },
    { question: 'What is the difference between capacity and capability?', answer: 'Capacity = how much output (volume). Capability = what types of output (skills, quality). You can have capacity but not capability (lots of junior staff, no senior expertise). Or capability but not capacity (one expert, can\'t scale). Workforce planning addresses both: headcount for capacity, training/hiring for capability.' },
    { question: 'How do you forecast demand for workforce planning?', answer: 'Methods: (1) Historical trends + growth rate, (2) Sales pipeline (weighted forecast), (3) Customer commitments (signed contracts), (4) Market research (TAM/SAM/SOM), (5) Bottom-up (department forecasts), (6) Scenario planning (base/bull/bear). Use rolling 12-month forecast updated quarterly. Compare to capacity to identify gaps.' },
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
