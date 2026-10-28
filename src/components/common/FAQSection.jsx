"use client";

import React from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import AnchorHeading from "./AnchorHeading";
import { slugifyHeading } from "@/lib/seo/anchors";

export default function FAQSection({
  title = "Frequently Asked Questions",
  subtitle = "Everything you need to know about using this tool on Bits & Tools",
  items,
  faqs,
  includeSchema = true,
  className = "",
}) {
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
          <AnchorHeading
            as="h2"
            className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight justify-center"
          >
            {title}
          </AnchorHeading>
          {subtitle && (
            <p className="mt-2 text-sm md:text-base text-slate-700 font-normal">
              {subtitle}
            </p>
          )}
        </div>

        {/* Semantic Definition List & Accessible Details Elements */}
        <div className="space-y-3.5">
          {faqList.map((faq, index) => {
            const questionSlug = slugifyHeading(faq.question);
            const isInitialOpen = index === 0;

            return (
              <details
                key={index}
                id={questionSlug}
                open={isInitialOpen}
                className="group bg-white border border-black/[0.06] rounded-2xl overflow-hidden shadow-subtle transition-all duration-200 scroll-mt-24"
              >
                <summary className="w-full min-h-[48px] flex items-center justify-between text-left p-4 sm:p-5 text-slate-900 font-semibold text-sm sm:text-base hover:text-brand-600 focus:outline-none focus-visible:bg-slate-50 transition-colors cursor-pointer select-none list-none [&::-webkit-details-marker]:hidden">
                  <span className="flex items-center gap-2.5 pr-4">
                    <HelpCircle className="w-4 h-4 text-brand-600 shrink-0" />
                    <span>{faq.question}</span>
                  </span>
                  <ChevronDown
                    className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 shrink-0 transition-transform duration-200 group-open:rotate-180 group-open:text-brand-600"
                    aria-hidden="true"
                  />
                </summary>

                {/* Answer content is strictly preserved in the DOM without hidden CSS for immediate crawler extraction */}
                <div className="px-4 sm:px-5 pb-4 sm:pb-5 text-sm text-slate-800 leading-relaxed border-t border-slate-100/90 pt-3.5 font-normal">
                  <p>{faq.answer}</p>
                </div>
              </details>
            );
          })}
        </div>
      </div>
    </section>
  );
}
