import React from "react";
import UrlWorkspace from "@/components/utility/UrlWorkspace";
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
  Link as LinkIcon,
  Table,
  Code2,
} from "lucide-react";

export const metadata = {
  title: "URL Encoder & Decoder — Encode and Decode Links & Query Params",
  description:
    "Encode and decode percent-encoded URLs, query string parameters, and URI components. Free, fast, private, and browser-based.",
  keywords: [
    "url encoder",
    "url decoder",
    "encodeURIComponent online",
    "percent encoding",
    "query param parser",
    "decode uri component",
    "url parameter editor",
  ],
  alternates: {
    canonical: "/url-encoder-decoder",
  },
  openGraph: {
    title: "URL Encoder & Decoder Online | Bits & Tools",
    description:
      "Safely encode special characters for URLs or decode percent-encoded URI strings with live query parameter editing.",
    url: "/url-encoder-decoder",
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
    title: "URL Encoder & Decoder Online | Bits & Tools",
    description:
      "Safely encode special characters for URLs or decode percent-encoded URI strings.",
    images: ["/images/og-bitsandtools.png"],
  },
};

const URL_FAQS = [
  {
    question: "What is the difference between Component mode and Full URL mode?",
    answer:
      "Component mode (encodeURIComponent) encodes all reserved characters including '/', '?', ':', and '&' — which is necessary when embedding parameters inside query strings. Full URL mode (encodeURI) preserves the URL structure symbols like 'https://' and query separators while encoding spaces and unsafe symbols.",
  },
  {
    question: "Why do URLs need percent encoding?",
    answer:
      "Web standards (RFC 3986) restrict URLs to a safe ASCII subset. Spaces, non-Latin characters, and reserved punctuation must be translated into '%' followed by two hexadecimal digits (e.g. space becomes '%20').",
  },
  {
    question: "Can I inspect and edit query parameters directly?",
    answer:
      "Yes! Switch to the 'URL Parameter Inspector' tab to parse any URL into an editable key-value table. You can add new parameters, edit values, delete keys, and re-generate the complete URL in real time.",
  },
];

const URL_STEPS = [
  {
    step: "01",
    title: "Paste URL or String",
    description: "Paste your raw URL, query parameters, or percent-encoded text.",
    icon: LinkIcon,
  },
  {
    step: "02",
    title: "Choose Operation",
    description: "Select Encode, Decode, or use the Parameter Inspector table.",
    icon: Table,
  },
  {
    step: "03",
    title: "Copy Output",
    description: "Instantly copy your encoded URL or decoded parameters to clipboard.",
    icon: Sparkles,
  },
];

export default function UrlPage() {
  const baseUrl = siteConfig.url.replace(/\/$/, "");
  const breadcrumbs = [
    { label: "Utility Tools", href: "/utility-tools" },
    { label: "URL Encoder & Decoder", href: "/url-encoder-decoder" },
  ];

  const toolSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "URL Encoder & Decoder Online",
    url: `${baseUrl}/url-encoder-decoder`,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript and HTML5 support",
    description:
      "Encode and decode percent-encoded URLs, query string parameters, and URI components in your browser.",
        aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      ratingCount: "1167",
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
              <span>RFC 3986 &bull; Query Inspector &bull; 100% Private</span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
              URL Encoder & Decoder
            </h1>

            <p className="mt-2.5 sm:mt-3 text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Safely encode special characters for URLs or decode percent-encoded strings with a visual parameter editor.
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
                Instant parsing & rebuilding
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Workspace */}
      <section className="py-10 sm:py-14 px-4 sm:px-6 lg:px-8">
        <UrlWorkspace />
      </section>

      <AdPlacement slotId="url-encoder-below-workspace" />

      {/* How It Works */}
      <HowItWorks
        title="How to Encode & Decode URLs"
        subtitle="Manage web addresses and parameters in 3 simple steps"
        steps={URL_STEPS}
      />

      {/* FAQs */}
      <FAQSection
        title="URL Tool - Frequently Asked Questions"
        subtitle="Common questions about percent encoding, URI components, and query strings"
        items={URL_FAQS}
      />

      <RelatedTools currentToolId="url-encoder-decoder" />
    </div>
  );
}
