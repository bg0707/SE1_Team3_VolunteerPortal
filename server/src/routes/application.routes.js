import express from "express"
import { ApplicationController } from "../controllers/application.controller.js"
import { authenticateUser } from "../middleware/authenticateUser.js";

const router = express.Router();

router.get("/opportunity/:opportunityId", authenticateUser, ApplicationController.listByOpportunity);

router.patch("/:applicationId/status", authenticateUser, ApplicationController.review);

// Create a new application
router.post("/apply", ApplicationController.apply);

// Get all applications of a volunteer
router.get("/volunteer/:volunteerId", ApplicationController.getMyApplications);

// // Get application details
// router.get("/:applicationId", ApplicationController.getMyApplicationDetails);

// // Cancel an application
router.patch("/:applicationId/cancel", authenticateUser, ApplicationController.cancel);

// // Update application fields
// router.put("/:applicationId", ApplicationController.update);

export default router;
