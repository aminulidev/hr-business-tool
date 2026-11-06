import type { CalculatorSeoData } from './types';
const seoData = {
  breadcrumbs: [{ label: 'Calculators' }, { label: 'Working Capital Calculator' }],
  tableOfContents: [
    { id: 'how-to-calculate', label: 'How to Calculate Working Capital' },
    { id: 'formula', label: 'Working Capital & Current Ratio Formulas' },
    { id: 'worked-examples', label: 'Worked Balance Sheet Examples' },
    { id: 'benchmarks', label: '2026 Working Capital & Current Ratio Benchmarks' },
    { id: 'deep-dive', label: 'Deep Dive: Net Operating Working Capital (NOWC) & Cash Cycle' },
    { id: 'frequently-asked-questions', label: 'FAQs' },
    { id: 'related-calculators', label: 'Related Calculators' },
  ],
  howToSteps: [
    'Enter your Total Current Assets ($)—cash, cash equivalents, marketable securities, accounts receivable (A/R), inventory, and short-term prepaid expenses due within 12 months.',
    'Enter your Total Current Liabilities ($)—accounts payable (A/P), accrued payroll, short-term debt, current portion of long-term debt, and taxes payable due within 12 months.',
    'Click "Calculate Working Capital" to see your Net Working Capital ($), Current Ratio (x), and short-term liquidity health rating.',
    'Use Scenario Compare to test how collecting receivables faster or paying down short-term debt improves your Current Ratio.',
  ],
  formula: 'Net Working Capital (NWC) = Total Current Assets - Total Current Liabilities\nCurrent Ratio = Total Current Assets ÷ Total Current Liabilities\n\nNet Operating Working Capital (NOWC) = (Accounts Receivable + Inventory) - Accounts Payable\nWorking Capital Ratio (% of Revenue) = (Net Working Capital ÷ Annual Revenue) × 100%',
  formulaDescription: 'Net Working Capital (NWC) measures a company\'s short-term liquidity and operational buffer—the dollar surplus left after paying off all obligations due within the next 12 months using short-term assets. Paired with the Current Ratio (Current Assets ÷ Current Liabilities), working capital analysis tells lenders, suppliers, and CFOs whether a business can fund day-to-day payroll, inventory, and growth without facing a cash crunch.',
  workedExamples: [
    {
      title: 'Healthy Manufacturing SME ($320,000 Current Assets vs. $180,000 Current Liabilities)',
      description: 'A precision manufacturer holds $80,000 in cash, $140,000 in accounts receivable, and $100,000 in raw/finished inventory ($320,000 Total Current Assets). It owes $95,000 in accounts payable, $45,000 in accrued payroll/taxes, and $40,000 on a short-term credit line ($180,000 Total Current Liabilities). Net Working Capital = $320,000 - $180,000 = $140,000. Current Ratio = $320,000 ÷ $180,000 = 1.78x—squarely in the healthy 1.5x–2.0x commercial lending target zone.',
    },
    {
      title: 'Fast-Growing Wholesale Distributor Facing a "Growth Cash Trap"',
      description: 'A distributor doubles sales but extends Net-60 credit terms to customers while paying factories on Net-15 terms. Current Assets are $500,000 ($420,000 locked in A/R and Inventory) and Current Liabilities are $440,000. Net Working Capital is positive ($60,000, Current Ratio = 1.14x), but because cash is tied up in slow-paying receivables, the company must shorten DSO (Days Sales Outstanding) or use invoice factoring to make payroll.',
    },
    {
      title: 'Negative Working Capital in Annual-Prepaid SaaS & Subscription Businesses',
      description: 'A B2B SaaS company has $400,000 in Current Assets and $650,000 in Current Liabilities, driven by $550,000 of Deferred Revenue (annual subscriptions paid upfront by customers). While standard GAAP NWC is -$250,000 (0.62x Current Ratio), this is actually a strength: Deferred Revenue is satisfied by delivering software at an 80%+ margin, not by paying out cash.',
    },
  ],
  benchmarkTables: [
    {
      title: '2026 Current Ratio & Net Working Capital Benchmarks by Industry',
      description: 'Typical Current Ratio ranges and Net Operating Working Capital (NOWC as % of annual revenue) across major business sectors.',
      headers: ['Industry Sector', 'Healthy Current Ratio', 'Typical NOWC (% of Revenue)', 'Primary Working Capital Driver'],
      rows: [
        ['Manufacturing & Industrial', '1.50x – 2.20x', '18% – 28% of Revenue', 'Raw material & WIP inventory + Net-45 A/R'],
        ['Wholesale & Distribution', '1.40x – 1.90x', '15% – 25% of Revenue', 'Finished goods inventory + supplier terms'],
        ['E-Commerce & Retail', '1.20x – 1.70x', '8% – 18% of Revenue', 'Seasonal inventory stocking vs. instant card settlement'],
        ['B2B Professional Services / Agencies', '1.30x – 2.00x', '10% – 16% of Revenue', 'Accounts receivable (Net-30/60 client invoices)'],
        ['B2B SaaS & Subscriptions', '0.80x – 1.50x', '-10% to +5% of Revenue', 'Upfront annual billing creates Deferred Revenue'],
      ],
    },
  ],
  deepDiveSections: [
    {
      id: 'deep-dive',
      title: 'GAAP Working Capital vs. Net Operating Working Capital (NOWC) in M&A',
      paragraphs: [
        'When buying, selling, or valuing a business, M&A advisors and private equity buyers do not use textbook GAAP Working Capital. Instead, they calculate Net Operating Working Capital (NOWC), which strips out Cash & Marketable Securities from Current Assets and strips out Short-Term Debt from Current Liabilities—because M&A transactions are normally structured on a "Cash-Free, Debt-Free" basis.',
        'In a Letter of Intent (LOI), the buyer and seller agree on a "Working Capital Peg" (typically the trailing 12-month average of Accounts Receivable + Inventory + Prepaid Expenses minus Accounts Payable and Accrued Expenses). At closing, if actual NOWC exceeds the peg, the seller receives a dollar-for-dollar purchase price increase; if NOWC falls short, the purchase price is reduced.',
      ],
      highlights: [
        'Unlock Cash via the Cash Conversion Cycle (CCC): Shorten Days Sales Outstanding (DSO), trim slow-moving inventory (DIO), and negotiate Net-45/Net-60 supplier terms (DPO).',
        'Watch Out for Current Ratio > 3.0x: An excessively high ratio often signals dead inventory or uninvested idle cash earning below-market returns.',
        'Pair Current Ratio with Quick Ratio (Acid Test): Strip out Inventory from Current Assets to verify you can pay short-term bills without liquidating stock at a discount.',
      ],
    },
  ],
  faqs: [
    {
      question: 'What is a good working capital ratio (Current Ratio)?',
      answer: 'For most traditional businesses, a Current Ratio between 1.50x and 2.00x is considered healthy—meaning the company holds $1.50 to $2.00 in liquid/current assets for every $1.00 of short-term liabilities due within 12 months. A ratio below 1.00x indicates negative working capital and potential liquidity strain.',
    },
    {
      question: 'What is included in Current Assets vs. Current Liabilities?',
      answer: 'Current Assets include cash, bank deposits, marketable securities, accounts receivable (unpaid customer invoices), inventory, and prepaid expenses expected to convert to cash within 12 months. Current Liabilities include accounts payable (unpaid vendor bills), accrued wages/bonuses, short-term loans, credit card balances, taxes payable, and the current portion of long-term debt due within 12 months.',
    },
    {
      question: 'Can a profitable business run out of working capital?',
      answer: 'Yes—this is known as the "overtrading" or "rapid growth cash trap." When a profitable B2B or product business scales rapidly, it must pay for inventory and payroll upfront while waiting 30 to 90 days for customers to pay invoices. Without sufficient working capital or a revolving line of credit, high revenue growth can drain cash to zero.',
    },
    {
      question: 'What is the difference between Current Ratio and Quick Ratio (Acid-Test)?',
      answer: 'The Current Ratio includes all current assets (Cash + Marketable Securities + Accounts Receivable + Inventory) divided by Current Liabilities. The Quick Ratio excludes Inventory and Prepaid Expenses because inventory can take months to sell and may require markdowns in a liquidity crunch.',
    },
  ],
  relatedTools: [
    { slug: 'cash-flow-forecast-calculator', title: 'Cash Flow Calculator', description: 'Analyze operating, investing, and financing cash flows', icon: 'DollarSign' },
    { slug: 'burn-rate-calculator', title: 'Burn Rate & Runway Calculator', description: 'Calculate monthly cash burn and months of cash runway', icon: 'Flame' },
    { slug: 'cogs-calculator', title: 'COGS Calculator', description: 'Compute Cost of Goods Sold from beginning and ending inventory', icon: 'Package' },
    { slug: 'business-valuation-calculator', title: 'Business Valuation Calculator', description: 'Value your business using revenue, EBITDA, and asset multiples', icon: 'Building2' },
    { slug: 'pnl-calculator', title: 'Profit & Loss (P&L) Calculator', description: 'Generate an itemized income statement and operating margin breakdown', icon: 'FileSpreadsheet' },
    { slug: 'amortization-calculator', title: 'Business Loan Calculator', description: 'Model working capital loan payments and interest amortization', icon: 'Landmark' },
  ],
} satisfies CalculatorSeoData;

export default seoData;