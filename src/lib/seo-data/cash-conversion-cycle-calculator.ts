const seoData = {
  breadcrumbs: [{ label: 'Calculators' }, { label: 'Cash Conversion Cycle Calculator' }],
  tableOfContents: [
    { id: 'how-to-calculate', label: 'How to Calculate' },
    { id: 'formula', label: 'Formula' },
    { id: 'worked-examples', label: 'Worked Examples' },
    { id: 'frequently-asked-questions', label: 'FAQs' },
    { id: 'related-calculators', label: 'Related Calculators' },
  ],
  howToSteps: [
    'Enter days inventory outstanding (DIO).',
    'Enter days sales outstanding (DSO).',
    'Enter days payable outstanding (DPO).',
    'Click Calculate to see cash conversion cycle.',
  ],
  formula: 'DIO = 365 / Inventory Turnover\nDSO = (AR / Revenue) x 365\nDPO = (AP / COGS) x 365\nCCC = DIO + DSO - DPO\nShorter = better. Negative = supplier funds you.',
  formulaDescription: 'Cash conversion cycle = DIO + DSO - DPO. Measures days to convert inventory investment to cash. Shorter = better. Negative CCC = supplier funds your business (Amazon model). Typical: 30-90 days. See our Inventory Turnover and Working Capital Calculators.',
  workedExamples: [
    { title: 'Typical Manufacturer', description: 'DIO 60 + DSO 45 - DPO 30 = CCC 75 days. Takes 75 days from inventory purchase to cash collection.' },
    { title: 'Efficient Retailer', description: 'DIO 30 + DSO 0 (cash sales) - DPO 45 = CCC -15 days. Negative — supplier funds inventory. Amazon model.' },
    { title: 'Slow Company', description: 'DIO 90 + DSO 60 - DPO 30 = CCC 120 days. Long cycle — lots of capital tied up.' },
    { title: 'Service Business', description: 'DIO 0 + DSO 45 - DPO 30 = CCC 15 days. No inventory, fast cycle.' },
    { title: 'Improving', description: 'Year 1: CCC 80 days. Year 2: CCC 65 days. 19% improvement — better inventory and AR management.' },
  ],
  faqs: [
    { question: 'What is cash conversion cycle?', answer: 'CCC = DIO + DSO - DPO. Measures time from cash out (inventory purchase) to cash in (sale collected). DIO = days inventory outstanding. DSO = days sales outstanding. DPO = days payable outstanding. Shorter = better. Negative = supplier funds your business. See our Inventory Turnover Calculator.' },
    { question: 'What is a good cash conversion cycle?', answer: 'Typical: 30-90 days. Below 30 = excellent. Negative = world-class (supplier-funded). Above 90 = capital-intensive. Industry: retail 10-30 (fast turnover), manufacturing 60-90, distribution 45-75. Track trend — declining CCC = improving working capital efficiency. Each day saved = cash freed up.' },
    { question: 'What are DIO, DSO, DPO?', answer: 'DIO (Days Inventory Outstanding) = 365 / inventory turnover. How long inventory sits before sale. DSO (Days Sales Outstanding) = (AR / revenue) × 365. How long to collect receivables. DPO (Days Payable Outstanding) = (AP / COGS) × 365. How long you take to pay suppliers. CCC = DIO + DSO - DPO.' },
    { question: 'How do you reduce cash conversion cycle?', answer: 'Strategies: (1) Reduce DIO (lower inventory, faster turnover), (2) Reduce DSO (collect AR faster, shorter payment terms, early payment discounts), (3) Increase DPO (negotiate longer supplier terms). Each day saved frees up cash. Example: $1M revenue, 1-day CCC reduction = ~$2,740 cash freed up.' },
    { question: 'What does negative CCC mean?', answer: 'Negative CCC = you collect from customers BEFORE paying suppliers. Supplier credit funds your inventory. Example: DIO 30, DSO 0 (cash sales), DPO 45 = CCC -15. You hold inventory 30 days, sell for cash, pay supplier 45 days after purchase. 15 days of supplier-funded working capital. Amazon, Costco, Apple use this model.' },
    { question: 'Cash conversion cycle vs operating cycle?', answer: 'Operating cycle = DIO + DSO (time from inventory purchase to cash collection, ignoring supplier payment). CCC = operating cycle - DPO (accounts for supplier credit). CCC is shorter (DPO reduces it). Both measure working capital efficiency. Operating cycle shows gross cycle; CCC shows net (after supplier financing).' },
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
