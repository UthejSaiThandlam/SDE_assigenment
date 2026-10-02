import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ContentItem } from "@/types/content";

export const FAVORITES_STORAGE_KEY = "personalized_dashboard_favorites_v1";

interface FavoritesState {
  items: ContentItem[];
}

const initialState: FavoritesState = {
  items: [],
};

export const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    setHydratedFavorites: (state, action: PayloadAction<ContentItem[]>) => {
      state.items = action.payload;
    },
    toggleFavorite: (state, action: PayloadAction<ContentItem>) => {
      const item = action.payload;
      const index = state.items.findIndex((fav) => fav.id === item.id);
      if (index >= 0) {
        state.items.splice(index, 1);
      } else {
        // Add to beginning of favorites
        state.items.unshift(item);
      }
      saveFavorites(state.items);
    },
    removeFavorite: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      saveFavorites(state.items);
    },
    clearFavorites: (state) => {
      state.items = [];
      saveFavorites([]);
    },
  },
});

function saveFavorites(items: ContentItem[]) {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn("Failed to persist favorites to localStorage", e);
    }
  }
}

export const { setHydratedFavorites, toggleFavorite, removeFavorite, clearFavorites } =
  favoritesSlice.actions;

export default favoritesSlice.reducer;
