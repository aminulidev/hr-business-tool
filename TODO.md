# QuickBizCalc (`hr-business-tool`) — SEO, Product UX & Growth TODO List

> **Last Updated**: November 5, 2026
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
  - [x] **Michigan (`MI`)** — `michigan-hourly-paycheck-calculator` (4.25% flat tax, $12.48 min wage in 2026)
  - [x] **Indiana (`IN`)** — `indiana-hourly-paycheck-calculator` (2.95% flat state tax in 2026)
  - [x] **Arizona (`AZ`)** — `arizona-hourly-paycheck-calculator` (2.50% flat state tax, $15.15 min wage in 2026)
  - [x] **Colorado (`CO`)** — `colorado-hourly-paycheck-calculator` (4.40% flat state tax + 0.45% CO FAMLI, $15.20 min wage, 12-hour daily OT rule)
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

## ✅ Phase 6: Clean Up & Selectively Publish Best Draft Calculators (Completed — 79 Published Calculators Live)

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

---

# 🚀 Next Growth Roadmap (Phases 7–12)

## ✅ Phase 7: Deploy Phases 3–6 & Submit New URLs in Google Search Console (Completed)

- [x] **1. Commit & Deploy to Production (`https://www.quickbizcalc.com`)**
- [x] **2. Resubmit `sitemap.xml` in Google Search Console** (`Indexing → Sitemaps → https://www.quickbizcalc.com/sitemap.xml`)
- [x] **3. Request Priority Indexing via GSC URL Inspection** for newly published calculators.

---

## ✅ Phase 8: Topical Category Pillar Hub Pages & Breadcrumb Siloing (Completed)

Built a 3-tier Hub-and-Spoke topical silo architecture (`Home > [Category Hub] > [Calculator]`) across all published calculators to boost desktop topical authority:

- [x] **1. Created 6 Indexable Category Pillar Hub Pages (`src/lib/category-hubs.ts`, `src/app/category/[slug]/page.tsx`)**:
  - [x] `/category/payroll-taxes` — Payroll & Tax Calculators Hub (14 federal/FICA tools + 30-State Hourly Paycheck Directory + 2026 IRS threshold table)
  - [x] `/category/time-attendance` — Time Card & Attendance Calculators Hub (15 tools + FLSA minutes-to-decimal conversion table)
  - [x] `/category/salary-compensation` — Salary, Overtime & Pay Calculators Hub (11 tools + 2026 hourly-to-salary conversion table)
  - [x] `/category/business-finance` — Business Finance & Margin Calculators Hub (10 tools + Margin vs. Markup conversion table)
  - [x] `/category/hr-analytics` — HR Analytics & Workforce Calculators Hub (8 tools + 2026 HR & ACA FTE benchmark table)
  - [x] `/category/sales-saas` — Sales, SaaS & Freelance Calculators Hub (6 tools + LTV:CAC, Churn & Upwork reverse-bid table)
- [x] **2. Upgraded Breadcrumb Siloing & Structured Data (`CollectionPage`, `ItemList`, `BreadcrumbList`, `FAQPage` JSON-LD)**:
  - [x] Updated calculator breadcrumbs in `src/app/calculators/[slug]/page.tsx` from `Calculators > [Tool]` to `Home > [Category Hub] > [Tool]`.
  - [x] Added all 6 `/category/[slug]` URLs to `src/app/sitemap.ts`, `src/components/calculators/HubPage.tsx`, and `src/components/layout/Footer.tsx`.

---

## ✅ Phase 9: Expand State Hourly Paycheck Calculators to 30 States (Batch C — Completed, 94 Published Calculators Live)

Expanded from 15 states to **30 states** by adding the next 15 high-population flat-tax and progressive-tax states in `src/lib/payroll/withholding-2026.ts`, `src/lib/payroll/state-pages.ts`, `src/lib/seo-data/`, `src/lib/calculator-meta.ts`, and `src/app/calculators/[slug]/page.tsx` (+ `embed/page.tsx`), plus added a dynamic 2026 `$15–$50/hr` Take-Home Reference Table (`benchmarkTables`) and `deepDiveSections` to all 30 state paycheck pages:

