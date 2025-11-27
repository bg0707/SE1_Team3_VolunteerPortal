import express from "express";
import registerVolunteer from "../controllers/registration.volunteer.controllers.js";
import registerOrganization from "../controllers/registration.organization.controllers.js";
import loginController from "../controllers/login.controllers.js";

const router = express.Router();

// login 
router.post("/login",loginController);

// register volunteer
router.post("/register/volunteer", registerVolunteer);

// register organization
router.post("/register/organization",registerOrganization);

export default router;
