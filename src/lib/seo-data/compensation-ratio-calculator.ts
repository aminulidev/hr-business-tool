const seoData = {
  breadcrumbs: [{ label: 'Calculators' }, { label: 'Compensation Ratio Calculator' }],
  tableOfContents: [
    { id: 'how-to-calculate', label: 'How to Calculate' },
    { id: 'formula', label: 'Formula' },
    { id: 'worked-examples', label: 'Worked Examples' },
    { id: 'frequently-asked-questions', label: 'FAQs' },
    { id: 'related-calculators', label: 'Related Calculators' },
  ],
  howToSteps: [
    'Enter the employee\'s current annual salary.',
    'Enter the market salary midpoint for the role (from salary survey).',
    'Enter market minimum (optional, for range position).',
    'Enter market maximum (optional, for range position).',
    'Click Calculate to see compa-ratio, range position, and status.',
  ],
  formula: 'Compa-Ratio = Employee Salary / Market Midpoint\nRange Position = (Salary - Min) / (Max - Min) x 100\nStatus: <90% Underpaid, 90-110% At Market, >110% Overpaid',
  formulaDescription: 'Compa-ratio = employee salary / market midpoint. Below 0.9 (90%) = underpaid (retention risk). 0.9-1.1 (90-110%) = at market. Above 1.1 (110%) = overpaid (budget pressure). Range position = where salary sits within the pay band (min to max).',
  workedExamples: [
    { title: 'At Market', description: '$85k salary, $85k midpoint. Compa = 1.00 (100%). Range position 50% (middle). Status: At Market. Ideal positioning.' },
    { title: 'Underpaid', description: '$65k salary, $80k midpoint. Compa = 0.81 (81%). Range position 0% (at min). Status: Underpaid. Retention risk — adjust to $72k+ to reach 90%.' },
    { title: 'Overpaid', description: '$100k salary, $85k midpoint. Compa = 1.18 (118%). Range position 100% (at max). Status: Overpaid. Freeze increases until market catches up.' },
    { title: 'New Hire Below Mid', description: '$70k salary, $80k midpoint, $65k min, $95k max. Compa = 0.88 (88%). Range position 20%. Underpaid but expected for new hire.' },
    { title: 'Promotion Adjustment', description: '$90k salary after promotion, $100k midpoint. Compa = 0.90 (90%). Range position 40%. At lower end of new band — plan 2-3 raises to reach midpoint.' },
  ],
  faqs: [
    { question: 'What is compa-ratio?', answer: 'Compa-ratio = employee salary / market midpoint × 100. Measures how an employee\'s pay compares to the market rate for their role. 100% = at market midpoint. Below 90% = underpaid. Above 110% = overpaid. Used for pay equity analysis and salary band management.' },
    { question: 'What is a good compa-ratio?', answer: 'Target: 90-110% (at market). Below 90% = retention risk (employee can get more elsewhere). Above 110% = budget pressure and compression issues. New hires typically start 85-95%; experienced employees at 100-110%. Top performers may reach 115-125%.' },
    { question: 'What is range position?', answer: 'Range position = (salary - min) / (max - min) × 100. Shows where salary sits within the pay band. 0% = at minimum, 50% = at midpoint, 100% = at maximum. Useful for tracking career progression and identifying employees nearing band ceiling.' },
    { question: 'How do you calculate market midpoint?', answer: 'Market midpoint = average of market P25, P50 (median), and P75 salary data from compensation surveys (Radford, Mercer, Payscale, Glassdoor). Or use P50 directly as midpoint, P25 as min, P75 as max. Update annually for inflation (3-4%) and market shifts.' },
    { question: 'What is pay compression?', answer: 'Pay compression = when salaries of different experience levels are too close. Example: new hire at $78k, 5-year veteran at $82k — only 5% difference despite 5 years more experience. Caused by: market salary inflation outpacing internal raises. Fix by adjusting veteran salaries or narrowing new-hire range.' },
    { question: 'How often should compa-ratio be reviewed?', answer: 'Annually at minimum, during merit review cycle. More often for fast-moving markets (tech, biotech). Track by: department (identify underpaid teams), tenure cohort (new hires vs veterans), gender/race (pay equity audit), performance tier (top performers should be above midpoint).' },
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
