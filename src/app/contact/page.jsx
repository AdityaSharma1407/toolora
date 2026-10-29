import React from "react";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import { siteConfig } from "@/config/site";
import ContactClient from "./ContactClient";
import { Sparkles } from "lucide-react";

export const metadata = {
  title: "Contact Us",
  description:
    "Contact Bits & Tools support for help with online PDF, image, and file tools, technical issues, feedback, and feature requests.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact Us — Bits & Tools Online Support",
    description:
      "Contact Bits & Tools support for help with online PDF, image, and file tools, technical issues, feedback, and feature requests.",
    url: "/contact",
    type: "website",
    images: [
      {
        url: "/images/og-bitsandtools.png",
        width: 1200,
        height: 630,
        alt: "Bits & Tools — Free Online In-Browser Tools",
      },
    ],
  },
  twitter: {
    site: "@bitsandtools",
    creator: "@bitsandtools",
    card: "summary_large_image",
    title: "Contact Us — Bits & Tools Online Support",
    description:
      "Contact Bits & Tools support for help with online PDF, image, and file tools, technical issues, feedback, and feature requests.",
    images: ["/images/og-bitsandtools.png"],
  },
};

export default function ContactPage() {
  const breadcrumbs = [{ label: "Contact Us", href: "/contact" }];
  const supportEmail = siteConfig.contactEmail || "bitsandtools2026@gmail.com";
  const baseUrl = siteConfig.url || "https://www.bitsandtools.com";

  const contactSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact Us | Bits & Tools",
    description:
      "Contact Bits & Tools support for help with online PDF, image, and file tools, technical issues, feedback, and feature requests.",
    url: `${baseUrl}/contact`,
    mainEntity: {
      "@type": "Organization",
      name: siteConfig.displayName || siteConfig.name,
      url: baseUrl,
      contactPoint: {
        "@type": "ContactPoint",
        email: supportEmail,
        contactType: "Customer Support",
        availableLanguage: ["English", "Hindi"],
      },
    },
  };

  return (
    <div className="flex flex-col min-h-screen bg-canvas">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
      />

      {/* Header Banner */}
      <div className="bg-white border-b border-black/[0.06] py-8 sm:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <Breadcrumbs items={breadcrumbs} />

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold mb-3 mt-3 border border-black/[0.04]">
            <Sparkles className="w-3.5 h-3.5 text-brand-600" />
            <span>Support &amp; Community</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
            Contact Us
          </h1>

          <p className="mt-2.5 sm:mt-4 text-sm sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
            Have a question, found an issue, or need help using Bits &amp; Tools? We&apos;re here to help. Contact our support team and we&apos;ll do our best to assist you.
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 w-full">
        <ContactClient supportEmail={supportEmail} />
      </main>
    </div>
  );
}
