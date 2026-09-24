const seoData = {
  breadcrumbs: [{ label: 'Calculators' }, { label: 'CPM Calculator' }],
  tableOfContents: [
    { id: 'how-to-calculate', label: 'How to Calculate' },
    { id: 'formula', label: 'Formula' },
    { id: 'worked-examples', label: 'Worked Examples' },
    { id: 'frequently-asked-questions', label: 'FAQs' },
    { id: 'related-calculators', label: 'Related Calculators' },
  ],
  howToSteps: [
    'Enter ad cost.',
    'Enter total impressions.',
    'Click Calculate to see cost per 1,000 impressions.',
  ],
  formula: 'CPM = (Ad Cost / Impressions) x 1,000\nDisplay $2-10, Facebook $5-15,\nLinkedIn $15-30, Video $20-40\nLower = more efficient reach.',
  formulaDescription: 'CPM = (ad cost / impressions) × 1,000 = cost per thousand impressions. Used for brand awareness campaigns. Benchmarks: Google Display $2-10, Facebook $5-15, LinkedIn $15-30, video $20-40. Lower = more efficient reach.',
  workedExamples: [
    { title: 'Google Display', description: '$1,000 cost, 500,000 impressions. CPM = $2. Low — within Display range ($2-10). Efficient.' },
    { title: 'Facebook', description: '$5,000 cost, 400,000 impressions. CPM = $12.50. Within Facebook range ($5-15). Typical.' },
    { title: 'LinkedIn', description: '$10,000 cost, 400,000 impressions. CPM = $25. Within LinkedIn range ($15-30). Premium B2B.' },
    { title: 'Video/YouTube', description: '$8,000 cost, 300,000 impressions. CPM = $26.67. Within video range ($20-40). Good.' },
    { title: 'Expensive CPM', description: '$5,000 cost, 100,000 impressions. CPM = $50. Above benchmark. Check targeting/creative.' },
  ],
  faqs: [
    { question: 'What is CPM?', answer: 'CPM = Cost Per Mille (thousand impressions) = (ad cost / impressions) × 1,000. Measures cost efficiency of reach. Used for brand awareness campaigns. Benchmarks: Google Display $2-10, Facebook $5-15, LinkedIn $15-30, video $20-40, OTT/CTV $25-40. Lower = more efficient reach. See our CPC and CPL Calculators.' },
    { question: 'What is a good CPM?', answer: 'Depends on platform and audience. Google Display $2-10 (broad reach), Facebook $5-15 (targeted social), LinkedIn $15-30 (B2B professional), video/YouTube $20-40 (engaging format), OTT/CTV $25-40 (premium video). Lower = better. But consider audience quality — LinkedIn $25 CPM for B2B decision-makers may be better value than Facebook $8 for generic audience. Track CPM + CTR + CPL together.' },
    { question: 'CPM vs CPC vs CPA?', answer: 'CPM = cost per 1,000 impressions (reach metric). CPC = cost per click (engagement metric). CPA = cost per acquisition (conversion metric). CPM → CPC → CPA: each step further down funnel. CPM lowest (impressions), CPC higher (clicks), CPA highest (customers). Choose based on objective: brand awareness = CPM, traffic = CPC, conversions = CPA/CPL. See our CPC and CPA Calculators.' },
    { question: 'How do you reduce CPM?', answer: 'Strategies: (1) Broader targeting (less competition = cheaper), (2) Lower-bid strategy (may reduce impressions), (3) Better ad relevance/Quality Score (Google rewards relevant ads), (4) Off-peak times (lower demand), (5) Different ad formats (display cheaper than video), (6) Frequency cap (avoid over-serving to same audience). Balance CPM with quality — cheapest CPM may not deliver results.' },
    { question: 'When should you use CPM bidding?', answer: 'Use CPM bidding for: (1) Brand awareness (maximize reach, not clicks), (2) Retargeting (reach known audience), (3) Social media (Facebook, LinkedIn brand campaigns). Use CPC for: traffic generation, search intent. Use CPA/target CPA for: conversion campaigns. CPM is best when you want maximum impressions for budget (awareness), not immediate response. See our CPC Calculator.' },
    { question: 'How do you calculate budget from CPM?', answer: 'Budget = (target impressions / 1,000) × CPM. Example: 500,000 impressions at $10 CPM = 500 × $10 = $5,000. Or: impressions = (budget / CPM) × 1,000. Example: $5,000 budget at $10 CPM = 500,000 impressions. Useful for: media planning, budget allocation, reach forecasting. Track actual CPM vs planned — adjust budget or expectations.' },
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
