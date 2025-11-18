import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db.js";
import User from "./user.model.js";

class Volunteer extends Model {}

Volunteer.init(
  {
    volunteerId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "userId",
      },
    },

    fullName: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    age: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "Volunteer",
    tableName: "volunteers",
    timestamps: false,
  }
);

// Associations
Volunteer.belongsTo(User, { foreignKey: "userId", as: "user" });

export default Volunteer;
