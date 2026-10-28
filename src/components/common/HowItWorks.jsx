import React from "react";
import { Upload, ArrowUpDown, Download } from "lucide-react";
import AnchorHeading from "./AnchorHeading";

const DEFAULT_STEPS = [
  {
    step: "01",
    title: "Upload Your PDF Files",
    description:
      "Select or drag and drop two or more PDF documents from your computer, phone, or tablet. No sign-up or installation required.",
    icon: Upload,
  },
  {
    step: "02",
    title: "Arrange Page Order",
    description:
      "Use the move up and down controls to arrange the documents in the exact sequence you want them to appear in the merged output.",
    icon: ArrowUpDown,
  },
  {
    step: "03",
    title: "Merge & Instant Download",
    description:
      "Click Merge PDF. Bits & Tools compiles your files right in your browser within seconds and delivers a clean, ready-to-use document.",
    icon: Download,
  },
];

export default function HowItWorks({
  title = "How It Works",
  subtitle = "Combine your PDF files in 3 quick and simple steps",
  steps = DEFAULT_STEPS,
  className = "",
}) {
  return (
    <section className={`py-12 bg-canvas border-y border-black/[0.06] ${className}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <AnchorHeading
            as="h2"
            className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight justify-center"
          >
            {title}
          </AnchorHeading>
          <p className="mt-2 text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
            {subtitle}
          </p>
        </div>

        <ol className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 list-none p-0">
          {steps.map((item, idx) => {
            const Icon = item.icon || Upload;
            return (
              <li
                key={idx}
                className="relative bg-white p-6 rounded-2xl border border-black/[0.06] shadow-subtle flex flex-col"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-11 h-11 rounded-xl bg-brand-50/80 text-brand-600 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-2xl font-bold text-slate-200 tracking-tight">
                    {item.step}
                  </span>
                </div>

                <AnchorHeading
                  as="h3"
                  className="text-lg font-semibold text-slate-900 tracking-tight mb-2"
                >
                  {item.title}
                </AnchorHeading>

                <p className="text-sm text-slate-700 leading-relaxed font-normal">
                  {item.description}
                </p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
