import type { CalculatorSeoData } from './types';
const seoData = {
  breadcrumbs: [{ label: 'Calculators' }, { label: 'Burn Rate Calculator' }],
  tableOfContents: [
    { id: 'how-to-calculate', label: 'How to Calculate' },
    { id: 'formula', label: 'Formula' },
    { id: 'industry-benchmarks', label: '2026 Startup Burn & Runway Benchmarks' },
    { id: 'deep-dive-guide', label: 'Gross Burn, Net Burn & Burn Multiple Guide' },
    { id: 'worked-examples', label: 'Worked Examples' },
    { id: 'frequently-asked-questions', label: 'FAQs' },
    { id: 'related-calculators', label: 'Related Calculators' },
  ],
  howToSteps: [
    'Enter your Monthly Cash Outflow (Gross Burn) — total cash leaving the bank each month for payroll, cloud, rent, and marketing.',
    'Enter your Monthly Cash Inflow — actual cash collections received from customers during the month.',
    'Enter your Current Cash Balance (total unrestricted cash in checking, treasury, and money market accounts).',
    'Review your Monthly Net Burn, Annualized Burn, Daily Burn, and Cash Runway in months.',
  ],
  formula: 'Gross Burn Rate = Total Monthly Cash Outflow\nNet Burn Rate = Monthly Cash Outflow − Monthly Cash Inflow (Revenue Collected)\nCash Runway (Months) = Total Cash Balance ÷ Monthly Net Burn Rate\nBurn Multiple = Annualized Net Burn ÷ Net New ARR Added',
  formulaDescription: 'Burn rate measures how fast a company consumes its cash reserves before reaching positive cash flow. Gross Burn is your total monthly operating cash expense, while Net Burn subtracts monthly cash revenue collected. Dividing your current cash balance by Monthly Net Burn reveals your exact Cash Runway in months.',
  benchmarkTables: [
    {
      title: '2026 Venture Startup Burn Rate & Runway Benchmarks by Stage',
      description: 'Typical monthly net burn, target cash runway at raise, and Bessemer/Craft Ventures Burn Multiple benchmarks.',
      headers: ['Funding Stage', 'Typical Monthly Net Burn', 'Target Runway at Financing', 'Fundraising Trigger Zone', 'Target Burn Multiple'],
      rows: [
        ['Pre-Seed / Bootstrapped', '$10,000 – $35,000/mo', '18 – 24 months', '< 6 months remaining', 'N/A (Product-Market Fit)'],
        ['Seed Stage', '$40,000 – $120,000/mo', '18 – 24 months', '< 9 months remaining', '< 2.0x (Good), < 1.5x (Great)'],
        ['Series A', '$150,000 – $400,000/mo', '18 – 24 months', '< 9 – 12 months remaining', '1.0x – 1.5x Net Burn / Net New ARR'],
        ['Series B', '$400,000 – $1,000,000/mo', '24 – 30 months', '< 12 months remaining', '< 1.0x – 1.2x (Efficient Growth)'],
        ['Growth / Late Stage (Series C+)', '$800,000 – $2,500,000/mo', '24+ months (or Default Alive)', '< 12 months remaining', '< 0.8x (Approaching Breakeven)'],
      ],
    },
    {
      title: 'The Burn Multiple Efficiency Rating (David Sacks / Craft Ventures Framework)',
      description: 'How institutional venture investors evaluate whether your monthly cash burn is generating efficient revenue growth.',
      headers: ['Burn Multiple (Net Burn ÷ Net New ARR)', 'Capital Efficiency Rating', 'Investor Interpretation'],
      rows: [
        ['Under 1.0x', 'Elite / Best-in-Class', 'Generating more than $1.00 of new ARR for every $1.00 of cash burned'],
        ['1.0x to 1.5x', 'Good / Venture Scale', 'Healthy capital efficiency; strong product-market fit and GTM execution'],
        ['1.5x to 2.0x', 'Suspect / Moderate', 'Acceptable for early seed/Series A ramp, but requires margin improvement'],
        ['Over 2.0x', 'Bad / High Cash Burn', 'Burning >$2 for every $1 of new ARR; high dilution risk if not corrected'],
      ],
    },
  ],
  deepDiveSections: [
    {
      title: 'Gross Burn vs. Net Burn: Why Cash Basis Matters',
      paragraphs: [
        'Founders often confuse accrual accounting losses (EBITDA or Net Income on the P&L) with Cash Burn Rate. Burn rate must always be calculated on a **strict cash basis** using your bank balances. If a customer signs a $120,000 annual contract in January with Net-60 payment terms, your accrual MRR increases immediately, but your January cash inflow is $0 until the wire hits your bank account in March.',
        'Similarly, non-cash accounting expenses like depreciation, amortization, and stock-based compensation are excluded from burn rate, while upfront annual software prepayments, capital expenditures (laptops, equipment), and debt principal payments must be included in Monthly Cash Outflow.',
      ],
      bullets: [
        'Default Alive vs. Default Dead: Coined by Y Combinator\'s Paul Graham, a startup is "Default Alive" if its current revenue growth rate and expense trajectory will reach cash-flow breakeven before its existing bank balance hits $0.',
        'The 9-Month Fundraising Rule: Enterprise B2B and venture fundraising rounds take an average of 4 to 6 months from first pitch to wired funds. Starting a raise with less than 6 months of runway strips away negotiating leverage.',
        'Trailing 3-Month Average: Because payroll (biweekly vs. semimonthly) and quarterly vendor bills fluctuate, always calculate your Net Burn using a trailing 3-month average.',
      ],
    },
  ],
  workedExamples: [
    { title: 'Seed Stage SaaS Startup', description: '$100,000 monthly cash outflow, $30,000 monthly cash inflow, and $1,260,000 in the bank. Gross Burn = $100,000/mo. Net Burn = $70,000/mo ($840,000/yr). Cash Runway = $1,260,000 ÷ $70,000 = 18.0 months (Healthy).' },
    { title: 'Pre-Revenue AI Startup', description: '$45,000 monthly outflow (founders + GPU compute), $0 inflow, $540,000 cash balance. Gross Burn = Net Burn = $45,000/mo ($1,500/day). Cash Runway = 12.0 months.' },
    { title: 'Cash-Flow Positive Growth Company', description: '$250,000 monthly cash outflow, $285,000 monthly cash collections. Net Burn = -$35,000/mo (generating +$35,000/mo net free cash flow). Runway is Infinite ("Default Alive").' },
  ],
  faqs: [
    { question: 'What is the difference between gross burn and net burn?', answer: 'Gross burn is the total amount of cash your business spends every month on operating expenses (payroll, rent, AWS, marketing) before considering revenue. Net burn is Gross Burn minus monthly cash revenue collected. If you spend $100,000/month and collect $40,000/month from customers, your Gross Burn is $100,000 and your Net Burn is $60,000.' },
    { question: 'How many months of cash runway should a startup have in 2026?', answer: 'In the 2026 venture environment, startups should target 18 to 24 months of cash runway immediately following a funding round. You should initiate your next fundraising process—or execute a cost-reduction plan to reach breakeven—when you have 9 to 12 months of runway remaining. Dropping below 6 months of runway puts the company in a distressed zone.' },
    { question: 'How do you calculate burn rate from bank statements?', answer: 'Take your starting cash balance on the first day of a quarter, subtract your ending cash balance on the last day of the quarter (excluding any new equity/debt financing proceeds), and divide by 3. For example, if your bank balance dropped from $1,500,000 on Jan 1 to $1,230,000 on March 31, your average monthly net burn is ($1,500,000 - $1,230,000) ÷ 3 = $90,000/month.' },
    { question: 'What is a good Burn Multiple for a SaaS company?', answer: 'The Burn Multiple equals Annualized Net Burn divided by Net New ARR added over the same period. A Burn Multiple below 1.0x is elite, 1.0x to 1.5x is good, 1.5x to 2.0x is mediocre, and above 2.0x indicates inefficient cash consumption.' },
    { question: 'How can a startup extend its runway without layoffs?', answer: 'Before cutting headcount (which typically represents 60–75% of SaaS burn), companies can extend runway by: (1) incentivizing customers to switch from monthly to upfront annual billing (offering a 10–15% discount for immediate cash), (2) consolidating redundant SaaS licenses and renegotiating cloud commitments, (3) freezing non-revenue-generating backfills, and (4) cutting high-CAC paid ad channels.' },
  ],
  relatedTools: [
    { slug: 'runway-calculator', title: 'Runway Calculator', description: 'Cash runway projection', icon: 'Clock' },
    { slug: 'customer-acquisition-cost-calculator', title: 'CAC Calculator', description: 'Customer acquisition cost', icon: 'DollarSign' },
    { slug: 'customer-lifetime-value-calculator', title: 'CLV Calculator', description: 'Customer lifetime value', icon: 'TrendingUp' },
    { slug: 'break-even-calculator', title: 'Break-Even Calculator', description: 'Break-even revenue & units', icon: 'Target' },
    { slug: 'employee-cost-calculator', title: 'Employee Cost Calculator', description: 'True loaded cost per hire', icon: 'Users' },
  ],
} satisfies CalculatorSeoData;
export default seoData;