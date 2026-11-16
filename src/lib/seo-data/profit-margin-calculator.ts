import type { CalculatorSeoData } from './types';
import { SRC } from './sources';
// ---------------------------------------------------------------------------
// Profit Margin & Markup Calculator — SEO content. Phase 17 folded the
// net-margin, operating-margin, contribution-margin, selling-price and
// wholesale-price pages into this one as tabs; the figures for those sections
// are generated from src/lib/pricing/margins.ts, the code the tabs run.
// ---------------------------------------------------------------------------
import {
  computeContribution,
  computeMarginLadder,
  computeWholesaleChain,
  CONTRIBUTION_DEFAULTS,
  MARGIN_LADDER_DEFAULTS,
  MARGIN_RANGES,
  WHOLESALE_DEFAULTS,
} from '@/lib/pricing/margins';

const usd = (n: number) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
const usd0 = (n: number) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
const pct = (n: number, d = 1) => `${n.toFixed(d)}%`;

const ladder = computeMarginLadder(MARGIN_LADDER_DEFAULTS);
const cm = computeContribution(CONTRIBUTION_DEFAULTS);
const cmPriceCut = computeContribution({ ...CONTRIBUTION_DEFAULTS, price: 45 });
const keystone = computeWholesaleChain(WHOLESALE_DEFAULTS);
const withDistributor = computeWholesaleChain({ ...WHOLESALE_DEFAULTS, distributorMarginPct: 20 });
const boutique = computeWholesaleChain({ ...WHOLESALE_DEFAULTS, retailMultiplier: 2.3 });

