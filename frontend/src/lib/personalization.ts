import { ContentItem, UserPreferences, ScoreExplanation } from "@/types/content";

/**
 * Calculates a deterministic relevance score and explainability breakdown
 * for a content item given user preferences.
 */
export function calculatePersonalizationScore(
  item: ContentItem,
  preferences: UserPreferences,
  adaptiveWeights?: Record<string, number>,
  isPerspectiveMode?: boolean
): ScoreExplanation {
  let categoryScore = 0;
  let recencyScore = 0;
  let engagementScore = 0;
  const reasons: string[] = [];

  // Perspective Mode Handling
  if (isPerspectiveMode) {
    const isOutsidePreference = !preferences.categories.includes(item.category);
    if (isOutsidePreference) {
      categoryScore = 42;
      reasons.push(`✓ Perspective Shift: Discovering diverse "${capitalize(item.category)}" outside your standard bubble`);
    } else {
      categoryScore = 28;
      reasons.push(`✓ Perspective Shift: Balanced preferred topic "${capitalize(item.category)}"`);
    }
  } else {
    // Standard Category Alignment (Up to 40 pts)
    const isPreferredCategory = preferences.categories.includes(item.category);
    const isPrimaryCategory = preferences.categories[0] === item.category;

    if (isPrimaryCategory) {
      categoryScore = 45;
      reasons.push(`✓ Top priority topic match: "${capitalize(item.category)}"`);
    } else if (isPreferredCategory) {
      categoryScore = 35;
      reasons.push(`✓ Matches your active "${capitalize(item.category)}" preference`);
    } else {
      categoryScore = 10;
      reasons.push(`✓ Cross-category discovery: "${capitalize(item.category)}"`);
    }

    // Adaptive Affinity Boost from user interactions (Up to 15 pts)
    if (adaptiveWeights && adaptiveWeights[item.category] !== undefined) {
      const weight = adaptiveWeights[item.category];
      if (weight > 50) {
        const bonus = Math.min(15, Math.round((weight - 50) / 3));
        categoryScore += bonus;
        reasons.push(`✓ Interaction affinity (+${bonus} pts): High engagement with ${capitalize(item.category)}`);
      } else if (weight < 25) {
        categoryScore = Math.max(5, categoryScore - 8);
        reasons.push(`✓ Reduced weight: Low engagement in ${capitalize(item.category)}`);
      }
    }
  }

  // 2. Content Type Alignment (Up to 15 pts)
  const isTypeEnabled = preferences.contentTypes.includes(item.type);
  if (!isTypeEnabled) {
    categoryScore = Math.max(0, categoryScore - 20);
  } else {
    reasons.push(`✓ Enabled stream: ${item.type.toUpperCase()}`);
  }

  // 3. Recency Decay (Up to 25 pts)
  const itemDate = new Date(item.publishedAt).getTime();
  const now = Date.now();
  const ageInHours = Math.max(0, (now - itemDate) / (1000 * 60 * 60));

  if (ageInHours <= 4) {
    recencyScore = 25;
    reasons.push("✓ Freshly published within 4 hours");
  } else if (ageInHours <= 24) {
    recencyScore = 20;
    reasons.push("✓ Trending within the past 24 hours");
  } else if (ageInHours <= 72) {
    recencyScore = 12;
    reasons.push("✓ Recent release from this week");
  } else {
    recencyScore = 6;
  }

  // 4. Engagement & Authority Boost (Up to 15 pts)
  if (item.type === "movie" && item.metadata?.rating) {
    const rating = item.metadata.rating;
    engagementScore = Math.min(15, Math.round((rating / 10) * 15));
    if (rating >= 7.5) {
      reasons.push(`✓ High critical rating: ${rating.toFixed(1)}/10`);
    }
  } else if (item.type === "social" && item.metadata?.likes) {
    const likes = item.metadata.likes;
    engagementScore = likes > 1000 ? 15 : likes > 500 ? 12 : likes > 100 ? 8 : 4;
    if (likes > 500) {
      reasons.push(`✓ Viral social engagement (${likes.toLocaleString()} likes)`);
    }
  } else if (item.type === "news") {
    if (item.metadata?.isBreaking) {
      engagementScore = 15;
      reasons.push("✓ High priority: Breaking bulletin");
    } else {
      engagementScore = 10;
      reasons.push(`✓ Verified authority source: ${item.source}`);
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
 * Calculates the feed diversity score (0-100) based on category entropy.
 */
export function calculateFeedDiversity(items: ContentItem[]): number {
  if (!items || items.length === 0) return 0;
  const counts: Record<string, number> = {};
  items.forEach((item) => {
    counts[item.category] = (counts[item.category] || 0) + 1;
  });

  const total = items.length;
  const distinctCategories = Object.keys(counts).length;
  if (distinctCategories <= 1) return 20;

  // Calculate Shannon entropy normalized to 100
  let entropy = 0;
  for (const cat in counts) {
    const p = counts[cat] / total;
    entropy -= p * Math.log2(p);
  }

  // Max entropy for 5 categories is log2(5) ~ 2.32
  const maxEntropy = Math.log2(5);
  const normalized = Math.min(100, Math.round((entropy / maxEntropy) * 100));
  return Math.max(35, normalized);
}

/**
 * Calculates estimated total reading time for current feed.
 */
export function calculateTotalReadingTime(items: ContentItem[]): number {
  if (!items || items.length === 0) return 0;
  return items.reduce((total, item) => {
    if (item.type === "movie") return total + 1;
    if (item.type === "social") return total + 1;
    const words = (item.description || "").split(/\s+/).length + 150;
    return total + Math.max(1, Math.round(words / 200));
  }, 0);
}

/**
 * Enhances a list of content items with personalization scores and sorts them.
 * Incorporates optional adaptive weights and perspective shift mode.
 */
export function rankContentItems(
  items: ContentItem[],
  preferences: UserPreferences,
  adaptiveWeights?: Record<string, number>,
  isPerspectiveMode?: boolean
): ContentItem[] {
  // Score all items
  const scoredItems = items.map((item) => {
    const explanation = calculatePersonalizationScore(
      item,
      preferences,
      adaptiveWeights,
      isPerspectiveMode
    );
    return {
      ...item,
      score: explanation.totalScore,
      scoreExplanation: explanation,
    };
  });

  // If there's custom card order from drag-and-drop, apply it (unless in perspective mode)
  if (
    !isPerspectiveMode &&
    preferences.customCardOrder &&
    preferences.customCardOrder.length > 0
  ) {
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
