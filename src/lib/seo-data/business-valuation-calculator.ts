const seoData = {
  breadcrumbs: [{ label: 'Calculators' }, { label: 'Business Valuation Calculator' }],
  tableOfContents: [
    { id: 'how-to-calculate', label: 'How to Calculate' },
    { id: 'formula', label: 'Formula' },
    { id: 'worked-examples', label: 'Worked Examples' },
    { id: 'frequently-asked-questions', label: 'FAQs' },
    { id: 'related-calculators', label: 'Related Calculators' },
  ],
  howToSteps: [
    'Enter annual revenue.',
    'Enter annual EBITDA.',
    'Enter net assets (book value).',
    'Enter revenue multiple (industry: 0.5-3x typical, 5-10x SaaS).',
    'Enter EBITDA multiple (industry: 3-8x typical, 10-15x tech).',
    'Click Calculate to see valuation range across methods.',
  ],
  formula: 'Revenue-Based Value = Revenue x Revenue Multiple\nEBITDA-Based Value = EBITDA x EBITDA Multiple\nAsset-Based Value = Net Assets\nMid Estimate = Average of Methods\nRange = Min to Max',
  formulaDescription: 'Business valuation methods: (1) Revenue multiple (0.5-3x typical, 5-10x SaaS), (2) EBITDA multiple (3-8x typical, 10-15x tech), (3) Asset-based (book value). Mid estimate = average. True value = what buyer will pay. Hire appraiser for formal valuation.',
  workedExamples: [
    { title: 'Small Business', description: '$1M revenue, $200k EBITDA, $300k assets. 1x rev, 4x EBITDA. Rev value = $1M, EBITDA value = $800k, Asset = $300k. Mid = $700k. Range $300k-$1M.' },
    { title: 'SaaS Company', description: '$2M revenue, $500k EBITDA, $200k assets. 5x rev, 10x EBITDA. Rev = $10M, EBITDA = $5M, Asset = $200k. Mid = $5M. Range $200k-$10M.' },
    { title: 'Manufacturing', description: '$5M revenue, $750k EBITDA, $2M assets. 0.8x rev, 5x EBITDA. Rev = $4M, EBITDA = $3.75M, Asset = $2M. Mid = $3.25M. Range $2M-$4M.' },
    { title: 'Loss-Making Startup', description: '$1M revenue, -$200k EBITDA, $100k assets. 2x rev, N/A EBITDA. Rev = $2M, EBITDA = N/A, Asset = $100k. Use rev multiple.' },
    { title: 'Mature Business', description: '$3M revenue, $600k EBITDA, $1.5M assets. 0.7x rev, 4x EBITDA. Rev = $2.1M, EBITDA = $2.4M, Asset = $1.5M. Mid = $2M. Range $1.5M-$2.4M.' },
  ],
  faqs: [
    { question: 'What is business valuation?', answer: 'Estimating the value of a business. Methods: (1) Revenue multiple (revenue × industry multiple), (2) EBITDA multiple (EBITDA × industry multiple), (3) Asset-based (net asset value), (4) DCF (discounted cash flow). True value = what a buyer will pay. Hire a business appraiser (CVA, ABV) for formal valuation.' },
    { question: 'What revenue multiple should I use?', answer: 'Industry varies: small business 0.5-1.5x, SaaS 5-10x, tech 3-7x, healthcare 1-3x, retail 0.3-0.8x, manufacturing 0.5-1.2x, services 0.5-1.5x. Higher multiples for: high growth, high margin, recurring revenue, strategic value. Use median multiple from recent comparable sales (BizBuySell, Pratt\'s Stats).' },
    { question: 'What EBITDA multiple should I use?', answer: 'Industry varies: small business 2-4x, middle market 5-8x, large cap 8-12x, SaaS 10-15x+. Higher for: high growth, high margin, recurring revenue, large scale. Lower for: declining, cyclical, customer concentration. Use comparable company analysis (public peers) or precedent transactions.' },
    { question: 'What is DCF valuation?', answer: 'Discounted Cash Flow = present value of projected future cash flows. Steps: (1) Project cash flows 5-10 years, (2) Estimate terminal value (Gordon growth or exit multiple), (3) Discount to present using WACC. Most theoretically sound method but sensitive to assumptions. Use alongside multiples for range. See our Cash Flow Forecast Calculator.' },
    { question: 'How do I value a small business?', answer: 'Common for small business: (1) SDE (Seller\'s Discretionary Earnings) × 2-3x = value. SDE = net profit + owner salary + owner perks + interest + depreciation. (2) EBITDA × 3-5x. (3) Revenue × 0.5-1.5x. Adjust for: owner dependence, customer concentration, growth, industry trends. Get SBA loan pre-approval to validate.' },
    { question: 'What affects business valuation?', answer: 'Factors: (1) Financial performance (revenue growth, profitability), (2) Industry (growth, multiples), (3) Size (larger = higher multiple), (4) Recurring revenue (higher multiple), (5) Customer concentration (lower = riskier), (6) Management team, (7) Market position, (8) Growth potential, (9) Economic conditions. Improve these to increase value.' },
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
