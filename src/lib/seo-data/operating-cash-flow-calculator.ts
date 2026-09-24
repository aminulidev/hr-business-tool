const seoData = {
  breadcrumbs: [{ label: 'Calculators' }, { label: 'Operating Cash Flow Calculator' }],
  tableOfContents: [
    { id: 'how-to-calculate', label: 'How to Calculate' },
    { id: 'formula', label: 'Formula' },
    { id: 'worked-examples', label: 'Worked Examples' },
    { id: 'frequently-asked-questions', label: 'FAQs' },
    { id: 'related-calculators', label: 'Related Calculators' },
  ],
  howToSteps: [
    'Enter net income.',
    'Enter depreciation and amortization (non-cash expense).',
    'Enter stock-based compensation (non-cash expense).',
    'Enter change in working capital (negative if WC increased).',
    'Enter capital expenditures (for free cash flow).',
    'Click Calculate to see operating cash flow and free cash flow.',
  ],
  formula: 'OCF (Indirect) = Net Income + Depreciation + Amortization + Stock Comp ± WC Changes\nFree Cash Flow = OCF - Capital Expenditures\nOCF Margin = OCF / Revenue',
  formulaDescription: 'Operating cash flow = net income + non-cash expenses ± working capital changes (indirect method). Free cash flow = OCF - capex. OCF measures cash from operations; FCF measures cash available to investors. FCF positive = self-sustaining. Critical for valuation (DCF).',
  workedExamples: [
    { title: 'Healthy OCF', description: '$200k NI + $50k D&A + $30k SBC - $20k WC = $260k OCF. $80k capex = $180k FCF. Strong — self-sustaining.' },
    { title: 'OCF Positive, FCF Negative', description: '$100k NI + $40k D&A - $10k WC = $130k OCF. $200k capex = -$70k FCF. Investing heavily.' },
    { title: 'OCF Negative', description: '-$50k NI + $20k D&A - $30k WC = -$60k OCF. Burning cash from operations. Needs funding.' },
    { title: 'High D&A', description: '$100k NI + $200k D&A + $0 WC = $300k OCF. Asset-heavy — large non-cash add-back.' },
    { title: 'Working Capital Drag', description: '$200k NI + $50k D&A - $150k WC (AR grew) = $100k OCF. Profitable but cash trapped in AR.' },
  ],
  faqs: [
    { question: 'What is operating cash flow?', answer: 'OCF = cash generated from business operations. Indirect method: net income + non-cash expenses (depreciation, amortization, stock comp) ± working capital changes. Different from net income (which is accrual). OCF shows actual cash. FCF = OCF - capex. See our Cash Flow Forecast Calculator.' },
    { question: 'What is the indirect method?', answer: 'Indirect method starts with net income and adjusts: (1) Add back non-cash expenses (depreciation, amortization, stock comp, deferred taxes), (2) Subtract non-cash gains, (3) Adjust for working capital changes (AR up = cash down, AP up = cash up). Most common method. Direct method (sum of cash receipts/payments) is simpler but rarely used.' },
    { question: 'What is free cash flow?', answer: 'FCF = OCF - capital expenditures. Cash available to: (1) Pay dividends, (2) Buy back stock, (3) Pay down debt, (4) Acquisitions, (5) Hold as cash. FCF positive = self-sustaining. FCF negative = needs external funding. Used in DCF valuation. Also called "free cash flow to firm" (FCFF) before interest payments.' },
    { question: 'OCF vs net income?', answer: 'Net income = accounting profit (accrual basis). OCF = actual cash from operations. Differences: (1) Non-cash expenses (D&A, stock comp) — in NI but not cash, (2) Working capital changes (AR, AP, inventory) — timing differences. OCF is harder to manipulate. "Cash is king" — profitable companies can go bankrupt from poor cash flow.' },
    { question: 'How do you improve operating cash flow?', answer: 'Strategies: (1) Increase net income (raise prices, cut costs), (2) Reduce working capital (collect AR faster, reduce inventory, extend AP), (3) Reduce capex (lease vs buy, extend asset life). Working capital is most actionable: DSO reduction, inventory optimization, AP extension. See our Cash Conversion Cycle Calculator.' },
    { question: 'What is OCF margin?', answer: 'OCF margin = OCF / revenue × 100. Measures cash generation efficiency. Healthy: 15-25% (mature companies). SaaS: 30-40% (high margin, low working capital). Manufacturing: 10-15%. Retail: 5-10%. Track trend — declining OCF margin despite revenue growth may indicate working capital issues or cost inflation.' },
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
