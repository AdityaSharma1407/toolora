"use client";

import React from "react";
import Link from "next/link";
import { Star, X, Sparkles, Plus } from "lucide-react";
import { usePinnedTools } from "@/hooks/usePinnedTools";
import { getToolById } from "@/data/toolsRegistry";
import DynamicIcon from "./DynamicIcon";

export default function PinnedToolsBar() {
  const { pinnedIds, togglePin, isLoaded } = usePinnedTools();

  if (!isLoaded) {
    return (
      <div className="h-10 max-w-2xl mx-auto rounded-xl bg-slate-100/60 animate-pulse my-4" />
    );
  }

  const pinnedTools = pinnedIds
    .map((id) => getToolById(id))
    .filter(Boolean);

  return (
    <div className="w-full max-w-4xl mx-auto my-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1 pb-2">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
          <span>My Pinned Favorites</span>
          <span className="text-[10px] font-semibold text-slate-500 font-mono">
            ({pinnedTools.length})
          </span>
        </div>
        <span className="text-[11px] text-slate-500">
          Tip: Click the star icon on any tool card to pin/unpin it
        </span>
      </div>

      {pinnedTools.length === 0 ? (
        <div className="p-4 rounded-2xl border border-dashed border-slate-200 bg-white/60 text-center text-xs text-slate-600 flex items-center justify-center gap-2">
          <span>No tools pinned yet. Star your daily favorites across any category!</span>
        </div>
      ) : (
        <div className="flex flex-wrap items-center gap-2">
          {pinnedTools.map((tool) => (
            <div
              key={tool.id}
              className="group relative inline-flex items-center bg-white border border-slate-200/90 hover:border-brand-400 shadow-2xs rounded-xl pr-1.5 pl-2.5 py-1.5 text-xs font-semibold text-slate-800 hover:text-brand-600 transition-all"
            >
              <Link
                href={tool.route}
                className="flex items-center gap-2 mr-1"
                title={tool.description}
              >
                <div className="w-5 h-5 rounded-md bg-brand-50 text-brand-600 flex items-center justify-center group-hover:bg-brand-600 group-hover:text-white transition-colors">
                  <DynamicIcon name={tool.icon} className="w-3 h-3" />
                </div>
                <span>{tool.shortName || tool.name}</span>
              </Link>

              <button
                type="button"
                onClick={(e) => togglePin(tool.id, e)}
                aria-label={`Unpin ${tool.name}`}
                title="Unpin tool"
                className="min-w-[28px] min-h-[28px] flex items-center justify-center opacity-60 group-hover:opacity-100 hover:text-rose-600 rounded transition-all"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
