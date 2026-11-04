# QuickBizCalc (`hr-business-tool`) — SEO, Product UX & Growth TODO List

> **Last Updated**: November 4, 2026
> **Baseline GSC Metrics**: 132,891 impressions · 122 clicks · 0.09% CTR · 19.6 avg position (Mobile pos 9.66 / Desktop pos 39.12)

---

## ✅ Completed in Audit & Phase 1 Implementation

- [x] **Unblock Googlebot JS & Image Assets in `robots.txt`** (`src/app/robots.ts`)
  - Removed `/_next/static/chunks/`, `/_next/static/media/`, and `/_next/image` from `disallow` so Googlebot WRS can hydrate dynamic calculators and index images.
- [x] **Fix Broken `BreadcrumbList` & `WebApplication` JSON-LD Schema** (`src/app/calculators/[slug]/page.tsx`, `src/components/calculators/CalculatorLayoutServer.tsx`)
  - Added `href: calc.path` to `breadcrumbs` so `WebAppJsonLd` outputs the canonical calculator URL (`/calculators/[slug]`) instead of the homepage URL.
- [x] **Fix `<title>` Tag Truncation (75–83 Chars) & Double `| QuickBizCalc` Suffixes** (`src/app/calculators/[slug]/page.tsx`, `src/app/blog/page.tsx`, `src/app/blog/[slug]/page.tsx`, `src/app/glossary/page.tsx`, `src/app/calculators/[slug]/embed/page.tsx`)
  - Used `{ absolute: title }` when `metaTitle` is >48 chars so `layout.tsx` doesn't append a redundant ` | QuickBizCalc` suffix.
- [x] **Unblock External `<iframe>` Calculator Embeds** (`next.config.ts`)
  - Allowed `Content-Security-Policy: frame-ancestors *` and removed `X-Frame-Options: SAMEORIGIN` on `/calculators/:slug/embed`.
- [x] **Fix Mobile Result Sheet Breaking Buttons & Recharts** (`src/components/calculators/MobileResultSheet.tsx`)
  - Replaced `display: none` + `dangerouslySetInnerHTML` cloning with native inline mobile rendering + a floating **"Live Result Ready — View Breakdown ↓"** quick-jump bar.
- [x] **Upgrade Flagship Calculators to Beat Competitors (Instant Live Calculation + Multi-Mode UX)**
  - [x] `src/components/calculators/HourlyPaycheckCalculator.tsx` (Instant live calculation on load, 1-tap wage/salary presets, visual paycheck allocation bar, 7-period conversion table, 0%-tax state comparison insight)
  - [x] `src/components/calculators/StatePaycheckCalculator.tsx` (Instant live calculation, state minimum wage preset pill, 7-period conversion table)
  - [x] `src/components/calculators/ProfitMarginCalculator.tsx` (3-way bi-directional tabs including Target Margin Reverse Pricing, batch unit quantity multiplier, What-If Price Sensitivity Table, fixed history state bug)
  - [x] `src/components/calculators/BusinessDayCalculator.tsx` (Dynamic multi-year 2025–2028+ US Federal Holiday generator with OPM observed rules, quick range & SLA presets, billable hours equivalent, instant live calculation)
  - [x] `src/components/calculators/WagesCalculator.tsx` (Pre-filled `$25/hr` default + live calculation on input change)
- [x] **Unify 2026 IRS Federal Tax Brackets & Standard Deductions (`$16,100` Single / `$32,200` MFJ / `$24,150` HOH)**
  - [x] `src/components/calculators/AfterTaxIncomeCalculator.tsx` (Fixed missing standard deduction subtraction + updated to 2026 brackets)
  - [x] `src/components/calculators/SalaryTaxCalculator.tsx` (Updated to 2026 brackets & standard deductions)
  - [x] `src/components/calculators/TaxRefundCalculator.tsx` (Updated to 2026 brackets & standard deductions)
- [x] **Upgrade Homepage Discovery & Index `/compare/jobs`** (`src/components/calculators/HubPage.tsx`, `src/app/compare/jobs/page.tsx`, `src/app/sitemap.ts`, `src/components/layout/Footer.tsx`)
  - Added "Most Popular" quick-launch bar above the fold, interactive category filter tabs, and indexed `/compare/jobs`.
