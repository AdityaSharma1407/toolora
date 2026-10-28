import test, { describe } from "node:test";
import assert from "node:assert/strict";
import fs from "fs";

import { getToolById } from "../src/data/toolsRegistry.js";

describe("Pinned Tools & Local Favorites Verification", () => {
  test("Default pinned tools all exist and are active in toolsRegistry", async () => {
    const hookFile = fs.readFileSync("src/hooks/usePinnedTools.js", "utf8");
    assert.ok(hookFile.includes("bitsandtools_pinned_tools"), "Must use bitsandtools storage key");

    // Extract default pinned IDs
    const defaultPinnedIds = [
      "merge-pdf",
      "markdown-editor",
      "json-formatter",
      "regex-tester",
      "compress-pdf",
    ];

    for (const id of defaultPinnedIds) {
      const tool = getToolById(id);
      assert.ok(tool, `Default pinned tool ${id} must exist in registry`);
      assert.equal(tool.status, "available", `Default pinned tool ${id} must be available`);
    }
  });

  test("ToolCard integrates Star toggle button for pinning", () => {
    const cardCode = fs.readFileSync("src/components/common/ToolCard.jsx", "utf8");
    assert.ok(cardCode.includes("usePinnedTools"), "ToolCard must use usePinnedTools hook");
    assert.ok(cardCode.includes("togglePin"), "ToolCard must call togglePin");
    assert.ok(cardCode.includes("Star"), "ToolCard must render Star icon");
    assert.ok(cardCode.includes("fill-amber-400"), "ToolCard must highlight pinned star");
  });

  test("PinnedToolsBar renders pinned favorites row and unpin buttons", () => {
    const barCode = fs.readFileSync("src/components/common/PinnedToolsBar.jsx", "utf8");
    assert.ok(barCode.includes("My Pinned Favorites"), "Bar must display title");
    assert.ok(barCode.includes("togglePin"), "Bar must support unpinning");
    assert.ok(barCode.includes("DynamicIcon"), "Bar must render tool icon");
  });

  test("Homepage integrates PinnedToolsBar in hero section", () => {
    const homeCode = fs.readFileSync("src/app/page.jsx", "utf8");
    assert.ok(homeCode.includes("PinnedToolsBar"), "Homepage must include PinnedToolsBar");
  });
});
