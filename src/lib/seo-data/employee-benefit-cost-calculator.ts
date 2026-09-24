const seoData = {
  breadcrumbs: [{ label: 'Calculators' }, { label: 'Employee Benefit Cost Calculator' }],
  tableOfContents: [
    { id: 'how-to-calculate', label: 'How to Calculate' },
    { id: 'formula', label: 'Formula' },
    { id: 'worked-examples', label: 'Worked Examples' },
    { id: 'frequently-asked-questions', label: 'FAQs' },
    { id: 'related-calculators', label: 'Related Calculators' },
  ],
  howToSteps: [
    'Enter annual base salary.',
    'Enter employer-paid health insurance premium per year.',
    'Enter 401(k) match as % of salary (typical 3-6%).',
    'Enter PTO days per year.',
    'Enter life + disability insurance cost per year.',
    'Enter other benefits (FSA, HSA, commuter, etc.) per year.',
  ],
  formula: 'Retirement = Salary x (Match% / 100)\nPTO Value = (Salary / 260) x PTO Days\nTotal Benefits = Health + Retirement + PTO + Life/Disability + Other\nBenefits % = Total Benefits / Salary x 100\nLoaded Cost = Salary + Total Benefits',
  formulaDescription: 'BLS data: benefits average 30-32% of wages. Breakdown: health insurance 8-10%, retirement 3-6%, PTO 6-8% (15 days), life/disability 0.5-1%, other 1-2%. Loaded cost = salary + benefits. Use for total compensation statements and headcount budgeting.',
  workedExamples: [
    { title: 'Standard Package', description: '$75k salary, $12k health, 5% 401k, 15 PTO, $600 life/disability, $1,500 other. Retirement = $3.75k. PTO = $4.33k. Total = $22.18k. 29.6% of salary. Loaded = $97.18k.' },
    { title: 'Generous Tech', description: '$130k salary, $15k health, 6% 401k, 20 PTO, $1,200 life/disability, $3,000 other. Retirement = $7.8k. PTO = $10k. Total = $37k. 28.5%. Loaded = $167k.' },
    { title: 'Lean Startup', description: '$60k salary, $8k health, 3% 401k, 10 PTO, $300 life/disability, $500 other. Total = $11.93k. 19.9%. Loaded = $71.93k. Below market — retention risk.' },
    { title: 'Government', description: '$70k salary, $14k health (FEHB), 5% TSP match, 20 PTO, $1,000 life/disability, $2,000 other. Total = $24.38k. 34.8%. Loaded = $94.38k. Rich benefits.' },
    { title: 'Part-Time Worker', description: '$30k salary, $0 health (not eligible), 3% 401k, 5 PTO, $200 life/disability, $0 other. Total = $1.97k. 6.6%. Loaded = $31.97k. Minimal benefits.' },
  ],
  faqs: [
    { question: 'What is the average employee benefit cost?', answer: 'BLS data: benefits average 30-32% of wages. Breakdown: health insurance 8-10% ($6-10k/yr), retirement 3-6% ($2-6k match), PTO 6-8% (15 days = $4-6k value), life/disability 0.5-1% ($300-800), other 1-2% ($500-2,000). Total: $15-25k/employee/year on top of salary.' },
    { question: 'How much does employer health insurance cost?', answer: '2025 KFF benchmark: $8,951/year for single coverage, $25,572 for family. Employer pays ~80% = $7,200 single, $20,400 family. Employee pays ~20% via premiums + deductibles. Costs rising 5-7% annually. HDHP with HSA can reduce cost 20-30%.' },
    { question: 'What is a typical 401(k) match?', answer: 'Common: 50% match on first 6% of salary = 3% total. Or 100% match on first 3-4% = 3-4% total. Vanguard benchmark: 4.5% average employer contribution. Safe Harbor 401(k) requires 3% match or 100% on first 1% + 50% on next 5%. 2026 limit: $24,500 employee + $7,500 catch-up.' },
    { question: 'How is PTO valued?', answer: 'PTO value = (annual salary / 260 work days) × PTO days. Example: $75k / 260 × 15 days = $4,327. Some companies also value unused PTO at termination (required by law in CA, CO, IL, LA, MA, NE, ND, OR, RI). "Use it or lose it" illegal in CA, NE, OR.' },
    { question: 'What is included in total compensation?', answer: 'Total compensation = base salary + bonus + commission + overtime + benefits (health, retirement, PTO, life/disability) + perks (tuition, wellness, commuter) + equity (RSU, stock options vesting annually). Provide total comp statements annually so employees understand full value (often 1.3-1.5x base salary).' },
    { question: 'How do you reduce benefit costs?', answer: 'Strategies: (1) High-deductible health plan (HDHP) with HSA — 20-30% savings, (2) Self-funded insurance (large companies), (3) Wellness programs (lower claims), (4) Negotiate with carriers annually, (5) Increase employee premium share, (6) Reference-based pricing for hospital claims, (7) Telemedicine (lower-cost primary care).' },
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
