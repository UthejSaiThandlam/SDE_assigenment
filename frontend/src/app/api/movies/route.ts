import { NextResponse } from "next/server";
import { MOCK_MOVIES } from "@/data/mockData";
import { ContentItem } from "@/types/content";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "";
  const apiKey = process.env.WATCHMODE_API_KEY;

  // ── Watchmode API ──────────────────────────────────────────────────────────
  if (apiKey) {
    try {
      const wmUrl = query
        ? `https://api.watchmode.com/v1/autocomplete-search/?apiKey=${apiKey}&search_value=${encodeURIComponent(query)}&search_type=2`
        : `https://api.watchmode.com/v1/releases/?apiKey=${apiKey}&limit=12`;

      console.log(`[Movies] Watchmode request: ${wmUrl.replace(apiKey, "***")}`);

      const res = await fetch(wmUrl, {
        headers: { "User-Agent": "AuraPulse/1.0" },
        next: { revalidate: 600 },
        signal: AbortSignal.timeout(6000),
      });

      console.log(`[Movies] Watchmode status: ${res.status}`);

      if (res.ok) {
        const data = await res.json();

        // Autocomplete search results
        if (data.results && data.results.length > 0) {
          const items: ContentItem[] = data.results.slice(0, 12).map((r: any) => ({
            id: `movie-wm-${r.id}`,
            type: "movie" as const,
            title: r.name,
            description: `${r.type ? r.type.replace(/_/g, " ") + " · " : ""}Released ${r.year || "recently"}. Stream, ratings, and full cast details available.`,
            category: "entertainment" as const,
            image: r.image_url || "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80",
            url: r.id ? `https://www.watchmode.com/title/${r.id}/` : "https://www.watchmode.com",
            publishedAt: r.year ? `${r.year}-06-01T00:00:00.000Z` : new Date().toISOString(),
            source: "Watchmode",
            metadata: {
              rating: Math.min(10, Math.max(1, Math.round(((Number(r.relevance) || 80) / 10) * 10) / 10)) || 8.0,
              votes: 2000,
            },
          }));
          return NextResponse.json({ source: "live", items });
        }

        // Releases list
        if (data.releases && data.releases.length > 0) {
          const items: ContentItem[] = data.releases.slice(0, 12).map((rel: any) => ({
            id: `movie-wm-${rel.id}`,
            type: "movie" as const,
            title: rel.title,
            description: rel.source_name ? `Now streaming on ${rel.source_name}. Explore ratings, cast and full episode guide.` : "Trending cinema and streaming title. Explore ratings and cast.",
            category: "entertainment" as const,
            image: rel.poster_url || "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80",
            url: rel.id ? `https://www.watchmode.com/title/${rel.id}/` : "https://www.watchmode.com",
            publishedAt: rel.source_release_date ? new Date(rel.source_release_date).toISOString() : new Date().toISOString(),
            source: rel.source_name ? `Watchmode · ${rel.source_name}` : "Watchmode",
            metadata: { rating: 8.2, votes: 1800 },
          }));
          return NextResponse.json({ source: "live", items });
        }

        console.log("[Movies] Watchmode returned empty results — serving curated fallback");
      } else {
        console.warn(`[Movies] Watchmode error ${res.status}`);
      }
    } catch (err: any) {
      console.warn("[Movies] Watchmode fetch failed:", err.name === "TimeoutError" ? "Request timed out" : err.message);
    }
  } else {
    console.warn("[Movies] No WATCHMODE_API_KEY set in .env.local");
  }

  // ── Curated Fallback ───────────────────────────────────────────────────────
  let filtered = [...MOCK_MOVIES];
  if (query) {
    const q = query.toLowerCase();
    filtered = filtered.filter(
      (m) => m.title.toLowerCase().includes(q) || m.description.toLowerCase().includes(q)
    );
  }

  return NextResponse.json({
    source: "curated_fallback",
    items: filtered,
    message: apiKey ? "Watchmode network unreachable — showing curated cinema recommendations." : "Add WATCHMODE_API_KEY to .env.local for live cinema data.",
  });
}
