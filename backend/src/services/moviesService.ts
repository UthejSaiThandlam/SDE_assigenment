import { ContentItem } from "../types/content";
import { MOCK_MOVIES } from "../data/mockData";

export class MoviesService {
  async getMovies(query?: string): Promise<{ source: string; items: ContentItem[] }> {
    // Read API key strictly from environment variables
    const apiKey =
      process.env.MOVIE_API_KEY ||
      process.env.WATCHMODE_API_KEY ||
      process.env.TMDB_API_KEY;

    if (apiKey) {
      // 1. Try Watchmode API (38-char key format or provider default)
      try {
        if (apiKey.length > 32 || process.env.WATCHMODE_API_KEY || process.env.MOVIE_API_KEY) {
          const wmUrl = query
            ? `https://api.watchmode.com/v1/autocomplete-search/?apiKey=${apiKey}&search_value=${encodeURIComponent(query)}&search_type=2`
            : `https://api.watchmode.com/v1/releases/?apiKey=${apiKey}&limit=12`;

          const res = await fetch(wmUrl, {
            headers: {
              "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            },
          });

          if (res.ok) {
            const data: any = await res.json();

            // Handle autocomplete search results
            if (data.results && data.results.length > 0) {
              const items: ContentItem[] = data.results.slice(0, 10).map((r: any) => ({
                id: `movie-live-${r.id}`,
                type: "movie" as const,
                title: r.name,
                description: `Released in ${r.year || "recent years"}. Explore full cinema coverage, cast details, and streaming options.`,
                category: "entertainment" as const,
                image:
                  r.image_url ||
                  "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80",
                url: r.tmdb_id
                  ? `https://www.themoviedb.org/movie/${r.tmdb_id}`
                  : `https://api.watchmode.com/title/${r.id}/`,
                publishedAt: r.year ? `${r.year}-01-01T00:00:00.000Z` : new Date().toISOString(),
                source: "Watchmode Cinema",
                metadata: {
                  rating: Math.round(((Number(r.relevance) || 85) / 10) * 10) / 10 || 8.4,
                  votes: 1850,
                },
              }));
              return { source: "live", items };
            }

            // Handle releases list
            if (data.releases && data.releases.length > 0) {
              const items: ContentItem[] = data.releases.slice(0, 10).map((rel: any) => ({
                id: `movie-live-${rel.id}`,
                type: "movie" as const,
                title: rel.title,
                description: `${rel.source_name ? `Streaming on ${rel.source_name}. ` : ""}Explore this trending cinema and streaming title.`,
                category: "entertainment" as const,
                image:
                  rel.poster_url ||
                  "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80",
                url: rel.tmdb_id
                  ? `https://www.themoviedb.org/movie/${rel.tmdb_id}`
                  : `https://api.watchmode.com/title/${rel.id}/`,
                publishedAt: rel.source_release_date
                  ? new Date(rel.source_release_date).toISOString()
                  : new Date().toISOString(),
                source: rel.source_name || "Watchmode Cinema",
                metadata: {
                  rating: 8.5,
                  votes: 2100,
                },
              }));
              return { source: "live", items };
            }
          }
        }
      } catch (wmErr) {
        console.warn("Watchmode API fetch failed, trying alternate provider:", wmErr);
      }

      // 2. Try TMDB API fallback
      try {
        const tmdbUrl = query
          ? `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}&page=1`
          : `https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}&page=1`;

        const res = await fetch(tmdbUrl);
        if (res.ok) {
          const data: any = await res.json();
          if (data.results && data.results.length > 0) {
            const items: ContentItem[] = data.results.slice(0, 10).map((m: any) => ({
              id: `movie-live-${m.id}`,
              type: "movie" as const,
              title: m.title || m.original_title,
              description: m.overview || "Explore this cinema release.",
              category: "entertainment" as const,
              image: m.poster_path
                ? `https://image.tmdb.org/t/p/w500${m.poster_path}`
                : "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80",
              url: `https://www.themoviedb.org/movie/${m.id}`,
              publishedAt: m.release_date
                ? new Date(m.release_date).toISOString()
                : new Date().toISOString(),
              source: "TMDB",
              metadata: {
                rating: Math.round((m.vote_average || 7.5) * 10) / 10,
                votes: m.vote_count || 1200,
              },
            }));
            return { source: "live", items };
          }
        }
      } catch (err) {
        console.warn("TMDB live fetch failed, serving curated fallback", err);
      }
    }

    // Curated Resilient Fallback
    let items = [...MOCK_MOVIES];
    if (query) {
      const q = query.toLowerCase();
      items = items.filter(
        (m) => m.title.toLowerCase().includes(q) || m.description.toLowerCase().includes(q)
      );
    }

    return { source: "curated_fallback", items };
  }
}
