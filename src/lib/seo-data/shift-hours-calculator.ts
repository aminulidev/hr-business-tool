const seoData = {
  breadcrumbs: [{ label: 'Calculators' }, { label: 'Shift Hours Calculator' }],
  tableOfContents: [
    { id: 'how-to-calculate', label: 'How to Calculate' },
    { id: 'formula', label: 'Shift Scheduling & Payroll Formulas' },
    { id: 'worked-examples', label: 'Shift Pattern Practical Scenarios' },
    { id: 'frequently-asked-questions', label: 'Frequently Asked Questions' },
    { id: 'related-calculators', label: 'Related Shift & Time Calculators' },
  ],
  howToSteps: [
    'Select a pre-configured shift pattern preset (5x8 Standard, 4x10 Compressed, 3x12 Healthcare, 4x12 Extended, 9/80 Bi-Weekly, or 2-2-3 Pitman Rotation) or configure a custom shift length.',
    'Enter your gross shift duration (e.g. 8.5 hours for an 8:30 to 5:00 shift) and specify unpaid meal break minutes (e.g. 30 or 60 minutes) to calculate true net compensable working hours.',
    'Input the number of shifts worked per workweek (use 3.5 or 4.5 for alternating 2-week schedule cycles like 9/80 and Pitman).',
    'Enter your base hourly wage and optionally add a night or weekend shift differential (as a flat $/hr surcharge or percentage boost).',
    'Choose your overtime rule (Standard Federal FLSA weekly threshold >40h vs California Daily 1.5x after 8h and 2.0x after 12h) to view regular, overtime, and double-time wage projections.',
    'Click "Calculate Shift Hours & Pay" to review weekly net hours, monthly averages, annualized hours, and save scenarios to ComparePanel.',
  ],
  formula: 'Net Shift Hours = Gross Shift Hours - (Unpaid Break Minutes / 60)\nWeekly Net Hours = Net Shift Hours x Days Worked Per Week\nMonthly Projected Hours = (Weekly Net Hours x 52) / 12\nAnnual Projected Hours = Weekly Net Hours x 52\nEffective Hourly Rate = Base Rate + Shift Differential ($/hr or %)\nFLSA Weekly OT = max(0, Weekly Net Hours - 40.0)\nCalifornia Daily OT = max(0, min(Net Shift Hours - 8.0, 4.0)) x Days Worked\nCalifornia Daily Double Time = max(0, Net Shift Hours - 12.0) x Days Worked\nWeekly Gross Pay = (Reg Hours x Rate) + (OT Hours x Rate x 1.5) + (DT Hours x Rate x 2.0)',
  formulaDescription: 'Under federal Fair Labor Standards Act (FLSA) regulations (29 U.S.C. § 207), shift workers must be paid 1.5 times their regular rate of pay for all hours worked exceeding 40.0 in a standard 168-hour workweek. When a shift differential is paid (such as an extra $2.50/hour for nocturnal or third-shift work), the FLSA mandates that the differential be incorporated into the regular rate of pay before overtime multipliers are applied. Under California Labor Code § 510, alternative workweek schedules that have not been formally voted on and certified trigger daily overtime after 8 hours (1.5x) and double-time after 12 hours (2.0x).',
  workedExamples: [
    {
      title: 'Standard 5x8 Office / Manufacturing Shift (40h Week)',
      description: 'An employee works 5 shifts per week, scheduled 8:30 AM to 5:00 PM (8.5 gross hours) with a 30-minute unpaid lunch, yielding exactly 8.0 net working hours per shift. Weekly net hours equal 5 x 8.0 = 40.0 hours. At a base pay rate of $25.00/hour, regular weekly gross earnings are $1,000.00 with $0 overtime. Projected monthly hours average 173.33 hours ($4,333.33/month), and annualized hours total 2,080 hours ($52,000/year).',
    },
    {
      title: 'Compressed 4x10 Workweek (3-Day Weekend)',
      description: 'A municipal utility technician works Monday through Thursday from 7:00 AM to 5:30 PM (10.5h gross, 30m unpaid break = 10.0h net per shift). Weekly net hours equal 4 x 10.0 = 40.0 hours. Under federal FLSA rules, weekly hours do not exceed 40, so overtime is $0. However, in California, without an approved Alternative Workweek Election, the technician receives 2 hours of daily overtime per day (8 hours total OT at 1.5x). At $30.00/hr, federal pay is $1,200.00, whereas California pay equals (32 x $30) + (8 x $45) = $1,320.00.',
    },
    {
      title: 'Hospital Nurse 3x12 Night Shift with Differential ($4/hr Night Premium)',
      description: 'A registered nurse works three 12.5-hour night shifts (7:00 PM to 7:30 AM with a 30-minute unpaid meal period = 12.0 net hours per shift). Total weekly net hours equal 3 x 12.0 = 36.0 hours. Base pay is $42.00/hour plus a $4.00/hour night shift differential, making the effective rate $46.00/hour. Weekly gross earnings equal 36.0 hours x $46.00 = $1,656.00. The nurse enjoys 4 consecutive days off each week while earning $7,176.00/month and $86,112.00/year.',
    },
    {
      title: 'High-Demand 4x12 Shift Schedule (Built-in 8h Weekly Overtime)',
      description: 'An oil refinery operator works four 12-hour shifts per week (48.0 net hours). Under federal FLSA, hours over 40 trigger 1.5x overtime. The schedule yields 40.0 regular straight-time hours and 8.0 overtime hours per week. At an effective wage rate of $35.00/hour, weekly gross compensation equals (40 x $35) + (8 x $52.50) = $1,400 + $420 = $1,820.00 ($94,640.00 annualized over 2,496 working hours).',
    },
    {
      title: '9/80 Compressed Bi-Weekly Government Schedule',
      description: 'An aerospace defense contractor works a 9/80 schedule across an 80-hour 2-week pay period: Week 1 consists of 4 nine-hour days and 1 eight-hour day (44h); Week 2 consists of 4 nine-hour days and Friday off (36h). By splitting the 8-hour Friday at midday into two 4-hour segments for FLSA workweek definition, the employer avoids overtime: each FLSA workweek contains exactly 40.0 hours (36 + 4), providing employees with every other Friday off.',
    },
    {
      title: '2-2-3 Pitman 12-Hour Continuous 24/7 Shift Rotation',
      description: 'A chemical plant operates a 2-2-3 Pitman schedule (2 on, 2 off, 3 on, 2 off, 2 on, 3 off over 14 days). Week 1 features 3 twelve-hour shifts (36.0h net). Week 2 features 4 twelve-hour shifts (48.0h net, with 8.0h overtime). Averaged across the 2-week cycle, the operator averages 42.0 hours per week (3.5 days/week x 12h = 42h) with 2.0 hours of built-in weekly overtime. At $32.00/hr, average weekly gross is (40 x $32) + (2 x $48) = $1,376.00 ($71,552/year).',
    },
  ],
  faqs: [
    {
      question: 'What is a 4x10 work schedule and does it require overtime?',
      answer: 'A 4x10 schedule is a compressed workweek where an employee works four 10-hour days each week, totaling 40 hours, followed by three consecutive days off. Under federal FLSA rules, no overtime is required because total weekly hours do not exceed 40.0. However, in states with daily overtime laws like California (Labor Code § 510), any hours worked over 8 in a single day must be paid at 1.5 times the regular rate (2 hours of OT per day = 8 hours of OT per week), unless the employer and employees have formally adopted and filed an Alternative Workweek Schedule (AWS) approved by a two-thirds secret ballot vote.',
    },
    {
      question: 'How do 12-hour shifts work for weekly overtime and rest periods?',
      answer: 'Twelve-hour shifts are common in healthcare, emergency services, continuous manufacturing, and public safety. On a typical 3x12 schedule (3 shifts x 12 net hours = 36 hours/week), an employee works full-time hours in 3 days with 4 days off, incurring 0 federal overtime hours. On a 4x12 schedule (48 hours/week), the employee works 40 regular hours and 8 hours of overtime paid at 1.5 times their regular rate. In California, shifts lasting 12 hours trigger 4 hours of daily overtime (hours 9 through 12 paid at 1.5x) and require two 30-minute meal periods unless one is legally waived.',
    },
    {
      question: 'How does a shift differential affect overtime pay calculations?',
      answer: 'Under 29 CFR § 778.207, shift differentials (such as an extra $2.00/hour or 10% premium for working evening, night, or weekend shifts) cannot be excluded from the regular rate of pay. The differential must be added to the employee\'s base rate to establish the statutory regular rate before applying the 1.5x overtime multiplier. For example, if a worker with a $30.00/hr base wage receives a $4.00/hr night differential, their regular rate is $34.00/hour, and their overtime rate is $34.00 x 1.5 = $51.00/hour (not $30 x 1.5 + $4 = $49).',
    },
    {
      question: 'What is the 9/80 work schedule and how is overtime avoided?',
      answer: 'The 9/80 schedule compresses 80 working hours into 9 days across a two-week period, granting employees every other Friday off. Employees work four 9-hour days (Mon–Thu) and one 8-hour day on Friday in Week 1, followed by four 9-hour days (Mon–Thu) and Friday off in Week 2. To avoid FLSA overtime (which normally triggers over 40 hours in Week 1), the employer officially defines the FLSA 168-hour workweek to start and end exactly 4 hours into the working Friday. This splits the 8-hour Friday into 4 hours in Week 1 (36 + 4 = 40h) and 4 hours in Week 2 (4 + 36 = 40h).',
    },
    {
      question: 'What is the 2-2-3 Pitman shift schedule?',
      answer: 'The 2-2-3 Pitman schedule (also known as the Panama plan) is a 14-day rotating schedule used for continuous 24/7 operations with 12-hour shifts. Over a two-week cycle, a crew works: 2 days on, 2 days off, 3 days on, 2 days off, 2 days on, 3 days off. This ensures that employees never work more than 3 consecutive days, and every other weekend is a 3-day weekend (Friday, Saturday, Sunday off). Over the 14 days, workers complete 7 shifts (84 hours total, averaging 42 hours per week with 2 hours of overtime).',
    },
    {
      question: 'Are lunch breaks deducted from shift hours?',
      answer: 'Under the FLSA (29 CFR § 785.19), bona fide meal periods (typically lasting 30 minutes or more where the employee is completely relieved of all work responsibilities) are not compensable work hours and are deducted from gross shift time. For example, an 8:00 AM to 4:30 PM shift spans 8.5 gross hours; deducting a 30-minute unpaid lunch leaves 8.0 net paid hours. Rest breaks lasting 20 minutes or fewer cannot be deducted and must be compensated as paid time.',
    },
    {
      question: 'How are monthly and annual shift hours calculated?',
      answer: 'Because calendar months do not have an even 4.0 weeks, multiplying weekly hours by 4 produces inaccurate results. An accurate calculation uses the annual ratio of 52 weeks ÷ 12 months = 4.3333 weeks per month. For example, a 36-hour healthcare shift schedule equals 36 x 4.3333 = 156.0 average monthly hours and 36 x 52 = 1,872 annual hours. A 40-hour schedule yields 173.33 monthly hours and 2,080 annual hours.',
    },
    {
      question: 'Can employers require mandatory 12-hour shifts?',
      answer: 'Under federal FLSA law, employers may schedule adult employees for as many hours in a day or week as business needs dictate, provided non-exempt employees receive mandatory overtime pay (1.5x) for hours worked beyond 40 in a workweek. However, mandatory shift limits exist for specific safety-sensitive industries under federal Department of Transportation (DOT) hours-of-service regulations for commercial drivers, Federal Aviation Administration (FAA) rules for pilots, and state-specific mandatory nurse overtime restrictions.',
    },
  ],
  relatedTools: [
    { slug: 'shift-rotation-calculator', title: 'Shift Rotation Calculator', description: 'Schedule 2-2-3, DuPont, and 4-on/4-off rotating team rosters', icon: 'RefreshCw' },
    { slug: 'shift-pay-calculator', title: 'Shift Pay Calculator', description: 'Calculate wages with evening, night, and weekend shift differentials', icon: 'SunMedium' },
    { slug: 'work-hours-calculator', title: 'Work Hours Calculator', description: 'Calculate weekly net hours and break deductions from time entries', icon: 'Clock' },
    { slug: 'overtime-calculator', title: 'Overtime Calculator', description: 'Calculate federal weekly and state daily overtime and double time', icon: 'Timer' },
    { slug: 'employee-hours-calculator', title: 'Employee Hours Calculator', description: 'Track hours, overtime, and gross payroll for multiple employees', icon: 'Users' },
    { slug: 'payroll-hours-calculator', title: 'Payroll Hours Calculator', description: 'Convert time-clock hours and minutes into gross employee paychecks', icon: 'Banknote' },
  ],
};

export default seoData;
