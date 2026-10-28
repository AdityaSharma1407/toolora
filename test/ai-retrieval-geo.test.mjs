import test, { describe } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  generateLlmsTxt,
  generateLlmsFullTxt,
  generateRouteMarkdown,
  isAiCrawler,
  isMarkdownPreferred,
  AI_USER_AGENTS,
} from "../src/lib/seo/ai-markdown-generator.js";
import {
  buildToolPageGraphSchema,
  CANONICAL_ENTITIES,
  FOUNDERS,
} from "../src/lib/seo/schema-engine.js";
import robots from "../src/app/robots.js";
import { GET as getLlmsTxt } from "../src/app/llms.txt/route.js";
import { GET as getLlmsFullTxt } from "../src/app/llms-full.txt/route.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");

describe("AI Search, RAG Retrieval & Generative Engine Optimization (GEO) Verification", () => {
  // Phase 1: Dynamic llms.txt & Dual-Mode Markdown Content Negotiation
  describe("Phase 1: Dynamic llms.txt & Dual-Mode Markdown Content Negotiation", () => {
    test("/llms.txt route outputs official llms.txt standard Markdown specification", async () => {
      const response = await getLlmsTxt();
      assert.equal(response.status, 200);
      assert.ok(response.headers.get("content-type").includes("text/plain"));

      const content = await response.text();
      assert.ok(content.startsWith("# Bits & Tools"), "Must begin with H1 title");
      assert.ok(content.includes("> Fast, completely free"), "Must include executive blockquote summary");
      assert.ok(content.includes("Vishavjeet Sharma"), "Must credit Vishavjeet Sharma");
      assert.ok(content.includes("Aditya Sharma"), "Must credit Aditya Sharma");
      assert.ok(content.includes("Privacy by Design"), "Must state Privacy by Design architecture");
      assert.ok(content.includes("## Flagship PDF Tools"), "Must categorize PDF tools");
      assert.ok(content.includes("- [Merge PDF]"), "Must link to Merge PDF");
      assert.ok(content.includes("- [Split PDF]"), "Must link to Split PDF");
      assert.ok(content.includes("- [Compress PDF]"), "Must link to Compress PDF");
      assert.ok(content.includes("/llms-full.txt"), "Must link to /llms-full.txt");
    });

    test("/llms-full.txt route provides comprehensive technical documentation & benchmarks", async () => {
      const response = await getLlmsFullTxt();
      assert.equal(response.status, 200);

      const content = await response.text();
      assert.ok(content.includes("# Bits & Tools — Full System Knowledge Base"), "Must include title");
      assert.ok(content.includes("System Architecture & Privacy Model"), "Must explain system architecture");
      assert.ok(content.includes("HTML5 File API and FileReader"), "Must detail memory model");
      assert.ok(content.includes("| Processing Location | Client Browser Memory (RAM) |"), "Must contain technical spec table");
      assert.ok(content.includes("Procedural How-To Workflow"), "Must provide procedural instructions");
    });

    test("isAiCrawler accurately identifies all designated AI and LLM search agents", () => {
      const testBots = [
        "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; GPTBot/1.2; +https://openai.com/gptbot)",
        "Mozilla/5.0 (compatible; PerplexityBot/1.0; +https://perplexity.ai/perplexitybot)",
        "ClaudeBot/1.0; +https://www.anthropic.com/claudebot",
        "Mozilla/5.0 (compatible; Google-Extended)",
        "Amazonbot/0.1; +https://developer.amazon.com/support/amazonbot",
        "OAI-SearchBot/1.0; +https://openai.com/searchbot",
        "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36 (compatible; ChatGPT-User/1.0)",
      ];

      for (const ua of testBots) {
        assert.equal(isAiCrawler(ua), true, `Must detect AI crawler: ${ua}`);
      }

      // Ensure standard human browsers are NOT flagged as AI bots
      const humanUa = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36";
      assert.equal(isAiCrawler(humanUa), false, "Standard human browser must not be flagged as AI crawler");
    });

    test("isMarkdownPreferred detects Accept header and format query parameter", () => {
      assert.equal(isMarkdownPreferred({ get: () => "text/markdown" }), true);
      assert.equal(isMarkdownPreferred({ get: () => "text/x-markdown" }), true);
      assert.equal(isMarkdownPreferred({ get: () => "text/html" }, { get: () => "markdown" }), true);
      assert.equal(isMarkdownPreferred({ get: () => "text/html" }, { get: () => "md" }), true);
      assert.equal(isMarkdownPreferred({ get: () => "text/html" }, { get: () => null }), false);
    });

    test("generateRouteMarkdown generates token-optimized clean Markdown without UI chrome or SVGs", () => {
      const toolMd = generateRouteMarkdown("/merge-pdf");
      assert.ok(toolMd.startsWith("# Merge PDF — Bits & Tools Online Utility"));
      assert.ok(toolMd.includes("## Executive Summary"));
      assert.ok(toolMd.includes("## Quick Facts & Technical Specifications"));
      assert.ok(toolMd.includes("| **Execution Architecture** | 100% Client-Side In-Browser Execution |"));
      assert.ok(toolMd.includes("## Step-by-Step Procedural Guide"));
      assert.ok(toolMd.includes("## Frequently Asked Questions"));
      assert.ok(toolMd.includes("Wikidata References"));
      assert.ok(!toolMd.includes("<svg"), "Must strip SVGs from AI markdown");
      assert.ok(!toolMd.includes("<script"), "Must strip scripts from AI markdown");
      assert.ok(!toolMd.includes("<header"), "Must strip HTML header chrome from AI markdown");
    });
  });

  // Phase 2: RAG-Optimized Chunking & "Zero-Ambiguity" Semantic Framing
  describe("Phase 2: RAG-Optimized Chunking & Semantic Framing", () => {
    test("Pronoun Elimination Guard: QuickTake defaultSummary does not start sentences with pronouns", () => {
      const quickTakeCode = fs.readFileSync(path.join(rootDir, "src", "components", "common", "QuickTake.jsx"), "utf-8");
      assert.ok(!quickTakeCode.includes("It enables users to"), "Must eliminate pronoun 'It' at sentence start");
      assert.ok(!quickTakeCode.includes("This allows users to"), "Must eliminate pronoun 'This' at sentence start");
      assert.ok(quickTakeCode.includes("Bits & Tools ${toolName} enables users to"), "Must explicitly repeat entity name");
    });

    test("QuickFactsCallout renders <aside role='region' aria-label='Quick Facts'> and semantic <dl>", () => {
      const calloutCode = fs.readFileSync(path.join(rootDir, "src", "components", "common", "QuickFactsCallout.jsx"), "utf-8");
      assert.ok(calloutCode.includes('role="region"'), "Must specify role='region'");
      assert.ok(calloutCode.includes('aria-label="Quick Facts"'), "Must specify aria-label='Quick Facts'");
      assert.ok(calloutCode.includes("<dl"), "Must include semantic Definition List <dl>");
      assert.ok(calloutCode.includes("<dt"), "Must include <dt> elements");
      assert.ok(calloutCode.includes("<dd"), "Must include <dd> elements");
      assert.ok(calloutCode.includes("Q1093129"), "Must reference Wikidata Q1093129");
    });

    test("Flagship tool pages integrate QuickFactsCallout callout blocks", () => {
      const pages = [
        "src/app/merge-pdf/page.jsx",
        "src/app/split-pdf/page.jsx",
        "src/app/compress-pdf/page.jsx",
        "src/app/jpg-to-pdf/page.jsx",
        "src/app/page.jsx",
      ];

      for (const p of pages) {
        const code = fs.readFileSync(path.join(rootDir, p), "utf-8");
        assert.ok(code.includes("<QuickFactsCallout"), `${p} must render QuickFactsCallout`);
      }
    });
  });

  // Phase 3: Explicit Knowledge-Graph Grounding (JSON-LD Linked Entities)
  describe("Phase 3: Explicit Knowledge-Graph Grounding", () => {
    test("CANONICAL_ENTITIES provides verified Wikidata and Wikipedia URIs across key disciplines", () => {
      assert.ok(CANONICAL_ENTITIES.PDF.sameAs.some((u) => u.includes("Q11275")));
      assert.ok(CANONICAL_ENTITIES.IMAGE_PROCESSING.sameAs.some((u) => u.includes("Q211140")));
      assert.ok(CANONICAL_ENTITIES.WEBASSEMBLY.sameAs.some((u) => u.includes("Q20092285")));
      assert.ok(CANONICAL_ENTITIES.CLIENT_SIDE_COMPUTING.sameAs.some((u) => u.includes("Q1093129")));
      assert.ok(CANONICAL_ENTITIES.PRIVACY_BY_DESIGN.sameAs.some((u) => u.includes("Q7246497")));
      assert.ok(CANONICAL_ENTITIES.LOSSLESS_COMPRESSION.sameAs.some((u) => u.includes("Q1129599")));
      assert.ok(CANONICAL_ENTITIES.CRYPTOGRAPHIC_HASH.sameAs.some((u) => u.includes("Q129746")));
      assert.ok(CANONICAL_ENTITIES.QR_CODE.sameAs.some((u) => u.includes("Q12203")));
      assert.ok(CANONICAL_ENTITIES.JSON.sameAs.some((u) => u.includes("Q2063")));
      assert.ok(CANONICAL_ENTITIES.MARKDOWN.sameAs.some((u) => u.includes("Q1193600")));
      assert.ok(CANONICAL_ENTITIES.REGULAR_EXPRESSION.sameAs.some((u) => u.includes("Q185612")));
      assert.ok(CANONICAL_ENTITIES.PWA.sameAs.some((u) => u.includes("Q28456075")));
    });

    test("buildToolPageGraphSchema injects speakable and hasPart specifications into TechArticle", () => {
      const schema = buildToolPageGraphSchema({
        tool: {
          name: "Merge PDF Online",
          route: "/merge-pdf",
          description: "Combine multiple PDF files into one document in seconds.",
        },
        breadcrumbs: [{ label: "Merge PDF", href: "/merge-pdf" }],
      });

      const techArticle = schema["@graph"].find((e) => e["@type"] === "TechArticle");
      assert.ok(techArticle, "Must generate TechArticle");
      assert.ok(techArticle.speakable, "Must include speakable property");
      assert.equal(techArticle.speakable["@type"], "SpeakableSpecification");
      assert.ok(Array.isArray(techArticle.speakable.cssSelector));
      assert.ok(Array.isArray(techArticle.hasPart), "Must include hasPart section breakdown");
      assert.ok(techArticle.hasPart.some((p) => p.cssSelector === "#quick-facts"));
    });
  });

  // Phase 4: AI Bot Ingress & Telemetry Optimization
  describe("Phase 4: AI Bot Ingress & Telemetry Optimization", () => {
    test("robots.js explicitly configures and allows AI search crawlers", () => {
      const robotsObj = robots();
      const aiRule = robotsObj.rules.find(
        (r) => Array.isArray(r.userAgent) && r.userAgent.includes("GPTBot")
      );

      assert.ok(aiRule, "Must have dedicated rule for AI search engines");
      assert.ok(aiRule.userAgent.includes("PerplexityBot"));
      assert.ok(aiRule.userAgent.includes("ClaudeBot"));
      assert.ok(aiRule.userAgent.includes("Google-Extended"));
      assert.ok(aiRule.userAgent.includes("OAI-SearchBot"));
      assert.ok(aiRule.userAgent.includes("Amazonbot"));
      assert.equal(aiRule.allow, "/");
    });

    test("AnchorHeading generates slugified HTML IDs and accessible anchor buttons", () => {
      const anchorCode = fs.readFileSync(path.join(rootDir, "src", "components", "common", "AnchorHeading.jsx"), "utf-8");
      assert.ok(anchorCode.includes("slugifyHeading"), "Must use slugifyHeading utility");
      assert.ok(anchorCode.includes("id={slug}"), "Must attach slugified id");
      assert.ok(anchorCode.includes("Copy direct link"), "Must provide copy link button");
    });
  });
});
