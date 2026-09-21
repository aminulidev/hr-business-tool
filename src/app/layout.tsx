import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { CONTACT_EMAIL, SITE_URL, SITE_NAME, SITE_TAGLINE } from '@/lib/calculator-meta';
import { CONFIG } from "@/lib/config";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} — ${SITE_TAGLINE}`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Free professional calculators for sales commission, payroll, salary, profit margin, ROI, and more. Accurate, fast, and instant results for small business owners and HR professionals.",
  keywords: [
    "business calculators",
    "HR calculators",
    "commission calculator",
    "payroll calculator",
    "salary calculator",
    "profit margin calculator",
    "ROI calculator",
    "time card calculator",
    "bonus tax calculator",
    "free online calculators",
    "small business tools",
    "financial calculators",
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  metadataBase: new URL(SITE_URL),
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  // Prevent indexing of URL parameter variants (e.g. ?q={search_term_string})
  // These appear in GSC as "Alternate page with proper canonical tag"
  // The canonical on the homepage points to itself without query params.
  // NOTE: Do NOT set a global canonical here — each page sets its own
  // canonical via generateMetadata / the page-level `alternates.canonical`.
  // A root-level canonical would override all child pages and cause them to
  // be reported as "Alternate page with proper canonical tag" in GSC.
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description:
      "Free professional calculators for sales commission, payroll, salary, profit margin, ROI, and more. Accurate, fast, and instant results.",
    images: [
      {
        url: "/og-image.png",
        width: 1344,
        height: 768,
        alt: `${SITE_NAME} — ${SITE_TAGLINE}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    creator: "@QuickBizCalc",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.png",
    apple: "/apple-touch-icon.png",
  },
  verification: {
    // google: "your-google-verification-code", // Uncomment and set when you receive verification from Google Search Console
  },
  // AdSense meta tag — required for Google to verify the site
  other: {
    "google-adsense-account": CONFIG.monetization.adSenseId,
  },
};

// JSON-LD WebSite schema — sitelinks search box + site identity
const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  alternateName: "Quick Biz Calc",
  url: SITE_URL,
  description:
    "Free online business and HR calculators — payroll, paycheck, time card, profit margin, ROI, commission, overtime, and 27 more tools for US small business owners.",
  inLanguage: "en-US",
  publisher: {
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/logo.svg`,
      width: 512,
      height: 512,
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: CONTACT_EMAIL,
      availableLanguage: ["English"],
    },
  },
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_URL}/?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

// JSON-LD Organization schema — helps AdSense reviewers understand who runs the site
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/logo.svg`,
  description:
    "QuickBizCalc publishes free, ad-supported business and HR calculators for US small business owners, HR professionals, and accountants.",
  foundingDate: "2025",
  sameAs: [
    "https://twitter.com/QuickBizCalc",
  ],
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: CONTACT_EMAIL,
      availableLanguage: ["English"],
      url: `${SITE_URL}/contact`,
    },
    {
      "@type": "ContactPoint",
      contactType: "privacy",
      email: CONTACT_EMAIL,
      availableLanguage: ["English"],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#059669" />
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" />
        {CONFIG.analytics.gaId && (
          <link rel="preconnect" href="https://www.googletagmanager.com" />
        )}
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {/* Google AdSense Script */}
        {CONFIG.monetization.adSenseId && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${CONFIG.monetization.adSenseId}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}

        {/* Google Analytics Scripts */}
        {CONFIG.analytics.gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${CONFIG.analytics.gaId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${CONFIG.analytics.gaId}');
              `}
            </Script>
          </>
        )}

        <Link
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-background focus:text-foreground top-0 left-0"
        >
          Skip to main content
        </Link>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
