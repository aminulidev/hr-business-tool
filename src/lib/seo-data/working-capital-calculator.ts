const seoData = {
  breadcrumbs: [{ label: 'Calculators' }, { label: 'Working Capital Calculator' }],
  tableOfContents: [
    { id: 'how-to-calculate', label: 'How to Calculate' },
    { id: 'formula', label: 'Formula' },
    { id: 'worked-examples', label: 'Worked Examples' },
    { id: 'frequently-asked-questions', label: 'FAQs' },
    { id: 'related-calculators', label: 'Related Calculators' },
  ],
  howToSteps: [
    'Enter cash and equivalents.',
    'Enter accounts receivable.',
    'Enter inventory.',
    'Enter other current assets.',
    'Enter accounts payable.',
    'Enter other current liabilities.',
    'Click Calculate to see working capital and current ratio.',
  ],
  formula: 'Current Assets = Cash + AR + Inventory + Other CA\nCurrent Liabilities = AP + Other CL\nWorking Capital = Current Assets - Current Liabilities\nCurrent Ratio = Current Assets / Current Liabilities',
  formulaDescription: 'Working capital = current assets - current liabilities. Positive = can cover short-term obligations. Current ratio = CA / CL (healthy: 1.5-2.0). Below 1.0 = liquidity risk. Negative WC can be OK for retail (fast inventory turnover).',
  workedExamples: [
    { title: 'Healthy Company', description: '$200k cash + $150k AR + $200k inventory + $50k other = $600k CA. $120k AP + $80k other = $200k CL. WC = $400k. CR = 3.0x. Very healthy.' },
    { title: 'Adequate', description: '$100k cash + $100k AR + $100k inventory = $300k CA. $150k AP + $50k other = $200k CL. WC = $100k. CR = 1.5x. Adequate.' },
    { title: 'Tight', description: '$50k cash + $100k AR + $50k inventory = $200k CA. $150k AP + $30k other = $180k CL. WC = $20k. CR = 1.11x. Tight — monitor closely.' },
    { title: 'Negative WC', description: '$20k cash + $80k AR = $100k CA. $150k AP = $150k CL. WC = -$50k. CR = 0.67x. Risky — but OK for fast-turn retail.' },
    { title: 'Excess Cash', description: '$1M cash + $200k AR + $100k inventory = $1.3M CA. $200k CL. WC = $1.1M. CR = 6.5x. Too conservative — invest excess cash.' },
  ],
  faqs: [
    { question: 'What is working capital?', answer: 'Working capital = current assets - current liabilities. Measures short-term liquidity — ability to pay obligations due within 12 months. Positive = healthy. Negative = may struggle to pay bills. Current ratio = CA / CL (healthy: 1.5-2.0). See our Current Ratio and Quick Ratio Calculators.' },
    { question: 'What is a good working capital position?', answer: 'Healthy: current ratio 1.5-2.0x (enough to cover short-term debts with cushion). Below 1.0 = liquidity risk. Above 3.0 = too conservative (idle cash, excess inventory). Industry varies: retail can operate at lower WC (fast inventory turnover), manufacturing needs higher (slow inventory).' },
    { question: 'Working capital vs cash flow?', answer: 'Working capital = balance sheet metric (point in time). Cash flow = income statement metric (over time). Changes in working capital affect cash flow: (1) AR increase = cash outflow (sales not collected), (2) Inventory increase = cash outflow, (3) AP increase = cash inflow (suppliers not paid). See our Operating Cash Flow Calculator.' },
    { question: 'How do you improve working capital?', answer: 'Strategies: (1) Collect AR faster (shorter payment terms, early payment discounts), (2) Reduce inventory (JIT, better forecasting), (3) Extend AP terms (negotiate with suppliers), (4) Refinance short-term debt to long-term, (5) Use revolving credit line for seasonal needs. Target: reduce cash conversion cycle. See our Cash Conversion Cycle Calculator.' },
    { question: 'What is the working capital cycle?', answer: 'Working capital cycle = cash conversion cycle = DIO + DSO - DPO. Days Inventory Outstanding + Days Sales Outstanding - Days Payable Outstanding. Measures time from cash out (inventory purchase) to cash in (sale collected). Shorter = better. Negative = supplier funds your business (Amazon model). See our Cash Conversion Cycle Calculator.' },
    { question: 'Can working capital be negative?', answer: 'Yes — negative working capital (current liabilities > current assets) can be OK for: (1) Retail (fast inventory turnover, suppliers paid after sale), (2) Subscription businesses (customers pay upfront, deliver later), (3) Companies with strong cash flow. Examples: Amazon, Costco, Apple. But for most businesses, negative WC = distress signal.' },
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
