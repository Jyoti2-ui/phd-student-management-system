const express = require("express");
const router = express.Router();
const { loginUser, registerUser, logoutUser } = require("../controllers/authController");

// POST /auth/login
router.post("/login", loginUser);

// POST /auth/register  — ADDED: to create users via Thunder Client
router.post("/register", registerUser);

// POST /auth/logout    — ADDED: clean session destroy
router.post("/logout", logoutUser);

module.exports = router;