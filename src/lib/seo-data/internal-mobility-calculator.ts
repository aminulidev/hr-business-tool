const seoData = {
  breadcrumbs: [{ label: 'Calculators' }, { label: 'Internal Mobility Calculator' }],
  tableOfContents: [
    { id: 'how-to-calculate', label: 'How to Calculate' },
    { id: 'formula', label: 'Formula' },
    { id: 'worked-examples', label: 'Worked Examples' },
    { id: 'frequently-asked-questions', label: 'FAQs' },
    { id: 'related-calculators', label: 'Related Calculators' },
  ],
  howToSteps: [
    'Enter number of promotions in the period.',
    'Enter number of lateral moves (same level, different role).',
    'Enter average headcount.',
    'Click Calculate to see internal mobility rate.',
  ],
  formula: 'Total Moves = Promotions + Lateral Moves\nMobility Rate = Total Moves / Average Headcount x 100\nPromotion Share = Promotions / Total Moves x 100\nLateral Share = Lateral Moves / Total Moves x 100',
  formulaDescription: 'Internal mobility rate = (promotions + lateral moves) / average headcount × 100. LinkedIn data: companies with high internal mobility retain employees 2x longer. Healthy: 10-20% annually. Low mobility (<5%) suggests career stagnation; very high (>30%) may indicate churn.',
  workedExamples: [
    { title: 'Healthy Mobility', description: '12 promotions + 8 lateral = 20 total moves, 100 HC. Rate = 20%. Promotion share 60%, lateral 40%. Healthy mix.' },
    { title: 'Low Mobility', description: '5 promotions + 2 lateral = 7 moves, 100 HC. Rate = 7%. Below 10% — career stagnation risk.' },
    { title: 'High Mobility', description: '15 promotions + 15 lateral = 30 moves, 100 HC. Rate = 30%. High — could indicate churn or active talent marketplace.' },
    { title: 'Promotion-Heavy', description: '15 promotions + 2 lateral = 17 moves, 100 HC. Rate = 17%. Promotion share 88% — limited lateral exploration.' },
    { title: 'Lateral-Heavy', description: '3 promotions + 12 lateral = 15 moves, 100 HC. Rate = 15%. Lateral share 80% — limited upward mobility.' },
  ],
  faqs: [
    { question: 'What is internal mobility?', answer: 'Internal mobility = employees moving to new roles within the same company. Includes: (1) Promotions (higher level), (2) Lateral moves (same level, different role), (3) Cross-functional moves, (4) Geographic relocation, (5) Project assignments. Mobility rate = (moves / headcount) × 100. LinkedIn: high mobility = 2x retention.' },
    { question: 'What is a good internal mobility rate?', answer: 'Healthy: 10-20% annually. Top companies: 20-30%. Low (<5%) = career stagnation, retention risk. Very high (>30%) may indicate: (1) Restructuring, (2) Churn, (3) Active talent marketplace, (4) High-growth startup. Track mix of promotions vs lateral — both matter for career development.' },
    { question: 'Internal mobility vs external hiring?', answer: 'Internal mobility: (1) Faster ramp-up (knows company), (2) Retains institutional knowledge, (3) Boosts engagement/retention, (4) Lower cost (no recruiting fees), (5) Rewards performance. External hiring: (1) Brings new skills/perspectives, (2) Faster than developing internal talent, (3) Higher cost/risk. Balance: 50/50 internal/external for most roles.' },
    { question: 'How do you improve internal mobility?', answer: 'Strategies: (1) Internal job board (transparent openings), (2) Talent marketplace (skills-based matching), (3) Manager support for moves (don\'t block), (4) Skills development programs, (5) Cross-functional projects, (6) Mentoring/sponsorship, (7) Job rotation programs, (8) Clear career paths. LinkedIn Learning: 94% of employees stay longer with investment in career.' },
    { question: 'What is a talent marketplace?', answer: 'Internal platform matching employees to opportunities: projects, gigs, lateral moves, promotions. Examples: Gloat, Eightfold, Workday Talent Marketplace. Benefits: (1) Employees find growth opportunities, (2) Managers find internal talent, (3) Skills-based deployment, (4) Reduces external hiring. Used by Unilever, Schneider Electric, Mastercard.' },
    { question: 'What is the retention impact of internal mobility?', answer: 'LinkedIn data: companies with high internal mobility retain employees 2x longer. Employees who move internally (lateral or promotion) have 75% higher 3-year retention than those who don\'t. Cost savings: $50k-$100k per avoided external hire. Plus: faster ramp-up, retained knowledge, engagement boost. Strong business case.' },
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
