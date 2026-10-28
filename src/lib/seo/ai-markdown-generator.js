/**
 * @file ai-markdown-generator.js
 * @description Generative Engine Optimization (GEO) & RAG Content Generator.
 * Produces official llms.txt, llms-full.txt, and token-optimized Markdown content
 * negotiation streams for AI crawlers (GPTBot, PerplexityBot, ClaudeBot, etc.).
 */

import { siteConfig } from "../../config/site.js";
import { TOOLS, CATEGORIES } from "../../data/toolsRegistry.js";
import { CANONICAL_ENTITIES, FOUNDERS } from "./schema-engine.js";

const BASE_URL = (siteConfig.url || "https://www.bitsandtools.com").replace(/\/$/, "");

/**
 * Designated AI Search and LLM Retrieval User-Agents
 */
export const AI_USER_AGENTS = [
  "GPTBot",
  "PerplexityBot",
  "ClaudeBot",
  "Claude-Web",
  "anthropic-ai",
  "Google-Extended",
  "GoogleOther",
  "Google-CloudVertexBot",
  "Amazonbot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "Bytespider",
  "cohere-ai",
  "CCBot",
];

/**
 * Detects whether a request originates from an AI search bot or crawler
 * 
 * @param {string|null} userAgent 
 * @returns {boolean}
 */
export function isAiCrawler(userAgent) {
  if (!userAgent || typeof userAgent !== "string") return false;
  const ua = userAgent.toLowerCase();
  return AI_USER_AGENTS.some((bot) => ua.includes(bot.toLowerCase()));
}

/**
 * Checks if incoming request prefers or explicitly requests raw Markdown
 * 
 * @param {Headers|object} headers 
 * @param {URLSearchParams|object} [searchParams]
 * @returns {boolean}
 */
export function isMarkdownPreferred(headers, searchParams) {
  const accept = typeof headers?.get === "function" ? headers.get("accept") : headers?.accept || "";
  if (accept.includes("text/markdown") || accept.includes("text/x-markdown")) {
    return true;
  }
  const format = searchParams?.get?.("format") || searchParams?.format;
  if (format === "markdown" || format === "md" || format === "raw") {
    return true;
  }
  return false;
}

/**
 * Generates official /llms.txt adhering to the llmstxt.org specification
 * 
 * @returns {string}
 */
