const seoData = {
  breadcrumbs: [{ label: 'Calculators' }, { label: 'Retail Margin Calculator' }],
  tableOfContents: [
    { id: 'how-to-calculate', label: 'How to Calculate' },
    { id: 'formula', label: 'Formula' },
    { id: 'worked-examples', label: 'Worked Examples' },
    { id: 'frequently-asked-questions', label: 'FAQs' },
    { id: 'related-calculators', label: 'Related Calculators' },
  ],
  howToSteps: [
    'Enter cost (wholesale or manufacturing cost).',
    'Enter retail price (what consumer pays).',
    'Click Calculate to see retail margin %, markup %, and gross profit.',
  ],
  formula: 'Retail Margin = (Retail Price - Cost) / Retail Price x 100\nMarkup = (Retail Price - Cost) / Cost x 100\nMarkup Multiple = Retail Price / Cost\nKeystone = 2x markup = 50% margin',
  formulaDescription: 'Retail margin = (retail price - cost) / retail price × 100. Markup = (retail price - cost) / cost × 100. Keystone = 2x markup = 50% margin. Industry: apparel 50%, grocery 25%, electronics 30%, jewelry 50-60%.',
  workedExamples: [
    { title: 'Apparel', description: '$25 cost, $50 retail. Gross profit = $25. Margin = 50%. Markup = 100% (2x keystone). Typical for apparel.' },
    { title: 'Grocery', description: '$2 cost, $2.67 retail. Gross profit = $0.67. Margin = 25%. Markup = 33%. Typical for grocery (low margin, high volume).' },
    { title: 'Electronics', description: '$200 cost, $286 retail. Gross profit = $86. Margin = 30%. Markup = 43%. Typical for electronics.' },
    { title: 'Jewelry', description: '$100 cost, $250 retail. Gross profit = $150. Margin = 60%. Markup = 150% (2.5x). Typical for jewelry (high margin).' },
    { title: 'Furniture', description: '$400 cost, $615 retail. Gross profit = $215. Margin = 35%. Markup = 54%. Typical for furniture (35-40% margin).' },
  ],
  faqs: [
    { question: 'What is retail margin?', answer: 'Retail margin = (retail price - cost) / retail price × 100. Measures profit as % of selling price. Industry: apparel 50%, grocery 25%, electronics 30%, jewelry 50-60%, furniture 35-40%. Higher = better. See our Markup and Selling Price Calculators.' },
    { question: 'What is a good retail margin?', answer: 'Industry varies: jewelry 50-60%, apparel 50-55%, furniture 35-40%, electronics 25-35%, grocery 20-28%, convenience store 25-30%. Luxury brands have higher margins (brand premium). Discount retailers have lower (volume play). Compare to category average.' },
    { question: 'Retail margin vs markup?', answer: 'Margin = profit / retail price × 100. Markup = profit / cost × 100. 50% margin = 100% markup (keystone). 33% margin = 50% markup. 25% margin = 33% markup. Margin is more commonly used in retail reporting; markup in pricing decisions. Be clear which you mean — they\'re often confused.' },
    { question: 'What is keystone pricing?', answer: 'Keystone = 2x markup = 100% markup = 50% margin. Common retail rule: double the cost to set retail price. Example: $25 cost → $50 retail. Simple default. Adjust by: (1) Product category (jewelry higher, grocery lower), (2) Competition, (3) Brand positioning, (4) Inventory turnover (slow movers need higher margin).' },
    { question: 'How do you price retail products?', answer: 'Methods: (1) Keystone (2x cost) — simple default, (2) Manufacturer\'s MSRP — follow brand guidance, (3) Competitive pricing — match or undercut, (4) Value-based — what customers will pay, (5) Psychological pricing ($9.99 vs $10). Consider: margin target, competition, brand positioning, inventory turnover. Test and adjust.' },
    { question: 'How do you improve retail margin?', answer: 'Strategies: (1) Negotiate lower wholesale costs (volume, payment terms), (2) Raise retail prices (if demand allows), (3) Improve product mix (more high-margin items), (4) Private label (higher margin than national brands), (5) Reduce shrinkage (theft, damage), (6) Exclusive products (less price comparison).' },
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
