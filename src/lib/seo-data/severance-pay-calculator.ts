const seoData = {
  breadcrumbs: [{ label: 'Calculators' }, { label: 'Severance Pay Calculator' }],
  tableOfContents: [
        { id: 'how-to-calculate', label: 'How to Calculate' },
        { id: 'formula', label: 'Formula' },
        { id: 'worked-examples', label: 'Worked Examples' },
        { id: 'frequently-asked-questions', label: 'FAQs' },
        { id: 'related-calculators', label: 'Related Calculators' },
      ],
  howToSteps: [
        'Enter your base annual salary — the gross yearly pay used to calculate your weekly severance rate.',
        'Enter your years of service — the number of complete years you worked for the employer.',
        'Select your severance multiplier — typically 1 or 2 weeks of pay per year of service depending on company policy.',
        'Optionally enter a severance cap (maximum weeks) if your company limits total severance payout.',
        'Click Calculate to see your total severance weeks, gross severance pay, and estimated take-home amount.',
      ],
  formula: 'Weekly Rate = Annual Salary / 52\nTotal Severance Weeks = Years of Service × Weeks-per-Year Multiplier\nTotal Severance = Weekly Rate × Total Weeks',
  formulaDescription: "Most US companies calculate severance as 1–2 weeks of pay for each year of service. Some employers offer one month per year for senior employees. The total is often capped at a maximum number of weeks (commonly 26 weeks). There is no federal law requiring severance pay, but many employers provide it as a contractual obligation.",
  workedExamples: [
        { title: 'Mid-Career Layoff', description: 'An employee earning $80,000/year with 8 years of service at 2 weeks/year: 8 × 2 = 16 weeks severance. Weekly rate: $1,538.46. Total severance: $24,615.38.' },
        { title: 'Senior Manager', description: 'A manager at $150,000/year with 15 years at 2 weeks/year, capped at 26 weeks: 15 × 2 = 30 weeks → capped at 26 weeks. Total: $75,000.' },
        { title: 'Entry-Level Role', description: 'An employee at $45,000/year with 3 years at 1 week/year: 3 weeks severance. Weekly rate: $865.38. Total: $2,596.15.' },
      ],
  faqs: [
        { question: 'Is severance pay required by law?', answer: 'No — there is no federal law in the US requiring employers to provide severance pay. Severance is typically governed by employment contracts, company policy, or collective bargaining agreements. The WARN Act requires 60 days notice (or pay in lieu) for mass layoffs at companies with 100+ employees.' },
        { question: 'How is severance pay taxed?', answer: 'Severance pay is fully taxable as ordinary income and is subject to federal income tax, Social Security, and Medicare withholding. Employers typically withhold at the federal supplemental rate of 22% for amounts up to $1 million. Your actual tax rate depends on your total income for the year.' },
        { question: 'What is a typical severance package?', answer: 'The most common formula is 1–2 weeks of pay per year of service. Entry-level employees often receive 1 week/year, while managers and executives may receive 2–4 weeks/year. Packages sometimes include continued health benefits (COBRA), outplacement services, and accelerated vesting of stock.' },
        { question: 'Can I negotiate my severance package?', answer: 'Yes — severance agreements are often negotiable, especially for senior roles. You may be able to negotiate more weeks of pay, extended benefits coverage, or a lump-sum payment. Consulting an employment attorney before signing a severance agreement is advisable, especially if it includes a release of claims.' },
        { question: 'Does severance affect unemployment benefits?', answer: 'It depends on your state. Some states reduce or delay unemployment benefits during the period covered by severance pay. Check with your state unemployment office for specific rules.' },
      ],
  relatedTools: [
        { slug: 'salary-converter', title: 'Salary Converter', description: 'Convert salary to weekly, monthly rates', icon: 'ArrowLeftRight' },
        { slug: 'after-tax-income-calculator', title: 'After-Tax Income', description: 'Estimate take-home after taxes', icon: 'Wallet' },
        { slug: 'employee-turnover-calculator', title: 'Employee Turnover Calculator', description: 'Calculate turnover rate & cost', icon: 'Users' },
        { slug: 'payroll-calculator', title: 'Payroll Calculator', description: 'Full paycheck calculation', icon: 'CreditCard' },
      ],
};

export default seoData;
