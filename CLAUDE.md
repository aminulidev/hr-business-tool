# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

QuickBizCalc (`www.quickbizcalc.com`) — a Next.js 16 App Router site of ~100 published US business/HR/payroll calculators, built for SEO traffic and AdSense. There is no README; `TODO.md` is the running project log (phases completed, GSC metrics, what each phase touched) and is the best place to understand recent work and intent.

## Commands

```bash
npm run dev      # next dev on :3000, output tee'd to dev.log (dev.log is tracked — don't commit noise from it)
npm run build    # next build — TypeScript errors fail the build (ignoreBuildErrors: false)
npm run lint     # eslint . — clean and blocking in CI; the react-hooks compiler rules (set-state-in-effect, preserve-manual-memoization) are enforced
npm test         # vitest run — ~190 tests, ~3s
npm run test:watch
npm run start    # next start (production is Vercel, which ignores this script)
```

`npm test` runs Vitest (payroll engine golden tests, registry invariants, generated-content agreement, sitemap). `npm run build` is the second gate: it runs `generateStaticParams` for every published calculator, category hub, and salary page, and type-checks everything including test files. CI (`.github/workflows/ci.yml`) runs tests, lint and build on every PR, all blocking. Three lockfiles exist (bun, pnpm, npm) and must be kept in sync after dependency changes (`pnpm install --lockfile-only`, `bun install --lockfile-only`) — production deploys on Vercel and a stale lockfile breaks the install.

Production sits behind Caddy (`Caddyfile`, port 81 → localhost:3000). `.env` holds `RESEND_API_KEY` (contact form) and `DATABASE_URL` (currently unused — there is no DB; feedback/newsletter append to `data/*.jsonl`).

## Architecture: the calculator registry drives everything

`src/lib/registry/` is the single source of truth (`src/lib/calculator-meta.ts` is a re-export shim kept for the 30-odd existing importers). Entries live in `registry/calculators/<category>.ts`, wrapped in `defineCalculators([...])` so each `slug` keeps its literal type; `registry/index.ts` concatenates them and derives `CalculatorSlug` from the data, so there is no hand-maintained slug union. Every entry has SEO fields, `category` (must be in `categoryOrder`), `tier`, and a `status`:

- `published` — live, in sitemap, statically generated.
- `draft` — exists in registry but returns 404 (`dynamicParams = false`, so unknown/draft slugs are real 404s).
- `scheduled` — live once `publishDate` passes.
- `merged` — absorbed into another page; `mergedInto` is required and `mergedQuery` (e.g. `mode=breaks`) is optional. `next.config.ts` auto-generates 301 redirects from merged slugs to their target, appending `?mergedQuery` so the visitor lands on the right tab; the target component reads it from `window.location.search` in a `useEffect` (see `TimeCardCalculator`, `ShiftSchedulePlanner`, `PTOAccrualCalculator`, `BusinessDayCalculator`, `FTECalculator`). Component file names are case-sensitive on Vercel — `FTECalculator.tsx`, `PTOAccrualCalculator.tsx`.

Helpers `isCalculatorPublished`, `getPublishedCalculators`, `resolveMergedCalculator`, and `getLiveRelatedTools` are used by the sitemap, hub page, search, category hubs, and related-tools lists so nothing links to a dead page.

### Adding or publishing a calculator — four places must agree

1. **Registry**: add/flip the entry in the matching `src/lib/registry/calculators/<category>.ts`. The slug type updates automatically.
2. **Component**: `src/components/calculators/<Name>Calculator.tsx` (client component).
3. **Component map**: add `slug → dynamic(() => import(...))` to `src/lib/registry/components.tsx`. It is the only map; both the page and embed routes read it. Keys are type-checked against `CalculatorSlug`, and `registry.test.ts` fails if a published slug has no entry.
4. **SEO content**: `src/lib/seo-data/<slug>.ts` ending in `} satisfies CalculatorSeoData;` (type in `seo-data/types.ts`). The page does `await import(\`@/lib/seo-data/${slug}\`)` at render time; if the file is missing the calculator renders bare. `relatedTools[].slug` must be a registry slug and `relatedTools[].icon` an `IconName` from `src/lib/registry/icons.ts`; add new icons there. `sources` (optional) lists the primary publications the page relies on, picked from the shared constants in `seo-data/sources.ts` (`SRC.irsPub15T`, `SRC.dolOvertime`, …); it is required by the tests for every published Payroll & Taxes calculator, and the Sources section is simply not rendered when a page has none — do not add decorative sources to pure business-math pages.

`npm test` checks all four agree. `npx tsc --noEmit` catches slug/icon typos before the build does.

### Trust layer (author, review dates, sources)

`src/lib/authors.ts` attributes every page to the "QuickBizCalc Editorial Team" as an Organization (owner decision, Nov 2026: no named person on the site, and never an invented person or credential). `getAuthor(calc.author)` feeds the `Byline` component (`src/components/seo/Byline.tsx`: "By · Reviewed · Tax year") under every calculator, salary page and blog H1, plus JSON-LD (`authorJsonLd` returns an Organization, or a Person only for a `kind: 'person'` entry added for a real, consenting reviewer). There is no `/authors` route; bylines link to `/editorial-policy#who`. Registry entries may carry `lastReviewed` (YYYY-MM-DD) and `reviewNotes`; set them only when the math has actually been verified (today: the 32 engine-backed paycheck pages), never in bulk — `registry.test.ts` rejects future dates and dates without notes. `/editorial-policy` explains who the team is, what "Reviewed" means and the correction policy, and is in the sitemap.

### Page composition

