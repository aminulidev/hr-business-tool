const seoData = {
  howToSteps: [
    'Enter your gross pay per pay period — this is your total earnings before any taxes or deductions are taken out.',
    'Select your pay frequency: weekly, bi-weekly (every two weeks), semi-monthly (twice per month), or monthly.',
    'Enter your federal and state income tax withholding percentages. The defaults are approximate flat rates, your actual withholding may vary based on your W-4 elections and tax brackets.',
    'Enter your pre-tax deductions: health insurance premium (fixed dollar amount per period), 401(k) contribution (percentage of gross), and any other pre-tax deductions like HSA or FSA contributions.',
    'Click "Calculate Deductions" to see a complete itemized breakdown of all deductions, your taxable income, total taxes, and your net take-home pay per period.',
  ],

  formula:
    'Net Pay = Gross Pay − Pre-tax Deductions − Taxes − Post-tax Deductions',

  formulaDescription:
    'Payroll deductions are subtracted from gross pay in a specific order. Pre-tax deductions (like 401(k) contributions, health insurance premiums, HSA contributions, and FSA contributions) are taken out first, which reduces your taxable income — lowering the amount of federal and state income tax you owe. FICA taxes (Social Security at 6.2% and Medicare at 1.45%) are calculated on the reduced taxable income. Finally, post-tax deductions (like Roth 401(k) contributions, garnishments, or union dues) are subtracted from what remains. Pre-tax deductions provide a double benefit: you reduce your tax bill and save for the future simultaneously.',

  workedExamples: [
    {
      title: '$3,000 Bi-Weekly Gross with Standard Deductions',
      description:
        'An employee earns $3,000 bi-weekly. They contribute 5% to 401(k) ($150), pay $85 for health insurance, and have $25 in other pre-tax deductions. Total pre-tax = $260, taxable income = $2,740. Federal tax (12%) = $328.80, state tax (5%) = $137.00, Social Security (6.2%) = $169.88, Medicare (1.45%) = $39.73. Total taxes = $675.41. Net pay = $3,000.00 − $260.00 − $675.41 = $2,064.59 per period.',
    },
    {
      title: '$5,000 Semi-Monthly with High 401(k) Contributions',
      description:
        'An employee earns $5,000 semi-monthly and contributes 15% to 401(k) ($750), pays $200 for health insurance, and has $50 in HSA contributions. Total pre-tax = $1,000, taxable income = $4,000. Federal tax (22%) = $880.00, state tax (7%) = $280.00, FICA = $306.00. Total taxes = $1,466.00. Net pay = $5,000 − $1,000 − $1,466.00 = $2,534.00. The aggressive 401(k) savings significantly reduce taxable income and saves $352 in federal taxes per period compared to a 5% contribution.',
    },
    {
      title: '$1,200 Weekly with Minimal Deductions',
      description:
        'A part-time employee earns $1,200 weekly with no 401(k) or health insurance. Federal tax (10%) = $120.00, state tax (3%) = $36.00, FICA = $91.80. Total deductions = $247.80. Net pay = $952.20 per week. The effective deduction rate is 20.65%. This simple scenario shows how much of each paycheck goes to taxes when no pre-tax benefit deductions are available to reduce taxable income.',
    },
  ],

  faqs: [
    {
      question: 'What are pre-tax deductions?',
      answer:
        'Pre-tax deductions are amounts taken from your gross pay before income taxes are calculated. Common pre-tax deductions include 401(k) retirement plan contributions, health insurance premiums, dental and vision insurance, HSA (Health Savings Account) contributions, FSA (Flexible Spending Account) contributions, commuter benefits, and some life insurance premiums. Because these are deducted before taxes, they lower your taxable income, which means you pay less in federal and state income tax. For example, contributing $200 pre-tax to a 401(k) saves you approximately $24-$66 in federal taxes (depending on your bracket) compared to a post-tax contribution of the same amount.',
    },
    {
      question: 'What is FICA tax and how is it calculated?',
      answer:
        'FICA (Federal Insurance Contributions Act) tax consists of two components: Social Security tax (6.2% of wages) and Medicare tax (1.45% of wages), for a total of 7.65%. For 2025, Social Security tax applies to the first $176,100 of earnings (the "wage base limit"), after which no more Social Security tax is owed for the year. Medicare tax has no wage base limit — it applies to all earnings. Additionally, high earners pay an Additional Medicare Tax of 0.9% on earnings above $200,000 (single) or $250,000 (married filing jointly). Your employer matches your FICA contributions, paying an equal 7.65% on your behalf.',
    },
    {
      question: 'What are the 401(k) contribution limits?',
      answer:
        'For 2025, the IRS limits 401(k) employee contributions to $23,500 per year (up from $23,000 in 2024). If you are age 50 or older, you can make an additional "catch-up" contribution of $7,500, bringing the total to $31,000. These limits apply to traditional (pre-tax) 401(k) and Roth 401(k) contributions combined. The total annual addition limit (including employer matching) is $69,000 ($76,500 with catch-up). Contributing up to the limit, especially with pre-tax dollars, is one of the most effective ways to reduce your taxable income while saving for retirement.',
    },
    {
      question: 'What is the difference between HSA and FSA?',
      answer:
        'Both HSA (Health Savings Account) and FSA (Flexible Spending Account) allow pre-tax contributions for healthcare expenses, but they differ in key ways. An HSA is available only with a High Deductible Health Plan (HDHP), has a higher contribution limit ($4,300 individual / $8,550 family for 2025), and funds roll over year to year — you never lose the money. An FSA is available with most health plans, has a lower limit ($3,200 for 2025), and typically has a "use it or lose it" rule where unused funds are forfeited (though some employers offer a small rollover or grace period). HSAs are portable (you keep them if you change jobs) and can be invested for growth. Both reduce your taxable income dollar for dollar.',
    },
    {
      question: 'What happens if my deductions exceed my gross pay?',
      answer:
        'Your deductions cannot legally exceed your gross pay. If pre-tax deductions alone would reduce your pay below zero, your employer must limit them so that your taxable income is at least zero. Post-tax deductions are also limited by your remaining after-tax income. In practice, your net pay will never be negative. If you are trying to maximize 401(k) contributions but they would exceed your pay, your employer will reduce the contribution to the maximum allowed. For example, if you earn $500 and set your 401(k) to 100%, the system will cap the deduction at $500 (less any required deductions like FICA). Always ensure your total deduction percentage leaves room for required taxes.',
    },
    {
      question: 'How can I optimize my payroll deductions?',
      answer:
        'To optimize your deductions and maximize take-home pay: (1) Maximize pre-tax contributions to 401(k)/403(b) up to the annual limit — every dollar contributed reduces your taxable income. (2) Use an HSA if you have an HDHP — it offers a triple tax benefit (deductible contributions, tax-free growth, tax-free withdrawals for medical expenses). (3) Review your W-4 withholding to avoid over- or under-withholding. (4) Take advantage of commuter benefits and dependent care FSAs if applicable. (5) Consider Roth vs. traditional 401(k) based on your current vs. expected future tax bracket. (6) Review your benefit elections annually during open enrollment to ensure they align with your current needs and financial goals.',
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
      slug: 'after-tax-income-calculator',
      title: 'After-Tax Income Calculator',
      description:
        'Calculate your net income after federal and state taxes with detailed breakdown',
      icon: 'Wallet',
    },
    {
      slug: 'salary-tax-calculator',
      title: 'Salary Tax Calculator',
      description:
        'Calculate total tax on your salary with federal, state, FICA, and local taxes',
      icon: 'Shield',
    },
    {
      slug: 'hourly-paycheck-calculator',
      title: 'Hourly Paycheck Calculator',
      description:
        'Calculate your hourly paycheck after taxes and deductions',
      icon: 'BadgeDollarSign',
    },
    {
      slug: 'tax-bracket-calculator',
      title: 'Tax Bracket Calculator',
      description:
        'Find your federal tax bracket, effective and marginal tax rates',
      icon: 'FileText',
    },
  ],

  
};

export default seoData;
