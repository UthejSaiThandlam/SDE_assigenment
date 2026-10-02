import { describe, it, expect } from "vitest";
import adaptiveReducer, {
  recordInteraction,
  toggleReadLater,
  hideItem,
  togglePerspectiveMode,
} from "@/store/adaptiveSlice";

describe("adaptiveSlice", () => {
  const initial = {
    categoryWeights: {
      technology: 40,
      ai: 50,
      finance: 25,
      sports: 15,
      entertainment: 35,
    },
    interactionCount: 8,
    readLaterIds: [],
    readIds: [],
    hiddenIds: [],
    perspectiveMode: false,
    totalReadingMinutes: 24,
  };

  it("increases category weight when user clicks or saves an item", () => {
    let state = adaptiveReducer(
      initial,
      recordInteraction({ category: "ai", type: "click" })
    );
    expect(state.categoryWeights.ai).toBe(53);
    expect(state.interactionCount).toBe(9);

    state = adaptiveReducer(
      state,
      recordInteraction({ category: "ai", type: "save" })
    );
    expect(state.categoryWeights.ai).toBe(58);
  });

  it("decreases category weight when user marks an item not interested", () => {
    const state = adaptiveReducer(
      initial,
      recordInteraction({ category: "sports", type: "notInterested" })
    );
    expect(state.categoryWeights.sports).toBe(11);
  });

  it("toggles read later IDs and hides items", () => {
    let state = adaptiveReducer(initial, toggleReadLater("item-101"));
    expect(state.readLaterIds).toContain("item-101");

    state = adaptiveReducer(state, toggleReadLater("item-101"));
    expect(state.readLaterIds).not.toContain("item-101");

    state = adaptiveReducer(state, hideItem("item-999"));
    expect(state.hiddenIds).toContain("item-999");
  });

  it("toggles perspective mode correctly", () => {
    let state = adaptiveReducer(initial, togglePerspectiveMode());
    expect(state.perspectiveMode).toBe(true);

    state = adaptiveReducer(state, togglePerspectiveMode());
    expect(state.perspectiveMode).toBe(false);
  });
});
