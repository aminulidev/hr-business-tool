const seoData = {
  breadcrumbs: [{ label: 'Calculators' }, { label: 'Amortization Calculator' }],
  tableOfContents: [
    { id: 'how-to-calculate', label: 'How to Calculate' },
    { id: 'formula', label: 'Formula' },
    { id: 'worked-examples', label: 'Worked Examples' },
    { id: 'frequently-asked-questions', label: 'FAQs' },
    { id: 'related-calculators', label: 'Related Calculators' },
  ],
  howToSteps: [
    'Enter loan amount.',
    'Enter annual interest rate (%).',
    'Enter loan term in years.',
    'Click Calculate to see monthly payment and total interest.',
  ],
  formula: 'Monthly Payment = P x [r(1+r)^n] / [(1+r)^n - 1]\nP = Principal, r = Monthly Rate, n = Number of Payments\nTotal Interest = (Monthly x n) - Principal',
  formulaDescription: 'Loan amortization: each payment = principal + interest. Early payments mostly interest; later mostly principal. Formula: M = P × [r(1+r)^n] / [(1+r)^n - 1]. For intangible assets: straight-line amortization = cost / useful life. See our Depreciation Calculator.',
  workedExamples: [
    { title: '30-Year Mortgage', description: '$250k loan, 6.5% APR, 30 years. Monthly = $1,580. Total paid = $568,800. Total interest = $318,800. 127% of loan.' },
    { title: '15-Year Mortgage', description: '$250k, 5.5%, 15 years. Monthly = $2,042. Total = $367,600. Interest = $117,600. 47% of loan. Higher payment, less interest.' },
    { title: 'Business Loan', description: '$100k, 8%, 5 years. Monthly = $2,028. Total = $121,680. Interest = $21,680. 22% of loan.' },
    { title: 'Car Loan', description: '$30k, 6%, 5 years. Monthly = $580. Total = $34,800. Interest = $4,800. 16% of loan.' },
    { title: 'Intangible Asset', description: '$100k patent, 10-year useful life. Annual amortization = $10k/year. Straight-line over useful life.' },
  ],
  faqs: [
    { question: 'What is amortization?', answer: 'Two meanings: (1) Loan amortization = paying off debt with regular payments (principal + interest). (2) Intangible asset amortization = allocating cost of intangible asset (patent, trademark, goodwill) over useful life. Both spread cost over time. See our Depreciation Calculator for tangible assets.' },
    { question: 'How is loan amortization calculated?', answer: 'Monthly payment = P × [r(1+r)^n] / [(1+r)^n - 1] where P = principal, r = monthly interest rate, n = number of payments. Example: $250k loan, 6.5% APR (0.542%/month), 360 payments. M = $1,580. Early payments mostly interest; later mostly principal. Total interest = (M × n) - P.' },
    { question: 'What is an amortization schedule?', answer: 'Table showing each payment\'s breakdown: (1) Payment number, (2) Payment amount, (3) Interest portion, (4) Principal portion, (5) Remaining balance. Early payments: mostly interest. Later: mostly principal. Lenders provide schedule at loan closing. Useful for: planning early payoff, tax deduction (interest), refinancing decisions.' },
    { question: 'How do you amortize intangible assets?', answer: 'Straight-line amortization = cost / useful life. Example: $100k patent, 10-year life = $10k/year. Intangible assets: patents, trademarks, copyrights, franchise rights, customer lists, goodwill (amortized for tax, tested for impairment for books). Software: 3-year life. Goodwill: no book amortization (ASC 350), 15-year tax amortization.' },
    { question: 'How do you pay off a loan early?', answer: 'Strategies: (1) Extra payments (any amount reduces principal), (2) Bi-weekly payments (26 half-payments = 13 full payments/year), (3) Round up payment, (4) Refinance to shorter term, (5) Lump-sum payments. Each extra $1 reduces future interest. Example: $100/month extra on 30-year mortgage saves ~5 years and $50k+ interest. Check for prepayment penalties.' },
    { question: 'What is the difference between amortization and depreciation?', answer: 'Amortization = intangible assets (patents, trademarks, goodwill). Depreciation = tangible assets (equipment, buildings, vehicles). Both allocate cost over useful life. Both are non-cash expenses. Goodwill: no book amortization (tested for impairment), 15-year tax amortization. See our Depreciation Calculator.' },
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
