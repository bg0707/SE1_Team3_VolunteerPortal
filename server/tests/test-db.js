import sequelize from '../src/config/db.js';

async function testConnection() {
  try {
    const [rows] = await sequelize.query('SELECT NOW() AS now');
    console.log('Database connected:', rows[0]);
  } catch (err) {
    console.error('Database connection failed:', err);
  }
}

testConnection();
