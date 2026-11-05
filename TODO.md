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

## ✅ Phase 2: Post-Deploy & Google Search Console Actions (Completed)

- [x] **1. Deploy to Production (`quickbizcalc.com`)**
- [x] **2. Request Indexing in Google Search Console (URL Inspection Tool)** for top pages:
  - [x] `https://www.quickbizcalc.com/`
  - [x] `https://www.quickbizcalc.com/calculators/hourly-paycheck-calculator`
  - [x] `https://www.quickbizcalc.com/calculators/wages-calculator`
  - [x] `https://www.quickbizcalc.com/calculators/business-day-calculator`
  - [x] `https://www.quickbizcalc.com/calculators/profit-margin-calculator`
  - [x] `https://www.quickbizcalc.com/calculators/time-card-calculator-with-lunch`
  - [x] `https://www.quickbizcalc.com/compare/jobs`
- [x] **3. Request `robots.txt` Recrawl in GSC** (`Settings → robots.txt → Request a recrawl`) to clear old `/_next/static/chunks/` blocks.

---

## ✅ Phase 3: Expand State Hourly Paycheck Calculators (Completed — 15 Total States Live)

Expanded from 5 states (`CA`, `TX`, `FL`, `NY`, `IL`) to **15 states** in `src/lib/payroll/state-pages.ts`, `src/lib/payroll/withholding-2026.ts`, `src/lib/calculator-meta.ts`, `src/lib/seo-data/`, and `src/app/calculators/[slug]/page.tsx` (+ `embed/page.tsx`):

- [x] **Batch A — Added No-Income-Tax States (100% Exact Federal + FICA + State Payroll Programs)**:
  - [x] **Washington (`WA`)** — `washington-hourly-paycheck-calculator` ($17.13 min wage, 0% state income tax, WA PFML 0.57% + WA Cares 0.58%)
  - [x] **Tennessee (`TN`)** — `tennessee-hourly-paycheck-calculator` ($7.25 min wage, 0% state income tax)
  - [x] **Nevada (`NV`)** — `nevada-hourly-paycheck-calculator` ($12.00 min wage, 0% state income tax, daily OT rule for <$18/hr)
- [x] **Batch B — Added High-Population Flat-Tax States (Deterministic 2026 Withholding)**:
  - [x] **Pennsylvania (`PA`)** — `pennsylvania-hourly-paycheck-calculator` (3.07% flat state tax + 0.07% PA UC employee withholding)
  - [x] **North Carolina (`NC`)** — `north-carolina-hourly-paycheck-calculator` (4.25% flat tax in 2026, $12,750 Single / $25,500 MFJ standard deduction)
  - [x] **Georgia (`GA`)** — `georgia-hourly-paycheck-calculator` (5.19% flat tax rate in 2026, $12,000 Single / $24,000 MFJ G-4 standard deduction)
  - [x] **Michigan (`MI`)** — `michigan-hourly-paycheck-calculator` (4.25% flat tax, $13.73 min wage in 2026)
  - [x] **Indiana (`IN`)** — `indiana-hourly-paycheck-calculator` (2.95% flat state tax in 2026)
  - [x] **Arizona (`AZ`)** — `arizona-hourly-paycheck-calculator` (2.50% flat state tax, $15.15 min wage in 2026)
  - [x] **Colorado (`CO`)** — `colorado-hourly-paycheck-calculator` (4.40% flat state tax + 0.45% CO FAMLI, $15.16 min wage, 12-hour daily OT rule)
- [x] **For Each New State**:
  1. Added state code & withholding formula in `src/lib/payroll/withholding-2026.ts`
  2. Added state metadata, minimum wage, overtime rule, and FAQs in `src/lib/payroll/state-pages.ts`
  3. Created `src/lib/seo-data/[state]-hourly-paycheck-calculator.ts` calling `buildStatePaycheckSeo(code)`
  4. Registered the calculator entry in `src/lib/calculator-meta.ts` (`status: 'published'`) and `src/app/calculators/[slug]/page.tsx` + `embed/page.tsx`

---

## ✅ Phase 4: Convert Next 8 High-Impression Calculators to Instant Live Calculation (Completed)

Removed "blank state until Calculate click" friction, fixed stale React state bugs in `saveEntry`, and added live calculation on load across all 8 high-impression calculators:

- [x] `src/components/calculators/TimeCardLunchCalculator.tsx` (8,625 GSC impressions — pre-filled Mon–Fri 8:00 AM–4:30 PM schedule with 30m lunch break & `$22/hr` rate + employee name / pay period header + instant live calculation)
- [x] `src/components/calculators/TimeCardCalculator.tsx` (6,844 GSC impressions — pre-filled 40h weekly schedule at `$25/hr` + employee name / pay period header + Copy Summary & Print Timesheet buttons + instant live calculation)
- [x] `src/components/calculators/SalesCommissionCalculator.tsx` (6,320 GSC impressions — pre-filled `$50,000` sales at `8%` commission rate in Simple mode, `$180,000` in Tiered mode, and `$550,000` on `$500,000` quota in Quota mode)
- [x] `src/components/calculators/EmployeeTurnoverCalculator.tsx` (3,412 GSC impressions — pre-filled 50 beginning / 54 ending headcount, 6 separations, `$65,000` avg salary + instant live updates)
- [x] `src/components/calculators/ROICalculator.tsx` (2,950 GSC impressions — added `useEffect` so `$10,000` → `$15,000` over `5` years calculates immediately on load and updates live)
- [x] `src/components/calculators/DiscountCalculator.tsx` (Pre-filled `$120` at `25%` off + fixed stale React state in `saveEntry` + instant live calculation)
- [x] `src/components/calculators/MarkupCalculator.tsx` (Pre-filled `$50` cost at `40%` markup + fixed stale React state in `saveEntry` + instant live calculation)
- [x] `src/components/calculators/OvertimeCalculator.tsx` (Pre-filled `$22/hr`, `40` reg hrs, `8` OT hrs + fixed `useMemo` side-effect anti-pattern + instant live calculation)

