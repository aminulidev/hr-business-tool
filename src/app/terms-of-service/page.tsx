import type { Metadata } from 'next';
import LegalPageLayout from '@/components/layout/LegalPageLayout';
import { SITE_NAME, SITE_URL } from '@/lib/calculator-meta';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description:
    'CalcHub terms of service. Read the terms and conditions that govern your use of our free online business and HR calculator tools.',
  keywords: [
    'CalcHub terms of service',
    'calculator terms and conditions',
    'terms of use',
    'website terms',
  ],
  openGraph: {
    title: `Terms of Service | ${SITE_NAME}`,
    description: `Terms and conditions governing the use of ${SITE_NAME}.`,
    url: `${SITE_URL}/terms-of-service`,
    type: 'website',
  },
  alternates: {
    canonical: `${SITE_URL}/terms-of-service`,
  },
};

export default function TermsOfServicePage() {
  return (
    <LegalPageLayout title="Terms of Service" lastUpdated="April 21, 2026">
      <section className="space-y-6 text-sm leading-relaxed text-foreground/80">
        <p>
          Welcome to CalcHub. These Terms of Service (&quot;Terms&quot;) govern your access to and use of
          the CalcHub website located at{' '}
          <a
            href={SITE_URL}
            className="text-emerald-600 hover:text-emerald-700 underline underline-offset-2"
          >
            {SITE_URL}
          </a>{' '}
          (the &quot;Site&quot;), including all calculator tools, content, and features provided through the
          Site. By accessing or using the Site, you agree to be bound by these Terms. If you do not
          agree to these Terms, please do not use the Site.
        </p>

        <h2 className="text-xl font-semibold text-foreground pt-4">1. Acceptance of Terms</h2>
        <p>
          By accessing, browsing, or using the Site in any way, you acknowledge that you have read,
          understood, and agree to be bound by these Terms of Service, as well as our{' '}
          <a
            href="/privacy-policy"
            className="text-emerald-600 hover:text-emerald-700 underline underline-offset-2"
          >
            Privacy Policy
          </a>{' '}
          and{' '}
          <a
            href="/disclaimer"
            className="text-emerald-600 hover:text-emerald-700 underline underline-offset-2"
          >
            Disclaimer
          </a>
          , which are incorporated by reference into these Terms. We reserve the right to modify
          these Terms at any time, and your continued use of the Site after changes are posted
          constitutes acceptance of the modified Terms.
        </p>

        <h2 className="text-xl font-semibold text-foreground pt-4">2. Description of Service</h2>
        <p>
          CalcHub provides free online calculator tools for small business, human resources, and
          financial planning purposes. Our calculators include tools for sales commission, pro rata
          salary, salary increase, payroll estimation, time card calculation, profit margin analysis,
          bonus tax calculation, and return on investment analysis. All calculations are performed
          client-side in your web browser using JavaScript. The Site and its tools are provided
          &quot;as is&quot; and &quot;as available&quot; without any warranties of any kind.
        </p>

        <h2 className="text-xl font-semibold text-foreground pt-4">3. Use of the Site</h2>
        <p>You agree to use the Site only for lawful purposes and in accordance with these Terms. You agree not to:</p>
        <ul className="list-disc pl-6 space-y-2 mt-2">
          <li>Use the Site in any way that violates any applicable federal, state, local, or international law or regulation</li>
          <li>Attempt to gain unauthorized access to, interfere with, damage, or disrupt any parts of the Site, the server on which the Site is hosted, or any server, computer, or database connected to the Site</li>
          <li>Use any automated means, including bots, scrapers, or spiders, to access the Site for any purpose without our express written permission</li>
          <li>Introduce any viruses, malware, or other harmful material into the Site</li>
          <li>Use the Site to transmit any spam, unsolicited messages, or promotional material</li>
          <li>Reproduce, duplicate, copy, sell, resell, or exploit any portion of the Site for commercial purposes without our express written permission</li>
          <li>Attempt to reverse-engineer, decompile, or disassemble any software used on the Site</li>
          <li>Remove, alter, or obscure any proprietary notices on the Site</li>
        </ul>

        <h2 className="text-xl font-semibold text-foreground pt-4">4. Intellectual Property</h2>
        <p>
          The Site, including its original content, features, functionality, design, graphics, and
          the calculator algorithms and code, are owned by CalcHub and are protected by international
          copyright, trademark, patent, trade secret, and other intellectual property laws. Our
          trademarks, service marks, and trade dress may not be used in connection with any product
          or service without the prior written consent of CalcHub. You are granted a limited,
          non-exclusive, non-transferable, revocable license to access and use the Site and its
          calculator tools for your personal or business use.
        </p>

        <h2 className="text-xl font-semibold text-foreground pt-4">5. Accuracy of Calculations</h2>
        <p>
          While we strive to ensure that all calculator tools produce accurate results, CalcHub makes
          no guarantee, representation, or warranty regarding the accuracy, reliability, or completeness
          of any calculation results. Tax laws, regulations, and business practices vary by jurisdiction
          and change frequently. Our calculators provide general estimates and should not be relied upon
          as the sole basis for financial, tax, legal, or employment decisions. You should consult with
          a qualified professional (such as a CPA, tax advisor, or attorney) for advice specific to your
          situation. Please read our full{' '}
          <a
            href="/disclaimer"
            className="text-emerald-600 hover:text-emerald-700 underline underline-offset-2"
          >
            Disclaimer
          </a>{' '}
          for additional details.
        </p>

        <h2 className="text-xl font-semibold text-foreground pt-4">6. Third-Party Links and Content</h2>
        <p>
          The Site may contain links to third-party websites, services, or advertisements that are
          not owned or controlled by CalcHub. We have no control over, and assume no responsibility
          for, the content, privacy policies, or practices of any third-party websites or services.
          We strongly advise you to read the terms and conditions and privacy policies of any
          third-party websites or services that you visit. The inclusion of any link does not imply
          our endorsement or association with the linked website.
        </p>

        <h2 className="text-xl font-semibold text-foreground pt-4">7. Advertising</h2>
        <p>
          CalcHub displays advertisements provided by third-party advertising networks, including
          Google AdSense. These advertisements may use cookies, web beacons, or similar technologies
          to collect information about your browsing behavior and interests to display relevant ads.
          Your interaction with advertisers on the Site is at your own risk. CalcHub is not responsible
          for the content, accuracy, or practices of any third-party advertisers. For more information
          about how ads are served, please see our{' '}
          <a
            href="/privacy-policy"
            className="text-emerald-600 hover:text-emerald-700 underline underline-offset-2"
          >
            Privacy Policy
          </a>{' '}
          and{' '}
          <a
            href="/cookie-policy"
            className="text-emerald-600 hover:text-emerald-700 underline underline-offset-2"
          >
            Cookie Policy
          </a>
          .
        </p>

        <h2 className="text-xl font-semibold text-foreground pt-4">8. Limitation of Liability</h2>
        <p>
          TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, CALCHUB AND ITS OPERATORS, DIRECTORS,
          EMPLOYEES, AGENTS, AND AFFILIATES SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL,
          SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS,
          DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM (A) YOUR ACCESS TO OR USE
          OF (OR INABILITY TO ACCESS OR USE) THE SITE; (B) ANY CONDUCT OR CONTENT OF ANY THIRD PARTY
          ON THE SITE; (C) ANY CONTENT OBTAINED FROM THE SITE; OR (D) UNAUTHORIZED ACCESS, USE, OR
          ALTERATION OF YOUR TRANSMISSIONS OR CONTENT.
        </p>
        <p>
          IN NO EVENT SHALL CALCHUB&apos;S TOTAL AGGREGATE LIABILITY TO YOU FOR ALL CLAIMS ARISING FROM
          OR RELATED TO THE USE OF THE SITE EXCEED THE AMOUNT OF ONE HUNDRED U.S. DOLLARS ($100.00).
        </p>

        <h2 className="text-xl font-semibold text-foreground pt-4">9. Indemnification</h2>
        <p>
          You agree to defend, indemnify, and hold harmless CalcHub and its operators, directors,
          employees, agents, and affiliates from and against any and all claims, damages, obligations,
          losses, liabilities, costs, or debt arising from (a) your use of the Site; (b) your
          violation of these Terms; (c) your violation of any applicable law or regulation; or
          (d) your violation of any rights of a third party.
        </p>

        <h2 className="text-xl font-semibold text-foreground pt-4">10. Termination</h2>
        <p>
          We reserve the right to terminate or suspend access to the Site immediately, without prior
          notice or liability, for any reason, including without limitation if you breach these Terms.
          Upon termination, your right to use the Site will immediately cease. All provisions of these
          Terms that by their nature should survive termination shall survive, including without
          limitation ownership provisions, warranty disclaimers, indemnification, and limitations of
          liability.
        </p>

        <h2 className="text-xl font-semibold text-foreground pt-4">11. Governing Law</h2>
        <p>
          These Terms shall be governed and construed in accordance with the laws of the United States,
          without regard to its conflict of law provisions. Any disputes arising under or in connection
          with these Terms shall be subject to the exclusive jurisdiction of the courts located in the
          United States.
        </p>

        <h2 className="text-xl font-semibold text-foreground pt-4">12. Changes to Terms</h2>
        <p>
          We reserve the right to modify or replace these Terms at any time at our sole discretion.
          If a revision is material, we will provide at least 30 days&apos; notice prior to any new terms
          taking effect. What constitutes a material change will be determined at our sole discretion.
          By continuing to access or use the Site after any revisions become effective, you agree to
          be bound by the revised Terms.
        </p>

        <h2 className="text-xl font-semibold text-foreground pt-4">13. Contact Information</h2>
        <p>
          If you have any questions about these Terms of Service, please contact us through our{' '}
          <a
            href="/contact"
            className="text-emerald-600 hover:text-emerald-700 underline underline-offset-2"
          >
            Contact Page
          </a>{' '}
          or email us at{' '}
          <a
            href="mailto:legal@calchub.com"
            className="text-emerald-600 hover:text-emerald-700 underline underline-offset-2"
          >
            legal@calchub.com
          </a>
          .
        </p>
      </section>
    </LegalPageLayout>
  );
}
