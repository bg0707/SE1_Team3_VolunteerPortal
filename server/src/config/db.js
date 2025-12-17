import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';

dotenv.config();

const sequelize = new Sequelize(
  'volunteer_portal',     // Your database name (NOT studentportal)
  'root',                 // Your local MySQL user
  process.env.DB_PASSWORD, // From your .env
  {
    host: 'localhost',
    dialect: 'mysql',
    logging: false,
  }
);

export default sequelize;
