// API service for connecting to the backend database
// Use relative URLs for combined deployment (same domain for frontend and backend)
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '/api'  // Relative URL for production (same domain)
  : 'http://localhost:5000/api';  // Localhost for development
const BASE_URL = process.env.NODE_ENV === 'production' 
  ? ''  // Same domain for production
  : 'http://localhost:5000';  // Localhost for development

class ApiProductService {
  // Available images mapping for fallback
  getAvailableImages() {
    const availableImages = [];
    for (let i = 1; i <= 36; i++) {
      availableImages.push(`/images/product_${i}.png`);
    }
    // Add shoes images
    availableImages.push(
      '/images/shoes/nike-jordan.webp',
      '/images/shoes/adidas-unveil.jpg',
      '/images/shoes/puma-dove.jpg',
      '/images/shoes/photo-1512374382149-233c42b6a83b.avif',
      '/images/shoes/photo-1595341888016-a392ef81b7de.avif',
      '/images/shoes/photo-1549298916-b41d501d3772.avif'
    );
    return availableImages;
  }

  // Transform products to add image property from images array
  transformProducts(products) {
    const availableImages = this.getAvailableImages();
    
    return products.map((product, index) => {
      let imageUrl = `${BASE_URL}${availableImages[index % availableImages.length] || '/images/placeholder.png'}`;
      
      // Try to use the product's actual image if available
      if (product.images && product.images.length > 0) {
        const primaryImage = product.images.find(img => img.isPrimary) || product.images[0];
        // Check if the image looks like it might exist (has proper naming)
        const imageRef = primaryImage.url;
        if (imageRef.includes('product_') || imageRef.includes('shoes/')) {
          imageUrl = `${BASE_URL}${imageRef}`;
        }
      }
      
      return {
        ...product,
        image: imageUrl
      };
    });
  }

  // Transform single product
  transformProduct(product) {
    const availableImages = this.getAvailableImages();
    const fallbackImage = availableImages[Math.floor(Math.random() * availableImages.length)];
    
    return {
      ...product,
      image: product.images && product.images.length > 0 
        ? `${BASE_URL}${product.images.find(img => img.isPrimary)?.url || product.images[0].url}`
        : `${BASE_URL}${fallbackImage || '/images/placeholder.png'}`
    };
  }

  // Get all products with optional filters
  async getProducts(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const url = queryString ? `${API_BASE_URL}/products?${queryString}` : `${API_BASE_URL}/products`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      const products = data.products || data; // Handle different response structures
      
      // Transform products to add image property
      return this.transformProducts(Array.isArray(products) ? products : [products]);
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  // Get featured products
  async getFeaturedProducts(limit = 4) {
    try {
      return await this.getProducts({ featured: true, limit });
    } catch (error) {
      console.error('Error fetching featured products:', error);
      throw error;
    }
  }

  // Get products by category
  async getProductsByCategory(category, limit = 20) {
    try {
      return await this.getProducts({ category, limit });
    } catch (error) {
      console.error('Error fetching products by category:', error);
      throw error;
    }
  }

  // Get product by ID
  async getProductById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      const product = data.product || data; // Handle different response structures
      
      // Transform product to add image property
      return this.transformProduct(product);
    } catch (error) {
      console.error('Error fetching product by ID:', error);
      throw error;
    }
  }

  // Search products
  async searchProducts(searchTerm, options = {}) {
    try {
      return await this.getProducts({ 
        search: searchTerm, 
        ...options 
      });
    } catch (error) {
      console.error('Error searching products:', error);
      throw error;
    }
  }

  // Get products with filters
  async getFilteredProducts(filters) {
    try {
      return await this.getProducts(filters);
    } catch (error) {
      console.error('Error fetching filtered products:', error);
      throw error;
    }
  }

  // Get product categories
  async getCategories() {
    try {
      const response = await fetch(`${API_BASE_URL}/products/categories`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Return default categories if API fails
      return ['clothes', 'shoes', 'accessories'];
    }
  }

  // Get new arrivals
  async getNewArrivals(limit = 8) {
    try {
      return await this.getProducts({ 
        tags: 'new', 
        sort: 'newest', 
        limit 
      });
    } catch (error) {
      console.error('Error fetching new arrivals:', error);
      throw error;
    }
  }

  // Get sale products
  async getSaleProducts(limit = 8) {
    try {
      return await this.getProducts({ 
        tags: 'sale', 
        sort: 'price', 
        limit 
      });
    } catch (error) {
      console.error('Error fetching sale products:', error);
      throw error;
    }
  }

  // Add product (admin only)
  async addProduct(productData, token) {
    try {
      const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(productData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    }
  }

  // Update product (admin only)
  async updateProduct(id, productData, token) {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(productData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  }

  // Delete product (admin only)
  async deleteProduct(id, token) {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return { success: true };
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }
}

// Create and export instance
const apiProductService = new ApiProductService();
export default apiProductService;