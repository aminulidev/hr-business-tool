import type { CalculatorSeoData } from './types';
const seoData = {
  breadcrumbs: [{ label: 'Calculators' }, { label: 'MRR Calculator' }],
  tableOfContents: [
    { id: 'how-to-calculate', label: 'How to Calculate MRR' },
    { id: 'formula', label: 'MRR, Net New MRR & ARR Formulas' },
    { id: 'worked-examples', label: 'Worked SaaS MRR Scenarios' },
    { id: 'benchmarks', label: '2026 SaaS MRR Growth & Quick Ratio Benchmarks' },
    { id: 'deep-dive', label: 'Deep Dive: GAAP MRR Recognition Rules' },
    { id: 'frequently-asked-questions', label: 'FAQs' },
    { id: 'related-calculators', label: 'Related Calculators' },
  ],
  howToSteps: [
    'Enter your total number of active paying customers or subscriptions at the end of the month.',
    'Enter your Average Revenue Per User (ARPU) or Average Revenue Per Account (ARPA) on a normalized monthly basis.',
    'Click "Calculate" to compute Monthly Recurring Revenue (MRR) and Annualized Run Rate (ARR = MRR × 12).',
    'Use the scenario comparison tool to model how increasing ARPU via tier upgrades or expanding your subscriber base impacts ARR.',
  ],
  formula: 'Basic MRR = Active Paying Customers × Average Monthly Revenue Per User (ARPU)\nAnnual Recurring Revenue (ARR) = MRR × 12\n\nNet New MRR Waterfall Formula:\nNet New MRR = New Business MRR + Expansion MRR + Reactivation MRR - Contraction MRR - Churned MRR\nEnding MRR = Beginning MRR + Net New MRR\n\nSaaS Quick Ratio = (New Business MRR + Expansion MRR) ÷ (Churned MRR + Contraction MRR)',
  formulaDescription: 'Monthly Recurring Revenue (MRR) is the foundational operating metric for subscription, SaaS, and recurring-contract businesses. It normalizes all active recurring customer contracts—whether billed monthly, quarterly, or annually—into a single standardized monthly revenue figure. Investors, lenders, and acquirers track your Net New MRR waterfall (New, Expansion, Contraction, and Churn) to evaluate growth efficiency and revenue durability.',
  workedExamples: [
    {
      title: 'B2B SaaS Startup Crossing $50k MRR ($600k ARR)',
      description: 'A workflow automation SaaS has 200 active paying companies paying an average of $250/month (ARPU). Monthly Recurring Revenue = 200 × $250 = $50,000/month. Annual Recurring Revenue (ARR) = $50,000 × 12 = $600,000/year. If the startup adds 18 new customers ($4,500 New MRR), upgrades 10 existing accounts by $100/mo ($1,000 Expansion MRR), and loses 4 customers ($1,000 Churned MRR), Net New MRR is +$4,500 (+9.0% MoM growth), bringing Ending MRR to $54,500.',
    },
    {
      title: 'Normalizing Annual & Quarterly Contracts into MRR',
      description: 'An enterprise cybersecurity vendor closes a 1-year contract worth $36,000 upfront plus $4,000 for one-time onboarding implementation. Under SaaS MRR accounting rules, one-time onboarding fees ($4,000) are excluded from MRR, and the $36,000 annual subscription is divided by 12 months = $3,000/month added to MRR.',
    },
    {
      title: 'PLG Prosumer App Scaling Through Pricing Tiers',
      description: 'A developer tool has 1,200 paying users at a $29/month Starter plan ($34,800 MRR) and 300 Team accounts at $99/month ($29,700 MRR). Combined MRR = $64,500 across 1,500 total customers, yielding a blended ARPU of $43.00/month and $774,000 ARR.',
    },
  ],
  benchmarkTables: [
    {
      title: '2026 B2B SaaS Monthly Growth & Quick Ratio Benchmarks by Stage',
      description: 'Top-quartile and median monthly MRR growth rates, SaaS Quick Ratios, and expansion contribution targets across ARR stages.',
      headers: ['Company Stage (ARR)', 'Median MoM MRR Growth', 'Top-Quartile YoY ARR Growth', 'Target SaaS Quick Ratio', 'Expansion % of New MRR'],
      rows: [
        ['Pre-Seed / Seed (<$1M ARR)', '8% – 15% MoM', '120% – 200%+ YoY', '> 4.0x', '10% – 20%'],
        ['Series A ($1M – $5M ARR)', '5% – 9% MoM', '80% – 120% YoY', '> 3.5x', '20% – 30%'],
        ['Series B ($5M – $20M ARR)', '3.5% – 6% MoM', '50% – 80% YoY', '> 3.0x', '30% – 45%'],
        ['Scale-Up ($20M – $100M ARR)', '2% – 3.5% MoM', '30% – 50% YoY', '> 2.5x', '40% – 60%'],
      ],
    },
  ],
  deepDiveSections: [
    {
      id: 'deep-dive',
      title: 'What Counts (and Never Counts) Toward True SaaS MRR',
      paragraphs: [
        'During venture capital due diligence or M&A financial audits, inflated MRR figures are the #1 cause of valuation re-trades. True MRR strictly measures contractually recurring subscription revenue normalized to a 30-day/monthly period. One-time setup fees, professional services, non-recurring consulting, and variable pay-as-you-go overages that are not contractually committed should be tracked separately as non-recurring revenue.',
        'Similarly, annual or multi-year upfront cash collections belong in Deferred Revenue on your balance sheet and Cash Bookings in your cash flow statement, but only 1/12th of an annual contract value (ACV) counts toward each month\'s MRR. Free trial users and heavily discounted pilot periods should only enter MRR once they convert to a paid recurring subscription.',
      ],
      highlights: [
        'Include in MRR: Monthly subscriptions, 1/12th of annual contracts (ACV), recurring seat/usage tiers, and active contractual add-ons.',
        'Exclude from MRR: Setup/onboarding fees, one-time consulting, hardware sales, credit card processing pass-throughs, and uncollected bad debt.',
        'Track the SaaS Quick Ratio: Divide (New MRR + Expansion MRR) by (Churned MRR + Contraction MRR). A ratio above 4.0x signals highly efficient compounding growth.',
      ],
    },
  ],
  faqs: [
    {
      question: 'What is the difference between MRR and ARR?',
      answer: 'MRR (Monthly Recurring Revenue) measures normalized recurring subscription revenue for a single month, while ARR (Annual Recurring Revenue) is the annualized run rate (MRR × 12). B2C and SMB SaaS companies with monthly billing primarily track MRR, whereas mid-market and enterprise B2B SaaS companies using annual contracts typically report ARR.',
    },
    {
      question: 'How do annual subscriptions get counted in MRR?',
      answer: 'An annual subscription is divided by 12 to determine its monthly MRR contribution. Even if a customer pays $12,000 upfront in January for a 12-month contract, your MRR increases by $1,000 per month from January through December, not $12,000 in January and $0 thereafter.',
    },
    {
      question: 'What is Net New MRR and what are its components?',
      answer: 'Net New MRR measures the net change in MRR from one month to the next. It equals New Business MRR (from brand-new customers) + Expansion MRR (upgrades, cross-sells, and additional seats from existing customers) + Reactivation MRR (returning churned customers) minus Contraction MRR (downgrades) and Churned MRR (cancellations).',
    },
    {
      question: 'Should usage-based or consumption pricing be included in MRR?',
      answer: 'If customers have a committed monthly minimum spend, that base commitment is always included in MRR. For pure usage-based SaaS (like Snowflake or Twilio), companies typically report an "Annualized Revenue Run Rate" based on trailing 30-day or 90-day predictable consumption cohorts while disclosing the split between committed subscriptions and variable consumption.',
    },
  ],
  relatedTools: [
    { slug: 'net-revenue-retention-calculator', title: 'Net Revenue Retention (NRR) Calculator', description: 'Measure cohort expansion, contraction, and churn retention', icon: 'TrendingUp' },
    { slug: 'customer-lifetime-value-calculator', title: 'Customer Lifetime Value (LTV) Calculator', description: 'Calculate LTV:CAC ratio and gross-margin adjusted customer value', icon: 'Users' },
    { slug: 'customer-acquisition-cost-calculator', title: 'CAC Calculator', description: 'Compute fully burdened customer acquisition cost across channels', icon: 'Target' },
    { slug: 'cac-payback-calculator', title: 'CAC Payback Period Calculator', description: 'Calculate months required to recover acquisition spend', icon: 'Clock' },
    { slug: 'churn-rate-calculator', title: 'Churn Rate Calculator', description: 'Track monthly and annual customer and revenue churn rates', icon: 'Activity' },
    { slug: 'burn-rate-calculator', title: 'Burn Rate & Runway Calculator', description: 'Model gross burn, net burn, and startup cash runway', icon: 'Flame' },
  ],
} satisfies CalculatorSeoData;

export default seoData;