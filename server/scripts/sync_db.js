import sequelize from "../src/config/db.js";
import "../src/models/user.model.js";
import "../src/models/volunteer.model.js";
import "../src/models/organization.model.js";
import "../src/models/category.model.js";
import "../src/models/opportunity.model.js";
import "../src/models/application.model.js";
import "../src/models/report.model.js";
import "../src/models/notification.model.js";
import "../src/models/activityLog.model.js";
import "../src/models/passwordReset.model.js";

const force = process.env.DB_SYNC_FORCE === "true";
const alter = process.env.DB_SYNC_ALTER === "true";

async function syncDb() {
  try {
    await sequelize.authenticate();
    console.log("Database connected. Syncing schema...");
    await sequelize.sync({ force, alter });
    console.log("Schema sync complete.");
  } catch (err) {
    console.error("Schema sync failed:", err);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
}

syncDb();
