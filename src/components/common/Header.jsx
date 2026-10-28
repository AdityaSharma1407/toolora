"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/config/site";
import { CATEGORIES, getAllTools } from "@/data/toolsRegistry";
import ToolSearch from "./ToolSearch";
import DynamicIcon from "./DynamicIcon";
import {
  Menu,
  X,
  ChevronDown,
  Layers,
  Search as SearchIcon,
  ArrowRight,
  Download,
} from "lucide-react";
import { usePwaInstall } from "@/hooks/usePwaInstall";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [allToolsOpen, setAllToolsOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const pathname = usePathname();
  const dropdownRef = useRef(null);
  const { canInstall, promptInstall } = usePwaInstall();

  const tools = getAllTools();

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setAllToolsOpen(false);
    setSearchModalOpen(false);
  }, [pathname]);

  // Prevent background scrolling when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  // Click outside to close desktop dropdown
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setAllToolsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Global Hotkey Listener: Ctrl+K / Cmd+K or "/" to toggle quick search
  useEffect(() => {
    function handleGlobalKeyDown(e) {
      const isInput =
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target?.isContentEditable;

      // Ctrl+K or Cmd+K
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchModalOpen((prev) => !prev);
        return;
      }

      // "/" key when not typing in an input
      if (e.key === "/" && !isInput && !searchModalOpen) {
        e.preventDefault();
        setSearchModalOpen(true);
        return;
      }

      // Escape key to close modal
      if (e.key === "Escape" && searchModalOpen) {
        setSearchModalOpen(false);
      }
    }

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [searchModalOpen]);

  const navCategories = [
    { label: "PDF", href: "/pdf-tools" },
    { label: "Images", href: "/image-tools" },
    { label: "Convert", href: "/convert-tools" },
    { label: "Media", href: "/media-tools" },
    { label: "Utilities", href: "/utility-tools" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/85 backdrop-blur-md border-b border-black/[0.06] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Desktop Nav */}
          <div className="flex items-center gap-6 xl:gap-8">
            <Link
              href="/"
              aria-label="Bits & Tools Homepage"
              className="flex items-center gap-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded-xl"
            >
              <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-subtle">
                <Layers className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg sm:text-xl font-bold tracking-tight text-slate-900">
                  {siteConfig.displayName || siteConfig.name}
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1" aria-label="Main Navigation">
              {/* All Tools Mega Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setAllToolsOpen(!allToolsOpen)}
                  aria-expanded={allToolsOpen}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                    allToolsOpen
                      ? "text-brand-600 bg-brand-50/80"
                      : "text-slate-700 hover:text-slate-900 hover:bg-slate-100/70"
                  }`}
                >
                  <span>All Tools</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-150 ${
                      allToolsOpen ? "rotate-180 text-brand-600" : "text-slate-400"
                    }`}
                  />
                </button>

                {allToolsOpen && (
                  <div className="absolute left-0 mt-2 w-[760px] max-w-[95vw] bg-white rounded-2xl shadow-modal border border-black/[0.08] p-5 grid grid-cols-1 md:grid-cols-3 gap-5 animate-in fade-in slide-in-from-top-1 max-h-[80vh] overflow-y-auto">
                    {Object.values(CATEGORIES).map((cat) => {
                      const catTools = tools.filter((t) => t.category === cat.id);
                      const hubHref = `/${cat.id}-tools`;
                      return (
                        <div key={cat.id} className="space-y-2">
                          <Link
                            href={hubHref}
                            onClick={() => setAllToolsOpen(false)}
                            className="flex items-center justify-between pb-1.5 border-b border-slate-100 group"
                          >
                            <div className="flex items-center gap-2">
                              <DynamicIcon name={cat.icon} className="w-4 h-4 text-brand-600" />
                              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider group-hover:text-brand-600 transition-colors">
                                {cat.name}
                              </span>
                            </div>
                            <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-brand-600 transition-colors" />
                          </Link>

                          <ul className="space-y-1">
                            {catTools.slice(0, 4).map((tool) => (
                              <li key={tool.id}>
                                <Link
                                  href={tool.route}
                                  onClick={() => setAllToolsOpen(false)}
                                  className="flex items-center justify-between px-2 py-1 rounded-md text-xs font-medium text-slate-700 hover:text-brand-600 hover:bg-brand-50 transition-colors"
                                >
                                  <span className="truncate pr-2">{tool.shortName || tool.name}</span>
                                  <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded font-medium shrink-0">
                                    Ready
                                  </span>
                                </Link>
                              </li>
                            ))}
                          </ul>

                          {catTools.length > 4 && (
                            <Link
                              href={hubHref}
                              onClick={() => setAllToolsOpen(false)}
                              className="inline-block text-[11px] font-semibold text-brand-600 hover:underline pt-0.5"
                            >
                              View all {catTools.length} {cat.name.toLowerCase()} &rarr;
                            </Link>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Direct Category Hub Links */}
              {navCategories.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-2.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    pathname === item.href
                      ? "text-brand-600 bg-brand-50 font-semibold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/60"
                  }`}
                >
                  {item.label}
                </Link>
              ))}

              <div className="h-4 w-px bg-slate-200 mx-1" />

              {/* About Link */}
              <Link
                href="/about"
                className={`px-2.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  pathname === "/about"
                    ? "text-brand-600 bg-brand-50 font-semibold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/60"
                }`}
              >
                About
              </Link>
            </nav>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Trigger Button with Hotkey Badge */}
            <button
              type="button"
              onClick={() => setSearchModalOpen(true)}
              aria-label="Open search (Ctrl+K)"
              className="min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-[36px] flex items-center justify-between gap-3 px-3 py-1.5 text-xs text-slate-600 bg-slate-100/80 hover:bg-slate-200/70 rounded-xl border border-black/[0.04] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            >
              <div className="flex items-center gap-2">
                <SearchIcon className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-slate-500" />
                <span className="hidden sm:inline">Search 55 tools...</span>
              </div>
              <kbd className="hidden md:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono text-slate-500 bg-white border border-slate-200/90 rounded shadow-2xs font-medium">
                <span>Ctrl</span> K
              </kbd>
            </button>

            {/* PWA Native Install Button */}
            {canInstall && (
              <button
                type="button"
                onClick={promptInstall}
                aria-label="Install Bits & Tools App"
                title="Install Bits & Tools App to Desktop or Home Screen"
                className="hidden sm:inline-flex items-center gap-1.5 min-h-[36px] px-3.5 py-1.5 bg-brand-50 hover:bg-brand-100 text-brand-700 border border-brand-200/60 rounded-xl text-xs font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 shadow-2xs"
              >
                <Download className="w-3.5 h-3.5 text-brand-600" />
                <span>Install App</span>
              </button>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
              className="lg:hidden min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-slate-700 hover:bg-slate-100/80 active:bg-slate-200/60 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Global Command Palette / Search Modal */}
      {searchModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center pt-12 sm:pt-20 px-4 bg-black/40 backdrop-blur-md animate-in fade-in"
          onClick={() => setSearchModalOpen(false)}
        >
          <div
            className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-5 border border-black/[0.08] animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center">
                  <SearchIcon className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Quick Tool Palette
                </span>
                <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                  55 Tools Ready
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSearchModalOpen(false)}
                aria-label="Close search modal"
                className="min-w-[36px] min-h-[36px] flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <ToolSearch
              autoFocus
              isModal
              onSelect={() => setSearchModalOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-black/[0.06] bg-white/95 backdrop-blur-md px-4 pt-2 pb-5 space-y-1 animate-in slide-in-from-top-1 max-h-[85vh] overflow-y-auto">
          <Link
            href="/"
            className="min-h-[44px] flex items-center px-3.5 py-2 rounded-xl text-sm font-semibold text-slate-900 hover:bg-slate-100/80 transition-colors"
          >
            Home
          </Link>

          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3.5 pt-2 pb-1">
            Tool Suites (55 Available)
          </div>

          <Link
            href="/pdf-tools"
            className="min-h-[44px] flex items-center justify-between px-3.5 py-2 rounded-xl text-sm font-medium text-slate-800 hover:bg-slate-100/80 transition-colors"
          >
            <span>PDF Tools Directory</span>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
              12 tools
            </span>
          </Link>

          <Link
            href="/image-tools"
            className="min-h-[44px] flex items-center justify-between px-3.5 py-2 rounded-xl text-sm font-medium text-slate-800 hover:bg-slate-100/80 transition-colors"
          >
            <span>Image Tools Directory</span>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
              10 tools
            </span>
          </Link>

          <Link
            href="/convert-tools"
            className="min-h-[44px] flex items-center justify-between px-3.5 py-2 rounded-xl text-sm font-medium text-slate-800 hover:bg-slate-100/80 transition-colors"
          >
            <span>File Conversion Suite</span>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
              6 tools
            </span>
          </Link>

          <Link
            href="/media-tools"
            className="min-h-[44px] flex items-center justify-between px-3.5 py-2 rounded-xl text-sm font-medium text-slate-800 hover:bg-slate-100/80 transition-colors"
          >
            <span>Video & Audio Suite</span>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
              5 tools
            </span>
          </Link>

          <Link
            href="/utility-tools"
            className="min-h-[44px] flex items-center justify-between px-3.5 py-2 rounded-xl text-sm font-medium text-slate-800 hover:bg-slate-100/80 transition-colors"
          >
            <span>Everyday & Developer Tools</span>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
              22 tools
            </span>
          </Link>

          {canInstall && (
            <button
              type="button"
              onClick={() => {
                promptInstall();
                setMobileMenuOpen(false);
              }}
              className="w-full min-h-[44px] flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-brand-700 bg-brand-50/80 hover:bg-brand-100 transition-colors"
            >
              <Download className="w-4 h-4 text-brand-600" />
              <span>Install Bits & Tools App</span>
            </button>
          )}

          <div className="pt-2 border-t border-slate-100">
            <Link
              href="/about"
              className="min-h-[44px] flex items-center px-3.5 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100/80 transition-colors"
            >
              About {siteConfig.displayName || "Bits & Tools"}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
