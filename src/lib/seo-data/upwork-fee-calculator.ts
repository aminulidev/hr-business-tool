const seoData = {
  breadcrumbs: [{ label: 'Calculators' }, { label: 'Upwork Fee Calculator' }],
  tableOfContents: [
    { id: 'how-to-calculate', label: 'How to Calculate' },
    { id: 'formula', label: 'Formula' },
    { id: 'industry-benchmarks', label: '2026 Upwork Fee Structure & Bid Table' },
    { id: 'deep-dive-guide', label: 'How to Price Bids to Cover Upwork Fees' },
    { id: 'worked-examples', label: 'Worked Examples' },
    { id: 'frequently-asked-questions', label: 'FAQs' },
    { id: 'related-calculators', label: 'Related Calculators' },
  ],
  howToSteps: [
    'Enter your Contract or Milestone Amount (or Hourly Rate × Weekly Hours).',
    'Select your applicable Upwork Freelancer Service Fee tier (10% standard flat fee, 5% legacy/Enterprise, 15% specialized tier, or 0% Direct-to-Talent / Bring-Your-Own-Client).',
    'Select your payout withdrawal method ($0.00 ACH Direct to US Bank, $0.99 Local Bank, $2.00 Instant Pay, or $30.00 USD Wire).',
    'Check both your Net Freelancer Take-Home Pay and the Reverse Client Bid Required to net 100% of your target amount.',
  ],
  formula: 'Upwork Service Fee = Contract Amount × (Service Fee % ÷ 100)\nNet Freelancer Payout = Contract Amount − Upwork Service Fee − Withdrawal Fee\nRequired Client Bid (to Net Target $) = (Desired Net Payout + Withdrawal Fee) ÷ (1 − Service Fee %)',
  formulaDescription: 'Calculate your exact Upwork take-home earnings after Upwork\'s Freelancer Service Fee (typically 10%) and payout withdrawal fees, plus calculate the exact Reverse Bid Amount you need to quote a client so you walk away with 100% of your target rate.',
  benchmarkTables: [
    {
      title: 'Upwork Take-Home vs. Required Reverse Bid Reference Table (10% Standard Fee)',
      description: 'Compare what you keep when quoting a flat price vs. how much you must bid to net the full amount after Upwork\'s 10% service fee.',
      headers: ['Target Amount', 'Upwork 10% Fee (If Quoted Flat)', 'Net Take-Home (If Quoted Flat)', 'Required Client Bid to Net Full Target', 'Client 5% Marketplace Fee (Est.)'],
      rows: [
        ['$50 / hr', '$5.00 / hr', '$45.00 / hr', '$55.56 / hr', '~$2.78 / hr'],
        ['$75 / hr', '$7.50 / hr', '$67.50 / hr', '$83.33 / hr', '~$4.17 / hr'],
        ['$100 / hr', '$10.00 / hr', '$90.00 / hr', '$111.11 / hr', '~$5.56 / hr'],
        ['$500 Milestone', '$50.00', '$450.00', '$555.56', '~$27.78'],
        ['$1,000 Milestone', '$100.00', '$900.00', '$1,111.11', '~$55.56'],
        ['$2,500 Project', '$250.00', '$2,250.00', '$2,777.78', '~$138.89'],
        ['$5,000 Project', '$500.00', '$4,500.00', '$5,555.56', '~$277.78'],
        ['$10,000 Contract', '$1,000.00', '$9,000.00', '$11,111.11', '~$555.56'],
      ],
    },
    {
      title: 'Upwork Freelancer & Client Fee Schedule Overview',
      description: 'Summary of Upwork service fees, Direct Contract fees, and withdrawal fees.',
      headers: ['Fee Type', 'Rate / Amount', 'Who Pays It', 'Notes & Eligibility'],
      rows: [
        ['Standard Marketplace Service Fee', '10% Flat (or 5–15% dynamic tier)', 'Freelancer', 'Deducted automatically from hourly & fixed-price payments'],
        ['Direct Contracts (Bring Your Own Client)', '0% – 5% Freelancer Fee', 'Freelancer', '0% for Freelancer Plus members on eligible BYOC contracts'],
        ['Client Marketplace Fee', 'Up to 5% per payment', 'Client', 'Charged on top of the contract invoice to the hiring client'],
        ['Client Contract Initiation Fee', 'Up to $9.95 – $29.95 one-time', 'Client', 'One-time fee when starting a new marketplace contract'],
        ['ACH Direct Deposit (US Bank)', '$0.00 (Free)', 'Freelancer', 'Standard 1–3 business day ACH transfer in USD'],
        ['Direct to Local Bank / Instant Pay', '$0.99 – $2.00 per transfer', 'Freelancer', 'Non-US local currency transfer ($0.99) or US debit card ($2.00)'],
      ],
    },
  ],
  deepDiveSections: [
    {
      title: 'Why Adding 10% to Your Rate Still Leaves You Short (The Divide-by-0.90 Rule)',
      paragraphs: [
        'Many Upwork freelancers who want to net $1,000 on a milestone simply add 10% to their quote and bid $1,100. However, Upwork deducts its 10% service fee from the **entire gross bid ($1,100)**—meaning Upwork takes $110 and you receive $990, leaving you $10 short.',
        'To net your exact target amount after a 10% fee, you must **divide your target amount by `0.90` (which equals multiplying by `1.1111`)**. For a $1,000 net payout, `$1,000 ÷ 0.90 = $1,111.11`. When Upwork deducts 10% ($111.11) from $1,111.11, you walk away with exactly $1,000.00.',
      ],
      bullets: [
        'Are Upwork Service Fees Tax Deductible? Yes! For US freelancers filing Schedule C (Form 1040), Upwork gives you a gross 1099-K/ earnings summary, and you deduct 100% of Upwork service fees, Connects purchases, and withdrawal fees as ordinary business expenses (Commissions and Fees).',
        'Batch Your Withdrawals: If you use Instant Pay ($2.00) or international Wire Transfers ($30.00), set your automatic withdrawal schedule to biweekly or monthly rather than after every small milestone.',
      ],
    },
  ],
  workedExamples: [
    { title: '$1,500 Fixed-Price Website Milestone (10% Fee)', description: 'Quoting $1,500 flat results in a $150.00 Upwork service fee and $1,350.00 net take-home (via free US ACH). To net a full $1,500.00 in your bank account, bid $1,666.67 ($1,500 ÷ 0.90).' },
    { title: '$85/Hour Net Target Rate on Hourly Contract', description: 'To take home $85.00/hour after Upwork\'s 10% fee, set your profile/proposal hourly rate to $94.44/hour ($85 ÷ 0.90). Over a 30-hour week, gross billings are $2,833.20, Upwork takes $283.32, and you net $2,549.88.' },
    { title: '$3,000 Enterprise / 5% Tier Contract', description: 'On a 5% fee contract, Upwork deducts $150.00 from a $3,000 invoice, leaving $2,850.00 net take-home. To net $3,000.00, bid $3,157.89 ($3,000 ÷ 0.95).' },
  ],
  faqs: [
    { question: 'How much does Upwork charge freelancers in 2026?', answer: 'Upwork\'s standard Freelancer Service Fee is 10% on most hourly, fixed-price, and Project Catalog contracts (with select specialized categories or legacy/Enterprise tiers ranging from 5% to 15%, and 0% to 5% on Direct Contracts when you bring your own client).' },
    { question: 'How do I calculate what to bid on Upwork to get my exact desired amount?', answer: 'Divide your desired net take-home amount by (1 minus the Upwork fee rate). For a 10% fee, divide your target amount by 0.90. For example, to receive $500 net after a 10% fee, bid $500 ÷ 0.90 = $555.56.' },
    { question: 'Does Upwork charge a fee to clients too?', answer: 'Yes. Separate from the freelancer service fee, Upwork charges clients a Marketplace Fee of up to 5% on each payment plus a one-time Contract Initiation Fee on new contracts. These client fees are billed directly to the client and do not reduce your quoted contract amount.' },
    { question: 'Can I write off Upwork fees on my taxes?', answer: 'Yes. Upwork service fees, Freelancer Plus membership fees, Connects, and payment withdrawal fees are 100% tax-deductible business expenses on IRS Schedule C, reducing both your federal income tax and your 15.3% self-employment tax.' },
  ],
  relatedTools: [
    { slug: 'freelance-hourly-rate-calculator', title: 'Freelance Hourly Rate Calculator', description: 'Calculate your target hourly & day rate', icon: 'DollarSign' },
    { slug: 'billable-hours-calculator', title: 'Billable Hours Calculator', description: 'Track utilization & billable revenue', icon: 'Clock' },
    { slug: 'fica-tax-calculator', title: 'Self-Employment Tax Calculator', description: '15.3% SECA & Medicare tax breakdown', icon: 'Percent' },
    { slug: 'commission-calculator', title: 'Commission Calculator', description: 'Percentage fee & commission math', icon: 'BadgeDollarSign' },
    { slug: 'profit-margin-calculator', title: 'Profit Margin Calculator', description: 'Net profit margin after platform fees', icon: 'BarChart3' },
  ],
};
export default seoData;
