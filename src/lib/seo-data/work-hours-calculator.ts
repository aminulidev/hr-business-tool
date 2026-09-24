const seoData = {
  breadcrumbs: [{ label: 'Calculators' }, { label: 'Work Hours Calculator' }],
  tableOfContents: [
    { id: 'how-to-calculate', label: 'How to Calculate' },
    { id: 'formula', label: 'Work Hours & Payroll Formulas' },
    { id: 'worked-examples', label: 'Practical Timesheet Examples' },
    { id: 'frequently-asked-questions', label: 'Frequently Asked Questions' },
    { id: 'related-calculators', label: 'Related Time & Payroll Calculators' },
  ],
  howToSteps: [
    'Use quick presets (e.g. Standard 9–5:30 with 30m break, 8–4:30 with 45m lunch, or 4x10 schedule) or enter daily clock-in and clock-out times manually for Monday through Sunday.',
    'Enter times in any common format: 12-hour AM/PM (e.g. "8:30 AM", "5:15 PM"), shorthand ("9am", "6pm"), or 24-hour military time ("08:30", "17:15"). Overnight shifts crossing midnight are detected and adjusted automatically.',
    'Enter the unpaid break duration (in minutes) for each work day. True meal breaks (30+ minutes where relieved of duty) are deducted, while rest breaks under 20 minutes remain paid.',
    'Choose your preferred time rounding rule: exact minutes, standard 15-minute 7/8 FLSA rule, 6-minute tenths of an hour, or nearest 5-minute interval.',
    'Select your overtime calculation rule (standard federal 40h/week FLSA threshold vs California daily 8h OT rule) and enter your hourly rate to calculate gross pay and decimal hours.',
    'Click "Calculate Work Hours" to generate total net hours, decimal conversions, overtime premiums, projected monthly/annual hours, and click "Copy Timesheet Summary" to export.',
  ],
  formula: 'Gross Daily Time = Clock-Out Time - Clock-In Time (add 24h if Out < In for overnight)\nNet Daily Minutes = max(0, Gross Daily Time - Unpaid Break Minutes)\nRounded Daily Minutes = applyRounding(Net Daily Minutes, RoundingRule)\nWeekly Net Hours = sum(Rounded Daily Minutes) / 60\nFederal Overtime Hours = max(0, Weekly Net Hours - 40.0)\nRegular Hours = Weekly Net Hours - Federal Overtime Hours\nGross Pay = (Regular Hours x Hourly Rate) + (Overtime Hours x Hourly Rate x 1.5)\nMonthly Projected Hours = Weekly Net Hours x 4.3333',
  formulaDescription: 'Under federal Fair Labor Standards Act (FLSA) guidelines (29 CFR Part 785), non-exempt employees must be compensated for all hours suffered or permitted to work. Net work hours represent total elapsed shift time minus bona fide unpaid meal periods. Under 29 CFR § 785.48(b), employers are permitted to utilize 15-minute time-clock rounding under the "7-minute rule" (where minutes 1 through 7 round down to the nearest quarter hour and minutes 8 through 14 round up to the next quarter hour), provided the rounding averages out neutrally over time. Overtime must be credited at a minimum of 1.5 times the regular hourly rate for all hours exceeding 40 during a fixed, recurring 168-hour workweek.',
  workedExamples: [
    {
      title: 'Standard 40-Hour Workweek (5 Days, 30-min Lunch)',
      description: 'An administrative coordinator works Monday through Friday from 9:00 AM to 5:30 PM with a 30-minute unpaid lunch break each day. Gross daily time is 8 hours 30 minutes (8.50 hours). Subtracting the 30-minute lunch yields exactly 8 hours 0 minutes (8.00 decimal hours) of net compensable time per day. Across the 5-day week, the coordinator logs 40.00 net work hours. At a wage rate of $24.00/hour, regular pay equals $960.00 with $0 overtime.',
    },
    {
      title: 'Overtime Week with 15-Minute FLSA Rounding',
      description: 'A warehouse clerk works Monday through Thursday from 8:00 AM to 5:00 PM (1-hour lunch = 8.00h/day = 32.00h). On Friday, due to an inventory surge, they clock in at 7:54 AM and clock out at 6:38 PM with a 30-minute lunch. The unrounded Friday time is 10 hours 44 minutes minus 30 minutes = 10 hours 14 minutes. Under the 15-minute FLSA rounding rule (14 minutes rounds up to 15 minutes), Friday rounds to 10 hours 15 minutes (10.25h). Total weekly net hours equal 42.25 hours (40.00 regular + 2.25 OT). At $20.00/hr, pay equals (40 x $20) + (2.25 x $30) = $800 + $67.50 = $867.50.',
    },
    {
      title: 'Hospital Nurse Overnight Shift (Midnight Crossing)',
      description: 'An emergency room nurse works 7:00 PM to 7:30 AM with a 45-minute unpaid meal break. Because the clock-out time (07:30) is earlier than the clock-in time (19:00), the calculator automatically detects an overnight shift crossing midnight and adds 24 hours. Gross elapsed time is 12 hours 30 minutes (750 minutes). Subtracting the 45-minute break results in 11 hours 45 minutes (11.75 decimal hours) of net compensable work time.',
    },
    {
      title: 'California Daily Overtime Rule (4-Day 10-Hour Schedule)',
      description: 'An auto technician in California works a compressed schedule of four 10-hour shifts (Mon–Thu, 7:00 AM to 5:30 PM with a 30-minute lunch = 10 net hours per day = 40 weekly hours). Under federal FLSA, 40 weekly hours incurs $0 overtime. However, under California Labor Code § 510, daily overtime (1.5x) is required for all hours worked beyond 8 in a single workday. The technician earns 2 hours of daily OT per shift x 4 days = 8 hours of daily overtime and 32 regular hours. At $30.00/hr base rate, gross pay is (32 x $30) + (8 x $45) = $960 + $360 = $1,320.00, compared to $1,200.00 under federal rules.',
    },
    {
      title: 'Short Unpaid Lunch vs Paid Rest Break Dispute',
      description: 'A customer support agent takes a 15-minute coffee break and a 25-minute lunch break. Under federal 29 CFR § 785.18, rest breaks of 20 minutes or fewer are non-deductible paid rest time. Furthermore, meal breaks must generally be 30 minutes or longer to be legally deductible as unpaid time. If the employer only deducts legitimate bona fide 30+ minute breaks, the agent receives full compensation for short rest interruptions.',
    },
    {
      title: 'Variable Part-Time Schedule with Monthly Projections',
      description: 'A retail associate works Mon 10:00 AM–3:00 PM (5.0h, no lunch), Wed 1:00 PM–7:00 PM (30m lunch = 5.5h), and Sat 9:00 AM–5:00 PM (30m lunch = 7.5h), totaling 18.00 net weekly hours. At $18.50/hour, weekly gross earnings are $333.00. The calculator projects average monthly hours of 78.0 hours (18 x 4.3333 weeks) and estimated monthly gross income of $1,443.00, simplifying monthly household budgeting.',
    },
  ],
  faqs: [
    {
      question: 'How do you convert work hours and minutes to decimal hours for payroll?',
      answer: 'To convert minutes to decimal hours, divide the total number of minutes by 60. For example, 15 minutes is 15 ÷ 60 = 0.25 hours; 30 minutes is 30 ÷ 60 = 0.50 hours; and 45 minutes is 45 ÷ 60 = 0.75 hours. If an employee works 7 hours and 38 minutes, the calculation is 7 + (38 ÷ 60) = 7 + 0.6333... = 7.63 decimal hours. Multiplying 7.63 decimal hours by their hourly wage (e.g. $25.00/hr) gives exact payroll earnings ($190.75).',
    },
    {
      question: 'What is the FLSA 7-minute rule for 15-minute time clock rounding?',
      answer: 'Under 29 CFR § 785.48(b), the IRS and Department of Labor allow employers to round employee clock-in and clock-out times to the nearest 15-minute increment (quarter hour). Under the standard "7/8 minute rule", employee time from 1 to 7 minutes past the quarter hour must be rounded down to the previous quarter hour, while time from 8 to 14 minutes past the quarter hour must be rounded up to the next quarter hour. The law strictly mandates that rounding must be neutral over time and cannot consistently disadvantage the employee.',
    },
    {
      question: 'Are employers legally required to deduct lunch and rest breaks?',
      answer: 'Under the Fair Labor Standards Act (FLSA), employers are not required to provide meal or rest breaks. However, if breaks are provided, federal regulations differentiate between them: rest breaks lasting 20 minutes or less (such as coffee breaks) must be counted as paid work hours. Bona fide meal periods (typically lasting 30 minutes or longer where the employee is completely relieved of all job duties) are not compensable work time and are deducted from total hours worked.',
    },
    {
      question: 'How does overnight shift work hours calculation work across midnight?',
      answer: 'When a shift begins on one calendar day and ends on the next (e.g., clock in at 10:00 PM and clock out at 6:30 AM), the clock-out time appears smaller than the clock-in time in standard clock notation. To calculate the duration correctly, add 24 hours (1,440 minutes) to the clock-out time before subtracting the clock-in time: (6:30 AM + 24:00 = 30:30) - 22:00 = 8 hours 30 minutes gross time. Subtracting a 30-minute meal break yields 8.00 net compensable hours.',
    },
    {
      question: 'What is the difference between federal weekly overtime and California daily overtime?',
      answer: 'Under federal FLSA rules (Section 7), overtime is evaluated solely on a weekly basis: non-exempt employees earn 1.5 times their regular rate for any hours worked beyond 40.0 in a defined 168-hour workweek, regardless of how many hours are worked on any single day. In contrast, California Labor Code § 510 mandates daily overtime: non-exempt workers receive 1.5x pay for any hours worked beyond 8.0 in a single workday, and 2.0x double time for hours worked beyond 12.0 in a single day or beyond 8 hours on the seventh consecutive day of work.',
    },
    {
      question: 'Can employers average work hours over a two-week pay period to avoid overtime?',
      answer: 'No. The FLSA explicitly states that each workweek stands alone. Employers cannot average hours across a bi-weekly pay period (80 hours total) to avoid paying overtime. For instance, if an employee works 48 hours in Week 1 and 32 hours in Week 2, the employee must be paid 8 hours of overtime for Week 1, even though their two-week total equals 80 hours. The only narrow exception is for certain hospital and residential care establishments operating under an FLSA § 7(j) "8 and 80" exemption agreement.',
    },
    {
      question: 'What time tracking records must employers retain under federal law?',
      answer: 'Under FLSA recordkeeping regulations (29 CFR Part 516), employers must preserve all basic time and earning cards or sheets on which are entered the daily starting and stopping times of individual employees for at least two years. General payroll records, including employee full legal names, wage rates, weekly hours worked, gross pay, and total additions or deductions, must be preserved for at least three years.',
    },
    {
      question: 'How are projected monthly and annual hours calculated from weekly hours?',
      answer: 'Because a calendar year has 52 weeks and 12 months, there are exactly 52 ÷ 12 = 4.3333 weeks in an average calendar month (not an even 4.0 weeks). To project monthly hours from a standard weekly schedule, multiply weekly net hours by 4.3333 (e.g. 40 hours/week x 4.3333 = 173.33 average monthly hours). Annualized hours equal weekly hours multiplied by 52 (e.g. 40 hours/week x 52 = 2,080 annual working hours).',
    },
  ],
  relatedTools: [
    { slug: 'time-card-calculator', title: 'Time Card Calculator', description: 'Weekly time card with printable timesheets and decimal hour conversions', icon: 'Clock' },
    { slug: 'time-card-calculator-with-lunch', title: 'Time Card with Lunch', description: 'Timesheet calculator with dedicated unpaid lunch and break tracking', icon: 'Coffee' },
    { slug: 'overtime-calculator', title: 'Overtime Calculator', description: 'FLSA and California overtime calculations with 1.5x and 2.0x rates', icon: 'Timer' },
    { slug: 'payroll-hours-calculator', title: 'Payroll Hours Calculator', description: 'Convert employee time entries into gross payroll checks', icon: 'Banknote' },
    { slug: 'timesheet-calculator', title: 'Timesheet Calculator', description: 'Bi-weekly and semi-monthly employee timesheet calculator', icon: 'FileText' },
    { slug: 'shift-pay-calculator', title: 'Shift Pay Calculator', description: 'Calculate total pay with night and weekend shift differentials', icon: 'SunMedium' },
  ],
};

export default seoData;
