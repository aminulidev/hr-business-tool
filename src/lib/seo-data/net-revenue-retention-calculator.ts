import type { CalculatorSeoData } from './types';
const seoData = {
  breadcrumbs: [{ label: 'Calculators' }, { label: 'Net Revenue Retention Calculator' }],
  tableOfContents: [
    { id: 'how-to-calculate', label: 'How to Calculate NRR' },
    { id: 'formula', label: 'NRR vs. GRR Formulas' },
    { id: 'worked-examples', label: 'Worked SaaS Cohort Examples' },
    { id: 'benchmarks', label: '2026 NRR & GRR Benchmarks by ACV Tier' },
    { id: 'deep-dive', label: 'Deep Dive: Why >100% NRR Drives Enterprise Valuation' },
    { id: 'frequently-asked-questions', label: 'FAQs' },
    { id: 'related-calculators', label: 'Related Calculators' },
  ],
  howToSteps: [
    'Enter your Starting Recurring Revenue (MRR or ARR) ($) from the existing customer cohort at the start of the period.',
    'Enter your Ending Recurring Revenue (MRR or ARR) ($) from that exact same cohort at the end of the period (including upgrades/expansion and subtracting downgrades/churn, but excluding brand-new customers acquired during the period).',
    'Click "Calculate" to compute your Net Revenue Retention (NRR / NDR) percentage and net cohort expansion or contraction.',
    'Use Scenario Compare to model how reducing churn or increasing seat expansion boosts NRR above 100%.',
  ],
  formula: 'Net Revenue Retention (NRR %) = ((Starting MRR + Expansion MRR - Contraction MRR - Churned MRR) ÷ Starting MRR) × 100%\nSimplified Cohort Formula: NRR (%) = (Ending Cohort MRR ÷ Starting Cohort MRR) × 100%\n\nGross Revenue Retention (GRR %) = ((Starting MRR - Contraction MRR - Churned MRR) ÷ Starting MRR) × 100% (Capped at 100%)',
  formulaDescription: 'Net Revenue Retention (NRR)—also known as Net Dollar Retention (NDR)—measures the percentage of recurring revenue retained from an existing cohort of customers over a specific period (typically 12 months), factoring in expansion (upsells, cross-sells, seat additions, usage growth), contraction (downgrades), and churn (cancellations). An NRR above 100% means your business grows even if you acquire zero new customers.',
  workedExamples: [
    {
      title: 'Enterprise B2B SaaS Cohort Achieving 118% NRR ("Negative Net Churn")',
      description: 'A cloud data company starts the year with $1,000,000 in ARR from 50 existing customers. Over 12 months, 3 customers churn (-$60,000), 2 customers downgrade seats (-$20,000), and 18 customers expand usage and buy enterprise add-ons (+$260,000). Ending cohort ARR = $1,000,000 - $60,000 - $20,000 + $260,000 = $1,180,000. NRR = ($1,180,000 ÷ $1,000,000) × 100% = 118.0%. Gross Revenue Retention (GRR) = ($920,000 ÷ $1,000,000) = 92.0%.',
    },
    {
      title: 'SMB SaaS Cohort with High Churn & Modest Upsells (91% NRR)',
      description: 'An SMB marketing tool begins Q1 with $100,000 MRR. During the year, churn and downgrades total $18,000 MRR, while tier upgrades generate $9,000 MRR. Ending cohort MRR = $91,000. NRR = 91.0% (and GRR = 82.0%). The company must add at least $9,000 in new-logo MRR just to keep total revenue flat.',
    },
    {
      title: 'Multi-Year Compounding Impact of 120% NRR vs. 90% NRR',
      description: 'Two SaaS companies start with $5M ARR and add zero new logos for 3 years. Company A (90% NRR) shrinks to $3.65M ARR by Year 3. Company B (120% NRR) compounds its existing base to $8.64M ARR by Year 3—a $4.99M ARR gap generated purely from net expansion.',
    },
  ],
  benchmarkTables: [
    {
      title: '2026 B2B SaaS Net Revenue Retention (NRR) & Gross Retention (GRR) Benchmarks',
      description: 'Industry median and top-quartile annual NRR and GRR benchmarks segmented by average contract value (ACV).',
      headers: ['Customer Segment / ACV', 'Median Annual GRR', 'Top-Quartile GRR', 'Median Annual NRR', 'Top-Quartile (Elite) NRR'],
      rows: [
        ['SMB Self-Serve (<$3k ACV)', '78% – 84%', '88%+', '90% – 98%', '105%+'],
        ['Lower Mid-Market ($3k – $15k ACV)', '85% – 89%', '92%+', '98% – 106%', '112%+'],
        ['Core Mid-Market ($15k – $50k ACV)', '88% – 92%', '94%+', '106% – 114%', '120%+'],
        ['Enterprise ($50k – $250k+ ACV)', '92% – 95%', '97%+', '112% – 122%', '130%+'],
      ],
    },
  ],
  deepDiveSections: [
    {
      id: 'deep-dive',
      title: 'NRR vs. GRR: Why Investors Audit Both Metrics Together',
      paragraphs: [
        'In public and late-stage private SaaS valuations, Net Revenue Retention (NRR) has the highest statistical correlation with EV/ARR valuation multiples of any single metric. Companies with >120% NRR regularly trade at 2x to 3x the revenue multiple of peers with <100% NRR because every cohort acts as a compounding annuity.',
        'However, savvy investors never look at NRR in isolation—they pair it with Gross Revenue Retention (GRR), which strips out expansion and is capped at 100%. Why? If a company reports 110% NRR but only 70% GRR, it means 30% of its customer base is churning every year while a handful of whale accounts are expanding massively. High GRR (90%+) proves sticky product-market fit; high NRR (115%+) proves scalable expansion.',
      ],
      highlights: [
        'Never include New Logos in NRR: Brand-new customers acquired during the measurement window must be excluded from Ending Cohort MRR.',
        'Three Proven Expansion Levers: Usage/consumption meters (API calls, data volume), seat expansion across departments, and modular enterprise add-ons.',
        'Annualize Monthly Cohort NRR Carefully: A 1% monthly net expansion rate compounds to (1.01)^12 = 112.7% annual NRR.',
      ],
    },
  ],
  faqs: [
    {
      question: 'What is a good Net Revenue Retention (NRR) rate?',
      answer: 'For B2B SaaS overall, an annual NRR above 100% is the primary benchmark for healthy retention ("negative net revenue churn"). Across mid-market and enterprise software, the median NRR is ~108%–112%, while top-quartile public SaaS leaders achieve 120% to 135%+ NRR.',
    },
    {
      question: 'What is the difference between NRR and GRR (Gross Revenue Retention)?',
      answer: 'Net Revenue Retention (NRR) includes expansion revenue (upsells, cross-sells, and seat additions) and can exceed 100%. Gross Revenue Retention (GRR) excludes all expansion revenue—measuring only how much of your starting revenue survived churn and downgrades—and can never exceed 100%.',
    },
    {
      question: 'Does NRR include revenue from new customers?',
      answer: 'No. NRR strictly tracks a closed cohort of customers who were already active at the beginning of the measurement period. Revenue from brand-new customers acquired after the start date is tracked separately as New Business MRR/ARR.',
    },
    {
      question: 'How do you convert monthly NRR to annual NRR?',
      answer: 'To annualize a monthly cohort retention rate, raise the monthly retention decimal to the 12th power: Annual NRR = (Monthly NRR)^12. For example, 99% monthly NRR equals (0.99)^12 = 88.6% annual NRR, whereas 101% monthly NRR equals (1.01)^12 = 112.7% annual NRR.',
    },
  ],
  relatedTools: [
    { slug: 'mrr-calculator', title: 'MRR Calculator', description: 'Calculate Monthly Recurring Revenue and Annual Run Rate (ARR)', icon: 'TrendingUp' },
    { slug: 'churn-rate-calculator', title: 'Churn Rate Calculator', description: 'Compute customer logo churn and gross revenue churn rates', icon: 'Activity' },
    { slug: 'customer-lifetime-value-calculator', title: 'Customer Lifetime Value (LTV) Calculator', description: 'Model customer lifetime value and LTV:CAC ratio', icon: 'Users' },
    { slug: 'cac-payback-calculator', title: 'CAC Payback Calculator', description: 'Calculate months to recover customer acquisition spend', icon: 'Clock' },
    { slug: 'customer-acquisition-cost-calculator', title: 'CAC Calculator', description: 'Compute blended and paid customer acquisition cost', icon: 'Target' },
    { slug: 'business-valuation-calculator', title: 'Business Valuation Calculator', description: 'Estimate company value using revenue and EBITDA multiples', icon: 'Building2' },
  ],
} satisfies CalculatorSeoData;

export default seoData;