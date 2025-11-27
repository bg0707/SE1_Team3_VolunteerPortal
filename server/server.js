import express from "express";
import cors from "cors";
import opportunityRoutes from "./src/routes/opportunity.routes.js";
import testConnection from "./tests/test-db.js";

const app = express();

app.use(express.json());
app.use(cors());

// ROUTES 
app.use("/opportunities", opportunityRoutes);

// SERVER LISTEN
app.listen(3001, () => {
  console.log("Server running on port 3001");
});

// TEST DB CONNECTION
testConnection();
