import express from "express";
import { authenticateUser } from "../middleware/authenticateUser.js";
import { requireAdmin } from "../middleware/requireAdmin.js";
import { AdminController } from "../controllers/admin.controller.js";

const router = express.Router();

// All admin routes require a valid JWT token and admin role.
router.use(authenticateUser, requireAdmin);

// Reported opportunities (moderation)
router.get("/reported-opportunities", AdminController.getReportedOpportunities);
router.post("/opportunities/:opportunityId/moderate", AdminController.moderateOpportunity);

// Organization verification
router.get("/organizations/pending", AdminController.listPendingOrganizations);
router.post("/organizations/:organizationId/review", AdminController.reviewOrganization);

export default router;

