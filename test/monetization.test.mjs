import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { siteConfig } from "../src/config/site.js";
import { trackEvent, trackToolUsage } from "../src/lib/analytics.js";

describe("Monetization & Advertising Configuration", () => {
  test("monetization is disabled by default", () => {
    assert.equal(siteConfig.monetization.enabled, false);
    assert.equal(siteConfig.ads.enabled, false);
  });

  test("AdSense publisher client ID defaults to empty or environment variable", () => {
    // Should never contain a hardcoded fake publisher ID in source code
    assert.ok(
      siteConfig.monetization.adsense.client === "" ||
        siteConfig.monetization.adsense.client.startsWith("ca-pub-")
    );
  });

  test("named ad placements are properly configured in central registry", () => {
    const slots = siteConfig.monetization.adsense.slots;
    assert.ok("home-top" in slots);
    assert.ok("home-content" in slots);
    assert.ok("home-bottom" in slots);
    assert.ok("tool-top" in slots);
    assert.ok("tool-bottom" in slots);
    assert.ok("category-content" in slots);
  });

  test("analytics is disabled by default and handles tracking calls safely", () => {
    assert.equal(siteConfig.analytics.enabled, false);

    // Calling trackToolUsage or trackEvent when analytics is disabled must execute safely as a no-op
    assert.doesNotThrow(() => {
      trackToolUsage("merge-pdf", "complete", {
        fileCount: 3,
        pageCount: 10,
        // Sensitive parameters that must never be transmitted:
        name: "Confidential_Tax_Form.pdf",
        fileName: "Confidential_Tax_Form.pdf",
      });
    });

    assert.doesNotThrow(() => {
      trackEvent("page_view", { path: "/merge-pdf" });
    });
  });

  test("consent configuration specifies standard storage key", () => {
    assert.equal(siteConfig.consent.storageKey, "bitsandtools_consent_preferences");
    assert.equal(siteConfig.consent.requiredForAds, true);
  });

  test("site configuration specifies correct email and canonical deployed domain", () => {
    // Verified user personal email is centralized
    assert.equal(
      siteConfig.contactEmail,
      process.env.NEXT_PUBLIC_CONTACT_EMAIL || "sharmaaditya14jul@gmail.com"
    );
    assert.notEqual(siteConfig.contactEmail, "contact@bitsandtools.com");

    // Canonical domain matches deployed domain by default until custom domain configured
    assert.equal(
      siteConfig.url,
      process.env.NEXT_PUBLIC_SITE_URL || "https://www.bitsandtools.com"
    );
  });
});
