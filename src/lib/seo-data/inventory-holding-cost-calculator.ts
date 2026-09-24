const seoData = {
  breadcrumbs: [{ label: 'Calculators' }, { label: 'Inventory Holding Cost Calculator' }],
  tableOfContents: [
    { id: 'how-to-calculate', label: 'How to Calculate' },
    { id: 'formula', label: 'Formula' },
    { id: 'worked-examples', label: 'Worked Examples' },
    { id: 'frequently-asked-questions', label: 'FAQs' },
    { id: 'related-calculators', label: 'Related Calculators' },
  ],
  howToSteps: [
    'Enter average inventory value.',
    'Enter capital cost % (cost of capital/opportunity).',
    'Enter storage cost % (warehouse, utilities).',
    'Enter service cost % (insurance, tax, IT).',
    'Enter risk cost % (obsolescence, shrinkage).',
    'Click Calculate to see total holding cost and %.',
  ],
  formula: 'Holding Cost % = Capital% + Storage% + Service% + Risk%\nHolding Cost $ = Inventory Value x (Holding Cost% / 100)\nTypical: 20-30% of inventory value annually',
  formulaDescription: 'Holding cost = (capital + storage + service + risk) costs. Typical: 20-30% of inventory value annually. Components: capital 12-15%, storage 3-5%, service 2-3%, risk 3-8%. Reduce by: lower inventory levels, better forecasting, JIT.',
  workedExamples: [
    { title: 'Typical Retailer', description: '$200k inventory, 12% capital + 5% storage + 3% service + 5% risk = 25% total. Holding cost = $50k/year ($4.2k/month).' },
    { title: 'High-Value Electronics', description: '$500k inventory, 10% capital + 3% storage + 2% service + 8% risk (obsolescence) = 23%. $115k/year. High obsolescence risk.' },
    { title: 'Grocery (Fast Turnover)', description: '$50k inventory, 8% capital + 4% storage + 2% service + 6% risk (spoilage) = 20%. $10k/year. Low holding cost due to fast turnover.' },
    { title: 'Slow-Moving Jewelry', description: '$300k inventory, 12% capital + 2% storage + 3% service + 3% risk = 20%. $60k/year. But low turnover means high relative cost.' },
    { title: 'Excess Inventory', description: '$500k inventory (should be $200k), 25% holding cost = $125k/year. Reduce inventory by $300k saves $75k/year.' },
  ],
  faqs: [
    { question: 'What is inventory holding cost?', answer: 'Holding cost (carrying cost) = cost of storing inventory over time. Components: (1) Capital cost 12-15% (cost of capital/opportunity), (2) Storage 3-5% (warehouse, utilities), (3) Service 2-3% (insurance, tax, IT), (4) Risk 3-8% (obsolescence, shrinkage, damage). Total: 20-30% of inventory value annually.' },
    { question: 'What is a good holding cost?', answer: 'Typical: 20-30% of inventory value annually. Below 20% = excellent (low capital cost, efficient warehouse). Above 35% = high (excess inventory, expensive warehouse, high obsolescence). Track trend — rising holding cost may indicate excess inventory or inefficient operations. See our Inventory Turnover Calculator.' },
    { question: 'How do you reduce holding cost?', answer: 'Strategies: (1) Reduce inventory levels (JIT, better forecasting), (2) Negotiate lower capital cost (better financing), (3) Optimize warehouse (cheaper space, better layout), (4) Reduce obsolescence (FIFO, discount old stock), (5) Reduce shrinkage (security, cycle counting), (6) Drop-shipping (no inventory). See our EOQ Calculator.' },
    { question: 'What is capital cost in holding cost?', answer: 'Capital cost = cost of capital tied up in inventory. Includes: (1) Interest on inventory financing, (2) Opportunity cost (what else could capital earn). Typically 12-15% of inventory value. Example: $200k inventory × 12% = $24k/year. Reduce by: lower inventory levels, better payment terms with suppliers, just-in-time inventory.' },
    { question: 'What is inventory obsolescence?', answer: 'Obsolescence = inventory that can\'t be sold (outdated, expired, superseded). Risk cost typically 3-8% of inventory value. Higher for: (1) Tech products (rapid innovation), (2) Fashion (seasonal), (3) Perishables (expiration), (4) Regulated products (compliance changes). Reduce by: FIFO, demand forecasting, product lifecycle management, discounting slow movers.' },
    { question: 'Holding cost vs ordering cost?', answer: 'Holding cost = cost of storing inventory (20-30%/year). Ordering cost = cost of placing orders ($50-$200/order). Trade-off: more orders = higher ordering cost but lower inventory (lower holding cost). EOQ formula finds optimal balance: √(2DS/H) where D = demand, S = order cost, H = holding cost. See our EOQ Calculator.' },
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
