import type { CalculatorSeoData } from './types';
const seoData = {
  breadcrumbs: [
    { label: 'Calculators', href: '/calculators' },
    { label: 'Revenue per Employee Calculator', href: '/calculators/revenue-per-employee-calculator' },
  ],
  tableOfContents: [
    { id: 'how-to-calculate', label: 'How to Calculate' },
    { id: 'formula', label: 'Formula' },
    { id: 'worked-examples', label: 'Worked Examples' },
    { id: 'benchmarks-reference', label: 'Benchmarks & Tables' },
    { id: 'in-depth-guide', label: 'In-Depth Guide' },
    { id: 'frequently-asked-questions', label: 'FAQs' },
    { id: 'related-calculators', label: 'Related Calculators' },
  ],
  howToSteps: [
    'Enter your company’s total annual revenue (or ARR for SaaS businesses) — use trailing twelve months (TTM) GAAP revenue or annualized run-rate revenue.',
    'Enter your total Full-Time Equivalent (FTE) headcount — count each full-time employee (40 hrs/week) as 1.0 FTE and convert part-time staff by dividing weekly hours by 40 (e.g., two 20-hour part-time workers = 1.0 FTE).',
    'Optionally enter your total operating profit / net income or total payroll expense to evaluate Profit per Employee and Human Capital ROI alongside top-line RPE.',
    'Compare your calculated Revenue per Employee against the 2026 sector benchmarks below (SaaS, Technology, Financial Services, Professional Services, Manufacturing, Retail, and Hospitality).',
    'Use the scenario comparison tool to model how hiring 5–20 additional employees or increasing pricing by 10% impacts your workforce productivity ratio.',
  ],
  formula:
    'Revenue per Employee (RPE) = Total Annual Revenue ÷ Total Full-Time Equivalent (FTE) Employees\n' +
    'Profit per Employee = Net Operating Profit (or EBITDA) ÷ Total FTE Employees\n' +
    'Payroll-to-Revenue Ratio (%) = (Total Fully-Burdened Payroll ÷ Total Annual Revenue) × 100',
  formulaDescription:
    'Revenue per Employee (RPE) is the premier board-level metric used by CFOs, private equity sponsors, and venture capital investors to evaluate organizational leverage and capital efficiency. While top-line revenue shows scale, RPE reveals how effectively your business model converts human capital into revenue. High-margin software, energy, and financial firms routinely exceed $400,000 to $1,500,000+ per employee, whereas labor-intensive service and hospitality businesses operate profitably at $75,000 to $160,000 per employee.',
  workedExamples: [
    {
      title: 'Series B B2B SaaS Company — $18M ARR with 72 FTEs',
      description:
        'A venture-backed SaaS company generates $18,000,000 in Annual Recurring Revenue (ARR) with 72 full-time employees. Revenue per Employee = $18,000,000 ÷ 72 = $250,000/FTE. This places the company right at the median benchmark for growth-stage SaaS ($220k–$280k). With an average fully-burdened cost per employee (salary + benefits + payroll taxes) of $165,000 ($11.88M total payroll), payroll consumes 66% of revenue, leaving $85,000 in gross margin contribution per employee before cloud hosting and marketing spend.',
    },
    {
      title: 'Management & IT Consulting Firm — $6.4M Revenue with 32 FTEs',
      description:
        'A 32-person consulting practice (26 billable consultants + 6 administrative/leadership staff) bills $6,400,000 annually. Revenue per Employee = $6,400,000 ÷ 32 = $200,000/FTE (and Revenue per Billable Consultant = $6,400,000 ÷ 26 = $246,154). In professional services, the "Rule of Threes" dictates that RPE should be roughly 2.5× to 3.0× the average consultant’s base compensation ($85,000–$95,000) to deliver a healthy 20%–25% net partner profit margin.',
    },
    {
      title: 'Multi-Unit Specialty Retail & E-Commerce Brand — $24M Revenue with 135 FTEs',
      description:
        'A retail chain employs 95 full-time staff (95.0 FTE) and 80 part-time associates averaging 20 hours/week (40.0 FTE), for a combined workforce of 135.0 FTEs. Generating $24,000,000 in annual sales yields an RPE of $24,000,000 ÷ 135 = $177,778 per FTE. If the company automates warehouse fulfillment and increases e-commerce checkout conversion to reach $27M without adding headcount, RPE rises to $200,000/FTE (+12.5% productivity gain).',
    },
    {
      title: 'Precision Manufacturing Plant — $45M Revenue with 180 FTEs',
      description:
        'An industrial components manufacturer generates $45,000,000 in annual revenue with 180 full-time employees. Revenue per Employee = $45,000,000 ÷ 180 = $250,000/FTE. With a 42% gross margin ($18.9M gross profit), Gross Profit per Employee is $105,000/FTE, comfortably covering the $78,000 average fully-loaded factory compensation.',
    },
  ],
  benchmarkTables: [
    {
      title: '2026 Revenue per Employee (RPE) Industry Benchmarks by Sector',
      subtitle:
        'Median and top-quartile annual Revenue per Employee ratios across major US industries (sourced from S&P 500 filings, Bessemer Cloud Index, KeyBanc SaaS Survey, and BLS productivity data).',
      headers: [
        'Industry Sector',
        '25th Percentile (Lagging)',
        'Median (Industry Standard)',
        '75th Percentile (Best-in-Class)',
        'Healthy Payroll % of Revenue',
      ],
      rows: [
        ['Public Cloud / Enterprise Tech', '$420,000', '$680,000', '$1,450,000+', '18% – 32%'],
        ['B2B SaaS ($10M – $50M ARR)', '$165,000', '$245,000', '$340,000+', '45% – 65%'],
        ['Early-Stage SaaS (<$10M ARR)', '$95,000', '$155,000', '$225,000+', '60% – 85%'],
        ['Banking, Fintech & Insurance', '$290,000', '$460,000', '$780,000+', '25% – 40%'],
        ['Management & IT Consulting', '$145,000', '$195,000', '$275,000+', '50% – 62%'],
        ['Legal & Accounting Services', '$160,000', '$225,000', '$350,000+', '45% – 58%'],
        ['Marketing & Creative Agencies', '$115,000', '$155,000', '$210,000+', '52% – 65%'],
        ['Healthcare & Medical Practices', '$130,000', '$185,000', '$260,000+', '48% – 60%'],
        ['Manufacturing & Industrial', '$185,000', '$285,000', '$440,000+', '22% – 35%'],
        ['Retail & Omni-Channel Commerce', '$110,000', '$165,000', '$250,000+', '12% – 20%'],
        ['Hospitality, Restaurants & Food', '$58,000', '$82,000', '$115,000+', '28% – 36%'],
      ],
    },
    {
      title: 'B2B SaaS ARR per Employee Benchmarks by Company Stage (2026)',
      subtitle:
        'How ARR per FTE scales as software companies mature from Seed to IPO/Public readiness.',
      headers: [
        'ARR Scale / Stage',
        'Typical FTE Headcount',
        'Median ARR per Employee',
        'Top-Quartile ARR per Employee',
        'Primary Efficiency Driver',
      ],
      rows: [
        ['$1M – $3M ARR (Seed / Series A)', '8 – 22 FTEs', '$115,000', '$175,000', 'Founder-led sales + AI coding leverage'],
        ['$3M – $10M ARR (Series A / B)', '22 – 55 FTEs', '$165,000', '$235,000', 'Repeatable GTM motion & self-serve onboarding'],
        ['$10M – $25M ARR (Growth)', '50 – 110 FTEs', '$225,000', '$310,000', 'Net Dollar Retention (NDR >110%) & upsells'],
        ['$25M – $100M ARR (Scale-Up)', '100 – 350 FTEs', '$275,000', '$385,000', 'Multi-product expansion & channel leverage'],
        ['$100M+ ARR (Pre-IPO / Public)', '300+ FTEs', '$340,000', '$520,000+', 'Operating leverage & enterprise ACV scale'],
      ],
    },
  ],
  deepDiveSections: [
    {
      title: 'Why Revenue per Employee Alone Can Mislead You Without Gross Profit per Employee',
      paragraphs: [
        'While Revenue per Employee is the fastest way to benchmark top-line workforce productivity, comparing RPE across business models with different gross margins is a classic financial trap. Consider a wholesale distributor generating $500,000 in revenue per employee at a 12% gross margin versus a B2B software company generating $250,000 in revenue per employee at an 82% gross margin.',
        'After subtracting Cost of Goods Sold (COGS), the distributor only retains $60,000 in Gross Profit per Employee ($500,000 × 12%) to pay salaries, rent, and overhead—whereas the software company retains $205,000 in Gross Profit per Employee ($250,000 × 82%). Whenever you analyze RPE across product lines or acquisition targets, pair it with Gross Profit per Employee (Gross Profit ÷ FTEs) and Human Capital ROI (Operating Profit ÷ Total Payroll Expense) to see true bottom-line value creation.',
      ],
    },
    {
      title: 'How to Count Full-Time Equivalents (FTEs) Accurately for RPE Benchmarking',
      paragraphs: [
        'Inconsistent headcount definitions can distort Revenue per Employee by 20% or more. Under standard FP&A and GAAP workforce reporting, never use raw year-end headcount if your business experiences seasonal hiring spikes or rapid mid-year headcount growth. Instead, calculate Average FTEs across the 12-month period: (Beginning FTEs + Ending FTEs) ÷ 2, or the 12-month average of monthly payroll headcount.',
        'Convert part-time and hourly workers to FTEs by dividing their annual paid hours by 2,080 (for example, 4 part-time staff working 15 hours/week each = 60 hours/week ÷ 40 = 1.5 FTEs). Finally, if your company relies heavily on full-time offshore contractors or outsourced development agencies to build core product or deliver client work, include their FTE equivalent in an "Adjusted RPE" metric—otherwise, shifting W-2 employees to 1099 contractors artificially inflates RPE without improving actual operating efficiency.',
      ],
    },
    {
      title: 'The "Rule of 2.5× to 3.5×" Payroll Multiplier for Sustainable Profitability',
      paragraphs: [
        'Across professional services, agencies, and B2B software firms, a practical rule of thumb connects average employee compensation to required Revenue per Employee: to achieve a 15%–25% net operating margin, your Gross Profit per Employee should be at least 1.8× to 2.2× your average fully-burdened cost per employee, and your Revenue per Employee in service businesses should be 2.5× to 3.5× average base salary.',
        'For example, if your average employee earns a $100,000 base salary ($125,000 fully burdened with FICA, health benefits, 401(k) match, and software licenses), an RPE of $130,000 barely covers payroll alone and guarantees operating losses once office, marketing, and G&A expenses are deducted. Raising RPE to $250,000–$300,000 via pricing power, AI workflow automation, and higher client retention creates a durable 20%+ operating margin.',
      ],
    },
  ],
  faqs: [
    {
      question: 'What is Revenue per Employee (RPE) and how is it calculated?',
      answer:
        'Revenue per Employee (RPE) is a financial efficiency ratio calculated by dividing a company’s total annual revenue by its total number of Full-Time Equivalent (FTE) employees (RPE = Annual Revenue ÷ Total FTEs). It measures how much top-line revenue each team member generates on average and is widely used by investors to assess operational scalability.',
    },
    {
      question: 'What is a good Revenue per Employee ratio in 2026?',
      answer:
        'Benchmarks vary significantly by industry: For B2B SaaS and software companies, $200,000–$350,000 per employee is strong (with AI-native startups and public tech giants exceeding $500,000–$1M+). For professional services, law, and consulting firms, $180,000–$300,000 is healthy. For manufacturing, $250,000–$400,000 is typical due to capital equipment leverage. For retail and hospitality, $80,000–$175,000 is normal.',
    },
    {
      question: 'How do part-time employees and 1099 contractors affect Revenue per Employee?',
      answer:
        'Part-time employees should always be converted into Full-Time Equivalents (FTEs) by dividing their scheduled weekly hours by 40 (or annual hours by 2,080) so your denominator isn’t artificially inflated. While 1099 contractors are excluded from statutory W-2 headcount in SEC filings, internal FP&A teams should track "Total Workforce RPE" (including long-term full-time contractors) so outsourcing doesn’t create a false illusion of productivity growth.',
    },
    {
      question: 'Why does Revenue per Employee often dip right after a funding round or expansion?',
      answer:
        'Hiring is a leading expense, while revenue is a lagging outcome. When a company hires 20 new account executives and engineers in Q1, the denominator (FTEs) jumps immediately, causing RPE to drop. As new reps ramp up over 6–9 months and new product features monetize, revenue catches up and RPE rebounds—which is why CFOs track "RPE by cohort" and "Ramped Rep Productivity" alongside company-wide RPE.',
    },
    {
      question: 'What is the difference between Revenue per Employee and Profit per Employee?',
      answer:
        'Revenue per Employee divides top-line sales by FTE headcount, ignoring cost of goods sold and operating expenses. Profit per Employee divides net income (or EBITDA) by FTE headcount, showing how much actual bottom-line profit each worker generates after all costs are paid. A low-margin reseller can have $800,000 RPE with only $15,000 Profit per Employee, while a high-margin software firm with $300,000 RPE can generate $75,000 Profit per Employee.',
    },
    {
      question: 'What are the fastest ways to increase Revenue per Employee?',
      answer:
        'You can raise RPE through four operational levers: (1) Value-based pricing and packaging upgrades (which increase revenue at 100% margin with zero new headcount); (2) Improving Net Revenue Retention (NDR) via automated expansion and churn reduction; (3) Deploying AI and workflow automation to eliminate repetitive manual support, QA, and admin tasks before approving new requisitions; and (4) Pruning low-margin service lines that require heavy manual labor.',
    },
  ],
  relatedTools: [
    { slug: 'billable-hours-calculator', title: 'Billable Hours Calculator', description: 'Track consultant utilization & billable revenue', icon: 'Clock' },
    { slug: 'profit-margin-calculator', title: 'Profit Margin Calculator', description: 'Calculate gross, operating & net profit margins', icon: 'Percent' },
    { slug: 'employee-turnover-calculator', title: 'Employee Turnover Calculator', description: 'Measure retention & replacement cost impact', icon: 'Users' },
    { slug: 'cost-per-hire-calculator', title: 'Cost per Hire Calculator', description: 'Calculate recruiting & onboarding ROI', icon: 'Briefcase' },
    { slug: 'roi-calculator', title: 'ROI Calculator', description: 'Analyze return on capital & headcount investments', icon: 'BarChart3' },
    { slug: 'break-even-calculator', title: 'Break-Even Calculator', description: 'Find the sales volume needed to cover fixed payroll', icon: 'Target' },
  ],
} satisfies CalculatorSeoData;

export default seoData;