import React from "react";
import JpgToPdfWorkspace from "@/components/image/JpgToPdfWorkspace";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import HowItWorks from "@/components/common/HowItWorks";
import FAQSection from "@/components/common/FAQSection";
import AdPlacement from "@/components/common/AdPlacement";
import { siteConfig } from "@/config/site";
import { ShieldCheck, Zap, Lock, Sparkles, Image as ImageIcon } from "lucide-react";

export const metadata = {
  title: "JPG to PDF Converter Online Free | Toolora",
  description:
    "Convert JPG, JPEG, and PNG images into a single PDF document. Free, fast, private, and client-side with custom page sizes, orientations, and margins.",
  alternates: {
    canonical: "/jpg-to-pdf",
  },
  openGraph: {
    title: "JPG to PDF Converter Online Free | Toolora",
    description:
      "Convert JPG, JPEG, and PNG images into a single PDF document. Free, secure, client-side image converter.",
    url: `${siteConfig.url}/jpg-to-pdf`,
    type: "website",
  },
};

const JPG_TO_PDF_FAQS = [
  {
    question: "How do I convert JPG images to a PDF?",
    answer:
      "Drag and drop or select one or more JPG, JPEG, or PNG images into the upload area. Rearrange the image sequence if needed, customize your layout preferences (A4, Letter, or Fit to Image, Margins, and Orientation), and click 'Convert to PDF' to download your compiled document.",
  },
  {
    question: "Can I combine multiple pictures into one PDF?",
    answer:
      "Yes! You can upload up to 30 images at once. Toolora compiles each photo as a distinct page within a single unified PDF file following the exact order you specify.",
  },
  {
    question: "Are PNG graphics and photos supported?",
    answer:
      "Yes. In addition to standard JPG and JPEG files, Toolora supports PNG images with transparency and high-resolution color depth.",
  },
  {
    question: "Are my photos uploaded to a cloud server?",
    answer:
      "No. All image reading, decoding, and PDF embedding happens entirely inside your web browser on your computer, tablet, or phone. Your personal photographs and graphics are never sent over the internet or stored on our servers.",
  },
  {
    question: "What page sizes and layout options are available?",
    answer:
      "You can choose standard ISO A4, US Letter, or Fit to Image (which sizes each page to the exact dimensions of your graphic). You can also configure Portrait or Landscape orientation, Fit vs Fill placement, and Small, Medium, Large, or Zero margins.",
  },
];

const JPG_STEPS = [
  {
    step: "01",
    title: "Select Images",
    description: "Upload single or multiple JPG, JPEG, or PNG photos from your computer or phone.",
    icon: ImageIcon,
  },
  {
    step: "02",
    title: "Customize Layout",
    description: "Rearrange image order, choose page dimensions (A4, Letter, Fit), orientation, and margins.",
    icon: ImageIcon,
  },
  {
    step: "03",
    title: "Download PDF",
    description: "Click Convert to PDF. Your high-resolution compiled document is ready in seconds.",
    icon: ImageIcon,
  },
];

export default function JpgToPdfPage() {
  const breadcrumbs = [
    { label: "PDF Tools", href: "/pdf-tools" },
    { label: "JPG to PDF", href: "/jpg-to-pdf" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/30">
      {/* Hero Header */}
      <div className="border-b border-slate-200/60 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-10">
          <Breadcrumbs items={breadcrumbs} />

          <div className="text-center max-w-3xl mx-auto mt-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 border border-brand-200/60 text-brand-700 text-xs font-semibold mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Multi-Image Compilation &bull; Custom Page Sizing</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
              JPG to PDF Converter
            </h1>

            <p className="mt-3 sm:mt-4 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Convert JPG, JPEG, and PNG images into a single PDF document.
            </p>

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
                Fast in-browser conversion
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Workspace */}
      <section className="py-10 sm:py-14 px-4 sm:px-6 lg:px-8">
        <JpgToPdfWorkspace />
      </section>

      {/* Optional Ad placement */}
      <AdPlacement slotId="jpg-to-pdf-below-workspace" />

      {/* How It Works */}
      <HowItWorks
        title="How to Convert Images to PDF"
        subtitle="Turn pictures into documents in 3 simple steps"
        steps={JPG_STEPS}
      />

      {/* FAQ */}
      <FAQSection
        title="JPG to PDF - Frequently Asked Questions"
        subtitle="Answers regarding formats, page dimensions, and compression"
        items={JPG_TO_PDF_FAQS}
      />
    </div>
  );
}
