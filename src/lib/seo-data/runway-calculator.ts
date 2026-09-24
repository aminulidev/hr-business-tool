const seoData = {
  breadcrumbs: [{ label: 'Calculators' }, { label: 'Runway Calculator' }],
  tableOfContents: [
    { id: 'how-to-calculate', label: 'How to Calculate' },
    { id: 'formula', label: 'Formula' },
    { id: 'worked-examples', label: 'Worked Examples' },
    { id: 'frequently-asked-questions', label: 'FAQs' },
    { id: 'related-calculators', label: 'Related Calculators' },
  ],
  howToSteps: [
    'Enter current cash balance.',
    'Enter monthly net burn (outflow - inflow).',
    'Click Calculate to see runway in months and years.',
  ],
  formula: 'Runway = Cash Balance / Monthly Net Burn\nRunway (years) = Runway (months) / 12\nFundraise By = Runway - 6 months\nHealthy: 12-18 months. Critical: <6 months.',
  formulaDescription: 'Runway = cash balance / monthly net burn. Measures months until cash runs out. Healthy: 12-18 months. Below 6 months = critical. Start fundraising 6 months before running out (fundraising takes 3-6 months).',
  workedExamples: [
    { title: 'Healthy Startup', description: '$2M cash, $70k/month net burn. Runway = 28.6 months. Healthy — time to focus on growth.' },
    { title: 'Urgent', description: '$500k cash, $100k/month burn. Runway = 5 months. Critical — need to reduce burn AND raise capital now.' },
    { title: 'Pre-Revenue', description: '$1M seed, $50k/month burn. Runway = 20 months. Good — focus on product-market fit.' },
    { title: 'Growth Stage', description: '$10M Series A, $400k/month burn. Runway = 25 months. Need to reach profitability or Series B.' },
    { title: 'Approaching Breakeven', description: '$1M cash, $30k/month burn (revenue growing). Runway = 33 months. Comfortable — path to profitability.' },
  ],
  faqs: [
    { question: 'What is runway?', answer: 'Runway = cash balance / monthly net burn. Measures months until cash runs out. Healthy: 12-18 months. Below 6 = critical. Start fundraising 6 months before running out (fundraising takes 3-6 months). See our Burn Rate Calculator.' },
    { question: 'What is a good runway?', answer: 'Healthy: 12-18 months. Critical: below 6 months. Excellent: 24+ months. Depends on stage: pre-seed 12-18 months, seed 18-24, Series A 24-30. Need enough time to hit milestones for next raise. Below 6 months = crisis — must reduce burn or raise emergency capital.' },
    { question: 'How do you extend runway?', answer: 'Strategies: (1) Reduce burn (cut non-essential spend, delay hires), (2) Increase revenue (faster growth), (3) Raise capital (extend runway), (4) Negotiate vendor terms (defer payments), (5) Convert contractors to part-time, (6) Sublease office. Target: 18+ months runway for comfort.' },
    { question: 'When should I start fundraising?', answer: 'Start 6 months before running out of cash. Fundraising takes 3-6 months (deck, pitch, due diligence, legal). Below 6 months runway = desperate (unfavorable terms). Below 3 months = crisis (may not close in time). Ideal: start at 12 months runway, target close at 6+ months remaining.' },
    { question: 'How is runway calculated?', answer: 'Runway = cash balance / monthly net burn. Net burn = monthly outflow - monthly inflow. Use trailing 3-month average burn for stability. Example: $2M cash / $100k burn = 20 months. Update monthly. Scenario plan: what if revenue delays? What if a key customer churns?' },
    { question: 'Runway vs cash flow?', answer: 'Runway = how long cash lasts at current burn (static measure). Cash flow = actual cash in/out (dynamic). Positive cash flow = infinite runway (self-sustaining). Negative cash flow = finite runway. Track both — runway for planning, cash flow for operations. See our Cash Flow Forecast Calculator.' },
  ],
  relatedTools: [
    { slug: 'roi-calculator', title: 'ROI Calculator', description: 'Return on investment', icon: 'BarChart3' },
    { slug: 'profit-margin-calculator', title: 'Profit Margin Calculator', description: 'Margin analysis', icon: 'Percent' },
    { slug: 'break-even-calculator', title: 'Break-Even Calculator', description: 'Break-even units and revenue', icon: 'Target' },
    { slug: 'gross-margin-calculator', title: 'Gross Margin Calculator', description: 'Gross profit margin', icon: 'PieChart' },
    { slug: 'cash-flow-forecast-calculator', title: 'Cash Flow Forecast', description: '12-month cash projection', icon: 'TrendingUp' },
  ],
};
export default seoData;
