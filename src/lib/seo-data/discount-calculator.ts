const seoData = {
  howToSteps: [
    'Enter the original price of the item or service before any discounts. This is the listed retail price or sticker price.',
    'Choose whether your discount is a percentage (e.g., 25% off) or a fixed dollar amount (e.g., $15 off).',
    'Enter the discount value — either the percentage rate or the dollar amount to subtract from the original price.',
    'Optionally, enable a second chained discount to model situations like "30% off, plus an extra 15% off the already-reduced price." Chained discounts are applied sequentially, not additively.',
    'Click "Calculate Discount" to see your total savings, final sale price, effective savings percentage, and a step-by-step breakdown of each discount applied.',
  ],

  formula: 'Sale Price = Original Price × (1 − Discount%/100)',
  formulaDescription:
    'For a percentage discount, multiply the original price by one minus the discount rate expressed as a decimal. For a fixed-amount discount, simply subtract the discount amount from the original price. When discounts are chained, each discount is applied to the price after the previous discount has been deducted, so the effective total discount is always less than the sum of the individual percentages.',

  workedExamples: [
    {
      title: '25% Off a $120 Item',
      description:
        'A jacket originally priced at $120.00 is on sale for 25% off. The discount amount is $120.00 × 0.25 = $30.00. The final sale price is $120.00 − $30.00 = $90.00. You save $30.00, which is 25% of the original price.',
    },
    {
      title: '$15 Fixed Discount on an $89.99 Item',
      description:
        'A pair of shoes costs $89.99 with a coupon for $15.00 off. The discount amount is simply $15.00, so the final sale price is $89.99 − $15.00 = $74.99. Your effective savings percentage is ($15.00 / $89.99) × 100 = 16.67%.',
    },
    {
      title: 'Chained Discounts: 30% Off Then Extra 15% Off on $200',
      description:
        'A TV originally priced at $200.00 is offered at 30% off, with an additional 15% off the sale price. First discount: $200.00 × 0.30 = $60.00 off, bringing the price to $140.00. Second discount: $140.00 × 0.15 = $21.00 off, bringing the final price to $119.00. Total savings: $81.00 (40.5% effective). Note the combined effective discount (40.5%) is less than simply adding the percentages (45%), because the second discount applies to a smaller base.',
    },
  ],

  faqs: [
    {
      question: 'What is the difference between a percentage discount and a fixed discount?',
      answer:
        'A percentage discount subtracts a percentage of the original price (e.g., 20% off $100 saves $20, final price $80). A fixed discount subtracts a specific dollar amount regardless of the price (e.g., $15 off $100 saves $15, final price $85). Percentage discounts scale with the item price, while fixed discounts provide the same dollar savings no matter the cost. Retailers often use percentage discounts on higher-priced items and fixed discounts as coupons or promotions.',
    },
    {
      question: 'How do chained (stacked) discounts work?',
      answer:
        'Chained discounts are applied one after another, each on the already-reduced price. For example, 30% off followed by 15% off on a $100 item: first, $100 × 0.30 = $30 off, price drops to $70. Then $70 × 0.15 = $10.50 off, final price $59.50. The total savings is $40.50 (40.5%), not 45%. This happens because the second discount applies to a smaller number. Retailers sometimes advertise "an extra 20% off" to make the deal sound bigger than the effective discount actually is.',
    },
    {
      question: 'How do retailers calculate sale prices?',
      answer:
        'Retailers typically start with a markup-based original price and then apply discounts to create perceived value. Common strategies include tiered pricing (buy 2 get 1 free), seasonal markdowns (end-of-season clearance), doorbuster deals (limited-time deep discounts), and loyalty member pricing. The advertised percentage off is always calculated from the original list price, not from any previously discounted price, unless explicitly stated as "additional" or "extra" off the sale price.',
    },
    {
      question: 'Is sales tax calculated before or after a discount?',
      answer:
        'In most U.S. states and many countries, sales tax is calculated on the discounted (final sale) price, not the original price. This means the discount also reduces the amount of tax you pay. For example, an item originally $100 with 20% off becomes $80. With an 8% sales tax rate, you pay $80 + $6.40 = $86.40, not $100 − $20 + $8.00 = $88.00. However, tax laws vary by jurisdiction, so always check your local regulations.',
    },
    {
      question: 'How do I find the original price from a sale price and discount?',
      answer:
        'To reverse-calculate the original price from a sale price and a known percentage discount, divide the sale price by (1 − discount rate). For example, if an item is $75 after 25% off: Original Price = $75 / (1 − 0.25) = $75 / 0.75 = $100. For fixed discounts, simply add the discount amount back: Original Price = Sale Price + Discount Amount. This is useful when you see a "was/now" price and want to verify the claimed discount percentage.',
    },
    {
      question: 'How much do Black Friday and Cyber Monday discounts actually save?',
      answer:
        'Black Friday discounts typically range from 20% to 50% on electronics, 30% to 60% on clothing, and 40% to 70% on home goods. Cyber Monday often features similar or slightly deeper discounts on tech and online-exclusive items. However, research shows that many "sale" prices are similar to prices available at other times of the year. The most significant savings tend to be on doorbuster deals (limited quantity, early access) and on big-ticket items like TVs, laptops, and appliances. Using this calculator to compare claimed savings can help you determine whether a deal is truly worth it.',
    },
  ],

  relatedTools: [
    { slug: 'profit-margin-calculator', title: 'Profit Margin Calculator', description: 'Calculate profit margin and markup from cost and selling price', icon: 'Percent' },
    { slug: 'markup-calculator', title: 'Markup Calculator', description: 'Determine the right selling price from your cost basis', icon: 'TrendingUp' },
    { slug: 'roi-calculator', title: 'ROI Calculator', description: 'Evaluate the return on investment for business decisions', icon: 'BarChart3' },
    { slug: 'payroll-calculator', title: 'Payroll Calculator', description: 'Calculate employee payroll, taxes, and deductions', icon: 'CreditCard' },
    { slug: 'commission-calculator', title: 'Sales Commission Calculator', description: 'Calculate commission earnings from sales revenue', icon: 'DollarSign' },
  ],

  
};

export default seoData;