- [x] **Persist Newsletter & Calculator Feedback APIs to Disk** (`src/app/api/newsletter/route.ts`, `src/app/api/feedback/route.ts`)
  - Saved entries to `data/newsletter-subscribers.jsonl` and `data/calculator-feedback.jsonl`.

---

## 🚀 Phase 2: Post-Deploy & Google Search Console Actions (Do Immediately After Deploy)

- [ ] **1. Deploy to Production (`quickbizcalc.com`)**
- [ ] **2. Request Indexing in Google Search Console (URL Inspection Tool)** for top pages:
  - [ ] `https://www.quickbizcalc.com/`
  - [ ] `https://www.quickbizcalc.com/calculators/hourly-paycheck-calculator`
  - [ ] `https://www.quickbizcalc.com/calculators/wages-calculator`
  - [ ] `https://www.quickbizcalc.com/calculators/business-day-calculator`
  - [ ] `https://www.quickbizcalc.com/calculators/profit-margin-calculator`
  - [ ] `https://www.quickbizcalc.com/calculators/time-card-calculator-with-lunch`
  - [ ] `https://www.quickbizcalc.com/compare/jobs`
- [ ] **3. Request `robots.txt` Recrawl in GSC** (`Settings → robots.txt → Request a recrawl`) to clear old `/_next/static/chunks/` blocks.

---

## 📈 Phase 3: Expand State Hourly Paycheck Calculators (Highest-ROI Organic Traffic Lever)

Currently, only 5 states (`CA`, `TX`, `FL`, `NY`, `IL`) are published in `src/lib/payroll/state-pages.ts` and `src/lib/payroll/withholding-2026.ts`. State-level paycheck keywords have much lower competition than national terms.

- [ ] **Batch A — Add No-Income-Tax States (100% Exact Federal + FICA Math)**:
  - [ ] **Washington (`WA`)** — `washington-hourly-paycheck-calculator` ($16.66+ min wage, WA Cares / PFML notes)
  - [ ] **Tennessee (`TN`)** — `tennessee-hourly-paycheck-calculator` ($7.25 min wage, 0% state income tax)
  - [ ] **Nevada (`NV`)** — `nevada-hourly-paycheck-calculator` ($12.00 min wage, 0% state income tax, daily OT rule for <1.5× min wage)
- [ ] **Batch B — Add High-Population Flat-Tax States (Deterministic 2026 Withholding)**:
  - [ ] **Pennsylvania (`PA`)** — `pennsylvania-hourly-paycheck-calculator` (3.07% flat state tax + PA UC employee withholding)
  - [ ] **North Carolina (`NC`)** — `north-carolina-hourly-paycheck-calculator` (4.25% flat tax in 2026, NC-4 standard deduction)
  - [ ] **Georgia (`GA`)** — `georgia-hourly-paycheck-calculator` (5.19%–5.39% flat tax rate, G-4 standard deduction)
  - [ ] **Michigan (`MI`)** — `michigan-hourly-paycheck-calculator` (4.25% flat tax, MI-W4 personal exemption)
  - [ ] **Indiana (`IN`)** — `indiana-hourly-paycheck-calculator` (3.00% flat state tax in 2026, WH-4 exemptions)
  - [ ] **Arizona (`AZ`)** — `arizona-hourly-paycheck-calculator` (2.5% flat state tax, A-4 withholding election percentages)
  - [ ] **Colorado (`CO`)** — `colorado-hourly-paycheck-calculator` (4.40% flat state tax, CO overtime rules)
- [ ] **For Each New State**:
  1. Add state code & withholding formula in `src/lib/payroll/withholding-2026.ts`
  2. Add state metadata, minimum wage, overtime rule, and FAQs in `src/lib/payroll/state-pages.ts`
  3. Create `src/lib/seo-data/[state]-hourly-paycheck-calculator.ts` calling `buildStatePaycheckSeo(code)`
  4. Register the calculator entry in `src/lib/calculator-meta.ts` (`status: 'published'`) and `src/app/calculators/[slug]/page.tsx` + `embed/page.tsx`

---

## ⚡ Phase 4: Convert Next 8 High-Impression Calculators to Instant Live Calculation

Remove the "blank state until Calculate click" friction and `setResult(null)` on input change across the next highest-traffic tools:

