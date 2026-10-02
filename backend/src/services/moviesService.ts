import { ContentItem } from "../types/content";
import { MOCK_MOVIES } from "../data/mockData";

export class MoviesService {
  async getMovies(query?: string): Promise<{ source: string; items: ContentItem[] }> {
    const apiKey = process.env.TMDB_API_KEY;

    if (apiKey) {
      try {
        const url = query
          ? `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}&page=1`
          : `https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}&page=1`;

        const res = await fetch(url);
        if (res.ok) {
          const data: any = await res.json();
          if (data.results && data.results.length > 0) {
            const items: ContentItem[] = data.results.slice(0, 10).map((m: any) => ({
              id: `movie-live-${m.id}`,
              type: "movie" as const,
              title: m.title || m.original_title,
              description: m.overview || "Explore this cinema release on TMDB.",
              category: "entertainment" as const,
              image: m.poster_path
                ? `https://image.tmdb.org/t/p/w500${m.poster_path}`
                : "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80",
              url: `https://www.themoviedb.org/movie/${m.id}`,
              publishedAt: m.release_date ? new Date(m.release_date).toISOString() : new Date().toISOString(),
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
        console.warn("MoviesService live fetch failed, serving curated fallback", err);
      }
    }

    // Curated Fallback
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
