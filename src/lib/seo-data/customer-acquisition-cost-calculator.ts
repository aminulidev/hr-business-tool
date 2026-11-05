const seoData = {
  breadcrumbs: [{ label: 'Calculators' }, { label: 'CAC Calculator' }],
  tableOfContents: [
    { id: 'how-to-calculate', label: 'How to Calculate' },
    { id: 'formula', label: 'Formula' },
    { id: 'industry-benchmarks', label: '2026 CAC & Payback Benchmarks by Industry' },
    { id: 'deep-dive-guide', label: 'Blended vs. Paid CAC & Payback Guide' },
    { id: 'worked-examples', label: 'Worked Examples' },
    { id: 'frequently-asked-questions', label: 'FAQs' },
    { id: 'related-calculators', label: 'Related Calculators' },
  ],
  howToSteps: [
    'Enter your total Marketing Spend for the period (paid ads, SEO/content, events, agencies, marketing software).',
    'Enter your total Sales Spend for the period (AE/SDR base salaries, commissions, bonuses, sales tools/CRM).',
    'Enter the total number of New Paying Customers acquired during the period.',
    'Review your fully loaded Customer Acquisition Cost (CAC) and compare against 2026 industry benchmarks.',
  ],
  formula: 'Fully Loaded CAC = (Total Marketing Spend + Total Sales Spend) ÷ New Customers Acquired\nPaid CAC = Paid Advertising Spend ÷ Customers Acquired via Paid Channels\nCAC Payback Period (Months) = CAC ÷ (Monthly ARPU × Gross Margin %)',
  formulaDescription: 'Customer Acquisition Cost (CAC) measures the total sales and marketing investment required to win one new paying customer. For accurate unit economics, always calculate "Fully Loaded CAC"—including sales salaries, commissions, marketing headcount, and software overhead—and pair it with Customer Lifetime Value (target LTV:CAC ≥ 3:1).',
  benchmarkTables: [
    {
      title: '2026 Average Customer Acquisition Cost (CAC) & Payback Benchmarks',
      description: 'Industry benchmarks for fully loaded CAC, target CAC payback period, and healthy LTV:CAC ratios.',
      headers: ['Industry / Segment', 'Typical Fully Loaded CAC', 'Target CAC Payback', 'Healthy LTV:CAC Ratio'],
      rows: [
        ['B2C Mobile App / Consumer Subscription', '$15 – $75', '3 – 6 months', '2.5:1 – 4.0:1'],
        ['DTC E-Commerce / Retail', '$45 – $130', '1st or 2nd Order (< 4 mos)', '3.0:1+ (over 24 months)'],
        ['Product-Led Growth (PLG) / SMB SaaS', '$250 – $1,200', '6 – 11 months', '3.0:1 – 5.0:1'],
        ['Mid-Market B2B SaaS ($10k–$50k ACV)', '$3,500 – $12,000', '11 – 16 months', '3.0:1 – 4.5:1'],
        ['Enterprise B2B SaaS ($100k+ ACV)', '$20,000 – $65,000+', '15 – 22 months', '3.0:1 – 4.0:1'],
        ['Fintech / B2B Financial Services', '$1,200 – $8,500', '10 – 15 months', '3.5:1+'],
      ],
    },
  ],
  deepDiveSections: [
    {
      title: 'Blended CAC vs. Paid CAC: Avoid the Scaling Trap',
      paragraphs: [
        'One of the costliest mistakes growth teams make is relying solely on **Blended CAC** (total sales and marketing divided by all new customers, including organic search, word-of-mouth, and referrals) to justify increasing their paid advertising budget. Organic channels have a low marginal cost, which artificially depresses your Blended CAC.',
        'For example, if you spend $50,000 on Google Ads to acquire 25 paid customers ($2,000 Paid CAC) and simultaneously get 75 customers from organic SEO, your Blended CAC looks like a healthy $500 ($50,000 ÷ 100). If you double your Google Ads spend thinking your CAC is $500, you will actually pay $2,000+ per incremental customer and burn cash rapidly. Always track Blended CAC for overall company health and **Paid CAC by channel** for budget allocation.',
      ],
      bullets: [
        'Include Fully Loaded Salaries: Excluding SDR and Account Executive salaries from CAC (counting only ad spend) understates B2B CAC by 40% to 65%.',
        'Time-Lag Alignment: If your B2B sales cycle is 60 days, match this month\'s new customers against the marketing spend from 2 months ago plus this month\'s sales commissions.',
        'Gross Margin Adjustment: Always calculate CAC Payback using Gross Profit (ARPU × Gross Margin %), never raw top-line revenue.',
      ],
    },
  ],
  workedExamples: [
    { title: 'Mid-Market B2B SaaS', description: '$50,000 marketing spend + $40,000 sales team cost = $90,000 total S&M spend across 100 new customers. Fully Loaded CAC = $900. At $100/mo ARPU and 80% gross margin ($80/mo gross profit), CAC Payback = 11.25 months.' },
    { title: 'Enterprise Software Vendor', description: '$200,000 field marketing/events + $300,000 enterprise AE/SE comp = $500,000 spend for 20 new enterprise logos. CAC = $25,000. At $4,000/mo gross profit per customer, CAC Payback = 6.25 months.' },
    { title: 'DTC E-Commerce Brand', description: '$45,000 Meta/TikTok ad spend + $5,000 agency fee = $50,000 spend for 800 first-time buyers. CAC = $62.50.' },
  ],
  faqs: [
    { question: 'What is included in Customer Acquisition Cost (CAC)?', answer: 'Fully loaded CAC includes every expense required to generate leads and close new customers: paid advertising (Google, Meta, LinkedIn), content creation and SEO agencies, trade shows, marketing and sales software (HubSpot, Salesforce), and the fully loaded salaries, commissions, and bonuses of your marketing, SDR, and Account Executive teams.' },
    { question: 'What is the difference between CAC and CPA?', answer: 'CAC (Customer Acquisition Cost) measures the total sales and marketing cost to acquire a paying customer across the business. CPA (Cost Per Acquisition or Cost Per Action) is an ad-platform metric measuring the direct media spend required to generate a specific conversion (which could be a free trial signup, lead form, or paid purchase).' },
    { question: 'What is a good CAC payback period?', answer: 'For B2B SaaS companies, the gold-standard CAC payback period is under 12 months (meaning a customer\'s gross margin repays their acquisition cost within their first year). High-velocity SMB and PLG companies target 5 to 9 months, while enterprise SaaS companies with <5% annual churn can sustain 15 to 20 months.' },
    { question: 'Should Customer Success salaries be included in CAC?', answer: 'If your Customer Success team focuses purely on onboarding, support, and retention, their cost belongs in COGS (reducing Gross Margin) rather than CAC. However, if CSMs carry expansion quotas and spend 30% of their time upselling, allocate that 30% portion to Sales & Marketing (or track a separate Expansion CAC).' },
  ],
  relatedTools: [
    { slug: 'customer-lifetime-value-calculator', title: 'CLV Calculator', description: 'Customer lifetime value & LTV:CAC', icon: 'TrendingUp' },
    { slug: 'churn-rate-calculator', title: 'Churn Rate Calculator', description: 'Logo & MRR churn rate', icon: 'TrendingDown' },
    { slug: 'burn-rate-calculator', title: 'Burn Rate Calculator', description: 'Startup cash burn & runway', icon: 'DollarSign' },
    { slug: 'roi-calculator', title: 'ROI Calculator', description: 'Marketing & campaign ROI', icon: 'BarChart3' },
    { slug: 'commission-calculator', title: 'Sales Commission Calculator', description: 'Sales rep commission structures', icon: 'BadgeDollarSign' },
  ],
};
export default seoData;
