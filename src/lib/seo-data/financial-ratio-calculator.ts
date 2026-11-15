import type { CalculatorSeoData } from './types';
import { SRC } from './sources';
// ---------------------------------------------------------------------------
// Financial Ratio Calculator (suite) — Phase 17: absorbs the roe, roa,
// debt-ratio, current-ratio, quick-ratio, interest-coverage and asset-turnover
// pages. Figures come from computeFinancialRatios(), the function the tabs run.
// ---------------------------------------------------------------------------
import { computeFinancialRatios, FAMILIES, formatRatio, RATIO_DEFAULTS } from '@/lib/pricing/financial-ratios';

const usd0 = (n: number) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
const r = computeFinancialRatios(RATIO_DEFAULTS);
const get = (key: string) => r.ratios.find((x) => x.key === key)!;
const fmt = (key: string) => formatRatio(get(key).value, get(key).format);
const d = RATIO_DEFAULTS;

// a stressed version of the same company: more debt, thinner profit, slower collections
// same current assets in total, but cash has turned into slow receivables
const stressed = computeFinancialRatios({ ...d, ebit: 120000, netIncome: 40000, interestExpense: 95000, totalDebt: 1150000, totalLiabilities: 1550000, equity: 350000, receivables: 420000, cash: 60000, marketableSecurities: 0 });
const sget = (key: string) => stressed.ratios.find((x) => x.key === key)!;
const sfmt = (key: string) => formatRatio(sget(key).value, sget(key).format);

