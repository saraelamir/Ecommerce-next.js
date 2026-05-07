const Cart = require("../models/Cart");
const Product = require("../models/Product");
const createError = require("../utils/createError");

exports.getCart = async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id }).populate("items.product");
  if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });
  res.json({ cart });
};

exports.addToCart = async (req, res, next) => {
  const { productId, quantity = 1 } = req.body;
  const product = await Product.findById(productId);
  if (!product) return next(createError(404, "Product not found"));
  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });
  const existing = cart.items.find((item) => item.product.toString() === productId);
  if (existing) existing.quantity += Number(quantity);
  else cart.items.push({ product: productId, quantity: Number(quantity), price: product.price });
  await cart.save();
  res.json({ cart });
};

exports.updateQuantity = async (req, res) => {
  const { productId, quantity } = req.body;
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return res.json({ cart: { items: [] } });
  const item = cart.items.find((i) => i.product.toString() === productId);
  if (item) item.quantity = Math.max(1, Number(quantity));
  await cart.save();
  res.json({ cart });
};

exports.removeFromCart = async (req, res) => {
  const { productId } = req.params;
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return res.json({ cart: { items: [] } });
  cart.items = cart.items.filter((item) => item.product.toString() !== productId);
  await cart.save();
  res.json({ cart });
};
