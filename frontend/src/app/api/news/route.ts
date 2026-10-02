import { NextResponse } from "next/server";
import { MOCK_NEWS } from "@/data/mockData";
import { ContentItem } from "@/types/content";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") || "";
  const query = searchParams.get("q") || "";

  const apiKey = process.env.NEWS_API_KEY;

  if (apiKey) {
    try {
      // NewsAPI category mapping
      const newsCategory = category === "finance" ? "business" : category === "ai" ? "technology" : category || "technology";
      const newsUrl = query
        ? `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&sortBy=publishedAt&pageSize=10&apiKey=${apiKey}`
        : `https://newsapi.org/v2/top-headlines?category=${newsCategory}&pageSize=10&apiKey=${apiKey}`;

      const res = await fetch(newsUrl, { next: { revalidate: 300 } });
      if (res.ok) {
        const json = await res.json();
        if (json.articles && json.articles.length > 0) {
          const items: ContentItem[] = json.articles
            .filter((a: any) => a.title && a.title !== "[Removed]")
            .map((a: any, idx: number) => ({
              id: `news-live-${idx}-${Date.now()}`,
              type: "news" as const,
              title: a.title,
              description: a.description || a.content || "Read full coverage at original source.",
              category: (category as any) || "technology",
              image: a.urlToImage || "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80",
              url: a.url,
              publishedAt: a.publishedAt || new Date().toISOString(),
              source: a.source?.name || "News Network",
              metadata: {
                author: a.author || undefined,
                likes: Math.floor(Math.random() * 500) + 120,
              },
            }));

          return NextResponse.json({ source: "live", items });
        }
      }
    } catch (err) {
      console.warn("NewsAPI fetch failed, falling back to curated news dataset:", err);
    }
  }

  // Resilient Fallback Dataset
  let filtered = [...MOCK_NEWS];
  if (category && category !== "general") {
    filtered = filtered.filter((n) => n.category.toLowerCase() === category.toLowerCase());
    if (filtered.length === 0) filtered = MOCK_NEWS;
  }
  if (query) {
    const qLower = query.toLowerCase();
    filtered = filtered.filter(
      (n) => n.title.toLowerCase().includes(qLower) || n.description.toLowerCase().includes(qLower)
    );
  }

  return NextResponse.json({
    source: "curated_fallback",
    items: filtered,
    message: apiKey ? "NewsAPI quota exceeded or network unavailable; showing resilient cached data." : "Add NEWS_API_KEY to .env.local for live news stream.",
  });
}
