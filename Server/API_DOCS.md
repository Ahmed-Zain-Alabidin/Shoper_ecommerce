# E-commerce Backend API Documentation

This document outlines the API endpoints and tracks the implementation steps for the MEAN Stack E-commerce backend project.

---

## 🚀 Implementation Steps Log

### Step 1: Initial Project Setup
- Initialized Node.js project (`npm init -y`).
- Installed core dependencies: `express`, `mongoose`, `dotenv`, `cors`, `morgan`.
- Installed dev dependencies: `nodemon`.
- Created standard clean directory structure (`src/config`, `src/controllers`, `src/models`, `src/routes`, `src/middlewares`, `src/utils`).

### Step 2: Database Configuration
- Created `src/config/db.js` using `mongoose` to connect to MongoDB Atlas.
- Secured MongoDB connection string inside the `.env` file (`MONGO_URI`).

### Step 3: Express App Setup
- Created `src/app.js` to initialize the Express application.
- Configured essential middlewares: `express.json()`, `cors()`, and `morgan('dev')`.

### Step 4: Health Check & Error Handling
- Created a health check route (`GET /api/health`) to verify server status.
- Implemented global error handlers in `src/middlewares/error.middleware.js` for `404 Not Found` and general `500 Internal Server Errors`.

### Step 5: Server Entry Point
- Created `src/server.js` which connects to the database and starts the server on the `PORT` defined in `.env`.
- Updated `package.json` scripts with `npm run dev` and `npm start`.

### Step 6: Authentication & User Management Setup
- Installed auth-related packages: `bcryptjs`, `jsonwebtoken`, `express-validator`, `cookie-parser`.
- **User Model (`src/models/User.js`)**: Created schema with fields `name`, `email`, `password`, `phone`, `role`, `isVerified`, `address`, `wishlist`, and `paymentDetails`.
- **Auth Controller (`src/controllers/authController.js`)**: Implemented `signup` (with password hashing) and `login` (with JWT generation).
- **Auth Routes (`src/routes/authRoutes.js`)**: Set up endpoints with `express-validator` to ensure data integrity.
- **Auth Middleware (`src/middlewares/authMiddleware.js`)**: Implemented `protect` (verifies JWT token) and `authorize` (verifies user role) middlewares.
- Added `JWT_SECRET` to the `.env` file and registered `/api/auth` routes in `src/app.js`.

### Step 7: Product & Category Management Setup
- Installed `cloudinary` and `multer` for image upload handling.
- **Category Model (`src/models/Category.js`)**: Created schema with fields `name`, `slug` (auto-generated), and `image`.
- **Product Model (`src/models/Product.js`)**: Created schema with `name`, `description`, `price`, `images`, `category`, `seller`, `stock`, and `ratings`.
- Configured Cloudinary (`src/config/cloudinary.js`) and Multer upload middleware (`src/middlewares/uploadMiddleware.js`).
- **Controllers**: Built full CRUD operations with filtering & search logic for `productController.js` and `categoryController.js`.
- **Routes**: Implemented protected operations (`admin` for categories, `seller`/`admin` for products). Registered `/api/products` and `/api/categories`.

### Step 8: Shopping Cart & Wishlist System
- **Cart Model (`src/models/Cart.js`)**: Created schema linking user to an array of products, calculating total price via pre-save hook.
- **Cart Controller (`src/controllers/cartController.js`)**: Implemented `addToCart`, `updateQuantity`, `removeFromCart`, `getCart`, and `clearCart`.
- **User Controller (`src/controllers/userController.js`)**: Added `addToWishlist` and `removeFromWishlist` logic modifying the User model.
- **Routes**: Secured all endpoints with `authMiddleware` and registered `/api/cart` and `/api/users/wishlist`.

---

## 📡 API Endpoints

### 1. Health Check
*   **URL:** `/api/health`
*   **Method:** `GET`
*   **Description:** Verifies that the server is running.
*   **Response:**
    ```json
    {
        "status": "OK",
        "message": "Server is running"
    }
    ```

### 2. Authentication

#### User Signup
*   **URL:** `/api/auth/signup`
*   **Method:** `POST`
*   **Description:** Register a new user.
*   **Body Parameters:**
    *   `name` (String, required)
    *   `email` (String, required, must be valid email format)
    *   `password` (String, required, min 6 characters)
    *   `phone` (String, optional)
    *   `role` (String, optional, enum: ['customer', 'seller', 'admin'], defaults to 'customer')
