const seoData = {
  breadcrumbs: [{ label: 'Calculators' }, { label: 'Promotion Rate Calculator' }],
  tableOfContents: [
    { id: 'how-to-calculate', label: 'How to Calculate' },
    { id: 'formula', label: 'Formula' },
    { id: 'worked-examples', label: 'Worked Examples' },
    { id: 'frequently-asked-questions', label: 'FAQs' },
    { id: 'related-calculators', label: 'Related Calculators' },
  ],
  howToSteps: [
    'Enter number of promotions in the period.',
    'Enter average headcount during the period.',
    'Enter period length in months (12 for annual).',
    'Click Calculate to see promotion rate and annualized rate.',
  ],
  formula: 'Promotion Rate = Promotions / Average Headcount x 100\nAnnualized = (Promotion Rate / Months) x 12\nAvg Time Between Promotions = 12 / Annualized',
  formulaDescription: 'Promotion rate = promotions / average headcount × 100. Healthy: 8-15% annually. Track by gender, race, and tenure to ensure equity. Low rates (under 5%) suggest career path issues; very high rates (over 20%) may indicate title inflation or fast-growth startup.',
  workedExamples: [
    { title: 'Healthy Company', description: '12 promotions, 100 avg HC, 12 months. Rate = 12%. Annualized = 12%. Avg time between promotions = 1 year. Healthy.' },
    { title: 'Low Promotion Rate', description: '3 promotions, 100 HC, 12 months. Rate = 3%. Below 5% threshold — career path issues. Avg time = 3.3 years.' },
    { title: 'Fast-Growth Startup', description: '20 promotions, 50 HC, 12 months. Rate = 40%. High — typical for startup scaling. Avg time = 0.25 years.' },
    { title: 'Quarterly Tracking', description: '3 promotions, 100 HC, 3 months. Rate = 3%. Annualized = 12%. On track for healthy annual rate.' },
    { title: 'Equity Audit', description: 'Eng: 8 prom / 40 HC = 20%. Sales: 2 prom / 30 HC = 6.7%. Engineering promoted at 3x rate of sales — investigate.' },
  ],
  faqs: [
    { question: 'What is promotion rate?', answer: 'Promotion rate = number of promotions / average headcount × 100. Measures internal career mobility. Healthy: 8-15% annually. Below 5% suggests career stagnation; above 20% may indicate title inflation or fast growth. Track by department, gender, race, and tenure for equity.' },
    { question: 'What is a good promotion rate?', answer: 'Healthy: 8-15% annually. Average US company: 10%. High-growth companies: 15-25%. Mature/stable companies: 6-10%. Very low (under 5%) = career path issues, retention risk. Very high (over 20%) may indicate: (1) Title inflation, (2) Fast growth, (3) Restructuring. Track trend over time.' },
    { question: 'How do you calculate annualized promotion rate?', answer: 'Annualized = (period promotion rate / months in period) × 12. Example: 3% over 3 months = (3/3) × 12 = 12% annualized. Useful for comparing different period lengths. Caution: annualization assumes constant rate — seasonality may skew.' },
    { question: 'How do you track promotion equity?', answer: 'Track promotion rate by demographic: gender, race/ethnicity, age, tenure cohort. Statistical analysis: control for role, level, performance. Identify if any group is promoted at significantly lower rate. Investigate root causes: (1) Pipeline diversity, (2) Manager bias, (3) Performance rating bias, (4) Sponsorship gaps. Remediate with targeted programs.' },
    { question: 'What is the difference between promotion and lateral move?', answer: 'Promotion = move to higher level (title, salary band, responsibility). Lateral move = same level, different role (skill development, career exploration). Both count as "internal mobility" — see our Internal Mobility Calculator. Healthy companies have both: 10-15% promotion rate + 5-10% lateral move rate = 15-25% total mobility.' },
    { question: 'How do you improve promotion rate?', answer: 'Strategies: (1) Clear career ladders (publish levels and criteria), (2) Manager training on promotion advocacy, (3) Regular career conversations (1:1s), (4) Skills development programs, (5) Internal job postings (transparency), (6) Succession planning, (7) Mentoring/sponsorship programs, (8) Promotion criteria rubrics (reduce bias).' },
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
