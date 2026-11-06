import type { CalculatorSeoData } from './types';
const seoData = {
  breadcrumbs: [{ label: 'Calculators' }, { label: 'Freelance Hourly Rate Calculator' }],
  tableOfContents: [
    { id: 'how-to-calculate', label: 'How to Calculate' },
    { id: 'formula', label: 'Formula' },
    { id: 'industry-benchmarks', label: '2026 Freelance Rate vs. W-2 Salary Table' },
    { id: 'deep-dive-guide', label: 'How to Price Your Freelance Rate' },
    { id: 'worked-examples', label: 'Worked Examples' },
    { id: 'frequently-asked-questions', label: 'FAQs' },
    { id: 'related-calculators', label: 'Related Calculators' },
  ],
  howToSteps: [
    'Enter your Desired Annual Take-Home Income (after taxes and business expenses).',
    'Enter your Annual Business Expenses (health insurance, software, laptop, home office, accounting, marketing).',
    'Enter your Effective Self-Employment + Income Tax Rate (typically 28–35%, including the 15.3% SECA tax).',
    'Enter your Realistic Billable Hours per Week (most freelancers bill 22–28 hours out of a 40-hour week).',
    'Enter your Weeks Off per Year for vacation, holidays, and sick days (typically 4–6 weeks).',
  ],
  formula: 'Active Workweeks = 52 − Weeks Off per Year\nAnnual Billable Hours = Active Workweeks × Weekly Billable Hours\nRequired Gross Revenue = (Desired Take-Home Income + Annual Expenses) ÷ (1 − Tax Rate %)\nMinimum Freelance Hourly Rate = Required Gross Revenue ÷ Annual Billable Hours\nDay Rate (8-Hour Equivalent) = Minimum Hourly Rate × 8',
  formulaDescription: 'A sustainable freelance hourly rate cannot be calculated by simply dividing a target W-2 salary by 2,080 hours. Independent contractors must cover 15.3% self-employment tax (SECA), self-funded health insurance, unpaid vacation/holidays, business software overhead, and non-billable time spent pitching, invoicing, and managing projects.',
  benchmarkTables: [
    {
      title: '2026 W-2 Salary to Required Freelance Hourly Rate Conversion Table',
      description: 'Assumes 48 active workweeks (4 weeks off), 25 billable hours/week (1,200 billable hours/year), $8,000 in annual business/health overhead, and a 30% combined tax rate.',
      headers: ['Target Net Take-Home (W-2 Net Equiv)', 'Required Gross Freelance Revenue', 'Billable Hours / Year', 'Minimum Freelance Hourly Rate', 'Equivalent Day Rate (8 Hrs)'],
      rows: [
        ['$50,000 / year', '$82,857', '1,200 hrs/yr', '$69 / hr', '$552 / day'],
        ['$75,000 / year', '$118,571', '1,200 hrs/yr', '$99 / hr', '$790 / day'],
        ['$100,000 / year', '$154,286', '1,200 hrs/yr', '$129 / hr', '$1,029 / day'],
        ['$125,000 / year', '$190,000', '1,200 hrs/yr', '$158 / hr', '$1,267 / day'],
        ['$150,000 / year', '$225,714', '1,200 hrs/yr', '$188 / hr', '$1,505 / day'],
        ['$200,000 / year', '$297,143', '1,200 hrs/yr', '$248 / hr', '$1,981 / day'],
      ],
    },
    {
      title: '2026 Market Freelance Hourly Rates by Discipline (US Mid-to-Senior Level)',
      description: 'Typical US independent contractor billing rates across major knowledge-work disciplines.',
      headers: ['Freelance Discipline', 'Junior (1–3 Yrs)', 'Mid-Level (3–6 Yrs)', 'Senior / Lead (7+ Yrs)', 'Typical Pricing Model'],
      rows: [
        ['Software Engineering / Full-Stack / AI', '$65 – $95/hr', '$100 – $150/hr', '$150 – $250+/hr', 'Hourly, Sprint Retainer, or Milestone'],
        ['UI/UX & Product Design', '$55 – $85/hr', '$85 – $135/hr', '$135 – $200/hr', 'Project Fixed-Fee or Weekly Retainer'],
        ['B2B Copywriting & Content Strategy', '$50 – $75/hr', '$75 – $125/hr', '$125 – $185/hr', 'Per-Deliverable or Monthly Retainer'],
        ['Paid Media / SEO / Growth Marketing', '$60 – $90/hr', '$95 – $145/hr', '$150 – $225/hr', 'Monthly Retainer + % of Ad Spend'],
        ['Fractional CFO / Accounting / FP&A', '$75 – $110/hr', '$125 – $175/hr', '$185 – $350/hr', 'Monthly Fractional Retainer'],
      ],
    },
  ],
  deepDiveSections: [
    {
      title: 'The 1,200-Hour Reality: Why You Cannot Bill 40 Hours a Week',
      paragraphs: [
        'New freelancers frequently make the mistake of dividing their desired $100,000 income by 2,080 hours (40 hours × 52 weeks) and charging $48/hour. Within six months, they discover they are working 55 hours a week while taking home less than $50,000 after taxes.',
        'In reality, a solo freelancer is an entire company of one: you are the Account Executive (writing proposals and taking discovery calls), the Project Manager, the Bookkeeper (invoicing and quarterly estimated taxes), and the delivery specialist. Across a 40-hour workweek, industry studies consistently show that solo consultants achieve **55% to 65% utilization** (22 to 26 billable hours per week). Once you subtract 4 weeks for vacation, holidays, and illness (48 working weeks × 25 billable hours), you have roughly **1,200 billable hours per year** to generate 100% of your annual revenue.',
      ],
      bullets: [
        'The "Divide by 1,000" Rule of Thumb: For a fast mental check, take the W-2 annual salary you want to replace and divide by 1,000. To replace a $100,000 W-2 job with full benefits and PTO, your baseline freelance hourly rate should be roughly $100/hour.',
        'Quarterly IRS Estimated Taxes (Form 1040-ES): Remember to set aside 25% to 32% of every paid invoice into a dedicated high-yield tax savings account for April 15, June 15, September 15, and January 15 IRS deadlines.',
      ],
    },
  ],
  workedExamples: [
    { title: 'Mid-Level Freelance Designer ($75k Net Target)', description: '$75,000 desired take-home + $6,000 expenses (Adobe, health insurance, laptop) = $81,000 net needed. At a 30% tax rate, Gross Revenue Needed = $115,714. Across 48 weeks × 25 billable hrs/wk (1,200 hrs), Required Hourly Rate = $96.43/hr ($771/day).' },
    { title: 'Senior Software Consultant ($130k Net Target)', description: '$130,000 desired take-home + $10,000 expenses = $140,000. At a 32% tax rate, Gross Needed = $205,882. Across 46 weeks × 28 billable hrs/wk (1,288 hrs), Required Hourly Rate = $159.85/hr ($1,279/day).' },
    { title: 'Part-Time Side Hustle Copywriter ($25k Net Target)', description: '$25,000 desired take-home + $1,500 software expenses, 25% marginal tax rate, 10 billable hrs/wk for 48 weeks (480 hrs). Gross Needed = $35,333. Required Rate = $73.61/hr.' },
  ],
  faqs: [
    { question: 'How much should I charge per hour as a freelancer compared to my W-2 hourly wage?', answer: 'You should charge at least 1.5x to 2.0x your equivalent W-2 hourly rate. A W-2 employee earning $50/hour ($104,000/year) receives employer-paid FICA taxes (7.65%), subsidized health insurance, 401(k) matching, paid vacation, and gets paid for 40 hours/week regardless of client workload. As a freelancer, you must charge $85 to $105/hour to achieve the same net standard of living.' },
    { question: 'How many billable hours per week is realistic for a freelancer?', answer: 'For an independent freelancer or solo consultant, 22 to 28 billable hours per week (55% to 70% utilization) is the sustainable norm. The remaining 12 to 18 hours per week are consumed by client acquisition, proposals, discovery calls, invoicing, bookkeeping, and skill development.' },
    { question: 'How much should freelancers set aside for taxes in 2026?', answer: 'Most full-time US freelancers should set aside 25% to 32% of their net business profit (gross revenue minus deductible business expenses) for federal and state taxes. This covers the 15.3% Self-Employment Tax (12.4% Social Security up to $184,500 + 2.9% Medicare) plus federal and state income taxes (offset partially by the 20% QBI deduction under Section 199A).' },
    { question: 'Should I charge clients hourly or by project fixed fee?', answer: 'Use your calculated minimum hourly rate as your internal cost floor, but quote fixed project fees or monthly retainers to clients whenever scope is clearly defined. Fixed-fee pricing rewards you for speed and expertise rather than penalizing you for finishing work efficiently.' },
  ],
  relatedTools: [
    { slug: 'upwork-fee-calculator', title: 'Upwork Fee Calculator', description: 'Upwork take-home & reverse bid calculator', icon: 'DollarSign' },
    { slug: 'billable-hours-calculator', title: 'Billable Hours Calculator', description: 'Utilization rate & agency pricing', icon: 'Clock' },
    { slug: 'fica-tax-calculator', title: 'FICA & SECA Tax Calculator', description: 'Self-employment vs W-2 tax breakdown', icon: 'Percent' },
    { slug: 'salary-converter', title: 'Salary to Hourly Calculator', description: 'Convert annual salary to hourly pay', icon: 'BadgeDollarSign' },
    { slug: 'hourly-paycheck-calculator', title: 'Hourly Paycheck Calculator', description: 'W-2 take-home paycheck comparison', icon: 'Wallet' },
  ],
} satisfies CalculatorSeoData;
export default seoData;