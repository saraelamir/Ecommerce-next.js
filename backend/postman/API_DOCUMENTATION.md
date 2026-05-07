# Ecommerce API Documentation

Base URL: `http://localhost:5000/api`

## Auth Routes
- `POST /auth/register` - register with name, email, password, role
- `POST /auth/login` - login and get JWT
- `POST /auth/google` - Google OAuth callback payload
- `GET /auth/me` - current authenticated user
- `POST /auth/logout` - logout
- `POST /auth/forgot-password` - mock forgot password
- `POST /auth/reset-password` - mock reset password

## User Routes
- `GET /users/profile` - get profile and wishlist
- `PUT /users/profile` - update name/phone/address
- `POST /users/wishlist` - toggle product wishlist `{ productId }`
- `GET /users/orders` - order history

## Product Routes
- `GET /products` - search/filter/pagination by `search`, `category`, `minPrice`, `maxPrice`, `page`, `limit`
- `GET /products/:id` - product details
- `POST /products` - create product (admin/seller)
- `PUT /products/:id` - update product (owner seller/admin)
- `DELETE /products/:id` - delete product

## Cart Routes
- `GET /cart` - get persistent cart
- `POST /cart` - add item `{ productId, quantity }`
- `PUT /cart` - update quantity `{ productId, quantity }`
- `DELETE /cart/:productId` - remove item

## Order Routes
- `POST /orders` - create order with `shippingAddress`, `paymentMethod`, optional `couponCode`
- `GET /orders/mine` - user order history
- `PATCH /orders/:id/status` - admin update status (`pending|processing|shipped|delivered`)

## Review Routes
- `GET /reviews/:productId` - list product reviews
- `POST /reviews` - add/update review `{ productId, rating, comment }`

## Coupon Routes
- `GET /coupons` - list coupons
- `POST /coupons` - create coupon (admin)

## Admin Routes
- `GET /admin/dashboard` - analytics metrics
- `GET /admin/users` - user management list
- `PATCH /admin/users/:id/block` - block/unblock user
- `PATCH /admin/users/:id/delete` - soft delete user
- `GET /admin/orders` - all orders

## Seller Routes
- `GET /seller/dashboard` - seller metrics
- `GET /seller/products` - seller inventory
- `GET /seller/orders` - seller orders
