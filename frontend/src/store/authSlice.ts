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
  isHydrated: boolean;
  error: string | null;
}

export const TOKEN_KEY = "aurapulse_auth_token";
export const USER_KEY = "aurapulse_auth_user";

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  isHydrated: false,
  error: null,
};

// Helper to check if a JWT is expired client-side
function isTokenExpired(token: string): boolean {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return true;
    const payload = JSON.parse(atob(parts[1]));
    if (payload.exp && Date.now() >= payload.exp * 1000) {
      return true;
    }
    return false;
  } catch {
    return true;
  }
}

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    hydrateAuth: (state) => {
      state.isHydrated = true;
      if (typeof window !== "undefined") {
        try {
          const token = localStorage.getItem(TOKEN_KEY);
          const savedUser = localStorage.getItem(USER_KEY);
          if (token && savedUser) {
            // Check expiry
            if (isTokenExpired(token)) {
              localStorage.removeItem(TOKEN_KEY);
              localStorage.removeItem(USER_KEY);
              state.token = null;
              state.user = null;
              state.isAuthenticated = false;
            } else {
              state.token = token;
              state.user = JSON.parse(savedUser);
              state.isAuthenticated = true;
            }
          } else {
            state.isAuthenticated = false;
            state.token = null;
            state.user = null;
          }
        } catch (e) {
          console.warn("Failed to hydrate auth state from localStorage", e);
          state.isAuthenticated = false;
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
      state.isHydrated = true;
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
      state.isHydrated = true;
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