- [x] **Flat & Newly Flat-Tax States (2026 Rules)**:
  - [x] **Utah (`UT`)** — `utah-hourly-paycheck-calculator` (4.50% flat tax + 6% Taxpayer Tax Credit with 1.3% phaseout)
  - [x] **Kentucky (`KY`)** — `kentucky-hourly-paycheck-calculator` (3.50% flat tax in 2026, $3,270 standard deduction)
  - [x] **Louisiana (`LA`)** — `louisiana-hourly-paycheck-calculator` (3.00% flat tax reform, $12,500 Single / $25,000 MFJ standard deduction)
  - [x] **Iowa (`IA`)** — `iowa-hourly-paycheck-calculator` (3.80% flat tax in 2026 + $40 IA W-4 credit per allowance)
  - [x] **Idaho (`ID`)** — `idaho-hourly-paycheck-calculator` (5.30% flat tax in 2026, federal-aligned standard deduction)
- [x] **High-Population Progressive & Multi-Bracket States (2026 Brackets)**:
  - [x] **Ohio (`OH`)** — `ohio-hourly-paycheck-calculator` (0% up to $26,050, flat 2.75% above $26,050 in 2026, $11.00 min wage)
  - [x] **Virginia (`VA`)** — `virginia-hourly-paycheck-calculator` (2%, 3%, 5%, 5.75% brackets, $8,500/$17,000 standard deduction, $12.77 min wage)
  - [x] **New Jersey (`NJ`)** — `new-jersey-hourly-paycheck-calculator` (1.4%–10.75% progressive brackets + NJ SUI/FLI employee payroll deductions, $15.92 min wage)
  - [x] **Massachusetts (`MA`)** — `massachusetts-hourly-paycheck-calculator` (5.0% base + 4% Millionaires Surtax + 0.46% MA PFML, $15.00 min wage)
  - [x] **Maryland (`MD`)** — `maryland-hourly-paycheck-calculator` (2.0%–5.75% state brackets + 3.05% avg county local income tax, $15.00 min wage)
  - [x] **Minnesota (`MN`)** — `minnesota-hourly-paycheck-calculator` (5.35%–9.85% brackets + new 2026 MN Paid Leave 0.44%, $11.41 min wage)
  - [x] **Missouri (`MO`)** — `missouri-hourly-paycheck-calculator` (0%–4.70% brackets, $15.00 min wage in 2026 under Prop A)
  - [x] **Wisconsin (`WI`)** — `wisconsin-hourly-paycheck-calculator` (3.50%–7.65% brackets + sliding-scale standard deduction)
  - [x] **Oregon (`OR`)** — `oregon-hourly-paycheck-calculator` (4.75%–9.90% brackets with federal tax subtraction + 0.60% Paid Leave OR + 0.10% OR Transit Tax)
  - [x] **South Carolina (`SC`)** — `south-carolina-hourly-paycheck-calculator` (0%, 3.0%, 6.0% brackets + SC W-4 standard deduction & allowances)

---

## ✅ Phase 10: Programmatic Wage & Salary Breakdown Pages (`/salary/[slug]` — Completed, 30 Pages + Hub Live)

Built 30 programmatic long-tail wage & salary breakdown pages (`/salary/[slug]`) plus the `/salary` directory hub (`src/lib/salary-pages.ts`, `src/app/salary/page.tsx`, `src/app/salary/[slug]/page.tsx`, `src/components/calculators/SalaryBreakdownInteractive.tsx`):

- [x] **Created `/salary` Hub & `/salary/[slug]` Route for 30 High-Search Wage & Salary Tiers**:
  - [x] **15 Hourly Wage Tiers**: `/salary/15-an-hour` through `/salary/60-an-hour` (`$15`, `$16`, `$17`, `$18`, `$19`, `$20`, `$22`, `$25`, `$28`, `$30`, `$35`, `$40`, `$45`, `$50`, `$60` an hour)
  - [x] **15 Annual Salary Tiers**: `/salary/35000-a-year` through `/salary/200000-a-year` (`$35k`, `$40k`, `$45k`, `$50k`, `$55k`, `$60k`, `$65k`, `$70k`, `$75k`, `$80k`, `$90k`, `$100k`, `$120k`, `$150k`, `$200k` a year)
- [x] **Included Unique Interactive & Deterministic Data on Every Page**:
  - [x] Interactive `<SalaryBreakdownInteractive />` customizer (adjust State, W-4 Filing Status, Regular Hours, 1.5× Overtime Hours, and Pay Frequency in real time)
  - [x] Pre-calculated 7-period conversion & work schedule matrix (`40h/wk`, `50 wks w/ 2 wks unpaid PTO`, `37.5h/wk`, `30h/wk`, `20h/wk`, and `40h + 5h OT`)
  - [x] Side-by-side 2026 After-Tax Take-Home comparison table across all **30 supported US states** with direct internal links to each state's `/calculators/[state]-hourly-paycheck-calculator`
  - [x] Monthly 50/30/20 budget breakdown & max recommended rent/mortgage affordability (28% / 30% rules)
  - [x] Added `/salary` and all 30 `/salary/[slug]` URLs to `src/app/sitemap.ts`, `/category/salary-compensation`, `/category/payroll-taxes`, and `Footer.tsx`

