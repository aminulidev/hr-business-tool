const seoData = {
  breadcrumbs: [{ label: 'Calculators' }, { label: 'Span of Control Calculator' }],
  tableOfContents: [
    { id: 'how-to-calculate', label: 'How to Calculate' },
    { id: 'formula', label: 'Formula' },
    { id: 'worked-examples', label: 'Worked Examples' },
    { id: 'frequently-asked-questions', label: 'FAQs' },
    { id: 'related-calculators', label: 'Related Calculators' },
  ],
  howToSteps: [
    'Enter total number of employees.',
    'Enter number of managers (includes all management levels).',
    'Click Calculate to see average span of control and benchmark.',
  ],
  formula: 'IC Count = Total Employees - Managers\nSpan = IC Count / Managers\nManagement Ratio = Managers / Total Employees\nManagement % = Management Ratio x 100',
  formulaDescription: 'Span of control = direct reports per manager. Benchmarks: 4-6 (complex/knowledge work, e.g., engineering), 7-10 (standard office work), 15-30 (transactional, e.g., call centers, retail). Narrow span = more overhead; wide span = less coaching.',
  workedExamples: [
    { title: 'Standard Office', description: '100 employees, 12 managers. IC = 88. Span = 7.3. Standard span for office work.' },
    { title: 'Engineering Team', description: '50 employees, 8 managers. IC = 42. Span = 5.3. Narrow span appropriate for complex engineering work.' },
    { title: 'Call Center', description: '60 employees, 4 managers. IC = 56. Span = 14. Wide span appropriate for transactional work.' },
    { title: 'Top-Heavy Org', description: '100 employees, 25 managers. IC = 75. Span = 3.0. Very narrow — too many managers, potential restructure needed.' },
    { title: 'Lean Startup', description: '30 employees, 3 managers. IC = 27. Span = 9. Wide span — typical for early-stage with experienced ICs.' },
  ],
  faqs: [
    { question: 'What is span of control?', answer: 'Span of control = number of direct reports per manager. Calculated: (total employees - managers) / managers. Benchmarks: 4-6 (complex roles like engineering), 7-10 (standard office work), 15-30 (transactional work like call centers). Narrow span = more management overhead; wide span = less individual coaching.' },
    { question: 'What is a good span of control?', answer: 'Depends on role complexity: Complex/knowledge work (engineering, law, finance): 4-6 reports. Standard office work (marketing, ops): 7-10. Transactional work (call center, retail, warehouse): 15-30. Senior management: 5-8. Executive: 4-7. Too narrow = overhead; too wide = inadequate coaching.' },
    { question: 'How do you calculate span of control?', answer: 'Span = (Total Employees - Managers) / Managers. Example: 100 employees, 12 managers = (100-12)/12 = 7.3 reports per manager. For org-wide: use average. For specific manager: count direct reports. Track by department and level — wide variation indicates org design issues.' },
    { question: 'What factors affect optimal span?', answer: 'Factors: (1) Role complexity (higher complexity = narrower span), (2) Employee experience (junior needs more coaching = narrower), (3) Standardization (standardized work = wider span), (4) Geography (dispersed = narrower), (5) Manager skill (skilled = wider), (6) Technology (collaboration tools = wider), (7) Change rate (high change = narrower).' },
    { question: 'What is delayering?', answer: 'Delayering = removing management layers to widen span of control and reduce overhead. Example: from 5-layer org (CEO → VP → Director → Manager → IC) to 3-layer (CEO → Manager → IC). Benefits: faster decisions, lower cost, clearer accountability. Risks: less career progression, manager overload, less coaching.' },
    { question: 'How do you reduce management overhead?', answer: 'Strategies: (1) Delayer — remove management levels, (2) Widen span where appropriate, (3) Combine roles (player-coach), (4) Self-managing teams (agile), (5) Reduce admin burden (automation), (6) Manager training (handle more reports), (7) Clarify roles (reduce coordination need). Target management ratio: 10-15% of workforce.' },
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
