---
title: "Worked Example: Time Card Calculation With Lunch Break and Overtime"
date: "2026-09-08"
excerpt: "Step-by-step weekly time card calculation with mandatory lunch deduction, daily hours, and weekly overtime. Use the QuickBizCalc time card calculator with lunch."
author: "Sarah Jenkins, CPA"
category: "Time & Attendance"
---

Calculating weekly pay from clock-in/clock-out times requires careful handling of lunch breaks, overtime thresholds, and decimal conversion for payroll entry. This walkthrough uses the [time card calculator with lunch](/calculators/time-card-calculator-with-lunch) to compute a real weekly timesheet.

## The Scenario

Maya is an hourly employee earning **$16.00/hour** at a call center. She worked the following schedule last week:

| Day | Clock In | Lunch Start | Lunch End | Clock Out |
|---|---|---|---|---|
| Monday | 8:00 AM | 12:00 PM | 12:30 PM | 5:00 PM |
| Tuesday | 8:00 AM | 12:00 PM | 12:30 PM | 5:00 PM |
| Wednesday | 8:00 AM | 12:00 PM | 12:30 PM | 6:00 PM |
| Thursday | 8:00 AM | 12:00 PM | 12:30 PM | 5:00 PM |
| Friday | 8:00 AM | 12:00 PM | 12:30 PM | 5:00 PM |

Maya is paid weekly. Let's calculate her gross pay including any overtime.

## Step 1: Calculate Daily Worked Hours

For each day, subtract the lunch break from the total time at work:

### Monday
- Total time at work: 8:00 AM to 5:00 PM = 9 hours
- Lunch break: 12:00 PM to 12:30 PM = 0.5 hours
- **Worked hours: 9 − 0.5 = 8.5 hours**

### Tuesday (same as Monday)
- **Worked hours: 8.5 hours**

### Wednesday (clocked out at 6:00 PM)
- Total time at work: 8:00 AM to 6:00 PM = 10 hours
- Lunch break: 0.5 hours
- **Worked hours: 10 − 0.5 = 9.5 hours**

### Thursday & Friday (same as Monday)
- **Worked hours: 8.5 hours each**

## Step 2: Calculate Total Weekly Hours

> 8.5 + 8.5 + 9.5 + 8.5 + 8.5 = **43.0 hours total**

## Step 3: Identify Overtime Hours

Under federal FLSA, hours over 40 in a workweek are paid at 1.5x:

> Total hours: 43.0
> Regular hours: 40
> **Overtime hours: 3.0**

## Step 4: Calculate Regular Pay

> 40 hours × $16.00 = **$640.00 regular pay**

## Step 5: Calculate Overtime Pay

> Overtime rate: $16.00 × 1.5 = $24.00/hour
> 3 overtime hours × $24.00 = **$72.00 overtime pay**

## Step 6: Calculate Total Gross Pay

> $640.00 (regular) + $72.00 (overtime) = **$712.00 total weekly gross**

## Step 7: Convert to Decimal for Payroll Entry

Payroll systems require decimal hours, not HH:MM format. Convert each day:

| Day | HH:MM | Decimal Hours |
|---|---|---|
| Monday | 8:30 | 8.50 |
| Tuesday | 8:30 | 8.50 |
| Wednesday | 9:30 | 9.50 |
| Thursday | 8:30 | 8.50 |
| Friday | 8:30 | 8.50 |
| **Total** | **43:00** | **43.00** |

The decimal conversion: divide minutes by 60. 30 minutes = 0.5 hours.

## Step 8: Verify With the Calculator

Enter Maya's timesheet into the [time card calculator with lunch](/calculators/time-card-calculator-with-lunch):
- Hourly rate: $16.00
- Monday: 8:00 AM to 5:00 PM, lunch 12:00-12:30
- Tuesday: 8:00 AM to 5:00 PM, lunch 12:00-12:30
- Wednesday: 8:00 AM to 6:00 PM, lunch 12:00-12:30
- Thursday: 8:00 AM to 5:00 PM, lunch 12:00-12:30
- Friday: 8:00 AM to 5:00 PM, lunch 12:00-12:30

You should see:
- Total hours: 43.00
- Regular hours: 40.00 @ $16.00 = $640.00
- Overtime hours: 3.00 @ $24.00 = $72.00
- **Total gross: $712.00**

## Step 9: Calculate Annual Projection

If Maya works this schedule consistently (43 hours/week, 50 weeks/year):

> Weekly gross: $712.00
> Annual gross: $712.00 × 50 = **$35,600/year**

This is the gross; for take-home, multiply by approximately 0.75 (after federal, state, FICA):

> Annual net: $35,600 × 0.75 = **$26,700/year take-home**

## Common Time Card Mistakes

1. **Forgetting to deduct lunch** — many employees accidentally include lunch in their hours
2. **Mixing HH:MM and decimal** — payroll systems require decimal; some calculators show HH:MM
3. **Rounding incorrectly** — 8:07 AM is 8.117 decimal hours, not 8.07 (common mistake)
4. **Not tracking weekly overtime** — daily hours can be under 8 but weekly hours can exceed 40
5. **Confusing clock-in time with start-time** — if you arrive at 7:55 AM but start at 8:00 AM, payroll records 8:00 AM

## Time Card Decimal Conversion Reference

| Minutes | Decimal |
|---|---|
| :00 | 0.00 |
| :15 | 0.25 |
| :30 | 0.50 |
| :45 | 0.75 |
| :06 | 0.10 |
| :12 | 0.20 |
| :18 | 0.30 |
| :24 | 0.40 |
| :36 | 0.60 |
| :42 | 0.70 |
| :48 | 0.80 |
| :54 | 0.90 |

The formula: Decimal Hours = Hours + (Minutes / 60)

## Key Takeaways

- **Always deduct unpaid lunch breaks** — even a 30-minute break shifts a 9-hour day to 8.5 worked hours
- **Track weekly overtime threshold** — daily hours under 8 can still trigger weekly OT if total exceeds 40
- **Payroll systems need decimal hours** — convert before submitting timesheets
- **Verify your math** — small errors compound across thousands of payroll entries

## Related Calculators

- [Time Card Calculator with Lunch](/calculators/time-card-calculator-with-lunch) — weekly timesheet with lunch
- [Time Card Calculator](/calculators/time-card-calculator) — basic weekly calculation
- [Time to Decimal Calculator](/calculators/time-to-decimal-calculator) — convert HH:MM to decimal
- [Overtime Calculator](/calculators/overtime-calculator) — overtime-only calculation
- [Hourly Paycheck Calculator](/calculators/hourly-paycheck-calculator) — full paycheck from timesheet

