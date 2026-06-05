const seoData = {
  breadcrumbs: [{ label: 'Calculators' }, { label: 'FICA Tax Calculator' }],
  tableOfContents: [
        { id: 'how-to-calculate', label: 'How to Calculate' },
        { id: 'formula', label: 'Formula' },
        { id: 'worked-examples', label: 'Worked Examples' },
        { id: 'frequently-asked-questions', label: 'FAQs' },
        { id: 'related-calculators', label: 'Related Calculators' },
      ],
  howToSteps: [
        'Enter your annual gross wages or salary — this is your total compensation before any deductions.',
        'Select whether you are an employee or self-employed — self-employed individuals pay both the employee and employer share of FICA taxes.',
        'Click Calculate to see your Social Security tax, Medicare tax, Additional Medicare tax (if applicable), and total FICA withholding.',
        'Review the employer vs employee share breakdown and see how the 2025 Social Security wage base ($176,100) affects your liability.',
      ],
  formula: 'Social Security Tax = min(Gross, $176,100) × 6.2%\nMedicare Tax = Gross × 1.45%\nAdditional Medicare = (Gross − $200,000) × 0.9% (if applicable)\nSelf-Employment Tax = (Employee Share + Employer Share) × 0.9235',
  formulaDescription: "FICA stands for the Federal Insurance Contributions Act. It funds Social Security and Medicare. Employees pay 6.2% SS + 1.45% Medicare = 7.65% total, and employers match this amount. Self-employed workers pay the full 15.3% but deduct half as a business expense.",
  workedExamples: [
        { title: 'Standard Employee ($75,000)', description: 'An employee earning $75,000 pays: SS = $75,000 × 6.2% = $4,650. Medicare = $75,000 × 1.45% = $1,087.50. Total FICA: $5,737.50. Employer pays an equal $5,737.50.' },
        { title: 'High Earner ($250,000)', description: 'At $250,000, SS is capped at $176,100 × 6.2% = $10,918.20. Medicare = $250,000 × 1.45% = $3,625. Additional Medicare = ($250,000 − $200,000) × 0.9% = $450. Total employee FICA: $14,993.20.' },
        { title: 'Self-Employed ($80,000)', description: 'A self-employed individual at $80,000 pays the full 15.3%: SS = $4,960, Medicare = $1,160. Total SE tax = $12,240. They can deduct $6,120 (50%) as a business expense on Schedule SE.' },
      ],
  faqs: [
        { question: 'What is FICA tax?', answer: 'FICA (Federal Insurance Contributions Act) funds Social Security and Medicare. Employees pay 6.2% for Social Security (up to the $176,100 wage base in 2025) and 1.45% for Medicare. Employers match both amounts. Self-employed people pay the combined 15.3%.' },
        { question: 'What is the 2025 Social Security wage base?', answer: 'The 2025 Social Security wage base is $176,100. Wages above this amount are not subject to the 6.2% Social Security tax. However, all wages are subject to the 1.45% Medicare tax with no income cap.' },
        { question: 'What is the Additional Medicare Tax?', answer: 'The Additional Medicare Tax of 0.9% applies to wages, compensation, and self-employment income over $200,000 for single filers ($250,000 for married filing jointly). Only employees pay this — there is no employer match. Employers must withhold it once wages exceed $200,000.' },
        { question: 'How do self-employed workers handle FICA?', answer: 'Self-employed workers pay self-employment (SE) tax, which covers both the employee and employer portions (15.3% total). However, SE tax is calculated on 92.35% of net earnings (not 100%), and you can deduct 50% of the SE tax paid from your gross income on your tax return.' },
      ],
  relatedTools: [
        { slug: 'payroll-calculator', title: 'Payroll Calculator', description: 'Full paycheck after all deductions', icon: 'CreditCard' },
        { slug: 'tax-bracket-calculator', title: 'Tax Bracket Calculator', description: 'Federal income tax bracket analysis', icon: 'FileText' },
        { slug: 'after-tax-income-calculator', title: 'After-Tax Income', description: 'Net income after all taxes', icon: 'Wallet' },
        { slug: 'payroll-deduction-calculator', title: 'Payroll Deduction Calculator', description: 'Detailed paycheck deductions', icon: 'FileMinus' },
      ],
};

export default seoData;
