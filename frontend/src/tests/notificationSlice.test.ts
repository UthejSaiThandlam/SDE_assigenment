import { describe, it, expect } from "vitest";
import notificationReducer, {
  addNotification,
  markAllAsRead,
  clearNotifications,
} from "@/store/notificationSlice";

describe("notificationSlice", () => {
  it("adds a new notification and prepends to list", () => {
    const initial = { items: [] };
    const state = notificationReducer(
      initial,
      addNotification({
        title: "Test Feed Sync",
        description: "10 items synchronized.",
        type: "sync",
      })
    );

    expect(state.items).toHaveLength(1);
    expect(state.items[0].title).toBe("Test Feed Sync");
    expect(state.items[0].read).toBe(false);
  });

  it("marks all notifications as read", () => {
    const initial = {
      items: [
        {
          id: "1",
          title: "Alert 1",
          description: "Desc",
          timestamp: "now",
          read: false,
          type: "alert" as const,
        },
      ],
    };
    const state = notificationReducer(initial, markAllAsRead());
    expect(state.items[0].read).toBe(true);
  });

  it("clears all notifications", () => {
    const initial = {
      items: [
        {
          id: "1",
          title: "Alert 1",
          description: "Desc",
          timestamp: "now",
          read: true,
          type: "alert" as const,
        },
      ],
    };
    const state = notificationReducer(initial, clearNotifications());
    expect(state.items).toHaveLength(0);
  });
});
