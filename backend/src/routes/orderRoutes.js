const express = require("express");
const { protect, authorize } = require("../middleware/auth");
const controller = require("../controllers/orderController");

const router = express.Router();
router.use(protect);
router.post("/", controller.createOrder);
router.get("/mine", controller.getMyOrders);
router.patch("/:id/status", authorize("admin"), controller.updateOrderStatus);

module.exports = router;
