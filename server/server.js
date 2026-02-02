import dotenv from 'dotenv';
dotenv.config();

import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import opportunityRoutes from "./src/routes/opportunity.routes.js";
import authenticationRoutes from "./src/routes/authentication.routes.js";
import categoryRoutes from "./src/routes/categories.routes.js";
import testConnection from "./tests/test-db.js";
import applicationRoutes from "./src/routes/application.routes.js"
import adminRoutes from "./src/routes/admin.routes.js";
import reportRoutes from "./src/routes/report.routes.js";
import notificationRoutes from "./src/routes/notification.routes.js";
import userRoutes from "./src/routes/user.routes.js";
import passwordResetRoutes from "./src/routes/passwordReset.routes.js";



const app = express();

app.use(express.json());
const corsOrigins = process.env.CORS_ORIGIN?.split(",").map((o) => o.trim()).filter(Boolean);
app.use(
  cors({
    origin: corsOrigins && corsOrigins.length > 0 ? corsOrigins : true,
    credentials: true,
  })
);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, "uploads");

app.use("/uploads", express.static(uploadsDir));

// routes
app.use("/api/opportunities", opportunityRoutes);
app.use("/api/authentication", authenticationRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/users", userRoutes);
app.use("/api/password-reset", passwordResetRoutes);

// Serve frontend (built React app) in production
if (process.env.NODE_ENV === "production") {
  const clientDist = path.join(__dirname, "public");
  const indexPath = path.join(clientDist, "index.html");

  if (fs.existsSync(indexPath)) {
    app.use(express.static(clientDist));
    app.get(/.*/, (req, res) => {
      res.sendFile(indexPath);
    });
  }
}




// server listen 
const port = Number(process.env.PORT) || 3001;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// TEST DB CONNECTION
testConnection();
