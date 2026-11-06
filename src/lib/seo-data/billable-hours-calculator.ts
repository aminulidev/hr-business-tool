import type { CalculatorSeoData } from './types';
const seoData = {
  breadcrumbs: [
    { label: 'Calculators', href: '/calculators' },
    { label: 'Billable Hours Calculator', href: '/calculators/billable-hours-calculator' },
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
    'Enter your total working hours for the period — include every hour spent on the job across both direct client work and internal administrative tasks (typically 40 hours per week, 160–173.33 hours per month, or 2,080 hours per year).',
    'Enter your non-billable hours — capture internal team meetings, email triage, business development, proposal writing, continuing education (CLE/CPE), invoicing, and unbilled revisions.',
    'Enter your standard hourly billing rate ($/hr) to compute gross billable revenue, effective hourly rate across all hours worked, and annual revenue projections.',
    'Set your target utilization rate — law firm associates typically target 75%–85% (1,800–2,000 billable hours/year), management consultants target 65%–78%, and creative agencies target 60%–72%.',
    'Review your utilization rate, realization gap, and weekly/annual billable revenue, or compare against the 6-minute (1/10th hour) and 15-minute (1/4th hour) billing increment tables below.',
  ],
  formula:
    'Billable Hours = Total Working Hours − Non-Billable Hours\n' +
    'Utilization Rate (%) = (Billable Hours ÷ Total Working Hours) × 100\n' +
    'Gross Billable Revenue = Billable Hours × Hourly Billing Rate\n' +
    'Realization Rate (%) = (Collected Revenue ÷ Billed Revenue) × 100\n' +
    'Effective Hourly Rate = Collected Revenue ÷ Total Working Hours',
  formulaDescription:
    'Professional services profitability rests on three interconnected metrics: Utilization Rate (what percentage of your total capacity is spent on client-billable work), Realization Rate (what percentage of recorded billable hours actually gets invoiced and paid by the client after write-downs), and Effective Hourly Rate (your true earnings per clock hour worked, including non-billable admin time). Even a high $300/hour billing rate yields only a $150/hour effective rate if utilization drops to 50%.',
  workedExamples: [
    {
      title: 'AmLaw 200 Associate Attorney — 1,950 Annual Billable Target',
      description:
        'An associate works 50 total hours per week for 48 working weeks (2,400 total hours/year). They log 40.6 billable hours per week (1,950 billable hours/year) and spend 9.4 hours/week on CLE, recruiting, pro bono, and firm administration. Utilization Rate = 1,950 ÷ 2,400 = 81.25%. At a blended billing rate of $450/hour, the associate generates $877,500 in gross billable value per year ($18,281/week). After a 92% realization rate (8% partner write-downs), net collected revenue is $807,300, yielding an effective rate of $336.38 per total hour worked.',
    },
    {
      title: 'Management Consultant — 40-Hour Workweek at $225/hr',
      description:
        'A senior consultant works 40 total hours per week and spends 11 hours on practice development, RFPs, and internal status meetings, leaving 29 billable hours. Weekly Utilization Rate = 29 ÷ 40 = 72.5% (slightly above the 70% consulting benchmark). Weekly billable revenue is 29 × $225 = $6,525 ($326,250 across a 50-week billing year). Increasing utilization by just 3 hours per week (to 32 hours, or 80%) adds $675/week or $33,750 in pure annual top-line revenue without raising billing rates.',
    },
    {
      title: 'Digital Agency Senior Designer — Monthly Retainer vs. Hourly',
      description:
        'An agency designer logs 168 total hours in a 21-workday month. Non-billable time (daily standups, Slack coordination, internal critiques, and scope-creep revisions) consumes 54 hours, leaving 114 billable hours. Utilization Rate = 114 ÷ 168 = 67.9%. At $140/hour, monthly billed revenue is $15,960 ($191,520 annualized), while the effective hourly rate across all 168 clock hours is $95.00/hour.',
    },
    {
      title: 'Solo Freelance Software Engineer — Accounting for Unpaid Overhead',
      description:
        'A freelance full-stack developer works 40 hours/week for 46 weeks/year (1,840 total hours) after taking 6 weeks of vacation, holidays, and sick leave. Because solo freelancers handle their own sales pipeline, discovery calls, bookkeeping, and invoicing, non-billable time averages 14 hours/week (35%), leaving 26 billable hours/week (65% utilization, or 1,196 billable hours/year). At $135/hour, gross annual revenue is $161,460, and the true effective rate across all 1,840 working hours is $87.75/hour.',
    },
  ],
  benchmarkTables: [
    {
      title: 'Legal & Consulting 6-Minute (0.1 hr) vs. 15-Minute (0.25 hr) Billing Increment Chart',
      subtitle:
        'Standard conversion table used by law firms (Clio, PracticePanther, Litify), CPA practices, and management consultancies to convert minutes into decimal billable hours.',
      headers: [
        'Minutes Worked',
        '6-Minute Increment (1/10th Hr)',
        '15-Minute Increment (1/4th Hr)',
        'Fee at $250/hr (6-Min)',
        'Fee at $400/hr (6-Min)',
      ],
      rows: [
        ['1 – 6 mins', '0.1 hr', '0.25 hr', '$25.00', '$40.00'],
        ['7 – 12 mins', '0.2 hr', '0.25 hr', '$50.00', '$80.00'],
        ['13 – 18 mins', '0.3 hr', '0.25 hr / 0.50 hr', '$75.00', '$120.00'],
        ['19 – 24 mins', '0.4 hr', '0.50 hr', '$100.00', '$160.00'],
        ['25 – 30 mins', '0.5 hr', '0.50 hr', '$125.00', '$200.00'],
        ['31 – 36 mins', '0.6 hr', '0.75 hr', '$150.00', '$240.00'],
        ['37 – 42 mins', '0.7 hr', '0.75 hr', '$175.00', '$280.00'],
        ['43 – 48 mins', '0.8 hr', '0.75 hr / 1.00 hr', '$200.00', '$320.00'],
        ['49 – 54 mins', '0.9 hr', '1.00 hr', '$225.00', '$360.00'],
        ['55 – 60 mins', '1.0 hr', '1.00 hr', '$250.00', '$400.00'],
      ],
    },
    {
      title: '2026 Industry Utilization & Realization Rate Benchmarks by Profession',
      subtitle:
        'Target billable utilization, typical realization rates, and annual billable hour norms across professional service sectors (based on Clio Legal Trends, SPI Research Professional Services Maturity Benchmark, and AICPA practice surveys).',
      headers: [
        'Industry / Role',
        'Target Utilization Rate',
        'Annual Billable Hours (2,080 Base)',
        'Avg Realization Rate',
        'Typical Billing Model',
      ],
      rows: [
        ['BigLaw / AmLaw Associate', '80% – 88%', '1,850 – 2,150 hrs', '88% – 94%', '6-min increments (0.1 hr)'],
        ['Mid-Size / Boutique Law Firm', '72% – 80%', '1,600 – 1,800 hrs', '85% – 92%', '6-min increments / Flat fee hybrid'],
        ['Solo / Small Law Practice', '33% – 45%', '700 – 1,000 hrs', '81% – 88%', '6-min increments / Contingency'],
        ['Management Consulting (Analyst/Sr.)', '70% – 82%', '1,500 – 1,750 hrs', '90% – 96%', 'Daily / Weekly T&M or Milestone'],
        ['IT & Cloud Systems Integrator', '75% – 85%', '1,560 – 1,770 hrs', '92% – 97%', '15-min increments / Sprint Retainer'],
        ['Accounting / CPA Firm (Tax & Audit)', '65% – 75% (85% peak)', '1,350 – 1,600 hrs', '84% – 91%', '6-min or 15-min increments'],
        ['Digital / Creative Agency', '60% – 72%', '1,250 – 1,500 hrs', '78% – 88%', 'Monthly retainer / Blended hourly'],
        ['Architecture & Engineering (A&E)', '62% – 74%', '1,300 – 1,540 hrs', '86% – 93%', 'Phase percentage + Hourly T&M'],
        ['Independent Freelancer / Contractor', '55% – 68%', '1,100 – 1,400 hrs', '95% – 99%', 'Hourly / Project fixed-price'],
      ],
    },
  ],
  deepDiveSections: [
    {
      title: 'Utilization Rate vs. Realization Rate vs. Collection Rate: The Profitability Triangle',
      paragraphs: [
        'Many service firms track billable hours in isolation and wonder why cash flow lags behind timesheet totals. In professional services accounting, every clock hour passes through three filters before becoming bankable revenue: Utilization, Billing Realization, and Collection Realization.',
        'Utilization Rate measures capacity efficiency: Billable Hours divided by Total Available Hours (typically 2,080 hours per year for a full-time employee, or 1,840 net available hours after subtracting PTO and holidays). If an consultant works 40 hours and logs 30 hours to client projects, utilization is 75%.',
        'Billing Realization Rate measures how much of that logged time actually makes it onto a client invoice. When partners or account directors write down 5 hours on a 30-hour timesheet because a junior analyst took too long on research or exceeded a client budget cap, only 25 hours are billed—resulting in an 83.3% billing realization rate. Finally, Collection Rate measures the percentage of invoiced dollars actually paid by the client. Multiplying all three together (75% utilization × 83.3% billing realization × 96% collection = 60% net yield) reveals how many cents on the dollar your firm captures from its raw payroll capacity.',
      ],
    },
    {
      title: 'How Revenue Leakage Happens When You Reconstruct Timesheets From Memory',
      paragraphs: [
        'Studies by the American Bar Association and time-tracking software benchmarks consistently show that professionals who fill out timesheets at the end of the day or end of the week under-report their billable time by 15% to 35%. Short, high-value interactions—such as a 4-minute client phone call, a 7-minute contract redline review, or a quick Slack troubleshooting thread—are routinely forgotten unless logged contemporaneously.',
        'Under a standard 6-minute (0.1 hour) minimum billing increment, failing to log just three 5-minute client emails or calls per day costs 0.3 billable hours daily. Across 240 working days per year, that equals 72 lost billable hours. At a $250/hour billing rate, passive timesheet reconstruction silently erodes $18,000 in annual pure-profit revenue per professional.',
      ],
    },
    {
      title: 'How to Calculate Your Minimum Viable Billable Rate (Reverse Capacity Pricing)',
      paragraphs: [
        'If you are transitioning from a W-2 salary to independent consulting or setting agency rate cards, never divide your desired annual income by 2,080 hours. A full-time employee is paid for 2,080 hours, but an independent consultant must fund their own PTO, federal self-employment tax (15.3% FICA), health insurance, software stack, and unbilled business development time.',
        'To calculate your minimum hourly billing rate, start with 2,080 calendar work hours and subtract 240 hours for vacation, sick days, and federal holidays (leaving 1,840 working hours). Multiply 1,840 by a realistic solo utilization rate of 65% to get roughly 1,200 billable hours per year. Next, add your target net income ($120,000), overhead expenses ($18,000), and self-employment tax buffer ($22,000) for a gross revenue requirement of $160,000. Dividing $160,000 by 1,200 billable hours reveals a required billing rate of $133.33/hour—more than double the $57.69/hour W-2 nominal wage for a $120,000 salary.',
      ],
    },
  ],
  faqs: [
    {
      question: 'What is a billable hour and what counts as non-billable time?',
      answer:
        'A billable hour is any unit of time spent working directly on a client matter or deliverable that can be invoiced according to your engagement letter or contract. Examples include client strategy calls, legal research, drafting briefs, writing production code, creating design assets, and project-specific revisions. Non-billable time includes internal company meetings, general administrative tasks, invoicing, prospecting, writing sales proposals, continuing professional education (CLE/CPE), and unapproved rework.',
    },
    {
      question: 'What is a good billable utilization rate for consultants, lawyers, and agencies?',
      answer:
        'Healthy utilization benchmarks depend on seniority and business model: Law firm associates typically target 75%–85% (1,800–2,000+ hours/year), while partners target 55%–68% due to client origination and management duties. Management and IT consultants aim for 70%–80%. Creative and marketing agencies target 60%–72%. Independent freelancers usually achieve 55%–68% because they handle their own marketing, sales, and administration. Utilization consistently above 85% often signals impending burnout and zero capacity for training or business development.',
    },
    {
      question: 'How does the 6-minute (1/10th hour) legal billing increment work?',
      answer:
        'In the 6-minute billing system (0.1 hour increments), an hour is divided into ten 6-minute blocks, and any fraction of a block rounds up to the next tenth of an hour. A task taking 1 to 6 minutes bills as 0.1 hours; 7 to 12 minutes bills as 0.2 hours; 13 to 18 minutes bills as 0.3 hours, and so on up to 55 to 60 minutes (1.0 hour). Some IT consultancies and accounting firms instead use 15-minute (0.25 hour) quarter-hour increments.',
    },
    {
      question: 'What is the difference between utilization rate and realization rate?',
      answer:
        'Utilization rate measures time input: the percentage of your total working hours recorded as billable (Billable Hours ÷ Total Working Hours). Realization rate measures revenue capture: the percentage of those recorded billable hours that actually get invoiced and collected from the client (Collected Revenue ÷ Standard Value of Billable Hours Logged). If you log 40 billable hours at $200/hr ($8,000 value) but write off $1,200 due to a fixed-fee cap, your realization rate is 85%.',
    },
    {
      question: 'Should travel time be counted as billable hours?',
      answer:
        'Whether travel time is billable depends entirely on your client master services agreement (MSA) or engagement letter. Many consulting firms and law practices bill client-requested travel at 50% of the standard hourly rate (unless the professional is actively working on the client’s matter while in transit, in which case it is billed at 100%). Always specify travel billing rules in writing before incurring travel time.',
    },
    {
      question: 'How can our team increase billable utilization without working longer hours?',
      answer:
        'Focus on eliminating administrative friction rather than extending the workday: (1) use active timer tracking instead of reconstructing timesheets on Friday afternoon, which recovers 10%–20% in forgotten micro-tasks; (2) replace recurring status meetings with asynchronous updates; (3) standardize proposal, onboarding, and reporting templates; and (4) enforce clear scope-of-work boundaries so out-of-scope client requests trigger paid change orders rather than unbilled hours.',
    },
  ],
  relatedTools: [
    { slug: 'time-card-calculator', title: 'Time Card Calculator', description: 'Track daily clock-in/out hours & rounding', icon: 'Clock' },
    { slug: 'time-card-calculator-with-lunch', title: 'Time Card with Lunch', description: 'Weekly & biweekly hours minus break deductions', icon: 'Coffee' },
    { slug: 'time-to-decimal-calculator', title: 'Time to Decimal Converter', description: 'Convert HH:MM into decimal payroll & billing hours', icon: 'Hash' },
    { slug: 'revenue-per-employee-calculator', title: 'Revenue per Employee', description: 'Benchmark workforce revenue efficiency', icon: 'Activity' },
    { slug: 'wages-calculator', title: 'Wages Calculator', description: 'Calculate gross wages from hours and rate', icon: 'Banknote' },
    { slug: 'profit-margin-calculator', title: 'Profit Margin Calculator', description: 'Analyze service & project profit margins', icon: 'Percent' },
  ],
} satisfies CalculatorSeoData;

export default seoData;