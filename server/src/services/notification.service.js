import Notification from "../models/notification.model.js";

export const NotificationService = {
  async listByUser(userId, { limit = 20, offset = 0 } = {}) {
    return Notification.findAll({
      where: { userId },
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });
  },

  async markRead(userId, notificationId) {
    const notification = await Notification.findOne({
      where: { notificationId, userId },
    });

    if (!notification) return null;
    if (!notification.isRead) {
      notification.isRead = true;
      await notification.save();
    }

    return notification;
  },
};
