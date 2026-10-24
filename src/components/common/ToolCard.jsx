import React from "react";
import Link from "next/link";
import DynamicIcon from "./DynamicIcon";
import ComingSoonBadge from "./ComingSoonBadge";
import { ArrowRight, Sparkles } from "lucide-react";

export default function ToolCard({ tool }) {
  const isAvailable = tool.status === "available";

  if (isAvailable) {
    return (
      <Link
        href={tool.route}
        aria-label={`Open ${tool.name} tool`}
        className="group relative flex flex-col p-5 sm:p-6 bg-white rounded-2xl border border-black/[0.06] shadow-subtle hover:shadow-card-hover hover:border-black/[0.12] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="w-11 h-11 rounded-xl bg-brand-50/80 text-brand-600 flex items-center justify-center group-hover:bg-brand-600 group-hover:text-white transition-colors">
            <DynamicIcon name={tool.icon} className="w-5 h-5" />
          </div>
          {tool.featured && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60">
              <Sparkles className="w-3 h-3" />
              <span>Ready</span>
            </span>
          )}
        </div>

        <h3 className="text-base font-semibold tracking-tight text-slate-900 group-hover:text-brand-600 transition-colors flex items-center justify-between">
          <span>{tool.name}</span>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-brand-600 group-hover:translate-x-1 transition-all" />
        </h3>

        <p className="mt-1.5 text-xs sm:text-sm text-slate-500 line-clamp-2 leading-relaxed flex-1">
          {tool.description}
        </p>

        <div className="mt-4 pt-3 border-t border-slate-100/80 flex items-center text-xs font-semibold text-brand-600 group-hover:text-brand-700">
          <span>Use tool free &rarr;</span>
        </div>
      </Link>
    );
  }

  // Coming Soon Card
  return (
    <div
      className="relative flex flex-col p-5 sm:p-6 bg-slate-50/60 rounded-2xl border border-black/[0.04] opacity-85 select-none"
      aria-disabled="true"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-11 h-11 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center">
          <DynamicIcon name={tool.icon} className="w-5 h-5" />
        </div>
        <ComingSoonBadge />
      </div>

      <h3 className="text-base font-semibold tracking-tight text-slate-700">
        {tool.name}
      </h3>

      <p className="mt-1.5 text-xs sm:text-sm text-slate-400 line-clamp-2 leading-relaxed flex-1">
        {tool.description}
      </p>

      <div className="mt-4 pt-3 border-t border-slate-200/50 flex items-center text-xs text-slate-400 font-medium">
        <span>In development</span>
      </div>
    </div>
  );
}
