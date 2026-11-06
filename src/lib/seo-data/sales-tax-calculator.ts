import type { CalculatorSeoData } from './types';
const seoData = {
  breadcrumbs: [{ label: 'Calculators' }, { label: 'Sales Tax Calculator' }],
  tableOfContents: [
    { id: 'how-to-calculate', label: 'How to Calculate' },
    { id: 'formula', label: 'Formula' },
    { id: 'industry-benchmarks', label: '2026 US State Sales Tax Rate Table' },
    { id: 'deep-dive-guide', label: 'Forward vs. Reverse Sales Tax Guide' },
    { id: 'worked-examples', label: 'Worked Examples' },
    { id: 'frequently-asked-questions', label: 'FAQs' },
    { id: 'related-calculators', label: 'Related Calculators' },
  ],
  howToSteps: [
    'Choose "Add Sales Tax (Forward)" if you have a pre-tax subtotal, or "Extract Tax (Reverse)" if you have a tax-inclusive receipt total.',
    'Enter the dollar amount and item quantity.',
    'Enter your combined State + Local Sales Tax Rate percentage (or click any of the quick state rate presets).',
    'View the exact Pre-Tax Subtotal, Sales Tax Dollar Amount, and Tax-Inclusive Total Price immediately.',
  ],
  formula: 'Forward Sales Tax:\n  Sales Tax Amount = Pre-Tax Price × (Sales Tax Rate % ÷ 100)\n  Total Tax-Inclusive Price = Pre-Tax Price + Sales Tax Amount\n\nReverse Sales Tax (Backing Out Tax from Total Receipt):\n  Pre-Tax Price = Total Tax-Inclusive Price ÷ (1 + Sales Tax Rate % ÷ 100)\n  Extracted Sales Tax = Total Tax-Inclusive Price − Pre-Tax Price',
  formulaDescription: 'Calculate both forward sales tax (adding state and local sales tax to a net price) and reverse sales tax (backing out the exact pre-tax revenue and sales tax payable from a tax-inclusive gross receipt).',
  benchmarkTables: [
    {
      title: '2026 Major US State & Average Local Sales Tax Rates Reference',
      description: 'Base state sales tax rates and typical combined state + county/city sales tax rates across major US jurisdictions.',
      headers: ['State', 'Base State Rate', 'Max Local Tax Add-On', 'Avg Combined Rate', 'Economic Nexus Threshold (Remote Sellers)'],
      rows: [
        ['California (CA)', '7.25%', 'Up to 3.50%', '8.85% (LA: 9.50%)', '$500,000 annual CA sales'],
        ['Texas (TX)', '6.25%', 'Up to 2.00%', '8.20% (Austin/Dallas: 8.25%)', '$500,000 annual TX sales'],
        ['New York (NY)', '4.00%', 'Up to 4.875%', '8.53% (NYC: 8.875%)', '$500,000 AND 100+ transactions'],
        ['Florida (FL)', '6.00%', 'Up to 2.00%', '7.02% (Miami: 7.00%)', '$100,000 annual FL taxable sales'],
        ['Illinois (IL)', '6.25%', 'Up to 4.75%', '8.86% (Chicago: 10.25%)', '$100,000 annual sales'],
        ['Washington (WA)', '6.50%', 'Up to 4.10%', '9.38% (Seattle: 10.35%)', '$100,000 annual gross receipts'],
        ['Pennsylvania (PA)', '6.00%', 'Up to 2.00%', '6.34% (Philly: 8.00%)', '$100,000 annual PA sales'],
        ['NOMAD States (DE, MT, NH, OR) + AK', '0.00%', '0.00% (except local AK)', '0.00% State Sales Tax', 'No statewide sales tax'],
      ],
    },
  ],
  deepDiveSections: [
    {
      title: 'How to Calculate Reverse Sales Tax from a Gross Receipt',
      paragraphs: [
        'Bookkeepers, retail managers, and event vendors often sell items at a flat tax-inclusive price (for example, "$20.00 tax included") and need to back out how much of that $20.00 is net revenue vs. sales tax owed to the state Department of Revenue.',
        'Never multiply the gross receipt by the tax rate! If your tax rate is 8.25% and you collect $100.00 tax-inclusive, multiplying $100 × 8.25% gives $8.25 (which is wrong because it taxes the tax). Instead, **divide the gross total by `1 + Tax Rate`**: `$100.00 ÷ 1.0825 = $92.38` Pre-Tax Price, and `$100.00 − $92.38 = $7.62` Sales Tax payable.',
      ],
      bullets: [
        'Five States With 0% State Sales Tax: Alaska, Delaware, Montana, New Hampshire, and Oregon (the "NOMAD" states) levy 0% statewide sales tax, though Alaska permits local municipal sales taxes.',
        'SaaS & Digital Goods Taxability: Roughly 25 US states (including Texas, New York, Washington, and Pennsylvania) tax B2B or B2C Software-as-a-Service (SaaS) subscriptions, while California and Florida generally exempt pure cloud SaaS with no physical media.',
      ],
    },
  ],
  workedExamples: [
    { title: 'Forward Sales Tax (Texas 8.25% Rate)', description: 'Buying 3 monitors at $350.00 each = $1,050.00 pre-tax subtotal. Sales tax at 8.25% = $86.63. Total out-of-pocket checkout price = $1,136.63.' },
    { title: 'Reverse Sales Tax (NYC 8.875% Tax-Inclusive Receipt)', description: 'A restaurant collects $500.00 in gross tax-inclusive sales in New York City (8.875% tax). Pre-tax net revenue = $500 ÷ 1.08875 = $459.24. Sales tax to remit to NYS = $40.76.' },
    { title: 'Chicago Retail Purchase (10.25% Combined Rate)', description: '$240.00 pre-tax merchandise × 10.25% = $24.60 sales tax, for a total receipt of $264.60.' },
  ],
  faqs: [
    { question: 'How do you calculate sales tax on a purchase?', answer: 'Convert the sales tax percentage to a decimal by dividing by 100 (for example, 8.25% becomes 0.0825), then multiply by the pre-tax price. On a $150 item at 8.25% tax, the sales tax is $150 × 0.0825 = $12.38, making the total price $162.38.' },
    { question: 'How do you back out sales tax from a total price (reverse sales tax)?', answer: 'Divide the tax-inclusive total price by (1 + the sales tax rate as a decimal). For example, if a tax-inclusive receipt is $108.25 and the tax rate is 8.25%, divide $108.25 by 1.0825 to get the $100.00 pre-tax price and $8.25 in sales tax.' },
    { question: 'Which US states have no sales tax in 2026?', answer: 'Five US states have no statewide sales tax: Delaware, Montana, New Hampshire, Oregon, and Alaska (though some local municipalities in Alaska charge a local sales tax). They are commonly remembered by the acronym NOMAD.' },
    { question: 'What is the difference between origin-based and destination-based sales tax?', answer: 'In destination-based states (the majority of US states, including CA, NY, and FL), sales tax is calculated based on the buyer\'s shipping address. In origin-based states (such as intrastate sales in Texas, Pennsylvania, and Ohio), sales tax for in-state shipments is based on the seller\'s business location.' },
  ],
  relatedTools: [
    { slug: 'discount-calculator', title: 'Discount Calculator', description: 'Sale price + sales tax calculator', icon: 'Percent' },
    { slug: 'markup-calculator', title: 'Markup Calculator', description: 'Retail price markup & margin', icon: 'DollarSign' },
    { slug: 'profit-margin-calculator', title: 'Profit Margin Calculator', description: 'Gross & net profit margin', icon: 'BarChart3' },
    { slug: 'break-even-calculator', title: 'Break-Even Calculator', description: 'Break-even units & revenue', icon: 'Target' },
    { slug: 'commission-calculator', title: 'Sales Commission Calculator', description: 'Pre-tax sales commission', icon: 'BadgeDollarSign' },
  ],
} satisfies CalculatorSeoData;
export default seoData;