/* eslint-disable no-console */
const BASE = "http://localhost:5000/api";

async function request(path, options = {}) {
  const mergedHeaders = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };
  const res = await fetch(`${BASE}${path}`, {
    headers: mergedHeaders,
    ...options,
    headers: mergedHeaders,
  });
  let data = {};
  try {
    data = await res.json();
  } catch (_e) {
    data = { raw: "non-json response" };
  }
  return { ok: res.ok, status: res.status, data };
}

function assert(cond, message, payload) {
  if (!cond) {
    console.error(`FAIL: ${message}`);
    if (payload) console.error(JSON.stringify(payload, null, 2));
    process.exit(1);
  }
  console.log(`PASS: ${message}`);
}

async function run() {
  const suffix = Date.now();
  const adminEmail = `admin${suffix}@test.com`;
  const sellerEmail = `seller${suffix}@test.com`;
  const customerEmail = `customer${suffix}@test.com`;

  // Auth
  const adminReg = await request("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name: "Admin", email: adminEmail, password: "123456", role: "customer" }),
  });
  assert(adminReg.ok, "register admin account");
  const sellerReg = await request("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name: "Seller", email: sellerEmail, password: "123456", role: "seller" }),
  });
  assert(sellerReg.ok, "register seller account");
  const customerReg = await request("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name: "Customer", email: customerEmail, password: "123456", role: "customer" }),
  });
  assert(customerReg.ok, "register customer account");

  const adminToken = adminReg.data.token;
  const sellerToken = sellerReg.data.token;
  const customerToken = customerReg.data.token;
  const adminId = adminReg.data.user.id;

  // elevate admin user role for smoke-test coverage
  const mongoose = require("mongoose");
  await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/ecommerce_platform");
  const User = require("../src/models/User");
  await User.findByIdAndUpdate(adminId, { role: "admin", sellerApproved: true });
  await mongoose.disconnect();

  const adminLogin = await request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email: adminEmail, password: "123456" }),
  });
  assert(adminLogin.ok, "login admin");
  const realAdminToken = adminLogin.data.token;

  const me = await request("/auth/me", { headers: { Authorization: `Bearer ${customerToken}` } });
  assert(me.ok, "get current user /auth/me");

  // Category & Product
  const category = await request("/categories", {
    method: "POST",
    headers: { Authorization: `Bearer ${realAdminToken}` },
    body: JSON.stringify({ name: `Electronics-${suffix}` }),
  });
  assert(category.ok, "admin creates category", category);
  const categoryId = category.data.category._id;

  const product = await request("/products", {
    method: "POST",
    headers: { Authorization: `Bearer ${sellerToken}` },
    body: JSON.stringify({
      name: `Phone-${suffix}`,
      description: "Smartphone",
      price: 499,
      images: ["https://example.com/p.jpg"],
      category: categoryId,
      stockQuantity: 30,
    }),
  });
  assert(product.ok, "seller creates product", product);
  const productId = product.data.product._id;

  const listProducts = await request("/products?search=Phone&page=1&limit=10");
  assert(listProducts.ok, "list products with pagination");
  const getProduct = await request(`/products/${productId}`);
  assert(getProduct.ok, "get single product");

  // Cart
  const addToCart = await request("/cart", {
    method: "POST",
    headers: { Authorization: `Bearer ${customerToken}` },
    body: JSON.stringify({ productId, quantity: 2 }),
  });
  assert(addToCart.ok, "add to cart", addToCart);
  const getCart = await request("/cart", { headers: { Authorization: `Bearer ${customerToken}` } });
  assert(getCart.ok, "get cart");
  const updateCart = await request("/cart", {
    method: "PUT",
    headers: { Authorization: `Bearer ${customerToken}` },
    body: JSON.stringify({ productId, quantity: 3 }),
  });
  assert(updateCart.ok, "update cart quantity");

  // Coupons + Order
  const coupon = await request("/coupons", {
    method: "POST",
    headers: { Authorization: `Bearer ${realAdminToken}` },
    body: JSON.stringify({ code: `SAVE${suffix}`, discountPercent: 10, expiresAt: "2099-01-01T00:00:00.000Z" }),
  });
  assert(coupon.ok, "admin creates coupon", coupon);

  const createOrder = await request("/orders", {
    method: "POST",
    headers: { Authorization: `Bearer ${customerToken}` },
    body: JSON.stringify({
      shippingAddress: "Test Address",
      paymentMethod: "cod",
      couponCode: `SAVE${suffix}`,
    }),
  });
  assert(createOrder.ok, "customer creates order", createOrder);
  const orderId = createOrder.data.order._id;

  const myOrders = await request("/orders/mine", { headers: { Authorization: `Bearer ${customerToken}` } });
  assert(myOrders.ok, "customer gets order history");

  const patchStatus = await request(`/orders/${orderId}/status`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${realAdminToken}` },
    body: JSON.stringify({ status: "processing" }),
  });
  assert(patchStatus.ok, "admin updates order status", patchStatus);

  // Reviews
  const review = await request("/reviews", {
    method: "POST",
    headers: { Authorization: `Bearer ${customerToken}` },
    body: JSON.stringify({ productId, rating: 5, comment: "Excellent" }),
  });
  assert(review.ok, "customer creates review");
  const reviewsList = await request(`/reviews/${productId}`);
  assert(reviewsList.ok, "get product reviews");

  // User
  const profile = await request("/users/profile", { headers: { Authorization: `Bearer ${customerToken}` } });
  assert(profile.ok, "get profile");
  const updateProfile = await request("/users/profile", {
    method: "PUT",
    headers: { Authorization: `Bearer ${customerToken}` },
    body: JSON.stringify({ name: "Customer Updated", phone: "01000000000", address: "Cairo" }),
  });
  assert(updateProfile.ok, "update profile");
  const wishlist = await request("/users/wishlist", {
    method: "POST",
    headers: { Authorization: `Bearer ${customerToken}` },
    body: JSON.stringify({ productId }),
  });
  assert(wishlist.ok, "toggle wishlist");
  const userOrders = await request("/users/orders", { headers: { Authorization: `Bearer ${customerToken}` } });
  assert(userOrders.ok, "get user orders endpoint");

  // Admin
  const adminDash = await request("/admin/dashboard", { headers: { Authorization: `Bearer ${realAdminToken}` } });
  assert(adminDash.ok, "admin dashboard");
  const adminUsers = await request("/admin/users", { headers: { Authorization: `Bearer ${realAdminToken}` } });
  assert(adminUsers.ok, "admin users list");
  const blockSeller = await request(`/admin/users/${sellerReg.data.user.id}/block`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${realAdminToken}` },
  });
  assert(blockSeller.ok, "admin block/unblock user");
  const unblockSeller = await request(`/admin/users/${sellerReg.data.user.id}/block`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${realAdminToken}` },
  });
  assert(unblockSeller.ok, "admin unblock user");
  const adminOrders = await request("/admin/orders", { headers: { Authorization: `Bearer ${realAdminToken}` } });
  assert(adminOrders.ok, "admin orders list");

  // Seller
  const sellerDash = await request("/seller/dashboard", { headers: { Authorization: `Bearer ${sellerToken}` } });
  assert(sellerDash.ok, "seller dashboard");
  const sellerProducts = await request("/seller/products", { headers: { Authorization: `Bearer ${sellerToken}` } });
  assert(sellerProducts.ok, "seller products");
  const sellerOrders = await request("/seller/orders", { headers: { Authorization: `Bearer ${sellerToken}` } });
  assert(sellerOrders.ok, "seller orders");

  console.log("\nAll critical endpoints are working.");
}

run().catch((error) => {
  console.error("Smoke test crashed:", error);
  process.exit(1);
});
