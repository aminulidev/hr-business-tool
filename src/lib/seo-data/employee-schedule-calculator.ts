const seoData = {
  breadcrumbs: [{ label: 'Calculators' }, { label: 'Employee Schedule Calculator' }],
  tableOfContents: [
    { id: 'how-to-calculate', label: 'How to Calculate' },
    { id: 'formula', label: 'Formula' },
    { id: 'worked-examples', label: 'Worked Examples' },
    { id: 'frequently-asked-questions', label: 'FAQs' },
    { id: 'related-calculators', label: 'Related Calculators' },
  ],
  howToSteps: [
    'Enter each employee\'s name and their shift for each day of the week (e.g., "9-5" or "8-4").',
    'Enter their hourly rate for pay calculation.',
    'Add or remove employees using the + and x buttons.',
    'Click Calculate Schedule to see total hours per employee, weekly totals, and OT alerts.',
    'Review OT alerts to identify employees exceeding 40 hours/week (FLSA overtime threshold).',
  ],
  formula: 'Per Employee Weekly Hours = Sum of daily shift durations\nOT Hours = max(0, Weekly Hours - 40)\nPer Employee Pay = (Reg Hours x Rate) + (OT Hours x Rate x 1.5)\nTotal Schedule Hours = Sum of all employee hours',
  formulaDescription: 'Build a weekly schedule by entering shift ranges (e.g., 9-5) for each employee per day. The calculator parses shift ranges, computes weekly hours per employee, flags overtime (over 40h/week per FLSA), and calculates total labor cost. Use this for staffing plans, coverage analysis, and labor budgeting.',
  workedExamples: [
    { title: 'Small Retail Team', description: 'Alice: Mon-Fri 9-5 (40h). Bob: Mon-Fri 12-8 (40h). Carol: Sat-Sun 10-6 (16h). Total = 96h/week. No OT. At $18/hr avg = $1,728/week labor cost.' },
    { title: 'Restaurant with OT', description: 'Cook: 6 days x 8h = 48h (8h OT). Server A: 5 days x 6h = 30h. Server B: 4 days x 7h = 28h. Total = 106h. Cook OT = 8h at 1.5x. At $20/hr cook + $15/hr servers = (40x$20) + (8x$30) + (30x$15) + (28x$15) = $1,510.' },
    { title: '24/7 Coverage with 4 Crews', description: '4 crews x 42h/week avg (12h shifts, 2-2-3 pattern) = 168h total coverage. Each crew: 2h OT/week avg. At $30/hr = (40x$30) + (2x$45) = $1,290/week per crew, $5,160 total.' },
    { title: 'Office Team with PTO', description: 'Alice: Mon-Thu 9-5 (32h, Fri PTO). Bob: Mon-Wed 9-5 (24h, Thu-Fri PTO). Carol: Mon-Fri 9-5 (40h). Total = 96h. No OT. PTO covered by temp or redistributed.' },
    { title: 'Mixed Shift Pattern', description: 'Alice: 3x 12h shifts (36h). Bob: 4x 10h shifts (40h). Carol: 5x 8h shifts (40h). Total = 116h. No FLSA OT. California: Alice has 12h daily OT each day (hours 9-12). Bob has 2h OT/day x 4 = 8h OT/week.' },
  ],
  faqs: [
    { question: 'How do I build an employee schedule?', answer: 'List employees, assign shifts to each per day. Track total hours per employee to avoid OT (>40h/week). Ensure coverage by day and time. Use scheduling software (When I Work, Deputy, Sling, Humanity) for shift swaps and time-off requests. Best practice: post schedules 2+ weeks in advance — some cities (SF, Seattle, NYC) require by law.' },
    { question: 'What is fair workweek scheduling?', answer: 'Fair workweek laws (SF, Seattle, NYC, Chicago, Philadelphia, Oregon) require employers to: (1) Post schedules 14 days in advance, (2) Compensate for last-minute changes ("predictability pay"), (3) Offer shifts to existing part-timers before hiring new, (4) Provide "right to rest" — 10+ hours between shifts. Penalties: $10-$200 per violation.' },
    { question: 'How many employees do I need for 24/7 coverage?', answer: 'For 24/7 coverage with 40h/week per employee: 168h/week ÷ 40h = 4.2 employees minimum. With 4 crews on rotating 12h shifts (2-2-3 pattern) = 4 employees cover 24/7 with avg 42h/week each (2h OT). For 8h shifts: 4 shifts/day x 7 days = 28 shifts ÷ 5 shifts per employee = 5.6 employees minimum.' },
    { question: 'How do I calculate labor cost for a schedule?', answer: 'Per employee: (regular hours × rate) + (OT hours × rate × 1.5) + (DT hours × rate × 2). Sum across all employees for total labor cost. Add employer taxes (FICA 7.65%, FUTA 0.6%, SUTA 1-5%), workers comp (1-5% of payroll), and benefits (typically 20-30% of wages). True labor cost = wages x 1.25-1.40.' },
    { question: 'What is overtime and when does it apply?', answer: 'FLSA overtime = 1.5× regular rate for non-exempt employees working over 40h in a single workweek. California adds daily OT (1.5× for hours 9-12, 2× for hours 13+). Alaska, Nevada have daily OT after 8h/day. Exempt employees (executive, administrative, professional) do not earn OT — 2024 threshold $43,888/year ($58,656 in 2025).' },
    { question: 'What is shift differential and how is it scheduled?', answer: 'Shift differential = extra pay for less-desirable shifts (2nd/swing, 3rd/graveyard, weekends). Typical: 5-10% for swing, 10-15% for graveyard, 5-10% for weekends. When scheduling, assign shifts equitably — don\'t always assign the same employees to nights. Track differential separately in payroll for FLSA regular rate calculation.' },
  ],
  relatedTools: [
    { slug: 'shift-rotation-calculator', title: 'Shift Rotation Calculator', description: '2-2-3, DuPont, Pitman patterns', icon: 'RefreshCw' },
    { slug: 'employee-hours-calculator', title: 'Employee Hours Calculator', description: 'Track hours for multiple employees', icon: 'Users' },
    { slug: 'shift-hours-calculator', title: 'Shift Hours Calculator', description: '8/10/12 hour shift tracking', icon: 'CalendarClock' },
    { slug: 'payroll-hours-calculator', title: 'Payroll Hours Calculator', description: 'Convert hours to gross pay', icon: 'Banknote' },
    { slug: 'work-hours-calculator', title: 'Work Hours Calculator', description: 'Single-employee weekly hours', icon: 'Clock' },
  ],
};
export default seoData;
