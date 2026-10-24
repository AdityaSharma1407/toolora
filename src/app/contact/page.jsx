import React from "react";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import ContactForm from "@/components/contact/ContactForm";
import { siteConfig } from "@/config/site";
import { Mail, Building, Sparkles } from "lucide-react";

export const metadata = {
  title: "Contact Us — Bits & Tools Support & Inquiries",
  description:
    "Get in touch with the Bits & Tools team for feedback, feature requests, bug reports, and advertising partnership inquiries.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact Us — Bits & Tools Support & Inquiries",
    description:
      "Get in touch with the Bits & Tools team for feedback, feature requests, bug reports, and advertising partnership inquiries.",
    url: "/contact",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Us — Bits & Tools Support & Inquiries",
    description:
      "Get in touch with the Bits & Tools team for feedback, feature requests, bug reports, and advertising partnership inquiries.",
  },
};

export default function ContactPage() {
  const breadcrumbs = [{ label: "Contact", href: "/contact" }];

  return (
    <div className="flex flex-col min-h-screen bg-canvas">
      {/* Header */}
      <div className="bg-white border-b border-black/[0.06] py-8 sm:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <Breadcrumbs items={breadcrumbs} />
          <h1 className="text-2xl sm:text-4xl font-bold text-slate-900 tracking-tight mt-3">
            Contact Us
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-2 leading-relaxed">
            Have questions, feedback, feature requests, or partnership inquiries? Get in touch with our team.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column: Direct Info */}
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-2">
                Get in Touch
              </h2>
              <p className="text-xs text-slate-500 leading-relaxed">
                We read every message and respond as quickly as possible. For technical bug reports, please describe your browser and device.
              </p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl space-y-3">
              <div className="flex items-center gap-2.5 text-xs text-slate-700">
                <Mail className="w-4 h-4 text-brand-600 shrink-0" />
                <span>
                  <strong>Email:</strong>{" "}
                  <a href={`mailto:${siteConfig.contactEmail}`} className="text-brand-600 underline">
                    {siteConfig.contactEmail}
                  </a>
                </span>
              </div>

              <div className="flex items-center gap-2.5 text-xs text-slate-700">
                <Building className="w-4 h-4 text-brand-600 shrink-0" />
                <span>
                  <strong>Platform:</strong> {siteConfig.displayName || siteConfig.name} Online Tools
                </span>
              </div>

              <div className="flex items-center gap-2.5 text-xs text-slate-700">
                <Sparkles className="w-4 h-4 text-brand-600 shrink-0" />
                <span>
                  <strong>Advertising:</strong> Google AdSense &amp; Direct Inquiries
                </span>
              </div>
            </div>

            <div className="p-4 bg-brand-50/50 border border-brand-200/60 rounded-xl text-xs text-slate-600 leading-relaxed">
              <strong className="text-brand-900 block mb-1">Feature Requests:</strong>
              Need a specialized tool (e.g. Word to PDF, Video compressor, or Developer formatter)? Let us know and we will prioritize it in our upcoming release cycle!
            </div>
          </div>

          {/* Right Column: Interactive Form */}
          <div className="md:col-span-2">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
