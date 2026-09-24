const seoData = {
  breadcrumbs: [{ label: 'Calculators' }, { label: 'CPC Calculator' }],
  tableOfContents: [
    { id: 'how-to-calculate', label: 'How to Calculate' },
    { id: 'formula', label: 'Formula' },
    { id: 'worked-examples', label: 'Worked Examples' },
    { id: 'frequently-asked-questions', label: 'FAQs' },
    { id: 'related-calculators', label: 'Related Calculators' },
  ],
  howToSteps: [
    'Enter ad cost.',
    'Enter total clicks.',
    'Click Calculate to see cost per click.',
  ],
  formula: 'CPC = Ad Cost / Clicks\nGoogle Search $1-50, Facebook $0.50-3,\nLinkedIn $5-10, Display $0.50-2\nLower = better. Improve with ad quality.',
  formulaDescription: 'CPC = ad cost / clicks. Benchmarks: Google Search $1-50 (varies by keyword), Facebook $0.50-3, LinkedIn $5-10, display $0.50-2. Lower = better. Improve by: better ad relevance, higher Quality Score, better targeting, creative testing.',
  workedExamples: [
    { title: 'Google Search', description: '$2,000 cost, 1,000 clicks. CPC = $2.00. Within Google range ($1-50). Good for competitive keyword.' },
    { title: 'Facebook', description: '$1,500 cost, 3,000 clicks. CPC = $0.50. Within Facebook range ($0.50-3). Efficient.' },
    { title: 'LinkedIn', description: '$5,000 cost, 700 clicks. CPC = $7.14. Within LinkedIn range ($5-10). Premium B2B.' },
    { title: 'Display', description: '$1,000 cost, 2,500 clicks. CPC = $0.40. Within display range ($0.50-2). Below benchmark.' },
    { title: 'Expensive Keyword', description: '$5,000 cost, 200 clicks. CPC = $25. High for competitive B2B keyword (e.g., "CRM software").' },
  ],
  faqs: [
    { question: 'What is CPC?', answer: 'Cost Per Click = ad cost / clicks. Measures cost efficiency of getting clicks from ads. Benchmarks: Google Search $1-50 (varies by keyword competitiveness), Facebook $0.50-3, LinkedIn $5-10, display $0.50-2. Lower = better. Improve by: better ad relevance, higher Quality Score (Google), better targeting, creative testing. See our CPM and CPL Calculators.' },
    { question: 'What is a good CPC?', answer: 'Depends on platform, industry, keyword. Google Search: $1-5 (low competition), $5-20 (medium), $20-50+ (high competition like insurance, legal). Facebook: $0.50-3. LinkedIn: $5-10 (B2B premium). Display: $0.50-2. Lower = better. But consider conversion rate: $25 CPC with 20% conversion = $125 CPA. $2 CPC with 1% conversion = $200 CPA. Track CPC + conversion = CPA. See our CPA Calculator.' },
    { question: 'CPC vs CPM?', answer: 'CPC = cost per click (engagement). CPM = cost per 1,000 impressions (reach). CPC bidding: pay per click (good for traffic). CPM bidding: pay per 1,000 impressions (good for awareness). CPC = CPM / (CTR × 10). Example: $10 CPM, 2% CTR = $10 / (0.02 × 10) = $0.50 CPC. Choose based on objective: traffic = CPC, awareness = CPM. See our CPM Calculator.' },
    { question: 'How do you reduce CPC?', answer: 'Strategies: (1) Improve ad relevance/Quality Score (Google rewards with lower CPC), (2) Better landing page experience, (3) More specific keyword matching (long-tail, exact match), (4) Negative keywords (exclude irrelevant searches), (5) Ad scheduling (bid lower off-peak), (6) Geo-targeting (less competition in smaller markets), (7) Ad extensions (improve CTR, Quality Score).' },
    { question: 'What is Quality Score?', answer: 'Google Ads metric (1-10) measuring ad quality. Components: (1) CTR (most important), (2) Ad relevance (keyword match to ad), (3) Landing page experience. Higher Quality Score = lower CPC, better ad position. Example: QS 10 vs QS 3 = 50%+ lower CPC. Improve QS by: relevant keywords, compelling ad copy, high-quality landing page, ad extensions. See our CPC Calculator.' },
    { question: 'How do you calculate required CPC for target CPA?', answer: 'Max CPC = target CPA × conversion rate. Example: target CPA $200, landing page conversion rate 5% = $200 × 0.05 = $10 max CPC. If actual CPC > $10, you\'ll exceed target CPA. Formula: CPA = CPC / conversion rate. To lower CPA: reduce CPC or increase conversion rate. See our CPA Calculator.' },
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
