const seoData = {
  breadcrumbs: [{ label: 'Calculators' }, { label: 'Holiday Pay Calculator' }],
  tableOfContents: [
    { id: 'how-to-calculate', label: 'How to Calculate' },
    { id: 'formula', label: 'Formula & Multipliers' },
    { id: 'worked-examples', label: 'Worked Examples' },
    { id: 'frequently-asked-questions', label: 'FAQs' },
    { id: 'statutory-sources', label: 'Statutory Sources' },
    { id: 'related-calculators', label: 'Related Calculators' },
  ],
  howToSteps: [
    'Enter your base hourly wage — the standard straight-time rate earned before holiday premiums.',
    'Select your holiday multiplier from the preset list (1.25×, 1.5× time-and-a-half, 2.0× double-time, 2.5×, 3.0×) or choose "Custom Multiplier" to enter a specific contract rate.',
    'Enter the hours worked on the calendar holiday itself.',
    'Input regular non-holiday hours worked during the remainder of the same workweek.',
    'Click "Calculate Holiday Pay" to see your regular pay, holiday straight base, extra holiday premium, and total gross earnings.',
    'If total hours exceed 40, check the FLSA Overtime Threshold alert to understand how holiday premiums interact with statutory 1.5× overtime.',
  ],
  formula: 'Holiday Hourly Rate = Base Hourly Rate x Holiday Multiplier\nHoliday Pay = Holiday Hourly Rate x Holiday Hours\nHoliday Premium Bonus = Holiday Pay - (Base Hourly Rate x Holiday Hours)\nTotal Workweek Gross Earnings = (Base Hourly Rate x Regular Non-Holiday Hours) + Holiday Pay',
  formulaDescription: 'Holiday pay is premium compensation paid to employees required to work on recognized federal, state, or company holidays (such as Thanksgiving, Christmas, Memorial Day, or Labor Day). While the federal Fair Labor Standards Act (FLSA 29 U.S.C. § 207) does not mandate premium pay for holiday work, employers commonly provide 1.5× (time-and-a-half) or 2.0× (double-time) through company policy or union collective bargaining agreements (CBAs).',
  workedExamples: [
    {
      title: 'Retail Associate on Thanksgiving (Time-and-a-Half)',
      description: 'A retail cashier earns $16.50/hr base rate. Working an 8-hour shift on Thanksgiving at a 1.5× holiday rate: Holiday rate = $16.50 × 1.5 = $24.75/hr. Holiday pay = 8 × $24.75 = $198.00. For the rest of the week, they work 32 regular hours ($16.50 × 32 = $528.00). Total weekly gross pay is $726.00 for 40 hours, representing a $66.00 holiday premium bonus over standard straight time.',
    },
    {
      title: 'Hospital ICU Nurse on Christmas Day (Double-Time)',
      description: 'A critical care nurse earns $42.00/hr base. Hospital policy provides double-time (2.0×) for major winter holidays. Working a 12-hour shift on Christmas Day: Holiday rate = $42.00 × 2.0 = $84.00/hr. Holiday pay = 12 × $84.00 = $1,008.00. Adding two standard 12-hour shifts (24 regular hours = $1,008.00) brings weekly gross compensation to $2,016.00 for 36 hours worked—an extra $504.00 in holiday bonus pay.',
    },
    {
      title: 'Hotel Operations on July 4th with Overtime Interaction',
      description: 'A hospitality worker earning $18.00/hr works 10 hours on Independence Day at 1.5× ($27.00/hr = $270.00) plus 38 regular daytime hours ($18.00 × 38 = $684.00), totaling 48 workweek hours. Because total hours exceed 40 by 8 hours, FLSA overtime rules apply. Under FLSA Section 7(e)(6), holiday premium pay (the extra 0.5×) can be credited toward statutory overtime, yielding $954.00 straight compensation plus applicable overtime adjustments.',
    },
    {
      title: 'Municipal Police Officer on New Year\'s Eve (Triple-Time CBA)',
      description: 'A senior patrol officer earns $34.00/hr base. Under the city union contract, officers scheduled on New Year\'s Eve earn 3.0× (triple-time). For an 8-hour overnight shift: Holiday rate = $34.00 × 3 = $102.00/hr. Total holiday earnings for the single shift are $816.00 versus $272.00 straight pay—generating a $544.00 holiday bonus premium.',
    },
    {
      title: 'Distribution Warehouse on Labor Day (Double-and-a-Half)',
      description: 'A logistics technician earns $22.00/hr. The facility operates continuously and compensates Labor Day hours at 2.5× ($55.00/hr). For an 8-hour shift, holiday earnings equal $440.00. Combined with 32 regular hours ($704.00), total weekly earnings reach $1,144.00 for a standard 40-hour schedule.',
    },
  ],
  faqs: [
    {
      question: 'Is holiday pay mandatory under federal law?',
      answer: 'No. The Fair Labor Standards Act (FLSA) does not require employers to provide paid holidays or pay extra for work performed on holidays, Saturdays, or Sundays. Holiday premium pay (such as 1.5× or 2.0×) is an optional contractual benefit established by company policy, employment contracts, or union collective bargaining agreements.',
    },
    {
      question: 'What are the 11 official US federal holidays?',
      answer: 'Under 5 U.S.C. § 6103, federal holidays are: New Year\'s Day (Jan 1), Martin Luther King Jr. Day (3rd Mon Jan), Washington\'s Birthday (3rd Mon Feb), Memorial Day (last Mon May), Juneteenth National Independence Day (Jun 19), Independence Day (Jul 4), Labor Day (1st Mon Sep), Columbus Day (2nd Mon Oct), Veterans Day (Nov 11), Thanksgiving Day (4th Thu Nov), and Christmas Day (Dec 25). Federal employees receive paid time off or statutory premium rates.',
    },
    {
      question: 'Do any states require holiday premium pay for private employees?',
      answer: 'Massachusetts is the primary exception under its "Blue Laws," historically requiring certain retail and commercial employers to pay premium rates (1.5×) on specific recognized holidays like Memorial Day, Independence Day, and Labor Day. Rhode Island also mandates 1.5× for Sundays and holidays in certain commercial and industrial occupations. In all other states, holiday pay follows employer policy.',
    },
    {
      question: 'How do holiday hours interact with 40-hour weekly overtime thresholds?',
      answer: 'Actual hours worked on a holiday count toward the statutory 40-hour weekly overtime threshold. However, unworked paid holiday hours (such as 8 hours of holiday pay when the office is closed) do not count as hours worked for FLSA overtime calculations. Under FLSA Section 7(e)(6), contractual premium pay of at least 1.5× for holiday work may be credited toward statutory overtime pay obligations.',
    },
    {
      question: 'What is the difference between "Paid Holiday Off" and "Holiday Premium Pay"?',
      answer: '"Paid Holiday Off" means an employee receives their regular salary or wages for the holiday without working (e.g. 8 hours of holiday pay). "Holiday Premium Pay" refers to an elevated wage rate (such as 1.5× or 2.0×) paid to employees who physically work their shift on the calendar holiday. Some generous employers offer both—paying regular straight pay for the holiday plus 1.5× for hours worked (effectively 2.5×).',
    },
    {
      question: 'Are holiday wages and bonuses subject to payroll taxes?',
      answer: 'Yes. All holiday pay and premium earnings are treated as regular taxable compensation. They are subject to federal income tax withholding, state income tax, and FICA payroll taxes (6.2% Social Security up to the annual wage base + 1.45% Medicare, plus 0.9% Additional Medicare where applicable). They are reported in Box 1 on IRS Form W-2.',
    },
  ],
  relatedTools: [
    {
      slug: 'overtime-calculator',
      title: 'Overtime Calculator',
      description: 'Compute FLSA 1.5x overtime and blended regular rates',
      icon: 'Timer',
    },
    {
      slug: 'double-time-calculator',
      title: 'Double Time Calculator',
      description: 'Calculate 2.0x premium wage rates and earnings',
      icon: 'Timer',
    },
    {
      slug: 'time-and-a-half-calculator',
      title: 'Time and a Half Calculator',
      description: 'Quick 1.5x wage calculator for holiday and overtime hours',
      icon: 'AlarmClock',
    },
    {
      slug: 'shift-pay-calculator',
      title: 'Shift Pay Calculator',
      description: 'Calculate differential earnings across day, swing, and night shifts',
      icon: 'CalendarClock',
    },
    {
      slug: 'salary-converter',
      title: 'Salary Converter',
      description: 'Convert hourly holiday earnings to weekly, monthly, and annual wages',
      icon: 'ArrowLeftRight',
    },
  ],
};

export default seoData;
