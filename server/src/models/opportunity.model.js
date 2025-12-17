import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db.js";
import Organization from "./organization.model.js";
import Category from "./category.model.js";

class Opportunity extends Model {}

Opportunity.init(
  {
    opportunityId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    organizationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Organization,
        key: "organizationId",
      },
    },

    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Category,
        key: "categoryId",
      },
    },

    title: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    location: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },

    date: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "Opportunity",
    tableName: "opportunities",
    timestamps: false,
  }
);

// Associations
Opportunity.belongsTo(Organization, { foreignKey: "organizationId", as: "organization" });
Opportunity.belongsTo(Category, { foreignKey: "categoryId", as: "category" });

export default Opportunity;
