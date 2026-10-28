import { generateLlmsTxt } from "../../lib/seo/ai-markdown-generator.js";

export const dynamic = "force-static";
export const revalidate = 86400; // 24 hours

export async function GET() {
  const content = generateLlmsTxt();

  return new Response(content, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400, stale-while-revalidate=3600",
      "X-Robots-Tag": "all",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
