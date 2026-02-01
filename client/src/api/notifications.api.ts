import { API_BASE_URL } from "../config/api";

const API_URL = `${API_BASE_URL}/notifications`;

export interface Notification {
  notificationId: number;
  userId: number;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export async function fetchNotifications(
  token: string,
  options: { limit?: number; offset?: number } = {}
): Promise<Notification[]> {
  const params = new URLSearchParams();
  if (options.limit) params.set("limit", String(options.limit));
  if (options.offset) params.set("offset", String(options.offset));
  const url = params.toString() ? `${API_URL}?${params}` : API_URL;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to fetch notifications");
  }

  return res.json();
}

export async function markNotificationRead(
  token: string,
  notificationId: number
) {
  const res = await fetch(`${API_URL}/${notificationId}/read`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to mark notifications read");
  }

  return res.json();
}
