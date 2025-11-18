import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db.js";
import Volunteer from "./volunteer.model.js";
import Opportunity from "./opportunity.model.js";

class Report extends Model {}

Report.init(
  {
    reportId: {
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

    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "Report",
    tableName: "reports",
    timestamps: false,
  }
);

// Associations
Report.belongsTo(Volunteer, { foreignKey: "volunteerId", as: "volunteer" });
Report.belongsTo(Opportunity, { foreignKey: "opportunityId", as: "opportunity" });

export default Report;
