const express = require("express");
const { protect, authorize } = require("../middleware/auth");
const controller = require("../controllers/sellerController");

const router = express.Router();
router.use(protect, authorize("seller", "admin"));
router.get("/dashboard", controller.dashboard);
router.get("/products", controller.myProducts);
router.get("/orders", controller.myOrders);

module.exports = router;
