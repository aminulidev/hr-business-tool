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


---

# 🚀 Roadmap v2 — From "many calculators" to "the most trusted business calculator site"

> **Written**: November 6, 2026
> **Situation**: 102 published / 101 draft / 40 merged calculators. Traffic fell ~90% on Oct 1 2026 after Google's Sept 24 spam update (targets templated programmatic pages). AdSense not approved. Competitor review (PaycheckCity, SmartAsset, Omni, Calculator.net) shows we already lead on *tool features* (live calc, share URL, embed, history, PDF, mobile result bar) and trail badly on *trust* (no author, no review date, unlinked sources, small math errors, templated state pages).
> **Strategy**: Fewer, deeper, verifiably-correct pages with real E-E-A-T, on a codebase that can enforce correctness automatically. Expansion only after that.
> **Order matters**: Phases 13 → 14 → 15 are the recovery path and must ship together before the next GSC re-crawl request. 16–20 are growth.

---

## Phase 13: Trust, Accuracy & E-E-A-T (recovery blocker #1)

### 13.1 Real author & review layer
- [x] `src/lib/authors.ts` created (Nov 6 2026). **Decision (owner, Nov 6 2026): organisation-level authorship.** The only entry is `editorial-team` (`kind: 'organization'`, "QuickBizCalc Editorial Team", links to the site LinkedIn/X); bylines say "By QuickBizCalc Editorial Team" and JSON-LD `author`/`reviewedBy` are an Organization. No named person, no invented credentials. Upgrade path: recruit a real CPA/EA/SHRM reviewer who agrees to appear, add them as `kind: 'person'` with licence details and profile link, and point the paycheck pages at them as reviewer.
- [x] No `/authors/[slug]` page (removed with the organisation decision). Bylines, the blog author box and `/about` link to `/editorial-policy#who`, which carries the team description and contact links. Revisit if a real named reviewer is added.
- [x] `CalculatorMetaInput` gained `lastReviewed?`, `reviewNotes?`, `author?` (Nov 6 2026). Set on the 32 engine-backed pages only (`hourly-paycheck-calculator`, `payroll-calculator`, 30 state pages) with date 2026-11-06, because those are the ones whose math the golden/generated-content tests verify. `registry.test.ts` rejects a future date or a date without a note. The other 70 published pages get a date as Phase 13.3 verifies each one.
- [x] `src/components/seo/Byline.tsx` renders "Written by · Reviewed · Tax year" under the H1 of calculators (tax year only for Payroll & Taxes), salary pages and blog posts. `WebAppJsonLd` now carries `author` (Person), `publisher`, `dateModified` + `reviewedBy` (when reviewed) and `citation` (the sources). Blog JSON-LD: Person author, `dateModified` (new optional `updated` frontmatter, falls back to `date`). Salary JSON-LD: WebPage node with author/dateModified (`SALARY_PAGES_REVIEWED`). (Nov 6 2026)
- [x] `/editorial-policy` page (who writes, how numbers are sourced, what "Reviewed" means, update cadence, corrections within two business days, limits, advertising independence, use of AI tools) linked from the footer, the About page, every Sources block, the sidebar trust card and each "Reviewed" byline. (Nov 6 2026)

### 13.2 Linked, specific sources
- [x] `CalculatorSeoData.sources?: SeoSource[]` (`{ label, url, publisher?, note? }`) with shared constants in `src/lib/seo-data/sources.ts` (`SRC.irsPub15T`, `SRC.dolOvertime`, …, 55 entries). 48 SEO files + 30 state pages cite specific publications; the hardcoded IRS/DOL/SSA block is gone and the Sources section is **not rendered** on the 24 pure business-math pages (margin, ROI, CAC, churn…) rather than decorating them with irrelevant statutes. Tests: every source has a label and an https URL, no duplicates per page, every published Payroll & Taxes page cites ≥1 source, the 32 engine pages cite Pub. 15-T and the SSA wage base. (Nov 6 2026)
- [ ] Link check: `dol.gov`, `ssa.gov`, `bls.gov`, `mass.gov` and several state sites return 403 to non-browser clients, so the Nov 6 curl pass could verify 62 of the 129 candidate URLs; the rest are well-known agency pages used as-is. Re-check the 403/000 set in a browser (or add a monthly link-check job) before relying on them.
- [x] `STATE_PAYCHECK_PAGES[code].sources` is now `SeoSource[]`: each state links its revenue department withholding publication, its labor agency minimum-wage page (DOL state table where the state has no law of its own) and any SDI/PFL/FAMLI program page; `buildStatePaycheckSeo` prepends `FEDERAL_PAYCHECK_SOURCES`. (Nov 6 2026)

### 13.3 Math & copy audit of every published page (102)
- [ ] Known defects to fix first (found in competitor review of the live hourly paycheck page):
  - [x] `commission-calculator` has `metaTitle: 'Churn Rate Calculator (2026)…'` and a churn `metaDescription` — wrong page title in SERPs for a tier-1 page (`calculator-meta.ts:417`) — fixed in PR 2.
  - [x] Hourly paycheck Step 4 and the "state not in the list" FAQ now say FL/NV/TN/TX/WA are in the list and only AK/NH/SD/WY use the "No state income tax" option (PR 2).
  - [x] Texas worked example cents: examples are already engine-generated; the gap is per-paycheck rounding vs exact annual, not an error. No change (PR 2).
  - [x] Illinois example state tax ($116.63) is not explained (allowance adjustment) → the example now states the $2,925-per-allowance subtraction (PR 2).
  - [x] "$18 an Hour, Another State" example retitled as a demonstration of the flat-rate option (PR 2).
  - [x] Hourly paycheck how-to no longer says "Click Calculate Paycheck" (PR 2). Remaining: 181 other SEO files say "Click Calculate" — audit each against whether its component calculates live (Phase 14.5 `useCalculatorState` migration is the natural moment).
- [x] **Engine corrections found while building 15.3 (Nov 6 2026, verified against state DOR / EY payroll alerts):** KY 4.00% → 3.50% (H.B. 1), NC 4.25% → 3.99% tax / 4.09% withholding (S.L. 2023-134), GA 5.19% → 4.99% (H.B. 463, retroactive), UT 4.55% → 4.45% (S.B. 60), ID 5.695% → 5.30% (H.B. 40), OH 3.5% top bracket removed → flat 2.75% over $26,050 (H.B. 96), CO FAMLI 0.45% → 0.44%, WA PFML employee share 0.5714% → 0.8072% (1.13% premium × 71.43%). Minimum wages: MI $12.48 → $13.73, CO $15.20 → $15.16, OR tiers → $15.55/$16.80/$14.55 (July 2026), MD county tiers updated. Golden tests added for each. Registry meta text and the flat-rate lists in `payroll-calculator.ts` / `state-tax-calculator.ts` SEO corrected.
- [ ] **Still stale (not fixed):** `StateTaxCalculator.tsx` carries its own 50-state rate table (NC 4.5%, UT 4.65%, ID 5.695%, KY 4.0%, old deductions) — migrate it to the engine or update it. WA HB 2345 (effective June 11 2026) re-splits the PFML premium between employer and employee; confirm the post-June employee share. Idaho may publish a 0% low-income band in its 2026 withholding schedule — check tax.idaho.gov.
- [ ] Systematic pass, category by category: every worked example recomputed by code (Phase 14.3 test asserts text numbers == engine numbers where an engine exists); every FAQ number checked against the linked source; remove any "2025" figures still presented as current.
- [ ] Remove filler: duplicated state lists, identical related-card subtitles, repeated disclaimers. One disclaimer component, rendered once.

