import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const TOKEN_KEY = "aurapulse_auth_token";
const USER_KEY = "aurapulse_auth_user";

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    hydrateAuth: (state) => {
      if (typeof window !== "undefined") {
        try {
          const token = localStorage.getItem(TOKEN_KEY);
          const savedUser = localStorage.getItem(USER_KEY);
          if (token && savedUser) {
            state.token = token;
            state.user = JSON.parse(savedUser);
            state.isAuthenticated = true;
          }
        } catch (e) {
          console.warn("Failed to hydrate auth state from localStorage", e);
        }
      }
    },
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;

      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(TOKEN_KEY, token);
          localStorage.setItem(USER_KEY, JSON.stringify(user));
        } catch (e) {
          console.warn("Failed to persist auth state", e);
        }
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;

      if (typeof window !== "undefined") {
        try {
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem(USER_KEY);
        } catch (e) {
          console.warn("Failed to clear auth from localStorage", e);
        }
      }
    },
    setAuthLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setAuthError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

export const { hydrateAuth, setCredentials, logout, setAuthLoading, setAuthError } =
  authSlice.actions;

export default authSlice.reducer;
