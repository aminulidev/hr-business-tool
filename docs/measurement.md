# Measurement

Working notes for Phase 19 of the roadmap in `TODO.md`. Four things are measured: what Google shows and what gets
clicked (Search Console), what visitors do on a page (Google Analytics events), how a session looks (Microsoft
Clarity, optional), and how fast the pages load (Lighthouse in CI). Sections 1 to 3 each need one setting from you
before they produce anything.

## 1. Search Console report

`npm run gsc:pull` downloads the last 28 days from Search Console and writes a report that joins the numbers with
the calculator registry. It answers the questions the roadmap keeps asking: which published pages nobody sees,
which are close to the first page, which are on the first page but not clicked, and which merged URLs Google still
shows.

### One-time setup (about ten minutes)

1. **Create a service account.** In the Google Cloud console, create a project (any name). Under *APIs & Services →
   Library*, enable **Google Search Console API**. Under *IAM & Admin → Service Accounts*, create a service
   account; it needs no roles. Open it, go to *Keys → Add key → Create new key → JSON*. A `.json` file downloads.
2. **Store the key outside the repository**, for example `C:\keys\gsc-key.json`. The repository ignores files
   named `*gsc-key*.json` and `*service-account*.json` as a safety net, but a key should not sit in the project
   folder at all.
3. **Give the service account access to the property.** In Search Console, open *Settings → Users and
   permissions → Add user*, paste the service account's email address (it ends in `gserviceaccount.com`) and
   choose **Restricted**. That is read-only. If the pull later fails with a 403, change it to Full.
4. **Run it.** In PowerShell, from the project folder:

   ```powershell
   $env:GSC_SERVICE_ACCOUNT_FILE = 'C:\keys\gsc-key.json'
   npm run gsc:pull
   ```

The script assumes a Domain property (`sc-domain:quickbizcalc.com`). If yours is a URL-prefix property, also set
`$env:GSC_SITE_URL = 'https://www.quickbizcalc.com/'`.

### What you get

| File | Contents |
|---|---|
| `data/gsc/<end-date>.json` | The raw pull: every page, every query, and page-and-query pairs. Not committed. |
| `data/gsc/report-<end-date>.md` | The report. Commit it if you want a history in the repository. |

Options: `npm run gsc:pull -- --days 90` for a longer window, `npm run gsc:pull -- --end 2026-11-10` for a window
ending on a given day, and `npm run gsc:report` to rebuild the report from the newest saved pull without calling
Google. When an earlier pull with the same window length is in `data/gsc`, the report shows the change in
impressions for each page.

The report's sections, and what each is for:

| Section | Use it to decide |
|---|---|
| By page family | Whether calculators, salary pages, category hubs or the blog carry the traffic. |
| Published calculators barely seen | Candidates to merge or cut. Wait for at least two pulls a month apart before cutting anything: a page that was just re-indexed shows little. |
| Striking distance (position 8 to 20) | Where an hour of work on the article or title is most likely to pay. |
| First-page results that few people click | Titles and descriptions to rewrite. |
| Merged pages Google still shows | Old URLs that have not been dropped yet. Normal for some weeks after a merge. |
| Calculator URLs the registry does not know | Deleted pages Google still lists; if one has real impressions, consider a redirect. |

Draft pages return 404, so Search Console can never show data for them. The 13 remaining drafts cannot be judged
from this report; that decision needs keyword research instead.

### Weekly, without your machine

`.github/workflows/gsc-weekly.yml` runs the same pull every Monday and attaches the report to the workflow run
(Actions → *Search Console weekly report* → the run → *Artifacts*, and the report is also printed on the run's
summary page). It skips itself until you add the key: in the GitHub repository, *Settings → Secrets and variables
→ Actions → New repository secret*, name `GSC_SERVICE_ACCOUNT_JSON`, value: the whole content of the key file.
For a URL-prefix property, add a repository *variable* named `GSC_SITE_URL`. The workflow commits nothing.

## 2. Events in Google Analytics

Every calculator reports the same events through one helper (`track()` in `src/lib/analytics.ts`), fired from the
shared components. No calculator has tracking code of its own.

