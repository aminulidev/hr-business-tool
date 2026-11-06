import type { CalculatorSeoData } from './types';
const seoData = {
  breadcrumbs: [{ label: 'Calculators' }, { label: 'EBITDA Margin Calculator' }],
  tableOfContents: [
    { id: 'how-to-calculate', label: 'How to Calculate' },
    { id: 'formula', label: 'Formula' },
    { id: 'industry-benchmarks', label: '2026 EBITDA Margin & Valuation Multiples by Industry' },
    { id: 'deep-dive-guide', label: 'EBITDA vs. Net Income & Rule of 40 Guide' },
    { id: 'worked-examples', label: 'Worked Examples' },
    { id: 'frequently-asked-questions', label: 'FAQs' },
    { id: 'related-calculators', label: 'Related Calculators' },
  ],
  howToSteps: [
    'Enter your company\'s EBITDA (Earnings Before Interest, Taxes, Depreciation, and Amortization — or Operating Income/EBIT plus D&A).',
    'Enter your Total Revenue for the same period (monthly, quarterly, or trailing 12 months).',
    'Review your EBITDA Margin percentage, EBITDA per $1.00 of revenue, and industry profitability rating.',
  ],
  formula: 'EBITDA = Operating Income (EBIT) + Depreciation + Amortization\nEBITDA Margin (%) = (EBITDA ÷ Total Revenue) × 100\nRule of 40 Score (SaaS) = YoY Revenue Growth Rate (%) + EBITDA Margin (%)',
  formulaDescription: 'EBITDA Margin measures a company\'s core operational profitability as a percentage of total revenue before accounting for financing structure (interest), tax jurisdiction (income taxes), and non-cash capital depreciation and amortization. It is the primary profitability metric used in M&A, private equity buyouts, and corporate valuation.',
  benchmarkTables: [
    {
      title: '2026 Average EBITDA Margin & EV/EBITDA Valuation Multiples by Industry',
      description: 'Typical operational EBITDA margins and middle-market Enterprise Value (EV/EBITDA) buyout multiples across major sectors.',
      headers: ['Industry Sector', 'Average EBITDA Margin', 'Top-Quartile EBITDA Margin', 'Typical EV/EBITDA Multiple'],
      rows: [
        ['B2B Software / Mature SaaS', '22% – 32%', '35% – 45%+', '14x – 22x EBITDA'],
        ['IT Services / Managed Service Providers (MSP)', '12% – 18%', '20% – 26%', '8x – 13x EBITDA'],
        ['Healthcare Services & Clinics', '14% – 20%', '22% – 28%', '9x – 14x EBITDA'],
        ['Industrial Manufacturing', '11% – 16%', '18% – 24%', '6.5x – 10x EBITDA'],
        ['HVAC / Plumbing / Commercial Trades', '12% – 18%', '20% – 28%', '5.5x – 9.5x EBITDA'],
        ['E-Commerce / Specialty Retail', '7% – 13%', '15% – 20%', '5x – 8.5x EBITDA'],
        ['Restaurants & Hospitality', '8% – 14%', '16% – 22%', '4.5x – 7.5x EBITDA'],
        ['Staffing & Recruiting Agencies', '6% – 11%', '13% – 18%', '5x – 8x EBITDA'],
      ],
    },
  ],
  deepDiveSections: [
    {
      title: 'Why Private Equity and Acquirers Value Companies on EBITDA Margin',
      paragraphs: [
        'When acquiring a business, buyers want to know how much operating cash flow the underlying business engine produces, independent of how the previous owner chose to finance the company (debt vs. equity) or structure its taxes. Two identical manufacturing businesses might have vastly different Net Income if one owner took out a high-interest SBA loan and accelerated equipment depreciation while the other paid cash.',
        'By adding Interest, Taxes, Depreciation, and Amortization back to Net Income, **EBITDA** puts both companies on a level playing field. Furthermore, expanding your EBITDA margin creates a **double compounding effect** on exit valuation: increasing EBITDA from $1M to $1.5M (by lifting margin from 10% to 15% on $10M revenue) often moves a company from a 5x multiple ($5M valuation) to a 7x multiple ($10.5M valuation)—more than doubling enterprise value.',
      ],
      bullets: [
        'Seller\'s Discretionary Earnings (SDE) vs. EBITDA: For small businesses under $3M–$5M in revenue, brokers use SDE (which adds back one owner\'s full compensation and personal owner perks). For companies over $5M in revenue, buyers use Adjusted EBITDA (deducting a fair-market replacement CEO salary).',
        'The CapEx Blind Spot: In capital-intensive industries (trucking, heavy equipment rental, manufacturing), Depreciation represents real future cash needed to replace worn-out machinery. In those sectors, buyers track `EBITDA minus Maintenance CapEx` (EBITA or Free Cash Flow).',
      ],
    },
  ],
  workedExamples: [
    { title: 'Mature B2B SaaS Company ($10M ARR)', description: '$2,400,000 Operating Income (EBIT) + $600,000 D&A = $3,000,000 EBITDA on $10,000,000 revenue. EBITDA Margin = 30.0% ($0.30 per $1 of revenue). If growing 20% YoY, Rule of 40 score = 50% (Elite).' },
    { title: 'Commercial HVAC Services Business ($5M Revenue)', description: '$650,000 Net Income + $80,000 Interest + $140,000 Taxes + $130,000 Fleet Depreciation = $1,000,000 EBITDA. EBITDA Margin = 20.0%.' },
    { title: 'Specialty E-Commerce Brand ($2M Revenue)', description: '$220,000 EBITDA on $2,000,000 revenue = 11.0% EBITDA Margin ($0.11 per $1 of revenue).' },
  ],
  faqs: [
    { question: 'What is a good EBITDA margin?', answer: 'Across all private US industries, a 10% to 15% EBITDA margin is considered healthy, and 20%+ is strong. However, benchmarks vary widely by sector: software and SaaS companies target 25% to 40%+, professional services and healthcare target 15% to 25%, manufacturing averages 12% to 18%, and retail/grocery operates on 5% to 10%.' },
    { question: 'How do you calculate EBITDA from an Income Statement (P&L)?', answer: 'The fastest and most accurate method is top-down from Operating Income: take Operating Income (EBIT) from your P&L and add back Depreciation and Amortization (found on your Cash Flow Statement or P&L). Alternatively, start with Net Income and add back Income Taxes, Interest Expense, Depreciation, and Amortization.' },
    { question: 'What is the difference between Gross Margin, Operating Margin, and EBITDA Margin?', answer: 'Gross Margin deducts only direct Cost of Goods Sold (COGS). Operating Margin (EBIT Margin) deducts COGS plus all operating expenses (SG&A, R&D, depreciation, amortization). EBITDA Margin is Operating Margin with non-cash Depreciation and Amortization added back, meaning EBITDA Margin is always equal to or higher than Operating Margin.' },
    { question: 'What is Adjusted EBITDA in M&A?', answer: 'Adjusted EBITDA normalizes a company\'s historical EBITDA by adding back non-recurring, one-time, or personal owner expenses that will not continue after an acquisition—such as a one-time lawsuit settlement, office relocation cost, or above-market owner compensation.' },
  ],
  relatedTools: [
    { slug: 'profit-margin-calculator', title: 'Profit Margin Calculator', description: 'Gross, operating & net profit margin', icon: 'Percent' },
    { slug: 'break-even-calculator', title: 'Break-Even Calculator', description: 'Fixed cost coverage & break-even revenue', icon: 'Target' },
    { slug: 'revenue-per-employee-calculator', title: 'Revenue Per Employee', description: 'Workforce efficiency benchmarks', icon: 'Users' },
    { slug: 'roi-calculator', title: 'ROI Calculator', description: 'Capital investment ROI', icon: 'BarChart3' },
    { slug: 'burn-rate-calculator', title: 'Burn Rate Calculator', description: 'Cash burn & runway analysis', icon: 'Clock' },
  ],
} satisfies CalculatorSeoData;
export default seoData;