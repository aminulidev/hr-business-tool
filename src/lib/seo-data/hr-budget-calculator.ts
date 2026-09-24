const seoData = {
  breadcrumbs: [{ label: 'Calculators' }, { label: 'HR Budget Calculator' }],
  tableOfContents: [
    { id: 'how-to-calculate', label: 'How to Calculate' },
    { id: 'formula', label: 'Formula' },
    { id: 'worked-examples', label: 'Worked Examples' },
    { id: 'frequently-asked-questions', label: 'FAQs' },
    { id: 'related-calculators', label: 'Related Calculators' },
  ],
  howToSteps: [
    'Enter recruiting cost (job ads, agency fees, HR staff time).',
    'Enter training and development cost.',
    'Enter benefits administration cost.',
    'Enter HR staff salaries (HR department headcount cost).',
    'Enter HR technology cost (HRIS, payroll system, etc.).',
    'Enter total company revenue to calculate HR as % of revenue.',
  ],
  formula: 'Total HR Budget = Recruiting + Training + Benefits Admin + HR Staff + HR Tech\nHR % Revenue = Total HR Budget / Revenue x 100\nCost per Employee = Total HR Budget / Headcount',
  formulaDescription: 'HR budget as % of revenue: 1% (small companies), 1.5-2% (mid-size), 2-2.5% (large enterprises). Cost per employee: $500-$2,000 typical. SHRM breakdown: recruiting 15-20%, training 10-15%, benefits admin 5-10%, HR staff 50-60%, technology 5-10%.',
  workedExamples: [
    { title: 'Mid-Size Company', description: '$50k recruiting + $75k training + $30k benefits admin + $400k HR staff + $25k tech = $580k. Revenue $10M. HR = 5.8% of revenue. High — typical 1.5-2%.' },
    { title: 'Small Business', description: '$15k + $20k + $10k + $150k + $5k = $200k. Revenue $3M. HR = 6.7%. Cost/employee = $667 (300 employees). Typical for small.' },
    { title: 'Large Enterprise', description: '$500k + $750k + $300k + $4M + $250k = $5.8M. Revenue $300M. HR = 1.9%. Cost/employee = $1,160 (5,000 employees).' },
    { title: 'Tech Startup', description: '$100k + $50k + $20k + $250k + $30k = $450k. Revenue $5M. HR = 9%. High — typical for growth-stage startups.' },
    { title: 'Non-Profit', description: '$20k + $30k + $15k + $200k + $5k = $270k. Revenue $5M. HR = 5.4%. Higher than for-profit due to lower revenue base.' },
  ],
  faqs: [
    { question: 'What is a typical HR budget?', answer: 'HR budget as % of revenue: 1% (small), 1.5-2% (mid-size), 2-2.5% (large). Cost per employee: $500-$2,000/year. Breakdown: HR staff 50-60%, recruiting 15-20%, training 10-15%, benefits admin 5-10%, HR technology 5-10%. SHRM benchmarks vary by industry and company size.' },
    { question: 'How much should I spend on HR technology?', answer: 'Typically 5-10% of HR budget, or $50-$200 per employee per year. Includes HRIS (Workday, BambooHR), payroll (ADP, Gusto), ATS (Greenhouse, Lever), LMS (Cornerstone), engagement (Culture Amp). ROI: reduced admin time, better data, improved employee experience.' },
    { question: 'How much should training budget be?', answer: 'Training Magazine benchmark: $1,286 per learner per year. SHRM: 1-5% of payroll. Breakdown: leadership development 30%, technical training 30%, compliance 20%, soft skills 20%. High-growth companies invest more. See our Training Cost Calculator.' },
    { question: 'How much should recruiting budget be?', answer: 'SHRM benchmark: $4,700 per hire (cost per hire). Or 15-20% of HR budget. Includes job ads, agency fees (15-25% of first-year salary), ATS, HR staff time, referral bonuses, background checks. Higher for specialized roles. See our Cost per Hire Calculator.' },
    { question: 'What is HR cost per employee?', answer: 'Total HR budget / headcount. Typical: $500-$2,000/employee/year. Lower in small companies (lean HR), higher in large enterprises (more HR services). Tech companies often higher ($2,000+) due to recruiting costs. Track trend — rising cost should be justified by improved HR services.' },
    { question: 'How do you justify HR budget increases?', answer: 'Quantify HR ROI: (1) Retention savings (reduced turnover × cost per departure), (2) Productivity gains from training, (3) Cost reductions from HR tech automation, (4) Compliance risk avoidance (lawsuits, fines), (5) Engagement → productivity correlation. See our HR ROI Calculator.' },
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
