const seoData = {
  breadcrumbs: [{ label: 'Calculators' }, { label: 'Billable Hours Calculator' }],
  tableOfContents: [
        { id: 'how-to-calculate', label: 'How to Calculate' },
        { id: 'formula', label: 'Formula' },
        { id: 'worked-examples', label: 'Worked Examples' },
        { id: 'frequently-asked-questions', label: 'FAQs' },
        { id: 'related-calculators', label: 'Related Calculators' },
      ],
  howToSteps: [
        'Enter your total working hours for the period — this is the total time you spend at work, including both billable and non-billable activities.',
        'Enter your non-billable hours — time spent on admin, internal meetings, training, business development, and other non-client work.',
        'Enter your hourly billing rate to calculate billable revenue for the period.',
        'Set your target utilization rate — law firms typically target 75–85%, consultants 65–75%.',
        'Click Calculate to see your billable hours, utilization rate, revenue, and gap from your target.',
      ],
  formula: 'Billable Hours = Total Hours − Non-Billable Hours\nUtilization Rate = Billable Hours / Total Hours × 100\nBillable Revenue = Billable Hours × Hourly Rate',
  formulaDescription: "Utilization rate measures the percentage of total working time that generates client revenue. Law firms and consulting firms typically track this as a key performance indicator. A utilization rate below 65% indicates too much non-billable overhead, while above 85% can lead to burnout.",
  workedExamples: [
        { title: 'Consultant (Weekly)', description: '40 total hours. 10 non-billable (meetings, admin, proposals). 30 billable hours. Utilization: 75%. At $200/hr: $6,000/week billable revenue. Annual: $300,000.' },
        { title: 'Lawyer (Weekly)', description: '50 total hours. 8 non-billable (firm management, CLE, admin). 42 billable hours. Utilization: 84%. At $350/hr: $14,700/week. Annual: $735,000.' },
        { title: 'Freelance Designer (Monthly)', description: '160 total hours. 40 non-billable (admin, marketing, client acquisition). 120 billable hours. Utilization: 75%. At $85/hr: $10,200/month. Annual: $122,400.' },
      ],
  faqs: [
        { question: 'What is a billable hour?', answer: 'A billable hour is time spent directly on client work that can be invoiced. This includes meetings with clients, research, drafting, design work, coding, and other deliverables. Non-billable time includes internal meetings, business development, training, and administrative tasks.' },
        { question: 'What is a good utilization rate?', answer: 'Target utilization rates vary by profession: Law firms: 75–85% for associates, 60–70% for partners. Consulting: 65–75%. IT consulting: 70–80%. Freelancers: 60–70% (since you handle your own business development). Below 60% typically means too much overhead.' },
        { question: 'How do law firms track billable hours?', answer: 'Most law firms use time-tracking software (Clio, TimeSolv, MyCase) where attorneys log time in 6-minute increments (0.1 hour). Partners set annual billable hour targets — typically 1,800–2,200 hours per year for associates. Performance reviews and bonuses are often tied to billable hour targets.' },
        { question: 'How can I increase my billable hours?', answer: 'Delegate administrative tasks, automate invoicing and scheduling, use templates for proposals and contracts, set clear office hours, batch non-billable tasks to specific time blocks, and track time in real-time rather than reconstructing it from memory at day-end.' },
      ],
  relatedTools: [
        { slug: 'time-card-calculator', title: 'Time Card Calculator', description: 'Track clock-in/out hours for payroll', icon: 'Clock' },
        { slug: 'time-card-calculator-with-lunch', title: 'Time Card with Lunch', description: 'Hours minus break deductions', icon: 'Coffee' },
        { slug: 'revenue-per-employee-calculator', title: 'Revenue per Employee', description: 'Workforce revenue efficiency', icon: 'Activity' },
        { slug: 'wages-calculator', title: 'Wages Calculator', description: 'Calculate gross wages from hours', icon: 'Banknote' },
      ],
};

export default seoData;
