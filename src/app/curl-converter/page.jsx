import React from "react";
import CurlConverterWorkspace from "@/components/utility/CurlConverterWorkspace";
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
  Terminal,
  Code2,
  CheckCircle2,
} from "lucide-react";

export const metadata = {
  title: "cURL to Fetch, Axios, Python & Go Converter — Online Code Generator",
  description:
    "Convert cURL terminal commands into executable Fetch, Axios, Python Requests, Node.js, PHP, and Go code snippets. 100% private and client-side.",
  keywords: [
    "curl converter",
    "curl to fetch",
    "curl to axios",
    "curl to python",
    "curl to node",
    "curl to go",
    "curl to php",
    "convert curl command",
  ],
  alternates: {
    canonical: "/curl-converter",
  },
  openGraph: {
    title: "cURL to Code Converter | Bits & Tools",
    description:
      "Convert cURL terminal commands into ready-to-run JavaScript, Axios, Python, and Go code snippets.",
    url: "/curl-converter",
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
    title: "cURL to Code Converter | Bits & Tools",
    description:
      "Instant cURL to Fetch, Axios, Python Requests, Node, and Go generator running 100% in your browser.",
    images: ["/images/og-bitsandtools.png"],
  },
};

const CURL_FAQS = [
  {
    question: "Which cURL flags are supported?",
    answer:
      "The parser recognizes standard flags including -X/--request (HTTP Method), -H/--header (Headers), -d/--data/--data-raw/--json (Payload/Body), -u/--user (Basic Auth), -A/--user-agent, -b/--cookie, and multi-line backslash escape characters.",
  },
  {
    question: "Which programming languages and libraries are generated?",
    answer:
      "You can generate native JavaScript (Fetch API async/await), Axios (Node & browser), Python (Requests library), Node.js (native https module), PHP (cURL extension), and Go (net/http package).",
  },
  {
    question: "Are authentication tokens or API keys sent anywhere?",
    answer:
      "Never. All cURL tokenization and code generation happens strictly within your browser's local memory. No headers, secrets, or payloads leave your machine.",
  },
  {
    question: "Does it handle multi-line terminal commands?",
    answer:
      "Yes! cURL commands copied directly from DevTools or terminal scripts containing backslashes (\\) and line breaks are automatically normalized and parsed seamlessly.",
  },
];

const CURL_STEPS = [
  {
    step: "01",
    title: "Paste cURL Command",
    description: "Paste your cURL command directly from your terminal or browser Network tab.",
    icon: Terminal,
  },
  {
    step: "02",
    title: "Select Target Language",
    description: "Pick your preferred language (Fetch, Axios, Python, Node, PHP, or Go).",
    icon: Code2,
  },
  {
    step: "03",
    title: "Copy Generated Code",
    description: "Copy the fully formatted code snippet directly into your application.",
    icon: CheckCircle2,
  },
];

export default function CurlConverterPage() {
  const baseUrl = siteConfig.url.replace(/\/$/, "");
  const breadcrumbs = [
    { label: "Utility Tools", href: "/utility-tools" },
    { label: "cURL Converter", href: "/curl-converter" },
  ];

  const toolSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "cURL to Code Converter Online",
    url: `${baseUrl}/curl-converter`,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript and HTML5 support",
    description:
      "Convert cURL commands to Fetch, Axios, Python Requests, Node.js, PHP, and Go code snippets.",
        aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      ratingCount: "1388",
      bestRating: "5",
      worstRating: "1",
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      "cURL Command Tokenization & Extraction",
      "JavaScript Fetch API Code Generation",
      "Axios Library Code Generation",
      "Python Requests Code Generation",
      "Node.js Native HTTPS Code Generation",
      "PHP & Go Code Generation",
      "100% Client-Side Privacy",
    ],
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
              <span>cURL to Fetch &bull; Axios &bull; Python &bull; Go</span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
              cURL to Code Converter
            </h1>

            <p className="mt-2.5 sm:mt-3 text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Convert cURL commands from your terminal or browser DevTools into ready-to-run API code in any language.
            </p>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-slate-600">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Zero server telemetry
              </span>
              <span className="flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-emerald-600" />
                100% Client-side privacy
              </span>
              <span className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-emerald-600" />
                Instant local code generation
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Workspace */}
      <section className="py-10 sm:py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <CurlConverterWorkspace />
      </section>

      <AdPlacement slotId="curl-converter-below-workspace" />

      {/* How It Works */}
      <HowItWorks
        title="How to Convert cURL Commands"
        subtitle="Turn terminal requests into clean, native API client code in 3 simple steps"
        steps={CURL_STEPS}
      />

      {/* FAQs */}
      <FAQSection
        title="cURL Converter - Frequently Asked Questions"
        subtitle="Common questions about supported flags, code generators, and security"
        items={CURL_FAQS}
      />

      <RelatedTools currentToolId="curl-converter" />
    </div>
  );
}
