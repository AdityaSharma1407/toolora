import React from "react";
import PasswordGeneratorWorkspace from "@/components/utility/PasswordGeneratorWorkspace";
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
  Sliders,
  CheckCircle2,
} from "lucide-react";

export const metadata = {
  title: "Password Generator — Create Strong Cryptographic Passwords Online",
  description:
    "Generate cryptographically secure random passwords and memorable passphrases with NIST entropy scoring, offline brute-force crack time estimates, and custom length options.",
  keywords: [
    "password generator",
    "strong password generator",
    "random password generator",
    "passphrase generator",
    "cryptographic password",
    "password entropy calculator",
    "diceware passphrase",
  ],
  alternates: {
    canonical: "/password-generator",
  },
  openGraph: {
    title: "Password & Passphrase Generator | Bits & Tools",
    description:
      "Generate strong random passwords and passphrases with NIST entropy scoring and zero network transmission.",
    url: "/password-generator",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Password & Passphrase Generator | Bits & Tools",
    description:
      "Generate strong random passwords and passphrases with NIST entropy scoring and zero network transmission.",
  },
};

const PASSWORD_FAQS = [
  {
    question: "How are the passwords generated?",
    answer:
      "Passwords are created using the browser's native Web Cryptography API (`crypto.getRandomValues`), which taps into your device operating system's cryptographic entropy source. This provides high-quality cryptographic randomness suitable for sensitive credentials.",
  },
  {
    question: "What is NIST password entropy?",
    answer:
      "Entropy measures the unpredictability of a password in bits. A password with 60+ bits is considered Strong, while 128+ bits provides cryptographic security resistant to state-level supercomputing brute-force attacks.",
  },
  {
    question: "What is a memorable passphrase?",
    answer:
      "Inspired by Diceware, a passphrase joins random dictionary words (e.g. 'crystal-orbit-summit-matrix'). Passphrases are easy for humans to remember while having massive search spaces that make automated brute-force attacks impractical.",
  },
  {
    question: "Does Bits & Tools store or log my generated passwords?",
    answer:
      "Never. All password generation runs entirely in your local browser tab's RAM. No network requests are made, no cookies are written, and passwords disappear the moment you close the tab.",
  },
];

const PASSWORD_STEPS = [
  {
    step: "01",
    title: "Choose Mode & Length",
    description: "Select character-based password or memorable passphrase and adjust length.",
    icon: Sliders,
  },
  {
    step: "02",
    title: "Configure Character Sets",
    description: "Toggle uppercase, lowercase, numbers, symbols, and avoid ambiguous characters.",
    icon: Key,
  },
  {
    step: "03",
    title: "Copy Secure Password",
    description: "Check NIST entropy score and copy your strong credential to your clipboard.",
    icon: CheckCircle2,
  },
];

export default function PasswordGeneratorPage() {
  const baseUrl = siteConfig.url.replace(/\/$/, "");
  const breadcrumbs = [
    { label: "Utility Tools", href: "/utility-tools" },
    { label: "Password Generator", href: "/password-generator" },
  ];

  const toolSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Password & Passphrase Generator",
    url: `${baseUrl}/password-generator`,
    applicationCategory: "SecurityApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript and HTML5 support",
    description:
      "Generate cryptographically secure random passwords and memorable passphrases with NIST entropy scoring and crack time estimates.",
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
              <span>Web Crypto CSPRNG &bull; NIST Entropy Scoring &bull; 100% Private</span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
              Password & Passphrase Generator
            </h1>

            <p className="mt-2.5 sm:mt-3 text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Create strong, uncrackable passwords and memorable passphrases with real-time entropy calculation.
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
                CSPRNG hardware entropy
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Workspace */}
      <section className="py-10 sm:py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <PasswordGeneratorWorkspace />
      </section>

      <AdPlacement slotId="password-generator-below-workspace" />

      {/* How It Works */}
      <HowItWorks
        title="How to Generate Strong Passwords"
        subtitle="Produce high-entropy credentials in 3 easy steps"
        steps={PASSWORD_STEPS}
      />

      {/* FAQs */}
      <FAQSection
        title="Password Generator - Frequently Asked Questions"
        subtitle="Common questions about cryptographic entropy, passphrases, and security"
        items={PASSWORD_FAQS}
      />

      <RelatedTools currentToolId="password-generator" />
    </div>
  );
}
