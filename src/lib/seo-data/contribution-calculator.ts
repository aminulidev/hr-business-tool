const seoData = {
  breadcrumbs: [{ label: 'Calculators' }, { label: 'Contribution Calculator' }],
  tableOfContents: [
    { id: 'how-to-calculate', label: 'How to Calculate' },
    { id: 'formula', label: 'Formula' },
    { id: 'worked-examples', label: 'Worked Examples' },
    { id: 'frequently-asked-questions', label: 'FAQs' },
    { id: 'related-calculators', label: 'Related Calculators' },
  ],
  howToSteps: [
    'Enter selling price per unit.',
    'Enter variable cost per unit.',
    'Enter units sold.',
    'Enter total fixed costs.',
    'Click Calculate to see total contribution, net profit, and break-even.',
  ],
  formula: 'CM per Unit = Price - Variable Cost\nTotal CM = CM per Unit x Units\nNet Profit = Total CM - Fixed Costs\nBreak-even Units = Fixed Costs / CM per Unit',
  formulaDescription: 'Total contribution margin = (price - variable cost) × units. Contribution toward fixed costs and profit. CM ratio = CM / price × 100. Break-even units = fixed costs / CM per unit. Used for CVP (cost-volume-profit) analysis. See our Break-Even and Contribution Margin Calculators.',
  workedExamples: [
    { title: 'Profitable Product', description: '$50 price, $20 VC, 2000 units, $45k FC. CM/unit = $30. Total CM = $60k. Net profit = $15k. Break-even = 1,500 units.' },
    { title: 'At Break-Even', description: '$50 price, $20 VC, 1500 units, $45k FC. CM = $45k. Net = $0. At break-even.' },
    { title: 'Loss Product', description: '$50 price, $20 VC, 1000 units, $45k FC. CM = $30k. Net = -$15k. Below break-even.' },
    { title: 'High CM SaaS', description: '$100/mo price, $15/mo VC, 500 customers, $30k/mo FC. CM/unit = $85. Total CM = $42.5k. Net = $12.5k. Break-even = 353 customers.' },
    { title: 'Target Profit', description: 'Want $20k profit. $50 price, $20 VC, $45k FC. Need ($45k + $20k) / $30 = 2,167 units. Target units for desired profit.' },
  ],
  faqs: [
    { question: 'What is contribution?', answer: 'Total contribution margin = (price - variable cost) × units. Amount contributing to fixed costs and profit. CM per unit = price - variable cost. CM ratio = CM / price × 100. Break-even = fixed costs / CM per unit. Net profit = total CM - fixed costs. Used for CVP (cost-volume-profit) analysis.' },
    { question: 'How do you calculate contribution margin?', answer: 'CM per unit = selling price - variable cost per unit. Total CM = CM per unit × units sold. CM ratio = (CM per unit / price) × 100. Example: $50 price, $20 VC = $30 CM/unit, 60% CM ratio. Sell 2,000 units = $60,000 total CM. See our Contribution Margin Calculator.' },
    { question: 'What is break-even analysis?', answer: 'Break-even = point where total revenue = total costs (no profit, no loss). Break-even units = fixed costs / CM per unit. Example: $45k FC / $30 CM = 1,500 units. Below = loss. Above = profit. Used for: pricing decisions, product launches, capacity planning. See our Break-Even Calculator.' },
    { question: 'How do you calculate target profit units?', answer: 'Target profit units = (fixed costs + target profit) / CM per unit. Example: $45k FC + $20k target / $30 CM = 2,167 units. Need to sell 2,167 units to hit $20k profit. Used for: sales targets, budgeting, incentive plans. Adjust price or VC to hit target with fewer units.' },
    { question: 'What is CVP analysis?', answer: 'Cost-Volume-Profit analysis: how changes in cost, volume, price affect profit. Uses: (1) Break-even (FC / CM unit), (2) Target profit ((FC + target) / CM unit), (3) Margin of safety (actual - break-even), (4) Operating leverage (fixed cost proportion). Helps with: pricing, product mix, make-or-buy, special orders. See our Break-Even Calculator.' },
    { question: 'Contribution vs gross profit?', answer: 'Contribution = revenue - variable costs (ALL variable: production + variable selling + variable admin). Gross profit = revenue - COGS (production costs only). Contribution is broader. Example: $50 price, $20 production cost, $5 variable selling. Gross profit = $30. Contribution = $25. Both matter — gross for production, contribution for decisions.' },
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
