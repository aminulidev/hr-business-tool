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
- [ ] Fix the 10 pre-existing lint errors (`react-hooks/set-state-in-render`, `react-hooks/preserve-manual-memoization`) in DiscountCalculator, FeedbackWidget, HourlyPaycheckCalculator, MarkupCalculator, OvertimeCalculator, ROICalculator, SalaryBreakdownInteractive, SalesCommissionCalculator, StatePaycheckCalculator, TimeCardCalculator, TimeCardLunchCalculator, WagesCalculator; then make the CI lint step blocking.
- [x] `CalculatorLayout.tsx` deleted (PR 3).
- [ ] Delete `src/app/api/route.ts` (hello world) and `tailwind.config.ts` (Tailwind v4 is configured in `globals.css` `@theme`). Lockfiles: keep all three in sync (`pnpm install --lockfile-only`, `bun install --lockfile-only`) until the owner confirms which package manager Vercel uses, then delete the other two.
- [ ] `next.config.ts`: add `output: 'standalone'` (start script already expects it) or change the start script. Remove `DRAFT_TARGET_FALLBACK` once 14.3 forces valid merge targets.
- [ ] `.env`: drop unused `DATABASE_URL` or adopt SQLite (see 18).

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
- [ ] **Employee ↔ Employer toggle**: show employer-side cost (FICA match, FUTA, SUI at the state new-employer rate) — no major free competitor shows both sides on one screen.
- [ ] **Pay stub preview + PDF** that looks like a real stub (YTD columns, employer/employee sections). Print-ready. The #1 useful artifact for small employers and job seekers.
- [ ] **Scenario compare** (A/B): two paychecks side by side (raise, move state, change 401k %). Reuse `ComparePanel`, persist both in the URL.
- [ ] **Reverse solver**: "I need $X take-home → what gross?" via bisection on `calculatePaycheck`.
- [ ] W-4 2026 Step 2/3/4 inputs (multiple jobs, dependents credit, other income) — PaycheckCity has these; we don't.
- [ ] Bulk mode: paste up to 25 employees (CSV) → gross-to-net table + CSV download. Small-business hook; no competitor offers it free.

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
| `financial-ratio-calculator` (new) | roe, roa, debt-ratio, current-ratio, quick-ratio, interest-coverage, asset-turnover, financial-ratio | One page, tabs by ratio family, benchmark table by industry |
| `inventory-planning-calculator` (new) | inventory-turnover, holding-cost, eoq, safety-stock, reorder-point, cash-conversion-cycle | One suite |
| `inventory-valuation-calculator` | fifo, lifo, weighted-average (already merged in) | Publish — fixes 3 broken merge targets |
| `profit-margin-calculator` (exists) | net-margin, operating-margin, contribution-margin, selling-price, wholesale-price | Add as modes; delete drafts; repoint merges |
| `marketing-cost-calculator` (new) | cpl, cpa, cpm, cpc, marketing-roi, conversion-rate | One page, tabs; strong B2B CPC |
| `sales-forecast-calculator` (new) | revenue-forecast, sales-forecast, pipeline, win-rate, revenue-growth, customer-retention | One page |
| `commission-calculator` (exists) | tiered-commission, commission-split, quota, sales-bonus, incentive | Already has tiered/quota modes — add split & bonus; delete drafts |
| `startup-equity-calculator` (new) | startup-valuation, equity-dilution, cap-table, safe-note, option-pool, founder-equity-split | One suite — high-value niche with few good free tools |
| SaaS metrics (existing mrr/churn/ltv pages) | arr, expansion-mrr, ltv-cac-ratio, arpu, acv, gross-revenue-retention, mau-value, trial-conversion, saas-pricing | Fold into existing pages as modes; delete drafts |
| `labor-cost-calculator` (new, standalone) | labor-cost, team-cost, hr-budget, employee-cost (merge target) | Publish — pairs with the employer-side paycheck view (16.1) |
| `workforce-planning-calculator` (new) | workforce-planning, headcount (15.1), absenteeism, span-of-control, labor-efficiency | Suite; fixes 3 merge targets |
| `hiring-metrics-calculator` (new) | time-to-hire, time-to-fill, recruiting-roi, cost-of-turnover (merge target), training-cost | Suite |
| `freelance-pricing-calculator` (new) | project-pricing, consultant-fee, retainer, profit-per-client, time-value, monthly-revenue, agency-margin | Suite; fixes 4 merge targets |
| `fiverr-fee-calculator` | — | Publish standalone (branded query with real demand); add Upwork mode |
| `invoice-calculator` → **Invoice Generator** | — | Publish as a real tool (line items, tax, PDF) — genuinely useful, link-worthy |
| **Financial Statements** suite (new) | journal-entry, trial-balance, balance-sheet, cash-flow-statement, pnl | One suite for students/bookkeepers |
| `vat-calculator` + `gst-calculator` | — | One page with country presets; US sales-tax page already exists |
| Hold as drafts | amortization, runway, budget, unit-economics, operating-cash-flow | Publish only with a differentiated angle |
| **Delete** | compensation-ratio, engagement-score, hr-roi, salary-benchmark (no data source), diversity-ratio, promotion-rate, internal-mobility, employee-lifetime-value | Remove from registry; never indexed, no redirect needed |
| **Re-evaluate after 90 days of GSC data** | Phase 12 accounting pages: book-value, fixed-asset, cost-allocation, overhead-rate, manufacturing-cost, operating-expense-ratio, accounts-receivable-days, accounts-payable-days | Cut or merge into the Financial Statements suite if zero impressions |