*   **Example Request Body:**
    ```json
    {
        "name": "John Doe",
        "email": "john@example.com",
        "password": "password123",
        "phone": "+1234567890",
        "role": "customer"
    }
    ```
*   **Success Response (201 Created):**
    ```json
    {
        "status": "Success",
        "data": {
            "_id": "60d0fe4f5311236168a109ca",
            "name": "John Doe",
            "email": "john@example.com",
            "role": "customer",
            "token": "eyJhbGciOiJIUzI1NiIsInR5c..."
        }
    }
    ```

#### User Login
*   **URL:** `/api/auth/login`
*   **Method:** `POST`
*   **Description:** Authenticate an existing user and return a JWT token.
*   **Body Parameters:**
    *   `email` (String, required)
    *   `password` (String, required)
*   **Example Request Body:**
    ```json
    {
        "email": "john@example.com",
        "password": "password123"
    }
    ```
*   **Success Response (200 OK):**
    ```json
    {
        "status": "Success",
        "data": {
            "_id": "60d0fe4f5311236168a109ca",
            "name": "John Doe",
            "email": "john@example.com",
            "role": "customer",
            "token": "eyJhbGciOiJIUzI1NiIsInR5c..."
        }
    }
    ```
*   **Error Response (401 Unauthorized):**
    ```json
    {
        "status": "Error",
        "message": "Invalid credentials"
    }
    ```

### 3. Categories

#### Get All Categories
*   **URL:** `/api/categories`
*   **Method:** `GET`
*   **Description:** Fetch all categories.
*   **Success Response:**
    ```json
    {
        "status": "Success",
        "count": 1,
        "data": [
            {
                "_id": "60d0fe4f...",
                "name": "Electronics",
                "slug": "electronics"
            }
        ]
    }
    ```

#### Create Category
*   **URL:** `/api/categories`
*   **Method:** `POST`
*   **Access:** Protected (Admin)
*   **Body Parameters:**
    *   `name` (String, required)
*   **Example Request Body:**
    ```json
    {
        "name": "Electronics"
    }
    ```

### 4. Products

#### Get All Products (With Filtering)
*   **URL:** `/api/products`
*   **Method:** `GET`
*   **Description:** Fetch all products. Supports filtering by query parameters.
*   **Query Parameters:**
    *   `name` (String, search by name)
    *   `category` (ObjectId, filter by category ID)
    *   `minPrice` (Number)
    *   `maxPrice` (Number)

#### Create Product
*   **URL:** `/api/products`
*   **Method:** `POST`
*   **Access:** Protected (Seller, Admin)
*   **Content-Type:** `multipart/form-data`
*   **Form Data Fields:**
    *   `name` (String, required)
    *   `description` (String, required)
    *   `price` (Number, required)
    *   `category` (ObjectId, required)
    *   `stock` (Number, required)
    *   `images` (Files, up to 5 images)

### 5. Shopping Cart

#### Get User Cart
*   **URL:** `/api/cart`
*   **Method:** `GET`
*   **Access:** Protected
*   **Description:** Fetch the logged-in user's cart populated with product details.

#### Add to Cart
*   **URL:** `/api/cart`
*   **Method:** `POST`
*   **Access:** Protected
*   **Body Parameters:**
    *   `productId` (ObjectId, required)
    *   `quantity` (Number, optional, defaults to 1)

#### Update Cart Item Quantity
*   **URL:** `/api/cart/:itemId`
*   **Method:** `PUT`
*   **Access:** Protected
*   **Description:** `itemId` is the `_id` of the Product.
*   **Body Parameters:**
    *   `quantity` (Number, required)

#### Remove Item from Cart
*   **URL:** `/api/cart/:itemId`
*   **Method:** `DELETE`
*   **Access:** Protected

#### Clear Cart
*   **URL:** `/api/cart`
*   **Method:** `DELETE`
*   **Access:** Protected

### 6. Wishlist

#### Add Product to Wishlist
*   **URL:** `/api/users/wishlist`
*   **Method:** `POST`
*   **Access:** Protected
*   **Body Parameters:**
    *   `productId` (ObjectId, required)

#### Remove Product from Wishlist
*   **URL:** `/api/users/wishlist/:productId`
*   **Method:** `DELETE`
*   **Access:** Protected

---

*Note: This file will be updated continuously as new features and endpoints are added to the project.*