| Event | Fires when | Extra parameters |
|---|---|---|
| `calc_start` | A visitor first edits an input on a calculator page (once per page view) | |
| `calc_save` | A calculation is saved to history | `tool` |
| `history_restore` | A saved calculation is restored | |
| `try_example` | The example button is used | |
| `mode_change` | A tab is chosen on a multi-mode page, or the tax year is switched on a paycheck calculator (`mode` is then `tax-year-2027`) | `mode` |
| `share` | The share link is copied | |
| `copy_result` | The result text is copied | |
| `print` | The result is printed | |
| `pdf` | The result is exported as PDF | |
| `embed_open` | The embed dialog is opened | |
| `embed_copy` | The embed code is copied | `tool` |
| `feedback` | A helpful / not helpful vote or a comment is sent | `helpful` (yes, no, none), `has_comment` |
| `pay_stub` | A pay stub is printed or downloaded | `action` |
| `invoice_export` | An invoice is printed or downloaded | `action` |
| `newsletter_signup` | A new address subscribes | `placement` |

Every event also carries `calculator` (the page's slug, or `none`) and `embedded` (true on the embed route). No
event carries anything the visitor typed.

**One-time setup in GA4**, otherwise the parameters are collected but cannot be used in reports: *Admin → Data
display → Custom definitions → Create custom dimension*, scope *Event*, once for each of `calculator`, `mode`,
`tool` and `embedded`. They apply from that day forward, not to earlier data.

Where to look: *Reports → Engagement → Events* for the counts; *Explore → Free form* with `Event name` as rows
and `calculator` as columns to see which calculators people actually use. The useful ratio is `calc_start`
divided by page views for a calculator: a page with traffic and few starts is being landed on and left.

To check that events arrive: open the site in a browser, then GA4 → *Admin → Data display → DebugView*, or
*Reports → Realtime*, and use a calculator.

## 3. Consent, and what loads when

The Google tag loads once per page, with Google Consent Mode v2. The cookie banner's choice is passed to Google as
consent signals instead of deciding whether the tag loads.

| Visitor | Before they choose | After "Reject" | After "Accept" |
|---|---|---|---|
| EEA, UK, Switzerland | Analytics and ad storage denied: no cookies | Denied | Granted |
| Everywhere else, including the US | Granted | Denied | Granted |

Until Phase 19 the tags were loaded twice, once regardless of the banner and once after consent, so visitors who
accepted were counted twice. Expect page views in GA to drop from the day this deploys; that is the double count
going away, not lost traffic.

**Microsoft Clarity** records sessions, so it loads only after a visitor has explicitly allowed analytics, and only
when a real project ID is configured. The old placeholder ID is gone. To use Clarity: create a project at
clarity.microsoft.com, copy the project ID, and add `NEXT_PUBLIC_CLARITY_ID` in Vercel (Project → Settings →
Environment Variables), then redeploy. **Before you do**, add a paragraph about Clarity to the privacy policy and
the cookie policy: neither mentions it today, and session recording has to be disclosed. Without the variable,
nothing Clarity-related is loaded, so the policies are accurate as they stand.

**AdSense**: the script loads on every page except the embed route. One thing to fix before ads are switched on:
the site's Content-Security-Policy has no `frame-src` entry for Google's ad domains, so ad iframes would be
blocked. That change belongs with ad placement, after approval.

## 4. Page speed budget

CI builds the site with analytics switched off and runs Lighthouse (phone emulation, slow 4G, 4x CPU slowdown)
three times on each of five pages, then compares the median with the budgets in `lighthouserc.json`.

| Check | Budget | If it is missed |
|---|---|---|
| Largest Contentful Paint (LCP) | 2.5 s | The job fails |
| Cumulative Layout Shift | 0.1 | The job fails |
| Total page weight | 900 kB | The job fails |
| Total Blocking Time | 600 ms | A warning in the job log |

2.5 seconds is the roadmap's target and Google's "good" threshold. The page-weight budget does not depend on how
fast the test machine is, so it is the most reliable of the four; it would have caught the main problem found in
this phase.

### Where the pages stand

Lighthouse CI on a development laptop, Nov 16 2026, median of three runs, same settings as the CI job:

| Page | LCP | Page weight | Lighthouse performance score |
|---|---|---|---|
| Home | 1.2 s | 706 kB | 100 |
| Hourly paycheck calculator | 1.4 s | 624 kB | 97 |
| Texas paycheck calculator | 1.4 s | 595 kB | 93 |
| $20 an hour salary page | 1.2 s | 523 kB | 100 |
| Payroll & taxes category | 1.2 s | 620 kB | 100 |

Layout shift is 0 on all five. Two cautions about these numbers:

- **They are not yet confirmed on GitHub's runner**, which is a different machine. The first CI run is the real
  baseline. The margin is wide (1.4 s against a 2.5 s limit), so a failure there would be a surprise worth
  reading, not a reason to raise the limit straight away.
- **The Lighthouse version matters.** CI uses Lighthouse 13, the version behind PageSpeed Insights today. The same
  build measured with Lighthouse 12 reports an LCP of 3.3 to 4.3 seconds, because version 12 estimates the paint
  time differently. Do not compare numbers across versions; the Lighthouse CI version is pinned in `ci.yml` for
  that reason.

Lab numbers are a stand-in. Google ranks on field data from real Chrome users, which appears in Search Console
under *Experience → Core Web Vitals* once the site has enough traffic, and at pagespeed.web.dev for any URL. After
the next deploy, run PageSpeed Insights on the hourly paycheck page once: it measures the real server, which this
job cannot.

### What was fixed in Phase 19

Measured before and after with the same tool (Lighthouse 12, one laptop):

| Page | JavaScript downloaded, before → after | LCP in Lighthouse 12, before → after |
|---|---|---|
| Home | 899 kB → 379 kB | 5.4 s → 3.6 s |
| Hourly paycheck calculator | 882 kB → 419 kB | 7.6 s → 4.3 s |
| Texas paycheck calculator | 882 kB → 407 kB | 7.6 s → 4.1 s |
| $20 an hour salary page | 372 kB → 347 kB | 4.3 s → 3.5 s |
| Payroll & taxes category | 872 kB → 336 kB | 9.0 s → 3.3 s |

The "before" build was not measured with Lighthouse 13, so there is no before-and-after in the version CI uses.

| Problem | Fix |
|---|---|
| Every calculator page downloaded the code of every calculator: 1.1 MB of JavaScript the page never ran | The component map is read through a client component (`CalculatorRenderer`), so each page gets only its own calculator |
| The header carried the whole calculator registry on every page, about 270 kB | The search dialog, the only part that needs it, loads when the visitor first opens search |
| The home page was invisible until its JavaScript had run | The hero is in the server HTML, visible at once |
| On phones the cookie banner was the largest text block on some pages, so its late appearance counted as the page's load time | Two-line banner copy on phones |

`src/lib/bundle-boundaries.test.ts` fails the test run if either of the first two comes back.

### Interactivity work (November 2026)

The pages painted quickly but took about four seconds to respond to a tap on the emulated phone. Measured before
and after with the tool CI uses (Lighthouse 13 through LHCI 0.16.1, one laptop, median of three runs):

| Page | Time to interactive | JavaScript downloaded | Main-thread work |
|---|---|---|---|
| Home | 4.02 s → 3.70 s | 379 kB → 281 kB | 3.27 s → 2.31 s |
| Hourly paycheck calculator | 4.38 s → 4.21 s | 425 kB → 273 kB | 3.20 s → 2.49 s |
| Texas paycheck calculator | 4.30 s → 4.13 s | 413 kB → 264 kB | 2.98 s → 2.30 s |
| $20 an hour salary page | 3.91 s → 3.54 s | 352 kB → 206 kB | 2.27 s → 1.95 s |
| Payroll & taxes category | 3.82 s → 3.51 s | 337 kB → 207 kB | 2.54 s → 1.84 s |

Largest paint is unchanged (1.21 to 1.36 s). Main-thread work is on the emulated phone, which runs four times
slower than the laptop.

Read the first column with one fact in mind: **a page of plain text on this site (the editorial policy) measures
3.18 s** with 172 kB of JavaScript. That is what Next.js and React cost on Lighthouse's slow-4G phone before the
site adds anything, so the salary and category pages are now about 0.35 s above the floor and the paycheck
calculators about one second above it. On that emulated network every 20 kB of JavaScript or HTML costs about a
tenth of a second.

| What every page downloaded | Fix |
|---|---|
| The framer-motion animation library (37 kB compressed), used only to fade or slide elements in | `src/components/motion.tsx` keeps the same JSX and does the entrance with CSS. Elements now leave without an animation, and the small hover and tap scale effects are gone |
| The home page's code and the whole calculator registry (71 kB), because Next prefetches the header's home link | The server passes the home page its calculator list (`hub-data.ts`); search keywords load when the search box is first used (`hub-keywords.ts`); links to `/` carry `prefetch={false}` |
| The toast system (16 kB), for one form | Mounted by the contact form only. The newsletter form shows its error next to the field |
| On paycheck pages, each state's article text and the employer tax notes (22 kB) | Client code reads the small `state-meta.ts`; the employer view, the pay stub dialog and the bulk table load when first opened |
| The page shell three times over: both `loading.tsx` files imported the client shell | `ShellSkeleton`, a server component, frames the loading states |
| Three large blurred, moving background shapes | Not drawn on phones |

`src/lib/bundle-boundaries.test.ts` fails the test run if any of these comes back.

Two lab artifacts worth knowing. Speed Index on the paycheck pages reads 0.2 to 0.3 s higher than before in some
runs although the real first paint is earlier (0.54 to 0.71 s against 0.72 s on the unthrottled trace): content
now fades in from the first frame, where it used to stay hidden until the JavaScript had run. And the local test
server uses HTTP/1.1 and gzip; Vercel uses HTTP/2 and Brotli, so production pages are smaller and load their
scripts in parallel.

### What is still slow

What is left, in rough order of payoff. None of it is started.

1. **The dropdowns on the paycheck calculators.** The Radix select, its positioning library and its scroll lock
   are about 30 kB compressed, on the path to a responsive page. Native `<select>` elements would remove them and
   are easier to use on a phone, at the price of a plainer look.
2. **Make the page shell a Server Component.** `AppShell`, `Header` and `Footer` are client components, so React
   re-runs the whole page frame in the browser. Only the search button, the mobile menu and the cookie banner
   need to be client code.
3. **Shrink the calculator page's HTML.** The hourly paycheck page is about 490 kB of HTML before compression
   (65 kB gzipped), half of it the data React needs to re-create the article in the browser.
4. **The framework itself** (about 140 kB compressed) is the floor described above and is not something the site
   can change without leaving Next.js.

### Running it yourself

```powershell
$env:NEXT_PUBLIC_DISABLE_ANALYTICS = '1'
npm run build
npx --yes @lhci/cli@0.16.1 autorun
Remove-Item Env:NEXT_PUBLIC_DISABLE_ANALYTICS
```

Reports land in `.lighthouseci/reports` (ignored by git); open any `.html` file there. Always build with
`NEXT_PUBLIC_DISABLE_ANALYTICS=1` before a local production run or a speed test, so the test never reports page
views to the live Google Analytics property. Vercel builds its own copy, so a local build never reaches
production.

To change a budget, edit `maxNumericValue` in `lighthouserc.json` (milliseconds, or bytes for page weight).
Raise one only with the reason written in the commit message.

## 5. Settings in one place

| Name | Where | Needed for | Default |
|---|---|---|---|
| `GSC_SERVICE_ACCOUNT_FILE` | Your machine | `npm run gsc:pull` | none |
| `GSC_SERVICE_ACCOUNT_JSON` | GitHub repository secret | The weekly workflow | none (workflow skips) |
| `GSC_SITE_URL` | Your machine, or a GitHub repository variable | URL-prefix properties only | `sc-domain:quickbizcalc.com` |
| `NEXT_PUBLIC_GA_ID` | Vercel | Using a different GA property | the current property |
| `NEXT_PUBLIC_CLARITY_ID` | Vercel | Clarity | none (Clarity off) |
| `NEXT_PUBLIC_DISABLE_ANALYTICS` | Build time, set to `1` | Lab tests and local production builds | off |
