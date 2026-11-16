# Tax-year rollover

How the paycheck engine holds more than one tax year, what the 2027 preview rests on today, and what to do as
the remaining 2027 figures are published. Written November 17, 2026.

## 1. How the years work

| File | What it holds |
|---|---|
| `src/lib/payroll/withholding/engine.ts` | The math that does not change: bracket walk, Form W-4 Steps 2 to 4, gross to net. No tax figures. |
| `src/lib/payroll/withholding/2026.ts` | 2026 federal figures and the 2026 rule of each of the 30 states. |
| `src/lib/payroll/withholding/2027.ts` | 2027 federal figures. Every state still points at its 2026 rule. |
| `src/lib/payroll/withholding/index.ts` | The switch: `TAX_YEAR`, `SELECTABLE_TAX_YEARS`, `calculatePaycheck()`. |

Two settings in `index.ts` control what visitors see:

- **`TAX_YEAR`** (now `2026`) is the year the site is written for. Every page title, article, salary page and
  default calculation uses it.
- **`SELECTABLE_TAX_YEARS`** (now `[2026, 2027]`) are the years offered in the "Tax year" switch on the hourly
  paycheck calculator, the payroll calculator and the 30 state paycheck pages. A year later than `TAX_YEAR` is
  labeled "preview". A share link carries it as `?year=2027`.

To hide the 2027 preview, set `SELECTABLE_TAX_YEARS` to `[2026]`. The switch then disappears and nothing else
changes.

A preview result always shows a note saying which figures are final, which come from a draft and which are
carried over from the year before. The same note is printed on the pay stub and, on the hourly and payroll
calculators, in the copied summary. The wording is generated from the year file, so it stays correct as you
update the file.

Pages that stay on `TAX_YEAR` and have no switch: the salary pages, bulk payroll, the labor cost calculator, and
all article content.

## 2. What the 2027 preview rests on today

| Figure | 2027 value | Source | Status |
|---|---|---|---|
| Federal brackets and standard deduction | $16,600 single, $33,200 married, $24,925 head of household | IRS Rev. Proc. 2026-35, Nov 5, 2026 | Final |
| Federal withholding method | Same method as 2026 with the new brackets | IRS early-release draft of Publication 15-T for 2027, Nov 9, 2026 | Draft |
| Social Security wage base | $192,300 | SSA notice, Federal Register document 2026-21796 | Final |
| Form W-4 Step 3 child amount | $2,300 | The 2027 child tax credit in Rev. Proc. 2026-35. The draft 2027 form prints "$X,XXX". | Not confirmed on the form |
| State income tax, disability and paid-leave lines | 2026 rules | No state had published 2027 withholding figures on Nov 17, 2026 | Carried over |
| Employer side: FUTA credit reduction, state unemployment rates and wage bases, paid-leave employer shares | 2026 figures | Same reason | Carried over |

The draft Publication 15-T tables were checked row by row: `2027.test.ts` holds the tables from the workbook
attached to the IRS draft and replays Worksheet 1A against the engine for every filing status from $0 to
$900,000. They agree to the cent.

## 3. As 2027 figures are published

Do each item when its source appears. After any change run `npm test`.

1. **Final Publication 15-T for 2027** (the IRS usually posts it in December). Compare its annual Percentage
   Method tables with the rows in `2027.test.ts`. If they match, delete the "draft" sentence from
   `federalPending` in `2027.ts`, change `federalBasis` to say "the 2027 Publication 15-T", and point the source
   link at `https://www.irs.gov/publications/p15t`. If a row differs, fix `FEDERAL_2027` first.
2. **Final 2027 Form W-4.** Read the Step 3 child amount. If it is $2,300, delete the second sentence from
   `federalPending`. If not, change `w4ChildCredit`.
3. **Each state, as it publishes.** In `2027.ts` write the state's 2027 rule (copy its 2026 function from
   `2026.ts` and change the figures), put it in `stateRules`, and add the state code to `statesPublished`. Add a
   hand-computed test for it in `2027.test.ts`. The tests refuse a state that is listed as published but still
   runs the 2026 rule object, and the note under the result stops saying "2026 rules" for that state on its own.
   A state whose 2027 method is identical to 2026 still gets its own entry and a test, so the claim is checked.
4. **`asOf`** in `2027.ts`: set it to the date you last checked what is unpublished. It is printed in the note.
5. **Employer side.** `employer-cost-2026.ts` holds 2026 state unemployment rates, wage bases, paid-leave employer
   shares and the FUTA credit reduction. Only the Social Security match follows the selected year. When the 2027
   figures are out, add them there keyed by year (it is one table today) and update the note in
   `EmployerCostPanel.tsx`.

When `federalPending` is empty and every state is in `statesPublished`, set `stateRulesFrom` to `2027`. The
preview note then disappears by itself.

## 4. Moving the site to 2027

Changing `TAX_YEAR` to `2027` is one line, and the tests will not let it happen while `federalPending` still has
entries. The line is the small part. The site states 2026 facts in several hundred places, and each must be
true for 2027 before the year printed next to it changes:

- **State pages**: `state-pages.ts` and `state-details.ts` hold hand-written 2026 FAQs, minimum wages, local
  taxes and "what changed in 2026" bullets for 30 states. `state-details.ts` imports state rates from
  `withholding/2026`; point each import at the 2027 figure as the state is updated.
- **Registry titles and descriptions** that print the year, and the SEO files of the Payroll & Taxes category.
- **Standalone tax calculators** that carry their own copy of the 2026 figures. Search
  `src/components/calculators` for `16100`, `32200` and `184500`: today that finds `FederalTaxCalculator`,
  `Calculator1099`, `TaxRefundCalculator`, `TaxBracketCalculator`, `W2Calculator`, `FicaTaxCalculator`,
  `SelfEmploymentTaxCalculator`, `SocialSecurityEstimator` and `ContractorVsEmployeeCalculator`.
  `StateTaxCalculator` has its own state rate table as well.
- **Salary pages** (`salary-pages.ts`), which generate their numbers from the engine but have year wording.
- **Blog posts** that quote 2026 figures: add an `updated:` date when one is revised.
- **`lastReviewed`** on the 32 engine-backed pages, once their 2027 numbers are verified.

Suggested order for January: keep `TAX_YEAR` at 2026 with the 2027 preview on while states publish; update
state content as each state's figures arrive; switch `TAX_YEAR` when the federal items are final and the
largest states are done; keep `2026` in `SELECTABLE_TAX_YEARS` through April so people doing 2026 taxes can
still see their 2026 paycheck.

## 5. Adding 2028 later

Create `withholding/2028.ts` on the pattern of `2027.ts` (federal figures from the new revenue procedure, state
rules carried over from 2027), register it in `TAX_YEARS` in `index.ts`, add `2028.test.ts` with figures typed
from the publications, and add `2028` to `SELECTABLE_TAX_YEARS` when you want the preview shown.
