const seoData = {
  breadcrumbs: [{ label: 'Calculators' }, { label: 'Win Rate Calculator' }],
  tableOfContents: [
    { id: 'how-to-calculate', label: 'How to Calculate' },
    { id: 'formula', label: 'Formula' },
    { id: 'worked-examples', label: 'Worked Examples' },
    { id: 'frequently-asked-questions', label: 'FAQs' },
    { id: 'related-calculators', label: 'Related Calculators' },
  ],
  howToSteps: [
    'Enter won deals.',
    'Enter lost deals.',
    'Enter open deals (excluded from calculation).',
    'Click Calculate to see win rate.',
  ],
  formula: 'Closed Deals = Won + Lost\nWin Rate = Won / Closed x 100\nLoss Rate = Lost / Closed x 100\nOpen deals excluded (not yet decided)',
  formulaDescription: 'Win rate = won / (won + lost) × 100. Exclude open deals. Industry: SaaS 25-35%, enterprise 20-30%, SMB 30-40%, retail 40-50%. Track by rep, segment, deal size.',
  workedExamples: [
    { title: 'SaaS Average', description: '25 won, 60 lost, 15 open. Closed = 85. Win rate = 29.4%. Typical SaaS.' },
    { title: 'Strong Performer', description: '30 won, 40 lost. Win rate = 42.9%. Above average.' },
    { title: 'Enterprise', description: '10 won, 35 lost. Win rate = 22.2%. Typical enterprise (longer cycle, more competition).' },
    { title: 'SMB High Volume', description: '50 won, 70 lost. Win rate = 41.7%. Typical SMB (shorter cycle, faster decisions).' },
    { title: 'Low Win Rate', description: '8 won, 50 lost. Win rate = 13.8%. Below benchmark — investigate qualification/pricing.' },
  ],
  faqs: [
    { question: 'What is sales win rate?', answer: 'Win rate = won deals / (won + lost) × 100. Exclude open deals (not yet decided). Industry: SaaS 25-35%, enterprise 20-30%, SMB 30-40%, retail 40-50%. Track by: rep, segment, deal size, source. Low win rate = qualification, pricing, or competitive issues. See our Conversion Rate Calculator.' },
    { question: 'What is a good win rate?', answer: 'Industry: SaaS 25-35%, enterprise 20-30%, SMB 30-40%, retail 40-50%, real estate 10-20%. Above industry = strong. Below = investigate: (1) Lead quality (MQL to SQL), (2) Pricing competitiveness, (3) Demo quality, (4) Competitive positioning, (5) Rep skill. Track trend — declining win rate = emerging issue.' },
    { question: 'Should you include open deals in win rate?', answer: 'NO — open deals haven\'t been won or lost yet. Win rate = closed-won / (closed-won + closed-lost). Including open deals would understate win rate. Example: 25 won, 60 lost, 15 open. Correct: 25/85 = 29.4%. Incorrect (with open): 25/100 = 25%. Track open deals separately as "pipeline conversion."' },
    { question: 'How do you improve win rate?', answer: 'Strategies: (1) Better qualification (don\'t pursue unwinnable deals), (2) Improve demo/presentation skills, (3) Competitive battlecards, (4) Pricing optimization (not too high/low), (5) Stronger value proposition, (6) Better timing (reach out when need is high), (7) References/case studies, (8) Executive sponsorship. Track by loss reason to identify patterns.' },
    { question: 'What is the difference between win rate and close rate?', answer: 'Win rate = won / (won + lost) × 100 (excludes open). Close rate = won / total opportunities × 100 (includes open, or = won / meetings held). Win rate is for closed deals only. Close rate is broader. "Close rate" often means meeting-to-close rate (deals won / meetings held). See our Conversion Rate Calculator for funnel metrics.' },
    { question: 'How do you track win rate by segment?', answer: 'Track by: (1) Industry (some industries convert better), (2) Company size (SMB vs enterprise), (3) Deal size (small vs large), (4) Source (inbound vs outbound), (5) Rep (individual performance), (6) Product (some products sell easier). Identify which segments have highest win rate — focus resources there. Identify low segments — improve or deprioritize.' },
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
