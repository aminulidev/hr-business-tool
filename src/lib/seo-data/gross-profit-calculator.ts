const seoData = {
  breadcrumbs: [{ label: 'Calculators' }, { label: 'Gross Profit Calculator' }],
  tableOfContents: [
    { id: 'how-to-calculate', label: 'How to Calculate' },
    { id: 'formula', label: 'Formula' },
    { id: 'worked-examples', label: 'Worked Examples' },
    { id: 'frequently-asked-questions', label: 'FAQs' },
    { id: 'related-calculators', label: 'Related Calculators' },
  ],
  howToSteps: [
    'Enter total revenue.',
    'Enter cost of goods sold (COGS).',
    'Click Calculate to see gross profit, gross margin %, and markup %.',
  ],
  formula: 'Gross Profit = Revenue - COGS\nGross Margin % = Gross Profit / Revenue x 100\nMarkup % = Gross Profit / COGS x 100',
  formulaDescription: 'Gross profit = revenue - COGS. Measures profit after direct production costs. Gross margin = gross profit / revenue × 100. Markup = gross profit / COGS × 100. Industry: SaaS 80%, retail 30%, manufacturing 35%, grocery 25%.',
  workedExamples: [
    { title: 'SaaS Company', description: '$1M revenue - $200k COGS (hosting, support) = $800k gross profit. 80% margin. Strong — typical for SaaS.' },
    { title: 'Retailer', description: '$1M revenue - $700k COGS (inventory) = $300k gross profit. 30% margin. Typical for retail.' },
    { title: 'Manufacturer', description: '$1M revenue - $650k COGS (materials, labor) = $350k gross profit. 35% margin. Typical for manufacturing.' },
    { title: 'Grocery Store', description: '$1M revenue - $750k COGS = $250k gross profit. 25% margin. Typical for grocery (20-28%.' },
    { title: 'Consulting Firm', description: '$1M revenue - $400k COGS (contractor labor) = $600k gross profit. 60% margin. Typical for services.' },
  ],
  faqs: [
    { question: 'What is gross profit?', answer: 'Gross profit = revenue - cost of goods sold (COGS). Measures profit after direct production costs. Gross margin = gross profit / revenue × 100. Industry: SaaS 80%, retail 30%, manufacturing 35%, grocery 25%. Higher = better. See our Gross Margin and Markup Calculators.' },
    { question: 'What is included in COGS?', answer: 'COGS = direct costs of producing goods/services: (1) Materials, (2) Direct labor (production), (3) Manufacturing overhead, (4) Freight-in, (5) Direct costs of service delivery. EXCLUDES: sales, marketing, G&A, R&D (operating expenses). For SaaS: hosting, support, third-party APIs. For services: contractor labor.' },
    { question: 'Gross profit vs net profit?', answer: 'Gross profit = revenue - COGS. Net profit = revenue - ALL expenses (COGS + opex + interest + taxes). Gross profit measures production profitability. Net profit measures bottom line. Difference = operating expenses + interest + taxes. Both matter — gross for production efficiency, net for overall profitability.' },
    { question: 'What is a good gross margin?', answer: 'Industry varies: SaaS 70-85% (low marginal cost), services 50-70%, manufacturing 25-40%, retail 25-40%, grocery 20-28%, restaurants 60-70% (food cost only). Above industry = pricing power or cost efficiency. Below = may need price increase or cost reduction. Track trend over time.' },
    { question: 'Gross margin vs markup?', answer: 'Gross margin = gross profit / revenue × 100 (% of selling price). Markup = gross profit / COGS × 100 (% added to cost). 50% margin = 100% markup. 33% margin = 50% markup. 25% margin = 33% markup. Margin is more commonly used in finance; markup in retail. See our Markup and Retail Margin Calculators.' },
    { question: 'How do you improve gross profit?', answer: 'Strategies: (1) Raise prices (if demand allows), (2) Reduce COGS (cheaper suppliers, bulk buying, automation), (3) Improve product mix (more high-margin products), (4) Reduce waste/scrap, (5) Outsource production to lower-cost regions. Best: increase price without losing volume, or reduce COGS without quality loss.' },
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
