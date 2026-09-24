const seoData = {
  breadcrumbs: [{ label: 'Calculators' }, { label: 'Reorder Point Calculator' }],
  tableOfContents: [
    { id: 'how-to-calculate', label: 'How to Calculate' },
    { id: 'formula', label: 'Formula' },
    { id: 'worked-examples', label: 'Worked Examples' },
    { id: 'frequently-asked-questions', label: 'FAQs' },
    { id: 'related-calculators', label: 'Related Calculators' },
  ],
  howToSteps: [
    'Enter average daily demand (units).',
    'Enter lead time in days (supplier to inventory).',
    'Enter safety stock (buffer for variability).',
    'Click Calculate to see reorder point.',
  ],
  formula: 'Lead Time Demand = Avg Daily Demand x Lead Time\nReorder Point = Lead Time Demand + Safety Stock\nOrder EOQ when inventory drops to Reorder Point',
  formulaDescription: 'Reorder point = (avg daily demand × lead time) + safety stock. When inventory drops to ROP, place new order. Lead time demand = demand during supplier lead time. Combine with EOQ for order quantity. See our Safety Stock and EOQ Calculators.',
  workedExamples: [
    { title: 'Standard', description: '50 units/day, 10-day lead time, 100 safety stock. Lead time demand = 500. ROP = 600 units. Order when inventory hits 600.' },
    { title: 'Short Lead Time', description: '100/day, 3-day lead, 50 safety. LTD = 300. ROP = 350. Short lead time = lower ROP.' },
    { title: 'Long Lead Time', description: '20/day, 30-day lead, 80 safety. LTD = 600. ROP = 680. Long lead time = higher ROP.' },
    { title: 'Fast Mover', description: '500/day, 5-day lead, 200 safety. LTD = 2,500. ROP = 2,700. High demand = high ROP.' },
    { title: 'No Safety Stock', description: '30/day, 7-day lead, 0 safety. ROP = 210. Risky — no buffer for variability.' },
  ],
  faqs: [
    { question: 'What is reorder point?', answer: 'Reorder point = (avg daily demand × lead time) + safety stock. When inventory drops to ROP, place new order of EOQ. Lead time demand = demand during supplier lead time. Safety stock covers variability. See our EOQ and Safety Stock Calculators.' },
    { question: 'How do you calculate reorder point?', answer: 'ROP = (avg daily demand × lead time in days) + safety stock. Example: 50 units/day × 10 days + 100 safety = 600. When inventory hits 600, order EOQ. Track inventory in real-time (inventory management system). Set automatic reorder alerts at ROP.' },
    { question: 'What is lead time demand?', answer: 'Lead time demand = avg daily demand × lead time. Units that will be consumed during supplier lead time. Example: 50/day × 10-day lead = 500 units. You need 500 units to cover demand while waiting for replenishment. Plus safety stock for variability.' },
    { question: 'Reorder point vs safety stock?', answer: 'Safety stock = buffer for demand/lead time variability (above average). Reorder point = lead time demand + safety stock. ROP tells you WHEN to order. Safety stock tells you HOW MUCH buffer. Both needed: ROP for timing, safety stock for protection. See our Safety Stock Calculator.' },
    { question: 'How do you set lead time?', answer: 'Lead time = time from order placement to inventory availability. Includes: (1) Order processing (1-2 days), (2) Supplier production (varies), (3) Shipping (1-30 days), (4) Receiving/inspection (1-2 days). Track actual lead times. Use 90th percentile (not average) for safety. Reduce lead time: closer suppliers, air freight, vendor-managed inventory.' },
    { question: 'What happens if reorder point is too low?', answer: 'Too low ROP = stockouts before replenishment arrives. Costs: lost sales, expedited shipping, customer churn. Fix: (1) Verify lead time accuracy (use 90th percentile), (2) Increase safety stock, (3) Reduce lead time (better supplier, closer source). Track stockout frequency — should be <5% (95% service level). See our Safety Stock Calculator.' },
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
