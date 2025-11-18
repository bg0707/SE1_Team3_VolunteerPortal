import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db.js";
import Volunteer from "./volunteer.model.js";
import Opportunity from "./opportunity.model.js";

class Application extends Model {}

Application.init(
  {
    applicationId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    volunteerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Volunteer,
        key: "volunteerId",
      },
    },

    opportunityId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Opportunity,
        key: "opportunityId",
      },
    },

    status: {
      type: DataTypes.ENUM("pending", "accepted", "rejected"),
      defaultValue: "pending",
    },

    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "Application",
    tableName: "applications",
    timestamps: false,
  }
);

// Associations
Application.belongsTo(Volunteer, { foreignKey: "volunteerId", as: "volunteer" });
Application.belongsTo(Opportunity, { foreignKey: "opportunityId", as: "opportunity" });

export default Application;
