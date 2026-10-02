export type ContentType = "news" | "movie" | "social";

export type ContentCategory = 
  | "technology" 
  | "ai" 
  | "finance" 
  | "sports" 
  | "entertainment" 
  | "general";

export interface ContentItem {
  id: string;
  type: ContentType;
  title: string;
  description: string;
  category: ContentCategory;
  image?: string;
  url: string;
  publishedAt: string;
  source: string;
  metadata?: {
    author?: string;
    handle?: string;
    likes?: number;
    rating?: number;
    votes?: number;
    duration?: string;
    hashtag?: string;
    isBreaking?: boolean;
  };
}
