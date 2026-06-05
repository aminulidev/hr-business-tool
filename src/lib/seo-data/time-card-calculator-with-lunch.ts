const seoData = {
  howToSteps: [
    'Enable or disable each day of the work week (Mon–Sun) using the toggles. Disabled days are excluded from the calculation entirely.',
    'Choose your lunch mode: "Manual" to enter specific lunch start and end times for each day, or "Auto-Deduct" to subtract a fixed lunch duration (e.g., 30 or 60 minutes) from the middle of each shift.',
    'Enter your clock-in time and clock-out time for each enabled workday. If using manual mode, also enter your lunch start and end times.',
    'Set the overtime threshold (default is 40 hours per week). Hours worked beyond this threshold are counted as overtime hours.',
    'Click "Calculate Hours" to see a daily breakdown table showing hours before lunch, hours after lunch, lunch duration, and total hours per day, along with weekly totals including overtime.',
  ],

  formula:
    'Total Hours = (Lunch Start − Clock In) + (Clock Out − Lunch End)',

  formulaDescription:
    'The total work hours for a day are calculated by splitting the shift into two segments: the time from clock-in to lunch start, and the time from lunch end to clock-out. The lunch break period is excluded from paid hours. In auto-deduct mode, the calculator simply subtracts a fixed duration (e.g., 30 or 60 minutes) from the total shift time. Under the Fair Labor Standards Act (FLSA), employers are generally not required to pay for bona fide meal breaks (typically 30 minutes or longer), provided the employee is completely relieved of all duties during the break. Shorter breaks (usually under 20 minutes) must generally be compensated.',

  workedExamples: [
    {
      title: 'Standard 5-Day Week with 1-Hour Lunch',
      description:
        'Clock in at 9:00 AM, lunch from 12:00 PM to 1:00 PM, clock out at 5:00 PM. Hours before lunch: 3.00h. Hours after lunch: 4.00h. Lunch duration: 1.00h. Total daily hours: 7.00h. Over 5 days: 35.00 total hours (all regular, no overtime since under 40h threshold).',
    },
    {
      title: '6-Day Week with 30-Minute Auto-Deduct Lunch',
      description:
        'A restaurant worker works 6 days: Mon–Sat, 10:00 AM to 6:00 PM with a 30-minute auto-deducted lunch. Total shift per day: 8h − 0.5h = 7.5h. Weekly total: 7.5 × 6 = 45.00 hours. Regular hours: 40.00. Overtime hours: 5.00. The overtime premium (at 1.5x) would apply to those 5 extra hours.',
    },
    {
      title: 'Variable Schedule with Manual Lunch Times',
      description:
        'Mon: 8:00 AM–12:00 PM (4h, no lunch). Tue: 9:00 AM–5:30 PM with lunch 12:30–1:00 PM (before: 3.5h, after: 4.5h, total: 8.0h). Wed: 10:00 AM–6:00 PM with lunch 1:00–1:30 PM (total: 7.5h). Thu–Fri: same as Tue (8.0h each). Weekly total: 4.0 + 8.0 + 7.5 + 8.0 + 8.0 = 35.5 hours. All regular, no overtime.',
    },
  ],

  faqs: [
    {
      question: 'Does my employer have to pay me for my lunch break?',
      answer:
        'Generally, no — under the FLSA, employers are not required to pay for bona fide meal periods (typically 30 minutes or longer) if the employee is completely relieved of all duties during the break. However, if you are required to remain at your workstation, answer phones, or perform any work during your lunch, that time must be compensated. State laws may provide additional protections: some states (like California) require a paid 30-minute meal break for shifts exceeding 5 hours. Short breaks of 5–20 minutes are generally considered compensable rest periods and must be paid.',
    },
    {
      question: 'What are the FLSA lunch break rules?',
      answer:
        'The federal FLSA does not require employers to provide meal or rest breaks. However, if an employer chooses to provide short breaks (typically 5–20 minutes), the FLSA considers them compensable work time that must be included in hours worked. For bona fide meal periods (typically 30 minutes or more), the employee must be completely free from duty for the break to be unpaid. Many states have their own break requirements that go beyond federal law. California, for example, requires a 30-minute unpaid meal period for shifts over 5 hours and a 10-minute paid rest break per 4 hours worked.',
    },
    {
      question: 'Can my employer auto-deduct lunch from my timesheet?',
      answer:
        'Employers can auto-deduct a standard lunch duration (e.g., 30 or 60 minutes) from timesheets, but only if the employee actually takes the full break. If an employee works through lunch or takes a shorter break, the employer must pay for the actual time worked. The Department of Labor has ruled that auto-deductions are permissible only when the employer has a reasonable basis for believing the deduction is accurate (e.g., the employee reliably takes their full lunch break). If auto-deductions result in an employee being underpaid, the employer must compensate for the actual hours worked.',
    },
    {
      question: 'What if I work through my lunch break?',
      answer:
        'If you work through your lunch break — even if your employer has a policy that you should take a break — you must be paid for that time. The key question is whether you were "completely relieved of duty." If you ate at your desk while working, monitored equipment, or remained available to assist customers or colleagues, the time is compensable. Document your actual work hours, including lunch periods when you worked. If your employer auto-deducts lunch despite you working through it, you may have a wage claim for unpaid hours. Many employment lawsuits revolve around exactly this issue.',
    },
    {
      question: 'How many hours is an 8-hour shift with lunch?',
      answer:
        'An 8-hour workday with a 1-hour unpaid lunch means you are at work for 9 hours total (8 hours paid + 1 hour unpaid lunch). If you have a 30-minute lunch, you are at work for 8.5 hours (8 hours paid + 0.5 hours unpaid). Conversely, if you need to get 8 hours of paid work done with a 1-hour lunch, you need to be at work from 8:00 AM to 5:00 PM (9 total hours on-site). Always clarify with your employer whether "8-hour shift" means 8 hours of paid work or 8 hours of total time including breaks.',
    },
    {
      question: 'How does time rounding work on time cards?',
      answer:
        'Many employers round time card entries to the nearest 5, 10, or 15 minutes. Under FLSA regulations, rounding is permissible if it averages out fairly over time — meaning the rounding does not consistently favor the employer. For example, if you clock in at 8:57 and the system rounds to 9:00, but you also clock out at 5:03 and it rounds to 5:00, the rounding is considered neutral. However, if rounding consistently results in underpayment (e.g., always rounding down), it may violate wage laws. Some states restrict or prohibit time rounding. The most common rounding methods are: round to nearest quarter-hour (7:52→8:00, 7:53→7:45), and round in favor of the employee (always round up for clock-in, down for clock-out).',
    },
  ],

  relatedTools: [
    {
      slug: 'time-card-calculator',
      title: 'Time Card Calculator',
      description:
        'Calculate total work hours from clock-in/out times for payroll',
      icon: 'Clock',
    },
    {
      slug: 'overtime-calculator',
      title: 'Overtime Calculator',
      description:
        'Calculate overtime pay with standard time-and-a-half and double-time rates',
      icon: 'Timer',
    },
    {
      slug: 'payroll-calculator',
      title: 'Payroll & Paycheck Calculator',
      description:
        'Estimate your take-home pay after taxes and deductions',
      icon: 'CreditCard',
    },
    {
      slug: 'wages-calculator',
      title: 'Wages Calculator',
      description:
        'Calculate gross wages from hours worked and hourly rates with overtime',
      icon: 'Banknote',
    },
    {
      slug: 'business-day-calculator',
      title: 'Business Day Calculator',
      description:
        'Count business days between dates or add/subtract working days',
      icon: 'CalendarDays',
    },
  ],

  
};

export default seoData;
