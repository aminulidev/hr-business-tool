const seoData = {
  // -----------------------------------------------------------------------

  howToSteps: [
    'Enter your pay amount in the input field. This can be any amount you currently earn — for example, your hourly wage, weekly paycheck, monthly salary, or annual compensation figure from your employment contract.',
    'Select the pay period that matches your input amount from the dropdown menu. Choose from Hourly, Daily, Weekly, Bi-Weekly, Semi-Monthly, Monthly, or Annual so the calculator knows the time frame of your entered amount.',
    'Optionally adjust the hours per week field if your work schedule differs from the standard 40-hour week. This is important for accurate hourly and daily conversions — for instance, part-time workers or those with non-standard schedules should update this value.',
    'Click the "Convert" button to instantly see your equivalent pay rate across all seven pay periods. The calculator converts your input to an annual figure first, then derives every other period from that baseline.',
    'Review the results grid to compare your earnings across different time frames. Each row shows the converted amount formatted as currency along with the corresponding hours worked for that period, making it easy to understand your true earning rate at every level.',
  ],

  formula: 'Annual Salary = Hourly Rate × Hours/Week × 52',

  formulaDescription:
    'All salary conversions start by calculating the equivalent annual salary. From this annual figure, every other pay period is derived: monthly divides by 12, semi-monthly by 24, bi-weekly by 26, weekly by 52, daily by dividing the annual total by the number of 8-hour workdays (annual hours ÷ 8), and hourly by dividing by total annual hours. The hours-per-week input directly impacts hourly, daily, and weekly calculations, while time-based periods (bi-weekly, semi-monthly, monthly, annual) are derived purely from calendar divisions.',

  workedExamples: [
    {
      title: '$30/hour Full-Time',
      description:
        'At $30 per hour working 40 hours per week, the annual salary is $30 × 40 × 52 = $62,400. This breaks down to $240/day (8-hour day), $1,200/week, $2,400/bi-weekly, $2,600/semi-monthly, $5,200/month. Total hours worked per year: 2,080 hours.',
    },
    {
      title: '$85,000 Annual Salary',
      description:
        'An $85,000 annual salary with a standard 40-hour workweek equates to an hourly rate of $85,000 ÷ 2,080 = $40.87/hour. Daily pay is $326.92 for an 8-hour day, weekly pay is $1,634.62, bi-weekly is $3,269.23, semi-monthly is $3,541.67, and monthly is $7,083.33.',
    },
    {
      title: '$2,500 Bi-Weekly Paycheck',
      description:
        'A bi-weekly paycheck of $2,500 corresponds to an annual salary of $2,500 × 26 = $65,000. At 40 hours/week (2,080 annual hours), the hourly rate is $31.25, the daily rate is $250.00 (8-hour day), weekly is $1,250.00, semi-monthly is $2,708.33, and monthly is $5,416.67.',
    },
  ],

  faqs: [
    {
      question: 'What is the difference between bi-weekly and semi-monthly pay?',
      answer:
        'Bi-weekly pay occurs every two weeks, resulting in 26 paychecks per year (52 weeks ÷ 2). Semi-monthly pay occurs twice per month, typically on the 1st and 15th or 15th and last day, resulting in exactly 24 paychecks per year. Over the course of a year, you receive two more paychecks with bi-weekly pay. Each semi-monthly paycheck is slightly larger than a bi-weekly one to cover the same annual salary in fewer payments.',
    },
    {
      question: 'How do I convert my salary to an hourly rate?',
      answer:
        'To convert an annual salary to an hourly rate, divide the annual salary by the total number of hours you work per year. For a standard 40-hour work week, that is 2,080 hours per year (40 × 52). For example, a $60,000 annual salary ÷ 2,080 hours = $28.85 per hour. If you work a different schedule, adjust the calculation using your actual weekly hours.',
    },
    {
      question: 'Does this calculator account for taxes and deductions?',
      answer:
        'No, this salary converter calculates gross pay equivalents only — it does not factor in taxes, insurance premiums, retirement contributions, or other deductions. The converted amounts represent your pre-tax earnings across different pay periods. To estimate your take-home (net) pay, use a payroll calculator that accounts for federal and state tax withholdings along with any deductions.',
    },
    {
      question: 'Why do my daily and hourly rates change when I adjust hours per week?',
      answer:
        'The hours-per-week setting affects conversions that are time-dependent. If your annual salary stays the same but you work fewer hours per week, your hourly rate increases because the same total pay is spread over fewer hours. Conversely, working more hours at the same salary lowers your effective hourly rate. Pay periods based on calendar divisions (monthly, semi-monthly, bi-weekly) remain unchanged because they depend only on the annual total.',
    },
    {
      question: 'How does overtime affect salary conversion?',
      answer:
        'Standard salary conversions assume a fixed number of regular hours. Overtime pay — typically 1.5× your regular hourly rate for hours beyond 40 per week — is not included in these calculations. If you regularly work overtime, your actual annual earnings will be higher than the converted figures shown here. For accurate overtime-inclusive estimates, use an overtime calculator and add those earnings to your base salary.',
    },
    {
      question: 'Are there 52 weeks in every year for salary calculations?',
      answer:
        'For salary conversion purposes, 52 weeks is the standard assumption used by employers, payroll systems, and the IRS. While a calendar year has 365 days (52 weeks + 1 day, or 52 weeks + 2 days in a leap year), the 52-week convention provides a consistent and widely accepted basis for annualizing pay. Some bi-weekly pay schedules may include 27 pay periods in certain years, but the 26-period-per-year standard is the norm for conversions.',
    },
  ],

  relatedTools: [
    {
      slug: 'commission-calculator',
      title: 'Sales Commission Calculator',
      description: 'Calculate commission earnings from sales revenue and rates',
      icon: 'DollarSign',
    },
    {
      slug: 'salary-increase-calculator',
      title: 'Salary Increase Calculator',
      description: 'See how a raise impacts your paycheck across all pay periods',
      icon: 'TrendingUp',
    },
    {
      slug: 'overtime-calculator',
      title: 'Overtime Calculator',
      description: 'Calculate overtime pay with 1.5× and 2× multipliers',
      icon: 'Timer',
    },
    {
      slug: 'payroll-calculator',
      title: 'Payroll Calculator',
      description: 'Estimate take-home pay after taxes and deductions',
      icon: 'CreditCard',
    },
    {
      slug: 'pro-rata-calculator',
      title: 'Pro Rata Salary Calculator',
      description: 'Calculate prorated salary for partial work periods',
      icon: 'CalendarClock',
    },
    {
      slug: 'time-to-decimal-calculator',
      title: 'Decimal & Fraction Converter',
      description: 'Convert between decimals, fractions, and percentages',
      icon: 'Hash',
    },
  ],

  // -----------------------------------------------------------------------
  // Render
  
};

export default seoData;
