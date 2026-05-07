const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");

exports.getDashboard = async (_req, res) => {
  const [users, products, orders] = await Promise.all([
    User.countDocuments({ isDeleted: false }),
    Product.countDocuments(),
    Order.countDocuments(),
  ]);
  res.json({ metrics: { users, products, orders } });
};

exports.getUsers = async (_req, res) => {
  const users = await User.find().select("-password").sort({ createdAt: -1 });
  res.json({ users });
};

exports.toggleBlockUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  user.isBlocked = !user.isBlocked;
  await user.save();
  res.json({ user });
};

exports.softDeleteUser = async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
  res.json({ user });
};

exports.getOrders = async (_req, res) => {
  const orders = await Order.find().populate("user", "name email").sort({ createdAt: -1 });
  res.json({ orders });
};
