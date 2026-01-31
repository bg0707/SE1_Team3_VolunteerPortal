import dotenv from 'dotenv';
dotenv.config();

import express from "express";
import cors from "cors";
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



const app = express();

app.use(express.json());
app.use(cors());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, "uploads");

app.use("/uploads", express.static(uploadsDir));

// routes
app.use("/opportunities", opportunityRoutes);
app.use("/authentication", authenticationRoutes);
app.use("/applications", applicationRoutes);
app.use("/categories", categoryRoutes);
app.use("/admin", adminRoutes);
app.use("/reports", reportRoutes);
app.use("/notifications", notificationRoutes);


// server listen 
app.listen(3001, () => {
  console.log("Server running on port 3001");
});

// TEST DB CONNECTION
testConnection();
