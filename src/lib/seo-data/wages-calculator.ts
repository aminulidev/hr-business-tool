export const wagesSEOData = {
  howToSteps: [
    'Enter your hourly rate and the number of regular hours you work per week in the first row. This is your standard pay at the base rate.',
    'Optionally, enter any overtime hours (hours worked beyond the regular schedule) and double-time hours. The default multipliers are 1.5x for overtime and 2x for double-time.',
    'If you have multiple hourly rates — for example, different shifts or roles — click "Add Rate Row" to add additional entries. Each row can have its own rate and hours.',
    'Select your pay period (weekly, bi-weekly, semi-monthly, or monthly) to see wages converted to per-period, monthly, and annual equivalents.',
    'Click "Calculate Wages" to see a detailed breakdown of regular pay, overtime pay, double-time pay, and equivalent earnings across all pay periods.',
  ],
  formula: 'Gross Wages = (Regular Hours × Rate) + (OT Hours × Rate × OT Multiplier) + (DT Hours × Rate × DT Multiplier)',
  formulaDescription: 'Your gross wages are the sum of pay from all work categories: regular hours at the base rate, overtime hours at a premium multiplier (typically 1.5x by federal law), and double-time hours at an even higher multiplier (typically 2x, required in some states for hours worked beyond a daily threshold). Each pay category is calculated independently and summed to arrive at total gross wages per pay period. To convert to annual wages, multiply the per-period amount by the number of pay periods per year (52 for weekly, 26 for bi-weekly, 24 for semi-monthly, and 12 for monthly).',
  workedExamples: [
    {
      title: 'Standard 40-Hour Week at $25/hr',
      description: 'An employee earning $25.00 per hour works 40 regular hours with no overtime. Regular pay = 40 × $25.00 = $1,000.00. With weekly pay periods (52 per year), the annual wages are $1,000.00 × 52 = $52,000.00. The equivalent monthly gross is $4,333.33 and bi-weekly gross is $2,000.00.',
    },
    {
      title: '50-Hour Week with Overtime at $30/hr',
      description: 'An employee earning $30.00 per hour works 40 regular hours plus 10 overtime hours at 1.5x. Regular pay = 40 × $30.00 = $1,200.00. Overtime pay = 10 × $30.00 × 1.5 = $450.00. Total weekly gross = $1,650.00. Annual wages (52 weeks) = $1,650.00 × 52 = $85,800.00. The overtime premium alone contributes $23,400.00 per year in additional earnings.',
    },
    {
      title: 'Multiple Rates: Day Shift + Night Shift',
      description: 'An employee works two shifts per week: 20 hours at $20/hr (day shift) and 25 hours at $28/hr (night shift, including 5 overtime hours at 1.5x). Day shift pay = 20 × $20.00 = $400.00. Night shift regular = 20 × $28.00 = $560.00. Night shift overtime = 5 × $28.00 × 1.5 = $210.00. Total weekly gross = $400.00 + $560.00 + $210.00 = $1,170.00. Annual wages = $1,170.00 × 52 = $60,840.00.',
    },
  ],
  faqs: [
    {
      question: 'What is the difference between wages and salary?',
      answer: 'Wages are compensation calculated based on the number of hours worked multiplied by an hourly rate. If you work more hours, you earn more; fewer hours means less pay. Salary, on the other hand, is a fixed amount of compensation paid on a regular schedule (weekly, bi-weekly, or monthly) regardless of the exact hours worked. Salaried employees typically do not receive overtime pay for extra hours, while wage earners are generally entitled to overtime under the Fair Labor Standards Act (FLSA). Both can be exempt or non-exempt depending on job duties and salary thresholds.',
    },
    {
      question: 'How is overtime calculated?',
      answer: 'Under the federal Fair Labor Standards Act (FLSA), overtime is calculated at 1.5 times the employee\'s regular hourly rate for all hours worked beyond 40 in a workweek. Some states have additional daily overtime rules — for example, California requires overtime (1.5x) after 8 hours in a single day and double-time (2x) after 12 hours. The formula is: Overtime Pay = Overtime Hours × Hourly Rate × 1.5. Some employers offer higher multipliers voluntarily, and certain industries (like healthcare) may have different overtime rules.',
    },
    {
      question: 'What is double time and when does it apply?',
      answer: 'Double time means the employee is paid at twice their regular hourly rate (2.0x). While not required by federal law, several states mandate double time under specific conditions. California, for example, requires double-time pay for hours worked beyond 12 in a single day and for the first 8 hours worked on the 7th consecutive day of work. Some union contracts also specify double-time rates for holidays, weekends, or exceeding certain weekly thresholds. Always check your state labor laws and employment agreement.',
    },
    {
      question: 'What are the minimum wage laws in the US?',
      answer: 'The federal minimum wage is $7.25 per hour (effective since July 2009). However, many states and cities have significantly higher minimums. As of 2025, states like California ($16.50/hr), Washington ($16.66/hr), and New York ($15.00-$16.00/hr depending on region) have much higher floors. Employers must pay the higher of the federal or applicable state/local minimum. Certain workers, such as tipped employees (minimum $2.13/hr federal cash wage), student workers, and certain agricultural workers, may have different minimums.',
    },
    {
      question: 'How do I calculate gross vs net wages?',
      answer: 'Gross wages are your total earnings before any deductions — the full amount calculated from your hours worked and pay rate (including overtime and double-time). Net wages (also called "take-home pay") are what you actually receive after all deductions are subtracted. Deductions include federal and state income tax withholding, Social Security (6.2%), Medicare (1.45%), health insurance premiums, 401(k) contributions, garnishments, and any other post-tax deductions. To calculate net wages: Net = Gross − All Deductions. Use our Payroll Deduction Calculator for a detailed breakdown.',
    },
    {
      question: 'How are tipped employee wages calculated?',
      answer: 'Tipped employees have a dual wage structure: a cash wage from the employer (federal minimum of $2.13/hr) plus tips from customers. The employer must ensure that the total of cash wage plus tips equals at least the federal minimum wage ($7.25/hr). If tips fall short, the employer must make up the difference. Many states have higher cash wage minimums for tipped workers. For overtime calculations, the regular rate for a tipped employee is generally the full minimum wage (not the cash wage), so the overtime rate is at least $10.875/hr federally (1.5 × $7.25). Some states require the overtime rate to include the tip credit differently.',
    },
  ],
  relatedTools: [
    {
      slug: 'overtime-calculator',
      title: 'Overtime Calculator',
      description: 'Calculate overtime pay with standard time-and-a-half and double-time rates',
      icon: 'Timer',
    },
    {
      slug: 'salary-converter',
      title: 'Salary Converter Calculator',
      description: 'Convert between hourly, daily, weekly, bi-weekly, monthly, and annual pay rates',
      icon: 'ArrowLeftRight',
    },
    {
      slug: 'payroll-calculator',
      title: 'Payroll & Paycheck Calculator',
      description: 'Estimate your take-home pay after federal and state taxes and deductions',
      icon: 'CreditCard',
    },
    {
      slug: 'hourly-paycheck-calculator',
      title: 'Hourly Paycheck Calculator',
      description: 'Calculate your hourly paycheck after taxes and deductions',
      icon: 'BadgeDollarSign',
    },
    {
      slug: 'time-card-calculator',
      title: 'Time Card Calculator',
      description: 'Calculate total work hours from clock-in/out times for payroll',
      icon: 'Clock',
    },
  ],
};

export default wagesSEOData;
