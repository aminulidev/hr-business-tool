const seoData = {
  breadcrumbs: [{ label: 'Calculators' }, { label: 'Employee Lifetime Value Calculator' }],
  tableOfContents: [
    { id: 'how-to-calculate', label: 'How to Calculate' },
    { id: 'formula', label: 'Formula' },
    { id: 'worked-examples', label: 'Worked Examples' },
    { id: 'frequently-asked-questions', label: 'FAQs' },
    { id: 'related-calculators', label: 'Related Calculators' },
  ],
  howToSteps: [
    'Enter annual revenue generated per employee.',
    'Enter annual cost per employee (loaded: salary + benefits + taxes).',
    'Enter average tenure in years.',
    'Enter ramp-up period in months (time to full productivity).',
    'Click Calculate to see ELTV and annual ROI.',
  ],
  formula: 'Annual Value = Revenue per Employee - Annual Cost\nRamp Loss = Annual Value x (Ramp Months / 12) x 0.5\nTotal Value = Annual Value x Tenure - Ramp Loss\nAnnual ROI = (Annual Value / Annual Cost) x 100',
  formulaDescription: 'ELTV = (annual revenue per employee - annual loaded cost) × tenure - ramp-up loss. Use to quantify retention ROI: extending average tenure by 1 year adds significant value. High ELTV roles justify higher retention investment. Low/negative ELTV = reassess pricing or role design.',
  workedExamples: [
    { title: 'Strong ELTV', description: '$200k revenue/emp, $110k loaded cost, 4yr tenure, 6mo ramp. Annual value = $90k. Ramp loss = $22.5k. ELTV = $360k - $22.5k = $337.5k. Annual ROI = 82%.' },
    { title: 'Low Margin Role', description: '$80k revenue, $70k cost, 3yr tenure, 3mo ramp. Annual value = $10k. Ramp loss = $1.25k. ELTV = $30k - $1.25k = $28.75k. ROI = 14%.' },
    { title: 'High Tenure Impact', description: '$150k rev, $100k cost, 2yr tenure = $100k ELTV. Same role, 5yr tenure = $250k ELTV. 2.5x value from 2.5x tenure.' },
    { title: 'Negative ELTV', description: '$60k revenue, $80k cost (overhead heavy), 2yr tenure. Annual value = -$20k. ELTV = -$40k - ramp loss. Reassess pricing or role.' },
    { title: 'Sales Rep', description: '$300k revenue (quota), $120k cost, 3yr tenure, 9mo ramp. Annual value = $180k. Ramp loss = $67.5k. ELTV = $540k - $67.5k = $472.5k. ROI = 150%.' },
  ],
  faqs: [
    { question: 'What is Employee Lifetime Value (ELTV)?', answer: 'ELTV = net value an employee generates over their tenure = (annual revenue per employee - annual loaded cost) × tenure - ramp-up loss. Quantifies retention ROI. High ELTV roles justify higher retention investment. Low/negative ELTV = reassess pricing, role design, or cost structure. Use for workforce ROI analysis.' },
    { question: 'How do you calculate ELTV?', answer: 'Steps: (1) Annual revenue per employee (revenue / FTE), (2) Annual loaded cost (salary + benefits + taxes + overhead), (3) Annual value = revenue - cost, (4) Ramp-up loss = annual value × (ramp months / 12) × 50% (assuming 50% productivity during ramp), (5) ELTV = (annual value × tenure) - ramp loss.' },
    { question: 'What is a good ELTV?', answer: 'Depends on industry and role. Healthy: annual ROI >50% (revenue per employee >1.5x loaded cost). Tech/consulting: 100-200% ROI. Manufacturing: 30-50%. Service/retail: 15-30%. Negative ELTV = pricing or cost problem. Track by role — high ELTV roles justify higher comp and retention investment.' },
    { question: 'How does tenure affect ELTV?', answer: 'ELTV scales linearly with tenure (after ramp-up). Example: $100k annual value × 2 year tenure = $200k ELTV. Same role × 5 year tenure = $500k ELTV. 2.5x tenure = 2.5x value. This is why retention pays: each additional year of tenure adds full annual value. Reducing attrition by 5% can add $500k-$2M+ in ELTV.' },
    { question: 'What is ramp-up loss?', answer: 'New employees take time to reach full productivity (typically 3-6 months). Ramp-up loss = value not generated during ramp = annual value × (ramp months / 12) × 50%. Example: $100k annual value × 6 months × 50% = $25k lost per new hire. Frequent turnover = repeated ramp losses. Retention avoids this cost.' },
    { question: 'How do you use ELTV for workforce decisions?', answer: 'Use ELTV to: (1) Justify retention investment (higher comp, training, engagement), (2) Identify high-value roles (worth retention focus), (3) Identify low-value roles (restructure, automate, outsource), (4) Calculate ROI of tenure-extension programs, (5) Build business case for onboarding improvements (faster ramp = less ramp loss).' },
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
