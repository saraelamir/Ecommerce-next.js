const Product = require("../models/Product");
const Order = require("../models/Order");

exports.dashboard = async (req, res) => {
  const [products, orders, revenueData] = await Promise.all([
    Product.countDocuments({ seller: req.user._id }),
    Order.countDocuments({ "items.seller": req.user._id }),
    Order.aggregate([
      { $match: { "items.seller": req.user._id } },
      { $unwind: "$items" },
      { $match: { "items.seller": req.user._id } },
      {
        $group: {
          _id: null,
          revenue: {
            $sum: { $multiply: ["$items.price", "$items.quantity"] },
          },
        },
      },
    ]),
  ]);

  const revenue = revenueData[0]?.revenue || 0;

  res.json({ metrics: { products, orders, revenue } });
};

exports.myProducts = async (req, res) => {
  const products = await Product.find({ seller: req.user._id }).sort({ createdAt: -1 });
  res.json({ products });
};

exports.myOrders = async (req, res) => {
  const orders = await Order.find({ "items.seller": req.user._id }).populate("user", "name email");
  res.json({ orders });
};