import express from "express";
import registerVolunteer from "../controllers/registration.volunteer.controller.js";
import registerOrganization from "../controllers/registration.organization.controller.js";
import loginController from "../controllers/login.controller.js";

const router = express.Router();

// login 
router.post("/login",loginController);

// register volunteer
router.post("/register/volunteer", registerVolunteer);

// register organization
router.post("/register/organization",registerOrganization);

export default router;
