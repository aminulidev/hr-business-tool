const seoData = {
  breadcrumbs: [{ label: 'Calculators' }, { label: 'Sales Target Calculator' }],
  tableOfContents: [
    { id: 'how-to-calculate', label: 'How to Calculate' },
    { id: 'formula', label: 'Formula' },
    { id: 'worked-examples', label: 'Worked Examples' },
    { id: 'frequently-asked-questions', label: 'FAQs' },
    { id: 'related-calculators', label: 'Related Calculators' },
  ],
  howToSteps: [
    'Enter revenue target.',
    'Enter average deal size.',
    'Enter meeting-to-close rate (%).',
    'Enter lead-to-meeting rate (%).',
    'Click Calculate to see required deals, meetings, and leads.',
  ],
  formula: 'Deals Needed = Revenue Target / Avg Deal Size\nMeetings Needed = Deals / Close Rate\nLeads Needed = Meetings / Lead-to-Meeting Rate\nFull Funnel: Leads -> Meetings -> Deals -> Revenue',
  formulaDescription: 'Sales targets work backward from revenue goal: deals = revenue / avg deal size. Meetings = deals / close rate. Leads = meetings / lead-to-meeting rate. Used for capacity planning and activity targets.',
  workedExamples: [
    { title: 'Standard SaaS', description: '$1M target, $25k deal, 25% close, 30% lead-to-meeting. Deals = 40. Meetings = 160. Leads = 534.' },
    { title: 'Enterprise', description: '$5M target, $250k deal, 20% close, 15% lead-to-meeting. Deals = 20. Meetings = 100. Leads = 667.' },
    { title: 'SMB', description: '$200k target, $5k deal, 30% close, 40% lead-to-meeting. Deals = 40. Meetings = 133. Leads = 333.' },
    { title: 'High Ticket', description: '$2M target, $100k deal, 15% close, 10% lead-to-meeting. Deals = 20. Meetings = 133. Leads = 1,333.' },
    { title: 'Volume Business', description: '$500k target, $2k deal, 35% close, 50% lead-to-meeting. Deals = 250. Meetings = 714. Leads = 1,429.' },
  ],
  faqs: [
    { question: 'What is a sales target?', answer: 'Sales target = required sales activity (calls, meetings, proposals, deals) to hit revenue goal. Work backward: revenue → deals (revenue / deal size) → meetings (deals / close rate) → leads (meetings / lead-to-meeting). Used for capacity planning, territory targets, rep quotas. See our Quota Calculator.' },
    { question: 'How do you calculate required deals?', answer: 'Deals needed = revenue target / average deal size. Example: $1M target / $25k avg deal = 40 deals. Round up. Adjust for: deal size variability (use median or P50), win rate (need more pipeline than deals), sales cycle (deals closing this period). See our Pipeline Calculator for pipeline coverage.' },
    { question: 'How do you calculate required meetings?', answer: 'Meetings = deals needed / close rate. Example: 40 deals / 25% close rate = 160 meetings. Close rate = deals won / meetings held. Track by: rep, segment, deal size. If close rate is 20%, need 200 meetings for 40 deals. See our Win Rate Calculator.' },
    { question: 'How do you calculate required leads?', answer: 'Leads = meetings needed / lead-to-meeting conversion rate. Example: 160 meetings / 30% conversion = 534 leads. Lead-to-meeting = meetings held / leads generated. Track by: channel (inbound, outbound, events). If 30%, need 534 leads for 160 meetings. See our Lead Cost Calculator.' },
    { question: 'What is sales funnel capacity?', answer: 'Capacity = max output your sales team can produce. Based on: rep count × meetings/rep × close rate × deal size. Example: 5 reps × 40 meetings × 25% close × $25k = $1.25M capacity. If target > capacity, need more reps or higher productivity. See our Pipeline Calculator for coverage analysis.' },
    { question: 'How do you set activity targets per rep?', answer: 'Per rep = team target / rep count. Example: $1M team target, 5 reps = $200k/rep. Activities: $200k / $25k deal = 8 deals. 8 deals / 25% close = 32 meetings. 32 meetings / 30% conversion = 107 leads. 8 deals × 3 months sales cycle = need 24 deals in pipeline. See our Sales Forecast Calculator.' },
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
