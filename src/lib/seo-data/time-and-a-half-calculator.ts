const seoData = {
  breadcrumbs: [{ label: 'Calculators' }, { label: 'Time and a Half Calculator' }],
  tableOfContents: [
        { id: 'how-to-calculate', label: 'How to Calculate' },
        { id: 'formula', label: 'Formula' },
        { id: 'worked-examples', label: 'Worked Examples' },
        { id: 'frequently-asked-questions', label: 'FAQs' },
        { id: 'related-calculators', label: 'Related Calculators' },
      ],
  howToSteps: [
        'Enter your regular hourly rate — your standard pay per hour before overtime.',
        'Enter the number of regular hours worked (standard full-time week = 40 hours).',
        'Enter your overtime hours — hours worked beyond 40 per week qualifying for 1.5× pay.',
        'Click Calculate to see your overtime rate, OT earnings, regular pay, and total gross pay.',
      ],
  formula: 'Overtime Rate = Regular Rate × 1.5\nOvertime Pay = Overtime Rate × Overtime Hours\nTotal Pay = Regular Pay + Overtime Pay',
  formulaDescription: "Time and a half means you earn 1.5 times your regular hourly wage for each overtime hour. Under the federal FLSA, non-exempt employees must receive at least 1.5× their regular rate for all hours worked over 40 in a workweek.",
  workedExamples: [
        { title: 'Standard Overtime Week', description: 'An employee earning $20.00/hr works 45 hours (40 regular + 5 OT). OT rate: $30/hr. Regular pay: $800. OT pay: $150. Total: $950.' },
        { title: 'Busy Season Push', description: 'A retail worker at $15.50/hr works 50 hours (10 OT). OT rate: $23.25/hr. Regular pay: $620. OT pay: $232.50. Total: $852.50.' },
        { title: 'Deadline Crunch', description: 'Effective $35/hr employee works 48 hours (8 OT). OT rate: $52.50. Regular pay: $1,400. OT pay: $420. Total: $1,820.' },
      ],
  faqs: [
        { question: 'What is time and a half?', answer: 'Time and a half means 1.5× your regular hourly rate for overtime hours. At $20/hr, overtime is $30/hr. Required by the FLSA for non-exempt employees working over 40 hours per week.' },
        { question: 'Who qualifies for time and a half?', answer: 'Non-exempt employees under the FLSA are entitled to 1.5× for hours over 40/week. Exempt employees (executive, administrative, professional roles above the salary threshold) are excluded. Status depends on duties and salary, not just job title.' },
        { question: 'Do states have daily overtime rules?', answer: 'Yes — California requires 1.5× for hours over 8/day and 2× for hours over 12. Alaska and Nevada also have daily overtime thresholds. Always check your state laws alongside federal FLSA.' },
        { question: 'How is overtime calculated for salaried employees?', answer: 'Salaried non-exempt employees are still entitled to overtime. Divide weekly salary by 40 to find hourly equivalent, then apply the 1.5× multiplier to hours over 40.' },
      ],
  relatedTools: [
        { slug: 'overtime-calculator', title: 'Overtime Calculator', description: 'Full OT tool with daily & weekly tracking', icon: 'Timer' },
        { slug: 'wages-calculator', title: 'Wages Calculator', description: 'Gross wages including overtime and double time', icon: 'Banknote' },
        { slug: 'hourly-paycheck-calculator', title: 'Hourly Paycheck Calculator', description: 'Net take-home pay after taxes', icon: 'BadgeDollarSign' },
        { slug: 'salary-converter', title: 'Salary Converter', description: 'Convert between hourly and annual pay', icon: 'ArrowLeftRight' },
      ],
};

export default seoData;
