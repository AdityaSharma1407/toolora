"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function FAQSection({
  title = "Frequently Asked Questions",
  subtitle = "Everything you need to know about using this tool on Bits & Tools",
  items,
  faqs,
  includeSchema = true,
  className = "",
}) {
  const [openIndex, setOpenIndex] = useState(0);

  const faqList = Array.isArray(items) && items.length > 0 ? items : (Array.isArray(faqs) ? faqs : []);

  if (faqList.length === 0) return null;

  // JSON-LD structured data for Google FAQ Rich Snippets
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqList.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section className={`py-12 ${className}`}>
      {includeSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-2 text-sm md:text-base text-slate-600">
              {subtitle}
            </p>
          )}
        </div>

        <div className="space-y-3">
          {faqList.map((faq, index) => {
            const isOpen = openIndex === index;
            const faqId = `faq-content-${index}`;
            const headerId = `faq-header-${index}`;

            return (
              <div
                key={index}
                className="bg-white border border-black/[0.06] rounded-2xl overflow-hidden shadow-subtle transition-all"
              >
                <button
                  type="button"
                  id={headerId}
                  aria-expanded={isOpen}
                  aria-controls={faqId}
                  onClick={() => toggle(index)}
                  className="w-full min-h-[48px] flex items-center justify-between text-left p-4 sm:p-5 text-slate-900 font-semibold text-sm sm:text-base hover:text-brand-600 focus:outline-none focus-visible:bg-slate-50 transition-colors"
                >
                  <span className="pr-4">{faq.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 sm:w-5 sm:h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-brand-600" : ""
                    }`}
                    aria-hidden="true"
                  />
                </button>

                {isOpen && (
                  <div
                    id={faqId}
                    role="region"
                    aria-labelledby={headerId}
                    className="px-4 sm:px-5 pb-4 sm:pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100/80 pt-3"
                  >
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
