import React from "react";
import Link from "next/link";
import { getAvailableTools, getToolById } from "@/data/toolsRegistry";
import DynamicIcon from "./DynamicIcon";
import { ArrowRight, Sparkles } from "lucide-react";

export default function RelatedTools({
  currentToolId,
  title = "Related Online Tools",
  subtitle = "Explore other free, browser-based tools available on Bits & Tools with zero file uploads",
  maxItems = 3,
}) {
  const currentTool = getToolById(currentToolId);
  const availableTools = getAvailableTools()
    .filter((tool, idx, arr) => idx === arr.findIndex((t) => t.route === tool.route))
    .filter((t) => t.id !== currentToolId && (!currentTool || t.route !== currentTool.route));
  const displayTools = availableTools.slice(0, maxItems);

  if (displayTools.length === 0) return null;

  return (
    <section className="py-12 bg-white border-t border-slate-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>More Client-Side Utilities</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-2 text-sm text-slate-600">
              {subtitle}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {displayTools.map((tool) => (
            <Link
              key={tool.id}
              href={tool.route}
              aria-label={`Open ${tool.name} tool`}
              className="group relative flex flex-col p-5 sm:p-6 bg-white rounded-2xl border border-black/[0.06] shadow-subtle hover:shadow-card-hover hover:border-black/[0.12] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-11 h-11 rounded-xl bg-brand-50/80 text-brand-600 flex items-center justify-center group-hover:bg-brand-600 group-hover:text-white transition-colors">
                  <DynamicIcon name={tool.icon} className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2.5 py-0.5 rounded-full">
                  Ready
                </span>
              </div>

              <h3 className="text-base font-semibold tracking-tight text-slate-900 group-hover:text-brand-600 transition-colors flex items-center justify-between">
                <span>{tool.name}</span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-brand-600 group-hover:translate-x-1 transition-all" />
              </h3>

              <p className="mt-1.5 text-xs sm:text-sm text-slate-500 leading-relaxed flex-1">
                {tool.description}
              </p>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-brand-600">
                <span>Launch tool free &rarr;</span>
                <span className="text-[11px] font-normal text-slate-400">100% Private</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