### 13.4 Policy/approval hygiene
- [ ] Confirm no invented reviewer names remain anywhere (grep for CPA/SPHR shows only generic mentions as of Nov 6 2026 — keep it that way).
- [~] Blog: every post has a real `date` (frontmatter). JSON-LD now has a Person author and `dateModified` (Nov 6 2026). Remaining: the 39 posts' frontmatter `author: "QuickBizCalc Team"` is a display label only; add `updated:` when a post is revised.
- [x] `/about` describes the team and links the editorial policy; `/contact` already describes the team, real email and 48-hour response policy (Nov 6 2026).

---

## Phase 14: Architecture hardening (makes Phase 13 enforceable, removes the manual sync work)

### 14.1 Split the registry
- [x] `src/lib/calculator-meta.ts` (6,528 lines) → `src/lib/registry/` (PR 3, Nov 6 2026 — `calculator-meta.ts` is now a 4-line re-export shim; 9 category files under `registry/calculators/`, `define.ts`, `site.ts`, `index.ts`):
  - `types.ts` (`CalculatorMeta`; `CalculatorSlug` derived from the array instead of a hand-maintained union)
  - `site.ts` (SITE_URL, SITE_NAME, CONTACT_EMAIL, categoryOrder, categoryMeta)
  - `calculators/{payroll-taxes,salary,time-attendance,hr-analytics,business-finance,sales,freelancer,saas,accounting}.ts`
  - `index.ts` re-exporting the same names; `@/lib/calculator-meta` becomes a one-line re-export shim, deleted later.
- [x] Both hand-maintained `componentMap`s deleted (PR 3). One map lives in `src/lib/registry/components.tsx`, typed `Partial<Record<CalculatorSlug, ComponentType>>` so a key that is not a registry slug is a type error; `registry.test.ts` asserts every published slug has an entry. Kept separate from the data files on purpose: the registry is imported by client code (hub, search), and dynamic-import thunks there would pull 240 chunk references into client bundles.

### 14.2 Typed SEO content
- [x] `src/lib/seo-data/types.ts` added (PR 3); all 244 SEO files use `satisfies CalculatorSeoData` on the object literal (31 state files get it via the typed return of `buildStatePaycheckSeo`). `relatedTools[].slug` is typed `CalculatorSlug` — this surfaced 12 dead related-tool links (ebitda, profit-loss, margin, product-pricing, salary-to-hourly, cash-flow, loan-payment) now repointed to real slugs. `any` removed from the page route. `sources` / `lastReviewed` fields still to add in Phase 13.
- [x] `relatedTools[].icon` typed as `IconName = keyof typeof iconMap`; single `iconMap` in `src/lib/registry/icons.ts`; `CalculatorLayoutServer.tsx` imports it and `CalculatorLayout.tsx` (dead, 828 lines) is deleted (PR 3).

### 14.3 Tests + CI (there are none today)
- [x] Add Vitest. `npm test` runs (PR 1, Nov 6 2026 — 190 tests):
  - **Payroll engine golden tests** (`withholding-2026.test.ts`): federal withholding vs IRS Pub 15-T percentage-method examples; FICA caps; each state's flat-rate/allowance formula vs its published table; no-income-tax states return 0.
  - **Registry invariants** (`registry.test.ts`): every published slug has component + seo file + ≥3 FAQs + ≥2 linked sources + `lastReviewed`; no duplicate `metaTitle`/`metaDescription`/`path`; `merged` → target resolves to a **published** page (today 17 merged slugs point at drafts or other merged slugs and rely on `DRAFT_TARGET_FALLBACK`); `metaTitle` must share its first noun with `title` (catches the churn/commission bug class); title ≤ 60 chars.
  - **Content/engine agreement**: for paycheck/salary pages, every `$` figure in generated worked examples equals `calculatePaycheck()` output.
  - **Sitemap/robots** emit only published URLs.
- [x] `.github/workflows/ci.yml`: `npm ci && npm test && npm run build` on every PR to `master` (lint runs advisory until the 10 pre-existing `react-hooks/set-state-in-render` / `preserve-manual-memoization` errors in 12 calculator components are fixed — then make it blocking).

### 14.4 Dead code & config cleanup
- [x] `npm run lint` is clean and the CI lint step is blocking (Nov 6 2026). The 10 reported errors plus 5 more that an unrelated `eslint-disable` comment had been hiding were fixed for real, no suppressions left:
  - **URL → state in an effect** (HourlyPaycheckCalculator, StatePaycheckCalculator, SalaryBreakdownInteractive): new `useInitialQuery()` in `src/hooks/useSearchParam.ts` (useSyncExternalStore; null on the server, the first client query string after) — the default export reads it and renders the form keyed on the query string with `defaults` computed by a pure `readDefaults()`. Server HTML is unchanged; shared links still pre-fill.
  - **FeedbackWidget**: slug from `usePathname()`; the recent vote is read from localStorage through `useSyncExternalStore` (storage event) instead of an effect.
  - **Result computed in an effect** (ROI, Wages, TimeCard, TimeCardLunch, Discount, Markup, Overtime): each got a pure module-level `computeX()` returning `{ result, error }` and a `useMemo`; the Calculate button now only saves history (or scrolls to the result where there is no history panel). Overtime's weekly-total override is applied live instead of mutating the OT input inside the effect.
  - **preserve-manual-memoization**: WorkHoursCalculator's `applyRounding`/`computeDay` moved to module scope (`computeDay(d, rounding)`); SalesCommissionCalculator's `getSnapshot` moved below the three memos it reads.
