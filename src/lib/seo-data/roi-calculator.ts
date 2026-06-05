const seoData = {
  breadcrumbs: [
        { label: 'Calculators' },
        { label: 'ROI Calculator' },
      ],
  tableOfContents: [
        { id: 'how-to-calculate', label: 'How to Calculate' },
        { id: 'formula', label: 'ROI Formula' },
        { id: 'worked-examples', label: 'Worked Examples' },
        { id: 'frequently-asked-questions', label: 'FAQs' },
        { id: 'related-calculators', label: 'Related Calculators' },
      ],
  workedExamples: [
        {
          title: 'Stock Investment',
          description:
            'You invested $10,000 in stocks. After 2 years, the portfolio is worth $13,000. Your profit is $3,000, giving a total ROI of 30%. The annualized ROI is 14.02%, meaning your investment grew at an equivalent rate of about 14% per year on a compound basis.',
        },
        {
          title: 'Marketing Campaign',
          description:
            'A marketing campaign cost $5,000 in labor plus $2,000 in ad spend, totaling $7,000 invested. It generated $12,000 in revenue. The profit is $5,000, yielding an ROI of 71.43% ($5,000 profit on $7,000 invested).',
        },
        {
          title: 'Real Estate Investment',
          description:
            'You put a $50,000 down payment on a property and sold it 5 years later, netting $80,000 after all costs. Your profit is $30,000, for a total ROI of 60%. The annualized ROI is 9.86%, reflecting the compound annual growth rate over the 5-year holding period.',
        },
      ],
  relatedTools: [
        { slug: 'profit-margin-calculator', title: 'Profit Margin Calculator', description: 'Calculate profit margins on sales', icon: 'Percent' },
        { slug: 'commission-calculator', title: 'Sales Commission Calculator', description: 'Calculate commission costs vs revenue', icon: 'DollarSign' },
        { slug: 'payroll-calculator', title: 'Payroll Calculator', description: 'Factor labor costs into ROI', icon: 'CreditCard' },
        { slug: 'salary-increase-calculator', title: 'Salary Increase Calculator', description: 'Evaluate ROI of career growth', icon: 'TrendingUp' },
        { slug: 'time-card-calculator', title: 'Time Card Calculator', description: 'Track hours for project ROI', icon: 'Clock' },
        { slug: 'bonus-tax-calculator', title: 'Bonus Tax Calculator', description: 'Calculate net returns after tax', icon: 'Gift' },
      ],
  howToSteps: [
        'Enter your Initial Investment amount — the original capital you put into the investment at the start.',
        'Enter the Final Value — the total amount the investment is worth now, including your original capital and all gains.',
        'Optionally, enter any Additional Contributions you made during the investment period (beyond the initial investment).',
        'Specify the Investment Duration in years to calculate the annualized return rate.',
        'Click "Calculate ROI" to see your total profit, overall ROI percentage, annualized return, and a visual investment health assessment.',
      ],
  formula: "ROI (%) = ((Final Value - Cost) / Cost) × 100",
  formulaDescription: "ROI measures the profitability of an investment as a percentage of the total cost. The annualized ROI formula accounts for the time period, allowing you to compare investments of different durations on equal footing: Annualized ROI = ((Final Value / Cost)^(1/n) - 1) × 100, where n is the number of years.",
  faqs: [
        {
          question: 'What is a good ROI?',
          answer:
            'A "good" ROI depends on the investment type and risk level. For the stock market, the S&P 500 historically returns about 10% annually before inflation, so an annualized ROI above 10% is generally considered strong. Real estate investments typically target 8-12% annual returns. For startup investments or venture capital, investors often look for 25%+ annual returns to compensate for the higher risk. Always compare your ROI against benchmarks relevant to your specific investment category.',
        },
        {
          question: 'How is ROI different from profit?',
          answer:
            'Profit is an absolute dollar amount — the difference between what you invested and what you received. ROI expresses that profit as a percentage of the total cost, making it easy to compare investments of different sizes. For example, a $1,000 profit on a $2,000 investment (50% ROI) is proportionally much better than a $1,000 profit on a $50,000 investment (2% ROI), even though the dollar profit is the same.',
        },
        {
          question: 'What is annualized ROI?',
          answer:
            'Annualized ROI converts your total return into an equivalent yearly rate, allowing you to compare investments held for different periods. For instance, a 30% return over 3 years is equivalent to roughly 9.14% per year. The formula uses compound growth: Annualized ROI = ((Final Value / Cost)^(1/years) - 1) × 100. This is sometimes called Compound Annual Growth Rate (CAGR) and gives a more accurate picture of long-term investment performance.',
        },
        {
          question: 'How does ROI account for time?',
          answer:
            'Basic ROI does not account for time — a 50% return over 1 year and a 50% return over 10 years both show the same ROI. That is why annualized ROI is important. Annualized ROI normalizes returns to a per-year basis using compound growth calculations, enabling apples-to-apples comparisons across investments with different holding periods. This metric reveals the true efficiency of capital deployment over time.',
        },
        {
          question: 'What is considered a good ROI?',
          answer:
            'A good ROI depends on the investment type and risk level. Stock market long-term average is 7-10% annualized. Real estate typically 8-12%. Marketing campaigns often target 300-500% ROI (5:1 return). Venture capital targets 10x+ ROI. Always compare against your cost of capital and industry benchmarks.',
        },
        {
          question: 'How is ROI different from profit?',
          answer:
            'Profit is the absolute dollar amount gained ($), while ROI is the percentage return relative to the amount invested. A $1,000 profit on a $100 investment is 1,000% ROI — very different from $1,000 profit on a $100,000 investment (1% ROI). ROI enables comparison across different investment sizes.',
        },
        {
          question: 'Does ROI account for the time value of money?',
          answer:
            'Simple ROI does not account for time — a 50% ROI over 1 year is very different from 50% over 10 years. Annualized ROI addresses this by expressing the return as an equivalent yearly rate, enabling fair comparison regardless of investment duration.',
        },
        {
          question: 'How do taxes affect ROI?',
          answer:
            'Taxes can significantly reduce your actual ROI. Investment gains may be subject to capital gains tax (short-term: ordinary income rate; long-term: 0-20%). Real estate has depreciation benefits. Always calculate after-tax ROI for accurate investment comparison, especially across different asset classes with different tax treatments.',
        },
      ],
};

export default seoData;
