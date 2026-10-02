import { ContentItem } from "../types/content";
import { MOCK_SOCIAL } from "../data/mockData";

export class SocialService {
  async getPosts(hashtag?: string, query?: string): Promise<{ source: string; items: ContentItem[] }> {
    let items = [...MOCK_SOCIAL];

    if (hashtag) {
      const tag = hashtag.startsWith("#") ? hashtag.toLowerCase() : `#${hashtag.toLowerCase()}`;
      items = items.filter((p) => p.metadata?.hashtag?.toLowerCase() === tag);
    }

    if (query) {
      const q = query.toLowerCase();
      items = items.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          (p.metadata?.hashtag && p.metadata.hashtag.toLowerCase().includes(q)) ||
          (p.metadata?.author && p.metadata.author.toLowerCase().includes(q))
      );
    }

    return { source: "mock_social", items };
  }
}
