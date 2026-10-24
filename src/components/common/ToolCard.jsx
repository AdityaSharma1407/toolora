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
        className="group relative flex flex-col p-5 bg-white rounded-xl border border-slate-200/80 hover:border-brand-500 hover:shadow-md transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
      >
        <div className="flex items-start justify-between mb-3">
          <div className="p-2.5 rounded-lg bg-brand-50 text-brand-600 group-hover:bg-brand-600 group-hover:text-white transition-colors">
            <DynamicIcon name={tool.icon} className="w-6 h-6" />
          </div>
          {tool.featured && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
              <Sparkles className="w-3 h-3" />
              <span>Ready</span>
            </span>
          )}
        </div>

        <h3 className="text-base font-semibold text-slate-900 group-hover:text-brand-600 transition-colors flex items-center justify-between">
          <span>{tool.name}</span>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-brand-600 group-hover:translate-x-1 transition-all" />
        </h3>

        <p className="mt-1.5 text-xs text-slate-600 line-clamp-2 leading-relaxed flex-1">
          {tool.description}
        </p>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs font-medium text-brand-600 group-hover:text-brand-700">
          <span>Use tool free</span>
        </div>
      </Link>
    );
  }

  // Coming Soon Card
  return (
    <div
      className="relative flex flex-col p-5 bg-slate-50/70 rounded-xl border border-slate-200/60 opacity-90 select-none"
      aria-disabled="true"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="p-2.5 rounded-lg bg-slate-100 text-slate-500">
          <DynamicIcon name={tool.icon} className="w-6 h-6" />
        </div>
        <ComingSoonBadge />
      </div>

      <h3 className="text-base font-semibold text-slate-700">
        {tool.name}
      </h3>

      <p className="mt-1.5 text-xs text-slate-500 line-clamp-2 leading-relaxed flex-1">
        {tool.description}
      </p>

      <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center text-xs text-slate-400 font-medium">
        <span>In development</span>
      </div>
    </div>
  );
}
