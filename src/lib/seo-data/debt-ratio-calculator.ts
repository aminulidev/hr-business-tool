const seoData = {
  breadcrumbs: [{ label: 'Calculators' }, { label: 'Debt Ratio Calculator' }],
  tableOfContents: [
    { id: 'how-to-calculate', label: 'How to Calculate' },
    { id: 'formula', label: 'Formula' },
    { id: 'worked-examples', label: 'Worked Examples' },
    { id: 'frequently-asked-questions', label: 'FAQs' },
    { id: 'related-calculators', label: 'Related Calculators' },
  ],
  howToSteps: [
    'Enter total liabilities (all debts).',
    'Enter total assets.',
    'Click Calculate to see debt ratio and debt-to-equity ratio.',
  ],
  formula: 'Debt Ratio = Total Liabilities / Total Assets x 100\nDebt-to-Equity = Total Liabilities / Equity\nEquity = Total Assets - Total Liabilities',
  formulaDescription: 'Debt ratio = total liabilities / total assets × 100. Measures financial leverage. Healthy: 30-50%. Above 60% = high leverage. Debt-to-equity = liabilities / equity. Capital-intensive industries (utilities, manufacturing) have higher ratios.',
  workedExamples: [
    { title: 'Healthy Company', description: '$400k liabilities, $1M assets. Debt ratio = 40%. D/E = 0.67x. Conservative — healthy leverage.' },
    { title: 'Moderate Leverage', description: '$600k liabilities, $1M assets. Debt ratio = 60%. D/E = 1.5x. Moderate — watch for downturns.' },
    { title: 'High Leverage', description: '$800k liabilities, $1M assets. Debt ratio = 80%. D/E = 4.0x. High — distress risk in downturn.' },
    { title: 'Low Debt', description: '$100k liabilities, $500k assets. Debt ratio = 20%. D/E = 0.25x. Very conservative — may be under-leveraged.' },
    { title: 'All Equity', description: '$0 liabilities, $500k assets. Debt ratio = 0%. No financial leverage. Safe but may grow faster with debt.' },
  ],
  faqs: [
    { question: 'What is debt ratio?', answer: 'Debt ratio = total liabilities / total assets × 100. Measures what % of assets is financed by debt. Healthy: 30-50%. Above 60% = high leverage. Below 20% = conservative. Industry: utilities 60-70%, manufacturing 40-50%, tech 20-30%. See our Current Ratio and Interest Coverage Calculators.' },
    { question: 'What is a good debt ratio?', answer: 'Healthy: 30-50%. Below 30% = conservative (low risk, but may be under-leveraged). 50-60% = moderate. Above 60% = high leverage (distress risk in downturn). Industry varies: capital-intensive (utilities, manufacturing) higher; asset-light (tech, services) lower. Compare to industry average.' },
    { question: 'Debt ratio vs debt-to-equity?', answer: 'Debt ratio = liabilities / assets (% of assets financed by debt). Debt-to-equity = liabilities / equity (ratio of debt to equity). Both measure leverage. D/E more sensitive to leverage changes. Example: 50% debt ratio = 1.0x D/E. 67% debt ratio = 2.0x D/E. 80% debt ratio = 4.0x D/E.' },
    { question: 'How do you reduce debt ratio?', answer: 'Strategies: (1) Pay down debt (uses cash), (2) Increase assets (grow equity via retained earnings), (3) Convert debt to equity (debt-for-equity swap), (4) Sell assets to pay debt, (5) Lease instead of buy (off-balance-sheet). Best: grow profitability to increase equity while maintaining debt levels.' },
    { question: 'Is low debt ratio always good?', answer: 'Not always. Very low debt (under 20%) may indicate: (1) Conservative management (safe but slow growth), (2) Inability to borrow (credit issues), (3) High cost of equity vs debt. Debt is cheaper than equity (tax-deductible interest). Optimal: 30-50% debt ratio for most companies (balance risk vs growth).' },
    { question: 'What industries have high debt ratios?', answer: 'Capital-intensive industries: (1) Utilities 60-70% (regulated, stable cash flows), (2) Real estate 60-80% (mortgages), (3) Manufacturing 40-50% (equipment), (4) Telecom 50-60% (infrastructure), (5) Banks 85-90% (deposits = liabilities). Low debt: tech 20-30% (asset-light), services 20-30%. Compare within industry.' },
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
