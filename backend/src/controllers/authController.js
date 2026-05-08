const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const sendToken = require("../utils/sendToken");
const createError = require("../utils/createError");
const { sendEmail } = require("../services/emailService");

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return next(createError(400, "Email already exists"));

    const token = crypto.randomBytes(32).toString("hex");

    const user = await User.create({
      name,
      email,
      password,
      role: role === "seller" ? "seller" : "customer",
      sellerApproved: role === "seller" ? false : true,
      isEmailVerified: false,
      emailVerificationToken: token,
      emailVerificationExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

const verifyUrl = `${process.env.CLIENT_URL}/auth/verify-email?token=${token}`;

    await sendEmail({
      to: email,
      subject: "Verify your email - ShopZone",
      text: `Hello ${name},\n\nPlease verify your email by clicking the link below:\n\n${verifyUrl}\n\nThis link expires in 24 hours.\n\nIf you did not register, ignore this email.`,
    });

    return res.status(201).json({
      message: "Registration successful. Please check your email to verify your account.",
    });
  } catch (error) {
    next(error);
  }
};

// ✅ حط ده
exports.verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.query;
    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: new Date() },
    });

    if (!user) {
      return next(createError(400, "Token غير صالح أو منتهي الصلاحية"));
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = null;
    user.emailVerificationExpires = null;
    await user.save();

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
    if (!user.isEmailVerified) return next(createError(403, "Please verify your email before logging in"));
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
      user = await User.create({
        name: name || "Google User",
        email,
        googleId,
        sellerApproved: true,
        isEmailVerified: true,
      });
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
