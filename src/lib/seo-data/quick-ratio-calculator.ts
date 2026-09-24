const seoData = {
  breadcrumbs: [{ label: 'Calculators' }, { label: 'Quick Ratio (Acid Test) Calculator' }],
  tableOfContents: [
    { id: 'how-to-calculate', label: 'How to Calculate' },
    { id: 'formula', label: 'Formula' },
    { id: 'worked-examples', label: 'Worked Examples' },
    { id: 'frequently-asked-questions', label: 'FAQs' },
    { id: 'related-calculators', label: 'Related Calculators' },
  ],
  howToSteps: [
    'Enter cash and equivalents.',
    'Enter marketable securities.',
    'Enter accounts receivable.',
    'Enter inventory (excluded from quick assets).',
    'Enter current liabilities.',
    'Click Calculate to see quick ratio and current ratio.',
  ],
  formula: 'Quick Assets = Cash + Marketable Securities + AR\nQuick Ratio = Quick Assets / Current Liabilities\nAlternative: (Current Assets - Inventory) / CL\nHealthy: 1.0+.',
  formulaDescription: 'Quick ratio (acid test) = (cash + marketable securities + AR) / current liabilities. Stricter than current ratio — excludes inventory (may not convert to cash quickly). Healthy: 1.0+. Below 1.0 = can\'t pay short-term debts without selling inventory.',
  workedExamples: [
    { title: 'Healthy', description: '$200k cash + $50k securities + $150k AR = $400k quick. $300k CL. QR = 1.33x. Good — can cover debts without selling inventory.' },
    { title: 'Strong', description: '$500k quick assets, $200k CL. QR = 2.5x. Very strong — lots of liquid assets.' },
    { title: 'At Risk', description: '$100k quick, $200k CL. QR = 0.50x. Risky — needs to sell inventory to pay debts.' },
    { title: 'Inventory-Heavy', description: '$50k cash + $50k AR = $100k quick. $500k inventory. $200k CL. QR = 0.50x but CR = 3.0x. Relies on inventory turnover.' },
    { title: 'Minimal Inventory (Services)', description: '$300k cash + $100k AR = $400k quick. Minimal inventory. $250k CL. QR = 1.6x. Service businesses naturally have high QR.' },
  ],
  faqs: [
    { question: 'What is quick ratio?', answer: 'Quick ratio (acid test) = (cash + marketable securities + AR) / current liabilities. Stricter liquidity test than current ratio — excludes inventory (may not convert to cash quickly). Healthy: 1.0+. Below 1.0 = can\'t pay short-term debts without selling inventory. See our Current Ratio Calculator.' },
    { question: 'What is a good quick ratio?', answer: 'Healthy: 1.0-1.5x. Below 1.0 = liquidity risk (needs to sell inventory to pay debts). 1.5-2.0 = strong. Above 2.0 = very conservative (may have idle cash). Industry: services 1.5+ (low inventory), retail 0.5-1.0 (inventory-heavy), manufacturing 1.0+. Compare within industry.' },
    { question: 'Quick ratio vs current ratio?', answer: 'Current ratio = CA / CL (includes inventory). Quick ratio = (CA - inventory) / CL or (cash + securities + AR) / CL (excludes inventory). Quick is stricter — tests if you can pay debts without selling inventory. Quick is always ≤ current. Large gap = inventory-heavy (watch obsolescence).' },
    { question: 'Why is it called acid test?', answer: 'Originates from gold mining — acid was used to test if metal was real gold. "Acid test" = definitive, rigorous test. In finance: quick ratio is the rigorous liquidity test (excludes inventory which may be hard to sell quickly). If a company passes the acid test (QR > 1.0), it can truly pay short-term debts.' },
    { question: 'What is excluded from quick assets?', answer: 'Quick assets EXCLUDE: (1) Inventory (may not sell quickly, may need discounting), (2) Prepaid expenses (not convertible to cash). Quick assets INCLUDE: (1) Cash, (2) Marketable securities (liquid investments), (3) Accounts receivable (collectible within 30-90 days). Conservative measure of liquidity.' },
    { question: 'How do you improve quick ratio?', answer: 'Strategies: (1) Increase cash (retain earnings, raise capital), (2) Collect AR faster (shorter terms, early payment discounts), (3) Reduce current liabilities (pay down short-term debt, extend AP), (4) Sell excess inventory (converts to cash), (5) Convert short-term to long-term debt. Best: faster AR collection.' },
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
