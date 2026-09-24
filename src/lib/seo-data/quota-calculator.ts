const seoData = {
  breadcrumbs: [{ label: 'Calculators' }, { label: 'Sales Quota Calculator' }],
  tableOfContents: [
    { id: 'how-to-calculate', label: 'How to Calculate' },
    { id: 'formula', label: 'Formula' },
    { id: 'worked-examples', label: 'Worked Examples' },
    { id: 'frequently-asked-questions', label: 'FAQs' },
    { id: 'related-calculators', label: 'Related Calculators' },
  ],
  howToSteps: [
    'Enter territory TAM (addressable market).',
    'Enter target market share (%).',
    'Enter number of reps.',
    'Enter growth multiplier (1.2 = 20% growth).',
    'Click Calculate to see quota per rep.',
  ],
  formula: 'Total Target = TAM x Market Share% x Growth Multiplier\nQuota per Rep = Total Target / Number of Reps\nMonthly Quota = Annual Quota / 12',
  formulaDescription: 'Quota = (territory TAM × target market share × growth multiplier) / number of reps. Consider: historical attainment, ramp-up time, seasonality, deal size, sales cycle. Typical SaaS rep quota: $500k-$1.5M ARR.',
  workedExamples: [
    { title: 'SaaS Rep', description: '$5M TAM, 2% share, 5 reps, 1.2 growth. Total = $120k... wait, $5M × 2% × 1.2 = $120k. Per rep = $24k. Low for SaaS.' },
    { title: 'Mid-Market', description: '$50M TAM, 3% share, 10 reps, 1.1 growth. Total = $1.65M. Per rep = $165k. Reasonable mid-market.' },
    { title: 'Enterprise', description: '$200M TAM, 1% share, 5 reps, 1.0 flat. Total = $2M. Per rep = $400k. Typical enterprise SaaS.' },
    { title: 'High Growth', description: '$10M TAM, 5% share, 4 reps, 1.5 growth. Total = $750k. Per rep = $187.5k. Aggressive growth.' },
    { title: 'Mature Market', description: '$100M TAM, 15% share, 20 reps, 1.0 flat. Total = $15M. Per rep = $750k. Large established team.' },
  ],
  faqs: [
    { question: 'What is a sales quota?', answer: 'Sales quota = revenue target assigned to each sales rep. Based on: territory potential (TAM), market share goal, historical attainment, growth targets, deal size, sales cycle. Typical SaaS: $500k-$1.5M ARR per rep. Set annually, track quarterly. See our Sales Target Calculator for activity-based targets.' },
    { question: 'How do you set sales quotas?', answer: 'Methods: (1) Top-down (revenue goal / reps), (2) Bottom-up (TAM × market share), (3) Historical (last year + growth), (4) Activity-based (calls × close rate × deal size). Best: combine methods. Consider: ramp-up (new reps lower quota), seasonality, territory balance, rep tenure.' },
    { question: 'What is a good SaaS sales quota?', answer: 'Typical SaaS: $500k-$1.5M ARR per rep. SMB: $300-500k. Mid-market: $750k-$1.5M. Enterprise: $1-3M. Quota = 4-6x OTE (on-target earnings). Example: $250k OTE, 5x = $1.25M quota. Attainment: 60-70% of reps at 100%+ (industry average).' },
    { question: 'How do you handle quota for new reps?', answer: 'New reps get ramp-up quota: 25% in month 1, 50% in month 2, 75% in month 3, 100% in month 4. Full quota by month 4-6 depending on sales cycle. Some companies: 50% quota year 1, 100% year 2. Reduces attrition from unattainable early quotas. See our Sales Target Calculator.' },
    { question: 'What is quota attainment?', answer: 'Attainment = actual revenue / quota × 100. 100% = at quota. 120% = exceeding. 80% = below. Industry: 60-70% of reps hit 100%+. Track by: rep, team, segment, tenure. Low attainment (<50%) = quota too high or performance issues. Very high (>90%) = quota too low (leaving money on table).' },
    { question: 'How often should quotas be reviewed?', answer: 'Annually for quota setting (aligned with fiscal year). Quarterly for adjustment (if market shifts). Monthly for tracking. Mid-year reset if: major market change, product launch, territory restructure. Avoid frequent changes — reps need stability. See our Pipeline Calculator for tracking.' },
  ],
  relatedTools: [
    { slug: 'commission-calculator', title: 'Sales Commission Calculator', description: 'Flat-rate commission', icon: 'DollarSign' },
    { slug: 'roi-calculator', title: 'ROI Calculator', description: 'Return on investment', icon: 'BarChart3' },
    { slug: 'break-even-calculator', title: 'Break-Even Calculator', description: 'Break-even analysis', icon: 'Target' },
    { slug: 'profit-margin-calculator', title: 'Profit Margin Calculator', description: 'Margin analysis', icon: 'Percent' },
    { slug: 'revenue-forecast-calculator', title: 'Revenue Forecast', description: 'Revenue projection', icon: 'TrendingUp' },
  ],
};
export default seoData;
