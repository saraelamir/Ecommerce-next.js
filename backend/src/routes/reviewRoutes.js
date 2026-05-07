const express = require("express");
const { protect } = require("../middleware/auth");
const controller = require("../controllers/reviewController");

const router = express.Router();
router.get("/:productId", controller.getProductReviews);
router.post("/", protect, controller.createReview);

module.exports = router;
