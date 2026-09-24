const seoData = {
  breadcrumbs: [{ label: 'Calculators' }, { label: 'Wholesale Price Calculator' }],
  tableOfContents: [
    { id: 'how-to-calculate', label: 'How to Calculate' },
    { id: 'formula', label: 'Formula' },
    { id: 'worked-examples', label: 'Worked Examples' },
    { id: 'frequently-asked-questions', label: 'FAQs' },
    { id: 'related-calculators', label: 'Related Calculators' },
  ],
  howToSteps: [
    'Enter manufacturing cost (your production cost).',
    'Enter your desired wholesale margin %.',
    'Enter retailer markup (typically 2x = keystone).',
    'Click Calculate to see wholesale price, MSRP, and profit at each level.',
  ],
  formula: 'Wholesale Price = Cost / (1 - Wholesale Margin%)\nMSRP = Wholesale Price x Retailer Markup\nWholesale Profit = Wholesale Price - Cost\nRetailer Profit = MSRP - Wholesale Price',
  formulaDescription: 'Wholesale price = manufacturing cost / (1 - wholesale margin%). Typical wholesale margin: 40-60%. Retailer markup: 2x (keystone) to 3x. MSRP = wholesale × retailer markup. Example: $10 cost → $20 wholesale (50% margin) → $40 MSRP (2x).',
  workedExamples: [
    { title: 'Standard Wholesale', description: '$10 mfg cost, 50% wholesale margin, 2x retailer markup. Wholesale = $20. MSRP = $40. Your profit = $10. Retailer profit = $20.' },
    { title: 'High-End Product', description: '$30 mfg cost, 60% wholesale margin, 2.5x retailer. Wholesale = $75. MSRP = $187.50. Your profit = $45. Retailer profit = $112.50.' },
    { title: 'Volume Wholesale', description: '$5 mfg cost, 40% wholesale margin, 2x retailer. Wholesale = $8.33. MSRP = $16.67. Your profit = $3.33. Low margin, high volume.' },
    { title: 'Direct-to-Consumer', description: '$15 mfg cost, skip wholesale, sell direct at $60 (75% margin). No retailer markup. Higher margin but need marketing/distribution.' },
    { title: 'Distributor Tier', description: '$10 mfg cost, 30% margin to distributor, distributor sells to retailer at 40% margin, retailer 2x. Mfg→Distributor $14.29, Distributor→Retailer $23.81, Retail $47.62.' },
  ],
  faqs: [
    { question: 'What is wholesale price?', answer: 'Wholesale price = price charged to retailers, distributors, or other businesses (not end consumers). Typically 40-60% margin for wholesaler. Retailer then marks up 2x (keystone) to 3x for MSRP. Example: $10 cost → $20 wholesale → $40 MSRP. See our Selling Price and Retail Margin Calculators.' },
    { question: 'How do you calculate wholesale price?', answer: 'Wholesale price = manufacturing cost / (1 - wholesale margin%). Example: $10 cost, 50% margin = $10 / (1 - 0.50) = $20. Or simpler: cost × (1 + markup%). $10 × 2 = $20 (100% markup = 50% margin). Adjust margin by product: 30-40% for commodities, 50-60% for branded goods.' },
    { question: 'What is keystone pricing?', answer: 'Keystone = 2x markup = 100% markup = 50% margin. Common retail rule: double the wholesale price to get MSRP. Example: $20 wholesale → $40 retail. Simple but may not account for: (1) Different product categories, (2) Slow-moving inventory, (3) Competitive pricing. Use as default, adjust by product.' },
    { question: 'Wholesale vs retail price?', answer: 'Wholesale = price to businesses (retailers, distributors) who resell. Retail = price to end consumers. Retail is typically 2-3x wholesale (retailer needs margin to cover store, staff, marketing). MSRP = manufacturer\'s suggested retail price. Some brands enforce MSRP (MAP = minimum advertised price) to prevent price wars.' },
    { question: 'What is a distributor?', answer: 'Distributor = intermediary between manufacturer and retailer. Buys in bulk from manufacturer, sells to retailers. Adds 15-25% margin. Useful for: (1) Reaching many retailers, (2) Logistics/warehousing, (3) International markets. Manufacturer→Distributor→Retailer→Consumer. Each tier adds margin. See our Selling Price Calculator.' },
    { question: 'Should I sell wholesale or direct-to-consumer?', answer: 'Pros of wholesale: (1) Higher volume, (2) Retailer handles marketing/distribution, (3) Faster scale. Pros of DTC: (1) Higher margin (no retailer cut), (2) Customer data, (3) Brand control. Many brands do both: wholesale for volume, DTC for margin and brand. DTC requires marketing investment (CAC). See our Unit Economics Calculator.' },
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
