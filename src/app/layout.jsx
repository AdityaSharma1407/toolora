import "./globals.css";
import Script from "next/script";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import CookieConsentBanner from "@/components/common/CookieConsentBanner";
import AdSenseScript from "@/components/ads/AdSenseScript";
import { siteConfig } from "@/config/site";

export const metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.displayName || siteConfig.name} - Free, Fast & Private Online Tools`,
    template: `%s | ${siteConfig.displayName || siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "online tools",
    "pdf tools",
    "merge pdf",
    "split pdf",
    "compress pdf",
    "jpg to pdf",
    "combine pdf",
    "image compression",
    "free file utilities",
    "private pdf merger",
  ],
  authors: [{ name: siteConfig.displayName || siteConfig.name }],
  creator: siteConfig.displayName || siteConfig.name,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: `${siteConfig.displayName || siteConfig.name} - Free Online Utilities`,
    description: siteConfig.description,
    siteName: siteConfig.displayName || siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.displayName || siteConfig.name} - Free Online Utilities`,
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: siteConfig.analytics.searchConsoleVerification || undefined,
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest"
};

export const viewport = {
  themeColor: "#fbfbfd",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.displayName || siteConfig.name,
    alternateName: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.displayName || siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/images/og-bitsandtools.png`,
    contactPoint: {
      "@type": "ContactPoint",
      email: siteConfig.contactEmail,
      contactType: "Customer Support",
    },
  };

  return (
    <html lang="en" className="h-full scroll-smooth">
      <head>
        <meta
          name="google-adsense-account"
          content="ca-pub-8022438675607325"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body className="flex min-h-screen flex-col bg-white text-slate-900 antialiased selection:bg-brand-500 selection:text-white">
        <AdSenseScript />
        {/* Skip to Main Content Link for Keyboard Accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-brand-600 focus:text-white focus:rounded-lg focus:shadow-lg focus:outline-none"
        >
          Skip to main content
        </a>

        <Header />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer />
        <CookieConsentBanner />
        <Script
          id="google-adsense-script"
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8022438675607325"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
