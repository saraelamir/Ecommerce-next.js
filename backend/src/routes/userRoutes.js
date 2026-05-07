const express = require("express");
const { protect } = require("../middleware/auth");
const controller = require("../controllers/userController");

const router = express.Router();
router.use(protect);
router.get("/profile", controller.getProfile);
router.put("/profile", controller.updateProfile);
router.post("/wishlist", controller.toggleWishlist);
router.get("/orders", controller.getOrderHistory);

module.exports = router;
