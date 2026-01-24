import { jest } from "@jest/globals";

jest.unstable_mockModule("../../models/notification.model.js", () => ({
  default: {
    findAll: jest.fn(),
    findOne: jest.fn(),
  },
}));

const { NotificationService } = await import("../notification.service.js");
const { default: Notification } = await import(
  "../../models/notification.model.js"
);

describe("NotificationService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should list notifications with limit and offset", async () => {
    const mockNotifications = [{ notificationId: 1 }, { notificationId: 2 }];
    Notification.findAll.mockResolvedValue(mockNotifications);

    const result = await NotificationService.listByUser(5, {
      limit: 2,
      offset: 4,
    });

    expect(Notification.findAll).toHaveBeenCalledWith({
      where: { userId: 5 },
      order: [["createdAt", "DESC"]],
      limit: 2,
      offset: 4,
    });
    expect(result).toBe(mockNotifications);
  });

  test("should return null when notification is not found", async () => {
    Notification.findOne.mockResolvedValue(null);

    const result = await NotificationService.markRead(5, 10);

    expect(result).toBeNull();
  });

  test("should mark notification as read", async () => {
    const mockNotification = {
      isRead: false,
      save: jest.fn(),
    };
    Notification.findOne.mockResolvedValue(mockNotification);

    const result = await NotificationService.markRead(5, 10);

    expect(mockNotification.isRead).toBe(true);
    expect(mockNotification.save).toHaveBeenCalled();
    expect(result).toBe(mockNotification);
  });

  test("should not save when notification is already read", async () => {
    const mockNotification = {
      isRead: true,
      save: jest.fn(),
    };
    Notification.findOne.mockResolvedValue(mockNotification);

    const result = await NotificationService.markRead(5, 10);

    expect(mockNotification.save).not.toHaveBeenCalled();
    expect(result).toBe(mockNotification);
  });
});
