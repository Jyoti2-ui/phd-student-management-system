const bcrypt = require("bcrypt");
const User = require("../models/User");

// ── LOGIN ──────────────────────────────────────────────────────────────────
const loginUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Validate all fields present
    if (!email || !password || !role) {
      return res.status(400).json({ message: "Email, password and role are required" });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // Check if selected role matches actual role in DB
    if (user.role !== role) {
      return res.status(403).json({ message: "Access denied. Selected role does not match your account." });
    }

    // Store session
    req.session.user = {
      id: user._id,
      role: user.role,
      department: user.department,
    };

    res.json({ message: "Login successful", role: user.role });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ── REGISTER ───────────────────────────────────────────────────────────────
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, department } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ name, email, password: hashedPassword, role, department });
    await user.save();

    res.status(201).json({ message: "User registered successfully" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ── LOGOUT ─────────────────────────────────────────────────────────────────
const logoutUser = (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ message: "Logout failed" });
    res.json({ message: "Logged out successfully" });
  });
};

module.exports = { loginUser, registerUser, logoutUser };