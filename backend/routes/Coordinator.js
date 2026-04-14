const express = require("express");
const router = express.Router();
const { isAuthenticated, authorizeRoles } = require("../middleware/authMiddleware");
const User = require("../models/User");

// GET /coordinator/students  — Coordinator views students in their department only
router.get(
  "/students",
  isAuthenticated,
  authorizeRoles("coordinator"),
  async (req, res) => {
    try {
      const department = req.session.user.department;
      const students = await User.find({ role: "student", department }).select("-password");
      res.json(students);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// PUT /coordinator/students/:studentId  — Coordinator edits a student in their department
// Can update: name, email, department (basic profile fields only)
router.put(
  "/students/:studentId",
  isAuthenticated,
  authorizeRoles("coordinator"),
  async (req, res) => {
    try {
      const coordinatorDepartment = req.session.user.department;
      const { studentId } = req.params;
      const { name, email } = req.body;

      // Ensure student belongs to coordinator's department
      const student = await User.findOne({
        _id: studentId,
        role: "student",
        department: coordinatorDepartment,
      });

      if (!student) {
        return res.status(404).json({ message: "Student not found in your department" });
      }

      // Only allow updating name and email — not role, department, password, comments
      if (name) student.name = name;
      if (email) student.email = email;

      await student.save();
      res.json({ message: "Student updated successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = router;