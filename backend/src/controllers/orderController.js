const Cart = require("../models/Cart");
const Order = require("../models/Order");
const Coupon = require("../models/Coupon");
const User = require("../models/User");
const { sendEmail } = require("../services/emailService");
const createError = require("../utils/createError");

exports.createOrder = async (req, res, next) => {
  const { shippingAddress, paymentMethod = "cod", couponCode } = req.body;
  const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");
  if (!cart || !cart.items.length) return next(createError(400, "Cart is empty"));
  const subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  let discount = 0;
  let coupon = null;
  if (couponCode) {
    coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), active: true });
    if (coupon && coupon.expiresAt > new Date()) {
      discount = (subtotal * coupon.discountPercent) / 100;
    }
  }
  const total = subtotal - discount;

  if (paymentMethod === "wallet") {
    const user = await User.findById(req.user._id);
    if (user.walletBalance < total) return next(createError(400, "Insufficient wallet balance"));
    user.walletBalance -= total;
    await user.save();
  }

  const order = await Order.create({
    user: req.user._id,
    items: cart.items.map((item) => ({
      product: item.product._id,
      seller: item.product.seller,
      quantity: item.quantity,
      price: item.price,
    })),
    shippingAddress,
    paymentMethod,
    paymentStatus: paymentMethod === "cod" ? "pending" : "paid",
    coupon: coupon?._id,
    subtotal,
    discount,
    total,
  });

  cart.items = [];
  await cart.save();
  await sendEmail({
    to: req.user.email,
    subject: "Order Created",
    text: `Order ${order._id} has been created successfully.`,
  });
  res.status(201).json({ order });
};

exports.getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).populate("items.product").sort({ createdAt: -1 });
  res.json({ orders });
};

exports.updateOrderStatus = async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) return next(createError(404, "Order not found"));
  order.status = req.body.status || order.status;
  await order.save();
  res.json({ order });
};
