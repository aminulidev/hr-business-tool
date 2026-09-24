const seoData = {
  breadcrumbs: [{ label: 'Calculators' }, { label: 'Lunch Deduction Calculator' }],
  tableOfContents: [
    { id: 'how-to-calculate', label: 'How to Calculate' },
    { id: 'formula', label: 'Formula' },
    { id: 'worked-examples', label: 'Worked Examples' },
    { id: 'frequently-asked-questions', label: 'FAQs' },
    { id: 'related-calculators', label: 'Related Calculators' },
  ],
  howToSteps: [
    'Enter clock-in and clock-out times (supports 9:00 AM, 9am, 17:30 formats).',
    'Choose deduction mode: Fixed (always deduct), Auto (only if shift ≥ threshold), or Waive (no deduction).',
    'Set the lunch length in minutes (typical: 30 or 60).',
    'For Auto mode, set the trigger (e.g., 6 hours = auto-deduct only if shift ≥ 6h).',
    'Optionally enter hourly rate to see gross pay including daily OT.',
    'Click Calculate Net Hours to see gross, lunch deducted, net payable, decimal hours, and pay.',
  ],
  formula: 'Gross = Clock-Out - Clock-In (add 24h if overnight)\nFixed: Lunch = Lunch Length\nAuto: Lunch = (Gross/60 ≥ Trigger) ? Lunch Length : 0\nWaive: Lunch = 0\nNet = Gross - Lunch\nDecimal = Net / 60',
  formulaDescription: 'Net payable hours = gross shift hours minus unpaid lunch break. Fixed deduction always subtracts lunch; Auto deducts only if shift exceeds a threshold (commonly 6h); Waive subtracts nothing. California requires 30-min meal for shifts 5h+ (waivable only for shifts ≤ 6h). Auto-deduct is legal only if employee is actually relieved of duty.',
  workedExamples: [
    { title: 'Standard 8h Day with 30-min Lunch', description: '9:00 AM - 5:30 PM = 8h 30m gross. Fixed 30-min lunch. Net = 8h 0m = 8.00 decimal hours. At $22/hr = $176.' },
    { title: 'Part-Time 4h Shift — Auto Mode', description: '9:00 AM - 1:00 PM = 4h gross. Auto mode (trigger 6h): lunch = 0 (under 6h). Net = 4h. At $18/hr = $72. California: no meal required for shifts under 5h.' },
    { title: '6h Shift — Auto Triggers Lunch', description: '9:00 AM - 3:30 PM = 6h 30m gross. Auto mode (trigger 6h): lunch = 30 min. Net = 6h. At $20/hr = $120. CA: meal required for 5h+ shifts.' },
    { title: 'California 10h Shift', description: '8:00 AM - 6:30 PM = 10h 30m gross. CA requires 2 meals (60 min total). Fixed 60-min lunch. Net = 9h 30m. Daily OT: hours 9-10 = 1.5× ($33/hr if base $22). At $22/hr = (8×$22) + (1.5×$33) + (1×$22) = $232.50.' },
    { title: 'Waived Lunch (CA 6h Shift)', description: '9:00 AM - 3:00 PM = 6h gross. CA allows meal waiver for shifts ≤ 6h with mutual consent. Waive mode: lunch = 0. Net = 6h. At $25/hr = $150. Must have written waiver on file.' },
  ],
  faqs: [
    { question: 'How is lunch deduction calculated?', answer: 'Net hours = (clock-out - clock-in) - unpaid lunch minutes. Three modes: (1) Fixed — always deduct the specified lunch, (2) Auto — deduct only if shift exceeds a threshold (e.g., 6h), (3) Waive — no deduction. Most employers use Fixed 30-min deduction for shifts 6h+. Auto-deduct is legal only if the employee is actually relieved of duty.' },
    { question: 'Is auto-deduct lunch legal?', answer: 'Yes — under FLSA, employers can auto-deduct lunch if: (1) Employee is fully relieved of duty during lunch, (2) Employee actually takes the lunch, (3) Policy is clearly communicated in writing. If employee works through lunch (even occasionally), they must be paid — auto-deduct would be illegal wage theft. California requires employers to track actual meal periods and pay for missed meals.' },
    { question: 'Can my employer deduct lunch if I worked through it?', answer: 'No — under FLSA, all hours worked must be paid. If you worked through your lunch (answered emails, took calls, supervised), the employer must pay you and cannot deduct lunch time. "Working lunches" are PAID time. California requires 1-hour premium pay per missed meal (LC 226.7) in addition to the missed lunch pay.' },
    { question: 'Can I waive my lunch break in California?', answer: 'California allows meal waiver ONLY for shifts of 6 hours or less — with mutual written consent (LC 512). Second meal (for shifts 10h+) can be waived if shift ≤ 12h AND first meal was not waived. Outside CA, FLSA has no waiver concept — if you work through lunch, you must be paid for it.' },
    { question: 'What is a working lunch?', answer: 'A working lunch is when an employee eats at their desk while continuing to work (taking calls, answering email, supervising). Under FLSA, this time MUST be paid — it is not a true meal break because the employee is not "fully relieved of duty." Auto-deducting lunch from a working lunch is wage theft. True meal breaks require the employee to be free to leave the work area and not perform any duties.' },
    { question: 'How long must lunch breaks be?', answer: 'Most state mandates require 30-minute minimum meal break (CA, OR, WA, CO, NY, etc.). Some industries (NY factory workers) require 60-min meals. Federal FLSA does not specify a length — but if meal is under 20 min, it must be paid (treated as rest break). California LC 512 specifies 30-min minimum. Bona fide meal periods are typically 30-60 minutes.' },
  ],
  relatedTools: [
    { slug: 'time-card-calculator-with-lunch', title: 'Time Card with Lunch', description: 'Timesheet with auto lunch', icon: 'Coffee' },
    { slug: 'break-calculator', title: 'Break Calculator', description: 'Required meal and rest breaks', icon: 'PauseCircle' },
    { slug: 'work-hours-calculator', title: 'Work Hours Calculator', description: 'Weekly hours tracking', icon: 'Clock' },
    { slug: 'payroll-hours-calculator', title: 'Payroll Hours Calculator', description: 'Convert hours to gross pay', icon: 'Banknote' },
    { slug: 'clock-in-calculator', title: 'Clock In Calculator', description: 'Calculate clock-out time', icon: 'LogIn' },
  ],
};
export default seoData;
