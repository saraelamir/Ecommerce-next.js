const User = require("../models/User");
const Order = require("../models/Order");

exports.getProfile = async (req, res) => {
  const user = await User.findById(req.user._id).select("-password").populate("wishlist");
  res.json({ user });
};

exports.updateProfile = async (req, res) => {
  const { name, phone, address } = req.body;
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { name, phone, address },
    { new: true }
  ).select("-password");
  res.json({ user });
};

exports.toggleWishlist = async (req, res) => {
  const { productId } = req.body;
  const user = await User.findById(req.user._id);
  const exists = user.wishlist.some((id) => id.toString() === productId);
  if (exists) {
    user.wishlist = user.wishlist.filter((id) => id.toString() !== productId);
  } else {
    user.wishlist.push(productId);
  }
  await user.save();
  res.json({ wishlist: user.wishlist });
};

exports.getOrderHistory = async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 }).populate("items.product");
  res.json({ orders });
};
