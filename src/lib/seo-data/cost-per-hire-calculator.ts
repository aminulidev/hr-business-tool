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
    'Review the worked examples below to see how cost per hire scales across small, mid, and enterprise organizations.',
  ],
  formula: 'Total Recruiting Cost = Internal Costs + External Costs + Job Boards + Background Checks + Travel/Relocation + Other\nCost per Hire = Total Recruiting Cost / Number of Hires',
  formulaDescription:
    "According to SHRM's 2024 Talent Acquisition Benchmark Report, the average cost per hire in the US is approximately $4,700. This includes all direct recruiting expenditures — internal HR staff time, external agency fees, job board advertising, background checks, candidate travel, and relocation assistance. Some organizations also add indirect costs like manager time spent interviewing (typically 5–10 hours per candidate, which at $100/hour equals $500-$1,000 per hire). The largest single component is usually agency fees for hard-to-fill roles (15-30% of first-year salary), while the smallest variable is background checks ($30-$100 per candidate). Companies that rely heavily on referrals and direct sourcing typically achieve cost per hire 50-70% below industry average.",
  workedExamples: [
    {
      title: 'Small Tech Company (10 Hires)',
      description:
        'Internal HR costs: $8,000 (0.2 FTE recruiter), LinkedIn job ads: $3,000, Indeed postings: $500, background checks: $500, no agency fees. Total: $12,000. Cost per hire: $1,200 — well below the SHRM average of $4,700. This profile is typical for small tech companies that source primarily through referrals and direct LinkedIn outreach. The trade-off: lower cost per hire, but longer time-to-fill (typically 60-90 days) and limited ability to recruit passive candidates who are not actively job-hunting.',
    },
    {
      title: 'Mid-Size Firm with Agency (5 Hires)',
      description:
        'Internal costs: $5,000, agency fee: $25,000 (20% of $125k base salary for one executive hire), job boards: $2,000, background checks: $500, relocation: $5,000. Total: $37,500. Cost per hire: $7,500 — above average but efficient for a senior/executive search. The agency fee alone is $25,000, but it purchased access to passive candidates who were not on the open market. Companies using agencies for hard-to-fill roles typically pay 15-30% of first-year salary; the industry shorthand is "20% of base" for mid-level roles and "30% of total comp" for executive searches.',
    },
    {
      title: 'Large Enterprise (100 Hires)',
      description:
        'Internal recruiting team (3 recruiters + ATS): $480,000/year, job boards: $12,000, background checks: $5,000, relocation: $30,000, referral bonuses: $20,000, agency fees for 5 specialized roles: $50,000. Total: $597,000. Cost per hire: $5,970 — close to industry average. Large enterprises benefit from economies of scale on the recruiting team salary (amortized across many hires) but pay a premium for specialized roles. The strongest lever for reducing enterprise cost per hire is building an employee referral program — referred hires cost 50-70% less than agency-sourced hires and have 35% higher 2-year retention.',
    },
    {
      title: 'High-Volume Retail (200 Hires)',
      description:
        'Internal HR: $40,000, in-store "Now Hiring" signage: $1,000, online job boards: $2,000, no background checks (outsource to vendor at $15/candidate = $3,000), no relocation. Total: $46,000. Cost per hire: $230 — far below the SHRM average because retail roles require minimal sourcing effort and have high applicant volume per posting. However, retail turnover is 60%+, so the same company may need to hire 200 people to fill 120 net positions, and the lifetime recruiting cost per active employee is much higher than the $230 figure suggests.',
    },
    {
      title: 'Healthcare System (50 Nurses)',
      description:
        'Internal recruiting team: $180,000 (2 nurse recruiters), agency/travel nurse fees: $80,000 (signing bonuses for hard-to-fill specialty roles), job boards (healthcare-specific): $8,000, background checks + license verification: $4,000, relocation: $20,000. Total: $292,000. Cost per hire: $5,840 — at the high end of industry average. Healthcare recruiting is expensive because of credential verification requirements, the specialized candidate pool, and the need to compete with agency travel-nurse contracts that pay $3,000-$5,000 per week.',
    },
  ],
  faqs: [
    {
      question: 'What is the average cost per hire?',
      answer:
        'According to SHRM\'s 2024 Talent Acquisition Benchmarking Report, the average cost per hire in the US is approximately $4,700. This figure varies dramatically by role level and industry. Entry-level roles typically cost $1,000–3,000 to fill. Mid-level professional roles average $4,000–8,000. Executive searches can cost $15,000–50,000+. Companies using in-house recruiting teams typically achieve significantly lower CPH than those relying on external agencies. The SHRM benchmark includes all direct costs (advertising, agency fees, background checks, ATS software, internal HR staff time) but excludes indirect costs like manager interview time, which can add $500-$2,000 per hire.',
    },
    {
      question: 'What is included in cost per hire?',
      answer:
        'Direct costs include advertising and job board fees (LinkedIn, Indeed, Glassdoor), agency/recruiter fees (15-30% of first-year salary), background checks, drug tests, skills assessments, candidate travel and relocation, sign-on bonuses, ATS software, and internal HR/recruiting team salaries. Indirect costs include manager and peer time spent reviewing resumes, interviewing, and onboarding — typically 5-15 hours per candidate. Some organizations also include opportunity cost of unfilled positions (lost productivity during the vacancy, typically $200-$1,000 per day depending on role). The SHRM benchmark uses direct costs only; if you include indirect costs, expect your CPH to be 30-50% higher.',
    },
    {
      question: 'How can I reduce cost per hire?',
      answer:
        'Five proven tactics: (1) Build an employee referral program — referred hires cost 50-70% less than agency-sourced candidates and have 35% higher 2-year retention. Pay $1,000-3,000 referral bonuses; ROI is typically 5-10x. (2) Develop your employer brand to attract passive candidates — a strong LinkedIn presence and Glassdoor profile reduce sourcing cost by 25-40%. (3) Invest in a quality ATS (Applicant Tracking System) to reduce time-to-fill — Greenhouse, Lever, and Ashby cost $300-$1,000/month but pay for themselves by cutting agency spend. (4) Reduce agency dependency by building direct sourcing capabilities — LinkedIn Recruiter ($835/month) pays for itself in 2-3 hires. (5) Track time-to-fill alongside CPH — slow hiring has hidden productivity costs that often exceed the agency fee you were trying to avoid.',
    },
    {
      question: 'Is a lower cost per hire always better?',
      answer:
        'Not necessarily. Extremely low CPH can indicate underinvestment in hiring quality, leading to high turnover. Quality of hire (measured by performance ratings and retention) is often more important than CPH alone. The goal is optimizing total workforce cost — balancing CPH with turnover cost and productivity. A $2,000 cost per hire that produces a poor-fit employee who leaves in 6 months is more expensive than a $6,000 cost per hire that produces a 5-year top performer. The right metric is "cost per productive employee-year" — total recruiting cost divided by the productive tenure of resulting hires. This single number captures the tradeoff between cheap-but-poor hiring and expensive-but-effective hiring.',
    },
    {
      question: 'How does cost per hire differ by industry?',
      answer:
        'Industry benchmarks (SHRM 2024 + our analysis): Retail/QSR $300-$800, Healthcare $4,000-$7,000, Technology $5,000-$10,000, Manufacturing $3,000-$5,000, Financial Services $8,000-$15,000, Executive Search (any industry) $20,000-$50,000+. The variance reflects candidate scarcity, required credential verification, and the level of competition for talent. Healthcare and tech are expensive because specialized candidates are scarce; retail is cheap because applicants are abundant. If your CPH is more than 1.5x your industry average, you likely have an inefficient sourcing mix (too much agency, too little direct sourcing) or a slow hiring process that loses top candidates.',
    },
    {
      question: 'What is the difference between cost per hire and time-to-fill?',
      answer:
        'Cost per hire measures dollars spent to fill a position. Time-to-fill measures days from job posting to accepted offer. The two metrics are related but not the same: a slow hire (90+ days) often has high cost because the position sits vacant, productivity is lost, and overtime is paid to existing staff. The total cost of a vacancy often exceeds the recruiting cost itself. SHRM reports the average time-to-fill is 42 days across all industries, with tech (45-60 days) and healthcare (55-70 days) running longer. Track both metrics together — optimizing CPH at the expense of time-to-fill often produces net-negative outcomes.',
    },
    {
      question: 'How do agency fees work?',
      answer:
        'Contingency agencies charge 15-30% of the hired candidate\'s first-year base salary, paid only if they place a candidate. Retained search firms charge 25-35% of first-year total compensation, paid in installments regardless of placement outcome (typically used for executive roles). Some agencies offer a sliding scale: 20% on first $50k, 25% on next $50k, 30% above $100k. Most agencies include a 90-day guarantee — if the candidate leaves within 90 days, the agency finds a free replacement. Negotiate fees upfront; many agencies will accept 18-20% for volume commitments.',
    },
    {
      question: 'Should I include sign-on bonuses in cost per hire?',
      answer:
        'Yes — sign-on bonuses are a direct cost of attracting the candidate and should be included in CPH. They can be significant: $5,000-$25,000 is typical for tech and healthcare roles. Referral bonuses paid to your own employees ($500-$5,000) should also be included. Together, these "talent acquisition bonuses" often represent 20-30% of total CPH for organizations that use them heavily. Excluding them understates the true cost of hiring and makes agency-sourced hires look more expensive than they actually are (since agency fees and sign-on bonuses often substitute for each other).',
    },
  ],
  relatedTools: [
    { slug: 'employee-turnover-calculator', title: 'Employee Turnover Calculator', description: 'Turnover rate & attrition cost', icon: 'Users' },
    { slug: 'revenue-per-employee-calculator', title: 'Revenue per Employee', description: 'Workforce productivity ratio', icon: 'Activity' },
    { slug: 'workers-comp-calculator', title: 'Workers Comp Calculator', description: 'Estimate insurance premiums', icon: 'ShieldCheck' },
    { slug: 'roi-calculator', title: 'ROI Calculator', description: 'Measure return on HR investment', icon: 'BarChart3' },
    { slug: 'salary-increase-calculator', title: 'Salary Increase Calculator', description: 'Model compensation improvements', icon: 'TrendingUp' },
  ],
};

export default seoData;