const seoData = {
  breadcrumbs: [{ label: 'Calculators' }, { label: 'Financial Ratio Calculator' }],
  tableOfContents: [
    { id: 'how-to-calculate', label: 'How to Calculate' },
    { id: 'formula', label: 'Formulas' },
    { id: 'industry-benchmarks', label: 'Rules of Thumb' },
    { id: 'deep-dive-guide', label: 'Guide' },
    { id: 'worked-examples', label: 'Worked Examples' },
    { id: 'frequently-asked-questions', label: 'FAQs' },
    { id: 'related-calculators', label: 'Related Calculators' },
  ],

  howToSteps: [
    'Take the figures from one period: the income statement for the year (revenue, cost of goods sold, operating income, depreciation, interest, net income, principal repaid) and the balance sheet at the end of it (cash, securities, receivables, inventory, other current assets, total assets, current liabilities, payables, interest-bearing debt, total liabilities, equity).',
    'Enter them once. All 23 ratios recalculate together; anything you leave at zero simply blanks the ratios that need it, and the calculator warns if assets, liabilities and equity do not balance.',
    'Use the tabs to read one family at a time — liquidity, leverage and coverage, profitability, efficiency — or "All ratios". Each card shows the value, the formula and a rule-of-thumb range with a strong / acceptable / watch reading where one applies.',
    'On the profitability tab, the DuPont line splits return on equity into net margin × asset turnover × equity multiplier, so you can see whether a high ROE comes from operations or from borrowing.',
    'Links from the old ROE, ROA, debt ratio, current ratio, quick ratio, interest coverage and asset turnover pages open the matching tab here.',
  ],

  formula:
    'Liquidity: Current = Current assets ÷ Current liabilities · Quick = (Cash + Securities + Receivables) ÷ Current liabilities · Cash ratio = (Cash + Securities) ÷ Current liabilities\nLeverage: Debt ratio = Total liabilities ÷ Total assets · Debt-to-equity = Debt ÷ Equity · Equity multiplier = Assets ÷ Equity · Interest coverage = EBIT ÷ Interest · DSCR = EBITDA ÷ (Interest + Principal) · Net debt ÷ EBITDA\nProfitability: Gross, operating and net margin ÷ Revenue · ROA = Net income ÷ Assets · ROE = Net income ÷ Equity · ROCE = EBIT ÷ (Assets − Current liabilities)\nEfficiency: Asset turnover = Revenue ÷ Assets · Inventory turnover = COGS ÷ Inventory · DIO = 365 ÷ Inventory turnover · DSO = Receivables ÷ Revenue × 365 · DPO = Payables ÷ COGS × 365 · Cash conversion cycle = DIO + DSO − DPO\nDuPont: ROE = Net margin × Asset turnover × Equity multiplier',

  formulaDescription:
    'Ratios turn two statements into a handful of comparable numbers. Liquidity ratios compare what is due within a year with what can pay it. Leverage ratios compare borrowed money with assets, equity and earnings. Profitability ratios compare profit with the sales, assets and equity that produced it. Efficiency ratios measure how many times assets, inventory and receivables turn over, and the cash conversion cycle turns the last three into days. ' +
    'This page uses period-end balances; analysts often use the average of opening and closing balances for turnover and return ratios, which smooths growth. Use whichever you use consistently, and compare with your own prior periods before comparing with anyone else.',

  benchmarkTables: [
    {
      title: 'Rules of Thumb by Ratio',
      description: 'The ranges the calculator uses for its strong / acceptable / watch readings. They are generalist yardsticks; the sector dataset linked in the sources shows how far real industries sit from them.',
      headers: ['Ratio', 'Formula', 'Rule of thumb', 'Why it matters'],
      rows: r.ratios.map((x) => [x.label, x.formula, x.range, x.note]),
    },
    {
      title: `The Same Company Healthy and Stressed (${usd0(d.revenue)} revenue, ${usd0(d.totalAssets)} assets)`,
      description: 'The calculator\'s default example next to a version with more debt, a thinner profit and slower collections. Revenue and total assets are unchanged; read what moves.',
      headers: ['Ratio', 'Healthy', 'Stressed', 'What changed'],
      rows: [
        ['Current ratio', fmt('current'), sfmt('current'), 'Unchanged — the same current assets, so the ratio hides the problem'],
        ['Quick ratio', fmt('quick'), sfmt('quick'), 'Also unchanged: cash became receivables, which the quick ratio still counts'],
        ['Cash ratio', fmt('cash'), sfmt('cash'), 'This is where the cash drain shows'],
        ['Debt ratio', fmt('debt-ratio'), sfmt('debt-ratio'), `Liabilities ${usd0(d.totalLiabilities)} → ${usd0(1550000)}`],
        ['Debt-to-equity', fmt('debt-to-equity'), sfmt('debt-to-equity'), 'Debt up, equity down'],
        ['Interest coverage', fmt('interest-coverage'), sfmt('interest-coverage'), 'Lower EBIT, higher interest'],
        ['DSCR', fmt('dscr'), sfmt('dscr'), 'Below the 1.25 most loan covenants require'],
        ['Net margin', fmt('net-margin'), sfmt('net-margin'), `Net income ${usd0(d.netIncome)} → ${usd0(40000)}`],
        ['ROE', fmt('roe'), sfmt('roe'), 'Smaller profit on a much smaller equity base'],
        ['DSO', fmt('dso'), sfmt('dso'), 'Customers taking longer to pay'],
        ['Cash conversion cycle', fmt('ccc'), sfmt('ccc'), 'More days of cash tied up'],
      ],
    },
  ],

  deepDiveSections: [
    {
      title: 'Four Families, Four Questions',
      paragraphs: [
        `Every ratio answers one of four questions. ${FAMILIES.map((f) => `${f.label}: ${f.question.toLowerCase()}`).join(' ')} The default example — a ${usd0(d.revenue)} business with ${usd0(d.totalAssets)} of assets — answers them like this: current ratio ${fmt('current')} and quick ratio ${fmt('quick')} (liquid); debt ratio ${fmt('debt-ratio')}, debt-to-equity ${fmt('debt-to-equity')} and interest coverage ${fmt('interest-coverage')} (moderately geared, interest well covered); net margin ${fmt('net-margin')}, ROA ${fmt('roa')} and ROE ${fmt('roe')} (profitable); asset turnover ${fmt('asset-turnover')}, inventory turnover ${fmt('inventory-turnover')} and a ${fmt('ccc')} cash conversion cycle (reasonably efficient).`,
        'Read them in that order when something is wrong. A liquidity problem is urgent and visible in weeks; a leverage problem is a question of whether the business survives a bad year; profitability and efficiency problems are what you fix once the first two are stable. And read them as a set: the stressed version in the table above keeps a passable current ratio while its coverage ratios collapse, which is exactly the pattern a lender looks for.',
      ],
    },
    {
      title: 'DuPont: Where Does Return on Equity Come From?',
      paragraphs: [
        `Return on equity is the number owners care about, and the easiest one to flatter. The DuPont identity breaks it into three legs: net margin (profit per dollar of sales), asset turnover (sales per dollar of assets) and the equity multiplier (assets per dollar of equity, which is leverage). For the example, ${formatRatio(r.dupont.netMargin, '%')} × ${formatRatio(r.dupont.assetTurnover, 'x')} × ${formatRatio(r.dupont.equityMultiplier, 'x')} = ${formatRatio(r.dupont.roe, '%')}.`,
        `The stressed company has a lower ROE (${sfmt('roe')}) despite an equity multiplier of ${formatRatio(stressed.dupont.equityMultiplier, 'x')}; had its profit held up, the extra leverage would have pushed ROE above the healthy version's — the same operating business reporting a higher owner return purely because it borrowed more. Two companies with the same ROE and different legs are different businesses: a grocer earns it through turnover, a software firm through margin, a bank through the multiplier.`,
      ],
    },
    {
      title: 'Why Rules of Thumb Need an Industry Next to Them',
      paragraphs: [
        'A current ratio of 1.0 is alarming for a manufacturer and normal for a restaurant that sells for cash and pays suppliers on terms. A debt-to-equity of 2.0 is reckless for a consultancy and conservative for a utility. An asset turnover of 0.5 is poor for a retailer and excellent for a railroad. The calculator\'s readings use generalist ranges because they have to work for everyone; treat a "watch" as a prompt to look up your sector, not a verdict.',
        'The most useful comparison is your own history: the same ratios for the last three to five periods, built from the same definitions, show direction. The second most useful is a public competitor\'s filings. Sector averages, such as the dataset NYU Stern publishes each year from company filings (linked in the sources), are the third.',
      ],
    },
  ],

  workedExamples: [
    {
      title: `Full Ratio Set for a ${usd0(d.revenue)} Business`,
      description: `Income statement: revenue ${usd0(d.revenue)}, COGS ${usd0(d.cogs)}, EBIT ${usd0(d.ebit)}, D&A ${usd0(d.depreciation)}, interest ${usd0(d.interestExpense)}, net income ${usd0(d.netIncome)}, principal repaid ${usd0(d.principalRepayments)}. Balance sheet: cash ${usd0(d.cash)}, securities ${usd0(d.marketableSecurities)}, receivables ${usd0(d.receivables)}, inventory ${usd0(d.inventory)}, other current ${usd0(d.otherCurrentAssets)}, total assets ${usd0(d.totalAssets)}, current liabilities ${usd0(d.currentLiabilities)} (payables ${usd0(d.accountsPayable)}), debt ${usd0(d.totalDebt)}, total liabilities ${usd0(d.totalLiabilities)}, equity ${usd0(d.equity)}. Results: ${r.ratios.map((x) => `${x.label} ${formatRatio(x.value, x.format)}`).join('; ')}.`,
    },
    {
      title: 'Current vs. Quick Ratio: Why Inventory Is Left Out',
      description: `Current assets of ${usd0(d.cash + d.marketableSecurities + d.receivables + d.inventory + d.otherCurrentAssets)} against ${usd0(d.currentLiabilities)} of current liabilities give a current ratio of ${fmt('current')}. Remove ${usd0(d.inventory)} of inventory and ${usd0(d.otherCurrentAssets)} of other current assets and the quick ratio is ${fmt('quick')}: the business can still cover its bills without selling a unit. The cash ratio, ${fmt('cash')}, is the strictest view.`,
    },
    {
      title: 'Interest Coverage and DSCR on the Same Loan',
      description: `EBIT ${usd0(d.ebit)} ÷ interest ${usd0(d.interestExpense)} = ${fmt('interest-coverage')} times interest earned. Add back ${usd0(d.depreciation)} of depreciation for EBITDA ${usd0(d.ebit + d.depreciation)} and divide by interest plus ${usd0(d.principalRepayments)} of principal (${usd0(d.interestExpense + d.principalRepayments)}): DSCR ${fmt('dscr')}, above the 1.25 a bank typically requires. The stressed version falls to ${sfmt('interest-coverage')} coverage and ${sfmt('dscr')} DSCR.`,
    },
    {
      title: 'Cash Conversion Cycle from Three Turnover Ratios',
      description: `Inventory turnover ${fmt('inventory-turnover')} → ${fmt('dio')} of inventory. Receivables ${usd0(d.receivables)} ÷ revenue × 365 = ${fmt('dso')}. Payables ${usd0(d.accountsPayable)} ÷ COGS × 365 = ${fmt('dpo')}. Cash conversion cycle = DIO + DSO − DPO = ${fmt('ccc')}: the business funds roughly that many days of operations before the cash comes back.`,
    },
  ],

  faqs: [
    { question: 'What is a good current ratio?', answer: `Between about 1.5 and 3.0 for most businesses: enough cover to pay the year's bills without hoarding cash or inventory. Below 1.0 means current liabilities exceed current assets. The example company sits at ${fmt('current')}. Cash businesses such as restaurants and grocers run lower comfortably; businesses with slow-moving inventory need more.` },
    { question: 'What is the difference between the current ratio and the quick ratio?', answer: `The quick (acid-test) ratio drops inventory and other less liquid current assets, so it asks whether the bills can be paid without a sale. The example is ${fmt('current')} current but ${fmt('quick')} quick; a large gap between the two means liquidity depends on moving stock. A quick ratio of 1.0 or more is the usual yardstick.` },
    { question: 'What is a healthy debt ratio or debt-to-equity ratio?', answer: `Debt ratio (total liabilities ÷ total assets) below about 0.5 and debt-to-equity (interest-bearing debt ÷ equity) below 1.0 to 2.0 are generalist guides; the example is ${fmt('debt-ratio')} and ${fmt('debt-to-equity')}. Capital-intensive industries and regulated utilities carry more; service businesses should carry less. Lenders also look at the equity multiplier (${fmt('equity-multiplier')} here) and net debt to EBITDA (${fmt('net-debt-ebitda')}).` },
    { question: 'What is interest coverage and how is it different from DSCR?', answer: `Interest coverage (times interest earned) is EBIT ÷ interest expense: ${fmt('interest-coverage')} in the example, where 3.0 or more is comfortable and under 1.5 is a warning. Debt service coverage goes further by dividing EBITDA by interest plus scheduled principal: ${fmt('dscr')} here. Banks write DSCR into loan covenants, typically at 1.20 to 1.35, because principal has to be paid too.` },
    { question: 'What is a good return on equity (ROE) and return on assets (ROA)?', answer: `ROE of 15 to 20% and ROA of 5% or more are the usual yardsticks for established businesses; the example earns ${fmt('roe')} and ${fmt('roa')}. The gap between them is leverage: ROE = ROA × equity multiplier. Use the DuPont line on the profitability tab to see whether ROE comes from margin, turnover or borrowing.` },
    { question: 'What is the DuPont analysis?', answer: `A way of splitting ROE into net margin × asset turnover × equity multiplier. For the example: ${formatRatio(r.dupont.netMargin, '%')} × ${formatRatio(r.dupont.assetTurnover, 'x')} × ${formatRatio(r.dupont.equityMultiplier, 'x')} = ${formatRatio(r.dupont.roe, '%')}. It shows which lever a business pulls — pricing, volume or debt — and why two companies with the same ROE can be very different risks.` },
    { question: 'What is asset turnover and what is a good number?', answer: `Revenue ÷ total assets, ${fmt('asset-turnover')} for the example. It varies more by industry than any other ratio: grocers and staffing firms exceed 3, manufacturers sit near 1, utilities and real estate below 0.5. Compare with peers and your own trend; a falling turnover with flat sales means assets are growing faster than the business.` },
    { question: 'How do I calculate the cash conversion cycle?', answer: `Days inventory outstanding + days sales outstanding − days payables outstanding. The example: ${fmt('dio')} + ${fmt('dso')} − ${fmt('dpo')} = ${fmt('ccc')}. Shorter is better; a negative cycle (customers pay before suppliers are paid) is the holy grail of retail and subscription businesses.` },
    { question: 'Should I use year-end or average balances?', answer: 'Textbooks use the average of opening and closing balances for turnover and return ratios so that growth during the year does not distort them; this calculator uses period-end balances for simplicity and because small-business balance sheets rarely swing enough to matter. Either is fine if you do it the same way every period. Liquidity and leverage ratios are always point-in-time.' },
    { question: 'Where did the ROE, ROA, debt ratio, current ratio, quick ratio, interest coverage and asset turnover calculators go?', answer: 'They are tabs on this page — profitability for ROE and ROA, leverage for debt ratio and interest coverage, liquidity for current and quick ratio, efficiency for asset turnover — and their links open the right tab. Entering the statements once gives you all of them, plus the ratios each old page lacked.' },
  ],

  relatedTools: [
    { slug: 'profit-margin-calculator', title: 'Profit Margin Calculator', description: 'Margin ladder, contribution margin and sector margin ranges', icon: 'Percent' },
    { slug: 'working-capital-calculator', title: 'Working Capital Calculator', description: 'The dollar view of liquidity', icon: 'Wallet' },
    { slug: 'inventory-valuation-calculator', title: 'Inventory Valuation Calculator', description: 'FIFO, LIFO and weighted average behind the inventory figure', icon: 'Boxes' },
    { slug: 'roi-calculator', title: 'ROI Calculator', description: 'Return on a single investment or project', icon: 'BarChart3' },
    { slug: 'break-even-calculator', title: 'Break-Even Calculator', description: 'Fixed costs, contribution and the break-even point', icon: 'Target' },
    { slug: 'ebitda-margin-calculator', title: 'EBITDA Margin Calculator', description: 'Operating cash profitability before financing', icon: 'LineChart' },
  ],
  sources: [SRC.nyuSternData],
} satisfies CalculatorSeoData;
export default seoData;
