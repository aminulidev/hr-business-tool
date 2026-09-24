const seoData = {
  breadcrumbs: [{ label: 'Calculators' }, { label: 'Break Calculator' }],
  tableOfContents: [
    { id: 'how-to-calculate', label: 'How to Calculate' },
    { id: 'formula', label: 'Formula' },
    { id: 'worked-examples', label: 'Worked Examples' },
    { id: 'frequently-asked-questions', label: 'FAQs' },
    { id: 'related-calculators', label: 'Related Calculators' },
  ],
  howToSteps: [
    'Enter the shift length in hours.',
    'Select your state — break requirements auto-populate (CA, OR, WA, CO, NY have mandates; other states follow federal FLSA which does not require breaks).',
    'Click Calculate Required Breaks to see number of meal breaks, rest breaks, total break time, and net work hours.',
    'Review the detailed state-specific requirements (e.g., California requires 30-min meal before 5th hour).',
    'For net payable hours after lunch deduction, use our Lunch Deduction Calculator.',
  ],
  formula: 'CA: 1 meal (30min, unpaid) for shifts 5h+, 2 meals for 10h+\nCA: 1 rest (10min, paid) per 4h worked\nOR/WA/CO: 1 meal (30min, unpaid) for shifts 6h+\nNY: 1 meal (30min) for shifts 6h+, factory workers 1h\nOther states: FLSA does not require breaks',
  formulaDescription: 'Federal FLSA does not require meal or rest breaks. State mandates: California (LC 512) requires 30-min meal for 5h+ shifts (before 5th hour), 10-min paid rest per 4h. Oregon, Washington, Colorado require 30-min meal for 6h+. New York requires 30-min meal for 6h+. Missed breaks trigger 1-hour premium pay in California (LC 226.7).',
  workedExamples: [
    { title: 'California 8-Hour Shift', description: '8h shift in CA: 1 meal (30min, unpaid) required before 5th hour. 2 rest breaks (10min each, paid) — one per 4h. Total break = 50min. Net work = 7h 10min.' },
    { title: 'California 10-Hour Shift', description: '10h shift in CA: 2 meals (30min each, unpaid) — 2nd meal required for shifts 10h+. 2-3 rest breaks (10min, paid). Total meal = 60min, rest = 20-30min. Net work = 8h 30-40min.' },
    { title: 'Oregon 6-Hour Shift', description: '6h shift in OR: 1 meal (30min, unpaid) required for 6h+ shifts. 1 rest break (10min, paid) per 4h = 1 break. Total = 40min. Net work = 5h 20min.' },
    { title: 'Texas (No Mandate)', description: '8h shift in TX: FLSA does not require breaks. Employer policy may offer 30-min unpaid lunch + 2x 15-min paid rests. If employer offers short breaks (under 20min), they MUST be paid under FLSA Section 7(e).' },
    { title: 'NY Factory Worker', description: 'NY factory worker 6h+ shift: 1-hour meal break required (NY Labor Law 162). Office workers: 30-min meal for 6h+. Net work for 8h factory shift = 7h.' },
  ],
  faqs: [
    { question: 'Are employers required to give breaks?', answer: 'Federal FLSA does NOT require meal or rest breaks. However, if employers offer short breaks (5-20 min), they must be paid. Meal breaks (30+ min) can be unpaid if employee is fully relieved of duty. State mandates: California, Oregon, Washington, Colorado, New York, and others require meal breaks for shifts over 5-6 hours. Check your state labor code.' },
    { question: 'What are California break requirements?', answer: 'California Labor Code 512 requires: (1) 30-min unpaid meal break for shifts 5h+ (must start before 5th hour), (2) second 30-min meal for shifts 10h+, (3) 10-min paid rest break per 4h worked (or major fraction). Missing breaks triggers 1-hour premium pay per missed break (LC 226.7). Some exceptions: healthcare workers (waiver with consent), motion picture industry, certain CBA-covered employees.' },
    { question: 'Are meal breaks paid or unpaid?', answer: 'Meal breaks (30+ minutes) are typically UNPAID — but only if the employee is fully relieved of duty (free to leave premises, no work expectations). "Working lunches" where employee stays at desk or takes calls must be PAID. Rest breaks (5-20 min) must be PAID under FLSA Section 7(e) — they count as hours worked.' },
    { question: 'What happens if my employer doesn\'t give me breaks?', answer: 'In California: employer owes 1 hour of premium pay per missed meal break AND 1 hour per missed rest break (LC 226.7). File a wage claim with CA Labor Commissioner. In other states: file with state DOL or U.S. DOL Wage and Hour Division (1-866-4-US-WAGE). FLSA Section 16(b) allows private lawsuit for 2x unpaid wages + attorney fees.' },
    { question: 'Can I waive my lunch break?', answer: 'California: only for shifts 6h or less — mutual written consent (LC 512). Second meal can be waived if shift ≤ 12h and first meal not waived. Other states: depends on state law. FLSA: no waiver concept — if you work through lunch, employer must pay for the time and count it toward OT. Some employers require lunch even if waived for compliance safety.' },
    { question: 'How many 10-minute rest breaks am I entitled to?', answer: 'California: 1 paid 10-min rest break per 4h worked or major fraction thereof. So 4h = 1, 6h = 1.5 (rounded to 1 or 2), 8h = 2, 10h = 2-3. Oregon: 1 per 4h. Washington: 1 per 4h. Colorado: 1 per 4h. Other states: FLSA does not require rest breaks — employer policy applies. Rest breaks must be paid (FLSA 7(e)).' },
  ],
  relatedTools: [
    { slug: 'lunch-deduction-calculator', title: 'Lunch Deduction Calculator', description: 'Net hours after lunch', icon: 'Utensils' },
    { slug: 'time-card-calculator-with-lunch', title: 'Time Card with Lunch', description: 'Timesheet with auto lunch', icon: 'Coffee' },
    { slug: 'work-hours-calculator', title: 'Work Hours Calculator', description: 'Weekly hours tracking', icon: 'Clock' },
    { slug: 'shift-hours-calculator', title: 'Shift Hours Calculator', description: '8/10/12 hour shift calc', icon: 'CalendarClock' },
    { slug: 'overtime-calculator', title: 'Overtime Calculator', description: 'OT triggered by long shifts', icon: 'Timer' },
  ],
};
export default seoData;
