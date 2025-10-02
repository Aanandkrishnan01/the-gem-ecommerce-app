import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useSearch } from '../context/SearchContext';
import { useReviews } from '../context/ReviewsContext';
import WishlistButton from '../components/WishlistButton';
import StarRating from '../components/StarRating';
import SearchFilters from '../components/SearchFilters';
import SortDropdown from '../components/SortDropdown';

const Products = () => {
  const [searchParams] = useSearchParams();
  const { addItem } = useCart();
  const { getProductRating } = useReviews();
  const {
    searchResults,
    isSearching,
    searchQuery,
    setSearchQuery,
    filters,
    updateFilter,
    clearFilters,
    getActiveFiltersCount,
    showFilters,
    setShowFilters
  } = useSearch();

  // Initialize search based on URL parameters
  useEffect(() => {
    const searchParam = searchParams.get('search');
    const categoryParam = searchParams.get('category');
    const brandParam = searchParams.get('brand');
    
    if (searchParam) {
      setSearchQuery(searchParam);
    }
    
    if (categoryParam) {
      updateFilter('category', categoryParam);
    }
    
    if (brandParam) {
      updateFilter('brand', brandParam);
    }
  }, [searchParams, setSearchQuery, updateFilter]);

  const handleAddToCart = (product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      size: product.sizes?.[0] || 'One Size',
      color: product.colors?.[0] || 'Default',
      quantity: 1
    });
  };

  const getProductRatingData = (productId) => {
    const rating = getProductRating(productId);
    return {
      average: rating.averageRating,
      count: rating.totalReviews
    };
  };

const Products = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getProductRating } = useReviews();
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    filter: searchParams.get('filter') || '',
    search: searchParams.get('search') || '',
    priceRange: 'all',
    shoeType: '',
    gender: ''
  });

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const localProducts = await localProductService.getProducts();
        setProducts(localProducts);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      search: searchParams.get('search') || '',
      category: searchParams.get('category') || '',
      filter: searchParams.get('filter') || ''
    }));
  }, [searchParams]);

  useEffect(() => {
    let filtered = products;

    if (filters.category) {
      if (filters.category === 'clothes') {
        filtered = filtered.filter(product => 
          product.category === 'women' || product.category === 'men' || product.category === 'kid'
        );
      } else {
        filtered = filtered.filter(product => product.category === filters.category);
      }
    }

    if (filters.category === 'clothes' && filters.gender) {
      filtered = filtered.filter(product => product.category === filters.gender);
    }

    if (filters.category === 'shoes' && filters.shoeType) {
      filtered = filtered.filter(product => 
        product.subcategory && product.subcategory === filters.shoeType
      );
    }

    if (filters.filter) {
      filtered = filtered.filter(product => product.tags.includes(filters.filter));
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchLower) ||
        product.description?.toLowerCase().includes(searchLower) ||
        product.category.toLowerCase().includes(searchLower) ||
        product.subcategory?.toLowerCase().includes(searchLower) ||
        product.brand?.toLowerCase().includes(searchLower) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    if (filters.priceRange !== 'all') {
      switch (filters.priceRange) {
        case 'under50':
          filtered = filtered.filter(product => product.price < 50);
          break;
        case '50to100':
          filtered = filtered.filter(product => product.price >= 50 && product.price <= 100);
          break;
        case '100to200':
          filtered = filtered.filter(product => product.price >= 100 && product.price <= 200);
          break;
        case 'over200':
          filtered = filtered.filter(product => product.price > 200);
          break;
        default:
          break;
      }
    }

    setFilteredProducts(filtered);
  }, [products, filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-light text-black mb-4">
            {filters.search 
              ? `Search Results for "${filters.search}"`
              : filters.category 
                ? `${filters.category.charAt(0).toUpperCase() + filters.category.slice(1)}` 
                : 'All Products'
            }
          </h1>
          <p className="text-gray-600">
            {filteredProducts.length} products found
            {filters.search && (
              <span className="ml-2">
                • <button 
                    onClick={() => setFilters(prev => ({ ...prev, search: '' }))} 
                    className="text-blue-600 hover:underline"
                  >
                    Clear search
                  </button>
              </span>
            )}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/4">
            <div className="bg-gray-50 p-6 rounded-lg sticky top-4">
              <h3 className="text-lg font-medium text-black mb-4">Filters</h3>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                >
                  <option value="">All Categories</option>
                  <option value="clothes">Clothes</option>
                  <option value="women">Women</option>
                  <option value="men">Men</option>
                  <option value="kid">Kids</option>
                  <option value="shoes">Shoes</option>
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                <select
                  value={filters.priceRange}
                  onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                >
                  <option value="all">All Prices</option>
                  <option value="under50">Under $50</option>
                  <option value="50to100">$50 - $100</option>
                  <option value="100to200">$100 - $200</option>
                  <option value="over200">Over $200</option>
                </select>
              </div>

              <button
                onClick={() => setFilters({ category: '', filter: '', search: '', priceRange: 'all', shoeType: '', gender: '' })}
                className="w-full text-sm text-gray-600 hover:text-black transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          </div>

          <div className="lg:w-3/4">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg mb-4">No products found matching your criteria.</p>
                <button
                  onClick={() => setFilters({ category: '', filter: '', search: '', priceRange: 'all', shoeType: '', gender: '' })}
                  className="btn-primary"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="product-card group">
                    <div className="relative">
                      <Link to={`/products/${product.id}`}>
                        <div className="aspect-square bg-gray-200 mb-4 flex items-center justify-center overflow-hidden rounded-lg">
                          <img 
                            src={product.image} 
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                          <div className="hidden w-full h-full items-center justify-center text-gray-500">
                            {product.name}
                          </div>
                        </div>
                      </Link>
                      
                      <div className="absolute top-3 right-3">
                        <WishlistButton product={product} />
                      </div>
                    </div>
                    
                    <Link to={`/products/${product.id}`}>
                      <div className="p-2">
                        <h3 className="text-lg font-medium text-black mb-2 group-hover:text-gray-700 transition-colors">
                          {product.name}
                        </h3>
                        <p className="text-gray-600 mb-2 capitalize">{product.category}</p>
                        
                        <div className="mb-2">
                          <StarRating
                            rating={getProductRating(product.id).average}
                            showCount={true}
                            count={getProductRating(product.id).count}
                            size="small"
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <p className="text-xl font-semibold text-black">${product.price}</p>
                          <div className="flex items-center space-x-2">
                            {product.tags.includes('sale') && (
                              <span className="bg-red-100 text-red-600 px-2 py-1 text-xs rounded-full">SALE</span>
                            )}
                            {product.tags.includes('new') && (
                              <span className="bg-green-100 text-green-600 px-2 py-1 text-xs rounded-full">NEW</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;