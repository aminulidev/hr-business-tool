const seoData = {
  breadcrumbs: [{ label: 'Calculators' }, { label: 'Journal Entry Balance' }],
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
  formulaDescription: 'Create balanced journal entries with debits and credits. Verify total debits = total credits.',
  workedExamples: [
    { title: 'Example', description: 'Click Try an Example to see a worked calculation.' },
  ],
  faqs: [
    { question: 'How does this calculator work?', answer: 'Create balanced journal entries with debits and credits. Verify total debits = total credits.' },
    { question: 'Can I compare scenarios?', answer: 'Yes, use Save A and Save B buttons to compare two different scenarios side by side.' },
  ],
  relatedTools: [
    { slug: 'cogs-calculator', title: 'COGS Calculator', description: 'Cost of goods sold', icon: 'DollarSign' },
    { slug: 'profit-margin-calculator', title: 'Profit Margin Calculator', description: 'Margin analysis', icon: 'Percent' },
    { slug: 'break-even-calculator', title: 'Break-Even Calculator', description: 'Break-even analysis', icon: 'Target' },
    { slug: 'depreciation-calculator', title: 'Depreciation Calculator', description: 'Asset depreciation', icon: 'TrendingDown' },
    { slug: 'balance-sheet-calculator', title: 'Balance Sheet', description: 'Financial position', icon: 'FileText' },
  ],
};
export default seoData;
