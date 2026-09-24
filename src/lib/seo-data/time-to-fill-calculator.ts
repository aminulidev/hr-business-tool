const seoData = {
  breadcrumbs: [{ label: 'Calculators' }, { label: 'Time to Fill Calculator' }],
  tableOfContents: [
    { id: 'how-to-calculate', label: 'How to Calculate' },
    { id: 'formula', label: 'Formula' },
    { id: 'worked-examples', label: 'Worked Examples' },
    { id: 'frequently-asked-questions', label: 'FAQs' },
    { id: 'related-calculators', label: 'Related Calculators' },
  ],
  howToSteps: [
    'Enter total days from requisition approval to candidate start (sum across positions).',
    'Enter number of positions filled in the period.',
    'Click Calculate to see average time to fill in days and weeks.',
  ],
  formula: 'Average Time to Fill = Total Days / Number of Positions\nWeeks = Days / 7\nVacancy Cost = Avg Days x $250/day',
  formulaDescription: 'Time to fill = days from requisition approval to candidate start date. Longer than time to hire (which ends at offer acceptance). SHRM benchmark: 36-42 days. Track by department and role level to identify slow-moving positions.',
  workedExamples: [
    { title: 'Standard Hiring', description: '210 days / 5 positions = 42 days. Within SHRM 36-42 day benchmark. Efficient process.' },
    { title: 'Slow Executive Search', description: '180 days / 1 position = 180 days. Typical for executive search (90-180 days).' },
    { title: 'High-Volume Retail', description: '130 days / 5 positions = 26 days. Fast for retail (typical 28). Strong pipeline.' },
    { title: 'Healthcare Credentialing', description: '245 days / 5 positions = 49 days. Healthcare benchmark 49. Credentialing adds 2-3 weeks.' },
    { title: 'Engineering Bottleneck', description: '300 days / 5 positions = 60 days. Above tech 42-day benchmark. Interview process too long.' },
  ],
  faqs: [
    { question: 'What is time to fill?', answer: 'Time to fill = days from job requisition approval to candidate start date. Includes recruiting (job posting, sourcing, interviewing) + notice period (2-4 weeks typical). SHRM benchmark: 36-42 days. Longer than time to hire (ends at offer acceptance).' },
    { question: 'Time to fill vs time to hire?', answer: 'Time to fill starts at requisition approval, ends at candidate start. Time to hire starts at job posting (or candidate application), ends at offer acceptance. Time to fill is always longer (includes notice period). Both metrics tracked by SHRM.' },
    { question: 'What is a good time to fill?', answer: 'SHRM benchmark: 36-42 days average. By role: entry-level 28, professional 42, management 56, executive 90-150. By industry: tech 42, healthcare 49, finance 42, manufacturing 28, retail 26. Shorter = lower vacancy cost.' },
    { question: 'How do you reduce time to fill?', answer: 'Strategies: (1) Build talent pipeline before requisitions open, (2) Pre-approve job descriptions and salary bands, (3) Limit interview rounds to 3-4, (4) Use panel interviews to reduce scheduling rounds, (5) Set 48h decision SLAs after final interview, (6) Use pre-employment testing early, (7) Negotiate shorter notice periods.' },
    { question: 'What is the cost of a vacant position?', answer: 'Vacancy cost = (annual revenue per employee / 250 work days) × days vacant + overtime for remaining staff + manager time on hiring + lost productivity. Typical: $250-$500/day for mid-level. 60-day vacancy on $100k role = $15,000-$30,000 cost. See our Replacement Cost Calculator.' },
    { question: 'How do you forecast time to fill?', answer: 'Track historical time to fill by: role level (entry vs executive), department, source (referral vs agency), urgency (critical vs planned). Use rolling 12-month average as forecast. Adjust for market conditions (tight labor market = longer). Build into workforce planning budget.' },
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