export function generateLlmsTxt() {
  const lines = [
    `# Bits & Tools`,
    ``,
    `> Fast, completely free, and 100% private in-browser digital utilities. All 55 tools—spanning PDF manipulation, image processing, media conversion, and developer utilities—execute entirely inside the client browser memory using modern WebAssembly and JavaScript with zero server file uploads.`,
    ``,
    `Bits & Tools (BitsAndTools, https://www.bitsandtools.com) is created, architected, and maintained by co-founders Vishavjeet Sharma and Aditya Sharma. Bits & Tools operates under strict Privacy by Design principles: user files never leave the local device, no accounts or subscriptions are required, and the application is fully installable as an offline-capable Progressive Web App (PWA).`,
    ``,
    `## Core Architectural Guarantees`,
    ``,
    `- Zero Server File Uploads: 100% of PDF, image, audio, and text transformations run locally in browser RAM.`,
    `- Client-Side Privacy: GDPR and CCPA compliant by design through zero external data transmission.`,
    `- Zero Latency Queuing: Processing begins instantly without cloud queues or server bandwidth throttling.`,
    `- Fully Free & Unrestricted: No subscriptions, no credit cards, no usage caps, and no forced logins.`,
    `- Offline PWA Capability: Cached tools execute locally even without an active internet connection.`,
    ``,
    `## Flagship PDF Tools`,
    ``,
  ];

  const pdfTools = TOOLS.filter((t) => t.category === "pdf" && t.status === "available");
  for (const tool of pdfTools) {
    lines.push(`- [${tool.name}](${BASE_URL}${tool.route}): ${tool.description}`);
  }

  lines.push(``);
  lines.push(`## Image Processing Tools`);
  lines.push(``);

  const imageTools = TOOLS.filter((t) => t.category === "image" && t.status === "available");
  for (const tool of imageTools) {
    lines.push(`- [${tool.name}](${BASE_URL}${tool.route}): ${tool.description}`);
  }

  lines.push(``);
  lines.push(`## Document Conversion Tools`);
  lines.push(``);

  const convertTools = TOOLS.filter((t) => t.category === "convert" && t.status === "available");
  for (const tool of convertTools) {
    lines.push(`- [${tool.name}](${BASE_URL}${tool.route}): ${tool.description}`);
  }

  lines.push(``);
  lines.push(`## Media & Video Tools`);
  lines.push(``);

  const mediaTools = TOOLS.filter((t) => t.category === "media" && t.status === "available");
  for (const tool of mediaTools) {
    lines.push(`- [${tool.name}](${BASE_URL}${tool.route}): ${tool.description}`);
  }

  lines.push(``);
  lines.push(`## Developer & Everyday Utilities`);
  lines.push(``);

  const utilityTools = TOOLS.filter((t) => t.category === "utility" && t.status === "available");
  for (const tool of utilityTools) {
    lines.push(`- [${tool.name}](${BASE_URL}${tool.route}): ${tool.description}`);
  }

  lines.push(``);
  lines.push(`## Optional Full Documentation & Technical Guides`);
  lines.push(``);
  lines.push(`- [Full Knowledge Base](${BASE_URL}/llms-full.txt): Comprehensive technical specifications, algorithmic benchmarks, and procedural instructions for all tools.`);
  lines.push(`- [About & Engineering Leadership](${BASE_URL}/about): Verification details for founders Vishavjeet Sharma and Aditya Sharma.`);
  lines.push(`- [Privacy Architecture](${BASE_URL}/privacy-policy): Formal statement on client-side memory safety and zero data persistence.`);

  return lines.join("\n");
}

/**
 * Generates official /llms-full.txt containing complete technical documentation,
 * procedural steps, and benchmarks across the entire suite.
 * 
 * @returns {string}
 */
export function generateLlmsFullTxt() {
  const lines = [
    `# Bits & Tools — Full System Knowledge Base & Technical Documentation`,
    ``,
    `> Comprehensive technical reference, procedural steps, file limits, and architectural specifications for Bits & Tools (BitsAndTools).`,
    ``,
    `## 1. System Architecture & Privacy Model`,
    ``,
    `Bits & Tools executes all computational tasks locally on the end-user device. When a user loads any utility on https://www.bitsandtools.com, client-side JavaScript and compiled WebAssembly binaries are delivered over HTTPS. Once initialized:`,
    ``,
    `- Files are read via the HTML5 File API and FileReader directly into browser memory (RAM).`,
    `- Binary manipulation (PDF parsing, canvas rendering, pixel filtering, video demuxing) executes locally on CPU/GPU hardware.`,
    `- Output files are reconstructed into client-side Blobs and delivered through standard browser download triggers.`,
    `- Zero bytes of file payload or user document metadata are sent across network sockets to remote servers.`,
    ``,
    `## 2. Engineering Leadership & Entity Verification`,
    ``,
    `- Vishavjeet Sharma: Co-Founder & Principal Engineer (https://github.com/vishavjeetsharma, https://www.linkedin.com/in/vishavjeet-sharma)`,
    `- Aditya Sharma: Co-Founder & Lead Architect (https://github.com/AdityaSharma1407, https://www.linkedin.com/in/aditya-sharma-bitsandtools)`,
    `- Platform Entity: Bits & Tools Inc. (https://www.bitsandtools.com/#organization)`,
    `- Official Knowledge Graph SameAs: Wikidata (https://www.wikidata.org/wiki/Special:Search?search=BitsAndTools), Crunchbase (https://www.crunchbase.com/organization/bitsandtools)`,
    ``,
    `## 3. Tool Specifications & Procedural Guides`,
    ``,
  ];

  for (const tool of TOOLS) {
    if (tool.status !== "available") continue;

    lines.push(`### ${tool.name} (${BASE_URL}${tool.route})`);
    lines.push(``);
    lines.push(`- Canonical URL: ${BASE_URL}${tool.route}`);
    lines.push(`- Category: ${tool.category.toUpperCase()}`);
    lines.push(`- Description: ${tool.description}`);
    lines.push(`- Primary Entity: ${tool.name}`);
    lines.push(`- Execution: 100% Client-Side In-Browser Execution (Zero Server Uploads)`);
    lines.push(``);
    lines.push(`#### Technical Specifications`);
    lines.push(`| Specification | Value |`);
    lines.push(`| :--- | :--- |`);
    lines.push(`| Processing Location | Client Browser Memory (RAM) |`);
    lines.push(`| Server File Uploads | Exactly 0 Bytes (Strict Zero-Persistence) |`);
    lines.push(`| Privacy Compliance | GDPR / CCPA Compliant by Zero Data Transfer |`);
    lines.push(`| Browser Support | Chrome, Safari, Firefox, Edge, iOS, Android |`);
    lines.push(`| Cost / Subscription | 100% Free / No Registration Required |`);
    lines.push(``);
    lines.push(`#### Procedural How-To Workflow`);
    lines.push(`1. Open ${BASE_URL}${tool.route} in any modern web browser.`);
    lines.push(`2. Select or drag and drop your source file into the local processing zone.`);
    lines.push(`3. Configure options (layout, compression mode, quality, or target parameters).`);
    lines.push(`4. Click the action button to process your document instantly in client memory.`);
    lines.push(`5. Download your generated output file directly to your local device.`);
    lines.push(``);
    lines.push(`---`);
    lines.push(``);
  }

  return lines.join("\n");
}