---

## ✅ Phase 11: Shareable Pre-Filled URLs (`?rate=25&hours=40`) & Dynamic OG Images (`/api/og` — Completed)

- [x] **1. URL Query Parameter Sync & "Share Calculation Link" Button**:
  - [x] Added bidirectional URL query parameter sync (`?rate=28&hours=40&ot=5&state=CA&freq=bi-weekly&status=single`) and 1-click **"Share Calculation Link"** buttons across `HourlyPaycheckCalculator.tsx`, `StatePaycheckCalculator.tsx` (all 30 state calculators), and `SalaryBreakdownInteractive.tsx` (all 30 `/salary/[slug]` guides), alongside universal form query-param sync in `ResultActions.tsx`.
- [x] **2. Dynamic OpenGraph Image Route (`/api/og`)**:
  - [x] Created `src/app/api/og/route.tsx` using `next/og` (`ImageResponse`) and wired it into `src/app/calculators/[slug]/page.tsx`, `src/app/category/[slug]/page.tsx`, and `src/app/salary/[slug]/page.tsx` so every calculator, category hub, and salary guide renders a custom 1200×630 branded social preview card.

---

## ✅ Phase 12: Audit, Enrich & Publish Wave 2 of High-Value B2B Calculators (Completed — 102 Published Calculators Live)

Audited, enriched with 2026 `benchmarkTables` & `deepDiveSections`, and published (`status: 'published'` with mapped 6-hub categories) all 10 Wave 2 high-CPC accounting, SaaS, and freelancer calculators:

- [x] `self-employment-tax-calculator` (`SelfEmploymentTaxCalculator.tsx` + `src/lib/seo-data/self-employment-tax-calculator.ts` — 2026 Schedule SE 92.35% rule, `$40k–$250k` SECA benchmark table, and S-Corp election deep dive)
- [x] `1099-calculator` (`Calculator1099.tsx` + `src/lib/seo-data/1099-calculator.ts` — 1099 quarterly estimated tax schedule, `$50k–$300k` tax reserve benchmark table, and Schedule C / Solo 401(k) deep dive)
- [x] `mrr-calculator` (`MrrCalculator.tsx` + `src/lib/seo-data/mrr-calculator.ts` — MRR/ARR waterfall, 2026 SaaS growth & Quick Ratio benchmarks by stage, and GAAP MRR recognition rules)
- [x] `roas-calculator` (`RoasCalculator.tsx` + `src/lib/seo-data/roas-calculator.ts` — Break-even ROAS by gross margin table, Meta/Google channel benchmarks, and MER vs. contribution margin guide)
- [x] `cac-payback-calculator` (`CacPaybackCalculator.tsx` + `src/lib/seo-data/cac-payback-calculator.ts` — Gross-margin adjusted payback period, B2C/SMB/Mid-Market/Enterprise benchmarks, and upfront cash payback guide)
- [x] `net-revenue-retention-calculator` (`NetRevenueRetentionCalculator.tsx` + `src/lib/seo-data/net-revenue-retention-calculator.ts` — SaaS NRR & GRR cohort formulas, ACV tier benchmarks, and valuation multiple deep dive)
- [x] `working-capital-calculator` (`WorkingCapitalCalculator.tsx` + `src/lib/seo-data/working-capital-calculator.ts` — Net Working Capital & Current Ratio industry benchmarks + M&A Net Operating Working Capital peg guide)
- [x] `depreciation-calculator` (`DepreciationCalculator.tsx` + `src/lib/seo-data/depreciation-calculator.ts` — Straight-line & 200% Double-Declining Balance + IRS Pub 946 MACRS recovery table & Section 179 / Bonus Depreciation guide)
- [x] `cogs-calculator` (`CogsCalculator.tsx` + `src/lib/seo-data/cogs-calculator.ts` — Cost of Goods Sold formula, industry COGS & gross margin benchmarks, and FIFO vs. LIFO inventory valuation guide)
- [x] `business-valuation-calculator` (`BusinessValuationCalculator.tsx` + `src/lib/seo-data/business-valuation-calculator.ts` — Revenue, EBITDA & Net Asset valuation + 2026 private M&A SDE/EBITDA multiples by industry)
