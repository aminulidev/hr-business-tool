import type { CalculatorSeoData } from './types';
const seoData = {
  breadcrumbs: [{ label: 'Calculators' }, { label: 'Depreciation Calculator' }],
  tableOfContents: [
    { id: 'how-to-calculate', label: 'How to Calculate Depreciation' },
    { id: 'formula', label: 'Straight-Line, Declining Balance & MACRS Formulas' },
    { id: 'worked-examples', label: 'Worked Asset Depreciation Examples' },
    { id: 'benchmarks', label: 'IRS MACRS Asset Recovery Periods & Useful Life Table' },
    { id: 'deep-dive', label: 'Deep Dive: Section 179 vs. 2026 Bonus Depreciation' },
    { id: 'frequently-asked-questions', label: 'FAQs' },
    { id: 'related-calculators', label: 'Related Calculators' },
  ],
  howToSteps: [
    'Enter the Asset Cost ($)—the total capitalized purchase price, including freight, sales tax, and installation costs required to place the asset in service.',
    'Enter the Salvage Value ($)—the estimated residual resale or scrap value of the asset at the end of its useful life ($0 for IRS MACRS tax depreciation).',
    'Enter the Useful Life (Years)—the number of years over which the asset will be depreciated (e.g., 5 years for computers/vehicles, 7 years for office furniture/machinery).',
    'Click "Calculate Depreciation" to view Annual and Monthly Straight-Line Depreciation, Year 1 Double-Declining Balance (200% DB) accelerated expense, and total depreciable base.',
  ],
  formula: 'Depreciable Base = Asset Cost (Purchase + Installation) - Salvage Value\n\nStraight-Line Method (GAAP Book Standard):\nAnnual Depreciation = (Asset Cost - Salvage Value) ÷ Useful Life (Years)\nMonthly Depreciation = Annual Depreciation ÷ 12\nAnnual Depreciation Rate (%) = (1 ÷ Useful Life) × 100%\n\nDouble-Declining Balance Method (200% Accelerated):\nYear 1 Depreciation = Asset Cost × (2 ÷ Useful Life)\nYear_t Depreciation = Beginning Book Value_t × (2 ÷ Useful Life)',
  formulaDescription: 'Depreciation allocates the capitalized cost of tangible fixed assets—such as machinery, commercial vehicles, computer servers, office furniture, and buildings—over their productive useful lives. While GAAP financial statements typically use Straight-Line Depreciation to smooth book earnings, US tax returns use IRS MACRS (Modified Accelerated Cost Recovery System), Section 179 expensing, and Bonus Depreciation to front-load tax deductions and maximize present-value cash flow.',
  workedExamples: [
    {
      title: 'Commercial Delivery Van ($50,000 Cost, $5,000 Salvage, 5-Year Life)',
      description: 'A logistics company buys a cargo van for $50,000 with an expected 5-year useful life and $5,000 trade-in salvage value. Depreciable base = $50,000 - $5,000 = $45,000. Under Straight-Line book accounting, annual depreciation is $45,000 ÷ 5 = $9,000/year ($750/month). Under Double-Declining Balance (200% DB), Year 1 depreciation is $50,000 × (2 ÷ 5) = $20,000 (40% of cost), leaving a Year 1 ending book value of $30,000.',
    },
    {
      title: 'CNC Manufacturing Equipment ($140,000 Cost, $14,000 Salvage, 7-Year Life)',
      description: 'A machine shop installs a $140,000 CNC mill with a 7-year useful life and $14,000 salvage value. Depreciable base = $126,000. Straight-Line depreciation = $126,000 ÷ 7 = $18,000/year ($1,500/month). Using Double-Declining Balance, the Year 1 accelerated write-off is $140,000 × (2 ÷ 7) = $40,000. For federal income tax purposes, the shop can elect Section 179 to deduct all $140,000 in Year 1.',
    },
    {
      title: 'IT Server & Laptop Refresh ($36,000 Cost, $0 Salvage, 3-Year Life)',
      description: 'A software agency purchases $36,000 of engineering workstations with a 3-year internal refresh cycle and $0 salvage value. Straight-Line depreciation is $12,000/year ($1,000/month). Under Double-Declining Balance, Year 1 depreciation is $36,000 × (2 ÷ 3) = $24,000.',
    },
  ],
  benchmarkTables: [
    {
      title: 'IRS Publication 946 (MACRS GDS) Standard Asset Recovery Periods',
      description: 'Statutory IRS General Depreciation System (GDS) property classes, recovery lives, and typical GAAP book useful lives.',
      headers: ['MACRS Property Class', 'Common Business Assets Included', 'IRS Tax Method', 'Year 1 MACRS % (Half-Year)', 'Typical GAAP Book Life'],
      rows: [
        ['3-Year Property', 'Tractor units, racehorses, specialized manufacturing tools', '200% Declining Balance', '33.33%', '3 – 4 Years'],
        ['5-Year Property', 'Computers, laptops, servers, copiers, automobiles, light trucks', '200% Declining Balance', '20.00%', '3 – 5 Years'],
        ['7-Year Property', 'Office furniture, desks, fixtures, general machinery & equipment', '200% Declining Balance', '14.29%', '5 – 10 Years'],
        ['15-Year Property', 'Qualified Improvement Property (QIP), land improvements, fencing', '150% Declining Balance', '5.00%', '10 – 15 Years'],
        ['27.5-Year Property', 'Residential rental real estate buildings (excludes land)', 'Straight-Line', '3.636% (Mid-Month)', '27.5 – 30 Years'],
        ['39-Year Property', 'Commercial office buildings, warehouses, retail real estate', 'Straight-Line', '2.564% (Mid-Month)', '39 – 40 Years'],
      ],
    },
  ],
  deepDiveSections: [
    {
      id: 'deep-dive',
      title: 'Tax Strategy: Section 179 Expensing vs. Bonus Depreciation vs. MACRS',
      paragraphs: [
        'Smart CFOs and CPAs maintain two separate depreciation schedules: a GAAP Book Schedule (using Straight-Line depreciation to report steady net income to banks and investors) and an IRS Tax Schedule (using IRC Section 179 and Bonus Depreciation to minimize current-year cash taxes).',
        'Under IRC Section 179, profitable small and mid-sized businesses can immediately deduct 100% of the purchase price of qualifying new or used equipment, software, and commercial vehicles in the year placed in service (up to the statutory cap of $1.25M+ indexed for inflation), rather than waiting 5 to 7 years. Meanwhile, IRC § 168(k) Bonus Depreciation (20% in 2026 under the TCJA phase-down schedule unless extended by Congress) has no dollar cap and can even create a Net Operating Loss (NOL) to offset future tax years.',
      ],
      highlights: [
        'De Minimis Safe Harbor Election (Treas. Reg. § 1.263(a)-1(f)): Expense individual items costing up to $2,500 per invoice ($5,000 with audited financials) immediately as office/equipment supplies without tracking depreciation.',
        'Land Never Depreciates: When purchasing commercial real estate, always allocate purchase price between non-depreciable land and the 39-year depreciable building structure (plus 5/7/15-year assets via a Cost Segregation Study).',
        'Watch Out for Depreciation Recapture (IRC § 1245): If you sell an asset for more than its depreciated tax book value, the gain up to original cost is taxed as ordinary income.',
      ],
    },
  ],
  faqs: [
    {
      question: 'What is the difference between Straight-Line and Double-Declining Balance depreciation?',
      answer: 'Straight-Line depreciation spreads an asset\'s cost evenly across every year of its useful life, resulting in the same expense each year. Double-Declining Balance (200% DB) is an accelerated method that applies twice the straight-line rate to the remaining undepreciated book value each year, creating larger deductions in the early years and smaller deductions later on.',
    },
    {
      question: 'Does IRS MACRS depreciation use Salvage Value?',
      answer: 'No. Under IRS Modified Accelerated Cost Recovery System (MACRS) tax rules, salvage value is always assumed to be $0—meaning 100% of the asset\'s capitalized cost basis is depreciated over its statutory recovery period. Salvage value is only used for GAAP financial accounting (book depreciation).',
    },
    {
      question: 'How does depreciation affect cash flow and EBITDA?',
      answer: 'Depreciation is a "non-cash expense." Cash leaves your bank account when you purchase the asset (CapEx on the Cash Flow Statement), while depreciation reduces pretax income on the Income Statement over time. Because depreciation reduces income tax owed without requiring an annual cash outlay, it creates a positive "depreciation tax shield" (Annual Depreciation × Marginal Tax Rate). In EBITDA, Depreciation and Amortization are added back to Operating Income (EBIT).',
    },
    {
      question: 'When should I expense an item immediately vs. capitalize and depreciate it?',
      answer: 'By electing the IRS De Minimis Safe Harbor on your annual tax return, any tangible item costing $2,500 or less per invoice (or per item) can be deducted 100% immediately as an operating expense rather than capitalized on your balance sheet. Items above $2,500 with a useful life over 1 year are capitalized and depreciated (or expensed via Section 179).',
    },
  ],
  relatedTools: [
    { slug: 'ebitda-margin-calculator', title: 'EBITDA Calculator', description: 'Calculate EBITDA and operating margin by adding back D&A', icon: 'BarChart3' },
    { slug: 'pnl-calculator', title: 'Profit & Loss (P&L) Calculator', description: 'Build a complete income statement with operating expenses and D&A', icon: 'FileSpreadsheet' },
    { slug: 'working-capital-calculator', title: 'Working Capital Calculator', description: 'Analyze short-term assets, liabilities, and current ratio', icon: 'Scale' },
    { slug: 'business-valuation-calculator', title: 'Business Valuation Calculator', description: 'Value your business using EBITDA, revenue, and net asset multiples', icon: 'Building2' },
    { slug: 'roi-calculator', title: 'Equipment ROI Calculator', description: 'Calculate return on investment for capital expenditures', icon: 'TrendingUp' },
    { slug: '1099-calculator', title: '1099 Tax & Deduction Calculator', description: 'Model Schedule C equipment write-offs and self-employment taxes', icon: 'FileText' },
  ],
} satisfies CalculatorSeoData;

export default seoData;