const jwt = require("jsonwebtoken");
const User = require("../models/User");
const sendToken = require("../utils/sendToken");
const createError = require("../utils/createError");

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return next(createError(400, "Email already exists"));
    const user = await User.create({
      name,
      email,
      password,
      role: role === "seller" ? "seller" : "customer",
      sellerApproved: role === "seller" ? false : true,
    });
    return sendToken(res, user);
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return next(createError(401, "Invalid credentials"));
    }
    if (user.isBlocked) return next(createError(403, "Account blocked"));
    return sendToken(res, user);
  } catch (error) {
    next(error);
  }
};

exports.googleLogin = async (req, res, next) => {
  try {
    const { email, name, googleId } = req.body;
    if (!email || !googleId) return next(createError(400, "Invalid Google payload"));
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ name: name || "Google User", email, googleId, sellerApproved: true });
    }
    return sendToken(res, user);
  } catch (error) {
    next(error);
  }
};

exports.me = async (req, res) => {
  res.json({ user: req.user });
};

exports.logout = async (_req, res) => {
  res.json({ message: "Logged out" });
};

exports.resetPasswordRequest = async (_req, res) => {
  res.json({ message: "Reset password email queued (mock)" });
};

exports.resetPasswordConfirm = async (_req, res) => {
  res.json({ message: "Password reset complete (mock)" });
};
