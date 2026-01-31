import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db.js";
import User from "./user.model.js";

class ActivityLog extends Model {}

ActivityLog.init(
  {
    activityLogId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    actorUserId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: User,
        key: "userId",
      },
    },
    action: {
      type: DataTypes.STRING(120),
      allowNull: false,
    },
    entityType: {
      type: DataTypes.STRING(60),
      allowNull: true,
    },
    entityId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    metadata: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "ActivityLog",
    tableName: "activity_logs",
    timestamps: false,
  }
);

ActivityLog.belongsTo(User, { foreignKey: "actorUserId", as: "actor" });

export default ActivityLog;
