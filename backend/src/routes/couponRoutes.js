const express = require("express");
const { protect, authorize } = require("../middleware/auth");
const controller = require("../controllers/couponController");

const router = express.Router();
router.get("/", controller.getCoupons);
router.post("/", protect, authorize("admin"), controller.createCoupon);

module.exports = router;
