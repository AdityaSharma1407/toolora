"use client";

import React, { useState, useId, useMemo } from "react";
import { parseMarkdown, getMarkdownStats } from "@/tools/utility/markdownParser.js";
import {
  FileText,
  Eye,
  Columns,
  Copy,
  Check,
  RotateCcw,
  Download,
  Bold,
  Italic,
  Strikethrough,
  Code,
  Heading,
  List,
  ListOrdered,
  Quote,
  Table as TableIcon,
  CheckSquare,
} from "lucide-react";

const SAMPLE_MARKDOWN = `# Welcome to Toolora Markdown Editor 🚀

Toolora's Markdown Editor gives you **real-time live preview**, rich formatting tools, and instant export options.

## Key Features

- **100% Client-Side:** Everything renders privately in your browser memory.
- **GFM Compliant:** Full support for tables, task lists, and inline code.
- **Export Options:** Download as clean \`.md\` or formatted standalone \`.html\`.

### Task Checklist
- [x] Fast in-browser rendering
- [x] Zero server tracking
- [ ] Try creating your own document

### Performance Benchmark Table
| Metric | Toolora | Traditional Web Tools |
| :--- | :--- | :--- |
| Latency | < 5ms | > 800ms |
| Server Uploads | Zero | Yes |
| Privacy | 100% Client-Side | Remote Logs |

> "The cleanest, most intuitive markdown editor built for modern developers."

\`\`\`javascript
// Quick Code Example
function greet(user) {
  return \`Hello, \${user}! Happy writing.\`;
}
\`\`\`
`;

