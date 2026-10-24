"use client";

import React, { useState } from "react";
import PrimaryButton from "@/components/common/PrimaryButton";
import { Send, CheckCircle2 } from "lucide-react";

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "general",
    message: "",
  });

  function handleSubmit(e) {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      return;
    }
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="py-8 text-center animate-in fade-in">
        <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-7 h-7" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">
          Message Sent!
        </h3>
        <p className="text-sm text-slate-600 max-w-sm mx-auto mb-6">
          Thank you for reaching out. We will review your message and reply to{" "}
          <strong>{formData.email}</strong> shortly.
        </p>
        <button
          type="button"
          onClick={() => {
            setSubmitted(false);
            setFormData({ name: "", email: "", subject: "general", message: "" });
          }}
          className="text-xs font-semibold text-brand-600 hover:text-brand-700 underline"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-base font-bold text-slate-900 mb-4">
        Send a Message
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1">
            Your Name *
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Jane Doe"
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-brand-600"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1">
            Your Email *
          </label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="jane@example.com"
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-brand-600"
          />
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold text-slate-700 block mb-1">
          Subject / Topic *
        </label>
        <select
          value={formData.subject}
          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-brand-600"
        >
          <option value="general">General Inquiry or Feedback</option>
          <option value="feature">Request a New Tool</option>
          <option value="bug">Report a Bug / Processing Issue</option>
          <option value="advertising">Advertising &amp; Monetization Partnership</option>
          <option value="privacy">Privacy &amp; Data Protection</option>
        </select>
      </div>

      <div>
        <label className="text-xs font-semibold text-slate-700 block mb-1">
          Your Message *
        </label>
        <textarea
          required
          rows={5}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          placeholder="How can we help you?"
          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-brand-600"
        />
      </div>

      <PrimaryButton
        type="submit"
        size="md"
        variant="primary"
        icon={Send}
        className="w-full sm:w-auto"
      >
        Submit Message
      </PrimaryButton>
    </form>
  );
}
