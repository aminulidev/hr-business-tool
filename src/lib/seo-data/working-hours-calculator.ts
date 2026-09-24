const seoData = {
  breadcrumbs: [{ label: 'Calculators' }, { label: 'Working Hours Calculator' }],
  tableOfContents: [
    { id: 'how-to-calculate', label: 'How to Calculate' },
    { id: 'formula', label: 'Formula' },
    { id: 'worked-examples', label: 'Worked Examples' },
    { id: 'frequently-asked-questions', label: 'FAQs' },
    { id: 'related-calculators', label: 'Related Calculators' },
  ],
  howToSteps: [
    'Enter hours per week (typically 40 for full-time).',
    'Enter weeks per year (typically 52; some employers use 50 for accounting).',
    'Select your country to auto-fill public holidays (US=11, UK=8, CA=9, AU=7, EU=10).',
    'Enter PTO/vacation days to subtract from total.',
    'Click Calculate Working Hours to see gross annual, holiday hours off, PTO hours off, and net working hours.',
  ],
  formula: 'Gross Annual = Hours per Week x Weeks per Year\nHoliday Hours Off = Holidays x (Hours per Week / 5)\nPTO Hours Off = PTO Days x (Hours per Week / 5)\nNet Annual = Gross - Holiday Off - PTO Off\nMonthly = Net Annual / 12',
  formulaDescription: 'Net working hours = gross annual hours minus holidays and PTO. The US average is ~1,800-1,900 net hours/year. The OECD average is ~1,740 hours. Germany averages ~1,400 hours; South Korea ~2,100. FLSA does not cap weekly hours — only overtime (1.5×) applies after 40h. The EU Working Time Directive caps at 48h/week averaged over 16 weeks.',
  workedExamples: [
    { title: 'US Full-Time', description: '40h/week x 52 weeks = 2,080h gross. 11 holidays x 8h = 88h off. 15 PTO days x 8h = 120h off. Net = 2,080 - 88 - 120 = 1,872h/year. Monthly = 156h.' },
    { title: 'UK Worker', description: '37.5h/week x 52 = 1,950h gross. 8 UK bank holidays x 7.5h = 60h off. 28 PTO days (UK statutory minimum) x 7.5h = 210h off. Net = 1,950 - 60 - 210 = 1,680h/year. Monthly = 140h.' },
    { title: 'Generous PTO Package', description: '40h/week x 52 = 2,080h. 11 holidays x 8h = 88h. 25 PTO days x 8h = 200h. Net = 1,792h/year. Monthly = 149h. Lower than US average due to generous PTO.' },
    { title: 'Part-Time 30h/week', description: '30h/week x 52 = 1,560h gross. 11 holidays x 6h = 66h. 10 PTO days x 6h = 60h. Net = 1,434h/year. Monthly = 119.5h. Below ACA full-time threshold (30h/week qualifies as full-time for employer mandate).' },
    { title: 'High-Hours Worker (no PTO)', description: '50h/week x 52 = 2,600h gross. 11 holidays x 10h = 110h. 0 PTO. Net = 2,490h/year. Monthly = 207.5h. FLSA OT (over 40h) = 10h/week x 1.5 = additional pay. South Korea average is ~2,100h; Mexico ~2,250h.' },
  ],
  faqs: [
    { question: 'How many work hours are in a year?', answer: 'A standard US full-time year = 2,080 work hours (40h x 52 weeks). After subtracting 11 federal holidays (88h) and 15 days PTO (120h) = 1,872 net working hours. Part-time (under 35h/week) = under 1,820h/year. The OECD average is 1,744h/year.' },
    { question: 'How many work hours are in a month?', answer: 'Standard US full-time = 173.33h/month (2,080/12). After holidays and PTO: ~156h/month net. February = 160h (28 days); March = 184h (31 days). Many employers calculate monthly salary as annual/12 regardless of month length.' },
    { question: 'What is the EU Working Time Directive?', answer: 'EU Directive 2003/88/EC caps working time at 48 hours per week averaged over 16 weeks, including overtime. Workers are entitled to 11 consecutive hours of rest per 24h, 24h uninterrupted weekly rest, 4 weeks paid annual leave, and a 20-min break for shifts over 6h. The UK retained this post-Brexit. The US has no equivalent federal cap.' },
    { question: 'Which country has the most working hours?', answer: 'OECD data 2024: Mexico (2,224h/year), Costa Rica (2,149), Colombia (2,057), Chile (1,963), South Korea (1,895). Lowest: Germany (1,341), Denmark (1,357), Norway (1,378), Netherlands (1,402), France (1,511). US = 1,811h/year, above OECD average of 1,744h.' },
    { question: 'How is FTE (full-time equivalent) calculated?', answer: 'FTE = total part-time hours / standard full-time hours. Example: 2 part-timers at 20h/week = 40h/week combined = 1.0 FTE. ACA defines full-time as 30h/week or 130h/month. FLSA does not define full-time — employers set the threshold (typically 32-40h/week). 1 FTE = 2,080h/year at 40h/week.' },
    { question: 'Does the 40-hour workweek apply to all employees?', answer: 'No — exempt employees (executive, administrative, professional, computer, outside sales) are exempt from FLSA overtime and the 40-hour threshold. The 2024 exemption threshold is $43,888/year ($844/week), rising to $58,656 on January 1, 2025. Some states (CA, NY, WA) have higher thresholds. Independent contractors are not subject to FLSA at all.' },
  ],
  relatedTools: [
    { slug: 'work-hours-calculator', title: 'Work Hours Calculator', description: 'Weekly hours from clock times', icon: 'Clock' },
    { slug: 'shift-hours-calculator', title: 'Shift Hours Calculator', description: '8/10/12 hour shift tracking', icon: 'CalendarClock' },
    { slug: 'holiday-countdown-calculator', title: 'Holiday Countdown', description: 'Days until next holiday', icon: 'CalendarClock' },
    { slug: 'business-day-calculator', title: 'Business Day Calculator', description: 'Working days between dates', icon: 'CalendarDays' },
    { slug: 'overtime-calculator', title: 'Overtime Calculator', description: 'OT pay after 40h/week', icon: 'Timer' },
  ],
};
export default seoData;
