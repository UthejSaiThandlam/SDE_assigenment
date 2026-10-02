"use client";

import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "./store";
import {
  PREFERENCES_STORAGE_KEY,
  setHydratedPreferences,
} from "./preferencesSlice";
import { FAVORITES_STORAGE_KEY, setHydratedFavorites } from "./favoritesSlice";
import { hydrateAuth } from "./authSlice";
import { useAppSelector } from "./hooks";

function ThemeSynchronizer() {
  const darkMode = useAppSelector((state) => state.preferences.darkMode);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return null;
}

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // 1. Hydrate Preferences
    try {
      const savedPrefs = localStorage.getItem(PREFERENCES_STORAGE_KEY);
      if (savedPrefs) {
        const parsed = JSON.parse(savedPrefs);
        store.dispatch(setHydratedPreferences(parsed));
        if (parsed.darkMode !== false) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      } else {
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

    // 3. Hydrate Auth
    try {
      store.dispatch(hydrateAuth());
    } catch (e) {
      console.error("Hydration error for auth:", e);
    }
  }, []);

  return (
    <Provider store={store}>
      <ThemeSynchronizer />
      {children}
    </Provider>
  );
}
