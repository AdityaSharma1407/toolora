import "./globals.css";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import CookieConsentBanner from "@/components/common/CookieConsentBanner";
import AdSenseScript from "@/components/ads/AdSenseScript";
import GoogleAnalyticsScript from "@/components/analytics/GoogleAnalyticsScript";
import PwaRegister from "@/components/pwa/PwaRegister";
import InstallPwaBanner from "@/components/pwa/InstallPwaBanner";
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
  authors: [
    { name: "Vishavjeet Sharma", url: siteConfig.url },
    { name: "Aditya Sharma", url: siteConfig.url },
  ],
  creator: "Vishavjeet Sharma & Aditya Sharma",
  publisher: siteConfig.displayName || siteConfig.name,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: `${siteConfig.displayName || siteConfig.name} - Free Online Utilities`,
    description: siteConfig.description,
    siteName: siteConfig.displayName || siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage || "/images/og-bitsandtools.png",
        width: 1200,
        height: 630,
        alt: `${siteConfig.displayName || siteConfig.name} - Free Online Utilities`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.displayName || siteConfig.name} - Free Online Utilities`,
    description: siteConfig.description,
    images: [siteConfig.ogImage || "/images/og-bitsandtools.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: siteConfig.analytics.searchConsoleVerification || undefined,
    other: {
      "msvalidate.01": process.env.NEXT_PUBLIC_BING_VERIFICATION || undefined,
    },
  },
  other: {
    "google-adsense-account": "ca-pub-8022438675607325",
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
  manifest: "/site.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: siteConfig.displayName || siteConfig.name,
  },
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
    author: [
      {
        "@type": "Person",
        name: "Vishavjeet Sharma",
        jobTitle: "Co-Founder",
        email: "vishavjeetsharma88@gmail.com",
      },
      {
        "@type": "Person",
        name: "Aditya Sharma",
        jobTitle: "Co-Founder",
        email: "sharmaaditya14jul@gmail.com",
      },
    ],
    publisher: {
      "@type": "Organization",
      name: siteConfig.displayName || siteConfig.name,
      url: siteConfig.url,
      logo: `${siteConfig.url}/images/og-bitsandtools.png`,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteConfig.url}/#all-tools?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.displayName || siteConfig.name,
    alternateName: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/images/og-bitsandtools.png`,
    founder: [
      {
        "@type": "Person",
        name: "Vishavjeet Sharma",
        jobTitle: "Co-Founder",
        email: "vishavjeetsharma88@gmail.com",
        url: siteConfig.url,
      },
      {
        "@type": "Person",
        name: "Aditya Sharma",
        jobTitle: "Co-Founder",
        email: "sharmaaditya14jul@gmail.com",
        url: siteConfig.url,
      },
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        email: "vishavjeetsharma88@gmail.com",
        contactType: "Founder",
      },
      {
        "@type": "ContactPoint",
        email: "sharmaaditya14jul@gmail.com",
        contactType: "Founder",
      },
    ],
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
        <GoogleAnalyticsScript />
        <AdSenseScript />
        <PwaRegister />
        <InstallPwaBanner />
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
      </body>
    </html>
  );
}
