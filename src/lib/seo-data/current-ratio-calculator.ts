const seoData = {
  breadcrumbs: [{ label: 'Calculators' }, { label: 'Current Ratio Calculator' }],
  tableOfContents: [
    { id: 'how-to-calculate', label: 'How to Calculate' },
    { id: 'formula', label: 'Formula' },
    { id: 'worked-examples', label: 'Worked Examples' },
    { id: 'frequently-asked-questions', label: 'FAQs' },
    { id: 'related-calculators', label: 'Related Calculators' },
  ],
  howToSteps: [
    'Enter current assets (cash, AR, inventory).',
    'Enter current liabilities (AP, short-term debt).',
    'Click Calculate to see current ratio and working capital.',
  ],
  formula: 'Current Ratio = Current Assets / Current Liabilities\nWorking Capital = Current Assets - Current Liabilities\nHealthy: 1.5-2.0x. Below 1.0 = liquidity risk.',
  formulaDescription: 'Current ratio = current assets / current liabilities. Measures short-term liquidity. Healthy: 1.5-2.0x. Below 1.0 = liquidity risk (can\'t cover short-term debts). Above 3.0 = too conservative. See our Quick Ratio and Working Capital Calculators.',
  workedExamples: [
    { title: 'Healthy', description: '$500k CA, $300k CL. CR = 1.67x. WC = $200k. Good liquidity.' },
    { title: 'Conservative', description: '$800k CA, $200k CL. CR = 4.0x. WC = $600k. Very conservative — idle cash.' },
    { title: 'Tight', description: '$250k CA, $200k CL. CR = 1.25x. WC = $50k. Tight — monitor closely.' },
    { title: 'At Risk', description: '$150k CA, $200k CL. CR = 0.75x. WC = -$50k. Liquidity risk — can\'t cover short-term debts.' },
    { title: 'Retail (Low OK)', description: '$200k CA, $250k CL. CR = 0.80x. Negative WC OK for fast-turn retail (supplier credit).' },
  ],
  faqs: [
    { question: 'What is current ratio?', answer: 'Current ratio = current assets / current liabilities. Measures ability to pay short-term obligations (due within 12 months). Healthy: 1.5-2.0x. Below 1.0 = liquidity risk. Above 3.0 = too conservative (idle cash). Industry: retail 1.5, manufacturing 2.0, services 1.5. See our Quick Ratio Calculator.' },
    { question: 'What is a good current ratio?', answer: 'Healthy: 1.5-2.0x. Below 1.0 = can\'t cover short-term debts (risk). 2.0-3.0 = conservative (safe but may have idle cash). Above 3.0 = too conservative (invest excess cash). Industry: retail 1.5, manufacturing 2.0, services 1.5, tech 2.5. Compare to industry average.' },
    { question: 'Current ratio vs quick ratio?', answer: 'Current ratio = CA / CL (includes inventory). Quick ratio = (CA - inventory) / CL (excludes inventory, stricter). Quick ratio is lower. Example: $500k CA ($200k inventory), $300k CL. CR = 1.67x. QR = (500-200)/300 = 1.0x. QR tests if you can pay debts WITHOUT selling inventory. See our Quick Ratio Calculator.' },
    { question: 'Can current ratio be too high?', answer: 'Yes — above 3.0 may indicate: (1) Idle cash (should be invested or returned to shareholders), (2) Excess inventory (holding cost, obsolescence risk), (3) Poor AR collection (customers not paying). Investigate composition of current assets. High CR isn\'t always good — capital efficiency matters.' },
    { question: 'How do you improve current ratio?', answer: 'Strategies: (1) Increase current assets (collect AR faster, build cash), (2) Reduce current liabilities (pay down short-term debt, extend AP terms), (3) Convert short-term debt to long-term, (4) Sell excess inventory. Best: collect AR faster and reduce inventory — improves both CR and cash flow.' },
    { question: 'What if current ratio is below 1.0?', answer: 'Below 1.0 = current liabilities exceed current assets = liquidity risk. May not be able to pay short-term debts. Action: (1) Secure line of credit, (2) Collect AR aggressively, (3) Extend AP terms, (4) Sell excess inventory, (5) Convert short-term to long-term debt, (6) Raise equity. Exception: fast-turn retail can operate below 1.0 (supplier credit funds inventory).' },
  ],
  relatedTools: [
    { slug: 'roi-calculator', title: 'ROI Calculator', description: 'Return on investment', icon: 'BarChart3' },
    { slug: 'profit-margin-calculator', title: 'Profit Margin Calculator', description: 'Margin analysis', icon: 'Percent' },
    { slug: 'break-even-calculator', title: 'Break-Even Calculator', description: 'Break-even units and revenue', icon: 'Target' },
    { slug: 'gross-margin-calculator', title: 'Gross Margin Calculator', description: 'Gross profit margin', icon: 'PieChart' },
    { slug: 'cash-flow-forecast-calculator', title: 'Cash Flow Forecast', description: '12-month cash projection', icon: 'TrendingUp' },
  ],
};
export default seoData;
