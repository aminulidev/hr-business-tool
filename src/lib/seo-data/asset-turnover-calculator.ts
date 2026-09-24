const seoData = {
  breadcrumbs: [{ label: 'Calculators' }, { label: 'Asset Turnover Calculator' }],
  tableOfContents: [
    { id: 'how-to-calculate', label: 'How to Calculate' },
    { id: 'formula', label: 'Formula' },
    { id: 'worked-examples', label: 'Worked Examples' },
    { id: 'frequently-asked-questions', label: 'FAQs' },
    { id: 'related-calculators', label: 'Related Calculators' },
  ],
  howToSteps: [
    'Enter total revenue.',
    'Enter beginning total assets.',
    'Enter ending total assets.',
    'Click Calculate to see asset turnover ratio.',
  ],
  formula: 'Average Assets = (Beginning + Ending) / 2\nAsset Turnover = Revenue / Average Total Assets\nMeasures efficiency of asset use.\nRetail 2.5x, Tech 0.8x, Manufacturing 1.0x',
  formulaDescription: 'Asset turnover = revenue / average total assets. Measures how efficiently assets generate revenue. Higher = better. Industry: retail 2.5x (low assets, high volume), tech 0.8x (high asset base), manufacturing 1.0x. DuPont: ROA = net margin × asset turnover.',
  workedExamples: [
    { title: 'Retail', description: '$2M revenue, $800k avg assets. Turnover = 2.5x. Strong — retail has low asset base, high volume.' },
    { title: 'Tech Company', description: '$5M revenue, $6.25M avg assets. Turnover = 0.8x. Typical for tech (high cash, IP on balance sheet).' },
    { title: 'Manufacturer', description: '$3M revenue, $3M avg assets. Turnover = 1.0x. Typical for manufacturing (equipment-heavy).' },
    { title: 'Asset-Light Services', description: '$2M revenue, $500k assets. Turnover = 4.0x. Very efficient — consulting/services.' },
    { title: 'Asset-Heavy', description: '$1M revenue, $2M assets. Turnover = 0.5x. Low efficiency — capital-intensive, underutilized assets.' },
  ],
  faqs: [
    { question: 'What is asset turnover?', answer: 'Asset turnover = revenue / average total assets. Measures how efficiently a company uses assets to generate revenue. Higher = better. Industry: retail 2.5x (low assets, high volume), tech 0.8x (high asset base), manufacturing 1.0x. DuPont: ROA = net margin × asset turnover. See our ROA Calculator.' },
    { question: 'What is a good asset turnover?', answer: 'Industry varies: retail 2-4x (low assets, high volume), tech 0.5-1.5x (high cash, IP), manufacturing 0.8-1.5x (equipment), services 1.5-3x (asset-light), utilities 0.3-0.5x (capital-intensive). Higher = more efficient. Compare to industry. Track trend — declining turnover may indicate excess assets or slow revenue growth.' },
    { question: 'Asset turnover vs inventory turnover?', answer: 'Asset turnover = revenue / total assets (all assets). Inventory turnover = COGS / inventory (inventory only). Both measure efficiency. Asset turnover is broader (includes equipment, cash, AR, inventory). Inventory turnover is specific to inventory management. See our Inventory Turnover Calculator.' },
    { question: 'How do you improve asset turnover?', answer: 'Strategies: (1) Increase revenue without adding assets (sell more with same assets), (2) Reduce asset base (sell excess equipment, outsource, lease vs own), (3) Improve inventory turnover (less working capital), (4) Collect AR faster (less receivables), (5) Reduce idle cash (invest or return to shareholders). Best: grow revenue faster than assets.' },
    { question: 'Why do tech companies have low asset turnover?', answer: 'Tech companies have low asset turnover (0.5-1.5x) because: (1) High cash balances (for acquisitions, R&D), (2) Intangible assets (IP, goodwill from acquisitions) on balance sheet, (3) Asset-light business model (software, not manufacturing). But they have high margins — DuPont: ROA = margin × turnover. Low turnover × high margin = acceptable ROA.' },
    { question: 'What is the DuPont decomposition?', answer: 'DuPont breaks ROA into: ROA = net margin × asset turnover. ROE = ROA × equity multiplier (leverage). Reveals whether returns come from: (1) Profitability (margin), (2) Efficiency (turnover), (3) Leverage (debt). Example: 10% ROA = 5% margin × 2.0x turnover. Helps identify improvement areas.' },
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
