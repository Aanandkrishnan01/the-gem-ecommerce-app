# eCommerce Website

A full-stack eCommerce website built with React, Express.js, and MongoDB. Features a modern, responsive design inspired by contemporary fashion websites with a clean aesthetic.

https://the-gem-ecommerce-app-4.onrender.com

## 🚀 Features

### Frontend (React + Tailwind CSS)
- **Modern Design**: Clean, minimalist interface inspired by premium fashion websites
- **Responsive Layout**: Fully responsive design for mobile, tablet, and desktop
- **Product Catalog**: Grid-based product listings with filtering and search
- **Product Details**: Comprehensive product pages with image galleries, size/color selection
- **Shopping Cart**: Dynamic cart with quantity updates and price calculations
- **Checkout Process**: Multi-step checkout with shipping and payment forms
- **User Authentication**: Login and registration system
- **Navigation**: Intuitive navigation with category-based filtering

### Backend (Express.js + MongoDB)
- **REST API**: Complete RESTful API with proper HTTP methods
- **JWT Authentication**: Secure token-based authentication system
- **User Management**: Registration, login, profile management
- **Product Management**: CRUD operations for products with admin controls
- **Order Processing**: Complete order management system
- **Cart Management**: Session-based cart functionality
- **Data Validation**: Input validation and sanitization
- **Error Handling**: Comprehensive error handling and logging

