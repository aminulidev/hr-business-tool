const seoData = {
  breadcrumbs: [{ label: 'Calculators' }, { label: 'Employee Turnover Rate Calculator' }],
  tableOfContents: [
    { id: 'how-to-calculate', label: 'How to Calculate' },
    { id: 'formula', label: 'Formula' },
    { id: 'worked-examples', label: 'Worked Examples' },
    { id: 'frequently-asked-questions', label: 'FAQs' },
    { id: 'related-calculators', label: 'Related Calculators' },
  ],
  howToSteps: [
    'Enter your headcount at the beginning of the measurement period (typically January 1 for annual rate).',
    'Enter your headcount at the end of the period (typically December 31).',
    'Enter the number of employees who left (separations) during the period — include voluntary and involuntary separations.',
    'Optionally enter the average salary and replacement cost percentage to calculate the financial cost of turnover.',
    'Click Calculate to see your turnover rate, retention rate, and cost estimate compared to industry benchmarks.',
    'Review the worked examples below to see how the formula applies to companies of different sizes and industries.',
  ],
  formula: 'Average Headcount = (Beginning + Ending) / 2\nTurnover Rate = (Separations / Average Headcount) × 100\nCost of Turnover = Separations × Average Salary × Replacement Cost %',
  formulaDescription:
    "The employee turnover rate measures the percentage of the workforce that leaves over a given period. Using average headcount (rather than beginning or ending) smooths out fluctuations from hiring and departures throughout the year — without this, a fast-growing company could show an artificially low turnover rate just because the ending headcount is much larger than the beginning. Replacement costs typically range from 50% of salary for entry-level roles (recruiting, training, lost productivity during ramp-up) to 200%+ for senior or specialized roles where institutional knowledge is hard to replace. The Gallup 2023 State of the Workplace report estimates that U.S. businesses lose over $1 trillion per year to voluntary turnover, with the median replacement cost falling between 50% and 75% of annual salary.",
  workedExamples: [
    {
      title: 'Tech Startup (50 Employees)',
      description:
        'Beginning headcount: 50, Ending headcount: 52, Separations during year: 8. Average headcount = (50 + 52) / 2 = 51. Turnover rate = 8 / 51 × 100 = 15.7% — slightly above the tech industry benchmark of 13.2%. At an average salary of $90,000 and a replacement cost of 75% of salary, the annual cost of turnover = 8 × $90,000 × 0.75 = $540,000. For a 50-person startup, this represents $10,800 per employee per year in turnover cost — a material impact that typically justifies a dedicated retention program.',
    },
    {
      title: 'Retail Store (30 Employees)',
      description:
        'Beginning: 28, Ending: 32, Separations: 18. Average headcount: 30. Turnover rate: 18 / 30 × 100 = 60% — slightly above the retail industry average of 58%. At an average salary of $35,000 and 40% replacement cost, the annual cost = 18 × $35,000 × 0.40 = $252,000. Retail turnover is structurally high due to seasonal hiring, student workers, and part-time staff; many retail operators target a 50% turnover rate as "good" for the sector, even though the same rate would be alarming in tech or finance.',
    },
    {
      title: 'Hospital Nursing Unit (100 Nurses)',
      description:
        'Beginning: 100, Ending: 98, Separations: 24. Average headcount: 99. Turnover rate: 24 / 99 × 100 = 24.2% — above the healthcare benchmark of 22.4%. At an average salary of $75,000 and 100% replacement cost (nurses require extensive orientation and clinical training), the annual cost = 24 × $75,000 × 1.00 = $1,800,000. Healthcare turnover is uniquely expensive because each departing nurse takes 8-12 weeks of orientation investment with them, and replacement hiring often requires agency travel nurses at 2-3x normal pay rates.',
    },
    {
      title: 'Professional Services Firm (200 Employees)',
      description:
        'Beginning: 195, Ending: 205, Separations: 22. Average headcount: 200. Turnover rate: 22 / 200 × 100 = 11% — well below the professional services benchmark of 14-18%. At an average salary of $110,000 and 150% replacement cost (client relationships + specialized expertise), the annual cost = 22 × $110,000 × 1.50 = $3,630,000. Even at a "healthy" 11% turnover rate, the dollar cost is substantial — a strong argument for retention bonuses and career-development programs.',
    },
    {
      title: 'Quick Service Restaurant (45 Employees)',
      description:
        'Beginning: 40, Ending: 50, Separations: 30. Average headcount: 45. Turnover rate: 30 / 45 × 100 = 66.7% — within the 60-75% QSR industry range. At an average salary of $24,000 and 30% replacement cost (training is minimal, productivity ramps quickly), the annual cost = 30 × $24,000 × 0.30 = $216,000. QSR turnover is high by design — the business model relies on part-time and entry-level labor — but reducing it by even 10 percentage points would save $32,000/year per location.',
    },
  ],
  faqs: [
    {
      question: 'What is a good employee turnover rate?',
      answer:
        'A "good" turnover rate depends heavily on industry. Tech averages 13–18%, healthcare 20–25%, and retail can be 50–70%. Generally, below 10% is excellent, 10–20% is healthy, and above 35% indicates problems worth investigating. Voluntary vs involuntary turnover matters — high voluntary turnover signals engagement or culture issues, while high involuntary turnover may reflect poor hiring practices. The most useful benchmark is your own historical rate: a sustained 3-5 percentage point increase over a 6-month period is a stronger signal than a single-point comparison to industry averages.',
    },
    {
      question: 'What is the cost of employee turnover?',
      answer:
        'Research estimates replacement costs at 50–200% of annual salary. Entry-level roles: 30–50% (recruiting, training, lost productivity). Mid-level: 100–150%. Senior/specialized: 150–200%+. The Gallup 2023 State of the Workplace report estimated the US economy loses $1 trillion per year to voluntary employee turnover. The cost components include: recruiting spend (job ads, agency fees, internal HR time), onboarding and training (including trainer time), lost productivity during the new hire\'s ramp-up period (typically 3-6 months to reach full productivity), overtime paid to existing staff covering the gap, and institutional knowledge loss — the hardest to quantify but often the largest in knowledge-work roles.',
    },
    {
      question: 'What is the difference between voluntary and involuntary turnover?',
      answer:
        'Voluntary turnover occurs when employees choose to leave (resignations, retirements). Involuntary turnover includes layoffs, terminations, and performance-based separations. High voluntary turnover is a key indicator of employee dissatisfaction, poor management, or uncompetitive compensation. A healthy organization typically has voluntary turnover below 10% and involuntary turnover below 5%. Tracking the two separately is critical — a 15% total rate composed of 12% involuntary and 3% voluntary is a very different signal than 3% involuntary and 12% voluntary. The first suggests aggressive performance management; the second suggests retention problems.',
    },
    {
      question: 'How do you reduce employee turnover?',
      answer:
        'Key strategies: competitive compensation and benefits (benchmark annually against Radford or PayScale data), strong onboarding (the first 90 days determines 3-year retention probability), clear career development programs (the #1 reason top performers leave is lack of growth opportunity), regular recognition and feedback culture (Gallup research shows employees who feel recognized are 4x more likely to stay), flexible work arrangements (post-2020, this is a top-3 retention driver), and manager training (50% of employees who leave cite their direct manager as the primary reason). Exit interviews identify specific reasons employees leave — track themes quarterly to spot patterns. Tracking turnover by department and manager helps isolate whether the issue is systemic or localized.',
    },
    {
      question: 'How is annualized turnover rate calculated?',
      answer:
        'If you have turnover data for less than a full year, annualize it by multiplying by the ratio of 12 to the number of months measured. For example, if 4 employees left in a 3-month period from an average headcount of 50, the quarterly turnover rate is 4/50 × 100 = 8%. Annualized = 8% × (12/3) = 32%. This allows you to compare a 3-month measurement window to annual benchmarks. Note that annualized rates can be skewed by seasonal patterns — annualizing a Q4 retail turnover figure will overstate the full-year rate because Q4 is seasonally high. Always disclose the measurement period when reporting turnover.',
    },
    {
      question: 'What is the difference between turnover rate and attrition rate?',
      answer:
        'The terms are often used interchangeably but have a subtle distinction. Turnover rate counts ALL separations (voluntary + involuntary) as a percentage of average headcount. Attrition rate typically refers to voluntary separations only and does NOT count replacements — i.e., the position is eliminated rather than backfilled. A company in restructuring may report low attrition (positions eliminated, not employees leaving voluntarily) but high turnover. For most operational purposes, the turnover rate is the more useful metric because it captures the full cost of replacing departing employees.',
    },
    {
      question: 'How does turnover differ by industry?',
      answer:
        'Industry averages (BLS 2024 JOLTs data, annualized): Retail 58-65%, Accommodation & Food Service 75-85%, Healthcare 22-25%, Professional & Business Services 14-18%, Financial Services 12-15%, Government 8-12%, Manufacturing 16-20%, Technology 13-18%. The lowest-turnover industries tend to have high job security, structured career paths, and competitive benefits. The highest-turnover industries tend to have part-time or seasonal workforces, lower average wages, and fewer advancement opportunities. Benchmarking against your specific industry sub-sector is critical — a 25% rate is exceptional in retail but alarming in government.',
    },
    {
      question: 'Should I track turnover by department?',
      answer:
        'Yes — tracking turnover by department, manager, and role is the single most valuable retention diagnostic. Company-wide turnover averages hide localized problems: one bad manager can produce 40% turnover in their team while the rest of the company runs at 8%. Pull turnover by manager quarterly; investigate any manager whose rate is more than 1.5x the company average. Common patterns: new managers (under 2 years of experience) typically run higher turnover, managers promoted from technical roles without management training often struggle with retention, and managers of teams with high workloads or unclear expectations see elevated rates.',
    },
  ],
  relatedTools: [
    { slug: 'cost-per-hire-calculator', title: 'Cost per Hire Calculator', description: 'Measure total recruiting investment', icon: 'Briefcase' },
    { slug: 'revenue-per-employee-calculator', title: 'Revenue per Employee', description: 'Workforce productivity metrics', icon: 'Activity' },
    { slug: 'severance-pay-calculator', title: 'Severance Pay Calculator', description: 'Calculate departing employee packages', icon: 'UserMinus' },
    { slug: 'salary-increase-calculator', title: 'Salary Increase Calculator', description: 'Model compensation improvements', icon: 'TrendingUp' },
    { slug: 'workers-comp-calculator', title: 'Workers Comp Calculator', description: 'Estimate insurance premiums', icon: 'ShieldCheck' },
  ],
};

export default seoData;
