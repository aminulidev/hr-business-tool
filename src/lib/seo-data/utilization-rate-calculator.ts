const seoData = {
  breadcrumbs: [{ label: 'Calculators' }, { label: 'Utilization Rate Calculator' }],
  tableOfContents: [
    { id: 'how-to-calculate', label: 'How to Calculate' },
    { id: 'formula', label: 'Formula' },
    { id: 'worked-examples', label: 'Worked Examples' },
    { id: 'frequently-asked-questions', label: 'FAQs' },
    { id: 'related-calculators', label: 'Related Calculators' },
  ],
  howToSteps: [
    'Enter total billable hours for the period (e.g., month, quarter, year).',
    'Enter total available hours (full-time = 2,080h/year; subtract PTO/holidays for net available).',
    'Optionally enter your hourly billable rate to see revenue impact.',
    'Select your industry to compare against target benchmark (consulting 75%, legal 70%, agency 65%, accounting 60%).',
    'Click Calculate Utilization to see rate, gap vs target, and revenue impact.',
  ],
  formula: 'Utilization Rate = Billable Hours / Total Available Hours x 100%\nRevenue = Billable Hours x Hourly Rate\nGap = Your Rate - Industry Target\nEach 1% increase = (Available Hours / 100) x Hourly Rate additional revenue',
  formulaDescription: 'Utilization rate measures the percentage of available work hours that are billable to clients. Industry benchmarks: consulting 75%, legal 70%, agency 65%, accounting 60%, IT services 70%. Below target means lost revenue; above target risks burnout. Each 1% increase at $150/hr × 2,080h available = $3,120 additional annual revenue per consultant.',
  workedExamples: [
    { title: 'Consultant at Target', description: '1,560 billable / 2,080 available = 75% utilization. Matches consulting benchmark. At $200/hr = $312,000 annual revenue. No gap to target.' },
    { title: 'Underperforming Consultant', description: '1,200 billable / 2,080 available = 57.7%. Target 75%. Gap = -17.3%. At $200/hr, gap = 360h x $200 = $72,000 lost revenue. Needs 360 more billable hours/year (~7h/week).' },
    { title: 'Lawyer at 80%', description: '1,664 billable / 2,080 available = 80%. Legal target = 70%. Gap = +10%. At $350/hr = $582,400 revenue. Above target — risk of burnout. Consider reducing caseload or hiring associate.' },
    { title: 'Agency Designer', description: '1,300 billable / 2,080 available = 62.5%. Agency target = 65%. Gap = -2.5%. At $125/hr = $162,500 revenue. Slight underperformance — 52 more billable hours needed.' },
    { title: 'Accountant During Busy Season', description: 'Q1: 600 billable / 520 available (13 weeks x 40h) = 115%. Above 100% means working OT. Annual cap 60%. Other quarters 45%. Annual: 1,248 / 2,080 = 60% — exactly at target.' },
  ],
  faqs: [
    { question: 'What is utilization rate?', answer: 'Utilization rate = billable hours / total available hours × 100. It measures how much of an employee\'s available work time is billed to clients. Industry benchmarks: consulting 75%, legal 70%, agency 65%, accounting 60%. Below target = lost revenue; above target = burnout risk. Each 1% improvement at $150/hr × 2,080h available = $3,120/year additional revenue per consultant.' },
    { question: 'How is utilization rate calculated?', answer: 'Utilization = Billable Hours ÷ Total Available Hours × 100. Example: 1,560 billable ÷ 2,080 available = 75%. Total available = (hours per week × weeks per year) − PTO − holidays. Some firms use "realization rate" instead — billable value ÷ standard value — accounting for write-offs and discounts.' },
    { question: 'What is a good utilization rate target?', answer: 'Industry-specific targets: consulting 70-80%, legal 65-75% (law firms), agency 60-70%, accounting 55-65% (CPA firms), IT services 70-80%. Below 60% in any professional service suggests underutilization. Above 85% risks burnout and leaves no time for training, BD, or admin. The 80/20 rule: 80% billable, 20% non-billable (training, sales, internal).' },
    { question: 'Should utilization include non-billable hours?', answer: 'No — utilization rate measures ONLY billable hours vs available hours. Non-billable hours (training, business development, internal meetings, admin) are tracked separately as "non-billable utilization." Total tracked hours = billable + non-billable. Available hours = total tracked hours + PTO + holidays.' },
    { question: 'What is the difference between utilization and realization?', answer: 'Utilization = billable hours ÷ available hours (time metric). Realization = billed revenue ÷ standard value of billable hours (money metric). Example: 1,500 billable hours at $200/hr standard = $300,000 standard value. If actual revenue was $255,000 (15% discount/write-off), realization = 85%. Both metrics matter — high utilization with low realization means deep discounting.' },
    { question: 'How can I improve my utilization rate?', answer: 'Strategies: (1) Reduce non-billable time (delegate admin to support staff), (2) Take on more client work (BD, cross-selling), (3) Reduce bench time between projects, (4) Improve project profitability to allow more billable headcount, (5) Track time more aggressively (15-min increments), (6) Combine small tasks into billable blocks. But: avoid cutting training, BD, or mentoring — these drive long-term revenue.' },
  ],
  relatedTools: [
    { slug: 'billable-hours-calculator', title: 'Billable Hours Calculator', description: 'Track billable vs non-billable hours', icon: 'Hourglass' },
    { slug: 'working-hours-calculator', title: 'Working Hours Calculator', description: 'Annual available hours calc', icon: 'CalendarClock' },
    { slug: 'revenue-per-employee-calculator', title: 'Revenue per Employee', description: 'Workforce productivity metric', icon: 'Activity' },
    { slug: 'work-hours-calculator', title: 'Work Hours Calculator', description: 'Track hours worked', icon: 'Clock' },
    { slug: 'employee-schedule-calculator', title: 'Employee Schedule Calculator', description: 'Plan staffing levels', icon: 'CalendarDays' },
  ],
};
export default seoData;
