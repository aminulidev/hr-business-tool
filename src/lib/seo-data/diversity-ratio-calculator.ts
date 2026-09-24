const seoData = {
  breadcrumbs: [{ label: 'Calculators' }, { label: 'Diversity Ratio Calculator' }],
  tableOfContents: [
    { id: 'how-to-calculate', label: 'How to Calculate' },
    { id: 'formula', label: 'Formula' },
    { id: 'worked-examples', label: 'Worked Examples' },
    { id: 'frequently-asked-questions', label: 'FAQs' },
    { id: 'related-calculators', label: 'Related Calculators' },
  ],
  howToSteps: [
    'Enter total number of employees.',
    'Enter number of women employees.',
    'Enter number of underrepresented minorities.',
    'Enter number of employees age 40+ (ADEA protected class).',
    'Click Calculate to see diversity ratios and composite score.',
  ],
  formula: 'Women % = Women / Total x 100\nMinority % = Minorities / Total x 100\nAge 40+ % = Age 40+ / Total x 100\nDiversity Score = (Women % + Minority % + Age 40+ %) / 3',
  formulaDescription: 'Diversity score = average of representation across tracked dimensions. US workforce benchmarks (BLS): women 47%, racial minorities 36%, age 40+ 45%. EEO-1 reporting required for employers with 100+ employees. Higher diversity correlates with 35%+ financial outperformance (McKinsey).',
  workedExamples: [
    { title: 'Balanced Company', description: '100 total, 47 women, 36 minorities, 45 age 40+. Score = (47+36+45)/3 = 42.7. Matches US workforce benchmarks.' },
    { title: 'Tech Company', description: '100 total, 35 women, 25 minorities, 30 age 40+. Score = 30. Below benchmarks — focus on recruiting and retention.' },
    { title: 'Healthcare', description: '100 total, 75 women, 35 minorities, 50 age 40+. Score = 53.3. Strong diversity — typical for healthcare.' },
    { title: 'Construction', description: '100 total, 10 women, 25 minorities, 40 age 40+. Score = 25. Below benchmarks — industry challenge.' },
    { title: 'Gov\'t Agency', description: '100 total, 50 women, 40 minorities, 55 age 40+. Score = 48.3. Strong diversity — typical for government.' },
  ],
  faqs: [
    { question: 'What is workplace diversity?', answer: 'Workforce representation across dimensions: gender, race/ethnicity, age, sexual orientation, disability, veteran status. EEO-1 reporting (employers 100+) tracks: gender × 7 race categories. DEI metrics should be tracked by department, level, and hiring stage to identify bottlenecks. Higher diversity correlates with 35%+ financial outperformance (McKinsey).' },
    { question: 'What is EEO-1 reporting?', answer: 'EEO-1 report = annual filing with EEOC for employers with 100+ employees (or 50+ if federal contractor). Reports workforce by: job category (10 categories) × gender × race/ethnicity (7 categories). Due annually. Used to identify employment discrimination patterns. Non-compliance: $500+ per violation. Public companies may face shareholder pressure.' },
    { question: 'What are DEI metrics?', answer: 'Diversity, Equity, Inclusion metrics: (1) Representation (by gender, race, age, level), (2) Hiring diversity (% diverse candidates at each stage), (3) Promotion equity (promotion rates by demographic), (4) Pay equity (salary by demographic, controlled for role/experience), (5) Retention by demographic, (6) Engagement scores by demographic.' },
    { question: 'What is pay equity?', answer: 'Pay equity = equal pay for equal work regardless of gender, race, age, or other protected characteristics. Statistical analysis controls for: role, level, experience, location, performance. Identify and remediate gaps. Required in CA, NY, MA, CO, WA, OR, IL, NJ, DE. Penalties for gaps up to $10k per employee. Conducted annually by compensation analysts.' },
    { question: 'How do you improve workplace diversity?', answer: 'Strategies: (1) Diverse candidate slates (require 2+ diverse candidates), (2) Structured interviews (reduce bias), (3) Blind resume screening, (4) Diverse interview panels, (5) Expand sourcing (HBCUs, women\'s conferences), (6) Internal mobility programs, (7) Mentorship/sponsorship, (8) Pay equity audits, (9) Inclusive culture (ERGs, training), (10) Leadership accountability (tie to executive comp).' },
    { question: 'What is the business case for diversity?', answer: 'McKinsey research: companies in top quartile for diversity are 35% more likely to outperform financially. Gender-diverse executive teams: 25% higher likelihood of above-average profitability. Ethnically-diverse teams: 36% higher. Diverse teams: better decision-making (87% better per Cloverpop), more innovation, better talent attraction, stronger customer insight.' },
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
