const seoData = {
  breadcrumbs: [{ label: 'Calculators' }, { label: 'Inventory Turnover Calculator' }],
  tableOfContents: [
    { id: 'how-to-calculate', label: 'How to Calculate' },
    { id: 'formula', label: 'Formula' },
    { id: 'worked-examples', label: 'Worked Examples' },
    { id: 'frequently-asked-questions', label: 'FAQs' },
    { id: 'related-calculators', label: 'Related Calculators' },
  ],
  howToSteps: [
    'Enter annual COGS.',
    'Enter beginning inventory.',
    'Enter ending inventory.',
    'Click Calculate to see turnover ratio and days in inventory.',
  ],
  formula: 'Average Inventory = (Beginning + Ending) / 2\nInventory Turnover = COGS / Average Inventory\nDays in Inventory (DIO) = 365 / Turnover',
  formulaDescription: 'Inventory turnover = COGS / average inventory. Measures how fast inventory sells. Industry: grocery 15x, retail 6x, manufacturing 5x, auto dealers 8x. Days in inventory (DIO) = 365 / turnover. Low turnover = excess inventory.',
  workedExamples: [
    { title: 'Grocery Store', description: '$1.5M COGS, $100k avg inventory. Turnover = 15x. DIO = 24 days. Fast — typical for grocery.' },
    { title: 'Retail Store', description: '$600k COGS, $100k avg inventory. Turnover = 6x. DIO = 61 days. Typical for retail.' },
    { title: 'Manufacturer', description: '$1M COGS, $200k avg inventory. Turnover = 5x. DIO = 73 days. Typical for manufacturing.' },
    { title: 'Auto Dealer', description: '$5M COGS, $625k avg inventory. Turnover = 8x. DIO = 46 days. Typical for auto.' },
    { title: 'Slow Inventory', description: '$500k COGS, $250k avg inventory. Turnover = 2x. DIO = 183 days. Slow — excess inventory risk.' },
  ],
  faqs: [
    { question: 'What is inventory turnover?', answer: 'Inventory turnover = COGS / average inventory. Measures how many times inventory is sold and replaced per year. Higher = faster selling. Industry: grocery 15x, retail 6x, manufacturing 5x. Days in inventory (DIO) = 365 / turnover. Low turnover = excess inventory, obsolescence risk.' },
    { question: 'What is a good inventory turnover?', answer: 'Industry varies: grocery 12-20x, retail 4-8x, manufacturing 4-6x, auto dealers 6-10x, jewelry 2-4x, restaurants 25-50x. Higher = better (faster sales, less capital tied up). But too high may indicate stockouts (lost sales). Compare to industry average and track trend.' },
    { question: 'What are days in inventory (DIO)?', answer: 'DIO = 365 / inventory turnover. Measures average days inventory is held before sale. Lower = better. Example: 6x turnover = 61 DIO. 12x turnover = 30 DIO. Used in cash conversion cycle: CCC = DIO + DSO - DPO. See our Cash Conversion Cycle Calculator.' },
    { question: 'How do you improve inventory turnover?', answer: 'Strategies: (1) Better demand forecasting (reduce overstock), (2) JIT inventory (order as needed), (3) Drop-shipping (no inventory), (4) Reduce SKUs (eliminate slow movers), (5) Bundle slow products with fast, (6) Discount old inventory, (7) Improve supply chain (faster replenishment). See our EOQ Calculator.' },
    { question: 'Low inventory turnover — what does it mean?', answer: 'Low turnover indicates: (1) Overstocking (excess inventory), (2) Slow-moving products, (3) Obsolescence risk, (4) Poor demand forecasting, (5) Weak sales. Costs: capital tied up, holding costs (20-30%/year), obsolescence write-offs. Action: reduce order quantities, discount slow movers, improve forecasting. See our Inventory Holding Cost Calculator.' },
    { question: 'Inventory turnover vs asset turnover?', answer: 'Inventory turnover = COGS / inventory (efficiency of inventory management). Asset turnover = revenue / total assets (efficiency of all assets). Both measure efficiency. Inventory turnover is more specific (inventory only). Asset turnover is broader (all assets including inventory, equipment, etc.). See our Asset Turnover Calculator.' },
  ],
  relatedTools: [
    { slug: 'roi-calculator', title: 'ROI Calculator', description: 'Return on investment', icon: 'BarChart3' },
    { slug: 'profit-margin-calculator', title: 'Profit Margin Calculator', description: 'Margin analysis', icon: 'Percent' },
    { slug: 'break-even-calculator', title: 'Break-Even Calculator', description: 'Break-even units and revenue', icon: 'Target' },
    { slug: 'gross-margin-calculator', title: 'Gross Margin Calculator', description: 'Gross profit margin', icon: 'PieChart' },
    { slug: 'cash-flow-forecast-calculator', title: 'Cash Flow Forecast', description: '12-month cash projection', icon: 'TrendingUp' },
  ],
};
export default seoData;
