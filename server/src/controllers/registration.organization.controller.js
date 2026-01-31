import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import Organization from "../models/organization.model.js";
import jwt from "jsonwebtoken";
import { ActivityLogService } from "../services/activityLog.service.js";

const registerOrganization = async (req, res) => {
  try {
    const { email, password, organizationName, description } = req.body;

    if (!email || !password || !organizationName) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    // Check if email exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered." });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create User
    const newUser = await User.create({
      email,
      password: hashedPassword,
      role: "organization",
    });

    // Create Organization entry
    await Organization.create({
      userId: newUser.userId,
      name: organizationName,
      description,
    });

    // Auto-login
    const token = jwt.sign(
      {
        userId: newUser.userId,
        email: newUser.email,
        role: newUser.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({
      message: "Organization registered successfully",
      token,
      user: {
        userId: newUser.userId,
        email: newUser.email,
        role: newUser.role,
      },
    });

    await ActivityLogService.log({
      actorUserId: newUser.userId,
      action: "user.register.organization",
      entityType: "user",
      entityId: newUser.userId,
      metadata: {
        email: newUser.email,
      },
    });

  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export default registerOrganization;
