const seoData = {
  howToSteps: [
    'Enter your annual gross salary before any deductions. This is the total amount shown on your employment offer or W-2 form.',
    'Select your federal filing status: Single, Married Filing Jointly, Married Filing Separately, or Head of Household. This determines which tax brackets and standard deduction apply.',
    'Enter your state income tax rate as a flat percentage. Since state tax systems vary widely, this calculator uses a simplified flat rate. Leave blank or enter 0 for states with no income tax.',
    'Optionally, enter a local or city tax percentage if your municipality imposes an additional income tax (e.g., New York City, Detroit, or certain Ohio cities).',
    'Click "Calculate Tax" to see a detailed breakdown including federal tax by bracket, FICA taxes, your effective and marginal rates, and take-home pay on monthly, weekly, and daily bases.',
  ],

  formula:
    'Effective Tax Rate = (Total Taxes / Gross Salary) × 100%',

  formulaDescription:
    'The United States uses a progressive tax system, meaning income is taxed at increasing rates as it rises through tax brackets. Your first dollars of taxable income are taxed at 10%, and only the dollars above each bracket threshold are taxed at the higher rate. Your effective tax rate is the average rate across all brackets — it is always lower than your marginal (top) bracket rate because of this graduated structure. FICA taxes (Social Security at 6.2% up to the $176,100 wage base, and Medicare at 1.45% on all wages plus 0.9% on earnings above $200,000) are separate from income tax and are calculated on your gross salary before the standard deduction. The standard deduction ($15,000 single / $30,000 MFJ / $22,500 HoH for 2025) reduces your taxable income before bracket calculations begin.',

  workedExamples: [
    {
      title: '$50,000 Salary — Single Filer',
      description:
        'With a $50,000 salary filing single, the standard deduction of $15,000 brings taxable income to $35,000. Federal tax: 10% on the first $11,925 ($1,192.50) + 12% on the remaining $23,075 ($2,769.00) = $3,961.50. Social Security: 6.2% of $50,000 = $3,100. Medicare: 1.45% of $50,000 = $725. State tax (5%): $2,500. Total taxes: ~$10,286.50. Effective rate: 20.6%. Take-home: ~$39,714/year ($3,309/month).',
    },
    {
      title: '$100,000 Salary — Married Filing Jointly',
      description:
        'With $100,000 filing MFJ, the standard deduction of $30,000 gives taxable income of $70,000. Federal tax: 10% on $23,850 ($2,385.00) + 12% on $46,150 ($5,538.00) = $7,923.00. Social Security: 6.2% of $100,000 = $6,200. Medicare: 1.45% = $1,450. State tax (5%): $5,000. Total taxes: ~$20,573. Effective rate: 20.6%. Take-home: ~$79,427/year ($6,619/month). Filing jointly significantly lowers the tax burden compared to two single filers.',
    },
    {
      title: '$200,000 Salary — Single Filer',
      description:
        'A $200,000 single salary with standard deduction $15,000 gives $185,000 taxable. Federal tax spans four brackets: 10% on $11,925 ($1,192.50) + 12% on $36,550 ($4,386.00) + 22% on $54,875 ($12,072.50) + 24% on $81,650 ($19,596.00) = $37,247.00. Social Security: 6.2% on $176,100 = $10,918.20. Medicare: 1.45% on $200,000 = $2,900 + 0.9% on amount above $200,000 = $0 (exactly at threshold). State tax (5%): $10,000. Total taxes: ~$61,065.20. Effective rate: 30.5%. Marginal rate: 24%. Take-home: ~$138,935/year ($11,578/month).',
    },
  ],

  faqs: [
    {
      question: 'Why is my effective tax rate lower than my bracket rate?',
      answer:
        'Because the US uses a progressive (graduated) tax system, not a flat tax. Only the income within each bracket is taxed at that bracket\'s rate. For example, if you\'re in the 22% bracket, only your income above the 22% threshold is taxed at 22%. Your income below that threshold is taxed at 10% and 12%. Your effective rate is a weighted average of all the rates applied to portions of your income, so it\'s always lower than your marginal (top) bracket rate. This is a common source of confusion — being "in the 22% bracket" does NOT mean all your income is taxed at 22%.',
    },
    {
      question: 'What is FICA and how is it calculated?',
      answer:
        'FICA (Federal Insurance Contributions Act) is the combined tax for Social Security and Medicare, totaling 7.65% of your wages. Social Security tax is 6.2% on wages up to $176,100 (2025 wage base) — once you earn above this amount, no more Social Security tax is withheld for the year. Medicare tax is 1.45% on all wages with no cap. Additionally, high earners pay an Additional Medicare Tax of 0.9% on wages exceeding $200,000 (single) or $250,000 (married filing jointly). Your employer matches your FICA contributions, paying an equal 7.65%, so the total cost is 15.3% of your wages.',
    },
    {
      question: 'What is the Social Security wage base?',
      answer:
        'The Social Security wage base is the maximum amount of earnings subject to Social Security tax in a given year. For 2025, the wage base is $176,100. Once your cumulative earnings reach this amount, no further Social Security tax (6.2%) is withheld for the rest of the year, though Medicare tax (1.45%) continues on all earnings. The wage base is adjusted annually for inflation by the Social Security Administration. If you earn $200,000, you\'ll pay Social Security tax on the first $176,100 ($10,918.20) and Medicare tax on the full $200,000 ($2,900.00 plus potential additional Medicare tax).',
    },
    {
      question: 'What is the Additional Medicare Tax?',
      answer:
        'The Additional Medicare Tax is a 0.9% surtax on earnings above a threshold: $200,000 for single filers, $250,000 for married filing jointly, and $125,000 for married filing separately. Unlike regular Medicare tax, there is no employer match for the Additional Medicare Tax — you pay the full 0.9%. This tax applies to wages and self-employment income combined. For example, if you earn $250,000 as a single filer, you\'ll pay an extra $450 (0.9% × $50,000) in Additional Medicare Tax on top of the regular 1.45% Medicare tax on all your earnings.',
    },
    {
      question: 'Why does state tax vary so much?',
      answer:
        'State income tax systems vary dramatically. Seven states (Alaska, Florida, Nevada, South Dakota, Texas, Washington, Wyoming) have no state income tax at all. Others have flat rates (e.g., Colorado at 4.4%, Illinois at 4.95%, Pennsylvania at 3.07%), while most use progressive brackets like the federal system (e.g., California ranges from 1% to 13.3%, New York from 4% to 10.9%). Some states also allow local/city income taxes. This calculator simplifies by using a flat rate you provide, but your actual state tax may be calculated differently depending on your state\'s rules, deductions, and credits. Always check your state\'s specific tax calculator for the most accurate result.',
    },
    {
      question: 'How can I reduce my taxable income?',
      answer:
        'Several strategies can lower your taxable income: (1) Maximize pre-tax retirement contributions — 401(k) up to $23,500 ($31,000 age 50+), traditional IRA up to $7,000 ($8,000 age 50+). (2) Use Health Savings Account (HSA) if eligible — $4,300 individual / $8,550 family in 2025. (3) Itemize deductions if they exceed the standard deduction (mortgage interest, state taxes up to $10,000 SALT cap, charitable donations). (4) Contribute to FSAs for healthcare or dependent care. (5) Use above-the-line deductions like student loan interest ($2,500 max) and educator expenses ($300). (6) Consider tax-loss harvesting for investment losses. (7) Maximize tax credits (child tax credit, education credits) which directly reduce tax owed rather than just taxable income.',
    },
  ],

  relatedTools: [
    {
      slug: 'tax-bracket-calculator',
      title: 'Tax Bracket Calculator',
      description:
        'Find your federal tax bracket, effective and marginal tax rates',
      icon: 'FileText',
    },
    {
      slug: 'after-tax-income-calculator',
      title: 'After-Tax Income Calculator',
      description:
        'Calculate your net income after federal and state taxes with detailed breakdown',
      icon: 'Wallet',
    },
    {
      slug: 'tax-refund-estimator',
      title: 'Tax Refund Calculator',
      description:
        'Estimate your federal and state tax refund based on withholding and deductions',
      icon: 'Receipt',
    },
    {
      slug: 'payroll-calculator',
      title: 'Payroll & Paycheck Calculator',
      description:
        'Estimate your take-home pay after federal and state taxes and deductions',
      icon: 'CreditCard',
    },
    {
      slug: 'salary-converter',
      title: 'Salary Converter Calculator',
      description:
        'Convert between hourly, daily, weekly, and annual salary rates',
      icon: 'ArrowLeftRight',
    },
    {
      slug: 'property-tax-calculator',
      title: 'Property Tax Calculator',
      description:
        'Estimate your annual property tax from assessed value and tax rate',
      icon: 'Building2',
    },
  ],

  
};

export default seoData;
