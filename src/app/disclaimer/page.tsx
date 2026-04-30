import type { Metadata } from 'next';
import LegalPageLayout from '@/components/layout/LegalPageLayout';
import AppShell from '@/components/layout/AppShell';
import { CONTACT_EMAIL, SITE_NAME, SITE_URL } from '@/lib/calculator-meta';

export const metadata: Metadata = {
  title: 'Disclaimer',
  description:
    'QuickBizCalc disclaimer. Important information about the limitations of our free calculator tools and the nature of information provided on this website.',
  keywords: [
    'QuickBizCalc disclaimer',
    'calculator disclaimer',
    'financial calculator terms',
    'not financial advice',
  ],
  openGraph: {
    title: `Disclaimer | ${SITE_NAME}`,
    description: `Important disclaimers about the use of ${SITE_NAME} calculator tools.`,
    url: `${SITE_URL}/disclaimer`,
    type: 'website',
  },
  alternates: {
    canonical: `${SITE_URL}/disclaimer`,
  },
};

export default function DisclaimerPage() {
  return (
    <AppShell>
      <LegalPageLayout title="Disclaimer" lastUpdated="April 21, 2026">
      <section className="space-y-6 text-sm leading-relaxed text-foreground/80">
        {/* Critical notice box */}
        <div className="rounded-2xl border-2 border-amber-500/40 bg-amber-500/5 p-6 space-y-3">
          <h2 className="text-lg font-semibold text-amber-700 dark:text-amber-400 !mt-0">
            Important Notice
          </h2>
          <p className="text-foreground/90 font-medium">
            The calculators and information provided on QuickBizCalc are for general informational and
            educational purposes only. They do not constitute financial, tax, legal, accounting,
            or professional advice. You should not rely on calculator results as the sole basis for
            any financial, employment, or business decision.
          </p>
        </div>

        <h2 className="text-xl font-semibold text-foreground pt-4">General Disclaimer</h2>
        <p>
          QuickBizCalc provides free online calculator tools designed to help small business owners, HR
          professionals, freelancers, and entrepreneurs perform common business and financial
          calculations. While we make every effort to ensure that our calculators are accurate and
          up to date, we make no representations or warranties of any kind, express or implied,
          about the completeness, accuracy, reliability, suitability, or availability of the
          calculator results, the website, or the information, products, services, or related
          graphics contained on the website for any purpose.
        </p>

        <h2 className="text-xl font-semibold text-foreground pt-4">Not Professional Advice</h2>
        <p>
          The content on QuickBizCalc, including all calculator tools, formula explanations, examples,
          articles, and guides, is intended to provide general information only. It is not intended
          to be and should not be construed as professional financial advice, tax advice, legal
          advice, accounting advice, or any other form of professional advice. Specifically:
        </p>
        <ul className="list-disc pl-6 space-y-2 mt-2">
          <li>
            <strong>Tax Calculations:</strong> Our payroll and bonus tax calculators use simplified
            federal tax rates and common state tax rates. Actual tax withholding depends on many
            factors including your filing status, deductions, credits, exemptions, and specific state
            and local tax laws. Consult a qualified tax professional or CPA for accurate tax
            withholding and filing.
          </li>
          <li>
            <strong>Salary and Compensation:</strong> Salary calculations, including pro rata
            calculations and raise projections, are based on simplified assumptions. Actual
            compensation may be affected by employment contracts, collective bargaining agreements,
            overtime rules, jurisdiction-specific labor laws, and company policies.
          </li>
          <li>
            <strong>Commission Calculations:</strong> Commission structures vary widely across
            industries, companies, and individual employment agreements. Our commission calculator
            provides general estimates based on common commission models. Your actual commission may
            be affected by factors not captured in our calculator, such as draw against commission,
            clawback provisions, minimum guarantees, and chargeback policies.
          </li>
          <li>
            <strong>Profit Margin and ROI:</strong> Profit margin and return on investment calculations
            provide simplified estimates that do not account for all business expenses, revenue
            recognition timing, depreciation, amortization, or other accounting complexities.
          </li>
        </ul>

        <h2 className="text-xl font-semibold text-foreground pt-4">Limitations of Accuracy</h2>
        <p>
          While our calculators use standard formulas and are regularly tested, the accuracy of
          results depends on several factors that are outside of our control:
        </p>
        <ul className="list-disc pl-6 space-y-2 mt-2">
          <li>
            Tax laws, regulations, and filing requirements change frequently and vary by
            jurisdiction (federal, state, and local).
          </li>
          <li>
            Individual circumstances, such as filing status, number of dependents, deductions, and
            credits, affect actual outcomes.
          </li>
          <li>
            Employment agreements, company policies, and industry practices may include provisions
            not captured by our general-purpose calculators.
          </li>
          <li>
            Rounding methods and calculation precision may cause slight variations compared to
            actual payroll systems or financial statements.
          </li>
          <li>
            Currency values, inflation rates, and economic conditions are dynamic and may change
            between the time you use a calculator and when a financial decision is made.
          </li>
        </ul>

        <h2 className="text-xl font-semibold text-foreground pt-4">No Guarantee of Results</h2>
        <p>
          Any reliance you place on calculator results or information from this Site is strictly at
          your own risk. QuickBizCalc shall not be liable for any loss or damage, including but not
          limited to indirect or consequential loss or damage, or any loss or damage whatsoever
          arising from loss of data or profits arising out of, or in connection with, the use of
          this Site and its calculator tools.
        </p>

        <h2 className="text-xl font-semibold text-foreground pt-4">Consult Qualified Professionals</h2>
        <p>
          We strongly recommend that you consult with qualified professionals before making important
          financial, tax, legal, or employment decisions based on calculator results. Depending on
          your needs, consider consulting with:
        </p>
        <ul className="list-disc pl-6 space-y-2 mt-2">
          <li>A Certified Public Accountant (CPA) or tax advisor for tax and payroll questions</li>
          <li>A financial advisor or planner for investment and business finance decisions</li>
          <li>An employment attorney for wage, salary, and commission disputes</li>
          <li>An HR professional or labor law specialist for employment-related calculations</li>
        </ul>

        <h2 className="text-xl font-semibold text-foreground pt-4">Third-Party Content</h2>
        <p>
          The Site may contain links to third-party websites or display advertisements from
          third-party networks. QuickBizCalc does not endorse, verify, or take responsibility for the
          accuracy, opinions, or practices of any third-party content. Any interactions you have
          with third-party services through our Site are at your own risk.
        </p>

        <h2 className="text-xl font-semibold text-foreground pt-4">Earnings and Financial Projections</h2>
        <p>
          Any salary projections, commission estimates, profit forecasts, or ROI calculations
          provided by our tools are hypothetical and based on the input values you provide. They
          are not guarantees or predictions of actual future earnings, income, or returns. Past
          performance and current calculations do not guarantee future results. Individual results
          will vary based on numerous factors beyond our control.
        </p>

        <h2 className="text-xl font-semibold text-foreground pt-4">Changes to This Disclaimer</h2>
        <p>
          We may update this Disclaimer at any time. Changes will be reflected by updating the
          &quot;Last updated&quot; date at the top of this page. We encourage you to review this Disclaimer
          periodically for any updates. Your continued use of the Site after changes are posted
          constitutes acceptance of the revised Disclaimer.
        </p>

        <h2 className="text-xl font-semibold text-foreground pt-4">Contact Us</h2>
        <p>
          If you have questions about this Disclaimer, please contact us through our{' '}
          <a
            href="/contact"
            className="text-emerald-600 hover:text-emerald-700 underline underline-offset-2"
          >
            Contact Page
          </a>{' '}
          or email us at{' '}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-emerald-600 hover:text-emerald-700 underline underline-offset-2"
          >
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      </section>
    </LegalPageLayout>
    </AppShell>
  );
}
