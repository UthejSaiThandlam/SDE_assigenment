import { ContentItem } from "../types/content";
import { NewsService } from "./newsService";
import { MoviesService } from "./moviesService";
import { SocialService } from "./socialService";

export class FeedService {
  private newsService = new NewsService();
  private moviesService = new MoviesService();
  private socialService = new SocialService();

  async getAggregatedFeed(params: {
    query?: string;
    category?: string;
    type?: string;
  }): Promise<{ items: ContentItem[]; total: number; timestamp: string }> {
    const { query, category, type } = params;

    let newsItems: ContentItem[] = [];
    let movieItems: ContentItem[] = [];
    let socialItems: ContentItem[] = [];

    if (!type || type === "news") {
      const res = await this.newsService.getNews(category, query);
      newsItems = res.items;
    }

    if (!type || type === "movie") {
      const res = await this.moviesService.getMovies(query);
      movieItems = res.items;
    }

    if (!type || type === "social") {
      const res = await this.socialService.getPosts(undefined, query);
      socialItems = res.items;
    }

    let combined = [...newsItems, ...movieItems, ...socialItems];

    if (category && category !== "all") {
      combined = combined.filter((c) => c.category.toLowerCase() === category.toLowerCase());
    }

    return {
      items: combined,
      total: combined.length,
      timestamp: new Date().toISOString(),
    };
  }
}
