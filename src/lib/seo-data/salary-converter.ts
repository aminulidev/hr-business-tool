import type { CalculatorSeoData } from './types';
const seoData = {
  breadcrumbs: [
    { label: 'Calculators', href: '/calculators' },
    { label: 'Salary Converter', href: '/calculators/salary-converter' },
  ],
  tableOfContents: [
    { id: 'how-to-calculate', label: 'How to Calculate' },
    { id: 'formula', label: 'Formula' },
    { id: 'worked-examples', label: 'Worked Examples' },
    { id: 'benchmarks-reference', label: 'Salary-to-Hourly Reference Table' },
    { id: 'in-depth-guide', label: 'In-Depth Guide' },
    { id: 'frequently-asked-questions', label: 'FAQs' },
    { id: 'related-calculators', label: 'Related Calculators' },
  ],
  howToSteps: [
    'Enter your gross pay amount in the input field — you can enter an hourly wage (e.g., $28.85/hr), weekly paycheck, bi-weekly paycheck, semi-monthly paycheck, monthly salary, or annual salary (e.g., $60,000/yr).',
    'Select the pay frequency that matches your entered amount from the dropdown (Hourly, Daily, Weekly, Bi-Weekly, Semi-Monthly, Monthly, or Annual).',
    'Adjust your scheduled Hours per Week (default is the standard 40-hour full-time workweek = 2,080 hours/year; change to 37.5, 35, or 20 hours for alternative or part-time schedules).',
    'Optionally adjust Work Weeks per Year (default is 52 paid weeks; reduce to 48–50 weeks if you are an unpaid-time-off contractor or hourly worker taking unpaid vacation).',
    'Review your instant gross pay equivalents across all 7 pay periods alongside the $30,000 to $150,000 Salary-to-Hourly Quick Reference Table below.',
  ],
  formula:
    'Annual Salary = Hourly Rate × Hours per Week × Weeks per Year (Standard: Hourly × 2,080)\n' +
    'Hourly Rate = Annual Salary ÷ (Hours per Week × 52)  [Standard: Annual ÷ 2,080]\n' +
    'Monthly Pay = Annual Salary ÷ 12  |  Semi-Monthly Pay = Annual Salary ÷ 24\n' +
    'Bi-Weekly Pay = Annual Salary ÷ 26  |  Weekly Pay = Annual Salary ÷ 52\n' +
    'Daily Pay (8-hr day) = Annual Salary ÷ 260',
  formulaDescription:
    'Under US Department of Labor (FLSA) and standard payroll accounting conventions, a full-time work year consists of 52 weeks × 40 hours/week = 2,080 paid hours (or 260 eight-hour workdays). Every salary-to-hourly conversion first normalizes your input to an equivalent annual figure and then divides by the exact period factor: 2,080 for hourly, 260 for daily, 52 for weekly, 26 for bi-weekly (every two weeks), 24 for semi-monthly (twice a month on the 1st and 15th), and 12 for monthly.',
  workedExamples: [
    {
      title: '$60,000 Annual Salary Converted to Hourly, Bi-Weekly & Monthly Pay',
      description:
        'Working a standard 40-hour week across 52 paid weeks (2,080 hours/year), a $60,000 annual salary converts to $60,000 ÷ 2,080 = $28.85/hour ($230.77 per 8-hour day). Weekly gross pay is $60,000 ÷ 52 = $1,153.85; bi-weekly pay (26 paychecks) is $60,000 ÷ 26 = $2,307.69; semi-monthly pay (24 paychecks) is $60,000 ÷ 24 = $2,500.00; and monthly pay is $60,000 ÷ 12 = $5,000.00.',
    },
    {
      title: '$25.00/Hour Wage — Full-Time (52 Paid Weeks) vs. Unpaid Vacation (49 Weeks)',
      description:
        'An employee earning $25.00/hour with paid time off (52 paid weeks × 40 hours = 2,080 hours) earns $52,000.00 per year ($4,333.33/month or $2,000.00 bi-weekly). However, if an hourly contractor earns $25.00/hour without paid holidays or PTO and takes 3 weeks off (49 working weeks × 40 hours = 1,960 hours), actual annual gross income is $25 × 1,960 = $49,000.00—a $3,000 annual difference.',
    },
    {
      title: '$85,000 Salary on a 37.5-Hour Corporate Workweek vs. 50-Hour Unpaid Overtime Reality',
      description:
        'On a 37.5-hour schedule (1,950 hours/year), an $85,000 salary equals $43.59/hour (versus $40.87/hour on a 40-hour schedule). Conversely, if an FLSA-exempt salaried manager earning $85,000 actually works 50 hours per week (2,600 hours/year) with no overtime pay, their true effective hourly wage drops to $85,000 ÷ 2,600 = $32.69/hour—a 20% reduction in hourly earning power.',
    },
    {
      title: 'Comparing a $32/Hour Non-Exempt Offer (with 5 OT Hours/Wk) vs. a $72,000 Exempt Salary',
      description:
        'At 40 hours/week, $32.00/hour base pay equals $66,560/year—seemingly $5,440 less than a $72,000 salaried offer. However, if the role requires 45 hours/week, the non-exempt hourly worker earns 5 hours/week of 1.5× overtime ($48.00/hr × 5 hrs × 52 weeks = $12,480/year in overtime), bringing total annual earnings to $79,040—out-earning the $72,000 exempt salary by $7,040/year.',
    },
  ],
  benchmarkTables: [
    {
      title: '2026 Salary to Hourly & Pay Period Quick Reference Conversion Table ($30,000 – $150,000)',
      subtitle:
        'Based on the standard full-time schedule of 40 hours/week and 52 weeks/year (2,080 annual work hours / 260 workdays).',
      headers: [
        'Annual Salary',
        'Hourly Rate (÷ 2,080)',
        'Daily Rate (8 Hrs)',
        'Weekly Pay (÷ 52)',
        'Bi-Weekly Pay (÷ 26)',
        'Semi-Monthly (÷ 24)',
        'Monthly Pay (÷ 12)',
      ],
      rows: [
        ['$30,000', '$14.42 /hr', '$115.38', '$576.92', '$1,153.85', '$1,250.00', '$2,500.00'],
        ['$35,000', '$16.83 /hr', '$134.62', '$673.08', '$1,346.15', '$1,458.33', '$2,916.67'],
        ['$40,000', '$19.23 /hr', '$153.85', '$769.23', '$1,538.46', '$1,666.67', '$3,333.33'],
        ['$45,000', '$21.63 /hr', '$173.08', '$865.38', '$1,730.77', '$1,875.00', '$3,750.00'],
        ['$50,000', '$24.04 /hr', '$192.31', '$961.54', '$1,923.08', '$2,083.33', '$4,166.67'],
        ['$55,000', '$26.44 /hr', '$211.54', '$1,057.69', '$2,115.38', '$2,291.67', '$4,583.33'],
        ['$60,000', '$28.85 /hr', '$230.77', '$1,153.85', '$2,307.69', '$2,500.00', '$5,000.00'],
        ['$65,000', '$31.25 /hr', '$250.00', '$1,250.00', '$2,500.00', '$2,708.33', '$5,416.67'],
        ['$70,000', '$33.65 /hr', '$269.23', '$1,346.15', '$2,692.31', '$2,916.67', '$5,833.33'],
        ['$75,000', '$36.06 /hr', '$288.46', '$1,442.31', '$2,884.62', '$3,125.00', '$6,250.00'],
        ['$80,000', '$38.46 /hr', '$307.69', '$1,538.46', '$3,076.92', '$3,333.33', '$6,666.67'],
        ['$90,000', '$43.27 /hr', '$346.15', '$1,730.77', '$3,461.54', '$3,750.00', '$7,500.00'],
        ['$100,000', '$48.08 /hr', '$384.62', '$1,923.08', '$3,846.15', '$4,166.67', '$8,333.33'],
        ['$120,000', '$57.69 /hr', '$461.54', '$2,307.69', '$4,615.38', '$5,000.00', '$10,000.00'],
        ['$150,000', '$72.12 /hr', '$576.92', '$2,884.62', '$5,769.23', '$6,250.00', '$12,500.00'],
      ],
    },
    {
      title: 'Hourly Wage to Annual Salary Conversion Chart ($15/hr – $60/hr)',
      subtitle:
        'Compare annual income across 40 hrs/wk (2,080 hrs), 37.5 hrs/wk (1,950 hrs), and 30 hrs/wk part-time (1,560 hrs).',
      headers: [
        'Hourly Wage',
        'Annual (40 Hrs/Wk · 2,080 Hrs)',
        'Bi-Weekly (40 Hrs/Wk)',
        'Monthly (40 Hrs/Wk)',
        'Annual (37.5 Hrs/Wk · 1,950 Hrs)',
        'Annual Part-Time (30 Hrs/Wk)',
      ],
      rows: [
        ['$15.00 /hr', '$31,200', '$1,200.00', '$2,600.00', '$29,250', '$23,400'],
        ['$18.00 /hr', '$37,440', '$1,440.00', '$3,120.00', '$35,100', '$28,080'],
        ['$20.00 /hr', '$41,600', '$1,600.00', '$3,466.67', '$39,000', '$31,200'],
        ['$22.00 /hr', '$45,760', '$1,760.00', '$3,813.33', '$42,900', '$34,320'],
        ['$25.00 /hr', '$52,000', '$2,000.00', '$4,333.33', '$48,750', '$39,000'],
        ['$30.00 /hr', '$62,400', '$2,400.00', '$5,200.00', '$58,500', '$46,800'],
        ['$35.00 /hr', '$72,800', '$2,800.00', '$6,066.67', '$68,250', '$54,600'],
        ['$40.00 /hr', '$83,200', '$3,200.00', '$6,933.33', '$78,000', '$62,400'],
        ['$50.00 /hr', '$104,000', '$4,000.00', '$8,666.67', '$97,500', '$78,000'],
        ['$60.00 /hr', '$124,800', '$4,800.00', '$10,400.00', '$117,000', '$93,600'],
      ],
    },
  ],
  deepDiveSections: [
    {
      title: 'The "2× Rule" Mental Math Shortcut for Instant Salary-to-Hourly Conversions',
      paragraphs: [
        'Because a standard full-time work year is 2,080 hours (which is very close to 2,000 hours), you can estimate any hourly rate or annual salary in your head in two seconds using the "2× and Drop Three Zeros" rule.',
        'To convert an Hourly Rate to Annual Salary, double the hourly rate and multiply by $1,000 (then add 4% for exact precision): $25/hour × 2 = $50,000 (exact is $52,000); $35/hour × 2 = $70,000 (exact is $72,800). Conversely, to convert an Annual Salary to an Hourly Rate, drop the last three zeros and divide by 2 (then subtract ~4%): $80,000 → 80 ÷ 2 = $40/hour (exact is $38.46/hour); $100,000 → 100 ÷ 2 = $50/hour (exact is $48.08/hour).',
      ],
    },
    {
      title: 'Bi-Weekly (26 Paychecks) vs. Semi-Monthly (24 Paychecks): Why Your Monthly Budget Feels Different',
      paragraphs: [
        'One of the most common points of confusion when starting a new job is the difference between bi-weekly and semi-monthly payroll cycles. A semi-monthly schedule pays you twice a month on fixed calendar dates (typically the 15th and last business day of the month), producing exactly 24 paychecks per year. A bi-weekly schedule pays you every two weeks on a fixed weekday (such as every other Friday), producing 26 paychecks per year.',
        'At the same $78,000 annual salary, a semi-monthly paycheck is $3,250.00 gross ($78,000 ÷ 24), whereas a bi-weekly paycheck is $3,000.00 gross ($78,000 ÷ 26)—$250 smaller per check. However, on a bi-weekly schedule, ten months of the year have 2 paychecks ($6,000/month) and two months of the year have 3 paychecks ($9,000/month). Smart budgeters build their monthly fixed-expense budget around 2 bi-weekly checks and treat the two "three-paycheck months" each year as automatic windfalls for savings, debt payoff, or investing.',
      ],
    },
    {
      title: 'Salaried Exempt vs. Hourly Non-Exempt: Overtime & Paid Time Off Trade-Offs',
      paragraphs: [
        'When comparing an hourly job offer against a salaried job offer, look beyond the 2,080-hour base conversion to evaluate FLSA exemption status and paid leave. Under the Fair Labor Standards Act, non-exempt (typically hourly) employees must be paid 1.5× their regular rate for every hour worked beyond 40 in a workweek (and daily overtime after 8 hours in states like California). However, some hourly roles offer fewer paid holidays or lower PTO accruals during the first year.',
        'Conversely, salaried exempt employees receive their full fixed paycheck in any week they perform work, plus paid federal holidays and PTO—but receive $0 in additional overtime pay whether they work 40 hours or 55 hours a week. Always divide a salaried offer by the realistic average weekly hours of the team (e.g., 45 hours/week = 2,340 hours/year) to see your true hourly compensation.',
      ],
    },
  ],
  faqs: [
    {
      question: 'What is the difference between bi-weekly and semi-monthly pay?',
      answer:
        'Bi-weekly pay occurs every two weeks (e.g., every other Friday), resulting in 26 paychecks per year (52 weeks ÷ 2). Semi-monthly pay occurs twice per month on specific dates (typically the 1st and 15th, or 15th and last day of the month), resulting in 24 paychecks per year. At the same annual salary, each semi-monthly paycheck is 8.33% larger than a bi-weekly paycheck, but bi-weekly workers receive two "extra" paychecks (three-paycheck months) each year.',
    },
    {
      question: 'Why does standard payroll math use 2,080 hours per year?',
      answer:
        '2,080 hours is the product of 40 hours per week multiplied by 52 weeks per year (40 × 52 = 2,080), which equals 260 eight-hour workdays. Even when a full-time salaried employee takes 10 paid federal holidays and 15 days of paid vacation (200 hours of paid leave), those hours are still paid by the employer—so the total paid hours denominator remains 2,080.',
    },
    {
      question: 'How do I convert my annual salary to an hourly rate if I work 37.5 or 35 hours per week?',
      answer:
        'Multiply your weekly hours by 52 to find your annual hours, then divide your annual salary by that total. For a 37.5-hour workweek (7.5 hours/day), annual hours are 37.5 × 52 = 1,950 hours (so a $65,000 salary ÷ 1,950 = $33.33/hour). For a 35-hour workweek (7 hours/day), annual hours are 35 × 52 = 1,820 hours (so a $65,000 salary ÷ 1,820 = $35.71/hour).',
    },
    {
      question: 'Does this salary converter show gross pay or net take-home pay after taxes?',
      answer:
        'This calculator converts gross (pre-tax) pay across time periods. Your actual net take-home paycheck will be reduced by federal income tax withholding, Social Security (6.2%), Medicare (1.45%), state/local income taxes, and pre-tax benefits like health insurance or 401(k) contributions. To see your exact 2026 net paycheck after taxes, click our Hourly Paycheck Calculator or Salary Tax Calculator.',
    },
    {
      question: 'What is a "27-pay-period year" in bi-weekly payroll?',
      answer:
        'Because a normal calendar year has 365 days (52 weeks + 1 day) and a leap year has 366 days (52 weeks + 2 days), every 11 to 12 years a company’s bi-weekly payday falls 27 times in a single calendar year instead of 26. Most employers still divide annual salary by 26 (resulting in slightly higher W-2 earnings that year) or divide by 27 for that specific calendar year; check with your HR/payroll department if a 27th payday occurs.',
    },
    {
      question: 'How much more should I charge per hour as a 1099 contractor compared to a W-2 hourly rate?',
      answer:
        'Because a 1099 independent contractor must pay the employer’s 7.65% half of FICA taxes, fund their own health insurance and retirement, cover business software/insurance, and absorb unpaid vacation, holidays, and non-billable admin time, you should generally charge 1.35× to 1.65× the equivalent W-2 hourly rate to maintain the same net standard of living.',
    },
  ],
  relatedTools: [
    { slug: 'hourly-paycheck-calculator', title: 'Hourly Paycheck Calculator', description: 'See 2026 net take-home pay after federal & state taxes', icon: 'CreditCard' },
    { slug: 'wages-calculator', title: 'Wages Calculator', description: 'Calculate regular & overtime gross pay', icon: 'Banknote' },
    { slug: 'overtime-calculator', title: 'Overtime Calculator', description: 'Calculate 1.5× and 2× overtime earnings', icon: 'Timer' },
    { slug: 'salary-increase-calculator', title: 'Salary Increase Calculator', description: 'See how a raise or promotion impacts every pay period', icon: 'TrendingUp' },
    { slug: 'pro-rata-calculator', title: 'Pro Rata Salary Calculator', description: 'Calculate part-time & partial-year prorated pay', icon: 'CalendarClock' },
    { slug: 'after-tax-income-calculator', title: 'After-Tax Income Calculator', description: 'Full-year net income after 2026 tax brackets', icon: 'Wallet' },
  ],
} satisfies CalculatorSeoData;

export default seoData;