const seoData = {
  breadcrumbs: [{ label: 'Calculators' }, { label: 'Safety Stock Calculator' }],
  tableOfContents: [
    { id: 'how-to-calculate', label: 'How to Calculate' },
    { id: 'formula', label: 'Formula' },
    { id: 'worked-examples', label: 'Worked Examples' },
    { id: 'frequently-asked-questions', label: 'FAQs' },
    { id: 'related-calculators', label: 'Related Calculators' },
  ],
  howToSteps: [
    'Enter average daily demand (units).',
    'Enter demand standard deviation (variability).',
    'Enter average lead time (days).',
    'Enter desired service level (90, 95, or 99%).',
    'Click Calculate to see safety stock and reorder point.',
  ],
  formula: 'Safety Stock = Z x σ x √Lead Time\nZ = 1.28 (90%), 1.65 (95%), 2.33 (99%)\nσ = Demand Standard Deviation\nReorder Point = (Avg Daily Demand x Lead Time) + Safety Stock',
  formulaDescription: 'Safety stock = Z × σ × √lead time. Buffer inventory to prevent stockouts. Service level: 90% = 1.28, 95% = 1.65, 99% = 2.33. Higher service level or demand variability = more safety stock. See our Reorder Point and EOQ Calculators.',
  workedExamples: [
    { title: 'Standard 95%', description: '100 units/day avg, 20 std dev, 7-day lead time, 95% service. Safety = 1.65 × 20 × √7 = 87 units. Reorder = 700 + 87 = 787.' },
    { title: 'High Service Level', description: '100/day, 20 std dev, 7-day lead, 99% service. Safety = 2.33 × 20 × √7 = 123 units. More buffer for higher service.' },
    { title: 'Low Variability', description: '100/day, 5 std dev, 7-day lead, 95% service. Safety = 1.65 × 5 × √7 = 22 units. Less buffer — demand is predictable.' },
    { title: 'Long Lead Time', description: '50/day, 15 std dev, 30-day lead, 95% service. Safety = 1.65 × 15 × √30 = 135 units. Long lead time requires more safety stock.' },
    { title: 'Fast Movers', description: '500/day, 50 std dev, 3-day lead, 95%. Safety = 1.65 × 50 × √3 = 143 units. Reorder = 1,500 + 143 = 1,643.' },
  ],
  faqs: [
    { question: 'What is safety stock?', answer: 'Safety stock = buffer inventory to prevent stockouts during demand or lead time variability. Formula: Z × σ × √lead time, where Z = service level (90% = 1.28, 95% = 1.65, 99% = 2.33), σ = demand standard deviation. Higher service level or variability = more safety stock. See our Reorder Point Calculator.' },
    { question: 'What is a good service level?', answer: 'Common: 95% (1.65 Z-score) for most products. 99% (2.33) for critical/medical. 90% (1.28) for low-value/non-critical. Trade-off: higher service level = more safety stock = higher holding cost vs lower stockout risk. Set by product: A-items (high value) 99%, B-items 95%, C-items 90%.' },
    { question: 'How do you calculate demand standard deviation?', answer: 'σ = standard deviation of daily demand. Calculate from historical sales data: (1) Collect daily demand for past 3-12 months, (2) Calculate mean, (3) Calculate standard deviation. Or estimate: if demand varies ±20% around average, σ ≈ average × 0.20 / 1.96 (95% confidence). Use Excel STDEV function.' },
    { question: 'How do you reduce safety stock?', answer: 'Strategies: (1) Reduce lead time (closer suppliers, air freight), (2) Reduce demand variability (better forecasting, S&OP), (3) Lower service level target (accept more stockouts), (4) Pool inventory (centralize), (5) Postponement (customize late). Each day of lead time reduction saves ~5-10% safety stock. See our EOQ Calculator.' },
    { question: 'Safety stock vs cycle stock?', answer: 'Cycle stock = inventory consumed between replenishments (= EOQ/2 average). Safety stock = buffer for variability (above cycle stock). Total inventory = cycle + safety. Example: EOQ 500 units, safety 100 units. Average inventory = 250 (cycle) + 100 (safety) = 350 units. See our EOQ Calculator.' },
    { question: 'What happens if safety stock is too low?', answer: 'Too little safety stock = frequent stockouts. Costs: (1) Lost sales (customers buy elsewhere), (2) Expedited shipping (premium freight), (3) Customer dissatisfaction (churn), (4) Production line stoppage (manufacturing). Balance: cost of stockout vs cost of holding safety stock. Aim for 95% service level for most products.' },
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
