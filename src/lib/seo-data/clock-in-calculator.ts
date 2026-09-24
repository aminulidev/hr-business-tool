const seoData = {
  breadcrumbs: [{ label: 'Calculators' }, { label: 'Clock In Calculator' }],
  tableOfContents: [
    { id: 'how-to-calculate', label: 'How to Calculate' },
    { id: 'formula', label: 'Formula' },
    { id: 'worked-examples', label: 'Worked Examples' },
    { id: 'frequently-asked-questions', label: 'FAQs' },
    { id: 'related-calculators', label: 'Related Calculators' },
  ],
  howToSteps: [
    'Enter your clock-in time (e.g., 9:00 AM).',
    'Enter the desired shift length in hours (e.g., 8 for a standard full-time day).',
    'Enter the unpaid break time in minutes (e.g., 30 for lunch).',
    'Click Calculate Clock-Out Time to see when you can leave.',
    'Use the result to plan your day, accounting for commute and personal commitments.',
  ],
  formula: 'Clock-Out = Clock-In + Shift Hours + Break Minutes\nExample: 9:00 AM + 8h + 30min = 5:30 PM\nOvernight = add 24h if clock-out is next day',
  formulaDescription: 'To hit a target number of work hours, you must be at work for the shift length plus any unpaid break time. Example: 8 work hours + 30-minute unpaid lunch = 8.5 hours onsite. Add commute time to plan your day. Use the Clock Out Calculator to find the exact clock-out time for a target number of work hours.',
  workedExamples: [
    { title: 'Standard 8-Hour Day', description: 'Clock in 9:00 AM, 8h shift, 30-min unpaid lunch. Clock-out = 9:00 AM + 8h + 30min = 5:30 PM. Onsite = 8.5h.' },
    { title: 'Early Bird 6 AM Start', description: 'Clock in 6:00 AM, 8h shift, 60-min lunch. Clock-out = 6:00 AM + 8h + 60min = 3:00 PM. Avoids traffic, leaves afternoon free.' },
    { title: 'Night Shift Start', description: 'Clock in 10:00 PM, 8h shift, 30-min lunch. Clock-out = 6:30 AM next day. Onsite 8.5h overnight.' },
    { title: 'Compressed 10-Hour Day', description: 'Clock in 7:00 AM, 10h shift, 30-min lunch. Clock-out = 5:30 PM. Onsite 10.5h. Common for 4-day compressed workweek.' },
    { title: 'Part-Time 4-Hour Day', description: 'Clock in 9:00 AM, 4h shift, no lunch (under 5h = no meal required in CA). Clock-out = 1:00 PM. Onsite 4h.' },
  ],
  faqs: [
    { question: 'What time should I clock in for an 8-hour shift?', answer: 'For an 8-hour shift with a 30-minute unpaid lunch, you must be onsite for 8.5 hours. If you want to leave at 5:00 PM, clock in at 8:30 AM. Account for commute time. California requires a 30-min meal break for shifts 5h+ — clock-in times should accommodate this.' },
    { question: 'How do I calculate clock-out time?', answer: 'Clock-Out = Clock-In + Shift Length + Unpaid Break Time. Example: 9:00 AM + 8 hours + 30 minutes = 5:30 PM. If the result is past midnight, add 24 hours. For target hours worked (not shift length), use our Clock Out Calculator.' },
    { question: 'How long is an 8-hour shift with lunch?', answer: 'An 8-hour shift with a 30-minute unpaid lunch = 8.5 hours total onsite. With a 60-minute lunch = 9 hours onsite. The 8 hours is the paid work time; lunch is unpaid (you are relieved of duty). Paid 10-minute rest breaks are NOT added to onsite time.' },
    { question: 'What is the latest I can clock in to leave at 5 PM?', answer: 'For an 8-hour shift with 30-min unpaid lunch (8.5h onsite), you must clock in by 8:30 AM to leave at 5:00 PM. For 60-min lunch (9h onsite), clock in by 8:00 AM. Without lunch (rare for 8h shifts), clock in by 9:00 AM.' },
    { question: 'Do clock-in times have to be exact?', answer: 'Under FLSA, employers must track actual hours worked accurately. Many employers use 7-minute rounding (1-7 min rounds down, 8-15 rounds up) to the nearest 15 minutes — this is legal if it averages out over time. Modern time clocks track to the minute. Consistently rounding in employer\'s favor is illegal.' },
    { question: 'What if I forget to clock in?', answer: 'Most employers have a process to correct missed punches — submit a timesheet correction form. Under FLSA, you must still be paid for all hours worked. Employers cannot refuse to pay for missed punches, but can discipline for repeated failures. Some employers auto-clock-in based on first email/login activity.' },
  ],
  relatedTools: [
    { slug: 'clock-out-calculator', title: 'Clock Out Calculator', description: 'Find clock-out time for target hours', icon: 'LogOut' },
    { slug: 'hours-between-times-calculator', title: 'Hours Between Two Times', description: 'Duration between any two times', icon: 'Clock3' },
    { slug: 'work-hours-calculator', title: 'Work Hours Calculator', description: 'Weekly hours from clock times', icon: 'Clock' },
    { slug: 'time-card-calculator', title: 'Time Card Calculator', description: 'Weekly timesheet', icon: 'Clock' },
    { slug: 'break-calculator', title: 'Break Calculator', description: 'Required meal and rest breaks', icon: 'PauseCircle' },
  ],
};
export default seoData;
