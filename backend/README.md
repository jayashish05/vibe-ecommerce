# Vibe Commerce Backend API

Professional Express.js REST API for Vibe Commerce e-commerce platform with complete authentication, order management, and user features.

## Features

### Core Shopping
- Product management with image support
- Shopping cart CRUD operations
- Smart checkout with shipping address
- MongoDB integration with Mongoose ODM

### Authentication & Security
- JWT-based authentication
- Bcrypt password hashing
- Protected route middleware
- Role-based access control (user/admin)
- Token expiration management

### User Management
- User registration and login
- Profile management
- Multiple shipping addresses per user
- Default address selection
- Address CRUD operations

### Order Management
- Complete order creation with line items
- Order history tracking
- Order status management (Processing, Shipped, Delivered, Cancelled)
- Payment status tracking
- User-specific order retrieval
- Admin order management

### Additional Features
- CORS enabled for frontend integration
- Comprehensive error handling
- Environment-based configuration
- RESTful API design

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment:
Create a `.env` file with:
```
PORT=5001
MONGODB_URI=mongodb+srv://your-connection-string
NODE_ENV=development
JWT_SECRET=your-secret-key-here
JWT_EXPIRE=30d
```

3. Start server:
```bash
npm start
```

Or with auto-reload:
```bash
npm run dev
```

Server will start on port 5001 (or PORT in .env)

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `POST /api/products/seed` - Seed database with sample products

### Cart
- `GET /api/cart` - Get cart items
- `POST /api/cart` - Add item to cart
  - Body: `{ productId, qty }`
- `PUT /api/cart/:id` - Update cart item quantity
  - Body: `{ qty }`
- `DELETE /api/cart/:id` - Remove item from cart
- `POST /api/cart/checkout` - Process checkout (guest or authenticated)
  - Body: `{ name, email, shippingAddress }` (for guest)
  - Body: `{ shippingAddress }` (for authenticated users)

### Authentication
- `POST /api/auth/register` - Register new user
  - Body: `{ name, email, password }`
  - Returns: `{ user, token }`
- `POST /api/auth/login` - Login user
  - Body: `{ email, password }`
  - Returns: `{ user, token }`
- `GET /api/auth/profile` - Get user profile (protected)
  - Headers: `Authorization: Bearer <token>`
  - Returns: `{ user with addresses }`
- `PUT /api/auth/profile` - Update user profile (protected)
  - Headers: `Authorization: Bearer <token>`
  - Body: `{ name, email }`

### Addresses (Protected Routes)
All address routes require authentication header: `Authorization: Bearer <token>`

- `POST /api/auth/address` - Add new address
  - Body: `{ fullName, phone, addressLine1, addressLine2, city, state, zipCode, country, isDefault }`
- `PUT /api/auth/address/:addressId` - Update address
  - Body: `{ fullName, phone, addressLine1, ... }`
- `DELETE /api/auth/address/:addressId` - Delete address

### Orders (Protected Routes)
All order routes require authentication header: `Authorization: Bearer <token>`

- `POST /api/orders` - Create new order
  - Body: `{ orderItems, shippingAddress, paymentMethod }`
  - Automatically clears cart after order creation
- `GET /api/orders/myorders` - Get current user's orders
  - Returns: Array of orders with items and shipping info
- `GET /api/orders/:id` - Get specific order details
  - Returns: Order with populated product information
- `PUT /api/orders/:id/status` - Update order status (admin only)
  - Body: `{ orderStatus, paymentStatus }`
- `GET /api/orders/all` - Get all orders (admin only)

## Authentication

The API uses JWT (JSON Web Tokens) for authentication:

1. User registers or logs in to receive a token
2. Token must be included in Authorization header for protected routes:
   ```
   Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
3. Token expires based on JWT_EXPIRE setting (default: 30 days)
4. Middleware verifies token and attaches user to request object

## Database Models

### User
- name, email, password (hashed)
- role (user/admin)
- addresses array (embedded subdocuments)
- createdAt, updatedAt

### Order
- user reference
- orderItems array with product references
- shippingAddress object
- paymentMethod, paymentStatus
- orderStatus (Processing/Shipped/Delivered/Cancelled)
- price breakdown (itemsPrice, taxPrice, shippingPrice, totalPrice)
- createdAt, updatedAt

### Product
- name, description, price, category, brand
- image URL
- countInStock, rating, numReviews

### CartItem
- product reference
- name, price, image, qty

## Tech Stack

- **Express.js** v4.18.2 - Web framework
- **MongoDB** - Database
- **Mongoose** v8.0.0 - ODM
- **bcryptjs** v2.4.3 - Password hashing
- **jsonwebtoken** v9.0.2 - JWT authentication
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment configuration
- **body-parser** - Request parsing

## Error Handling

All endpoints return consistent error responses:
```json
{
  "message": "Error description"
}
```

HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad request
- 401: Unauthorized
- 404: Not found
- 500: Server error
