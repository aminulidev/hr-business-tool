const seoData = {
  breadcrumbs: [{ label: 'Calculators' }, { label: 'Contribution Margin Calculator' }],
  tableOfContents: [
    { id: 'how-to-calculate', label: 'How to Calculate' },
    { id: 'formula', label: 'Formula' },
    { id: 'worked-examples', label: 'Worked Examples' },
    { id: 'frequently-asked-questions', label: 'FAQs' },
    { id: 'related-calculators', label: 'Related Calculators' },
  ],
  howToSteps: [
    'Enter selling price per unit.',
    'Enter variable cost per unit.',
    'Enter units sold (for total contribution).',
    'Click Calculate to see CM per unit, CM ratio, and total contribution.',
  ],
  formula: 'CM per Unit = Price - Variable Cost\nCM Ratio = CM per Unit / Price x 100\nTotal CM = CM per Unit x Units Sold',
  formulaDescription: 'Contribution margin = price - variable cost. Each unit contributes CM toward fixed costs and profit. CM ratio = CM / price × 100. Break-even units = fixed costs / CM per unit. High CM ratio = strong operating leverage.',
  workedExamples: [
    { title: 'SaaS Product', description: '$100/month price, $20/month variable cost (hosting, support). CM = $80/unit. CM ratio = 80%. Strong — most revenue contributes to profit.' },
    { title: 'Physical Product', description: '$50 price, $30 variable cost (materials, shipping). CM = $20/unit. CM ratio = 40%. Moderate.' },
    { title: 'Consulting', description: '$200/hour price, $50/hour variable cost (contractor). CM = $150/hour. CM ratio = 75%. Strong.' },
    { title: 'Restaurant', description: '$20 meal, $12 variable cost (food, packaging). CM = $8/meal. CM ratio = 40%. Typical for restaurants.' },
    { title: 'Low Margin Retail', description: '$10 price, $9 variable cost. CM = $1/unit. CM ratio = 10%. Very low — need high volume.' },
  ],
  faqs: [
    { question: 'What is contribution margin?', answer: 'Contribution margin = price - variable cost per unit. Measures profit per unit after variable costs. Each unit contributes CM toward fixed costs and profit. CM ratio = CM / price × 100. Break-even units = fixed costs / CM per unit. High CM ratio = strong operating leverage.' },
    { question: 'What is a good contribution margin?', answer: 'Depends on industry. SaaS 70-85% (low variable costs), services 50-75%, manufacturing 30-50%, retail 30-50%, restaurants 30-40%, grocery 15-25%. Higher = better. High CM ratio means most revenue contributes to covering fixed costs and profit.' },
    { question: 'Contribution margin vs gross margin?', answer: 'Gross margin = (revenue - COGS) / revenue × 100. COGS includes only production costs. Contribution margin = price - variable cost, which includes ALL variable costs (production + variable selling + variable admin). CM is broader than gross margin. Both matter — gross margin for production efficiency, CM for pricing decisions.' },
    { question: 'How do you use contribution margin for pricing?', answer: 'CM helps with: (1) Break-even analysis (FC / CM per unit), (2) Target profit ((FC + target) / CM per unit), (3) Product mix decisions (prioritize high-CM products), (4) Special order pricing (accept if CM > 0 and excess capacity), (5) Make-or-buy decisions. See our Break-Even and Contribution Calculators.' },
    { question: 'What is operating leverage?', answer: 'Operating leverage = fixed costs / total costs. High fixed costs (low variable) = high operating leverage = high CM ratio. Revenue growth → profit growth amplification. Example: 80% CM ratio, 10% revenue growth → 40%+ profit growth. But revenue decline → profit decline amplification. Risky in downturns.' },
    { question: 'How do you improve contribution margin?', answer: 'Strategies: (1) Raise prices (if demand allows), (2) Reduce variable costs (cheaper suppliers, automation, bulk buying), (3) Change product mix (more high-CM products), (4) Bundle products (increase average CM), (5) Reduce variable selling costs (self-service vs sales reps).' },
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
