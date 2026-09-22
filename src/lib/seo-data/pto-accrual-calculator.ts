const seoData = {
  breadcrumbs: [{ label: 'Calculators' }, { label: 'PTO Accrual Calculator' }],
  tableOfContents: [
    { id: 'how-to-calculate', label: 'How to Calculate' },
    { id: 'formula', label: 'Formula' },
    { id: 'worked-examples', label: 'Worked Examples' },
    { id: 'frequently-asked-questions', label: 'FAQs' },
    { id: 'related-calculators', label: 'Related Calculators' },
  ],
  howToSteps: [
    'Choose your accrual type: "per hour worked" (most common for hourly employees), "per pay period" (common for salaried), or "annual lump sum" (common for executive plans).',
    'Enter your accrual rate. For per-hour: 0.0192 = 2 weeks/year (80 hours), 0.0385 = 4 weeks/year (160 hours), 0.0577 = 6 weeks/year (240 hours). For per-pay-period: enter the hours accrued each paycheck.',
    'Enter hours worked per week (typically 40) and your pay periods per year (weekly=52, bi-weekly=26, semi-monthly=24, monthly=12).',
    'Enter your current PTO balance in hours if you want to project your year-end balance.',
    'Enter your hourly rate to calculate the cash value of your accrued PTO.',
    'Click "Calculate" to see annual PTO hours, days, per-paycheck accrual, year-end balance, and cash value.',
  ],
  formula: 'Annual PTO Hours = Accrual Rate × Hours Worked Per Week × 52 weeks\nAnnual PTO Days = Annual PTO Hours / 8\nCash Value = Annual PTO Hours × Hourly Rate',
  formulaDescription: 'PTO accrual is calculated by multiplying the accrual rate (hours of PTO earned per hour worked) by the hours worked in the period. Most US employers use one of three methods: (1) per-hour accrual — common for hourly employees, accrues proportionally to time worked; (2) per-pay-period — common for salaried employees, fixed hours granted each paycheck; (3) annual lump sum — common for executives, full year of PTO granted at start of year. Annual lump-sum grants typically require 1 year of tenure before eligibility.',
  workedExamples: [
    { title: 'Standard US Worker: 2 Weeks/Year at 40 hrs/week', description: 'A typical US worker earns 2 weeks of PTO per year. With 40 hours/week, that is 80 hours/year. The accrual rate is 80 / (40 × 52) = 0.0385 hours per hour worked. Per bi-weekly paycheck (26/year), they accrue 80 / 26 = 3.08 hours per paycheck. Over a year, they earn 80 hours = 10 days of PTO. Cash value at $25/hr = $2,000.' },
    { title: 'Generous Tech Employer: 4 Weeks/Year', description: 'A software engineer at a generous tech employer earns 4 weeks (160 hours) per year. Accrual rate = 160 / 2080 = 0.0769. Per bi-weekly paycheck: 160 / 26 = 6.15 hours. Over 5 years, balance grows to 800 hours (100 days) if unused. Cash value at $50/hr = $8,000/year in accrued PTO.' },
    { title: 'Annual Lump-Sum Plan: 3 Weeks Granted', description: 'An executive receives 120 hours (15 days) of PTO granted at the start of each calendar year. No accrual calculation needed — they have 120 hours available from January 1. If they leave mid-year, employer may claw back pro-rata unused PTO. Cash value at $100/hr loaded = $12,000.' },
    { title: 'Tiered Accrual by Tenure', description: 'Many employers increase accrual rate with tenure. Years 1-2: 0.0385 (2 weeks). Years 3-5: 0.0577 (3 weeks). Years 6-10: 0.0769 (4 weeks). Years 10+: 0.0962 (5 weeks). A 7-year employee earns 4 weeks (160 hours) per year, worth $4,000 at $25/hr.' },
    { title: 'Part-Time Worker: 25 hrs/week, 0.0385 Rate', description: 'A part-time employee working 25 hours/week at 0.0385 accrual rate earns 0.0385 × 25 × 52 = 50 hours/year (6.25 days). Per bi-weekly paycheck: 50/26 = 1.92 hours. At $15/hr, cash value = $750/year. Part-time PTO is typically pro-rated from the full-time rate.' },
  ],
  faqs: [
    { question: 'What is a typical PTO accrual rate?', answer: 'The most common US PTO accrual rate is 0.0385 hours per hour worked, which equals 2 weeks (80 hours) per year for a 40-hour-per-week employee. More generous employers offer 0.0577 (3 weeks) or 0.0769 (4 weeks). Tech companies often offer 0.0962-0.1154 (5-6 weeks). Government and union jobs may offer 0.1346+ (7+ weeks). To calculate your own rate: divide your annual PTO hours by (hours per week × 52).' },
    { question: 'How is PTO accrued per pay period?', answer: 'PTO accrued per pay period = Annual PTO hours / Number of pay periods per year. For 2 weeks (80 hours) PTO at bi-weekly pay (26 periods): 80 / 26 = 3.08 hours per paycheck. At semi-monthly pay (24 periods): 80 / 24 = 3.33 hours. At weekly pay (52 periods): 80 / 52 = 1.54 hours. The total annual accrual is the same regardless of pay frequency.' },
    { question: 'What is the cash value of my PTO?', answer: 'Cash value = accrued PTO hours × hourly rate. At $25/hour with 80 hours accrued, the cash value is $2,000. If your employer pays out unused PTO at termination (required in California, Colorado, and other states; not required in many others), this is the amount you should receive. Some employers cap payout or only pay out accrued (not advanced) PTO.' },
    { question: 'Does PTO accrue while on PTO?', answer: 'It depends on the employer policy. Most US employers DO accrue PTO while an employee is on paid time off — the accrual continues based on hours paid, not just hours worked. However, PTO typically does NOT accrue during unpaid leave (FMLA, personal leave without pay). Some employers also pause accrual during extended disability or workers comp leave. Check your employee handbook for specifics.' },
    { question: 'Can my employer cap PTO accrual?', answer: 'Yes. Many employers cap the maximum PTO balance an employee can carry — typically 1.5x to 2x the annual accrual. Once the cap is reached, the employee stops accruing until they use some PTO. This is legal in most states. However, in California, "use-it-or-lose-it" policies are illegal — employers must either pay out unused PTO at year-end or allow unlimited carryover.' },
    { question: 'Is unused PTO paid out when I leave?', answer: 'Depends on state law and employer policy. California, Colorado, Illinois, Massachusetts, and several other states REQUIRE payout of all accrued PTO at termination. Most other states allow employers to set their own policy — typically either paying out accrued PTO or forfeiting it. Check your state\'s labor code and your employer\'s employee handbook.' },
    { question: 'What is the difference between PTO and vacation?', answer: 'PTO (Paid Time Off) is a single bank of paid leave that can be used for any reason — vacation, sick, personal, etc. Vacation is a specific type of paid leave for leisure travel. PTO plans became popular in the 2000s as a simpler alternative to separate vacation + sick + personal banks. PTO gives employees more flexibility but typically results in less total leave (since sick and personal are bundled into one bank).' },
    { question: 'How does unlimited PTO work?', answer: 'Unlimited PTO policies give employees discretion to take as much paid time off as they want, subject to manager approval. Pros: no accrual tracking, no payout liability at termination, employees feel trusted. Cons: studies show employees take LESS time off under unlimited policies (averaging 13 days vs. 17 days under traditional plans), and there is no accrued PTO to cash out at termination. Unlimited PTO is most common at tech startups and professional services firms.' },
  ],
  relatedTools: [
    { slug: 'time-card-calculator-with-lunch', title: 'Time Card Calculator with Lunch', description: 'Weekly timesheet with overtime', icon: 'Clock' },
    { slug: 'hourly-paycheck-calculator', title: 'Hourly Paycheck Calculator', description: 'Net take-home after taxes', icon: 'Wallet' },
    { slug: 'wages-calculator', title: 'Wages Calculator', description: 'Hourly to annual pay conversion', icon: 'Banknote' },
    { slug: 'payroll-calculator', title: 'Payroll Calculator', description: 'Employer-side payroll calculation', icon: 'CreditCard' },
    { slug: 'salary-converter', title: 'Salary Converter', description: 'Convert pay between periods', icon: 'ArrowLeftRight' },
  ],
};

export default seoData;
