const seoData = {
  breadcrumbs: [{ label: 'Calculators' }, { label: 'Tiered Commission Calculator' }],
  tableOfContents: [
    { id: 'how-to-calculate', label: 'How to Calculate' },
    { id: 'formula', label: 'Formula' },
    { id: 'worked-examples', label: 'Worked Examples' },
    { id: 'frequently-asked-questions', label: 'FAQs' },
    { id: 'related-calculators', label: 'Related Calculators' },
  ],
  howToSteps: [
    'Enter total sales amount.',
    'Enter tier 1 limit ($) and rate (%).',
    'Enter tier 2 limit ($) and rate (%).',
    'Enter tier 3 rate (%) for sales above tier 2.',
    'Click Calculate to see per-tier commission and total.',
  ],
  formula: 'Tier 1: min(Sales, T1 Limit) x T1 Rate\nTier 2: max(0, min(Sales, T2 Limit) - T1 Limit) x T2 Rate\nTier 3: max(0, Sales - T2 Limit) x T3 Rate\nTotal = T1 + T2 + T3\nEffective Rate = Total / Sales x 100',
  formulaDescription: 'Tiered commission uses progressive rates: different percentages for different sales thresholds. Accelerators reward over-performance. Example: 5% on first $50k, 8% on $50k-$100k, 12% above $100k. Effective rate = total commission / total sales.',
  workedExamples: [
    { title: 'Standard Tiered', description: '$120k sales, 5% to $50k, 8% to $100k, 12% above. T1 = $2,500. T2 = $4,000. T3 = $2,400. Total = $8,900. Effective = 7.42%.' },
    { title: 'All in Tier 1', description: '$30k sales, same tiers. T1 = $1,500. T2 = $0. T3 = $0. Total = $1,500. Effective = 5%.' },
    { title: 'High Performer', description: '$200k sales. T1 = $2,500. T2 = $4,000. T3 = $12,000. Total = $18,500. Effective = 9.25%.' },
    { title: 'Real Estate Example', description: '$500k sale, 3% to $250k, 5% above. T1 = $7,500. T2 = $12,500. Total = $20,000. Effective = 4%.' },
    { title: 'Insurance Accelerator', description: '$150k premium, 8% base, 12% above $100k. T1 = $8,000. T2 = $6,000. Total = $14,000. Effective = 9.33%.' },
  ],
  faqs: [
    { question: 'What is tiered commission?', answer: 'Tiered commission uses progressive rates: different percentages for different sales thresholds. Example: 5% on first $50k, 8% on $50k-$100k, 12% above $100k. Accelerators reward over-performance. Each tier only applies to sales within that tier range — not retroactively to all sales.' },
    { question: 'How is tiered commission different from flat commission?', answer: 'Flat commission = same rate on all sales (e.g., 10% on everything). Tiered = different rates for different thresholds. Tiered rewards over-performance (higher rate as you exceed thresholds). Flat is simpler but less motivating for top performers. See our Sales Commission Calculator for flat-rate.' },
    { question: 'What is a commission accelerator?', answer: 'Accelerator = higher commission rate above a threshold (usually quota). Example: 5% to quota, 10% above. Motivates reps to exceed quota. Common in SaaS (to prevent reps from sandbagging deals to next period once quota is hit). Typical: 1.5x-3x base rate above 100% attainment.' },
    { question: 'How do you calculate effective commission rate?', answer: 'Effective rate = total commission / total sales × 100. Example: $8,900 commission on $120k sales = 7.42%. Useful for comparing tiered vs flat structures. If flat 8% would pay $9,600, the tiered structure is cheaper at $8,900 (7.42% effective).' },
    { question: 'What are common commission tier structures?', answer: 'Common: (1) Flat rate (simplest), (2) Tiered by sales volume (5/8/12%), (3) Tiered by product type (different rates for different products), (4) Accelerator above quota (base rate + 1.5-3x above 100%), (5) Split by deal type (new logo vs renewal). Choose based on sales complexity and motivation goals.' },
    { question: 'Should commission tiers be retroactive?', answer: 'Generally NO — each tier applies only to sales within that tier range (marginal rate). Example: $120k at 5%/8%/12% = $2,500 + $4,000 + $2,400 = $8,900. Retroactive would be $14,400 (12% on everything). Marginal is more common and fairer. Check your comp plan for specifics.' },
  ],
  relatedTools: [
    { slug: 'commission-calculator', title: 'Sales Commission Calculator', description: 'Flat-rate commission', icon: 'DollarSign' },
    { slug: 'roi-calculator', title: 'ROI Calculator', description: 'Return on investment', icon: 'BarChart3' },
    { slug: 'break-even-calculator', title: 'Break-Even Calculator', description: 'Break-even analysis', icon: 'Target' },
    { slug: 'profit-margin-calculator', title: 'Profit Margin Calculator', description: 'Margin analysis', icon: 'Percent' },
    { slug: 'revenue-forecast-calculator', title: 'Revenue Forecast', description: 'Revenue projection', icon: 'TrendingUp' },
  ],
};
export default seoData;
