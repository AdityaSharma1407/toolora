import test, { describe } from "node:test";
import assert from "node:assert/strict";
import fs from "fs";

import {
  parseMarkdown,
  parseInlineMarkdown,
  escapeHtml,
  getMarkdownStats,
} from "../src/tools/utility/markdownParser.js";

import {
  executeRegex,
  COMMON_REGEX_PATTERNS,
} from "../src/tools/utility/regexEngine.js";

import {
  parseCron,
  explainCron,
  getNextExecutions,
  CRON_PRESETS,
} from "../src/tools/utility/cronParser.js";

import {
  parseCurl,
  generateFetchCode,
  generateAxiosCode,
  generatePythonCode,
  generateNodeHttpCode,
  generatePhpCode,
  generateGoCode,
} from "../src/tools/utility/curlParser.js";

import {
  processCode,
  minifyJson,
  beautifyJson,
  minifyCss,
  beautifyCss,
  minifyHtml,
  beautifyHtml,
  minifyJs,
  beautifyJs,
  calculateSavings,
} from "../src/tools/utility/codeMinifier.js";

import {
  getAvailableTools,
  getToolById,
  getToolsByCategory,
} from "../src/data/toolsRegistry.js";

describe("1. Markdown Live Preview & Parser Engine", () => {
  test("escapes HTML to prevent XSS injection", () => {
    const raw = `<script>alert('xss')</script> & "hello"`;
    const escaped = escapeHtml(raw);
    assert.ok(!escaped.includes("<script>"));
    assert.ok(escaped.includes("&lt;script&gt;"));
    assert.ok(escaped.includes("&amp;"));
    assert.ok(escaped.includes("&quot;hello&quot;"));
  });

  test("parses inline markdown (bold, italic, code, link, strike)", () => {
    const inline = "**bold** *italic* `code` ~~strike~~ [link](https://example.com)";
    const res = parseInlineMarkdown(inline);
    assert.ok(res.includes("<strong>bold</strong>"));
    assert.ok(res.includes("<em>italic</em>"));
    assert.ok(res.includes("<code"));
    assert.ok(res.includes("<del>strike</del>"));
    assert.ok(res.includes('<a href="https://example.com"'));
  });

  test("parses block elements (headings, blockquotes, lists, code fences)", () => {
    const md = `# Title 1
## Title 2
> A wise quote

\`\`\`javascript
const x = 42;
\`\`\`

- Item A
- Item B
`;
    const html = parseMarkdown(md);
    assert.ok(html.includes("<h1"));
    assert.ok(html.includes("Title 1"));
    assert.ok(html.includes("<h2"));
    assert.ok(html.includes("<blockquote"));
    assert.ok(html.includes("<code>const x = 42;</code>"));
    assert.ok(html.includes("const x = 42;"));
    assert.ok(html.includes("<ul"));
    assert.ok(html.includes("<li>Item A</li>"));
  });

  test("parses GFM tables and task lists", () => {
    const tableMd = `| Col 1 | Col 2 |
| :--- | :--- |
| Val 1 | Val 2 |

- [x] Task done
- [ ] Task pending
`;
    const html = parseMarkdown(tableMd);
    assert.ok(html.includes("<table"));
    assert.ok(html.includes("Col 1</th>"));
    assert.ok(html.includes("Val 1</td>"));
    assert.ok(html.includes('type="checkbox" checked disabled'));
    assert.ok(html.includes('type="checkbox" disabled'));
  });

  test("calculates markdown stats (words, characters, read time)", () => {
    const sample = "Hello world this is a test of markdown statistics.";
    const stats = getMarkdownStats(sample);
    assert.equal(stats.words, 9);
    assert.equal(stats.chars, sample.length);
    assert.equal(stats.readingTimeMins, 1);
  });
});

describe("2. Regular Expression Tester Engine", () => {
  test("executes valid regex with match details and flags", () => {
    const text = "Contact john@example.com or jane@company.org";
    const pattern = "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}";
    const res = executeRegex(pattern, "g", text);

    assert.equal(res.valid, true);
    assert.equal(res.matches.length, 2);
    assert.equal(res.matches[0].text, "john@example.com");
    assert.equal(res.matches[1].text, "jane@company.org");
    assert.ok(res.highlightedHtml.includes("<mark"));
  });

  test("handles capture groups correctly", () => {
    const text = "2026-10-28";
    const pattern = "(\\d{4})-(\\d{2})-(\\d{2})";
    const res = executeRegex(pattern, "g", text);

    assert.equal(res.valid, true);
    assert.equal(res.matches.length, 1);
    assert.equal(res.matches[0].groups.length, 3);
    assert.equal(res.matches[0].groups[0].text, "2026");
    assert.equal(res.matches[0].groups[1].text, "10");
    assert.equal(res.matches[0].groups[2].text, "28");
  });

  test("reports regex syntax errors gracefully", () => {
    const res = executeRegex("(unmatched[", "g", "test");
    assert.equal(res.valid, false);
    assert.ok(res.error);
    assert.equal(res.matches.length, 0);
  });

  test("includes preset regex patterns", () => {
    assert.ok(COMMON_REGEX_PATTERNS.length >= 6);
    assert.ok(COMMON_REGEX_PATTERNS.some((p) => p.name.includes("Email")));
    assert.ok(COMMON_REGEX_PATTERNS.some((p) => p.name.includes("URL")));
    assert.ok(COMMON_REGEX_PATTERNS.some((p) => p.name.includes("UUID")));
  });
});

