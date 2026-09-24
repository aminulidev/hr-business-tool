const seoData = {
  breadcrumbs: [{ label: 'Calculators' }, { label: 'Revenue Forecast Calculator' }],
  tableOfContents: [
    { id: 'how-to-calculate', label: 'How to Calculate' },
    { id: 'formula', label: 'Formula' },
    { id: 'worked-examples', label: 'Worked Examples' },
    { id: 'frequently-asked-questions', label: 'FAQs' },
    { id: 'related-calculators', label: 'Related Calculators' },
  ],
  howToSteps: [
    'Enter current MRR (monthly recurring revenue).',
    'Enter monthly growth rate (%).',
    'Enter forecast period (months).',
    'Click Calculate to see forecasted MRR, ARR, and scenarios.',
  ],
  formula: 'Forecast MRR = Current MRR x (1 + Monthly Growth) ^ Months\nForecast ARR = Forecast MRR x 12\nOptimistic = Growth + 2%\nConservative = Growth - 2%',
  formulaDescription: 'Revenue forecast = current MRR × (1 + monthly growth)^months. Compound growth is powerful: 5% monthly = 80% annual. Track forecast vs actuals monthly. Adjust growth rate based on pipeline, churn, expansion.',
  workedExamples: [
    { title: 'SaaS Startup', description: '$100k MRR, 5% monthly, 12 months. Forecast MRR = $179,585. ARR = $2,155,020. Compound: 80% annual growth.' },
    { title: 'Mature SaaS', description: '$500k MRR, 2% monthly, 12 months. Forecast MRR = $634,249. ARR = $7,610,988. Steady 27% annual.' },
    { title: 'Hypergrowth', description: '$50k MRR, 10% monthly, 12 months. Forecast MRR = $156,921. ARR = $1,883,050. 213% annual growth.' },
    { title: 'Conservative', description: '$200k MRR, 1% monthly, 12 months. Forecast MRR = $225,365. ARR = $2,704,380. Modest 13% annual.' },
    { title: 'Flat Growth', description: '$300k MRR, 0% monthly, 12 months. Forecast MRR = $300,000. ARR = $3,600,000. No growth — needs intervention.' },
  ],
  faqs: [
    { question: 'What is a revenue forecast?', answer: 'Revenue forecast = projected future revenue based on current run rate and growth rate. Formula: current MRR × (1 + monthly growth)^months. Track 3 scenarios: base (expected), optimistic (+2%), conservative (-2%). Compare to actuals monthly. Adjust based on pipeline, churn, expansion, market conditions.' },
    { question: 'How do you forecast SaaS revenue?', answer: 'SaaS: forecast MRR × (1 + monthly growth)^months. MRR = monthly recurring revenue. Growth = new MRR - churned MRR + expansion MRR. Example: $100k MRR, 5% monthly growth, 12 months = $179,585 MRR ($2.15M ARR). Track: new logos, expansion, churn, downgrades. See our Sales Forecast Calculator for pipeline-based forecast.' },
    { question: 'What is the T2D3 rule?', answer: 'T2D3 = Triple, Triple, Double, Double, Double. SaaS growth benchmark: triple ARR for 2 years, then double for 3 years. $1M → $3M → $9M → $18M → $36M → $72M (5 years). Achieved by: Salesforce, HubSpot, Slack, Zoom. Requires: product-market fit, efficient CAC, low churn, scalable sales. Benchmark for hypergrowth SaaS.' },
    { question: 'How accurate are revenue forecasts?', answer: 'Accuracy depends on: (1) Data quality (CRM hygiene), (2) Growth rate stability (volatile = harder), (3) Market predictability, (4) Forecast horizon (1 month more accurate than 12). Typical: ±10-15% for 3-month forecast, ±20-30% for 12-month. Improve with: pipeline-weighted forecast, scenario analysis, monthly variance review.' },
    { question: 'How do you handle seasonality in forecasts?', answer: 'Seasonality: (1) Identify seasonal pattern from historical data, (2) Apply seasonal index (e.g., Q4 1.3x, Q1 0.8x), (3) Forecast = base growth × seasonal index. Example: 5% monthly growth but December = 1.3x (year-end buying). December forecast = $100k × 1.05^11 × 1.3 = $222k vs $171k without seasonality.' },
    { question: 'What is the difference between forecast and target?', answer: 'Forecast = what you expect to achieve (based on data). Target = what you want to achieve (goal). Forecast should be realistic; target can be stretch. Example: forecast $2M ARR (data-driven), target $2.5M (stretch). Gap = $500k requires: more pipeline, higher close rate, or expansion revenue. See our Sales Target Calculator.' },
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
