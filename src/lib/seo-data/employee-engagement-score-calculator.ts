const seoData = {
  breadcrumbs: [{ label: 'Calculators' }, { label: 'Employee Engagement Score Calculator' }],
  tableOfContents: [
    { id: 'how-to-calculate', label: 'How to Calculate' },
    { id: 'formula', label: 'Formula' },
    { id: 'worked-examples', label: 'Worked Examples' },
    { id: 'frequently-asked-questions', label: 'FAQs' },
    { id: 'related-calculators', label: 'Related Calculators' },
  ],
  howToSteps: [
    'Enter number of Promoters (survey score 9-10 on eNPS question).',
    'Enter number of Passives (score 7-8).',
    'Enter number of Detractors (score 0-6).',
    'Enter average score from engagement survey (1-5 scale).',
    'Click Calculate to see engagement index and eNPS.',
  ],
  formula: 'Total = Promoters + Passives + Detractors\neNPS = ((Promoters - Detractors) / Total) x 100\nEngagement Index = (Avg Score / 5) x 100\nParticipation Rate = Responses / Total Employees x 100',
  formulaDescription: 'Engagement Index = avg survey score / 5 × 100 (Gallup Q12 style). eNPS = % promoters - % detractors. Good eNPS: >30, excellent >50. Participation should be >70% for valid results. Gallup: highly engaged teams are 21% more profitable and 17% more productive.',
  workedExamples: [
    { title: 'Strong Engagement', description: '60 promoters, 25 passives, 15 detractors. Total = 100. eNPS = (60-15)/100 × 100 = 45. Avg score 4.2/5 = 84% engagement index. Excellent.' },
    { title: 'Average Engagement', description: '40 promoters, 35 passives, 25 detractors. eNPS = (40-25) = 15. Avg 3.8/5 = 76%. Average — room for improvement.' },
    { title: 'Concerning', description: '20 promoters, 30 passives, 50 detractors. eNPS = (20-50) = -30. Avg 3.2/5 = 64%. Negative eNPS — urgent action needed.' },
    { title: 'Small Team', description: '8 promoters, 4 passives, 2 detractors. Total = 14. eNPS = (8-2)/14 × 100 = 43. Avg 4.0/5 = 80%. Strong engagement on small team.' },
    { title: 'Department Comparison', description: 'Engineering: eNPS 45, engagement 84%. Sales: eNPS 20, engagement 76%. Customer Success: eNPS -10, engagement 68%. CS needs attention.' },
  ],
  faqs: [
    { question: 'What is eNPS?', answer: 'eNPS (Employee Net Promoter Score) = % promoters - % detractors. Promoters = score 9-10 on "How likely to recommend as employer?" Detractors = 0-6. Passives = 7-8. Range: -100 to +100. Good: >30, excellent: >50. One-question pulse survey, easy to track over time.' },
    { question: 'What is a good eNPS score?', answer: 'Good: >30. Excellent: >50. World-class: >70. Average US company: 10-20. Below 0 = serious engagement issues. Track by department, tenure, and manager to identify problem areas. Trend matters more than absolute score — declining eNPS is a red flag.' },
    { question: 'How is engagement index calculated?', answer: 'Engagement Index = average survey score / max score × 100. For 5-point Likert scale: avg 4.2 / 5 × 100 = 84%. For 10-point eNPS scale: separate calculation. Gallup Q12 uses 5-point scale; benchmark = 4.0+ (80%+). Track alongside eNPS for full picture.' },
    { question: 'What is a good survey participation rate?', answer: 'Good: >70%. Excellent: >85%. Below 50% = data not representative — engagement itself may be low. Improve participation with: (1) Anonymous surveys (trust), (2) Leadership communication on importance, (3) Follow-up action on previous results, (4) Mobile-friendly survey, (5) Manager reminders.' },
    { question: 'How often should I survey engagement?', answer: 'Pulse surveys: monthly or quarterly (1-5 questions, 2 min). Full engagement survey: annually (50+ questions). Don\'t over-survey — fatigue reduces participation and quality. Use eNPS quarterly, full survey annually. Always close the loop with action plans.' },
    { question: 'What drives employee engagement?', answer: 'Gallup Q12 drivers: (1) Clear expectations, (2) Tools/resources, (3) Strengths use, (4) Recognition, (5) Someone cares, (6) Development, (7) Opinions count, (8) Mission/purpose, (9) Quality work, (10) Best friend, (11) Progress, (12) Learning/growth. Manager quality drives 70% of engagement variance.' },
  ],
  relatedTools: [
    { slug: 'employee-turnover-calculator', title: 'Employee Turnover Calculator', description: 'Turnover rate and cost', icon: 'Users' },
    { slug: 'cost-of-turnover-calculator', title: 'Cost of Turnover Calculator', description: 'Financial impact of attrition', icon: 'DollarSign' },
    { slug: 'employee-retention-calculator', title: 'Employee Retention Calculator', description: 'Retention rate tracking', icon: 'Users' },
    { slug: 'employee-cost-calculator', title: 'Employee Cost Calculator', description: 'True cost per employee', icon: 'DollarSign' },
    { slug: 'labor-cost-calculator', title: 'Labor Cost Calculator', description: 'Total labor as % of revenue', icon: 'Wallet' },
  ],
};
export default seoData;
