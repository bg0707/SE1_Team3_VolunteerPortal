import express from "express";
import {
  getPendingOrganizations,
  verifyOrganization
} from "../controllers/admin.controller.js";

const router = express.Router();

// get all non-verified organizations
router.get("/organizations/pending", getPendingOrganizations);

// verify a specific organization
router.patch("/organizations/verify/:id", verifyOrganization);

export default router;