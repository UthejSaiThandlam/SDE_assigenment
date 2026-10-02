import { configureStore } from "@reduxjs/toolkit";
import preferencesReducer from "./preferencesSlice";
import favoritesReducer from "./favoritesSlice";
import { contentApi } from "./contentApi";

export const store = configureStore({
  reducer: {
    preferences: preferencesReducer,
    favorites: favoritesReducer,
    [contentApi.reducerPath]: contentApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(contentApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
