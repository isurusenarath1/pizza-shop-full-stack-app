<!-- Logo -->
<p align="center">
  <img src="frontend/public/placeholder-logo.svg" alt="Pizza Shop Logo" width="215" height="48">
</p>

# Pizza Shop

**Mario's Pizza Palace** — Bringing authentic Italian flavors to your neighborhood since 1999.

---

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Backend API](#backend-api)
- [Data Models](#data-models)
- [Frontend](#frontend)
- [Setup & Installation](#setup--installation)
- [Credits](#credits)

---

## Overview
Mario's Pizza Palace is a full-stack web application for a multi-branch pizza restaurant. It features a modern online ordering system, admin dashboard, and real-time statistics, all built with a focus on quality, community, and tradition.

## Features
- Online menu with featured pizzas
- Cart and checkout flow
- Multi-branch support (Colombo, Kandy, Galle)
- User authentication and profiles
- Admin dashboard for managing pizzas, orders, users, and delivery areas
- Real-time statistics and analytics
- Responsive, modern UI

## Tech Stack
- **Frontend:** Next.js, React, Tailwind CSS, Radix UI, TypeScript
- **Backend:** Node.js, Express, MongoDB (Mongoose)
- **Other:** RESTful API, dotenv, CORS

## Project Structure
```
Pizza shop/
  backend/      # Express.js API, MongoDB models, routes
  frontend/     # Next.js app, React components, styles
```

---

## Backend API
The backend provides a RESTful API for pizzas, orders, users, areas, and statistics.

### Endpoints
#### Pizzas (`/api/pizzas`)
- `GET /` — List all pizzas
- `GET /:id` — Get pizza by ID
- `POST /` — Create new pizza
- `PUT /:id` — Update pizza
- `DELETE /:id` — Delete pizza

#### Orders (`/api/orders`)
- `POST /` — Create new order
- `GET /` — List all orders
- `GET /:id` — Get order by ID
- `PUT /:id` — Update order

#### Areas (`/api/areas`)
- `GET /` — List all delivery areas
- `POST /` — Create new area
- `PUT /:id` — Update area
- `DELETE /:id` — Delete area

#### Users (`/api/users`)
- `GET /` — List all users
- `POST /` — Create new user
- `PUT /:id` — Update user
- `DELETE /:id` — Delete user
- `POST /login` — User login (demo)

#### Stats (`/api/stats/overview`)
- `GET /overview` — Get summary stats (revenue, orders, popular pizzas, etc.)

---

## Data Models
### Pizza
- `name` (String, required)
- `description` (String, required)
- `price` (Number, required)
- `image` (String)
- `category` (String, required)
- `isVeg` (Boolean)
- `isSpicy` (Boolean)
- `isAvailable` (Boolean)
- `rating` (Number)
- `ingredients` (Array)
- `featured` (Boolean)

### Order
- `customerName`, `customerPhone`, `customerEmail`
- `address`, `area`
- `items`: [{ name, size, extras, quantity, price, image }]
- `subtotal`, `deliveryFee`, `tax`, `total`
- `status`, `paymentMethod`, `orderTime`, `estimatedDelivery`, `specialInstructions`
- Timestamps

### Area
- `name` (String, required)
- `deliveryFee` (Number, required)
- `deliveryTime` (String, required)
- `isActive` (Boolean)
- `postalCodes` (Array)
- `orderCount` (Number)

### User
- `name`, `email`, `phone`, `password`
- `role` (customer, staff, manager, super_admin)
- `status` (active, inactive)
- `permissions` (Array)
- `joinDate`, `lastLogin`, `totalOrders`, `totalSpent`, `lastOrder`

---

## Frontend
- Built with Next.js and React
- Modern, responsive UI with Tailwind CSS and Radix UI
- Pages: Home, Menu, Cart, Checkout, Order Confirmation, Profile, Admin (Pizzas, Orders, Users, Areas, Stats), About, Contact
- State management for cart and user
- API integration with backend

---

## Setup & Installation

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB instance (local or cloud)

### 1. Clone the repository
```bash
git clone <repo-url>
cd "Pizza shop"
```

### 2. Backend Setup
```bash
cd backend
npm install
# Create a .env file with:
# MONGODB_URI=<your-mongodb-uri>
# PORT=5000
npm run dev
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```

### 4. Access the App
- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://localhost:5000/api](http://localhost:5000/api)

---

## Credits
- Project by Mario's Pizza Palace
- UI inspired by modern pizza delivery apps
- Images from [Pexels](https://pexels.com)

---

<p align="center"><i>Enjoy your slice of Italy! 🍕</i></p> 