const seoData = {
  breadcrumbs: [{ label: 'Calculators' }, { label: 'Economic Order Quantity (EOQ) Calculator' }],
  tableOfContents: [
    { id: 'how-to-calculate', label: 'How to Calculate' },
    { id: 'formula', label: 'Formula' },
    { id: 'worked-examples', label: 'Worked Examples' },
    { id: 'frequently-asked-questions', label: 'FAQs' },
    { id: 'related-calculators', label: 'Related Calculators' },
  ],
  howToSteps: [
    'Enter annual demand (units per year).',
    'Enter order cost per order (setup, shipping, processing).',
    'Enter holding cost per unit per year (storage, capital, insurance).',
    'Click Calculate to see optimal order quantity (EOQ).',
  ],
  formula: 'EOQ = √(2 x D x S / H)\nD = Annual Demand\nS = Order Cost per Order\nH = Holding Cost per Unit per Year\nOrders per Year = D / EOQ',
  formulaDescription: 'Economic Order Quantity (EOQ) = √(2DS/H). Finds order size that minimizes total inventory cost (ordering + holding). Larger order cost or demand = larger EOQ. Larger holding cost = smaller EOQ. See our Reorder Point and Safety Stock Calculators.',
  workedExamples: [
    { title: 'Standard Retailer', description: '12,000 units/year demand, $50/order, $3/unit/year holding. EOQ = √(2×12000×50/3) = √400,000 = 632 units. 19 orders/year.' },
    { title: 'Low Order Cost', description: '12,000 units, $10/order (automated), $3 holding. EOQ = √(2×12000×10/3) = √80,000 = 283 units. More frequent, smaller orders.' },
    { title: 'High Holding Cost', description: '12,000 units, $50/order, $12/unit/year holding (perishable). EOQ = √(2×12000×50/12) = √100,000 = 316 units. Smaller orders due to high holding cost.' },
    { title: 'High Demand', description: '100,000 units, $100/order, $5 holding. EOQ = √(2×100000×100/5) = √4,000,000 = 2,000 units. 50 orders/year.' },
    { title: 'Small Business', description: '1,200 units, $75/order, $4 holding. EOQ = √(2×1200×75/4) = √45,000 = 212 units. 6 orders/year.' },
  ],
  faqs: [
    { question: 'What is EOQ?', answer: 'Economic Order Quantity = √(2DS/H) where D = annual demand, S = order cost, H = holding cost per unit per year. Finds order size that minimizes total inventory cost (ordering + holding). Larger order cost or demand = larger EOQ. Larger holding cost = smaller EOQ. See our Reorder Point Calculator.' },
    { question: 'What are the assumptions of EOQ?', answer: 'EOQ assumes: (1) Constant demand (no seasonality), (2) Constant lead time, (3) No stockouts, (4) No quantity discounts, (5) Instant replenishment. Real-world adjustments: (1) Safety stock for demand variability, (2) Reorder point for lead time, (3) Quantity discount analysis (order larger if discount > holding cost).' },
    { question: 'What is order cost?', answer: 'Order cost (setup cost) = cost per order, regardless of size. Includes: (1) Purchase order processing, (2) Shipping/receiving, (3) Quality inspection, (4) Setup (manufacturing). Typical: $25-$200/order. Higher for international, complex products, regulated industries. Reduce by: automated ordering, EDI, vendor-managed inventory.' },
    { question: 'What is holding cost per unit?', answer: 'Holding cost = cost to store one unit for one year. Includes: (1) Capital cost (12-15% of unit value), (2) Storage (warehouse, utilities), (3) Service (insurance, tax), (4) Risk (obsolescence, shrinkage). Total: 20-30% of unit value annually. Example: $20 unit × 25% = $5/unit/year holding cost.' },
    { question: 'How do you use EOQ in practice?', answer: 'Steps: (1) Calculate EOQ, (2) Set reorder point = (avg daily demand × lead time) + safety stock, (3) Order EOQ when inventory drops to reorder point, (4) Adjust for quantity discounts (order larger if discount > extra holding cost), (5) Adjust for seasonality (higher EOQ in peak season). See our Reorder Point and Safety Stock Calculators.' },
    { question: 'What are limitations of EOQ?', answer: 'EOQ limitations: (1) Assumes constant demand (real demand varies), (2) Ignores quantity discounts, (3) Assumes instant replenishment (real lead time), (4) No stockouts allowed (real world has stockouts), (5) Single-product (real world has multiple SKUs with interactions). Use as starting point, adjust for real conditions. JIT may be better for high-variability demand.' },
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