`/calculators/[slug]/page.tsx` → `AppShell` → `CalculatorLayoutServer` (server component: breadcrumbs, TOC, article sections, FAQ/HowTo/WebApplication/Breadcrumb JSON-LD, related tools) → `<CalculatorComponent />` (client). `CalculatorLayoutServer.tsx` is the only layout (the old client-side `CalculatorLayout.tsx` was deleted).

`generateMetadata` uses `metaTitle` when set; titles over 48 chars are emitted as `{ absolute }` so the root layout's `| QuickBizCalc` template isn't appended twice. Every page sets its own canonical; the root layout intentionally does not.

### Calculator component conventions

Nearly every calculator follows the same pattern (see `HolidayCountdownCalculator.tsx` for a minimal example):

- `'use client'`, local `useState` inputs, `useMemo` result, framer-motion reveal.
- `useCalcHistory(slug)` (localStorage, 15 entries) + `<CalcHistoryPanel>` at the bottom; `saveEntry(inputs, summary)` on calculate.
- `<TryExample onClick>` button; many also use `<ComparePanel>`.
- Result container carries class `result-display` — `MobileResultSheet` watches it for the floating "View Breakdown" bar and `ResultActions` (print/copy/share/embed) reads from `.calculator-form` / `.result-display`. Keep these classes.
- Flagship calculators compute live on load rather than waiting for a Calculate click (TODO.md phases 1 & 4 list which ones); new work should follow that pattern.
- Paycheck-type calculators read/write URL query params (`?rate=&hours=&ot=&state=&freq=&status=`) for shareable links. Never copy the URL into state inside a `useEffect` (the `react-hooks/set-state-in-effect` rule fails lint): the default export calls `useInitialQuery()` from `src/hooks/useSearchParam.ts` and renders the form keyed on the query string with pre-computed `defaults`; a single tab/mode param uses `useSearchParam('mode')` with an `override ?? urlValue` pattern. Results are derived with `useMemo` from a pure `computeX()` function, never set in an effect.

### Payroll engine (shared tax math)

`src/lib/payroll/withholding-2026.ts` is the one place for federal brackets, standard deductions, FICA, and per-state withholding (`calculatePaycheck`, `StateCode`, `TAX_YEAR`). `HourlyPaycheckCalculator` (also rendered as `PayrollCalculator` in salary mode), `StatePaycheckCalculator` (one component, `state` prop, serves all 30 state slugs), and `/salary/[slug]` pages all use it. Only a few components import this engine; the standalone tax calculators (`AfterTaxIncome`, `SalaryTax`, `FederalTax`, `IncomeTax`, `Calculator1099`, `TaxRefund`) each carry their own copy of the 2026 brackets and standard deductions. When tax figures change, update the engine and grep those components for the same numbers.

Adding a state: add withholding in `withholding-2026.ts` → add `STATE_PAYCHECK_PAGES[code]` in `state-pages.ts` (facts, hand-written FAQs, linked sources) **and** `STATE_DETAILS[code]` in `state-details.ts` (BLS median wage, neighbours, local minimum wages or pre-emption note, payroll programs, local income taxes, overtime and 2026-change bullets) → create `src/lib/seo-data/<state>-hourly-paycheck-calculator.ts` that just calls `buildStatePaycheckSeo(code)` (worked examples, reference table and neighbour comparison are generated from the real engine so article numbers always match the calculator) → register slug in `registry/calculators/payroll-taxes.ts` and `registry/components.tsx` as `() => <StatePaycheckCalculator state="XX" />`. `state-pages.test.ts` fails if any FAQ, bullet, note or example title is shared between two states, so every state needs its own wording.

### Other programmatic page families

- `/category/[slug]` — pillar hubs from `src/lib/category-hubs.ts` (`CATEGORY_HUBS`); calculator breadcrumbs point here when a hub exists for the calculator's `category`.
- `/salary/[slug]` — wage/salary breakdown pages from `src/lib/salary-pages.ts` (`HOURLY_TIERS`, `ANNUAL_TIERS`, `buildSalaryPageData`).
- `/blog/[slug]` — markdown in `src/content/blog/*.md`, parsed with gray-matter + marked in `src/lib/blog.ts`; frontmatter `date` is the only `lastModified` the sitemap emits.
- `/calculators/[slug]/embed` — chrome-less iframe version; `next.config.ts` gives it `frame-ancestors *` while every other route gets `SAMEORIGIN`.
- `/api/og` — dynamic OG images used by calculator, category, and salary metadata.

`src/app/sitemap.ts` and `src/app/robots.ts` are generated from the registries above; don't hand-edit URLs into them.

## SEO/AdSense constraints that shape code decisions

The site's purpose is organic ranking and AdSense approval, so changes that look cosmetic can matter:

- Never add a root-level canonical, re-add `X-Frame-Options` to the embed route, or disallow `/_next/` in robots — each of these was a past GSC/AdSense blocker (see TODO.md).
- Tax figures, holiday dates, and minimum wages are stated as 2026 facts in SEO copy; keep `TAX_YEAR` and article content consistent when updating numbers.
- `CONFIG` in `src/lib/config.ts` only exposes GA/Clarity IDs in production; AdSense ID is always present for the verification meta tag.

## Tooling notes

- Path alias `@/*` → `src/*`. shadcn/ui (new-york style) components live in `src/components/ui`; Tailwind v4 via `@tailwindcss/postcss` with CSS variables in `src/app/globals.css`.
- The registry category files run 200–1,200 lines each and `seo-data/` has ~245 files; grep by slug rather than reading whole files.
- Work happens on branch `aminul` and is merged to `master` via PR.
