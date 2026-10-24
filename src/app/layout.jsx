import "./globals.css";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import CookieConsentBanner from "@/components/common/CookieConsentBanner";
import AdSenseScript from "@/components/ads/AdSenseScript";
import { siteConfig } from "@/config/site";

export const metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} - Free, Fast & Private Online Tools`,
    template: `%s | ${siteConfig.name}`,
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
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: `${siteConfig.name} - Free Online Utilities`,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} - Free Online Utilities`,
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: siteConfig.analytics.searchConsoleVerification || undefined,
  },
};

export const viewport = {
  themeColor: "#2563eb",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full scroll-smooth">
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
      </body>
    </html>
  );
}
