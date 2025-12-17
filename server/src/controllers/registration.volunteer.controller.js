import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import Volunteer from "../models/volunteer.model.js";
import jwt from "jsonwebtoken";

const registerVolunteer = async (req, res) => {
  try {
    const { email, password, fullName, age } = req.body;

    // Check missing fields
    if (!email || !password || !fullName) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    // Check if email already exists
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
      role: "volunteer",
    });

    // Create Volunteer entry
    await Volunteer.create({
      userId: newUser.userId,
      fullName,
      age: age ?? null,
    });

    // Optional: Auto-login
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
      message: "Volunteer registered successfully",
      token,
      user: {
        userId: newUser.userId,
        email: newUser.email,
        role: newUser.role,
      },
    });

  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export default registerVolunteer;
