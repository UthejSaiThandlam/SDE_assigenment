import { describe, it, expect } from "vitest";
import reducer, {
  toggleCategory,
  toggleContentType,
  setDarkMode,
  setViewMode,
  setCustomCardOrder,
  resetPreferences,
} from "@/store/preferencesSlice";
import { UserPreferences } from "@/types/content";

const initialTestState: UserPreferences = {
  categories: ["technology", "ai", "finance"],
  contentTypes: ["news", "movie", "social"],
  darkMode: true,
  viewMode: "comfortable",
  liveUpdatesEnabled: true,
  customCardOrder: [],
  userName: "Uthej",
};

describe("Redux preferencesSlice", () => {
  it("toggles category on and off properly", () => {
    // Remove "ai"
    const state1 = reducer(initialTestState, toggleCategory("ai"));
    expect(state1.categories).not.toContain("ai");

    // Add "ai" back
    const state2 = reducer(state1, toggleCategory("ai"));
    expect(state2.categories).toContain("ai");
  });

  it("prevents removing the last active category to avoid empty feed error state", () => {
    const singleCategoryState: UserPreferences = {
      ...initialTestState,
      categories: ["technology"],
    };

    const state = reducer(singleCategoryState, toggleCategory("technology"));
    expect(state.categories).toEqual(["technology"]);
  });

  it("updates dark mode preference", () => {
    const state = reducer(initialTestState, setDarkMode(false));
    expect(state.darkMode).toBe(false);
  });

  it("updates layout view mode", () => {
    const state = reducer(initialTestState, setViewMode("compact"));
    expect(state.viewMode).toBe("compact");
  });

  it("saves custom drag-and-drop card order", () => {
    const newOrder = ["card-3", "card-1", "card-2"];
    const state = reducer(initialTestState, setCustomCardOrder(newOrder));
    expect(state.customCardOrder).toEqual(newOrder);
  });

  it("resets preferences back to defaults", () => {
    const modifiedState: UserPreferences = {
      ...initialTestState,
      categories: ["sports"],
      darkMode: false,
      viewMode: "grid",
    };

    const state = reducer(modifiedState, resetPreferences());
    expect(state.darkMode).toBe(true);
    expect(state.viewMode).toBe("comfortable");
    expect(state.categories).toContain("technology");
  });
});
