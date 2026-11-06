import type { CalculatorSeoData } from './types';
const seoData = {
  breadcrumbs: [{ label: 'Calculators' }, { label: 'Churn Rate Calculator' }],
  tableOfContents: [
    { id: 'how-to-calculate', label: 'How to Calculate' },
    { id: 'formula', label: 'Formula' },
    { id: 'industry-benchmarks', label: '2026 SaaS & Subscription Churn Benchmarks' },
    { id: 'deep-dive-guide', label: 'Logo Churn vs. Revenue Churn (GRR & NRR) Guide' },
    { id: 'worked-examples', label: 'Worked Examples' },
    { id: 'frequently-asked-questions', label: 'FAQs' },
    { id: 'related-calculators', label: 'Related Calculators' },
  ],
  howToSteps: [
    'Enter your total Customers at the Start of the period (month, quarter, or year).',
    'Enter the number of Customers Lost (cancelled or failed to renew) during that same period.',
    'Enter your Starting Monthly Recurring Revenue (MRR) and Churned MRR lost from cancellations and downgrades.',
    'Review both your Customer Logo Churn Rate, Gross Revenue Churn Rate, and Retention Rates immediately.',
  ],
  formula: 'Customer (Logo) Churn Rate (%) = (Customers Lost ÷ Customers at Start of Period) × 100\nGross Revenue Churn Rate (%) = (Churned MRR ÷ Starting MRR) × 100\nAnnualized Churn Rate = (1 − (1 − Monthly Churn Rate)^12) × 100',
  formulaDescription: 'Track both Customer Logo Churn (the percentage of accounts that cancel) and Revenue Churn (the percentage of Monthly Recurring Revenue lost). Separating logo churn from revenue churn reveals whether you are losing small low-tier accounts or high-value enterprise contracts.',
  benchmarkTables: [
    {
      title: '2026 Monthly & Annual Churn Rate Benchmarks by Business Model',
      description: 'Industry benchmarks for monthly logo churn, compound annual churn, and target Gross Revenue Retention (GRR).',
      headers: ['Business Model / Segment', 'Good Monthly Logo Churn', 'Compound Annual Churn', 'Target Gross Retention (GRR)', 'Target Net Retention (NRR)'],
      rows: [
        ['Enterprise B2B SaaS ($50k+ ACV)', '0.4% – 0.8% / mo', '5% – 9% / yr', '90% – 95%+', '115% – 130%+'],
        ['Mid-Market B2B SaaS ($10k–$50k ACV)', '0.8% – 1.5% / mo', '9% – 16% / yr', '85% – 90%', '105% – 115%'],
        ['SMB B2B SaaS / Prosumer ($50–$500/mo)', '2.5% – 4.5% / mo', '26% – 42% / yr', '70% – 80%', '90% – 102%'],
        ['B2C Digital Subscriptions / Apps', '4.5% – 8.0% / mo', '42% – 63% / yr', '45% – 65%', '55% – 75%'],
        ['Subscription Box / DTC E-Commerce', '6.0% – 10.5% / mo', '52% – 73% / yr', '40% – 55%', '50% – 65%'],
      ],
    },
    {
      title: 'Monthly to Compound Annual Churn Conversion Table',
      description: 'Why multiplying monthly churn by 12 is inaccurate—and what your true compound annual attrition looks like.',
      headers: ['Monthly Churn Rate', 'Simple Multiply (× 12)', 'True Compound Annual Churn', 'Remaining Cohort After 12 Months', 'Implied Avg Lifespan'],
      rows: [
        ['1.0% / month', '12.0%', '11.36% / year', '88.64% retained', '100.0 months (8.3 yrs)'],
        ['2.0% / month', '24.0%', '21.53% / year', '78.47% retained', '50.0 months (4.2 yrs)'],
        ['3.0% / month', '36.0%', '30.62% / year', '69.38% retained', '33.3 months (2.8 yrs)'],
        ['5.0% / month', '60.0%', '45.96% / year', '54.04% retained', '20.0 months (1.7 yrs)'],
        ['8.0% / month', '96.0%', '63.23% / year', '36.77% retained', '12.5 months (1.0 yr)'],
        ['10.0% / month', '120.0% (Impossible)', '71.76% / year', '28.24% retained', '10.0 months'],
      ],
    },
  ],
  deepDiveSections: [
    {
      title: 'Logo Churn vs. Revenue Churn: Which One Matters More?',
      paragraphs: [
        'Every subscription business with tiered pricing experiences a divergence between **Customer (Logo) Churn** and **Revenue (MRR) Churn**. Suppose your SaaS company starts the month with 500 customers and $100,000 in MRR (an average of $200/customer). During the month, 25 customers on your $50/month starter plan cancel ($1,250 lost MRR), while zero enterprise customers cancel.',
        'Your **Logo Churn is 5.0%** (25 ÷ 500), which looks high on paper, but your **Gross Revenue Churn is only 1.25%** ($1,250 ÷ $100,000). Conversely, if revenue churn is higher than logo churn, it is an urgent warning sign that your largest, highest-paying accounts are leaving.',
      ],
      bullets: [
        'Never Include New Customers in the Denominator: Only customers who existed at the start of the period should be in the denominator. Including new signups acquired mid-month artificially hides churn during high-growth months.',
        'Involuntary (Delinquent) Churn Recovery: Between 20% and 40% of B2C and SMB SaaS churn is involuntary—caused by expired credit cards or bank declines. Implementing automated card account updaters and smart dunning emails typically recovers 35% to 50% of failed payments.',
      ],
    },
  ],
  workedExamples: [
    { title: 'Healthy Mid-Market B2B SaaS', description: '500 starting customers, 6 lost customers = 1.2% monthly logo churn (98.8% retention). $100,000 starting MRR, $900 churned MRR = 0.9% monthly gross revenue churn (99.1% revenue retention).' },
    { title: 'Tiered SaaS With Low-End Churn', description: '500 starting customers, 25 starter-plan cancellations = 5.0% logo churn. However, on $100,000 starting MRR, those 25 accounts only represented $2,000 in MRR = 2.0% revenue churn.' },
    { title: 'Net Negative Revenue Churn (Expansion > Churn)', description: '$100,000 starting MRR, $2,000 churned MRR (2.0% gross churn), plus $4,500 in upsells/seat expansion from existing customers. Net MRR Churn = -2.5% (102.5% monthly Net Revenue Retention).' },
  ],
  faqs: [
    { question: 'How do you calculate monthly churn rate?', answer: 'Divide the number of customers (or MRR) lost during the month by the total number of customers (or MRR) you had on the very first day of the month, then multiply by 100. Do not include new customers acquired during the month in your starting count.' },
    { question: 'How do you convert monthly churn rate to annual churn rate?', answer: 'Use the compound retention formula: Annual Churn = 1 − (1 − Monthly Churn Rate)^12. For example, a 3% monthly churn rate means you retain 97% (0.97) of your cohort each month. Over 12 months, 0.97^12 = 0.6938 (69.38% retained), which equals a 30.62% annual churn rate.' },
    { question: 'What is a good monthly churn rate for SaaS?', answer: 'For Enterprise B2B SaaS, a good monthly gross revenue churn rate is 0.5% to 1.0% (under 10% annually). For Mid-Market SaaS, 1.0% to 1.5% per month is healthy. For SMB SaaS selling to small businesses, 2.5% to 4.5% per month is normal due to small business mortality.' },
    { question: 'What is negative revenue churn?', answer: 'Net negative revenue churn occurs when the expansion revenue (upsells, cross-sells, seat additions, and usage growth) generated from your existing customer cohort exceeds the revenue lost from cancellations and downgrades in that same cohort—resulting in a Net Revenue Retention (NRR) rate above 100%.' },
  ],
  relatedTools: [
    { slug: 'customer-lifetime-value-calculator', title: 'CLV Calculator', description: 'Customer lifetime value from churn', icon: 'TrendingUp' },
    { slug: 'customer-acquisition-cost-calculator', title: 'CAC Calculator', description: 'Customer acquisition cost', icon: 'DollarSign' },
    { slug: 'employee-turnover-calculator', title: 'Employee Turnover Calculator', description: 'Workforce attrition & retention', icon: 'Users' },
    { slug: 'burn-rate-calculator', title: 'Burn Rate Calculator', description: 'Startup cash burn & runway', icon: 'Clock' },
    { slug: 'profit-margin-calculator', title: 'Profit Margin Calculator', description: 'Gross & net margin analysis', icon: 'Percent' },
  ],
} satisfies CalculatorSeoData;
export default seoData;