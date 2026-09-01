import type { Metadata } from 'next';
import Link from 'next/link';
import LegalPageLayout from '@/components/layout/LegalPageLayout';
import AppShell from '@/components/layout/AppShell';
import { CONTACT_EMAIL, SITE_NAME, SITE_URL } from '@/lib/calculator-meta';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'QuickBizCalc privacy policy. Learn how we collect, use, and protect your information when you use our free online business and HR calculators.',
  keywords: [
    'QuickBizCalc privacy policy',
    'calculator privacy policy',
    'data collection policy',
    'cookie privacy',
    'user data protection',
  ],
  openGraph: {
    title: `Privacy Policy | ${SITE_NAME}`,
    description: `Learn how ${SITE_NAME} collects, uses, and protects your information.`,
    url: `${SITE_URL}/privacy-policy`,
    type: 'website',
  },
  alternates: {
    canonical: `${SITE_URL}/privacy-policy`,
  },
};

export default function PrivacyPolicyPage() {
  return (
    <AppShell>
      <LegalPageLayout title="Privacy Policy" lastUpdated="April 21, 2026">
        <section className="space-y-6 text-sm leading-relaxed text-foreground/80">
          <p>
            At QuickBizCalc (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;), we are committed to protecting your privacy.
            This Privacy Policy explains how we collect, use, disclose, and safeguard your information
            when you visit our website at{' '}
            <Link
              href={SITE_URL}
              className="text-emerald-600 hover:text-emerald-700 underline underline-offset-2"
            >
              {SITE_URL}
            </Link>{' '}
            (the &quot;Site&quot;). Please read this policy carefully. By using the Site, you agree to the
            practices described in this Privacy Policy.
          </p>

          <h2 className="text-xl font-semibold text-foreground pt-4">1. Information We Collect</h2>

          <h3 className="text-base font-semibold text-foreground mt-4">1.1 Information You Provide</h3>
          <p>
            When you use our calculators, the data you enter (such as salary figures, commission rates,
            tax percentages, and other financial inputs) is processed entirely within your web browser.
            We do not transmit, collect, store, or have access to the specific numbers you enter into our
            calculator tools. All calculations are performed client-side using JavaScript, meaning your
            financial data never leaves your device.
          </p>

          <h3 className="text-base font-semibold text-foreground mt-4">1.2 Automatically Collected Information</h3>
          <p>
            When you visit the Site, we may automatically collect certain information about your device
            and browsing activity. This includes your IP address, browser type and version, operating system,
            referring URLs, pages viewed, links clicked, and the date and time of your visit. We collect
            this information through cookies and similar technologies as described in our{' '}
            <Link
              href="/cookie-policy"
              className="text-emerald-600 hover:text-emerald-700 underline underline-offset-2"
            >
              Cookie Policy
            </Link>
            .
          </p>

          <h3 className="text-base font-semibold text-foreground mt-4">1.3 Google AdSense and Third-Party Advertising</h3>
          <p>
            We use <strong>Google AdSense</strong> to display advertisements across the Site. Google is a third-party vendor that uses cookies, web beacons, and unique device identifiers to serve advertisements based on your prior visits to our Site or other websites on the Internet:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>
              <strong>Advertising Cookies:</strong> Google&apos;s use of advertising cookies (including the DoubleClick / DART cookie) enables Google and its certified ad partners to serve personalized or contextual ads to you based on your browsing patterns and interests across the web.
            </li>
            <li>
              <strong>Personalized Ads Opt-Out:</strong> You can opt out of personalized Google advertising at any time by visiting{' '}
              <Link
                href="https://adssettings.google.com"
                className="text-emerald-600 hover:text-emerald-700 underline underline-offset-2"
                target="_blank"
                rel="noopener noreferrer"
              >
                Google Ads Settings
              </Link>
              .
            </li>
            <li>
              <strong>Third-Party Ad Networks:</strong> You may also opt out of third-party vendors&apos; use of cookies for personalized advertising by visiting the Network Advertising Initiative / Digital Advertising Alliance opt-out portal at{' '}
              <Link
                href="https://www.aboutads.info/choices/"
                className="text-emerald-600 hover:text-emerald-700 underline underline-offset-2"
                target="_blank"
                rel="noopener noreferrer"
              >
                www.aboutads.info/choices/
              </Link>{' '}
              or the European Interactive Digital Advertising Alliance at{' '}
              <Link
                href="https://www.youronlinechoices.eu/"
                className="text-emerald-600 hover:text-emerald-700 underline underline-offset-2"
                target="_blank"
                rel="noopener noreferrer"
              >
                youronlinechoices.eu
              </Link>
              .
            </li>
          </ul>

          <h3 className="text-base font-semibold text-foreground mt-4">1.4 Web Analytics (Google Analytics)</h3>
          <p>
            We use Google Analytics to understand how visitors engage with our tools and pages. Google Analytics collects anonymized data such as page views, session duration, device operating systems, and referral sources. We do not transmit personally identifiable information (PII) to Google Analytics. You can prevent your data from being used by Google Analytics by installing the{' '}
            <Link
              href="https://tools.google.com/dlpage/gaoptout"
              className="text-emerald-600 hover:text-emerald-700 underline underline-offset-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google Analytics Opt-out Browser Add-on
            </Link>
            .
          </p>

          <h2 className="text-xl font-semibold text-foreground pt-4">2. How We Use Your Information</h2>
          <p>We use the automatically collected information for the following purposes:</p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>To operate and maintain the Site and our calculator tools</li>
            <li>To improve and optimize the Site&apos;s content, functionality, and user experience</li>
            <li>To analyze usage trends and measure the effectiveness of our content</li>
            <li>To detect, prevent, and address technical issues and security threats</li>
            <li>To display relevant advertisements through Google AdSense</li>
            <li>To comply with legal obligations and enforce our terms of service</li>
          </ul>

          <h2 className="text-xl font-semibold text-foreground pt-4">3. Cookies and Tracking Technologies</h2>
          <p>
            The Site uses cookies and similar tracking technologies to enhance your browsing experience.
            Cookies are small data files stored on your device that help us remember your preferences
            (such as cookie consent settings) and understand how you use the Site. We use both
            first-party cookies (set by us) and third-party cookies (set by our service providers
            like Google). For a detailed explanation of the cookies we use, please refer to our{' '}
            <Link
              href="/cookie-policy"
              className="text-emerald-600 hover:text-emerald-700 underline underline-offset-2"
            >
              Cookie Policy
            </Link>
            .
          </p>
          <p>
            You can control cookies through your browser settings. Most browsers allow you to refuse
            cookies or delete existing cookies. However, disabling cookies may affect the functionality
            of the Site. When you first visit our Site, we will ask for your consent before setting
            non-essential cookies.
          </p>

          <h2 className="text-xl font-semibold text-foreground pt-4">4. Third-Party Sharing and Disclosure</h2>
          <p>
            We do not sell, trade, or rent your personal information to third parties. We may share
            automatically collected (non-personal) information with third-party service providers
            under the following circumstances:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>
              <strong>Service Providers:</strong> We share data with Google (for AdSense advertising and
              Google Analytics) and our hosting provider to operate the Site. These providers are bound
              by contractual obligations to protect your data.
            </li>
            <li>
              <strong>Legal Requirements:</strong> We may disclose information if required by law, court
              order, or governmental regulation, or if we believe such disclosure is necessary to protect
              our rights or the safety of users or others.
            </li>
            <li>
              <strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of all
              or a portion of our assets, user information may be transferred as part of that transaction.
            </li>
          </ul>

          <h2 className="text-xl font-semibold text-foreground pt-4">5. Data Security</h2>
          <p>
            We implement reasonable technical and organizational security measures to protect the
            information we collect. The Site is served over HTTPS to encrypt data in transit. Since
            all calculator computations happen in your browser and we do not store your financial
            inputs on our servers, your calculation data remains on your device at all times.
            However, no method of transmission over the Internet or electronic storage is 100%
            secure, and we cannot guarantee absolute security.
          </p>

          <h2 className="text-xl font-semibold text-foreground pt-4">6. Data Retention</h2>
          <p>
            We retain the automatically collected non-personal information for as long as necessary
            to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period
            is required by law. Since we do not collect or store calculator input data, there is no
            personal financial data to retain or delete.
          </p>

          <h2 className="text-xl font-semibold text-foreground pt-4">7. Your Rights and Choices (CCPA, CPRA, GDPR)</h2>
          <p>Depending on your jurisdiction (such as California, Virginia, the EU, or the UK), you may have specific statutory privacy rights:</p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>
              <strong>Right to Access / Know:</strong> You may request details on the categories and specific pieces of data collected, used, or shared.
            </li>
            <li>
              <strong>Right to Deletion &amp; Correction:</strong> You may request the deletion or correction of your personal data.
            </li>
            <li>
              <strong>Right to Opt-Out of Sale / Sharing:</strong> We do not sell personal data for monetary consideration. Under California CCPA/CPRA, the use of third-party advertising cookies may be considered &quot;sharing&quot; for cross-context behavioral advertising. You can opt out via our cookie banner or through Google Ads Settings.
            </li>
            <li>
              <strong>GDPR / UK GDPR Lawful Basis:</strong> For European users, our legal basis for processing analytics and advertising data is your affirmative consent, which you can manage or revoke at any time via our Cookie Preferences.
            </li>
            <li>
              <strong>Non-Discrimination:</strong> We will never discriminate against you, deny services, or alter calculator functionality for exercising any of your privacy rights.
            </li>
          </ul>
          <p>
            To exercise any of these rights, please contact us at{' '}
            <Link
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-emerald-600 hover:text-emerald-700 underline underline-offset-2"
            >
              {CONTACT_EMAIL}
            </Link>
            . We will respond to your request within 30 days.
          </p>

          <h2 className="text-xl font-semibold text-foreground pt-4">8. Children&apos;s Privacy</h2>
          <p>
            The Site is not intended for children under the age of 13. We do not knowingly collect
            personal information from children under 13. If you are a parent or guardian and believe
            your child has provided us with personal information, please contact us at{' '}
            <Link
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-emerald-600 hover:text-emerald-700 underline underline-offset-2"
            >
              {CONTACT_EMAIL}
            </Link>{' '}
            and we will take steps to delete such information.
          </p>

          <h2 className="text-xl font-semibold text-foreground pt-4">9. International Users</h2>
          <p>
            The Site is operated from the United States. If you are accessing the Site from the European
            Union, United Kingdom, or other regions with data protection laws, please note that your
            information may be transferred to and processed in the United States. By using the Site,
            you consent to this transfer. We take appropriate measures to ensure your data receives
            an adequate level of protection.
          </p>

          <h2 className="text-xl font-semibold text-foreground pt-4">10. Changes to This Privacy Policy</h2>
          <p>
            We may update this Privacy Policy from time to time to reflect changes in our practices
            or applicable laws. We will update the &quot;Last updated&quot; date at the top of this page whenever
            we make changes. We encourage you to review this Privacy Policy periodically. Your continued
            use of the Site after any changes constitutes your acceptance of the updated policy.
          </p>

          <h2 className="text-xl font-semibold text-foreground pt-4">11. Contact Us</h2>
          <p>
            If you have any questions, concerns, or requests about this Privacy Policy or our data
            practices, please contact us through our{' '}
            <Link
              href="/contact"
              className="text-emerald-600 hover:text-emerald-700 underline underline-offset-2"
            >
              Contact Page
            </Link>{' '}
            or email us at{' '}
            <Link
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-emerald-600 hover:text-emerald-700 underline underline-offset-2"
            >
              {CONTACT_EMAIL}
            </Link>
            .
          </p>
        </section>
      </LegalPageLayout>
    </AppShell>
  );
}
