const seoData = {
  breadcrumbs: [{ label: 'Calculators' }, { label: 'Employee Retention Calculator' }],
  tableOfContents: [
    { id: 'how-to-calculate', label: 'How to Calculate' },
    { id: 'formula', label: 'Formula' },
    { id: 'worked-examples', label: 'Worked Examples' },
    { id: 'frequently-asked-questions', label: 'FAQs' },
    { id: 'related-calculators', label: 'Related Calculators' },
  ],
  howToSteps: [
    'Enter headcount at the start of the period (e.g., Jan 1 headcount).',
    'Enter headcount at the end of the period (e.g., Dec 31 headcount).',
    'Enter number of new hires during the period (new hires do not count as retained).',
    'Click Calculate Retention Rate to see the % of original employees who stayed.',
    'Compare to industry benchmark (US average: 80-90% annual retention).',
  ],
  formula: 'Retained = End Headcount - Hires During Period\nRetention Rate = Retained / Start Headcount x 100',
  formulaDescription: 'Retention rate measures the percentage of employees who stayed through the period. New hires during the period don\'t count as retained. The US average is 80-90% depending on industry: tech 80%, healthcare 82%, manufacturing 88%, government 92%. Inverse of attrition rate.',
  workedExamples: [
    { title: 'Standard Year', description: '100 employees at start, 92 at end, 5 hired during year. Retained = 92 - 5 = 87. Retention rate = 87/100 = 87%. Above US average of 85%.' },
    { title: 'High Growth Startup', description: '50 at start, 80 at end, 35 hired. Retained = 80 - 35 = 45. Retention = 45/50 = 90%. Despite doubling headcount, retention is excellent.' },
    { title: 'Problem Department', description: '20 at start, 15 at end, 2 hired. Retained = 15 - 2 = 13. Retention = 13/20 = 65%. Below 70% threshold — investigate root causes.' },
    { title: 'Quarterly Tracking', description: 'Q1: 100 start, 98 end, 1 hire. Retained = 97, retention = 97%. Q2: 98 start, 95 end, 2 hires. Retained = 93, retention = 95%. Trending down.' },
    { title: 'Industry Comparison', description: 'Tech company: 80% retention (16% attrition). Healthcare: 82% (18% attrition). Manufacturing: 88% (12% attrition). Government: 92% (8% attrition).' },
  ],
  faqs: [
    { question: 'What is employee retention rate?', answer: 'Retention rate = (employees who stayed through the period) / (headcount at start) × 100. New hires during the period don\'t count as retained. Example: 100 start, 5 hired, 92 end = 87 retained = 87% retention. Inverse of attrition rate.' },
    { question: 'What is a good retention rate?', answer: 'US average: 80-90% annually. Industry benchmarks: tech 80%, healthcare 82%, retail 75%, manufacturing 88%, government 92%, finance 85%. Below 75% suggests engagement/comp issues; above 90% may indicate stagnant culture. Track by department to find problem areas.' },
    { question: 'Retention rate vs attrition rate?', answer: 'They are inverses. Retention = % who stayed. Attrition = % who left. 85% retention = 15% attrition. Some calculations differ: attrition uses average headcount in the denominator, retention uses starting headcount. For attrition, see our Attrition Calculator.' },
    { question: 'How do you calculate retention with new hires?', answer: 'Retained = End Headcount - Hires During Period. Then Retention Rate = Retained / Start Headcount × 100. New hires shouldn\'t inflate the "retained" count because they weren\'t there at the start. Example: 100 start, 5 hired, 92 end = 87 retained (not 92).' },
    { question: 'What is the 90-day retention rate?', answer: '90-day retention = % of new hires still employed after 90 days. Calculate: (new hires still employed at day 90 / total new hires) × 100. Healthy: 90%+. Below 80% suggests onboarding or hiring mismatch issues. Often tracked separately from annual retention.' },
    { question: 'How can I improve employee retention?', answer: 'Top drivers: (1) Competitive compensation (benchmark to market P50-P75), (2) Career growth (internal mobility >10%/yr), (3) Manager quality (Gallup: 70% of engagement variance), (4) Work flexibility (remote/hybrid), (5) Recognition programs, (6) Work-life balance. Cost of replacing an employee: 50-200% of salary.' },
  ],
  relatedTools: [
    { slug: 'attrition-calculator', title: 'Attrition Calculator', description: 'Inverse metric: % who left', icon: 'TrendingDown' },
    { slug: 'employee-turnover-calculator', title: 'Employee Turnover Calculator', description: 'Turnover rate and cost', icon: 'Users' },
    { slug: 'cost-of-turnover-calculator', title: 'Cost of Turnover Calculator', description: 'Financial impact of attrition', icon: 'DollarSign' },
    { slug: 'employee-engagement-score-calculator', title: 'Engagement Score', description: 'Engagement drives retention', icon: 'Activity' },
    { slug: 'internal-mobility-calculator', title: 'Internal Mobility', description: 'Mobility = 2x retention', icon: 'ArrowLeftRight' },
  ],
};
export default seoData;
