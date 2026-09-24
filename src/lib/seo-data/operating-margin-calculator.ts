const seoData = {
  breadcrumbs: [{ label: 'Calculators' }, { label: 'Operating Margin Calculator' }],
  tableOfContents: [
    { id: 'how-to-calculate', label: 'How to Calculate' },
    { id: 'formula', label: 'Formula' },
    { id: 'worked-examples', label: 'Worked Examples' },
    { id: 'frequently-asked-questions', label: 'FAQs' },
    { id: 'related-calculators', label: 'Related Calculators' },
  ],
  howToSteps: [
    'Enter operating income (EBIT = revenue - COGS - operating expenses).',
    'Enter total revenue.',
    'Click Calculate to see operating margin %.',
  ],
  formula: 'Operating Margin = Operating Income / Revenue x 100\nOperating Income (EBIT) = Revenue - COGS - Operating Expenses',
  formulaDescription: 'Operating margin = operating income (EBIT) / revenue × 100. Measures operational profitability before interest and taxes. Industry: tech 25%, healthcare 12%, manufacturing 10%, retail 5%, restaurants 9%.',
  workedExamples: [
    { title: 'Tech Company', description: '$250k operating income on $1M revenue = 25% operating margin. Strong for tech (typical 20-30%).' },
    { title: 'Manufacturer', description: '$100k operating income on $1M revenue = 10% operating margin. Typical for manufacturing (8-12%).' },
    { title: 'Retailer', description: '$50k operating income on $1M revenue = 5% operating margin. Typical for retail (3-7%.' },
    { title: 'Restaurant', description: '$90k operating income on $1M revenue = 9% operating margin. Typical for restaurants (5-10%.' },
    { title: 'Healthcare', description: '$120k operating income on $1M revenue = 12% operating margin. Typical for healthcare (10-15%.' },
  ],
  faqs: [
    { question: 'What is operating margin?', answer: 'Operating margin = operating income (EBIT) / revenue × 100. Measures profitability from core operations before interest and taxes. Industry: tech 25%, healthcare 12%, manufacturing 10%, retail 5%, restaurants 9%. Higher = better operational efficiency.' },
    { question: 'Operating margin vs net margin?', answer: 'Operating margin = EBIT / revenue. Net margin = net income / revenue. Operating margin excludes interest and taxes. Net margin includes them. Difference = interest + taxes as % of revenue. Operating margin measures core operations; net margin measures bottom line.' },
    { question: 'What is a good operating margin?', answer: 'Industry varies: tech 20-30%, healthcare 10-15%, manufacturing 8-12%, retail 3-7%, restaurants 5-10%, telecom 15-25%. Above industry = strong operations. Below = cost inflation or pricing pressure. Track trend — declining operating margin may indicate competitive pressure.' },
    { question: 'Operating margin vs gross margin?', answer: 'Gross margin = (revenue - COGS) / revenue × 100. Operating margin = (revenue - COGS - operating expenses) / revenue × 100. Operating margin is lower (includes opex). Difference = operating expenses (salaries, marketing, rent, admin) as % of revenue. Both matter — gross for production, operating for overall efficiency.' },
    { question: 'How do you improve operating margin?', answer: 'Strategies: (1) Increase gross margin (raise prices, reduce COGS), (2) Reduce operating expenses (cut overhead, automate), (3) Increase revenue without adding opex (scale), (4) Improve product mix (more high-margin products), (5) Reduce fixed costs (outsource, remote work). Best: scale revenue faster than opex.' },
    { question: 'What is EBIT?', answer: 'EBIT = Earnings Before Interest and Taxes = operating income = revenue - COGS - operating expenses. Measures profitability from operations before financing (interest) and tax decisions. Used for operating margin. Different from EBITDA (which also adds back depreciation and amortization).' },
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
