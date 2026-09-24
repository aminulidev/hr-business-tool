const seoData = {
  breadcrumbs: [{ label: 'Calculators' }, { label: 'Hours Between Two Times Calculator' }],
  tableOfContents: [
    { id: 'how-to-calculate', label: 'How to Calculate' },
    { id: 'formula', label: 'Formula' },
    { id: 'worked-examples', label: 'Worked Examples' },
    { id: 'frequently-asked-questions', label: 'FAQs' },
    { id: 'related-calculators', label: 'Related Calculators' },
  ],
  howToSteps: [
    'Enter the start time (e.g., 9:00 AM).',
    'Enter the end time (e.g., 5:30 PM).',
    'Toggle "Overnight shift" if end time is the next day (e.g., 10:00 PM → 6:00 AM).',
    'Click Calculate Hours to see duration in hours:minutes, decimal hours, and total seconds.',
    'For multi-day durations, use our Time Difference Calculator.',
  ],
  formula: 'Duration = End - Start\nIf End < Start: Duration += 24h (overnight)\nDecimal Hours = Duration / 60\nTotal Seconds = Duration x 60',
  formulaDescription: 'The duration between two clock times is the end time minus the start time. If the end time is earlier than the start (e.g., 10 PM → 6 AM), add 24 hours to indicate an overnight span. The result is shown in hours:minutes (8h 30m), decimal hours (8.50h), and total seconds (30,600 sec).',
  workedExamples: [
    { title: 'Standard Work Day', description: '9:00 AM to 5:30 PM = 8h 30m = 8.50 decimal hours = 30,600 seconds. With 30-min unpaid lunch = 8.0h payable.' },
    { title: 'Overnight Shift', description: '10:00 PM to 6:00 AM (overnight) = 8h 0m = 8.00 decimal hours = 28,800 seconds. Typical 3rd-shift duration.' },
    { title: 'Long Day with OT', description: '8:00 AM to 7:30 PM = 11h 30m = 11.50 decimal hours. California: hours 9-11.5 = 2.5h daily OT at 1.5×.' },
    { title: 'Meeting Duration', description: '1:30 PM to 3:15 PM = 1h 45m = 1.75 decimal hours = 6,300 seconds. Useful for billing and meeting tracking.' },
    { title: 'Two-Meeting Gap', description: 'End of meeting 1: 11:30 AM. Start of meeting 2: 1:00 PM. Gap = 1h 30m = 1.5h = enough for lunch + 30-min break.' },
  ],
  faqs: [
    { question: 'How do I calculate hours between two times?', answer: 'Subtract start time from end time. If end < start (overnight), add 24h. Example: 9 AM to 5 PM = 8h. 10 PM to 6 AM = (24 + 6) - 22 = 8h. For payroll, multiply decimal hours by hourly rate. Use our Payroll Hours Calculator for full pay calculation.' },
    { question: 'How are overnight shifts calculated?', answer: 'If clock-out is earlier than clock-in (e.g., 10 PM → 6 AM), add 24 hours to the result. The shift spans midnight. Most time-tracking systems handle this automatically. FLSA overtime still applies to total weekly hours, not daily — overnight shifts do not inherently trigger OT.' },
    { question: 'What are decimal hours?', answer: 'Decimal hours = hours + (minutes / 60). Example: 8h 30m = 8 + 30/60 = 8.50 decimal hours. Payroll systems typically use decimal hours for wage calculation: 8.50h x $22/hr = $187. Common decimal conversions: 15min = 0.25h, 30min = 0.50h, 45min = 0.75h.' },
    { question: 'How do I calculate duration across multiple days?', answer: 'Use our Time Difference Calculator — it accepts both date and time inputs. For single-day spans under 24 hours, use this calculator. For multi-day spans (e.g., project duration, age, elapsed time), Time Difference Calculator returns days, hours, minutes, and total hours.' },
    { question: 'How is time rounding handled in payroll?', answer: 'FLSA allows rounding to nearest 5, 6, 10, or 15 minutes IF it averages out over time. Common 15-min rule: 1-7 min after hour rounds down, 8-15 min rounds up. Rounding must not consistently favor employer. Modern time clocks typically track to the minute to avoid disputes (29 CFR 785.48).' },
    { question: 'How do I calculate billable hours between two times?', answer: 'For consultants/lawyers: billable hours = duration between clock-in/out minus non-billable time (admin, breaks). Track to the 0.1h (6-min) increment for legal billing. Multiply by hourly billable rate. See our Billable Hours Calculator and Utilization Rate Calculator for full billable revenue tracking.' },
  ],
  relatedTools: [
    { slug: 'time-difference-calculator', title: 'Time Difference Calculator', description: 'Duration between two dates', icon: 'GitCompareArrows' },
    { slug: 'clock-in-calculator', title: 'Clock In Calculator', description: 'Calculate clock-out from clock-in', icon: 'LogIn' },
    { slug: 'clock-out-calculator', title: 'Clock Out Calculator', description: 'Find clock-out for target hours', icon: 'LogOut' },
    { slug: 'work-hours-calculator', title: 'Work Hours Calculator', description: 'Weekly hours tracking', icon: 'Clock' },
    { slug: 'payroll-hours-calculator', title: 'Payroll Hours Calculator', description: 'Convert hours to gross pay', icon: 'Banknote' },
  ],
};
export default seoData;
