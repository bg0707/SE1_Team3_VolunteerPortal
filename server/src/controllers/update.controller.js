// controllers/updateMe.controller.js
import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import Volunteer from "../models/volunteer.model.js";
import Organization from "../models/organization.model.js";
import { ActivityLogService } from "../services/activityLog.service.js";

const updateMyAccount = async (req, res) => {
  try {
    const userId = req.user.userId;
    const userRole = req.user.role;

    const {
      password,
      fullName,
      age,
      organizationName,
      description,
    } = req.body;

    // Update password

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      await User.update(
        { password: hashedPassword },
        { where: { userId } }
      );
    }

    // Update role-specific fields

    if (userRole === "volunteer") {
      await Volunteer.update(
        {
          ...(fullName && { fullName }),
          ...(age !== undefined && { age }),
        },
        { where: { userId } }
      );
    }

    if (userRole === "organization") {
      await Organization.update(
        {
          ...(organizationName && { name: organizationName }),
          ...(description !== undefined && { description }),
        },
        { where: { userId } }
      );
    }

    // Log activity
    await ActivityLogService.log({
      actorUserId: userId,
      action: "user.update.profile",
      entityType: "user",
      entityId: userId,
      metadata: {
        role: userRole,
      },
    });

    res.json({ message: "Account updated successfully" });

  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export default updateMyAccount;