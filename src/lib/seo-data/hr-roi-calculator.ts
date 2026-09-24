const seoData = {
  breadcrumbs: [{ label: 'Calculators' }, { label: 'HR ROI Calculator' }],
  tableOfContents: [
    { id: 'how-to-calculate', label: 'How to Calculate' },
    { id: 'formula', label: 'Formula' },
    { id: 'worked-examples', label: 'Worked Examples' },
    { id: 'frequently-asked-questions', label: 'FAQs' },
    { id: 'related-calculators', label: 'Related Calculators' },
  ],
  howToSteps: [
    'Enter retention savings vs last year (reduced turnover × cost per departure).',
    'Enter productivity gains (training, engagement, technology ROI).',
    'Enter HR cost reductions (process improvements, vendor renegotiation).',
    'Enter total HR budget.',
    'Click Calculate to see HR ROI, net value, and payback period.',
  ],
  formula: 'Total Value = Retention Savings + Productivity Gains + Cost Reductions\nNet Value = Total Value - HR Budget\nHR ROI = (Net Value / HR Budget) x 100\nPayback = HR Budget / (Total Value / 12)',
  formulaDescription: 'HR ROI = (value created - HR budget) / HR budget × 100. Value = retention savings + productivity gains + cost reductions. Good ROI: >50%. Harder to measure than other departments — use leading indicators (engagement, retention, time-to-fill) plus lagging financial impact.',
  workedExamples: [
    { title: 'Strong HR ROI', description: '$200k retention + $150k productivity + $50k cost reduction = $400k value. HR budget $580k. Net = -$180k. ROI = -31%. Year 1 investment year.' },
    { title: 'Mature HR Program', description: '$500k retention + $300k productivity + $100k cost reduction = $900k value. Budget $600k. Net = $300k. ROI = 50%. Strong.' },
    { title: 'Training ROI', description: '$0 retention + $400k productivity (sales training) + $0 cost reduction = $400k value. Training budget $150k. ROI = 167%. Excellent.' },
    { title: 'Retention Program', description: '$800k retention savings (10 fewer departures × $80k) + $0 + $0 = $800k. Retention program cost $200k. ROI = 300%. Outstanding.' },
    { title: 'HR Tech Investment', description: '$0 + $200k productivity + $300k cost reduction (HRIS automation) = $500k. Tech cost $250k + $100k ongoing. ROI = 43%.' },
  ],
  faqs: [
    { question: 'What is HR ROI?', answer: 'HR ROI = (value created by HR - HR budget) / HR budget × 100. Value = retention savings + productivity gains + cost reductions. Good ROI: >50%. Harder to measure than other departments — use leading indicators (engagement, retention) plus lagging financial impact.' },
    { question: 'How do you measure HR value?', answer: 'Methods: (1) Retention savings (reduced turnover × replacement cost), (2) Productivity gains (training ROI, engagement → productivity), (3) Cost reductions (HR process automation, vendor renegotiation), (4) Compliance risk avoidance (lawsuits, fines), (5) Hiring quality (faster ramp-up, longer tenure).' },
    { question: 'What is a good HR ROI?', answer: 'Good: >50%. Excellent: >100%. Year 1 of new programs may be negative (investment year). Track 3-year rolling ROI for fair assessment. Mature HR programs typically deliver 50-150% ROI. Compare to other department ROI benchmarks — HR often competitive with marketing (200%) and IT (100%).' },
    { question: 'How do you calculate retention savings?', answer: 'Retention savings = (prior year departures - current year departures) × cost per departure. Example: 20 departures last year, 10 this year = 10 saved × $80k = $800k savings. Subtract retention program cost ($200k) = $600k net retention value. Track by department for granular analysis.' },
    { question: 'What is HR payback period?', answer: 'Payback = HR budget / (total value / 12) = months for HR investment to pay for itself. Example: $500k budget / ($800k value / 12) = 7.5 months. Shorter = better. Use for HR investment justification — programs with <12 month payback are typically approved.' },
    { question: 'How do you justify HR budget increases?', answer: 'Build business case: (1) Quantify current cost of HR problems (turnover, low engagement, compliance risk), (2) Show ROI of existing HR programs, (3) Benchmark HR spend to industry (1-2% of revenue), (4) Pilot new programs with clear metrics, (5) Use leading indicators (engagement, time-to-fill) to predict lagging financial impact. See our HR Budget Calculator.' },
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