---

## Phase 18: Distribution & monetization groundwork

- [ ] **Embed that earns links**: `EmbedModal` snippet includes a visible, non-iframe `<a href="…">Calculator by QuickBizCalc</a>` under the iframe; "white-label without link" becomes a paid option later. Track embeds via `?ref=embed` + referrer.
- [ ] Outreach list (50): HR blogs, bookkeeping firms, staffing agencies, community-college business programs — offer the embed + a co-branded template from 16.3.
- [ ] Reddit/Quora: answer with a **pre-filled result URL** (Phase 11 feature), never a bare link. r/personalfinance, r/smallbusiness, r/humanresources, r/Payroll.
- [ ] Newsletter: `api/newsletter` writes JSONL only — wire a Resend audience + a monthly "payroll changes" issue so the list has a reason to exist.
- [ ] `data/*.jsonl` → SQLite (`bun:sqlite` since production runs bun) so feedback/newsletter survive redeploys and can be queried. Add a private `/admin/feedback` view (basic auth) to actually read calculator feedback.
- [ ] AdSense: re-apply only after Phases 13–15 are live for ≥4 weeks and GSC shows re-indexing. Keep ad slots out of the embed route and the above-the-fold calculator area (CLS).

---

## Phase 19: Measurement loop

- [ ] GSC API pull (weekly script → `data/gsc/*.json`): impressions/clicks/position per URL. Drive 15.1/17 "cut or keep" decisions from this, not guesses.
- [ ] Microsoft Clarity ID is a placeholder (`XXXXXXXXXX`) — set it or remove the script.
- [ ] Event tracking on: calculate, share, embed-copy, PDF, history-restore, feedback. Know which features people use before building more.
- [ ] Core Web Vitals budget in CI (Lighthouse CI on 5 flagship URLs; fail on mobile LCP > 2.5s).

---

## Phase 20: Later / only if 13–19 show recovery

- [ ] Accounts (save scenarios across devices, employer dashboards) — needs the SQLite/Postgres step first.
- [ ] Paid tier: white-label embed, bulk payroll CSV > 25 rows, API access to `calculatePaycheck`.
- [ ] 2027 tax year: `withholding-2026.ts` → `withholding/{year}.ts` with a `TAX_YEAR` switch so both years coexist in January.

---

## Suggested execution order (one PR each, build + tests green)

1. **14.3 tests + CI** (so everything after is checked)
2. **13.3 known defects + 15.2 merge chains**
3. **14.1 / 14.2 registry split + typed SEO data**
4. ~~**13.1 / 13.2 author, review dates, linked sources**~~ — done Nov 6 2026 (organisation-level authorship by owner decision)
5. ~~**15.3 state-page differentiation**~~ — done Nov 6 2026 (remaining 20 states + DC deferred until these 30 are re-indexed)
6. ~~**15.1 thin-page merges**~~ — done Nov 6 2026 (8 slugs merged into 5 pages; 94 published calculators)
7. **14.4 cleanup**
8. Request re-indexing in GSC; wait for data
9. **16.1 flagship features**
10. **17 suites**, one per PR, demand-checked
11. **18 / 19**
