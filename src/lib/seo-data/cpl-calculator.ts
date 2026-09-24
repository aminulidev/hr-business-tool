const seoData = {
  breadcrumbs: [{ label: 'Calculators' }, { label: 'CPL Calculator' }],
  tableOfContents: [
    { id: 'how-to-calculate', label: 'How to Calculate' },
    { id: 'formula', label: 'Formula' },
    { id: 'worked-examples', label: 'Worked Examples' },
    { id: 'frequently-asked-questions', label: 'FAQs' },
    { id: 'related-calculators', label: 'Related Calculators' },
  ],
  howToSteps: [
    'Enter ad spend.',
    'Enter leads generated.',
    'Click Calculate to see cost per lead.',
  ],
  formula: 'CPL = Ad Spend / Leads Generated\nGoogle Ads $50-200, LinkedIn $75-300,\nFacebook $25-75, Content $50-150\nLower = better. Track by channel.',
  formulaDescription: 'CPL = ad spend / leads. Track by channel: Google Ads $50-200, LinkedIn $75-300, Facebook $25-75, content $50-150. Lower = better. But track lead quality (CPL-to-SQL conversion).',
  workedExamples: [
    { title: 'Google Ads', description: '$5,000 spend, 100 leads. CPL = $50. Within Google range ($50-200). Efficient.' },
    { title: 'LinkedIn', description: '$10,000 spend, 40 leads. CPL = $250. Within LinkedIn range ($75-300). Premium B2B.' },
    { title: 'Facebook', description: '$3,000 spend, 100 leads. CPL = $30. Within Facebook range ($25-75). Good for B2C.' },
    { title: 'Content Marketing', description: '$8,000 spend, 120 leads. CPL = $67. Within content range ($50-150). Long-term asset.' },
    { title: 'Multi-Channel', description: '$50,000 total, 500 leads. Blended CPL = $100. Track per channel for optimization.' },
  ],
  faqs: [
    { question: 'What is CPL?', answer: 'Cost Per Lead = ad spend / leads generated. Measures cost efficiency of lead generation. Track by channel: Google Ads $50-200, LinkedIn $75-300, Facebook $25-75, content $50-150. Lower = better. But track lead quality — $50 lead with 30% SQL rate is better than $25 lead with 5% SQL rate. See our Lead Cost and CAC Calculators.' },
    { question: 'What is a good CPL?', answer: 'Depends on channel and industry. B2B: Google $50-200, LinkedIn $75-300, content $50-150. B2C: Facebook $5-25, Google $10-50, TikTok $5-15. Lower = better. But consider lead quality: $100 lead that becomes a $10k customer is better than $20 lead that doesn\'t convert. Track cost per SQL and cost per customer, not just CPL. See our CAC Calculator.' },
    { question: 'CPL vs CPA vs CAC?', answer: 'CPL = cost per lead (any lead, top of funnel). CPA = cost per acquisition (customer from paid channel). CAC = customer acquisition cost (all sales + marketing / customers). CPL is cheapest (leads). CPA is higher (only customers from paid). CAC is highest (includes sales team). Example: $50 CPL, 10% conversion = $500 CPA. With sales team: $700 CAC. See our CPA and CAC Calculators.' },
    { question: 'How do you reduce CPL?', answer: 'Strategies: (1) Better ad targeting (narrower audience), (2) Improve ad creative (higher CTR = more leads per dollar), (3) Landing page optimization (higher conversion), (4) Retargeting (cheaper than cold), (5) Content marketing (lower long-term CPL), (6) Referral programs (low CPL), (7) SEO (organic leads). Test channels — kill expensive ones, scale efficient ones.' },
    { question: 'How do you track CPL by channel?', answer: 'Tools: (1) UTM parameters on all links (source, medium, campaign), (2) CRM lead source tracking, (3) Marketing automation (HubSpot, Marketo), (4) Ad platform reporting (Google Ads, LinkedIn, Facebook). Tag every lead with channel. Calculate CPL by channel monthly. Reallocate budget from expensive to efficient channels. See our Lead Cost Calculator.' },
    { question: 'Should you optimize for CPL or ROI?', answer: 'ROI (or ROAS) is more important than CPL. $50 CPL with $5,000 customer LTV = great ROI. $20 CPL with $50 customer LTV = poor ROI. Optimize for cost per customer (CPA/CAC) and LTV:CAC ratio, not just CPL. But CPL is useful for: (1) Comparing channels, (2) Budget planning (how many leads for target customers), (3) Optimizing individual campaigns within a channel.' },
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
