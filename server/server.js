import express from "express";
import cors from "cors";
import authenticationRoutes from "./src/routes/authentication.routes.js";
import testConnection from "./tests/test-db.js";

const app = express();

app.use(express.json());
app.use(cors());

// routes
app.use("/authentication", authenticationRoutes);

// server listen 
app.listen(3001, () =>{
  console.log("Service running on port 3001");
});

// test db connection
testConnection();


