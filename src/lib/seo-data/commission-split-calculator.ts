const seoData = {
  breadcrumbs: [{ label: 'Calculators' }, { label: 'Commission Split Calculator' }],
  tableOfContents: [
    { id: 'how-to-calculate', label: 'How to Calculate' },
    { id: 'formula', label: 'Formula' },
    { id: 'worked-examples', label: 'Worked Examples' },
    { id: 'frequently-asked-questions', label: 'FAQs' },
    { id: 'related-calculators', label: 'Related Calculators' },
  ],
  howToSteps: [
    'Enter total commission earned.',
    'Enter rep split (%).',
    'Enter manager override (%) of rep share.',
    'Click Calculate to see rep take-home and company share.',
  ],
  formula: 'Rep Gross = Total Commission x Rep Split%\nManager Override = Rep Gross x Override%\nRep Take-Home = Rep Gross - Manager Override\nCompany Share = Total Commission - Rep Gross',
  formulaDescription: 'Commission split = division between rep and company. Common: 60/40, 70/30, 80/20. Manager override = % of rep commission paid to sales manager (5-10%). Used in real estate, insurance, 1099 sales.',
  workedExamples: [
    { title: 'Standard Split', description: '$15k commission, 70% rep, 5% manager override. Rep gross = $10,500. Manager = $525. Rep take-home = $9,975. Company = $4,500.' },
    { title: 'Real Estate', description: '$20k commission, 60% agent, 0% override (independent). Agent = $12,000. Brokerage = $8,000.' },
    { title: 'Insurance', description: '$10k commission, 80% agent, 10% manager. Agent gross = $8,000. Manager = $800. Agent take-home = $7,200. Company = $2,000.' },
    { title: 'High Producer', description: '$30k commission, 90% rep (top producer rate), 3% override. Rep gross = $27,000. Manager = $810. Rep take-home = $26,190.' },
    { title: 'New Agent', description: '$5k commission, 50% agent (training rate), 0% override. Agent = $2,500. Company = $2,500.' },
  ],
  faqs: [
    { question: 'What is a commission split?', answer: 'Commission split = division of commission between sales rep and company. Common: 60/40 (rep gets 60%), 70/30, 80/20. Higher splits for experienced reps, lower for new reps (training period). Used in real estate (agent/broker), insurance (agent/company), 1099 independent contractor sales.' },
    { question: 'What is a typical real estate commission split?', answer: 'Real estate: agent gets 50-70% of total commission, brokerage gets 30-50%. New agents: 50/50 (training). Experienced: 70/30. Top producers: 80/20 or 90/10. Example: 6% commission on $500k home = $30k. Split 70/30: agent gets $21k, brokerage $9k. See our Split Commission Calculator for multi-rep splits.' },
    { question: 'What is a manager override?', answer: 'Manager override = % of rep\'s commission paid to sales manager. Typically 5-10%. Rewards management involvement in deals. Example: $10k rep commission, 5% override = $500 to manager. Separate from split commission (between reps). Common in: insurance (agency manager), real estate (team leader), B2B sales (sales manager).' },
    { question: 'How do 1099 commission splits work?', answer: '1099 independent contractors: higher splits (80-90%) because company doesn\'t pay base salary, benefits, or payroll taxes. Example: 1099 rep at 85% vs W-2 rep at 70% (but W-2 gets base + benefits). 1099 reps cover their own: health insurance, retirement, self-employment tax (15.3% SECA). Net effective may be similar.' },
    { question: 'What is a graduated commission split?', answer: 'Graduated = split increases with production. Example: 50% to $50k, 60% to $100k, 70% to $200k, 80% above. Rewards high producers. Common in real estate and insurance. Motivates reps to keep selling. Also called "tiered split" (different from tiered commission which is rate tiers, not split tiers).' },
    { question: 'How do you negotiate a better commission split?', answer: 'Leverage: (1) Production history (show your numbers), (2) Unique skills (specialty market, language), (3) Competing offers, (4) Book of business (portable clients), (5) Team you bring. Typical negotiation: start at 5-10% higher than offered. Real estate: 70% to 80% is common jump after $5M+ production. Get in writing.' },
  ],
  relatedTools: [
    { slug: 'commission-calculator', title: 'Sales Commission Calculator', description: 'Flat-rate commission', icon: 'DollarSign' },
    { slug: 'roi-calculator', title: 'ROI Calculator', description: 'Return on investment', icon: 'BarChart3' },
    { slug: 'break-even-calculator', title: 'Break-Even Calculator', description: 'Break-even analysis', icon: 'Target' },
    { slug: 'profit-margin-calculator', title: 'Profit Margin Calculator', description: 'Margin analysis', icon: 'Percent' },
    { slug: 'revenue-forecast-calculator', title: 'Revenue Forecast', description: 'Revenue projection', icon: 'TrendingUp' },
  ],
};
export default seoData;
