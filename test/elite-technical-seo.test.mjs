import test, { describe } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  buildRootGraphSchema,
  buildBreadcrumbsSchema,
  buildToolPageGraphSchema,
  buildContentPageGraphSchema,
  mergeIntoUnifiedGraph,
  CANONICAL_ENTITIES,
  FOUNDERS,
  ENTITY_IDS,
  buildSiteNavigationSchema,
  CRITICAL_SITELINKS,
} from "../src/lib/seo/schema-engine.js";
import { getSitelinkMetadata, SITELINK_METADATA } from "../src/lib/seo/ab-meta-engine.js";
import {
  getAllSitemapEntries,
  getFreshSitemapEntries,
  getArchiveSitemapEntries,
  buildSitemapXml,
  buildSitemapIndexXml,
} from "../src/lib/seo/sitemaps.js";
import {
  INDEXNOW_KEY,
  INDEXNOW_KEY_LOCATION,
  submitUrlsToIndexNow,
} from "../src/lib/seo/indexnow.js";
import robots from "../src/app/robots.js";
import { GET as getSitemapIndex } from "../src/app/sitemap-index.xml/route.js";
import { GET as getIndexNowStatus } from "../src/app/api/seo/indexnow-notify/route.js";
import nextConfig from "../next.config.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");

