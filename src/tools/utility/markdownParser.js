/**
 * Client-Side GitHub-Flavored Markdown (GFM) Parser & Compiler.
 * Converts markdown text into sanitized, styled HTML with table, code block, and task list support.
 * 100% pure JavaScript with zero external dependencies.
 */

/**
 * Escapes raw HTML to prevent XSS injection.
 * @param {string} str
 * @returns {string}
 */
export function escapeHtml(str = "") {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Converts inline markdown spans (bold, italic, code, links, images).
 * @param {string} text
 * @returns {string}
 */
export function parseInlineMarkdown(text = "") {
  let s = text;

  // Inline code: `code`
  s = s.replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-pink-600 dark:text-pink-400 font-mono text-xs">$1</code>');

  // Images: ![alt](url)
  s = s.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="rounded-xl max-w-full my-3" />');

  // Links: [text](url)
  s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 dark:text-blue-400 underline hover:opacity-80">$1</a>');

  // Bold & Italic: ***text***
  s = s.replace(/\*\*\*([^*]+)\*\*\*/g, "<strong><em>$1</em></strong>");

  // Bold: **text** or __text__
  s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  s = s.replace(/__([^_]+)__/g, "<strong>$1</strong>");

  // Italic: *text* or _text_
  s = s.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  s = s.replace(/_([^_]+)_/g, "<em>$1</em>");

  // Strikethrough: ~~text~~
  s = s.replace(/~~([^~]+)~~/g, "<del>$1</del>");

  return s;
}

/**
 * Converts markdown tables (| Col 1 | Col 2 |) into responsive HTML table.
 * @param {string[]} lines
 * @returns {string}
 */
export function parseMarkdownTable(lines) {
  if (lines.length < 2) return "";
  const parseRow = (line) =>
    line
      .trim()
      .replace(/^\||\|$/g, "")
      .split("|")
      .map((c) => c.trim());

  const headers = parseRow(lines[0]);
  const dataRows = lines.slice(2).map(parseRow);

  let html = '<div class="overflow-x-auto my-4"><table class="min-w-full divide-y divide-gray-200 dark:divide-gray-800 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden text-xs">';
  html += '<thead class="bg-gray-50 dark:bg-gray-850"><tr>';
  for (const h of headers) {
    html += `<th class="px-4 py-2 text-left font-semibold text-gray-900 dark:text-white">${parseInlineMarkdown(h)}</th>`;
  }
  html += "</tr></thead>";

  html += '<tbody class="divide-y divide-gray-100 dark:divide-gray-800 bg-white dark:bg-gray-900">';
  for (const row of dataRows) {
    html += '<tr class="hover:bg-gray-50/50 dark:hover:bg-gray-800/50">';
    for (let i = 0; i < headers.length; i++) {
      const cell = row[i] || "";
      html += `<td class="px-4 py-2 text-gray-700 dark:text-gray-300">${parseInlineMarkdown(cell)}</td>`;
    }
    html += "</tr>";
  }
  html += "</tbody></table></div>";
  return html;
}

/**
 * Main Markdown to HTML Compiler.
 *
 * @param {string} md - Raw markdown text
 * @returns {string} Compiled HTML
 */
export function compileMarkdownToHtml(md = "") {
  if (!md) return "";

  const lines = md.replace(/\r\n/g, "\n").split("\n");
  const output = [];
  let inCodeBlock = false;
  let codeBlockLang = "";
  let codeBlockContent = [];
  let tableBuffer = [];
  let listType = null; // 'ul' | 'ol'

  const flushList = () => {
    if (listType) {
      output.push(`</${listType}>`);
      listType = null;
    }
  };

  const flushTable = () => {
    if (tableBuffer.length >= 2) {
      output.push(parseMarkdownTable(tableBuffer));
      tableBuffer = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Fenced Code Blocks (```language)
    if (line.trim().startsWith("```")) {
      flushList();
      flushTable();
      if (!inCodeBlock) {
        inCodeBlock = true;
        codeBlockLang = line.trim().replace(/^```/, "").trim();
        codeBlockContent = [];
      } else {
        inCodeBlock = false;
        const codeEscaped = escapeHtml(codeBlockContent.join("\n"));
        output.push(
          `<div class="my-4 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-gray-950"><div class="px-4 py-1.5 bg-gray-900 text-[11px] font-mono text-gray-400 border-b border-gray-800">${escapeHtml(codeBlockLang || "code")}</div><pre class="p-4 text-xs font-mono text-gray-200 overflow-x-auto"><code>${codeEscaped}</code></pre></div>`
        );
      }
      continue;
    }

    if (inCodeBlock) {
      codeBlockContent.push(line);
      continue;
    }

    // Markdown Table rows (| col | col |)
    if (line.trim().startsWith("|") && line.trim().endsWith("|")) {
      flushList();
      tableBuffer.push(line);
      continue;
    } else if (tableBuffer.length > 0) {
      flushTable();
    }

    // Blank lines
    if (!line.trim()) {
      flushList();
      continue;
    }

    // Headings (# H1 to ###### H6)
    const headerMatch = line.match(/^(#{1,6})\s+(.*)$/);
    if (headerMatch) {
      flushList();
      const level = headerMatch[1].length;
      const text = parseInlineMarkdown(headerMatch[2]);
      const slug = headerMatch[2]
        .toLowerCase()
        .replace(/<[^>]*>/g, "")
        .replace(/[^a-z0-9\s-_]/g, "")
        .trim()
        .replace(/[\s_]+/g, "-")
        .replace(/-+/g, "-");
      const classes = {
        1: "text-2xl font-bold tracking-tight text-gray-900 dark:text-white mt-6 mb-3",
        2: "text-xl font-bold tracking-tight text-gray-900 dark:text-white mt-5 mb-2.5",
        3: "text-lg font-semibold text-gray-900 dark:text-white mt-4 mb-2",
        4: "text-base font-semibold text-gray-900 dark:text-white mt-3 mb-1.5",
        5: "text-sm font-semibold text-gray-900 dark:text-white mt-2 mb-1",
        6: "text-xs font-semibold text-gray-900 dark:text-white mt-2 mb-1",
      }[level];
      const anchor = level <= 3 && slug
        ? ` <a href="#${slug}" class="heading-anchor text-gray-400 hover:text-blue-600 no-underline text-sm opacity-0 group-hover:opacity-100 transition-opacity ml-1.5" aria-label="Direct link to ${slug}">#</a>`
        : "";
      output.push(`<h${level} id="${slug}" class="group ${classes}">${text}${anchor}</h${level}>`);
      continue;
    }

    // Blockquotes (> text)
    if (line.startsWith(">")) {
      flushList();
      const text = parseInlineMarkdown(line.replace(/^>\s*/, ""));
      output.push(
        `<blockquote class="border-l-4 border-blue-600 dark:border-blue-500 pl-4 py-1 my-3 text-sm italic text-gray-700 dark:text-gray-300 bg-blue-50/30 dark:bg-blue-900/10 rounded-r-lg">${text}</blockquote>`
      );
      continue;
    }

    // Horizontal Rule (--- or ***)
    if (/^(\*{3,}|-{3,}|_{3,})$/.test(line.trim())) {
      flushList();
      output.push('<hr class="my-6 border-gray-200 dark:border-gray-800" />');
      continue;
    }

    // Task Lists (- [ ] or - [x])
    const taskMatch = line.match(/^[-*]\s+\[([ xX])\]\s+(.*)$/);
    if (taskMatch) {
      flushList();
      const isChecked = taskMatch[1].toLowerCase() === "x";
      const text = parseInlineMarkdown(taskMatch[2]);
      output.push(
        `<div class="flex items-center gap-2 my-1 text-xs text-gray-800 dark:text-gray-200"><input type="checkbox" ${isChecked ? "checked " : ""}disabled class="rounded text-blue-600 focus:ring-0" /><span>${text}</span></div>`
      );
      continue;
    }

    // Unordered Lists (- or *)
    const ulMatch = line.match(/^[-*]\s+(.*)$/);
    if (ulMatch) {
      if (listType !== "ul") {
        flushList();
        output.push('<ul class="list-disc pl-5 my-2 space-y-1 text-xs text-gray-800 dark:text-gray-200">');
        listType = "ul";
      }
      output.push(`<li>${parseInlineMarkdown(ulMatch[1])}</li>`);
      continue;
    }

    // Ordered Lists (1. 2.)
    const olMatch = line.match(/^\d+\.\s+(.*)$/);
    if (olMatch) {
      if (listType !== "ol") {
        flushList();
        output.push('<ol class="list-decimal pl-5 my-2 space-y-1 text-xs text-gray-800 dark:text-gray-200">');
        listType = "ol";
      }
      output.push(`<li>${parseInlineMarkdown(olMatch[1])}</li>`);
      continue;
    }

    // Paragraph
    flushList();
    output.push(`<p class="my-2 text-xs leading-relaxed text-gray-800 dark:text-gray-200">${parseInlineMarkdown(line)}</p>`);
  }

  flushList();
  flushTable();

  return output.join("\n");
}

/**
 * Calculates word, character, and reading time statistics for markdown text.
 * @param {string} md
 * @returns {{ words: number, chars: number, readingTimeMins: number }}
 */
export function getMarkdownStats(md = "") {
  const clean = md.replace(/[#*`_~>[\]()|-]/g, "").trim();
  const words = clean ? clean.split(/\s+/).filter(Boolean).length : 0;
  const chars = md.length;
  const readingTimeMins = Math.max(1, Math.ceil(words / 200));

  return { words, chars, readingTimeMins };
}

export const parseMarkdown = compileMarkdownToHtml;