const seoData = {
  breadcrumbs: [{ label: 'Calculators' }, { label: 'Profit Margin & Markup Calculator' }],
  tableOfContents: [
    { id: 'how-to-calculate', label: 'How to Calculate' },
    { id: 'formula', label: 'Formula' },
    { id: 'industry-benchmarks', label: 'Benchmarks' },
    { id: 'deep-dive-guide', label: 'Guide' },
    { id: 'worked-examples', label: 'Worked Examples' },
    { id: 'frequently-asked-questions', label: 'FAQs' },
    { id: 'related-calculators', label: 'Related Calculators' },
  ],

  howToSteps: [
    'Pick the tab that matches what you know. "Unit Cost & Price" and "Total Cost & Revenue" turn cost and price (or revenue) into profit, margin and markup; "Target Margin Pricing" works backwards from the margin you want to the price you must charge.',
    '"Gross, Operating & Net" takes an income statement — revenue, cost of goods sold, operating expenses, depreciation, interest and taxes — and walks it down to gross profit, EBITDA, operating income, pre-tax and net income, each as a share of revenue, with typical sector ranges to compare against.',
    '"Contribution & Break-Even" takes price, variable cost per unit, units and fixed costs, and returns contribution margin per unit and ratio, total contribution, operating income, break-even units and revenue, the margin of safety and operating leverage.',
    '"Wholesale → Retail" starts from your cost to make or buy a unit, applies your wholesale margin, an optional distributor margin and the retailer\'s multiplier (2× is keystone), and shows every price in the chain and who keeps each slice of the retail dollar.',
    'Results update as you type. The health gauge on the margin tabs flags margins under 10% as tight and over 25% as healthy; the sector table on the statement tab is a rule of thumb, with the NYU Stern dataset linked for measured averages. Save A / Save B compares two unit-margin scenarios, and every tab keeps its own history.',
  ],

  formula:
    'Margin % = (Price − Cost) ÷ Price × 100   ·   Markup % = (Price − Cost) ÷ Cost × 100   ·   Price for a target margin = Cost ÷ (1 − Margin)\nGross margin = (Revenue − COGS) ÷ Revenue · Operating margin = (Gross profit − Opex − D&A) ÷ Revenue · Net margin = Net income ÷ Revenue\nContribution margin = Price − Variable cost · CM ratio = CM ÷ Price · Break-even units = Fixed costs ÷ CM per unit\nWholesale price = Cost ÷ (1 − Wholesale margin) · Retail price = Wholesale × Retailer multiplier (2 = keystone)',

  formulaDescription:
    'Margin divides profit by the selling price; markup divides the same profit by cost. A $60 cost sold at $100 is a 40% margin but a 66.7% markup, and a 50% markup is only a 33.3% margin, so the two are never interchangeable. ' +
    'Gross, operating and net margin are the same idea applied at three depths of the income statement: after cost of goods sold, after all operating costs and depreciation, and after interest and tax. ' +
    'Contribution margin keeps only the costs that change with each unit, which is why it, and not gross margin, is what break-even and pricing decisions rest on. ' +
    'In a wholesale chain each party applies its own margin to the price it pays, so a 50% maker margin followed by a 2× retailer multiplier turns a $12 cost into a $48 shelf price.',

  benchmarkTables: [
    {
      title: 'Gross, Operating and Net Margin: Typical Ranges by Sector',
      description: 'Rules of thumb for reading your own margin ladder. Measured averages by industry are published yearly in the NYU Stern dataset linked in the sources.',
      headers: ['Sector', 'Gross margin', 'Operating margin', 'Net margin', 'What drives it'],
      rows: MARGIN_RANGES.map((r) => [r.label, r.gross, r.operating, r.net, r.note]),
    },
    {
      title: `Margin Ladder for a ${usd0(MARGIN_LADDER_DEFAULTS.revenue)} Business (the Statement Tab's Example)`,
      headers: ['Line', 'Amount', '% of revenue'],
      rows: [
        ['Revenue', usd(MARGIN_LADDER_DEFAULTS.revenue), '100.0%'],
        ['− Cost of goods sold', usd(MARGIN_LADDER_DEFAULTS.cogs), pct(ladder.layers[0].pctOfRevenue)],
        ['= Gross profit', usd(ladder.grossProfit), pct(ladder.grossMargin)],
        ['− Operating expenses', usd(MARGIN_LADDER_DEFAULTS.operatingExpenses), pct(ladder.layers[1].pctOfRevenue)],
        ['= EBITDA', usd(ladder.ebitda), pct(ladder.ebitdaMargin)],
        ['− Depreciation & amortization', usd(MARGIN_LADDER_DEFAULTS.depreciation), pct(ladder.layers[2].pctOfRevenue)],
        ['= Operating income (EBIT)', usd(ladder.operatingIncome), pct(ladder.operatingMargin)],
        ['− Interest', usd(MARGIN_LADDER_DEFAULTS.interest), pct(ladder.layers[3].pctOfRevenue)],
        ['− Income taxes', usd(MARGIN_LADDER_DEFAULTS.taxes), pct(ladder.layers[4].pctOfRevenue)],
        ['= Net income', usd(ladder.netIncome), pct(ladder.netMargin)],
      ],
      note: 'Each margin is the running subtotal divided by revenue. The gap between gross and operating margin is the cost of running the business; the gap between operating and net is financing and tax.',
    },
    {
      title: 'Margin vs. Markup Conversion Table',
      headers: ['Markup on cost', 'Equivalent margin on price', 'Example: $60 cost sells at'],
      rows: [10, 20, 25, 33.33, 40, 50, 66.67, 100, 150, 200].map((mu) => {
        const price = 60 * (1 + mu / 100);
        return [`${mu}%`, pct(((price - 60) / price) * 100), usd(price)];
      }),
      note: 'Margin = Markup ÷ (1 + Markup); Markup = Margin ÷ (1 − Margin). A 100% markup (keystone) is a 50% margin.',
    },
  ],

  deepDiveSections: [
    {
      title: 'Three Margins, One Income Statement',
      paragraphs: [
        `Gross margin asks whether the product itself makes money; operating margin asks whether the business that sells it does; net margin asks what is left for the owners after the bank and the tax authority. The statement tab's example business books ${usd0(MARGIN_LADDER_DEFAULTS.revenue)} of revenue against ${usd0(MARGIN_LADDER_DEFAULTS.cogs)} of cost of goods sold for a ${pct(ladder.grossMargin)} gross margin, spends ${usd0(MARGIN_LADDER_DEFAULTS.operatingExpenses)} running the company and ${usd0(MARGIN_LADDER_DEFAULTS.depreciation)} on depreciation for a ${pct(ladder.operatingMargin)} operating margin, and keeps ${usd0(ladder.netIncome)} (${pct(ladder.netMargin)}) after ${usd0(MARGIN_LADDER_DEFAULTS.interest)} of interest and ${usd0(MARGIN_LADDER_DEFAULTS.taxes)} of tax.`,
        'Read them together. A healthy gross margin with a thin operating margin points at overhead, headcount or marketing spend, not pricing. A good operating margin with a poor net margin points at debt or tax structure. And a falling gross margin with everything else steady is a cost-of-goods or discounting problem that no amount of expense control fixes. EBITDA, shown between gross profit and operating income, strips out depreciation so capital-heavy businesses can be compared with asset-light ones.',
      ],
    },
    {
      title: 'Contribution Margin Is the Number Pricing Decisions Actually Use',
      paragraphs: [
        `Gross margin includes costs that do not change when you sell one more unit. Contribution margin keeps only the variable ones, which makes it the right basis for break-even, discounting and "should we take this order" questions. The contribution tab's example sells at ${usd(CONTRIBUTION_DEFAULTS.price)} with ${usd(CONTRIBUTION_DEFAULTS.variableCost)} of variable cost, a ${usd(cm.cmPerUnit)} contribution per unit (${pct(cm.cmRatio)}). With ${usd0(CONTRIBUTION_DEFAULTS.fixedCosts)} of fixed costs the break-even is ${cm.breakEvenUnits?.toLocaleString('en-US')} units (${usd0(cm.breakEvenRevenue ?? 0)} of revenue); at ${CONTRIBUTION_DEFAULTS.units.toLocaleString('en-US')} units the business earns ${usd0(cm.operatingIncome)} and has a ${pct(cm.marginOfSafety ?? 0)} margin of safety.`,
        `The same tab shows why discounts are dangerous when the contribution margin is modest. Cutting the price 10% to ${usd(45)} drops the contribution per unit to ${usd(cmPriceCut.cmPerUnit)} and pushes break-even to ${cmPriceCut.breakEvenUnits?.toLocaleString('en-US')} units — ${(((cmPriceCut.breakEvenUnits ?? 0) / (cm.breakEvenUnits ?? 1) - 1) * 100).toFixed(0)}% more units just to stand still. Operating leverage (total contribution ÷ operating income, ${cm.operatingLeverage}× in the example) says how hard a sales change hits profit: a 10% rise in volume lifts operating income by roughly ${((cm.operatingLeverage ?? 0) * 10).toFixed(0)}%, and a 10% fall cuts it by the same.`,
      ],
    },
    {
      title: 'From Cost to Shelf Price: How Wholesale Chains Stack Margins',
      paragraphs: [
        `Each party in a distribution chain applies its margin to the price it pays, so margins compound. The wholesale tab's keystone example starts at ${usd(WHOLESALE_DEFAULTS.unitCost)} to make, sells to retailers at ${usd(keystone.wholesalePrice)} (a ${WHOLESALE_DEFAULTS.wholesaleMarginPct}% margin on the wholesale price, ${pct(keystone.makerMarkup, 0)} markup on cost) and reaches the shelf at ${usd(keystone.retailPrice)} after the retailer doubles it. Of each retail dollar, the maker keeps ${pct(keystone.shares[1].share * 100, 0)}, the retailer ${pct(keystone.shares[2].share * 100, 0)}, and ${pct(keystone.shares[0].share * 100, 0)} is the cost of the goods.`,
        `Add a distributor taking 20% and the shelf price rises to ${usd(withDistributor.retailPrice)} for the same ${usd(WHOLESALE_DEFAULTS.unitCost)} product, with the distributor keeping ${usd(withDistributor.distributorProfit ?? 0)} a unit; a boutique using a 2.3× multiplier instead of keystone prices the direct-to-retailer version at ${usd(boutique.retailPrice)}. This is why makers set their wholesale price first and let the retail price fall out of it: a product whose keystone retail price is above what the market will pay cannot be fixed by the retailer, only by cost or by cutting out a layer and selling direct.`,
      ],
    },
  ],

  workedExamples: [
    { title: 'Retail Product: $60 Cost, $100 Selling Price', description: 'A retailer buys a product for $60 wholesale and sells it for $100. Profit = $100 − $60 = $40. Profit margin = $40 ÷ $100 × 100 = 40%. Markup = $40 ÷ $60 × 100 = 66.67%. A 40% margin is healthy for retail: specialty stores typically operate at 40–50% margins, grocery at 20–30%.' },
    { title: 'SaaS Subscription: $25 Cost, $100 Revenue', description: 'A SaaS company charges $100 a month per customer; hosting, payment processing and support average $25. Profit = $75, margin = 75%. Software routinely runs 70–85% gross margins because the cost to serve one more customer is small; the operating margin depends on how much goes back into sales and engineering.' },
    { title: 'Target Margin Pricing: $45 Cost, 55% Margin', description: 'Price = Cost ÷ (1 − Margin) = $45 ÷ 0.45 = $100. Profit = $55, markup = 122%. Entering 55% markup instead would give only $69.75 and a 35.5% margin — the most common pricing mistake.' },
    {
      title: `Income Statement: ${usd0(MARGIN_LADDER_DEFAULTS.revenue)} Revenue`,
      description: `COGS ${usd0(MARGIN_LADDER_DEFAULTS.cogs)} → gross profit ${usd0(ladder.grossProfit)} (${pct(ladder.grossMargin)}). Operating expenses ${usd0(MARGIN_LADDER_DEFAULTS.operatingExpenses)} → EBITDA ${usd0(ladder.ebitda)} (${pct(ladder.ebitdaMargin)}). Depreciation ${usd0(MARGIN_LADDER_DEFAULTS.depreciation)} → operating income ${usd0(ladder.operatingIncome)} (${pct(ladder.operatingMargin)}). Interest ${usd0(MARGIN_LADDER_DEFAULTS.interest)} and tax ${usd0(MARGIN_LADDER_DEFAULTS.taxes)} → net income ${usd0(ladder.netIncome)} (${pct(ladder.netMargin)}).`,
    },
    {
      title: `Contribution Margin and Break-Even: ${usd(CONTRIBUTION_DEFAULTS.price)} Price, ${usd(CONTRIBUTION_DEFAULTS.variableCost)} Variable Cost`,
      description: `Contribution ${usd(cm.cmPerUnit)} a unit (${pct(cm.cmRatio)} ratio). Fixed costs ${usd0(CONTRIBUTION_DEFAULTS.fixedCosts)} ÷ ${usd(cm.cmPerUnit)} = ${cm.breakEvenUnits} break-even units (${usd0(cm.breakEvenRevenue ?? 0)} revenue). Selling ${CONTRIBUTION_DEFAULTS.units.toLocaleString('en-US')} units: total contribution ${usd0(cm.totalContribution)}, operating income ${usd0(cm.operatingIncome)}, margin of safety ${pct(cm.marginOfSafety ?? 0)}, operating leverage ${cm.operatingLeverage}×. A 10% price cut to ${usd(45)} raises break-even to ${cmPriceCut.breakEvenUnits} units.`,
    },
    {
      title: `Keystone Wholesale Chain: ${usd(WHOLESALE_DEFAULTS.unitCost)} Cost`,
      description: `Wholesale price = ${usd(WHOLESALE_DEFAULTS.unitCost)} ÷ (1 − 0.50) = ${usd(keystone.wholesalePrice)} (maker keeps ${usd(keystone.makerProfit)}, ${pct(keystone.makerMarkup, 0)} markup). Retail = ${usd(keystone.wholesalePrice)} × 2 = ${usd(keystone.retailPrice)} (retailer keeps ${usd(keystone.retailerProfit)}, ${pct(keystone.retailerMargin, 0)} margin). With a 20% distributor: distributor price ${usd(withDistributor.distributorPrice ?? 0)}, retail ${usd(withDistributor.retailPrice)}. Boutique 2.3× instead of keystone: retail ${usd(boutique.retailPrice)}.`,
    },
    { title: 'Price Increase Scenario: 5% Price Hike', description: 'A product sells for $100 with a $60 cost (40% margin). Raising the price 5% to $105 with no cost change gives $45 profit and a 42.86% margin: a 5% price increase grew the margin by 2.86 points and, at constant volume, profit by 12.5%.' },
  ],

  faqs: [
    { question: 'What is the difference between margin and markup?', answer: 'Margin is profit as a share of the selling price: (Price − Cost) ÷ Price. Markup is the same profit as a share of cost: (Price − Cost) ÷ Cost. A $60 cost sold at $100 is a 40% margin and a 66.67% markup. Use markup to set a price from a cost and margin to judge profitability; the conversion table above shows that a 100% markup is only a 50% margin.' },
    { question: 'What is a good profit margin?', answer: 'It depends on which margin and which industry. Net margins of about 5% are thin, 10% average and 20% strong for most businesses, but grocery runs on 1–3% net while software can exceed 20%. The statement tab compares your gross, operating and net margins with typical sector ranges; the NYU Stern margin dataset in the sources has measured averages by industry.' },
    { question: 'What is the difference between gross, operating and net margin?', answer: `Gross margin is revenue minus cost of goods sold, divided by revenue — the profitability of the product itself. Operating margin also subtracts operating expenses and depreciation — the profitability of running the business. Net margin further subtracts interest and taxes — what the owners keep. The example on this page is ${pct(ladder.grossMargin)} gross, ${pct(ladder.operatingMargin)} operating and ${pct(ladder.netMargin)} net on ${usd0(MARGIN_LADDER_DEFAULTS.revenue)} of revenue.` },
    { question: 'What is operating margin and how is it different from EBITDA margin?', answer: 'Operating margin is operating income (EBIT: earnings before interest and taxes) divided by revenue. EBITDA margin adds depreciation and amortization back, so it is always equal to or higher than operating margin and is used to compare businesses with different levels of equipment and acquisitions. The statement tab shows both.' },
    { question: 'What is contribution margin?', answer: `Selling price minus variable cost per unit — the amount each sale contributes toward fixed costs and then profit. The ratio version (contribution ÷ price) tells you how much of each revenue dollar is available to cover fixed costs. In the example, ${usd(CONTRIBUTION_DEFAULTS.price)} − ${usd(CONTRIBUTION_DEFAULTS.variableCost)} = ${usd(cm.cmPerUnit)} per unit, a ${pct(cm.cmRatio)} ratio. It differs from gross margin because gross margin includes fixed production costs such as factory rent.` },
    { question: 'How do I calculate break-even units?', answer: `Divide fixed costs by the contribution margin per unit: ${usd0(CONTRIBUTION_DEFAULTS.fixedCosts)} ÷ ${usd(cm.cmPerUnit)} = ${cm.breakEvenUnits} units, or ${usd0(cm.breakEvenRevenue ?? 0)} of revenue. Units above break-even are your margin of safety; the tab also reports operating leverage, which shows how much a change in sales moves profit.` },
    { question: 'How do you calculate a selling price from cost and margin?', answer: 'Price = Cost ÷ (1 − target margin). For a $45 cost and a 55% margin, $45 ÷ 0.45 = $100. Do not multiply cost by (1 + 55%): that is a markup, and it gives $69.75 with only a 35.5% margin. The "Target Margin Pricing" tab does the division for you and shows both figures.' },
    { question: 'How do I set a wholesale price?', answer: `Decide the margin you need on the wholesale price and divide your unit cost by (1 − that margin): ${usd(WHOLESALE_DEFAULTS.unitCost)} ÷ (1 − 0.50) = ${usd(keystone.wholesalePrice)}. Then check the shelf price the retailer will set — usually 2× your wholesale price (keystone), 2.2–2.5× in boutiques, less in grocery and online marketplaces — and make sure the market will pay it. If it will not, the fix is cost or fewer layers, not asking the retailer to take less.` },
    { question: 'What is keystone pricing?', answer: 'A retail convention of setting the shelf price at double the wholesale cost: a 100% markup, which is a 50% retail margin. It dates from 19th-century retail and remains common in gifts, apparel, jewelry and specialty stores. The wholesale tab has keystone, boutique, grocery and marketplace presets so you can see the shelf price each implies.' },
    { question: 'Should I sell wholesale or direct to consumers?', answer: `Wholesale gives up margin for volume and reach: on the keystone example you keep ${usd(keystone.makerProfit)} of a ${usd(keystone.retailPrice)} shelf price. Selling direct at the same ${usd(keystone.retailPrice)} keeps ${usd(keystone.retailPrice - WHOLESALE_DEFAULTS.unitCost)} before the costs direct sales add — marketing, payment fees, shipping, returns and customer service — which often eat most of the difference. Many brands do both and keep prices consistent so retailers are not undercut.` },
    { question: 'How often should I calculate my margins?', answer: 'Monthly for the gross and operating margins, so a cost or discounting problem shows up within a quarter; per product or per deal when you price something; and yearly for the full margin ladder against sector benchmarks. Track the trend, because a margin that is drifting down is more informative than any single reading.' },
    { question: 'Where did the net margin, operating margin, contribution margin, selling price and wholesale price calculators go?', answer: 'They are tabs on this page: "Gross, Operating & Net" for the two margin pages, "Contribution & Break-Even", "Target Margin Pricing" for selling price, and "Wholesale → Retail". Their links redirect to the right tab and each tab keeps its own saved history.' },
  ],

  relatedTools: [
    { slug: 'gross-margin-calculator', title: 'Gross Margin Calculator', description: 'Gross profit and margin from revenue and COGS', icon: 'Percent' },
    { slug: 'markup-calculator', title: 'Markup Calculator', description: 'Markup percentage from cost, and cost from a marked-up price', icon: 'TrendingUp' },
    { slug: 'break-even-calculator', title: 'Break-Even Calculator', description: 'Break-even point from fixed costs and unit economics', icon: 'Target' },
    { slug: 'labor-cost-calculator', title: 'Labor Cost Calculator', description: 'Loaded employee and team cost to feed your cost lines', icon: 'Briefcase' },
    { slug: 'discount-calculator', title: 'Discount Calculator', description: 'Sale prices, stacked discounts and what they do to margin', icon: 'Tag' },
    { slug: 'roi-calculator', title: 'ROI Calculator', description: 'Return on investment with annualized figures', icon: 'BarChart3' },
  ],
  sources: [SRC.nyuSternMargins],
} satisfies CalculatorSeoData;
export default seoData;
