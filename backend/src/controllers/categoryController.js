const Category = require("../models/Category");

exports.createCategory = async (req, res) => {
  const { name } = req.body || {};
  if (!name) {
    return res.status(400).json({ message: "Category name is required" });
  }
  const slug = name.toLowerCase().replace(/\s+/g, "-");
  const category = await Category.create({ name, slug });
  res.status(201).json({ category });
};

exports.getCategories = async (_req, res) => {
  const categories = await Category.find().sort({ name: 1 });
  res.json({ categories });
};

exports.deleteCategory = async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  res.json({ message: "Category deleted" });
};