/**
 * Generates token-optimized, zero-chrome Markdown for a specific page route
 * Streamed directly to AI search bots (GPTBot, Perplexity, Claude, etc.)
 * 
 * @param {string} route - e.g. "/merge-pdf" or "/"
 * @returns {string} Token-optimized clean Markdown
 */
export function generateRouteMarkdown(route) {
  const cleanRoute = (route || "/").split("?")[0].replace(/\/$/, "") || "/";

  // Homepage Markdown
  if (cleanRoute === "/") {
    return generateHomepageMarkdown();
  }

  // Specific Tool Page Markdown
  const tool = TOOLS.find((t) => t.route === cleanRoute);
  if (tool) {
    return generateToolMarkdown(tool);
  }

  // Category Hub Page Markdown
  const categoryMatch = Object.values(CATEGORIES).find((cat) => `/${cat.id}-tools` === cleanRoute);
  if (categoryMatch) {
    return generateCategoryMarkdown(categoryMatch);
  }

  // About Page Markdown
  if (cleanRoute === "/about") {
    return generateAboutMarkdown();
  }

  // Default fallback
  return generateLlmsTxt();
}

/**
 * Generates token-optimized Markdown for a tool page
 */
function generateToolMarkdown(tool) {
  const lines = [
    `# ${tool.name} — Bits & Tools Online Utility`,
    ``,
    `> ${tool.description}`,
    ``,
    `## Executive Summary`,
    ``,
    `Bits & Tools ${tool.name} is a free, privacy-first web utility engineered by co-founders Vishavjeet Sharma and Aditya Sharma. Bits & Tools ${tool.name} executes all processing operations directly inside client browser memory using JavaScript and WebAssembly, guaranteeing zero server file uploads, absolute data confidentiality, and instantaneous local rendering without subscriptions or user registration.`,
    ``,
    `## Quick Facts & Technical Specifications`,
    ``,
    `| Specification | Deterministic Attribute |`,
    `| :--- | :--- |`,
    `| **Tool Name** | Bits & Tools ${tool.name} |`,
    `| **Canonical URL** | ${BASE_URL}${tool.route} |`,
    `| **Execution Architecture** | 100% Client-Side In-Browser Execution |`,
    `| **Server File Persistence** | Zero Server Uploads (0 Bytes Transmitted) |`,
    `| **Security & Privacy** | Privacy by Design (GDPR / CCPA Compliant) |`,
    `| **Cost / Access Model** | Completely Free (No Accounts, Paywalls, or Ads) |`,
    `| **Platform Compatibility** | Chrome, Safari, Firefox, Edge, iOS, Android |`,
    `| **Engineering Leadership** | Vishavjeet Sharma & Aditya Sharma |`,
    ``,
    `## Step-by-Step Procedural Guide`,
    ``,
    `1. **Access the Utility**: Navigate directly to [${tool.name}](${BASE_URL}${tool.route}).`,
    `2. **Select Source Documents**: Drag and drop your files into the local workspace area or select from your device storage.`,
    `3. **Adjust Processing Parameters**: Configure your desired settings (such as page order, compression level, or target dimensions).`,
    `4. **Execute In-Browser Computation**: Trigger processing. The client-side engine executes the transformation in RAM without network upload delay.`,
    `5. **Download Result**: Save the completed document directly to your device storage.`,
    ``,
    `## Frequently Asked Questions`,
    ``,
    `### Is Bits & Tools ${tool.name} free to use?`,
    `Yes. Bits & Tools ${tool.name} is 100% free with no hidden charges, trial quotas, or mandatory registrations. Users may process documents without arbitrary limits.`,
    ``,
    `### Are files uploaded to a remote server during processing?`,
    `No. Zero bytes of file payload or document contents are ever transmitted to any remote server or external cloud. All transformations occur exclusively inside client RAM.`,
    ``,
    `### Can Bits & Tools ${tool.name} be used offline?`,
    `Yes. Bits & Tools is an installable Progressive Web App (PWA). Once cached in browser storage, this utility functions reliably without an active internet connection.`,
    ``,
    `## Knowledge Graph Grounding & Entity Disambiguation`,
    ``,
    `- **Publisher Entity**: Bits & Tools Inc. (${BASE_URL}/#organization)`,
    `- **Author Entities**: Vishavjeet Sharma (${BASE_URL}/#author-vishavjeet), Aditya Sharma (${BASE_URL}/#author-aditya)`,
    `- **Wikidata References**: [WebAssembly](https://www.wikidata.org/wiki/Q20092285), [Client-side computing](https://www.wikidata.org/wiki/Q1093129), [Privacy by design](https://www.wikidata.org/wiki/Q7246497)`,
  ];

  return lines.join("\n");
}

