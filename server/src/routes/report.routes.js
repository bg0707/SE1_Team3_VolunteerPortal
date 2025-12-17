import express from "express";

import { authenticateUser } from "../middleware/authenticateUser.js";
import { requireVolunteer } from "../middleware/requireVolunteer.js";
import { ReportController } from "../controllers/report.controller.js";

const router = express.Router();

// Volunteers can report suspicious listings.
router.post("/", authenticateUser, requireVolunteer, ReportController.create);

export default router;
