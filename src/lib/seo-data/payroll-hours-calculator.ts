const seoData = {
  breadcrumbs: [{ label: 'Calculators' }, { label: 'Payroll Hours Calculator' }],
  tableOfContents: [
    { id: 'how-to-calculate', label: 'How to Calculate' },
    { id: 'formula', label: 'Formula' },
    { id: 'worked-examples', label: 'Worked Examples' },
    { id: 'frequently-asked-questions', label: 'FAQs' },
    { id: 'related-calculators', label: 'Related Calculators' },
  ],
  howToSteps: [
    'Enter regular hours worked (up to 40 per week for straight time).',
    'Enter overtime hours (over 40 per week — paid at 1.5x regular rate).',
    'Optionally enter double-time hours (2x regular rate, e.g., California over 12h/day).',
    'Enter your hourly rate and pay frequency.',
    'Click Calculate Payroll to see weekly gross, per-paycheck amount, and annual gross.',
  ],
  formula: 'OT Rate = Regular Rate x 1.5\nDT Rate = Regular Rate x 2\nWeekly Gross = (Reg Hours x Rate) + (OT Hours x OT Rate) + (DT Hours x DT Rate)\nPer Paycheck = Weekly Gross x (52 / Pays per Year)',
  formulaDescription: 'Payroll hours are converted to gross wages using the FLSA regular rate. Overtime (over 40h/week) is paid at 1.5× under FLSA Section 7. Double-time (2×) is required in California for hours over 12/day or over 8 on the 7th consecutive day. The regular rate includes shift differentials and non-discretionary bonuses.',
  workedExamples: [
    { title: 'Standard 40-Hour Week', description: '40h regular at $22/hr. OT = 0. DT = 0. Weekly gross = $880. Bi-weekly (26 pays) = $1,760. Annual = $45,760. No FICA impact shown — see Payroll Calculator for net pay.' },
    { title: 'Week with 5h Overtime', description: '40h reg + 5h OT at $25/hr. OT rate = $37.50. Weekly = (40 x $25) + (5 x $37.50) = $1,000 + $187.50 = $1,187.50. Bi-weekly = $2,375. Annual = $61,750.' },
    { title: 'California Long Day with DT', description: '40h reg + 8h OT + 2h DT at $30/hr. OT rate = $45. DT rate = $60. Weekly = (40 x $30) + (8 x $45) + (2 x $60) = $1,200 + $360 + $120 = $1,680. CA: DT for hours 13-14 in a day.' },
    { title: 'Multiple Part-Time Jobs', description: 'Two jobs: Job A 25h at $20/hr, Job B 20h at $25/hr. No OT (each job separately under 40h). Weekly = $500 + $500 = $1,000. But: if same employer, total = 45h, OT = 5h at weighted avg rate = $22.22 x 1.5 = $33.33. OT pay = $166.67. Total = $1,166.67.' },
    { title: 'Annual Bonus Allocation', description: '$50,000 base + $5,000 annual non-discretionary bonus. Bonus must be allocated to OT calculation. If 2,000 regular + 200 OT hours worked: bonus/hour = $5,000/2,200 = $2.27. New regular rate = $25 + $2.27 = $27.27. OT = 0.5 x $2.27 x 200 = $227 additional OT owed.' },
  ],
  faqs: [
    { question: 'How do I calculate gross pay from hours worked?', answer: 'Gross Pay = (Regular Hours x Rate) + (OT Hours x Rate x 1.5) + (DT Hours x Rate x 2). For non-exempt employees, all hours over 40/week must be paid at 1.5× the regular rate. California also requires 1.5× for hours 9-12 in a day and 2× for hours over 12. Net pay (after taxes) requires additional calculations — see Payroll Calculator.' },
    { question: 'What is the regular rate of pay?', answer: 'Under FLSA Section 7(e), the regular rate includes ALL non-overtime compensation: hourly wage, shift differentials, non-discretionary bonuses (production, attendance, quality), commissions, and certain incentive pay. It does NOT include: discretionary bonuses, gifts, payments for occasional periods not worked (PTO, holidays), employer-paid insurance, retirement contributions, or overtime premium itself.' },
    { question: 'How is overtime calculated with bonuses?', answer: 'Non-discretionary bonuses must be allocated across all hours worked in the bonus period, added to the base rate, and OT recalculated. Example: $22/hr + $200 weekly production bonus / 45 hours = $4.44/hour additional. New regular rate = $26.44. OT rate = $39.66 (was $33). Additional OT owed = 5h x $6.66 = $33.33. Failure to do this is "regular rate" violation.' },
    { question: 'Does overtime count toward next week?', answer: 'No — overtime is calculated per workweek (168-hour period). Cannot be carried over or averaged across weeks. If you work 50h in week 1 and 30h in week 2, you owe 10h OT for week 1 — you cannot "average" to 40h/week. Comp time in lieu of OT is illegal for private sector non-exempt employees under FLSA.' },
    { question: 'How does double-time work in California?', answer: 'California Labor Code 510 requires double-time (2× regular rate) for: (1) Hours worked over 12 in a single workday, and (2) Hours worked over 8 on the 7th consecutive day in a workweek. The first 8 hours on the 7th consecutive day are paid at 1.5×. Hours 9+ on the 7th day are 2×. Federal FLSA has NO double-time requirement.' },
    { question: 'How is gross pay different from net pay?', answer: 'Gross pay = total earnings before any taxes or deductions. Net pay (take-home) = gross pay MINUS federal income tax, FICA (Social Security 6.2% + Medicare 1.45%), state income tax, local tax, 401(k) contributions, HSA, section-125 benefits (health/dental), wage garnishments, and union dues. Use our Payroll Calculator or W-2 Calculator for full net pay calculation.' },
  ],
  relatedTools: [
    { slug: 'payroll-calculator', title: 'Payroll Calculator', description: 'Net pay after taxes', icon: 'CreditCard' },
    { slug: 'hourly-paycheck-calculator', title: 'Hourly Paycheck Calculator', description: 'Take-home for hourly workers', icon: 'BadgeDollarSign' },
    { slug: 'overtime-calculator', title: 'Overtime Calculator', description: 'OT with state rules', icon: 'Timer' },
    { slug: 'time-and-a-half-calculator', title: 'Time and a Half Calculator', description: 'Simple 1.5x OT calc', icon: 'AlarmClock' },
    { slug: 'double-time-calculator', title: 'Double Time Calculator', description: '2x OT (CA rules)', icon: 'Timer' },
  ],
};
export default seoData;
