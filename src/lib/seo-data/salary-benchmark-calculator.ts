const seoData = {
  breadcrumbs: [{ label: 'Calculators' }, { label: 'Salary Benchmark Calculator' }],
  tableOfContents: [
    { id: 'how-to-calculate', label: 'How to Calculate' },
    { id: 'formula', label: 'Formula' },
    { id: 'worked-examples', label: 'Worked Examples' },
    { id: 'frequently-asked-questions', label: 'FAQs' },
    { id: 'related-calculators', label: 'Related Calculators' },
  ],
  howToSteps: [
    'Enter employee\'s current annual salary.',
    'Enter market 25th percentile salary (P25).',
    'Enter market 50th percentile / median salary (P50).',
    'Enter market 75th percentile salary (P75).',
    'Enter market 90th percentile salary (P90).',
    'Click Compare to see salary vs market and estimated percentile.',
  ],
  formula: 'vs Median = Salary / P50 x 100\nvs P25 = Salary / P25 x 100\nvs P75 = Salary / P75 x 100\nPercentile = Salary <= P25 ? 25th : <= P50 ? 50th : <= P75 ? 75th : <= P90 ? 90th : 95th',
  formulaDescription: 'Salary benchmarking compares employee pay to market data (BLS, Payscale, Glassdoor, Radford). Target: 90-110% of median (P50). Below P25 = retention risk. Above P90 = budget pressure. Adjust pay bands annually for inflation (3-4%) and market shifts.',
  workedExamples: [
    { title: 'At Market', description: '$85k salary, P25 $70k, P50 $85k, P75 $100k, P90 $115k. vs median = 100%. Percentile = 50th. Ideal positioning.' },
    { title: 'Underpaid', description: '$65k salary, P25 $70k, P50 $85k. vs median = 76%. Below P25. Retention risk — adjust to $80k+ to reach P50.' },
    { title: 'Top of Band', description: '$110k salary, P50 $85k, P75 $100k, P90 $115k. vs median = 129%. 75th-90th percentile. High performer — no raises until market catches up.' },
    { title: 'New Hire', description: '$72k salary, P25 $70k, P50 $85k. vs median = 85%. Below P50 but expected for new hire. Plan 2-3 raises to reach P50.' },
    { title: 'Tech Role Hot Market', description: '$130k salary, was P75 last year. Market shifted: P75 now $140k. Now at 64th percentile. Adjust band or risk losing to competitors.' },
  ],
  faqs: [
    { question: 'What is salary benchmarking?', answer: 'Comparing employee pay to market data from compensation surveys (BLS, Payscale, Glassdoor, Radford, Mercer). Use percentiles (P25, P50/median, P75, P90) to position salaries within market range. Target: 90-110% of P50. Below P25 = retention risk; above P90 = budget pressure.' },
    { question: 'What are salary percentiles?', answer: 'P25 = 25th percentile (25% of market pays less). P50 = median (50th percentile). P75 = 75th percentile. P90 = 90th percentile. Most companies target P50-P75 to attract and retain talent. Tech companies often pay P75-P90 for scarce skills.' },
    { question: 'Where do I get salary data?', answer: 'Sources: (1) BLS (free, broad), (2) Payscale/Glassdoor (free/cheap, self-reported), (3) Radford/Mercer (paid, tech/finance specialized), (4) Industry associations (SHRM, IEEE), (5) Recruiters (current market intel), (6) Job postings (salary ranges). Use multiple sources for accuracy.' },
    { question: 'How often should I benchmark salaries?', answer: 'Annually at minimum for full review. Quarterly for hot markets (tech, biotech, AI). After major market shifts (e.g., post-COVID tech salary inflation). Before annual merit review cycle. Before making job offers (to stay competitive).' },
    { question: 'What is pay equity?', answer: 'Pay equity = equal pay for equal work regardless of gender, race, age, or other protected characteristics. Conducted via statistical analysis: control for role, level, experience, location, performance. Identify and remediate gaps. Required in CA, NY, MA, CO, WA, OR, IL, NJ, DE. Penalties for gaps up to $10k per employee.' },
    { question: 'How do you adjust pay bands?', answer: 'Steps: (1) Benchmark current bands to market, (2) Adjust band min/mid/max to market percentiles, (3) Identify employees below new P50 (priority raises), (4) Identify employees above new P90 (red-circle, freeze raises), (5) Budget for adjustments (1-3% of payroll), (6) Communicate transparently. Annual cycle.' },
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
