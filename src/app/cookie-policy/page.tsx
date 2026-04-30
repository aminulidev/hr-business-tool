import type { Metadata } from 'next';
import LegalPageLayout from '@/components/layout/LegalPageLayout';
import AppShell from '@/components/layout/AppShell';
import { CONTACT_EMAIL, SITE_NAME, SITE_URL } from '@/lib/calculator-meta';

export const metadata: Metadata = {
  title: 'Cookie Policy',
  description:
    'QuickBizCalc cookie policy. Learn about the cookies we use, why we use them, and how you can manage your cookie preferences.',
  keywords: [
    'QuickBizCalc cookie policy',
    'calculator cookies',
    'website cookie policy',
    'AdSense cookies',
    'Google Analytics cookies',
  ],
  openGraph: {
    title: `Cookie Policy | ${SITE_NAME}`,
    description: `Learn how ${SITE_NAME} uses cookies and tracking technologies.`,
    url: `${SITE_URL}/cookie-policy`,
    type: 'website',
  },
  alternates: {
    canonical: `${SITE_URL}/cookie-policy`,
  },
};

export default function CookiePolicyPage() {
  return (
    <AppShell>
      <LegalPageLayout title="Cookie Policy" lastUpdated="April 21, 2026">
        <section className="space-y-6 text-sm leading-relaxed text-foreground/80">
          <p>
            This Cookie Policy explains how QuickBizCalc (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) uses cookies and similar
            technologies when you visit our website at{' '}
            <a
              href={SITE_URL}
              className="text-emerald-600 hover:text-emerald-700 underline underline-offset-2"
            >
              {SITE_URL}
            </a>{' '}
            (the &quot;Site&quot;). This policy should be read alongside our{' '}
            <a
              href="/privacy-policy"
              className="text-emerald-600 hover:text-emerald-700 underline underline-offset-2"
            >
              Privacy Policy
            </a>
            , which provides more general information about how we handle your data.
          </p>

          <h2 className="text-xl font-semibold text-foreground pt-4">1. What Are Cookies?</h2>
          <p>
            Cookies are small text files that are placed on your device (computer, smartphone, or
            tablet) when you visit a website. They are widely used to make websites work more
            efficiently, provide a better browsing experience, and supply information to the website
            owners. Cookies can be &quot;persistent&quot; (remaining on your device until they expire or you
            delete them) or &quot;session&quot; (deleted when you close your browser).
          </p>
          <p>
            Similar technologies include local storage (which stores data directly in your browser),
            web beacons (also known as pixel tags or clear GIFs, which are tiny graphics used to track
            page views and user behavior), and fingerprinting techniques. For simplicity, we refer to
            all of these as &quot;cookies&quot; in this policy.
          </p>

          <h2 className="text-xl font-semibold text-foreground pt-4">2. How We Use Cookies</h2>
          <p>
            We use cookies on the Site for the following purposes. Cookies are categorized based on
            their function and necessity:
          </p>

          {/* Strictly Necessary */}
          <div className="rounded-xl border border-border/50 bg-muted/20 p-5 mt-4">
            <h3 className="text-base font-semibold text-foreground mb-2">
              2.1 Strictly Necessary Cookies
            </h3>
            <p className="mb-2">
              These cookies are essential for the Site to function properly. They enable core
              functionality such as page navigation and access to secure areas. The Site cannot
              function properly without these cookies. These cookies do not store any personally
              identifiable information.
            </p>
            <div className="overflow-x-auto mt-3">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-left py-2 pr-4 font-semibold text-foreground">Cookie</th>
                    <th className="text-left py-2 pr-4 font-semibold text-foreground">Purpose</th>
                    <th className="text-left py-2 pr-4 font-semibold text-foreground">Duration</th>
                    <th className="text-left py-2 font-semibold text-foreground">Type</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border/20">
                    <td className="py-2 pr-4 font-mono">cookie_consent</td>
                    <td className="py-2 pr-4">Stores your cookie consent preference</td>
                    <td className="py-2 pr-4">1 year</td>
                    <td className="py-2">First-party</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Analytics */}
          <div className="rounded-xl border border-border/50 bg-muted/20 p-5">
            <h3 className="text-base font-semibold text-foreground mb-2">
              2.2 Analytics Cookies
            </h3>
            <p className="mb-2">
              These cookies help us understand how visitors interact with our Site by collecting and
              reporting information anonymously. This helps us improve the Site&apos;s performance,
              content, and user experience. We use Google Analytics for this purpose.
            </p>
            <div className="overflow-x-auto mt-3">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-left py-2 pr-4 font-semibold text-foreground">Cookie</th>
                    <th className="text-left py-2 pr-4 font-semibold text-foreground">Purpose</th>
                    <th className="text-left py-2 pr-4 font-semibold text-foreground">Duration</th>
                    <th className="text-left py-2 font-semibold text-foreground">Type</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border/20">
                    <td className="py-2 pr-4 font-mono">_ga</td>
                    <td className="py-2 pr-4">Distinguishes unique visitors</td>
                    <td className="py-2 pr-4">2 years</td>
                    <td className="py-2">Third-party (Google)</td>
                  </tr>
                  <tr className="border-b border-border/20">
                    <td className="py-2 pr-4 font-mono">_ga_*</td>
                    <td className="py-2 pr-4">Maintains session state</td>
                    <td className="py-2 pr-4">2 years</td>
                    <td className="py-2">Third-party (Google)</td>
                  </tr>
                  <tr className="border-b border-border/20">
                    <td className="py-2 pr-4 font-mono">_gid</td>
                    <td className="py-2 pr-4">Distinguishes unique visitors within 24 hours</td>
                    <td className="py-2 pr-4">24 hours</td>
                    <td className="py-2">Third-party (Google)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Advertising */}
          <div className="rounded-xl border border-border/50 bg-muted/20 p-5">
            <h3 className="text-base font-semibold text-foreground mb-2">
              2.3 Advertising Cookies
            </h3>
            <p className="mb-2">
              These cookies are used to deliver advertisements that are relevant to you and your
              interests. They also help limit the number of times you see an advertisement and measure
              the effectiveness of advertising campaigns. These cookies are usually placed by advertising
              networks with our permission. We use Google AdSense for advertising on the Site.
            </p>
            <div className="overflow-x-auto mt-3">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-left py-2 pr-4 font-semibold text-foreground">Cookie</th>
                    <th className="text-left py-2 pr-4 font-semibold text-foreground">Purpose</th>
                    <th className="text-left py-2 pr-4 font-semibold text-foreground">Duration</th>
                    <th className="text-left py-2 font-semibold text-foreground">Type</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border/20">
                    <td className="py-2 pr-4 font-mono">__gads</td>
                    <td className="py-2 pr-4">Google AdSense advertising cookie</td>
                    <td className="py-2 pr-4">13 months</td>
                    <td className="py-2">Third-party (Google)</td>
                  </tr>
                  <tr className="border-b border-border/20">
                    <td className="py-2 pr-4 font-mono">__gpi</td>
                    <td className="py-2 pr-4">Google AdSense publisher identification</td>
                    <td className="py-2 pr-4">13 months</td>
                    <td className="py-2">Third-party (Google)</td>
                  </tr>
                  <tr className="border-b border-border/20">
                    <td className="py-2 pr-4 font-mono">IDE, DSID</td>
                    <td className="py-2 pr-4">Google DoubleClick ad targeting</td>
                    <td className="py-2 pr-4">1 year</td>
                    <td className="py-2">Third-party (Google)</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 font-mono">NID</td>
                    <td className="py-2 pr-4">Google ad personalization</td>
                    <td className="py-2 pr-4">6 months</td>
                    <td className="py-2">Third-party (Google)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <h2 className="text-xl font-semibold text-foreground pt-4">3. Third-Party Cookies</h2>
          <p>
            In addition to our own cookies, we may use cookies from the following third parties:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>
              <strong>Google Analytics:</strong> A web analytics service provided by Google, Inc.
              Google Analytics uses cookies to analyze how visitors use the Site. The information
              generated is transmitted to and stored by Google on servers in the United States. For
              more information, visit{' '}
              <a
                href="https://policies.google.com/privacy"
                className="text-emerald-600 hover:text-emerald-700 underline underline-offset-2"
                target="_blank"
                rel="noopener noreferrer"
              >
                Google&apos;s Privacy Policy
              </a>
              .
            </li>
            <li>
              <strong>Google AdSense:</strong> An advertising service provided by Google, Inc. AdSense
              uses cookies to serve ads based on users&apos; prior visits to this Site and other websites.
              Google&apos;s use of the DoubleClick cookie enables it and its partners to serve ads to
              visitors based on their browsing activity. For more information, visit{' '}
              <a
                href="https://policies.google.com/technologies/ads"
                className="text-emerald-600 hover:text-emerald-700 underline underline-offset-2"
                target="_blank"
                rel="noopener noreferrer"
              >
                Google Advertising Privacy
              </a>
              .
            </li>
          </ul>

          <h2 className="text-xl font-semibold text-foreground pt-4">4. Your Cookie Choices</h2>
          <p>You have several options for managing cookies:</p>

          <h3 className="text-base font-semibold text-foreground mt-4">4.1 Cookie Consent Banner</h3>
          <p>
            When you first visit QuickBizCalc, you will see a cookie consent banner at the bottom of the
            page. This banner allows you to accept or customize your cookie preferences. You can
            choose to accept all cookies, accept only necessary cookies, or manage your preferences
            individually. Your choice will be saved and respected on subsequent visits.
          </p>

          <h3 className="text-base font-semibold text-foreground mt-4">4.2 Browser Settings</h3>
          <p>
            Most web browsers allow you to control cookies through their settings. You can set your
            browser to refuse all cookies, accept only first-party cookies, or delete cookies when
            you close your browser. Here are links to common browser cookie settings:
          </p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li>
              <a
                href="https://support.google.com/chrome/answer/95647"
                className="text-emerald-600 hover:text-emerald-700 underline underline-offset-2"
                target="_blank"
                rel="noopener noreferrer"
              >
                Google Chrome
              </a>
            </li>
            <li>
              <a
                href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer"
                className="text-emerald-600 hover:text-emerald-700 underline underline-offset-2"
                target="_blank"
                rel="noopener noreferrer"
              >
                Mozilla Firefox
              </a>
            </li>
            <li>
              <a
                href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac"
                className="text-emerald-600 hover:text-emerald-700 underline underline-offset-2"
                target="_blank"
                rel="noopener noreferrer"
              >
                Apple Safari
              </a>
            </li>
            <li>
              <a
                href="https://support.microsoft.com/en-us/microsoft-edge/manage-cookies-in-microsoft-edge-view-allow-block-delete-and-use-168dab11-0753-043d-7c16-ede5947fc64d"
                className="text-emerald-600 hover:text-emerald-700 underline underline-offset-2"
                target="_blank"
                rel="noopener noreferrer"
              >
                Microsoft Edge
              </a>
            </li>
          </ul>

          <h3 className="text-base font-semibold text-foreground mt-4">4.3 Opt-Out Tools</h3>
          <p>
            You can opt out of personalized advertising from Google by visiting{' '}
            <a
              href="https://www.google.com/settings/ads"
              className="text-emerald-600 hover:text-emerald-700 underline underline-offset-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google Ads Settings
            </a>
            . Additionally, you can opt out of third-party vendor cookies for personalized advertising
            by visiting{' '}
            <a
              href="https://optout.aboutads.info/"
              className="text-emerald-600 hover:text-emerald-700 underline underline-offset-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              Digital Advertising Alliance&apos;s opt-out page
            </a>{' '}
            or{' '}
            <a
              href="https://optout.networkadvertising.org/"
              className="text-emerald-600 hover:text-emerald-700 underline underline-offset-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              Network Advertising Initiative&apos;s opt-out page
            </a>
            .
          </p>

          <h3 className="text-base font-semibold text-foreground mt-4">4.4 Impact of Disabling Cookies</h3>
          <p>
            If you choose to disable cookies, some features of the Site may not function properly.
            Strictly necessary cookies cannot be disabled, as they are required for basic Site
            operation. Disabling analytics and advertising cookies will not affect your ability to
            use the calculator tools, but it may result in seeing less relevant advertisements.
          </p>

          <h2 className="text-xl font-semibold text-foreground pt-4">5. Changes to This Cookie Policy</h2>
          <p>
            We may update this Cookie Policy from time to time to reflect changes in the cookies we
            use or for other operational, legal, or regulatory reasons. We will update the &quot;Last updated&quot;
            date at the top of this page whenever we make changes. We encourage you to review this
            Cookie Policy periodically to stay informed about our use of cookies and related technologies.
          </p>

          <h2 className="text-xl font-semibold text-foreground pt-4">6. Contact Us</h2>
          <p>
            If you have any questions about our use of cookies or this Cookie Policy, please contact
            us through our{' '}
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
