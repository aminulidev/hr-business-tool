const seoData = {
  breadcrumbs: [{ label: 'Calculators' }, { label: 'CAC Payback Calculator' }],
  tableOfContents: [
    { id: 'how-to-calculate', label: 'How to Calculate' },
    { id: 'formula', label: 'Formula' },
    { id: 'worked-examples', label: 'Worked Examples' },
    { id: 'frequently-asked-questions', label: 'FAQs' },
    { id: 'related-calculators', label: 'Related Calculators' },
  ],
  howToSteps: [
    'Enter CAC (customer acquisition cost).',
    'Enter monthly ARPU.',
    'Enter gross margin (%).',
    'Click Calculate to see payback period in months.',
  ],
  formula: 'Monthly Profit per Customer = ARPU x Gross Margin\nCAC Payback = CAC / Monthly Profit\nTarget: <12 months for SaaS\nBelow 6 = excellent. Above 24 = too long.',
  formulaDescription: 'CAC payback = CAC / (monthly ARPU × gross margin). Months to recover acquisition cost. SaaS target: <12 months. Below 6 = excellent. Above 24 = need more capital. Reduce by: lower CAC, raise ARPU, improve gross margin.',
  workedExamples: [
    { title: 'Healthy SaaS', description: '$500 CAC, $100 ARPU, 80% margin. Monthly profit = $80. Payback = 6.25 months. Excellent.' },
    { title: 'Borderline', description: '$800 CAC, $50 ARPU, 70% margin. Monthly profit = $35. Payback = 22.9 months. Too long.' },
    { title: 'Enterprise', description: '$25,000 CAC, $5,000 ARPU, 85% margin. Monthly profit = $4,250. Payback = 5.9 months. Good for enterprise.' },
    { title: 'B2C App', description: '$10 CAC, $5 ARPU, 70% margin. Monthly profit = $3.50. Payback = 2.9 months. Very fast.' },
    { title: 'Needs Improvement', description: '$1,000 CAC, $30 ARPU, 60% margin. Monthly profit = $18. Payback = 55.6 months. Reduce CAC or increase ARPU.' },
  ],
  faqs: [
    { question: 'What is CAC payback?', answer: 'CAC payback = CAC / (monthly ARPU × gross margin). Months to recover customer acquisition cost. SaaS target: <12 months. Below 6 = excellent. Above 24 = too long (need more capital to grow). Critical for unit economics — if payback > runway, company runs out of cash before reaching profitability.' },
    { question: 'What is a good CAC payback?', answer: 'SaaS: <12 months (benchmark). Below 6 = excellent (fast growth with less capital). 6-12 = healthy. 12-24 = moderate (need more capital). Above 24 = problematic (burning cash faster than recovering). Enterprise: 6-12 months acceptable (larger deals, longer sales cycles). B2C: <3 months (need fast payback for volume).' },
    { question: 'How do you reduce CAC payback?', answer: 'Three levers: (1) Reduce CAC (cheaper channels, better conversion), (2) Increase ARPU (upsell, pricing), (3) Improve gross margin (reduce COGS). Each has impact: halving CAC halves payback. Doubling ARPU halves payback. Best: improve all three. Also reduce churn (longer lifetime = more months of profit). See our CAC and CLV Calculators.' },
    { question: 'CAC payback vs LTV:CAC?', answer: 'Both measure unit economics but different aspects. Payback = how fast you recover CAC (months). LTV:CAC = total return on CAC (ratio). Example: $500 CAC, $80/mo profit, 33-month lifetime. Payback = 6.25 months. LTV = $2,640 ($80 × 33). LTV:CAC = 5.3:1. Payback for cash flow; LTV:CAC for profitability. Both matter.' },
    { question: 'How does churn affect CAC payback?', answer: 'Churn reduces the months of profit you collect. If payback = 12 months but avg lifetime = 10 months (churned before payback), you\'re losing money. Formula: payback must be < avg lifetime (1 / monthly churn). Example: 5% monthly churn = 20-month lifetime. Payback must be <20 months. Higher churn = need faster payback. See our CLV Calculator.' },
    { question: 'What is the relationship between CAC payback and burn rate?', answer: 'If CAC payback > 0, company is burning cash on customer acquisition (investing for future return). Total burn from growth = (new customers × CAC) - (existing customers × monthly profit). Example: 100 new customers × $500 CAC = $50k spent. 500 existing × $80/mo = $40k recovered. Net burn from growth = $10k/month. As customer base grows, profit eventually exceeds CAC spend = breakeven.' },
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
