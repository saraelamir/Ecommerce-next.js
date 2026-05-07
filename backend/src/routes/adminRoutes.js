const express = require("express");
const { protect, authorize } = require("../middleware/auth");
const controller = require("../controllers/adminController");

const router = express.Router();
router.use(protect, authorize("admin"));
router.get("/dashboard", controller.getDashboard);
router.get("/users", controller.getUsers);
router.patch("/users/:id/block", controller.toggleBlockUser);
router.patch("/users/:id/delete", controller.softDeleteUser);
router.get("/orders", controller.getOrders);

module.exports = router;
