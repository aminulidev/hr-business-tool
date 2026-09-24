const seoData = {
  breadcrumbs: [{ label: 'Calculators' }, { label: 'Sales Bonus Calculator' }],
  tableOfContents: [
    { id: 'how-to-calculate', label: 'How to Calculate' },
    { id: 'formula', label: 'Formula' },
    { id: 'worked-examples', label: 'Worked Examples' },
    { id: 'frequently-asked-questions', label: 'FAQs' },
    { id: 'related-calculators', label: 'Related Calculators' },
  ],
  howToSteps: [
    'Enter annual quota.',
    'Enter quota attainment (%).',
    'Enter base bonus at 100% attainment.',
    'Enter accelerator (per 1% above 100).',
    'Enter SPIFF (one-time incentive).',
    'Click Calculate to see total bonus.',
  ],
  formula: 'Attainment Bonus = Base x (Attainment/100) if <100%, else Base\nAccelerator Bonus = Base x Accelerator% x max(0, Attainment - 100)\nSPIFF = One-time incentive\nTotal = Attainment + Accelerator + SPIFF',
  formulaDescription: 'Sales bonus: base bonus at 100% attainment, accelerator for over-achievement, SPIFFs for specific behaviors. Typical pay mix: 60% base, 40% variable. Accelerators reward over-performance (e.g., 2% per 1% above quota).',
  workedExamples: [
    { title: 'At Quota', description: '$500k quota, 100% attainment, $20k base, 2% accel, $0 SPIFF. Attainment = $20k. Accelerator = $0. Total = $20k.' },
    { title: 'Over Quota', description: 'Same, 120% attainment. Attainment = $20k. Accelerator = $8k. Total = $28k.' },
    { title: 'Under Quota', description: 'Same, 80% attainment. Attainment = $16k (prorated). Accelerator = $0. Total = $16k.' },
    { title: 'With SPIFF', description: '$500k quota, 110% attainment, $20k base, 2% accel, $2k SPIFF. Attainment = $20k. Accelerator = $4k. Total = $26k.' },
    { title: 'Top Performer', description: '$500k quota, 150% attainment, $20k base, 3% accel, $5k SPIFF. Attainment = $20k. Accelerator = $30k. Total = $55k.' },
  ],
  faqs: [
    { question: 'What is a sales bonus?', answer: 'Sales bonus = additional compensation beyond base + commission, tied to quota attainment. Components: (1) Base bonus at 100% attainment, (2) Accelerator (higher rate above 100%), (3) SPIFFs (specific behavior incentives). Typical: 20-40% of OTE. See our Incentive Calculator for full OTE.' },
    { question: 'What is a sales accelerator?', answer: 'Accelerator = higher bonus/commission rate above quota. Example: 2% per 1% attainment above 100%. At 120% attainment, accelerator = 2% × 20 = 40% of base bonus. Motivates reps to keep selling after hitting quota (prevents sandbagging). Typical: 1.5-3x base rate above 100%.' },
    { question: 'What is a SPIFF?', answer: 'SPIFF = Sales Performance Incentive Fund (or "special performance incentive for field"). One-time bonus for specific behavior: selling a particular product, closing deals in a slow month, demoing to key accounts. Typical: $500-$5,000. Used short-term to drive specific behaviors. Separate from regular commission/bonus structure.' },
    { question: 'How do you structure a sales bonus plan?', answer: 'Structure: (1) Base salary (50-70% of OTE), (2) Commission (20-40% of OTE), (3) Bonus at quota (5-15% of OTE), (4) Accelerator above quota (uncapped or capped), (5) SPIFFs for specific behaviors. Set quota at 70-80% attainable for average reps. See our Incentive Calculator.' },
    { question: 'What is a good quota attainment rate?', answer: 'Industry: 60-70% of reps should hit 100%+ quota. Below 50% = quotas too high (reps give up). Above 80% = quotas too low (company overpays). Top 10% of reps should be at 120-150%. Bottom 10% at 50-70%. Track by: rep, team, segment, tenure. Adjust quotas annually based on attainment. See our Quota Calculator.' },
    { question: 'Should sales bonuses be capped?', answer: 'Generally NO — caps demotivate top performers. If rep exceeds 200% quota, they\'ve earned it. BUT: some companies cap at 200-300% to control costs. Alternative: reduce commission rate above 200% (decelerator). Uncapped is best for retention of top talent. See our Incentive Calculator for OTE analysis.' },
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
