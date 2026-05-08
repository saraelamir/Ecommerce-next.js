const express = require("express");
const { body } = require("express-validator");
const validate = require("../middleware/validate");
const { protect } = require("../middleware/auth");
const controller = require("../controllers/authController");

const router = express.Router();

router.post("/register", [body("name").notEmpty(), body("email").isEmail(), body("password").isLength({ min: 6 })], validate, controller.register);
router.post("/login", [body("email").isEmail(), body("password").notEmpty()], validate, controller.login);
router.get("/verify-email", controller.verifyEmail);
router.post("/google", controller.googleLogin);
router.post("/logout", controller.logout);
router.get("/me", protect, controller.me);
router.post("/forgot-password", controller.resetPasswordRequest);
router.post("/reset-password", controller.resetPasswordConfirm);

module.exports = router;
