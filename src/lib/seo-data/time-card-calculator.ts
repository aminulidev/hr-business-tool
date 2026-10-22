const seoData = {
  howToSteps: [
    'Enter the clock-in and clock-out time for each workday. Both 12-hour (9:00 AM, 5:30 PM, 9am) and 24-hour (09:00, 17:30) formats work. For a night shift, enter the real times — a clock-out earlier than the clock-in (e.g. 10:00 PM to 6:30 AM) is counted as ending the next morning.',
    'Enter the unpaid lunch or meal break for each day in minutes. The default is 30 minutes. Leave paid rest breaks (usually 5–20 minutes) out — under federal rules they count as time worked.',
    'Use "Copy to All" if you work the same schedule every day, or "Add Day" for weekend shifts. Add up to 14 days to total a biweekly timesheet.',
    'Optionally choose a punch rounding rule — nearest 5 minutes, nearest 6 minutes (a tenth of an hour), or nearest 15 minutes (the 7-minute rule) — to match how your employer\'s time clock records punches.',
    'To see pay, enter your hourly rate. Overtime is calculated on hours over the weekly threshold (40 by default under the FLSA) at the multiplier you set (1.5× by default).',
    'Click "Calculate Hours" to see total hours in both decimal (for payroll) and hours:minutes, a per-day breakdown, regular vs. overtime hours, and gross pay.',
  ],

  formula: 'Daily Hours = (Clock Out − Clock In) − Unpaid Break\nWeekly Hours = Σ Daily Hours\nOvertime Hours = max(0, Weekly Hours − 40)\nGross Pay = (Regular Hours × Rate) + (Overtime Hours × Rate × 1.5)',
  formulaDescription:
    'Each day\'s hours are the time between clock-in and clock-out minus the unpaid meal break. If the clock-out is earlier than the clock-in, the shift crossed midnight and 24 hours are added to the clock-out. The days are summed for the week, and anything over the overtime threshold (40 hours under the federal FLSA) is paid at the overtime multiplier. Payroll systems need decimal hours, so minutes are divided by 60: 7 hours 45 minutes = 7 + 45 ÷ 60 = 7.75 hours. Common conversions: 15 min = 0.25, 30 min = 0.50, 45 min = 0.75, 6 min = 0.10, 20 min = 0.33, 40 min = 0.67.',

  faqs: [
    {
      question: 'What is the difference between a time card and a timesheet?',
      answer:
        'They record the same thing — when an employee started and stopped work each day — and the terms are used interchangeably. Traditionally a "time card" was the physical card punched by a time clock, while a "timesheet" is a written or digital log of hours, often with project or job codes. For payroll, both are totaled the same way: daily hours minus unpaid breaks, summed for the workweek, with overtime above 40 hours.',
    },
    {
      question: 'How do I convert time card minutes to decimal hours?',
      answer:
        'Divide the minutes by 60 and add them to the whole hours. 8 hours 45 minutes = 8 + 45/60 = 8.75 hours. The most common values are 15 minutes = 0.25, 30 minutes = 0.50, and 45 minutes = 0.75. Decimal hours are what payroll software expects — entering 8.45 for "8 hours 45 minutes" is a common mistake that underpays by 18 minutes. For converting individual times without a full time card, use the Time to Decimal Calculator.',
    },
    {
      question: 'How do I calculate hours for an overnight shift?',
      answer:
        'Enter the actual clock-in and clock-out times; when the clock-out is earlier than the clock-in, this calculator treats the shift as ending the next day. For example, 10:00 PM to 6:30 AM with a 30-minute meal break is 8 hours 30 minutes minus 30 minutes = 8.00 hours. Under the FLSA, the hours belong to the workweek in which they are worked, so a shift that crosses from Saturday into Sunday may need to be split if your workweek starts on Sunday.',
    },
    {
      question: 'What is the 7-minute rule for time card rounding?',
      answer:
        'When an employer rounds punches to the nearest quarter-hour, 1–7 minutes past a quarter-hour round down and 8–14 minutes round up. So a clock-in at 8:07 AM is recorded as 8:00 and 8:08 AM becomes 8:15. The Department of Labor allows rounding to the nearest 5 minutes, tenth of an hour, or quarter-hour only if it averages out so employees are fully paid over time (29 CFR 785.48). Rounding that consistently favors the employer is not allowed, and some states, including California, scrutinize rounding closely.',
    },
    {
      question: 'Do lunch breaks count as hours worked?',
      answer:
        'A bona fide meal period — usually 30 minutes or more with the employee completely relieved of duty — is not work time and can be unpaid (29 CFR 785.19). Short rest breaks of about 5 to 20 minutes are work time and must be paid (29 CFR 785.18). If you eat at your desk while answering calls or emails, that meal period is generally compensable. Federal law does not require meal breaks, but many states do, so check your state rules.',
    },
    {
      question: 'How is overtime calculated on a time card?',
      answer:
        'Under the federal FLSA, non-exempt employees earn at least 1.5 times their regular rate for hours over 40 in a workweek. Overtime pay = overtime hours × hourly rate × 1.5. For a 46-hour week at $20/hour: 40 × $20 = $800 regular, plus 6 × $30 = $180 overtime, for $980 gross. Some states add daily overtime — California requires 1.5× after 8 hours in a day and 2× after 12 — so adjust the threshold and multiplier to match your state.',
    },
    {
      question: 'Can I total a biweekly timesheet?',
      answer:
        'Yes — add up to 14 days with "Add Day." Be aware that overtime is calculated per workweek, not per pay period: 45 hours in week one and 35 in week two is 80 hours total but still includes 5 overtime hours, because the weeks cannot be averaged. For an accurate biweekly overtime figure, total each week separately.',
    },
    {
      question: 'How long do employers have to keep time cards?',
      answer:
        'The FLSA requires employers to keep time cards and work schedules for at least 2 years, and payroll records for 3 years (29 CFR 516.5–516.6). Several states require longer — California 3 years and New York 6 years, for example. Employees should keep their own record of hours too, which is useful if a paycheck ever looks short.',
    },
  ],

  workedExamples: [
    {
      title: 'Standard 9-to-5:30 Week with 30-Minute Lunch',
      description:
        'Clock in 9:00 AM and out 5:30 PM, Monday through Friday, with a 30-minute unpaid lunch. Daily hours: 8.5 − 0.5 = 8.00. Weekly total: 8.00 × 5 = 40.00 hours, all regular time. At $20/hour, gross pay = 40.00 × $20 = $800.00.',
    },
    {
      title: 'Heavy Overtime Week — Warehouse Supervisor',
      description:
        'Mon 7:00 AM–5:00 PM, Tue 7:00 AM–6:00 PM, Wed 7:00 AM–5:00 PM, Thu 7:00 AM–6:00 PM, Fri 7:00 AM–5:00 PM, each with a 30-minute lunch, plus Sat 8:00 AM–12:00 PM with no break. Net hours: 9.5 + 10.5 + 9.5 + 10.5 + 9.5 + 4 = 53.50. Overtime: 53.50 − 40 = 13.50 hours. At $24/hour: regular 40 × $24 = $960, overtime 13.5 × $36 = $486, total gross $1,446.',
    },
    {
      title: 'Overnight Shift — Night Nurse Aide',
      description:
        'Four shifts of 7:00 PM to 7:30 AM with a 30-minute unpaid meal break. Each shift: 12.5 − 0.5 = 12.00 hours. Weekly total: 48.00 hours, so 8 hours of overtime under the 40-hour rule. At $19/hour: regular 40 × $19 = $760, overtime 8 × $28.50 = $228, total gross $988.',
    },
    {
      title: 'Punch Rounding with the 7-Minute Rule',
      description:
        'An employee punches in at 8:07 AM and out at 4:38 PM with a 30-minute lunch. Exact time: 8 hours 31 minutes − 30 = 8.02 hours. Rounded to the nearest 15 minutes, 8:07 becomes 8:00 (7 minutes rounds down) and 4:38 becomes 4:45 (8 minutes rounds up), giving 8.75 − 0.5 = 8.25 hours. Rounding must balance out over time — some days it favors the employee, some days the employer.',
    },
    {
      title: 'Part-Time Variable Schedule',
      description:
        'Mon 9:00 AM–1:00 PM (4h), Wed 10:00 AM–3:00 PM (5h), Fri 8:00 AM–5:00 PM with a 30-minute lunch (8.5h), and Sat 9:00 AM–2:00 PM (5h). Weekly total: 4 + 5 + 8.5 + 5 = 22.50 hours, all regular time. At $16/hour, gross pay = 22.50 × $16 = $360.00.',
    },
  ],

  relatedTools: [
    {
      slug: 'time-card-calculator-with-lunch',
      title: 'Time Card Calculator with Lunch',
      description: 'Track lunch-out and lunch-in punches or auto-deduct meal breaks',
      icon: 'Coffee',
    },
    {
      slug: 'time-to-decimal-calculator',
      title: 'Time to Decimal Calculator',
      description: 'Convert hours and minutes to decimal format for payroll',
      icon: 'Hash',
    },
    {
      slug: 'overtime-calculator',
      title: 'Overtime Calculator',
      description: 'Calculate overtime pay with time-and-a-half and double-time rates',
      icon: 'Timer',
    },
    {
      slug: 'hourly-paycheck-calculator',
      title: 'Hourly Paycheck Calculator',
      description: 'Turn your weekly hours into take-home pay after taxes',
      icon: 'DollarSign',
    },
    {
      slug: 'shift-hours-calculator',
      title: 'Shift Hours Calculator',
      description: 'Hours for 8, 10, and 12-hour shifts including overnight',
      icon: 'Clock',
    },
  ],
};

export default seoData;
