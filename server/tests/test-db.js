import sequelize from '../src/config/db.js';

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log("Database connected successfully");
  } catch (err) {
    console.error("DB connection error:", err);
  }
}

export default testConnection;
