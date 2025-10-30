# 🛍️ Vibe Commerce

## Hosted Link: https://vibe-commerce-frontend.onrender.com

A production-ready full-stack e-commerce platform built with React, Node.js, Express, and MongoDB. This professional shopping application features complete user authentication, order management, address handling, and all essential e-commerce functionalities.

## 🚀 Features

### 🛒 Shopping Experience
- **Product Catalog**: Browse through 8 premium products with images and descriptions
- **Shopping Cart**: Add, remove, and update quantities of items
- **Real-time Updates**: Cart count updates instantly across the app
- **Smart Checkout**: Address selection or new address entry for shipping
- **Guest Checkout**: Shop without creating an account
- **Order Confirmation**: Beautiful receipt modal with order details

### 🔐 User Authentication & Security
- **User Registration**: Sign up with email and password validation
- **Secure Login**: JWT-based authentication with bcrypt password hashing
- **Protected Routes**: Secure access to user-specific features
- **Persistent Sessions**: Stay logged in across browser sessions
- **Role-Based Access**: User and admin role management

### 👤 User Dashboard
- **Profile Management**: Edit personal information (name, email)
- **Order History**: View all past orders with status tracking
- **Address Book**: Manage multiple shipping addresses
  - Add new addresses
  - Edit existing addresses
  - Delete addresses
  - Set default shipping address
- **Multi-Tab Interface**: Easy navigation between Profile, Orders, and Addresses

### 📦 Order Management
- **Complete Order System**: Create orders with full item details
- **Order Tracking**: Track status (Processing, Shipped, Delivered, Cancelled)
- **Order Details**: View comprehensive order information
- **Payment Status**: Monitor payment status for each order
- **Order History**: Access complete purchase history
- **Price Breakdown**: Detailed cost breakdown (items, tax, shipping, total)

### 🎨 Design & UX
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Professional UI**: Built with Tailwind CSS for a modern, clean look
- **Error Handling**: Graceful error messages and loading states
- **Success Notifications**: Visual feedback for user actions
- **Empty States**: Helpful messages when no data is available
- **MongoDB Persistence**: All data securely stored in database

## 🛠️ Tech Stack

### Frontend
- **React** (v19.2.0) - UI library
- **React Router** (v6.20.0) - Client-side routing
- **Tailwind CSS** (v3.3.5) - Styling
- **Axios** (v1.6.2) - API requests

### Backend
- **Node.js** - Runtime environment
- **Express.js** (v4.18.2) - Web framework
- **MongoDB** - Database
- **Mongoose** (v8.0.0) - ODM for MongoDB
- **bcryptjs** (v2.4.3) - Password hashing
- **jsonwebtoken** (v9.0.2) - JWT authentication
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variables

## 📁 Project Structure

```
Nexora Project/
├── backend/
│   ├── config/
│   │   └── database.js             # MongoDB connection
│   ├── controllers/
│   │   ├── productController.js    # Product logic
│   │   ├── cartController.js       # Cart & checkout logic
│   │   ├── authController.js       # Authentication logic
│   │   └── orderController.js      # Order management logic
│   ├── models/
│   │   ├── Product.js              # Product schema
│   │   ├── CartItem.js             # Cart item schema
│   │   ├── User.js                 # User schema with addresses
│   │   └── Order.js                # Order schema
│   ├── middleware/
│   │   └── auth.js                 # JWT auth middleware
│   ├── routes/
│   │   ├── productRoutes.js        # Product endpoints
│   │   ├── cartRoutes.js           # Cart endpoints
│   │   ├── authRoutes.js           # Authentication endpoints
│   │   └── orderRoutes.js          # Order endpoints
│   ├── server.js                   # Express app entry
│   ├── package.json
│   └── .env
│
└── my-app/ (frontend)
    ├── public/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.js            # Navigation bar with auth
    │   │   ├── Footer.js            # Footer component
    │   │   ├── ProductCard.js       # Product display card
    │   │   ├── CartItem.js          # Cart item component
    │   │   └── ReceiptModal.js      # Order confirmation modal
    │   ├── pages/
    │   │   ├── Products.js          # Product listing page
    │   │   ├── Cart.js              # Shopping cart page
    │   │   ├── Checkout.js          # Checkout with addresses
    │   │   ├── Login.js             # User login page
    │   │   ├── Signup.js            # User registration page
    │   │   ├── Dashboard.js         # User dashboard (Profile/Orders/Addresses)
    │   │   └── OrderDetails.js      # Order details page
    │   ├── context/
    │   │   └── AuthContext.js       # Authentication state management
    │   ├── services/
    │   │   └── api.js               # API integration with auth
    │   ├── App.js                   # Router with protected routes
    │   ├── index.js
    │   └── index.css
    ├── package.json
    └── tailwind.config.js
```

## 🔌 API Endpoints

### Products
- `GET /api/products` - Get all products
- `POST /api/products/seed` - Seed database with mock products

### Cart
- `GET /api/cart` - Get all cart items with total
- `POST /api/cart` - Add item to cart
  ```json
  {
    "productId": "mongodbObjectId",
    "qty": 1
  }
  ```
- `PUT /api/cart/:id` - Update cart item quantity
  ```json
  {
    "qty": 2
  }
  ```
- `DELETE /api/cart/:id` - Remove item from cart

### Checkout
- `POST /api/cart/checkout` - Process checkout (guest or authenticated)
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "shippingAddress": { ... }
  }
  ```

### Authentication
- `POST /api/auth/register` - Register new user
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securepass123"
  }
  ```
