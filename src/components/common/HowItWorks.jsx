import React from "react";
import { Upload, ArrowUpDown, Download } from "lucide-react";

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
      "Click Merge PDF. Toolora compiles your files right in your browser within seconds and delivers a clean, ready-to-use document.",
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
    <section className={`py-12 bg-slate-50/70 border-y border-slate-200/60 ${className}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
            {title}
          </h2>
          <p className="mt-2 text-sm md:text-base text-slate-600">
            {subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {steps.map((item, idx) => {
            const Icon = item.icon || Upload;
            return (
              <div
                key={idx}
                className="relative bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-brand-50 text-brand-600">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-2xl font-black text-slate-200 tracking-wider">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed flex-1">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
