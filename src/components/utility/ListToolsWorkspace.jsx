"use client";

import React, { useState, useId } from "react";
import {
  textToList,
  shuffleList,
  sortList,
  deduplicateList,
  reverseList,
  wrapListItems,
  chunkList,
  setOperations,
} from "@/tools/utility/listTools.js";
import {
  Shuffle,
  ArrowDownAZ,
  Filter,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  Layers,
  ListFilter,
  Sliders,
  Download,
  Split,
  Tag,
  CheckCircle2,
} from "lucide-react";

const SAMPLE_LIST = `Apple
Banana
Orange
Apple
Grape
Mango
Pineapple
Banana
Strawberry
Watermelon`;

const SAMPLE_A = `React
Next.js
TypeScript
Tailwind CSS
PostgreSQL
Docker`;

const SAMPLE_B = `Vue.js
React
TypeScript
Python
Docker
GraphQL`;

export default function ListToolsWorkspace() {
  const [tab, setTab] = useState("single"); // 'single' | 'sets'
  
  // Single list state
  const [singleInput, setSingleInput] = useState(SAMPLE_LIST);
  const [prefix, setPrefix] = useState("");
  const [suffix, setSuffix] = useState("");
  const [chunkSize, setChunkSize] = useState(3);
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [toast, setToast] = useState(null);
  const [copied, setCopied] = useState(false);

  // Set operations state
  const [listA, setListA] = useState(SAMPLE_A);
  const [listB, setListB] = useState(SAMPLE_B);
  const [setOp, setSetOp] = useState("intersection");

  const singleInputId = useId();
  const listAId = useId();
  const listBId = useId();

  const showToast = (text, type = "success") => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 3000);
  };

  const parsedSingle = textToList(singleInput, false, false);
  const nonBlankSingle = textToList(singleInput, true, true);

  // Single list actions
  const handleShuffle = () => {
    const lines = textToList(singleInput, true, true);
    if (!lines.length) return;
    const shuffled = shuffleList(lines);
    setSingleInput(shuffled.join("\n"));
    showToast("List shuffled with CSPRNG randomness!");
  };

  const handleSort = (order) => {
    const lines = textToList(singleInput, true, true);
    if (!lines.length) return;
    const sorted = sortList(lines, { order, caseSensitive });
    setSingleInput(sorted.join("\n"));
    showToast(`Sorted: ${order.toUpperCase()}`);
  };

  const handleDeduplicate = () => {
    const lines = textToList(singleInput, true, true);
    if (!lines.length) return;
    const res = deduplicateList(lines, caseSensitive);
    setSingleInput(res.list.join("\n"));
    showToast(`Removed ${res.removedCount} duplicates (${res.uniqueCount} unique remaining)`);
  };

  const handleReverse = () => {
    const lines = textToList(singleInput, false, false);
    if (!lines.length) return;
    setSingleInput(reverseList(lines).join("\n"));
    showToast("List order reversed");
  };

  const handleApplyWrap = () => {
    const lines = textToList(singleInput, true, true);
    if (!lines.length) return;
    const wrapped = wrapListItems(lines, prefix, suffix);
    setSingleInput(wrapped.join("\n"));
    showToast("Prefix and suffix applied");
  };

  const handleAddNumbering = () => {
    const lines = textToList(singleInput, true, true);
    if (!lines.length) return;
    const numbered = lines.map((l, i) => `${i + 1}. ${l}`);
    setSingleInput(numbered.join("\n"));
    showToast("Line numbers prepended");
  };

  const handleCleanLines = () => {
    const lines = textToList(singleInput, true, true);
    setSingleInput(lines.join("\n"));
    showToast("Whitespace trimmed and empty lines removed");
  };

  const handleChunk = () => {
    const lines = textToList(singleInput, true, true);
    if (!lines.length) return;
    const chunks = chunkList(lines, chunkSize);
    const chunkedText = chunks.map((group, idx) => `--- Group ${idx + 1} ---\n${group.join("\n")}`).join("\n\n");
    setSingleInput(chunkedText);
    showToast(`Grouped into batches of ${chunkSize}`);
  };

  // Set operations result computation
  const itemsA = textToList(listA, true, true);
  const itemsB = textToList(listB, true, true);
  const setResult = setOperations(itemsA, itemsB, setOp, caseSensitive);

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleDownload = (text, filename = "list.txt") => {
    const blob = new Blob([text], { type: "text/plain;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full space-y-6">
      {/* Toast Alert */}
      {toast && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs text-emerald-800 dark:text-emerald-300 flex items-center justify-between shadow-xs transition-all">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>{toast.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setToast(null)}
            className="text-xs font-semibold hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Mode Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white dark:bg-[#18181b] rounded-2xl border border-black/[0.08] dark:border-white/[0.08] shadow-xs">
        <div className="flex items-center gap-1.5 p-1 bg-neutral-100 dark:bg-[#27272a] rounded-xl text-xs font-medium">
          <button
            type="button"
            onClick={() => setTab("single")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              tab === "single"
                ? "bg-white dark:bg-[#18181b] shadow-xs text-neutral-900 dark:text-white font-semibold"
                : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
            }`}
          >
            <ListFilter className="w-3.5 h-3.5 text-apple-blue" />
            Single List Tools
          </button>
          <button
            type="button"
            onClick={() => setTab("sets")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              tab === "sets"
                ? "bg-white dark:bg-[#18181b] shadow-xs text-neutral-900 dark:text-white font-semibold"
                : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
            }`}
          >
            <Split className="w-3.5 h-3.5 text-purple-500" />
            Compare Two Lists (Set Operations)
          </button>
        </div>

        <label className="flex items-center gap-1.5 text-xs text-neutral-600 dark:text-neutral-400 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={caseSensitive}
            onChange={(e) => setCaseSensitive(e.target.checked)}
            className="rounded-sm border-neutral-300 text-apple-blue focus:ring-apple-blue/30"
          />
          <span>Case Sensitive</span>
        </label>
      </div>

      {tab === "single" ? (
        /* SINGLE LIST TOOLS */
        <div className="space-y-4">
          {/* Action Toolbar */}
          <div className="p-4 bg-white dark:bg-[#18181b] rounded-2xl border border-black/[0.08] dark:border-white/[0.08] shadow-xs space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mr-1">
                Sort:
              </span>
              <button
                type="button"
                onClick={() => handleSort("asc")}
                className="px-2.5 py-1.5 text-xs font-medium rounded-lg bg-neutral-100 hover:bg-neutral-200 dark:bg-[#27272a] dark:hover:bg-[#3f3f46] text-neutral-800 dark:text-neutral-200 transition-colors"
              >
                A → Z
              </button>
              <button
                type="button"
                onClick={() => handleSort("desc")}
                className="px-2.5 py-1.5 text-xs font-medium rounded-lg bg-neutral-100 hover:bg-neutral-200 dark:bg-[#27272a] dark:hover:bg-[#3f3f46] text-neutral-800 dark:text-neutral-200 transition-colors"
              >
                Z → A
              </button>
              <button
                type="button"
                onClick={() => handleSort("natural")}
                className="px-2.5 py-1.5 text-xs font-medium rounded-lg bg-neutral-100 hover:bg-neutral-200 dark:bg-[#27272a] dark:hover:bg-[#3f3f46] text-neutral-800 dark:text-neutral-200 transition-colors"
              >
                Natural (1, 2, 10)
              </button>
              <button
                type="button"
                onClick={() => handleSort("length")}
                className="px-2.5 py-1.5 text-xs font-medium rounded-lg bg-neutral-100 hover:bg-neutral-200 dark:bg-[#27272a] dark:hover:bg-[#3f3f46] text-neutral-800 dark:text-neutral-200 transition-colors"
              >
                By Length
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-black/[0.04] dark:border-white/[0.04]">
              <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mr-1">
                Transform:
              </span>
              <button
                type="button"
                onClick={handleShuffle}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 dark:bg-purple-950/40 dark:text-purple-300 transition-colors"
              >
                <Shuffle className="w-3.5 h-3.5" />
                Shuffle Randomly
              </button>
              <button
                type="button"
                onClick={handleDeduplicate}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300 transition-colors"
              >
                <Filter className="w-3.5 h-3.5" />
                Remove Duplicates
              </button>
              <button
                type="button"
                onClick={handleReverse}
                className="px-2.5 py-1.5 text-xs font-medium rounded-lg bg-neutral-100 hover:bg-neutral-200 dark:bg-[#27272a] dark:hover:bg-[#3f3f46] text-neutral-800 dark:text-neutral-200 transition-colors"
              >
                Reverse Order
              </button>
              <button
                type="button"
                onClick={handleAddNumbering}
                className="px-2.5 py-1.5 text-xs font-medium rounded-lg bg-neutral-100 hover:bg-neutral-200 dark:bg-[#27272a] dark:hover:bg-[#3f3f46] text-neutral-800 dark:text-neutral-200 transition-colors"
              >
                Prepend 1, 2, 3...
              </button>
              <button
                type="button"
                onClick={handleCleanLines}
                className="px-2.5 py-1.5 text-xs font-medium rounded-lg bg-neutral-100 hover:bg-neutral-200 dark:bg-[#27272a] dark:hover:bg-[#3f3f46] text-neutral-800 dark:text-neutral-200 transition-colors"
              >
                Trim & Clean
              </button>
            </div>

            {/* Prefix & Suffix & Chunk Row */}
            <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-black/[0.04] dark:border-white/[0.04]">
              <div className="flex items-center gap-1.5 text-xs text-neutral-600 dark:text-neutral-300">
                <span>Prefix:</span>
                <input
                  type="text"
                  value={prefix}
                  onChange={(e) => setPrefix(e.target.value)}
                  placeholder="e.g. -"
                  className="w-20 px-2 py-1 text-xs font-mono bg-neutral-100 dark:bg-[#27272a] border border-black/[0.06] dark:border-white/[0.06] rounded-lg"
                />
              </div>
              <div className="flex items-center gap-1.5 text-xs text-neutral-600 dark:text-neutral-300">
                <span>Suffix:</span>
                <input
                  type="text"
                  value={suffix}
                  onChange={(e) => setSuffix(e.target.value)}
                  placeholder="e.g. ,"
                  className="w-20 px-2 py-1 text-xs font-mono bg-neutral-100 dark:bg-[#27272a] border border-black/[0.06] dark:border-white/[0.06] rounded-lg"
                />
              </div>
              <button
                type="button"
                onClick={handleApplyWrap}
                className="px-2.5 py-1 text-xs font-medium bg-neutral-100 hover:bg-neutral-200 dark:bg-[#27272a] text-neutral-800 dark:text-neutral-200 rounded-lg transition-colors"
              >
                Apply Wrap
              </button>

              <div className="flex items-center gap-1.5 text-xs text-neutral-600 dark:text-neutral-300 ml-auto">
                <span>Batch Size:</span>
                <input
                  type="number"
                  min="1"
                  max="1000"
                  value={chunkSize}
                  onChange={(e) => setChunkSize(e.target.value)}
                  className="w-16 px-2 py-1 text-xs font-mono bg-neutral-100 dark:bg-[#27272a] border border-black/[0.06] dark:border-white/[0.06] rounded-lg text-center"
                />
                <button
                  type="button"
                  onClick={handleChunk}
                  className="px-2.5 py-1 text-xs font-medium bg-neutral-100 hover:bg-neutral-200 dark:bg-[#27272a] text-neutral-800 dark:text-neutral-200 rounded-lg transition-colors"
                >
                  Group List
                </button>
              </div>
            </div>
          </div>

          {/* Editor Card */}
          <div className="rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#18181b] overflow-hidden shadow-xs">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-black/[0.06] dark:border-white/[0.06] bg-neutral-50/60 dark:bg-black/20">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                  List Items (1 item per line)
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 font-mono font-medium">
                  {nonBlankSingle.length} items
                </span>
                <span className="text-[11px] text-neutral-400 font-mono">
                  {singleInput.length.toLocaleString()} characters
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSingleInput(SAMPLE_LIST)}
                  className="text-xs text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200"
                >
                  Reset Sample
                </button>
                <button
                  type="button"
                  onClick={() => setSingleInput("")}
                  className="text-xs text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={() => handleCopy(singleInput)}
                  className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-[#27272a] rounded-lg transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-emerald-600 dark:text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => handleDownload(singleInput, "items.txt")}
                  className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-apple-blue hover:bg-apple-blue/90 text-white rounded-lg transition-colors shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Save TXT</span>
                </button>
              </div>
            </div>

            <div className="p-3">
              <textarea
                id={singleInputId}
                value={singleInput}
                onChange={(e) => setSingleInput(e.target.value)}
                placeholder="Enter list items here, one per line..."
                className="w-full h-80 sm:h-96 p-3 font-mono text-xs md:text-sm bg-neutral-50/50 dark:bg-black/30 border border-black/[0.06] dark:border-white/[0.06] rounded-xl resize-none focus:outline-hidden focus:ring-2 focus:ring-apple-blue/30 text-neutral-900 dark:text-neutral-100"
                spellCheck="false"
              />
            </div>
          </div>
        </div>
      ) : (
        /* TWO LISTS / SET OPERATIONS */
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* List A */}
            <div className="flex flex-col rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#18181b] overflow-hidden shadow-xs">
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-black/[0.06] dark:border-white/[0.06] bg-neutral-50/60 dark:bg-black/20">
                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                  List A ({itemsA.length} items)
                </span>
                <button
                  type="button"
                  onClick={() => setListA("")}
                  className="text-xs text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
                >
                  Clear
                </button>
              </div>
              <div className="p-3 grow flex flex-col">
                <textarea
                  id={listAId}
                  value={listA}
                  onChange={(e) => setListA(e.target.value)}
                  placeholder="Paste List A items here..."
                  className="w-full h-64 p-3 font-mono text-xs bg-neutral-50/50 dark:bg-black/30 border border-black/[0.06] dark:border-white/[0.06] rounded-xl resize-none focus:outline-hidden focus:ring-2 focus:ring-apple-blue/30 text-neutral-900 dark:text-neutral-100"
                  spellCheck="false"
                />
              </div>
            </div>

            {/* List B */}
            <div className="flex flex-col rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#18181b] overflow-hidden shadow-xs">
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-black/[0.06] dark:border-white/[0.06] bg-neutral-50/60 dark:bg-black/20">
                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                  List B ({itemsB.length} items)
                </span>
                <button
                  type="button"
                  onClick={() => setListB("")}
                  className="text-xs text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
                >
                  Clear
                </button>
              </div>
              <div className="p-3 grow flex flex-col">
                <textarea
                  id={listBId}
                  value={listB}
                  onChange={(e) => setListB(e.target.value)}
                  placeholder="Paste List B items here..."
                  className="w-full h-64 p-3 font-mono text-xs bg-neutral-50/50 dark:bg-black/30 border border-black/[0.06] dark:border-white/[0.06] rounded-xl resize-none focus:outline-hidden focus:ring-2 focus:ring-apple-blue/30 text-neutral-900 dark:text-neutral-100"
                  spellCheck="false"
                />
              </div>
            </div>
          </div>

          {/* Operation Selector Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-2 p-3 bg-white dark:bg-[#18181b] rounded-2xl border border-black/[0.08] dark:border-white/[0.08] shadow-xs">
            <button
              type="button"
              onClick={() => setSetOp("intersection")}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                setOp === "intersection"
                  ? "bg-apple-blue text-white shadow-xs font-semibold"
                  : "bg-neutral-100 dark:bg-[#27272a] text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200"
              }`}
            >
              Intersection (A ∩ B) — In Both Lists
            </button>
            <button
              type="button"
              onClick={() => setSetOp("diffA")}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                setOp === "diffA"
                  ? "bg-apple-blue text-white shadow-xs font-semibold"
                  : "bg-neutral-100 dark:bg-[#27272a] text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200"
              }`}
            >
              Difference (A \ B) — Only in List A
            </button>
            <button
              type="button"
              onClick={() => setSetOp("diffB")}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                setOp === "diffB"
                  ? "bg-apple-blue text-white shadow-xs font-semibold"
                  : "bg-neutral-100 dark:bg-[#27272a] text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200"
              }`}
            >
              Difference (B \ A) — Only in List B
            </button>
            <button
              type="button"
              onClick={() => setSetOp("union")}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                setOp === "union"
                  ? "bg-apple-blue text-white shadow-xs font-semibold"
                  : "bg-neutral-100 dark:bg-[#27272a] text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200"
              }`}
            >
              Union (A ∪ B) — Combined Unique
            </button>
          </div>

          {/* Set Operation Results Panel */}
          <div className="rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#18181b] overflow-hidden shadow-xs">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-black/[0.06] dark:border-white/[0.06] bg-neutral-50/60 dark:bg-black/20">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                  Operation Result
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 font-mono font-medium">
                  {setResult.length} matching items
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleCopy(setResult.join("\n"))}
                  disabled={!setResult.length}
                  className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-[#27272a] rounded-lg disabled:opacity-40 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-emerald-600 dark:text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => handleDownload(setResult.join("\n"), `${setOp}-result.txt`)}
                  disabled={!setResult.length}
                  className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-apple-blue hover:bg-apple-blue/90 text-white rounded-lg disabled:opacity-40 transition-colors shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Result</span>
                </button>
              </div>
            </div>

            <div className="p-3">
              <textarea
                readOnly
                value={setResult.join("\n")}
                placeholder="Results will appear here..."
                className="w-full h-64 p-3 font-mono text-xs md:text-sm bg-neutral-50/50 dark:bg-black/30 border border-black/[0.06] dark:border-white/[0.06] rounded-xl resize-none focus:outline-hidden text-neutral-900 dark:text-neutral-100"
                spellCheck="false"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
