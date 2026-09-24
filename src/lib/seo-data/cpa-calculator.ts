const seoData = {
  breadcrumbs: [{ label: 'Calculators' }, { label: 'CPA Calculator' }],
  tableOfContents: [
    { id: 'how-to-calculate', label: 'How to Calculate' },
    { id: 'formula', label: 'Formula' },
    { id: 'worked-examples', label: 'Worked Examples' },
    { id: 'frequently-asked-questions', label: 'FAQs' },
    { id: 'related-calculators', label: 'Related Calculators' },
  ],
  howToSteps: [
    'Enter total spend.',
    'Enter conversions (customers).',
    'Click Calculate to see cost per acquisition.',
  ],
  formula: 'CPA = Total Spend / Conversions\nGoogle $100-500, LinkedIn $200-800,\nFacebook $50-200\nTarget: CPA < LTV/3 for healthy unit economics.',
  formulaDescription: 'CPA = total spend / customers acquired. Different from CAC (CPA = paid media only; CAC includes sales team). Target: CPA < LTV/3 for healthy unit economics. Track by channel.',
  workedExamples: [
    { title: 'Google Ads', description: '$10,000 spend, 50 customers. CPA = $200. Within Google range ($100-500).' },
    { title: 'LinkedIn', description: '$15,000 spend, 30 customers. CPA = $500. Within LinkedIn range ($200-800). Premium B2B.' },
    { title: 'Facebook', description: '$5,000 spend, 50 customers. CPA = $100. Within Facebook range ($50-200). Good B2C.' },
    { title: 'Efficient Campaign', description: '$5,000 spend, 100 customers. CPA = $50. Below benchmark. Very efficient.' },
    { title: 'Expensive Campaign', description: '$20,000 spend, 20 customers. CPA = $1,000. Above benchmark. Needs optimization.' },
  ],
  faqs: [
    { question: 'What is CPA?', answer: 'Cost Per Acquisition = total spend / customers acquired. Measures cost to acquire one customer from paid media. Different from CAC (CPA = paid only; CAC = all sales + marketing). Track by channel: Google $100-500, LinkedIn $200-800, Facebook $50-200. Target: CPA < LTV/3 for healthy economics. See our CAC Calculator.' },
    { question: 'CPA vs CAC?', answer: 'CPA = paid media spend / customers from paid (paid channel only, no sales team). CAC = (all sales + marketing spend) / all new customers (includes sales salaries, tools). CPA is always ≤ CAC. Example: $1,000 CPA (paid) + $500 sales cost = $1,500 CAC. Use CPA for paid media optimization, CAC for overall business economics. See our CAC Calculator.' },
    { question: 'What is a good CPA?', answer: 'Depends on LTV. Target: CPA < LTV/3 (so LTV:CPA >3:1). SaaS: $200-$2,000 (SMB), $5,000-$50,000 (enterprise). E-commerce: $20-$100. Mobile app: $1-$10. Track LTV:CPA ratio, not absolute CPA. If CPA > LTV, you\'re losing money per customer. See our CLV Calculator.' },
    { question: 'How do you reduce CPA?', answer: 'Strategies: (1) Improve conversion rate (more customers per click), (2) Reduce CPC (cheaper clicks), (3) Better targeting (higher-quality traffic), (4) Retargeting (cheaper than cold), (5) Landing page optimization, (6) Higher LTV (allows higher CPA). Formula: CPA = CPC / conversion rate. Reduce CPC or increase conversion rate to lower CPA. See our CPC Calculator.' },
    { question: 'What is target CPA bidding?', answer: 'Google Ads bidding strategy: set target CPA, Google auto-bids to achieve it. Example: target CPA $200, Google adjusts bids to get customers at ~$200 each. Requires: 30+ conversions/month for machine learning. Good for: scaling campaigns with known CPA target. Monitor: actual CPA vs target, volume (may decrease if target too low).' },
    { question: 'How do you calculate CPA by channel?', answer: 'Tools: (1) Ad platform conversion tracking (Google Ads, Facebook, LinkedIn), (2) UTM parameters + CRM, (3) Attribution tools (Bizible, Dreamdata). Tag every conversion with channel. CPA by channel = channel spend / channel conversions. Compare channels: if LinkedIn CPA $500 vs Google $200, shift budget to Google (if quality similar). See our CAC Calculator.' },
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
