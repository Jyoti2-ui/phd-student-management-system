const express = require("express");
const session = require("express-session");
const cors = require("cors");
const mongoose = require("mongoose");

const authRoutes            = require("./routes/auth");
const studentRoutes         = require("./routes/student");
const hodRoutes             = require("./routes/hod");
const coordinatorRoutes     = require("./routes/coordinator");
const headCoordinatorRoutes = require("./routes/headcoordinator");
const principalRoutes       = require("./routes/principal");

const app = express();

// ── CORS ──────
  app.use(cors({
  origin: "http://localhost:5500",
  credentials: true,
}));

// ── MIDDLEWARE ─────────────────────────────────────────────────────────────
app.use(express.json());

// ── SESSION with connect-mongo v3 ──────────────────────────────────────────
const MongoStore = require("connect-mongo")(session);

app.use(session({
  secret: process.env.SESSION_SECRET || "super-secret-key",
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    collection: "sessions",
  }),
  cookie: {
    secure: false,
    httpOnly: false,
    maxAge: 1000 * 60 * 60 * 24,
  },
}));

// ── ROUTES ─────────────────────────────────────────────────────────────────
app.use("/auth", authRoutes);
app.use("/student", studentRoutes);
app.use("/hod", hodRoutes);
app.use("/coordinator", coordinatorRoutes);
app.use("/headcoordinator", headCoordinatorRoutes);
app.use("/principal", principalRoutes);

// ── HEALTH CHECK ───────────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.send("API IS RUNNING.....");
});

module.exports = app;