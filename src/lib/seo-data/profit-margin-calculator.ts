const seoData = {
  howToSteps: [
    'Choose your calculation mode: "Cost & Selling Price" if you know the individual item cost and its selling price, or "Cost & Revenue" if you know total costs and total revenue for a batch or period.',
    'Enter the cost of your product or service. In cost/selling mode, this is the cost to produce or acquire one unit. In cost/revenue mode, this is your total cost of goods sold (COGS) or total expenses.',
    'Enter either the selling price per unit or your total revenue amount, depending on the mode you selected. This represents the amount your customers pay or your total income from sales.',
    'Click "Calculate" to instantly see your profit in dollars, profit margin as a percentage, and markup percentage. The visual health indicator will show whether your margin is low (under 10%), moderate (10-20%), or healthy (above 20%).',
    'Review the worked examples below to see how the same formula applies across retail, SaaS, and services businesses — the math is identical, only the inputs change.',
    'Bookmark this page or use the Share button above to save your calculation as a shareable URL — your inputs are encoded in the link so you can revisit the exact scenario later.',
  ],

  formula: 'Profit Margin (%) = ((Selling Price − Cost) / Selling Price) × 100',
  formulaDescription:
    'Profit margin measures how much of each dollar of revenue translates into profit. The formula divides profit (selling price minus cost) by the selling price, then multiplies by 100 to express it as a percentage. Markup, by contrast, divides profit by cost: Markup (%) = ((Selling Price − Cost) / Cost) × 100. While a 50% markup on a $100 cost yields a $50 profit and $150 selling price, the margin on that sale is 33.33% ($50 / $150). The two metrics are mathematically related but not interchangeable — confusing them is one of the most common pricing mistakes small businesses make, and the difference compounds as markup rises. For day-to-day pricing decisions, most retailers use markup (it is easier to compute from cost). For financial reporting and investor presentations, gross margin is the standard metric because it shows profitability relative to revenue, not cost.',

  workedExamples: [
    {
      title: 'Retail Product: $60 Cost, $100 Selling Price',
      description:
        'A retailer buys a product for $60 wholesale and sells it for $100. Profit = $100 − $60 = $40. Profit margin = $40 / $100 × 100 = 40%. Markup = $40 / $60 × 100 = 66.67%. This 40% margin is healthy for retail — specialty stores typically operate at 40-50% margins, while grocery stores run on 20-30%. The retailer keeps 40 cents of every sales dollar after paying for the product itself, and that 40 cents must cover rent, payroll, utilities, marketing, and any remaining profit.',
    },
    {
      title: 'SaaS Subscription: $25 Cost, $100 Revenue',
      description:
        'A SaaS company charges $100/month per customer. Direct costs (server hosting, payment processing, support time) average $25 per customer per month. Profit = $100 − $25 = $75. Profit margin = $75 / $100 × 100 = 75%. This is typical for SaaS — software companies routinely achieve 70-85% gross margins because the cost to serve each additional customer is very low. The high margin is what makes SaaS businesses attractive to investors: revenue scales linearly with customers while costs scale sub-linearly.',
    },
    {
      title: 'Service Business: $200 Cost, $300 Selling Price',
      description:
        'A consultant bills a client $300 for a project that cost $200 in subcontractor labor and materials. Profit = $300 − $200 = $100. Profit margin = $100 / $300 × 100 = 33.33%. Markup = $100 / $200 × 100 = 50%. Service businesses typically target 30-50% margins, depending on how specialized the work is. A generalist consultant might run at 30%, while a niche specialist (e.g., HIPAA-compliant database migration) can command 60%+ margins because clients have fewer alternatives.',
    },
    {
      title: 'Multi-Product Blended Margin',
      description:
        'A store sells three products: Product A (cost $10, price $20, margin 50%), Product B (cost $30, price $45, margin 33.3%), and Product C (cost $50, price $75, margin 33.3%). If equal units of each are sold, total revenue = $140, total cost = $90, total profit = $50, blended margin = $50 / $140 × 100 = 35.7%. Blended margin is the weighted average across all products — useful for understanding overall business health, but it can mask underperforming products. Always analyze per-product margins separately before looking at the blended figure.',
    },
    {
      title: 'Price Increase Scenario: 5% Price Hike',
      description:
        'A product currently sells for $100 with a $60 cost (40% margin). If the retailer raises the price by 5% to $105 with no cost change, new profit = $105 − $60 = $45, new margin = $45 / $105 × 100 = 42.86%. A 5% price increase grew the margin by 2.86 percentage points. If volume stays constant, profit jumps 12.5% ($40 to $45). This is why small price increases are often described as the highest-leverage profit tool available to a small business — even modest hikes flow almost entirely to the bottom line when costs are fixed.',
    },
  ],

  faqs: [
    {
      question: "What is the difference between margin and markup?",
      answer:
        'Margin and markup are both profitability metrics, but they are calculated differently and serve different purposes. Margin is the percentage of the selling price that is profit, calculated as (Profit / Selling Price) × 100. Markup is the percentage added to the cost to get the selling price, calculated as (Profit / Cost) × 100. For example, if a product costs $60 and sells for $100, the margin is 40% but the markup is 66.67%. Confusing these two is one of the most common pricing mistakes businesses make — a "50% margin" target produces a $120 selling price on a $60 cost, while a "50% markup" target produces a $90 selling price on the same cost. The $30 per unit difference compounds quickly across thousands of sales.',
    },
    {
      question: 'What is a good profit margin for my business?',
      answer:
        'A good profit margin varies significantly by industry. Generally, a net profit margin of 10% is considered average, 20% is good, and 5% or below is low. Software companies and SaaS businesses often achieve margins of 60-80%, while grocery stores typically operate on thin margins of 1-3%. Retail businesses generally aim for margins between 20-50%. Restaurants typically run 3-15% net margins (with 60-70% of revenue going to food and labor costs). Consulting firms average 30-50%. Manufacturing falls between 10-20%. It is important to benchmark your margins against industry averages and competitors rather than aiming for a universal target — a 12% margin in grocery is exceptional, while the same 12% in software would be considered poor.',
    },
    {
      question: 'How can I improve my profit margins?',
      answer:
        'There are two primary ways to improve profit margins: increase revenue per unit or decrease costs. You can raise prices if your product offers unique value, negotiate better deals with suppliers, reduce waste in production, improve operational efficiency, or focus on higher-margin products in your lineup. Additionally, analyzing which products or services generate the best margins and shifting resources toward them can significantly improve overall profitability. Avoid the trap of simply cutting quality to reduce costs, as this can harm long-term revenue. The highest-leverage move is often a small price increase: a 5% price hike with constant costs and volume flows entirely to the bottom line. If you operate at 30% margin, that 5% price increase can boost profit by 17%.',
    },
    {
      question: 'What is the difference between gross margin and net margin?',
      answer:
        'Gross margin considers only the direct costs of producing goods or services (cost of goods sold), while net margin accounts for all business expenses including operating costs, taxes, interest, and depreciation. Gross margin shows the profitability of your core product or service before overhead, while net margin reveals the overall profitability of the entire business. For example, a company might have a healthy gross margin of 50% but a much lower net margin of 10% after accounting for rent, salaries, marketing, and other operating expenses. A common diagnostic is to compare gross margin trend vs net margin trend: if gross margin is stable but net margin is falling, your operating expenses are growing faster than revenue — a signal to scrutinize overhead.',
    },
    {
      question: 'What is a good profit margin for my industry?',
      answer:
        'Profit margins vary widely across industries and sub-sectors. Software and SaaS businesses typically see 60-80% gross margins, retail stores range from 20-50%, restaurants operate on tight 3-15% margins, grocery chains survive on 1-3%, manufacturing falls between 10-20%, and consulting firms average 30-50%. Always compare against your specific industry sub-sector and geographic region for the most accurate benchmarking, as local market conditions can significantly shift these averages. The NYU Stern dataset (updated annually by Professor Aswath Damodaran) is a free public source of industry-average margins by sector.',
    },
    {
      question: 'How often should I calculate my profit margins?',
      answer:
        'You should calculate profit margins at least monthly for ongoing financial monitoring and early detection of trends. Calculate per-product or per-service margins when making pricing decisions or evaluating your product mix, and review overall business margins quarterly for a big-picture health check. Rapid or unexpected margin changes often signal cost issues, pricing problems, or shifts in demand that require immediate attention. Many small businesses run a "margin review" the first week of every month: pull the prior month\'s revenue and COGS by product line, compute margins, and compare to the prior 3-month rolling average. A sustained 2-3 percentage point drop over 60 days warrants investigation.',
    },
    {
      question: 'What causes declining profit margins?',
      answer:
        'Declining profit margins can result from rising material or labor costs that outpace price increases, increased competition forcing price cuts, growing overhead expenses such as rent and utilities, offering too many discounts or promotions, or a shift in your product mix toward lower-margin items. Identifying the root cause quickly is critical, as sustained margin erosion can threaten the viability of your business even if revenue continues to grow. The diagnostic playbook: (1) Pull margin by product line for the last 6 months — is one product declining, or all? (2) Check supplier pricing — have input costs risen? (3) Review pricing history — did you offer more discounts? (4) Compare revenue mix — has the proportion of lower-margin sales grown? This 30-minute analysis usually surfaces the cause.',
    },
    {
      question: 'Should I use margin or markup for pricing?',
      answer:
        'Both metrics have their place: use margin to understand and communicate profitability (what percentage of your selling price is actual profit) and use markup to set prices from cost (what percentage to add on top of your cost). Many businesses use markup for day-to-day pricing decisions but track margin for financial reporting and investor presentations. Understanding both prevents common pricing mistakes, such as accidentally setting prices too low when confusing a desired margin with a markup percentage. A practical workflow: when sourcing a new product, decide the target margin (e.g., 40%), then compute the required markup (66.67%) and resulting price ($166.67 on $100 cost). Many POS systems let you enter either — make sure your team knows which one you use.',
    },
    {
      question: 'What is keystone pricing and when should I use it?',
      answer:
        'Keystone pricing is a retail markup convention where the selling price is set at double the cost — i.e., 100% markup, which equals a 50% gross margin. It originated in 19th-century retail as a simple rule of thumb and is still widely used in jewelry, gifts, and specialty retail. Keystone works well when the merchant needs to cover significant overhead (rent, staff, slow inventory turnover) with a simple mental calculation. It is less appropriate for high-volume commodities where margins are thinner (grocery, electronics) or for low-overhead online sellers who can afford to pass savings to customers. Use keystone as a starting point, then adjust up or down based on your actual operating costs and competitive pricing.',
    },
    {
      question: 'How do I calculate break-even sales volume?',
      answer:
        'Break-even volume = Fixed Costs / (Selling Price − Variable Cost per unit). The denominator (Selling Price − Variable Cost) is called the contribution margin per unit. For example, if you sell a product for $100 with $60 variable cost and $10,000 in monthly fixed costs (rent, salaries, insurance), your break-even volume = $10,000 / ($100 − $60) = 250 units per month. Below 250 units you lose money; above 250, every additional unit adds $40 to profit. Break-even analysis is the natural companion to margin calculations — knowing both your margin and your fixed costs tells you exactly how many sales you need to make the business viable.',
    },
  ],

  relatedTools: [
    { slug: 'gross-margin-calculator', title: 'Gross Margin Calculator', description: 'Calculate gross profit margin from revenue and COGS', icon: 'Percent' },
    { slug: 'markup-calculator', title: 'Markup Calculator', description: 'Calculate markup percentage from cost', icon: 'TrendingUp' },
    { slug: 'roi-calculator', title: 'ROI Calculator', description: 'Evaluate return on investment', icon: 'BarChart3' },
    { slug: 'discount-calculator', title: 'Discount Calculator', description: 'Calculate sale prices and savings', icon: 'Tag' },
    { slug: 'commission-calculator', title: 'Sales Commission Calculator', description: 'Calculate commission earnings from sales revenue', icon: 'DollarSign' },
  ],
};

export default seoData;
