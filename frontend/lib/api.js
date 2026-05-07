const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

async function request(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
}

// ─── AUTH ─────────────────────────────────────────────
export const authAPI = {
  register: (body) => request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body) => request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  googleLogin: (body) => request('/auth/google', { method: 'POST', body: JSON.stringify(body) }),
  me: () => request('/auth/me'),
  logout: () => request('/auth/logout', { method: 'POST' }),
  forgotPassword: (email) => request('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }),
  resetPassword: (body) => request('/auth/reset-password', { method: 'POST', body: JSON.stringify(body) }),
};

// ─── USERS ────────────────────────────────────────────
export const usersAPI = {
  getProfile: () => request('/users/profile'),
  updateProfile: (body) => request('/users/profile', { method: 'PUT', body: JSON.stringify(body) }),
  toggleWishlist: (productId) => request('/users/wishlist', { method: 'POST', body: JSON.stringify({ productId }) }),
  getOrders: () => request('/users/orders'),
};

// ─── PRODUCTS ─────────────────────────────────────────
export const productsAPI = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/products${query ? `?${query}` : ''}`);
  },
  getById: (id) => request(`/products/${id}`),
  create: (body) => request('/products', { method: 'POST', body: JSON.stringify(body) }),
  update: (id, body) => request(`/products/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (id) => request(`/products/${id}`, { method: 'DELETE' }),
};

// ─── CART ─────────────────────────────────────────────
export const cartAPI = {
  get: () => request('/cart'),
  add: (productId, quantity) => request('/cart', { method: 'POST', body: JSON.stringify({ productId, quantity }) }),
  update: (productId, quantity) => request('/cart', { method: 'PUT', body: JSON.stringify({ productId, quantity }) }),
  remove: (productId) => request(`/cart/${productId}`, { method: 'DELETE' }),
};

// ─── ORDERS ───────────────────────────────────────────
export const ordersAPI = {
  create: (body) => request('/orders', { method: 'POST', body: JSON.stringify(body) }),
  mine: () => request('/orders/mine'),
  updateStatus: (id, status) => request(`/orders/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
};

// ─── REVIEWS ──────────────────────────────────────────
export const reviewsAPI = {
  getByProduct: (productId) => request(`/reviews/${productId}`),
  add: (body) => request('/reviews', { method: 'POST', body: JSON.stringify(body) }),
};

// ─── COUPONS ──────────────────────────────────────────
export const couponsAPI = {
  getAll: () => request('/coupons'),
  create: (body) => request('/coupons', { method: 'POST', body: JSON.stringify(body) }),
};

// ─── ADMIN ────────────────────────────────────────────
export const adminAPI = {
  dashboard: () => request('/admin/dashboard'),
  users: () => request('/admin/users'),
  blockUser: (id) => request(`/admin/users/${id}/block`, { method: 'PATCH' }),
  deleteUser: (id) => request(`/admin/users/${id}/delete`, { method: 'PATCH' }),
  orders: () => request('/admin/orders'),
};

// ─── SELLER ───────────────────────────────────────────
export const sellerAPI = {
  dashboard: () => request('/seller/dashboard'),
  products: () => request('/seller/products'),
  orders: () => request('/seller/orders'),
};

// ─── CATEGORIES ───────────────────────────────────────
export const categoriesAPI = {
  getAll: () => request('/categories'),
  create: (name) => request('/categories', { method: 'POST', body: JSON.stringify({ name }) }),
  delete: (id) => request(`/categories/${id}`, { method: 'DELETE' }),
};
