const seoData = {
  breadcrumbs: [{ label: 'Calculators' }, { label: 'Double Time Calculator' }],
  tableOfContents: [
    { id: 'how-to-calculate', label: 'How to Calculate' },
    { id: 'formula', label: 'Formula & California Rules' },
    { id: 'worked-examples', label: 'Worked Examples' },
    { id: 'frequently-asked-questions', label: 'FAQs' },
    { id: 'statutory-sources', label: 'Statutory Sources' },
    { id: 'related-calculators', label: 'Related Calculators' },
  ],
  howToSteps: [
    'Enter your base hourly wage — the standard straight-time rate (1.0×) before overtime multipliers.',
    'Enter your regular straight-time hours (up to 8 hours per day or 40 hours per workweek).',
    'Optionally, enter any 1.5× time-and-a-half hours (e.g. hours 9 through 12 in California, or weekly hours 41–48).',
    'Enter your double-time hours (hours qualifying for 2.0× compensation under California Labor Code § 510 or your union contract).',
    'Click "Calculate Double Time" to see your pay breakdown across regular pay, 1.5× overtime, double-time, and blended total gross earnings.',
    'Use the "Quick Presets" button (e.g. California 14-Hour Day) to test standard multi-tier shift scenarios instantly.',
  ],
  formula: 'Double-Time Hourly Rate = Regular Hourly Rate x 2.0\nDouble-Time Pay = Double-Time Hourly Rate x Double-Time Hours\n\nFull Multi-Tier Gross Pay:\nTotal Pay = (Regular Hours x Base Rate) + (1.5x Hours x Base Rate x 1.5) + (Double-Time Hours x Base Rate x 2.0)\nOvertime Premium = Total Pay - (Base Rate x Total Hours Worked)',
  formulaDescription: 'Double-time pay represents twice an employee\'s standard hourly wage (2.0×). While federal law (the Fair Labor Standards Act, 29 U.S.C. § 207) does not mandate double-time, California Labor Code § 510 strictly requires 2.0× pay for all hours worked beyond 12 hours in a single workday, and for all hours worked beyond 8 hours on the 7th consecutive day of work in a workweek. Many union contracts (CBAs) across the US also require double-time for holiday work, emergency call-outs, and extreme shift lengths.',
  workedExamples: [
    {
      title: 'California 14-Hour Single-Day Shift (3-Tier Daily Overtime)',
      description: 'A California healthcare assistant earns $24.00/hr and works a grueling 14-hour emergency shift. Hours 1–8 (Straight Time): 8 × $24.00 = $192.00. Hours 9–12 (1.5× Overtime): 4 × ($24.00 × 1.5 = $36.00) = $144.00. Hours 13–14 (2.0× Double-Time): 2 × ($24.00 × 2.0 = $48.00) = $96.00. Total single-day gross pay = $192.00 + $144.00 + $96.00 = $432.00. Compare to $336.00 straight pay—California rules add $96.00 in statutory overtime premiums.',
    },
    {
      title: 'California 7th Consecutive Day of Work (Labor Code § 510)',
      description: 'A retail worker earning $20.00/hr works all 7 consecutive days in a workweek. On the 7th day, they work 10 hours. Under California law, the first 8 hours on the 7th day are compensated at 1.5×: 8 × ($20.00 × 1.5) = $240.00. All hours worked beyond 8 on the 7th day trigger mandatory double-time (2.0×): 2 × ($20.00 × 2.0) = $80.00. Total earnings for the 7th day alone equal $320.00.',
    },
    {
      title: 'Union Manufacturing Contract (Sunday / Holiday Double-Time)',
      description: 'A machinist earns $32.00/hr. The collective bargaining agreement stipulates that all work performed on Sundays or designated corporate holidays is compensated at double-time. For an 8-hour Sunday shift: Double-time rate = $32.00 × 2 = $64.00/hr. Total earnings for the shift are $512.00 versus $256.00 straight pay—providing an extra $256.00 in premium pay.',
    },
    {
      title: 'Utility Emergency Lineman (Storm Restoration 16-Hour Shift)',
      description: 'A utility lineman earns $48.00/hr base. During severe weather power restoration, they work 16 hours straight: Hours 1–8 = $384.00. Hours 9–12 (1.5×) = 4 × $72.00 = $288.00. Hours 13–16 (2.0× Double Time) = 4 × $96.00 = $384.00. Total earnings for the emergency shift equal $1,056.00.',
    },
    {
      title: 'Double-Time with Non-Discretionary Production Bonus',
      description: 'An employee earns $22.00/hr base and works 44 regular hours plus 4 double-time hours, while earning a $100.00 non-discretionary production bonus. Under 29 C.F.R. § 778.209, the bonus must be factored into the regular rate: Total straight earnings = (48 × $22) + $100 = $1,156.00. Blended regular rate = $1,156 ÷ 48 = $24.08/hr. The double-time rate becomes 2.0 × $24.08 = $48.16/hr, demonstrating how non-discretionary bonuses elevate premium wage rates.',
    },
  ],
  faqs: [
    {
      question: 'Is double-time required under the federal Fair Labor Standards Act (FLSA)?',
      answer: 'No. Federal law (FLSA 29 U.S.C. § 207) only requires overtime at 1.5× an employee\'s regular hourly rate for hours worked beyond 40 in a single workweek. The FLSA contains zero provisions requiring double-time (2.0×) pay. Double-time is only legally mandated by state statutes (principally California) or contractual agreements.',
    },
    {
      question: 'What are California\'s specific double-time requirements under Labor Code § 510?',
      answer: 'Under California Labor Code § 510, double-time (2.0× regular rate) is legally required in two specific scenarios for non-exempt workers: (1) Any hours worked in excess of 12 hours in a single workday. (2) Any hours worked in excess of 8 hours on the 7th consecutive day of work in a single workweek. (The first 8 hours on the 7th day are paid at 1.5×).',
    },
    {
      question: 'Do any other states besides California mandate double-time pay?',
      answer: 'California is currently the only US state with comprehensive mandatory daily double-time thresholds for general private-sector workers. Other states with daily overtime laws (such as Alaska, Nevada, and Colorado) require 1.5× after 8 or 12 hours per day, but do not escalate to 2.0× double-time. Certain territories (like Puerto Rico under specific statutes) have historical daily overtime provisions.',
    },
    {
      question: 'How does California double-time work on an alternative workweek schedule (4/10)?',
      answer: 'If employees have voted for and approved a valid alternative workweek schedule (such as four 10-hour days per week), the first 10 hours per day are paid at straight time. Hours worked between 10 and 12 in a workday are paid at 1.5×, and all hours worked beyond 12 hours in a workday are still strictly paid at double-time (2.0×).',
    },
    {
      question: 'Are bonuses included when calculating the double-time hourly rate?',
      answer: 'Yes. Under federal and state wage laws (29 C.F.R. § 778.109 and California DLSE guidelines), non-discretionary bonuses (e.g. attendance bonuses, production incentives, safety bonuses) must be factored into the employee\'s "regular rate of pay." The double-time rate is calculated as 2.0× this blended regular rate, not merely 2.0× the base hourly wage.',
    },
    {
      question: 'What should I do if my employer refuses to pay mandatory double-time in California?',
      answer: 'Failing to pay statutory double-time under California Labor Code § 510 constitutes wage theft. Non-exempt employees can file a wage claim with the California Labor Commissioner\'s Office (DLSE). Employers found non-compliant are liable for back pay, statutory interest, and liquidated damages under California Labor Code § 1194.2.',
    },
  ],
  relatedTools: [
    {
      slug: 'time-and-a-half-calculator',
      title: 'Time and a Half Calculator',
      description: 'Standard 1.5x overtime wage calculation',
      icon: 'AlarmClock',
    },
    {
      slug: 'overtime-calculator',
      title: 'Overtime Calculator',
      description: 'Comprehensive FLSA and California overtime calculations',
      icon: 'Timer',
    },
    {
      slug: 'holiday-pay-calculator',
      title: 'Holiday Pay Calculator',
      description: 'Holiday premium rates at 1.5x, 2.0x, or custom multipliers',
      icon: 'CalendarClock',
    },
    {
      slug: 'shift-pay-calculator',
      title: 'Shift Pay Calculator',
      description: 'Differential earnings across 1st, 2nd, and 3rd shifts',
      icon: 'CalendarClock',
    },
    {
      slug: 'hourly-paycheck-calculator',
      title: 'Hourly Paycheck Calculator',
      description: 'Net take-home pay after federal, state, and FICA deductions',
      icon: 'BadgeDollarSign',
    },
  ],
};

export default seoData;
