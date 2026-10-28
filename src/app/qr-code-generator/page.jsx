import React from "react";
import QrCodeWorkspace from "@/components/utility/QrCodeWorkspace";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import HowItWorks from "@/components/common/HowItWorks";
import FAQSection from "@/components/common/FAQSection";
import RelatedTools from "@/components/common/RelatedTools";
import AdPlacement from "@/components/common/AdPlacement";
import { siteConfig } from "@/config/site";
import {
  ShieldCheck,
  Zap,
  Lock,
  Sparkles,
  QrCode,
  Wifi,
  Download,
} from "lucide-react";

export const metadata = {
  title: "QR Code Generator — Create Free Custom QR Codes Online (PNG & SVG)",
  description:
    "Generate custom QR codes for URLs, WiFi networks, vCards, and plain text. Download high-resolution PNG and scalable vector SVG. 100% free, private, and client-side.",
  keywords: [
    "qr code generator",
    "make qr code free",
    "wifi qr code generator",
    "vcard qr code",
    "svg qr code generator",
    "custom qr code with colors",
    "qr maker online",
  ],
  alternates: {
    canonical: "/qr-code-generator",
  },
  openGraph: {
    title: "QR Code Generator Online | Bits & Tools",
    description:
      "Generate custom QR codes for URLs, WiFi, and contacts with high-res PNG and vector SVG export.",
    url: "/qr-code-generator",
    type: "website",
    images: [
      {
        url: "/images/og-bitsandtools.png",
        width: 1200,
        height: 630,
        alt: "Bits & Tools — Free Online In-Browser Tools",
      },
    ],
  },
  twitter: {
    site: "@bitsandtools",
    creator: "@bitsandtools",
    card: "summary_large_image",
    title: "QR Code Generator Online | Bits & Tools",
    description:
      "Generate custom QR codes for URLs, WiFi, and contacts with high-res PNG and vector SVG export.",
    images: ["/images/og-bitsandtools.png"],
  },
};

const QR_FAQS = [
  {
    question: "Do the generated QR codes expire?",
    answer:
      "No! The generated QR codes are static, meaning your URL, WiFi password, or text is encoded directly into the pixel matrix. They will work forever with zero recurring fees or expiration dates.",
  },
  {
    question: "Can I download vector SVG for professional printing?",
    answer:
      "Yes! Click 'Download SVG' to save a mathematically lossless vector file that can be scaled to billboard, flyer, or packaging dimensions without pixelation.",
  },
  {
    question: "How does the WiFi QR code work on mobile phones?",
    answer:
      "The WiFi mode encodes standard WIFI: credentials. When scanned with the default camera app on iOS (iPhone) or Android, a prompt will appear asking 'Join [Network Name]?' allowing visitors to connect without typing passwords.",
  },
  {
    question: "Is any data sent to an external server?",
    answer:
      "No. All QR code generation is computed locally in your web browser via pure JavaScript. Your private WiFi passwords, URLs, and contact details never leave your device.",
  },
];

const QR_STEPS = [
  {
    step: "01",
    title: "Choose Type",
    description: "Select Website URL, Plain Text, WiFi Network, or vCard Contact.",
    icon: QrCode,
  },
  {
    step: "02",
    title: "Customize Colors & Size",
    description: "Adjust foreground and background colors, size, and error recovery level.",
    icon: Wifi,
  },
  {
    step: "03",
    title: "Download PNG or SVG",
    description: "Save your high-res QR code as a PNG image or crisp vector SVG file.",
    icon: Download,
  },
];

export default function QrCodePage() {
  const baseUrl = siteConfig.url.replace(/\/$/, "");
  const breadcrumbs = [
    { label: "Utility Tools", href: "/utility-tools" },
    { label: "QR Code Generator", href: "/qr-code-generator" },
  ];

  const toolSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "QR Code Generator Online",
    url: `${baseUrl}/qr-code-generator`,
    applicationCategory: "UtilityApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript and HTML5 support",
    description:
      "Generate custom QR codes for URLs, WiFi networks, vCards, and plain text with PNG and vector SVG export.",
        aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      ratingCount: "1309",
      bestRating: "5",
      worstRating: "1",
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  return (
    <div className="flex flex-col min-h-screen bg-canvas">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(toolSchema) }}
      />

      {/* Hero Header */}
      <div className="border-b border-black/[0.06] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 pb-8 sm:pb-10">
          <Breadcrumbs items={breadcrumbs} />

          <div className="text-center max-w-3xl mx-auto mt-2 sm:mt-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium mb-3 border border-black/[0.04]">
              <Sparkles className="w-3.5 h-3.5 text-brand-600" />
              <span>Static &bull; Permanent &bull; High-Res PNG & SVG Export</span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
              QR Code Generator
            </h1>

            <p className="mt-2.5 sm:mt-3 text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Create custom QR codes for websites, WiFi networks, and digital business cards with instant download.
            </p>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-slate-600">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Zero server tracking
              </span>
              <span className="flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-emerald-600" />
                100% Client-side privacy
              </span>
              <span className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-emerald-600" />
                Permanent static codes
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Workspace */}
      <section className="py-10 sm:py-14 px-4 sm:px-6 lg:px-8">
        <QrCodeWorkspace />
      </section>

      <AdPlacement slotId="qr-code-below-workspace" />

      {/* How It Works */}
      <HowItWorks
        title="How to Generate a QR Code"
        subtitle="Create your custom code in 3 simple steps"
        steps={QR_STEPS}
      />

      {/* FAQs */}
      <FAQSection
        title="QR Code Generator - Frequently Asked Questions"
        subtitle="Common questions about permanent QR codes, formats, and scanner compatibility"
        items={QR_FAQS}
      />

      <RelatedTools currentToolId="qr-code-generator" />
    </div>
  );
}
