const seoData = {
  breadcrumbs: [{ label: 'Calculators' }, { label: 'Clock Out Calculator' }],
  tableOfContents: [
    { id: 'how-to-calculate', label: 'How to Calculate' },
    { id: 'formula', label: 'Formula' },
    { id: 'worked-examples', label: 'Worked Examples' },
    { id: 'frequently-asked-questions', label: 'FAQs' },
    { id: 'related-calculators', label: 'Related Calculators' },
  ],
  howToSteps: [
    'Enter your clock-in time (e.g., 8:00 AM).',
    'Enter your target hours worked (e.g., 8 hours to avoid OT, or 6 to leave early).',
    'Enter the unpaid break time in minutes (e.g., 30 for lunch).',
    'Toggle "Avoid Overtime" to cap target at 8 hours/day (prevents daily OT in California).',
    'Click Calculate Clock-Out Time to see exactly when to clock out.',
  ],
  formula: 'Clock-Out = Clock-In + Target Hours + Break Minutes\nIf Avoid OT and Target > 8: Target = 8\nFLSA OT triggers when weekly hours > 40',
  formulaDescription: 'To hit a target number of work hours, clock out = clock-in + target hours + unpaid break. Toggle "Avoid OT" to cap at 8 hours/day (prevents California daily OT). Note: FLSA weekly OT (40h/week) requires tracking the entire workweek, not just daily hours.',
  workedExamples: [
    { title: 'Hit Exactly 8 Hours', description: 'Clock in 8:00 AM, target 8h, 30-min lunch. Clock-out = 8:00 AM + 8h + 30min = 4:30 PM. Avoids CA daily OT (over 8h).' },
    { title: 'Avoid OT Cap', description: 'Clock in 7:00 AM, target 9h, 30-min lunch. With "Avoid OT" on, target reduced to 8h. Clock-out = 7:00 AM + 8h + 30min = 3:30 PM.' },
    { title: 'Leave Early', description: 'Clock in 9:00 AM, target 6h (no daily OT in CA), 30-min lunch. Clock-out = 9:00 AM + 6h + 30min = 3:30 PM. Avoids CA OT (under 8h).' },
    { title: 'Night Shift', description: 'Clock in 10:00 PM, target 8h, 30-min lunch. Clock-out = 6:30 AM next day. Calculator handles overnight automatically.' },
    { title: 'Hit Weekly OT Target', description: 'Already worked 36h this week. Want 4h OT (44h total). Target 8h today (40 reg + 4 OT). Clock in 8:00 AM, 30-min lunch. Clock-out = 4:30 PM. Weekly = 44h, OT = 4h.' },
  ],
  faqs: [
    { question: 'When can I clock out to avoid overtime?', answer: 'To avoid FLSA weekly overtime (over 40h/week), track your weekly hours and stop before exceeding 40. To avoid California daily OT (over 8h/day = 1.5×, over 12h = 2×), cap daily shifts at 8 hours. Use the "Avoid OT" toggle to auto-cap your target at 8 hours.' },
    { question: 'How do I hit exactly 40 hours in a week?', answer: 'Track daily hours: 5 days x 8h = 40h. If you work 9h Mon-Thu (36h), work only 4h on Friday to hit 40h. Use this calculator each day: input clock-in, target hours = 40 - hours already worked, get your clock-out time.' },
    { question: 'What time do I leave for an 8-hour shift?', answer: 'Clock-Out = Clock-In + 8h + Unpaid Break. Examples: 8:00 AM + 8h + 30min lunch = 4:30 PM. 9:00 AM + 8h + 60min lunch = 5:30 PM. 7:00 AM + 8h + 0min lunch (rare) = 3:00 PM.' },
    { question: 'Does California daily overtime apply if I work 9 hours?', answer: 'Yes — California Labor Code 510 requires 1.5× pay for hours 9-12 in a single workday, regardless of weekly total. Hour 13+ is 2×. To avoid daily OT in CA, cap daily shifts at 8 hours. FLSA weekly OT (40h) is separate — you can still trigger weekly OT even if no daily OT.' },
    { question: 'Can my employer force me to work overtime?', answer: 'Yes — under FLSA, employers can mandate overtime for non-exempt employees as long as it is paid at 1.5× the regular rate for hours over 40/week. Some states (CA, AK, NV) require daily OT for hours over 8. Refusing mandated OT can be grounds for termination, except where prohibited (e.g., nurses in CA under AB 836).' },
    { question: 'What if I work through my lunch?', answer: 'Under FLSA, all hours worked must be paid — including through lunch if you were not fully relieved of duty. California requires employers to pay 1 hour of premium pay (LC 226.7) for each missed meal or rest break. Track actual hours worked, not scheduled hours. Working off-the-clock is wage theft.' },
  ],
  relatedTools: [
    { slug: 'clock-in-calculator', title: 'Clock In Calculator', description: 'Find clock-out from clock-in', icon: 'LogIn' },
    { slug: 'overtime-calculator', title: 'Overtime Calculator', description: 'OT with state rules', icon: 'Timer' },
    { slug: 'work-hours-calculator', title: 'Work Hours Calculator', description: 'Weekly hours tracking', icon: 'Clock' },
    { slug: 'break-calculator', title: 'Break Calculator', description: 'Required meal and rest breaks', icon: 'PauseCircle' },
    { slug: 'hours-between-times-calculator', title: 'Hours Between Two Times', description: 'Duration between times', icon: 'Clock3' },
  ],
};
export default seoData;
