const express = require("express");
const router = express.Router();
const { isAuthenticated, authorizeRoles } = require("../middleware/authMiddleware");
const User = require("../models/User");

// GET /headcoordinator/students  — Head Coordinator views ALL students across all departments
router.get(
  "/students",
  isAuthenticated,
  authorizeRoles("head_coordinator"),
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

// PUT /headcoordinator/students/:studentId  — Head Coordinator edits ANY student
router.put(
  "/students/:studentId",
  isAuthenticated,
  authorizeRoles("head_coordinator"),
  async (req, res) => {
    try {
      const { studentId } = req.params;
      const { name, email, department } = req.body;

      const student = await User.findOne({ _id: studentId, role: "student" });

      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }

      // Head coordinator can also update department (cross-dept authority)
      if (name) student.name = name;
      if (email) student.email = email;
      if (department) student.department = department;

      await student.save();
      res.json({ message: "Student updated successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = router;