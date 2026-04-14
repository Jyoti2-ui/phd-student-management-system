const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  text: { type: String, required: true },
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // HOD who added it
  addedAt: { type: Date, default: Date.now },
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    // FIXED: "principle" → "principal"
    enum: ["student", "hod", "coordinator", "head_coordinator", "principal"],
    required: true,
  },
  department: {
    type: String,
    // Required for student, coordinator, hod — optional for head_coordinator/principal
  },
  // HOD comments visible to the student (only HOD can add these)
  comments: [commentSchema],
});

const User = mongoose.model("User", userSchema);
module.exports = User;