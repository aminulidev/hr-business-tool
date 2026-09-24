const seoData = {
  breadcrumbs: [{ label: 'Calculators' }, { label: 'Employee Cost Calculator' }],
  tableOfContents: [
    { id: 'how-to-calculate', label: 'How to Calculate' },
    { id: 'formula', label: 'Formula' },
    { id: 'worked-examples', label: 'Worked Examples' },
    { id: 'frequently-asked-questions', label: 'FAQs' },
    { id: 'related-calculators', label: 'Related Calculators' },
  ],
  howToSteps: [
    'Enter annual base salary.',
    'Enter benefits cost as % of salary (typically 28-32% per BLS).',
    'Enter employer payroll taxes % (FICA 7.65% + FUTA + SUTA = ~9-13%).',
    'Enter workers comp premium per employee per year.',
    'Enter equipment and software cost per employee per year.',
    'Enter overhead allocation per employee (rent, utilities, admin).',
  ],
  formula: 'Benefits = Salary x (Benefits% / 100)\nPayroll Taxes = Salary x (Tax% / 100)\nTotal Cost = Salary + Benefits + Taxes + WC + Equipment + Overhead\nLoaded Multiplier = Total Cost / Salary\nHourly Cost = Total Cost / 2080',
  formulaDescription: 'True cost per employee = salary + benefits (30%) + payroll taxes (9%) + workers comp + equipment + overhead. Loaded multiplier 1.25-1.40x is typical. Use for pricing (charge rate must exceed loaded cost) and headcount planning.',
  workedExamples: [
    { title: 'Office Worker', description: '$75k salary, 30% benefits, 9% taxes, $1,200 WC, $3,500 equipment, $5,000 overhead. Benefits = $22.5k, taxes = $6.75k. Total = $113,950. Loaded 1.52x. Hourly = $54.78.' },
    { title: 'Software Engineer', description: '$130k salary, 30% benefits, 9% taxes, $800 WC, $5,000 equipment, $8,000 overhead. Total = $197,580. Loaded 1.52x. Charge rate = $200+/hr.' },
    { title: 'Restaurant Server', description: '$25k salary, 25% benefits, 10% taxes, $2,500 WC, $500 equipment, $1,000 overhead. Total = $37,250. Loaded 1.49x.' },
    { title: 'Sales Rep', description: '$80k base + $40k commission = $120k, 28% benefits, 9% taxes, $1,500 WC, $3,000 equipment (CRM, phone), $5,000 overhead. Total = $174,260. Loaded 1.45x.' },
    { title: 'Manufacturing Worker', description: '$45k salary, 30% benefits, 9% taxes, $3,000 WC (high injury), $2,000 equipment, $3,000 overhead. Total = $67,905. Loaded 1.51x.' },
  ],
  faqs: [
    { question: 'What is the true cost of an employee?', answer: 'True cost = salary + benefits (30%) + payroll taxes (9%) + workers comp + equipment + overhead. Loaded multiplier 1.25-1.40x base salary. Example: $75k salary × 1.35 = $101,250 loaded cost. Use for pricing, headcount planning, and total compensation statements. See our Employee Benefit Cost Calculator.' },
    { question: 'What is loaded cost per employee?', answer: 'Loaded cost = total cost of employing someone, including all direct and indirect costs. Formula: salary + benefits + payroll taxes + WC + equipment + overhead. Multiplier: 1.25-1.40x typical. Lower for low-overhead roles (remote), higher for high-overhead (office, specialized equipment).' },
    { question: 'What is the employer burden?', answer: 'Employer burden = all costs beyond base salary: benefits (30%) + payroll taxes (9%) + WC (1-3%) + equipment + overhead. Typically 25-40% of salary. Example: $75k salary + $25k burden = $100k loaded cost. Use loaded cost for pricing — charge rate must exceed loaded cost to be profitable.' },
    { question: 'What is included in employee overhead?', answer: 'Overhead allocation includes: rent (proportional office space), utilities, insurance (D&O, liability), administrative staff (HR, finance, IT support), office supplies, training, software licenses (email, HRIS, payroll). Typical: $5,000-$15,000/employee/year depending on location and role.' },
    { question: 'How do you calculate hourly cost of an employee?', answer: 'Hourly cost = total annual loaded cost / 2,080 hours (40h × 52w). Example: $100k loaded / 2,080 = $48.08/hour. Use for billable rate setting (charge 2-3x hourly cost for professional services), overtime cost analysis, and project costing.' },
    { question: 'How do you reduce employee cost?', answer: 'Strategies: (1) Reduce benefits cost (high-deductible health plans, wellness programs), (2) Lower overhead (remote work, smaller office), (3) Reduce WC (safety programs, lower-risk roles), (4) Use contractors for variable work (no benefits), (5) Automation (reduce headcount), (6) Lower-tax jurisdictions (state/local tax incentives).' },
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