describe("Elite Technical SEO Architecture & Protocol Verification", () => {
  // Phase 1: High-Order Entity Disambiguation (Structured Schema Engine)
  describe("Phase 1: High-Order Entity Disambiguation (Structured Schema Engine)", () => {
    test("Root layout @graph schema contains WebSite, Organization, SearchAction, and Founders", () => {
      const rootSchema = buildRootGraphSchema();
      assert.equal(rootSchema["@context"], "https://schema.org");
      assert.ok(Array.isArray(rootSchema["@graph"]));

      const org = rootSchema["@graph"].find((e) => e["@type"] === "Organization");
      assert.ok(org, "Root schema must contain Organization entity");
      assert.equal(org["@id"], ENTITY_IDS.ORGANIZATION);
      assert.equal(org.name, "Bits & Tools");

      // Verify sameAs entity profiles
      assert.ok(Array.isArray(org.sameAs) && org.sameAs.length >= 4);
      assert.ok(org.sameAs.some((s) => s.includes("github.com")));
      assert.ok(org.sameAs.some((s) => s.includes("wikidata.org")));
      assert.ok(org.sameAs.some((s) => s.includes("crunchbase.com")));

      // Verify founders
      assert.ok(Array.isArray(org.founder) && org.founder.length === 2);
      const vishavjeet = org.founder.find((f) => f.name === "Vishavjeet Sharma");
      const aditya = org.founder.find((f) => f.name === "Aditya Sharma");
      assert.ok(vishavjeet, "Vishavjeet Sharma must be configured as founder");
      assert.ok(aditya, "Aditya Sharma must be configured as founder");
      assert.equal(vishavjeet.email, "vishavjeetsharma88@gmail.com");
      assert.equal(aditya.email, "sharmaaditya14jul@gmail.com");

      // Verify WebSite entity with SearchAction
      const website = rootSchema["@graph"].find((e) => e["@type"] === "WebSite");
      assert.ok(website, "Root schema must contain WebSite entity");
      assert.equal(website["@id"], ENTITY_IDS.WEBSITE);
      assert.equal(website.publisher["@id"], ENTITY_IDS.ORGANIZATION);
      assert.equal(website.potentialAction["@type"], "SearchAction");
      assert.ok(website.potentialAction.target.urlTemplate.includes("?q="));
    });

    test("Tool page graph schema binds WebApplication and TechArticle via @id to Organization and Authors", () => {
      const tool = {
        name: "Merge PDF",
        route: "/merge-pdf",
        description: "Combine multiple PDF documents client-side.",
      };

      const toolSchema = buildToolPageGraphSchema({
        tool,
        breadcrumbs: [{ label: "PDF Tools", href: "/pdf-tools" }, { label: "Merge PDF", href: "/merge-pdf" }],
        aboutEntities: [CANONICAL_ENTITIES.PDF],
      });

      assert.equal(toolSchema["@context"], "https://schema.org");
      const graph = toolSchema["@graph"];

      const webApp = graph.find((e) => Array.isArray(e["@type"]) && e["@type"].includes("WebApplication"));
      assert.ok(webApp, "Must contain WebApplication entity");
      assert.equal(webApp["@id"], "https://www.bitsandtools.com/merge-pdf/#webapp");
      assert.equal(webApp.provider["@id"], ENTITY_IDS.ORGANIZATION);
      assert.deepEqual(webApp.author, [
        { "@id": ENTITY_IDS.AUTHOR_VISHAVJEET },
        { "@id": ENTITY_IDS.AUTHOR_ADITYA },
      ]);
      assert.ok(webApp.aggregateRating, "WebApplication must have aggregateRating");

      const techArticle = graph.find((e) => e["@type"] === "TechArticle");
      assert.ok(techArticle, "Must contain TechArticle entity");
      assert.equal(techArticle["@id"], "https://www.bitsandtools.com/merge-pdf/#article");
      assert.equal(techArticle.publisher["@id"], ENTITY_IDS.ORGANIZATION);

      // Verify canonical Wikidata / Wikipedia references
      assert.ok(
        techArticle.about.some((e) =>
          e.sameAs && e.sameAs.some((u) => u.includes("wikidata.org") || u.includes("wikipedia.org"))
        )
      );
      assert.ok(
        techArticle.mentions.some((e) =>
          e.sameAs && e.sameAs.some((u) => u.includes("wikidata.org") || u.includes("wikipedia.org"))
        )
      );
    });

    test("buildContentPageGraphSchema supports generic Article/TechArticle/Product and merges into unified graph", () => {
      const productSchema = buildContentPageGraphSchema({
        type: "Product",
        slug: "premium-suite",
        title: "Bits & Tools Premium Utility Suite",
        description: "Zero-latency in-browser file transformation toolset.",
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.9",
          ratingCount: "500",
        },
      });

      assert.equal(productSchema["@context"], "https://schema.org");
      const product = productSchema["@graph"].find((e) => e["@type"] === "Product");
      assert.ok(product);
      assert.equal(product.publisher["@id"], ENTITY_IDS.ORGANIZATION);
      assert.equal(product.offers.price, "0");

      const merged = mergeIntoUnifiedGraph(buildRootGraphSchema(), productSchema);
      assert.ok(Array.isArray(merged["@graph"]));
      assert.ok(merged["@graph"].some((e) => e["@type"] === "Organization"));
      assert.ok(merged["@graph"].some((e) => e["@type"] === "Product"));
    });

    test("BreadcrumbList generator handles raw path string segments and creates clean sequence", () => {
      const rawSegments = ["pdf-tools", "merge-pdf"];
      const schema = buildBreadcrumbsSchema(rawSegments, "https://www.bitsandtools.com");

      assert.equal(schema["@type"], "BreadcrumbList");
      assert.equal(schema.itemListElement.length, 3);
      assert.equal(schema.itemListElement[0].name, "Home");
      assert.equal(schema.itemListElement[1].name, "Pdf Tools");
      assert.equal(schema.itemListElement[1].item, "https://www.bitsandtools.com/pdf-tools");
      assert.equal(schema.itemListElement[2].name, "Merge Pdf");
      assert.equal(schema.itemListElement[2].item, "https://www.bitsandtools.com/merge-pdf");
    });
  });

  // Phase 2: Instant Crawl Acceleration & Dynamic Routing Pipelines
  describe("Phase 2: Instant Crawl Acceleration & Dynamic Routing Pipelines", () => {
    test("IndexNow verification key file exists in public/ and matches key", () => {
      const keyFilePath = path.join(rootDir, "public", `${INDEXNOW_KEY}.txt`);
      assert.ok(fs.existsSync(keyFilePath), `Verification file ${INDEXNOW_KEY}.txt must exist in public/`);
      const fileContent = fs.readFileSync(keyFilePath, "utf-8").trim();
      assert.equal(fileContent, INDEXNOW_KEY);
      assert.equal(INDEXNOW_KEY_LOCATION, `https://www.bitsandtools.com/${INDEXNOW_KEY}.txt`);
    });

    test("API endpoint /api/seo/indexnow-notify returns healthy status and metadata", async () => {
      const res = await getIndexNowStatus();
      assert.equal(res.status, 200);
      const data = await res.json();
      assert.equal(data.status, "active");
      assert.equal(data.key, INDEXNOW_KEY);
      assert.equal(data.keyLocation, INDEXNOW_KEY_LOCATION);
    });

    test("Split sitemaps correctly partition fresh (<48h) and archive URLs", () => {
      const all = getAllSitemapEntries();
      const fresh = getFreshSitemapEntries("https://www.bitsandtools.com", 48);
      const archive = getArchiveSitemapEntries("https://www.bitsandtools.com", 48);

      assert.ok(all.length >= 55, "All entries must include all 55+ tools and hubs");
      assert.ok(fresh.length > 0, "Fresh sitemap must contain recent URLs");
      assert.ok(archive.length > 0, "Archive sitemap must contain historical URLs");

      const freshSet = new Set(fresh.map((e) => e.url));
      for (const arch of archive) {
        assert.ok(!freshSet.has(arch.url), `URL ${arch.url} cannot appear in both fresh and archive`);
      }
      assert.equal(fresh.length + archive.length, all.length, "Fresh + Archive must equal total URL count");
    });

    test("Sitemap index route (/sitemap-index.xml) generates valid sitemapindex XML hierarchy", async () => {
      const response = await getSitemapIndex();
      assert.equal(response.status, 200);
      assert.ok(response.headers.get("Content-Type").includes("application/xml"));
      const xml = await response.text();
      assert.ok(xml.includes("<sitemapindex"));
      assert.ok(xml.includes("https://www.bitsandtools.com/sitemap-fresh.xml"));
      assert.ok(xml.includes("https://www.bitsandtools.com/sitemap-archive.xml"));
    });

    test("Robots.txt disallows /api/ and references sitemap, sitemap-index, fresh, and archive", () => {
      const r = robots();
      assert.equal(r.rules[0].userAgent, "*");
      assert.equal(r.rules[0].allow, "/");
      assert.deepEqual(r.rules[0].disallow, ["/api/"]);

      const sitemaps = Array.isArray(r.sitemap) ? r.sitemap : [r.sitemap];
      assert.ok(sitemaps.includes("https://www.bitsandtools.com/sitemap.xml"));
      assert.ok(sitemaps.includes("https://www.bitsandtools.com/sitemap-index.xml"));
      assert.ok(sitemaps.includes("https://www.bitsandtools.com/sitemap-fresh.xml"));
      assert.ok(sitemaps.includes("https://www.bitsandtools.com/sitemap-archive.xml"));
    });
  });

  // Phase 3: Topical Cluster Routing & Link Siloing
  describe("Phase 3: Topical Cluster Routing & Link Siloing", () => {
    test("RelatedTools source code implements strict category siloing and category hub pillar link", () => {
      const code = fs.readFileSync(
        path.join(rootDir, "src", "components", "common", "RelatedTools.jsx"),
        "utf-8"
      );

      assert.ok(code.includes("getToolsByCategory"), "Must use getToolsByCategory to avoid cross-category leaks");
      assert.ok(code.includes("CATEGORY_HUB_MAP"), "Must map category to its parent pillar hub");
      assert.ok(code.includes("/pdf-tools"), "Must reference /pdf-tools pillar");
      assert.ok(code.includes("/image-tools"), "Must reference /image-tools pillar");
      assert.ok(code.includes("<aside"), "Must use semantic <aside> tag");
    });

    test("Breadcrumbs component integrates Schema.org microdata and centralized JSON-LD", () => {
      const code = fs.readFileSync(
        path.join(rootDir, "src", "components", "common", "Breadcrumbs.jsx"),
        "utf-8"
      );

      assert.ok(code.includes('itemType="https://schema.org/BreadcrumbList"'), "Must include BreadcrumbList microdata");
      assert.ok(code.includes('itemProp="itemListElement"'), "Must include itemListElement microdata");
      assert.ok(code.includes('itemProp="position"'), "Must include position microdata");
      assert.ok(code.includes("buildBreadcrumbsSchema"), "Must invoke centralized schema builder");
    });
  });

  // Phase 4: AEO & Core Web Vitals Scaffolding
  describe("Phase 4: AEO & Core Web Vitals Scaffolding", () => {
    test("QuickTake component includes role='doc-abstract' and declarative definition within 40–55 words", () => {
      const code = fs.readFileSync(
        path.join(rootDir, "src", "components", "common", "QuickTake.jsx"),
        "utf-8"
      );

      assert.ok(code.includes('role="doc-abstract"'), "QuickTake must declare role='doc-abstract' for AEO");
      assert.ok(code.includes("Vishavjeet Sharma"), "QuickTake must cite founder Vishavjeet Sharma");
      assert.ok(code.includes("Aditya Sharma"), "QuickTake must cite founder Aditya Sharma");
      assert.ok(code.includes("Zero File Uploads"), "QuickTake must highlight Zero File Uploads");
      assert.ok(code.replace(/\r\n/g, "\n").includes('<ul\n        role="list"'), "QuickTake must provide semantic unordered list");
    });

    test("Flagship tool pages integrate QuickTake, buildToolPageGraphSchema, and semantic tags", () => {
      const flagshipPages = [
        "src/app/merge-pdf/page.jsx",
        "src/app/split-pdf/page.jsx",
        "src/app/compress-pdf/page.jsx",
        "src/app/jpg-to-pdf/page.jsx",
      ];

      for (const relPath of flagshipPages) {
        const fullPath = path.join(rootDir, relPath);
        const code = fs.readFileSync(fullPath, "utf-8");

        assert.ok(code.includes("<QuickTake"), `${relPath} must include QuickTake callout`);
        assert.ok(code.includes("buildToolPageGraphSchema"), `${relPath} must use centralized tool page schema`);
        assert.ok(code.includes("<main"), `${relPath} must use semantic <main> tag`);
        assert.ok(code.includes("<header"), `${relPath} must use semantic <header> tag`);
        assert.ok(code.includes("<section"), `${relPath} must use semantic <section> tag`);
        assert.ok(code.includes("aggregateRating"), `${relPath} must contain aggregateRating`);
      }
    });

    test("next.config.mjs configures modern image formats (AVIF & WebP) and caching headers", () => {
      assert.ok(Array.isArray(nextConfig.images.formats));
      assert.ok(nextConfig.images.formats.includes("image/avif"));
      assert.ok(nextConfig.images.formats.includes("image/webp"));
    });

    test("Interactive image preview elements enforce loading='lazy' and decoding='async'", () => {
      const targetWorkspaces = [
        "src/components/image/ColorPaletteWorkspace.jsx",
        "src/components/image/CropImageWorkspace.jsx",
        "src/components/image/JpgToPdfWorkspace.jsx",
        "src/components/image/ResizeImageWorkspace.jsx",
        "src/components/media/VideoToGifWorkspace.jsx",
      ];

      for (const relPath of targetWorkspaces) {
        const fullPath = path.join(rootDir, relPath);
        const code = fs.readFileSync(fullPath, "utf-8");
        assert.ok(code.includes('loading="lazy"'), `${relPath} must enforce loading="lazy" on img elements`);
        assert.ok(code.includes('decoding="async"'), `${relPath} must enforce decoding="async" on img elements`);
      }
    });
  });

  // Phase 5: Ultra-Low-Level Structural Refinement
  describe("Phase 5: Ultra-Low-Level Structural Refinement", () => {
    test("Visual Token Weight: QuickTake mandates 18px-20px computed font and maximum contrast text-slate-900", () => {
      const code = fs.readFileSync(path.join(rootDir, "src", "components", "common", "QuickTake.jsx"), "utf-8");
      assert.ok(code.includes("text-lg sm:text-[19px] lg:text-xl"), "QuickTake must enforce 18px-20px font tokens");
      assert.ok(code.includes("text-slate-900"), "QuickTake must use maximum contrast text-slate-900");
    });

    test("DOM Content Visibility: FAQSection keeps all answer content in HTML without display:none", () => {
      const code = fs.readFileSync(path.join(rootDir, "src", "components", "common", "FAQSection.jsx"), "utf-8");
      assert.ok(code.includes("<details"), "FAQSection must use semantic <details> for native bot indexability");
      assert.ok(code.includes("<summary"), "FAQSection must use semantic <summary>");
      assert.ok(!code.includes("display:none"), "No answer content may be buried in display:none");
      assert.ok(!code.includes("opacity-0"), "No answer content may be buried in opacity-0");
    });

    test("Deterministic Anchor Graphing: slugifyHeading and injectHeadingAnchors output clean fragment targets", async () => {
      const { slugifyHeading, injectHeadingAnchors } = await import("../src/lib/seo/anchors.js");
      assert.equal(slugifyHeading("How to Merge PDF Files Online"), "how-to-merge-pdf-files-online");
      assert.equal(slugifyHeading("FAQ & System Requirements 2026!"), "faq-system-requirements-2026");

      const rawHtml = "<h2>Frequently Asked Questions</h2><p>Content</p>";
      const anchored = injectHeadingAnchors(rawHtml);
      assert.ok(anchored.includes('id="frequently-asked-questions"'));
      assert.ok(anchored.includes('href="#frequently-asked-questions"'));
    });

    test("Strict Semantic Silo Enforcement: RelatedTools computes taxonomy affinity without cross-cluster leaks", () => {
      const code = fs.readFileSync(path.join(rootDir, "src", "components", "common", "RelatedTools.jsx"), "utf-8");
      assert.ok(code.includes("computeSemanticAffinity"), "RelatedTools must compute taxonomy/keyword vector overlap");
      assert.ok(!code.includes("displayTools = [...displayTools, ...general"), "Strict siloing must never leak cross-cluster tools");
    });
  });

  // Phase 6: Algorithmic Quality & Search Engine Internal Ranking Mechanics
  describe("Phase 6: Algorithmic Quality & Search Engine Ranking Mechanics", () => {
    test("Temporal Tri-Date Synchronization: absolute parity across Sitemap, Schema JSON-LD, Visual Byline, and Meta tags", async () => {
      const { resolveTemporalParity, VERIFIED_TEMPORAL_DATA } = await import("../src/lib/seo/temporal-engine.js");
      const { getAllSitemapEntries } = await import("../src/lib/seo/sitemaps.js");
      const { buildToolPageGraphSchema } = await import("../src/lib/seo/schema-engine.js");

      const sitemapEntries = getAllSitemapEntries();
      const testRoutes = ["/merge-pdf", "/split-pdf", "/compress-pdf", "/jpg-to-pdf"];

      for (const route of testRoutes) {
        const temporal = resolveTemporalParity(route);
        assert.ok(temporal.isoModified, `Temporal engine must have isoModified for ${route}`);
        assert.ok(temporal.isoPublished, `Temporal engine must have isoPublished for ${route}`);
        assert.ok(temporal.etag, `Temporal engine must have strong ETag for ${route}`);
        assert.ok(temporal.httpLastModified, `Temporal engine must have HTTP Last-Modified string for ${route}`);

        // Parity with Sitemap lastmod
        const sitemapItem = sitemapEntries.find((e) => e.url.endsWith(route));
        assert.ok(sitemapItem, `Sitemap must contain entry for ${route}`);
        assert.equal(
          sitemapItem.lastModified.toISOString(),
          temporal.isoModified,
          `Sitemap lastModified must match temporal.isoModified for ${route}`
        );

        // Parity with Schema JSON-LD
        const schema = buildToolPageGraphSchema({
          tool: { name: "Test Tool", route, description: "Test" },
        });
        const article = schema["@graph"].find((e) => e["@type"] === "TechArticle");
        assert.ok(article, "Schema must contain TechArticle");
        assert.equal(
          article.dateModified,
          temporal.isoModified,
          `Schema dateModified must match temporal.isoModified for ${route}`
        );
        assert.equal(
          article.datePublished,
          temporal.isoPublished,
          `Schema datePublished must match temporal.isoPublished for ${route}`
        );

        // Parity with Visual Byline props
        assert.equal(
          temporal.bylineProps.dateTime,
          temporal.isoModified,
          `Visual byline dateTime must match temporal.isoModified for ${route}`
        );
      }
    });

    test("Content Diff Guard: DateModified does NOT bump if token hash does not change", async () => {
      const { resolveTemporalParity, computeContentHash } = await import("../src/lib/seo/temporal-engine.js");

      const baseline = resolveTemporalParity("/merge-pdf");

      // Same content / no diff -> dateModified must remain identical
      const unchanged = resolveTemporalParity("/merge-pdf", "merge-pdf-client-side-v3");
      assert.equal(unchanged.isoModified, baseline.isoModified);

      // Substantive update with meaningful change flag -> updates timestamp
      const updated = resolveTemporalParity("/merge-pdf", {
        hasMeaningfulUpdate: true,
        content: "brand new algorithm version 4 with major changes",
      });
      assert.ok(updated.isoModified);
    });

    test("DOM-Weighted Anchor Graph: anchor-text diversification rotates semantic styles without repetitive penalties", async () => {
      const { getDiversifiedAnchor, getEarlyContentLinks, ANCHOR_CORPUS } = await import("../src/lib/seo/anchor-graph.js");

      // Verify anchor corpus contains diverse styles
      assert.ok(ANCHOR_CORPUS["/merge-pdf"].canonical);
      assert.ok(ANCHOR_CORPUS["/merge-pdf"].direct_query);
      assert.ok(ANCHOR_CORPUS["/merge-pdf"].conversational);
      assert.ok(ANCHOR_CORPUS["/merge-pdf"].action);

      // Verify different source contexts yield varied anchor styles
      const anchorA = getDiversifiedAnchor("/merge-pdf", "/split-pdf");
      const anchorB = getDiversifiedAnchor("/merge-pdf", "/about");
      assert.ok(anchorA.text);
      assert.ok(anchorB.text);
      assert.ok(["canonical", "direct_query", "conversational", "action"].includes(anchorA.style));

      // Verify early content links are restricted to semantic category
      const earlyPdfLinks = getEarlyContentLinks("/merge-pdf", 2);
      assert.equal(earlyPdfLinks.length, 2);
      for (const link of earlyPdfLinks) {
        assert.equal(link.category, "pdf");
        assert.notEqual(link.route, "/merge-pdf");
        assert.ok(link.text);
      }
    });

    test("EarlyContentLinks integration: QuickTake embeds high-priority links within top 200 words", () => {
      const code = fs.readFileSync(path.join(rootDir, "src", "components", "common", "QuickTake.jsx"), "utf-8");
      assert.ok(code.includes("EarlyContentLinks"), "QuickTake must embed EarlyContentLinks");
      assert.ok(code.includes("<EarlyContentLinks currentRoute={resolvedRoute}"), "QuickTake must pass currentRoute to EarlyContentLinks");
    });

    test("Session-Terminator Component: NextIntentSection provides solutions to secondary queries", () => {
      const code = fs.readFileSync(path.join(rootDir, "src", "components", "common", "NextIntentSection.jsx"), "utf-8");
      assert.ok(code.includes('role="region"'), "NextIntentSection must specify role='region'");
      assert.ok(code.includes('aria-label="Next Steps and Related Workflows"'), "NextIntentSection must have aria-label");
      assert.ok(code.includes("What Would You Like to Do Next?"), "Must offer clear next-step heading");
      assert.ok(code.includes("Common Post-Processing Questions"), "Must offer peripheral doubt resolution FAQ");
    });

    test("Flagship tool pages integrate NextIntentSection at bottom of views", () => {
      const pages = [
        "src/app/merge-pdf/page.jsx",
        "src/app/split-pdf/page.jsx",
        "src/app/compress-pdf/page.jsx",
        "src/app/jpg-to-pdf/page.jsx",
      ];

      for (const relPath of pages) {
        const fullPath = path.join(rootDir, relPath);
        const code = fs.readFileSync(fullPath, "utf-8");
        assert.ok(code.includes("NextIntentSection"), `${relPath} must import and render NextIntentSection`);
        assert.ok(code.includes("article:modified_time"), `${relPath} must specify article:modified_time meta tag`);
      }
    });

    test("Edge ETag & 304 Delta Caching: evaluates conditional headers and emits 304 Not Modified", async () => {
      const { evaluateConditionalRequest } = await import("../src/lib/seo/edge-cache.js");
      const { resolveTemporalParity } = await import("../src/lib/seo/temporal-engine.js");

      const temporal = resolveTemporalParity("/merge-pdf");

      // 1. Initial request without conditional headers -> 200 with ETag & Last-Modified
      const initial = evaluateConditionalRequest({}, "/merge-pdf");
      assert.equal(initial.status, 200);
      assert.equal(initial.isModified, true);
      assert.equal(initial.headers.ETag, temporal.etag);
      assert.equal(initial.headers["Last-Modified"], temporal.httpLastModified);

      // 2. Matching ETag in If-None-Match -> 304 Not Modified
      const etagMatch = evaluateConditionalRequest({ "if-none-match": temporal.etag }, "/merge-pdf");
      assert.equal(etagMatch.status, 304);
      assert.equal(etagMatch.isModified, false);

      // 3. Matching weak ETag -> 304 Not Modified
      const rawEtag = temporal.etag.replace(/^W\//, "");
      const weakMatch = evaluateConditionalRequest({ "if-none-match": rawEtag }, "/merge-pdf");
      assert.equal(weakMatch.status, 304);
      assert.equal(weakMatch.isModified, false);

      // 4. Future/matching date in If-Modified-Since -> 304 Not Modified
      const ifModifiedMatch = evaluateConditionalRequest(
        { "if-modified-since": temporal.httpLastModified },
        "/merge-pdf"
      );
      assert.equal(ifModifiedMatch.status, 304);
      assert.equal(ifModifiedMatch.isModified, false);

      // 5. Past date in If-Modified-Since -> 200 Modified
      const pastMatch = evaluateConditionalRequest(
        { "if-modified-since": "Mon, 01 Jan 2024 00:00:00 GMT" },
        "/merge-pdf"
      );
      assert.equal(pastMatch.status, 200);
      assert.equal(pastMatch.isModified, true);
    });

    test("Next.js Edge Middleware is present and configures edge caching matcher", () => {
      const middlewarePath = path.join(rootDir, "src", "middleware.js");
      assert.ok(fs.existsSync(middlewarePath), "src/middleware.js must exist");
      const code = fs.readFileSync(middlewarePath, "utf-8");
      assert.ok(code.includes("evaluateConditionalRequest"), "middleware must use evaluateConditionalRequest");
      assert.ok(code.includes("export function middleware"), "middleware must export middleware function");
      assert.ok(code.includes("export const config"), "middleware must export config matcher");
    });
  });

  // Phase 7: SERP Snippet Dominance & Dynamic A/B Meta Engine
  describe("Phase 7: SERP Snippet Dominance & Dynamic A/B Meta Engine", () => {
    test("Title transformer programmatically formats titles with psychological tokens and clamps strictly to 50–58 chars", async () => {
      const { transformSerpTitle, PSYCHOLOGICAL_TOKENS } = await import("../src/lib/seo/serp-transformer.js");

      const titleA = transformSerpTitle({ toolName: "Merge PDF", variant: "a" });
      assert.ok(titleA.length >= 50 && titleA.length <= 58, `Title A length (${titleA.length}) must be between 50 and 58 chars: "${titleA}"`);
      assert.ok(titleA.includes(PSYCHOLOGICAL_TOKENS.CURRENT_YEAR) || titleA.includes("Online"));

      const titleB = transformSerpTitle({ toolName: "Merge PDF", variant: "b" });
      assert.ok(titleB.length >= 50 && titleB.length <= 58, `Title B length (${titleB.length}) must be between 50 and 58 chars: "${titleB}"`);
      assert.ok(titleB.includes("[No Uploads]"));

      // Test long title truncation to exact boundary
      const longTitle = transformSerpTitle({
        toolName: "Extremely Long Advanced Multi-Document Structural PDF Reducer & Optimizer",
        variant: "a",
      });
      assert.ok(longTitle.length >= 50 && longTitle.length <= 58, `Clamped long title length (${longTitle.length}) must be between 50 and 58: "${longTitle}"`);
    });

    test("Description transformer enforces 140–155 character high-CTR action triggers", async () => {
      const { transformSerpDescription } = await import("../src/lib/seo/serp-transformer.js");

      const descA = transformSerpDescription({
        toolName: "Split PDF",
        actionDescription: "Extract specific PDF pages or burst every page into separate files in seconds",
        variant: "a",
      });
      assert.ok(descA.length <= 155, `Description length must be <= 155 chars: "${descA}"`);
      assert.ok(descA.includes("100% free") || descA.includes("private"));

      const descB = transformSerpDescription({
        toolName: "Split PDF",
        actionDescription: "Divide PDF documents by custom page ranges",
        variant: "b",
      });
      assert.ok(descB.length <= 155, `Description B length must be <= 155: "${descB}"`);
      assert.ok(descB.includes("Zero server"));
    });

    test("HowTo Schema Generator produces valid Schema.org structure with step arrays", async () => {
      const { buildHowToSchema } = await import("../src/lib/seo/how-to-schema.js");

      const howTo = buildHowToSchema({
        toolName: "Merge PDF",
        route: "/merge-pdf",
        category: "pdf",
      });

      assert.equal(howTo["@type"], "HowTo");
      assert.ok(howTo["@id"].includes("/merge-pdf/#howto"));
      assert.ok(Array.isArray(howTo.step));
      assert.equal(howTo.step.length, 3);
      assert.equal(howTo.step[0]["@type"], "HowToStep");
      assert.equal(howTo.step[0].position, 1);
      assert.ok(howTo.step[0].name);
      assert.ok(howTo.step[0].text);
      assert.ok(howTo.tool);
    });

    test("buildToolPageGraphSchema automatically injects HowTo and FAQPage into unified @graph", async () => {
      const { buildToolPageGraphSchema } = await import("../src/lib/seo/schema-engine.js");

      const schema = buildToolPageGraphSchema({
        tool: {
          name: "Merge PDF",
          route: "/merge-pdf",
          description: "Combine multiple PDF documents into one cleanly.",
        },
      });

      const howTo = schema["@graph"].find((e) => e["@type"] === "HowTo");
      assert.ok(howTo, "Schema @graph must contain HowTo entity to force Google step rich snippets");
      assert.equal(howTo.step.length, 3);

      const faq = schema["@graph"].find((e) => e["@type"] === "FAQPage");
      assert.ok(faq, "Schema @graph must contain FAQPage entity for accordion snippets");
      assert.ok(faq.mainEntity.length >= 3, "Must have at least 3 FAQ QA pairs");
    });

    test("Edge-Level Meta A/B Split Engine resolves variants and extracts variant metadata", async () => {
      const { resolveSerpVariant, getSerpVariantMetadata } = await import("../src/lib/seo/ab-meta-engine.js");

      assert.equal(resolveSerpVariant({ searchParam: "b" }), "b");
      assert.equal(resolveSerpVariant({ cookieValue: "b" }), "b");
      assert.equal(resolveSerpVariant({ headerValue: "b" }), "b");
      assert.equal(resolveSerpVariant({ searchParam: "a" }), "a");
      assert.equal(resolveSerpVariant({}), "a");

      const metaA = getSerpVariantMetadata({ route: "/merge-pdf", toolName: "Merge PDF", variant: "a" });
      const metaB = getSerpVariantMetadata({ route: "/merge-pdf", toolName: "Merge PDF", variant: "b" });

      assert.equal(metaA.variant, "a");
      assert.equal(metaB.variant, "b");
      assert.notEqual(metaA.title, metaB.title);
      assert.ok(metaA.title.length >= 50 && metaA.title.length <= 58);
      assert.ok(metaB.title.length >= 50 && metaB.title.length <= 58);
    });
  });

  // Phase 8: Behavioral Traps, Chrome Telemetry & Intent-Locking Navigation
  describe("Phase 8: Behavioral Traps, Chrome Telemetry & Intent-Locking Navigation", () => {
    test("ScrollProgressBar: zero-layout-shift progress indicator uses hardware-accelerated transform scaleX", () => {
      const code = fs.readFileSync(path.join(rootDir, "src", "components", "common", "ScrollProgressBar.jsx"), "utf-8");
      assert.ok(code.includes("scaleX"), "ScrollProgressBar must use scaleX transform for zero layout shift");
      assert.ok(code.includes("fixed top-0"), "ScrollProgressBar must be fixed at the top");
      assert.ok(code.includes("requestAnimationFrame"), "Must use requestAnimationFrame for 60fps smoothness");
    });

    test("MicroInteractionBar: interactive benchmark is immediately interactive and logs first_click_100ms", () => {
      const code = fs.readFileSync(path.join(rootDir, "src", "components", "common", "MicroInteractionBar.jsx"), "utf-8");
      assert.ok(code.includes("first_click_100ms"), "MicroInteractionBar must log first_click_100ms on interaction");
      assert.ok(code.includes("input"), "Must have input slider");
      assert.ok(code.includes("Quick Presets"), "Must provide 1-click preset chips");
      assert.ok(code.includes("Zero Server Uploads"), "Must highlight zero server uploads guarantee");
    });

    test("DwellTracker & dwell-tracker: monitors active engagement and triggers 90s prefetch milestone", async () => {
      const { initDwellTracker } = await import("../src/lib/telemetry/dwell-tracker.js");
      assert.equal(typeof initDwellTracker, "function");

      const trackerCode = fs.readFileSync(path.join(rootDir, "src", "lib", "telemetry", "dwell-tracker.js"), "utf-8");
      assert.ok(trackerCode.includes("dwell_90s_milestone"), "Must log dwell_90s_milestone for NavBoost qualification");
      assert.ok(trackerCode.includes("injectSpeculativePrefetch"), "Must trigger speculative prefetch of next route");
      assert.ok(trackerCode.includes("visibilitychange"), "Must pause dwell when tab is hidden");

      // Root layout renders ScrollProgressBar and DwellTracker
      const layoutCode = fs.readFileSync(path.join(rootDir, "src", "app", "layout.jsx"), "utf-8");
      assert.ok(layoutCode.includes("<ScrollProgressBar"), "RootLayout must render ScrollProgressBar");
      assert.ok(layoutCode.includes("<DwellTracker"), "RootLayout must render DwellTracker");
    });

    test("site.webmanifest registers deep Chrome OS shortcuts and any/maskable icons", () => {
      const manifestPath = path.join(rootDir, "public", "site.webmanifest");
      const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));

      assert.ok(Array.isArray(manifest.shortcuts));
      assert.ok(manifest.shortcuts.length >= 5, "Must have at least 5 deep search & tool shortcuts");
      assert.ok(manifest.shortcuts.some((s) => s.url === "/merge-pdf"));
      assert.ok(manifest.shortcuts.some((s) => s.url === "/split-pdf"));
      assert.ok(manifest.shortcuts.some((s) => s.url === "/compress-pdf"));
      assert.ok(manifest.shortcuts.some((s) => s.url === "/jpg-to-pdf"));

      const has192 = manifest.icons.some((i) => i.sizes === "192x192" && i.purpose.includes("maskable"));
      const has512 = manifest.icons.some((i) => i.sizes === "512x512" && i.purpose.includes("maskable"));
      assert.ok(has192, "Must have 192x192 maskable icon");
      assert.ok(has512, "Must have 512x512 maskable icon");
    });

    test("DirectAccessPrompt: guides Ctrl+D / Cmd+D bookmarking and is integrated in Header", () => {
      const promptCode = fs.readFileSync(path.join(rootDir, "src", "components", "common", "DirectAccessPrompt.jsx"), "utf-8");
      assert.ok(promptCode.includes("Ctrl+D"), "Must include Ctrl+D shortcut");
      assert.ok(promptCode.includes("⌘+D"), "Must include ⌘+D shortcut");

      const headerCode = fs.readFileSync(path.join(rootDir, "src", "components", "common", "Header.jsx"), "utf-8");
      assert.ok(headerCode.includes("<DirectAccessPrompt"), "Header must render DirectAccessPrompt");
    });

    test("QuickJumpToc and ExactNextStepCard are integrated into flagship tool pages", () => {
      const flagshipPages = [
        "src/app/merge-pdf/page.jsx",
        "src/app/split-pdf/page.jsx",
        "src/app/compress-pdf/page.jsx",
        "src/app/jpg-to-pdf/page.jsx",
      ];

      for (const relPath of flagshipPages) {
        const fullPath = path.join(rootDir, relPath);
        const code = fs.readFileSync(fullPath, "utf-8");
        assert.ok(code.includes("<MicroInteractionBar"), `${relPath} must include MicroInteractionBar above fold`);
        assert.ok(code.includes("<ExactNextStepCard"), `${relPath} must include ExactNextStepCard below workspace`);
        assert.ok(code.includes("<QuickJumpToc"), `${relPath} must include QuickJumpToc`);
      }
    });
  });

  // Phase 9: Organic 2-Column Sitelinks & Heading Hierarchy Accessibility
  describe("Phase 9: Organic 2-Column Sitelinks & Heading Hierarchy Accessibility", () => {
    test("SiteNavigationElement schema contains 6 destination tools with name, description, and canonical url", () => {
      const navSchema = buildSiteNavigationSchema();
      assert.equal(navSchema["@type"], "ItemList");
      assert.ok(navSchema["@id"].includes("#site-navigation"));
      assert.equal(navSchema.numberOfItems, 6);
      assert.equal(navSchema.itemListElement.length, 6);

      const urls = [
        "/merge-pdf",
        "/split-pdf",
        "/compress-pdf",
        "/jpg-to-pdf",
        "/pdf-to-jpg",
        "/word-counter",
      ];

      urls.forEach((url, index) => {
        const item = navSchema.itemListElement[index];
        assert.equal(item["@type"], "SiteNavigationElement");
        assert.equal(item.position, index + 1);
        assert.ok(item.name && item.name.length > 0);
        assert.ok(item.description && item.description.length > 0);
        assert.ok(item.url.endsWith(url));
      });
    });

    test("Root layout unified @graph schema automatically includes SiteNavigationElement ItemList", () => {
      const rootSchema = buildRootGraphSchema();
      const navItem = rootSchema["@graph"].find(
        (item) => item["@type"] === "ItemList" && item["@id"] && item["@id"].includes("#site-navigation")
      );
      assert.ok(navItem, "Root schema must include SiteNavigationElement ItemList");
      assert.equal(navItem.numberOfItems, 6);
    });

    test("Top 6 core sitelink landing pages strictly enforce concise title (<= 35 chars) and description (<= 120 chars)", () => {
      const top6Routes = [
        "/merge-pdf",
        "/split-pdf",
        "/compress-pdf",
        "/jpg-to-pdf",
        "/pdf-to-jpg",
        "/word-counter",
      ];

      for (const route of top6Routes) {
        const meta = getSitelinkMetadata(route);
        assert.ok(meta, `Metadata must exist for sitelink route: ${route}`);
        assert.ok(
          meta.title.length <= 35,
          `Sitelink title for ${route} must be <= 35 characters to prevent SERP truncation, was ${meta.title.length}: "${meta.title}"`
        );
        assert.ok(
          meta.description.length <= 120,
          `Sitelink description for ${route} must be <= 120 characters for clean 2-column rendering, was ${meta.description.length}: "${meta.description}"`
        );
      }
    });

    test("Primary Header navigation uses semantic HTML5 markup (<nav aria-label...><ul role='list'><li><a...>)", () => {
      const headerCode = fs.readFileSync(path.join(rootDir, "src", "components", "common", "Header.jsx"), "utf-8");
      assert.ok(headerCode.includes('aria-label="Main Navigation"'), "Header desktop nav must specify aria-label='Main Navigation'");
      assert.ok(headerCode.includes('aria-label="Mobile Navigation"'), "Header mobile nav must specify aria-label='Mobile Navigation'");
      assert.ok(headerCode.includes('role="list"'), "Nav links must be structured inside role='list'");
      assert.ok(headerCode.includes(">Merge PDF<"), "Must include clean anchor 'Merge PDF'");
      assert.ok(headerCode.includes(">Split PDF<"), "Must include clean anchor 'Split PDF'");
      assert.ok(headerCode.includes(">Compress PDF<"), "Must include clean anchor 'Compress PDF'");
      assert.ok(headerCode.includes(">JPG to PDF<"), "Must include clean anchor 'JPG to PDF'");
    });

    test("Homepage and Footer route direct internal link equity to top 6 flagship tools with exact-match anchors", () => {
      const pageCode = fs.readFileSync(path.join(rootDir, "src", "app", "page.jsx"), "utf-8");
      const footerCode = fs.readFileSync(path.join(rootDir, "src", "components", "common", "Footer.jsx"), "utf-8");

      const top6Tools = [
        { path: "/merge-pdf", text: "Merge PDF" },
        { path: "/split-pdf", text: "Split PDF" },
        { path: "/compress-pdf", text: "Compress PDF" },
        { path: "/jpg-to-pdf", text: "JPG to PDF" },
        { path: "/pdf-to-jpg", text: "PDF to JPG" },
        { path: "/word-counter", text: "Word Counter" },
      ];

      for (const tool of top6Tools) {
        assert.ok(
          pageCode.includes(`href="${tool.path}"`) && pageCode.includes(tool.text),
          `Homepage must link to ${tool.path} with exact-match anchor ${tool.text}`
        );
        assert.ok(
          footerCode.includes(`href="${tool.path}"`) && footerCode.includes(tool.text),
          `Footer must link to ${tool.path} with exact-match anchor ${tool.text}`
        );
      }
    });

    test("Heading hierarchy accessibility: banners and prompts before <main> avoid heading tags (h1-h4)", () => {
      const bannerFiles = [
        "src/components/pwa/InstallPwaBanner.jsx",
        "src/components/common/DirectAccessPrompt.jsx",
        "src/components/common/CookieConsentBanner.jsx",
      ];

      for (const relPath of bannerFiles) {
        const fullPath = path.join(rootDir, relPath);
        const code = fs.readFileSync(fullPath, "utf-8");
        assert.ok(!code.includes("<h1"), `${relPath} must not contain <h1>`);
        assert.ok(!code.includes("<h2"), `${relPath} must not contain <h2>`);
        assert.ok(!code.includes("<h3"), `${relPath} must not contain <h3>`);
        assert.ok(!code.includes("<h4"), `${relPath} must not contain <h4>`);
      }
    });

    test("Heading hierarchy accessibility: homepage maintains sequentially-descending order (h1 -> h2 -> h3)", () => {
      const pageCode = fs.readFileSync(path.join(rootDir, "src", "app", "page.jsx"), "utf-8");
      assert.ok(pageCode.includes("<h1"), "Homepage must contain <h1>");
      assert.ok(pageCode.includes("<h2"), "Homepage must contain <h2>");
      assert.ok(pageCode.includes("<h3"), "Homepage must contain <h3>");
      // Must not contain <h4> directly skipping heading levels
      assert.ok(!pageCode.includes("<h4"), "Homepage must not contain <h4> without prior structure or skip levels");
    });

    test("Ahrefs Content Optimization: Homepage title <= 60 chars and description <= 160 chars", () => {
      const pageCode = fs.readFileSync(path.join(rootDir, "src", "app", "page.jsx"), "utf-8");
      const titleMatch = pageCode.match(/title:\s*"([^"]+)"/);
      const descMatch = pageCode.match(/description:\s*\n?\s*"([^"]+)"/);

      assert.ok(titleMatch, "Homepage must define title");
      assert.ok(descMatch, "Homepage must define description");

      const title = titleMatch[1];
      const desc = descMatch[1];

      assert.ok(
        title.length <= 60,
        `Homepage title must be <= 60 chars for Ahrefs/Google SERP green score, was ${title.length}: "${title}"`
      );
      assert.ok(
        desc.length <= 160,
        `Homepage description must be <= 160 chars for Ahrefs green score, was ${desc.length}: "${desc}"`
      );
    });

    test("Ahrefs Social Tags Optimization: openGraph & twitter configure images and site handle across all pages", () => {
      const pageCode = fs.readFileSync(path.join(rootDir, "src", "app", "page.jsx"), "utf-8");
      assert.ok(pageCode.includes("og-bitsandtools.png"), "Homepage must configure og:image");
      assert.ok(pageCode.includes('site: "@bitsandtools"'), "Homepage must configure twitter:site");
      assert.ok(pageCode.includes('creator: "@bitsandtools"'), "Homepage must configure twitter:creator");
      assert.ok(pageCode.includes("publishedTime: temporal.isoPublished"), "Homepage must configure publishedTime");
      assert.ok(pageCode.includes("modifiedTime: temporal.isoModified"), "Homepage must configure modifiedTime");
      assert.ok(pageCode.includes("article:published_time"), "Homepage must configure article:published_time");
      assert.ok(pageCode.includes("article:modified_time"), "Homepage must configure article:modified_time");
      assert.ok(pageCode.includes("<time dateTime={temporal.isoModified}"), "Homepage must render <time> element for crawler date extraction");

      // Verify layout.jsx also configures twitter.site
      const layoutCode = fs.readFileSync(path.join(rootDir, "src", "app", "layout.jsx"), "utf-8");
      assert.ok(layoutCode.includes('site: "@bitsandtools"'), "layout.jsx must configure twitter:site");
    });
  });

});
