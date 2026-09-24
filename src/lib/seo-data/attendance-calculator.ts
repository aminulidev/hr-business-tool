const seoData = {
  breadcrumbs: [{ label: 'Calculators' }, { label: 'Attendance Calculator' }],
  tableOfContents: [
    { id: 'how-to-calculate', label: 'How to Calculate' },
    { id: 'formula', label: 'Formula' },
    { id: 'worked-examples', label: 'Worked Examples' },
    { id: 'frequently-asked-questions', label: 'FAQs' },
    { id: 'related-calculators', label: 'Related Calculators' },
  ],
  howToSteps: [
    'Enter total scheduled workdays in the period (typically 220 days/year after holidays and PTO).',
    'Enter the number of days absent (full or partial days off).',
    'Enter the number of days tardy (late arrivals — still counts as attended).',
    'Click Calculate Attendance Rate to see attendance %, absence %, and tardy %.',
    'Compare against the SHRM benchmark of 3.2% absence rate (96.8% attendance).',
  ],
  formula: 'Attended Days = Scheduled Days - Absent Days\nAttendance Rate = Attended Days / Scheduled Days x 100%\nAbsence Rate = Absent Days / Scheduled Days x 100%\nTardy Rate = Tardy Days / Scheduled Days x 100%',
  formulaDescription: 'Attendance rate measures the percentage of scheduled workdays an employee actually attended. The SHRM (Society for Human Resource Management) benchmark for US absence rate is 3.2% per year. Rates above 5% absence may indicate engagement, health, or workplace culture issues. Tardy arrivals still count as attended.',
  workedExamples: [
    { title: 'Model Employee', description: '220 scheduled days, 2 absent, 1 tardy. Attended = 218. Attendance rate = 99.1%. Absence rate = 0.9%. Tardy rate = 0.5%. Well above SHRM benchmark.' },
    { title: 'Average US Worker', description: '220 scheduled days, 7 absent, 5 tardy. Attended = 213. Attendance rate = 96.8%. Absence rate = 3.2% (matches SHRM benchmark). Tardy rate = 2.3%.' },
    { title: 'Concerning Attendance', description: '220 scheduled days, 22 absent, 15 tardy. Attended = 198. Attendance rate = 90%. Absence rate = 10%. This warrants HR intervention — well above the 5% concern threshold.' },
    { title: 'Quarterly Review', description: 'Q1: 60 scheduled, 3 absent = 95% attendance. Q2: 62 scheduled, 1 absent = 98.4%. Q3: 63 scheduled, 8 absent = 87.3% (red flag). Q4: 60 scheduled, 2 absent = 96.7%. Trending Q3 dip may indicate burnout or health issue.' },
    { title: 'Team Roll-Up', description: 'Team of 10 with combined 2,200 scheduled days. 71 absences = 3.2% team absence rate. Top performer: 0 absences. Worst: 18 absences (8.2%). Median: 6 absences (2.7%).' },
  ],
  faqs: [
    { question: 'What is a good attendance rate?', answer: 'A good attendance rate is 95%+ (absence rate under 5%). The SHRM benchmark for US workers is 96.8% attendance (3.2% absence). Below 90% attendance (10%+ absence) is concerning and may warrant HR intervention. Tardy rates above 5% also indicate engagement issues.' },
    { question: 'How is absence rate calculated?', answer: 'Absence rate = (absent days / scheduled workdays) x 100. Example: 7 absences out of 220 scheduled days = 7/220 = 3.18% absence rate. This matches the SHRM national average. Include only unscheduled absences (sick, personal, no-call/no-show) — PTO and approved vacation are NOT absences.' },
    { question: 'What is the SHRM absence benchmark?', answer: 'The Society for Human Resource Management (SHRM) reports the average US absence rate is 3.2% per year. This translates to ~7 unscheduled absence days per year for a full-time worker. Industry-specific benchmarks: healthcare 4.5%, retail 4.0%, manufacturing 2.8%, professional services 2.5%.' },
    { question: 'Does PTO count as absence?', answer: 'No — approved PTO (vacation, personal days, scheduled medical leave) is NOT counted as absence. Only unscheduled absences (sick days, no-call/no-show, family emergency) count. FMLA leave, jury duty, military leave, and bereavement are also excluded. The point of tracking absence rate is to identify unplanned coverage gaps.' },
    { question: 'What is the Bradford Factor?', answer: 'The Bradford Factor is a formula that weights short, frequent absences more heavily than long, rare ones: B = S² x D, where S = number of absence spells and D = total days absent. A worker with 6 single-day absences (B = 6² x 6 = 216) scores higher than one with 1 six-day absence (B = 1² x 6 = 6), reflecting the greater disruption of frequent short absences.' },
    { question: 'What causes high absenteeism?', answer: 'Common causes: (1) Health issues (chronic illness, mental health), (2) Burnout from overwork or poor work-life balance, (3) Workplace culture issues (poor management, harassment), (4) Childcare/eldercare gaps, (5) Engagement (boring or meaningless work), (6) Commute challenges. Address root causes — disciplinary action alone often backfires.' },
  ],
  relatedTools: [
    { slug: 'leave-calculator', title: 'Leave Calculator', description: 'PTO, vacation, sick leave balance', icon: 'CalendarRange' },
    { slug: 'sick-leave-calculator', title: 'Sick Leave Calculator', description: 'Sick leave accrual by state', icon: 'CalendarClock' },
    { slug: 'employee-turnover-calculator', title: 'Employee Turnover Calculator', description: 'Turnover rate and cost', icon: 'Users' },
    { slug: 'work-hours-calculator', title: 'Work Hours Calculator', description: 'Track hours worked', icon: 'Clock' },
    { slug: 'employee-schedule-calculator', title: 'Employee Schedule Calculator', description: 'Build schedules', icon: 'CalendarDays' },
  ],
};
export default seoData;
