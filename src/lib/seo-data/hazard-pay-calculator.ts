const seoData = {
  breadcrumbs: [{ label: 'Calculators' }, { label: 'Hazard Pay Calculator' }],
  tableOfContents: [
    { id: 'how-to-calculate', label: 'How to Calculate' },
    { id: 'formula', label: 'Formula & Compensation Models' },
    { id: 'worked-examples', label: 'Worked Examples' },
    { id: 'frequently-asked-questions', label: 'FAQs' },
    { id: 'statutory-sources', label: 'Statutory Sources' },
    { id: 'related-calculators', label: 'Related Calculators' },
  ],
  howToSteps: [
    'Enter your base hourly wage — your standard straight-time compensation rate before hazard premiums.',
    'Enter the number of hours worked under hazardous duty or dangerous workplace conditions during the pay period.',
    'Optionally, enter standard safe hours worked in the same workweek to compute total blended gross compensation.',
    'Select your hazard compensation method: Percentage Premium (% of base), Hourly Flat Add-On ($/hr), or Fixed Periodic Stipend ($).',
    'Input the corresponding premium value (e.g. 15% percentage addition, +$3.50/hr flat rate, or $250 weekly allowance).',
    'Click "Calculate Hazard Pay" to view regular wages, hazard duty premium bonus, effective hazard rate, and total gross earnings.',
    'If total weekly hours exceed 40, check the FLSA Overtime Threshold alert to understand how non-discretionary hazard pay affects 1.5× regular rate overtime.',
  ],
  formula: 'Method 1: Percentage Premium\nHazard Hourly Rate = Base Hourly Rate x (1 + Hazard% / 100)\nHazard Duty Premium = (Base Hourly Rate x Hazard% / 100) x Hazardous Hours\n\nMethod 2: Hourly Flat Add-On\nHazard Hourly Rate = Base Hourly Rate + Hourly Hazard Premium ($/hr)\nHazard Duty Premium = Hourly Hazard Premium x Hazardous Hours\n\nMethod 3: Fixed Periodic Stipend\nHazard Duty Premium = Flat Stipend Amount\n\nTotal Workweek Compensation:\nTotal Gross Pay = (Base Rate x Standard Hours) + (Base Rate x Hazardous Hours) + Hazard Duty Premium',
  formulaDescription: 'Hazard pay represents supplemental compensation paid to employees performing duties involving physical hardship, environmental toxicity, infectious disease exposure, or severe workplace danger. Under the Fair Labor Standards Act (FLSA 29 U.S.C. § 207), private employers are not federally required to offer hazard pay. However, when an employer or collective bargaining agreement (CBA) provides hazard pay for hours worked, federal law (29 C.F.R. § 778.207) mandates that all hazard premiums must be incorporated into the employee\'s "regular rate of pay" when computing 1.5× overtime.',
  workedExamples: [
    {
      title: 'Healthcare ICU Nurse (Infectious Disease Percentage Premium)',
      description: 'A registered critical care nurse earns $38.00/hr base rate and works 36 hours in an infectious disease isolation unit with a 15% hazard premium. Hazardous hourly rate = $38.00 × 1.15 = $43.70/hr. Total weekly gross wages = 36 × $43.70 = $1,573.20. Standard straight pay would be $1,368.00; the 15% hazard differential delivers an extra $205.20 in weekly danger compensation ($10,670.40 annually).',
    },
    {
      title: 'Offshore Petroleum Drilling Tech (Hourly Flat Add-On)',
      description: 'An offshore oil rig technician earns $32.00/hr straight time plus a flat +$5.00/hr hazard duty add-on for open-ocean platform operations. Effective hazard rate = $32.00 + $5.00 = $37.00/hr. In a 40-hour workweek on the rig: Gross earnings = 40 × $37.00 = $1,480.00, generating a $200.00 weekly hazard premium.',
    },
    {
      title: 'Chemical Manufacturing Technician with Mixed Hours & FLSA Overtime',
      description: 'A chemical plant operator earning $25.00/hr works 48 total hours: 30 hazardous hours with a +$4.00/hr premium ($29.00/hr = $870.00) plus 18 standard safe facility hours ($25.00/hr = $450.00). Total straight-time earnings = $870 + $450 = $1,320.00. Blended regular rate = $1,320 ÷ 48h = $27.50/hr. Overtime premium (half-time for 8 OT hours) = 8 × ($27.50 × 0.5) = $110.00. Total gross wages = $1,320 + $110 = $1,430.00.',
    },
    {
      title: 'Nuclear Facility Remediation (Fixed Weekly Radiation Stipend)',
      description: 'A radiation safety technician earns $40.00/hr and receives a contractual $300.00 weekly environmental hazard stipend during reactor vessel decontamination. For 40 hours worked: Base wages = 40 × $40.00 = $1,600.00. Adding the $300.00 stipend produces total weekly gross earnings of $1,900.00, yielding an effective hourly compensation rate of $47.50/hr.',
    },
    {
      title: 'Commercial High-Angle Ironworker (Height Hazard Premium)',
      description: 'A structural ironworker earns $35.00/hr base rate. The union collective bargaining agreement mandates a 20% hazard premium for all hours worked on scaffolding or beams exceeding 100 feet. In a workweek with 24 hours of high-altitude erection ($35 × 1.20 = $42.00/hr = $1,008.00) and 16 ground fabrication hours ($35 × 16 = $560.00), total weekly earnings equal $1,568.00.',
    },
  ],
  faqs: [
    {
      question: 'Is hazard pay mandated under federal labor law?',
      answer: 'No. The Fair Labor Standards Act (FLSA 29 U.S.C. § 207) does not require private-sector employers to provide hazard pay. Employers may choose to offer hazard pay voluntarily, or it may be established through union collective bargaining agreements (CBAs) or employment contracts. For federal government employees, hazard duty pay is authorized under 5 U.S.C. § 5545(d) and 5 C.F.R. § 550.901–907.',
    },
    {
      question: 'What types of workplace conditions typically qualify for hazard pay?',
      answer: 'Common hazardous duty categories include: (1) Toxic chemical and asbestos remediation; (2) Extreme height work (scaffolding, structural steel, communications towers); (3) Deep underground mining and tunneling; (4) High-voltage electrical power grid restoration; (5) Infectious disease healthcare units; (6) Extreme temperature or offshore ocean environments; and (7) Active combat and civil conflict zones.',
    },
    {
      question: 'How does hazard pay affect overtime calculations under the FLSA?',
      answer: 'Under 29 C.F.R. § 778.207, hazard pay paid for hours worked represents non-discretionary compensation and CANNOT be excluded from an employee\'s "regular rate of pay." If a worker performs hazardous duties and exceeds 40 hours in a workweek, total straight-time pay (including hazard premiums) must be divided by total hours worked to establish the true regular rate. Overtime hours must then be compensated at 1.5× this blended regular rate.',
    },
    {
      question: 'What are typical hazard pay percentages and hourly add-ons in the US?',
      answer: 'Typical private-sector benchmarks: (1) Moderate Hazard: 5%–10% or $1.50–$3.00/hr extra (confined spaces, basic chemical handling); (2) High Hazard: 15%–20% or $3.50–$6.00/hr extra (severe heights, high-risk healthcare, offshore platforms); (3) Extreme Hazard: 25% or $7.00–$15.00+/hr extra (demolition, radiation remediation, combat or deep diving). In the federal schedule (5 C.F.R. § 550.904), statutory differentials range from 4% to 25%.',
    },
    {
      question: 'Is hazard pay taxable on IRS Form W-2?',
      answer: 'Yes. For civilian employees in both private and public sectors, hazard pay is treated as regular earned income. It is fully subject to federal income tax withholding, state income tax, and FICA payroll taxes (6.2% Social Security + 1.45% Medicare). The sole primary exception is military combat zone tax exclusion (CZTE) under Internal Revenue Code 26 U.S.C. § 112, which exempts qualifying military combat earnings.',
    },
    {
      question: 'Can employers cancel or revoke hazard pay?',
      answer: 'Unless guaranteed by an active union collective bargaining agreement, individual employment contract, or state emergency proclamation, private employers generally have the legal discretion to initiate, alter, or terminate voluntary hazard pay policies when working conditions normalize, provided that worked hours are compensated as promised.',
    },
  ],
  relatedTools: [
    {
      slug: 'shift-pay-calculator',
      title: 'Shift Pay Calculator',
      description: 'Calculate differential earnings across 1st, 2nd, and 3rd shifts',
      icon: 'CalendarClock',
    },
    {
      slug: 'night-shift-differential-calculator',
      title: 'Night Shift Differential Calculator',
      description: 'Calculate supplemental pay for graveyard hours (6 PM to 6 AM)',
      icon: 'Moon',
    },
    {
      slug: 'overtime-calculator',
      title: 'Overtime Calculator',
      description: 'Compute FLSA statutory overtime with blended regular rates',
      icon: 'Timer',
    },
    {
      slug: 'double-time-calculator',
      title: 'Double Time Calculator',
      description: 'Calculate 2.0x premium wage rates under California Labor Code 510',
      icon: 'Zap',
    },
    {
      slug: 'workers-comp-calculator',
      title: 'Workers Comp Calculator',
      description: 'Estimate workers compensation insurance premiums for dangerous roles',
      icon: 'Shield',
    },
  ],
};

export default seoData;
