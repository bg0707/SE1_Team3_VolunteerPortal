// routes/user.routes.js
import express from "express";
import updateMyAccount from "../controllers/update.controller.js";
import authenticateUser from "../middleware/authenticateUser.js";

const router = express.Router();

router.put("/me", authenticateUser, updateMyAccount);

export default router;