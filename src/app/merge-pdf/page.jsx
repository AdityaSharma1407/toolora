import React from "react";
import MergePdfWorkspace from "@/components/pdf/MergePdfWorkspace";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import HowItWorks from "@/components/common/HowItWorks";
import FAQSection from "@/components/common/FAQSection";
import AdPlacement from "@/components/common/AdPlacement";
import { siteConfig } from "@/config/site";
import { ShieldCheck, Zap, Lock, Sparkles } from "lucide-react";

export const metadata = {
  title: "Merge PDF Files Online Free",
  description:
    "Combine multiple PDF files into one document in seconds. 100% free, browser-based, secure, and private. No installation or registration required.",
  alternates: {
    canonical: "/merge-pdf",
  },
  openGraph: {
    title: "Merge PDF Files Online Free | Toolora",
    description:
      "Combine multiple PDF files into one document in seconds. Free, simple, and secure client-side PDF merger.",
    url: `${siteConfig.url}/merge-pdf`,
    type: "website",
  },
};

const MERGE_PDF_FAQS = [
  {
    question: "How do I merge multiple PDF files?",
    answer:
      "Click 'Select PDF Files' or drag and drop two or more PDF files into the upload box. Use the up and down arrow buttons to arrange your documents in the exact sequence you want them combined. Then click 'Merge PDF Files' to combine them and download your new PDF.",
  },
  {
    question: "Is the PDF merger free to use?",
    answer:
      "Yes, Toolora's PDF Merger is completely free with no hidden charges, trial periods, or mandatory account registration. You can merge documents as often as you need.",
  },
  {
    question: "Can I change the order of PDF files before merging?",
    answer:
      "Yes! Once you upload your files, you will see a list with index numbers (#1, #2, etc.). Simply click the Up or Down arrow icons next to any file to rearrange them. The final document will follow that exact order.",
  },
  {
    question: "Are my PDF files uploaded to a server?",
    answer:
      "No. Unlike conventional online tools, Toolora processes your files entirely inside your web browser using client-side JavaScript. Your documents never leave your computer, phone, or local network, ensuring absolute privacy for sensitive documents.",
  },
  {
    question: "Why might a PDF fail to merge?",
    answer:
      "A merge can fail if a PDF is password-protected or encrypted, corrupted/malformed, has 0 pages, or exceeds your browser's memory limitations. If a document fails, Toolora will highlight the specific file so you can remove or unlock it.",
  },
  {
    question: "What are the file size and file count limits?",
    answer:
      `You can combine up to ${siteConfig.limits.mergePdf.maxFiles} PDF files at once, with a maximum file size of ${siteConfig.limits.mergePdf.maxFileSizeFormatted} per document and an overall total of ${siteConfig.limits.mergePdf.maxTotalSizeFormatted}. These limits ensure smooth performance in standard web browsers.`,
  },
];

export default function MergePdfPage() {
  const breadcrumbs = [
    { label: "PDF Tools", href: "/pdf-tools" },
    { label: "Merge PDF", href: "/merge-pdf" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/30">
      {/* Top Breadcrumbs & Hero Header */}
      <div className="border-b border-slate-200/60 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-10">
          <Breadcrumbs items={breadcrumbs} />

          <div className="text-center max-w-3xl mx-auto mt-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 border border-brand-200/60 text-brand-700 text-xs font-semibold mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Fast &bull; Private &bull; Client-Side</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
              Merge PDF Files Online
            </h1>

            <p className="mt-3 sm:mt-4 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Combine multiple PDF files into one document in seconds. Free, simple, and secure.
            </p>

            {/* Quick Guarantees */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-5 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                No file upload to servers
              </span>
              <span className="flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-emerald-600" />
                100% Client-side privacy
              </span>
              <span className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-emerald-600" />
                Instant processing
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Interactive Tool Workspace */}
      <section className="py-10 sm:py-14 px-4 sm:px-6 lg:px-8">
        <MergePdfWorkspace />
      </section>

      {/* Ad Placement Below Workspace (Disabled by Default) */}
      <AdPlacement slotId="merge-pdf-below-workspace" />

      {/* How It Works Section */}
      <HowItWorks
        title="How to Merge PDF Files"
        subtitle="Follow these 3 simple steps to join your documents together"
      />

      {/* Comprehensive FAQ Section */}
      <FAQSection
        title="Merge PDF - Frequently Asked Questions"
        subtitle="Clear answers about privacy, compatibility, and file limits"
        items={MERGE_PDF_FAQS}
      />
    </div>
  );
}