### Database (MongoDB)
- **User Schema**: Complete user profiles with authentication
- **Product Schema**: Detailed product information with categories, pricing, inventory
- **Order Schema**: Order tracking with status updates and history
- **Relationships**: Proper document relationships and population

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v4.4 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **Git** - [Download](https://git-scm.com/downloads)
- **npm** or **yarn** package manager

## 🛠️ Installation & Setup

### 1. Install Dependencies

Navigate to the project root and install dependencies for both frontend and backend:

```powershell
# Install root dependencies
npm install

# Install frontend dependencies
npm run install-client

# Install backend dependencies
npm run install-server
```

### 2. Environment Setup

Create a `.env` file in the `backend` directory with the following variables:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your-super-secret-jwt-key-change-in-production
BCRYPT_ROUNDS=10
```

### 3. Database Setup

Make sure MongoDB is running on your system, then seed the database with sample data:

```powershell
cd backend
node seedDatabase.js
```

This will create:
- Sample products (clothes, shoes, accessories)
- Admin user account (admin@ecommerce.com / admin123)

### 4. Start the Application

You can start both frontend and backend simultaneously:

```powershell
# From project root - starts both frontend and backend
npm run dev
```

Or start them separately:

```powershell
# Start backend only (from project root)
npm run server

# Start frontend only (from project root)  
npm run client
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## 📂 Project Structure

```
ecommerce/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable React components
│   │   │   └── Navbar.js    # Navigation component
│   │   ├── pages/           # Page components
│   │   │   ├── Home.js      # Homepage with hero banner
│   │   │   ├── Products.js  # Product listing with filters
│   │   │   ├── ProductDetail.js # Individual product page
│   │   │   ├── Cart.js      # Shopping cart page
│   │   │   └── Checkout.js  # Checkout process
│   │   ├── context/         # React context for state management
│   │   │   ├── AuthContext.js   # Authentication state
│   │   │   └── CartContext.js   # Cart state management
│   │   ├── App.js           # Main app component with routing
│   │   ├── index.js         # React entry point
│   │   └── index.css        # Global styles with Tailwind
│   ├── package.json         # Frontend dependencies
│   ├── tailwind.config.js   # Tailwind CSS configuration
│   └── postcss.config.js    # PostCSS configuration
├── backend/                  # Express.js backend API
│   ├── models/              # MongoDB data models
│   │   ├── User.js          # User schema with authentication
│   │   ├── Product.js       # Product schema with inventory
│   │   └── Order.js         # Order schema with tracking
│   ├── routes/              # API route handlers
│   │   ├── auth.js          # Authentication endpoints
│   │   ├── products.js      # Product CRUD operations
│   │   ├── cart.js          # Cart management
│   │   └── orders.js        # Order processing
│   ├── middleware/          # Custom middleware
│   │   ├── auth.js          # JWT authentication middleware
│   │   └── admin.js         # Admin authorization middleware
│   ├── server.js            # Express server entry point
│   ├── seedDatabase.js      # Database seeding script
│   ├── package.json         # Backend dependencies
│   └── .env                 # Environment variables
├── package.json             # Root package.json with scripts
└── README.md               # This file
```

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/change-password` - Change password

### Products
- `GET /api/products` - Get all products with filtering
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/category/:category` - Get products by category
- `GET /api/products/search/:term` - Search products
- `POST /api/products` - Create product (Admin only)
- `PUT /api/products/:id` - Update product (Admin only)
- `DELETE /api/products/:id` - Delete product (Admin only)

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update/:itemId` - Update cart item quantity
- `DELETE /api/cart/remove/:itemId` - Remove item from cart
- `DELETE /api/cart/clear` - Clear entire cart
- `POST /api/cart/apply-coupon` - Apply discount coupon
- `DELETE /api/cart/remove-coupon` - Remove applied coupon

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user's orders
- `GET /api/orders/:id` - Get order by ID
- `PUT /api/orders/:id/cancel` - Cancel order
- `GET /api/orders/admin/all` - Get all orders (Admin only)
- `PUT /api/orders/:id/status` - Update order status (Admin only)

## 🎨 Design Features

### Inspired by Modern Fashion Websites
- **Clean Typography**: Uses Inter font family for professional appearance
- **Minimalist Color Palette**: Black, white, and gray tones
- **Hover Animations**: Subtle animations on buttons and product cards
- **Responsive Grid**: Product listings adapt to screen size
- **Professional Layout**: Spacious design with proper whitespace

### Tailwind CSS Classes Used
- **Animations**: `hover:scale-105`, `transition-all`, `duration-300`
- **Responsive**: `md:grid-cols-2`, `lg:grid-cols-4`, `sm:px-6`
- **Interactive**: `hover:bg-gray-800`, `focus:ring-2`, `group-hover:`
- **Layout**: `grid`, `flex`, `items-center`, `justify-between`

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for secure password storage
- **Input Validation**: express-validator for request validation
- **CORS Protection**: Configured CORS for cross-origin requests
- **Admin Routes**: Protected admin-only endpoints
- **Error Handling**: Secure error messages without sensitive data exposure

## 🚀 Deployment

### Environment Variables for Production
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ecommerce
JWT_SECRET=generate-a-secure-random-secret-key
```

### Deployment Options
- **Frontend**: Vercel, Netlify, or any static hosting
- **Backend**: Heroku, Railway, DigitalOcean, or AWS
- **Database**: MongoDB Atlas (cloud) or self-hosted

## 🧪 Testing

Test the application with the provided sample data:

**Admin Account:**
- Email: `admin@ecommerce.com`
- Password: `admin123`

**Sample Products:**
- 8 different products across clothes, shoes, and accessories
- Various price points and categories
- Different sizes and colors available

## 🛒 Usage Examples

### Customer Flow
1. Browse products on the homepage
2. Use filters to find specific items
3. View product details and select size/color
4. Add items to cart
5. Review cart and apply coupons
6. Complete checkout with shipping information
7. Track order status

### Admin Flow
1. Login with admin credentials
2. Access admin endpoints to manage products
3. View all orders and update order status
4. Manage inventory and pricing

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Troubleshooting

### Common Issues

**MongoDB Connection Error:**
- Ensure MongoDB is running locally
- Check the MONGODB_URI in your .env file
- Verify database permissions

**Port Already in Use:**
- Change the PORT in backend/.env
- Kill processes using the ports: `netstat -ano | findstr :3000`

**Dependencies Issues:**
- Delete node_modules and package-lock.json
- Run `npm install` again
- Ensure Node.js version compatibility

**Tailwind CSS Not Working:**
- Ensure PostCSS is configured correctly
- Check tailwind.config.js paths
- Restart the development server

### Getting Help

If you encounter issues:
1. Check the console for error messages
2. Verify all dependencies are installed
3. Ensure MongoDB is running
4. Check environment variables
5. Review the API endpoint documentation

---

## 📞 Support

For support or questions about this project, please create an issue in the repository or contact the development team.

**Happy Shopping! 🛍️**
