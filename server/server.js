import dotenv from 'dotenv';
dotenv.config();

import express from "express";
import cors from "cors";
import opportunityRoutes from "./src/routes/opportunity.routes.js";
import authenticationRoutes from "./src/routes/authentication.routes.js";
import testConnection from "./tests/test-db.js";
import applicationRoutes from "./src/routes/application.routes.js"
import adminRoutes from "./src/routes/admin.routes.js";






const app = express();

app.use(express.json());
app.use(cors());

// routes
app.use("/opportunities", opportunityRoutes);
app.use("/authentication", authenticationRoutes);
app.use("/applications", applicationRoutes);
app.use("/admin", adminRoutes); 

// server listen 
app.listen(3001, () => {
  console.log("Server running on port 3001");
});

// TEST DB CONNECTION
testConnection();
