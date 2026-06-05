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
      ],
  formula: 'Average Headcount = (Beginning + Ending) / 2\nTurnover Rate = (Separations / Average Headcount) × 100\nCost of Turnover = Separations × Average Salary × Replacement Cost %',
  formulaDescription: "The employee turnover rate measures the percentage of the workforce that leaves over a given period. Average headcount smooths out fluctuations from hiring and departures throughout the year. Replacement costs typically range from 50% of salary (entry-level) to 200%+ (senior/specialized roles).",
  workedExamples: [
        { title: 'Tech Startup (50 Employees)', description: 'Beginning: 50, Ending: 52, Separations: 8. Avg headcount: 51. Turnover rate: 8/51 = 15.7% — slightly above tech benchmark of 13.2%. At avg salary $90k and 75% replacement cost: $8 × $67,500 = $540,000 annual cost.' },
        { title: 'Retail Store (30 Employees)', description: 'Beginning: 28, Ending: 32, Separations: 18. Avg headcount: 30. Turnover rate: 18/30 = 60% — slightly above retail average of 58.1%. Cost at $35k avg and 40% replacement: $252,000.' },
        { title: 'Hospital Unit (100 Nurses)', description: 'Beginning: 100, Ending: 98, Separations: 24. Avg headcount: 99. Turnover rate: 24.2% — above healthcare benchmark of 22.4%. At $75k avg and 100% replacement: $1.8M per year.' },
      ],
  faqs: [
        { question: 'What is a good employee turnover rate?', answer: 'A "good" turnover rate depends heavily on industry. Tech averages 13–18%, healthcare 20–25%, and retail can be 50–70%. Generally, below 10% is excellent, 10–20% is healthy, and above 35% indicates problems worth investigating. Voluntary vs involuntary turnover matters — high voluntary turnover signals engagement or culture issues.' },
        { question: 'What is the cost of employee turnover?', answer: 'Research estimates replacement costs at 50–200% of annual salary. Entry-level roles: 30–50% (recruiting, training, lost productivity). Mid-level: 100–150%. Senior/specialized: 150–200%+. A 2022 Gallup study estimated the US economy loses $1 trillion per year to voluntary employee turnover.' },
        { question: 'What is the difference between voluntary and involuntary turnover?', answer: 'Voluntary turnover occurs when employees choose to leave (resignations, retirements). Involuntary turnover includes layoffs, terminations, and performance-based separations. High voluntary turnover is a key indicator of employee dissatisfaction, poor management, or uncompetitive compensation.' },
        { question: 'How do you reduce employee turnover?', answer: 'Key strategies: competitive compensation and benefits, strong onboarding, career development programs, recognition and feedback culture, flexible work arrangements, and manager training. Exit interviews identify specific reasons employees leave. Tracking turnover by department helps isolate management-related issues.' },
      ],
  relatedTools: [
        { slug: 'cost-per-hire-calculator', title: 'Cost per Hire Calculator', description: 'Measure total recruiting investment', icon: 'Briefcase' },
        { slug: 'revenue-per-employee-calculator', title: 'Revenue per Employee', description: 'Workforce productivity metrics', icon: 'Activity' },
        { slug: 'severance-pay-calculator', title: 'Severance Pay Calculator', description: 'Calculate departing employee packages', icon: 'UserMinus' },
        { slug: 'salary-increase-calculator', title: 'Salary Increase Calculator', description: 'Model compensation improvements', icon: 'TrendingUp' },
      ],
};

export default seoData;
