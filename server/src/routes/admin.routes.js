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
router.get("/organizations", AdminController.listOrganizations);
router.get("/organizations/:organizationId", AdminController.getOrganizationDetails);
router.get("/opportunities", AdminController.listAllOpportunities);

// User management
router.get("/users", AdminController.listUsers);
router.get("/users/:userId", AdminController.getUserDetails);
router.patch("/users/:userId/status", AdminController.updateUserStatus);

export default router;
