const seoData = {
  breadcrumbs: [{ label: 'Calculators' }, { label: 'Net Profit Calculator' }],
  tableOfContents: [
    { id: 'how-to-calculate', label: 'How to Calculate' },
    { id: 'formula', label: 'Formula' },
    { id: 'worked-examples', label: 'Worked Examples' },
    { id: 'frequently-asked-questions', label: 'FAQs' },
    { id: 'related-calculators', label: 'Related Calculators' },
  ],
  howToSteps: [
    'Enter total revenue.',
    'Enter COGS (cost of goods sold).',
    'Enter operating expenses (salaries, marketing, rent, etc.).',
    'Enter interest expense.',
    'Enter income taxes.',
    'Click Calculate to see net profit and net margin %.',
  ],
  formula: 'Gross Profit = Revenue - COGS\nOperating Income = Gross Profit - Operating Expenses\nNet Profit = Operating Income - Interest - Taxes\nNet Margin = Net Profit / Revenue x 100',
  formulaDescription: 'Net profit (net income) = revenue - all expenses (COGS, operating, interest, taxes). Also called "the bottom line." Net margin = net profit / revenue × 100. Negative = net loss. Track trend over time.',
  workedExamples: [
    { title: 'Profitable Company', description: '$1M revenue - $400k COGS - $300k opex - $20k interest - $80k taxes = $200k net profit. 20% net margin.' },
    { title: 'Breakeven', description: '$1M revenue - $500k COGS - $400k opex - $30k interest - $70k taxes = $0 net profit. Breakeven.' },
    { title: 'Loss', description: '$500k revenue - $300k COGS - $300k opex - $20k interest - $0 taxes = -$120k net loss. Needs cost cutting or revenue growth.' },
    { title: 'High Tax', description: '$1M revenue - $400k COGS - $300k opex - $20k interest - $200k taxes = $80k net profit. 8% margin. High tax burden.' },
    { title: 'Low Margin Volume', description: '$5M revenue - $4M COGS - $800k opex - $50k interest - $50k taxes = $100k net profit. 2% margin. Low margin, high volume.' },
  ],
  faqs: [
    { question: 'What is net profit?', answer: 'Net profit = revenue - COGS - operating expenses - interest - taxes. Also called net income or "the bottom line." Net margin = net profit / revenue × 100. Negative = net loss. Track trend — declining net margin despite revenue growth indicates cost inflation or pricing pressure. See our Net Margin Calculator.' },
    { question: 'Net profit vs gross profit?', answer: 'Gross profit = revenue - COGS. Net profit = revenue - ALL expenses. Gross profit measures production profitability. Net profit measures bottom line. Difference = operating expenses + interest + taxes. Both matter — gross for production, net for overall profitability.' },
    { question: 'Net profit vs EBITDA?', answer: 'EBITDA = earnings before interest, taxes, depreciation, amortization. Net profit = EBITDA - interest - taxes - depreciation - amortization. EBITDA is higher. EBITDA is used for operational comparison; net profit for bottom-line. Critics say EBITDA ignores real costs (capex, interest, taxes are real cash outflows).' },
    { question: 'What is a good net profit margin?', answer: 'Industry varies: tech 15-25%, healthcare 8-12%, manufacturing 5-10%, retail 2-5%, restaurants 3-6%, grocery 1-2%. Above industry = strong. Below = may indicate cost inflation or pricing pressure. Track 5-year trend. Declining margin despite revenue growth = investigate.' },
    { question: 'How do you improve net profit?', answer: 'Strategies: (1) Increase revenue (raise prices, grow volume, new products), (2) Reduce COGS (cheaper suppliers, automation), (3) Cut operating expenses (reduce overhead), (4) Reduce interest (pay down debt), (5) Tax planning (deductions, credits). Best: increase gross margin and control opex growth.' },
    { question: 'Is net profit the same as cash flow?', answer: 'No — net profit is accounting profit (accrual basis). Cash flow is actual cash in/out. Differences: (1) Non-cash expenses (depreciation, amortization), (2) Working capital changes (AR, AP, inventory), (3) Capex (not in P&L but cash outflow). Profitable companies can go bankrupt from poor cash flow. See our Operating Cash Flow Calculator.' },
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
