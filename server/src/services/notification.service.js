import Notification from "../models/notification.model.js";

export const NotificationService = {
  async listByUser(userId, { limit = 20, offset = 0 } = {}) {
    // Return newest-first for inbox-style UI.
    return Notification.findAll({
      where: { userId },
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });
  },

  async markRead(userId, notificationId) {
    // Ensure the notification belongs to the requesting user.
    const notification = await Notification.findOne({
      where: { notificationId, userId },
    });

    if (!notification) return null;
    // Idempotent update so repeated calls are safe.
    if (!notification.isRead) {
      notification.isRead = true;
      await notification.save();
    }

    return notification;
  },
};
