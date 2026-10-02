import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface FeedNotification {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  type: "sync" | "adaptive" | "alert" | "perspective";
}

interface NotificationState {
  items: FeedNotification[];
}

const initialState: NotificationState = {
  items: [
    {
      id: "notif-init-1",
      title: "Feed Synchronized",
      description: "Aggregated live stories from NewsAPI & Watchmode Cinema engines.",
      timestamp: "Just now",
      read: false,
      type: "sync",
    },
    {
      id: "notif-init-2",
      title: "Adaptive Scoring Active",
      description: "Real-time user engagement affinity is tuning your feed ranking.",
      timestamp: "2m ago",
      read: false,
      type: "adaptive",
    },
    {
      id: "notif-init-3",
      title: "Resilient Offline Cache Ready",
      description: "Cached feeds available for instant fallback if connectivity drops.",
      timestamp: "5m ago",
      read: true,
      type: "alert",
    },
  ],
};

export const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addNotification: (
      state,
      action: PayloadAction<{
        title: string;
        description: string;
        type?: "sync" | "adaptive" | "alert" | "perspective";
      }>
    ) => {
      const newNotif: FeedNotification = {
        id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        title: action.payload.title,
        description: action.payload.description,
        timestamp: "Just now",
        read: false,
        type: action.payload.type || "sync",
      };
      state.items.unshift(newNotif);
      if (state.items.length > 20) {
        state.items.pop();
      }
    },
    markAllAsRead: (state) => {
      state.items.forEach((item) => {
        item.read = true;
      });
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const item = state.items.find((i) => i.id === action.payload);
      if (item) {
        item.read = true;
      }
    },
    clearNotifications: (state) => {
      state.items = [];
    },
  },
});

export const { addNotification, markAllAsRead, markAsRead, clearNotifications } =
  notificationSlice.actions;

export default notificationSlice.reducer;
