# Distribution kit

Working notes for Phase 18 of the roadmap in `TODO.md`. The code side is done; everything in this file is a task
for a person, because it means contacting people or posting under your own name.

## 1. Newsletter: three settings to finish, then how to send

Sign-ups are saved as contacts in your Resend account from the moment this code is deployed. Three settings make
the list usable.

1. **Verify the domain in Resend.** Resend dashboard → Domains → add `quickbizcalc.com` and add the DNS records it
   shows. Until this is done, Resend only delivers to your own address, so no subscriber can receive anything.
2. **Create a segment for subscribers.** Resend dashboard → Audience → Segments → create "Newsletter". Copy its ID.
3. **Add two environment variables in Vercel** (Project → Settings → Environment Variables), then redeploy:

   | Name | Value |
   |---|---|
   | `RESEND_SEGMENT_ID` | the segment ID from step 2 |
   | `RESEND_FROM` | a sender on the verified domain, for example `QuickBizCalc <updates@quickbizcalc.com>` |

   With `RESEND_FROM` set, new subscribers also get a short welcome email. Without it they get none, and the site
   does not claim that they will.

**Sending an issue** needs no code: Resend dashboard → Broadcasts → new broadcast → choose the segment → write →
send. Resend adds the unsubscribe link. US law (CAN-SPAM) also requires a valid postal address in every
commercial email, so put one in the footer of the broadcast template.

**What the site promises subscribers** (keep to it): an email when US payroll rates, thresholds or deadlines
change, plus calculator updates and corrections, at most once a month. No schedule is promised.

**A workable issue outline**

1. What changed, in one sentence each, with the effective date and a link to the agency that published it.
2. What to do about it, if anything.
3. Which calculator on the site reflects it.
4. Corrections since the last issue, if any.

**Where changes come from** (check these before writing; do not rely on memory or on other blogs):
IRS newsroom and Publication 15-T, the Social Security Administration's annual cost-of-living announcement
(usually October), IRS retirement plan limit notices (usually November), the Department of Labor, and state
revenue and labor departments. The natural first issue is the year-end one: next year's Social Security wage
base, withholding tables, retirement limits and state minimum wages, which also feeds the "what changes next
year" page planned in roadmap item 16.3.

## 2. Embeds: who to ask, and what to say

Every calculator has an **Embed** button. The code it gives is an iframe plus one visible credit line, "*Title*
by QuickBizCalc", linking back to the calculator.

**The credit link is `nofollow` on purpose.** Google's link-spam policy treats followed links that ship inside a
widget as unnatural links, and the site is still recovering from a spam update. A nofollow link still brings
visitors and brand recognition. A site that writes about the calculator in its own words and links to it by
choice gives a normal followed link, and that is the kind worth asking for. The setting is one constant,
`EMBED_LINK_REL` in `src/lib/embed.ts`, if you decide differently.

**Who is worth contacting**

- Small accounting and bookkeeping firms with a "resources" or "tools" page.
- Staffing agencies and PEOs that publish pay or overtime guides.
- HR consultants and HR blogs that explain a calculation by hand in a post.
- Community-college and university business, accounting and HR course pages that list study tools.
- Local chambers of commerce and small-business development centers with a resource list.

**How to find them** (search operators):

```
"payroll calculator" inurl:resources bookkeeping
"overtime" "how to calculate" intitle:guide staffing agency
site:.edu "accounting" "useful links" OR "resources" calculator
"small business resources" "payroll" chamber of commerce
```

Qualify each one before writing: the page exists and is maintained, it already links out to tools, and one of
the calculators genuinely fits something on that page. Fifty well-chosen contacts beat five hundred.

**First email** (adapt every time; a message that could have been sent to anyone gets ignored):

```
Subject: A free [overtime] calculator for your [page name] page

Hi [name],

I read your guide to [topic] at [URL]. The worked example on [specific detail] is clearer than most.

I maintain QuickBizCalc, a set of free US payroll and business calculators. Our [calculator name] does the
calculation in that section, including [one specific thing it handles, e.g. California daily overtime].
You can embed it on the page at no cost, with no ads inside it and no sign-up:

[calculator URL]  (the Embed button gives the code)

If it is not a fit, no problem. Either way, if you spot anything wrong in it I would like to know.

[your name]
QuickBizCalc
```

One follow-up after a week, then stop.

**Seeing the result.** Visits that come through an embed's credit link arrive with `?ref=embed` on the URL. In
Google Analytics, filter page location for `ref=embed`; the referrer shows which site the embed is on.

The co-branded templates mentioned in the roadmap depend on item 16.3 (downloadable templates), which is not
built yet, so there is nothing co-branded to offer today.

## 3. Answering questions on Reddit and Quora

Read each community's rules first. Several, r/personalfinance among them, restrict or ban self-promotion, and a
removed post or a banned account costs more than it earns. Where links are allowed:

- Answer the question completely in the reply itself, with the arithmetic shown.
- Add at most one link, to a result that is already filled in with the asker's numbers, not to a home page.
- Say that it is your site.

**Pre-filled links.** The paycheck calculators read their inputs from the URL:

```
https://www.quickbizcalc.com/calculators/hourly-paycheck-calculator?rate=25&hours=40&freq=bi-weekly&status=single&state=TX
```

| Parameter | Values |
|---|---|
| `rate` | hourly rate |
| `hours` | regular hours per week |
| `ot` | overtime hours per week |
| `salary` | annual salary, instead of `rate` and `hours` |
| `freq` | `weekly`, `bi-weekly`, `semi-monthly`, `monthly` |
| `status` | `single`, `married`, `hoh` |
| `state` | two-letter state code, for the states the site covers |
| `ret` | retirement contribution, percent |

The quickest way to build one is to fill in the calculator and use its Share button.

## 4. AdSense: when to apply again

The roadmap's rule is to re-apply only after the Phase 13 to 15 changes have been live for at least four weeks
and Search Console shows the pages being re-indexed. Before applying, check:

- The new and rebuilt pages from Phases 16 and 17 are deployed and indexed.
- No page carries a claim the site cannot back up. Phase 18 removed the last known ones: the invented newsletter
  subscriber count, the weekly publishing schedule and the dated "sample issues" that were never sent.
- The privacy policy matches what the site collects. It now covers newsletter addresses, contact messages and
  feedback comments.
- Ads stay out of embeds. The AdSense script is no longer loaded on the embed route.
