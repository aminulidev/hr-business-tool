const seoData = {
  breadcrumbs: [{ label: 'Calculators' }, { label: 'Employee Utilization Calculator' }],
  tableOfContents: [
    { id: 'how-to-calculate', label: 'How to Calculate' },
    { id: 'formula', label: 'Formula' },
    { id: 'worked-examples', label: 'Worked Examples' },
    { id: 'frequently-asked-questions', label: 'FAQs' },
    { id: 'related-calculators', label: 'Related Calculators' },
  ],
  howToSteps: [
    'Enter productive hours in the period (billable or output-generating).',
    'Enter total available hours in the period (e.g., 2,080/year full-time).',
    'Enter training hours (non-productive but valuable).',
    'Enter admin/internal meeting hours.',
    'Click Calculate to see utilization rate and idle time.',
  ],
  formula: 'Utilization = Productive Hours / Available Hours x 100\nNon-Productive = Training + Admin\nIdle Time = Available - Productive - Non-Productive\nIdle % = Idle Time / Available x 100',
  formulaDescription: 'Employee utilization = productive hours / available hours × 100. Target: 75-85% productive, 10-15% training/development, 5-10% admin, 5-10% idle/bench. Below 70% suggests underutilization; above 90% risks burnout. For billable utilization (consulting), see Utilization Rate Calculator.',
  workedExamples: [
    { title: 'Healthy Utilization', description: '1,600 productive / 2,080 available = 76.9%. Training 80h, admin 160h, idle 240h. 76.9% productive, 11.5% non-productive, 11.5% idle. Good.' },
    { title: 'Overworked', description: '1,900 productive / 2,080 = 91.3%. Training 40h, admin 100h, idle 40h. Burnout risk — too little training/rest.' },
    { title: 'Underutilized', description: '1,200 productive / 2,080 = 57.7%. Training 80h, admin 160h, idle 640h. 30% idle — reassign or reduce headcount.' },
    { title: 'Consultant', description: '1,500 billable / 2,080 = 72.1%. Below consulting target (75%). Need more client work or reduce non-billable.' },
    { title: 'New Hire Ramp', description: '800 productive / 2,080 = 38.5% (first 6 months). Training 400h, admin 200h, idle 680h. Expected during ramp-up.' },
  ],
  faqs: [
    { question: 'What is employee utilization?', answer: 'Utilization = productive hours / available hours × 100. Measures how much of available work time is spent on productive (output-generating) activities. Target: 75-85% productive. Below 70% = underutilized. Above 90% = burnout risk. Different from billable utilization (consulting/legal).' },
    { question: 'What is a good utilization rate?', answer: 'Target: 75-85% productive. 10-15% training/development. 5-10% admin. 5-10% idle/bench. Below 70% suggests underutilization (reassign or reduce headcount). Above 90% risks burnout (add headcount or reduce scope). For billable roles (consulting), target 70-80% billable.' },
    { question: 'Utilization vs productivity?', answer: 'Utilization = % of time spent on productive work (time metric). Productivity = output per hour (efficiency metric). You can be 100% utilized but unproductive (working on wrong things). Or 60% utilized but highly productive (efficient). Both matter — track together for full picture.' },
    { question: 'How do you improve utilization?', answer: 'Strategies: (1) Reduce admin burden (automate, delegate to support staff), (2) Reduce meetings (no-meeting blocks), (3) Better demand forecasting (reduce bench time), (4) Cross-training (flexible deployment), (5) Clear priorities (focus on high-value work), (6) Reduce context switching. Avoid: just pushing utilization higher (burnout).' },
    { question: 'What is bench time?', answer: 'Bench time = idle time when employee is not assigned to billable/productive work. Common in consulting, agency, and project-based work. Target: <10% bench. High bench = overstaffed or weak sales pipeline. Track by role and seniority — senior staff on bench is more expensive.' },
    { question: 'How is utilization tracked?', answer: 'Methods: (1) Time tracking software (Toggl, Harvest, Hubstaff) — most accurate, (2) Project management tools (Asana, Jira) — task-based, (3) Timesheets (manual) — error-prone, (4) Activity monitoring (controversial). Categorize: billable, non-billable (training, admin, BD), idle. Review monthly minimum.' },
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
