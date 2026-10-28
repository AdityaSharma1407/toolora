"use client";

import React, { useState, useEffect } from "react";
import { ListOrdered, ChevronRight, X, ArrowUpRight } from "lucide-react";

/**
 * Contextual Quick-Jump Table of Contents (TOC) Drawer
 * 
 * Automatically indexes all H2 & H3 headings with semantic IDs on the page,
 * tracks active viewport intersection via IntersectionObserver, and provides
 * 1-click deep-link jumps to retain users in-session.
 */
export default function QuickJumpToc() {
  const [headings, setHeadings] = useState([]);
  const [activeId, setActiveId] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Scan page for heading elements with semantic IDs
    const timer = setTimeout(() => {
      const elements = Array.from(
        document.querySelectorAll("main h2[id], main h3[id]")
      ).map((el) => ({
        id: el.id,
        text: el.innerText.replace(/#/g, "").trim(),
        level: el.tagName.toLowerCase() === "h3" ? 3 : 2,
      })).filter((h) => h.id && h.text.length > 2);

      setHeadings(elements);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
            break;
          }
        }
      },
      { rootMargin: "0px 0px -60% 0px", threshold: 0.1 }
    );

    headings.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length < 2) return null;

  const scrollToHeading = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveId(id);
      setIsOpen(false);
      window.history.replaceState(null, "", `#${id}`);
    }
  };

  return (
    <>
      {/* Floating Trigger Pill */}
      <div className="fixed bottom-6 right-6 z-40 hidden sm:block">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-label="Table of Contents Quick Jump"
          className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-slate-900/95 hover:bg-black text-white text-xs font-semibold shadow-lg hover:shadow-xl transition-all border border-slate-700/80 backdrop-blur-xs group"
        >
          <ListOrdered className="w-3.5 h-3.5 text-brand-400 group-hover:rotate-12 transition-transform" />
          <span>Jump to Section</span>
          <span className="w-4 h-4 rounded-full bg-slate-800 text-[10px] text-slate-300 flex items-center justify-center font-mono">
            {headings.length}
          </span>
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div
            role="dialog"
            aria-label="Page Table of Contents"
            className="absolute bottom-12 right-0 w-72 max-h-80 overflow-y-auto p-3 bg-white rounded-2xl shadow-2xl border border-slate-200 text-left animate-in fade-in slide-in-from-bottom-2 duration-150"
          >
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Contents
              </span>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                aria-label="Close Table of Contents"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <ul className="space-y-1 text-xs">
              {headings.map((h) => {
                const isActive = activeId === h.id;
                return (
                  <li key={h.id}>
                    <button
                      type="button"
                      onClick={() => scrollToHeading(h.id)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-colors flex items-center justify-between ${
                        h.level === 3 ? "pl-5 text-slate-500" : ""
                      } ${
                        isActive
                          ? "bg-brand-50 text-brand-700 font-semibold border-l-2 border-brand-600"
                          : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      <span className="truncate">{h.text}</span>
                      {isActive && <ChevronRight className="w-3 h-3 text-brand-600 shrink-0" />}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>

      {/* Mobile Floating Trigger */}
      <div className="fixed bottom-4 right-4 z-40 sm:hidden">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Open Table of Contents"
          className="w-11 h-11 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-lg border border-slate-700"
        >
          <ListOrdered className="w-4 h-4 text-brand-400" />
        </button>

        {isOpen && (
          <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/40 backdrop-blur-xs">
            <div className="bg-white rounded-t-2xl p-5 max-h-[70vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                <span className="text-sm font-bold text-slate-900">Jump to Section</span>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-lg text-slate-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <ul className="space-y-1 text-sm">
                {headings.map((h) => (
                  <li key={h.id}>
                    <button
                      type="button"
                      onClick={() => scrollToHeading(h.id)}
                      className={`w-full text-left py-2 px-3 rounded-lg flex items-center justify-between ${
                        activeId === h.id ? "bg-brand-50 text-brand-700 font-bold" : "text-slate-700"
                      } ${h.level === 3 ? "pl-6 text-xs text-slate-500" : ""}`}
                    >
                      <span className="truncate">{h.text}</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
