
import { DataTypes } from "sequelize";
import sequelize from "../config/db.js"; 

const PasswordReset = sequelize.define("PasswordReset", {
  token: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
});

export default PasswordReset;