export default function MarkdownEditorWorkspace() {
  const [markdown, setMarkdown] = useState(SAMPLE_MARKDOWN);
  const [activeTab, setActiveTab] = useState("split"); // "split" | "edit" | "preview"
  const [copiedType, setCopiedType] = useState(null);
  const [message, setMessage] = useState(null);
  const textareaId = useId();

  const htmlPreview = useMemo(() => parseMarkdown(markdown), [markdown]);
  const stats = useMemo(() => getMarkdownStats(markdown), [markdown]);

  const insertFormatting = (prefix, suffix = "") => {
    const textarea = document.getElementById(textareaId);
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = markdown.substring(start, end);
    const replacement = prefix + (selected || "text") + suffix;

    const newMarkdown =
      markdown.substring(0, start) + replacement + markdown.substring(end);
    setMarkdown(newMarkdown);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + prefix.length,
        start + prefix.length + (selected ? selected.length : 4)
      );
    }, 10);
  };

  const handleCopy = (type) => {
    const text = type === "html" ? htmlPreview : markdown;
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setMessage({
      type: "success",
      text: type === "html" ? "HTML copied to clipboard!" : "Markdown copied to clipboard!",
    });
    setTimeout(() => {
      setCopiedType(null);
      setMessage(null);
    }, 2500);
  };

  const handleDownload = (format) => {
    const isHtml = format === "html";
    let content = markdown;
    let mime = "text/markdown";
    let ext = "md";

    if (isHtml) {
      content = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Markdown Document</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; line-height: 1.6; max-width: 800px; margin: 40px auto; padding: 0 20px; color: #1e293b; }
    pre { background: #0f172a; color: #e2e8f0; padding: 16px; border-radius: 8px; overflow-x: auto; }
    code { font-family: monospace; font-size: 0.9em; }
    table { width: 100%; border-collapse: collapse; margin: 16px 0; }
    th, td { border: 1px solid #cbd5e1; padding: 8px 12px; text-align: left; }
    th { background: #f1f5f9; }
    blockquote { border-left: 4px solid #3b82f6; margin: 16px 0; padding-left: 16px; color: #64748b; font-style: italic; }
  </style>
</head>
<body>
${htmlPreview}
</body>
</html>`;
      mime = "text/html";
      ext = "html";
    }

    const blob = new Blob([content], { type: `${mime};charset=utf-8` });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `document.${ext}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full space-y-6">
      {/* Toast Notification */}
      {message && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-medium flex items-center justify-between">
          <span>{message.text}</span>
          <button
            type="button"
            onClick={() => setMessage(null)}
            className="text-emerald-700 hover:text-emerald-900 font-bold ml-2"
          >
            ✕
          </button>
        </div>
      )}

      {/* Stats Header Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white rounded-2xl border border-black/[0.06] p-4 shadow-subtle text-center">
          <div className="text-xl sm:text-2xl font-bold text-slate-800">{stats.words}</div>
          <div className="text-xs text-slate-500 font-medium mt-0.5">Words</div>
        </div>
        <div className="bg-white rounded-2xl border border-black/[0.06] p-4 shadow-subtle text-center">
          <div className="text-xl sm:text-2xl font-bold text-slate-800">{stats.chars}</div>
          <div className="text-xs text-slate-500 font-medium mt-0.5">Characters</div>
        </div>
        <div className="bg-white rounded-2xl border border-black/[0.06] p-4 shadow-subtle text-center">
          <div className="text-xl sm:text-2xl font-bold text-slate-800">{stats.readingTimeMins} min</div>
          <div className="text-xs text-slate-500 font-medium mt-0.5">Read Time</div>
        </div>
        <div className="bg-white rounded-2xl border border-black/[0.06] p-4 shadow-subtle text-center">
          <div className="text-xl sm:text-2xl font-bold text-brand-600">GFM</div>
          <div className="text-xs text-slate-500 font-medium mt-0.5">Flavor</div>
        </div>
      </div>

      {/* Toolbar & View Mode Switcher */}
      <div className="bg-white rounded-2xl border border-black/[0.06] shadow-subtle p-3 flex flex-wrap items-center justify-between gap-3">
        {/* Formatting Quick Controls */}
        <div className="flex flex-wrap items-center gap-1">
          <button
            type="button"
            onClick={() => insertFormatting("**", "**")}
            className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title="Bold"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => insertFormatting("*", "*")}
            className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title="Italic"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => insertFormatting("~~", "~~")}
            className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title="Strikethrough"
          >
            <Strikethrough className="w-4 h-4" />
          </button>
          <div className="h-4 w-px bg-slate-200 mx-1" />
          <button
            type="button"
            onClick={() => insertFormatting("### ")}
            className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title="Heading"
          >
            <Heading className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => insertFormatting("`", "`")}
            className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title="Inline Code"
          >
            <Code className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => insertFormatting("> ")}
            className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title="Blockquote"
          >
            <Quote className="w-4 h-4" />
          </button>
          <div className="h-4 w-px bg-slate-200 mx-1" />
          <button
            type="button"
            onClick={() => insertFormatting("- ")}
            className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title="Bullet List"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => insertFormatting("1. ")}
            className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title="Numbered List"
          >
            <ListOrdered className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => insertFormatting("- [ ] ")}
            className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title="Task List"
          >
            <CheckSquare className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() =>
              insertFormatting(
                "\n| Header 1 | Header 2 |\n| :--- | :--- |\n| Row 1 | Data 1 |\n| Row 2 | Data 2 |\n"
              )
            }
            className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title="Insert Table"
          >
            <TableIcon className="w-4 h-4" />
          </button>
        </div>

        {/* View Layout Switcher */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveTab("split")}
            className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === "split"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            Split
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("edit")}
            className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === "edit"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Write
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("preview")}
            className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === "preview"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            Preview
          </button>
        </div>
      </div>

      {/* Editor & Preview Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Editor Pane */}
        {(activeTab === "split" || activeTab === "edit") && (
          <div
            className={`bg-white rounded-2xl border border-black/[0.06] shadow-subtle p-5 flex flex-col space-y-3 ${
              activeTab === "edit" ? "lg:col-span-2" : ""
            }`}
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-brand-600" />
                <span className="text-xs sm:text-sm font-semibold text-slate-800">
                  Markdown Source
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setMarkdown(SAMPLE_MARKDOWN)}
                  className="text-xs font-medium text-slate-600 hover:text-brand-600 px-2.5 py-1 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Load Sample
                </button>
                <button
                  type="button"
                  onClick={() => setMarkdown("")}
                  className="inline-flex items-center gap-1 text-xs font-medium text-slate-400 hover:text-rose-600 px-2.5 py-1 rounded-lg hover:bg-rose-50 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Clear
                </button>
              </div>
            </div>

            <textarea
              id={textareaId}
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              placeholder="Type or paste your Markdown here..."
              rows={20}
              spellCheck={false}
              className="w-full p-4 rounded-xl border border-black/[0.08] bg-slate-50/40 text-slate-900 font-mono text-xs sm:text-sm leading-relaxed placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all resize-y"
            />

            <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
              <span className="text-xs text-slate-500">
                Supports GitHub Flavored Markdown (GFM)
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleCopy("md")}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  {copiedType === "md" ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  {copiedType === "md" ? "Copied!" : "Copy .md"}
                </button>
                <button
                  type="button"
                  onClick={() => handleDownload("md")}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download .md
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Live Preview Pane */}
        {(activeTab === "split" || activeTab === "preview") && (
          <div
            className={`bg-white rounded-2xl border border-black/[0.06] shadow-subtle p-5 flex flex-col space-y-3 ${
              activeTab === "preview" ? "lg:col-span-2" : ""
            }`}
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-emerald-600" />
                <span className="text-xs sm:text-sm font-semibold text-slate-800">
                  Live HTML Preview
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                  Real-time
                </span>
              </div>
            </div>

            <div
              className="p-5 rounded-xl border border-black/[0.08] bg-white min-h-[460px] max-h-[600px] overflow-y-auto prose prose-slate max-w-none text-slate-900"
              dangerouslySetInnerHTML={{ __html: htmlPreview }}
            />

            <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
              <span className="text-xs text-slate-500">
                100% Client-Side Rendered
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleCopy("html")}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  {copiedType === "html" ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  {copiedType === "html" ? "Copied!" : "Copy HTML"}
                </button>
                <button
                  type="button"
                  onClick={() => handleDownload("html")}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download HTML
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
