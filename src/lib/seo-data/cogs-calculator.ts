const seoData = {
  breadcrumbs: [{ label: 'Calculators' }, { label: 'COGS Calculator' }],
  tableOfContents: [
    { id: 'how-to-calculate', label: 'How to Calculate COGS' },
    { id: 'formula', label: 'COGS & Inventory Valuation Formulas' },
    { id: 'worked-examples', label: 'Worked Retail, Manufacturing & SaaS Examples' },
    { id: 'benchmarks', label: '2026 COGS & Gross Margin Benchmarks by Industry' },
    { id: 'deep-dive', label: 'Deep Dive: FIFO vs. LIFO vs. Weighted Average Cost' },
    { id: 'frequently-asked-questions', label: 'FAQs' },
    { id: 'related-calculators', label: 'Related Calculators' },
  ],
  howToSteps: [
    'Enter your Beginning Inventory ($)—the book value of merchandise, raw materials, and finished goods on hand at the start of the accounting period (matches prior period Ending Inventory).',
    'Enter your Purchases & Direct Production Costs ($)—all inventory purchases, freight-in, customs duties, packaging, and direct manufacturing labor incurred during the period.',
    'Enter your Ending Inventory ($)—the physical count value of unsold inventory remaining on hand at the close of the period.',
    'Click "Calculate" to determine your Cost of Goods Sold (COGS) and Cost of Goods Available for Sale.',
  ],
  formula: 'Cost of Goods Available for Sale = Beginning Inventory + Purchases (+ Freight-In + Direct Labor)\nCost of Goods Sold (COGS) = Beginning Inventory + Purchases - Ending Inventory\n\nGross Profit = Total Revenue - Cost of Goods Sold (COGS)\nGross Profit Margin (%) = ((Total Revenue - COGS) ÷ Total Revenue) × 100%',
  formulaDescription: 'Cost of Goods Sold (COGS)—reported on IRS Form 1125-A and Schedule C Part III—captures the direct product, material, freight, and production labor costs attributable to the specific units actually sold during an accounting period. Under the GAAP matching principle, unsold inventory remains on the Balance Sheet as a Current Asset until the moment a customer buys it, at which point its cost transfers to COGS on the Income Statement.',
  workedExamples: [
    {
      title: 'DTC E-Commerce Brand ($45,000 Beginning Inventory, $160,000 Purchases, $55,000 Ending)',
      description: 'An apparel brand starts Q1 with $45,000 in warehouse inventory. During Q1, it pays factories $145,000 for new inventory plus $15,000 in ocean freight and import tariffs ($160,000 total purchases). Goods Available for Sale = $45,000 + $160,000 = $205,000. A physical warehouse count on March 31 shows $55,000 in unsold inventory. Q1 COGS = $205,000 - $55,000 = $150,000. On $375,000 in Q1 revenue, Gross Profit is $225,000 (60.0% Gross Margin).',
    },
    {
      title: 'Custom Furniture Manufacturer Including Direct Labor & Factory Overhead',
      description: 'A workshop begins the year with $80,000 in timber and WIP inventory. It spends $220,000 on raw materials, $180,000 on direct assembly wages, and $40,000 on factory utilities ($440,000 total additions). Ending inventory is $70,000. Annual COGS = $80,000 + $440,000 - $70,000 = $450,000.',
    },
    {
      title: 'B2B SaaS "Cost of Revenue" (Hosting, Third-Party APIs & Customer Support)',
      description: 'While software companies hold $0 physical inventory, GAAP SaaS COGS ("Cost of Revenue") includes AWS/GCP production hosting ($18,000/mo), OpenAI/Twilio embedded API usage ($9,000/mo), payment processing fees ($4,500/mo), and Tier-1 customer support & onboarding engineers ($13,500/mo), totaling $45,000/mo COGS on $250,000 MRR (18% COGS / 82% Gross Margin).',
    },
  ],
  benchmarkTables: [
    {
      title: '2026 Industry COGS (% of Revenue) & Gross Margin Benchmarks',
      description: 'Standard Cost of Goods Sold percentages and resulting Gross Profit Margins across retail, manufacturing, hospitality, and tech sectors.',
      headers: ['Industry Sector', 'Typical COGS (% of Revenue)', 'Target Gross Profit Margin', 'Primary Cost Components in COGS'],
      rows: [
        ['B2B SaaS & Cloud Software', '15% – 25%', '75% – 85%', 'Cloud hosting (AWS/GCP), 3rd-party APIs, CS onboarding, merchant fees'],
        ['DTC Cosmetics & Supplements', '20% – 35%', '65% – 80%', 'Formulation, primary packaging, kitting, inbound freight'],
        ['Apparel & Specialty E-Commerce', '38% – 52%', '48% – 62%', 'Garment manufacturing, customs/tariffs, inbound logistics, packaging'],
        ['Restaurants & Food Service', '28% – 35% (Food/Bev)', '60% – 70% (Before Labor)', 'Raw food ingredients, beverage inventory, takeout packaging'],
        ['Wholesale & Distribution', '72% – 85%', '15% – 28%', 'Bulk product procurement, inbound freight, warehouse handling'],
        ['Supermarkets & Grocery Retail', '75% – 82%', '18% – 25%', 'Wholesale food/CPG cost, cold-chain freight, spoilage/shrinkage'],
      ],
    },
  ],
  deepDiveSections: [
    {
      id: 'deep-dive',
      title: 'Inventory Valuation Methods (FIFO vs. LIFO vs. Weighted Average) & Tax Impact',
      paragraphs: [
        'When supplier prices fluctuate throughout the year, how do you decide which unit cost leaves Ending Inventory and enters COGS? The IRS and GAAP permit three primary inventory costing methods: FIFO (First-In, First-Out), LIFO (Last-In, First-Out), and Weighted Average Cost.',
        'In an inflationary environment where supplier costs are rising, FIFO assumes you sell your oldest, cheapest units first—which results in lower COGS, higher reported net income, and a higher Ending Inventory valuation on your balance sheet. Conversely, LIFO assumes you sell your newest, most expensive inventory first—increasing COGS and reducing taxable income, which saves cash taxes now.',
      ],
      highlights: [
        'Include in COGS: Wholesale product cost, raw materials, packaging, freight-in, customs duties/tariffs, direct production labor, and inventory shrinkage.',
        'Exclude from COGS (Put in OpEx / SG&A): Marketing/ad spend, outbound shipping to customers (unless billed in gross margin), sales commissions, executive salaries, and office rent.',
        'IRS Small Business Inventory Exception (IRC § 471(c)): Businesses with average annual gross receipts under $30M+ (inflation-adjusted) can use simplified non-incidental materials accounting.',
      ],
    },
  ],
  faqs: [
    {
      question: 'Why isn\'t unsold inventory deductible as an expense when purchased?',
      answer: 'Under the GAAP and IRS matching principle, inventory purchases are an exchange of one asset (cash) for another asset (inventory). You only deduct the cost of inventory on your income statement (as COGS) in the period when the product is actually sold to a customer (or written off as damaged/obsolete).',
    },
    {
      question: 'What is the difference between COGS and Operating Expenses (OpEx)?',
      answer: 'COGS includes only the direct costs required to manufacture or purchase the products you sold (raw materials, wholesale stock, freight-in, direct factory labor). Operating Expenses (OpEx or SG&A—Selling, General, and Administrative) are the overhead costs required to run the business regardless of unit volume, such as office rent, marketing, accounting, R&D, and administrative salaries.',
    },
    {
      question: 'How does inventory shrinkage (theft, damage, spoilage) affect COGS?',
      answer: 'Because COGS equals Beginning Inventory + Purchases - Ending Inventory, any lost, stolen, or spoiled goods automatically reduce your physical Ending Inventory count—which increases your calculated COGS dollar-for-dollar and reduces your Gross Profit Margin.',
    },
    {
      question: 'Do service businesses or SaaS companies have COGS?',
      answer: 'Yes, often labeled "Cost of Revenue" or "Cost of Services." For agencies and consulting firms, COGS includes billable delivery salaries and subcontractor costs. For SaaS companies, COGS includes cloud server hosting, embedded third-party data/API costs, customer implementation/support, and credit card processing fees.',
    },
  ],
  relatedTools: [
    { slug: 'margin-calculator', title: 'Gross Margin Calculator', description: 'Calculate gross profit margin and dollar profit from revenue and COGS', icon: 'Percent' },
    { slug: 'markup-calculator', title: 'Markup vs. Margin Calculator', description: 'Convert product cost into retail selling price using target markup or margin', icon: 'Tag' },
    { slug: 'profit-loss-calculator', title: 'Profit & Loss (P&L) Calculator', description: 'Build a full income statement from revenue, COGS, and operating expenses', icon: 'FileSpreadsheet' },
    { slug: 'break-even-calculator', title: 'Break-Even Calculator', description: 'Calculate unit sales and revenue needed to cover fixed overhead', icon: 'Scale' },
    { slug: 'working-capital-calculator', title: 'Working Capital Calculator', description: 'Measure how inventory and payables impact short-term liquidity', icon: 'DollarSign' },
    { slug: 'product-pricing-calculator', title: 'Product Pricing Calculator', description: 'Set profitable wholesale and retail prices from unit COGS', icon: 'ShoppingBag' },
  ],
};

export default seoData;
