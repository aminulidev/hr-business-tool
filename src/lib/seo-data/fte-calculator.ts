import type { CalculatorSeoData } from './types';
const seoData = {
  breadcrumbs: [{ label: 'Calculators' }, { label: 'FTE Calculator' }],
  tableOfContents: [
    { id: 'how-to-calculate', label: 'How to Calculate' },
    { id: 'formula', label: 'Formula' },
    { id: 'industry-benchmarks', label: 'FTE Conversion & ACA Reference Tables' },
    { id: 'deep-dive-guide', label: 'Standard FTE vs. ACA FTE Guide' },
    { id: 'worked-examples', label: 'Worked Examples' },
    { id: 'frequently-asked-questions', label: 'FAQs' },
    { id: 'related-calculators', label: 'Related Calculators' },
  ],
  howToSteps: [
    'Enter your total number of full-time employees (employees working 40 hours/week, or 30+ hours/week for ACA).',
    'Enter the combined weekly hours worked by all part-time employees.',
    'Select your standard full-time workweek hours (40 hours for standard HR budgeting, or 30 hours for IRS/ACA compliance).',
    'Review both your Standard Budgeting FTE and your ACA Applicable Large Employer (ALE) FTE count immediately.',
  ],
  formula: 'Part-Time FTE = Total Weekly Part-Time Hours ÷ Standard Full-Time Weekly Hours (40)\nTotal Standard FTE = Full-Time Headcount + Part-Time FTE\nACA FTE = Full-Time Headcount (30+ hrs/wk) + (Total Monthly PT Hours ÷ 120 [or Weekly PT Hours ÷ 30])',
  formulaDescription: 'Full-Time Equivalent (FTE) converts your combined full-time and part-time workforce into standardized full-time units. Standard financial planning uses a 40-hour workweek (2,080 hours/year = 1.0 FTE), whereas the Affordable Care Act (ACA) uses a 30-hour workweek (130 hours/month) to determine the 50-FTE Applicable Large Employer (ALE) mandate.',
  benchmarkTables: [
    {
      title: 'Weekly & Annual Hours to FTE Conversion Reference Table',
      description: 'Quick conversion table comparing a 40-hour standard workweek (2,080 hours/year) against a 30-hour ACA workweek.',
      headers: ['Weekly Hours Worked', 'Annual Hours (52 Wks)', 'Standard FTE (40-Hr Base)', 'ACA FTE Equivalent (30-Hr Base)', 'Typical Classification'],
      rows: [
        ['40 hours/week', '2,080 hours/year', '1.00 FTE', '1.00 ACA FT (Capped at 1.0)', 'Standard Full-Time'],
        ['37.5 hours/week', '1,950 hours/year', '0.94 FTE', '1.00 ACA FT (30+ hrs = FT)', 'Full-Time (7.5h/day)'],
        ['32 hours/week', '1,664 hours/year', '0.80 FTE', '1.00 ACA FT (30+ hrs = FT)', '4-Day Full-Time / ACA Full-Time'],
        ['30 hours/week', '1,560 hours/year', '0.75 FTE', '1.00 ACA FTThreshold', 'ACA Full-Time Threshold'],
        ['25 hours/week', '1,300 hours/year', '0.625 FTE', '0.83 ACA FTE', 'Three-Quarter Part-Time'],
        ['20 hours/week', '1,040 hours/year', '0.50 FTE', '0.67 ACA FTE', 'Half-Time Part-Time'],
        ['15 hours/week', '780 hours/year', '0.375 FTE', '0.50 ACA FTE', 'Part-Time / Shift Worker'],
        ['10 hours/week', '520 hours/year', '0.25 FTE', '0.33 ACA FTE', 'Quarter-Time / Casual'],
      ],
    },
    {
      title: 'Federal Compliance Thresholds Based on FTE & Headcount (2026)',
      description: 'Key U.S. employment laws triggered as your FTE or employee headcount crosses federal thresholds.',
      headers: ['Threshold', 'Counting Method', 'Federal Law / Mandate', 'Employer Requirement'],
      rows: [
        ['15+ Employees', 'Total Headcount (20+ weeks)', 'Title VII & ADA', 'Equal employment opportunity & reasonable accommodations'],
        ['20+ Employees', 'FTE / Headcount Adjustment', 'COBRA Continuation', 'Must offer continuation of group health coverage after separation'],
        ['50+ ACA FTEs', 'ACA FTE (30 hrs/wk or 130 hrs/mo)', 'ACA Employer Mandate (IRC §4980H)', 'Must offer affordable Minimum Essential Coverage or face IRS penalties'],
        ['50+ Employees', 'Total Headcount within 75 miles', 'FMLA (Family & Medical Leave Act)', 'Up to 12 weeks of job-protected unpaid leave per year'],
        ['100+ Employees', 'Total Headcount / FT Workers', 'EEO-1 Reporting & WARN Act', 'Annual EEO-1 workforce filing & 60-day mass layoff notice'],
      ],
    },
  ],
  deepDiveSections: [
    {
      title: 'Standard Budgeting FTE (40 Hours) vs. IRS ACA FTE (30 Hours)',
      paragraphs: [
        'HR and finance leaders must track two distinct FTE calculations: **Financial Budgeting FTE** and **ACA Compliance FTE**. In financial planning and SaaS metrics (such as Revenue per Employee), 1.0 FTE equals 40 hours per week or 2,080 paid hours per year. Two part-time employees working 20 hours per week each equal 1.0 Budgeting FTE.',
        'Under the Affordable Care Act (ACA), however, the IRS defines a full-time employee as anyone working at least **30 hours per week** (or 130 hours per calendar month). Furthermore, part-time employees working fewer than 30 hours per week are converted into FTEs by dividing their combined weekly hours by 30 (or monthly hours by 120). If your combined full-time employees and part-time FTE equivalents average 50 or more across the calendar year, you become an **Applicable Large Employer (ALE)** for the following calendar year.',
      ],
      bullets: [
        'Capping Individual Full-Timers: When calculating ACA FTEs, a single employee working 45 or 50 hours per week never counts as more than 1.0 ACA full-time employee.',
        'Seasonal Worker Exception: If your workforce exceeds 50 ACA FTEs for 120 days (or 4 calendar months) or fewer during the year, and the employees in excess of 50 were seasonal workers, you may qualify for the IRS seasonal worker exemption.',
        '1099 Contractors & Leased Employees: Independent contractors (1099-NEC), sole proprietors, partners, and 2%+ S-Corp shareholders are excluded from ACA FTE counts.',
      ],
    },
  ],
  workedExamples: [
    { title: 'Small Business Below ACA Threshold', description: '10 full-time employees (40h/wk) + 6 part-time employees working 20h/wk each (120 PT hours total). Standard FTE = 10 + (120 ÷ 40) = 13.0 FTE. ACA FTE = 10 + (120 ÷ 30) = 14.0 ACA FTE (well below the 50-FTE mandate).' },
    { title: 'Hospitality Group Crossing the 50 ACA FTE Line', description: '30 full-time staff + 30 part-time servers working 20h/wk each (600 PT hours total). Standard FTE = 30 + (600 ÷ 40) = 45.0 FTE. However, ACA FTE = 30 + (600 ÷ 30) = 50.0 ACA FTE — triggering the ACA Employer Shared Responsibility Mandate.' },
    { title: 'SaaS Company Workforce Planning', description: '50 full-time engineers/marketers + 5 part-time specialists working 20h/wk (100 PT hours). Total Budgeting FTE = 52.5 FTE. At $10M ARR, Revenue per FTE = $190,476.' },
  ],
  faqs: [
    { question: 'What does 1.0 FTE mean?', answer: '1.0 FTE (Full-Time Equivalent) represents the workload of one full-time employee working a standard schedule—typically 40 hours per week, 8 hours per day, or 2,080 hours per year. It can be fulfilled by a single full-time worker or multiple part-time workers whose hours sum to 40 per week.' },
    { question: 'How do you calculate FTE from part-time hours?', answer: 'Sum all weekly hours worked by part-time employees and divide by your company\'s standard full-time weekly hours (usually 40). For example, if 5 part-time employees work 18, 20, 22, 15, and 25 hours per week (totaling 100 hours), they equal 100 ÷ 40 = 2.5 FTE.' },
    { question: 'How does the IRS calculate FTE for the ACA 50-employee mandate?', answer: 'For each calendar month, count every employee who worked at least 30 hours per week (or 130 hours per month) as 1.0 full-time employee. Then, sum all monthly hours worked by part-time employees (up to 120 hours per person) and divide that total by 120. Add your full-time count and part-time FTE fraction together, then average the 12 monthly totals across the calendar year.' },
    { question: 'What is the difference between headcount and FTE?', answer: 'Headcount is the literal number of individuals on your payroll, regardless of their schedule. FTE normalizes those individuals by hours worked. A company with 40 full-time workers and 20 half-time (20 hr/wk) workers has a headcount of 60, but an FTE of 50.0.' },
    { question: 'What is 0.5 FTE or 0.75 FTE in hours?', answer: 'Based on a standard 40-hour workweek, 0.5 FTE equals 20 hours per week (1,040 hours/year), 0.75 FTE equals 30 hours per week (1,560 hours/year), and 0.8 FTE equals 32 hours per week (a standard 4-day workweek).' },
  ],
  relatedTools: [
    { slug: 'revenue-per-employee-calculator', title: 'Revenue Per Employee', description: 'ARR & profit per FTE benchmarks', icon: 'BarChart3' },
    { slug: 'employee-cost-calculator', title: 'Employee Cost Calculator', description: 'True loaded cost per FTE', icon: 'DollarSign' },
    { slug: 'labor-cost-calculator', title: 'Labor Cost Calculator', description: 'Total labor cost as % of revenue', icon: 'Wallet' },
    { slug: 'headcount-calculator', title: 'Headcount Calculator', description: 'Project year-end headcount', icon: 'Users' },
    { slug: 'workforce-planning-calculator', title: 'Workforce Planning', description: 'Project future hiring needs', icon: 'CalendarRange' },
  ],
} satisfies CalculatorSeoData;
export default seoData;