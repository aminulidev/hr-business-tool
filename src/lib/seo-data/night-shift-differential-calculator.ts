const seoData = {
  breadcrumbs: [{ label: 'Calculators' }, { label: 'Night Shift Differential Calculator' }],
  tableOfContents: [
    { id: 'how-to-calculate', label: 'How to Calculate' },
    { id: 'formula', label: 'Formula & Night Pay Rates' },
    { id: 'worked-examples', label: 'Worked Examples' },
    { id: 'frequently-asked-questions', label: 'FAQs' },
    { id: 'statutory-sources', label: 'Statutory Sources' },
    { id: 'related-calculators', label: 'Related Calculators' },
  ],
  howToSteps: [
    'Enter your base hourly wage — the standard straight-time rate earned during daytime hours.',
    'Select your differential structure: Percentage (%) or Flat Dollar addition ($/hr). Common industry rates: 10%–15% or $2.50–$5.00/hr extra.',
    'Enter the number of hours worked during third-shift / graveyard hours (commonly between 6:00 PM and 6:00 AM).',
    'Optionally, add any day-shift hours worked in the same workweek to compute total combined gross earnings.',
    'Click "Calculate Night Shift Pay" to view regular pay, night straight base, night differential premium, and total weekly earnings.',
    'If total hours exceed 40, check the FLSA Overtime Threshold alert to understand how night differentials affect regular rate overtime calculations.',
  ],
  formula: 'Percentage Differential:\nNight Rate = Base Rate x (1 + Differential% / 100)\nNight Premium ($/hr) = Base Rate x (Differential% / 100)\n\nFixed Dollar Differential:\nNight Rate = Base Rate + Fixed Differential ($/hr)\nNight Premium ($/hr) = Fixed Differential ($/hr)\n\nTotal Night Pay = Night Rate x Night Hours\nTotal Gross Earnings = (Base Rate x Regular Day Hours) + Total Night Pay\nNight Shift Differential Total = Premium per Hour x Night Hours',
  formulaDescription: 'A night shift differential (NSD) is a supplemental wage premium paid to employees for working during undesirable, biologically taxing overnight hours (typically 6:00 PM to 6:00 AM or 11:00 PM to 7:00 AM). While private-sector employers are not federally required by the FLSA to pay shift differentials, employers who offer them must legally treat them as non-discretionary wage additions and incorporate them into the statutory regular rate when calculating 1.5× overtime.',
  workedExamples: [
    {
      title: 'Hospital Emergency Room Nurse (Flat $/hr Differential)',
      description: 'A registered nurse earns a base straight rate of $38.00/hr. The hospital union contract grants a +$5.00/hr night shift differential for 12-hour shifts worked between 7:00 PM and 7:00 AM. In a 36-hour workweek (three 12-hour shifts): Night rate = $38.00 + $5.00 = $43.00/hr. Weekly gross pay = 36 × $43.00 = $1,548.00. Base earnings would have been $1,368.00; the $5.00/hr night differential adds $180.00 in weekly premium pay ($9,360.00 annually).',
    },
    {
      title: 'Automotive Manufacturing 3rd Shift (Percentage Differential)',
      description: 'An assembly line specialist earns $24.00/hr base rate on graveyard shift with a 15% night differential. Night hourly rate = $24.00 × 1.15 = $27.60/hr (a $3.60/hr premium). For a full 40-hour workweek: Total gross pay = 40 × $27.60 = $1,104.00. Straight base pay is $960.00, yielding $144.00 per week in night differential compensation ($7,488.00/year).',
    },
    {
      title: 'Night Shift + Daytime Hours with FLSA Overtime',
      description: 'A forklift operator earning $20.00/hr base works 36 night hours (+10% differential = $22.00/hr) plus an extra 10 day hours ($20.00/hr), totaling 46 hours. Straight-time pay = (36 × $22) + (10 × $20) = $792 + $200 = $992.00. Regular rate of pay = $992 ÷ 46h = $21.57/hr. Overtime premium (half-time on 6 OT hours) = 6 × ($21.57 × 0.5) = $64.71. Total weekly gross wages = $992.00 + $64.71 = $1,056.71.',
    },
    {
      title: 'California State Hospital Personnel (Statutory Differential)',
      description: 'A psychiatric technician employed by a California state facility earns $32.00/hr. Under California Welfare and Institutions Code § 14685.5, workers receive a statutory 8% night differential for shifts between 6:00 PM and 6:00 AM. Effective night rate = $32.00 × 1.08 = $34.56/hr. For 40 hours worked, total gross pay is $1,382.40, providing an extra $102.40 per week in statutory differential pay.',
    },
    {
      title: 'Weekend Night Security Specialist (Compounded Premiums)',
      description: 'A facility security guard earns $19.00/hr base. The company provides a 12% night differential and an additional $2.00/hr weekend shift bonus. Effective rate for a 10-hour Saturday overnight shift = ($19.00 × 1.12) + $2.00 = $21.28 + $2.00 = $23.28/hr. Total earnings for the shift are $232.80 versus $190.00 straight daytime pay.',
    },
  ],
  faqs: [
    {
      question: 'What qualifies as night shift differential hours?',
      answer: 'Under standard human resources conventions and collective bargaining agreements, night shift hours generally span 6:00 PM to 6:00 AM or 7:00 PM to 7:00 AM. In the federal government sector (5 U.S.C. § 5345), night shift differential officially applies to regularly scheduled non-overtime work performed between 6:00 PM and 6:00 AM.',
    },
    {
      question: 'Is night shift differential required under federal law?',
      answer: 'No. The Fair Labor Standards Act (FLSA 29 U.S.C. § 207) does not mandate premium pay or differentials for working nights, evenings, or weekends. Private employers offer night differentials voluntarily or pursuant to collective bargaining agreements (CBAs) to recruit and retain workers for difficult overnight hours.',
    },
    {
      question: 'How does night shift differential affect overtime pay under the FLSA?',
      answer: 'Under 29 C.F.R. § 778.207, night shift differentials cannot be excluded from the "regular rate of pay." When a non-exempt employee works more than 40 hours in a workweek, the employer must compute a weighted average hourly rate including all night differentials. Overtime hours must then be compensated at 1.5× this blended regular rate.',
    },
    {
      question: 'What is the average night shift differential in healthcare and nursing?',
      answer: 'In US hospitals, night shift differentials for registered nurses (RNs), LPNs, and respiratory therapists typically range from $3.00 to $6.00 per hour flat, or 12% to 18% of base wages. Weekend night shifts frequently command combined premiums exceeding $7.00 to $10.00 per hour.',
    },
    {
      question: 'Are night shift differentials taxed differently from regular wages?',
      answer: 'No. Night shift differentials are treated as taxable compensation. They are subject to regular federal and state income tax withholding, as well as statutory FICA payroll taxes (6.2% Social Security + 1.45% Medicare). They are reported in Box 1 (Wages, tips, other comp) on your annual W-2 form.',
    },
    {
      question: 'Do salaried employees receive night shift differentials?',
      answer: 'Generally, exempt salaried employees do not receive night shift differentials because their compensation is fixed regardless of hours or shifts. However, in mission-critical industries (such as healthcare IT, air traffic control, or clinical supervision), employers may provide shift stipends, additional paid leave, or shift allowances.',
    },
  ],
  relatedTools: [
    {
      slug: 'shift-pay-calculator',
      title: 'Shift Pay Calculator',
      description: 'Calculate multi-shift earnings across 1st, 2nd, and 3rd shifts',
      icon: 'CalendarClock',
    },
    {
      slug: 'overtime-calculator',
      title: 'Overtime Calculator',
      description: 'Compute overtime pay with FLSA blended regular rates',
      icon: 'Timer',
    },
    {
      slug: 'holiday-pay-calculator',
      title: 'Holiday Pay Calculator',
      description: 'Holiday premium rates at 1.5x or 2.0x base wage',
      icon: 'CalendarClock',
    },
    {
      slug: 'time-card-calculator-with-lunch',
      title: 'Time Card Calculator',
      description: 'Weekly timesheet calculator with automatic lunch deductions',
      icon: 'Clock',
    },
    {
      slug: 'salary-converter',
      title: 'Salary Converter',
      description: 'Convert hourly shift rates to annual, monthly, and weekly salary',
      icon: 'ArrowLeftRight',
    },
  ],
};

export default seoData;
