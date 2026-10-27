import React from "react";
import HashGeneratorWorkspace from "@/components/utility/HashGeneratorWorkspace";
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
  Hash,
  FileCheck,
  Copy,
} from "lucide-react";

export const metadata = {
  title: "Hash Generator — MD5, SHA-1, SHA-256, SHA-384, SHA-512 Online",
  description:
    "Generate MD5, SHA-1, SHA-256, SHA-384, and SHA-512 cryptographic checksums for text or uploaded files. 100% free, fast, private, and client-side.",
  keywords: [
    "hash generator",
    "sha256 generator",
    "md5 hash generator",
    "sha1 generator",
    "sha512 online",
    "file checksum calculator",
    "text hasher",
    "cryptographic hash",
  ],
  alternates: {
    canonical: "/hash-generator",
  },
  openGraph: {
    title: "Hash Generator Online (MD5, SHA-256, SHA-512) | Bits & Tools",
    description:
      "Generate MD5, SHA-1, SHA-256, SHA-384, and SHA-512 cryptographic digests for text or files locally in browser.",
    url: "/hash-generator",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hash Generator Online | Bits & Tools",
    description:
      "Generate MD5, SHA-256, SHA-512 cryptographic digests for text or files locally.",
  },
};

const HASH_FAQS = [
  {
    question: "What is the difference between SHA-256 and MD5?",
    answer:
      "MD5 is a 128-bit hash algorithm mainly used for non-cryptographic checksum verification due to known collision vulnerabilities. SHA-256 (part of the SHA-2 family) produces a 256-bit digest and is the global cryptographic standard used in SSL certificates, Bitcoin, and secure data verification.",
  },
  {
    question: "Can I verify the checksum of a downloaded file?",
    answer:
      "Yes! Click 'Hash File' and select your downloaded software installer or archive. The tool computes all hashes directly from the file bytes in your browser memory without uploading any bytes to a server.",
  },
  {
    question: "How fast is in-browser hashing?",
    answer:
      "Modern browsers execute SHA algorithms via the native Web Crypto API (crypto.subtle), utilizing hardware-accelerated CPU instructions for near-instant hashing.",
  },
];

const HASH_STEPS = [
  {
    step: "01",
    title: "Enter Text or Upload File",
    description: "Type, paste text, or select a file to compute its integrity checksum.",
    icon: Hash,
  },
  {
    step: "02",
    title: "Compute Digests",
    description: "All algorithms (MD5, SHA-1, SHA-256, SHA-384, SHA-512) calculate in parallel.",
    icon: FileCheck,
  },
  {
    step: "03",
    title: "Copy Checksum",
    description: "Click Copy on any hash to copy the hexadecimal digest to your clipboard.",
    icon: Sparkles,
  },
];

export default function HashPage() {
  const baseUrl = siteConfig.url.replace(/\/$/, "");
  const breadcrumbs = [
    { label: "Utility Tools", href: "/utility-tools" },
    { label: "Hash Generator", href: "/hash-generator" },
  ];

  const toolSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Cryptographic Hash Generator Online",
    url: `${baseUrl}/hash-generator`,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript and HTML5 Web Crypto support",
    description:
      "Generate MD5, SHA-1, SHA-256, SHA-384, and SHA-512 cryptographic checksums for text or uploaded files.",
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
              <span>Hardware-Accelerated Web Crypto &bull; Zero Server Uploads</span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
              Cryptographic Hash Generator
            </h1>

            <p className="mt-2.5 sm:mt-3 text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Compute MD5, SHA-1, SHA-256, SHA-384, and SHA-512 cryptographic digests for text or files locally.
            </p>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-slate-600">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Zero file uploads
              </span>
              <span className="flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-emerald-600" />
                100% Client-side privacy
              </span>
              <span className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-emerald-600" />
                Hardware-accelerated crypto
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Workspace */}
      <section className="py-10 sm:py-14 px-4 sm:px-6 lg:px-8">
        <HashGeneratorWorkspace />
      </section>

      <AdPlacement slotId="hash-generator-below-workspace" />

      {/* How It Works */}
      <HowItWorks
        title="How to Generate Cryptographic Hashes"
        subtitle="Hash text or verify files in 3 simple steps"
        steps={HASH_STEPS}
      />

      {/* FAQs */}
      <FAQSection
        title="Hash Generator - Frequently Asked Questions"
        subtitle="Common questions about MD5, SHA-256, checksums, and cryptography"
        items={HASH_FAQS}
      />

      <RelatedTools currentToolId="hash-generator" />
    </div>
  );
}
