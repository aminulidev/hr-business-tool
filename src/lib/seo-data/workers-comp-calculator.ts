const seoData = {
  breadcrumbs: [{ label: 'Calculators' }, { label: 'Workers Comp Calculator' }],
  tableOfContents: [
        { id: 'how-to-calculate', label: 'How to Calculate' },
        { id: 'formula', label: 'Formula' },
        { id: 'worked-examples', label: 'Worked Examples' },
        { id: 'frequently-asked-questions', label: 'FAQs' },
        { id: 'related-calculators', label: 'Related Calculators' },
      ],
  howToSteps: [
        'Enter your total annual payroll — the sum of all wages paid to employees covered by workers comp.',
        'Select a job classification code from the quick reference list, or manually enter the rate per $100 of payroll for your industry.',
        'Enter your Experience Modification Rate (EMR). A rate of 1.0 is average. Below 1.0 means fewer claims (lower cost); above 1.0 means higher risk history.',
        'Optionally enter the number of employees to see the cost per employee breakdown.',
        'Click Calculate to see your estimated base premium and modified premium after EMR adjustment.',
      ],
  formula: 'Base Premium = (Annual Payroll / 100) × Rate per $100\nModified Premium = Base Premium × EMR\nCost per Employee = Modified Premium / Number of Employees',
  formulaDescription: "Workers compensation premiums are calculated per $100 of payroll using class-code-specific rates that reflect the injury risk of different occupations. The Experience Modification Rate (EMR) adjusts the premium based on a company's actual claims history versus expected claims for its industry. An EMR below 1.0 reduces the premium; above 1.0 increases it.",
  workedExamples: [
        { title: 'Office Company', description: 'Annual payroll of $500,000, clerical rate $0.30/$100, EMR 0.85. Base premium: $1,500. Modified: $1,500 × 0.85 = $1,275. Cost per employee (10 staff): $127.50/employee.' },
        { title: 'Construction Firm', description: 'Annual payroll of $2M, carpentry rate $8.50/$100, EMR 1.2 (above average claims). Base premium: $170,000. Modified: $204,000. Cost per employee (20 workers): $10,200/employee.' },
        { title: 'Retail Store', description: 'Annual payroll of $800,000, retail rate $1.20/$100, EMR 0.95. Base premium: $9,600. Modified: $9,120. 15 employees = $608/employee/year.' },
      ],
  faqs: [
        { question: 'What is workers compensation insurance?', answer: 'Workers compensation insurance provides wage replacement and medical benefits to employees injured on the job. In exchange, employees give up the right to sue their employer for negligence. It is required by law in almost all US states for employers with one or more employees.' },
        { question: 'What is an EMR (Experience Modification Rate)?', answer: 'The EMR (also called experience mod or X-mod) compares your company\'s actual claim losses to the expected losses for businesses of your type and size. An EMR of 1.0 is the industry average. An EMR of 0.8 means your claims are 20% below average, which reduces your premium by 20%. An EMR of 1.3 means 30% above average.' },
        { question: 'What is a classification code?', answer: 'Workers comp classification codes (class codes) group employees by the type of work they perform. Each code has a different rate per $100 of payroll based on the injury risk associated with that job type. Office workers (8810) might have a rate of $0.30/$100, while roofers might be $25/$100 or more.' },
        { question: 'How can I lower my workers comp premiums?', answer: 'Reduce claims through safety training programs and proper equipment. Implement a return-to-work program for injured employees. Regularly audit your payroll classifications to ensure accuracy. Keep your EMR below 1.0 by preventing accidents. Request a premium audit if you think your payroll is being over-reported.' },
        { question: 'Is workers comp the same in every state?', answer: 'No — workers comp is regulated at the state level. Rates, required coverage, benefits, and class codes vary significantly by state. Some states have monopolistic state funds (WA, ND, OH, WY) where you must buy coverage from the state.' },
      ],
  relatedTools: [
        { slug: 'cost-per-hire-calculator', title: 'Cost per Hire Calculator', description: 'Total recruiting cost analysis', icon: 'Briefcase' },
        { slug: 'employee-turnover-calculator', title: 'Employee Turnover Calculator', description: 'Turnover rate & cost impact', icon: 'Users' },
        { slug: 'payroll-calculator', title: 'Payroll Calculator', description: 'Full employee paycheck calculation', icon: 'CreditCard' },
        { slug: 'severance-pay-calculator', title: 'Severance Pay Calculator', description: 'Calculate severance packages', icon: 'UserMinus' },
  ],

};

export default seoData;
