import type { Metadata } from 'next';
import LegalPageLayout from '@/components/layout/LegalPageLayout';
import { SITE_NAME, SITE_URL } from '@/lib/calculator-meta';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'CalcHub privacy policy. Learn how we collect, use, and protect your information when you use our free online business and HR calculators.',
  keywords: [
    'CalcHub privacy policy',
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
    <LegalPageLayout title="Privacy Policy" lastUpdated="April 21, 2026">
      <section className="space-y-6 text-sm leading-relaxed text-foreground/80">
        <p>
          At CalcHub (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;), we are committed to protecting your privacy.
          This Privacy Policy explains how we collect, use, disclose, and safeguard your information
          when you visit our website at{' '}
          <a
            href={SITE_URL}
            className="text-emerald-600 hover:text-emerald-700 underline underline-offset-2"
          >
            {SITE_URL}
          </a>{' '}
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
          <a
            href="/cookie-policy"
            className="text-emerald-600 hover:text-emerald-700 underline underline-offset-2"
          >
            Cookie Policy
          </a>
          .
        </p>

        <h3 className="text-base font-semibold text-foreground mt-4">1.3 Information from Third-Party Services</h3>
        <p>
          We use Google AdSense to display advertisements on our Site. Google may use cookies and web
          beacons to serve ads based on your prior visits to our Site or other websites. Google&apos;s use
          of advertising cookies enables it and its partners to serve ads based on your visit to our
          Site and/or other sites on the Internet. You may opt out of personalized advertising by
          visiting{' '}
          <a
            href="https://www.google.com/settings/ads"
            className="text-emerald-600 hover:text-emerald-700 underline underline-offset-2"
            target="_blank"
            rel="noopener noreferrer"
          >
            Google Ads Settings
          </a>
          .
        </p>

        <p>
          We may also use Google Analytics to understand how visitors interact with our Site. Google
          Analytics collects information such as how often users visit the Site, what pages they visit,
          and what other sites they used prior to coming to the Site. We use this information solely
          to improve the Site. Google Analytics collects only the IP address assigned to you on the date
          you visit the Site, rather than your name or other identifying information.
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
          <a
            href="/cookie-policy"
            className="text-emerald-600 hover:text-emerald-700 underline underline-offset-2"
          >
            Cookie Policy
          </a>
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

        <h2 className="text-xl font-semibold text-foreground pt-4">7. Your Rights and Choices</h2>
        <p>Depending on your jurisdiction, you may have the following rights regarding your data:</p>
        <ul className="list-disc pl-6 space-y-2 mt-2">
          <li>
            <strong>Access:</strong> You may request information about the data we hold about you.
          </li>
          <li>
            <strong>Correction:</strong> You may request correction of inaccurate data.
          </li>
          <li>
            <strong>Deletion:</strong> You may request deletion of your data.
          </li>
          <li>
            <strong>Opt-Out:</strong> You may opt out of personalized advertising through Google Ads
            Settings or use a browser extension to manage cookies.
          </li>
          <li>
            <strong>Do Not Track:</strong> Some browsers support a &quot;Do Not Track&quot; feature. Our Site
            currently does not respond to DNT signals, but you can manage tracking through cookie settings.
          </li>
        </ul>
        <p>
          To exercise any of these rights, please contact us at{' '}
          <a
            href="mailto:privacy@calchub.com"
            className="text-emerald-600 hover:text-emerald-700 underline underline-offset-2"
          >
            privacy@calchub.com
          </a>
          . We will respond to your request within 30 days.
        </p>

        <h2 className="text-xl font-semibold text-foreground pt-4">8. Children&apos;s Privacy</h2>
        <p>
          The Site is not intended for children under the age of 13. We do not knowingly collect
          personal information from children under 13. If you are a parent or guardian and believe
          your child has provided us with personal information, please contact us at{' '}
          <a
            href="mailto:privacy@calchub.com"
            className="text-emerald-600 hover:text-emerald-700 underline underline-offset-2"
          >
            privacy@calchub.com
          </a>{' '}
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
          <a
            href="/contact"
            className="text-emerald-600 hover:text-emerald-700 underline underline-offset-2"
          >
            Contact Page
          </a>{' '}
          or email us at{' '}
          <a
            href="mailto:privacy@calchub.com"
            className="text-emerald-600 hover:text-emerald-700 underline underline-offset-2"
          >
            privacy@calchub.com
          </a>
          .
        </p>
      </section>
    </LegalPageLayout>
  );
}
