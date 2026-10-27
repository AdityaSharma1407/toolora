import React from "react";
import ProtectPdfWorkspace from "@/components/pdf/ProtectPdfWorkspace";
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
  FileText,
  Download,
} from "lucide-react";

export const metadata = {
  title: "Password Protect PDF Online — Encrypt PDF Documents Free & Private",
  description:
    "Secure and encrypt your PDF files with standard AES-256 password protection directly in your web browser. Zero server uploads, maximum client-side privacy.",
  keywords: [
    "protect pdf",
    "password protect pdf",
    "encrypt pdf online",
    "secure pdf free",
    "lock pdf document",
    "aes 256 pdf encryption",
    "set password on pdf",
  ],
  alternates: {
    canonical: "/protect-pdf",
  },
  openGraph: {
    title: "Password Protect PDF Online | Bits & Tools",
    description:
      "Secure and encrypt your PDF files with standard AES-256 password protection in your browser.",
    url: "/protect-pdf",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Password Protect PDF Online | Bits & Tools",
    description:
      "Secure and encrypt your PDF files with standard AES-256 password protection in your browser.",
  },
};

const PROTECT_FAQS = [
  {
    question: "What encryption standard is used?",
    answer:
      "Bits & Tools employs standard AES-256 bit encryption (ISO 32000-1 / V5 R6) supported by Adobe Acrobat Reader, Google Chrome, Apple Preview, and all standard PDF readers.",
  },
  {
    question: "Can Bits & Tools recover my forgotten password?",
    answer:
      "No. Because encryption runs 100% locally on your machine without storing keys or uploading documents to servers, it is mathematically impossible for anyone to recover your document if you forget your password.",
  },
  {
    question: "Will the recipient need special software to open the PDF?",
    answer:
      "No. Standard PDF readers (including Preview on Mac, Acrobat on Windows, and mobile viewers on iOS and Android) will prompt the user to enter the password upon opening the document.",
  },
  {
    question: "Is my password or document transmitted to any server?",
    answer:
      "Never. Encryption takes place purely in your browser's RAM via native Web Cryptography APIs. Your sensitive documents and passwords never leave your computer.",
  },
];

const PROTECT_STEPS = [
  {
    step: "01",
    title: "Upload PDF",
    description: "Choose or drag and drop your PDF document into the encryption workspace.",
    icon: FileText,
  },
  {
    step: "02",
    title: "Set Secure Password",
    description: "Enter and confirm your desired password, checking the strength indicator.",
    icon: Key,
  },
  {
    step: "03",
    title: "Download Protected PDF",
    description: "Save your encrypted PDF document with instant local client-side processing.",
    icon: Download,
  },
];

export default function ProtectPdfPage() {
  const baseUrl = siteConfig.url.replace(/\/$/, "");
  const breadcrumbs = [
    { label: "PDF Tools", href: "/pdf-tools" },
    { label: "Protect PDF", href: "/protect-pdf" },
  ];

  const toolSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Password Protect PDF Online",
    url: `${baseUrl}/protect-pdf`,
    applicationCategory: "SecurityApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript and HTML5 support",
    description:
      "Encrypt and password protect PDF documents with AES-256 bit security directly in the browser.",
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
              <span>Standard AES-256 &bull; Zero Server Uploads &bull; Universal Compatibility</span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
              Password Protect PDF
            </h1>

            <p className="mt-2.5 sm:mt-3 text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Secure your PDF documents with industry-standard AES-256 password protection in seconds.
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
                Hardware-accelerated AES
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Workspace */}
      <section className="py-10 sm:py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <ProtectPdfWorkspace />
      </section>

      <AdPlacement slotId="protect-pdf-below-workspace" />

      {/* How It Works */}
      <HowItWorks
        title="How to Password Protect a PDF"
        subtitle="Encrypt sensitive files with AES-256 in 3 simple steps"
        steps={PROTECT_STEPS}
      />

      {/* FAQs */}
      <FAQSection
        title="Password Protect PDF - Frequently Asked Questions"
        subtitle="Common questions about document encryption, password strength, and recovery"
        items={PROTECT_FAQS}
      />

      <RelatedTools currentToolId="protect-pdf" />
    </div>
  );
}
