// ---------------------------------------------------------------------------
// 2027 paycheck withholding figures
// ---------------------------------------------------------------------------
// Federal figures are final and come from primary sources:
// - Brackets and standard deductions: IRS Rev. Proc. 2026-35 (Nov 5, 2026),
//   section 3.01 Tables 1–3 and section 3.15.
// - Withholding method: the IRS early-release draft of Publication 15-T for use
//   in 2027 (Nov 9, 2026). Its annual percentage-method tables (the workbook
//   attached to the draft) are these brackets shifted by the standard deduction
//   less the Worksheet 1A line 1g amount ($8,600, or $12,900 married), which is
//   what engine.ts computes. 2027.test.ts replays those tables row by row.
// - Social Security wage base: $192,300, SSA notice "Cost-of-Living Increase and
//   Other Determinations for 2027" (Federal Register document 2026-21796,
//   Oct 26, 2026).
// - Form W-4 Step 3: the June 2026 draft of the 2027 form prints "$X,XXX" for the
//   child amount. $2,300 is the 2027 child tax credit (Rev. Proc. 2026-35,
//   section 3.05), the figure the form has always carried. Other dependents: $500.
//
// State figures: no state had published 2027 withholding tables when this file
// was written (Nov 17, 2026), so every state runs on its 2026 rule. When a state
// publishes, write its 2027 rule here, put it in `stateRules` and add the code to
// `statesPublished`. `docs/tax-year-rollover.md` has the full checklist.

import { scheduleFromBrackets, type FederalTables, type TaxYearDefinition } from './engine';
import { MORE_STATE_RULES_2026, STATE_RULES_2026 } from './2026';

const FEDERAL_RATES = [0.1, 0.12, 0.22, 0.24, 0.32, 0.35, 0.37];

export const FEDERAL_2027: FederalTables = {
  schedules: {
    single: scheduleFromBrackets([12800, 52025, 109125, 208325, 264550, 661375], FEDERAL_RATES),
    married: scheduleFromBrackets([25600, 104050, 218250, 416650, 529100, 793650], FEDERAL_RATES),
    hoh: scheduleFromBrackets([18250, 69650, 109100, 208300, 264550, 661350], FEDERAL_RATES),
  },
  standardDeduction: { single: 16600, married: 33200, hoh: 24925 },
  socialSecurityRate: 0.062,
  socialSecurityWageBase: 192300,
  medicareRate: 0.0145,
  additionalMedicareRate: 0.009,
  additionalMedicareThreshold: 200000,
  w4ChildCredit: 2300,
  w4OtherDependentCredit: 500,
};

export const YEAR_2027: TaxYearDefinition = {
  year: 2027,
  federal: FEDERAL_2027,
  // Carried over from 2026. Replace a state's entry with its 2027 rule when the state publishes one.
  stateRules: { ...STATE_RULES_2026 },
  statesPublished: [],
  moreStateRules: { ...MORE_STATE_RULES_2026 },
  moreStatesPublished: [],
  stateRulesFrom: 2026,
  federalBasis: 'IRS Rev. Proc. 2026-35, the IRS draft of the 2027 Publication 15-T and the SSA 2027 wage base of $192,300',
  federalSources: [
    { label: 'IRS Rev. Proc. 2026-35', url: 'https://www.irs.gov/pub/irs-drop/rp-26-35.pdf' },
    { label: 'IRS draft Publication 15-T for 2027', url: 'https://www.irs.gov/pub/irs-dft/p15t--dft.pdf' },
    { label: 'SSA determinations for 2027', url: 'https://www.federalregister.gov/d/2026-21796' },
  ],
  federalPending: [
    'The 2027 Publication 15-T is an IRS draft dated November 9, 2026, not the final edition.',
    'The draft 2027 Form W-4 leaves the Step 3 child amount blank; $2,300, the 2027 child tax credit, is used.',
  ],
  asOf: '2026-11-17',
};
