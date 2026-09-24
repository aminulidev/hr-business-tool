const seoData = {
  breadcrumbs: [{ label: 'Calculators' }, { label: 'CAC Calculator' }],
  tableOfContents: [
    { id: 'how-to-calculate', label: 'How to Calculate' },
    { id: 'formula', label: 'Formula' },
    { id: 'worked-examples', label: 'Worked Examples' },
    { id: 'frequently-asked-questions', label: 'FAQs' },
    { id: 'related-calculators', label: 'Related Calculators' },
  ],
  howToSteps: [
    'Enter marketing spend.',
    'Enter sales spend (salaries, tools).',
    'Enter new customers acquired.',
    'Click Calculate to see CAC.',
  ],
  formula: 'CAC = (Marketing + Sales Spend) / New Customers\nIncludes ALL acquisition costs.\nSaaS target: CAC payback <12 months, LTV:CAC >3:1',
  formulaDescription: 'CAC = (marketing + sales spend) / new customers. Includes ALL costs: ads, content, sales salaries, tools, events. SaaS benchmark: CAC payback <12 months, LTV:CAC >3:1. Track blended CAC (all channels) and paid CAC.',
  workedExamples: [
    { title: 'SaaS Company', description: '$50k marketing + $40k sales / 100 customers. CAC = $900. If ARPU $100/mo × 80% margin = $80/mo. Payback = 11.25 months. Healthy.' },
    { title: 'Enterprise SaaS', description: '$200k marketing + $300k sales / 20 customers. CAC = $25,000. If ARPU $5k/mo × 80% = $4k/mo. Payback = 6.25 months. Good for enterprise.' },
    { title: 'B2C App', description: '$30k marketing + $10k sales / 1000 customers. CAC = $40. If ARPU $10/mo × 70% = $7/mo. Payback = 5.7 months. Healthy.' },
    { title: 'E-commerce', description: '$50k marketing / 500 customers. CAC = $100. If avg order $150 × 30% margin = $45. Payback = 2.2 months. Need repeat purchase for LTV.' },
    { title: 'High CAC Problem', description: '$100k / 50 customers = $2,000 CAC. If LTV only $1,500 = LTV:CAC 0.75:1. Losing money. Reduce CAC or increase LTV.' },
  ],
  faqs: [
    { question: 'What is CAC?', answer: 'Customer Acquisition Cost = (marketing + sales spend) / new customers acquired. Includes ALL costs to acquire: ads, content, SEO, events, sales salaries, commissions, CRM tools. SaaS benchmark: CAC payback <12 months, LTV:CAC >3:1. Track blended (all channels) and paid (paid media only). See our CAC Payback Calculator.' },
    { question: 'What is a good CAC?', answer: 'Depends on LTV. Target: LTV:CAC >3:1 (each customer generates 3x their acquisition cost). SaaS: $200-$2,000 (SMB), $5,000-$50,000 (enterprise). E-commerce: $20-$100. Mobile app: $1-$10. Below industry = efficient. Above = may need to optimize channels or increase pricing. See our CLV Calculator.' },
    { question: 'CAC vs CPA?', answer: 'CAC = (all sales + marketing) / customers (includes sales team). CPA = ad spend / customers from paid channel (paid only, no sales team). CAC is always ≥ CPA. Example: $1,000 CPA (paid) + $500 sales cost = $1,500 CAC. Use CPA for paid media optimization, CAC for overall business economics. See our CPA Calculator.' },
    { question: 'What is blended vs paid CAC?', answer: 'Blended CAC = (all sales + marketing) / all new customers (includes organic, referrals, free). Paid CAC = paid media spend / customers from paid. Paid CAC is always higher. Example: blended $500 (includes organic), paid $1,500 (paid only). Track both — blended for overall economics, paid for scaling decisions.' },
    { question: 'How do you reduce CAC?', answer: 'Strategies: (1) Improve conversion rate (more customers per lead), (2) Cheaper lead channels (content, SEO, referrals), (3) Higher ARPU (faster payback), (4) Better sales efficiency (more deals per rep), (5) Reduce churn (longer LTV = more room for CAC), (6) Expansion revenue (upsell to existing). Best: reduce CAC AND increase LTV simultaneously.' },
    { question: 'What is CAC payback period?', answer: 'Payback = CAC / (monthly ARPU × gross margin). Months to recover acquisition cost. SaaS target: <12 months. Below 6 = excellent. Above 24 = need more capital. Example: $900 CAC / ($100 × 80%) = 11.25 months. Shorter payback = faster growth with less capital. See our CAC Payback Calculator.' },
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
