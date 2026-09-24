const seoData = {
  breadcrumbs: [{ label: 'Calculators' }, { label: 'ROAS Calculator' }],
  tableOfContents: [
    { id: 'how-to-calculate', label: 'How to Calculate' },
    { id: 'formula', label: 'Formula' },
    { id: 'worked-examples', label: 'Worked Examples' },
    { id: 'frequently-asked-questions', label: 'FAQs' },
    { id: 'related-calculators', label: 'Related Calculators' },
  ],
  howToSteps: [
    'Enter ad spend.',
    'Enter revenue from ads.',
    'Click Calculate to see ROAS ratio and percentage.',
  ],
  formula: 'ROAS = Ad Revenue / Ad Spend\nTarget: 4:1 (400%) for ecommerce, 3:1 for SaaS\nDifferent from ROI (ROAS excludes overhead)\nTrack by campaign and channel.',
  formulaDescription: 'ROAS = revenue from ads / ad spend. Different from ROI (ROAS excludes overhead, only ad spend). Target: 4:1 (400%) for ecommerce, 3:1 for SaaS, 2:1 for brand awareness. Track by campaign, ad group, keyword.',
  workedExamples: [
    { title: 'E-commerce', description: '$5,000 ad spend, $25,000 ad revenue. ROAS = 5x (500%). Above 4x target. Strong.' },
    { title: 'SaaS', description: '$10,000 ad spend, $35,000 ad revenue. ROAS = 3.5x (350%). Above 3x target. Healthy.' },
    { title: 'Break-Even', description: '$5,000 ad spend, $5,000 ad revenue. ROAS = 1x (100%). At break-even (excluding other costs).' },
    { title: 'Loss', description: '$5,000 ad spend, $2,000 ad revenue. ROAS = 0.4x (40%). Losing money on ads.' },
    { title: 'Outstanding', description: '$2,000 ad spend, $20,000 ad revenue. ROAS = 10x (1000%). Outstanding campaign.' },
  ],
  faqs: [
    { question: 'What is ROAS?', answer: 'Return on Ad Spend = revenue from ads / ad spend. Different from ROI (ROAS excludes overhead, only ad spend). Target: 4:1 (400%) for ecommerce, 3:1 for SaaS, 2:1 for brand awareness. Track by: campaign, ad group, keyword, channel. ROAS is simpler than ROI — only considers ad spend, not total cost (COGS, overhead). See our Marketing ROI Calculator.' },
    { question: 'ROAS vs ROI?', answer: 'ROAS = ad revenue / ad spend (revenue only, no costs beyond ads). ROI = (revenue - all costs) / all costs × 100 (includes COGS, overhead). Example: $5k ad spend, $25k revenue, $15k COGS. ROAS = 5x ($25k/$5k). ROI = 100% (($25k-$20k)/$20k). ROAS is for ad spend efficiency; ROI is for overall profitability. Use both.' },
    { question: 'What is a good ROAS?', answer: 'Depends on industry and margins. E-commerce: 4:1 (400%) — need high ROAS due to product COGS. SaaS: 3:1 (300%) — high gross margin (80%+) allows lower ROAS. Lead gen: 3-5:1. Retail: 3-4:1. Travel: 5-10:1. Below 2:1 = likely losing money (after COGS). Above 10:1 = excellent. Track by product/category — high-margin products can tolerate lower ROAS. See our Marketing ROI Calculator.' },
    { question: 'How do you improve ROAS?', answer: 'Strategies: (1) Improve ad targeting (higher-quality traffic), (2) Better ad creative (higher CTR = more clicks per dollar), (3) Landing page optimization (higher conversion rate = more revenue per click), (4) Increase AOV (average order value) with upsells/bundles, (5) Retargeting (higher conversion than cold), (6) Reduce ad spend on low-ROAS campaigns. Formula: ROAS = (CTR × conversion rate × AOV) / CPC. Improve any factor.' },
    { question: 'What is break-even ROAS?', answer: 'Break-even ROAS = 1 / gross margin. Example: 30% gross margin = 1/0.30 = 3.33x. Below 3.33x ROAS = losing money (after COGS). Above = profitable. Higher gross margin = lower break-even ROAS needed. Example: 80% margin (SaaS) = 1.25x break-even. 30% margin (e-commerce) = 3.33x break-even. Know your break-even before setting ROAS targets.' },
    { question: 'How do you track ROAS by channel?', answer: 'Tools: (1) Google Ads conversion tracking (for Google), (2) Facebook Pixel (for Facebook/Instagram), (3) E-commerce platform integration (Shopify, WooCommerce), (4) Attribution tools (TripleWhale, Northbeam for e-commerce). Track ROAS by: campaign, ad group, ad, keyword, audience. Kill low-ROAS campaigns, scale high-ROAS. Track blended ROAS (all channels) and per-channel ROAS.' },
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
