const express = require("express");
const router = express.Router();
const { isAuthenticated, authorizeRoles } = require("../middleware/authMiddleware");
const User = require("../models/User");

// GET /hod/students  — HOD views all students in their department
router.get(
  "/students",
  isAuthenticated,
  authorizeRoles("hod"),
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

// POST /hod/students/:studentId/comment  — HOD adds a comment on a student
// ADDED: this is the key HOD-only capability per permissions matrix
router.post(
  "/students/:studentId/comment",
  isAuthenticated,
  authorizeRoles("hod"),
  async (req, res) => {
    try {
      const hodDepartment = req.session.user.department;
      const { studentId } = req.params;
      const { text } = req.body;

      if (!text || !text.trim()) {
        return res.status(400).json({ message: "Comment text is required" });
      }

      // Ensure the student belongs to HOD's department
      const student = await User.findOne({
        _id: studentId,
        role: "student",
        department: hodDepartment,
      });

      if (!student) {
        return res.status(404).json({ message: "Student not found in your department" });
      }

      student.comments.push({
        text: text.trim(),
        addedBy: req.session.user.id,
      });

      await student.save();
      res.json({ message: "Comment added successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = router;