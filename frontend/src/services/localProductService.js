// Local product data service using assets from Assets folder
const localProducts = [
  {
    id: 1,
    name: "Striped Flutter Sleeve Overlap Collar Peplum Hem Blouse",
    category: "women",
    image: "/images/product_1.png",
    price: 50.0,
    originalPrice: 80.5,
    rating: { average: 4.2, count: 128 },
    tags: ["new", "trending"],
    description: "Beautiful striped blouse with flutter sleeves and overlap collar design.",
    colors: ["#FF6B6B", "#4ECDC4", "#45B7D1"],
    sizes: ["XS", "S", "M", "L", "XL"],
    inStock: true
  },
  {
    id: 2,
    name: "Casual Cotton T-Shirt",
    category: "women",
    image: "/images/product_2.png",
    price: 85.0,
    originalPrice: 120.5,
    rating: { average: 4.5, count: 95 },
    tags: ["sale", "bestseller"],
    description: "Comfortable cotton t-shirt perfect for everyday wear.",
    colors: ["#FF6B6B", "#4ECDC4", "#45B7D1"],
    sizes: ["XS", "S", "M", "L", "XL"],
    inStock: true
  },
  {
    id: 3,
    name: "Elegant Summer Dress",
    category: "women",
    image: "/images/product_3.png",
    price: 60.0,
    originalPrice: 100.5,
    rating: { average: 4.7, count: 203 },
    tags: ["new", "summer"],
    description: "Light and airy summer dress perfect for warm weather.",
    colors: ["#FF6B6B", "#4ECDC4", "#45B7D1"],
    sizes: ["XS", "S", "M", "L", "XL"],
    inStock: true
  },
  {
    id: 4,
    name: "Premium Silk Blouse",
    category: "women",
    image: "/images/product_4.png",
    price: 100.0,
    originalPrice: 150.0,
    rating: { average: 4.8, count: 87 },
    tags: ["premium", "luxury"],
    description: "Luxurious silk blouse with elegant design and premium finish.",
    colors: ["#FF6B6B", "#4ECDC4", "#45B7D1"],
    sizes: ["XS", "S", "M", "L", "XL"],
    inStock: true
  },
  {
    id: 5,
    name: "Comfortable Casual Top",
    category: "women",
    image: "/images/product_5.png",
    price: 85.0,
    originalPrice: 120.5,
    rating: { average: 4.3, count: 156 },
    tags: ["casual", "comfortable"],
    description: "Soft and comfortable casual top for everyday styling.",
    colors: ["#FF6B6B", "#4ECDC4", "#45B7D1"],
    sizes: ["XS", "S", "M", "L", "XL"],
    inStock: true
  },
  {
    id: 6,
    name: "Trendy Fashion Top",
    category: "women",
    image: "/images/product_6.png",
    price: 75.0,
    originalPrice: 110.0,
    rating: { average: 4.4, count: 134 },
    tags: ["trendy", "fashion"],
    description: "Stay fashionable with this trendy and stylish top.",
    colors: ["#FF6B6B", "#4ECDC4", "#45B7D1"],
    sizes: ["XS", "S", "M", "L", "XL"],
    inStock: true
  },
  {
    id: 7,
    name: "Classic Formal Blouse",
    category: "women",
    image: "/images/product_7.png",
    price: 95.0,
    originalPrice: 140.0,
    rating: { average: 4.6, count: 98 },
    tags: ["formal", "classic"],
    description: "Professional and elegant blouse perfect for office wear.",
    colors: ["#FF6B6B", "#4ECDC4", "#45B7D1"],
    sizes: ["XS", "S", "M", "L", "XL"],
    inStock: true
  },
  {
    id: 8,
    name: "Stylish Evening Top",
    category: "women",
    image: "/images/product_8.png",
    price: 110.0,
    originalPrice: 160.0,
    rating: { average: 4.7, count: 76 },
    tags: ["evening", "stylish"],
    description: "Perfect top for evening occasions and special events.",
    colors: ["#FF6B6B", "#4ECDC4", "#45B7D1"],
    sizes: ["XS", "S", "M", "L", "XL"],
    inStock: true
  },
  {
    id: 9,
    name: "Sports Athletic Wear",
    category: "women",
    image: "/images/product_9.png",
    price: 65.0,
    originalPrice: 90.0,
    rating: { average: 4.5, count: 187 },
    tags: ["sports", "athletic"],
    description: "High-performance athletic wear for sports and workouts.",
    colors: ["#FF6B6B", "#4ECDC4", "#45B7D1"],
    sizes: ["XS", "S", "M", "L", "XL"],
    inStock: true
  },
  {
    id: 10,
    name: "Cozy Winter Sweater",
    category: "women",
    image: "/images/product_10.png",
    price: 120.0,
    originalPrice: 180.0,
    rating: { average: 4.8, count: 145 },
    tags: ["winter", "cozy"],
    description: "Warm and cozy sweater perfect for cold weather.",
    colors: ["#FF6B6B", "#4ECDC4", "#45B7D1"],
    sizes: ["XS", "S", "M", "L", "XL"],
    inStock: true
  },
  {
    id: 11,
    name: "Modern Casual Shirt",
    category: "women",
    image: "/images/product_11.png",
    price: 80.0,
    originalPrice: 115.0,
    rating: { average: 4.4, count: 112 },
    tags: ["modern", "casual"],
    description: "Modern design casual shirt with contemporary styling.",
    colors: ["#FF6B6B", "#4ECDC4", "#45B7D1"],
    sizes: ["XS", "S", "M", "L", "XL"],
    inStock: true
  },
  {
    id: 12,
    name: "Elegant Party Dress",
    category: "women",
    image: "/images/product_12.png",
    price: 150.0,
    originalPrice: 220.0,
    rating: { average: 4.9, count: 89 },
    tags: ["party", "elegant", "featured"],
    description: "Stunning party dress perfect for special occasions.",
    colors: ["#FF6B6B", "#4ECDC4", "#45B7D1"],
    sizes: ["XS", "S", "M", "L", "XL"],
    inStock: true
  },
  // Men's Collection
  {
    id: 13,
    name: "Classic Men's Polo Shirt",
    category: "men",
    image: "/images/product_13.png",
    price: 70.0,
    originalPrice: 100.0,
    rating: { average: 4.3, count: 167 },
    tags: ["classic", "polo"],
    description: "Timeless polo shirt with classic fit and comfort.",
    colors: ["#2C3E50", "#34495E", "#7F8C8D"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    inStock: true
  },
  {
    id: 14,
    name: "Men Green Solid Zippered Bomber Jacket",
    category: "men",
    image: "/images/product_14.png",
    price: 130.0,
    originalPrice: 180.0,
    rating: { average: 4.6, count: 94 },
    tags: ["bomber", "jacket", "featured"],
    description: "Stylish bomber jacket with zippered design and modern fit.",
    colors: ["#27AE60", "#2ECC71", "#16A085"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    inStock: true
  },
  {
    id: 15,
    name: "Casual Denim Jacket",
    category: "men",
    image: "/images/product_15.png",
    price: 95.0,
    originalPrice: 140.0,
    rating: { average: 4.5, count: 123 },
    tags: ["denim", "casual", "featured"],
    description: "Classic denim jacket perfect for casual styling.",
    colors: ["#3498DB", "#2980B9", "#1ABC9C"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    inStock: true
  },
  // Kids Collection
  {
    id: 16,
    name: "Kids Colorful T-Shirt",
    category: "kid",
    image: "/images/product_16.png",
    price: 25.0,
    originalPrice: 40.0,
    rating: { average: 4.7, count: 234 },
    tags: ["kids", "colorful"],
    description: "Fun and colorful t-shirt perfect for active kids.",
    colors: ["#E74C3C", "#F39C12", "#9B59B6"],
    sizes: ["2T", "3T", "4T", "5T", "6T"],
    inStock: true
  },
  {
    id: 17,
    name: "Kids Comfortable Hoodie",
    category: "kid",
    image: "/images/product_17.png",
    price: 45.0,
    originalPrice: 65.0,
    rating: { average: 4.6, count: 178 },
    tags: ["kids", "hoodie", "featured"],
    description: "Cozy and comfortable hoodie for kids to stay warm.",
    colors: ["#E74C3C", "#F39C12", "#9B59B6"],
    sizes: ["2T", "3T", "4T", "5T", "6T"],
    inStock: true
  },
  // Add more products with remaining images...
  {
    id: 18,
    name: "Premium Cotton Dress",
    category: "women",
    image: "/images/product_18.png",
    price: 88.0,
    originalPrice: 125.0,
    rating: { average: 4.4, count: 156 },
    tags: ["premium", "cotton"],
    description: "Premium cotton dress with elegant design and comfortable fit.",
    colors: ["#FF6B6B", "#4ECDC4", "#45B7D1"],
    sizes: ["XS", "S", "M", "L", "XL"],
    inStock: true
  },
  {
    id: 19,
    name: "Men's Business Shirt",
    category: "men",
    image: "/images/product_19.png",
    price: 85.0,
    originalPrice: 120.0,
    rating: { average: 4.5, count: 143 },
    tags: ["business", "formal"],
    description: "Professional business shirt perfect for office and meetings.",
    colors: ["#2C3E50", "#34495E", "#7F8C8D"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    inStock: true
  },
  {
    id: 20,
    name: "Kids Playful Outfit",
    category: "kid",
    image: "/images/product_20.png",
    price: 35.0,
    originalPrice: 50.0,
    rating: { average: 4.8, count: 198 },
    tags: ["kids", "playful"],
    description: "Fun and playful outfit perfect for active children.",
    colors: ["#E74C3C", "#F39C12", "#9B59B6"],
    sizes: ["2T", "3T", "4T", "5T", "6T"],
    inStock: true
  },
  // Shoes Collection
  {
    id: 21,
    name: "AeroMax Pro Running Shoes",
    category: "shoes",
    subcategory: "running",
    image: "/images/shoes/photo-1512374382149-233c42b6a83b.avif",
    price: 129.99,
    originalPrice: 179.99,
    rating: { average: 4.7, count: 324 },
    tags: ["running", "sport", "featured", "new"],
    description: "Professional running shoes with advanced cushioning technology for maximum comfort and performance.",
    colors: ["#000000", "#FF0000", "#0066CC"],
    sizes: ["6", "6.5", "7", "7.5", "8", "8.5", "9", "9.5", "10", "10.5", "11", "11.5", "12"],
    fit: "Running Fit",
    inStock: true
  },
  {
    id: 22,
    name: "UrbanStride Classic Sneakers",
    category: "shoes",
    subcategory: "casual",
    image: "/images/shoes/photo-1525966222134-fcfa99b8ae77.avif",
    price: 89.99,
    originalPrice: 129.99,
    rating: { average: 4.5, count: 156 },
    tags: ["casual", "streetwear", "bestseller"],
    description: "Versatile casual sneakers perfect for everyday wear with premium materials and comfort.",
    colors: ["#FFFFFF", "#000000", "#808080"],
    sizes: ["6", "6.5", "7", "7.5", "8", "8.5", "9", "9.5", "10", "10.5", "11", "11.5", "12"],
    fit: "Casual Fit",
    inStock: true
  },
  {
    id: 23,
    name: "SportMax Training Shoes",
    category: "shoes",
    subcategory: "training",
    image: "/images/shoes/photo-1542291026-7eec264c27ff.avif",
    price: 109.99,
    originalPrice: 149.99,
    rating: { average: 4.6, count: 289 },
    tags: ["training", "gym", "sport", "featured"],
    description: "High-performance training shoes designed for intense workouts and cross-training activities.",
    colors: ["#FF6600", "#000000", "#FFFF00"],
    sizes: ["6", "6.5", "7", "7.5", "8", "8.5", "9", "9.5", "10", "10.5", "11", "11.5", "12"],
    fit: "Athletic Fit",
    inStock: true
  },
  {
    id: 24,
    name: "FlexWalk Comfort Walking Shoes",
    category: "shoes",
    subcategory: "walking",
    image: "/images/shoes/photo-1549298916-b41d501d3772.avif",
    price: 79.99,
    originalPrice: 109.99,
    rating: { average: 4.4, count: 198 },
    tags: ["walking", "comfort", "casual"],
    description: "Comfortable walking shoes with superior arch support for all-day comfort.",
    colors: ["#8B4513", "#000000", "#FFFFFF"],
    sizes: ["6", "6.5", "7", "7.5", "8", "8.5", "9", "9.5", "10", "10.5", "11", "11.5", "12"],
    fit: "Comfort Fit",
    inStock: true
  },
  {
    id: 25,
    name: "VelocityBoost Sprint Shoes",
    category: "shoes",
    subcategory: "running",
    image: "/images/shoes/photo-1560769629-975ec94e6a86.avif",
    price: 159.99,
    originalPrice: 199.99,
    rating: { average: 4.8, count: 412 },
    tags: ["running", "professional", "premium", "featured"],
    description: "Elite sprint shoes with carbon fiber plate technology for competitive runners.",
    colors: ["#00FF00", "#000000", "#FF0000"],
    sizes: ["6", "6.5", "7", "7.5", "8", "8.5", "9", "9.5", "10", "10.5", "11", "11.5", "12"],
    fit: "Performance Fit",
    inStock: true
  },
  {
    id: 26,
    name: "StreetStyle High-Top Sneakers",
    category: "shoes",
    subcategory: "fashion",
    image: "/images/shoes/photo-1595341888016-a392ef81b7de.avif",
    price: 119.99,
    originalPrice: 159.99,
    rating: { average: 4.3, count: 267 },
    tags: ["fashion", "high-top", "streetwear", "trendy"],
    description: "Stylish high-top sneakers that make a fashion statement with premium leather construction.",
    colors: ["#000000", "#FFFFFF", "#8B0000"],
    sizes: ["6", "6.5", "7", "7.5", "8", "8.5", "9", "9.5", "10", "10.5", "11", "11.5", "12"],
    fit: "Fashion Fit",
    inStock: true
  },
  {
    id: 27,
    name: "TechFlex Basketball Shoes",
    category: "shoes",
    subcategory: "basketball",
    image: "/images/shoes/photo-1606107557195-0e29a4b5b4aa.avif",
    price: 149.99,
    originalPrice: 189.99,
    rating: { average: 4.7, count: 345 },
    tags: ["basketball", "sport", "premium", "featured"],
    description: "Professional basketball shoes with advanced ankle support and responsive cushioning.",
    colors: ["#FF4500", "#000000", "#FFFFFF"],
    sizes: ["6", "6.5", "7", "7.5", "8", "8.5", "9", "9.5", "10", "10.5", "11", "11.5", "12", "13", "14"],
    fit: "Basketball Fit",
    inStock: true
  },
  {
    id: 28,
    name: "EcoStep Sustainable Sneakers",
    category: "shoes",
    subcategory: "casual",
    image: "/images/shoes/istockphoto-2029879472-2048x2048.jpg",
    price: 99.99,
    originalPrice: 139.99,
    rating: { average: 4.5, count: 223 },
    tags: ["eco-friendly", "sustainable", "casual", "new"],
    description: "Environmentally conscious sneakers made from recycled materials without compromising style.",
    colors: ["#228B22", "#8FBC8F", "#FFFFFF"],
    sizes: ["6", "6.5", "7", "7.5", "8", "8.5", "9", "9.5", "10", "10.5", "11", "11.5", "12"],
    fit: "Eco Fit",
    inStock: true
  },
  {
    id: 29,
    name: "NIKE AIR JORDAN 1",
    category: "shoes",
    subcategory: "basketball",
    image: "/images/shoes/nike-jordan.webp",
    price: 749,
    originalPrice: 899,
    rating: { average: 4.8, count: 567 },
    tags: ["premium", "basketball", "retro", "iconic"],
    description: "The iconic Nike Air Jordan 1 Retro High OG brings classic basketball style with premium materials and timeless design.",
    colors: ["#000000", "#FFFFFF", "#DC143C"],
    sizes: ["6", "6.5", "7", "7.5", "8", "8.5", "9", "9.5", "10", "10.5", "11", "11.5", "12"],
    fit: "Regular Fit",
    inStock: true
  },
  {
    id: 30,
    name: "ADIDAS UNVEIL",
    category: "shoes",
    subcategory: "lifestyle",
    image: "/images/shoes/adidas-unveil.jpg",
    price: 749,
    originalPrice: 899,
    rating: { average: 4.6, count: 342 },
    tags: ["premium", "lifestyle", "modern", "comfort"],
    description: "Modern lifestyle sneaker with premium construction and contemporary design for everyday wear.",
    colors: ["#000000", "#FFFFFF", "#0066CC"],
    sizes: ["6", "6.5", "7", "7.5", "8", "8.5", "9", "9.5", "10", "10.5", "11", "11.5", "12"],
    fit: "Athletic Fit",
    inStock: true
  },
  {
    id: 31,
    name: "PUMA DOVE",
    category: "shoes",
    subcategory: "casual",
    image: "/images/shoes/puma-dove.jpg",
    price: 749,
    originalPrice: 899,
    rating: { average: 4.4, count: 298 },
    tags: ["premium", "casual", "versatile", "comfort"],
    description: "Versatile casual sneakers combining comfort and style for everyday adventures.",
    colors: ["#FFFFFF", "#F5F5DC", "#708090"],
    sizes: ["6", "6.5", "7", "7.5", "8", "8.5", "9", "9.5", "10", "10.5", "11", "11.5", "12"],
    fit: "Comfort Fit",
    inStock: true
  }
];

// Featured products (for homepage)
const featuredProducts = [
  localProducts.find(p => p.id === 12), // Elegant Party Dress
  localProducts.find(p => p.id === 21), // AeroMax Pro Running Shoes
  localProducts.find(p => p.id === 15), // Casual Denim Jacket
  localProducts.find(p => p.id === 27), // TechFlex Basketball Shoes
].filter(Boolean);

// Local product service API
const localProductService = {
  // Get all products - alias for compatibility with apiProductService
  getProducts: () => {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...localProducts]), 100); // Simulate small delay
    });
  },

  // Get all products
  getAllProducts: () => {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...localProducts]), 100); // Simulate small delay
    });
  },

  // Get featured products
  getFeaturedProducts: (limit = 4) => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(featuredProducts.slice(0, limit)), 100);
    });
  },

  // Get products by category
  getProductsByCategory: (category) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filtered = localProducts.filter(p => p.category.toLowerCase() === category.toLowerCase());
        resolve(filtered);
      }, 100);
    });
  },

  // Get single product by ID
  getProductById: (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const product = localProducts.find(p => p.id === parseInt(id));
        if (product) {
          resolve(product);
        } else {
          reject(new Error('Product not found'));
        }
      }, 100);
    });
  },

  // Search products
  searchProducts: (query) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filtered = localProducts.filter(p => 
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase()) ||
          p.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
        );
        resolve(filtered);
      }, 100);
    });
  },

  // Get products by subcategory (useful for shoes)
  getProductsBySubcategory: (subcategory) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filtered = localProducts.filter(p => 
          p.subcategory && p.subcategory.toLowerCase() === subcategory.toLowerCase()
        );
        resolve(filtered);
      }, 100);
    });
  },

  // Get shoe categories
  getShoeCategories: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const shoeProducts = localProducts.filter(p => p.category === 'shoes');
        const categories = [...new Set(shoeProducts.map(p => p.subcategory))].filter(Boolean);
        resolve(categories);
      }, 100);
    });
  }
};

export default localProductService;