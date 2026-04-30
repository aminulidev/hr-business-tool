import type { Metadata } from 'next';
import LegalPageLayout from '@/components/layout/LegalPageLayout';
import AppShell from '@/components/layout/AppShell';
import { CONTACT_EMAIL, SITE_NAME, SITE_URL } from '@/lib/calculator-meta';

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

          <h2 className="text-xl font-semibold text-foreground pt-4">Who We Are</h2>
          <p>
            QuickBizCalc is a free web-based platform dedicated to providing accurate, reliable, and
            easy-to-use calculator tools for small business and human resources professionals. Our
            team consists of experienced professionals in finance, human resources, software
            development, and user experience design who share a common goal: simplifying complex
            calculations so that business decisions can be made with confidence and clarity.
          </p>
          <p>
            We understand the challenges that small business owners face daily. From calculating
            employee commissions and managing payroll to determining profit margins and evaluating
            return on investment, the numbers matter. That is why we built QuickBizCalc to be a one-stop
            resource for all the essential calculations that business professionals need, presented
            in a clean, intuitive interface that anyone can use without training.
          </p>

          <h2 className="text-xl font-semibold text-foreground pt-4">What We Offer</h2>
          <p>QuickBizCalc provides a comprehensive suite of free calculator tools across several key categories:</p>
          <ul className="list-disc pl-6 space-y-3 mt-3">
            <li>
              <strong className="text-foreground">Commission &amp; Compensation:</strong> Our Sales Commission
              Calculator supports multiple calculation methods including flat rate, tiered commission,
              and quota-based structures, with visual charts and CSV export capabilities.
            </li>
            <li>
              <strong className="text-foreground">Salary &amp; Compensation:</strong> Tools for calculating
              pro rata salary for mid-year starts and part-time employees, as well as salary increase
              projections with inflation adjustment.
            </li>
            <li>
              <strong className="text-foreground">Payroll &amp; Taxes:</strong> A comprehensive Payroll
              Calculator for estimating take-home pay after federal and state taxes, plus a Post-Tax
              Bonus Calculator for understanding supplemental withholding.
            </li>
            <li>
              <strong className="text-foreground">Time &amp; Attendance:</strong> A Time Card Calculator
              that converts clock-in and clock-out times to decimal hours for payroll processing.
            </li>
            <li>
              <strong className="text-foreground">Business Finance:</strong> Essential tools including
              a Profit Margin &amp; Markup Calculator for retail pricing and an ROI Calculator for
              evaluating investment returns.
            </li>
          </ul>

          <h2 className="text-xl font-semibold text-foreground pt-4">Our Commitment to Accuracy</h2>
          <p>
            Accuracy is the foundation of everything we do at QuickBizCalc. Each calculator is built using
            industry-standard formulas and validated against real-world scenarios. Our development team
            regularly reviews and tests all tools to ensure they produce correct results. We also
            provide detailed formula explanations, worked examples, and frequently asked questions for
            each calculator so that users can understand not just the &quot;what&quot; but the &quot;why&quot; behind
            every calculation.
          </p>
          <p>
            However, we want to be transparent: our calculators provide estimates and general guidance.
            Tax laws, business regulations, and employment practices vary by jurisdiction and change
            over time. For critical financial, tax, or legal decisions, we always recommend consulting
            with a qualified professional. Our full{' '}
            <a
              href="/disclaimer"
              className="text-emerald-600 hover:text-emerald-700 underline underline-offset-2"
            >
              Disclaimer
            </a>{' '}
            provides additional details.
          </p>

          <h2 className="text-xl font-semibold text-foreground pt-4">Privacy and Data Protection</h2>
          <p>
            We take your privacy seriously. All calculations on QuickBizCalc are performed entirely within
            your web browser using client-side JavaScript. This means the financial data you enter
            into our calculators never leaves your device and is never transmitted to our servers.
            We do not collect, store, or have access to your calculation inputs. For details on
            what information we do collect (such as anonymous usage analytics), please read our{' '}
            <a
              href="/privacy-policy"
              className="text-emerald-600 hover:text-emerald-700 underline underline-offset-2"
            >
              Privacy Policy
            </a>
            .
          </p>

          <h2 className="text-xl font-semibold text-foreground pt-4">How We Are Supported</h2>
          <p>
            QuickBizCalc is completely free to use for all visitors. We are supported by non-intrusive
            advertising displayed through Google AdSense. These advertisements help us cover the
            costs of hosting, development, and maintenance so that we can continue offering our
            tools at no charge. We strive to keep advertising minimal and relevant so that it does
            not interfere with your experience using our calculators.
          </p>

          <h2 className="text-xl font-semibold text-foreground pt-4">Contact Us</h2>
          <p>
            We value your feedback and are always looking for ways to improve. If you have questions,
            suggestions, or feedback about QuickBizCalc, or if you would like to report an issue with any
            of our calculators, please visit our{' '}
            <a
              href="/contact"
              className="text-emerald-600 hover:text-emerald-700 underline underline-offset-2"
            >
              Contact Page
            </a>{' '}
            or send us an email at{' '}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-emerald-600 hover:text-emerald-700 underline underline-offset-2"
            >
              {CONTACT_EMAIL}
            </a>
            . We aim to respond to all inquiries within 48 hours.
          </p>
        </section>
      </LegalPageLayout>
    </AppShell>
  );
}
