const seoData = {
  breadcrumbs: [{ label: 'Calculators' }, { label: 'Sick Leave Calculator' }],
  tableOfContents: [
    { id: 'how-to-calculate', label: 'How to Calculate' },
    { id: 'formula', label: 'Formula' },
    { id: 'worked-examples', label: 'Worked Examples' },
    { id: 'frequently-asked-questions', label: 'FAQs' },
    { id: 'related-calculators', label: 'Related Calculators' },
  ],
  howToSteps: [
    'Select your state — accrual rate and annual cap auto-populate based on state mandates.',
    'Enter total hours worked in the year (full-time = 2,080h).',
    'Enter sick hours already used this year.',
    'Optionally override accrual with a manual value (for employer plans more generous than state minimum).',
    'Click Calculate Sick Leave to see accrued, used, and remaining balance.',
  ],
  formula: 'Accrued = min(Hours Worked x State Rate, State Cap)\nRemaining = Accrued - Used\nAccrual Rate Examples: CA = 1h per 30h worked (cap 48h), WA = 1h per 40h worked (cap 40h)',
  formulaDescription: '14 states and DC mandate paid sick leave accrual based on hours worked. Typical rate: 1 hour per 30 hours worked, capped at 24-56 hours per year. Federal FLSA does not require sick leave. State-mandated sick leave is in addition to FMLA (unpaid) and any employer-provided disability insurance.',
  workedExamples: [
    { title: 'California Full-Time Worker', description: '2,080h worked x (1/30) = 69.3h accrued. CA cap = 48h (for employers with 25 or fewer employees; 80h for 25+). Accrued = 48h. Used = 16h. Remaining = 32h.' },
    { title: 'New York Part-Time Worker', description: '1,040h worked (half-time) x (1/30) = 34.7h accrued. NY cap = 40h (employers with 4+ employees) or 56h (100+ employees). Used = 12h. Remaining = 22.7h.' },
    { title: 'Washington State', description: '2,080h x (1/40) = 52h accrued. WA cap = 40h. Accrued = 40h. Used = 8h. Remaining = 32h.' },
    { title: 'Texas (No Mandate)', description: 'Texas has no state sick leave mandate. FLSA does not require sick leave. Worker relies on employer policy: typical 40-80h/year. Manual accrual = 40h. Used = 24h. Remaining = 16h.' },
    { title: 'Massachusetts', description: '2,080h x (1/30) = 69.3h accrued. MA cap = 40h. Accrued = 40h. Used = 32h. Remaining = 8h.' },
  ],
  faqs: [
    { question: 'Which states require paid sick leave?', answer: '14 states + DC mandate paid sick leave: Arizona, California, Colorado, Connecticut, Illinois, Maine, Maryland, Massachusetts, Michigan, Minnesota, Nevada, New Jersey, New Mexico, New York, Oregon, Rhode Island, Vermont, Virginia, Washington. Plus DC. Many cities (NYC, Chicago, Seattle, San Francisco, Philadelphia) have stricter local mandates.' },
    { question: 'How is sick leave accrued?', answer: 'Most state mandates use: 1 hour of sick leave per 30 hours worked (CA, NY, MA, MD, AZ, NJ, etc.). Washington uses 1 hour per 40 hours worked. Annual caps range from 24h (Vermont) to 80h (CA for 25+ employees, NJ, NY for 100+ employees). Unused sick leave must roll over year-to-year in most mandate states.' },
    { question: 'Can sick leave be used for family care?', answer: 'Yes — all state sick leave mandates allow use for care of a family member (child, spouse, parent, domestic partner, and in some states grandparent, sibling, or "chosen family"). Also typically covers domestic violence, sexual assault, stalking (safe leave), and school closures due to public health emergencies.' },
    { question: 'Is FMLA the same as paid sick leave?', answer: 'No. FMLA provides up to 12 weeks of UNPAID, job-protected leave for serious illness or family care (employer 50+ employees). State paid sick leave is PAID but limited (typically 40-80h/year). Some states (CA, NY, NJ, RI, WA, MA, CT, OR, CO, DC, MN, MD, DE) offer separate Paid Family & Medical Leave (PFML) insurance programs providing 6-12 weeks of partial wage replacement.' },
    { question: 'Does unused sick leave roll over?', answer: 'Yes — in most state mandate states, unused sick leave must roll over year-to-year (subject to the annual cap). California, NY, WA, MA, OR, AZ, CT all require rollover. Employers may "cash out" unused sick leave at year-end in lieu of rollover in some states. Check your state DOL.' },
    { question: 'Is sick leave paid out when you quit?', answer: 'Generally NO — sick leave is not required to be paid out at termination in most states (unlike vacation/PTO which is treated as earned wages in CA, CO, IL, LA, MA, NE, ND, OR, RI). Some employer policies voluntarily pay out sick leave. California does NOT require sick leave payout unless policy specifically allows it.' },
  ],
  relatedTools: [
    { slug: 'leave-calculator', title: 'Leave Calculator', description: 'Total leave balance across all types', icon: 'CalendarRange' },
    { slug: 'pto-accrual-calculator', title: 'PTO Accrual Calculator', description: 'Vacation accrual per pay period', icon: 'CalendarDays' },
    { slug: 'attendance-calculator', title: 'Attendance Calculator', description: 'Track attendance rate', icon: 'CalendarCheck' },
    { slug: 'holiday-countdown-calculator', title: 'Holiday Countdown', description: 'Days until next federal holiday', icon: 'CalendarClock' },
    { slug: 'workers-comp-calculator', title: 'Workers Comp Calculator', description: 'WC insurance premium', icon: 'ShieldCheck' },
  ],
};
export default seoData;
