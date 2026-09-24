const seoData = {
  breadcrumbs: [{ label: 'Calculators' }, { label: 'Return on Assets (ROA) Calculator' }],
  tableOfContents: [
    { id: 'how-to-calculate', label: 'How to Calculate' },
    { id: 'formula', label: 'Formula' },
    { id: 'worked-examples', label: 'Worked Examples' },
    { id: 'frequently-asked-questions', label: 'FAQs' },
    { id: 'related-calculators', label: 'Related Calculators' },
  ],
  howToSteps: [
    'Enter annual net income.',
    'Enter total assets (from balance sheet).',
    'Click Calculate to see ROA % and industry benchmark.',
  ],
  formula: 'ROA = Net Income / Total Assets x 100\nROA = Net Margin x Asset Turnover (DuPont)',
  formulaDescription: 'Return on Assets measures how efficiently a company uses assets to generate profit. Industry: banks 1%, retail 5-10%, tech 10-15%. Higher = better. ROA = net margin × asset turnover (DuPont decomposition).',
  workedExamples: [
    { title: 'Tech Company', description: '$500k net income on $5M assets = 10% ROA. Strong for tech (typical 10-15%). Asset-light business.' },
    { title: 'Retail Store', description: '$200k net income on $4M assets = 5% ROA. Typical for retail (5-10%). High asset base (inventory, store buildout).' },
    { title: 'Bank', description: '$1M net income on $100M assets = 1% ROA. Normal for banks (regulated, asset-heavy).' },
    { title: 'Manufacturer', description: '$800k net income on $10M assets = 8% ROA. Good for manufacturing (typical 5-10%).' },
    { title: 'Comparison', description: 'Tech 10-15% ROA (asset-light), Retail 5-10%, Manufacturing 5-10%, Banks 1% (asset-heavy). Higher = more efficient asset use.' },
  ],
  faqs: [
    { question: 'What is ROA?', answer: 'Return on Assets = net income / total assets × 100. Measures how efficiently assets generate profit. Industry: banks 1% (asset-heavy), retail 5-10%, tech 10-15% (asset-light). Higher = better. DuPont: ROA = net margin × asset turnover.' },
    { question: 'What is a good ROA?', answer: 'Depends on industry. Tech 10-15% (asset-light), retail 5-10%, manufacturing 5-10%, healthcare 5-8%, banks 1% (asset-heavy). Compare to industry average. Above industry = efficient. Below = may have excess assets or low margins. Track 5-year trend.' },
    { question: 'ROA vs ROE?', answer: 'ROA = net income / assets. ROE = net income / equity. ROE > ROA when company has debt (leverage). ROA measures operational efficiency regardless of financing. ROE measures shareholder return. Both matter: ROA for operations, ROE for investors. See our ROE Calculator.' },
    { question: 'How do you improve ROA?', answer: 'Strategies: (1) Increase net income (raise prices, cut costs), (2) Reduce asset base (sell excess inventory, outsource, lease vs own), (3) Improve asset turnover (sell more with same assets). Best: increase revenue without adding assets, or reduce assets while maintaining revenue.' },
    { question: 'Why do banks have low ROA?', answer: 'Banks are highly regulated and asset-heavy (loans are assets). A 1% ROA is normal — they make it up on leverage (10-12x debt to equity), producing 10-12% ROE. Different business model. Don\'t compare bank ROA to tech ROA — compare within industry.' },
    { question: 'What is the difference between ROA and ROIC?', answer: 'ROA = net income / total assets (uses book values). ROIC = NOPAT / invested capital (uses market values, excludes excess cash). ROIC is better for valuation — measures return on capital actually deployed in operations. ROA is simpler, uses accounting values.' },
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
