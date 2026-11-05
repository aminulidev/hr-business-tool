const seoData = {
  breadcrumbs: [
    { label: 'Calculators', href: '/calculators' },
    { label: 'Severance Pay Calculator', href: '/calculators/severance-pay-calculator' },
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
    'Enter your base annual gross salary (or annualized hourly pay) — severance formulas almost always use base pay before bonuses or commissions unless your employment contract specifies otherwise.',
    'Enter your completed years of service with the employer — check whether your company rounds partial years up after 6 months or prorates by completed months.',
    'Select the weeks-per-year severance multiplier — 1 week per year of service is standard for non-exempt/entry roles, 2 weeks per year is standard for mid-level and tech professionals, and 3–4 weeks per year is common for directors and executives.',
    'Add any minimum floor (e.g., 4 weeks minimum) or maximum cap (commonly 26 or 52 weeks), plus accrued unused PTO payout and COBRA health insurance continuation months.',
    'Review your gross severance payout, total weeks of pay, IRS 22% flat supplemental tax withholding, FICA deductions, and estimated net lump-sum check.',
  ],
  formula:
    'Weekly Base Pay = Annual Base Salary ÷ 52\n' +
    'Severance Weeks = min(Max Cap, max(Min Floor, Years of Service × Multiplier))\n' +
    'Gross Severance Pay = (Weekly Base Pay × Severance Weeks) + Accrued PTO Payout\n' +
    'Federal Supplemental Tax Withholding = Gross Severance × 22%  [37% over $1,000,000]\n' +
    'Estimated Net Severance = Gross Severance − Federal (22%) − FICA (7.65%) − State Tax',
  formulaDescription:
    'In the United States, severance pay is calculated as a multiple of your weekly base salary multiplied by your years of tenure, often bounded by a minimum floor (such as 2 to 4 weeks regardless of tenure) and a maximum ceiling (typically 26 weeks, or 6 months of pay). Because the IRS classifies lump-sum severance as "supplemental wages" under IRS Publication 15, employers usually withhold federal income tax at a flat 22% statutory rate alongside 6.2% Social Security (up to the $184,500 annual cap) and 1.45% Medicare.',
  workedExamples: [
    {
      title: 'Tech Mid-Level Software Engineer — $135,000 Salary, 4 Years Tenure (4-Week Base + 2 Wks/Yr)',
      description:
        'Many technology companies use a hybrid formula: a 4-week base plus 2 weeks per year of service. At 4 years of tenure, total severance is 4 + (4 × 2) = 12 weeks. Weekly base pay = $135,000 ÷ 52 = $2,596.15/week. Gross severance = 12 × $2,596.15 = $31,153.85. Adding 40 hours (1 week) of accrued unused PTO ($2,596.15) brings total gross payout to $33,750.00. After 22% federal supplemental withholding ($7,425.00) and 7.65% FICA ($2,581.88) in a 0%-tax state, estimated net lump-sum take-home is $23,743.12 (plus 3 months of employer-subsidized COBRA worth ~$2,400).',
    },
    {
      title: 'Corporate Marketing Manager — $95,000 Salary, 7 Years Tenure at 2 Weeks/Year',
      description:
        'At $95,000/year, weekly base pay is $1,826.92. Using a standard corporate policy of 2 weeks per year of service across 7 years yields 14 weeks of severance: 14 × $1,826.92 = $25,576.92 gross. Federal supplemental withholding (22%) is $5,626.92, FICA (7.65%) is $1,956.63, and state tax at 4.5% is $1,150.96—leaving an estimated net payout of $16,842.41.',
    },
    {
      title: 'Senior Operations Director — $190,000 Salary, 16 Years Tenure (Capped at 26 Weeks)',
      description:
        'A director earning $190,000 ($3,653.85/week) with 16 years of tenure under a 2-week-per-year policy would uncap at 32 weeks ($116,923). However, the company enforces a 26-week (6-month) maximum cap, limiting gross severance to 26 × $3,653.85 = $95,000.00. Because the director already earned $150,000 in regular YTD salary prior to the layoff, only the first $34,500 of the severance is subject to 6.2% Social Security ($2,139.00) before hitting the $184,500 2026 cap, while all $95,000 pays 1.45% Medicare ($1,377.50) and 22% federal supplemental withholding ($20,900.00).',
    },
    {
      title: 'WARN Act Mass Layoff — 60-Day Garden Leave + Standard Severance ($65,000 Salary, 3 Years)',
      description:
        'When a plant or office with 100+ employees conducts a mass layoff without advance notice, the federal WARN Act mandates 60 calendar days (8.57 weeks) of full pay and benefits. For an employee earning $65,000 ($1,250.00/week) with 3 years of service, 60 days of WARN pay equals $10,714.29, plus 3 weeks of company policy severance (1 wk/yr = $3,750.00), for a total transition package of $14,464.29 gross.',
    },
  ],
  benchmarkTables: [
    {
      title: '2026 US Corporate Severance Pay Benchmarks by Job Level & Tenure',
      subtitle:
        'Standard severance formulas, minimum floors, maximum caps, and COBRA continuation norms across US employers (compiled from LHH Outplacement, SHRM, and Carta layoff benchmarks).',
      headers: [
        'Employee Level / Tier',
        'Typical Formula (Weeks per Year)',
        'Minimum Floor',
        'Maximum Cap',
        'Typical COBRA & Perks Included',
      ],
      rows: [
        ['Hourly / Non-Exempt Staff', '1 week per year of service', '1 – 2 weeks', '12 – 16 weeks', '1 month COBRA or lump-sum stipend'],
        ['Exempt Individual Contributor', '1.5 – 2 weeks per year', '2 – 4 weeks', '24 – 26 weeks', '1 – 3 months COBRA + Outplacement'],
        ['Tech / SaaS IC & Senior Eng', '4-wk base + 1 to 2 wks/year', '6 – 8 weeks', '26 weeks', '3 – 6 months COBRA + Laptop keep + Cliff vest'],
        ['Manager / Senior Manager', '2 weeks per year of service', '4 – 8 weeks', '26 – 39 weeks', '3 – 6 months COBRA + Prorated target bonus'],
        ['Director / VP', '2.5 – 3.5 weeks per year', '12 – 16 weeks', '39 – 52 weeks', '6 – 9 months COBRA + Prorated bonus + Equity accel'],
        ['C-Suite / Executive (Employment Agmt)', '6 – 12 months fixed + 1 mo/yr', '26 – 52 weeks', '52 – 104 weeks', '12 – 18 months COBRA + Target bonus + 12m vest'],
      ],
    },
    {
      title: 'Gross vs. Net Lump-Sum Severance Payout Table (2026 Supplemental Tax Withholding)',
      subtitle:
        'Estimated lump-sum severance check after 22% IRS supplemental withholding, 7.65% FICA, and a 4% illustrative state income tax.',
      headers: [
        'Annual Salary',
        'Weekly Base Pay',
        '8 Weeks Gross / Net',
        '12 Weeks Gross / Net',
        '16 Weeks Gross / Net',
        '26 Weeks (6 Mo) Gross / Net',
      ],
      rows: [
        ['$60,000', '$1,153.85', '$9,231 gross → $6,125 net', '$13,846 gross → $9,187 net', '$18,462 gross → $12,249 net', '$30,000 gross → $19,905 net'],
        ['$85,000', '$1,634.62', '$13,077 gross → $8,677 net', '$19,615 gross → $13,015 net', '$26,154 gross → $17,353 net', '$42,500 gross → $28,199 net'],
        ['$110,000', '$2,115.38', '$16,923 gross → $11,228 net', '$25,385 gross → $16,843 net', '$33,846 gross → $22,457 net', '$55,000 gross → $36,493 net'],
        ['$140,000', '$2,692.31', '$21,538 gross → $14,291 net', '$32,308 gross → $21,436 net', '$43,077 gross → $28,582 net', '$70,000 gross → $46,445 net'],
        ['$180,000', '$3,461.54', '$27,692 gross → $18,374 net', '$41,538 gross → $27,561 net', '$55,385 gross → $36,748 net', '$90,000 gross → $59,715 net'],
      ],
    },
  ],
  deepDiveSections: [
    {
      title: 'How the Federal WARN Act & State Mini-WARN Laws Protect Laid-Off Employees',
      paragraphs: [
        'While the Fair Labor Standards Act (FLSA) does not require private employers to provide severance pay, the federal Worker Adjustment and Retraining Notification (WARN) Act mandates that employers with 100 or more full-time employees give at least 60 calendar days of advance written notice before a plant closing (affecting 50+ workers) or a mass layoff (affecting 500+ workers, or 50–499 workers if they represent at least 33% of the active workforce at a single site).',
        'If an employer lays off workers immediately without giving the full 60-day notice, it must pay 60 days of "back pay and benefits" (often structured as a 60-day paid non-working garden leave on regular payroll before any policy severance kicks in). Furthermore, several states enforce stricter "Mini-WARN" statutes: California (Cal-WARN applies to employers with 75+ employees regardless of the 33% threshold), New York (NY WARN requires 90 days of advance notice for employers with 50+ employees), and New Jersey (NJ WARN mandates 90 days of notice PLUS mandatory statutory severance of 1 week of pay per full year of service for covered mass layoffs, even if the employee signs nothing).',
      ],
    },
    {
      title: 'Why Lump-Sum Severance Is Withheld at 22% — And When You Get a Tax Refund',
      paragraphs: [
        'Under IRS Publication 15 (Circular E), severance pay, cashed-out vacation/PTO, and sign-on or retention bonuses are classified as "supplemental wages." When an employer pays severance as a standalone lump sum separate from your regular final paycheck, it typically uses the flat optional supplemental withholding rate of 22% (or 37% on any portion of supplemental wages exceeding $1,000,000 in a calendar year).',
        'Remember that tax withholding is not your final tax rate. If you are laid off mid-year and remain unemployed or earn less during the rest of the calendar year, your actual effective federal income tax bracket on Form 1040 may be only 10% or 12%. In that case, the 22% withheld from your lump-sum severance check will result in a substantial federal tax refund when you file your annual return.',
      ],
    },
    {
      title: '5 High-Leverage Items You Can Negotiate in a Severance Agreement',
      paragraphs: [
        'When an employer presents a severance package, they are paying you in exchange for signing a General Release of Claims (waiving your right to sue for wrongful termination, discrimination, or statutory claims) as well as non-disparagement and confidentiality covenants. Under the Older Workers Benefit Protection Act (OWBPA), employees aged 40 and older must be given at least 21 days to review an individual severance agreement (or 45 days in a group layoff of two or more employees) plus a mandatory 7-day revocation period after signing.',
        'Even when HR says the "weeks per year formula is non-negotiable," five high-value levers are frequently negotiable: (1) Employer-paid COBRA health insurance subsidies (worth $700–$2,200/month tax-free if paid directly by the employer); (2) Prorated annual performance bonus payout; (3) Acceleration of upcoming RSU or stock option vesting cliffs within 30–90 days of the termination date; (4) Extending the stock option post-termination exercise window (PTEW) from 90 days to 12–24 months; and (5) Mutual non-disparagement and neutral reference clauses plus agreement not to contest state unemployment insurance claims.',
      ],
    },
  ],
  faqs: [
    {
      question: 'Is severance pay required by federal or state law in the US?',
      answer:
        'Under federal law, there is no general requirement to provide severance pay to terminated employees unless stipulated in an individual employment contract, executive offer letter, collective bargaining agreement, or ERISA-governed severance plan. However, the federal WARN Act requires 60 days of advance notice (or 60 days of pay in lieu of notice) for qualifying mass layoffs, and New Jersey’s Mini-WARN law requires mandatory statutory severance of 1 week per year of service during covered mass layoffs.',
    },
    {
      question: 'How is severance pay taxed in 2026?',
      answer:
        'Severance pay is 100% taxable as ordinary W-2 wage income in the year it is paid. It is subject to federal income tax withholding (typically at the 22% flat supplemental wage rate up to $1 million, or aggregated with your final paycheck), Social Security tax (6.2% up to the $184,500 2026 annual wage cap), Medicare tax (1.45% uncapped, plus 0.9% above $200,000), and applicable state/local income taxes.',
    },
    {
      question: 'Must my employer pay out my unused vacation or PTO in addition to severance?',
      answer:
        'In roughly 20 states—including California, Colorado, Illinois, Massachusetts, Montana, and Louisiana—accrued vacation and unrestricted PTO are legally classified as earned wages that MUST be paid out in full on your final paycheck regardless of whether you sign a severance agreement. In other states (such as Texas, Florida, and New York), PTO payout depends on the written terms of the company’s employee handbook.',
    },
    {
      question: 'Does receiving severance pay disqualify me from collecting unemployment benefits?',
      answer:
        'It depends on your state’s unemployment insurance (UI) statute and how the severance is paid. In states like California, severance paid in exchange for signing a release of claims is generally not considered "wages" that reduce UI benefits, allowing you to collect unemployment immediately. In states like Texas, New York, or Massachusetts, lump-sum or salary-continuation severance covering a specified number of weeks may delay your unemployment benefits until the severance period expires, unless the payment is contingent on signing a statutory release of claims.',
    },
    {
      question: 'What is the difference between Lump-Sum Severance and Salary Continuation?',
      answer:
        'A lump-sum severance pays the entire gross amount in a single check after your 7-day revocation period expires, giving you immediate liquidity and allowing you to start a new job tomorrow without losing a dime ("double dipping"). Salary continuation keeps you on the company’s regular bi-weekly payroll for the duration of the severance period—which often keeps active employee health insurance rates in place instead of pricey COBRA, but sometimes includes "mitigation/clawback" clauses that stop payments if you start a new full-time job.',
    },
    {
      question: 'Why do employees over age 40 get 21 or 45 days to sign a severance agreement?',
      answer:
        'Under the federal Older Workers Benefit Protection Act (OWBPA), which amended the Age Discrimination in Employment Act (ADEA), any waiver of age discrimination claims by an employee aged 40 or older is legally invalid unless the employer provides at least 21 calendar days to consider an individual termination agreement—or at least 45 calendar days if the layoff affects a group of two or more employees—along with a mandatory 7-day post-signing revocation period and a written disclosure of the job titles and ages of all employees selected and not selected for the layoff.',
    },
  ],
  relatedTools: [
    { slug: 'hourly-paycheck-calculator', title: 'Hourly Paycheck Calculator', description: 'Calculate regular paycheck net pay after 2026 taxes', icon: 'CreditCard' },
    { slug: 'bonus-tax-calculator', title: 'Bonus & Supplemental Tax Calculator', description: 'See 22% IRS supplemental withholding on lump sums', icon: 'Gift' },
    { slug: 'after-tax-income-calculator', title: 'After-Tax Income Calculator', description: 'Estimate full-year net income after taxes', icon: 'Wallet' },
    { slug: 'salary-converter', title: 'Salary to Hourly Converter', description: 'Convert annual salary to weekly & daily rates', icon: 'ArrowLeftRight' },
    { slug: 'employee-turnover-calculator', title: 'Employee Turnover Calculator', description: 'Calculate organizational turnover rate & cost', icon: 'Users' },
    { slug: 'pto-accrual-calculator', title: 'PTO Accrual Calculator', description: 'Calculate accrued vacation hours & cash-out value', icon: 'CalendarCheck' },
  ],
};

export default seoData;
