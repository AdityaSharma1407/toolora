"use client";

import React, { useState } from "react";
import PrimaryButton from "@/components/common/PrimaryButton";
import { siteConfig } from "@/config/site";
import { Send, CheckCircle2, Copy, Check, Mail, ExternalLink } from "lucide-react";

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "general",
    message: "",
  });

  const topicLabels = {
    general: "General Inquiry or Feedback",
    feature: "Request a New Tool",
    bug: "Report a Bug / Processing Issue",
    advertising: "Advertising & Monetization Partnership",
    privacy: "Privacy & Data Protection",
  };

  const brandLabel = siteConfig.displayName || siteConfig.name;
  const subjectLine = `[${brandLabel}] ${topicLabels[formData.subject] || "Inquiry"} - from ${formData.name.trim() || "User"}`;
  const bodyText = `Name: ${formData.name.trim()}
Email: ${formData.email.trim()}
Topic: ${topicLabels[formData.subject] || formData.subject}

Message:
${formData.message.trim()}

---
Sent via ${brandLabel} Online Contact Form
Platform: ${brandLabel} (${siteConfig.url})`;

  const mailtoUrl = `mailto:${encodeURIComponent(siteConfig.contactEmail)}?subject=${encodeURIComponent(
    subjectLine
  )}&body=${encodeURIComponent(bodyText)}`;

  function handleSubmit(e) {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      return;
    }

    // Direct email client handoff: triggers the user's configured mail app
    if (typeof window !== "undefined") {
      try {
        window.location.href = mailtoUrl;
      } catch (err) {
        console.warn("Could not launch mailto handler automatically:", err);
      }
    }

    setSubmitted(true);
  }

  function handleCopyEmail() {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(siteConfig.contactEmail);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2500);
    }
  }

  function handleCopyMessage() {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(bodyText);
      setCopiedMessage(true);
      setTimeout(() => setCopiedMessage(false), 2500);
    }
  }

  if (submitted) {
    return (
      <div className="py-6 animate-in fade-in space-y-6">
        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-1">
            Email Draft Ready!
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
            We have prepared your message and prompted your default email app to send directly to{" "}
            <strong className="text-slate-900 font-semibold">{siteConfig.contactEmail}</strong>.
          </p>
        </div>

        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 text-xs text-slate-700">
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="font-semibold text-slate-900 block">Recipient Email:</span>
              <span className="font-mono text-brand-700 select-all">{siteConfig.contactEmail}</span>
            </div>
            <button
              type="button"
              onClick={handleCopyEmail}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-md font-medium text-slate-700 transition-colors"
            >
              {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedEmail ? "Copied" : "Copy Email"}</span>
            </button>
          </div>

          <div className="border-t border-slate-200/80 pt-3 flex items-start justify-between gap-2">
            <div>
              <span className="font-semibold text-slate-900 block">Drafted Message Content:</span>
              <span className="text-slate-500">Need to paste into Gmail or Webmail?</span>
            </div>
            <button
              type="button"
              onClick={handleCopyMessage}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-md font-medium text-slate-700 transition-colors"
            >
              {copiedMessage ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedMessage ? "Copied" : "Copy Message"}</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <a
            href={mailtoUrl}
            className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <Mail className="w-4 h-4" />
            <span>Open Email Client Again</span>
          </a>

          <button
            type="button"
            onClick={() => {
              setSubmitted(false);
              setFormData({ name: "", email: "", subject: "general", message: "" });
            }}
            className="w-full sm:w-auto px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg text-xs font-medium transition-colors"
          >
            Draft Another Message
          </button>
        </div>

        <p className="text-[11px] text-slate-500 text-center leading-relaxed">
          Privacy guarantee: Inquiries are transmitted directly through your personal mail provider to eliminate intermediaries and database logging.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <h3 className="text-base font-bold text-slate-900">
          Send a Direct Inquiry
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Fill out this form to prepare a direct email message to our team ({siteConfig.contactEmail}).
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="contact-name" className="text-xs font-semibold text-slate-700 block mb-1.5">
            Your Name *
          </label>
          <input
            id="contact-name"
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Jane Doe"
            className="w-full min-h-[44px] px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-brand-600 focus-visible:ring-2 focus-visible:ring-brand-500"
          />
        </div>

        <div>
          <label htmlFor="contact-email" className="text-xs font-semibold text-slate-700 block mb-1.5">
            Your Email Address *
          </label>
          <input
            id="contact-email"
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="jane@example.com"
            className="w-full min-h-[44px] px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-brand-600 focus-visible:ring-2 focus-visible:ring-brand-500"
          />
        </div>
      </div>

      <div>
        <label htmlFor="contact-subject" className="text-xs font-semibold text-slate-700 block mb-1.5">
          Subject / Topic *
        </label>
        <select
          id="contact-subject"
          value={formData.subject}
          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          className="w-full min-h-[44px] px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-brand-600 focus-visible:ring-2 focus-visible:ring-brand-500"
        >
          <option value="general">General Inquiry or Feedback</option>
          <option value="feature">Request a New Tool</option>
          <option value="bug">Report a Bug / Processing Issue</option>
          <option value="advertising">Advertising &amp; Monetization Partnership</option>
          <option value="privacy">Privacy &amp; Data Protection</option>
        </select>
      </div>

      <div>
        <label htmlFor="contact-message" className="text-xs font-semibold text-slate-700 block mb-1.5">
          Your Message *
        </label>
        <textarea
          id="contact-message"
          required
          rows={5}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          placeholder="How can we help you? Describe your question or feedback..."
          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-brand-600 focus-visible:ring-2 focus-visible:ring-brand-500"
        />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <PrimaryButton
          type="submit"
          size="md"
          variant="primary"
          icon={Send}
          className="w-full sm:w-auto"
        >
          Prepare &amp; Send Message
        </PrimaryButton>

        <span className="text-[11px] text-slate-500 text-center sm:text-right">
          Direct email to: <strong className="text-slate-700">{siteConfig.contactEmail}</strong>
        </span>
      </div>
    </form>
  );
}
