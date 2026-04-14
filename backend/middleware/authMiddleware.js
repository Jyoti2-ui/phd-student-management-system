const isAuthenticated = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "Not logged in" });
  }
  next();
};

// FIXED: added isAuthenticated check inside authorizeRoles so session.user
// is never accessed when undefined (prevents crash if called without isAuthenticated)
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.session.user) {
      return res.status(401).json({ message: "Not logged in" });
    }
    const userRole = req.session.user.role;
    if (!roles.includes(userRole)) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
};

module.exports = { isAuthenticated, authorizeRoles };

