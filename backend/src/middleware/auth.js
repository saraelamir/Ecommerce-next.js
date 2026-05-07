const jwt = require("jsonwebtoken");
const User = require("../models/User");
const createError = require("../utils/createError");

const protect = async (req, _res, next) => {
  try {
    const token = req.headers.authorization?.startsWith("Bearer ")
      ? req.headers.authorization.split(" ")[1]
      : null;

    if (!token) return next(createError(401, "Unauthorized"));

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user || user.isBlocked) return next(createError(401, "Access denied"));
    req.user = user;
    next();
  } catch (error) {
    next(createError(401, "Invalid token"));
  }
};

const authorize = (...roles) => (req, _res, next) => {
  if (!roles.includes(req.user.role)) {
    return next(createError(403, "Forbidden"));
  }
  next();
};

module.exports = { protect, authorize };
