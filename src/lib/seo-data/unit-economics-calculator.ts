const seoData = {
  breadcrumbs: [{ label: 'Calculators' }, { label: 'Unit Economics Calculator' }],
  tableOfContents: [
    { id: 'how-to-calculate', label: 'How to Calculate' },
    { id: 'formula', label: 'Formula' },
    { id: 'worked-examples', label: 'Worked Examples' },
    { id: 'frequently-asked-questions', label: 'FAQs' },
    { id: 'related-calculators', label: 'Related Calculators' },
  ],
  howToSteps: [
    'Enter Customer Acquisition Cost (CAC).',
    'Enter monthly ARPU (average revenue per user).',
    'Enter gross margin %.',
    'Enter monthly churn %.',
    'Click Calculate to see LTV, LTV:CAC ratio, and payback period.',
  ],
  formula: 'LTV = (ARPU x Gross Margin) / Monthly Churn\nLTV:CAC = LTV / CAC (target 3:1)\nPayback = CAC / (ARPU x Gross Margin) (target <12 months)\nContribution Margin = ARPU x Gross Margin',
  formulaDescription: 'Unit economics: LTV = (ARPU × gross margin) / monthly churn. LTV:CAC target = 3:1 (SaaS benchmark). Below 1:1 = losing money per customer. Payback period target <12 months. Critical for SaaS, subscription, marketplace businesses.',
  workedExamples: [
    { title: 'Healthy SaaS', description: 'CAC $500, ARPU $100/mo, 80% margin, 3% churn. LTV = ($100 × 0.80) / 0.03 = $2,667. LTV:CAC = 5.3:1. Payback = 6.25 months. Excellent.' },
    { title: 'At Risk', description: 'CAC $800, ARPU $50/mo, 70% margin, 5% churn. LTV = $700. LTV:CAC = 0.88:1. Losing money. Payback = 22.9 months. Too high.' },
    { title: 'Break-Even', description: 'CAC $400, ARPU $50/mo, 80% margin, 5% churn. LTV = $800. LTV:CAC = 2:1. Marginal. Payback = 10 months.' },
    { title: 'Strong Unit Economics', description: 'CAC $200, ARPU $200/mo, 85% margin, 2% churn. LTV = $8,500. LTV:CAC = 42.5:1. Payback = 1.2 months. Outstanding.' },
    { title: 'B2C Subscription', description: 'CAC $50, ARPU $15/mo, 70% margin, 8% churn. LTV = $131. LTV:CAC = 2.6:1. Decent. Payback = 4.8 months.' },
  ],
  faqs: [
    { question: 'What is unit economics?', answer: 'Per-customer financial analysis: CAC (acquisition cost), LTV (lifetime value), LTV:CAC ratio, payback period. Critical for SaaS, subscription, marketplace businesses. Healthy: LTV:CAC > 3:1, payback <12 months. Below 1:1 = losing money per customer. See our ROI Calculator.' },
    { question: 'What is CAC?', answer: 'Customer Acquisition Cost = total sales + marketing spend / new customers acquired. Includes: ads, content, sales salaries, tools, commissions. Example: $100k spend / 200 customers = $500 CAC. Lower = better. Reduce by: organic growth (SEO, referrals), viral growth, sales efficiency. Track by channel.' },
    { question: 'What is LTV?', answer: 'Lifetime Value = (ARPU × gross margin) / monthly churn. Total profit per customer over their lifetime. Example: $100 ARPU × 80% margin / 3% monthly churn = $2,667 LTV. Higher = better. Increase by: raise ARPU (upsell), reduce churn (better product), increase gross margin. Use churn-adjusted LTV (not simple ARPU × months).' },
    { question: 'What is a good LTV:CAC ratio?', answer: 'Target: 3:1 (SaaS benchmark). Below 1:1 = losing money per customer (unsustainable). 1-3:1 = marginal (need scale or efficiency). 3-5:1 = healthy. Above 5:1 = under-investing in growth (could grow faster). Above 10:1 = missing market opportunity — increase CAC spend to grow faster.' },
    { question: 'What is payback period?', answer: 'Payback = CAC / (monthly ARPU × gross margin). Months to recover acquisition cost from customer profit. Example: $500 CAC / ($100 × 0.80) = 6.25 months. Target: <12 months (SaaS). Below 6 = excellent. Above 24 = need more capital to grow. Shorter payback = faster growth with less capital.' },
    { question: 'How do you improve unit economics?', answer: 'Strategies: (1) Reduce CAC (better marketing efficiency, organic growth, referrals), (2) Increase ARPU (upsell, cross-sell, pricing), (3) Reduce churn (better onboarding, product, support), (4) Increase gross margin (lower COGS, automation). Best: reduce churn — has compounding effect on LTV. Even 1% churn reduction can increase LTV 20%+.' },
  ],
  relatedTools: [
    { slug: 'roi-calculator', title: 'ROI Calculator', description: 'Return on investment', icon: 'BarChart3' },
    { slug: 'profit-margin-calculator', title: 'Profit Margin Calculator', description: 'Margin analysis', icon: 'Percent' },
    { slug: 'break-even-calculator', title: 'Break-Even Calculator', description: 'Break-even units and revenue', icon: 'Target' },
    { slug: 'gross-margin-calculator', title: 'Gross Margin Calculator', description: 'Gross profit margin', icon: 'PieChart' },
    { slug: 'cash-flow-forecast-calculator', title: 'Cash Flow Forecast', description: '12-month cash projection', icon: 'TrendingUp' },
  ],
};
export default seoData;
