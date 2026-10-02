import { ContentItem } from "../types/content";
import { MOCK_NEWS } from "../data/mockData";

export class NewsService {
  async getNews(category?: string, query?: string): Promise<{ source: string; items: ContentItem[] }> {
    const apiKey = process.env.NEWS_API_KEY;

    if (apiKey) {
      try {
        const newsCategory = category === "finance" ? "business" : category === "ai" ? "technology" : category || "technology";
        const url = query
          ? `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&sortBy=publishedAt&pageSize=12&apiKey=${apiKey}`
          : `https://newsapi.org/v2/top-headlines?country=us&category=${newsCategory}&pageSize=12&apiKey=${apiKey}`;

        const res = await fetch(url, {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          },
        });
        if (res.ok) {
          const data: any = await res.json();
          if (data.articles && data.articles.length > 0) {
            const items: ContentItem[] = data.articles
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
                  likes: Math.floor(Math.random() * 400) + 120,
                },
              }));
            return { source: "live", items };
          }
        }
      } catch (err) {
        console.warn("NewsService live fetch failed, serving curated fallback", err);
      }
    }

    // Curated Fallback
    let items = [...MOCK_NEWS];
    if (category && category !== "all" && category !== "general") {
      items = items.filter((n) => n.category.toLowerCase() === category.toLowerCase());
      if (items.length === 0) items = MOCK_NEWS;
    }
    if (query) {
      const q = query.toLowerCase();
      items = items.filter(
        (n) => n.title.toLowerCase().includes(q) || n.description.toLowerCase().includes(q)
      );
    }

    return { source: "curated_fallback", items };
  }
}
