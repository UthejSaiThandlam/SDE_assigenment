import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserPreferences, ContentCategory, ContentType, ViewMode } from "@/types/content";

const DEFAULT_PREFERENCES: UserPreferences = {
  categories: ["technology", "ai", "finance"],
  contentTypes: ["news", "movie", "social"],
  darkMode: true, // Default to sleek modern dark mode
  viewMode: "comfortable",
  liveUpdatesEnabled: true,
  customCardOrder: [],
  userName: "Uthej",
};

// Local storage key
export const PREFERENCES_STORAGE_KEY = "personalized_dashboard_preferences_v1";

export const getInitialPreferences = (): UserPreferences => {
  if (typeof window !== "undefined") {
    try {
      const saved = localStorage.getItem(PREFERENCES_STORAGE_KEY);
      if (saved) {
        return { ...DEFAULT_PREFERENCES, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn("Failed to read preferences from localStorage", e);
    }
  }
  return DEFAULT_PREFERENCES;
};

const initialState: UserPreferences = DEFAULT_PREFERENCES;

export const preferencesSlice = createSlice({
  name: "preferences",
  initialState,
  reducers: {
    setHydratedPreferences: (state, action: PayloadAction<UserPreferences>) => {
      return action.payload;
    },
    toggleCategory: (state, action: PayloadAction<ContentCategory>) => {
      const category = action.payload;
      if (state.categories.includes(category)) {
        if (state.categories.length > 1) {
          state.categories = state.categories.filter((c) => c !== category);
        }
      } else {
        state.categories.push(category);
      }
      saveToStorage(state);
    },
    setCategories: (state, action: PayloadAction<ContentCategory[]>) => {
      state.categories = action.payload;
      saveToStorage(state);
    },
    toggleContentType: (state, action: PayloadAction<ContentType>) => {
      const type = action.payload;
      if (state.contentTypes.includes(type)) {
        if (state.contentTypes.length > 1) {
          state.contentTypes = state.contentTypes.filter((t) => t !== type);
        }
      } else {
        state.contentTypes.push(type);
      }
      saveToStorage(state);
    },
    setDarkMode: (state, action: PayloadAction<boolean>) => {
      state.darkMode = action.payload;
      saveToStorage(state);
    },
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
      saveToStorage(state);
    },
    setViewMode: (state, action: PayloadAction<ViewMode>) => {
      state.viewMode = action.payload;
      saveToStorage(state);
    },
    setLiveUpdatesEnabled: (state, action: PayloadAction<boolean>) => {
      state.liveUpdatesEnabled = action.payload;
      saveToStorage(state);
    },
    setCustomCardOrder: (state, action: PayloadAction<string[]>) => {
      state.customCardOrder = action.payload;
      saveToStorage(state);
    },
    setUserName: (state, action: PayloadAction<string>) => {
      state.userName = action.payload;
      saveToStorage(state);
    },
    resetPreferences: () => {
      saveToStorage(DEFAULT_PREFERENCES);
      return DEFAULT_PREFERENCES;
    },
  },
});

function saveToStorage(state: UserPreferences) {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn("Failed to save preferences to localStorage", e);
    }
  }
}

export const {
  setHydratedPreferences,
  toggleCategory,
  setCategories,
  toggleContentType,
  setDarkMode,
  toggleDarkMode,
  setViewMode,
  setLiveUpdatesEnabled,
  setCustomCardOrder,
  setUserName,
  resetPreferences,
} = preferencesSlice.actions;

export default preferencesSlice.reducer;
