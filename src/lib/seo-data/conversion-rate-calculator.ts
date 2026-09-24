const seoData = {
  breadcrumbs: [{ label: 'Calculators' }, { label: 'Conversion Rate Calculator' }],
  tableOfContents: [
    { id: 'how-to-calculate', label: 'How to Calculate' },
    { id: 'formula', label: 'Formula' },
    { id: 'worked-examples', label: 'Worked Examples' },
    { id: 'frequently-asked-questions', label: 'FAQs' },
    { id: 'related-calculators', label: 'Related Calculators' },
  ],
  howToSteps: [
    'Enter total leads.',
    'Enter MQLs.',
    'Enter SQLs.',
    'Enter opportunities.',
    'Enter customers won.',
    'Click Calculate to see conversion at each stage.',
  ],
  formula: 'Lead to MQL = MQLs / Leads x 100\nMQL to SQL = SQLs / MQLs x 100\nSQL to Opp = Opps / SQLs x 100\nOpp to Customer = Customers / Opps x 100\nOverall = Customers / Leads x 100',
  formulaDescription: 'Conversion rate = converted / total × 100. Track at each funnel stage: Lead→MQL (20-30%), MQL→SQL (30-40%), SQL→Opp (40-50%), Opp→Cust (20-30%). Overall: 1-3% lead-to-customer. Identify bottleneck stage.',
  workedExamples: [
    { title: 'SaaS Funnel', description: '1000 leads, 300 MQLs, 120 SQLs, 60 opps, 15 customers. L→MQL 30%, MQL→SQL 40%, SQL→Opp 50%, Opp→Cust 25%. Overall 1.5%.' },
    { title: 'Enterprise Funnel', description: '500 leads, 100 MQLs, 50 SQLs, 30 opps, 6 customers. L→MQL 20%, MQL→SQL 50%, SQL→Opp 60%, Opp→Cust 20%. Overall 1.2%.' },
    { title: 'SMB Funnel', description: '2000 leads, 800 MQLs, 400 SQLs, 200 opps, 60 customers. L→MQL 40%, MQL→SQL 50%, SQL→Opp 50%, Opp→Cust 30%. Overall 3%.' },
    { title: 'B2C E-commerce', description: '10000 visitors, 2000 leads, 500 MQLs, 200 opps, 80 customers. L→MQL 25%, overall 0.8% visitor-to-customer.' },
    { title: 'Bottleneck at MQL→SQL', description: '1000 leads, 300 MQLs, 60 SQLs (20% vs 40% benchmark). Bottleneck = MQL→SQL. Fix: better lead scoring, sales-marketing alignment.' },
  ],
  faqs: [
    { question: 'What is conversion rate?', answer: 'Conversion rate = converted / total × 100. In sales: percentage that advance from one funnel stage to next. Stages: Lead → MQL → SQL → Opportunity → Customer. Overall: lead-to-customer (1-3% typical). Track by stage to identify bottlenecks. See our Win Rate Calculator for opportunity-stage conversion.' },
    { question: 'What are MQL and SQL?', answer: 'MQL (Marketing Qualified Lead) = lead that marketing has scored as qualified (engaged with content, fits ICP). SQL (Sales Qualified Lead) = MQL that sales has accepted and qualified (budget, authority, need, timeline). Conversion: Lead → MQL (20-30%), MQL → SQL (30-40%). Handoff process critical — "good" MQLs rejected by sales = friction.' },
    { question: 'What is a good conversion rate?', answer: 'Stage benchmarks: Lead→MQL 20-30%, MQL→SQL 30-40%, SQL→Opp 40-50%, Opp→Cust 20-30%. Overall lead-to-customer: 1-3% (B2B), 2-5% (B2C ecommerce). Above benchmarks = strong funnel. Below = identify bottleneck stage and improve. Track by: channel, segment, campaign.' },
    { question: 'How do you improve conversion rate?', answer: 'Strategies by stage: (1) Lead→MQL: better lead scoring, ICP targeting, content offers. (2) MQL→SQL: sales-marketing alignment, clear handoff criteria, faster follow-up. (3) SQL→Opp: discovery call quality, needs analysis, BANT qualification. (4) Opp→Cust: demo quality, pricing, competitive positioning, urgency. Focus on weakest stage first.' },
    { question: 'What is funnel drop-off?', answer: 'Drop-off = leads lost at each stage. Example: 1000 leads → 300 MQLs = 700 lost (70% drop-off). Track drop-off rate by stage to identify where leads are lost. Highest drop-off stage = biggest improvement opportunity. Example: if MQL→SQL drops 80% (300→60), fix lead quality or sales handoff process.' },
    { question: 'How do you calculate overall conversion rate?', answer: 'Overall = customers / leads × 100. Example: 15 customers / 1000 leads = 1.5%. Or multiply stage rates: 30% × 40% × 50% × 25% = 1.5%. Useful for: capacity planning (how many leads needed for revenue target), CAC calculation (cost per lead / overall conversion = CAC). See our Sales Target Calculator.' },
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
