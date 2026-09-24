const seoData = {
  breadcrumbs: [{ label: 'Calculators' }, { label: 'Interest Coverage Ratio Calculator' }],
  tableOfContents: [
    { id: 'how-to-calculate', label: 'How to Calculate' },
    { id: 'formula', label: 'Formula' },
    { id: 'worked-examples', label: 'Worked Examples' },
    { id: 'frequently-asked-questions', label: 'FAQs' },
    { id: 'related-calculators', label: 'Related Calculators' },
  ],
  howToSteps: [
    'Enter EBIT (operating income).',
    'Enter interest expense (annual).',
    'Click Calculate to see interest coverage ratio.',
  ],
  formula: 'Interest Coverage Ratio = EBIT / Interest Expense\nAlso called Times Interest Earned (TIE)\nHealthy: 3.0+. Below 1.5 = distress risk.',
  formulaDescription: 'Interest coverage ratio (ICR) = EBIT / interest expense. Measures ability to pay interest on debt. Healthy: 3.0+. Below 1.5 = distress risk. Below 1.0 = imminent default. Lenders typically require ICR > 2.0-3.0 in loan covenants.',
  workedExamples: [
    { title: 'Healthy', description: '$500k EBIT, $100k interest. ICR = 5.0x. Strong — easily covers interest.' },
    { title: 'Moderate', description: '$300k EBIT, $100k interest. ICR = 3.0x. Adequate — meets typical covenant.' },
    { title: 'At Risk', description: '$150k EBIT, $100k interest. ICR = 1.5x. Distress risk — barely covers interest.' },
    { title: 'Distressed', description: '$80k EBIT, $100k interest. ICR = 0.8x. Cannot cover interest — default risk.' },
    { title: 'Strong Company', description: '$1M EBIT, $50k interest. ICR = 20x. Very strong — minimal debt burden.' },
  ],
  faqs: [
    { question: 'What is interest coverage ratio?', answer: 'ICR = EBIT / interest expense. Also called Times Interest Earned (TIE). Measures ability to pay interest on debt from operating income. Healthy: 3.0+. Below 1.5 = distress risk. Below 1.0 = imminent default. Lenders require ICR > 2.0-3.0 in loan covenants. See our Debt Ratio Calculator.' },
    { question: 'What is a good interest coverage ratio?', answer: 'Healthy: 3.0+. 1.5-3.0 = moderate (watch for downturns). Below 1.5 = distress risk. Below 1.0 = cannot cover interest (default imminent). Lenders typically require minimum 2.0-3.0x in loan covenants. AAA-rated companies: 10x+. CCC-rated: below 1.0x.' },
    { question: 'What is EBIT?', answer: 'EBIT = Earnings Before Interest and Taxes = operating income = revenue - COGS - operating expenses. Measures profitability from operations before financing (interest) and tax decisions. Used for interest coverage (ability to pay interest from operations). Different from EBITDA (which also adds back D&A).' },
    { question: 'ICR vs DSCR?', answer: 'ICR = EBIT / interest (covers interest only). DSCR = (net operating income) / (principal + interest) (covers debt service including principal). DSCR is stricter — includes principal repayment. Lenders use DSCR for commercial loans (typically require 1.25x+). ICR is simpler, used for bond analysis.' },
    { question: 'How do you improve interest coverage?', answer: 'Strategies: (1) Increase EBIT (raise prices, cut costs, grow revenue), (2) Reduce interest expense (pay down debt, refinance at lower rate, convert debt to equity), (3) Restructure debt (extend term, interest-only period). Best: grow profitability while maintaining or reducing debt.' },
    { question: 'What happens if ICR is below 1.0?', answer: 'ICR < 1.0 = EBIT doesn\'t cover interest = company cannot pay interest from operations. Must: (1) Use cash reserves (depleting runway), (2) Sell assets, (3) Raise capital (dilutive), (4) Restructure debt (creditor negotiation), (5) File bankruptcy if no options. Distress signal — act immediately.' },
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
