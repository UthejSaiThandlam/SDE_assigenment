export type ContentType = "news" | "movie" | "social";

export type ContentCategory = 
  | "technology" 
  | "ai" 
  | "finance" 
  | "sports" 
  | "entertainment" 
  | "general";

export interface ScoreExplanation {
  totalScore: number;
  categoryScore: number;
  recencyScore: number;
  engagementScore: number;
  reasons: string[];
}

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
  score?: number;
  scoreExplanation?: ScoreExplanation;
  metadata?: {
    author?: string;
    handle?: string;
    likes?: number;
    rating?: number;
    votes?: number;
    duration?: string;
    hashtag?: string;
    comments?: number;
    shares?: number;
    isBreaking?: boolean;
  };
}

export type ViewMode = "comfortable" | "compact" | "grid";

export interface UserPreferences {
  categories: ContentCategory[];
  contentTypes: ContentType[];
  darkMode: boolean;
  viewMode: ViewMode;
  liveUpdatesEnabled: boolean;
  customCardOrder: string[];
  userName: string;
}