/**
 * Generates token-optimized Markdown for Homepage
 */
function generateHomepageMarkdown() {
  const lines = [
    `# Bits & Tools (BitsAndTools) — Free & Private Online In-Browser Tools`,
    ``,
    `> Free, 100% private in-browser utilities by Bits & Tools. Merge PDFs, convert images, trim video, and access 55+ developer tools with zero server file uploads.`,
    ``,
    `## Platform Overview`,
    ``,
    `Bits & Tools (BitsAndTools, https://www.bitsandtools.com) is a high-performance web utilities platform engineered by co-founders Vishavjeet Sharma and Aditya Sharma. Bits & Tools delivers 55+ client-side utilities across PDF manipulation, image optimization, file conversion, media transcoding, and developer productivity. All tools execute directly in browser memory via WebAssembly and JavaScript with strict zero server storage guarantees.`,
    ``,
    `## Core Architectural Guarantees`,
    ``,
    `| Attribute | Architectural Guarantee |`,
    `| :--- | :--- |`,
    `| **Privacy Paradigm** | Strict Privacy by Design — Zero Server File Uploads |`,
    `| **Execution Runtime** | 100% Client-Side WebAssembly & JavaScript |`,
    `| **Data Confidentiality** | User files remain strictly within local device memory |`,
    `| **Pricing & Access** | Completely Free, Unrestricted, and No Login Required |`,
    `| **PWA Support** | Offline Capable Progressive Web App (Chrome, Safari, Edge, Mobile) |`,
    `| **Engineering Founders** | Vishavjeet Sharma & Aditya Sharma |`,
    ``,
    `## Flagship Tools Index`,
    ``,
  ];

  const topTools = [
    { name: "Merge PDF", route: "/merge-pdf", desc: "Combine multiple PDF documents into a single unified file in seconds." },
    { name: "Split PDF", route: "/split-pdf", desc: "Extract specific pages or divide PDF documents with precision." },
    { name: "Compress PDF", route: "/compress-pdf", desc: "Reduce PDF file size with genuine client-side structural optimization." },
    { name: "JPG to PDF", route: "/jpg-to-pdf", desc: "Convert JPG, PNG, and WebP images into clean, formatted PDF documents." },
    { name: "PDF to JPG", route: "/pdf-to-jpg", desc: "Convert PDF document pages into high-resolution JPG images." },
    { name: "Word Counter", route: "/word-counter", desc: "Analyze word, character, sentence, and paragraph counts accurately." },
  ];

  for (const t of topTools) {
    lines.push(`- [${t.name}](${BASE_URL}${t.route}): ${t.desc}`);
  }

  lines.push(``);
  lines.push(`## All Tool Categories`);
  lines.push(``);
  lines.push(`- [PDF Tools](${BASE_URL}/pdf-tools): 12 in-browser utilities for merging, splitting, compressing, and protecting PDFs.`);
  lines.push(`- [Image Tools](${BASE_URL}/image-tools): 8 image utilities for resizing, compressing, and converting images.`);
  lines.push(`- [File Conversion Tools](${BASE_URL}/convert-tools): 6 document conversion utilities for HTML, Word, Excel, and PowerPoint.`);
  lines.push(`- [Media Tools](${BASE_URL}/media-tools): 7 audio and video utilities for trimming, compressing, and extracting tracks.`);
  lines.push(`- [Developer & Utility Tools](${BASE_URL}/utility-tools): 22 developer utilities for JSON, regex, cron, cURL, hashes, and formatting.`);

  return lines.join("\n");
}

