import type { Metadata } from 'next';
import Link from 'next/link';
import LegalPageLayout from '@/components/layout/LegalPageLayout';
import AppShell from '@/components/layout/AppShell';
import { CONTACT_EMAIL, SITE_NAME, SITE_URL } from '@/lib/registry';
import { getAuthor } from '@/lib/authors';
import { TAX_YEAR } from '@/lib/payroll/withholding-2026';

export const metadata: Metadata = {
  title: 'Editorial Policy',
  description: `How ${SITE_NAME} sources every tax rate and labor rule, how often calculators are reviewed and updated, who writes the pages, and how to report and correct an error.`,
  alternates: { canonical: `${SITE_URL}/editorial-policy` },
  openGraph: {
    title: `Editorial Policy | ${SITE_NAME}`,
    description: `How ${SITE_NAME} sources, verifies, updates and corrects its calculators.`,
    url: `${SITE_URL}/editorial-policy`,
    type: 'website',
  },
};

export default function EditorialPolicyPage() {
  const author = getAuthor();
  return (
    <AppShell>
      <LegalPageLayout title="Editorial Policy" lastUpdated="November 6, 2026">
        <section className="space-y-6 text-sm leading-relaxed text-foreground/80">
          <p>
            {SITE_NAME} publishes free calculators for US payroll, taxes, wages, time tracking and small-business
            finance. This page explains where the numbers come from, what &ldquo;reviewed&rdquo; means on a page, how
            often figures change, and what happens when something is wrong. It applies to every calculator, salary
            page and guide on the site.
          </p>

          <h2 id="who" className="text-xl font-semibold text-foreground pt-4">Who writes and maintains the site</h2>
          <p>{author.bio}</p>
          <p>
            Nobody on the team is a CPA, enrolled agent, attorney or certified HR professional, and the site does not
            claim otherwise. We do not publish ghost-written &ldquo;expert reviewer&rdquo; names. Authority on this site
            comes from linking each figure to the agency that publishes it, not from credentials. If a credentialed
            reviewer joins, they will be named here with their real licence details. You can reach the team at{' '}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-emerald-600 hover:underline">{CONTACT_EMAIL}</a>
            {author.links.length > 0 && (
              <>
                {' '}or on{' '}
                {author.links.map((l, i) => (
                  <span key={l.url}>
                    {i > 0 ? ' and ' : ''}
                    <a href={l.url} target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">
                      {l.label}
                    </a>
                  </span>
                ))}
              </>
            )}
            .
          </p>

          <h2 id="sources" className="text-xl font-semibold text-foreground pt-4">How numbers are sourced</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong className="text-foreground">Federal income tax withholding</strong> uses the percentage method in IRS
              Publication 15-T for tax year {TAX_YEAR}. Brackets and standard deductions come from the IRS inflation
              adjustment revenue procedure for that year.
            </li>
            <li>
              <strong className="text-foreground">Social Security and Medicare</strong> rates come from IRS Tax Topic 751;
              the annual wage base comes from the Social Security Administration&rsquo;s COLA announcement.
            </li>
            <li>
              <strong className="text-foreground">State withholding, disability and paid-leave deductions</strong> come
              from each state revenue department&rsquo;s current withholding publication and the agency that runs the
              program. Each state paycheck page links to its own state&rsquo;s documents.
            </li>
            <li>
              <strong className="text-foreground">Overtime, minimum wage, breaks and leave</strong> follow the Fair Labor
              Standards Act as explained by the Department of Labor&rsquo;s Wage and Hour Division and 29 CFR, with state
              rules noted where they are stricter.
            </li>
            <li>
              <strong className="text-foreground">Business and SaaS formulas</strong> (margins, ROI, CAC, churn, break-even)
              are standard arithmetic rather than law. Those pages show the formula and a worked example and do not cite a
              regulator, because there is none to cite.
            </li>
          </ul>
          <p>
            Each calculator lists the exact publications it relies on in a &ldquo;Sources &amp; References&rdquo; section
            that links to the issuing agency. Where a third-party dataset is used (for example Tax Foundation rate
            tables), it is named as such. Pages that have no statutory basis have no sources section rather than a
            decorative one.
          </p>

          <h2 id="review" className="text-xl font-semibold text-foreground pt-4">What &ldquo;Reviewed&rdquo; means</h2>
          <p>
            A &ldquo;Reviewed&rdquo; date in a page&rsquo;s byline means that on that date the calculator&rsquo;s math was
            checked against its listed sources, and that check is recorded in code. For the paycheck calculators this
            is an automated test suite: federal and state withholding for sample wages is hand-computed from the
            publications and asserted against the engine, and the worked examples and tables in the article are
            generated by the same engine the calculator runs, so the article and the tool cannot disagree.
          </p>
          <p>
            Pages without a review date have not yet been through that process. They are still built from the sources
            listed on the page, but we do not stamp a date we cannot back up. Review dates are set per calculator when
            the verification actually happens, never in bulk.
          </p>

          <h2 id="updates" className="text-xl font-semibold text-foreground pt-4">How often figures change</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong className="text-foreground">Annual tax figures</strong> (brackets, standard deduction, Social Security
              wage base, state withholding tables, minimum wages) are updated when the agency publishes them, normally
              October to January, and the site switches to the new tax year in January. The tax year a page uses is
              shown in its byline.
            </li>
            <li>
              <strong className="text-foreground">Mid-year law changes</strong> (a state rate change, a new paid-leave
              premium) are applied when they take effect and noted on the affected pages.
            </li>
            <li>
              <strong className="text-foreground">Guides</strong> show their publication date. When a guide is materially
              revised, the date shown is the revision date.
            </li>
          </ul>

          <h2 id="corrections" className="text-xl font-semibold text-foreground pt-4">Corrections</h2>
          <p>
            If a calculator produces a wrong number or a page states an outdated rate, email{' '}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-emerald-600 hover:underline">{CONTACT_EMAIL}</a> or use
            the <Link href="/contact" className="text-emerald-600 hover:underline">contact form</Link> with the
            calculator name, your inputs and the result you expected. Reports are checked against the primary source
            within two business days. Confirmed errors are fixed, the fix is added to the automated tests where
            possible, and the correction is noted on the page. We do not quietly edit figures.
          </p>

          <h2 id="limits" className="text-xl font-semibold text-foreground pt-4">What the calculators are not</h2>
          <p>
            Results are estimates for planning and double-checking. They are not tax, legal, accounting or payroll
            advice and do not replace your payroll provider, a licensed professional, or the agency&rsquo;s own forms.
            Pre-tax deductions, local taxes outside the ones listed, garnishments and unusual W-4 elections can all
            change a real paycheck. See the{' '}
            <Link href="/disclaimer" className="text-emerald-600 hover:underline">disclaimer</Link>.
          </p>

          <h2 id="independence" className="text-xl font-semibold text-foreground pt-4">Advertising and independence</h2>
          <p>
            {SITE_NAME} is free and is funded by display advertising served through Google AdSense. Advertisers have no
            input into which calculators exist, what they compute or what the pages say. We do not accept sponsored
            content, paid placements in calculator results or affiliate links disguised as recommendations. All
            calculations run in your browser; the inputs you type are never sent to our servers. See the{' '}
            <Link href="/privacy-policy" className="text-emerald-600 hover:underline">privacy policy</Link>.
          </p>

          <h2 id="ai" className="text-xl font-semibold text-foreground pt-4">Use of software tools</h2>
          <p>
            Code and drafts are produced with the help of software tools, including AI coding assistants. Every
            published figure is still traced to a primary source listed on the page, and the automated tests described
            above run on every change before it is deployed. Responsibility for what is published rests with the
            editorial team.
          </p>
        </section>
      </LegalPageLayout>
    </AppShell>
  );
}
