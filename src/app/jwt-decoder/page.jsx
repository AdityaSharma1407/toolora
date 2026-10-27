import React from "react";
import JwtDecoderWorkspace from "@/components/utility/JwtDecoderWorkspace";
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
  Key,
  Clock,
  Shield,
} from "lucide-react";

export const metadata = {
  title: "JWT Decoder & Token Inspector — Decode JSON Web Tokens Online",
  description:
    "Free online JWT decoder and debugger. Inspect Header, Payload, and Signature segments, check token expiration timestamps, and view standard claims safely in your browser.",
  keywords: [
    "jwt decoder",
    "decode jwt online",
    "json web token inspector",
    "jwt debugger",
    "jwt expiration checker",
    "jwt payload viewer",
    "decode bearer token",
  ],
  alternates: {
    canonical: "/jwt-decoder",
  },
  openGraph: {
    title: "JWT Decoder & Token Inspector | Bits & Tools",
    description:
      "Inspect Header, Payload, and Signature with live expiration status and claims decoding. 100% private.",
    url: "/jwt-decoder",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "JWT Decoder & Token Inspector | Bits & Tools",
    description:
      "Inspect Header, Payload, and Signature with live expiration status and claims decoding. 100% private.",
  },
};

const JWT_FAQS = [
  {
    question: "Is it safe to paste sensitive JWT bearer tokens here?",
    answer:
      "Yes. All decoding occurs 100% client-side in your browser using pure JavaScript Base64URL and JSON parsing. No tokens or payload data are transmitted to any backend server.",
  },
  {
    question: "How does the expiration check work?",
    answer:
      "The tool extracts the standard 'exp' (expiration time) numeric claim from the token's payload, converts the UNIX timestamp to a localized date, and compares it to your current local system clock to determine if the token is active or expired.",
  },
  {
    question: "What are the three parts of a JWT?",
    answer:
      "A JSON Web Token consists of three base64url-encoded parts separated by dots: 1) Header (specifies the signing algorithm such as HS256 or RS256), 2) Payload (contains statements/claims about an entity such as user ID, role, and expiration), and 3) Signature (cryptographic hash ensuring integrity).",
  },
  {
    question: "Can this tool verify digital signatures?",
    answer:
      "This tool decodes and displays the signature segment for inspection. Signature cryptographic verification requires supplying a private or public key or HMAC secret, which is deliberately avoided in client tools to prevent accidental secret leakage.",
  },
];

const JWT_STEPS = [
  {
    step: "01",
    title: "Paste JWT Token",
    description: "Paste your base64url-encoded JWT string into the input field.",
    icon: Key,
  },
  {
    step: "02",
    title: "Inspect Header & Payload",
    description: "Instantly view parsed JSON headers, claims, user IDs, and permissions.",
    icon: Shield,
  },
  {
    step: "03",
    title: "Check Expiration",
    description: "Review active vs expired status, relative countdown, and UTC timestamps.",
    icon: Clock,
  },
];

export default function JwtDecoderPage() {
  const baseUrl = siteConfig.url.replace(/\/$/, "");
  const breadcrumbs = [
    { label: "Utility Tools", href: "/utility-tools" },
    { label: "JWT Decoder", href: "/jwt-decoder" },
  ];

  const toolSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "JWT Decoder & Inspector",
    url: `${baseUrl}/jwt-decoder`,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript and HTML5 support",
    description:
      "Online JSON Web Token decoder and inspector. Inspect headers, payload claims, and expiration timestamps safely in your browser.",
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
              <span>Base64URL Decoder &bull; Expiration Inspector &bull; Private</span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
              JWT Decoder & Inspector
            </h1>

            <p className="mt-2.5 sm:mt-3 text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Decode JSON Web Tokens, inspect header algorithms, view payload claims, and verify token expiration in seconds.
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
                Real-time expiration status
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Workspace */}
      <section className="py-10 sm:py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <JwtDecoderWorkspace />
      </section>

      <AdPlacement slotId="jwt-decoder-below-workspace" />

      {/* How It Works */}
      <HowItWorks
        title="How to Decode and Inspect a JWT"
        subtitle="Analyze tokens and inspect claims securely in 3 steps"
        steps={JWT_STEPS}
      />

      {/* FAQs */}
      <FAQSection
        title="JWT Decoder - Frequently Asked Questions"
        subtitle="Common questions about JSON Web Tokens, base64url decoding, and security"
        items={JWT_FAQS}
      />

      <RelatedTools currentToolId="jwt-decoder" />
    </div>
  );
}
