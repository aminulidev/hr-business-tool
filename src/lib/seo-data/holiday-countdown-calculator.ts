const seoData = {
  breadcrumbs: [{ label: 'Calculators' }, { label: 'Holiday Countdown Calculator' }],
  tableOfContents: [
    { id: 'how-to-calculate', label: 'How to Calculate' },
    { id: 'worked-examples', label: 'Worked Examples' },
    { id: 'frequently-asked-questions', label: 'FAQs' },
    { id: 'related-calculators', label: 'Related Calculators' },
  ],
  howToSteps: [
    'Set your reference date (default = today).',
    'Click Show Countdown to see the next upcoming federal holiday and days until each.',
    'Review the full 2026 federal holiday calendar with day-of-week and observed dates.',
    'Use this to plan paid time off around federal holidays for maximum vacation days.',
    'See Holiday Pay Calculator for premium pay if you work on a holiday.',
  ],
  formula: 'Days Until = Holiday Date - Reference Date\nIf Saturday holiday → observed Friday\nIf Sunday holiday → observed Monday',
  formulaDescription: 'The 11 US federal holidays (5 U.S.C. 6103) are observed by federal employees and most state/local government offices. Private employers are NOT required to offer paid holidays — about 78% of private-sector workers receive paid holidays. When a holiday falls on Saturday, it is observed on Friday; Sunday holidays are observed on Monday.',
  workedExamples: [
    { title: 'New Year 2026', description: 'New Year\'s Day is Thursday, January 1, 2026. From December 1, 2025: 31 days until New Year. From July 4, 2025: 181 days.' },
    { title: 'July 4th on Saturday', description: 'Independence Day 2026 falls on Saturday, July 4. Federal observation = Friday, July 3. Many employers observe the Friday as the paid holiday. If you also have Saturday off, you effectively get a 3-day weekend (Friday-Sunday).' },
    { title: 'Thanksgiving 2026', description: 'Thanksgiving 2026 = Thursday, November 26. From November 1: 25 days. Many employers also offer Friday November 27 as a paid holiday (Black Friday), giving a 4-day weekend.' },
    { title: 'Christmas 2026', description: 'Christmas 2026 = Friday, December 25. From December 1: 24 days. Since it\'s Friday, no observation shift needed. Combined with Thursday Dec 24 (Christmas Eve, often paid by employer) = 4-day weekend (Dec 24-27).' },
    { title: 'Summer Holiday Gap', description: 'From Memorial Day (May 25, 2026) to Independence Day (July 4, 2026) = 40 days with no federal holiday. The longest gap in 2026 is from Presidents Day (Feb 16) to Memorial Day (May 25) = 98 days.' },
  ],
  faqs: [
    { question: 'What are the 11 US federal holidays?', answer: 'New Year\'s Day (Jan 1), MLK Jr. Day (3rd Monday January), Washington\'s Birthday (3rd Monday February), Memorial Day (last Monday May), Juneteenth (June 19), Independence Day (July 4), Labor Day (1st Monday September), Columbus Day (2nd Monday October), Veterans Day (November 11), Thanksgiving (4th Thursday November), Christmas (December 25). Established by 5 U.S.C. 6103.' },
    { question: 'Are private employers required to offer paid holidays?', answer: 'No — federal law does not require private employers to offer paid holidays. About 78% of private-sector workers receive paid holidays (Bureau of Labor Statistics). Union contracts and employer policies determine which holidays are paid. Massachusetts is the only state that restricts retail operation on certain holidays.' },
    { question: 'What happens when a holiday falls on a weekend?', answer: 'Federal practice: Saturday holidays are observed on Friday; Sunday holidays are observed on Monday. For example, July 4, 2026 is a Saturday — federal observation is Friday July 3. Private employers typically follow the same practice, but check your employee handbook. Some employers observe the actual calendar date regardless of weekend.' },
    { question: 'What is Juneteenth?', answer: 'Juneteenth National Independence Day (June 19) became the 11th federal holiday on June 17, 2021, signed by President Biden. It commemorates the end of slavery in the US (June 19, 1865, when Union soldiers announced freedom in Galveston, TX). First observed as a federal holiday in 2021. Most states also recognize it as a state holiday.' },
    { question: 'Do state holidays differ from federal holidays?', answer: 'Yes — states may add their own holidays. Examples: California (Cesar Chavez Day, March 31), Texas (Texas Independence Day, March 2; San Jacinto Day, April 21), Hawaii (Statehood Day, 3rd Friday August), Louisiana (Mardi Gras in some parishes), Utah (Pioneer Day, July 24), Nevada (Nevada Day, last Friday October). State employees get these in addition to federal holidays.' },
    { question: 'How many paid holidays do most employers offer?', answer: 'BLS data: 78% of private-sector workers receive paid holidays. Average = 8 paid holidays per year. Common package: New Year, Memorial Day, Independence Day, Labor Day, Thanksgiving, day after Thanksgiving, Christmas Eve, Christmas (8 total). Some employers also offer floating holidays for personal/religious observance.' },
  ],
  relatedTools: [
    { slug: 'holiday-pay-calculator', title: 'Holiday Pay Calculator', description: 'Premium pay for working holidays', icon: 'PartyPopper' },
    { slug: 'business-day-calculator', title: 'Business Day Calculator', description: 'Add or subtract working days', icon: 'CalendarDays' },
    { slug: 'working-hours-calculator', title: 'Working Hours Calculator', description: 'Annual hours excluding holidays', icon: 'CalendarClock' },
    { slug: 'leave-calculator', title: 'Leave Calculator', description: 'PTO and leave balance', icon: 'CalendarRange' },
    { slug: 'time-difference-calculator', title: 'Time Difference Calculator', description: 'Days between two dates', icon: 'Clock3' },
  ],
};
export default seoData;
