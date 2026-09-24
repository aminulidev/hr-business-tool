const seoData = {
  breadcrumbs: [{ label: 'Calculators' }, { label: 'Lead Cost Calculator' }],
  tableOfContents: [
    { id: 'how-to-calculate', label: 'How to Calculate' },
    { id: 'formula', label: 'Formula' },
    { id: 'worked-examples', label: 'Worked Examples' },
    { id: 'frequently-asked-questions', label: 'FAQs' },
    { id: 'related-calculators', label: 'Related Calculators' },
  ],
  howToSteps: [
    'Enter total marketing spend.',
    'Enter leads generated.',
    'Click Calculate to see cost per lead (CPL).',
  ],
  formula: 'Cost Per Lead (CPL) = Total Spend / Leads Generated\nTrack by channel for optimization.\nGoogle Ads $50-200, LinkedIn $75-300, Facebook $25-75',
  formulaDescription: 'CPL = total spend / leads generated. Track by channel: Google Ads $50-200, LinkedIn $75-300, Facebook $25-75, content $50-150, events $100-500. Lower = better. But quality matters — track CPL-to-SQL conversion too.',
  workedExamples: [
    { title: 'Google Ads', description: '$5,000 spend, 100 leads. CPL = $50. Below Google benchmark ($50-200). Efficient.' },
    { title: 'LinkedIn Ads', description: '$10,000 spend, 50 leads. CPL = $200. Within LinkedIn range ($75-300). Typical B2B.' },
    { title: 'Content Marketing', description: '$8,000 spend, 120 leads. CPL = $67. Within content range ($50-150). Good.' },
    { title: 'Events/Conferences', description: '$25,000 spend, 100 leads. CPL = $250. Within events range ($100-500). High but high-quality.' },
    { title: 'Multi-Channel Blended', description: '$50,000 total spend, 500 leads. Blended CPL = $100. Track per channel for optimization.' },
  ],
  faqs: [
    { question: 'What is cost per lead (CPL)?', answer: 'CPL = total marketing spend / leads generated. Measures cost efficiency of lead generation. Track by channel: Google Ads $50-200, LinkedIn $75-300, Facebook $25-75, content $50-150, events $100-500. Lower = better. But lead quality matters — track CPL-to-SQL and CPL-to-customer conversion too.' },
    { question: 'What is a good CPL?', answer: 'Depends on channel and industry. B2B: Google $50-200, LinkedIn $75-300, content $50-150, events $100-500. B2C: Facebook $5-25, Google $10-50, TikTok $5-15. Lower = better. But $50 lead that becomes a customer is better than $10 lead that doesn\'t. Track ROI, not just CPL. See our CAC and CPA Calculators.' },
    { question: 'CPL vs CAC vs CPA?', answer: 'CPL = cost per lead (any lead). CPA = cost per acquisition (customer from paid channel). CAC = customer acquisition cost (all sales + marketing / customers). CPL is cheapest (leads are top of funnel). CPA is higher (only customers). CAC is highest (includes sales team). Example: $50 CPL, 10% lead-to-customer = $500 CPA. See our CAC and CPA Calculators.' },
    { question: 'How do you reduce CPL?', answer: 'Strategies: (1) Improve ad targeting (narrower audience), (2) Better ad creative (higher CTR), (3) Landing page optimization (higher conversion), (4) Retargeting (cheaper than cold), (5) Content marketing (lower long-term CPL), (6) Referral programs (low CPL), (7) SEO (organic = free leads after investment). Test channels — kill expensive ones, scale efficient ones.' },
    { question: 'Should you optimize for CPL or lead quality?', answer: 'Both — but quality matters more. $50 lead with 30% SQL rate = $167 per SQL. $25 lead with 5% SQL rate = $500 per SQL. Cheaper CPL but worse economics. Track: CPL, CPL-to-SQL, CPL-to-customer. Optimize for cost per SQL or cost per customer, not just CPL. See our CAC Calculator.' },
    { question: 'How do you track CPL by channel?', answer: 'Tools: (1) UTM parameters on all links (source, medium, campaign), (2) CRM lead source tracking, (3) Marketing automation (HubSpot, Marketo), (4) Attribution tools (Bizible, Dreamdata). Tag every lead with channel. Calculate CPL by channel monthly. Reallocate budget from expensive/low-quality to efficient/high-quality channels.' },
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
