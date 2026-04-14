const express = require("express");
const router = express.Router();
const { isAuthenticated, authorizeRoles } = require("../middleware/authMiddleware");
const User = require("../models/User");

// GET /student/me  — student views their own profile (includes HOD comments)
// CHANGED: now excludes password from response, and populates comment author name
router.get(
  "/me",
  isAuthenticated,
  authorizeRoles("student"),
  async (req, res) => {
    try {
      const userId = req.session.user.id;

      // Exclude password; populate who added each comment
      const user = await User.findById(userId)
        .select("-password")
        .populate("comments.addedBy", "name role");

      if (!user) return res.status(404).json({ message: "Student not found" });

      res.json(user);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = router;