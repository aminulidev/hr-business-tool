const seoData = {
  breadcrumbs: [{ label: 'Calculators' }, { label: 'Business Budget Calculator' }],
  tableOfContents: [
    { id: 'how-to-calculate', label: 'How to Calculate' },
    { id: 'formula', label: 'Formula' },
    { id: 'worked-examples', label: 'Worked Examples' },
    { id: 'frequently-asked-questions', label: 'FAQs' },
    { id: 'related-calculators', label: 'Related Calculators' },
  ],
  howToSteps: [
    'Enter projected annual revenue.',
    'Enter COGS (direct costs).',
    'Enter salaries and benefits.',
    'Enter marketing and sales spend.',
    'Enter rent and utilities.',
    'Enter other operating expenses.',
    'Click Calculate to see projected net income and break-even revenue.',
  ],
  formula: 'Gross Profit = Revenue - COGS\nNet Income = Gross Profit - All Opex\nNet Margin = Net Income / Revenue x 100\nBreak-even Revenue = (Opex / Gross Margin %) x Revenue',
  formulaDescription: 'Annual budget: revenue - COGS = gross profit; gross profit - operating expenses = net income. Break-even revenue = (opex / gross margin %) × revenue. Track budget vs actuals monthly, adjust quarterly.',
  workedExamples: [
    { title: 'Profitable Budget', description: '$1M revenue, $400k COGS, $300k salaries, $80k marketing, $60k rent, $40k other = $120k net income. 12% net margin. Healthy.' },
    { title: 'Breakeven', description: '$1M revenue, $500k COGS, $400k opex = $100k operating income. $20k interest + $80k taxes = $0 net income. Breakeven.' },
    { title: 'Growth Investment', description: '$2M revenue, $1M COGS, $700k salaries, $300k marketing = $0 operating income. Investing all in growth.' },
    { title: 'Conservative', description: '$1M revenue, $400k COGS, $200k opex = $400k operating income. 40% operating margin. Very lean.' },
    { title: 'Loss Budget', description: '$500k revenue, $300k COGS, $400k opex = -$200k net loss. Needs revenue growth or cost cutting.' },
  ],
  faqs: [
    { question: 'What is a business budget?', answer: 'Annual financial plan: revenue forecast, COGS, operating expenses (salaries, marketing, rent, other), projected net income. Break-even revenue = opex / gross margin %. Track budget vs actuals monthly, adjust quarterly. See our Cash Flow Forecast Calculator.' },
    { question: 'How do you create a business budget?', answer: 'Steps: (1) Forecast revenue (bottom-up by product/customer), (2) Estimate COGS (variable with revenue), (3) List fixed costs (salaries, rent, insurance), (4) Plan variable costs (marketing, commissions), (5) Project net income, (6) Set reserves (10-20% for surprises), (7) Review monthly, adjust quarterly.' },
    { question: 'What is break-even revenue?', answer: 'Break-even revenue = total fixed costs / gross margin %. Example: $400k opex, 60% gross margin = $400k / 0.60 = $667k revenue to break even. Below = loss. Above = profit. Track monthly — if actual revenue below break-even, reduce costs or accelerate sales. See our Break-Even Calculator.' },
    { question: 'How much should I budget for marketing?', answer: 'Common rules: (1) 5-10% of revenue (established B2B), (2) 10-20% of revenue (early-stage/growth), (3) 20-30% (SaaS scaling), (4) $1 for $1 with sales (CAC:LTV = 1:1 baseline). Adjust by: industry, growth stage, CAC efficiency. Track marketing ROI — cut what doesn\'t work. See our ROI Calculator.' },
    { question: 'How much should I budget for salaries?', answer: 'Salaries typically 40-60% of operating expenses, or 20-40% of revenue (service businesses higher, product businesses lower). Benchmark: tech 50-70% of opex, retail 20-30%, manufacturing 25-35%. Include benefits (30% load), payroll taxes (9%), workers comp. See our Labor Cost and Employee Cost Calculators.' },
    { question: 'How do you track budget vs actuals?', answer: 'Monthly variance analysis: (1) Compare actual to budget for each line item, (2) Calculate variance % and $, (3) Investigate >5% variances, (4) Identify trends (consistent over/under), (5) Adjust forecast. Tools: Excel/Google Sheets (small), QuickBooks (mid), NetSuite/Adaptive (enterprise). Quarterly deep dive with leadership team.' },
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
