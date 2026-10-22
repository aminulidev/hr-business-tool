const seoData = {
  howToSteps: [
    'Choose the time card period: 1 week, or 2 weeks for a biweekly timesheet. Overtime is still calculated separately for each week.',
    'Choose a lunch mode. "Manual" lets you enter the actual lunch-out and lunch-in punches for each day. "Auto-Deduct" subtracts a fixed 30, 45, 60, or 90-minute lunch from every shift, the way many payroll systems do.',
    'Turn on the days you worked and enter your clock-in and clock-out times. Both 12-hour (9:00 AM, 5:30 PM) and 24-hour (09:00, 17:30) formats work, and overnight shifts are fine — a clock-out earlier than the clock-in counts as the next morning.',
    'Use "Copy to All" if you work the same schedule every day, then adjust any days that were different.',
    'Optionally enter your hourly rate to see regular pay, overtime pay at 1.5×, and gross pay. Change the weekly overtime threshold if your employer or state uses something other than 40 hours.',
    'Click "Calculate Hours" to get hours before and after lunch, lunch length, and total hours for each day, plus totals for the period. Use "Copy Summary" or "Print Timesheet" to keep a record.',
  ],

  formula:
    'Daily Hours = (Lunch Out − Clock In) + (Clock Out − Lunch In)\nAuto-deduct: Daily Hours = (Clock Out − Clock In) − Lunch Minutes ÷ 60\nWeekly Overtime = max(0, Weekly Hours − 40)',

  formulaDescription:
    'A day with a lunch break has two work segments: clock-in to lunch-out, and lunch-in to clock-out. Adding the two segments gives paid hours and leaves the unpaid lunch out. In auto-deduct mode the calculator subtracts the fixed lunch length from the whole shift instead. Hours are shown in decimal for payroll — 7 hours 30 minutes is 7.50. For a biweekly time card, each week is totaled and checked against the 40-hour overtime threshold on its own, because the FLSA does not allow averaging hours across two weeks.',

  workedExamples: [
    {
      title: '9-to-5 with a 1-Hour Lunch',
      description:
        'Clock in 9:00 AM, lunch out 12:00 PM, lunch in 1:00 PM, clock out 5:00 PM. Before lunch: 3.00 hours. After lunch: 4.00 hours. Paid hours: 7.00 per day, or 35.00 for a Monday–Friday week. To get a full 8 paid hours with a 1-hour lunch, you would need to be on-site 9 hours — for example 8:00 AM to 5:00 PM.',
    },
    {
      title: '8-Hour Shift with a 30-Minute Lunch',
      description:
        'Clock in 8:00 AM, lunch 12:00–12:30 PM, clock out 4:30 PM. Before lunch: 4.00 hours. After lunch: 4.00 hours. Paid hours: 8.00 per day and 40.00 for five days. At $18/hour that is $720 gross with no overtime.',
    },
    {
      title: '6-Day Week with Auto-Deducted 30-Minute Lunch',
      description:
        'A restaurant worker is scheduled 10:00 AM to 6:00 PM, Monday to Saturday, and the payroll system auto-deducts 30 minutes each day. Paid hours: 8.0 − 0.5 = 7.5 per day, or 45.00 for the week — 40 regular and 5 overtime. At $16/hour: 40 × $16 = $640 regular, plus 5 × $24 = $120 overtime, for $760 gross.',
    },
    {
      title: 'Biweekly Time Card with Overtime in One Week',
      description:
        'Week 1: five 9-hour days (7:00 AM–4:30 PM with a 30-minute lunch) = 45 hours. Week 2: four 8-hour days = 32 hours. The two-week total is 77 hours, under 80, but week 1 still has 5 overtime hours because overtime is counted per workweek. At $20/hour: 72 regular hours × $20 = $1,440, plus 5 × $30 = $150 overtime, for $1,590 gross.',
    },
    {
      title: 'Overnight Shift with a Meal Break After Midnight',
      description:
        'Clock in 10:00 PM, lunch out 2:00 AM, lunch in 2:30 AM, clock out 6:30 AM. Before lunch: 4.00 hours. After lunch: 4.00 hours. Paid hours: 8.00. The calculator treats any time earlier than the clock-in as the next day, so there is no need to convert to 24-hour time or split the shift.',
    },
  ],

  faqs: [
    {
      question: 'How do I calculate hours worked with a lunch break?',
      answer:
        'Work out the time before lunch and the time after lunch, then add them. Clock in 8:30 AM, lunch out 12:00 PM = 3 hours 30 minutes. Lunch in 12:45 PM, clock out 5:00 PM = 4 hours 15 minutes. Total = 7 hours 45 minutes, or 7.75 hours in decimal. Alternatively, take the full time from clock-in to clock-out (8 hours 30 minutes) and subtract the 45-minute lunch — you get the same 7.75 hours.',
    },
    {
      question: 'Does my employer have to pay me for my lunch break?',
      answer:
        'Usually not, if it is a real meal break. Under the FLSA, a bona fide meal period — ordinarily 30 minutes or more, with you completely relieved of duty — is not work time and can be unpaid (29 CFR 785.19). If you have to stay at your desk, answer phones, or watch equipment while eating, the time counts as work and must be paid. Short breaks of about 5 to 20 minutes are always paid work time under federal rules (29 CFR 785.18).',
    },
    {
      question: 'Is a lunch break required by law?',
      answer:
        'Federal law does not require employers to give adult employees a meal or rest break. Many states do. California, for example, requires an unpaid 30-minute meal period before the end of the fifth hour of work, a second one for shifts over 10 hours, and a paid 10-minute rest break for every 4 hours worked. Other states with meal-break rules include New York, Illinois, Washington, Oregon, and Colorado. Check your state labor department for the exact rules.',
    },
    {
      question: 'Can my employer automatically deduct a lunch break?',
      answer:
        'Yes, employers may auto-deduct a scheduled meal break, but they still have to pay for any meal break you do not actually get. The Department of Labor notes in Fact Sheet #53 that automatic meal deductions are a common source of overtime violations when employees work through lunch. If you are interrupted or skip lunch, record it and tell payroll so the deduction can be reversed.',
    },
    {
      question: 'What if I work through my lunch break?',
      answer:
        'Then that time is hours worked and must be paid, even if company policy says to take a break. The test is whether you were completely relieved of duty. If working through lunch pushes you over 40 hours in the week, the extra time must be paid at 1.5× as overtime. Keep your own record of the days you worked through lunch — it is the strongest evidence if a paycheck comes up short.',
    },
    {
      question: 'How many hours is 8 to 5 with a 1-hour lunch?',
      answer:
        '8:00 AM to 5:00 PM is 9 hours on-site. Subtract a 1-hour unpaid lunch and you have 8 paid hours, or 40 hours for a five-day week. With a 30-minute lunch, 8:00 AM to 5:00 PM gives 8.5 paid hours, and you would need to leave at 4:30 PM for an even 8.',
    },
    {
      question: 'How do I fill out a two-week time card with lunch breaks?',
      answer:
        'Select "2 weeks" and enter each day\'s clock-in, lunch-out, lunch-in, and clock-out times for both weeks. Total each week separately before adding them together. Overtime is owed for any single week over 40 hours, even if the two-week total is under 80. That is why this calculator shows a combined total but calculates overtime week by week.',
    },
  ],

  relatedTools: [
    {
      slug: 'time-card-calculator',
      title: 'Time Card Calculator',
      description: 'Weekly timesheet with overtime, overnight shifts, and punch rounding',
      icon: 'Clock',
    },
    {
      slug: 'hourly-paycheck-calculator',
      title: 'Hourly Paycheck Calculator',
      description: 'Turn your hours into take-home pay after taxes',
      icon: 'DollarSign',
    },
    {
      slug: 'overtime-calculator',
      title: 'Overtime Calculator',
      description: 'Calculate overtime pay with time-and-a-half and double-time rates',
      icon: 'Timer',
    },
    {
      slug: 'time-to-decimal-calculator',
      title: 'Time to Decimal Calculator',
      description: 'Convert hours and minutes to decimal hours for payroll',
      icon: 'Hash',
    },
    {
      slug: 'work-hours-calculator',
      title: 'Work Hours Calculator',
      description: 'Add up hours worked across days and weeks',
      icon: 'Clock',
    },
  ],
};

export default seoData;
