const seoData = {
  breadcrumbs: [{ label: 'Calculators' }, { label: 'Return on Equity (ROE) Calculator' }],
  tableOfContents: [
    { id: 'how-to-calculate', label: 'How to Calculate' },
    { id: 'formula', label: 'Formula' },
    { id: 'worked-examples', label: 'Worked Examples' },
    { id: 'frequently-asked-questions', label: 'FAQs' },
    { id: 'related-calculators', label: 'Related Calculators' },
  ],
  howToSteps: [
    'Enter annual net income (after-tax profit).',
    'Enter shareholders\' equity (total assets minus total liabilities).',
    'Click Calculate to see ROE %, ratio, and benchmark comparison.',
  ],
  formula: 'ROE = Net Income / Shareholders\' Equity x 100\nDuPont: ROE = Net Margin x Asset Turnover x Equity Multiplier',
  formulaDescription: 'Return on Equity measures how efficiently a company uses shareholder capital to generate profit. S&P 500 average: 15-20%. Above 20% = excellent. DuPont 3-step decomposition: ROE = net margin × asset turnover × equity multiplier (financial leverage).',
  workedExamples: [
    { title: 'Strong ROE', description: '$500k net income on $2.5M equity = 20% ROE. Above S&P 500 average. Excellent — company efficiently uses shareholder capital.' },
    { title: 'Average Company', description: '$200k net income on $2M equity = 10% ROE. Below average — may indicate inefficiency or low leverage.' },
    { title: 'High Leverage', description: '$300k net income on $1.5M equity = 20% ROE. Could be from high profit OR high debt (leverage). DuPont analysis reveals which.' },
    { title: 'Bank Comparison', description: 'Banks typically have 8-12% ROE (regulated, lower leverage). Tech companies: 20-30%+ (asset-light, high margin).' },
    { title: 'Negative Equity', description: 'Company with accumulated losses has negative equity. ROE not meaningful — use ROA or ROIC instead.' },
  ],
  faqs: [
    { question: 'What is ROE?', answer: 'Return on Equity = net income / shareholders\' equity × 100. Measures profitability relative to shareholder investment. S&P 500 average: 15-20%. Above 20% = excellent. Below 10% = underperforming. Compare to industry peers — banks 8-12%, tech 20-30%, retail 15%.' },
    { question: 'What is DuPont analysis?', answer: 'DuPont decomposition breaks ROE into 3 components: ROE = (net margin) × (asset turnover) × (equity multiplier). Reveals whether high ROE comes from profitability, efficiency, or leverage. Example: 15% ROE = 5% margin × 1.5x turnover × 2.0x leverage.' },
    { question: 'What is a good ROE?', answer: 'S&P 500 average: 15-20%. Above 20% = excellent. Below 10% = underperforming. Industry varies: banks 8-12% (regulated), tech 20-30%+ (asset-light), retail 15-20%, manufacturing 10-15%. Compare to industry average and 5-year trend.' },
    { question: 'ROE vs ROA?', answer: 'ROE = net income / equity. ROA = net income / assets. ROE > ROA when company has debt (leverage amplifies returns to shareholders). ROA measures asset efficiency regardless of financing. Both matter — ROE for shareholders, ROA for operations. See our ROA Calculator.' },
    { question: 'Can ROE be too high?', answer: 'Yes — extremely high ROE (50%+) may indicate: (1) High leverage (risky), (2) Negative equity (accumulated losses or buybacks), (3) Asset-light business (software). Investigate source. Sustainable high ROE from competitive advantage is good; from leverage is risky.' },
    { question: 'How do you improve ROE?', answer: 'Strategies: (1) Increase net margin (raise prices, cut costs), (2) Improve asset turnover (sell more with same assets), (3) Increase leverage (more debt — but increases risk), (4) Buy back stock (reduces equity, boosts ROE — but uses cash). Best: improve operations (margin + turnover).' },
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
