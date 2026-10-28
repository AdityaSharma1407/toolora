import { NextResponse } from "next/server";
import { evaluateConditionalRequest } from "./lib/seo/edge-cache.js";

/**
 * Edge Middleware for Delta Caching & ETag Validation
 * 
 * Inspects If-None-Match and If-Modified-Since against the verified temporal engine.
 * Emits 304 Not Modified when fresh, preserving search engine crawl budget.
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

  const evaluation = evaluateConditionalRequest(request.headers, pathname);

  if (evaluation.status === 304) {
    return new NextResponse(null, {
      status: 304,
      headers: evaluation.headers,
    });
  }

  const response = NextResponse.next();
  for (const [key, value] of Object.entries(evaluation.headers)) {
    response.headers.set(key, value);
  }

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
