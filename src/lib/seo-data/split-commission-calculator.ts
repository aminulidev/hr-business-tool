const seoData = {
  breadcrumbs: [{ label: 'Calculators' }, { label: 'Split Commission Calculator' }],
  tableOfContents: [
    { id: 'how-to-calculate', label: 'How to Calculate' },
    { id: 'formula', label: 'Formula' },
    { id: 'worked-examples', label: 'Worked Examples' },
    { id: 'frequently-asked-questions', label: 'FAQs' },
    { id: 'related-calculators', label: 'Related Calculators' },
  ],
  howToSteps: [
    'Enter deal value.',
    'Enter commission rate (%).',
    'Enter rep 1 split (%).',
    'Enter rep 2 split (%).',
    'Click Calculate to see per-rep commission.',
  ],
  formula: 'Total Commission = Deal Value x Rate\nRep 1 Commission = Total x Rep 1 Split%\nRep 2 Commission = Total x Rep 2 Split%\nSplits should total 100%.',
  formulaDescription: 'Split commission divides commission between multiple reps on shared deals. Common in team-based selling, account handoffs, co-selling. Split percentages should total 100%. Document split rationale in CRM.',
  workedExamples: [
    { title: 'Equal Split', description: '$100k deal, 10% commission, 50/50 split. Total = $10k. Each rep = $5,000.' },
    { title: 'Primary/Secondary', description: '$100k deal, 10%, 70/30 split. Primary = $7,000. Secondary = $3,000.' },
    { title: 'Three-Way Split', description: '$150k deal, 8%, 50/30/20. Rep1 = $6,000, Rep2 = $3,600, Rep3 = $2,400.' },
    { title: 'Account Handoff', description: '$80k deal, 12%, 60/40 (original rep / new rep after territory change). Original = $5,760. New = $3,840.' },
    { title: 'Team Sale', description: '$200k deal, 10%, 3 reps at 40/35/25. Rep1 = $8,000, Rep2 = $7,000, Rep3 = $5,000.' },
  ],
  faqs: [
    { question: 'What is split commission?', answer: 'Split commission divides a single deal\'s commission between multiple sales reps. Used in: team-based selling, account handoffs (territory changes), co-selling (SDR + AE), channel partnerships. Split percentages should total 100%. Document in CRM with split rationale.' },
    { question: 'How do you split commission fairly?', answer: 'Factors: (1) Who sourced the lead? (2) Who did the demo/negotiation? (3) Who closed? (4) Account ownership (AE vs SDR). Common splits: 50/50 (equal contribution), 70/30 (primary closer), 60/40 (AE/SDR). Document the agreement BEFORE the deal closes to avoid disputes.' },
    { question: 'What is a typical SDR/AE split?', answer: 'Common: SDR gets 10-20% of commission for booked meeting that leads to closed deal. AE gets 80-90%. Example: $10k commission on $100k deal, SDR gets $1-2k, AE gets $8-9k. Varies by company — some SDRs get flat $500-1k per SQL that closes, not a percentage.' },
    { question: 'Can commission be split more than two ways?', answer: 'Yes — for complex deals with multiple contributors. Example: channel partner (20%), AE (50%), SE (15%), manager override (15%). Track all contributors in CRM. Keep total at 100%. More splits = more complexity but rewards all contributors. Common in enterprise sales.' },
    { question: 'How do you handle split disputes?', answer: 'Prevention: (1) Document split policy in comp plan, (2) Agree on splits BEFORE deal closes, (3) CRM records all contributors. Resolution: (1) Sales ops reviews CRM, (2) Manager arbitrates, (3) Escalate to VP Sales if needed. Most disputes from undocumented or post-hoc splits. See our Commission Split Calculator for rep/company splits.' },
    { question: 'What is a manager override?', answer: 'Manager override = % of rep\'s commission paid to sales manager. Typically 5-10%. Example: $10k rep commission, 5% override = $500 to manager. Rewards management involvement in deals. Separate from split commission (which is between reps). See our Commission Split Calculator.' },
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
