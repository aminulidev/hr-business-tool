import type { CalculatorSeoData } from './types';
const seoData = {
  breadcrumbs: [{ label: 'Calculators' }, { label: 'CLV Calculator' }],
  tableOfContents: [
    { id: 'how-to-calculate', label: 'How to Calculate' },
    { id: 'formula', label: 'Formula' },
    { id: 'industry-benchmarks', label: 'CLV & LTV:CAC Sensitivity Tables' },
    { id: 'deep-dive-guide', label: 'Gross Margin CLV vs. Revenue LTV Guide' },
    { id: 'worked-examples', label: 'Worked Examples' },
    { id: 'frequently-asked-questions', label: 'FAQs' },
    { id: 'related-calculators', label: 'Related Calculators' },
  ],
  howToSteps: [
    'Enter your Monthly ARPU (Average Revenue Per User / Account).',
    'Enter your Gross Margin percentage (Revenue minus direct COGS/hosting/support divided by Revenue; SaaS is typically 75–85%).',
    'Enter your Monthly Customer Churn Rate percentage (percentage of customers or MRR lost each month).',
    'Review your Gross-Margin Customer Lifetime Value (CLV), Average Customer Lifespan in months, and LTV:CAC ratio.',
  ],
  formula: 'Average Customer Lifespan (Months) = 1 ÷ Monthly Churn Rate (as decimal)\nGross-Margin CLV = (Monthly ARPU × Gross Margin %) ÷ Monthly Churn Rate\nLTV:CAC Ratio = Gross-Margin CLV ÷ Customer Acquisition Cost (CAC)',
  formulaDescription: 'Customer Lifetime Value (CLV or LTV) calculates the total gross profit a business expects to earn from an average customer before they churn. Using Gross-Margin CLV (rather than top-line revenue) ensures you account for hosting, fulfillment, and customer support costs when setting your maximum allowable Customer Acquisition Cost (CAC).',
  benchmarkTables: [
    {
      title: 'How Churn Rate Exponentially Impacts Customer Lifetime Value ($100 ARPU, 80% Gross Margin)',
      description: 'Sensitivity table showing how small reductions in monthly churn dramatically increase average customer lifespan and CLV.',
      headers: ['Monthly Churn Rate', 'Annualized Churn', 'Avg Customer Lifespan', 'Gross-Margin CLV', 'Max Allowable CAC (at 3:1 LTV:CAC)'],
      rows: [
        ['1.0% / month', '11.4% / year', '100.0 months (8.3 yrs)', '$8,000', '$2,667'],
        ['2.0% / month', '21.5% / year', '50.0 months (4.2 yrs)', '$4,000', '$1,333'],
        ['3.0% / month', '30.6% / year', '33.3 months (2.8 yrs)', '$2,667', '$889'],
        ['5.0% / month', '46.0% / year', '20.0 months (1.7 yrs)', '$1,600', '$533'],
        ['8.0% / month', '63.2% / year', '12.5 months (1.0 yr)', '$1,000', '$333'],
      ],
    },
    {
      title: 'LTV:CAC Ratio Diagnostic Matrix for SaaS & E-Commerce',
      description: 'How CFOs and growth investors interpret your Customer Lifetime Value to Customer Acquisition Cost ratio.',
      headers: ['LTV:CAC Ratio', 'Unit Economics Status', 'Strategic Recommendation'],
      rows: [
        ['Below 1.0 : 1', 'Destroying Capital', 'Freeze paid acquisition immediately; fix onboarding churn or raise pricing'],
        ['1.0 : 1 to 2.5 : 1', 'Low Margin / Inefficient', 'Optimize funnel conversion rates, cut underperforming ad channels, upsell'],
        ['3.0 : 1 to 4.5 : 1', 'Gold Standard / Optimal', 'Healthy unit economics; sustainable growth and predictable payback'],
        ['Above 5.0 : 1', 'Under-Investing in Growth', 'You are leaving market share on the table; deploy more capital into sales & marketing'],
      ],
    },
  ],
  deepDiveSections: [
    {
      title: 'Why You Must Use Gross-Margin CLV (Not Top-Line Revenue)',
      paragraphs: [
        'A common mistake in early-stage pitch decks is calculating LTV as `ARPU ÷ Churn Rate` without multiplying by **Gross Margin %**. Every dollar of revenue requires Cost of Goods Sold (COGS) — whether that is physical inventory and shipping in e-commerce (where gross margins are 40–60%) or AWS infrastructure, third-party LLM API tokens, payment processing fees, and Customer Success salaries in SaaS (where gross margins are 70–85%).',
        'If an e-commerce customer spends $500 over their lifetime at a 40% gross margin, they only generate $200 in gross profit to cover marketing and operating overhead. Spending $160 on CAC looks like a 3.1x ratio against revenue, but is actually a weak 1.25x ratio against gross profit.',
      ],
      bullets: [
        'Capping Lifespan for Early-Stage Startups: If your monthly churn is below 1% (implying a 100+ month lifespan), institutional investors typically cap CLV calculations at 36 to 60 months (3 to 5 years) to account for market and technology shifts.',
        'Net Revenue Retention (NRR) Multiplier: When existing customers expand their spend faster than they churn (NRR > 100%), cohort CLV increases substantially beyond the baseline formula.',
      ],
    },
  ],
  workedExamples: [
    { title: 'Standard SMB SaaS ($100 ARPU)', description: '$100/mo ARPU, 80% gross margin ($80/mo gross profit), 3% monthly churn. Avg Lifespan = 1 ÷ 0.03 = 33.3 months. Gross-Margin CLV = $80 ÷ 0.03 = $2,667.' },
    { title: 'Enterprise B2B Platform ($4,000 ARPU)', description: '$4,000/mo ARPU, 85% gross margin ($3,400/mo gross profit), 0.8% monthly churn. Avg Lifespan = 125 months (often capped at 60 months = $204,000 conservative CLV, or $425,000 uncapped).' },
    { title: 'Consumer Subscription App ($15 ARPU)', description: '$15/mo ARPU, 70% gross margin (after App Store 15–30% fee), 7% monthly churn. Avg Lifespan = 14.3 months. CLV = $10.50 ÷ 0.07 = $150.' },
  ],
  faqs: [
    { question: 'How do you calculate Customer Lifetime Value (CLV)?', answer: 'Multiply your Monthly Average Revenue Per User (ARPU) by your Gross Margin percentage to find your monthly gross profit per customer, then divide that figure by your monthly churn rate (expressed as a decimal). For example: ($100 ARPU × 0.80 Gross Margin) ÷ 0.04 Monthly Churn = $2,000 CLV.' },
    { question: 'Is CLV the same as LTV?', answer: 'Yes, CLV (Customer Lifetime Value) and LTV (Lifetime Value) refer to the exact same metric. In SaaS and venture capital, LTV is commonly used inside the "LTV:CAC ratio," whereas e-commerce and retail marketers frequently use CLV.' },
    { question: 'What is a good LTV:CAC ratio?', answer: 'A 3:1 LTV:CAC ratio is the universal benchmark for healthy unit economics—meaning a customer generates $3.00 in lifetime gross profit for every $1.00 spent acquiring them. A ratio below 2:1 leaves too little margin to cover R&D and G&A overhead, while a ratio above 5:1 suggests you could grow faster by investing more aggressively in marketing.' },
    { question: 'What is the fastest way to increase CLV?', answer: 'Reducing monthly churn has a nonlinear, compounding impact on CLV. Cutting monthly churn from 4% to 2% immediately doubles your Customer Lifetime Value (100% increase), whereas raising prices by 10% increases CLV by only 10% (and may slightly increase churn).' },
  ],
  relatedTools: [
    { slug: 'customer-acquisition-cost-calculator', title: 'CAC Calculator', description: 'Customer acquisition cost', icon: 'DollarSign' },
    { slug: 'churn-rate-calculator', title: 'Churn Rate Calculator', description: 'Customer & revenue churn rate', icon: 'TrendingDown' },
    { slug: 'profit-margin-calculator', title: 'Profit Margin Calculator', description: 'Gross & net margin analysis', icon: 'Percent' },
    { slug: 'burn-rate-calculator', title: 'Burn Rate Calculator', description: 'Monthly cash burn & runway', icon: 'Clock' },
    { slug: 'roi-calculator', title: 'ROI Calculator', description: 'Return on investment', icon: 'BarChart3' },
  ],
} satisfies CalculatorSeoData;
export default seoData;