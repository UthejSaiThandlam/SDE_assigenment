import { ContentItem } from "../types/content";
import { MOCK_MOVIES } from "../data/mockData";

export class MoviesService {
  async getMovies(query?: string): Promise<{ source: string; items: ContentItem[] }> {
    const apiKey = process.env.WATCHMODE_API_KEY;

    if (apiKey) {
      try {
        const wmUrl = query
          ? `https://api.watchmode.com/v1/autocomplete-search/?apiKey=${apiKey}&search_value=${encodeURIComponent(query)}&search_type=2`
          : `https://api.watchmode.com/v1/releases/?apiKey=${apiKey}&limit=12`;

        console.log(`[MoviesService] Watchmode: ${wmUrl.replace(apiKey, "***")}`);

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 6000);
        const res = await fetch(wmUrl, {
          headers: { "User-Agent": "AuraPulse/1.0" },
          signal: controller.signal,
        });
        clearTimeout(timeout);

        console.log(`[MoviesService] Watchmode status: ${res.status}`);

        if (res.ok) {
          const data: any = await res.json();

          // Autocomplete search results
          if (data.results && data.results.length > 0) {
            const items: ContentItem[] = data.results.slice(0, 12).map((r: any) => ({
              id: `movie-wm-${r.id}`,
              type: "movie" as const,
              title: r.name,
              description: `${r.type ? r.type.replace(/_/g, " ") + " · " : ""}Released ${r.year || "recently"}. Stream, ratings, and cast details available.`,
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
            return { source: "live", items };
          }

          // Releases list
          if (data.releases && data.releases.length > 0) {
            const items: ContentItem[] = data.releases.slice(0, 12).map((rel: any) => ({
              id: `movie-wm-${rel.id}`,
              type: "movie" as const,
              title: rel.title,
              description: rel.source_name
                ? `Now streaming on ${rel.source_name}. Explore ratings, cast and full episode guide.`
                : "Trending cinema and streaming title.",
              category: "entertainment" as const,
              image: rel.poster_url || "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80",
              url: rel.id ? `https://www.watchmode.com/title/${rel.id}/` : "https://www.watchmode.com",
              publishedAt: rel.source_release_date
                ? new Date(rel.source_release_date).toISOString()
                : new Date().toISOString(),
              source: rel.source_name ? `Watchmode · ${rel.source_name}` : "Watchmode",
              metadata: { rating: 8.2, votes: 1800 },
            }));
            return { source: "live", items };
          }
        } else {
          console.warn(`[MoviesService] Watchmode returned ${res.status}`);
        }
      } catch (err: any) {
        if (err.name === "AbortError") {
          console.warn("[MoviesService] Watchmode timed out — using curated fallback");
        } else {
          console.warn("[MoviesService] Watchmode error:", err.message);
        }
      }
    } else {
      console.warn("[MoviesService] No WATCHMODE_API_KEY in backend .env");
    }

    // Curated Resilient Fallback
    let items = [...MOCK_MOVIES];
    if (query) {
      const q = query.toLowerCase();
      items = items.filter(
        (m) => m.title.toLowerCase().includes(q) || m.description.toLowerCase().includes(q)
      );
    }

    console.log(`[MoviesService] Serving ${items.length} curated fallback movies`);
    return { source: "curated_fallback", items };
  }
}
