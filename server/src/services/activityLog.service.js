import { Op } from "sequelize";
import ActivityLog from "../models/activityLog.model.js";
import User from "../models/user.model.js";

export const ActivityLogService = {
  async log({ actorUserId, action, entityType, entityId, metadata }) {
    try {
      // Allow nulls for system events or anonymous actions.
      return await ActivityLog.create({
        actorUserId: actorUserId ?? null,
        action,
        entityType: entityType ?? null,
        entityId: entityId ?? null,
        metadata: metadata ?? null,
      });
    } catch (error) {
      console.error("Activity log error:", error);
      return null;
    }
  },

  async list({ limit = 20, offset = 0, action, actorUserId }) {
    const where = {};
    // Simple contains search to keep filtering flexible.
    const normalizedAction = action?.trim();
    if (normalizedAction) {
      where.action = { [Op.like]: `%${normalizedAction}%` };
    }
    if (actorUserId) {
      where.actorUserId = actorUserId;
    }

    const [total, logs] = await Promise.all([
      ActivityLog.count({ where }),
      ActivityLog.findAll({
        where,
        include: [
          {
            model: User,
            as: "actor",
            attributes: ["userId", "email", "role"],
          },
        ],
        // Offset/limit pagination with newest-first ordering.
        order: [["createdAt", "DESC"]],
        limit,
        offset,
      }),
    ]);

    return { total, logs };
  },
};
