const seoData = {
  // ------ SEO content ------

  howToSteps: [
    'Choose your calculation mode: count business days between two dates, or add/subtract business days from a start date.',
    'Enter your start date using the date picker. You can select any date in 2025 or nearby years.',
    'For counting mode, also enter the end date. For add/subtract mode, enter the number of business days (use a negative number to subtract).',
    'Select whether to exclude weekends only, or both weekends and US federal holidays.',
    'Click "Calculate" to see the detailed result including the total business days, calendar days, weekend days, and holidays excluded.',
  ],

  formula: 'Business Days = Calendar Days − Weekend Days − Holidays',

  formulaDescription:
    'Business days are calculated by taking the total calendar days between two dates and subtracting all weekend days (Saturdays and Sundays) and any observed US federal holidays that fall on weekdays. When adding or subtracting business days, the calculator advances one calendar day at a time, skipping weekends and holidays until the target number of business days is reached.',

  workedExamples: [
    {
      title: 'Count Business Days: Jan 6, 2025 – Mar 28, 2025',
      description:
        'Counting from Monday, January 6, 2025 to Friday, March 28, 2025 with weekends and US federal holidays excluded. The period spans 82 calendar days. Subtracting 23 weekend days (Saturdays and Sundays) and 3 holidays (MLK Jr. Day on Jan 20, Presidents\' Day on Feb 17) yields 56 business days.',
    },
    {
      title: 'Add 30 Business Days to Jan 1, 2025',
      description:
        'Starting from New Year\'s Day (Wednesday, January 1, 2025 — which is a holiday, so the count effectively begins from the next business day), adding 30 business days while skipping weekends and US federal holidays lands on Monday, February 10, 2025. The calculation skips 12 weekend days and 2 holidays (MLK Jr. Day on Jan 20).',
    },
    {
      title: 'Subtract 10 Business Days from April 1, 2025',
      description:
        'Starting from Tuesday, April 1, 2025 and going backwards 10 business days, skipping weekends and holidays, arrives at Friday, March 18, 2025. The calculation moves back through 14 calendar days, skipping 4 weekend days.',
    },
  ],

  faqs: [
    {
      question: 'What counts as a business day?',
      answer:
        'A business day is any weekday (Monday through Friday) that is not a public holiday. In the United States, this typically means any day from Monday to Friday excluding the 11 federally recognized holidays. Business days are the standard days on which most businesses, banks, and government offices operate. Some industries or organizations may define business days differently (e.g., excluding Friday for certain religious observances), but the Monday–Friday definition is the most common.',
    },
    {
      question: 'Are holidays included in the business day count?',
      answer:
        'By default, this calculator gives you the option to either exclude or include holidays. When the "Exclude weekends + holidays" option is selected, all 11 US federal holidays for 2025 are excluded from the count. When only weekends are excluded, holidays that fall on weekdays are still counted as business days. You can choose the option that best fits your use case — for example, financial or legal deadlines typically exclude holidays, while informal planning might not.',
    },
    {
      question: 'Do weekends count as business days?',
      answer:
        'No, weekends (Saturdays and Sundays) are never counted as business days in this calculator. This is the standard definition used in the United States and most Western countries. Some Middle Eastern countries consider Sunday a business day and Friday a non-business day, but this calculator follows the US convention where the business week runs Monday through Friday.',
    },
    {
      question: 'What about state and local holidays?',
      answer:
        'This calculator only accounts for US federal holidays. State and local holidays (such as Patriot\'s Day in Massachusetts, César Chávez Day in California, or Good Friday in many states) are not included. If you need to account for state-specific holidays, we recommend using the "weekends only" exclusion and manually subtracting any additional holidays relevant to your location.',
    },
    {
      question: 'How accurate is this for project planning?',
      answer:
        'This calculator is highly accurate for standard US business day calculations. It correctly accounts for weekends and all 11 federal holidays with their 2025 observed dates. However, it does not account for company-specific holidays, part-time schedules, or international holidays. For critical project deadlines, always verify against your organization\'s official holiday calendar. The calculator is ideal for estimating delivery timelines, contract deadlines, payment terms, and general business scheduling.',
    },
    {
      question: 'Do different countries have different business days?',
      answer:
        'Yes, business days vary significantly by country. While Monday through Friday is standard in most of the Americas, Europe, and parts of Asia, many Middle Eastern and North African countries have a Sunday–Thursday business week. Additionally, each country has its own set of public holidays. This calculator is specifically designed for the US calendar, so if you are working with international deadlines, you should use a country-specific business day calculator or manually adjust for local holidays and workweek conventions.',
    },
  ],

  relatedTools: [
    {
      slug: 'time-card-calculator',
      title: 'Time Card Calculator',
      description: 'Calculate total work hours from clock-in/out times',
      icon: 'Clock',
    },
    {
      slug: 'payroll-calculator',
      title: 'Payroll Calculator',
      description: 'Calculate take-home pay after taxes and deductions',
      icon: 'CreditCard',
    },
    {
      slug: 'overtime-calculator',
      title: 'Overtime Calculator',
      description: 'Calculate overtime pay and total earnings',
      icon: 'Timer',
    },
    {
      slug: 'salary-converter',
      title: 'Salary Converter',
      description: 'Convert between hourly, monthly, and annual salary',
      icon: 'DollarSign',
    },
    {
      slug: 'pro-rata-calculator',
      title: 'Pro Rata Salary Calculator',
      description: 'Calculate prorated salary for partial periods',
      icon: 'CalendarClock',
    },
  ],

  
};

export default seoData;