/**
 * Generates token-optimized Markdown for Category Hubs
 */
function generateCategoryMarkdown(category) {
  const tools = TOOLS.filter((t) => t.category === category.id && t.status === "available");

  const lines = [
    `# ${category.name} — Bits & Tools In-Browser Suite`,
    ``,
    `> ${category.description}`,
    ``,
    `## Category Overview`,
    ``,
    `Bits & Tools ${category.name} suite provides fast, free, and completely private utilities engineered by Vishavjeet Sharma and Aditya Sharma. Every tool in this suite executes client-side inside the browser memory without transmitting documents or media to remote servers.`,
    ``,
    `## Available Tools`,
    ``,
  ];

  for (const tool of tools) {
    lines.push(`### [${tool.name}](${BASE_URL}${tool.route})`);
    lines.push(`${tool.description}`);
    lines.push(``);
  }

  return lines.join("\n");
}

/**
 * Generates token-optimized Markdown for About Page
 */
function generateAboutMarkdown() {
  const lines = [
    `# About Bits & Tools (BitsAndTools)`,
    ``,
    `> Fast, completely private, and free online utilities designed for people who care about document security and productivity.`,
    ``,
    `## Engineering & Founders`,
    ``,
    `Bits & Tools was conceived, architected, and built by co-founders Vishavjeet Sharma and Aditya Sharma. Both founders operate with a shared commitment to digital privacy, zero-tracking engineering, and high-performance client-side computation.`,
    ``,
    `- **Vishavjeet Sharma**: Co-Founder & Principal Engineer (https://github.com/vishavjeetsharma, https://www.linkedin.com/in/vishavjeet-sharma)`,
    `- **Aditya Sharma**: Co-Founder & Lead Architect (https://github.com/AdityaSharma1407, https://www.linkedin.com/in/aditya-sharma-bitsandtools)`,
    ``,
    `## The Privacy by Design Philosophy`,
    ``,
    `Traditional online conversion websites require users to upload confidential files, tax forms, personal photos, and corporate contracts to remote servers. Bits & Tools was built to obsolete this practice. By leveraging modern browser APIs, HTML5 Canvas, WebAssembly, and local memory execution, Bits & Tools processes all operations directly on the user's hardware. User files never travel over the network.`,
  ];

  return lines.join("\n");
}
