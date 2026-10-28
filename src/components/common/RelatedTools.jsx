import React from "react";
import Link from "next/link";
import { getAvailableTools, getToolById, getToolsByCategory } from "@/data/toolsRegistry";
import DynamicIcon from "./DynamicIcon";
import { ArrowRight, Sparkles, FolderTree } from "lucide-react";

const CATEGORY_HUB_MAP = {
  pdf: { route: "/pdf-tools", name: "PDF Tools Hub", label: "View all PDF utilities" },
  image: { route: "/image-tools", name: "Image Tools Hub", label: "View all image utilities" },
  convert: { route: "/convert-tools", name: "Conversion Tools Hub", label: "View all conversion utilities" },
  media: { route: "/media-tools", name: "Media Tools Hub", label: "View all audio & video utilities" },
  utility: { route: "/utility-tools", name: "Developer Tools Hub", label: "View all developer utilities" },
};

export default function RelatedTools({
  currentToolId,
  title,
  subtitle,
  maxItems = 3,
}) {
  const currentTool = currentToolId ? getToolById(currentToolId) : null;
  const categoryId = currentTool?.category;
  const pillarHub = categoryId ? CATEGORY_HUB_MAP[categoryId] : null;

  // Enforce strict topical siloing: filter siblings strictly within the same category
  let siblingPool = [];
  if (categoryId) {
    siblingPool = getToolsByCategory(categoryId).filter(
      (t) => t.status === "available" && t.id !== currentToolId && (!currentTool || t.route !== currentTool.route)
    );
  }

  // Deduplicate sibling tools by route
  const uniqueSiblings = siblingPool.filter(
    (tool, idx, arr) => idx === arr.findIndex((t) => t.route === tool.route)
  );

  // Fallback to general available tools only if category has fewer than maxItems siblings
  let displayTools = uniqueSiblings.slice(0, maxItems);
  if (displayTools.length < maxItems) {
    const general = getAvailableTools().filter(
      (t) =>
        t.status === "available" &&
        t.id !== currentToolId &&
        (!currentTool || t.route !== currentTool.route) &&
        !displayTools.some((d) => d.route === t.route)
    );
    displayTools = [...displayTools, ...general.slice(0, maxItems - displayTools.length)];
  }

  if (displayTools.length === 0) return null;

  const displayTitle = title || (pillarHub ? `Related ${pillarHub.name} Utilities` : "Related Online Tools");
  const displaySubtitle =
    subtitle ||
    (pillarHub
      ? `Explore complementary tools in the ${pillarHub.name} cluster. Fast, 100% private, and processed locally in your browser.`
      : "Explore other free, browser-based tools available on Bits & Tools with zero file uploads.");

  return (
    <aside aria-label="Related tools" className="py-12 bg-white border-t border-slate-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{pillarHub ? pillarHub.name : "Client-Side Utilities"}</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              {displayTitle}
            </h2>
            {displaySubtitle && (
              <p className="mt-2 text-sm text-slate-600 max-w-2xl">
                {displaySubtitle}
              </p>
            )}
          </div>

          {pillarHub && (
            <Link
              href={pillarHub.route}
              className="inline-flex items-center gap-2 text-sm font-semibold text-brand-600 hover:text-brand-700 group shrink-0"
              aria-label={pillarHub.label}
            >
              <FolderTree className="w-4 h-4 text-brand-500" />
              <span>{pillarHub.label}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
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
    </aside>
  );
}
