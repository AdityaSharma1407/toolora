import React from "react";
import RegexTesterWorkspace from "@/components/utility/RegexTesterWorkspace";
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
  Search,
  CheckCircle2,
  ListFilter,
} from "lucide-react";

export const metadata = {
  title: "Regular Expression Tester & Debugger — Real-Time Regex Online",
  description:
    "Test, debug, and inspect JavaScript regular expressions in real-time. Full support for capture groups, match indices, flags, and common presets. 100% private.",
  keywords: [
    "regex tester",
    "regular expression tester",
    "regex debugger",
    "regex capture groups",
    "javascript regex tester",
    "online regex tool",
    "regex match highlighter",
  ],
  alternates: {
    canonical: "/regex-tester",
  },
  openGraph: {
    title: "Regular Expression Tester & Debugger | Bits & Tools",
    description:
      "Test, debug, and inspect JavaScript regular expressions with real-time match highlighting and capture group inspection.",
    url: "/regex-tester",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Regular Expression Tester & Debugger | Bits & Tools",
    description:
      "Real-time regex tester with instant match highlighting, flags, and capture group inspection.",
  },
};

const REGEX_FAQS = [
  {
    question: "Which regex flags are supported?",
    answer:
      "The tester supports standard JavaScript flags: 'g' (global match), 'i' (case-insensitive), 'm' (multiline), 's' (dotAll / dot matches newline), and 'u' (unicode support).",
  },
  {
    question: "How does capture group inspection work?",
    answer:
      "When your pattern contains parentheses like (abc), each matching group ($1, $2, etc.) is individually extracted and shown in the match breakdown list with exact character offsets.",
  },
  {
    question: "Is there a limit to how many matches are processed?",
    answer:
      "To prevent browser locks on catastrophic backtracking or unbounded empty matches, the tester safely caps evaluation at 500 matches per pass.",
  },
  {
    question: "Are my test strings sent to any server?",
    answer:
      "Never. All regular expression tests run directly within your browser's V8 / JavaScript engine. Your strings, emails, and sensitive patterns never leave your machine.",
  },
];

const REGEX_STEPS = [
  {
    step: "01",
    title: "Enter Pattern & Flags",
    description: "Type your regular expression or pick from pre-built presets like Email, URL, or UUID.",
    icon: Search,
  },
  {
    step: "02",
    title: "Supply Test String",
    description: "Paste sample text into the input field to test matching behavior in real-time.",
    icon: ListFilter,
  },
  {
    step: "03",
    title: "Inspect Matches",
    description: "Examine highlighted matches, indices, and capture group breakdowns instantly.",
    icon: CheckCircle2,
  },
];

export default function RegexTesterPage() {
  const baseUrl = siteConfig.url.replace(/\/$/, "");
  const breadcrumbs = [
    { label: "Utility Tools", href: "/utility-tools" },
    { label: "Regex Tester", href: "/regex-tester" },
  ];

  const toolSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Regular Expression Tester & Debugger Online",
    url: `${baseUrl}/regex-tester`,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript and HTML5 support",
    description:
      "Test, debug, and inspect regular expressions with real-time match highlighting and capture group inspection.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      "Real-Time Regular Expression Matching",
      "Dynamic Syntax Error Validation",
      "Capture Group & Match Offsets Breakdown",
      "Common Regex Presets (Email, URL, IP, UUID)",
      "Flag Toggles (g, i, m, s, u)",
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
              <span>Real-Time Matching &bull; Capture Groups &bull; Syntax Validation</span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
              Regular Expression Tester & Debugger
            </h1>

            <p className="mt-2.5 sm:mt-3 text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Test and analyze JavaScript regular expressions with instant match highlighting and capture group inspection.
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
                Instant in-browser evaluation
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Workspace */}
      <section className="py-10 sm:py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <RegexTesterWorkspace />
      </section>

      <AdPlacement slotId="regex-tester-below-workspace" />

      {/* How It Works */}
      <HowItWorks
        title="How to Test & Debug Regular Expressions"
        subtitle="Validate pattern logic and verify capture groups in 3 simple steps"
        steps={REGEX_STEPS}
      />

      {/* FAQs */}
      <FAQSection
        title="Regex Tester - Frequently Asked Questions"
        subtitle="Common questions about syntax support, flags, and match performance"
        items={REGEX_FAQS}
      />

      <RelatedTools currentToolId="regex-tester" />
    </div>
  );
}
