const seoData = {
  breadcrumbs: [{ label: 'Calculators' }, { label: 'Labor Cost Calculator' }],
  tableOfContents: [
    { id: 'how-to-calculate', label: 'How to Calculate' },
    { id: 'formula', label: 'Formula' },
    { id: 'worked-examples', label: 'Worked Examples' },
    { id: 'frequently-asked-questions', label: 'FAQs' },
    { id: 'related-calculators', label: 'Related Calculators' },
  ],
  howToSteps: [
    'Enter total annual wages (gross payroll before taxes/deductions).',
    'Enter benefits cost as % of wages (typically 28-32% per BLS).',
    'Enter employer payroll taxes % (FICA 7.65% + FUTA 0.6% + SUTA 1-5% = ~9-13%).',
    'Enter workers comp premium (annual $).',
    'Enter annual revenue to calculate labor cost as % of revenue.',
    'Click Calculate to see total labor cost and loaded multiplier.',
  ],
  formula: 'Benefits = Wages x (Benefits% / 100)\nPayroll Taxes = Wages x (Tax% / 100)\nTotal Labor Cost = Wages + Benefits + Taxes + Workers Comp\nLabor % Revenue = Total Labor / Revenue x 100\nLoaded Multiplier = Total Labor / Wages',
  formulaDescription: 'Total labor cost = wages + benefits + payroll taxes + workers comp. Loaded multiplier typically 1.25-1.40x wages. Labor as % of revenue varies by industry: restaurants 30-35%, retail 20%, services 50%, manufacturing 25%, tech 15%.',
  workedExamples: [
    { title: 'Tech Company', description: '$5M wages, 30% benefits, 9% taxes, $50k WC, $25M revenue. Benefits = $1.5M, taxes = $450k. Total = $7M. Labor % = 28%. Loaded 1.40x. Healthy for tech.' },
    { title: 'Restaurant', description: '$1M wages, 25% benefits, 10% taxes, $20k WC, $3M revenue. Total = $1.38M. Labor % = 46%. High for restaurants — typical 30-35%.' },
    { title: 'Consulting Firm', description: '$3M wages, 32% benefits, 9% taxes, $30k WC, $6M revenue. Total = $4.21M. Labor % = 70%. Typical for professional services.' },
    { title: 'Manufacturer', description: '$8M wages, 30% benefits, 10% taxes, $200k WC, $30M revenue. Total = $11.4M. Labor % = 38%. Slightly high for manufacturing (typical 25%).' },
    { title: 'Retail Store', description: '$500k wages, 25% benefits, 9% taxes, $10k WC, $2M revenue. Total = $714k. Labor % = 35.7%. Within typical 20-30% retail range.' },
  ],
  faqs: [
    { question: 'What is total labor cost?', answer: 'Total labor cost = gross wages + benefits (health, 401k, PTO) + employer payroll taxes (FICA 7.65%, FUTA 0.6%, SUTA 1-5%) + workers comp insurance + payroll admin fees. Loaded multiplier = total / wages, typically 1.25-1.40x.' },
    { question: 'What is a good labor cost percentage?', answer: 'Varies by industry: restaurants 30-35%, retail 20-30%, services/professional 40-60%, manufacturing 20-30%, tech 12-20%, construction 30-40%, healthcare 40-50%. Higher = more labor-intensive. Compare to industry benchmarks — too low may mean understaffing.' },
    { question: 'What is the loaded cost per employee?', answer: 'Loaded cost = salary + benefits + payroll taxes + WC + overhead. Multiplier typically 1.25-1.40x base salary. Example: $75k salary × 1.35 = $101,250 loaded cost. Use for pricing (charge rate must exceed loaded cost) and headcount planning. See our Employee Cost Calculator.' },
    { question: 'How do you calculate labor cost as % of revenue?', answer: 'Labor % = Total Labor Cost / Total Revenue × 100. Example: $5M labor / $20M revenue = 25%. Track trend over time — rising % may indicate revenue decline, over-hiring, or wage inflation. Falling % may indicate productivity gains or understaffing risk.' },
    { question: 'What is the difference between direct and indirect labor cost?', answer: 'Direct labor = wages of employees who produce goods/services (manufacturing line workers, consultants). Indirect labor = support staff (HR, IT, finance, facilities). Both included in total labor cost. Direct labor is assigned to COGS; indirect is overhead (SG&A).' },
    { question: 'Does labor cost include contractors?', answer: 'Typically no — contractors (1099) are not employees. Their cost is in "services" or "consulting" line item, not labor. Some companies track "total workforce cost" including contractors. For pure labor cost (W-2 only), exclude contractors. For total cost of work, include them.' },
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
