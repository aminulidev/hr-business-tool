const seoData = {
  breadcrumbs: [{ label: 'Calculators' }, { label: 'Shift Rotation Calculator' }],
  tableOfContents: [
    { id: 'how-to-calculate', label: 'How to Calculate' },
    { id: 'worked-examples', label: 'Worked Examples' },
    { id: 'frequently-asked-questions', label: 'FAQs' },
    { id: 'related-calculators', label: 'Related Calculators' },
  ],
  howToSteps: [
    'Select a shift rotation pattern: 2-2-3 (Panama), DuPont (28-day), Pitman (2-3-2), or 4-on-4-off.',
    'Click Generate Rotation to see the crew schedule for one full cycle.',
    'Review the rotation table showing which crew is ON vs OFF each day.',
    'Check the average weekly hours (most patterns average 42h/week — 2h FLSA OT).',
    'Use Shift Pay Calculator to calculate pay including shift differentials and OT.',
  ],
  formula: 'Avg Hours/Week = (Days On in Cycle x Shift Hours) / (Cycle Days / 7)\n2-2-3: (7 x 12) / 2 = 42h/week\nDuPont: (14 x 12) / 4 = 42h/week\nPitman: (7 x 12) / 2 = 42h/week\n4-on-4-off: (4 x 12) / (8/7) = 42h/week',
  formulaDescription: 'Rotating shift patterns provide 24/7 coverage with crews alternating between day and night shifts. All popular 12-hour patterns average 42 hours/week (2 hours FLSA overtime). The 2-2-3 (Panama) cycles 4 crews through 14-day periods. DuPont uses a 28-day cycle with 7-day break. Pitman (2-3-2) gives every other weekend off. 4-on-4-off provides predictable 4-day stretches.',
  workedExamples: [
    { title: '2-2-3 Panama Pattern', description: '4 crews, 14-day cycle. Each crew works 7 of 14 days (50% schedule). 12h shifts. Avg = 7 x 12 / 2 = 42h/week. Crew A: 2 on, 2 off, 3 on, 2 off, 2 on, 3 off. Rotates day/night every cycle. Common in manufacturing and healthcare.' },
    { title: 'DuPont 28-Day Schedule', description: '4 crews, 28-day cycle. Pattern: 4-3, 3-3, 3-3, 4-3, 7 off. 14 work days, 14 off days. 12h shifts. Avg = 14 x 12 / 4 = 42h/week. 7 consecutive days off each cycle (great for rest). Used by oil refineries, chemical plants.' },
    { title: 'Pitman (2-3-2) Schedule', description: '2 crews, 14-day cycle. Pattern: 2 on, 3 off, 2 on, 2 off, 3 on, 2 off. Each crew works 7 of 14 days. 12h shifts. Avg = 42h/week. Every other weekend off. Popular in nursing and public safety.' },
    { title: '4-on 4-off Schedule', description: '2 crews, 8-day cycle. 4 days on, 4 days off. 12h shifts. Avg = 4 x 12 / (8/7) = 42h/week. Predictable schedule, easy to plan. Continuous 24/7 coverage. Common in manufacturing, mining.' },
    { title: 'Continental Shift (Slow Rotation)', description: 'Variation of 2-2-3 with slower day/night rotation — crews stay on day shift for 4 weeks, then switch to night for 4 weeks. Better for circadian adaptation. Some studies show 20% fewer errors than rapid rotation.' },
  ],
  faqs: [
    { question: 'What is the 2-2-3 shift schedule?', answer: 'The 2-2-3 (Panama) schedule uses 4 crews working 12-hour shifts in a 14-day cycle: 2 days on, 2 off, 3 on, 2 off, 2 on, 3 off. Each crew works 7 of 14 days (50%). Avg 42h/week (2h OT). Crews alternate between day and night shifts each cycle. Common in manufacturing, healthcare, and public safety.' },
    { question: 'What is the DuPont shift schedule?', answer: 'The DuPont schedule is a 28-day cycle using 4 crews on 12-hour shifts. Pattern per crew: 4 on-3 off, 3 on-3 off, 3 on-3 off, 4 on-3 off, then 7 consecutive days off. 14 work days, 14 off days per cycle. Avg 42h/week. Provides a full week off every month — popular in oil refineries and chemical plants.' },
    { question: 'What is the Pitman shift schedule?', answer: 'The Pitman (2-3-2) schedule uses 2 crews in a 14-day cycle: 2 on, 3 off, 2 on, 2 off, 3 on, 2 off. Each crew works 7 of 14 days on 12-hour shifts. Avg 42h/week. Key benefit: every other weekend off. Common in nursing and 911 dispatch.' },
    { question: 'How does 4-on 4-off work?', answer: 'Two crews alternate 4 days on, 4 days off. 12-hour shifts. Each crew works half the year. Avg 42h/week (4 x 12 / 1.143). Simple, predictable schedule — easy to plan life around. Continuous 24/7 coverage with only 2 crews. Common in manufacturing, mining, security.' },
    { question: 'Do rotating shifts trigger overtime?', answer: 'Yes — most 12-hour rotation patterns average 42h/week (2h FLSA OT). California: hours 9-12 each day = 4h daily OT per shift = significant OT pay. Some employers use "fluctuating workweek" method to pay OT at 0.5× (instead of 1.5×) for salaried non-exempt workers on rotating shifts — requires DOL-compliant agreement.' },
    { question: 'Are rotating shifts bad for health?', answer: 'Studies show rotating shifts disrupt circadian rhythms, increasing risk of: sleep disorders (75% of shift workers), cardiovascular disease (40% higher), type 2 diabetes (30% higher), depression (25% higher), and certain cancers (IARC classifies shift work as probable carcinogen). Mitigation: slow rotation (3-4 weeks per shift), forward rotation (day → swing → night), bright light therapy, melatonin, and healthy diet.' },
  ],
  relatedTools: [
    { slug: 'shift-hours-calculator', title: 'Shift Hours Calculator', description: 'Calculate hours for fixed shifts', icon: 'CalendarClock' },
    { slug: 'shift-pay-calculator', title: 'Shift Pay Calculator', description: 'Pay with shift differentials', icon: 'CalendarClock' },
    { slug: 'employee-schedule-calculator', title: 'Employee Schedule Calculator', description: 'Build weekly schedules', icon: 'CalendarDays' },
    { slug: 'night-shift-differential-calculator', title: 'Night Shift Differential', description: 'Extra pay for night hours', icon: 'CalendarClock' },
    { slug: 'overtime-calculator', title: 'Overtime Calculator', description: 'OT triggered by 12h shifts', icon: 'Timer' },
  ],
};
export default seoData;
