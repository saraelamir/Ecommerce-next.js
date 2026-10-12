# 🛒 Full-Stack E-Commerce Platform

A full-stack e-commerce platform built with **Next.js**, **Node.js**, **Express.js**, **MongoDB**, and **JWT Authentication**. The platform supports role-based access for Admins, Sellers, and Customers.

---

## 🧱 Tech Stack

### Frontend
- **Framework:** Next.js (React)
- **Styling:** Tailwind CSS / CSS Modules
- **HTTP Client:** Axios
- **State Management & Authentication:** React Context / Custom Hooks

### Backend
- **Runtime:** Node.js + Express.js
- **Architecture:** MVC (Model-View-Controller)
- **Database:** MongoDB + Mongoose
- **Authentication:** JWT (JSON Web Tokens)
- **Authorization:** Role-Based Access Control (RBAC)

---

## 📁 Project Structure

```text
Ecommerce-next.js-project/
├── frontend/
│   └── src/
│       ├── pages/
│       ├── components/
│       └── utils/
├── backend/
│   └── src/
│       ├── models/
│       ├── controllers/
│       ├── routes/
│       └── middleware/
├── screenshots/
│   ├── Hero.png
│   ├── welcomeback.png
│   ├── products.png
│   ├── products-page.png
│   ├── single-product.png
│   ├── single-product2.png
│   ├── dashboard.png
│   ├── users.png
│   ├── coupons.png
│   ├── addProduct-page.png
│   └── profile.png
└── README.md
```

---

## ✨ Features

### 🔐 Authentication & Roles
- Secure registration and login using JWT authentication.
- Role-based permissions for Customers, Sellers, and Admins.
- Separate dashboards and access permissions based on user roles.

### 🛍️ Customer Features
- Browse products and filter by category.
- Search for products and view detailed product information.
- Manage shopping cart and checkout.
- Track orders and view order history.
- Manage profile and account details.

### 🏪 Seller Dashboard
- Add, edit, and manage product listings.
- Manage product stock.
- Create and manage store-specific promotional coupons.

### ⚡ Admin Dashboard
- View platform statistics, users, orders, and sales metrics.
- Manage users and platform-wide coupons.

---

## 🎥 Demo

[📺 Watch the Project Demo on Google Drive](https://drive.google.com/drive/folders/1PQzctcesAlAwI5ib4fDbUQRYTlYl37II?usp=drive_link)

---

## 📸 Screenshots

### 🏠 Storefront & Welcome

| Hero Section | Welcome Back |
|:---:|:---:|
| ![Hero Section](./screenshots/Hero.png) | ![Welcome Back](./screenshots/welcomeback.png) |

### 🛍️ Products

| Products Page | Products Layout | Single Product |
|:---:|:---:|:---:|
| ![Products Page](./screenshots/products-page.png) | ![Products](./screenshots/products.png) | ![Single Product](./screenshots/single-product.png) |

### 📊 Dashboards & Management

| Dashboard Overview | Users Management | Coupons Management |
|:---:|:---:|:---:|
| ![Dashboard](./screenshots/dashboard.png) | ![Users](./screenshots/users.png) | ![Coupons](./screenshots/coupons.png) |

### ⚙️ Product & Profile Management

| Add Product | User Profile | Single Product View |
|:---:|:---:|:---:|
| ![Add Product](./screenshots/addProduct-page.png) | ![Profile](./screenshots/profile.png) | ![Single Product 2](./screenshots/single-product2.png) |

---

## ⚙️ Setup Instructions

### Prerequisites

- Node.js (v18 or later recommended)
- MongoDB running locally or through MongoDB Atlas
- npm

### 1. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory and configure the required environment variables.

Start the backend using the appropriate script defined in `backend/package.json`.

### 2. Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
```

Configure the frontend environment variables according to your API configuration, then start the development server using the script defined in `frontend/package.json`.

---

## 🔒 Security

- JWT-based authentication.
- Role-based authorization.
- Protected routes and role-specific access.

---

## 👩‍💻 Author

**Sara El-Amir**

- GitHub: [@saraelamir](https://github.com/saraelamir)

---

⭐ If you find this project interesting, feel free to explore the repository!