- `POST /api/auth/login` - Login user
  ```json
  {
    "email": "john@example.com",
    "password": "securepass123"
  }
  ```
- `GET /api/auth/profile` - Get user profile (protected)
  - Requires: `Authorization: Bearer <token>`
- `PUT /api/auth/profile` - Update profile (protected)
- `POST /api/auth/address` - Add shipping address (protected)
- `PUT /api/auth/address/:id` - Update address (protected)
- `DELETE /api/auth/address/:id` - Delete address (protected)

### Orders (Protected Routes)
All order endpoints require authentication token in header.

- `POST /api/orders` - Create new order
  ```json
  {
    "orderItems": [...],
    "shippingAddress": { ... },
    "paymentMethod": "Cash on Delivery"
  }
  ```
- `GET /api/orders/myorders` - Get current user's orders
- `GET /api/orders/:id` - Get specific order details
- `PUT /api/orders/:id/status` - Update order status (admin only)
- `GET /api/orders/all` - Get all orders (admin only)

## 🎯 Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (running locally or cloud instance)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   The `.env` file should contain:
   
   ```
   PORT=5001
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/vibecommerce?retryWrites=true&w=majority
   NODE_ENV=development
   ```

5. **Start MongoDB (if using local)**
   
   Make sure MongoDB is running on your system:
   ```bash
   mongod
   ```

6. **Start backend server**
   ```bash
   npm start
   ```
   
   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

   Server will run on `http://localhost:5001`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```

   App will open at `http://localhost:3000`

## 📸 Application Flow

### 1. Products Page
- Displays all available products in a responsive grid
- Each product shows image, name, description, and price
- "Add to Cart" button with loading state
- Automatic product seeding if database is empty
- Success notification when item is added

### 2. Shopping Cart
- View all items in cart
- Update quantities with +/- buttons
- Remove items individually
- Real-time total calculation
- Empty cart state with call-to-action
- Order summary sidebar

### 3. Checkout
- Customer information form (name & email)
- Order summary with item previews
- Form validation
- Loading state during checkout
- Receipt modal on successful order

### 4. Order Confirmation
- Beautiful modal with order details
- Customer information
- Order total and timestamp
- Success checkmark icon
- Return to shopping button

## 🎨 Design Features

- **Color Scheme**: Slate, Indigo, and Emerald palette
- **Typography**: Clean, modern fonts with proper hierarchy
- **Spacing**: Consistent padding and margins
- **Shadows**: Subtle depth with hover effects
- **Transitions**: Smooth hover and state changes
- **Icons**: SVG icons for visual enhancement
- **Responsive**: Mobile-first design approach

## ⚡ Key Functionalities

### Cart Management
- Persistent storage in MongoDB
- Real-time synchronization
- Quantity updates without page refresh
- Cart count badge in navbar

### Error Handling
- Backend validation for all requests
- Graceful error messages in UI
- Retry mechanisms for failed requests
- Loading states for async operations

### User Experience
- Instant feedback on actions
- Loading spinners for better UX
- Empty states with helpful messages
- Success notifications
- Responsive navigation

## 🔧 Available Scripts

### Backend
```bash
npm start          # Start production server
npm run dev        # Start with nodemon (auto-reload)
```

### Frontend
```bash
npm start          # Start development server
npm run build      # Build for production
npm test           # Run tests
```

## 📦 Dependencies

### Backend Dependencies
```json
{
  "express": "^4.18.2",
  "mongoose": "^8.0.0",
  "cors": "^2.8.5",
  "dotenv": "^16.3.1",
  "body-parser": "^1.20.2"
}
```

### Frontend Dependencies
```json
{
  "react": "^19.2.0",
  "react-dom": "^19.2.0",
  "react-router-dom": "^6.20.0",
  "axios": "^1.6.2",
  "tailwindcss": "^3.3.5"
}
```

## 🚀 Deployment

### Frontend (GitHub Pages)
1. Build the app:
   ```bash
   npm run build
   ```

2. Deploy to GitHub Pages or any static hosting service

### Backend (Heroku/Railway/Render)
1. Set environment variables in hosting platform
2. Push code to repository
3. Platform will auto-deploy

## 🐛 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `mongod`
- Check connection string in `.env`
- Verify MongoDB port (default: 27017)

### CORS Error
- Ensure backend CORS is configured
- Check API URL in frontend `api.js`
- Verify both servers are running

### Port Already in Use
- Backend: Change PORT in `.env`
- Frontend: React will prompt for different port

## 🎓 Learning Outcomes

This project demonstrates:
- RESTful API design
- React state management
- React Router navigation
- Async/await patterns
- MongoDB CRUD operations
- Tailwind CSS styling
- Error handling
- Form validation
- Modal components
- Responsive design

## 📄 License

This project is open source and available under the MIT License.

## 👤 Author

Built as an internship coding assignment to demonstrate full-stack development skills.

---

### 🌟 Features Implemented

✅ Full CRUD operations  
✅ MongoDB persistence  
✅ RESTful API design  
✅ React Router navigation  
✅ Tailwind CSS styling  
✅ Responsive design  
✅ Error handling  
✅ Loading states  
✅ Form validation  
✅ Success notifications  
✅ Empty states  
✅ Receipt generation  

### 🎯 Future Enhancements

- User authentication
- Payment integration
- Order history
- Product search
- Product filters
- Wishlist feature
- Product reviews
- Admin dashboard

---

**Note**: Make sure MongoDB is running before starting the backend server. The application will automatically seed the database with products on first load if none exist.
