import express from "express"
import { ApplicationController } from "../controllers/application.controller.js"

const router = express.Router();

// Create a new application
router.post("/apply", ApplicationController.apply);

export default router;