- [ ] `src/components/calculators/TimeCardLunchCalculator.tsx` (8,625 GSC impressions — pre-fill a typical Mon–Fri 8:00 AM–4:30 PM schedule with 30m lunch break so totals display immediately)
- [ ] `src/components/calculators/TimeCardCalculator.tsx` (6,844 GSC impressions — pre-fill default weekly hours & add print-friendly timesheet header with employee name & pay period dates like Redcort)
- [ ] `src/components/calculators/SalesCommissionCalculator.tsx` (6,320 GSC impressions — pre-fill `$50,000` sales at `8%` commission rate + live updates across Flat, Tiered, and Quota modes)
- [ ] `src/components/calculators/EmployeeTurnoverCalculator.tsx` (3,412 GSC impressions — pre-fill 50 employees, 6 departures, `$65,000` avg salary + live calculation)
- [ ] `src/components/calculators/ROICalculator.tsx` (2,950 GSC impressions — pre-fill `$10,000` investment, `$14,500` return, `2` years + live calculation)
- [ ] `src/components/calculators/DiscountCalculator.tsx` (Fix stale React state in `saveEntry` + live calculation)
- [ ] `src/components/calculators/MarkupCalculator.tsx` (Fix stale React state in `saveEntry` + live calculation)
- [ ] `src/components/calculators/OvertimeCalculator.tsx` (Pre-fill `$22/hr`, `40` reg hrs, `8` OT hrs + live calculation)

---

## 📝 Phase 5: Expand Thin SEO Content on High-CPC B2B Calculators (Target: 1,500+ Words Each)

Upgrade the below-the-fold guide, industry benchmarks table, worked examples, and FAQs in `src/lib/seo-data/`:

- [ ] `src/lib/seo-data/billable-hours-calculator.ts` (Currently 552 words → Add consultant utilization rate benchmarks, agency realization rates, and 6-minute/15-minute increment billing table)
- [ ] `src/lib/seo-data/fica-tax-calculator.ts` (Currently 591 words → Add 2026 `$184,500` Social Security cap table, Additional 0.9% Medicare surtax thresholds by filing status, and W-2 vs. 1099 SECA comparison)
- [ ] `src/lib/seo-data/severance-pay-calculator.ts` (Currently 639 words → Add 1-week vs. 2-weeks per year of service benchmarks by job level, WARN Act 60-day notice rules, and 22% supplemental tax withholding examples)
- [ ] `src/lib/seo-data/revenue-per-employee-calculator.ts` (Currently 650 words → Add 2026 SaaS, retail, manufacturing, and professional services RPE benchmark tables)
- [ ] `src/lib/seo-data/salary-to-hourly-calculator.ts` (Currently 666 words → Add quick reference conversion table from `$30,000/yr` to `$150,000/yr` at 2,080 hours/year)

---

## 🧹 Phase 6: Clean Up & Selectively Publish Best Draft Calculators

There are currently **128 calculators** in `status: 'draft'` in `src/lib/calculator-meta.ts`, and **146 `.tsx` files** contain malformed string-quoted Tailwind classes (`className="'bg-emerald-500/10 ...'"`) from an earlier batch script.

- [ ] **1. Run Automated Cleanup Script** on `src/components/calculators/*.tsx` to strip extra inner single quotes from `className="'...'"` across all 146 draft calculator components.
- [ ] **2. Hand-Audit & Publish Top 10 High-Search-Volume Draft Calculators** (only after verifying unique math + writing 1,200+ word `seo-data` files):
  - [ ] `break-even-calculator` (`BreakEvenCalculator.tsx`)
  - [ ] `employer-payroll-tax-calculator` (`EmployerPayrollTaxCalculator.tsx` — FUTA + SUTA + Employer FICA)
  - [ ] `pto-accrual-calculator` (`PtoCalculator.tsx`)
  - [ ] `1099-vs-w2-calculator` (`ContractorVsEmployeeCalculator.tsx`)
  - [ ] `burn-rate-calculator` (`BurnRateCalculator.tsx` — Startup runway & monthly burn)
  - [ ] `customer-acquisition-cost-calculator` (`CacCalculator.tsx`)
  - [ ] `ltv-calculator` (`CustomerLifetimeValueCalculator.tsx`)
  - [ ] `salary-inflation-calculator` (`InflationCalculator.tsx`)
  - [ ] `shift-differential-calculator` (`ShiftDifferentialCalculator.tsx`)
  - [ ] `annual-income-calculator` (`AnnualIncomeCalculator.tsx`)

