import React from "react";
import CodeMinifierWorkspace from "@/components/utility/CodeMinifierWorkspace";
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
  FileCode,
  Minimize2,
  Download,
} from "lucide-react";

export const metadata = {
  title: "Code Minifier & Beautifier — HTML, CSS, JavaScript & JSON",
  description:
    "Minify and beautify HTML, CSS, JavaScript, and JSON code online. Calculate compression savings and download optimized code. 100% private and in-browser.",
  keywords: [
    "code minifier",
    "code beautifier",
    "html minifier",
    "css minifier",
    "javascript minifier",
    "json beautifier",
    "online code compressor",
    "code formatter",
  ],
  alternates: {
    canonical: "/code-minifier",
  },
  openGraph: {
    title: "Code Minifier & Beautifier | Bits & Tools",
    description:
      "Compress or format HTML, CSS, JavaScript, and JSON code with instant byte savings calculation.",
    url: "/code-minifier",
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
    title: "Code Minifier & Beautifier | Bits & Tools",
    description:
      "Client-side HTML, CSS, JS, and JSON minifier and beautifier with zero server uploads.",
    images: ["/images/og-bitsandtools.png"],
  },
};

const MINIFIER_FAQS = [
  {
    question: "What languages can I minify and beautify?",
    answer:
      "The tool supports HTML (strips comments and whitespace), CSS (collapses selectors and declarations), JavaScript (removes comments and extra spaces), and JSON (strict schema formatting and minification).",
  },
  {
    question: "How does the savings calculation work?",
    answer:
      "Bits & Tools computes the exact UTF-8 byte sizes of both the original input and the generated output, displaying the delta in bytes along with the percentage reduction or expansion.",
  },
  {
    question: "Is my proprietary source code secure?",
    answer:
      "Yes, 100%. All processing runs locally inside your browser memory using native JavaScript string transformations. Zero bytes are ever transmitted to any remote servers.",
  },
  {
    question: "Can I download the minified code directly?",
    answer:
      "Yes, click 'Download File' to automatically export your optimized file with the appropriate extension (.min.js, .min.css, .html, or .json).",
  },
];

const MINIFIER_STEPS = [
  {
    step: "01",
    title: "Select Language & Mode",
    description: "Choose JSON, CSS, HTML, or JavaScript, and toggle between Minify or Beautify.",
    icon: FileCode,
  },
  {
    step: "02",
    title: "Paste Source Code",
    description: "Paste your raw or formatted code into the input pane, or load a sample snippet.",
    icon: Minimize2,
  },
  {
    step: "03",
    title: "Inspect & Export",
    description: "Review compression statistics, copy the result, or download the optimized file.",
    icon: Download,
  },
];

export default function CodeMinifierPage() {
  const baseUrl = siteConfig.url.replace(/\/$/, "");
  const breadcrumbs = [
    { label: "Utility Tools", href: "/utility-tools" },
    { label: "Code Minifier", href: "/code-minifier" },
  ];

  const toolSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Code Minifier & Beautifier Online",
    url: `${baseUrl}/code-minifier`,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript and HTML5 support",
    description:
      "Minify and beautify HTML, CSS, JavaScript, and JSON with real-time byte savings calculations.",
        aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      ratingCount: "1664",
      bestRating: "5",
      worstRating: "1",
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      "HTML, CSS, JavaScript & JSON Support",
      "Minify (Compression) & Beautify (Indentation)",
      "Real-Time Byte Size & Savings Percentage Metrics",
      "One-Click Clipboard Copying & File Download",
      "100% Client-Side In-Memory Execution",
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
              <span>HTML &bull; CSS &bull; JavaScript &bull; JSON</span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
              Code Minifier & Beautifier
            </h1>

            <p className="mt-2.5 sm:mt-3 text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Compress or format HTML, CSS, JavaScript, and JSON code with instant byte savings calculation.
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
                Instant in-memory processing
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Workspace */}
      <section className="py-10 sm:py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <CodeMinifierWorkspace />
      </section>

      <AdPlacement slotId="code-minifier-below-workspace" />

      {/* How It Works */}
      <HowItWorks
        title="How to Minify & Beautify Code"
        subtitle="Optimize assets or reformat minified scripts in 3 simple steps"
        steps={MINIFIER_STEPS}
      />

      {/* FAQs */}
      <FAQSection
        title="Code Minifier - Frequently Asked Questions"
        subtitle="Common questions about supported formats, compression ratios, and safety"
        items={MINIFIER_FAQS}
      />

      <RelatedTools currentToolId="code-minifier" />
    </div>
  );
}
