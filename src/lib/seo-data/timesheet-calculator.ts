const seoData = {
  breadcrumbs: [{ label: 'Calculators' }, { label: 'Timesheet Calculator' }],
  tableOfContents: [
    { id: 'how-to-calculate', label: 'How to Calculate' },
    { id: 'formula', label: 'Formula' },
    { id: 'worked-examples', label: 'Worked Examples' },
    { id: 'frequently-asked-questions', label: 'FAQs' },
    { id: 'related-calculators', label: 'Related Calculators' },
  ],
  howToSteps: [
    'Enter employee name and the week starting date.',
    'Set the unpaid lunch break length (default 30 min) and hourly rate.',
    'For each day, enter clock-in, lunch-out, lunch-in, and clock-out times. Supports 9:00 AM, 9am, 17:30 formats.',
    'Click Calculate Timesheet to see daily net hours, decimal conversion, weekly total, OT, and gross pay.',
    'Click Print to print or save as PDF for your records.',
  ],
  formula: 'Daily Net = (Lunch-Out - Clock-In) + (Clock-Out - Lunch-In)\nWeekly Net = Sum of Daily Net\nOT Hours = max(0, Weekly Net / 60 - 40)\nGross Pay = (Reg Hours x Rate) + (OT Hours x Rate x 1.5)',
  formulaDescription: 'A timesheet captures daily clock-in/out times with a mid-day lunch break. Net hours equal morning work + afternoon work. Weekly hours over 40 trigger FLSA overtime at 1.5× the regular rate. Timesheets must be retained for 2+ years under FLSA 29 CFR 516.5.',
  workedExamples: [
    { title: 'Standard 40-Hour Week', description: 'John Smith, $22/hr. Mon-Fri 8:00 AM-12:00 PM + 1:00-5:00 PM (8h/day, 60-min lunch). Daily net = 4h + 4h = 8h. Weekly = 40h. OT = 0. Gross pay = 40 x $22 = $880.' },
    { title: 'Week with Overtime', description: 'Mon-Thu 8h/day, Fri 8:00 AM-6:00 PM with 60-min lunch (9h). Weekly = 41h. OT = 1h at $33 (1.5x). Pay = (40 x $22) + (1 x $33) = $913.' },
    { title: 'Split-Shift Worker', description: 'Tue-Thu 6:00 AM-10:00 AM + 4:00 PM-8:00 PM (8h/day, no lunch since shifts are under 5h each). Weekly = 24h. Pay = 24 x $18 = $432. California: no meal required for shifts under 5h.' },
    { title: 'Saturday Shift with OT', description: 'Mon-Fri 8h/day + Saturday 8:00 AM-4:30 PM with 30-min lunch (8h). Weekly = 48h. OT = 8h at $30 (1.5x of $20). Pay = (40 x $20) + (8 x $30) = $1,040.' },
    { title: 'Compressed 4x10 Schedule', description: 'Mon-Thu 7:00 AM-6:00 PM with 60-min lunch (10h/day). Weekly = 40h. No FLSA OT. California: 2h daily OT x 4 days = 8h OT/week at 1.5x. CA pay = (32 x $25) + (8 x $37.50) = $1,100.' },
  ],
  faqs: [
    { question: 'What is a timesheet?', answer: 'A timesheet is a record of an employee\'s daily work hours, typically organized by workweek. It captures clock-in/out times, break deductions, total hours, and overtime. Timesheets are used for payroll processing, billing (for professional services), and FLSA compliance. Employers must retain timesheets for 2+ years (29 CFR 516.5); some states require 3-6 years.' },
    { question: 'How long must employers keep timesheets?', answer: 'FLSA 29 CFR 516.5 requires 2 years retention of basic time records. Some states require longer: California (4 years), New York (6 years), Illinois (3 years). Best practice: retain digital time records indefinitely. Required information: employee name, address, DOB (if under 19), sex, occupation, time/day work began and ended, daily hours, wage rate, additions/deductions.' },
    { question: 'Should lunch breaks be on the timesheet?', answer: 'Yes — unpaid meal breaks (30+ minutes with employee fully relieved of duty) should be deducted from total work hours. Paid rest breaks (10-20 min) are counted as work time and NOT deducted. The timesheet should show clock-in, lunch-out, lunch-in, and clock-out to clearly document the unpaid meal period.' },
    { question: 'Can I edit my timesheet after submission?', answer: 'Yes — corrections should be allowed, but the original entry and the correction should both be retained. FLSA requires accurate time records of all hours actually worked. Employers cannot "round" timesheets in a way that consistently short-changes employees. Rounding to nearest 15 min is allowed only if it averages out over time (29 CFR 785.48).' },
    { question: 'What is the 7-minute rounding rule?', answer: 'FLSA allows time rounding to the nearest 5, 6, 10, or 15 minutes — but the rounding must average out over time so employees are fully compensated. Common practice: 1-7 minutes after the hour rounds down, 8-15 minutes rounds up. Consistently rounding only in the employer\'s favor is illegal. Many modern time clocks track to the minute to avoid disputes.' },
    { question: 'Can salaried employees be required to fill out timesheets?', answer: 'Yes — there is no law against requiring timesheets for salaried employees. Non-exempt salaried employees MUST track hours (they earn OT). Exempt employees are not required by FLSA to track hours, but employers may require it for billing, attendance, or PTO accrual purposes. Tracking exempt employee hours does NOT make them non-exempt.' },
  ],
  relatedTools: [
    { slug: 'time-card-calculator', title: 'Time Card Calculator', description: 'Single-shift weekly timesheet', icon: 'Clock' },
    { slug: 'time-card-calculator-with-lunch', title: 'Time Card with Lunch', description: 'Auto-deduct lunch from timesheet', icon: 'Coffee' },
    { slug: 'work-hours-calculator', title: 'Work Hours Calculator', description: 'Weekly hours from clock times', icon: 'Clock' },
    { slug: 'payroll-hours-calculator', title: 'Payroll Hours Calculator', description: 'Convert hours to gross pay', icon: 'Banknote' },
    { slug: 'lunch-deduction-calculator', title: 'Lunch Deduction Calculator', description: 'Calculate net hours after lunch', icon: 'Utensils' },
  ],
};
export default seoData;
