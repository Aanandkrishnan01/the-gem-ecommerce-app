const API_BASE_URL = 'https://fakestoreapi.com';

// API Service for external product data
export const productAPI = {
  // Get all products
  getAllProducts: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/products`);
      if (!response.ok) throw new Error('Failed to fetch products');
      const products = await response.json();
      return transformProducts(products);
    } catch (error) {
      console.error('Error fetching products:', error);
      return getFallbackProducts();
    }
  },

  // Get limited products for featured section
  getFeaturedProducts: async (limit = 4) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products?limit=${limit}`);
      if (!response.ok) throw new Error('Failed to fetch featured products');
      const products = await response.json();
      return transformProducts(products);
    } catch (error) {
      console.error('Error fetching featured products:', error);
      return getFallbackProducts().slice(0, limit);
    }
  },

  // Get products by category
  getProductsByCategory: async (category) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/category/${category}`);
      if (!response.ok) throw new Error('Failed to fetch products by category');
      const products = await response.json();
      return transformProducts(products);
    } catch (error) {
      console.error('Error fetching products by category:', error);
      return getFallbackProducts().filter(p => p.originalCategory === category);
    }
  },

  // Get single product
  getProduct: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`);
      if (!response.ok) throw new Error('Failed to fetch product');
      const product = await response.json();
      return transformProduct(product);
    } catch (error) {
      console.error('Error fetching product:', error);
      return getFallbackProducts().find(p => p.id === parseInt(id));
    }
  },

  // Get all categories
  getCategories: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/categories`);
      if (!response.ok) throw new Error('Failed to fetch categories');
      return await response.json();
    } catch (error) {
      console.error('Error fetching categories:', error);
      return ['electronics', 'jewelery', "men's clothing", "women's clothing"];
    }
  }
};

// Transform API product data to match our app structure
const transformProduct = (apiProduct) => ({
  id: apiProduct.id,
  name: apiProduct.title,
  description: apiProduct.description,
  price: Math.round(apiProduct.price),
  originalPrice: Math.round(apiProduct.price * 1.2), // Add 20% as original price
  category: mapApiCategory(apiProduct.category),
  originalCategory: apiProduct.category,
  tags: generateTags(apiProduct.category, apiProduct.price),
  image: apiProduct.image,
  images: [
    { url: apiProduct.image, alt: apiProduct.title, isPrimary: true }
  ],
  rating: {
    average: apiProduct.rating?.rate || 4.0,
    count: apiProduct.rating?.count || Math.floor(Math.random() * 200) + 50
  },
  stock: Math.floor(Math.random() * 50) + 10,
  colors: generateColors(apiProduct.category),
  sizes: generateSizes(apiProduct.category),
  features: generateFeatures(apiProduct.category),
  isActive: true,
  isFeatured: Math.random() > 0.7 // 30% chance to be featured
});

const transformProducts = (apiProducts) => {
  return apiProducts.map(transformProduct);
};

// Map API categories to our internal categories
const mapApiCategory = (apiCategory) => {
  const categoryMap = {
    "men's clothing": 'clothes',
    "women's clothing": 'clothes',
    "jewelery": 'accessories',
    "electronics": 'accessories'
  };
  return categoryMap[apiCategory] || 'accessories';
};

// Generate relevant tags based on category and price
const generateTags = (category, price) => {
  const baseTags = ['new'];
  
  if (price < 20) baseTags.push('sale');
  if (price > 100) baseTags.push('premium');
  
  const categoryTags = {
    "men's clothing": ['formal', 'casual'],
    "women's clothing": ['trendy', 'casual'],
    "jewelery": ['luxury', 'elegant'],
    "electronics": ['tech', 'modern']
  };
  
  return [...baseTags, ...(categoryTags[category] || [])];
};

// Generate colors based on category
const generateColors = (category) => {
  const colorSets = {
    "men's clothing": ['Black', 'Navy', 'Gray', 'White'],
    "women's clothing": ['Black', 'White', 'Red', 'Pink', 'Blue'],
    "jewelery": ['Gold', 'Silver', 'Rose Gold'],
    "electronics": ['Black', 'White', 'Silver']
  };
  
  return colorSets[category] || ['Black', 'White'];
};

// Generate sizes based on category
const generateSizes = (category) => {
  const sizeSets = {
    "men's clothing": ['S', 'M', 'L', 'XL', 'XXL'],
    "women's clothing": ['XS', 'S', 'M', 'L', 'XL'],
    "jewelery": ['One Size'],
    "electronics": ['One Size']
  };
  
  const sizes = sizeSets[category] || ['One Size'];
  return sizes.map(size => ({ size, stock: Math.floor(Math.random() * 20) + 5 }));
};

// Generate features based on category
const generateFeatures = (category) => {
  const featureSets = {
    "men's clothing": ['Premium Quality', 'Comfortable Fit', 'Durable Material', 'Easy Care'],
    "women's clothing": ['Trendy Design', 'Comfortable Fit', 'Premium Fabric', 'Versatile Style'],
    "jewelery": ['Premium Materials', 'Elegant Design', 'Hypoallergenic', 'Gift Box Included'],
    "electronics": ['Latest Technology', 'High Performance', 'User Friendly', 'Warranty Included']
  };
  
  return featureSets[category] || ['High Quality', 'Great Value', 'Customer Favorite'];
};

// Fallback products if API fails
const getFallbackProducts = () => [
  {
    id: 1,
    name: 'Classic White Shirt',
    description: 'A timeless white button-down shirt',
    price: 89,
    originalPrice: 120,
    category: 'clothes',
    originalCategory: "men's clothing",
    tags: ['new', 'formal'],
    image: 'https://via.placeholder.com/300x300?text=White+Shirt',
    images: [{ url: 'https://via.placeholder.com/300x300?text=White+Shirt', alt: 'White Shirt', isPrimary: true }],
    rating: { average: 4.5, count: 128 },
    stock: 25,
    colors: ['White', 'Light Blue'],
    sizes: [{ size: 'M', stock: 10 }, { size: 'L', stock: 15 }],
    features: ['Premium Cotton', 'Classic Fit', 'Easy Care'],
    isActive: true,
    isFeatured: true
  },
  {
    id: 2,
    name: 'Leather Boots',
    description: 'Premium leather boots',
    price: 159,
    originalPrice: 199,
    category: 'shoes',
    originalCategory: "men's clothing",
    tags: ['sale', 'premium'],
    image: 'https://via.placeholder.com/300x300?text=Leather+Boots',
    images: [{ url: 'https://via.placeholder.com/300x300?text=Leather+Boots', alt: 'Leather Boots', isPrimary: true }],
    rating: { average: 4.8, count: 95 },
    stock: 15,
    colors: ['Black', 'Brown'],
    sizes: [{ size: '42', stock: 5 }, { size: '43', stock: 10 }],
    features: ['Genuine Leather', 'Comfortable', 'Durable'],
    isActive: true,
    isFeatured: true
  }
];

export default productAPI;