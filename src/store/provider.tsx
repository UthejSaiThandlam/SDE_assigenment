"use client";

import React, { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { store } from "./store";
import {
  PREFERENCES_STORAGE_KEY,
  setHydratedPreferences,
} from "./preferencesSlice";
import { FAVORITES_STORAGE_KEY, setHydratedFavorites } from "./favoritesSlice";

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // 1. Hydrate Preferences
    try {
      const savedPrefs = localStorage.getItem(PREFERENCES_STORAGE_KEY);
      if (savedPrefs) {
        const parsed = JSON.parse(savedPrefs);
        store.dispatch(setHydratedPreferences(parsed));
        if (parsed.darkMode) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      } else {
        // Default to dark mode
        document.documentElement.classList.add("dark");
      }
    } catch (e) {
      console.error("Hydration error for preferences:", e);
    }

    // 2. Hydrate Favorites
    try {
      const savedFavs = localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (savedFavs) {
        store.dispatch(setHydratedFavorites(JSON.parse(savedFavs)));
      }
    } catch (e) {
      console.error("Hydration error for favorites:", e);
    }

    setMounted(true);
  }, []);

  return (
    <Provider store={store}>
      {children}
    </Provider>
  );
}
