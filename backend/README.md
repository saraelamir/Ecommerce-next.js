# Full-Stack Ecommerce Platform

Production-style ecommerce system with:
- Frontend: Next.js App Router + Tailwind CSS
- Backend: Node.js + Express MVC
- Database: MongoDB + Mongoose
- Auth: JWT + Google login endpoint structure

## Project Structure
- `frontend/` Next.js app
- `backend/` Express API
- `postman/` Postman collection and API docs

## Setup
1. Install MongoDB locally and start it.
2. Backend setup:
   - Copy `backend/.env.example` to `backend/.env`
   - Fill environment variables
   - Run:
     - `cd backend`
     - `npm install`
     - `npm run dev`
3. Frontend setup:
   - Copy `frontend/.env.example` to `frontend/.env.local`
   - Run:
     - `cd frontend`
     - `npm install`
     - `npm run dev`
4. Open:
   - Frontend: `http://localhost:3000`
   - Backend: `http://localhost:5000/api/health`

## Key Features Implemented
- Auth: register/login/logout/google endpoint, JWT middleware, role-based access
- Users: profile, wishlist, order history, dashboard
- Products: CRUD, filters, search, pagination
- Cart: persistent cart in MongoDB
- Checkout: COD/stripe-structured/wallet payment modes
- Orders: create + status tracking
- Admin: users/orders/analytics
- Seller: seller dashboard, products, orders
- Reviews & ratings
- Coupons/promo codes
- i18n structure (`frontend/messages`)
- Mock email notification service

## Postman
- Import: `postman/ecommerce-api.postman_collection.json`
- Detailed routes: `postman/API_DOCUMENTATION.md`
