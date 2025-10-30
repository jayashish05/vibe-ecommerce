# Vibe Commerce - Professional E-commerce Platform

A production-ready full-stack shopping cart web application with complete user authentication, order management, and professional e-commerce features.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000)

## Features

### Shopping Experience
- Product browsing with detailed cards
- Shopping cart management (add, remove, update quantities)
- Smart checkout flow with shipping address selection
- Order confirmation with receipt
- Responsive design for all devices

### User Authentication
- Secure user registration with validation
- Login/logout functionality
- JWT-based authentication
- Protected routes for authenticated users
- Persistent login state

### User Dashboard
- **Profile Management**: Edit personal information (name, email)
- **Order History**: View all past orders with status tracking
- **Address Management**: Add, edit, delete, and set default shipping addresses
- Multi-tab interface for easy navigation

### Order Management
- Create orders with shipping address
- Track order status (Processing, Shipped, Delivered, Cancelled)
- View detailed order information
- Order history with complete item details
- Payment status tracking

### Guest Checkout
- Checkout without creating an account
- Email confirmation for guest orders
- Option to create account during checkout

## Pages

- `/` - Products listing
- `/cart` - Shopping cart
- `/checkout` - Checkout with address selection
- `/login` - User login
- `/signup` - User registration
- `/dashboard` - User dashboard (protected)
- `/order/:id` - Order details (protected)

## Tech Stack

- **React** v19.2.0
- **React Router** v6.20.0 (with protected routes)
- **Tailwind CSS** v3.3.5
- **Axios** v1.6.2
- **React Context API** (for auth state management)

## Authentication Flow

1. User registers with name, email, and password
2. JWT token is stored in localStorage
3. Token is included in all authenticated API requests
4. User can access protected routes (dashboard, order details)
5. Logout clears token and redirects to home

## API Integration

All API calls use Bearer token authentication for protected endpoints:

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/profile` - Update profile (protected)
- `POST /api/auth/address` - Add address (protected)
- `PUT /api/auth/address/:id` - Update address (protected)
- `DELETE /api/auth/address/:id` - Delete address (protected)
- `POST /api/orders` - Create order (protected)
- `GET /api/orders/myorders` - Get user orders (protected)
- `GET /api/orders/:id` - Get order details (protected)

For full backend documentation, see the main README in the project root.
