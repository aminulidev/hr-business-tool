const seoData = {
  breadcrumbs: [{ label: 'Calculators' }, { label: 'Time Difference Calculator' }],
  tableOfContents: [
    { id: 'how-to-calculate', label: 'How to Calculate' },
    { id: 'formula', label: 'Formula' },
    { id: 'worked-examples', label: 'Worked Examples' },
    { id: 'frequently-asked-questions', label: 'FAQs' },
    { id: 'related-calculators', label: 'Related Calculators' },
  ],
  howToSteps: [
    'Enter the start date and time.',
    'Enter the end date and time.',
    'Click Calculate Time Difference to see days, hours, minutes, decimal hours, and total days.',
    'Use this for project duration, age calculation, contract deadlines, and elapsed time tracking.',
    'For business-day calculations (excluding weekends), use our Business Day Calculator.',
  ],
  formula: 'Difference (ms) = End DateTime - Start DateTime\nDays = floor(Difference / 86,400,000 ms)\nRemaining Hours = floor((Difference mod 86,400,000) / 3,600,000)\nRemaining Minutes = floor((Difference mod 3,600,000) / 60,000)\nDecimal Hours = Difference / 3,600,000',
  formulaDescription: 'Time difference is calculated by subtracting the start date-time from the end date-time in milliseconds, then converting to days, hours, minutes, and decimal hours. Days are 24h periods; decimal hours = total hours including fractional days. Useful for project duration, age, contract deadlines, and elapsed time tracking.',
  workedExamples: [
    { title: 'Project Duration', description: 'Start: Jan 1, 2026 9:00 AM. End: Mar 15, 2026 5:00 PM. Difference = 73 days 8 hours = 1,760h = 73.33 days. Useful for billing and milestone tracking.' },
    { title: 'Age Calculation', description: 'Birth: Jan 15, 1990 8:30 AM. Today: Sep 22, 2026 noon. Difference = 13,408 days 3.5h = 321,792h = ~36.74 years. Precise age including time of day.' },
    { title: 'Contract Deadline', description: 'Contract signed: Sep 1, 2026. Delivery due: Nov 30, 2026. Difference = 90 days = 2,160h = 12.86 weeks. Standard 90-day delivery term.' },
    { title: 'Event Countdown', description: 'Today: Sep 22, 2026 3:00 PM. Event: Dec 25, 2026 6:00 PM. Difference = 94 days 3h = 2,259h = ~13.4 weeks until Christmas.' },
    { title: 'SLA Measurement', description: 'Ticket opened: Sep 22 9:00 AM. Resolved: Sep 22 2:30 PM. Difference = 5h 30m = 5.5h. Within 8h SLA. If SLA is 4h, breach = 1.5h.' },
  ],
  faqs: [
    { question: 'How do I calculate the time difference between two dates?', answer: 'Subtract the start date-time from the end date-time. The result is typically shown in days, hours, minutes, and decimal hours. Example: Jan 1 9:00 AM to Jan 3 5:00 PM = 2 days 8 hours = 56 hours = 2.33 days. Our calculator handles all date+time combinations and overnight spans.' },
    { question: 'How many days between two dates?', answer: 'For just days (no time), use a simple date subtraction: End Date - Start Date in days. Example: Jan 1 to Jan 31 = 30 days. Jan 1 to Dec 31 = 364 days. For business days excluding weekends, use our Business Day Calculator.' },
    { question: 'How do I calculate age in years?', answer: 'Age = (Today - Birth Date) / 365.25 (accounting for leap years). More precisely: count full years between dates. Example: born Jan 15, 1990. On Sep 22, 2026 = 36 years (since Jan 15 has passed). On Sep 22 before Jan 15 = 35 years. Use precise date arithmetic, not just /365.' },
    { question: 'Does this calculator handle time zones?', answer: 'No — this calculator uses local browser time. For time zone conversion (e.g., New York 9 AM to London time), use a dedicated time zone converter. The calculator treats both dates as the same time zone. If you need UTC-based calculation, convert both to UTC before entering.' },
    { question: 'How do I calculate elapsed time in hours?', answer: 'Difference in hours = (End - Start) / 3,600,000 ms. Example: 9:00 AM to 5:30 PM same day = 8.5 hours. Across days: Mon 9 AM to Wed 5 PM = 56 hours. For decimal hours conversion needed for payroll, see our Payroll Hours Calculator.' },
    { question: 'How do leap years affect date calculations?', answer: 'Leap years add February 29 — 1 extra day every 4 years (except years divisible by 100 but not 400). 2024 and 2028 are leap years; 2100 is not. Date arithmetic automatically handles leap years when using standard date objects. Our calculator correctly accounts for leap years in all calculations.' },
  ],
  relatedTools: [
    { slug: 'business-day-calculator', title: 'Business Day Calculator', description: 'Working days between dates', icon: 'CalendarDays' },
    { slug: 'hours-between-times-calculator', title: 'Hours Between Two Times', description: 'Single-day duration', icon: 'Clock3' },
    { slug: 'holiday-countdown-calculator', title: 'Holiday Countdown', description: 'Days until next holiday', icon: 'CalendarClock' },
    { slug: 'time-card-calculator', title: 'Time Card Calculator', description: 'Weekly timesheet', icon: 'Clock' },
    { slug: 'working-hours-calculator', title: 'Working Hours Calculator', description: 'Annual net work hours', icon: 'CalendarClock' },
  ],
};
export default seoData;