describe("3. Cron Expression Parser & Next Executions Engine", () => {
  test("validates valid 5-part cron syntax", () => {
    assert.equal(parseCron("* * * * *").valid, true);
    assert.equal(parseCron("0 9 * * 1-5").valid, true);
    assert.equal(parseCron("*/15 * * * *").valid, true);
    assert.equal(parseCron("0 0 1 1 *").valid, true);
  });

  test("detects invalid cron expressions", () => {
    assert.equal(parseCron("* * *").valid, false);
    assert.equal(parseCron("99 * * * *").valid, false); // minute 99 invalid
    assert.equal(parseCron("* 25 * * *").valid, false); // hour 25 invalid
    assert.equal(parseCron("* * 32 * *").valid, false); // dom 32 invalid
  });

  test("explains cron expressions in plain English", () => {
    const exp1 = explainCron("0 9 * * 1-5");
    assert.ok(exp1.includes("09:00"));
    assert.ok(exp1.includes("weekdays") || exp1.includes("Monday"));

    const exp2 = explainCron("*/15 * * * *");
    assert.ok(exp2.includes("15 minutes"));
  });

  test("calculates next 5 scheduled executions", () => {
    const start = new Date("2026-10-28T08:00:00Z");
    const runs = getNextExecutions("0 9 * * *", 5, start);

    assert.equal(runs.length, 5);
    assert.equal(runs[0].getHours(), 9);
    assert.equal(runs[0].getMinutes(), 0);
  });

  test("contains common cron presets", () => {
    assert.ok(CRON_PRESETS.length >= 10);
    assert.ok(CRON_PRESETS.some((p) => p.cron === "* * * * *"));
    assert.ok(CRON_PRESETS.some((p) => p.cron === "0 0 * * *"));
  });
});

describe("4. cURL to Code Converter Engine", () => {
  test("parses standard cURL POST command with JSON body and headers", () => {
    const cmd = `curl -X POST https://api.example.com/v1/users \\
      -H "Content-Type: application/json" \\
      -H "Authorization: Bearer secret_token" \\
      -d '{"name":"Alex","role":"admin"}'`;

    const parsed = parseCurl(cmd);
    assert.equal(parsed.method, "POST");
    assert.equal(parsed.url, "https://api.example.com/v1/users");
    assert.equal(parsed.headers["Content-Type"], "application/json");
    assert.equal(parsed.headers["Authorization"], "Bearer secret_token");
    assert.ok(parsed.data.includes("Alex"));
  });

  test("generates Fetch code snippet", () => {
    const parsed = {
      method: "POST",
      url: "https://api.example.com/data",
      headers: { "Content-Type": "application/json" },
      data: '{"query":"test"}',
    };
    const code = generateFetchCode(parsed);
    assert.ok(code.includes('await fetch("https://api.example.com/data"'));
    assert.ok(code.includes('"method": "POST"'));
  });

  test("generates Axios, Python, Node, PHP, and Go snippets", () => {
    const parsed = {
      method: "GET",
      url: "https://api.example.com/items",
      headers: { Accept: "application/json" },
      data: null,
    };

    const axiosCode = generateAxiosCode(parsed);
    assert.ok(axiosCode.includes("axios("));

    const pythonCode = generatePythonCode(parsed);
    assert.ok(pythonCode.includes("import requests"));
    assert.ok(pythonCode.includes("requests.get("));

    const nodeCode = generateNodeHttpCode(parsed);
    assert.ok(nodeCode.includes("https.request("));

    const phpCode = generatePhpCode(parsed);
    assert.ok(phpCode.includes("curl_init("));

    const goCode = generateGoCode(parsed);
    assert.ok(goCode.includes("http.NewRequest"));
  });
});

