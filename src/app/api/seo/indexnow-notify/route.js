import { siteConfig } from "../../../../config/site.js";
import {
  INDEXNOW_KEY,
  INDEXNOW_ENDPOINT,
  INDEXNOW_KEY_LOCATION,
  submitToIndexNow,
} from "../../../../lib/seo/indexnow.js";
import { getFreshSitemapEntries } from "../../../../lib/seo/sitemaps.js";

export const dynamic = "force-dynamic";

/**
 * GET /api/seo/indexnow-notify
 * Health check & status inspector for IndexNow configuration
 */
export async function GET() {
  const baseUrl = (siteConfig.url || "https://www.bitsandtools.com").replace(/\/$/, "");

  return Response.json({
    service: "Bits & Tools IndexNow Notification Dispatcher",
    status: "active",
    endpoint: INDEXNOW_ENDPOINT,
    host: new URL(baseUrl).hostname,
    key: INDEXNOW_KEY,
    keyLocation: INDEXNOW_KEY_LOCATION,
    timestamp: new Date().toISOString(),
  });
}

/**
 * POST /api/seo/indexnow-notify
 * Dispatches instant crawl pings to IndexNow (Bing, Yandex, Seznam, Naver)
 * 
 * Body options:
 * - { urls: string[] }
 * - { slug: string }
 * - (empty): automatically submits all URLs modified in the last 48 hours
 */
export async function POST(request) {
  const baseUrl = (siteConfig.url || "https://www.bitsandtools.com").replace(/\/$/, "");

  let targetUrls = [];

  try {
    const body = await request.json().catch(() => ({}));

    if (Array.isArray(body?.urls) && body.urls.length > 0) {
      targetUrls = body.urls;
    } else if (body?.slug) {
      const slug = body.slug.startsWith("/") ? body.slug : `/${body.slug}`;
      targetUrls = [`${baseUrl}${slug}`];
    } else {
      // Auto-harvest all fresh URLs modified in the last 48 hours
      const freshEntries = getFreshSitemapEntries(baseUrl, 48);
      targetUrls = freshEntries.map((e) => e.url);
    }
  } catch {
    // If request has no valid JSON, fallback to fresh sitemap
    const freshEntries = getFreshSitemapEntries(baseUrl, 48);
    targetUrls = freshEntries.map((e) => e.url);
  }

  if (targetUrls.length === 0) {
    return Response.json(
      {
        success: false,
        error: "No URLs resolved for IndexNow distribution",
        timestamp: new Date().toISOString(),
      },
      { status: 400 }
    );
  }

  const result = await submitToIndexNow(targetUrls);

  return Response.json(
    {
      success: result.success,
      status: result.status,
      message: result.message,
      submittedCount: targetUrls.length,
      urlList: targetUrls,
      timestamp: new Date().toISOString(),
    },
    { status: result.success ? 200 : result.status || 500 }
  );
}
