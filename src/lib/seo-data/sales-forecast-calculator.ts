const seoData = {
  breadcrumbs: [{ label: 'Calculators' }, { label: 'Sales Forecast Calculator' }],
  tableOfContents: [
    { id: 'how-to-calculate', label: 'How to Calculate' },
    { id: 'formula', label: 'Formula' },
    { id: 'worked-examples', label: 'Worked Examples' },
    { id: 'frequently-asked-questions', label: 'FAQs' },
    { id: 'related-calculators', label: 'Related Calculators' },
  ],
  howToSteps: [
    'Enter total pipeline value.',
    'Enter average win rate (%).',
    'Enter average sales cycle (days).',
    'Enter forecast period (days).',
    'Click Calculate to see weighted forecast.',
  ],
  formula: 'Weighted Forecast = Pipeline x Win Rate\nCoverage Ratio = Pipeline / Forecast\nDeals Closing = (Period / Sales Cycle) x Weighted Forecast\nBest Case = Weighted x 1.5, Worst Case = Weighted x 0.5',
  formulaDescription: 'Weighted forecast = pipeline × win rate. Coverage ratio = pipeline / forecast (target 3-4x). Deals closing in period = (period / sales cycle) × weighted forecast. Adjust win rate by stage.',
  workedExamples: [
    { title: 'Standard Q1', description: '$2M pipeline, 25% win rate, 90-day cycle, 90-day period. Weighted = $500k. Coverage = 4x. Closing = $500k.' },
    { title: 'Strong Pipeline', description: '$5M pipeline, 30% win, 60-day cycle, 90-day period. Weighted = $1.5M. Coverage = 3.3x. Closing = $2.25M.' },
    { title: 'Weak Pipeline', description: '$1M pipeline, 20% win, 120-day cycle, 90-day period. Weighted = $200k. Coverage = 5x. Closing = $150k.' },
    { title: 'Enterprise', description: '$10M pipeline, 15% win, 180-day cycle, 90-day period. Weighted = $1.5M. Coverage = 6.7x. Closing = $750k.' },
    { title: 'SMB High Volume', description: '$500k pipeline, 35% win, 30-day cycle, 90-day period. Weighted = $175k. Coverage = 2.9x. Closing = $525k.' },
  ],
  faqs: [
    { question: 'What is a sales forecast?', answer: 'Sales forecast = predicted revenue from current pipeline. Weighted forecast = pipeline × win rate. Coverage ratio = pipeline / forecast (target 3-4x). Deals closing in period = (period / sales cycle) × weighted forecast. Used for: revenue projection, capacity planning, investor reporting. See our Revenue Forecast Calculator.' },
    { question: 'What is a weighted pipeline forecast?', answer: 'Weighted pipeline = pipeline × win rate. Example: $2M pipeline × 25% win = $500k weighted forecast. More accurate than unweighted (full $2M). Adjust win rate by stage: prospect 10%, qualified 25%, proposal 50%, negotiation 75%, closed-won 100%. Sum stage-weighted values for more precision.' },
    { question: 'What is pipeline coverage?', answer: 'Coverage = pipeline / quota (or forecast). Target: 3-4x (need $3-4 in pipeline for every $1 of quota). Example: $500k quota, $1.5M pipeline = 3x coverage. Below 3x = likely to miss quota (need more prospecting). Above 5x = may be inflated pipeline (check deal quality). See our Pipeline Calculator.' },
    { question: 'How do you forecast by sales stage?', answer: 'Stage-weighted forecast = sum of (deal value × stage probability). Stages: (1) Prospect 5-10%, (2) Qualified 15-25%, (3) Discovery 25-35%, (4) Proposal 40-50%, (5) Negotiation 60-75%, (6) Closed-Won 100%. Example: $100k at proposal (50%) = $50k weighted. More accurate than single win rate for mixed-stage pipeline.' },
    { question: 'What is forecast accuracy?', answer: 'Accuracy = |actual - forecast| / actual × 100. Good: <15% variance for 3-month, <25% for 12-month. Improve by: (1) Clean CRM data (update stages, close dates), (2) Use stage-weighted (not single win rate), (3) Rep-level forecasting with manager roll-up, (4) Monthly variance review, (5) Adjust for seasonality and market conditions.' },
    { question: 'What is the difference between commit and best-case forecast?', answer: 'Commit = deals rep is 90%+ confident will close (usually in negotiation stage). Best-case = deals that could close (qualified/proposal stage, 50%+ probability). Pipeline = all deals (including early-stage 10-20%). Typical: commit = 40-50% of weighted forecast, best-case = 70-80%, pipeline = 100% (weighted).' },
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