describe("5. Code Minifier & Beautifier Engine", () => {
  test("minifies and beautifies JSON", () => {
    const jsonStr = '{\n  "a": 1,\n  "b": 2\n}';
    const min = minifyJson(jsonStr);
    assert.equal(min, '{"a":1,"b":2}');

    const beau = beautifyJson(min);
    assert.ok(beau.includes('\n  "a": 1'));
  });

  test("minifies and beautifies CSS", () => {
    const css = `/* Comment */
body {
  color: #ff0000;
  margin: 0;
}`;
    const min = minifyCss(css);
    assert.ok(!min.includes("/* Comment */"));
    assert.ok(min.includes("body{color:#ff0000;margin:0}"));

    const beau = beautifyCss(min);
    assert.ok(beau.includes("body {"));
    assert.ok(beau.includes("color: #ff0000;"));
  });

  test("minifies and beautifies HTML", () => {
    const html = `<div>
  <!-- Comment -->
  <p>Hello World</p>
</div>`;
    const min = minifyHtml(html);
    assert.ok(!min.includes("<!-- Comment -->"));
    assert.ok(min.includes("<div><p>Hello World</p></div>"));

    const beau = beautifyHtml(min);
    assert.ok(beau.includes("<div>\n  <p>\n    Hello World\n  </p>\n</div>"));
  });

  test("minifies JavaScript and removes comments", () => {
    const js = `// Single comment
function sum(a, b) {
  /* Multi comment */
  return a + b;
}`;
    const min = minifyJs(js);
    assert.ok(!min.includes("// Single comment"));
    assert.ok(!min.includes("/* Multi comment */"));
    assert.ok(min.includes("return a+b;"));
  });

  test("master processCode computes byte savings", () => {
    const code = '{\n  "status": "ok",\n  "count": 10\n}';
    const res = processCode(code, "json", "minify");
    assert.equal(res.success, true);
    assert.ok(res.metrics.savingsBytes > 0);
    assert.ok(res.metrics.savingsPercent > 0);
  });
});

describe("6. Registry & Route Files Verification for Path 3", () => {
  test("All 5 Path 3 tools are registered and available in toolsRegistry", () => {
    const devToolIds = [
      "markdown-editor",
      "regex-tester",
      "cron-generator",
      "curl-converter",
      "code-minifier",
    ];

    const available = getAvailableTools();
    assert.equal(available.length, 55);

    for (const id of devToolIds) {
      const tool = getToolById(id);
      assert.ok(tool, `Tool ${id} must exist in registry`);
      assert.equal(tool.status, "available", `Tool ${id} must have status available`);
      assert.equal(tool.category, "utility", `Tool ${id} must belong to utility category`);
      assert.equal(tool.route, `/${id}`, `Tool ${id} must route to /${id}`);
    }
  });

  test("All 5 route pages exist with valid metadata and schemas", () => {
    const pages = [
      { name: "Markdown Editor", file: "src/app/markdown-editor/page.jsx", route: "/markdown-editor" },
      { name: "Regex Tester", file: "src/app/regex-tester/page.jsx", route: "/regex-tester" },
      { name: "Cron Generator", file: "src/app/cron-generator/page.jsx", route: "/cron-generator" },
      { name: "cURL Converter", file: "src/app/curl-converter/page.jsx", route: "/curl-converter" },
      { name: "Code Minifier", file: "src/app/code-minifier/page.jsx", route: "/code-minifier" },
    ];

    for (const p of pages) {
      assert.ok(fs.existsSync(p.file), `Page ${p.file} must exist on disk`);
      const content = fs.readFileSync(p.file, "utf8");
      assert.ok(content.includes("export const metadata"), `${p.name} must export metadata`);
      assert.ok(content.includes(`canonical: "${p.route}"`), `${p.name} must specify canonical url ${p.route}`);
      assert.ok(content.includes('"@type": "WebApplication"'), `${p.name} must include WebApplication schema`);
      assert.ok(content.includes("HowItWorks"), `${p.name} must render HowItWorks`);
      assert.ok(content.includes("FAQSection"), `${p.name} must render FAQSection`);
      assert.ok(content.includes("RelatedTools"), `${p.name} must render RelatedTools`);
    }
  });
});

describe("7. Quick Search & Command Palette Verification", () => {
  test("searchTools returns matching tools for developer queries", async () => {
    const { searchTools } = await import("../src/data/toolsRegistry.js");

    const mdMatches = searchTools("markdown");
    assert.ok(mdMatches.some((t) => t.id === "markdown-editor"));

    const regexMatches = searchTools("regex");
    assert.ok(regexMatches.some((t) => t.id === "regex-tester"));

    const cronMatches = searchTools("cron");
    assert.ok(cronMatches.some((t) => t.id === "cron-generator"));

    const curlMatches = searchTools("curl");
    assert.ok(curlMatches.some((t) => t.id === "curl-converter"));

    const minifyMatches = searchTools("minify");
    assert.ok(minifyMatches.some((t) => t.id === "code-minifier"));
  });

  test("Header and ToolSearch include keyboard hotkeys and arrow navigation", () => {
    const headerCode = fs.readFileSync("src/components/common/Header.jsx", "utf8");
    assert.ok(headerCode.includes("handleGlobalKeyDown"), "Header must include global hotkey handler");
    assert.ok(headerCode.includes("Ctrl"), "Header must display Ctrl/Cmd key badge");

    const searchCode = fs.readFileSync("src/components/common/ToolSearch.jsx", "utf8");
    assert.ok(searchCode.includes("ArrowDown"), "ToolSearch must support ArrowDown navigation");
    assert.ok(searchCode.includes("ArrowUp"), "ToolSearch must support ArrowUp navigation");
    assert.ok(searchCode.includes("Enter"), "ToolSearch must support Enter to execute tool");
  });
});
