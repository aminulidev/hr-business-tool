const seoData = {
  breadcrumbs: [{ label: 'Calculators' }, { label: 'Net Profit Margin Calculator' }],
  tableOfContents: [
    { id: 'how-to-calculate', label: 'How to Calculate' },
    { id: 'formula', label: 'Formula' },
    { id: 'worked-examples', label: 'Worked Examples' },
    { id: 'frequently-asked-questions', label: 'FAQs' },
    { id: 'related-calculators', label: 'Related Calculators' },
  ],
  howToSteps: [
    'Enter net income (after all expenses including taxes).',
    'Enter total revenue.',
    'Click Calculate to see net profit margin %.',
  ],
  formula: 'Net Profit Margin = Net Income / Revenue x 100\nNet Income = Revenue - COGS - Opex - Interest - Taxes',
  formulaDescription: 'Net profit margin = net income / revenue × 100. Measures bottom-line profitability — how much of each revenue dollar becomes profit. Industry: tech 20%, healthcare 8%, retail 3%, restaurants 5%, manufacturing 7%.',
  workedExamples: [
    { title: 'Tech Company', description: '$200k net income on $1M revenue = 20% net margin. Strong — typical for SaaS (15-25%).' },
    { title: 'Retail Store', description: '$30k net income on $1M revenue = 3% net margin. Typical for retail (2-5%). Low margin, high volume.' },
    { title: 'Restaurant', description: '$50k net income on $1M revenue = 5% net margin. Typical for restaurants (3-6%).' },
    { title: 'Manufacturer', description: '$70k net income on $1M revenue = 7% net margin. Typical for manufacturing (5-10%.' },
    { title: 'Loss-Making Startup', description: '-$100k net income on $500k revenue = -20% net margin. Negative — burning cash to grow.' },
  ],
  faqs: [
    { question: 'What is net profit margin?', answer: 'Net profit margin = net income / revenue × 100. Measures bottom-line profitability — how much of each revenue dollar becomes profit. Industry: tech 20%, healthcare 8%, retail 3%, restaurants 5%. Compare to industry average — high margin indicates pricing power or cost efficiency.' },
    { question: 'What is a good net margin?', answer: 'Depends on industry. Tech 15-25% (asset-light, scalable), healthcare 8-12%, manufacturing 5-10%, retail 2-5%, restaurants 3-6%, grocery 1-2%. Above industry = strong. Below = may indicate cost inflation or pricing pressure. Track trend over time.' },
    { question: 'Net margin vs gross margin?', answer: 'Gross margin = (revenue - COGS) / revenue × 100. Net margin = (revenue - ALL expenses) / revenue × 100. Gross margin measures production profitability. Net margin measures bottom-line after operating expenses, interest, taxes. Gap = operating expenses + interest + taxes as % of revenue.' },
    { question: 'How do you improve net margin?', answer: 'Strategies: (1) Raise prices (if demand allows), (2) Reduce COGS (cheaper suppliers, automation), (3) Cut operating expenses (reduce overhead), (4) Reduce interest (pay down debt), (5) Tax planning. Best: increase gross margin (pricing power) and control opex growth.' },
    { question: 'Why do some companies have negative net margin?', answer: 'Negative net margin = net loss. Common for: (1) Startups investing in growth, (2) Companies in turnaround, (3) Cyclical companies in downturn, (4) Disrupted companies (declining revenue, fixed costs). Track cash runway and path to profitability. See our Burn Rate and Runway Calculators.' },
    { question: 'Net margin vs operating margin?', answer: 'Operating margin = operating income (EBIT) / revenue × 100. Net margin = net income / revenue × 100. Operating margin excludes interest and taxes. Net margin includes them. Difference = interest + taxes as % of revenue. Operating margin measures core operations; net margin measures bottom line.' },
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
