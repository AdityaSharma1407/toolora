import { NextResponse } from "next/server";
import { evaluateConditionalRequest } from "./lib/seo/edge-cache.js";
import { SERP_COOKIE_NAME, SERP_HEADER_NAME } from "./lib/seo/ab-meta-engine.js";

/**
 * Edge Middleware for Delta Caching, ETag Validation & Meta A/B Split Testing
 * 
 * 1. Inspects If-None-Match and If-Modified-Since against the verified temporal engine.
 *    Emits 304 Not Modified when fresh, preserving search engine crawl budget.
 * 2. Assigns & tracks randomized or query-driven SERP meta variants (A/B testing)
 *    to measure click-through rate performance and dwell-time affinity.
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

  // 1. Edge ETag & 304 Delta Caching Evaluation
  const evaluation = evaluateConditionalRequest(request.headers, pathname);

  if (evaluation.status === 304) {
    return new NextResponse(null, {
      status: 304,
      headers: evaluation.headers,
    });
  }

  // 2. SERP A/B Variant Resolution (?serp_v=b, cookie bts_serp_v, or balanced split)
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
