import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ContentCategory } from "@/types/content";

export interface AdaptiveInterests {
  technology: number;
  ai: number;
  finance: number;
  sports: number;
  entertainment: number;
}

interface AdaptiveState {
  categoryWeights: AdaptiveInterests;
  interactionCount: number;
  readLaterIds: string[];
  readIds: string[];
  hiddenIds: string[];
  perspectiveMode: boolean;
  totalReadingMinutes: number;
}

const initialState: AdaptiveState = {
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

export const adaptiveSlice = createSlice({
  name: "adaptive",
  initialState,
  reducers: {
    recordInteraction: (
      state,
      action: PayloadAction<{
        category: ContentCategory;
        type: "click" | "save" | "quickBrief" | "notInterested";
        minutes?: number;
      }>
    ) => {
      const { category, type, minutes } = action.payload;
      state.interactionCount += 1;

      if (minutes) {
        state.totalReadingMinutes += minutes;
      }

      switch (type) {
        case "click":
          state.categoryWeights[category] = Math.min(100, (state.categoryWeights[category] || 0) + 3);
          break;
        case "save":
          state.categoryWeights[category] = Math.min(100, (state.categoryWeights[category] || 0) + 5);
          break;
        case "quickBrief":
          state.categoryWeights[category] = Math.min(100, (state.categoryWeights[category] || 0) + 2);
          break;
        case "notInterested":
          state.categoryWeights[category] = Math.max(5, (state.categoryWeights[category] || 0) - 4);
          break;
      }
    },
    toggleReadLater: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const index = state.readLaterIds.indexOf(id);
      if (index >= 0) {
        state.readLaterIds.splice(index, 1);
      } else {
        state.readLaterIds.push(id);
      }
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      if (!state.readIds.includes(id)) {
        state.readIds.push(id);
      }
    },
    hideItem: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      if (!state.hiddenIds.includes(id)) {
        state.hiddenIds.push(id);
      }
    },
    unhideItem: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      state.hiddenIds = state.hiddenIds.filter((item) => item !== id);
    },
    togglePerspectiveMode: (state) => {
      state.perspectiveMode = !state.perspectiveMode;
    },
    setPerspectiveMode: (state, action: PayloadAction<boolean>) => {
      state.perspectiveMode = action.payload;
    },
    resetAdaptiveScores: (state) => {
      state.categoryWeights = {
        technology: 30,
        ai: 30,
        finance: 30,
        sports: 30,
        entertainment: 30,
      };
      state.interactionCount = 0;
      state.hiddenIds = [];
    },
  },
});

export const {
  recordInteraction,
  toggleReadLater,
  markAsRead,
  hideItem,
  unhideItem,
  togglePerspectiveMode,
  setPerspectiveMode,
  resetAdaptiveScores,
} = adaptiveSlice.actions;

export default adaptiveSlice.reducer;
