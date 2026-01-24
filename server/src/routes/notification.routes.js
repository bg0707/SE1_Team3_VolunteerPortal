import express from "express";
import { authenticateUser } from "../middleware/authenticateUser.js";
import { NotificationController } from "../controllers/notification.controller.js";

const router = express.Router();

router.get("/", authenticateUser, NotificationController.listMyNotifications);
router.patch(
  "/:notificationId/read",
  authenticateUser,
  NotificationController.markRead
);

export default router;
