const seoData = {
  breadcrumbs: [{ label: 'Calculators' }, { label: 'EBITDA Margin Calculator' }],
  tableOfContents: [
    { id: 'how-to-calculate', label: 'How to Calculate' },
    { id: 'formula', label: 'Formula' },
    { id: 'worked-examples', label: 'Worked Examples' },
    { id: 'frequently-asked-questions', label: 'FAQs' },
    { id: 'related-calculators', label: 'Related Calculators' },
  ],
  howToSteps: [
    'Enter EBITDA (earnings before interest, taxes, depreciation, amortization).',
    'Enter total revenue.',
    'Click Calculate to see EBITDA margin %.',
  ],
  formula: 'EBITDA Margin = EBITDA / Revenue x 100\nEBITDA = Operating Income + Depreciation + Amortization',
  formulaDescription: 'EBITDA margin = EBITDA / revenue × 100. EBITDA strips out interest, taxes, depreciation, amortization for operational comparison. SaaS 30-40%, manufacturing 15%, retail 10%, restaurants 15%. Higher = more operationally profitable.',
  workedExamples: [
    { title: 'SaaS Company', description: '$300k EBITDA on $1M revenue = 30% margin. Strong for SaaS (typical 30-40%). High margin, scalable.' },
    { title: 'Manufacturer', description: '$150k EBITDA on $1M revenue = 15% margin. Typical for manufacturing (10-20%).' },
    { title: 'Retailer', description: '$100k EBITDA on $1M revenue = 10% margin. Typical for retail (5-15%.' },
    { title: 'Restaurant', description: '$150k EBITDA on $1M revenue = 15% margin. Typical for restaurants (10-20%).' },
    { title: 'Startup', description: '-$200k EBITDA on $500k revenue = -40% margin. Negative — investing in growth.' },
  ],
  faqs: [
    { question: 'What is EBITDA margin?', answer: 'EBITDA margin = EBITDA / revenue × 100. EBITDA = earnings before interest, taxes, depreciation, amortization. Strips out financing and accounting decisions to compare operational profitability. SaaS 30-40%, manufacturing 15%, retail 10%, restaurants 15%. Higher = better operations.' },
    { question: 'Why use EBITDA instead of net income?', answer: 'EBITDA removes: (1) Interest (financing decision), (2) Taxes (jurisdiction), (3) Depreciation (capital structure), (4) Amortization (acquisition accounting). Allows comparison of operational profitability across companies with different financing, tax situations, and asset bases. Popular in private equity and M&A.' },
    { question: 'What is a good EBITDA margin?', answer: 'Industry varies: SaaS 30-40%, healthcare 15-20%, manufacturing 10-20%, retail 5-15%, restaurants 10-20%, telecom 25-35%. Above industry = strong operations. Below = may need cost cutting or pricing review. Track trend — declining EBITDA margin despite revenue growth indicates cost inflation.' },
    { question: 'EBITDA vs operating income?', answer: 'Operating income (EBIT) = revenue - COGS - operating expenses. EBITDA = EBIT + depreciation + amortization. EBITDA is higher (adds back D&A). EBITDA is used for operational comparison; EBIT for accounting profitability. Critics say EBITDA ignores real costs (capex to replace depreciating assets).' },
    { question: 'Is EBITDA the same as cash flow?', answer: 'No — EBITDA is a proxy for cash flow but not actual cash flow. Differences: (1) EBITDA excludes working capital changes, (2) EBITDA excludes capex (real cash outflow), (3) EBITDA excludes interest and taxes (real cash outflows). Free cash flow = OCF - capex is better for valuation. See our Operating Cash Flow Calculator.' },
    { question: 'What is adjusted EBITDA?', answer: 'Adjusted EBITDA = EBITDA + one-time items (restructuring, stock comp, acquisition costs, legal settlements). Companies adjust to show "normalized" profitability. CAUTION: aggressive adjustments can mislead. SEC requires reconciliation to GAAP. Investors should scrutinize adjustments — some companies add back recurring "one-time" items.' },
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
