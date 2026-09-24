const seoData = {
  breadcrumbs: [{ label: 'Calculators' }, { label: 'Payroll Cost Calculator' }],
  tableOfContents: [
    { id: 'how-to-calculate', label: 'How to Calculate' },
    { id: 'formula', label: 'Formula' },
    { id: 'worked-examples', label: 'Worked Examples' },
    { id: 'frequently-asked-questions', label: 'FAQs' },
    { id: 'related-calculators', label: 'Related Calculators' },
  ],
  howToSteps: [
    'Enter total gross wages (annual payroll before taxes).',
    'Enter employer FICA % (7.65% = SS 6.2% + Medicare 1.45%).',
    'Enter FUTA % (federal unemployment, 0.6% on first $7k).',
    'Enter SUTA % (state unemployment, varies 1-5% by state and experience).',
    'Enter workers comp premium (annual).',
    'Enter payroll service fees (ADP, Gusto, etc.).',
  ],
  formula: 'FICA = Wages x (FICA% / 100)\nFUTA = Wages x (FUTA% / 100)\nSUTA = Wages x (SUTA% / 100)\nTotal Taxes = FICA + FUTA + SUTA\nTotal Cost = Wages + Taxes + WC + Fees\nLoaded = Total Cost / Wages',
  formulaDescription: 'Total payroll cost = gross wages + employer taxes (FICA 7.65% + FUTA 0.6% + SUTA 1-5%) + workers comp + payroll service fees. Loaded multiplier: 1.08-1.15x wages (employer burden). SUTA varies by state and experience rating.',
  workedExamples: [
    { title: 'Small Business', description: '$500k wages, 7.65% FICA, 0.6% FUTA, 3% SUTA, $8k WC, $5k fees. FICA = $38.25k, FUTA = $3k, SUTA = $15k. Total taxes = $56.25k. Total = $569.25k. Loaded 1.14x.' },
    { title: 'Mid-Size', description: '$2M wages, 7.65% FICA, 0.6% FUTA, 3.5% SUTA, $20k WC, $12k fees. FICA = $153k, FUTA = $12k, SUTA = $70k. Total = $2.267M. Loaded 1.13x.' },
    { title: 'High-SUTA State', description: '$1M wages, 7.65% FICA, 0.6% FUTA, 5.5% SUTA (CA new employer), $15k WC, $8k fees. FICA = $76.5k, FUTA = $6k, SUTA = $55k. Total = $1.16M. Loaded 1.16x.' },
    { title: 'Low-SUTA State', description: '$1M wages, 7.65% FICA, 0.6% FUTA, 1.2% SUTA (experienced FL employer), $10k WC, $8k fees. FICA = $76.5k, FUTA = $6k, SUTA = $12k. Total = $1.113M. Loaded 1.11x.' },
    { title: 'Large Enterprise', description: '$10M wages, 7.65% FICA, 0.6% FUTA, 2.8% SUTA, $80k WC, $40k fees. Total = $11.389M. Loaded 1.14x.' },
  ],
  faqs: [
    { question: 'What is total payroll cost?', answer: 'Total payroll cost = gross wages + employer taxes (FICA 7.65%, FUTA 0.6%, SUTA 1-5%) + workers comp insurance + payroll service fees. Loaded multiplier: 1.08-1.15x wages (employer burden). Does NOT include benefits (health, 401k) — see Employee Cost Calculator for full loaded cost.' },
    { question: 'What are employer payroll taxes?', answer: 'FICA: Social Security 6.2% (on wages up to $176,100 in 2026) + Medicare 1.45% (no cap) + Additional Medicare 0.9% (over $200k). FUTA: 0.6% on first $7,000/wage base. SUTA: state unemployment, varies 0.1-5.4% based on state and experience rating. Total employer tax burden: 8-13% of wages.' },
    { question: 'How is SUTA calculated?', answer: 'SUTA (State Unemployment Tax Act) rates vary by state (0.1% to 5.4%+) and employer experience rating. New employers start at "new employer rate" (2-5%). Experience rating adjusts based on former employees\' unemployment claims — more claims = higher rate. Reassess annually. Some states (CA, NJ, PA) also have employee-paid SUTA.' },
    { question: 'What is the employer FICA match?', answer: 'Employer pays 7.65% FICA match on employee wages: 6.2% Social Security (up to $176,100 wage base in 2026) + 1.45% Medicare (no cap). Employee also pays 7.65% (total 15.3% to IRS). Additional Medicare 0.9% (over $200k) is employee-only — no employer match. Self-employed pay both halves via SECA (15.3%).' },
    { question: 'How much do payroll services cost?', answer: 'ADP, Gusto, Paychex, QuickBooks Payroll: $30-$200/month base + $4-$12/employee/month. Full-service (tax filing, direct deposit, year-end forms) typically $40-$150/month + $6-$15/employee. Large companies: $5-$15/employee/month. Compare: in-house payroll cost vs outsourcing. Most companies <500 employees outsource.' },
    { question: 'What is the difference between payroll cost and labor cost?', answer: 'Payroll cost = wages + employer taxes + WC + payroll fees (no benefits). Labor cost = payroll cost + benefits (health, retirement, PTO) + overhead. Loaded cost per employee = labor cost / headcount (includes everything). See our Labor Cost Calculator for total labor cost including benefits.' },
  ],
  relatedTools: [
    { slug: 'employee-turnover-calculator', title: 'Employee Turnover Calculator', description: 'Turnover rate and cost', icon: 'Users' },
    { slug: 'cost-of-turnover-calculator', title: 'Cost of Turnover Calculator', description: 'Financial impact of attrition', icon: 'DollarSign' },
    { slug: 'employee-retention-calculator', title: 'Employee Retention Calculator', description: 'Retention rate tracking', icon: 'Users' },
    { slug: 'employee-cost-calculator', title: 'Employee Cost Calculator', description: 'True cost per employee', icon: 'DollarSign' },
    { slug: 'labor-cost-calculator', title: 'Labor Cost Calculator', description: 'Total labor as % of revenue', icon: 'Wallet' },
  ],
};
export default seoData;
