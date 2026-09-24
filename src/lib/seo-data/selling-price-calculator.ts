const seoData = {
  breadcrumbs: [{ label: 'Calculators' }, { label: 'Selling Price Calculator' }],
  tableOfContents: [
    { id: 'how-to-calculate', label: 'How to Calculate' },
    { id: 'formula', label: 'Formula' },
    { id: 'worked-examples', label: 'Worked Examples' },
    { id: 'frequently-asked-questions', label: 'FAQs' },
    { id: 'related-calculators', label: 'Related Calculators' },
  ],
  howToSteps: [
    'Enter unit cost (production or purchase cost).',
    'Enter desired margin % (profit as % of selling price) OR markup % (profit as % of cost).',
    'Click Calculate to see selling price, realized margin, and profit per unit.',
  ],
  formula: 'Margin-based: Selling Price = Cost / (1 - Margin%)\nMarkup-based: Selling Price = Cost x (1 + Markup%)\n40% margin = 66.7% markup\n50% markup = 33.3% margin',
  formulaDescription: 'Selling price = cost / (1 - margin%) for margin-based pricing, OR cost × (1 + markup%) for markup-based. Margin = profit as % of selling price. Markup = profit as % of cost. 40% margin = 66.7% markup. 50% markup = 33.3% margin.',
  workedExamples: [
    { title: 'Margin-Based', description: '$20 cost, 40% margin. Selling price = $20 / (1 - 0.40) = $33.33. Profit = $13.33/unit. Margin = 40%. Markup = 66.7%.' },
    { title: 'Markup-Based', description: '$20 cost, 50% markup. Selling price = $20 × 1.50 = $30. Profit = $10/unit. Margin = 33.3%. Markup = 50%.' },
    { title: 'Keystone Pricing', description: '$25 cost, 100% markup (keystone = 2x). Selling price = $50. Margin = 50%. Common in retail.' },
    { title: 'High Margin SaaS', description: '$10 cost (hosting), 90% margin. Selling price = $10 / (1 - 0.90) = $100. Profit = $90/unit. Typical for SaaS.' },
    { title: 'Low Margin Volume', description: '$8 cost, 20% margin. Selling price = $8 / (1 - 0.20) = $10. Profit = $2/unit. Low margin, high volume.' },
  ],
  faqs: [
    { question: 'How do you calculate selling price?', answer: 'Two methods: (1) Margin-based: selling price = cost / (1 - margin%). (2) Markup-based: selling price = cost × (1 + markup%). Margin = profit as % of selling price. Markup = profit as % of cost. 40% margin = 66.7% markup. 50% markup = 33.3% margin.' },
    { question: 'Margin vs markup?', answer: 'Margin = profit / selling price × 100 (% of price). Markup = profit / cost × 100 (% added to cost). 50% margin = 100% markup. 33% margin = 50% markup. 25% margin = 33% markup. Margin is more commonly used in finance; markup in retail. Easy to confuse — be clear which you mean.' },
    { question: 'What is keystone pricing?', answer: 'Keystone = 2x markup = 100% markup = 50% margin. Common in retail: double the cost to set price. Example: $25 cost → $50 retail. Simple but may not account for: (1) Different product margins, (2) Slow-moving inventory, (3) Competitive pricing. Use as starting point, adjust by product.' },
    { question: 'How do you price a product?', answer: 'Methods: (1) Cost-plus (cost + markup), (2) Value-based (what customers will pay), (3) Competitive (match or undercut competitors), (4) Penetration (low price to gain share), (5) Skimming (high price, lower over time). Best: value-based — captures maximum willingness to pay. Cost-plus is simplest but may leave money on table.' },
    { question: 'What is the difference between wholesale and retail price?', answer: 'Wholesale = price to retailers/distributors (typically 40-60% margin for wholesaler). Retail = price to end consumer (typically 50% margin for retailer, 2x wholesale = keystone). MSRP = manufacturer\'s suggested retail price. Example: $10 mfg cost → $20 wholesale (50% margin) → $40 retail (2x markup). See our Wholesale Price Calculator.' },
    { question: 'How do you handle discounts?', answer: 'Discounting reduces margin. Example: $50 price (40% margin = $20 profit). 10% discount → $45 price, margin = $15 (33%). Need 33% more volume to maintain profit. Use discounts strategically: (1) Volume discounts (encourage bulk), (2) Seasonal (clear inventory), (3) Promo (new customer acquisition). Avoid chronic discounting — erodes brand. See our Discount Calculator.' },
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
