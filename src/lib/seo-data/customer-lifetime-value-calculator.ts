const seoData = {
  breadcrumbs: [{ label: 'Calculators' }, { label: 'CLV Calculator' }],
  tableOfContents: [
    { id: 'how-to-calculate', label: 'How to Calculate' },
    { id: 'formula', label: 'Formula' },
    { id: 'worked-examples', label: 'Worked Examples' },
    { id: 'frequently-asked-questions', label: 'FAQs' },
    { id: 'related-calculators', label: 'Related Calculators' },
  ],
  howToSteps: [
    'Enter monthly ARPU.',
    'Enter gross margin (%).',
    'Enter monthly churn rate (%).',
    'Click Calculate to see CLV.',
  ],
  formula: 'CLV = (ARPU x Gross Margin) / Monthly Churn\nAvg Lifetime = 1 / Churn Rate (months)\nLTV:CAC target > 3:1 for SaaS\nTrack by cohort and segment.',
  formulaDescription: 'CLV = (ARPU × gross margin) / monthly churn. Measures total profit per customer over lifetime. Target LTV:CAC >3:1 (SaaS). Improve CLV by: raise ARPU, reduce churn, increase gross margin. Even 1% churn reduction can increase CLV 20%+.',
  workedExamples: [
    { title: 'SaaS Standard', description: '$100 ARPU, 80% margin, 3% churn. CLV = ($100 × 0.80) / 0.03 = $2,667. Lifetime = 33 months.' },
    { title: 'Enterprise SaaS', description: '$5,000 ARPU, 85% margin, 1% churn. CLV = $425,000. Lifetime = 100 months. Long enterprise contracts.' },
    { title: 'B2C Subscription', description: '$15 ARPU, 70% margin, 8% churn. CLV = $131. Lifetime = 12.5 months. High churn reduces CLV.' },
    { title: 'E-commerce (repeat)', description: '$50 avg order, 40% margin, 2 orders/year, 20% annual churn. Annual value = $40. 5-year CLV = $200 (simple model).' },
    { title: 'Low Churn Impact', description: 'Same $100 ARPU, 80% margin, but 1% churn. CLV = $8,000 (3x higher than 3% churn). Churn reduction is powerful.' },
  ],
  faqs: [
    { question: 'What is CLV?', answer: 'Customer Lifetime Value = (ARPU × gross margin) / monthly churn. Measures total profit per customer over their lifetime. Target LTV:CAC >3:1 (SaaS). Improve by: raise ARPU (upsell), reduce churn (better product), increase gross margin. Even 1% churn reduction can increase CLV 20%+. See our CAC and CAC Payback Calculators.' },
    { question: 'What is a good CLV?', answer: 'Depends on CAC. Target: CLV >3x CAC (3:1 LTV:CAC ratio). SaaS: $2,000-$10,000 (SMB), $50,000-$500,000 (enterprise). E-commerce: $100-$500. Mobile app: $5-$50. Track LTV:CAC ratio, not absolute CLV. Above 5:1 = under-investing in growth. Below 1:1 = losing money per customer.' },
    { question: 'How do you calculate CLV?', answer: 'Common methods: (1) Simple: ARPU × gross margin × avg lifetime months. (2) Churn-adjusted: (ARPU × gross margin) / monthly churn. (3) Predictive: uses cohort analysis, retention curves, expansion revenue. (4) Historic: sum of all revenue from a cohort. Churn-adjusted is most common for SaaS. Use gross margin (not revenue) for profitability CLV.' },
    { question: 'CLV vs LTV?', answer: 'Same thing — different abbreviations. CLV = Customer Lifetime Value. LTV = Lifetime Value. Both = total profit per customer over lifetime. Some use LTV for revenue (not profit) and CLV for profit (after COGS). Always clarify: revenue LTV or gross margin LTV? For unit economics, use gross margin LTV (profit, not revenue).' },
    { question: 'How do you improve CLV?', answer: 'Strategies: (1) Reduce churn (most impactful — even 1% reduction = 20%+ CLV increase), (2) Increase ARPU (upsell, cross-sell, price increase), (3) Improve gross margin (reduce COGS), (4) Expansion revenue (add seats, features), (5) Better onboarding (faster time-to-value = lower early churn), (6) Customer success (proactive retention). See our Customer Retention Calculator.' },
    { question: 'What is NRR vs CLV?', answer: 'NRR (Net Revenue Retention) = % of recurring revenue retained from existing cohort (including expansion, minus churn). SaaS benchmark: >110%. CLV = total lifetime value per customer. NRR is a retention metric (period); CLV is a lifetime metric. High NRR (>100%) = existing customers grow over time, boosting CLV. See our Customer Retention Calculator.' },
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
