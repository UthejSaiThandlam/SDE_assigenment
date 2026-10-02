import { configureStore } from "@reduxjs/toolkit";
import preferencesReducer from "./preferencesSlice";
import favoritesReducer from "./favoritesSlice";
import authReducer from "./authSlice";
import adaptiveReducer from "./adaptiveSlice";
import notificationsReducer from "./notificationSlice";
import { contentApi } from "./contentApi";

export const store = configureStore({
  reducer: {
    preferences: preferencesReducer,
    favorites: favoritesReducer,
    auth: authReducer,
    adaptive: adaptiveReducer,
    notifications: notificationsReducer,
    [contentApi.reducerPath]: contentApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(contentApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
