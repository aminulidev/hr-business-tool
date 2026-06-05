const seoData = {
  howToSteps: [
    'Enter your hourly pay rate — this is the amount you earn per regular hour worked before any taxes or deductions.',
    'Enter the number of regular hours you work per week (typically 40 for full-time). Also enter any overtime hours if applicable.',
    'Select your pay frequency: weekly, bi-weekly (every two weeks), semi-monthly (twice per month), or monthly. This determines how many paychecks you receive per year.',
    'Enter your federal and state tax withholding percentages. The defaults (12% federal, 5% state) are approximate flat rates. Toggle FICA on or off — when enabled, Social Security (6.2%) and Medicare (1.45%) totaling 7.65% are included.',
    'Optionally, enter any additional per-period deductions (like union dues, garnishments, or parking fees). Click "Calculate Paycheck" to see your gross pay, all deductions, net pay per period and per year, and your effective hourly rate after taxes.',
  ],

  formula:
    'Net Pay = Gross Pay − Federal Tax − State Tax − FICA − Other Deductions',

  formulaDescription:
    'Your gross hourly paycheck is calculated by multiplying your hours worked by your hourly rate, with overtime hours paid at 1.5x the regular rate. From this gross amount, federal income tax, state income tax, and FICA (Social Security 6.2% + Medicare 1.45% = 7.65%) are deducted as percentages. Any additional fixed deductions are also subtracted. The effective hourly rate is calculated by dividing your annual net take-home pay by your total annual hours worked — this tells you what you actually earn per hour after all taxes and deductions are taken into account. This "real" hourly rate is useful for comparing job offers or evaluating whether overtime is worthwhile.',

  workedExamples: [
    {
      title: '$15/hr at 40 Hours/Week, Bi-Weekly',
      description:
        'At $15.00/hr working 40 regular hours/week with no overtime, the weekly gross is $600.00. Bi-weekly gross (2 weeks) = $1,200.00. Annual gross = $31,200.00. Federal tax (12%) = $144.00/period, state tax (5%) = $60.00/period, FICA (7.65%) = $91.80/period. Net per period = $1,200.00 − $295.80 = $904.20. Annual net = $23,509.20. Effective hourly rate after taxes = $904.20 / (40 × 2) = $11.30/hr. Your actual take-home is about 75.3% of your gross rate.',
    },
    {
      title: '$25/hr at 40 Hours/Week with 5 OT Hours, Bi-Weekly',
      description:
        'At $25.00/hr with 40 regular + 5 overtime hours/week, weekly gross = $1,000 (regular) + $187.50 (OT) = $1,187.50. Bi-weekly gross = $2,375.00. Federal tax (12%) = $285.00, state tax (5%) = $118.75, FICA = $181.69. Net per period = $2,375.00 − $585.44 (incl. other) = $1,789.56. Annual net = $46,528.48. Effective hourly rate = $1,789.56 / 90 = $19.88/hr. The 5 OT hours add $375/week in gross but also increase tax withholding proportionally.',
    },
    {
      title: '$50/hr at 40 Hours/Week, Monthly Pay',
      description:
        'At $50.00/hr with 40 regular hours/week, weekly gross = $2,000. Monthly gross (52/12 ≈ 4.33 weeks) = $8,666.67. Federal tax (22%) = $1,906.67, state tax (5%) = $433.33, FICA = $663.00. Net per month = $8,666.67 − $3,003.00 = $5,663.67. Annual net = $67,964.04. Effective hourly rate = $5,663.67 / (40 × 4.33) = $32.69/hr. At this income level, the effective hourly rate after taxes is roughly 65% of the gross rate.',
    },
  ],

  faqs: [
    {
      question: 'How is hourly pay taxed?',
      answer:
        'Hourly pay is taxed the same way as salary income — there is no separate tax treatment. Your employer withholds federal income tax, state income tax (if applicable), Social Security (6.2%), and Medicare (1.45%) from each paycheck based on the information you provide on your W-4 form. The amount withheld depends on your earnings, filing status, number of allowances/dependents, and any additional withholding you elect. For overtime pay specifically, the additional earnings are added to your regular pay for the period, which may push more income into a higher tax bracket for that pay period, resulting in a slightly higher withholding percentage.',
    },
    {
      question: 'What is FICA and why is it taken from my paycheck?',
      answer:
        'FICA (Federal Insurance Contributions Act) is a mandatory payroll tax that funds Social Security and Medicare programs. You pay 6.2% of your wages (up to $176,100 in 2025) for Social Security and 1.45% on all wages for Medicare, totaling 7.65%. Your employer matches this amount, contributing an equal 7.65% on your behalf, making the total FICA contribution 15.3% of your wages. FICA is separate from income tax and cannot be reduced by filing status or deductions (though pre-tax deductions like 401(k) reduce the wages FICA is calculated on). Self-employed individuals pay the full 15.3% as the Self-Employment Tax.',
    },
    {
      question: 'Is overtime pay taxed differently?',
      answer:
        'No, overtime pay is not taxed at a higher rate. It is taxed the same as your regular wages — it is simply added to your gross earnings for the pay period, which may cause more of your income to fall into a higher withholding bracket temporarily. This often leads to the misconception that overtime is "taxed more." In reality, your tax bracket for the year is determined by your total annual income. If overtime pushes your annual income into a higher bracket, only the income above the bracket threshold is taxed at the higher rate. The extra withholding in overtime paychecks is often refunded when you file your tax return if it exceeds your actual tax liability.',
    },
    {
      question: 'How does pay frequency affect my withholding?',
      answer:
        'Pay frequency (weekly, bi-weekly, semi-monthly, monthly) affects the size of each paycheck but does not change your total annual tax liability. With more frequent pay periods (e.g., weekly), each check is smaller and the withholding per check is proportionally less. With less frequent pay periods (e.g., monthly), each check is larger and withholding per check is higher. However, the total tax paid over the year remains the same for the same annual income. Pay frequency can affect cash flow timing — weekly pay provides more frequent access to money but smaller amounts, while monthly pay provides larger sums less frequently.',
    },
    {
      question: 'What is the difference between an independent contractor and an employee for taxes?',
      answer:
        'The key tax difference is that employees have taxes withheld by their employer (federal/state income tax + 7.65% FICA), while independent contractors receive their full pay with no withholding and are responsible for paying all taxes themselves. Contractors pay the full 15.3% Self-Employment Tax (both employer and employee portions of FICA) plus income tax via quarterly estimated tax payments. Contractors can deduct business expenses (mileage, supplies, home office) before calculating taxable income, which can significantly reduce their tax burden. Employees generally cannot deduct work-related expenses. The IRS has strict rules about worker classification — misclassifying employees as contractors can result in significant penalties.',
    },
    {
      question: 'How can I increase my take-home pay?',
      answer:
        'Several strategies can boost your take-home pay: (1) Adjust your W-4 withholding — if you consistently receive large refunds, you are over-withholding. Increase allowances to reduce federal tax withholding per paycheck. (2) Contribute to pre-tax retirement accounts (401(k), 403(b), traditional IRA) — every dollar contributed reduces your taxable income. (3) Use a Health Savings Account (HSA) if eligible — triple tax advantage with pre-tax contributions. (4) Use pre-tax commuter benefits and dependent care FSAs. (5) Negotiate a higher hourly rate — even a small increase compounds significantly over time. (6) Consider overtime if available — even after taxes, OT premium pay provides net additional income. (7) Review your pay stubs regularly to catch errors.',
    },
  ],

  relatedTools: [
    {
      slug: 'payroll-calculator',
      title: 'Payroll & Paycheck Calculator',
      description:
        'Estimate your take-home pay after federal and state taxes and deductions',
      icon: 'CreditCard',
    },
    {
      slug: 'wages-calculator',
      title: 'Wages Calculator',
      description:
        'Calculate gross wages from hours worked and hourly rates with overtime',
      icon: 'Banknote',
    },
    {
      slug: 'salary-converter',
      title: 'Salary Converter Calculator',
      description:
        'Convert between hourly, daily, weekly, and annual salary rates',
      icon: 'ArrowLeftRight',
    },
    {
      slug: 'overtime-calculator',
      title: 'Overtime Calculator',
      description:
        'Calculate overtime pay with standard time-and-a-half and double-time rates',
      icon: 'Timer',
    },
    {
      slug: 'after-tax-income-calculator',
      title: 'After-Tax Income Calculator',
      description:
        'Calculate your net income after federal and state taxes with detailed breakdown',
      icon: 'Wallet',
    },
  ],

  
};

export default seoData;
