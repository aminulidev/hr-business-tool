const seoData = {
  breadcrumbs: [{ label: 'Calculators' }, { label: 'Cost per Hire Calculator' }],
  tableOfContents: [
        { id: 'how-to-calculate', label: 'How to Calculate' },
        { id: 'formula', label: 'Formula' },
        { id: 'worked-examples', label: 'Worked Examples' },
        { id: 'frequently-asked-questions', label: 'FAQs' },
        { id: 'related-calculators', label: 'Related Calculators' },
      ],
  howToSteps: [
        'Enter your internal recruiting costs — HR staff time, internal referral bonuses, and ATS software costs.',
        'Enter external recruiting costs — staffing agency fees, executive search fees, and placement fees.',
        'Add job board and advertising costs — LinkedIn, Indeed, Glassdoor, and other paid postings.',
        'Include background check fees, drug screening, and skills assessments.',
        'Enter travel and relocation costs for candidates and new hires.',
        'Divide by the number of hires to get your cost per hire. Compare to the SHRM average of ~$4,700.',
      ],
  formula: 'Total Recruiting Cost = Internal Costs + External Costs + Job Boards + Background Checks + Travel/Relocation + Other\nCost per Hire = Total Recruiting Cost / Number of Hires',
  formulaDescription: "According to SHRM's 2024 Talent Acquisition Benchmark Report, the average cost per hire in the US is approximately $4,700. This includes all direct recruiting expenditures. Some organizations also add indirect costs like manager time spent interviewing (typically 5–10 hours per candidate).",
  workedExamples: [
        { title: 'Small Tech Company (10 Hires)', description: 'Internal HR costs: $8,000, LinkedIn job ads: $3,000, background checks: $500, no agency fees. Total: $11,500. Cost per hire: $1,150 — well below the SHRM average.' },
        { title: 'Mid-Size Firm with Agency (5 Hires)', description: 'Internal costs: $5,000, agency fee: $25,000 (20% of $125k salary), job boards: $2,000, background: $500. Total: $32,500. Cost per hire: $6,500 — above average but efficient for executive roles.' },
        { title: 'Large Enterprise (100 Hires)', description: 'Internal recruiting team: $180,000, job boards: $12,000, background checks: $5,000, relocation: $30,000. Total: $227,000. Cost per hire: $2,270 — economies of scale.' },
      ],
  faqs: [
        { question: 'What is the average cost per hire?', answer: 'According to SHRM, the average cost per hire is approximately $4,700 (2024). However, this varies dramatically by role level and industry. Entry-level roles might cost $1,000–3,000, while executive searches can cost $15,000–50,000+. Companies using in-house recruiting teams typically achieve significantly lower CPH than those relying on agencies.' },
        { question: 'What is included in cost per hire?', answer: 'Direct costs include advertising and job board fees, agency/recruiter fees, background checks, drug tests, skills assessments, candidate travel and relocation, sign-on bonuses, and ATS software. Indirect costs include manager and HR time spent reviewing resumes, interviewing, and onboarding.' },
        { question: 'How can I reduce cost per hire?', answer: 'Build an employee referral program (referred hires cost 50–70% less). Develop your employer brand to attract passive candidates. Invest in a quality ATS to reduce time-to-fill. Reduce agency dependency by building direct sourcing capabilities. Track time-to-fill alongside CPH, as slow hiring has hidden productivity costs.' },
        { question: 'Is a lower cost per hire always better?', answer: 'Not necessarily. Extremely low CPH can indicate underinvestment in hiring quality, leading to high turnover. Quality of hire (measured by performance ratings and retention) is often more important than CPH alone. The goal is optimizing total workforce cost — balancing CPH with turnover cost and productivity.' },
      ],
  relatedTools: [
        { slug: 'employee-turnover-calculator', title: 'Employee Turnover Calculator', description: 'Turnover rate & attrition cost', icon: 'Users' },
        { slug: 'revenue-per-employee-calculator', title: 'Revenue per Employee', description: 'Workforce productivity ratio', icon: 'Activity' },
        { slug: 'workers-comp-calculator', title: 'Workers Comp Calculator', description: 'Estimate insurance premiums', icon: 'ShieldCheck' },
        { slug: 'roi-calculator', title: 'ROI Calculator', description: 'Measure return on HR investment', icon: 'BarChart3' },
      ],
};

export default seoData;
