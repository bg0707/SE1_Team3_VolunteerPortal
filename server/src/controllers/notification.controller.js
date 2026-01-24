import { NotificationService } from "../services/notification.service.js";

export const NotificationController = {
  async listMyNotifications(req, res) {
    try {
      const limit = Number(req.query.limit ?? 20);
      const offset = Number(req.query.offset ?? 0);
      const safeLimit = Number.isFinite(limit) ? Math.min(Math.max(limit, 1), 50) : 20;
      const safeOffset = Number.isFinite(offset) ? Math.max(offset, 0) : 0;

      const notifications = await NotificationService.listByUser(
        req.user.userId,
        { limit: safeLimit, offset: safeOffset }
      );
      res.status(200).json(notifications);
    } catch (error) {
      console.error("Notification list error:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  async markRead(req, res) {
    try {
      const notificationId = Number(req.params.notificationId);
      if (!notificationId) {
        return res.status(400).json({ message: "Invalid notification id." });
      }

      const notification = await NotificationService.markRead(
        req.user.userId,
        notificationId
      );

      if (!notification) {
        return res.status(404).json({ message: "Notification not found." });
      }

      res.status(200).json({ message: "Notification marked as read.", notification });
    } catch (error) {
      console.error("Notification markRead error:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },
};
