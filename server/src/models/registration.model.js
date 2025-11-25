import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db';
import User from '../models/user.model.js'

class Registration extends Model {}

Registration.init(
    {
      userId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },

    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    },
    {
        sequelize,
        modelName: 'Registration',
        tableName: 'registrations',
        timestamps: false,
        indexes: [
        {
            unique: true,
            fields: ['userId', 'email'], 
        },
    ],
    }
)