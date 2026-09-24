const seoData = {
  breadcrumbs: [{ label: 'Calculators' }, { label: 'Customer Retention Calculator' }],
  tableOfContents: [
    { id: 'how-to-calculate', label: 'How to Calculate' },
    { id: 'formula', label: 'Formula' },
    { id: 'worked-examples', label: 'Worked Examples' },
    { id: 'frequently-asked-questions', label: 'FAQs' },
    { id: 'related-calculators', label: 'Related Calculators' },
  ],
  howToSteps: [
    'Enter customers at start of period.',
    'Enter customers at end of period.',
    'Enter new customers acquired during period.',
    'Click Calculate to see retention rate and churn rate.',
  ],
  formula: 'Retained = End - New Customers\nRetention Rate = Retained / Start x 100\nChurn Rate = (Start - Retained) / Start x 100\nSaaS: NRR >110%, logo retention >90%',
  formulaDescription: 'Customer retention = ((start + new - end) / start) × 100. Churn = 100 - retention. SaaS benchmarks: logo retention >90% (churn <10%), NRR >110% (expansion > churn). Track by cohort, segment, plan tier.',
  workedExamples: [
    { title: 'Healthy SaaS', description: '500 start, 480 end, 50 new. Retained = 430. Retention = 86%. Churn = 14%. Below 90% benchmark — needs improvement.' },
    { title: 'Strong Retention', description: '1000 start, 990 end, 50 new. Retained = 940. Retention = 94%. Churn = 6%. Above 90% benchmark.' },
    { title: 'High Churn', description: '200 start, 160 end, 30 new. Retained = 130. Retention = 65%. Churn = 35%. Very high — urgent action needed.' },
    { title: 'Net Growth', description: '500 start, 550 end, 80 new. Retained = 470. Retention = 94%. Churn = 6%. Plus 80 new = net +50 customers.' },
    { title: 'Enterprise', description: '100 start, 98 end, 5 new. Retained = 93. Retention = 93%. Churn = 7%. Good for enterprise (long contracts).' },
  ],
  faqs: [
    { question: 'What is customer retention rate?', answer: 'Retention = ((start + new - end) / start) × 100. Measures % of customers who stayed. Churn = 100 - retention. SaaS benchmarks: logo retention >90% (churn <10%), NRR (net revenue retention) >110% (expansion > churn). Track by: cohort, segment, plan tier, tenure. Improve: onboarding, CS, product, pricing.' },
    { question: 'What is a good customer retention rate?', answer: 'SaaS: >90% annual (churn <10%). Enterprise: >95%. SMB: >85%. B2C subscription: >70-80%. E-commerce (repeat purchase): >30-50%. Above industry = strong. Below = investigate: product fit, onboarding, customer success, pricing, competition. Even 1% retention improvement can add 20%+ to CLV. See our CLV Calculator.' },
    { question: 'Customer retention vs revenue retention?', answer: 'Customer (logo) retention = % of customers retained. Revenue retention = % of revenue retained. NRR (Net Revenue Retention) = (starting MRR + expansion - churn - contraction) / starting MRR. SaaS benchmark: NRR >110% (existing customers grow via expansion). Logo retention >90% (lose some customers but revenue grows from expansions). Track both.' },
    { question: 'What is NRR (Net Revenue Retention)?', answer: 'NRR = (starting MRR + expansion MRR - churned MRR - contraction MRR) / starting MRR × 100. SaaS benchmark: >110%. Example: $100k starting, $15k expansion, $8k churn, $2k contraction. NRR = (100+15-8-2)/100 = 105%. Above 100% = revenue grows even without new customers. Companies with >120% NRR (Snowflake, Twilio) command premium valuations.' },
    { question: 'How do you improve customer retention?', answer: 'Strategies: (1) Better onboarding (faster time-to-value = lower early churn), (2) Customer success (proactive outreach, QBRs), (3) Product improvements (based on usage data and feedback), (4) Pricing/packaging (right-tier customers), (5) Community building (users help users), (6) Loyalty programs (incentivize stay), (7) Switching costs (integrations, data lock-in). Track churn by reason — address top reasons.' },
    { question: 'What is churn rate?', answer: 'Churn rate = (customers lost / customers at start) × 100. Inverse of retention. SaaS: <10% annual (good), <5% (excellent), >20% (problematic). Monthly churn: <2% (good), <1% (excellent). Track: logo churn (customers), revenue churn (MRR), gross churn (before expansion), net churn (after expansion). Different churn types reveal different issues. See our CLV Calculator.' },
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
