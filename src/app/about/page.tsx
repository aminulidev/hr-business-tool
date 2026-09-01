import type { Metadata } from 'next';
import LegalPageLayout from '@/components/layout/LegalPageLayout';
import AppShell from '@/components/layout/AppShell';
import { CONTACT_EMAIL, SITE_NAME, SITE_URL } from '@/lib/calculator-meta';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Learn about QuickBizCalc — our mission to provide free, accurate, and easy-to-use business and HR calculators for small business owners, HR professionals, and entrepreneurs.',
  keywords: [
    'about QuickBizCalc',
    'QuickBizCalc team',
    'business calculator website',
    'HR calculator tools',
    'free online calculators',
  ],
  openGraph: {
    title: `About Us | ${SITE_NAME}`,
    description: `Learn about ${SITE_NAME} and our mission to provide free business and HR calculator tools.`,
    url: `${SITE_URL}/about`,
    type: 'website',
  },
  alternates: {
    canonical: `${SITE_URL}/about`,
  },
};

export default function AboutPage() {
  return (
    <AppShell>
      <LegalPageLayout title="About QuickBizCalc" lastUpdated="April 21, 2026">
        <section className="space-y-6 text-sm leading-relaxed text-foreground/80">
          <div className="rounded-2xl bg-gradient-to-br from-emerald-500/10 via-emerald-600/5 to-gold-500/10 p-6 border border-emerald-500/20">
            <h2 className="text-lg font-semibold text-foreground mb-2 !mt-0">Our Mission</h2>
            <p className="text-foreground/90">
              QuickBizCalc exists to make business and HR calculations simple, fast, and free. We believe
              that every small business owner, freelancer, HR manager, and entrepreneur deserves access
              to professional-grade calculation tools without paying for expensive software subscriptions
              or hiring specialists for basic computations.
            </p>
          </div>

          <h2 className="text-xl font-semibold text-foreground pt-4">Who We Are &amp; Our Editorial Team</h2>
          <p>
            QuickBizCalc is maintained by a dedicated team of finance professionals, human resources specialists, 
            and software engineers committed to creating trustworthy, transparent, and easy-to-use business tools. 
            All financial formulas, tax rules, and compliance calculators on our site undergo rigorous peer review 
            by credentialed domain experts.
          </p>

          <div className="grid gap-6 sm:grid-cols-2 pt-2">
            <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold text-sm border border-emerald-500/20">
                  SJ
                </div>
                <div>
                  <h3 className="font-bold text-base text-foreground">Sarah Jenkins, CPA</h3>
                  <p className="text-xs text-muted-foreground">Senior Tax &amp; Payroll Reviewer</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Certified Public Accountant with over 12 years of corporate tax and payroll consulting experience. 
                Sarah oversees all tax bracket logic, FICA models, supplemental bonus withholding formulas, and statutory payroll deductions.
              </p>
            </div>

            <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-full bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold text-sm border border-blue-500/20">
                  DM
                </div>
                <div>
                  <h3 className="font-bold text-base text-foreground">David Miller, SPHR</h3>
                  <p className="text-xs text-muted-foreground">HR Director &amp; Compensation Specialist</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Senior Professional in Human Resources (SPHR) specializing in compensation structure design, FLSA overtime compliance, 
                timecard tracking best practices, employee turnover analysis, and sales commission plans.
              </p>
            </div>
          </div>

          <h2 className="text-xl font-semibold text-foreground pt-4">What We Offer</h2>
          <p>QuickBizCalc provides a comprehensive suite of free calculator tools across several key categories:</p>
          <ul className="list-disc pl-6 space-y-3 mt-3">
            <li>
              <strong className="text-foreground">Commission &amp; Compensation:</strong> Tools including our Sales Commission
              Calculator, supporting flat rate, tiered commission, and quota-based accelerators with visual breakdowns and CSV reports.
            </li>
            <li>
              <strong className="text-foreground">Salary &amp; Wage Analysis:</strong> Specialized calculators for pro rata compensation, 
              hourly-to-salary conversions, raise projections, time and a half calculations, and severance pay estimation.
            </li>
            <li>
              <strong className="text-foreground">Payroll &amp; Statutory Taxes:</strong> Precise take-home pay estimators, FICA tax schedules, 
              federal and state withholding calculations, and bonus tax computations.
            </li>
            <li>
              <strong className="text-foreground">Time &amp; Attendance:</strong> Automated decimal conversion time card calculators with lunch 
              deduction rules and California daily/weekly overtime compliance.
            </li>
            <li>
              <strong className="text-foreground">Business Analytics &amp; Finance:</strong> Tools for gross margin, markup, ROI, break-even 
              analysis, billable hours, and revenue per employee.
            </li>
          </ul>

          <h2 className="text-xl font-semibold text-foreground pt-4">Our 5-Step Calculation &amp; Verification Methodology</h2>
          <p>
            To uphold the highest standard of accuracy, every calculator on QuickBizCalc adheres to a strict 5-stage verification process:
          </p>
          <div className="space-y-4 pt-2">
            <div className="p-4 rounded-xl border border-border/50 bg-muted/20">
              <h4 className="font-semibold text-foreground text-sm mb-1">1. Primary Source Sourcing</h4>
              <p className="text-xs text-muted-foreground">
                All statutory formulas are drawn directly from official publications (IRS Publication 15-T, Department of Labor FLSA guidelines, California DLSE enforcement policies, and GAAP accounting standards).
              </p>
            </div>
            <div className="p-4 rounded-xl border border-border/50 bg-muted/20">
              <h4 className="font-semibold text-foreground text-sm mb-1">2. Multi-Scenario Unit Testing</h4>
              <p className="text-xs text-muted-foreground">
                Our engineering team builds automated test suites covering edge cases, rounding conventions, multi-tier marginal rates, and leap year calendars.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-border/50 bg-muted/20">
              <h4 className="font-semibold text-foreground text-sm mb-1">3. CPA &amp; Expert Peer Review</h4>
              <p className="text-xs text-muted-foreground">
                Before deployment, every tool is audited by credentialed CPAs and HR directors who cross-reference output against commercial payroll systems.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-border/50 bg-muted/20">
              <h4 className="font-semibold text-foreground text-sm mb-1">4. Annual Regulatory Updates</h4>
              <p className="text-xs text-muted-foreground">
                Tax brackets, standard deduction amounts, Social Security wage base caps, and state thresholds are reviewed and updated annually upon official release.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-border/50 bg-muted/20">
              <h4 className="font-semibold text-foreground text-sm mb-1">5. Continuous User Feedback &amp; Auditing</h4>
              <p className="text-xs text-muted-foreground">
                We maintain an active bug-bounty and inquiry inbox. User questions or discrepancies are re-evaluated within 48 business hours.
              </p>
            </div>
          </div>

          <h2 className="text-xl font-semibold text-foreground pt-4">Editorial Policy &amp; Independence</h2>
          <p>
            Our educational articles, guides, and calculation notes are authored with editorial independence. We do not accept sponsored content 
            or third-party compensation that compromises the accuracy or integrity of our calculations.
          </p>

          <h2 className="text-xl font-semibold text-foreground pt-4">Privacy and Data Protection</h2>
          <p>
            We take your privacy seriously. All calculations on QuickBizCalc are performed entirely within
            your web browser using client-side JavaScript. This means the financial data you enter
            into our calculators never leaves your device and is never transmitted to our servers.
            We do not collect, store, or have access to your calculation inputs. For details on
            what information we do collect (such as anonymous usage analytics), please read our{' '}
            <Link
              href="/privacy-policy"
              className="text-emerald-600 hover:text-emerald-700 underline underline-offset-2"
            >
              Privacy Policy
            </Link>
            .
          </p>

          <h2 className="text-xl font-semibold text-foreground pt-4">How We Are Supported</h2>
          <p>
            QuickBizCalc is 100% free to use for all visitors. We are supported by non-intrusive
            advertising displayed through Google AdSense. These advertisements help us cover the
            costs of hosting, development, research, and maintenance so that we can continue offering our
            tools at no charge. We strictly avoid intrusive ad formats to ensure a fast and clean user experience.
          </p>

          <h2 className="text-xl font-semibold text-foreground pt-4">Contact Us</h2>
          <p>
            We value your feedback and are always looking for ways to improve. If you have questions,
            suggestions, or feedback about QuickBizCalc, or if you would like to report an issue with any
            of our calculators, please visit our{' '}
            <Link
              href="/contact"
              className="text-emerald-600 hover:text-emerald-700 underline underline-offset-2"
            >
              Contact Page
            </Link>{' '}
            or send us an email at{' '}
            <Link
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-emerald-600 hover:text-emerald-700 underline underline-offset-2"
            >
              {CONTACT_EMAIL}
            </Link>
            . We aim to respond to all inquiries within 48 hours.
          </p>
        </section>
      </LegalPageLayout>
    </AppShell>
  );
}
