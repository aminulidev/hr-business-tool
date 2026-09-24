const seoData = {
  breadcrumbs: [{ label: 'Calculators' }, { label: 'Sales Pipeline Calculator' }],
  tableOfContents: [
    { id: 'how-to-calculate', label: 'How to Calculate' },
    { id: 'formula', label: 'Formula' },
    { id: 'worked-examples', label: 'Worked Examples' },
    { id: 'frequently-asked-questions', label: 'FAQs' },
    { id: 'related-calculators', label: 'Related Calculators' },
  ],
  howToSteps: [
    'Enter quota (period).',
    'Enter current pipeline value.',
    'Enter win rate (%).',
    'Click Calculate to see coverage ratio and gap.',
  ],
  formula: 'Coverage = Pipeline / Quota\nWeighted Pipeline = Pipeline x Win Rate\nGap = Quota - Weighted Pipeline\nRequired Pipeline = Quota / Win Rate',
  formulaDescription: 'Pipeline coverage = pipeline / quota. Target: 3-4x. Weighted pipeline = pipeline × win rate. Gap = quota - weighted (positive = shortfall). Required pipeline = quota / win rate. If coverage <3x, need more prospecting.',
  workedExamples: [
    { title: 'Healthy Pipeline', description: '$500k quota, $1.5M pipeline, 25% win. Coverage = 3x. Weighted = $375k. Gap = $125k shortfall. Required = $2M.' },
    { title: 'Strong Coverage', description: '$500k quota, $2.5M pipeline, 30% win. Coverage = 5x. Weighted = $750k. Gap = -$250k surplus.' },
    { title: 'Weak Pipeline', description: '$500k quota, $800k pipeline, 20% win. Coverage = 1.6x. Weighted = $160k. Gap = $340k shortfall. Need $2.5M pipeline.' },
    { title: 'Enterprise', description: '$1M quota, $5M pipeline, 15% win. Coverage = 5x. Weighted = $750k. Gap = $250k shortfall. Required = $6.67M.' },
    { title: 'SMB High Volume', description: '$200k quota, $500k pipeline, 35% win. Coverage = 2.5x. Weighted = $175k. Gap = $25k. Close but need more.' },
  ],
  faqs: [
    { question: 'What is pipeline coverage?', answer: 'Coverage = pipeline / quota. Target: 3-4x (need $3-4 in pipeline for every $1 of quota). Below 3x = likely to miss quota. Above 5x = may have inflated/low-quality pipeline. Example: $500k quota, $1.5M pipeline = 3x coverage. Track by: rep, team, segment. See our Sales Forecast Calculator.' },
    { question: 'What is weighted pipeline?', answer: 'Weighted pipeline = pipeline × win rate. Example: $2M pipeline × 25% win = $500k weighted. More realistic than unweighted ($2M). Used for: revenue forecast, gap analysis. Adjust win rate by stage for more precision: prospect 10%, qualified 25%, proposal 50%, negotiation 75%.' },
    { question: 'What is pipeline gap analysis?', answer: 'Gap = quota - weighted pipeline. Positive gap = shortfall (need more pipeline). Negative gap = surplus (on track). Example: $500k quota, $375k weighted = $125k gap (need $125k more weighted pipeline = $500k more unweighted at 25% win). Action: prospecting, marketing campaigns, deal acceleration.' },
    { question: 'How much pipeline do I need?', answer: 'Required pipeline = quota / win rate. Example: $500k quota / 25% win = $2M required pipeline. With 3x coverage target: $1.5M. With 4x: $2M. Higher win rate = less pipeline needed. Lower win rate = more pipeline needed. Improve win rate to reduce pipeline pressure. See our Win Rate Calculator.' },
    { question: 'What is a healthy pipeline by stage?', answer: 'Healthy distribution: (1) Prospecting 40% (top of funnel), (2) Qualified 25%, (3) Proposal 20%, (4) Negotiation 10%, (5) Closing 5%. If too much in early stages = need to advance deals. If too much in late stages = need more prospecting (future pipeline gap). Track by: stage value, stage count, average days in stage.' },
    { question: 'How do you increase pipeline coverage?', answer: 'Strategies: (1) More prospecting (SDR outreach, cold calls, emails), (2) Marketing campaigns (webinars, content, paid ads), (3) Partner/channel pipeline, (4) Customer expansion (upsell/cross-sell), (5) Improve win rate (better qualification, demos), (6) Shorten sales cycle (process improvement). Best: balanced approach across all.' },
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
