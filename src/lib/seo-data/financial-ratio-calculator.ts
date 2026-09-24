const seoData = {
  breadcrumbs: [{ label: 'Calculators' }, { label: 'Financial Ratio Calculator' }],
  tableOfContents: [
    { id: 'how-to-calculate', label: 'How to Calculate' },
    { id: 'formula', label: 'Formula' },
    { id: 'worked-examples', label: 'Worked Examples' },
    { id: 'frequently-asked-questions', label: 'FAQs' },
    { id: 'related-calculators', label: 'Related Calculators' },
  ],
  howToSteps: [
    'Enter revenue, net income, current assets, current liabilities.',
    'Enter inventory, total assets, total liabilities.',
    'Enter EBIT and interest expense.',
    'Click Calculate to see 12 key financial ratios.',
  ],
  formula: 'Liquidity: Current Ratio = CA/CL, Quick Ratio = (CA-Inv)/CL\nSolvency: Debt Ratio = TL/TA, Interest Coverage = EBIT/Interest\nProfitability: Net Margin = NI/Rev, ROA = NI/TA, ROE = NI/Equity\nEfficiency: Asset Turnover = Rev/TA',
  formulaDescription: 'Comprehensive ratio analysis: Liquidity (current, quick), Solvency (debt ratio, interest coverage), Profitability (net margin, ROA, ROE), Efficiency (asset turnover). Each ratio benchmarks differently by industry. Use for financial statement analysis.',
  workedExamples: [
    { title: 'Healthy Company', description: 'CR 2.0x, QR 1.5x, D/R 40%, ICR 5x, NM 15%, ROA 12%, ROE 20%, AT 1.2x. Strong across all ratios.' },
    { title: 'Liquidity Risk', description: 'CR 0.8x, QR 0.4x. Cannot cover short-term debts. Needs cash injection or AP extension.' },
    { title: 'High Leverage', description: 'D/R 70%, ICR 1.5x. Distress risk — barely covers interest. Reduce debt or increase EBIT.' },
    { title: 'Low Profitability', description: 'NM 2%, ROA 3%, ROE 5%. Below industry. Needs price increase or cost reduction.' },
    { title: 'Efficient Operations', description: 'AT 3.0x (high), NM 5% (low). High volume, low margin — typical for retail/grocery.' },
  ],
  faqs: [
    { question: 'What are financial ratios?', answer: 'Ratios calculated from financial statements to assess: (1) Liquidity (can pay short-term debts?), (2) Solvency (can pay long-term debts?), (3) Profitability (generating profit?), (4) Efficiency (using assets effectively?). Used for: investment analysis, loan applications, management reporting, competitor comparison.' },
    { question: 'What are the 4 categories of financial ratios?', answer: '(1) Liquidity: current ratio, quick ratio (short-term solvency). (2) Solvency: debt ratio, interest coverage (long-term solvency). (3) Profitability: net margin, ROA, ROE, gross margin (profit generation). (4) Efficiency: asset turnover, inventory turnover, AR turnover (asset utilization). Each category answers different question about financial health.' },
    { question: 'What is a good current ratio?', answer: 'Healthy: 1.5-2.0x. Below 1.0 = liquidity risk. Above 3.0 = too conservative. Industry varies. See our Current Ratio Calculator. What is a good debt ratio? Healthy: 30-50%. Above 60% = high leverage. See our Debt Ratio Calculator.' },
    { question: 'What is a good ROE?', answer: 'S&P 500 average: 15-20%. Above 20% = excellent. Below 10% = underperforming. Industry: banks 8-12%, tech 20-30%, retail 15-20%. See our ROE Calculator. What is a good net margin? Tech 15-25%, retail 2-5%, restaurants 3-6%. See our Net Margin Calculator.' },
    { question: 'How do you use financial ratios?', answer: 'Uses: (1) Trend analysis (track over time), (2) Industry comparison (benchmark vs peers), (3) Loan applications (lenders check liquidity/solvency), (4) Investment decisions (stock analysis), (5) Management reporting (identify issues), (6) Covenant compliance (loan requirements). Don\'t look at ratios in isolation — compare to industry and trend.' },
    { question: 'What are limitations of financial ratios?', answer: 'Limitations: (1) Based on historical (past) data, (2) Accounting methods vary (LIFO/FIFO, depreciation), (3) Industry differences (don\'t compare banks to tech), (4) Size differences (small vs large company), (5) Economic conditions (inflation, recession), (6) Window dressing (manipulate year-end balances). Use alongside qualitative analysis.' },
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
