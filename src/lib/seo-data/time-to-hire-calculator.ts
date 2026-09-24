const seoData = {
  breadcrumbs: [{ label: 'Calculators' }, { label: 'Time to Hire Calculator' }],
  tableOfContents: [
    { id: 'how-to-calculate', label: 'How to Calculate' },
    { id: 'formula', label: 'Formula' },
    { id: 'worked-examples', label: 'Worked Examples' },
    { id: 'frequently-asked-questions', label: 'FAQs' },
    { id: 'related-calculators', label: 'Related Calculators' },
  ],
  howToSteps: [
    'Enter total days from job posting to offer acceptance (sum across all hires).',
    'Enter number of hires in the period.',
    'Click Calculate to see average time to hire in days and weeks.',
  ],
  formula: 'Average Time to Hire = Total Days / Number of Hires\nWeeks = Days / 7\nVacancy Cost = Avg Days x $200/day',
  formulaDescription: 'Time to hire = days from job posting to offer acceptance. SHRM benchmark: 36 days average. Industry: tech 35, healthcare 49, finance 42, manufacturing 28, retail 26. Longer time = higher vacancy cost (~$200/day per role).',
  workedExamples: [
    { title: 'Standard Process', description: '175 total days / 5 hires = 35 days average. Below SHRM 36-day benchmark. Efficient recruiting.' },
    { title: 'Slow Tech Hiring', description: '210 days / 4 hires = 52.5 days. Above tech benchmark (35). Bottleneck in technical interviews.' },
    { title: 'Fast Retail', description: '78 days / 3 hires = 26 days. Matches retail benchmark. Quick high-volume hiring.' },
    { title: 'Healthcare Slowdown', description: '245 days / 5 hires = 49 days. Matches healthcare benchmark (49). Credentialing adds time.' },
    { title: 'Improvement Tracking', description: 'Q1: 180 days / 4 = 45 days. Q2: 140 days / 4 = 35 days. 22% improvement after process changes.' },
  ],
  faqs: [
    { question: 'What is time to hire?', answer: 'Time to hire = days from job posting (or candidate application) to offer acceptance. Measures recruiting velocity. SHRM benchmark: 36 days. Shorter = more competitive. Longer = higher vacancy cost. Track by department, role level, and source to identify bottlenecks.' },
    { question: 'Time to hire vs time to fill?', answer: 'Time to hire ends at offer acceptance. Time to fill ends at candidate start date (includes notice period, typically 2-4 weeks). Time to fill is always ≥ time to hire. Both tracked by SHRM. Time to fill benchmark: 36-42 days.' },
    { question: 'What is a good time to hire?', answer: 'SHRM benchmark: 36 days average. Industry: tech 35, healthcare 49, finance 42, manufacturing 28, retail 26, executive 90+. Shorter is generally better (less vacancy cost, less candidate drop-off) but too short may indicate low selectivity.' },
    { question: 'How do you reduce time to hire?', answer: 'Strategies: (1) Build talent pipeline before roles open, (2) Streamline interview process (max 3-4 rounds), (3) Pre-schedule interviews, (4) Use structured interviews (faster decisions), (5) Limit stakeholder count, (6) Set 24-48h decision SLAs, (7) Use pre-employment testing early.' },
    { question: 'What is vacancy cost?', answer: 'Cost of an unfilled position = (annual revenue per employee / 250 work days) × days vacant + overtime for coverage + manager time on hiring. Typical: $200-$500/day for mid-level, $1,000+/day for senior. Reducing time to hire by 10 days saves $2,000-$10,000 per role.' },
    { question: 'How do you track time to hire by source?', answer: 'Tag each candidate by source (employee referral, LinkedIn, job board, agency, careers page). Calculate time to hire by source. Employee referrals typically fastest (24 days), agencies slowest (45+ days). Optimize sourcing mix based on speed, quality, and cost per hire.' },
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
