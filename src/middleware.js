import { NextResponse } from "next/server";
import { evaluateConditionalRequest } from "./lib/seo/edge-cache.js";
import { SERP_COOKIE_NAME, SERP_HEADER_NAME } from "./lib/seo/ab-meta-engine.js";
import { isAiCrawler, isMarkdownPreferred, generateRouteMarkdown } from "./lib/seo/ai-markdown-generator.js";

/**
 * Edge Middleware for:
 * 1. AI Search & LLM Dual-Mode Content Negotiation (GPTBot, Perplexity, Claude, etc.)
 *    Streams token-optimized clean Markdown directly, bypassing client JS hydration.
 * 2. Delta Caching & ETag Validation (304 Not Modified crawl budget optimization).
 * 3. SERP A/B Split Testing & Variant Assignment.
 */
export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Skip static assets, Next internals, api routes, and files with extensions
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // 1. AI Crawler & Markdown Content Negotiation
  const userAgent = request.headers.get("user-agent") || "";
  const wantsMarkdown =
    isAiCrawler(userAgent) ||
    isMarkdownPreferred(request.headers, request.nextUrl.searchParams);

  if (wantsMarkdown) {
    const markdownBody = generateRouteMarkdown(pathname);
    return new Response(markdownBody, {
      status: 200,
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        "Vary": "Accept, User-Agent",
        "X-Robots-Tag": "all",
        "X-Content-Type-Options": "nosniff",
        "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400",
      },
    });
  }

  // 2. Edge ETag & 304 Delta Caching Evaluation
  const evaluation = evaluateConditionalRequest(request.headers, pathname);

  if (evaluation.status === 304) {
    return new NextResponse(null, {
      status: 304,
      headers: evaluation.headers,
    });
  }

  // 3. SERP A/B Variant Resolution (?serp_v=b, cookie bts_serp_v, or balanced split)
  const queryVariant = request.nextUrl.searchParams.get("serp_v");
  const cookieVariant = request.cookies.get(SERP_COOKIE_NAME)?.value;
  let activeVariant = "a";

  if (queryVariant === "b" || queryVariant === "a") {
    activeVariant = queryVariant;
  } else if (cookieVariant === "b" || cookieVariant === "a") {
    activeVariant = cookieVariant;
  } else {
    // Balanced 50/50 split based on client characteristics
    const seed = request.headers.get("x-forwarded-for") || request.headers.get("user-agent") || "";
    activeVariant = seed.length % 2 === 0 ? "a" : "b";
  }

  const response = NextResponse.next();

  // Attach temporal caching headers
  for (const [key, value] of Object.entries(evaluation.headers)) {
    response.headers.set(key, value);
  }

  // Attach SERP A/B variant header & cookie
  response.headers.set(SERP_HEADER_NAME, activeVariant);
  response.cookies.set(SERP_COOKIE_NAME, activeVariant, {
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    sameSite: "lax",
  });

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt, etc.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|xml|txt)$).*)",
  ],
};
