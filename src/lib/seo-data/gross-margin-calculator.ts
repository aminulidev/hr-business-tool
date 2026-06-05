const seoData = {
  // ------ SEO content ------

  howToSteps: [
    'Choose your calculation mode: "From Revenue & COGS" for direct calculation, "From Revenue & Margin %" to find COGS, or "From COGS & Margin %" to find required revenue.',
    'Enter your revenue (total sales or selling price) and cost of goods sold (COGS). COGS includes direct costs like materials, labor, and manufacturing expenses.',
    'If using margin-based modes, enter the desired gross margin percentage — this represents what portion of revenue remains after covering direct costs.',
    'Optionally, switch to multi-product mode to compare up to 5 products side by side by adding additional products with their own revenue and COGS.',
    'Click "Calculate" to see your gross profit, gross margin percentage, visual bar chart comparison, and detailed product breakdown.',
  ],

  formula: 'Gross Margin = ((Revenue - COGS) / Revenue) × 100%',
  formulaDescription:
    'Gross margin measures the percentage of revenue that exceeds the cost of goods sold (COGS). It shows how efficiently a company produces and sells its products. A higher gross margin means more money is available to cover operating expenses, marketing, R&D, and generate net profit. For example, if a product sells for $100 and costs $60 to produce, the gross margin is (($100 - $60) / $100) × 100 = 40%. This means for every dollar of revenue, $0.40 remains after covering direct production costs. Gross margin differs from markup: markup is calculated on cost, while gross margin is calculated on revenue.',

  workedExamples: [
    {
      title: 'SaaS Company: $500K Revenue, $150K COGS',
      description:
        'A SaaS company with $500,000 in annual revenue and $150,000 in COGS (hosting, support staff, and direct costs). Gross Profit = $500,000 - $150,000 = $350,000. Gross Margin = ($350,000 / $500,000) × 100 = 70%. This 70% gross margin is typical for software companies where the cost to serve each additional customer is relatively low.',
    },
    {
      title: 'Retail Store: $200K Revenue, $130K COGS',
      description:
        'A retail clothing store with $200,000 in annual revenue and $130,000 in COGS (cost of inventory purchased). Gross Profit = $200,000 - $130,000 = $70,000. Gross Margin = ($70,000 / $200,000) × 100 = 35%. This 35% gross margin means the store retains 35 cents of each sales dollar after covering the cost of goods, which must cover rent, payroll, utilities, and other operating expenses.',
    },
    {
      title: 'Restaurant: $300K Revenue, $210K COGS',
      description:
        'A restaurant with $300,000 in annual revenue and $210,000 in COGS (food ingredients, beverages, and kitchen supplies). Gross Profit = $300,000 - $210,000 = $90,000. Gross Margin = ($90,000 / $300,000) × 100 = 30%. Restaurants typically operate on thin gross margins (25-35%), making efficient cost management critical. Even a small improvement in food cost percentage can significantly impact profitability.',
    },
  ],

  faqs: [
    {
      question: 'What is gross margin?',
      answer:
        'Gross margin (also called gross profit margin) is a financial metric that shows the percentage of revenue remaining after subtracting the cost of goods sold (COGS). It represents the profit a company makes on its core business activities before accounting for operating expenses like rent, salaries, marketing, and taxes. Gross margin is calculated as (Revenue - COGS) / Revenue × 100%. It is a key indicator of a company\'s pricing strategy, production efficiency, and financial health.',
    },
    {
      question: 'What is the difference between gross margin and net margin?',
      answer:
        'Gross margin only accounts for direct costs (COGS) — the cost of producing or purchasing the goods you sell. Net margin (also called net profit margin) accounts for all expenses, including operating expenses (rent, salaries, utilities), interest, taxes, and depreciation. Net margin = (Net Income / Revenue) × 100%. A company might have a healthy gross margin of 60% but a net margin of only 10% if operating expenses consume a large portion of revenue. Both metrics are important, but gross margin focuses on production efficiency while net margin shows overall profitability.',
    },
    {
      question: 'What counts as COGS (Cost of Goods Sold)?',
      answer:
        'COGS includes all direct costs involved in producing or acquiring the goods and services you sell. For a manufacturer, this includes raw materials, direct labor, factory overhead, and packaging. For a retailer or wholesaler, COGS is typically the purchase price of inventory plus freight and import duties. For a service business, COGS may include direct labor costs, materials used in service delivery, and subcontractor fees. COGS does NOT include indirect costs like marketing, office rent, administrative salaries, insurance, or utilities — those are operating expenses.',
    },
    {
      question: 'What are typical gross margins by industry?',
      answer:
        'Gross margins vary dramatically by industry. Software/SaaS companies typically enjoy 70-85% gross margins because the cost to serve additional customers is very low. Retail generally sees 25-50% margins (grocery stores on the lower end, specialty retailers on the higher end). Restaurants operate on thin 25-35% margins due to high food and labor costs. Manufacturing ranges from 20-40%. Pharmaceuticals can achieve 60-80% margins. Construction is typically 15-30%. Technology hardware ranges from 20-40%. Understanding your industry\'s benchmark helps you evaluate whether your margins are healthy or need improvement.',
    },
    {
      question: 'How can I improve my gross margin?',
      answer:
        'There are three main ways to improve gross margin: (1) Increase prices — even small price increases can significantly improve margins if demand is relatively inelastic. (2) Reduce COGS — negotiate better supplier rates, improve production efficiency, reduce waste, or find cheaper materials without sacrificing quality. (3) Shift product mix toward higher-margin products — analyze which products have the best margins and focus sales and marketing efforts there. Other strategies include value-based pricing (charging based on perceived value rather than cost-plus), reducing returns and defects, and optimizing inventory management to minimize spoilage and obsolescence.',
    },
    {
      question: 'What is the difference between gross margin and markup?',
      answer:
        'While often confused, gross margin and markup are different calculations. Gross margin is calculated as a percentage of revenue: (Revenue - COGS) / Revenue × 100%. Markup is calculated as a percentage of cost: (Revenue - COGS) / COGS × 100%. For example, if you buy a product for $50 and sell it for $100, your markup is (($100 - $50) / $50) × 100 = 100%, but your gross margin is (($100 - $50) / $100) × 100 = 50%. A 100% markup equals a 50% gross margin. As markup increases, the gap between the two percentages widens — a 50% markup equals a 33.3% gross margin, while a 200% markup equals a 66.7% gross margin.',
    },
  ],

  relatedTools: [
    { slug: 'profit-margin-calculator', title: 'Profit Margin Calculator', description: 'Calculate profit margin and markup from cost and selling price', icon: 'Percent' },
    { slug: 'markup-calculator', title: 'Markup Calculator', description: 'Determine the right selling price from your cost basis', icon: 'TrendingUp' },
    { slug: 'roi-calculator', title: 'ROI Calculator', description: 'Evaluate the return on investment for business decisions', icon: 'BarChart3' },
    { slug: 'discount-calculator', title: 'Discount Calculator', description: 'Calculate sale prices and savings amounts', icon: 'Tag' },
    { slug: 'commission-calculator', title: 'Sales Commission Calculator', description: 'Calculate commission earnings from sales revenue', icon: 'DollarSign' },
  ],

  
};

export default seoData;
