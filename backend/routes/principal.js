const express = require("express");
const router = express.Router();
const { isAuthenticated, authorizeRoles } = require("../middleware/authMiddleware");
const User = require("../models/User");

// GET /principal/students  — Principal views ALL students (read-only, no edit, no comment)
router.get(
  "/students",
  isAuthenticated,
  authorizeRoles("principal"),
  async (req, res) => {
    try {
      const students = await User.find({ role: "student" }).select("-password");
      res.json(students);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = router;