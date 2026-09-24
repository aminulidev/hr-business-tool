const seoData = {
  breadcrumbs: [{ label: 'Calculators' }, { label: 'Revenue Growth Calculator' }],
  tableOfContents: [
    { id: 'how-to-calculate', label: 'How to Calculate' },
    { id: 'formula', label: 'Formula' },
    { id: 'worked-examples', label: 'Worked Examples' },
    { id: 'frequently-asked-questions', label: 'FAQs' },
    { id: 'related-calculators', label: 'Related Calculators' },
  ],
  howToSteps: [
    'Enter current period revenue.',
    'Enter previous period revenue.',
    'Enter period length (12=YoY, 3=QoQ, 1=MoM).',
    'Click Calculate to see growth rate and annualized rate.',
  ],
  formula: 'Growth Rate = (Current - Previous) / Previous x 100\nAnnualized = (Current/Previous)^(12/Months) - 1\nAbsolute Growth = Current - Previous\nSaaS benchmarks: < $1M 100%+, $10M 60%, $100M 40%',
  formulaDescription: 'Revenue growth = (current - previous) / previous × 100. Annualized = (current/previous)^(12/months) - 1. SaaS benchmarks: < $1M ARR 100%+, $1-10M 60-90%, $10-100M 40-60%, $100M+ 20-40% (T2D3 rule).',
  workedExamples: [
    { title: 'YoY Growth', description: '$1.2M current, $1M previous, 12 months. Growth = 20%. Annualized = 20%. Steady growth.' },
    { title: 'QoQ Growth', description: '$350k current, $300k previous, 3 months. Growth = 16.7%. Annualized = 84.9%. Strong quarterly growth.' },
    { title: 'MoM Growth', description: '$110k current, $100k previous, 1 month. Growth = 10%. Annualized = 213.8%. Hypergrowth.' },
    { title: 'Decline', description: '$800k current, $1M previous, 12 months. Growth = -20%. Revenue declining — needs intervention.' },
    { title: 'Hypergrowth', description: '$5M current, $2M previous, 12 months. Growth = 150%. Above T2D3 benchmark for early stage.' },
  ],
  faqs: [
    { question: 'What is revenue growth rate?', answer: 'Revenue growth = (current - previous) / previous × 100. Measures period-over-period growth. Annualized = (current/previous)^(12/months) - 1 (compound annual rate). Track: YoY (year-over-year), QoQ (quarter-over-quarter), MoM (month-over-month). SaaS benchmarks: < $1M ARR 100%+, $1-10M 60-90%, $10-100M 40-60%, $100M+ 20-40%.' },
    { question: 'What is the T2D3 rule?', answer: 'T2D3 = Triple, Triple, Double, Double, Double. SaaS growth benchmark: triple ARR for 2 years, then double for 3 years. $1M → $3M → $9M → $18M → $36M → $72M (5 years). Achieved by: Salesforce, HubSpot, Slack, Zoom. Requires: product-market fit, efficient CAC, low churn, scalable sales. Benchmark for hypergrowth SaaS. Not all companies should target T2D3 — depends on market, capital, strategy.' },
    { question: 'What is a good revenue growth rate?', answer: 'Depends on stage and industry. SaaS: < $1M ARR 100%+, $1-10M 60-90%, $10-100M 40-60%, $100M+ 20-40%. E-commerce: 20-50% (mature 10-20%). Services: 15-30%. Non-SaaS tech: 20-40%. Above industry = strong. Below = may need strategic pivot. Track CAGR (compound annual growth rate) over 3-5 years for trend.' },
    { question: 'How do you calculate annualized growth?', answer: 'Annualized = (current/previous)^(12/months) - 1. Example: 16.7% QoQ growth (3 months). Annualized = (1.167)^(12/3) - 1 = (1.167)^4 - 1 = 84.9%. Compounds quarterly growth to annual. Useful for comparing different period lengths. Caution: annualizing short periods (1 month) can overstate (10% MoM = 214% annualized, but may not sustain).' },
    { question: 'What is CAGR?', answer: 'CAGR (Compound Annual Growth Rate) = (ending value / beginning value)^(1/years) - 1. Smooths year-to-year volatility. Example: $1M → $3M over 3 years. CAGR = (3/1)^(1/3) - 1 = 44.2%. Even if yearly growth was 50%, 30%, 55%, CAGR = 44.2%. Used for: long-term trend, benchmarking, valuation. Different from average annual growth (which doesn\'t compound).' },
    { question: 'How do you improve revenue growth?', answer: 'Strategies: (1) Increase new customer acquisition (more leads, better conversion), (2) Increase ARPU (upsell, cross-sell, price increase), (3) Reduce churn (retain existing revenue), (4) Expand to new markets (geographic, segment), (5) Launch new products, (6) Strategic acquisitions, (7) Channel partnerships. Best: balanced growth across new + expansion + retention. See our Revenue Forecast Calculator.' },
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
