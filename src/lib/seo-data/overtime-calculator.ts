const seoData = {
  // ---------------------------------------------------------------------------
// How-to steps
// ---------------------------------------------------------------------------

howToSteps: [
  'Enter your hourly pay rate — this is the standard amount you earn per hour before any overtime calculations are applied.',
  'Set your regular hours per week. The default is 40 hours, which is the standard full-time threshold under the FLSA. Adjust this if your employer uses a different weekly schedule.',
  'Enter the number of overtime hours you worked during the week. You can either type this directly or use the optional weekly total field below to auto-calculate it.',
  'Choose your overtime multiplier from the dropdown — select 1.5x (time-and-a-half) or 2x (double time), or choose "Custom" to enter any multiplier you need for state-specific or contract-based rates.',
  'Optionally, enter your total weekly hours worked. If this exceeds your regular hours, the calculator will automatically determine your overtime hours for you.',
  'Click "Calculate Overtime Pay" to see your complete pay breakdown including regular pay, overtime pay, total earnings, the overtime premium above your normal rate, and your effective hourly rate for the week.',
],

// ---------------------------------------------------------------------------
// FAQs
// ---------------------------------------------------------------------------

faqs: [
  {
    question: 'What are the FLSA overtime rules?',
    answer:
      'The Fair Labor Standards Act (FLSA) requires that covered, non-exempt employees be paid at least 1.5 times their regular hourly rate for all hours worked beyond 40 in a single workweek. The FLSA establishes the federal baseline for overtime, but individual states may have their own laws that provide additional protections. For example, some states require overtime for hours worked beyond 8 in a single day. Federal law does not limit the number of hours employees aged 16 and older may work in a week, but overtime must be compensated for hours beyond the 40-hour threshold.',
  },
  {
    question: 'How does California daily overtime work?',
    answer:
      'California has some of the strictest overtime laws in the country. Under California law, non-exempt employees earn 1.5x their regular rate for any hours worked beyond 8 in a single day, and double time (2x) for hours worked beyond 12 in a day. Additionally, the first 8 overtime hours worked in a workweek are compensated at 1.5x, and any hours beyond the first 8 overtime hours in that week are paid at double time. This means California workers can earn overtime even if they work less than 40 total hours in a week, provided any single day exceeds 8 hours.',
  },
  {
    question: 'Who qualifies for overtime pay?',
    answer:
      'Under the FLSA, employees are generally classified as either exempt or non-exempt. Non-exempt employees are entitled to overtime pay, while exempt employees are not. To qualify as exempt, an employee must typically earn at least a minimum salary threshold (set by the Department of Labor), and their job duties must meet specific criteria for executive, administrative, professional, outside sales, or computer professional exemptions. Most hourly workers are non-exempt. If you are unsure about your classification, check with your state labor department or the U.S. Department of Labor.',
  },
  {
    question: 'What is the difference between exempt and non-exempt employees?',
    answer:
      'Non-exempt employees are entitled to minimum wage and overtime pay (1.5x for hours over 40 per week) under the FLSA. They are typically paid hourly and must track their time worked. Exempt employees are excluded from overtime requirements and are generally paid a salary rather than hourly. To qualify as exempt, employees must meet specific duties tests and earn above a salary threshold ($684 per week under current federal rules, though some states have higher thresholds). Exempt employees are expected to complete their job responsibilities regardless of how many hours it takes.',
  },
  {
    question: 'Is holiday pay the same as overtime pay?',
    answer:
      'No, holiday pay and overtime pay are separate concepts. Federal law does not require employers to pay extra for work performed on holidays, Sundays, or weekends. Overtime is triggered only by exceeding 40 hours in a workweek (or daily thresholds in states like California). However, many employers voluntarily offer premium holiday pay rates (such as 1.5x or 2x) as a company policy or through union contracts. If you work overtime hours during a holiday week, the overtime rules still apply — holiday premium pay does not count toward the overtime calculation unless your employer specifically includes it.',
  },
  {
    question: 'Can employers offer comp time instead of overtime pay?',
    answer:
      'Under the FLSA, private-sector employers generally cannot offer compensatory time off (comp time) in place of overtime pay for non-exempt employees. Overtime must be paid as wages. However, there are exceptions for public-sector (government) employers, who may offer comp time at a rate of 1.5 hours for each overtime hour worked, subject to certain limits. Some states have their own rules regarding comp time. If your employer offers comp time instead of overtime pay and you work in the private sector, this may be a violation of federal wage law, and you should consult the Department of Labor or an employment attorney.',
  },
],


};

export default seoData;