- [x] `CalculatorLayout.tsx` deleted (PR 3).
- [x] `src/app/api/route.ts` (hello world) and `tailwind.config.ts` deleted (Nov 6 2026; `globals.css` has no `@config`, so the file was never loaded). `tailwindcss-animate` removed with the lockfile cleanup.
- [x] **Lockfiles**: owner chose npm (Nov 6 2026). `bun.lock` and `pnpm-lock.yaml` deleted, `tailwindcss-animate` removed from package.json, `package-lock.json` is the only lockfile Vercel sees.
- [x] `npm run start` is now `next start` (Nov 6 2026) — the old `bun .next/standalone/server.js` pointed at a directory that `next build` never produced because `output: 'standalone'` is not set; Vercel ignores the start script anyway. `DRAFT_TARGET_FALLBACK` is already gone from `next.config.ts`.
- [ ] `.env` (untracked, owner's machine): drop unused `DATABASE_URL` or adopt SQLite — decide with Phase 18.

### 14.5 Shared calculator primitives (adopt incrementally — only when a component is touched)
- [ ] `useCalculatorState<T>(slug, defaults)` — one hook owning inputs, URL query sync (today only 4 components do this), `useCalcHistory`, and live `result` via `useMemo`. Replaces the per-component copy-paste.
- [ ] `<CalculatorShell>` rendering `.calculator-form`, `<TryExample>`, Reset, `.result-display`, `<ResultActions>`, `<CalcHistoryPanel>` in a fixed order so `MobileResultSheet`/share/print always find their hooks.
- [ ] `<MoneyInput>`, `<PercentInput>`, `<HoursInput>` with formatting, min/max, and `aria-describedby` help text.
- [ ] `HubPage.tsx` (710-line client component): render the category grid on the server; keep only the search box as a client island. Measure LCP before/after.

---

## Phase 15: Consolidate the index (recovery blocker #2 — "delete or merge, don't trim")

### 15.1 Thin published pages (9) — merge or rewrite, decide per page
- [x] `hours-between-times`, `time-difference`, `clock-out`, `break` → **`time-card-calculator`** tabs (Nov 6 2026): `TimeCardModes.tsx` holds Hours between (with an optional date span that replaces time-difference), Clock-out time (with hours-worked-this-week → 40-hour line) and Break rules (CA/OR/WA/CO/NY table with authorities). Old slugs are `merged` with `mergedQuery` so the 301 lands on the right tab (`?mode=hours-between|clock-out|breaks`). Their FAQs, examples and the state break table moved into the time-card SEO file.
- [x] **Shift Schedule Planner** at `/calculators/shift-rotation-calculator` (Nov 6 2026): `ShiftSchedulePlanner.tsx` renders full-cycle crew grids for 2-2-3, DuPont, Pitman and 4-on-4-off (14/28/8-day cycles, day/night crews, coverage check, longest stretch, FLSA vs 7(k) overtime at 171/212 h per 28 days, pay at a rate) plus the weekly roster tab (shift ranges, OT column, on-duty row). SEO rewritten: pattern comparison table, fair-workweek table, 7(k) deep dive, 9 FAQs, sources incl. DOL Fact Sheet #8. `employee-schedule-calculator` is merged → `?mode=roster`.
- [x] `sick-leave-calculator` → `pto-accrual-calculator` "Paid sick leave — state mandate" accrual type (Nov 6 2026): 18 states + DC with per-hour divisor, annual cap and notes (`SICK_LEAVE_MANDATES`), hours used → remaining balance; 301 with `?type=sick`. State table, 4 FAQs and 2 examples moved into the PTO SEO file; `SRC.dolSickLeave` added.
- [x] `holiday-countdown-calculator` → `business-day-calculator` third mode "Federal Holidays & Countdown" (Nov 6 2026): any year, observed dates from the existing OPM-rule generator, days from today, next holiday highlighted; 301 with `?mode=holidays`. Two FAQs and a countdown example added to the business-day SEO.
- [x] `headcount-calculator` → `fte-calculator` "Headcount projection" tab (Nov 6 2026): departures on average headcount, backfills-to-stand-still, result in FTE at average weekly hours; 301 with `?mode=headcount`. FAQs/example moved; `headcount-calculator` related-tool link replaced with employee-turnover. (Phase 17 workforce-planning suite can absorb this tab later.)

### 15.2 Fix merge chains
- [x] 16 `merged` entries targeted drafts; repointed to published pages (PR 2): attendance→time-card, replacement-cost→employee-turnover, workforce-capacity→fte, net-profit→profit-margin, contribution→gross-margin, split-commission + sales-target→commission, lead-cost→roi, client-profit + proposal-price + quote + estimate→billable-hours, free-to-paid-conversion→mrr, fifo + lifo + weighted-average-cost→cogs. `DRAFT_TARGET_FALLBACK` removed from `next.config.ts`; registry test ratchet is now empty.

### 15.3 Make the 30 state pages un-templated (they are the exact pattern the spam update hit)
- [x] `src/lib/payroll/state-details.ts` (new, Nov 6 2026) holds per-state `medianHourlyWage`, `neighbors`, `localMinimumWages` table or `localMinimumWageNote` (pre-emption), `payrollPrograms` (rates imported from the engine), `localIncomeTax` (NY, PA, MI, IN, CO head tax, KY, OH, MD, MO, OR, IA surtax, NJ employer-only), `overtimeDetail` and `changes2026` bullets. `buildStatePaycheckSeo` renders them as: local-wage table (9 states), engine-generated neighbour comparison table + "Moving across the state line" section + FAQ, "Employee-paid payroll programs" section (9 states), "Local income taxes" section (11 states), "What changed in 2026" section (all). Layout now renders deep-dive `bullets` and table `note`.
- [x] Worked examples now use the state minimum wage, the BLS OEWS May 2025 all-occupations median (annual ÷ 2,080; relayed via wagedex.com because bls.gov blocks non-browser clients — spot-check against the oesm25st file) and 1.25× median with overtime; the reference table also gets a "(Median)" row. (Nov 6 2026)
- [x] `state-pages.test.ts` now fails on any duplicated FAQ question/answer, 2026-change bullet, overtime bullet, tax summary, minimum-wage note, worked-example title or local-wage row across the 30 states, and checks the neighbour table against the engine (238 tests). The first run caught 6 shared bullets and a one-FAQ state (IN); all fixed. (Nov 6 2026)
- [ ] Only after 15.3 is live: add the remaining 20 states + DC to reach the 51 that PaycheckCity/SmartAsset offer, by population: AL, OK, CT, AR, MS, KS, NM, NE, WV, HI, NH, ME, MT, RI, DE, SD, ND, AK, VT, WY, DC.

### 15.4 Salary tier pages (`/salary/[slug]`, 30 pages)
- [ ] Same treatment: each tier page needs content a template can't produce — which occupations pay that wage (BLS OEWS), how it compares to state/city minimum wage and median rent (HUD FMR), a budget split example. If this can't be done well, cut to the 10 highest-traffic tiers.

---

## Phase 16: Product depth — be the best tool, not just a correct one

### 16.1 Flagship paycheck/payroll (60% of impressions live here)
- [x] **Employee ↔ Employer toggle** (Nov 6 2026): `EmployerCostPanel` + `ResultViewToggle` on the hourly, payroll and all 30 state paycheck calculators (`?view=employer` in share links). Engine `src/lib/payroll/employer-cost-2026.ts`: FICA match, FUTA 0.6% (CA carries the DOL potential 1.5% credit reduction — final list after Nov 10 2026, re-check then), `STATE_EMPLOYER_TAXES` with 2026 new-employer SUI rate + wage base for all 30 states (WA/UT/LA/MN are industry-rated → editable rate input, no default) and employer paid-leave shares (WA PFML 0.3228%, CO FAMLI 0.44%, MA 0.42%, OR 0.4%, MN 0.44%, NJ TDI 0.5%, CA ETT, NV CEP). 17 golden tests. SEO: `employer-cost-content.ts` generates a 30-state employer-tax table, deep dive and 3 FAQs for the hourly + payroll pages; every state page gets an engine-generated employer deep dive + FAQ and cites its UI agency. Not modelled: workers' comp, benefits, local employer taxes. Figures cross-checked against APS/Asure/Equifax tables plus NY DOL, WA ESD, NJ DOL, MD DOL, UT DWS pages; the DOL "Significant Provisions of State UI Laws" is the catch-all citation.
- [x] **Pay stub preview + PDF** (Nov 6 2026): `src/lib/payroll/pay-stub.ts` (`payStubLines`, `buildPayStubHtml` — one standalone HTML renderer with inline CSS, earnings with hours/rate, pre-tax / taxes / post-tax sections, YTD = per-period × period number, employer contributions block, "estimate, not an official payroll record" marking; 8 tests) and `PayStubDialog` (shadcn Dialog: employee/employer name, pay date, period number; iframe `srcDoc` preview; "Print / Save as PDF" prints the iframe via the browser dialog, "Download HTML"). No PDF library added on purpose — the browser print dialog produces the PDF, so no dependency/lockfile change. Button sits next to Share on the hourly, payroll and 30 state calculators; FAQs on the hourly + payroll pages.
- [x] **Scenario compare** (Nov 6 2026): `PaycheckScenarioCompare` under the result on the hourly, payroll and 30 state calculators — presets (+10% raise, no-tax state, +6% 401(k), filing status) or a custom scenario B (state, rate/salary, hours, status, frequency, 401(k) %); every paycheck line, take-home per paycheck/month/year/hour and effective rate side by side via `ComparePanel`, swap A↔B on the hourly/payroll pages. B is persisted as `b_*` share-link params (`src/lib/payroll/scenario-params.ts`, 5 tests). Engine-generated FAQs on the hourly (CA raise vs. Texas vs. 401(k)) and payroll (IL vs. TX offers) pages.
- [x] **Reverse solver** (Nov 6 2026): `src/lib/payroll/reverse-solver.ts` (`solveHourlyRateForNet`, `solveSalaryForNet`, `targetPerPeriod`; bisection on the live engine, answer rounded up to the cent / dollar, 8 tests) and `ReverseSolverCard` ("Work backwards") under the form on the hourly, payroll and 30 state calculators — target per paycheck / month / year, honours the current state, status, frequency and deductions, "Use this rate" copies the answer into the form. Engine-generated FAQs: hourly ($2,000 bi-weekly in TX/CA/NY), payroll ($5,000 a month salary), each state page ($2,000 bi-weekly in that state vs. its minimum and median wage).
- [x] **W-4 2026 Steps 2–4** (Nov 6 2026): engine `W4Adjustments` on `PaycheckInput` (`multipleJobs` → Pub. 15-T "Step 2, Checkbox" schedule implemented as ½ × tax(2 × adjusted − standard deduction), verified against the 2026 Worksheet 1A annual tables; `dependentsCredit` with `W4_CHILD_CREDIT` $2,200 / `W4_OTHER_DEPENDENT_CREDIT` $500; `otherIncome`, `deductions`, `extraWithholdingPerPeriod`), 4 golden tests. Collapsible "W-4 Steps 2–4" section on the hourly + payroll calculator (`w4_2`, `w4_kids`, `w4_dep`, `w4_a`, `w4_b`, `w4_c` share params; scenario B inherits A's W-4); FAQs with engine numbers on both pages. State pages still assume a standard W-4 and link to the hourly page for deductions.
- [x] **Bulk mode** (Nov 6 2026): `src/lib/payroll/bulk-payroll.ts` (`parseBulkCsv` — header-row or positional columns, quoted fields, tab/semicolon separators, per-line errors, 25-row cap; `runBulkPayroll` runs `calculatePaycheck` + `calculateEmployerCost` per row; `bulkToCsv`; sample roster; 7 tests) and `BulkPayrollPanel` behind a "One employee / Bulk payroll" switch at the top of the hourly + payroll calculator (`?mode=bulk`). Table: gross, federal, FICA, state & programs, pre-tax, net, employer taxes, total cost, totals row; Copy / Download CSV. Browser-only, no upload. Payroll page gets a CSV-columns table, how-to step and an engine-numbered FAQ.

### 16.2 Cross-site features
- [ ] **Bidirectional inputs on all ratio calculators** (margin, markup, ROI, break-even): enter any two of three fields (Omni's signature UX).
- [ ] **Saved scenarios** with names, in localStorage + export/import JSON (no accounts needed yet).
- [ ] **Explain-this-number**: each result line expands to show the exact formula with the user's values substituted. Doubles as live worked-example content.
- [ ] Keyboard-first: Enter calculates, sane Tab order, Esc resets; `aria-live` on results. Run axe on 10 flagship pages.
- [ ] Dark mode audit (next-themes is installed; verify every result panel is legible).
- [ ] PWA: `manifest.json` exists — add offline caching of the 20 most-used calculators.

### 16.3 Content formats that earn links
- [ ] Downloadables behind a soft email ask: Excel timesheet template, 2026 payroll calendar (bi-weekly/semi-monthly pay dates), 2026 federal + state withholding cheat-sheet PDF, commission plan template. Hosted under `/resources/`.
- [ ] Yearly "What changes in {next year} payroll" page updated the day the IRS/SSA announce (brackets, SS wage base, 401k limits, state min wages). Evergreen URL, dated sections.

---

## Phase 17: Draft triage (101 drafts → ~18 strong suites, rest deleted)

> Rule: publish only as **suites** with tabs/modes and one deep article; never one thin page per formula. Verify demand in Keyword Planner/GSC before building. Delete what isn't listed.

| Suite (new or existing page) | Drafts absorbed | Decision |
|---|---|---|
| ~~`financial-ratio-calculator`~~ **done Nov 15 2026** | roe, roa, debt-ratio, current-ratio, quick-ratio, interest-coverage, asset-turnover, financial-ratio | Published as `FinancialRatioSuite`: one statement input, 23 ratios in four family tabs (liquidity, leverage & coverage incl. DSCR and net debt/EBITDA, profitability incl. ROCE and DuPont, efficiency incl. DSO/DPO/CCC), strong / acceptable / watch readings from rule-of-thumb ranges, balance-sheet check. Math in `src/lib/pricing/financial-ratios.ts` (6 tests); article generated from it with a healthy-vs-stressed table. No per-industry benchmark table — no verified public source for one beyond NYU Stern, which is linked instead. Seven drafts merged with `family=`; components + SEO deleted. |
| ~~`inventory-planning-calculator`~~ **done Nov 15 2026** | inventory-turnover, holding-cost, eoq, safety-stock, reorder-point, cash-conversion-cycle | Published as `InventoryPlanningSuite`, four tabs: EOQ (H from unit cost × carrying rate or direct, orders/yr, days between orders, six-point cost sensitivity), reorder point + safety stock (demand and lead-time σ, z-table 80–99.9%, service-level ladder, average/max stock), carrying cost by component, turnover + DIO + months of supply + DSO/DPO/CCC with cash released at faster turns. Math in `src/lib/pricing/inventory-planning.ts` (9 tests); article generated from it. Six drafts merged with `mode=`; components + SEO deleted. |
| ~~`inventory-valuation-calculator`~~ **done Nov 15 2026** | fifo, lifo, weighted-average | Published as a real multi-layer calculator (`src/lib/pricing/inventory-valuation.ts`, 7 tests): up to 8 layers, FIFO / LIFO / weighted average side by side with layer-by-layer consumption, gross profit, LIFO reserve and the FIFO-vs-LIFO tax difference; `?method=` from the three redirects picks the method shown first. The three single-method merges (previously pointed at the COGS page) now land here; their components + SEO files deleted; COGS page links across. Sources: IRS Pub. 538 / 334. |
| ~~`profit-margin-calculator`~~ **done Nov 10 2026** | net-margin, operating-margin, contribution-margin, selling-price, wholesale-price | Three tabs added (`ProfitMarginModes`: gross → EBITDA → operating → net ladder with sector ranges; contribution margin + break-even + margin of safety + operating leverage; wholesale → distributor → retail chain with keystone presets). Math in `src/lib/pricing/margins.ts` (8 tests), article regenerated from it; the five drafts are merged entries (`mode=statement` / `contribution` / `target-margin` / `wholesale`) and their components + SEO files deleted. NYU Stern margin dataset added as a source. |
| ~~`marketing-cost-calculator`~~ **done Nov 15 2026** | cpl, cpa, cpm, cpc, marketing-roi, conversion-rate | Published as `MarketingCostSuite`, three tabs: campaign metrics (one spend → CPM, CTR, CPC, CPL, CPA, ROAS, revenue vs. profit ROI, break-even CPA/ROAS), budget & targets (customers needed → clicks/leads/impressions/budget, break-even and target-ROAS ceilings for CPA, CPL, CPC, CPM), funnel stages (any number of stages, weakest-stage flag, cost per stage). Math in `src/lib/pricing/marketing.ts` (8 tests); article generated from it incl. a break-even-ROAS-by-margin table. Six drafts merged (`mode=funnel` / `stages`), components + SEO deleted; ROAS page links across. |
| ~~`sales-forecast-calculator`~~ **done Nov 15 2026** | revenue-forecast, sales-forecast, pipeline, win-rate, revenue-growth, customer-retention | Published as `SalesForecastSuite`, three tabs: stage-weighted pipeline (editable stages, win rate from won/lost, timing factor from sales cycle vs. window, coverage, gap and pipeline to add), revenue growth (period/annualised/monthly rates, doubling time, banded compounding projection), customer retention (retention/churn, annualised, lifetime, replacement rate, churned revenue, 12-month cohort). Math in `src/lib/pricing/sales-forecast.ts` (10 tests); article generated from it incl. a typical-stage-probability table. Five drafts merged with `mode=`; components + SEO deleted. |
| ~~`commission-calculator`~~ **done Nov 10 2026** | tiered-commission, commission-split, quota, sales-bonus, incentive | Two tabs added (`CommissionModes`: commission split with house cut, fees, manager override and up to five parties; bonus & OTE with accelerator, threshold, kickers, SPIFFs and an earnings curve). Math in `src/lib/pricing/commission.ts` (6 tests), article extended from it. Tiered and quota drafts were duplicates of existing tabs; all five are merged entries (`mode=tiered` / `quota` / `split` / `bonus`), components + SEO deleted; the older split-commission and sales-target merges now carry a `mode` too. |
| ~~`startup-equity-calculator`~~ **done Nov 15 2026** | startup-valuation, equity-dilution, cap-table, safe-note, option-pool, founder-equity-split | Published as `StartupEquitySuite`, four tabs: priced round (editable cap table, pre/post-money, price per share, option-pool shuffle toggle pre- vs post-money, dilution and value per holder), post-money SAFE conversion (multiple SAFEs with caps and discounts, cap-vs-discount choice, conversion price, realised discount, ownership before/after the round), option pool (current/granted/available vs. a hiring plan, top-up needed, grant-range table), founder split (weighted 0–10 scores on five editable factors, per-factor breakdown, 4-year/1-year-cliff vesting). Math in `src/lib/pricing/startup-equity.ts` (15 tests); article generated from it; YC SAFE documents cited. Six drafts merged with `mode=`; components + SEO deleted. Not modelled: liquidation preferences, pro-rata rights, MFN, multiple-cap side letters, 409A. |
| ~~SaaS metrics (existing mrr/churn/ltv pages)~~ **done Nov 15 2026** | arr, expansion-mrr, ltv-cac-ratio, arpu, acv, gross-revenue-retention, mau-value, trial-conversion, saas-pricing (+ free-to-paid, already merged) | Shared engine `src/lib/pricing/saas-metrics.ts` (20 tests) and shared suite primitives `components/calculators/suite-ui.tsx`. `mrr-calculator` rewritten with four tabs: plan table → MRR/ARR/ARPA/ACV with a contract normaliser (`mode=mrr`: arr, arpu, acv), net new MRR bridge with quick ratio, GRR/NRR and compounding (`mode=movements`: expansion-mrr), trial/freemium funnel with sign-ups-needed (`mode=funnel`: trial-conversion, free-to-paid), pricing tiers with margin per seat and ladder (`mode=pricing`: saas-pricing). `churn-rate-calculator` rewritten with two tabs: logo/revenue churn for any period, annualised, lifetime, churner size ratio; GRR/NRR bridge (`mode=retention`: gross-revenue-retention). `customer-lifetime-value-calculator` rewritten with three tabs: gross-margin CLV with cap, LTV:CAC verdict, payback and churn sensitivity; LTV:CAC by channel (`mode=ltv-cac`); revenue per MAU, ARPPU, stickiness (`mode=mau`). All three articles regenerated from the engine; registry meta updated; ten components + SEO files deleted. |
| ~~`labor-cost-calculator`~~ **done Nov 10 2026** | labor-cost, team-cost, hr-budget, employee-cost (merge target) | Published as a 4-mode suite (`LaborCostSuite`: cost per employee with the 2026 employer-tax engine by state, team/project cost with burden + margin, labor % of revenue vs. industry ranges, HR budget). `employee-cost`, `team-cost`, `hr-budget` → merged into it with `mode=`; `employee-benefit-cost` and `payroll-cost` repointed. Engine `labor-cost.ts` (12 tests); article generated from it. Also fixed the two merge chains that ended on a merged slug (working-hours → time-card, clock-in → time-card?mode=clock-out). |
| ~~`workforce-planning-calculator`~~ **done Nov 15 2026** | workforce-planning, headcount (15.1), workforce-capacity, absenteeism, span-of-control, labor-efficiency | Published as `WorkforcePlanningSuite`, four tabs: headcount plan (multi-year, target from a revenue goal with a revenue-per-employee productivity gain or a typed target; attrition charged on average headcount each year; growth / departures / hires table, backfill share, hires per month, end FTE; `mode=plan`, absorbs the FTE page's headcount tab and `headcount-calculator` now 301s here), absenteeism (rate, days per employee, lost FTE, direct and indirect cost, cost per rate point, Bradford factor with bands; `mode=absence`), span of control (span, management ratio, layers, management cost, target-span managers and cost delta; `mode=span`), labor efficiency (efficiency, variance, labor cost per unit, units and revenue per hour, labor %, revenue per employee; `mode=efficiency`, also takes `workforce-capacity-calculator`). Engine `src/lib/payroll/workforce-planning.ts` (12 tests); article generated; BLS JOLTS + CPS absence table cited. `FTECalculator` is single-mode again and links to the plan. Three draft components + SEO deleted; HR hub features the suite. |
| ~~`hiring-metrics-calculator`~~ **done Nov 16 2026** | time-to-hire, time-to-fill, recruiting-roi, cost-of-turnover, replacement-cost, training-cost | Published as `HiringMetricsSuite`, four tabs: time to fill & funnel (six stages → time to fill / time to hire / days to start, slowest controllable stage, vacancy cost per role and per day saved, funnel pass-through, offer acceptance, applicants and interviews per hire; `mode=time`), source ROI (external spend + internal cost spread by hires, cost per hire vs cost per retained hire, best / dearest source, ROI and payback; `mode=sources`), cost of turnover (separation + vacancy + recruiting + onboarding + ramp-up per leaver, % of salary, annual cost, saving from a lower rate; `mode=turnover`, also takes `replacement-cost-calculator`, previously parked on employee-turnover), training cost (participant time + programme costs, per participant / per hour, % of payroll, ROI and payback; `mode=training`). Engine `src/lib/payroll/hiring-metrics.ts` (13 tests); article generated; BLS JOLTS cited. Six components + SEO deleted; cost-per-hire and employee-turnover pages link to it; HR hub features it. |
| ~~`freelance-pricing-calculator`~~ **done Nov 16 2026** | project-pricing, consultant-fee, retainer, profit-per-client, time-value, monthly-revenue, agency-margin (+ client-profit, proposal-price, quote, estimate, which had been parked on billable-hours) | Published as `FreelancePricingSuite`, five tabs: project quote (task lines, contingency, expenses with markup, discount, sales tax, deposit; effective rate, overrun what-if and cushion; `mode=project`), day rate card (income + expenses + margin over billable days → hourly / half day / day / week / month, multiple of the equivalent wage, value per minute; `mode=rate`), retainer (fee, overage, effective rate at expected usage, break-even usage, 50–150% usage table; `mode=retainer`), client profit (profit, margin and effective rate per client, recurring share, concentration, below-cost flag, net after overhead; `mode=clients`), agency margin (cost per billed hour after utilization, gross and net margin, markup, multiplier, bill rate or utilization for a target; `mode=agency`). Engine `src/lib/pricing/freelance-pricing.ts` (12 tests); article generated; first published page in the Freelancer & Agency category. Twelve components + SEO deleted (incl. the unused `BillableRateCalculator`); billable-hours and freelance-hourly-rate pages link to it. |
| ~~`fiverr-fee-calculator`~~ **done Nov 16 2026** | — | Published, rewritten with three tabs: seller earnings (20% on gig + extras + tip, reverse price ÷ 0.80 with the add-20% shortfall, monthly / annual net, effective hourly, withdrawal fee input), buyer cost (5.5% + small-order fee, fee on tips, order-size table), Fiverr vs Upwork (same job on both fee models, client cost, platform take, quote to keep a target). The "Upwork mode" is the comparison tab, not a second Upwork calculator, so it does not compete with the published `upwork-fee-calculator`. Engine `src/lib/pricing/platform-fees.ts` (10 tests); every fee is an editable setting because the draft's buyer fee ("5% + $2.50") was wrong and Fiverr's small-order fee has changed twice ($2 < $50 → $2.50 < $75 → $3 < $100). **Also corrected the live Upwork page**: its meta title said "Sliding Scale Fees" and described the 20/10/5 tiers (ended 2023) and a flat 10% (ended May 2025); registry meta, four article rows/FAQs and the component banner + presets now say 0%–15% per contract, Direct Contracts 5% / 0%, client fee 3–5% Basic. **Fee facts come from search extracts of the platforms' own pages; the pages return 403 to automated fetches — owner should eyeball a real Fiverr checkout and the Upwork help article once.** |
| ~~`invoice-calculator` → **Invoice Generator**~~ **done Nov 16 2026** | — | Published at `/calculators/invoice-generator` (`invoice-calculator` 301s to it). From / bill-to blocks, optional logo (read locally, PNG/JPG/GIF/WebP ≤ 300 KB), invoice number with "Next invoice" auto-increment, date + Net 7/15/30/45/60 or custom due date, 11 currencies, up to 40 line items with per-line taxable flag, percent or fixed discount spread across lines before tax, sales tax / VAT / GST / HST added or included in prices, shipping, deposit → balance due, payment instructions and notes. Live preview in a sandboxed iframe; Print / Save as PDF through the browser print dialog and Download HTML (same approach as the pay stub, no PDF library, nothing uploaded, no branding on the invoice). Saved invoices go to the browser history panel. Engine + renderer `src/lib/pricing/invoice.ts` (15 tests incl. HTML escaping and logo URL validation); article generated from it; IRS Pub 583 + state tax agency directory cited. |
| ~~**Financial Statements** suite~~ **done Nov 16 2026** | journal-entry, trial-balance, balance-sheet, cash-flow-statement, pnl | Published as `financial-statements-calculator` (`FinancialStatementsSuite`). One ledger drives five tabs, so state lives in the suite, not per tab: an editable chart of accounts with type, prior and current balance (the trial balance; contra accounts as negative assets; error hints for transposition, wrong side and omitted balance; `mode=trial`), two-line journal entries with accounting-equation effect and rejection reasons (`mode=journal`), multi-step income statement with margins and EBITDA (`mode=income`), classified comparative balance sheet with retained-earnings roll-forward and ratios (`mode=balance`), indirect-method cash flow statement that reconciles to the cash accounts (`mode=cashflow`). Three live checks on every tab: debits = credits, A = L + E, cash flow reconciles. Engine `src/lib/pricing/financial-statements.ts` (16 tests); article generated from the example ledger; IRS Pubs 583 and 538 cited. Five components + SEO deleted; financial-ratio, depreciation and cash-flow-forecast pages link to it. Not modelled: compound (multi-line) entries, closing entries as a step, the direct method, statement of equity as its own tab. |
| ~~`vat-calculator` + `gst-calculator`~~ **done Nov 16 2026** | — | One page, `vat-calculator`, titled "VAT & GST Calculator"; `gst-calculator` 301s to it with `?country=au`. Presets for 40 countries in `src/lib/pricing/vat.ts`: the 27 EU members plus UK, Norway, Switzerland, Iceland, Turkey (standard / reduced / super-reduced from the Tax Foundation table as of January 2026), Canada with all 13 provinces and territories (GST / HST / PST / RST / QST shown as separate components), Australia, New Zealand, India (5 / 18 / 40 after the Sept 2025 reform), Singapore, Japan, South Africa, UAE. Add / remove toggle, rate chips + custom rate, local currency, VAT fraction, per-rate or per-province table; second tab estimates a VAT / GST return (output − input tax, refund case). 13 engine tests incl. rate spot-checks; article tables generated from the same data; Tax Foundation, GOV.UK and CRA cited. **Rates need a yearly review** — next check January 2027. |
| Hold as drafts | amortization, runway, budget, unit-economics, operating-cash-flow | Publish only with a differentiated angle |
| ~~**Delete**~~ **done Nov 16 2026** | compensation-ratio, engagement-score, hr-roi, salary-benchmark (no data source), diversity-ratio, promotion-rate, internal-mobility, employee-lifetime-value | Eight draft entries removed from `hr-analytics.ts` with their components, SEO files and component-map lines (16 files). They were never published, so their URLs were already 404 and stay 404; no redirects. HR Analytics has no drafts left. |
| **Re-evaluate after 90 days of GSC data** | Phase 12 accounting pages: book-value, fixed-asset, cost-allocation, overhead-rate, manufacturing-cost, operating-expense-ratio, accounts-receivable-days, accounts-payable-days | Cut or merge into the Financial Statements suite if zero impressions |

**Phase 17 cleanups (Nov 16 2026)**

- [x] Dead leftovers of merged pages: 30 slugs merged before Phase 17 still had a component, a component-map line and an SEO file that nothing rendered. Removed all three for each (60 files, 30 map lines); the registry entries stay because they generate the redirects. Each component was checked for other importers first. No merged slug has a component or SEO file any more.
- [x] US spelling: 111 British spellings in 39 files changed (annualised, normalise, modelled, favourable, judgement, neighbour, fortnight, licence and others), including the `realisedDiscountPct` identifier, renamed everywhere to `realizedDiscountPct`. New content should use US spelling.

---

## Phase 18: Distribution & monetization groundwork

> Code side done Nov 16 2026. What remains is outreach, posting and account settings, which only the owner can do: see `docs/distribution-kit.md`.

- [x] **Embed that earns links** (Nov 16 2026): the Embed button's code is now an iframe plus a visible one-line credit on the host page ("*Title* by QuickBizCalc"), built by `src/lib/embed.ts`. Credit links point at the canonical `www` URL with `?ref=embed`; the embed page's own footer link does too and no longer strips the referrer, so embed visits show up in GA by URL and referrer. **The credit link is `rel="nofollow"`**: Google's link-spam policy counts followed links shipped inside widgets as unnatural, and the site is recovering from a spam update. One constant (`EMBED_LINK_REL`) changes it. The modal no longer says the embed is "ad-supported", and the AdSense script is no longer loaded on the embed route (`AdSenseLoader`). "White-label without link" as a paid option: later.
- [ ] Outreach list (50): HR blogs, bookkeeping firms, staffing agencies, community-college business programs. **Owner task.** Target criteria, search operators and the email template are in `docs/distribution-kit.md` §2. The co-branded template depends on 16.3, which is not built.
- [ ] Reddit/Quora: answer with a **pre-filled result URL**, never a bare link. **Owner task.** Rules of thumb and the URL parameters are in `docs/distribution-kit.md` §3; note that r/personalfinance restricts self-promotion.
- [x] **Newsletter wired to Resend** (Nov 16 2026). Found while doing this: production is Vercel, whose filesystem is read-only, so every sign-up since the move had been silently dropped while the form said "Subscribed! Check your inbox". Now `api/newsletter` saves the address as a Resend contact (and into `RESEND_SEGMENT_ID` when set), falls back to emailing the owner, and returns an error instead of a false success if nothing stored it. Honeypot field against bots. Welcome email only when `RESEND_FROM` (a verified sender) is set. Logic in `src/lib/server/newsletter.ts` with tests. **Copy made honest**: removed "Join 2,000+" (there were no stored subscribers), "one tip every Tuesday at 7:00 AM ET", the three dated "sample issues" and the eight "upcoming topics"; the form and `/newsletter` now promise only an occasional email, at most monthly, when payroll figures or deadlines change. Privacy policy now discloses newsletter, contact and feedback data and the email provider.
  - [ ] **Owner:** verify the domain in Resend, create a segment, set `RESEND_SEGMENT_ID` and `RESEND_FROM` in Vercel, then send the first issue (steps and an issue outline in `docs/distribution-kit.md` §1).
- [x] **Feedback and newsletter storage** (Nov 16 2026), replacing the SQLite plan, which assumed a server with a disk (`bun:sqlite`); Vercel has none. Feedback: comments and thumbs-down votes are emailed to the owner (`api/feedback`, slugs validated against the registry, HTML escaped); a bare thumbs-up is only logged. That makes feedback readable today without a database. The contact form now escapes what visitors type and validates lengths. Shared helper `src/lib/server/mailer.ts`.
  - [ ] Private `/admin/feedback` view: needs a hosted database (Vercel Postgres, Neon or similar) and credentials. Only worth doing once feedback volume makes email unwieldy; pair it with event tracking in Phase 19, which is the better place to count votes.
- [ ] AdSense: re-apply only after Phases 13–15 are live for ≥4 weeks and GSC shows re-indexing. **Owner task**; checklist in `docs/distribution-kit.md` §4. Ad script is out of the embed route; there are still no manual ad slots, so nothing sits above the fold.
- [x] ~~Found, not fixed: Google Analytics and AdSense loaded twice (root layout for everyone, `Scripts` again after consent).~~ Fixed in Phase 19: one loader plus Consent Mode v2.
---

## Phase 19: Measurement loop

> Code side done Nov 16 2026. Three settings are the owner's: a Search Console service account, four GA4 custom dimensions, and (optionally) a Clarity project ID. Steps for each are in `docs/measurement.md`.

- [x] **GSC API pull** (Nov 16 2026): `npm run gsc:pull` writes `data/gsc/<date>.json` and a Markdown report joined with the registry (pages barely seen, striking distance, first-page results nobody clicks, merged URLs still shown, URLs the registry does not know, change since the previous pull). No dependencies: service-account JWT signed with Node's crypto. `.github/workflows/gsc-weekly.yml` runs it every Monday and attaches the report to the run; it skips itself until the `GSC_SERVICE_ACCOUNT_JSON` secret exists. **Not run against the real property yet**: there are no credentials on this machine, so the first real pull is the test of the API calls (the report logic is unit-tested).
  - [ ] **Owner:** create the service account, add it to the Search Console property, run the first pull (`docs/measurement.md` §1).
  - Drafts return 404, so GSC can never say anything about the 13 remaining drafts. That decision needs keyword research, not this report.
- [x] **Clarity placeholder removed** (Nov 16 2026). Clarity now loads only when `NEXT_PUBLIC_CLARITY_ID` is set and the visitor has explicitly allowed analytics. No ID is set, so it is off.
  - [ ] **Owner, only if you want Clarity:** create the project, add a Clarity paragraph to the privacy and cookie policies (neither mentions it), then set the variable in Vercel.
- [x] **Event tracking** (Nov 16 2026): 15 events through one helper, `track()` in `src/lib/analytics.ts`, fired from the shared components so no calculator carries tracking code: `calc_start`, `calc_save`, `history_restore`, `try_example`, `mode_change`, `share`, `copy_result`, `print`, `pdf`, `embed_open`, `embed_copy`, `feedback`, `pay_stub`, `invoice_export`, `newsletter_signup`. Each carries the calculator slug and whether it fired inside an embed; none carries anything a visitor typed. The print dialog's "Official Report" heading became "Calculation Summary" while there (nothing official about it).
  - [ ] **Owner:** register `calculator`, `mode`, `tool` and `embedded` as event-scoped custom dimensions in GA4, or the parameters cannot be used in reports (`docs/measurement.md` §2).
- [x] **Consent fixed while wiring events** (Nov 16 2026). GA and AdSense were loaded twice: by the root layout for every visitor whatever the banner said, and again by `Scripts` after consent, which double-counted page views for everyone who accepted. Now one loader with Google Consent Mode v2 (`src/lib/consent.ts`): denied by default in the EEA, UK and Switzerland, granted elsewhere until the visitor rejects. **Expect GA page views to drop on deploy**: that is the double count ending.
- [x] **Lighthouse CI on 5 flagship URLs, failing on mobile LCP > 2.5 s** (Nov 16 2026): new `lighthouse` job in `ci.yml`, analytics-off build (`NEXT_PUBLIC_DISABLE_ANALYTICS=1`), median of 3 mobile runs, budgets in `lighthouserc.json`: LCP ≤ 2.5 s, CLS ≤ 0.1 and total page weight ≤ 900 kB fail the job; TBT ≤ 600 ms warns. Run locally with the same tool (Lighthouse CI 0.16.1, Lighthouse 13): LCP 1.2–1.4 s, CLS 0, weight 523–706 kB, performance score 93–100 on all five pages.
  - Measuring found four real problems, all fixed: (1) every calculator page downloaded every calculator, because the component map was imported by a Server Component and its `dynamic()` calls split nothing; it now goes through the client component `CalculatorRenderer`. (2) The header shipped the whole registry on every page; the search dialog now loads on first use (`SearchDialog.tsx`). (3) The home page was invisible until hydration (framer-motion `opacity: 0` on the page wrapper and hero). (4) On phones the cookie banner was the largest text block on some pages, so its late appearance counted as the page's LCP; phone copy is now two lines. `bundle-boundaries.test.ts` guards (1) and (2). Before and after, same tool (Lighthouse 12, one laptop):

    | Page | JS downloaded | LCP (Lighthouse 12) |
    |---|---|---|
    | Home | 899 kB → 379 kB | 5.4 s → 3.6 s |
    | Hourly paycheck | 882 kB → 419 kB | 7.6 s → 4.3 s |
    | Texas paycheck | 882 kB → 407 kB | 7.6 s → 4.1 s |
    | $20 an hour | 372 kB → 347 kB | 4.3 s → 3.5 s |
    | Payroll & taxes hub | 872 kB → 336 kB | 9.0 s → 3.3 s |

  - Lighthouse 12 and 13 estimate LCP differently (3.3–4.3 s against 1.2–1.4 s for the same build). CI pins the Lighthouse CI version; never compare numbers across versions. The old build was not measured with Lighthouse 13.
  - [ ] **Not verified on GitHub's runner or against production.** Read the first CI run, and run PageSpeed Insights on one calculator page after the next deploy.
  - [ ] **Still slow** (not started; details in `docs/measurement.md` §4): pages take about 4 s to become interactive on an emulated phone and download 340–420 kB of JavaScript. Biggest levers: make `AppShell`/`Header`/`Footer` Server Components, take framer-motion out of the shell and article layout, drop the animated blurred background shapes on phones, shrink the calculator page's 520 kB HTML.
- [ ] Found, not fixed: the CSP has no `frame-src` for Google's ad domains, so ad iframes would be blocked once AdSense is approved. Fix together with ad placement.
- [ ] Found, not fixed: the home page badge says "2026 IRS & FLSA Verified". Nothing on the site is verified by the IRS or the Department of Labor; by the same rule as the newsletter copy it should say what is true (for example "2026 IRS & FLSA figures"). Left for the owner because it is the home page's headline claim.

---

## Phase 20: Later / only if 13–19 show recovery

- [ ] Accounts (save scenarios across devices, employer dashboards) — needs the SQLite/Postgres step first. **Not started (Nov 17 2026), on purpose**: Phases 13–19 are not deployed yet, so there is no recovery to point to, and there is no database (Vercel has no disk). Needs an owner decision on a hosted database and a sign-in method first. Share links already carry a full scenario between devices.
- [ ] Paid tier: white-label embed, bulk payroll CSV > 25 rows, API access to `calculatePaycheck`. **Not started (Nov 17 2026), on purpose**: needs accounts, a payment provider and prices, and traffic to sell to. Revisit when Search Console shows the recovery and the embed and bulk events in GA show who uses those features.
- [x] **2027 tax year** (Nov 17 2026): `withholding-2026.ts` became `src/lib/payroll/withholding/`: `engine.ts` (math and types, no tax figure), `2026.ts`, `2027.ts` (one `TaxYearDefinition` each) and `index.ts` (the switch: `TAX_YEAR`, `SELECTABLE_TAX_YEARS`, `calculatePaycheck` with an optional `taxYear`). The refactor changes no 2026 number: the new engine was compared with the old one over 20,736 paychecks (every state, filing status, W-4 variant and pre-tax combination) and matched exactly.
  - **2027 preview is live on the paycheck calculators**: a "Tax year: 2026 | 2027 preview" switch on the hourly paycheck calculator, the payroll calculator and the 30 state pages; `?year=2027` in share links; the pay stub, employer view, reverse solver and scenario compare follow the selected year. Everything else (articles, titles, salary pages, bulk payroll, labor cost) stays on 2026.
  - **What the preview rests on**: federal brackets and standard deductions from IRS Rev. Proc. 2026-35 (Nov 5 2026, final); the withholding method from the IRS early-release draft of the 2027 Publication 15-T (Nov 9 2026), whose tables are replayed row by row in `2027.test.ts` and match to the cent; Social Security wage base $192,300 (SSA, Federal Register 2026-21796, final). Example: $25/hr single in Texas takes home $68 more a year in 2027.
  - **What is not 2027 yet, and says so on the page**: no state had published 2027 withholding figures on Nov 17 2026, so all 30 states run their 2026 rules; the Form W-4 Step 3 child amount ($2,300) is the 2027 child tax credit because the draft form leaves it blank; employer-side state unemployment and FUTA credit-reduction figures are 2026. A result for 2027 carries a note listing exactly these, with links to the three sources. The tests refuse a state that claims to be published while running the carried-over rule, and refuse a site default year whose federal figures still rest on a draft.
  - [ ] **Owner, as figures publish** (checklist in `docs/tax-year-rollover.md`): final Publication 15-T and Form W-4 for 2027 (usually December); each state's 2027 withholding (usually December and January); 2027 state unemployment rates and wage bases.
  - [ ] **Owner, January**: move the site to 2027. `TAX_YEAR` is one line, but the 2026 facts in state pages, registry titles, SEO files and the nine standalone tax calculators have to be updated first (`docs/tax-year-rollover.md` §4).
  - To hide the preview: set `SELECTABLE_TAX_YEARS` to `[2026]` in `withholding/index.ts`.
  - [ ] Found, not fixed: the "Share Calculation Link" buttons call `navigator.clipboard.writeText()` without handling a rejection and show "Share Link Copied!" regardless. Inside a cross-origin embed, or when the browser denies clipboard access, the copy fails silently while the button says it worked (the address bar is still updated).
  - [ ] Found, not fixed: the employer panel still says California's FUTA credit reduction is "potential" and that the final list is set after November 10, 2026. The final list was not findable on Nov 17 2026; check the DOL page and update `FUTA_CREDIT_REDUCTION` and the wording when it is out.

---

## Suggested execution order (one PR each, build + tests green)

1. **14.3 tests + CI** (so everything after is checked)
2. **13.3 known defects + 15.2 merge chains**
3. **14.1 / 14.2 registry split + typed SEO data**
4. ~~**13.1 / 13.2 author, review dates, linked sources**~~ — done Nov 6 2026 (organisation-level authorship by owner decision)
5. ~~**15.3 state-page differentiation**~~ — done Nov 6 2026 (remaining 20 states + DC deferred until these 30 are re-indexed)
6. ~~**15.1 thin-page merges**~~ — done Nov 6 2026 (8 slugs merged into 5 pages; 94 published calculators)
7. ~~**14.4 cleanup**~~ — done Nov 6 2026 (lint clean + blocking in CI, dead files removed; lockfile choice still with the owner)
8. Request re-indexing in GSC; wait for data
9. ~~**16.1 flagship features**~~ — done Nov 6 2026 (employer toggle, reverse solver, scenario compare, W-4 Steps 2–4, pay stub, bulk payroll)
10. **17 suites**, one per PR, demand-checked
11. ~~**18 / 19**~~ — code side done Nov 16 2026 (owner tasks listed in each phase)
12. **20**: 2027 tax year done Nov 17 2026 (engine split by year, 2027 preview on the paycheck calculators). Accounts and the paid tier are deliberately not started; they wait for measured recovery and owner decisions on a database and payments.
