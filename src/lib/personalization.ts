import { ContentItem, UserPreferences, ScoreExplanation } from "@/types/content";

/**
 * Calculates a deterministic relevance score and explainability breakdown
 * for a content item given user preferences.
 */
export function calculatePersonalizationScore(
  item: ContentItem,
  preferences: UserPreferences
): ScoreExplanation {
  let categoryScore = 0;
  let recencyScore = 0;
  let engagementScore = 0;
  const reasons: string[] = [];

  // 1. Category Alignment (Up to 45 pts)
  const isPreferredCategory = preferences.categories.includes(item.category);
  const isPrimaryCategory = preferences.categories[0] === item.category;

  if (isPrimaryCategory) {
    categoryScore = 45;
    reasons.push(`Top match for your #1 priority topic: "${capitalize(item.category)}"`);
  } else if (isPreferredCategory) {
    categoryScore = 35;
    reasons.push(`Matches your active interest in "${capitalize(item.category)}"`);
  } else {
    categoryScore = 10;
    reasons.push(`Discovered under "${capitalize(item.category)}" for feed diversity`);
  }

  // 2. Content Type Alignment (Up to 15 pts)
  const isTypeEnabled = preferences.contentTypes.includes(item.type);
  if (!isTypeEnabled) {
    // If user disabled this type, penalize heavily
    categoryScore = Math.max(0, categoryScore - 20);
  } else {
    reasons.push(`Included from your enabled "${item.type.toUpperCase()}" stream`);
  }

  // 3. Recency Decay (Up to 25 pts)
  const itemDate = new Date(item.publishedAt).getTime();
  const now = Date.now();
  const ageInHours = Math.max(0, (now - itemDate) / (1000 * 60 * 60));

  if (ageInHours <= 4) {
    recencyScore = 25;
    reasons.push("Freshly published within the last 4 hours");
  } else if (ageInHours <= 24) {
    recencyScore = 20;
    reasons.push("Trending within the past 24 hours");
  } else if (ageInHours <= 72) {
    recencyScore = 12;
    reasons.push("Recent story from the last 3 days");
  } else {
    recencyScore = 6;
  }

  // 4. Engagement & Authority Boost (Up to 15 pts)
  if (item.type === "movie" && item.metadata?.rating) {
    const rating = item.metadata.rating; // e.g. 8.4
    engagementScore = Math.min(15, Math.round((rating / 10) * 15));
    if (rating >= 7.5) {
      reasons.push(`Critically acclaimed (TMDB Rating: ${rating.toFixed(1)}/10)`);
    }
  } else if (item.type === "social" && item.metadata?.likes) {
    const likes = item.metadata.likes;
    engagementScore = likes > 1000 ? 15 : likes > 500 ? 12 : likes > 100 ? 8 : 4;
    if (likes > 500) {
      reasons.push(`High community engagement (${likes.toLocaleString()} likes)`);
    }
  } else if (item.type === "news") {
    if (item.metadata?.isBreaking) {
      engagementScore = 15;
      reasons.push("High priority: Breaking news bulletin");
    } else {
      engagementScore = 10;
      reasons.push(`Verified publication: ${item.source}`);
    }
  }

  const totalScore = Math.min(100, categoryScore + recencyScore + engagementScore);

  return {
    totalScore,
    categoryScore,
    recencyScore,
    engagementScore,
    reasons,
  };
}

/**
 * Enhances a list of content items with personalization scores and sorts them.
 * If user has custom card order specified, items matching that order come first.
 */
export function rankContentItems(
  items: ContentItem[],
  preferences: UserPreferences
): ContentItem[] {
  // Score all items
  const scoredItems = items.map((item) => {
    const explanation = calculatePersonalizationScore(item, preferences);
    return {
      ...item,
      score: explanation.totalScore,
      scoreExplanation: explanation,
    };
  });

  // If there's custom card order from drag-and-drop, apply it
  if (preferences.customCardOrder && preferences.customCardOrder.length > 0) {
    const orderMap = new Map<string, number>();
    preferences.customCardOrder.forEach((id, index) => {
      orderMap.set(id, index);
    });

    return [...scoredItems].sort((a, b) => {
      const orderA = orderMap.has(a.id) ? orderMap.get(a.id)! : 99999;
      const orderB = orderMap.has(b.id) ? orderMap.get(b.id)! : 99999;

      if (orderA !== orderB) {
        return orderA - orderB;
      }
      // If neither is in custom order or tied, sort by score descending
      return (b.score || 0) - (a.score || 0);
    });
  }

  // Default: sort by score descending
  return [...scoredItems].sort((a, b) => (b.score || 0) - (a.score || 0));
}

function capitalize(s: string): string {
  if (!s) return "";
  if (s.toLowerCase() === "ai") return "AI";
  return s.charAt(0).toUpperCase() + s.slice(1);
}
