import crypto from "crypto";
import User from "../models/user.model.js";
import PasswordReset from "../models/passwordReset.model.js";
import bcrypt from "bcrypt";

// REQUEST PASSWORD RESET
export const requestPasswordReset = async (req, res) => {
  const { email } = req.body;
  console.log("Request password reset called with email:", email);
  if (!email) return res.status(400).json({ message: "Email is required" });

  try {
    const user = await User.findOne({ where: { email } });
    console.log("User found:", user);
    if (!user) {
      return res.status(200).json({ message: "If your email exists, you'll receive a reset token" });
    }

    const token = crypto.randomBytes(16).toString("hex");
    const expiresAt = new Date(Date.now() + 3600 * 1000); // 1 hour

    await PasswordReset.create({ token, userId: user.userId, expiresAt });

    res.json({ message: "Password reset token generated", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// RESET PASSWORD
export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword)
    return res.status(400).json({ message: "Token and new password are required" });

  try {
    const resetEntry = await PasswordReset.findOne({ where: { token } });
    console.log("PasswordReset entry created:", resetEntry);
    if (!resetEntry || resetEntry.expiresAt < new Date()) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.update({ password: hashedPassword }, { where: { userId: resetEntry.userId } });

    await resetEntry.destroy();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};