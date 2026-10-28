import { NextResponse } from "next/server";
import { submitToIndexNow, INDEXNOW_KEY } from "@/lib/seo/indexnow";
import { getAllTools } from "@/data/toolsRegistry";
import { siteConfig } from "@/config/site";

export const dynamic = "force-dynamic";

/**
 * POST /api/seo/indexnow
 * Accepts JSON: { urls: ["https://www.bitsandtools.com/merge-pdf"], key?: string }
 * If no URLs provided, submits all live tool routes from the registry.
 */
export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const baseUrl = (siteConfig.url || "https://www.bitsandtools.com").replace(/\/$/, "");

    let targetUrls = body.urls;

    if (!Array.isArray(targetUrls) || targetUrls.length === 0) {
      const allTools = getAllTools().filter((t) => t.status === "available");
      targetUrls = [
        `${baseUrl}/`,
        `${baseUrl}/about`,
        `${baseUrl}/pdf-tools`,
        `${baseUrl}/image-tools`,
        `${baseUrl}/convert-tools`,
        `${baseUrl}/media-tools`,
        `${baseUrl}/utility-tools`,
        ...allTools.map((t) => `${baseUrl}${t.route}`),
      ];
    }

    const result = await submitToIndexNow(targetUrls);

    return NextResponse.json(
      {
        ...result,
        key: INDEXNOW_KEY,
        submittedCount: targetUrls.length,
      },
      { status: result.status >= 200 && result.status < 300 ? 200 : result.status }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * GET /api/seo/indexnow
 * Returns verification instructions and key location.
 */
export async function GET() {
  const baseUrl = (siteConfig.url || "https://www.bitsandtools.com").replace(/\/$/, "");
  return NextResponse.json({
    protocol: "IndexNow",
    endpoint: "https://api.indexnow.org/indexnow",
    key: INDEXNOW_KEY,
    keyLocation: `${baseUrl}/${INDEXNOW_KEY}.txt`,
    status: "active",
  });
}
