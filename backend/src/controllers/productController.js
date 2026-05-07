const Product = require("../models/Product");
const Category = require("../models/Category");
const createError = require("../utils/createError");

async function resolveCategoryId(categoryInput) {
  if (!categoryInput) return null;

  if (/^[a-f\d]{24}$/i.test(categoryInput)) return categoryInput;

  const name = categoryInput.trim();
  const slug = name.toLowerCase().replace(/\s+/g, "-");
  let cat = await Category.findOne({ slug });
  if (!cat) cat = await Category.create({ name, slug });
  return cat._id;
}

exports.createProduct = async (req, res, next) => {
  try {
    const categoryId = await resolveCategoryId(req.body.category);
    const product = await Product.create({
      ...req.body,
      category: categoryId,
      seller: req.user._id,
    });
    res.status(201).json({ product });
  } catch (err) {
    next(err);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return next(createError(404, "Product not found"));
    const isAdmin = req.user.role === "admin";
    if (!isAdmin && product.seller.toString() !== req.user._id.toString()) {
      return next(createError(403, "Not allowed"));
    }
    if (req.body.category) {
      req.body.category = await resolveCategoryId(req.body.category);
    }
    Object.assign(product, req.body);
    await product.save();
    res.json({ product });
  } catch (err) {
    next(err);
  }
};

exports.deleteProduct = async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) return next(createError(404, "Product not found"));
  const isAdmin = req.user.role === "admin";
  if (!isAdmin && product.seller.toString() !== req.user._id.toString()) {
    return next(createError(403, "Not allowed"));
  }
  await product.deleteOne();
  res.json({ message: "Product deleted" });
};

exports.getProducts = async (req, res) => {
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 10);
  const skip = (page - 1) * limit;
  const query = { isActive: true };
  if (req.query.search) query.name = { $regex: req.query.search, $options: "i" };
  if (req.query.category) query.category = req.query.category;
  if (req.query.minPrice || req.query.maxPrice) {
    query.price = {};
    if (req.query.minPrice) query.price.$gte = Number(req.query.minPrice);
    if (req.query.maxPrice) query.price.$lte = Number(req.query.maxPrice);
  }
  const [products, total] = await Promise.all([
    Product.find(query).populate("category seller", "name").skip(skip).limit(limit).sort({ createdAt: -1 }),
    Product.countDocuments(query),
  ]);
  res.json({ products, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
};

exports.getProduct = async (req, res, next) => {
  const product = await Product.findById(req.params.id).populate("category seller", "name");
  if (!product) return next(createError(404, "Product not found"));
  res.json({ product });
};