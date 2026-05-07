const jwt = require("jsonwebtoken");

const sendToken = (res, user) => {
  const token = jwt.sign(
    { id: user._id, role: user.role, sellerApproved: user.sellerApproved },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );

  return res.json({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone || "",
      address: user.address || "",
      isBlocked: user.isBlocked,
      sellerApproved: user.sellerApproved,
      walletBalance: user.walletBalance || 0,
    },
  });
};

module.exports = sendToken;
