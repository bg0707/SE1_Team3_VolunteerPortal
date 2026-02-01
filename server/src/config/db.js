import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';

dotenv.config();

const useSsl = process.env.DB_SSL === "true";

const sequelize = new Sequelize(
  process.env.DB_NAME || 'volunteer_portal',     // Database name from env or default
  process.env.DB_USER || 'root',                 // Database user from env or default
  process.env.DB_PASSWORD,                       // Database password from env
  {
    host: process.env.DB_HOST || 'localhost',    // Host from env or localhost
    port: process.env.DB_PORT || 3306,           // Port from env or default MySQL port
    dialect: 'mysql',
    logging: false,
    dialectOptions: useSsl
      ? {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
        }
      : undefined,
  }
);

export default sequelize;
