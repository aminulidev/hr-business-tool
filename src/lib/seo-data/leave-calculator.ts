const seoData = {
  breadcrumbs: [{ label: 'Calculators' }, { label: 'Leave Calculator' }],
  tableOfContents: [
    { id: 'how-to-calculate', label: 'How to Calculate' },
    { id: 'formula', label: 'Formula' },
    { id: 'worked-examples', label: 'Worked Examples' },
    { id: 'frequently-asked-questions', label: 'FAQs' },
    { id: 'related-calculators', label: 'Related Calculators' },
  ],
  howToSteps: [
    'Enter entitled hours for each leave type: PTO/vacation, sick leave, and personal leave.',
    'Enter used hours for each leave type during the year.',
    'Click Calculate Leave Balance to see remaining hours per category and overall % used.',
    'Compare two scenarios (current vs projected year-end) using Save A / Save B.',
    'Transfer balances to your HR system (BambooHR, Workday, Gusto) for accrual tracking.',
  ],
  formula: 'Remaining Leave = Entitled Hours - Used Hours\nTotal Entitled = PTO + Sick + Personal\nTotal Used = Used PTO + Used Sick + Used Personal\n% Used = Total Used / Total Entitled x 100',
  formulaDescription: 'Leave balance is the difference between entitled hours (accrued or granted annually) and used hours. Typical US entitlement: 80-120h PTO (10-15 days), 40-80h sick (5-10 days), 16-24h personal (2-3 days). State mandates for paid sick leave apply in CA, NY, WA, MA, OR, AZ, VT, CT, MI, MD, CO, IL, NV, MN, ME.',
  workedExamples: [
    { title: 'Standard US Benefits', description: '120h PTO entitled, 40h used. 40h sick entitled, 8h used. 24h personal entitled, 8h used. Total entitled = 184h. Total used = 56h. Remaining = 128h. % Used = 30.4%.' },
    { title: 'Year-End Balance', description: 'Same entitlement but end of year: 120h PTO used, 32h sick used, 24h personal used. Total used = 176h. Remaining = 8h. Most US employers do not allow PTO rollover — 8h may be forfeited or paid out depending on policy.' },
    { title: 'Generous Tech Company', description: '200h PTO (25 days), 80h sick (10 days), 40h personal (5 days), 40h volunteer = 360h total. After using 100h PTO + 16h sick + 24h personal = 140h used. Remaining = 220h. % Used = 38.9%.' },
    { title: 'European-Style Leave', description: 'A US company offering EU-style leave: 200h PTO (25 days, EU minimum), 80h sick, 40h personal, 80h parental = 400h total. After using 100h PTO + 24h sick + 0h personal + 80h parental = 204h used. Remaining = 196h.' },
    { title: 'Part-Time Prorated', description: 'Part-time 20h/week employee with 60h PTO (prorated from 120h full-time), 20h sick, 12h personal = 92h total. After using 30h PTO + 4h sick = 34h used. Remaining = 58h.' },
  ],
  faqs: [
    { question: 'How much leave do US workers get?', answer: 'There is NO federal mandate for paid leave in the US. Typical employer offerings: 10-15 days PTO (80-120h) after 1 year, 5-10 days sick (40-80h), 2-3 days personal (16-24h). 23% of US private-sector workers have ZERO paid leave. State mandates for paid sick leave exist in CA, NY, WA, MA, OR, AZ, VT, CT, MI, MD, CO, IL, NV, MN, ME.' },
    { question: 'Is PTO paid out when you quit?', answer: 'Depends on state law. Vacation/PTO is considered earned wages in CA, CO, IL, LA, MA, NE, ND, OR, RI (must be paid out at termination). Sick leave payout is not required in most states. "Use it or lose it" policies are illegal in CA, CO, NE, OR. Check your state DOL.' },
    { question: 'Does PTO roll over year to year?', answer: 'Employer policy varies. Common options: (1) Use-it-or-lose-it (forbidden in CA, NE, OR), (2) Unlimited rollover, (3) Capped rollover (e.g., 1.5x annual accrual). California requires unlimited rollover or payout of unused vacation. Sick leave rollover is mandated in CA, NY, WA, MA, OR.' },
    { question: 'What is the difference between PTO and vacation?', answer: 'PTO (Paid Time Off) is a single bank used for any purpose — vacation, sick, personal. Vacation is dedicated to vacation only. PTO banks offer flexibility but can discourage sick leave use (employees save PTO for vacations). Some employers have separate vacation + sick banks to comply with state sick leave mandates.' },
    { question: 'How is leave accrued?', answer: 'Common accrual methods: (1) Lump sum — granted at hire date or anniversary, (2) Per pay period — accrue hours each pay (e.g., 4.62h per bi-weekly pay = 120h/year), (3) Per hour worked — accrue based on hours worked (e.g., 0.0577h per hour = 120h at 2,080h/year). Accrual rates typically increase with tenure.' },
    { question: 'What is FMLA leave?', answer: 'FMLA (Family and Medical Leave Act) provides up to 12 weeks of UNPAID, job-protected leave per year for: birth/adoption of child, serious health condition, or care of family member with serious health condition. Applies to employers with 50+ employees. Employee must have worked 1,250h in past 12 months. Some states (CA, NY, NJ, RI, WA, MA, CT, OR, CO, DC, MN, MD, DE) offer paid family leave through state insurance programs.' },
  ],
  relatedTools: [
    { slug: 'sick-leave-calculator', title: 'Sick Leave Calculator', description: 'State-specific sick accrual', icon: 'CalendarClock' },
    { slug: 'pto-accrual-calculator', title: 'PTO Accrual Calculator', description: 'Per-pay-period accrual', icon: 'CalendarDays' },
    { slug: 'attendance-calculator', title: 'Attendance Calculator', description: 'Track attendance rate', icon: 'CalendarCheck' },
    { slug: 'holiday-countdown-calculator', title: 'Holiday Countdown', description: 'Days until next holiday', icon: 'CalendarClock' },
    { slug: 'severance-pay-calculator', title: 'Severance Pay Calculator', description: 'Severance on separation', icon: 'UserMinus' },
  ],
};
export default seoData;
