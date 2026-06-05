const seoData = {
  howToSteps: [
    'Enter your clock-in and clock-out times for each workday using the HH:MM 24-hour format. For example, enter 09:00 for 9:00 AM and 17:00 for 5:00 PM.',
    'Specify your lunch break duration in minutes for each day. The default is 30 minutes, which will be subtracted from your total worked hours automatically.',
    'If you want to calculate your wages, enter your hourly rate in dollars. You can also adjust the overtime threshold (default 40 hours/week) and overtime multiplier (default 1.5x).',
    'Add or remove workdays as needed. The calculator starts with a standard Monday through Friday week, but you can add weekend shifts or remove days you did not work.',
    'Click "Calculate Hours" to see a detailed breakdown of regular hours, overtime hours, decimal hours, and—if provided—your total earnings for the period.',
  ],

  formula: 'Total Hours = Σ(Clock Out − Clock In) − Σ(Lunch Break / 60)',
  formulaDescription:
    'The total hours worked is calculated by summing the difference between clock-out and clock-in times for each day, then subtracting the total lunch break time converted to hours. Decimal hours are calculated as Hours + Minutes / 60 (e.g., 8 hours 30 minutes = 8.50 decimal hours).',

  faqs: [
    {
      question: 'How do you convert minutes to decimal hours?',
      answer:
        'To convert minutes to decimal hours, divide the minutes by 60 and add the result to the whole hours. For example, 8 hours and 45 minutes becomes 8 + 45/60 = 8.75 decimal hours. This format is commonly used in payroll systems and time tracking software because it makes it easier to calculate wages. Most employers require time entries in decimal format for accurate payment processing.',
    },
    {
      question: 'What is overtime and when does it apply?',
      answer:
        'Overtime is the time an employee works beyond their standard scheduled hours, typically beyond 40 hours in a workweek in the United States under the Fair Labor Standards Act (FLSA). Overtime must be compensated at a rate of at least 1.5 times the employee\'s regular hourly rate, known as "time and a half." Some states have additional daily overtime rules, such as California where exceeding 8 hours in a single day also triggers overtime pay.',
    },
    {
      question: 'How does time rounding work in time cards?',
      answer:
        'Many employers use time rounding to simplify payroll calculations. The most common rounding methods include rounding to the nearest quarter-hour (15 minutes), nearest tenth of an hour (6 minutes), or nearest 5 minutes. For example, if an employee clocks in at 8:53 AM and the system rounds to the nearest quarter-hour, the time would be recorded as 9:00 AM. Federal law permits rounding as long as it does not systematically result in the employee losing pay over time.',
    },
    {
      question: 'Can lunch breaks be unpaid?',
      answer:
        'Yes, in most U.S. states, meal breaks of 30 minutes or more can be unpaid as long as the employee is completely relieved of all duties during the break. The federal FLSA does not require employers to provide meal or rest breaks, though many states have their own laws mandating break times. Shorter breaks (typically 5-20 minutes) are generally considered compensable work time and must be paid. Always check your state and local labor laws for specific requirements.',
    },
    {
      question: 'How do I calculate overtime pay?',
      answer:
        'Overtime is typically calculated at 1.5 times your regular hourly rate for any hours exceeding 40 in a single workweek under US federal law. The formula is: OT pay = overtime hours × regular hourly rate × 1.5. Some states, such as California, also require daily overtime for hours worked beyond 8 in a single day, and double-time for hours beyond 12. Always check your state\'s specific overtime rules for the most accurate calculation.',
    },
    {
      question: 'What is time rounding and is it legal?',
      answer:
        'Time rounding is the practice of rounding clock-in and clock-out times to the nearest preset increment, commonly 5, 10, or 15 minutes. Under federal law, time rounding is legal as long as it does not consistently disadvantage employees over time. For example, if rounding sometimes benefits the employer and sometimes benefits the employee, it is generally permissible. However, if rounding systematically shortchanges workers, the employer may be required to pay back wages.',
    },
    {
      question: 'How do I handle on-call hours?',
      answer:
        'On-call hours where you are required to remain at the workplace or are severely restricted in your activities are typically counted as hours worked and must be compensated. On-call hours where you are free to pursue personal activities at home and simply carry a phone or pager may not count as compensable time, depending on your jurisdiction. Check your local labor laws and company policy, as rules vary significantly between states and industries.',
    },
    {
      question: 'Can my employer require me to work through lunch?',
      answer:
        'In most US states, employers must provide a meal break for shifts exceeding 6 hours, but they may not be required to pay for it if you are fully relieved of all work duties. If your employer requires you to work through your lunch period or respond to calls and emails during the break, that time is typically compensable under the FLSA. Some states like California impose strict penalties for missed meal breaks. Document any instances where you are asked to work through lunch to protect your right to compensation.',
    },
  ],

  
};

export default seoData;
