const express = require("express");
const { protect, authorize } = require("../middleware/auth");
const controller = require("../controllers/categoryController");

const router = express.Router();
router.get("/", controller.getCategories);
router.post("/", protect, authorize("admin"), controller.createCategory);
router.delete("/:id", protect, authorize("admin"), controller.deleteCategory);

module.exports = router;
