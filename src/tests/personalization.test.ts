import { describe, it, expect } from "vitest";
import { calculatePersonalizationScore, rankContentItems } from "@/lib/personalization";
import { ContentItem, UserPreferences } from "@/types/content";

const mockPreferences: UserPreferences = {
  categories: ["ai", "technology"],
  contentTypes: ["news", "movie", "social"],
  darkMode: true,
  viewMode: "comfortable",
  liveUpdatesEnabled: true,
  customCardOrder: [],
  userName: "Uthej",
};

const mockItemAI: ContentItem = {
  id: "test-ai-1",
  type: "news",
  title: "AI Breakthrough in Autonomous Coding",
  description: "New models demonstrate autonomous system workflows.",
  category: "ai",
  url: "https://example.com",
  publishedAt: new Date().toISOString(), // fresh
  source: "Tech Journal",
  metadata: { isBreaking: true },
};

const mockItemSports: ContentItem = {
  id: "test-sport-1",
  type: "news",
  title: "Championship Race Finals",
  description: "Formula 1 season ends.",
  category: "sports",
  url: "https://example.com",
  publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(), // 4 days ago
  source: "Sports Weekly",
};

describe("Personalization Ranking Engine", () => {
  it("gives higher score to preferred primary category than non-preferred category", () => {
    const scoreAI = calculatePersonalizationScore(mockItemAI, mockPreferences);
    const scoreSports = calculatePersonalizationScore(mockItemSports, mockPreferences);

    expect(scoreAI.totalScore).toBeGreaterThan(scoreSports.totalScore);
    expect(scoreAI.categoryScore).toBe(45); // Primary match
    expect(scoreSports.categoryScore).toBe(10); // Non-match
  });

  it("produces plain-English reasons for explainability", () => {
    const score = calculatePersonalizationScore(mockItemAI, mockPreferences);

    expect(score.reasons.length).toBeGreaterThan(0);
    expect(score.reasons.some((r) => r.includes("AI"))).toBe(true);
  });

  it("ranks items in descending order of calculated score", () => {
    const ranked = rankContentItems([mockItemSports, mockItemAI], mockPreferences);

    expect(ranked[0].id).toBe("test-ai-1");
    expect(ranked[1].id).toBe("test-sport-1");
  });

  it("respects custom drag-and-drop card ordering if specified", () => {
    const customPrefs: UserPreferences = {
      ...mockPreferences,
      customCardOrder: ["test-sport-1", "test-ai-1"],
    };

    const ranked = rankContentItems([mockItemAI, mockItemSports], customPrefs);

    expect(ranked[0].id).toBe("test-sport-1");
    expect(ranked[1].id).toBe("test-ai-1");
  });
});
