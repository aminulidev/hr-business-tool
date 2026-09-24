const seoData = {
  breadcrumbs: [{ label: 'Calculators' }, { label: 'Sales Incentive Calculator' }],
  tableOfContents: [
    { id: 'how-to-calculate', label: 'How to Calculate' },
    { id: 'formula', label: 'Formula' },
    { id: 'worked-examples', label: 'Worked Examples' },
    { id: 'frequently-asked-questions', label: 'FAQs' },
    { id: 'related-calculators', label: 'Related Calculators' },
  ],
  howToSteps: [
    'Enter base salary.',
    'Enter commission at 100% quota.',
    'Enter bonus at 100% quota.',
    'Enter SPIFFs (annual).',
    'Click Calculate to see OTE and pay mix.',
  ],
  formula: 'OTE = Base + Commission + Bonus + SPIFFs\nVariable Comp = Commission + Bonus + SPIFFs\nPay Mix = Variable / OTE x 100\nVariable/Base Ratio = Variable / Base',
  formulaDescription: 'OTE (On-Target Earnings) = base + commission at quota + bonus + SPIFFs. Pay mix = variable / OTE. Typical SaaS: 50/50 to 60/40 (base/variable). Higher variable = more risk/reward. Used for sales comp plan design.',
  workedExamples: [
    { title: 'SaaS AE', description: '$80k base, $60k commission, $15k bonus, $5k SPIFFs. OTE = $160k. Variable = $80k. Pay mix = 50% variable.' },
    { title: 'Enterprise AE', description: '$120k base, $120k commission, $20k bonus, $0 SPIFFs. OTE = $260k. Variable = $140k. Pay mix = 54% variable.' },
    { title: 'SMB AE', description: '$50k base, $40k commission, $5k bonus, $3k SPIFFs. OTE = $98k. Variable = $48k. Pay mix = 49% variable.' },
    { title: 'SDR', description: '$50k base, $20k commission, $5k bonus, $5k SPIFFs. OTE = $80k. Variable = $30k. Pay mix = 38% variable.' },
    { title: 'High Variable Plan', description: '$40k base, $80k commission, $10k bonus, $10k SPIFFs. OTE = $140k. Variable = $100k. Pay mix = 71% variable. Risk/reward.' },
  ],
  faqs: [
    { question: 'What is OTE?', answer: 'OTE (On-Target Earnings) = total compensation at 100% quota attainment = base + commission + bonus + SPIFFs. Example: $80k base + $60k commission + $15k bonus + $5k SPIFFs = $160k OTE. Used for: recruiting (job postings), comp plan design, benchmarking. Reps typically earn 70-90% of OTE (due to <100% attainment).' },
    { question: 'What is a good sales pay mix?', answer: 'Typical: 50/50 to 60/40 (base/variable). SaaS AE: 50/50. Enterprise AE: 45/55 (more variable). SDR: 65/35 (more base, less risk). Hunter roles: 40/60 (high variable). Farmer/account manager: 70/30 (more base). Higher variable = more risk/reward. Choose based on: sales cycle, deal size, rep experience, company stage.' },
    { question: 'What is variable compensation?', answer: 'Variable comp = commission + bonus + SPIFFs (everything that varies with performance). Excludes base salary. Example: $80k base, $80k variable = $160k OTE, 50% variable. Higher variable = more upside but more risk. Top performers prefer high variable (uncapped upside). Risk-averse prefer high base.' },
    { question: 'How do you design a sales comp plan?', answer: 'Steps: (1) Set OTE target (benchmark to market), (2) Choose pay mix (50/50 for SaaS), (3) Set quota (4-6x OTE), (4) Commission rate (OTE × variable% / quota), (5) Bonus structure (at quota), (6) Accelerator (above quota), (7) SPIFFs for specific behaviors. Test with historical data. Review annually.' },
    { question: 'What is the typical quota-to-OTE ratio?', answer: 'Typical: 4-6x OTE. Example: $160k OTE, 5x = $800k quota. SaaS: 4-5x. Enterprise: 5-6x. SMB: 3-4x (shorter cycle, higher volume). Below 3x = too easy (company overpays). Above 7x = too hard (reps give up). Industry benchmark: 60-70% of reps at 100%+ attainment. See our Quota Calculator.' },
    { question: 'Should commission be capped?', answer: 'Generally NO — caps demotivate top performers. If rep hits 200% quota, they\'ve earned the payout. Alternative: reduce rate above 200% (decelerator). Uncapped is best for retention. BUT: some companies cap at 200-300% to control costs. Evaluate: cost of cap (lost top performers) vs cost of no cap (high payouts). See our Sales Bonus Calculator.' },
  ],
  relatedTools: [
    { slug: 'commission-calculator', title: 'Sales Commission Calculator', description: 'Flat-rate commission', icon: 'DollarSign' },
    { slug: 'roi-calculator', title: 'ROI Calculator', description: 'Return on investment', icon: 'BarChart3' },
    { slug: 'break-even-calculator', title: 'Break-Even Calculator', description: 'Break-even analysis', icon: 'Target' },
    { slug: 'profit-margin-calculator', title: 'Profit Margin Calculator', description: 'Margin analysis', icon: 'Percent' },
    { slug: 'revenue-forecast-calculator', title: 'Revenue Forecast', description: 'Revenue projection', icon: 'TrendingUp' },
  ],
};
export default seoData;
