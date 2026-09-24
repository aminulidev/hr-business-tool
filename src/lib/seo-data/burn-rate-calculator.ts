const seoData = {
  breadcrumbs: [{ label: 'Calculators' }, { label: 'Burn Rate Calculator' }],
  tableOfContents: [
    { id: 'how-to-calculate', label: 'How to Calculate' },
    { id: 'formula', label: 'Formula' },
    { id: 'worked-examples', label: 'Worked Examples' },
    { id: 'frequently-asked-questions', label: 'FAQs' },
    { id: 'related-calculators', label: 'Related Calculators' },
  ],
  howToSteps: [
    'Enter monthly cash outflow (all expenses).',
    'Enter monthly cash inflow (revenue, if any).',
    'Click Calculate to see gross burn, net burn, and annual burn.',
  ],
  formula: 'Gross Burn = Monthly Cash Outflow\nNet Burn = Outflow - Inflow\nAnnual Burn = Net Burn x 12\nDaily Burn = Net Burn / 30',
  formulaDescription: 'Gross burn = total monthly cash outflow. Net burn = outflow - inflow (revenue). Track alongside runway (cash / net burn). Healthy startups: 12-18 months runway. Below 6 months = urgent fundraising.',
  workedExamples: [
    { title: 'Pre-Revenue Startup', description: '$100k outflow, $0 inflow. Gross burn = $100k. Net burn = $100k. Annual burn = $1.2M. Need 12+ months runway = $1.2M+ cash.' },
    { title: 'Early Revenue', description: '$100k outflow, $30k inflow. Gross burn = $100k. Net burn = $70k. Annual burn = $840k. Better — revenue offsetting burn.' },
    { title: 'Growth Stage', description: '$500k outflow, $400k inflow. Gross burn = $500k. Net burn = $100k. Annual burn = $1.2M. Approaching breakeven.' },
    { title: 'Breakeven', description: '$200k outflow, $200k inflow. Net burn = $0. Self-sustaining. No more fundraising needed.' },
    { title: 'Cash-Flow Positive', description: '$200k outflow, $250k inflow. Net burn = -$50k (positive cash flow). Generating cash, not burning.' },
  ],
  faqs: [
    { question: 'What is burn rate?', answer: 'Burn rate = monthly cash consumption. Gross burn = total monthly cash outflow. Net burn = outflow - inflow (revenue). Critical startup metric — track alongside cash balance and runway. Healthy: 12-18 months runway. Below 6 months = urgent fundraising. See our Runway Calculator.' },
    { question: 'Gross burn vs net burn?', answer: 'Gross burn = total monthly cash outflow (all expenses). Net burn = outflow - inflow (revenue). Net burn is more useful — measures actual cash consumption. Pre-revenue: gross = net. With revenue: net < gross. Investors focus on net burn — it shows path to profitability.' },
    { question: 'What is a good burn rate?', answer: 'Depends on stage and cash. Pre-seed: $20-50k/month. Seed: $50-150k/month. Series A: $150-500k/month. Series B+: $500k-$2M/month. Key metric: runway (cash / net burn). Healthy: 12-18 months. Below 6 = urgent. Below 3 = crisis. Reduce burn or raise more capital.' },
    { question: 'How do you reduce burn rate?', answer: 'Strategies: (1) Cut non-essential spend (marketing, travel, perks), (2) Delay hires (open roles, contractor conversions), (3) Negotiate vendor terms (extend payment, reduce scope), (4) Sublease office space, (5) Reduce R&D spend (focus on core), (6) Pause product lines. Preserve cash for critical path. Communicate transparently with team.' },
    { question: 'How is burn rate calculated?', answer: 'Burn = monthly cash outflow - monthly cash inflow. Use cash basis (not accrual). Include: payroll, rent, utilities, marketing, software, professional services, COGS. Exclude: non-cash expenses (depreciation, stock comp). Track monthly. Calculate trailing 3-month average for trend analysis.' },
    { question: 'What is the relationship between burn rate and runway?', answer: 'Runway = cash balance / net burn rate. Example: $2M cash / $100k monthly net burn = 20 months runway. Reduce burn to extend runway. Increase revenue to reduce net burn. Raise capital to increase cash. Target: 12-18 months runway. Start fundraising 6 months before running out. See our Runway Calculator.' },
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
