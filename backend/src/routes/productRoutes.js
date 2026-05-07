const express = require("express");
const { protect, authorize } = require("../middleware/auth");
const controller = require("../controllers/productController");

const router = express.Router();
router.get("/", controller.getProducts);
router.get("/:id", controller.getProduct);
router.post("/", protect, authorize("admin", "seller"), controller.createProduct);
router.put("/:id", protect, authorize("admin", "seller"), controller.updateProduct);
router.delete("/:id", protect, authorize("admin", "seller"), controller.deleteProduct);

module.exports = router;
