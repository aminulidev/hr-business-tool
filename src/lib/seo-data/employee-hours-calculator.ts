const seoData = {
  breadcrumbs: [{ label: 'Calculators' }, { label: 'Employee Hours Calculator' }],
  tableOfContents: [
    { id: 'how-to-calculate', label: 'How to Calculate' },
    { id: 'formula', label: 'Team Payroll & Labor Formulas' },
    { id: 'worked-examples', label: 'Team Worked Scenarios' },
    { id: 'frequently-asked-questions', label: 'Frequently Asked Questions' },
    { id: 'related-calculators', label: 'Related Payroll & HR Calculators' },
  ],
  howToSteps: [
    'Quick-load a pre-configured team template (Office Staff, Construction Crew, or Healthcare Shift Workers) or click "+ Add Employee" to build a custom roster.',
    'Enter each employee\'s name, department or role, regular hours (up to 40.0), overtime hours (1.5x), double-time hours (2.0x), and base hourly wage rate.',
    'Optionally adjust the "Employer Tax Load" percentage (default 10.0% covers 7.65% employer FICA match plus federal/state unemployment and workers comp) to view true labor costs.',
    'Click "Calculate Total Payroll" to generate the team-wide labor summary, regular vs premium pay breakdown, and individual employee stacked bar chart.',
    'Click "Copy Summary" or "Export CSV" to download an audit-ready payroll timesheet formatted for import into payroll software (Gusto, ADP, QuickBooks, Paychex).',
  ],
  formula: 'Regular Pay = Regular Hours x Hourly Wage Rate\nOvertime Pay = Overtime Hours x Hourly Wage Rate x 1.5\nDouble Time Pay = Double Time Hours x Hourly Wage Rate x 2.0\nEmployee Gross Pay = Regular Pay + Overtime Pay + Double Time Pay\nTotal Team Gross Payroll = sum(Employee Gross Pay)\nEmployer Payroll Taxes = Total Team Gross Payroll x Employer Tax Load %\nTotal Employer Labor Cost = Total Team Gross Payroll + Employer Payroll Taxes',
  formulaDescription: 'Under federal Fair Labor Standards Act (FLSA) regulations (29 U.S.C. § 207), non-exempt employees must receive overtime compensation at not less than 1.5 times their regular rate for hours worked in excess of 40 in a single workweek. Certain jurisdictions, such as California (Labor Code § 510), require double-time (2.0x) for hours worked in excess of 12 on any workday or beyond 8 hours on the seventh consecutive day of work. For employers, the true cost of payroll includes statutory employer-side taxes: 6.2% Social Security (up to $176,100 in 2026), 1.45% Medicare (uncapped), Federal Unemployment Tax (FUTA), State Unemployment Insurance (SUTA), and mandatory Workers\' Compensation premiums.',
  workedExamples: [
    {
      title: 'Small Business Office Staff (4 Employees)',
      description: 'An accounting and administrative firm tracks weekly payroll for 4 staff members: Alice (Operations: 40h reg, 0h OT @ $28/hr = $1,120), Bob (Logistics: 40h reg, 6.5h OT @ $24.50/hr = $980 reg + $238.88 OT = $1,218.88), Carol (Customer Care: 35h reg, 0h OT @ $21/hr = $735), and David (Operations: 40h reg, 10h OT, 2h DT @ $32/hr = $1,280 reg + $480 OT + $128 DT = $1,888). Total team hours equal 173.5 hours. Gross payroll is $4,961.88. Factoring in a 10% employer tax load ($496.19), the firm\'s total weekly labor expense is $5,458.07.',
    },
    {
      title: 'Construction Crew with Weekend Double-Time',
      description: 'A commercial framing subcontractor manages a 4-man crew on a deadline push: Foreman Mike (40h reg, 12h OT, 4h DT @ $34/hr = $1,360 + $612 + $272 = $2,244), Framer Leo (40h reg, 10h OT, 2h DT @ $30/hr = $1,200 + $450 + $120 = $1,770), Electrician Sarah (40h reg, 8h OT @ $38.50/hr = $1,540 + $462 = $2,002), and Laborer Chris (40h reg, 14h OT, 5h DT @ $25/hr = $1,000 + $525 + $250 = $1,775). Across 219 total hours, gross pay equals $7,791.00 ($5,100 regular base + $2,691 premium pay). Employer overhead at 12% (including high-risk workers comp) adds $934.92, for a total employer outlay of $8,725.92.',
    },
    {
      title: 'Hospital Emergency Department Nursing Shift',
      description: 'A 24-hour medical ward logs weekly hours for 3 specialized staff on 12-hour shifts: Nurse Emma (ICU: 36h reg, 8h OT, 4h DT @ $48/hr = $1,728 + $576 + $384 = $2,688), Nurse Daniel (ER: 36h reg, 12h OT, 2h DT @ $46.50/hr = $1,674 + $837 + $186 = $2,697), and Tech Liam (Radiology: 40h reg, 4h OT @ $31/hr = $1,240 + $186 = $1,426). Total team hours are 142.0 hours. Gross payroll is $6,811.00. The hospital projects monthly labor costs by multiplying weekly outlay ($7,492.10 including 10% benefits/taxes) by 4.3333 weeks = $32,465.52.',
    },
    {
      title: 'Restaurant Kitchen Staff (Salaried Exempt vs Hourly Non-Exempt)',
      description: 'A restaurant employs 1 head chef (salaried exempt at $1,200/week, working 52h with $0 OT under FLSA executive exemption) and 3 line cooks paid hourly non-exempt ($19.00/hr, each working 46h = 40h reg + 6h OT = $760 + $171 = $931 each). Hourly cook gross equals $2,793.00. Combining chef salary ($1,200) and cooks ($2,793) gives total kitchen wages of $3,993.00, demonstrating proper payroll classification between exempt and non-exempt crew.',
    },
    {
      title: 'Retail Store Holiday Extended Hours Staffing',
      description: 'During Black Friday week, a retail shop adds seasonal staff: 2 full-time keyholders (40h reg + 10h OT each @ $22/hr = $1,210 each = $2,420) and 4 part-time floor associates (25h reg each @ $16/hr = $400 each = $1,600). Total gross payroll is $4,020 for 6 employees across 200 total worker-hours. The average fully loaded labor cost per worker-hour equals ($4,020 + 10% tax) ÷ 200 hours = $22.11/hour.',
    },
    {
      title: 'Mixed Pay Rate Overtime Blended Calculation',
      description: 'An employee performs two roles in the same workweek: 25 hours as a machine operator at $24.00/hr ($600) and 20 hours as a maintenance specialist at $30.00/hr ($600). Total hours = 45 (5 hours OT). Under FLSA weighted average rules, total straight-time pay is $1,200 ÷ 45h = $26.67/hr regular rate. Overtime premium is 5 hours x ($26.67 x 0.5) = $66.68. Total gross earnings are $1,266.68, demonstrating compliance with 29 CFR § 778.115.',
    },
  ],
  faqs: [
    {
      question: 'How do you calculate gross payroll for multiple employees?',
      answer: 'To calculate team payroll: (1) for each individual employee, calculate regular pay by multiplying regular hours (up to 40) by their hourly wage; (2) calculate overtime pay by multiplying overtime hours by 1.5 times the hourly wage; (3) calculate double-time pay (if applicable) by multiplying double-time hours by 2.0 times the wage; (4) sum regular, overtime, and double-time earnings to determine each worker\'s gross pay; and (5) add together the gross pay of all employees to obtain total company gross payroll for the period.',
    },
    {
      question: 'What is the employer payroll tax burden on top of gross wages?',
      answer: 'Gross wages represent what employees earn, but employers must pay statutory taxes in addition to employee wages: (1) Employer Social Security tax of 6.2% on wages up to $176,100 (2026 limit); (2) Employer Medicare tax of 1.45% uncapped (total mandatory FICA match = 7.65%); (3) Federal Unemployment Tax (FUTA) of 0.6% on the first $7,000 per employee; (4) State Unemployment Insurance (SUTA), typically ranging from 1% to 8% depending on company claims history; and (5) Workers\' Compensation insurance. Typically, employer payroll overhead adds 9% to 15%+ to gross labor costs.',
    },
    {
      question: 'When is double-time (2.0x) legally mandatory for employees?',
      answer: 'Under federal FLSA law, double-time is never mandated—only 1.5x overtime is required for hours over 40 per week. However, double-time is legally required under California Labor Code § 510 for: (1) all hours worked beyond 12 in a single workday, and (2) all hours worked beyond 8 on the seventh consecutive workday of a workweek. Double-time is also commonly mandated by union collective bargaining agreements (CBAs) for holiday shifts, Sundays, or emergency call-outs in healthcare, utilities, and construction.',
    },
    {
      question: 'What is the difference between non-exempt and exempt employees for payroll?',
      answer: 'Non-exempt employees are covered by FLSA overtime requirements and must receive 1.5 times their regular hourly rate for all hours worked over 40 in a workweek. Exempt employees (executive, administrative, professional, computer, and outside sales employees) receive a fixed salary regardless of how many hours they work and are exempt from overtime. To qualify as exempt, the employee must pass the duties test and be paid a salary exceeding the statutory federal threshold ($844/week or $43,888/year in 2024, subject to federal updates).',
    },
    {
      question: 'How does overtime work if an employee works at two different hourly rates?',
      answer: 'Under 29 CFR § 778.115, when an employee in a single workweek performs two or more different types of work for which different hourly rates have been established, their regular rate for that week is the weighted average. Divide total earnings from all rates at straight time by total hours worked. Overtime is paid at one-half (0.5x) the weighted average rate for all hours over 40, added to straight-time pay. Alternatively, if agreed prior to the work, overtime may be calculated at 1.5x the rate in effect during the overtime hours.',
    },
    {
      question: 'Can employers round employee hours across the team?',
      answer: 'Yes, under 29 CFR § 785.48(b), employers may utilize 15-minute rounding under the 7/8 minute rule: clock-in/out times between 1 and 7 minutes past the quarter hour round down, and times between 8 and 14 minutes round up. However, rounding must be applied impartially: an employer cannot round clock-ins forward (to disadvantage the employee) while rounding clock-outs backward. Unequal rounding that consistently shaves employee time violates federal law and triggers back-wage liabilities.',
    },
    {
      question: 'How can I import these employee hours into ADP, Gusto, or QuickBooks?',
      answer: 'Most modern payroll systems allow bulk timesheet imports using standard CSV (Comma-Separated Values) spreadsheets. Click the "Export CSV" button in this calculator to download an audit-ready file listing Employee Name, Department, Regular Hours, Overtime Hours, Double-Time Hours, Hourly Rate, and Total Gross Pay. You can upload this file directly into Gusto, QuickBooks Online Payroll, or ADP Workforce Now timesheet import tools.',
    },
    {
      question: 'How long must employers retain weekly employee time records?',
      answer: 'Under FLSA recordkeeping regulations (29 CFR Part 516), employers must retain basic employee time and earning cards or clock sheets for at least 2 years. Primary payroll records—including employee names, addresses, social security numbers, occupations, hours worked each day, total weekly hours, straight-time earnings, overtime premiums, and total gross pay—must be kept for a minimum of 3 years. Several states require longer retention (e.g. 4 years in California, 6 years in New York).',
    },
  ],
  relatedTools: [
    { slug: 'work-hours-calculator', title: 'Work Hours Calculator', description: 'Single-employee weekly clock-in/out tracker with break deductions', icon: 'Clock' },
    { slug: 'payroll-calculator', title: 'Payroll Tax Calculator', description: 'Calculate employee net take-home pay after federal, state, and FICA taxes', icon: 'CreditCard' },
    { slug: 'payroll-hours-calculator', title: 'Payroll Hours Calculator', description: 'Convert time-card hours and minutes into gross payroll paychecks', icon: 'Banknote' },
    { slug: 'overtime-calculator', title: 'Overtime Calculator', description: 'California daily OT and FLSA weekly overtime calculations', icon: 'Timer' },
    { slug: 'double-time-calculator', title: 'Double Time Calculator', description: 'California 2.0x double-time and 7th-consecutive-day premium wages', icon: 'Clock' },
    { slug: 'shift-pay-calculator', title: 'Shift Pay Calculator', description: 'Hourly pay calculations with night, weekend, and hazard shift differentials', icon: 'SunMedium' },
  ],
};

export default seoData;
