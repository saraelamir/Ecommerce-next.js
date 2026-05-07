const express = require("express");
const { protect } = require("../middleware/auth");
const controller = require("../controllers/cartController");

const router = express.Router();
router.use(protect);
router.get("/", controller.getCart);
router.post("/", controller.addToCart);
router.put("/", controller.updateQuantity);
router.delete("/:productId", controller.removeFromCart);

module.exports = router;
