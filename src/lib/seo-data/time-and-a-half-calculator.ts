const seoData = {
  breadcrumbs: [{ label: 'Calculators' }, { label: 'Time-and-a-Half Calculator' }],
  tableOfContents: [
    { id: 'how-to-calculate', label: 'How to Calculate' },
    { id: 'formula', label: 'Formula' },
    { id: 'worked-examples', label: 'Worked Examples' },
    { id: 'frequently-asked-questions', label: 'FAQs' },
    { id: 'related-calculators', label: 'Related Calculators' },
  ],
  howToSteps: [
    'Enter your regular hourly rate — the amount you earn for each standard hour worked before any overtime premium applies.',
    'Enter the number of overtime hours you worked in the pay period. Under federal FLSA, any hours worked over 40 in a single workweek qualify for time-and-a-half pay.',
    'Optionally, enter any hours worked that qualify for double-time pay (2x your regular rate). Double-time is required in California for hours worked over 12 in a single day or over 8 on the 7th consecutive day of work.',
    'Click "Calculate" to see your regular pay, overtime pay at 1.5x rate, and total pay for the period.',
    'Review the worked examples below for common scenarios — including California daily overtime, FLSA weekly overtime, and double-time calculation.',
  ],
  formula: 'Overtime Pay Rate = Regular Hourly Rate × 1.5\nOvertime Pay = Overtime Hours × Overtime Pay Rate\nDouble-Time Pay = Double-Time Hours × Regular Rate × 2\nTotal Pay = (Regular Hours × Regular Rate) + Overtime Pay + Double-Time Pay',
  formulaDescription: "Time-and-a-half means you earn 1.5 times your regular hourly rate for every overtime hour worked. Under the federal Fair Labor Standards Act (FLSA), overtime is owed at 1.5x whenever a non-exempt employee works more than 40 hours in a single workweek. Some states (notably California, Alaska, Nevada, and Colorado) have stricter daily overtime rules that trigger overtime after 8 hours in a single day. California also requires double-time (2x regular rate) after 12 hours in a day or after 8 hours on the 7th consecutive day of work.",
  workedExamples: [
    { title: 'Standard FLSA Weekly Overtime', description: 'A warehouse worker earns $20/hour and works 48 hours in a single workweek. The 8 hours over 40 are paid at time-and-a-half: $20 × 1.5 = $30/hour. Regular pay = 40 × $20 = $800. Overtime pay = 8 × $30 = $240. Total pay = $1,040.' },
    { title: 'California Daily Overtime', description: 'A California employee earns $25/hour and works 10 hours in a single day. Under California law, hours worked over 8 in a day are paid at 1.5x: $25 × 1.5 = $37.50/hour. Regular pay = 8 × $25 = $200. Overtime pay = 2 × $37.50 = $75. Total pay for the day = $275.' },
    { title: 'California Double Time', description: 'A California healthcare worker earns $30/hour and works a 13-hour shift. Hours 1-8 = regular rate: 8 × $30 = $240. Hours 9-12 = time-and-a-half: 4 × $45 = $180. Hour 13 = double time: 1 × $60 = $60. Total pay for the day = $480.' },
    { title: 'Seventh Consecutive Day (California)', description: 'A retail worker in California earns $18/hour and works 7 consecutive days in a workweek. On the 7th day, the first 8 hours are paid at time-and-a-half ($27/hour) and any hours beyond 8 are paid at double time ($36/hour).' },
    { title: 'Bonus-Adjusted Overtime Rate', description: 'A non-exempt employee earns $22/hour base rate and receives a $200 non-discretionary production bonus for the week. Total non-overtime hours = 40, plus 6 overtime hours. The bonus must be allocated across all hours worked (46) to compute the regular rate: $200 / 46 = $4.35/hour additional. New regular rate = $22 + $4.35 = $26.35. Overtime rate = $26.35 × 1.5 = $39.53. The employer must recalculate overtime including the bonus — failure to do so is a wage-theft violation.' },
  ],
  faqs: [
    { question: 'What is time and a half?', answer: 'Time-and-a-half is overtime pay calculated at 1.5 times an employee\'s regular hourly rate. Under federal FLSA, employers must pay time-and-a-half for any hours worked over 40 in a single workweek by non-exempt employees. Some states have stricter daily overtime rules: California, Alaska, and Nevada require overtime after 8 hours in a day; Colorado requires it after 12 hours in a day.' },
    { question: 'Who is exempt from overtime pay?', answer: 'The FLSA exempts certain categories of employees: executive employees who manage the enterprise and direct the work of 2+ full-time employees (the "white-collar exemption"), administrative employees performing office/non-manual work directly related to management policies, professional employees requiring advanced specialized education (lawyers, doctors, architects, CPAs), computer professionals earning at least $684/week on a salary basis, and outside sales employees regularly working away from the employer\'s premises.' },
    { question: 'What is the difference between state and federal overtime rules?', answer: 'Federal FLSA requires overtime only after 40 hours in a workweek. State rules may be stricter: California requires daily overtime after 8 hours in a day AND weekly overtime after 40 hours AND double-time after 12 hours in a day or after 8 hours on the 7th consecutive day. When both federal and state law apply, the employer must follow whichever is more favorable to the employee.' },
    { question: 'Does overtime count toward the next workweek?', answer: 'No — overtime is calculated per workweek and cannot be carried over. A workweek is a fixed, recurring 168-hour period (7 consecutive 24-hour days) that the employer establishes. If an employee works 50 hours in week 1 and 30 hours in week 2, the employer owes 10 hours of overtime for week 1 — they cannot "average" the two weeks to avoid overtime. Compensatory time off ("comp time") in lieu of overtime pay is also not allowed for private-sector non-exempt employees.' },
    { question: 'How is overtime calculated when I earn bonuses or commissions?', answer: 'Non-discretionary bonuses (those tied to performance, productivity, attendance, or quality metrics) must be included in the regular rate of pay used to calculate overtime. The bonus is allocated across all hours worked in the bonus period, added to the base rate, and the new total is multiplied by 1.5 for overtime hours. This calculation must be done for each bonus period. If a quarterly bonus is paid, the employer must retroactively recalculate overtime for the entire quarter and pay any shortfall.' },
    { question: 'What is the difference between time-and-a-half and double time?', answer: 'Time-and-a-half is 1.5x the regular rate; double time is 2x the regular rate. Federal FLSA only requires time-and-a-half (no federal double-time requirement). California requires double time for hours worked over 12 in a single day, or over 8 hours on the 7th consecutive day in a workweek. Some union contracts or employer policies also specify double-time for holidays or for hours worked over 10 in a day.' },
    { question: 'Can my employer pay me comp time instead of overtime?', answer: 'For private-sector non-exempt employees, NO — compensatory time off ("comp time") in lieu of cash overtime pay is prohibited by FLSA. The employer must pay overtime in cash on the regular payday for the period in which the overtime was worked. Public-sector (government) employees can accrue comp time under specific FLSA Section 7(o) agreements.' },
    { question: 'What happens if my employer does not pay overtime?', answer: 'If your employer fails to pay required overtime, you can: (1) File a wage claim with your state labor agency. (2) File a complaint with the U.S. Department of Labor Wage and Hour Division (WHD) at 1-866-4-US-WAGE. (3) Hire a private employment lawyer to file a lawsuit under FLSA Section 16(b), which allows recovery of 2x the unpaid overtime ("liquidated damages") plus attorney fees. FLSA has a 2-year statute of limitations (3 years for willful violations).' },
  ],
  relatedTools: [
    { slug: 'overtime-calculator', title: 'Overtime Calculator', description: 'Full overtime calculation with state rules', icon: 'Timer' },
    { slug: 'hourly-paycheck-calculator', title: 'Hourly Paycheck Calculator', description: 'Net take-home after taxes and OT', icon: 'Wallet' },
    { slug: 'wages-calculator', title: 'Wages Calculator', description: 'Hourly to annual wage conversion', icon: 'Banknote' },
    { slug: 'time-card-calculator-with-lunch', title: 'Time Card Calculator with Lunch', description: 'Weekly timesheet with overtime', icon: 'Clock' },
    { slug: 'payroll-calculator', title: 'Payroll Calculator', description: 'Employer-side payroll calculation', icon: 'CreditCard' },
  ],
};
export default seoData;
