import sequelize from "./src/config/db.js";
import "./src/models/index.js"; // load models

sequelize.sync({ alter: true })
  .then(() => console.log("All models synced with database"))
  .catch(err => console.error("Sync error:", err));
