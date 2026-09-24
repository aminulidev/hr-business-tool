const seoData = {
  breadcrumbs: [{ label: 'Calculators' }, { label: 'Marketing ROI Calculator' }],
  tableOfContents: [
    { id: 'how-to-calculate', label: 'How to Calculate' },
    { id: 'formula', label: 'Formula' },
    { id: 'worked-examples', label: 'Worked Examples' },
    { id: 'frequently-asked-questions', label: 'FAQs' },
    { id: 'related-calculators', label: 'Related Calculators' },
  ],
  howToSteps: [
    'Enter campaign cost.',
    'Enter revenue generated from campaign.',
    'Click Calculate to see ROI, profit, and ROAS.',
  ],
  formula: 'Profit = Revenue - Cost\nMarketing ROI = (Profit / Cost) x 100\nROAS = Revenue / Cost\nGood ROI: >200% (3x return)\nTrack by channel for optimization.',
  formulaDescription: 'Marketing ROI = (revenue - cost) / cost × 100. Good: >200% (3x return). ROAS = revenue / cost (simpler, excludes overhead). Track by channel: paid, organic, email, events. Attribution matters: first-touch, last-touch, multi-touch.',
  workedExamples: [
    { title: 'Strong Campaign', description: '$10k cost, $35k revenue. Profit = $25k. ROI = 250%. ROAS = 3.5x. Strong — 3.5x return.' },
    { title: 'Break-Even', description: '$10k cost, $10k revenue. Profit = $0. ROI = 0%. ROAS = 1x. At break-even.' },
    { title: 'Loss Campaign', description: '$10k cost, $5k revenue. Profit = -$5k. ROI = -50%. ROAS = 0.5x. Losing money.' },
    { title: 'Excellent Campaign', description: '$5k cost, $50k revenue. Profit = $45k. ROI = 900%. ROAS = 10x. Outstanding.' },
    { title: 'Brand Awareness', description: '$20k cost, $0 direct revenue (brand only). ROI = -100% (by revenue). But long-term brand value not captured in short-term revenue.' },
  ],
  faqs: [
    { question: 'What is marketing ROI?', answer: 'Marketing ROI = (revenue from campaign - campaign cost) / campaign cost × 100. Measures return on marketing investment. Good: >200% (3x return). Track by channel: paid ads, content, email, events. Attribution matters — first-touch, last-touch, multi-touch give different results. See our ROAS Calculator for ad-specific ROI.' },
    { question: 'Marketing ROI vs ROAS?', answer: 'ROI = (revenue - cost) / cost × 100 (includes profit). ROAS = revenue / cost (revenue only, no profit). Example: $10k cost, $35k revenue. ROI = 250%. ROAS = 3.5x. ROAS is simpler but doesn\'t account for COGS. Use ROI for overall marketing profitability, ROAS for ad spend efficiency. See our ROAS Calculator.' },
    { question: 'What is a good marketing ROI?', answer: 'Good: >200% (3x return = $3 revenue per $1 spent). Excellent: >400%. Break-even: 0%. Track by channel: paid search 200-500%, paid social 100-300%, content 300-1000% (long-term), email 500-2000% (cheap channel). ROI varies by industry and attribution model. Track trend over time — declining ROI = channel saturation or rising costs.' },
    { question: 'How do you attribute revenue to marketing?', answer: 'Attribution models: (1) First-touch (first interaction gets credit), (2) Last-touch (last interaction gets credit — most common), (3) Linear (equal credit to all touches), (4) Time-decay (more credit to recent touches), (5) Data-driven (algorithmic, needs sufficient data). Multi-touch attribution is most accurate but complex. Tools: Google Analytics, HubSpot, Bizible, Dreamdata.' },
    { question: 'How do you improve marketing ROI?', answer: 'Strategies: (1) Improve conversion rate (more revenue per visitor), (2) Reduce CAC (cheaper channels), (3) Better targeting (higher-quality leads), (4) Retention (cheaper than acquisition), (5) Upsell/cross-sell (more revenue per customer), (6) Content marketing (long-term ROI), (7) Marketing automation (efficiency). Focus on channels with highest ROI — scale those, cut low-ROI channels.' },
    { question: 'What is the difference between marketing ROI and sales ROI?', answer: 'Marketing ROI = (revenue from marketing - marketing cost) / marketing cost. Sales ROI = (revenue from sales effort - sales cost) / sales cost. Marketing generates leads; sales closes deals. For B2B, both contribute to revenue — use combined CAC (marketing + sales) / customers. See our CAC Calculator. For e-commerce, mostly marketing (no sales team).' },
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
