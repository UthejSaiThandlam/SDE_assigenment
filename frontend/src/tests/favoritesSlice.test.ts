import { describe, it, expect } from "vitest";
import reducer, {
  toggleFavorite,
  removeFavorite,
  clearFavorites,
} from "@/store/favoritesSlice";
import { ContentItem } from "@/types/content";

const sampleItem1: ContentItem = {
  id: "test-item-1",
  type: "news",
  title: "React 19 Server Actions Guide",
  description: "Learn new server mutations.",
  category: "technology",
  url: "https://example.com/1",
  publishedAt: new Date().toISOString(),
  source: "Dev Community",
};

const sampleItem2: ContentItem = {
  id: "test-item-2",
  type: "movie",
  title: "Inception",
  description: "Dreams within dreams.",
  category: "entertainment",
  url: "https://example.com/2",
  publishedAt: new Date().toISOString(),
  source: "Watchmode",
};

describe("Redux favoritesSlice", () => {
  it("adds item to favorites when not currently present", () => {
    const initialState = { items: [] };
    const state = reducer(initialState, toggleFavorite(sampleItem1));

    expect(state.items.length).toBe(1);
    expect(state.items[0].id).toBe("test-item-1");
  });

  it("removes item from favorites when toggled a second time", () => {
    const initialState = { items: [sampleItem1] };
    const state = reducer(initialState, toggleFavorite(sampleItem1));

    expect(state.items.length).toBe(0);
  });

  it("removes favorite by specific ID", () => {
    const initialState = { items: [sampleItem1, sampleItem2] };
    const state = reducer(initialState, removeFavorite("test-item-1"));

    expect(state.items.length).toBe(1);
    expect(state.items[0].id).toBe("test-item-2");
  });

  it("clears all favorites when requested", () => {
    const initialState = { items: [sampleItem1, sampleItem2] };
    const state = reducer(initialState, clearFavorites());

    expect(state.items.length).toBe(0);
  });
});
