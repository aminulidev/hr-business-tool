const seoData = {
  breadcrumbs: [{ label: 'Calculators' }, { label: 'Training Cost Calculator' }],
  tableOfContents: [
    { id: 'how-to-calculate', label: 'How to Calculate' },
    { id: 'formula', label: 'Formula' },
    { id: 'worked-examples', label: 'Worked Examples' },
    { id: 'frequently-asked-questions', label: 'FAQs' },
    { id: 'related-calculators', label: 'Related Calculators' },
  ],
  howToSteps: [
    'Enter content development cost (instructional design, video, materials).',
    'Enter delivery cost (instructor time, facility, travel).',
    'Enter materials and technology cost (LMS, software).',
    'Enter number of employees trained.',
    'Enter training hours per employee.',
    'Enter average hourly rate for lost productivity calculation.',
  ],
  formula: 'Direct Cost = Development + Delivery + Materials\nLost Productivity = Employees x Hours x Hourly Rate\nTotal Cost = Direct Cost + Lost Productivity\nCost per Employee = Total / Employees\nCost per Hour = Total / (Employees x Hours)',
  formulaDescription: 'Total training cost = direct cost (development + delivery + materials) + lost productivity (employees\' salary during training hours). Industry benchmark: $1,000-$2,000/employee/year. Training Magazine reports average $1,286/learner.',
  workedExamples: [
    { title: 'Onboarding Program', description: '$15k dev + $8k delivery + $3k materials = $26k direct. 50 employees × 8h × $30 = $12k productivity. Total = $38k. Per employee = $760. Per hour = $95.' },
    { title: 'Annual Compliance Training', description: '$5k dev + $10k delivery + $2k materials = $17k. 200 emp × 4h × $25 = $20k. Total = $37k. Per employee = $185. Per hour = $46.' },
    { title: 'Technical Training', description: '$30k dev + $15k delivery + $5k materials = $50k. 20 emp × 40h × $45 = $36k. Total = $86k. Per employee = $4,300. Per hour = $108.' },
    { title: 'Leadership Development', description: '$50k dev + $25k delivery + $10k materials = $85k. 15 emp × 80h × $75 = $90k. Total = $175k. Per employee = $11,667. Per hour = $146.' },
    { title: 'E-Learning Rollout', description: '$40k dev (one-time) + $2k delivery + $5k LMS = $47k year 1. 500 emp × 2h × $30 = $30k. Total = $77k. Per employee = $154. Year 2: $32k (no dev).' },
  ],
  faqs: [
    { question: 'What is the average training cost per employee?', answer: 'Training Magazine benchmark: $1,286 per learner per year. Range: $500 (small companies) to $2,000+ (large enterprises with formal L&D). By industry: tech $2,000+, healthcare $1,500, manufacturing $1,000, retail $500. Includes direct cost + lost productivity.' },
    { question: 'What is included in training cost?', answer: 'Direct cost: content development (instructional design, video production), delivery (instructor time, facility, travel), materials (workbooks, software, LMS license). Indirect cost: lost productivity (employee salary during training hours). Often forgotten: manager time, IT setup, post-training reinforcement.' },
    { question: 'What is training ROI?', answer: 'Training ROI = (value of productivity gains - training cost) / training cost × 100. Measure: (1) Pre/post productivity metrics, (2) Error rate reduction, (3) Sales lift, (4) Retention improvement, (5) Time-to-competency reduction. Good ROI: >200%. Hard to measure — use Kirkpatrick 4 levels: reaction, learning, behavior, results.' },
    { question: 'How much should training budget be?', answer: 'SHRM benchmark: 1-5% of payroll. Training Magazine: $1,286/learner/year. Small companies: $500-$1,000/employee. Large enterprises: $1,500-$2,500/employee. Tech/finance: $2,000+ (skills refresh). Compliance-only: $200-$500. Allocate by: leadership 30%, technical 30%, compliance 20%, soft skills 20%.' },
    { question: 'What is the Kirkpatrick model?', answer: 'Kirkpatrick 4 levels of training evaluation: (1) Reaction — did learners like it? (survey), (2) Learning — did they gain knowledge/skills? (test), (3) Behavior — are they applying it on the job? (observation), (4) Results — did business metrics improve? (KPIs). Most companies measure Level 1 only; best measure all 4.' },
    { question: 'How do you reduce training cost?', answer: 'Strategies: (1) E-learning instead of classroom (50-80% savings), (2) Train-the-trainer (internal experts), (3) Reuse content across programs, (4) Microlearning (5-10 min modules), (5) Peer/mentor learning (free), (6) Job aids instead of training, (7) Vendor-provided free training. Balance cost with quality — bad training wastes time.' },
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
