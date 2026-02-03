import { jest } from "@jest/globals";
import { Op } from "sequelize";

jest.unstable_mockModule("../../models/activityLog.model.js", () => ({
  default: {
    create: jest.fn(),
    count: jest.fn(),
    findAll: jest.fn(),
  },
}));

jest.unstable_mockModule("../../models/user.model.js", () => ({
  default: {},
}));

const { ActivityLogService } = await import("../activityLog.service.js");
const { default: ActivityLog } = await import("../../models/activityLog.model.js");

describe("ActivityLogService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("log creates a new activity entry", async () => {
    // Arrange
    const payload = {
      actorUserId: 1,
      action: "opportunity.create",
      entityType: "opportunity",
      entityId: 10,
      metadata: { title: "Test" },
    };
    const created = { activityLogId: 99 };
    ActivityLog.create.mockResolvedValue(created);

    // Act
    const result = await ActivityLogService.log(payload);

    // Assert
    expect(ActivityLog.create).toHaveBeenCalledWith({
      actorUserId: 1,
      action: "opportunity.create",
      entityType: "opportunity",
      entityId: 10,
      metadata: { title: "Test" },
    });
    expect(result).toBe(created);
  });

  test("log returns null on error", async () => {
    // Arrange
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    ActivityLog.create.mockRejectedValue(new Error("db failure"));

    // Act
    const result = await ActivityLogService.log({ action: "test" });

    // Assert
    expect(consoleSpy).toHaveBeenCalled();
    expect(result).toBeNull();

    consoleSpy.mockRestore();
  });

  test("list applies action and actor filters", async () => {
    // Arrange
    ActivityLog.count.mockResolvedValue(2);
    ActivityLog.findAll.mockResolvedValue([{ id: 1 }, { id: 2 }]);

    // Act
    const result = await ActivityLogService.list({
      action: "admin.user",
      actorUserId: 5,
      limit: 10,
      offset: 0,
    });

    // Assert
    expect(ActivityLog.count).toHaveBeenCalledWith({
      where: {
        action: { [Op.like]: "%admin.user%" },
        actorUserId: 5,
      },
    });
    expect(ActivityLog.findAll).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          action: { [Op.like]: "%admin.user%" },
          actorUserId: 5,
        },
        limit: 10,
        offset: 0,
      })
    );
    expect(result).toEqual({ total: 2, logs: [{ id: 1 }, { id: 2 }] });
  });

  test("list uses defaults when no filters provided", async () => {
    // Arrange
    ActivityLog.count.mockResolvedValue(0);
    ActivityLog.findAll.mockResolvedValue([]);

    // Act
    const result = await ActivityLogService.list({});

    // Assert
    expect(ActivityLog.count).toHaveBeenCalledWith({ where: {} });
    expect(ActivityLog.findAll).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {},
        limit: 20,
        offset: 0,
      })
    );
    expect(result).toEqual({ total: 0, logs: [] });
  });
});
