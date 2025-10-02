const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Product = require('./models/Product');

// Load environment variables
dotenv.config();

// Sample products data
const sampleProducts = [
  {
    name: 'Classic White Shirt',
    description: 'A timeless white button-down shirt made from premium cotton. Perfect for both professional and casual settings.',
    price: 89,
    originalPrice: 120,
    category: 'clothes',
    subcategory: 'shirts',
    tags: ['new', 'formal', 'cotton'],
    sizes: [
      { size: 'XS', stock: 10 },
      { size: 'S', stock: 15 },
      { size: 'M', stock: 20 },
      { size: 'L', stock: 15 },
      { size: 'XL', stock: 10 }
    ],
    colors: ['White', 'Light Blue', 'Pink'],
    images: [
      { url: '/images/product_1.png', alt: 'Classic White Shirt Front', isPrimary: true },
      { url: '/images/product_2.png', alt: 'Classic White Shirt Back', isPrimary: false }
    ],
    stock: 70,
    features: ['100% Premium Cotton', 'Machine Washable', 'Wrinkle Resistant', 'Classic Fit'],
    specifications: {
      material: '100% Cotton',
      care: 'Machine wash cold, hang dry',
      origin: 'Made in USA'
    },
    rating: { average: 4.5, count: 128 },
    isActive: true,
    isFeatured: true
  },
  {
    name: 'Premium Leather Boots',
    description: 'Handcrafted leather boots made from genuine Italian leather. Durable and stylish for any season.',
    price: 299,
    originalPrice: 399,
    category: 'shoes',
    subcategory: 'boots',
    tags: ['premium', 'leather', 'winter'],
    sizes: [
      { size: '38', stock: 5 },
      { size: '39', stock: 8 },
      { size: '40', stock: 12 },
      { size: '41', stock: 10 },
      { size: '42', stock: 8 },
      { size: '43', stock: 5 }
    ],
    colors: ['Black', 'Brown', 'Tan'],
    images: [
      { url: '/images/leather-boots-1.jpg', alt: 'Premium Leather Boots', isPrimary: true },
      { url: '/images/leather-boots-2.jpg', alt: 'Leather Boots Detail', isPrimary: false }
    ],
    stock: 48,
    features: ['Genuine Italian Leather', 'Waterproof', 'Non-slip Sole', 'Comfortable Fit'],
    specifications: {
      material: 'Genuine Leather',
      care: 'Clean with leather cleaner',
      origin: 'Made in Italy'
    },
    rating: { average: 4.8, count: 95 },
    isActive: true,
    isFeatured: true
  },
  {
    name: 'Designer Handbag',
    description: 'Elegant designer handbag with premium hardware and spacious interior. Perfect for everyday use or special occasions.',
    price: 450,
    category: 'accessories',
    subcategory: 'bags',
    tags: ['luxury', 'designer', 'new'],
    sizes: [{ size: 'One Size', stock: 25 }],
    colors: ['Black', 'Brown', 'Navy', 'Red'],
    images: [
      { url: '/images/designer-handbag-1.jpg', alt: 'Designer Handbag', isPrimary: true },
      { url: '/images/designer-handbag-2.jpg', alt: 'Handbag Interior', isPrimary: false }
    ],
    stock: 25,
    features: ['Premium Hardware', 'Multiple Compartments', 'Adjustable Strap', 'Dust Bag Included'],
    specifications: {
      material: 'Saffiano Leather',
      care: 'Wipe clean with soft cloth',
      origin: 'Made in France'
    },
    rating: { average: 4.7, count: 67 },
    isActive: true,
    isFeatured: true
  },
  {
    name: 'Casual Denim Jeans',
    description: 'Comfortable straight-fit denim jeans made from high-quality cotton blend. Perfect for casual everyday wear.',
    price: 79,
    originalPrice: 99,
    category: 'clothes',
    subcategory: 'jeans',
    tags: ['casual', 'denim', 'sale'],
    sizes: [
      { size: '28', stock: 8 },
      { size: '30', stock: 15 },
      { size: '32', stock: 20 },
      { size: '34', stock: 18 },
      { size: '36', stock: 12 },
      { size: '38', stock: 7 }
    ],
    colors: ['Dark Blue', 'Light Blue', 'Black'],
    images: [
      { url: '/images/denim-jeans-1.jpg', alt: 'Casual Denim Jeans', isPrimary: true },
      { url: '/images/denim-jeans-2.jpg', alt: 'Jeans Back View', isPrimary: false }
    ],
    stock: 80,
    features: ['Cotton Blend', 'Five Pocket Style', 'Belt Loops', 'Straight Fit'],
    specifications: {
      material: '98% Cotton, 2% Elastane',
      care: 'Machine wash cold, tumble dry low',
      origin: 'Made in Turkey'
    },
    rating: { average: 4.3, count: 203 },
    isActive: true,
    isFeatured: false
  },
  {
    name: 'Running Sneakers',
    description: 'High-performance running sneakers with advanced cushioning and breathable mesh upper. Ideal for sports and casual wear.',
    price: 120,
    category: 'shoes',
    subcategory: 'sneakers',
    tags: ['sport', 'running', 'comfortable'],
    sizes: [
      { size: '38', stock: 6 },
      { size: '39', stock: 10 },
      { size: '40', stock: 15 },
      { size: '41', stock: 12 },
      { size: '42', stock: 10 },
      { size: '43', stock: 7 }
    ],
    colors: ['White', 'Black', 'Gray', 'Blue'],
    images: [
      { url: '/images/running-sneakers-1.jpg', alt: 'Running Sneakers', isPrimary: true },
      { url: '/images/running-sneakers-2.jpg', alt: 'Sneakers Side View', isPrimary: false }
    ],
    stock: 60,
    features: ['Breathable Mesh', 'Cushioned Sole', 'Lightweight', 'Non-marking Outsole'],
    specifications: {
      material: 'Mesh and Synthetic',
      care: 'Wipe clean with damp cloth',
      origin: 'Made in Vietnam'
    },
    rating: { average: 4.6, count: 145 },
    isActive: true,
    isFeatured: false
  },
  {
    name: 'Silk Scarf',
    description: 'Luxurious silk scarf with beautiful patterns. A perfect accessory to elevate any outfit.',
    price: 65,
    originalPrice: 85,
    category: 'accessories',
    subcategory: 'scarves',
    tags: ['silk', 'luxury', 'sale'],
    sizes: [{ size: 'One Size', stock: 30 }],
    colors: ['Floral Blue', 'Geometric Black', 'Abstract Red', 'Classic Navy'],
    images: [
      { url: '/images/silk-scarf-1.jpg', alt: 'Silk Scarf', isPrimary: true },
      { url: '/images/silk-scarf-2.jpg', alt: 'Scarf Detail', isPrimary: false }
    ],
    stock: 30,
    features: ['100% Silk', 'Hand-rolled Edges', 'Lightweight', 'Versatile Styling'],
    specifications: {
      material: '100% Mulberry Silk',
      care: 'Dry clean only',
      origin: 'Made in Italy'
    },
    rating: { average: 4.4, count: 89 },
    isActive: true,
    isFeatured: false
  },
  {
    name: 'Evening Dress',
    description: 'Elegant evening dress perfect for special occasions. Features a flattering silhouette and premium fabric.',
    price: 199,
    category: 'clothes',
    subcategory: 'dresses',
    tags: ['formal', 'evening', 'new'],
    sizes: [
      { size: 'XS', stock: 3 },
      { size: 'S', stock: 8 },
      { size: 'M', stock: 10 },
      { size: 'L', stock: 8 },
      { size: 'XL', stock: 5 }
    ],
    colors: ['Black', 'Navy', 'Burgundy'],
    images: [
      { url: '/images/evening-dress-1.jpg', alt: 'Evening Dress', isPrimary: true },
      { url: '/images/evening-dress-2.jpg', alt: 'Dress Back View', isPrimary: false }
    ],
    stock: 34,
    features: ['Premium Fabric', 'Flattering Fit', 'Hidden Zipper', 'Lined'],
    specifications: {
      material: '95% Polyester, 5% Elastane',
      care: 'Dry clean only',
      origin: 'Made in Spain'
    },
    rating: { average: 4.9, count: 42 },
    isActive: true,
    isFeatured: true
  },
  {
    name: 'Luxury Watch',
    description: 'Premium timepiece with Swiss movement and sapphire crystal. A perfect blend of elegance and functionality.',
    price: 899,
    category: 'accessories',
    subcategory: 'watches',
    tags: ['luxury', 'swiss', 'premium'],
    sizes: [{ size: 'One Size', stock: 12 }],
    colors: ['Silver', 'Gold', 'Black'],
    images: [
      { url: '/images/luxury-watch-1.jpg', alt: 'Luxury Watch', isPrimary: true },
      { url: '/images/luxury-watch-2.jpg', alt: 'Watch Detail', isPrimary: false }
    ],
    stock: 12,
    features: ['Swiss Movement', 'Sapphire Crystal', 'Water Resistant', 'Premium Strap'],
    specifications: {
      material: 'Stainless Steel',
      care: 'Professional servicing recommended',
      origin: 'Made in Switzerland'
    },
    rating: { average: 4.8, count: 28 },
    isActive: true,
    isFeatured: true
  }
];

// Sample admin user
const adminUser = {
  username: 'admin',
  email: 'admin@ecommerce.com',
  password: 'admin123',
  firstName: 'Admin',
  lastName: 'User',
  phone: '+1234567890',
  isAdmin: true
};

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create admin user
    const admin = new User(adminUser);
    await admin.save();
    console.log('👤 Admin user created');

    // Create sample products
    await Product.insertMany(sampleProducts);
    console.log('📦 Sample products created');

    console.log('✅ Database seeded successfully!');
    console.log('🔑 Admin login: admin@ecommerce.com / admin123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase();