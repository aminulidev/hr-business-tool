const seoData = {
  breadcrumbs: [{ label: 'Calculators' }, { label: 'Shift Pay Calculator' }],
  tableOfContents: [
    { id: 'how-to-calculate', label: 'How to Calculate' },
    { id: 'formula', label: 'Formula & Shift Methods' },
    { id: 'worked-examples', label: 'Worked Examples' },
    { id: 'frequently-asked-questions', label: 'FAQs' },
    { id: 'statutory-sources', label: 'Statutory Sources' },
    { id: 'related-calculators', label: 'Related Calculators' },
  ],
  howToSteps: [
    'Enter your base hourly wage — the standard straight-time rate earned on 1st shift (day) before premiums.',
    'Input the hours worked across Day (1st shift), Swing (2nd shift / evening), and Night (3rd shift / graveyard).',
    'Choose your differential structure for each shift: Percentage (%) or Fixed Dollar addition ($/hr). Common industry rates: 5–10% or $1.50–$3.00/hr for swing; 10–15% or $2.50–$5.00/hr for night.',
    'Review the live per-shift effective rates displayed dynamically in the badge header of each shift block.',
    'Click "Calculate Shift Pay" to view total gross compensation, base pay versus shift differential premium, and blended effective hourly rate.',
    'If total hours exceed 40, check the FLSA Overtime Threshold alert to understand how differentials affect overtime rate calculations.',
  ],
  formula: 'Percentage Differential:\nShift Rate = Base Rate x (1 + Differential% / 100)\n\nFixed Dollar Differential:\nShift Rate = Base Rate + Fixed Differential ($/hr)\n\nTotal Gross Pay = (Day Rate x Day Hours) + (Swing Rate x Swing Hours) + (Night Rate x Night Hours)\nShift Premium Pay = Total Gross Pay - (Base Rate x Total Hours)',
  formulaDescription: 'Shift differential is extra compensation paid to employees working less desirable, non-standard hours (evenings, nights, weekends, or rotating schedules). Under the Fair Labor Standards Act (FLSA), shift premiums are treated as non-discretionary wage additions. Crucially, when an employee works overtime, their overtime rate must be computed using their "regular rate of pay"—a weighted average that incorporates shift differential earnings, rather than base pay alone.',
  workedExamples: [
    {
      title: 'Healthcare Registered Nurse (Fixed Dollar Differential)',
      description: 'An RN earns a base wage of $36.00/hr. In a biweekly pay period with three 12-hour shifts per week (36h/week), they work 24 hours day shift and 12 hours night shift with a flat +$4.50/hr night differential. Night rate = $36.00 + $4.50 = $40.50/hr. Day pay = 24 × $36.00 = $864.00. Night pay = 12 × $40.50 = $486.00. Weekly gross = $1,350.00. Over 52 weeks, the $4.50/hr differential produces an extra $2,808.00 in annual take-home pay.',
    },
    {
      title: 'Manufacturing Machine Operator (Percentage Differential)',
      description: 'A CNC operator earns $22.00/hr base rate and works a rotating schedule: 20 hours on day shift (0%), 12 hours on swing shift (+10%), and 8 hours on graveyard (+15%). Day pay = 20 × $22 = $440.00. Swing rate = $22 × 1.10 = $24.20/hr, yielding $290.40. Night rate = $22 × 1.15 = $25.30/hr, yielding $202.40. Total weekly earnings = $932.80. Base straight pay would be $880.00—the differentials add $52.80 in pure premium earnings.',
    },
    {
      title: 'Distribution Warehouse (Mixed Shifts with FLSA Overtime)',
      description: 'A forklift driver earning $20.00/hr works 50 hours in one week: 40 hours on day shift ($20.00/hr) and 10 hours on night shift (+$3.00/hr fixed differential = $23.00/hr). Straight time earnings = (40 × $20) + (10 × $23) = $800 + $230 = $1,030.00. Regular rate of pay = $1,030.00 ÷ 50 hours = $20.60/hr. Overtime premium (half-time on 10 OT hours) = 10 × ($20.60 × 0.5) = $103.00. Total gross wages = $1,030 + $103 = $1,133.00.',
    },
    {
      title: 'Emergency Dispatcher (Weekend & Swing Shift Stacking)',
      description: 'A 911 dispatcher earns $28.00/hr base. During high-call weekend swing shifts, the employer provides an 8% swing differential plus a $2.00/hr weekend bonus. Effective shift rate = ($28.00 × 1.08) + $2.00 = $30.24 + $2.00 = $32.24/hr. For a 12-hour weekend shift, total gross earnings are $386.88 versus the standard base pay of $336.00.',
    },
    {
      title: 'Utility Field Technician (Emergency Graveyard Shift)',
      description: 'A lineman earns $42.00/hr base. Scheduled for 16 emergency night restoration hours with a 20% graveyard differential: Night rate = $42.00 × 1.20 = $50.40/hr. Total pay for the 16 hours is $806.40, providing an extra $134.40 in shift differential compensation above straight time.',
    },
  ],
  faqs: [
    {
      question: 'What is the difference between percentage and fixed dollar shift differentials?',
      answer: 'A percentage differential multiplies your base wage by a set rate (e.g., 10% on a $25/hr wage adds $2.50/hr; on a $35/hr wage it adds $3.50/hr). A fixed dollar differential adds a flat monetary amount regardless of your base wage (e.g., +$3.00/hr for swing, +$5.00/hr for nights). Hospitals and collective bargaining agreements (unions) frequently favor fixed dollar differentials for pay equity across job classifications.',
    },
    {
      question: 'Does the Fair Labor Standards Act (FLSA) mandate shift differential pay?',
      answer: 'No. Federal law (FLSA 29 U.S.C. § 207) does not require employers to pay extra for evening, weekend, or holiday work. Shift differentials are contractual benefits governed by company policy, union collective bargaining agreements (CBAs), or select state regulations (such as California state hospital personnel under Welfare & Institutions Code 14685.5).',
    },
    {
      question: 'How do shift differentials affect overtime calculations?',
      answer: 'Under 29 C.F.R. § 778.207, shift differentials CANNOT be excluded from the employee\'s regular rate of pay. When an employee working shifts works more than 40 hours in a workweek, the employer must divide total straight-time compensation (including all shift differentials) by total hours worked to find the true "regular rate." Overtime hours are then paid at 1.5× this blended regular rate.',
    },
    {
      question: 'What are typical shift differential amounts across industries?',
      answer: 'Standard US industry ranges: 2nd shift (evening/swing, ~3 PM–11 PM) generally pays 5%–10% or $1.00–$2.50/hr extra. 3rd shift (night/graveyard, ~11 PM–7 AM) typically pays 10%–15% or $2.50–$5.00/hr extra. Specialized roles such as intensive care nurses or petroleum engineers may receive night differentials up to 20%–25% or $6.00–$10.00/hr.',
    },
    {
      question: 'Are shift differentials taxable on Form W-2?',
      answer: 'Yes. Shift differentials are considered supplemental earnings and are treated as standard gross taxable wages. They are subject to federal income tax withholding, state income tax, and FICA taxes (6.2% Social Security up to the wage cap + 1.45% Medicare, plus 0.9% Additional Medicare if applicable). They appear in Box 1 of your annual Form W-2.',
    },
    {
      question: 'Can shift differentials be combined with weekend and hazard pay?',
      answer: 'Yes, if authorized by employer policy or union contract. When premiums stack, some employers calculate percentages sequentially while others apply flat dollar amounts cumulatively. Under federal wage law, all non-discretionary differential premiums must be pooled into the regular rate when computing statutory overtime.',
    },
  ],
  relatedTools: [
    {
      slug: 'night-shift-differential-calculator',
      title: 'Night Shift Differential Calculator',
      description: 'Dedicated calculator for 6 PM to 6 AM graveyard hours',
      icon: 'Moon',
    },
    {
      slug: 'overtime-calculator',
      title: 'Overtime Calculator',
      description: 'Compute FLSA time-and-a-half and blended regular rates',
      icon: 'Timer',
    },
    {
      slug: 'time-and-a-half-calculator',
      title: 'Time and a Half Calculator',
      description: 'Quick 1.5x overtime wage calculation',
      icon: 'AlarmClock',
    },
    {
      slug: 'holiday-pay-calculator',
      title: 'Holiday Pay Calculator',
      description: 'Holiday premium rates at 1.5x or 2.0x base pay',
      icon: 'CalendarClock',
    },
    {
      slug: 'salary-converter',
      title: 'Salary Converter',
      description: 'Convert hourly shift rates to weekly, monthly, and annual earnings',
      icon: 'ArrowLeftRight',
    },
  ],
};

export default seoData;