---

## ✅ Phase 5: Expand Thin SEO Content on High-CPC B2B Calculators (Completed — 1,500+ Words & Benchmark Tables Each)

Added semantic HTML `benchmarkTables` and `deepDiveSections` support to `src/components/calculators/CalculatorLayoutServer.tsx` and `src/app/calculators/[slug]/page.tsx`, and upgraded all 5 B2B SEO data modules:

- [x] `src/lib/seo-data/billable-hours-calculator.ts` (Added 6-minute `0.1 hr` vs. 15-minute `0.25 hr` legal/consulting billing increment table, 2026 utilization & realization benchmarks by profession, and 3 deep-dive sections)
- [x] `src/lib/seo-data/fica-tax-calculator.ts` (Added 2026 `$184,500` Social Security wage cap table, W-2 vs. 1099 SECA tax liability table from `$50k` to `$400k`, Additional 0.9% Medicare surtax rules, and excess SS credit guide)
- [x] `src/lib/seo-data/severance-pay-calculator.ts` (Added 2026 severance multiplier benchmarks by job level, Gross vs. Net lump-sum severance payout table after 22% supplemental tax, WARN Act / Mini-WARN / OWBPA 21-day & 45-day rules)
- [x] `src/lib/seo-data/revenue-per-employee-calculator.ts` (Added 2026 RPE percentile benchmarks across 11 industries, B2B SaaS ARR per FTE table from Seed to IPO, and Gross Profit per Employee / FTE counting guide)
- [x] `src/lib/seo-data/salary-converter.ts` & `src/lib/seo-data/salary-to-hourly-calculator.ts` (Added `$30,000`–`$150,000` 7-period conversion table, `$15/hr`–`$60/hr` full-time vs. part-time table, 2× mental math shortcut, and bi-weekly vs. semi-monthly guide)

---

## ✅ Phase 6: Clean Up & Selectively Publish Best Draft Calculators (Completed — 70 Published Calculators Live)

Cleaned up systematic batch-generator bugs across all calculator `.tsx` components and selectively audited, upgraded, wrote deep 2026 SEO data + benchmark tables for, and published the **Top 10 High-Search-Volume Draft Calculators**:

- [x] **1. Automated Codebase-Wide Component Cleanup (`src/components/calculators/*.tsx`)**:
  - [x] Stripped malformed inner single quotes from `className="'bg-emerald-500/10 ...'"` across **146 `.tsx` files**.
  - [x] Fixed missing `$` in JSX template literals (`{`{expr}`}` → `{`${expr}`}`) across **99 `.tsx` files**.
  - [x] Replaced broken non-numeric hint strings in `useState('Health, 401k, PTO')` with valid numeric defaults from `handleTryExample` and enabled instant live calculation (`useState(true)`) across **183 `.tsx` files**.
- [x] **2. Hand-Audited, Upgraded & Published Top 10 High-Search-Volume Draft Calculators (`status: 'published'`)**:
  - [x] `employee-cost-calculator` (`EmployeeCostCalculator.tsx` + `src/lib/seo-data/employee-cost-calculator.ts` — 2026 loaded employee burden breakdown & role multipliers)
  - [x] `fte-calculator` (`FTECalculator.tsx` + `src/lib/seo-data/fte-calculator.ts` — 40-hour Budgeting FTE vs. 30-hour IRS ACA 50-FTE mandate calculator & tables)
  - [x] `burn-rate-calculator` (`BurnRateCalculator.tsx` + `src/lib/seo-data/burn-rate-calculator.ts` — upgraded with Cash Balance & Cash Runway in months + Bessemer/Craft Burn Multiple tables)
  - [x] `customer-acquisition-cost-calculator` (`CustomerAcquisitionCostCalculator.tsx` + `src/lib/seo-data/customer-acquisition-cost-calculator.ts` — Blended vs. Paid CAC + 2026 CAC payback benchmarks)
  - [x] `customer-lifetime-value-calculator` (`CustomerLifetimeValueCalculator.tsx` + `src/lib/seo-data/customer-lifetime-value-calculator.ts` — Gross-margin CLV, churn sensitivity table, and LTV:CAC matrix)
  - [x] `freelance-hourly-rate-calculator` (`FreelanceHourlyRateCalculator.tsx` + `src/lib/seo-data/freelance-hourly-rate-calculator.ts` — W-2 to Freelance Hourly & Day Rate conversion after 15.3% SECA tax & 1,200 billable hours)
  - [x] `upwork-fee-calculator` (`UpworkFeeCalculator.tsx` + `src/lib/seo-data/upwork-fee-calculator.ts` — upgraded with 10%/5%/15%/0% fee presets, withdrawal methods, and Reverse Client Bid calculator)
  - [x] `sales-tax-calculator` (`SalesTaxCalculator.tsx` + `src/lib/seo-data/sales-tax-calculator.ts` — upgraded with Forward + Reverse Sales Tax extraction tabs, US state presets, and 2026 state rate table)
  - [x] `ebitda-margin-calculator` (`EbitdaMarginCalculator.tsx` + `src/lib/seo-data/ebitda-margin-calculator.ts` — operational EBITDA margin & 2026 EV/EBITDA buyout multiples by industry)
  - [x] `churn-rate-calculator` (`ChurnRateCalculator.tsx` + `src/lib/seo-data/churn-rate-calculator.ts` — Customer Logo Churn vs. Gross MRR Revenue Churn + compound annual churn conversion table)
