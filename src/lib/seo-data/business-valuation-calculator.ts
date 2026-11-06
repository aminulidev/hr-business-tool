import type { CalculatorSeoData } from './types';
import { SRC } from './sources';
const seoData = {
  breadcrumbs: [{ label: 'Calculators' }, { label: 'Business Valuation Calculator' }],
  tableOfContents: [
    { id: 'how-to-calculate', label: 'How to Calculate Business Valuation' },
    { id: 'formula', label: 'EBITDA, SDE, Revenue & Asset Valuation Formulas' },
    { id: 'worked-examples', label: 'Worked M&A Valuation Scenarios' },
    { id: 'benchmarks', label: '2026 Business Valuation Multiples by Industry' },
    { id: 'deep-dive', label: 'Deep Dive: SDE vs. EBITDA & Value Drivers' },
    { id: 'frequently-asked-questions', label: 'FAQs' },
    { id: 'related-calculators', label: 'Related Calculators' },
  ],
  howToSteps: [
    'Enter your Trailing 12-Month (TTM) Annual Revenue ($) and select an appropriate industry Revenue Multiple (e.g., 0.5x–1.5x for traditional small businesses, 4x–8x+ for SaaS).',
    'Enter your annual EBITDA ($) (or Seller\'s Discretionary Earnings for owner-operated businesses) and select an industry EBITDA Multiple (typically 3.0x–6.0x for SMBs, 8.0x–14.0x for mid-market).',
    'Enter your Total Tangible Assets ($) and Total Liabilities ($) so the calculator can compute your Net Asset / Book Value.',
    'Click "Calculate Valuation" to compare your Revenue Valuation, EBITDA Valuation, Asset-Based Book Value, and blended Low-to-High Enterprise Value range.',
  ],
  formula: '1. Earnings / EBITDA Multiple Method (Income Approach):\nEnterprise Value = Normalized EBITDA (or SDE) × Industry Multiple\n\n2. Revenue Multiple Method (Market Approach):\nEnterprise Value = Annual Recurring / Gross Revenue × Industry Revenue Multiple\n\n3. Net Asset Method (Asset Approach):\nBook / Net Asset Value = Total Fair Market Assets - Total Liabilities\n\nEquity Value (Cash to Seller at Close) = Enterprise Value + Cash on Hand - Total Debt',
  formulaDescription: 'Valuing a private business combines three core appraisal methodologies: the Earnings Multiple Method (EBITDA or Seller\'s Discretionary Earnings), the Revenue Multiple Method (used heavily for high-growth SaaS and subscription companies), and the Net Asset Method (the floor valuation for asset-heavy businesses). By triangulating all three methods, founders, buyers, and M&A advisors establish a defensible Low, Mid, and High valuation range before entering negotiations.',
  workedExamples: [
    {
      title: 'Profitable HVAC & Home Services Company ($2.4M Revenue, $480k EBITDA)',
      description: 'A regional HVAC service business generates $2,400,000 in annual revenue and $480,000 in normalized EBITDA (20% margin), with $350,000 in service vans/equipment and $100,000 in debt ($250,000 Net Asset Value). Using a 0.9x Revenue multiple ($2.16M) and a 4.5x EBITDA multiple ($2.16M), the company\'s operating Enterprise Value is ~$2.16M (range $1.80M to $2.40M), far above its $250,000 liquidation book value due to recurring maintenance contracts.',
    },
    {
      title: 'B2B SaaS Company ($1.8M ARR, $300k EBITDA, 112% NRR)',
      description: 'A B2B software business with $1,800,000 in Annual Recurring Revenue (ARR) growing 35% YoY with $300,000 in EBITDA is valued primarily on an ARR multiple. Applying a 5.0x SaaS ARR multiple yields a $9,000,000 valuation, whereas a traditional 10x EBITDA multiple would value it at $3,000,000. Strategic SaaS acquirers pay on ARR multiples because high-margin recurring revenue scales rapidly once sales and R&D stabilize.',
    },
    {
      title: 'Main Street E-Commerce / Retail Brand ($1.2M Revenue, $250k SDE)',
      description: 'An owner-operated e-commerce brand generates $1,200,000 in sales and $250,000 in Seller\'s Discretionary Earnings (SDE—which adds back the solo owner\'s $100,000 salary to $150,000 net profit), plus $180,000 in sellable inventory. Main street e-commerce brands typically trade at 2.8x to 3.8x SDE ($700,000 to $950,000), often structured as a multiple of SDE plus landed inventory at cost.',
    },
  ],
  benchmarkTables: [
    {
      title: '2026 Private Business Valuation Multiples by Industry & Size',
      description: 'Observed private-market transaction multiples across Seller\'s Discretionary Earnings (SDE), EBITDA, and Annual Revenue.',
      headers: ['Industry Sector', 'Small Business SDE Multiple (<$1M Profit)', 'Mid-Market EBITDA Multiple ($1M–$5M EBITDA)', 'Typical Revenue Multiple', 'Key Valuation Premium Driver'],
      rows: [
        ['B2B SaaS & Cloud Software', '3.5x – 5.5x SDE', '10.0x – 16.0x+ EBITDA', '3.5x – 8.0x+ ARR', 'Net Revenue Retention (>110%) & Rule of 40'],
        ['Home Services (HVAC, Plumbing, Pest)', '2.8x – 4.2x SDE', '5.0x – 8.5x EBITDA', '0.7x – 1.4x Rev', 'Recurring service plans & non-owner technician team'],
        ['Healthcare & Dental Practices', '3.0x – 4.5x SDE', '6.0x – 9.5x EBITDA', '0.8x – 1.6x Rev', 'Multi-provider model & payer mix diversification'],
        ['Manufacturing & Industrial', '3.0x – 4.5x SDE', '4.5x – 7.0x EBITDA', '0.6x – 1.3x Rev', 'Proprietary IP/tooling & <15% customer concentration'],
        ['Digital Agencies & IT Managed Services (MSP)', '2.5x – 4.0x SDE', '4.5x – 7.5x EBITDA', '0.8x – 1.5x Rev', '12-month retainer contracts vs. one-off project work'],
        ['E-Commerce & Consumer Brands', '2.5x – 3.8x SDE', '4.0x – 6.5x EBITDA', '0.6x – 1.5x Rev', 'Repeat purchase rate, organic traffic %, & brand moat'],
      ],
    },
  ],
  deepDiveSections: [
    {
      id: 'deep-dive',
      title: 'SDE vs. EBITDA & the 5 Factors That Double Your Valuation Multiple',
      paragraphs: [
        'For small businesses earning under $1M in annual profit, buyers value the company on Seller\'s Discretionary Earnings (SDE)—which equals pretax net income plus interest, depreciation, amortization, one-time non-recurring expenses, and a single full-time owner\'s total compensation and personal add-backs (auto, travel, health insurance). Once a business exceeds $1M in annual profit and has a management team in place, private equity and strategic buyers switch to Adjusted EBITDA (which deducts the market-rate salary required to hire a replacement CEO).',
        'Why does one $3M-revenue company sell for 3.0x EBITDA while another in the same industry sells for 6.5x EBITDA? Valuation multiples expand dramatically based on five de-risking pillars: (1) Recurring vs. re-occurring revenue contracts; (2) Low customer concentration (no single client >10%–15% of revenue); (3) Low owner dependency (the business runs without the founder working 50 hours/week); (4) Clean accrual-basis financials; and (5) Documented YoY organic growth.',
      ],
      highlights: [
        'Document Legitimate Add-Backs Early: Track one-time legal fees, non-operating personal vehicle/travel expenses, and above-market family payroll 2–3 years before selling.',
        'Eliminate Customer Concentration: If a single client accounts for >25% of revenue, buyers will either discount the multiple by 20%–35% or shift purchase price into a contingent earnout.',
        'Understand Enterprise Value vs. Equity Proceeds: Most M&A deals are "Cash-Free, Debt-Free"—you keep your cash, pay off existing loans at closing, and deliver a normalized level of Working Capital.',
      ],
    },
  ],
  faqs: [
    {
      question: 'What is the difference between SDE and EBITDA in business valuation?',
      answer: 'EBITDA (Earnings Before Interest, Taxes, Depreciation, and Amortization) measures corporate operating cash flow after paying all management salaries. SDE (Seller\'s Discretionary Earnings) starts with EBITDA and adds back the single owner-operator\'s salary, payroll taxes, health insurance, and discretionary owner perks. SDE is standard for Main Street businesses under $1M in profit; EBITDA is standard for lower-middle-market companies above $1M in profit.',
    },
    {
      question: 'What is a typical EBITDA multiple for a small business?',
      answer: 'Across most traditional US industries, small and lower-middle-market businesses with $500k to $3M in annual EBITDA trade between 3.5x and 6.0x Adjusted EBITDA. Smaller owner-operated businesses (<$500k profit) typically sell for 2.5x to 3.8x SDE, while larger companies ($5M+ EBITDA) or high-retention SaaS businesses command 7.0x to 12.0x+ EBITDA.',
    },
    {
      question: 'When should I use a Revenue Multiple vs. an EBITDA Multiple?',
      answer: 'EBITDA (or SDE) multiples are the primary valuation benchmark for 90% of profitable private businesses because buyers purchase future cash flows. Revenue multiples are primarily used in two cases: (1) High-growth B2B SaaS or subscription businesses reinvesting heavily in R&D and sales, or (2) Quick rule-of-thumb benchmarking in standardized service trades (such as CPA bookkeeping practices or insurance books of business that trade at 1.0x–1.3x annual recurring commissions).',
    },
    {
      question: 'Does a business valuation include inventory, cash, and real estate?',
      answer: 'In standard M&A transactions, Enterprise Value is calculated on a "Cash-Free, Debt-Free" basis and includes a normal operating level of working capital (including normal inventory and accounts receivable). Excess cash stays with the seller, debt is paid off at close, and owner-occupied real estate is either valued separately via a commercial real estate appraisal or leased back to the buyer at fair market rent.',
    },
  ],
  relatedTools: [
    { slug: 'ebitda-margin-calculator', title: 'EBITDA Calculator', description: 'Calculate EBITDA and EBITDA margin from operating income or net profit', icon: 'BarChart3' },
    { slug: 'working-capital-calculator', title: 'Working Capital Calculator', description: 'Compute Net Working Capital and Current Ratio for M&A readiness', icon: 'Scale' },
    { slug: 'pnl-calculator', title: 'Profit & Loss (P&L) Calculator', description: 'Model revenue, COGS, operating expenses, and net profit margins', icon: 'FileSpreadsheet' },
    { slug: 'mrr-calculator', title: 'MRR & ARR Calculator', description: 'Calculate Monthly and Annual Recurring Revenue for subscription valuations', icon: 'TrendingUp' },
    { slug: 'net-revenue-retention-calculator', title: 'Net Revenue Retention Calculator', description: 'Measure cohort NRR to benchmark SaaS valuation multiples', icon: 'Activity' },
    { slug: 'depreciation-calculator', title: 'Depreciation Calculator', description: 'Calculate book and accelerated asset depreciation add-backs', icon: 'Layers' },
  ],
  sources: [SRC.secNonGaap],
} satisfies CalculatorSeoData;

export default seoData;