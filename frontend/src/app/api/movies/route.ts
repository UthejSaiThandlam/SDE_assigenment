import { NextResponse } from "next/server";
import { MOCK_MOVIES } from "@/data/mockData";
import { ContentItem } from "@/types/content";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "";

  const apiKey = process.env.TMDB_API_KEY;

  if (apiKey) {
    try {
      const tmdbUrl = query
        ? `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}&page=1`
        : `https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}&page=1`;

      const res = await fetch(tmdbUrl, { next: { revalidate: 600 } });
      if (res.ok) {
        const json = await res.json();
        if (json.results && json.results.length > 0) {
          const items: ContentItem[] = json.results.slice(0, 10).map((m: any) => ({
            id: `movie-live-${m.id}`,
            type: "movie" as const,
            title: m.title || m.original_title,
            description: m.overview || "Explore this trending title on TMDB.",
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

          return NextResponse.json({ source: "live", items });
        }
      }
    } catch (err) {
      console.warn("TMDB fetch failed, falling back to curated movie recommendations:", err);
    }
  }

  // Fallback
  let filtered = [...MOCK_MOVIES];
  if (query) {
    const qLower = query.toLowerCase();
    filtered = filtered.filter(
      (m) => m.title.toLowerCase().includes(qLower) || m.description.toLowerCase().includes(qLower)
    );
  }

  return NextResponse.json({
    source: "curated_fallback",
    items: filtered,
    message: apiKey ? "TMDB quota or network error; showing curated movies." : "Add TMDB_API_KEY to .env.local for live movie recommendations.",
  });
}
