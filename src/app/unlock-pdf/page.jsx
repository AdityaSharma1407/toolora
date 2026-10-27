import React from "react";
import UnlockPdfWorkspace from "@/components/pdf/UnlockPdfWorkspace";
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
  Unlock,
  FileText,
  Download,
} from "lucide-react";

export const metadata = {
  title: "Unlock PDF Online — Remove PDF Password & Restrictions Free",
  description:
    "Unlock password-protected PDF files and remove security restrictions directly in your web browser. Permanently decrypt PDF documents without uploading files to servers.",
  keywords: [
    "unlock pdf",
    "remove pdf password",
    "decrypt pdf online",
    "pdf password remover",
    "remove pdf restrictions",
    "unlock secured pdf",
    "unprotect pdf",
  ],
  alternates: {
    canonical: "/unlock-pdf",
  },
  openGraph: {
    title: "Unlock PDF Online | Bits & Tools",
    description:
      "Unlock password-protected PDF files and remove security restrictions directly in your web browser.",
    url: "/unlock-pdf",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Unlock PDF Online | Bits & Tools",
    description:
      "Unlock password-protected PDF files and remove security restrictions directly in your web browser.",
  },
};

const UNLOCK_FAQS = [
  {
    question: "Do I need the document password to unlock a PDF?",
    answer:
      "Yes, if the document has an open/user password. Modern AES-256 PDF encryption cannot be brute-forced without the key. Once you enter the password, Bits & Tools decrypts the document and permanently removes the password so you never need to type it again.",
  },
  {
    question: "Can I remove owner/permission restrictions without a password?",
    answer:
      "Yes. If the PDF opens normally but prevents you from printing, copying, or editing (owner/permissions restriction), our tool automatically strips those permissions flags without prompting for a password.",
  },
  {
    question: "Is my password or decrypted document sent to your servers?",
    answer:
      "Never. All decryption runs locally in your web browser's memory using client-side Web Crypto and JavaScript. Your passwords, private documents, and decrypted files never leave your device.",
  },
  {
    question: "What happens to the unlocked PDF file?",
    answer:
      "A clean, fully decrypted PDF document without password requirements is generated for you to download. You can then open, print, and edit it on any device without entering a password.",
  },
];

const UNLOCK_STEPS = [
  {
    step: "01",
    title: "Upload Protected PDF",
    description: "Choose or drag and drop your password-protected PDF into the workspace.",
    icon: FileText,
  },
  {
    step: "02",
    title: "Enter Password",
    description: "Type the password to authenticate and decrypt the internal document streams.",
    icon: Unlock,
  },
  {
    step: "03",
    title: "Download Unlocked PDF",
    description: "Save a permanent, unrestricted PDF copy that opens instantly on any device.",
    icon: Download,
  },
];

export default function UnlockPdfPage() {
  const baseUrl = siteConfig.url.replace(/\/$/, "");
  const breadcrumbs = [
    { label: "PDF Tools", href: "/pdf-tools" },
    { label: "Unlock PDF", href: "/unlock-pdf" },
  ];

  const toolSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Unlock PDF Online",
    url: `${baseUrl}/unlock-pdf`,
    applicationCategory: "SecurityApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript and HTML5 support",
    description:
      "Remove passwords and security restrictions from PDF files directly in your web browser.",
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
              <span>Permanent Decryption &bull; Strip Restrictions &bull; 100% Private</span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
              Unlock PDF
            </h1>

            <p className="mt-2.5 sm:mt-3 text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Remove passwords and permissions restrictions from protected PDF files safely in your browser.
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
                Instant stream decryption
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Workspace */}
      <section className="py-10 sm:py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <UnlockPdfWorkspace />
      </section>

      <AdPlacement slotId="unlock-pdf-below-workspace" />

      {/* How It Works */}
      <HowItWorks
        title="How to Unlock a PDF"
        subtitle="Remove password protection and restrictions in 3 easy steps"
        steps={UNLOCK_STEPS}
      />

      {/* FAQs */}
      <FAQSection
        title="Unlock PDF - Frequently Asked Questions"
        subtitle="Common questions about document unlocking, AES decryption, and password removal"
        items={UNLOCK_FAQS}
      />

      <RelatedTools currentToolId="unlock-pdf" />
    </div>
  );
}
