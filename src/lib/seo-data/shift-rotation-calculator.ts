import type { CalculatorSeoData } from './types';
import { SRC } from './sources';

// Shift Schedule Planner — rotation patterns + weekly roster (Phase 15.1 merged
// the former employee-schedule-calculator into this page).
const seoData = {
  howToSteps: [
    'Choose the Rotating shift patterns tab and pick a pattern: 2-2-3 (Panama), DuPont, Pitman or 4-on-4-off. The full cycle for all four crews appears at once — D for a day shift, N for a night shift — with a check that every day has both a day and a night crew.',
    'Enter an hourly rate to see the average weekly hours the pattern builds in and what that costs per week including overtime. Switch the overtime rule to Section 7(k) if you schedule police officers or firefighters on 28-day work periods.',
    'For a normal workweek, open the Weekly staff roster tab and type each person\'s shift as a range such as 9-5, 8:30-4:30 or 22-6. Hours, overtime over 40 and pay update as you type.',
    'Watch the On duty row under the roster: a red zero means nobody is scheduled that day. Add people with + Add employee and remove them with ×.',
    'Save a plan to history to come back to it, or use the print button to hand a copy to the team.',
  ],

  formula:
    'Average weekly hours = (shifts per cycle × shift length) ÷ (cycle days ÷ 7)\n2-2-3 and Pitman: 7 shifts × 12 h ÷ 2 weeks = 42 h/week\nDuPont: 14 shifts × 12 h ÷ 4 weeks = 42 h/week\n4-on-4-off: 4 shifts × 12 h ÷ (8 ÷ 7) weeks = 42 h/week\nFLSA overtime = hours over 40 in each individual workweek (not the average)\n7(k) overtime = hours over 171 (police) or 212 (fire) in a 28-day work period',
  formulaDescription:
    'Every common 12-hour rotation averages 42 hours a week because four crews share 168 hours of coverage: 168 ÷ 4 = 42. The average hides the week-to-week swing that drives overtime — a 2-2-3 crew works three shifts (36 hours) one week and four (48 hours) the next, so under the FLSA that second week carries 8 hours at time-and-a-half even though the fortnight averages out. Public-safety employers can elect a 7(k) work period of 7 to 28 days instead; over 28 days the thresholds are 171 hours for law enforcement and 212 for fire protection, which is why most agencies use 28-day periods with 12-hour rotations. The weekly roster uses the plain FLSA rule: hours over 40 for each person at 1.5× their rate.',

  workedExamples: [
    {
      title: '2-2-3 (Panama) for a 4-crew plant at $28/hour',
      description:
        'Each crew works 7 of every 14 days on 12-hour shifts: 84 hours per fortnight, 42 a week on average. Week 1 is 36 hours (3 shifts) and week 2 is 48 hours (4 shifts), so each fortnight includes 8 overtime hours. Pay per fortnight = 76 regular hours × $28 + 8 OT hours × $42 = $2,128 + $336 = $2,464, or about $1,232 a week. Over a year: 2,184 hours, 208 of them overtime.',
    },
    {
      title: 'DuPont 28-day cycle for a refinery, $32/hour',
      description:
        'Pattern per crew: 4 nights, 3 off, 3 days, 1 off, 3 nights, 3 off, 4 days, 7 off — 14 shifts, 168 hours in 28 days. The four weeks run 48, 36, 48 and 36 hours, giving 16 hours of overtime per cycle. Cycle pay = 152 × $32 + 16 × $48 = $4,864 + $768 = $5,632. The seven consecutive days off every cycle is the pattern\'s selling point; the four-night stretch is its weakness.',
    },
    {
      title: 'Pitman (2-3-2) in a hospital with every other weekend off',
      description:
        'Same 7-of-14 count as 2-2-3 but arranged 2 on, 3 off, 2 on, 2 off, 3 on, 2 off, so the three-day stretch covers Friday–Sunday. A nurse on Pitman works 26 weekends a year and has 26 off. Weekly hours alternate 36 and 48, exactly like 2-2-3, so the overtime cost is identical; the difference is purely which days are off.',
    },
    {
      title: 'Police 12-hour rotation on a 28-day 7(k) period',
      description:
        'A 2-2-3 rotation gives 168 hours per 28 days. Under the standard FLSA rule that would include 16 overtime hours (two 48-hour weeks). Under a 7(k) 28-day work period the threshold is 171 hours, so the same 168 hours carry no overtime at all. A department running 4-on-4-off (also 168 hours per 28 days) gets the same result; only hours above 171 — call-outs, court time, training — are paid at 1.5×.',
    },
    {
      title: 'Weekly retail roster: 3 people, one over 40',
      description:
        'Alice 8-4 Monday–Friday (40 h at $22 = $880). Bob 4-12 Monday–Saturday (48 h at $24: 40 × $24 + 8 × $36 = $1,248). Carol 8-4 Saturday and Sunday (16 h at $26 = $416). Total 104 hours, 8 of them overtime, $2,544 in wages. Moving one of Bob\'s shifts to Carol saves $96 a week: Bob drops to 40 hours ($960), Carol rises to 24 hours ($624), total $2,464.',
    },
  ],

  benchmarkTables: [
    {
      title: 'Rotating 12-Hour Shift Patterns Compared',
      subtitle: 'All four patterns need four crews for round-the-clock coverage and average 42 hours a week; they differ in cycle length, longest run of shifts and how weekends fall.',
      headers: ['Pattern', 'Cycle', 'Shifts per cycle (per crew)', 'Longest stretch on', 'Weekly hours by week', 'Weekends off', 'Typical users'],
      rows: [
        ['2-2-3 (Panama)', '14 days', '7', '3 shifts', '36 / 48', 'Every other weekend (Fri–Sun or Sat–Sun)', 'Dispatch, hospitals, manufacturing'],
        ['Pitman (2-3-2)', '14 days', '7', '3 shifts', '36 / 48', 'Every other Fri–Sun', 'Nursing, security, call centers'],
        ['DuPont', '28 days', '14', '4 shifts', '48 / 36 / 48 / 36', 'One full weekend + 7 consecutive days off per cycle', 'Chemical plants, refineries, utilities'],
        ['4-on 4-off', '8 days', '4', '4 shifts', '48 / 36 (alternating by position in the week)', 'Rotates; about every other weekend', 'Mining, oil and gas, fire service, warehousing'],
      ],
      note: 'Hours per crew per 28 days are 168 for every pattern. The FLSA overtime shown by the planner assumes a Monday–Sunday workweek; 7(k) agencies use 171 (police) or 212 (fire) hours per 28-day period instead.',
    },
    {
      title: 'Fair Workweek (Predictive Scheduling) Laws, 2026',
      subtitle: 'Where posting a roster late or changing it costs the employer money. Most cover retail, food service and hospitality employers above a size threshold.',
      headers: ['Jurisdiction', 'Advance notice', 'Change premium', 'Who is covered'],
      rows: [
        ['Oregon (statewide)', '14 days', '1 hour of pay for added hours or changed times; half pay for cut hours', 'Retail, hospitality, food service with 500+ employees worldwide'],
        ['New York City', '14 days', '$10–$75 per change', 'Fast food (also "clopening" ban) and retail'],
        ['Chicago', '14 days', '1 hour of pay per change; half pay for cancelled hours', 'Building services, healthcare, hotels, manufacturing, restaurants, retail, warehouses'],
        ['Seattle', '14 days', '1 hour of pay for additions; half pay for subtractions', 'Retail and food service with 500+ employees'],
        ['San Francisco', '14 days', '1–4 hours of pay depending on notice', 'Formula retail with 40+ locations'],
        ['Philadelphia', '14 days', '1 hour of pay for additions; half pay for subtractions', 'Retail, hospitality, food service with 250+ employees and 30+ locations'],
        ['Los Angeles', '14 days', '1 hour of pay; half pay for cut shifts', 'Retail with 300+ employees'],
      ],
      note: 'Summaries only; each ordinance has its own exemptions and employee-request exceptions. Check the city or state labor agency before relying on a figure.',
    },
  ],

  deepDiveSections: [
    {
      title: 'How 12-Hour Rotations Create Overtime Even at 42 Hours a Week',
      paragraphs: [
        'The FLSA counts overtime one workweek at a time (29 CFR 778.104). Averaging two weeks is not allowed, so a crew that works 36 hours and then 48 hours is owed 8 overtime hours for the second week even though it averaged 42. On a 2-2-3 or Pitman rotation that is 208 overtime hours a year per employee; on DuPont it is the same 16 hours per 28 days. Employers either budget for it, shorten shifts to 11.5 hours to land at 40.25 hours a week, or pay the 12th hour as a built-in premium.',
        'Fire and police departments have a different tool. Section 7(k) of the FLSA lets a public agency set a work period of 7 to 28 consecutive days and pay overtime only above 212 hours (fire protection) or 171 hours (law enforcement) in a 28-day period, pro-rated for shorter periods. A 12-hour rotation producing 168 hours per 28 days falls under both thresholds, which is why 7(k) is nearly universal in public safety. The planner\'s 7(k) option shows the hours above each threshold.',
        'California is the exception that catches many planners: Labor Code § 510 requires 1.5× after 8 hours in a day and 2× after 12, so a 12-hour shift is 8 regular hours plus 4 overtime hours every day unless the employer adopts an alternative workweek schedule by a two-thirds secret-ballot vote of the affected work unit (Labor Code § 511). Most California 12-hour plants run on an approved alternative workweek for exactly this reason.',
      ],
      bullets: [
        'Days and nights should rotate forward (days → evenings → nights) and slowly — NIOSH recommends no more than four consecutive 12-hour night shifts and at least two full days off after a night block.',
        'Hand-offs: 12-hour patterns need two shift changes a day instead of three, which halves hand-off errors in healthcare and process industries.',
        'Fatigue: the fourth consecutive 12-hour shift carries roughly a third higher injury risk than the first (NIOSH/Folkard), which is the argument for 2-2-3 over 4-on-4-off.',
      ],
    },
    {
      title: 'Building a Weekly Roster That Clears the Overtime Line',
      paragraphs: [
        'For a normal workweek the roster tab does the arithmetic a spreadsheet would: shift ranges become hours, hours over 40 become overtime at 1.5×, and the total is the week\'s wage bill. The useful information is in the On duty row and the OT column. A zero in the On duty row is an uncovered day; a number in the OT column is money that could be saved by moving a shift to someone under 40 hours, as long as the second person is qualified for it.',
        'To cover 24 hours a day, seven days a week with 8-hour shifts you need 168 ÷ 40 = 4.2 full-time positions per post before vacation, sick leave and training; most operations plan 4.5 to 5. With 12-hour shifts the same post needs four crews, which is the whole point of the rotation patterns on the other tab.',
      ],
      bullets: [
        'Wage cost is not labor cost: add 7.65% employer FICA, federal and state unemployment tax, workers\' compensation and benefits — typically 20–30% on top of wages.',
        'Shift differentials for evenings, nights and weekends count toward the regular rate for overtime (29 CFR 778.207), so overtime on a differential shift is 1.5× the higher rate.',
        'Fair-workweek cities require 14 days\' notice of the posted schedule and a premium for late changes; see the table above.',
      ],
    },
  ],

  faqs: [
    {
      question: 'What is the 2-2-3 (Panama) shift schedule?',
      answer:
        'A 14-day rotation of 12-hour shifts: 2 on, 2 off, 3 on, 2 off, 2 on, 3 off. Each crew works 7 of 14 days — 36 hours one week and 48 the next — for a 42-hour average. Four crews cover the clock: two on days, two on nights, usually swapping after one or more cycles. Its appeal is that nobody works more than three shifts in a row and every crew gets every other weekend off (a three-day one).',
    },
    {
      question: 'How does the DuPont schedule work?',
      answer:
        'A 28-day cycle, also 12-hour shifts, four crews: 4 nights on, 3 off, 3 days on, 1 off, 3 nights on, 3 off, 4 days on, then 7 consecutive days off. Each crew works 14 of 28 days (168 hours) and the weeks run 48, 36, 48, 36. The full week off every month is popular with staff; the four consecutive nights and the single day off mid-cycle are the complaints.',
    },
    {
      question: 'What is the difference between Pitman and 2-2-3?',
      answer:
        'The shift count is identical — 7 of 14 days, 42 hours a week on average, 36/48 by week — so pay and overtime are the same. Pitman is 2 on, 3 off, 2 on, 2 off, 3 on, 2 off, which lines the three-day block up with Friday–Sunday so each crew has a full long weekend off every other week. 2-2-3 puts the three-day block wherever the cycle starts.',
    },
    {
      question: 'Do rotating 12-hour shifts trigger overtime?',
      answer:
        'Under the FLSA, yes in the 48-hour weeks: 8 hours of overtime every other week on 2-2-3 and Pitman, 16 hours per 28-day cycle on DuPont, because overtime is figured per workweek and weeks cannot be averaged. Police and fire departments avoid it with a Section 7(k) 28-day work period (171 hours for police, 212 for fire). In California every 12-hour shift includes 4 hours of daily overtime unless an alternative workweek schedule has been adopted by employee vote.',
    },
    {
      question: 'What is the FLSA 7(k) exemption?',
      answer:
        'Section 7(k) lets public agencies employing law-enforcement and fire-protection staff use a work period of 7 to 28 days instead of a 7-day workweek. Overtime is owed only for hours above 212 (fire) or 171 (police) in a 28-day period, pro-rated for shorter periods — for example 86 hours for police on a 14-day period. It applies to public employers only; a private security firm or hospital cannot use it. See DOL Fact Sheet #8 and 29 CFR 553.230.',
    },
    {
      question: 'How many employees do I need for 24/7 coverage?',
      answer:
        'With 8-hour shifts, one post needs 168 ÷ 40 = 4.2 full-time employees before any leave, so plan on 4.5–5 per post. With 12-hour shifts you need four crews per post (each averaging 42 hours), which is what the rotation patterns provide. Multiply by the number of positions that must be staffed simultaneously, then add a relief factor of 10–20% for vacation, sick leave and training.',
    },
    {
      question: 'How do I enter shifts in the weekly roster?',
      answer:
        'Type a range in each day\'s cell: 9-5, 8:30-4:30, 12-8 or 4-12. If the end time is not later than the start, the planner assumes it runs into the afternoon or overnight (4-12 is noon to 8 PM for a 4 start of 4 AM? No — 4-12 is 4 PM to midnight, 8 hours; 22-6 is 10 PM to 6 AM). Use 24-hour times such as 22-6 for night shifts to avoid ambiguity. Leave a cell blank for a day off.',
    },
    {
      question: 'What is fair workweek or predictive scheduling?',
      answer:
        'Laws in Oregon and cities including New York, Chicago, Seattle, San Francisco, Philadelphia and Los Angeles that require covered retail, food-service and hospitality employers to post schedules about 14 days ahead, pay a premium (typically one hour of pay) for late changes, offer extra hours to existing part-timers before hiring, and give a rest period — usually 10 or 11 hours — between shifts. Penalties run from $10 to $200 per violation plus the premium pay.',
    },
    {
      question: 'Are rotating shifts bad for your health?',
      answer:
        'Night and rotating work is associated with sleep disorders, cardiovascular disease and metabolic problems, and the IARC classifies night-shift work as a probable carcinogen (Group 2A). The schedule design matters: forward rotation (days → evenings → nights), slow rotation, no more than four consecutive nights and at least 48 hours off after a night block reduce the harm. 2-2-3 and Pitman score better on these than DuPont\'s four-night runs.',
    },
  ],

  relatedTools: [
    { slug: 'shift-pay-calculator', title: 'Shift Pay Calculator', description: 'Pay for a rotation including night and weekend differentials', icon: 'CalendarClock' },
    { slug: 'time-card-calculator', title: 'Time Card Calculator', description: 'Total a crew member\'s actual punches for the week', icon: 'Clock' },
    { slug: 'overtime-calculator', title: 'Overtime Calculator', description: 'Overtime on 48-hour weeks and California daily rules', icon: 'Timer' },
    { slug: 'night-shift-differential-calculator', title: 'Night Shift Differential', description: 'Extra pay for the night crews', icon: 'Moon' },
    { slug: 'shift-hours-calculator', title: 'Shift Hours Calculator', description: 'Hours in 8, 10 and 12-hour shifts', icon: 'CalendarClock' },
    { slug: 'fte-calculator', title: 'FTE Calculator', description: 'How many full-time equivalents a coverage plan needs', icon: 'Users' },
  ],
  sources: [SRC.dolOvertime, SRC.dolFactSheet8, SRC.cfr778, SRC.dolFactSheet23],
} satisfies CalculatorSeoData;

export default seoData;
