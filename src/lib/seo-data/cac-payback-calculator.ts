import type { CalculatorSeoData } from './types';
const seoData = {
  breadcrumbs: [{ label: 'Calculators' }, { label: 'CAC Payback Calculator' }],
  tableOfContents: [
    { id: 'how-to-calculate', label: 'How to Calculate CAC Payback' },
    { id: 'formula', label: 'Gross Margin Adjusted CAC Payback Formula' },
    { id: 'worked-examples', label: 'Worked SaaS & Subscription Examples' },
    { id: 'benchmarks', label: '2026 CAC Payback Period Benchmarks by Segment' },
    { id: 'deep-dive', label: 'Deep Dive: Why Capital Efficiency Dictates Runway' },
    { id: 'frequently-asked-questions', label: 'FAQs' },
    { id: 'related-calculators', label: 'Related Calculators' },
  ],
  howToSteps: [
    'Enter your Customer Acquisition Cost (CAC) ($)—total sales and marketing spend divided by the number of new customers acquired.',
    'Enter your Average Monthly Revenue Per User (ARPU / ARPA) ($) from a new customer.',
    'Enter your Gross Margin (%)—the percentage of subscription revenue retained after hosting, support, and COGS (typically 70%–85% for SaaS).',
    'Click "Calculate Payback" to compute your Gross-Margin Adjusted CAC Payback Period in months and years, plus monthly gross profit per customer.',
  ],
  formula: 'Monthly Gross Profit Per Customer = Monthly ARPU × (Gross Margin % ÷ 100)\nCAC Payback Period (Months) = Customer Acquisition Cost (CAC) ÷ Monthly Gross Profit Per Customer\nCAC Payback Period (Years) = CAC Payback Period (Months) ÷ 12',
  formulaDescription: 'The CAC Payback Period measures the exact number of months required for a new customer to generate enough gross profit to pay back the sales and marketing cost spent to acquire them. Crucially, rigorous financial modeling always adjusts monthly revenue by Gross Margin (%) because COGS, cloud hosting, customer onboarding, and payment processing fees cannot be used to repay acquisition spend.',
  workedExamples: [
    {
      title: 'Mid-Market B2B SaaS ($1,200 CAC, $100 ARPU, 80% Gross Margin)',
      description: 'A B2B software company spends $1,200 in fully loaded sales and marketing costs to acquire a customer paying $100/month ($1,200 ACV) with an 80% SaaS gross margin. Monthly gross profit per customer = $100 × 80% = $80/month. CAC Payback Period = $1,200 ÷ $80 = 15.0 months (1.25 years). After month 15, the $80/month gross profit contributes directly to operating profit and R&D.',
    },
    {
      title: 'PLG Self-Serve SaaS ($270 CAC, $45 ARPU, 85% Gross Margin)',
      description: 'A product-led growth (PLG) design tool acquires self-serve users via content and paid search at a $270 CAC. Users pay $45/month at an 85% gross margin ($38.25/month gross profit). CAC Payback = $270 ÷ $38.25 = 7.1 months. Because cash is recovered in just over half a year, the company can recycle capital into marketing almost twice per year.',
    },
    {
      title: 'Enterprise Field Sales ($36,000 CAC, $2,500 Monthly ARPA, 75% Gross Margin)',
      description: 'An enterprise data platform spends $36,000 in AE salaries, SE commissions, and field events per closed logo. Each enterprise customer pays $30,000/year ($2,500/month) with a 75% gross margin ($1,875/month gross profit). CAC Payback = $36,000 ÷ $1,875 = 19.2 months. If customers pay annually upfront ($30,000 cash on Day 1), cash flow payback is immediate even though GAAP gross-margin payback is 19.2 months.',
    },
  ],
  benchmarkTables: [
    {
      title: '2026 B2B SaaS CAC Payback Period Benchmarks by Customer Segment',
      description: 'Venture capital and private equity benchmarks for gross-margin adjusted CAC payback across customer segments.',
      headers: ['Customer Segment', 'Typical ACV Range', 'Elite (Top Quartile)', 'Healthy (Median)', 'Warning Zone (Capital Intensive)'],
      rows: [
        ['B2C / Prosumer Subscription', '$100 – $500 / yr', '< 4 months', '4 – 8 months', '> 10 months'],
        ['SMB Self-Serve / PLG SaaS', '$1,000 – $5,000 / yr', '5 – 9 months', '9 – 14 months', '> 16 months'],
        ['Mid-Market Inside Sales', '$10,000 – $50,000 / yr', '10 – 14 months', '14 – 18 months', '> 22 months'],
        ['Enterprise Field Sales', '$50,000 – $250,000+ / yr', '14 – 18 months', '18 – 24 months', '> 28 months'],
      ],
    },
  ],
  deepDiveSections: [
    {
      id: 'deep-dive',
      title: 'GAAP Gross-Margin Payback vs. Upfront Cash Payback',
      paragraphs: [
        'Why do SaaS CFOs obsess over CAC Payback Period even more than LTV:CAC? Because LTV relies on multi-year churn assumptions that are impossible to prove early on, whereas CAC Payback is a hard working-capital metric that dictates how fast your startup burns cash when scaling sales and marketing.',
        'One of the most powerful levers to bridge a 15-to-18 month CAC Payback Period without draining your bank account is incentivizing annual upfront billing. When a customer pays an annual contract on Day 1, your cash payback period drops near zero—meaning customer prepayments fund your next cohort of sales and marketing hires.',
      ],
      highlights: [
        'Always use Fully Burdened CAC: Include paid media, marketing salaries, sales base + commissions, SDRs, rev-ops tools, and agency retainers.',
        'Account for Time-to-Value & Ramp: For enterprise sales with a 6-month sales cycle, match current-quarter new logos against prior-quarter S&M spend.',
        'Expansion Accelerates Payback: In high-NRR businesses, seat expansion in months 3–9 shortens effective cohort payback by 20% to 35%.',
      ],
    },
  ],
  faqs: [
    {
      question: 'What is a good CAC payback period for a SaaS company?',
      answer: 'For B2B SaaS overall, 12 months or less is considered strong, and under 9 months is elite. However, acceptable benchmarks scale with customer size: SMB products need 6–12 month paybacks (due to higher churn), while enterprise software with low churn can sustainably operate at 18–22 month paybacks.',
    },
    {
      question: 'Why must CAC payback be adjusted for gross margin?',
      answer: 'If a customer pays $100/month but it costs you $25/month in AWS servers, third-party APIs, and customer support (75% gross margin), only $75/month is actually available to pay back the acquisition cost. Ignoring gross margin artificially makes your payback period look 25% shorter than reality.',
    },
    {
      question: 'How does CAC Payback relate to the LTV:CAC ratio?',
      answer: 'LTV:CAC measures total lifetime profitability (targeting >= 3.0x), while CAC Payback measures capital velocity and risk (how many months your cash is locked up before breaking even). A company with a 36-month CAC payback might still have a 3x LTV:CAC if customers stay 9 years, but it will require massive venture capital to fund the 3-year cash trough.',
    },
    {
      question: 'How can a business reduce its CAC payback period?',
      answer: 'You can shorten CAC payback via four levers: (1) Lowering CAC by improving funnel conversion rates and organic/PLG acquisition; (2) Increasing initial ARPU through value-based packaging or minimum seat tiers; (3) Improving gross margin by optimizing cloud infrastructure and onboarding costs; and (4) Driving early seat/usage expansion in the first 90 days.',
    },
  ],
  relatedTools: [
    { slug: 'customer-acquisition-cost-calculator', title: 'Customer Acquisition Cost (CAC) Calculator', description: 'Compute blended and paid CAC from marketing and sales spend', icon: 'Target' },
    { slug: 'customer-lifetime-value-calculator', title: 'Customer Lifetime Value (LTV) Calculator', description: 'Calculate LTV and LTV:CAC ratio for subscription cohorts', icon: 'Users' },
    { slug: 'mrr-calculator', title: 'MRR Calculator', description: 'Track Monthly Recurring Revenue and Annual Run Rate (ARR)', icon: 'TrendingUp' },
    { slug: 'net-revenue-retention-calculator', title: 'Net Revenue Retention (NRR) Calculator', description: 'Model expansion, contraction, and churn across cohorts', icon: 'Activity' },
    { slug: 'burn-rate-calculator', title: 'Burn Rate & Runway Calculator', description: 'Calculate monthly cash burn and startup runway', icon: 'Flame' },
    { slug: 'roas-calculator', title: 'ROAS Calculator', description: 'Measure return on ad spend and break-even ad efficiency', icon: 'DollarSign' },
  ],
} satisfies CalculatorSeoData;

export default seoData;