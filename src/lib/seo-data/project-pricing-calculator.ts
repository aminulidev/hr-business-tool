const seoData = {
  breadcrumbs: [{ label: 'Calculators' }, { label: 'Project Price' }],
  tableOfContents: [
    { id: 'how-to-calculate', label: 'How to Calculate' },
    { id: 'frequently-asked-questions', label: 'FAQs' },
    { id: 'related-calculators', label: 'Related Calculators' },
  ],
  howToSteps: [
    'Enter the required values in the input fields above.',
    'Click Calculate to see your results.',
    'Use Save A / Save B to compare two scenarios.',
  ],
  formula: 'See calculator description above for the formula.',
  formulaDescription: 'Calculate fixed-bid project price from estimated hours, hourly rate, overhead multiplier, and profit margin.',
  workedExamples: [
    { title: 'Example', description: 'Click Try an Example to see a worked calculation.' },
  ],
  faqs: [
    { question: 'How does this calculator work?', answer: 'Calculate fixed-bid project price from estimated hours, hourly rate, overhead multiplier, and profit margin.' },
    { question: 'Can I compare scenarios?', answer: 'Yes, use Save A and Save B buttons to compare two different scenarios side by side.' },
  ],
  relatedTools: [
    { slug: 'commission-calculator', title: 'Sales Commission Calculator', description: 'Commission calculation', icon: 'DollarSign' },
    { slug: 'profit-margin-calculator', title: 'Profit Margin Calculator', description: 'Margin analysis', icon: 'Percent' },
    { slug: 'break-even-calculator', title: 'Break-Even Calculator', description: 'Break-even analysis', icon: 'Target' },
    { slug: 'roi-calculator', title: 'ROI Calculator', description: 'Return on investment', icon: 'BarChart3' },
    { slug: 'hourly-paycheck-calculator', title: 'Hourly Paycheck Calculator', description: 'Take-home pay', icon: 'BadgeDollarSign' },
  ],
};
export default seoData;
