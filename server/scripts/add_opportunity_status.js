import sequelize from "../src/config/db.js";

const sql =
  "ALTER TABLE opportunities ADD COLUMN status ENUM('active','suspended') NOT NULL DEFAULT 'active'";

async function main() {
  try {
    await sequelize.query(sql);
    console.log("✅ Added status column to opportunities.");
  } catch (error) {
    if (error?.original?.code === "ER_DUP_FIELDNAME") {
      console.log("ℹ️ Status column already exists.");
    } else {
      throw error;
    }
  } finally {
    await sequelize.close();
  }
}

main().catch((err) => {
  console.error("Failed to add status column:", err);
  process.exitCode = 1;
});
