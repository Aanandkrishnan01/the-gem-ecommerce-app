import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useSearch } from '../context/SearchContext';
import { useReviews } from '../context/ReviewsContext';
import WishlistButton from '../components/WishlistButton';
import CompareButton from '../components/CompareButton';
import StarRating from '../components/StarRating';
import SearchFilters from '../components/SearchFilters';
import SortDropdown from '../components/SortDropdown';
import { ProductGridSkeleton } from '../components/LoadingSkeleton';
import { FadeIn, ScaleIn, StaggerContainer } from '../components/Animations';

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

  // Initialize search based on URL parameters (only once)
  useEffect(() => {
    const searchParam = searchParams.get('search');
    const categoryParam = searchParams.get('category');
    const brandParam = searchParams.get('brand');
    
    // Only set these if the current context values are empty/default
    if (searchParam && !searchQuery) {
      setSearchQuery(searchParam);
    }
    
    if (categoryParam && !filters.category) {
      updateFilter('category', categoryParam);
    }
    
    if (brandParam && !filters.brand) {
      updateFilter('brand', brandParam);
    }
    
    // Clear URL parameters after setting them to avoid conflicts
    const currentUrl = new URL(window.location);
    let urlChanged = false;
    
    if (currentUrl.searchParams.has('search') || 
        currentUrl.searchParams.has('category') || 
        currentUrl.searchParams.has('brand')) {
      currentUrl.searchParams.delete('search');
      currentUrl.searchParams.delete('category');  
      currentUrl.searchParams.delete('brand');
      urlChanged = true;
    }
    
    if (urlChanged) {
      window.history.replaceState({}, '', currentUrl.pathname);
    }
  }, []); // Empty dependency array - only run once on mount

  const handleAddToCart = (product) => {
    try {
      if (!product || !product.id) {
        console.error('Invalid product for adding to cart:', product);
        return;
      }

      addItem({
        id: product.id,
        name: product.name || 'Unnamed Product',
        price: product.price || 0,
        image: product.image || '/images/placeholder-product.png',
        size: product.sizes?.[0] || 'One Size',
        color: product.colors?.[0] || 'Default',
        quantity: 1
      });
    } catch (error) {
      console.error('Error adding product to cart:', error);
    }
  };

  const getProductRatingData = (productId) => {
    try {
      const rating = getProductRating(productId);
      return {
        average: rating?.averageRating || 0,
        count: rating?.totalReviews || 0
      };
    } catch (error) {
      console.error('Error getting product rating:', error);
      return {
        average: 0,
        count: 0
      };
    }
  };

  const displayProducts = searchResults;
  const activeFiltersCount = getActiveFiltersCount();

  return (
    <div className="min-h-screen page-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-light text-foreground mb-2">
                {searchQuery ? `Search Results for "${searchQuery}"` : 'All Products'}
              </h1>
              <p className="text-muted-foreground">
                {isSearching ? 'Searching...' : `${displayProducts.length} products found`}
                {activeFiltersCount > 0 && ` (${activeFiltersCount} filters applied)`}
              </p>
            </div>
          </div>

          {/* Active Filters Display */}
          {activeFiltersCount > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-sm text-muted-foreground">Active filters:</span>
              
              {filters.category && (
                <span className="inline-flex items-center px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm rounded-full">
                  Category: {filters.category}
                  <button
                    onClick={() => updateFilter('category', '')}
                    className="ml-2 text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-100"
                  >
                    ×
                  </button>
                </span>
              )}
              
              {filters.brand && (
                <span className="inline-flex items-center px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm rounded-full">
                  Brand: {filters.brand}
                  <button
                    onClick={() => updateFilter('brand', '')}
                    className="ml-2 text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-100"
                  >
                    ×
                  </button>
                </span>
              )}
              
              {filters.size && (
                <span className="inline-flex items-center px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm rounded-full">
                  Size: {filters.size}
                  <button
                    onClick={() => updateFilter('size', '')}
                    className="ml-2 text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-100"
                  >
                    ×
                  </button>
                </span>
              )}
              
              {filters.color && (
                <span className="inline-flex items-center px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm rounded-full">
                  Color: {filters.color}
                  <button
                    onClick={() => updateFilter('color', '')}
                    className="ml-2 text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-100"
                  >
                    ×
                  </button>
                </span>
              )}
              
              {filters.rating > 0 && (
                <span className="inline-flex items-center px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm rounded-full">
                  {filters.rating}+ stars
                  <button
                    onClick={() => updateFilter('rating', 0)}
                    className="ml-2 text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-100"
                  >
                    ×
                  </button>
                </span>
              )}
              
              {(filters.priceRange[0] > 0 || filters.priceRange[1] < 1000) && (
                <span className="inline-flex items-center px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm rounded-full">
                  ${filters.priceRange[0]} - ${filters.priceRange[1]}
                  <button
                    onClick={() => updateFilter('priceRange', [0, 1000])}
                    className="ml-2 text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-100"
                  >
                    ×
                  </button>
                </span>
              )}
              
              {(filters.inStock || filters.onSale) && (
                <span className="inline-flex items-center px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm rounded-full">
                  {filters.inStock && 'In Stock'}{filters.inStock && filters.onSale && ' & '}{filters.onSale && 'On Sale'}
                  <button
                    onClick={() => {
                      updateFilter('inStock', false);
                      updateFilter('onSale', false);
                    }}
                    className="ml-2 text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-100"
                  >
                    ×
                  </button>
                </span>
              )}
              
              <button
                onClick={clearFilters}
                className="text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-80 lg:flex-shrink-0">
            <SearchFilters />
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Sort and View Options */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                {!showFilters && (
                  <button
                    onClick={() => setShowFilters(true)}
                    className="lg:hidden flex items-center space-x-2 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                    </svg>
                    <span>Filters</span>
                    {activeFiltersCount > 0 && (
                      <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full">
                        {activeFiltersCount}
                      </span>
                    )}
                  </button>
                )}
              </div>
              
              <SortDropdown />
            </div>

            {/* Products Grid */}
            {isSearching ? (
              <ProductGridSkeleton count={12} />
            ) : displayProducts.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-24 h-24 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-foreground mb-2">No products found</h3>
                <p className="text-muted-foreground mb-6">
                  {searchQuery || activeFiltersCount > 0
                    ? 'Try adjusting your search or filters to find what you\'re looking for.'
                    : 'No products are available at the moment.'
                  }
                </p>
                {(searchQuery || activeFiltersCount > 0) && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      clearFilters();
                    }}
                    className="btn-primary"
                  >
                    Clear Search & Filters
                  </button>
                )}
              </div>
            ) : (
              <StaggerContainer className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                {Array.isArray(displayProducts) && displayProducts.map((product, index) => {
                  // Safety check for product object
                  if (!product || !product.id) {
                    console.warn('Invalid product object:', product);
                    return null;
                  }

                  const ratingData = getProductRatingData(product.id);
                  
                  return (
                    <FadeIn key={product.id} delay={index * 50}>
                      <ScaleIn>
                        <div className="group relative dark-container rounded-lg shadow-sm hover:shadow-lg transition-all duration-300">
                          <div className="relative overflow-hidden rounded-t-lg">
                            <Link to={`/products/${product.id}`}>
                              <img
                                src={product.image || '/images/placeholder-product.png'}
                                alt={product.name || 'Product'}
                                className="w-full h-48 sm:h-64 lg:h-80 object-cover group-hover:scale-105 transition-transform duration-300"
                                onError={(e) => {
                                  e.target.src = '/images/placeholder-product.png';
                                }}
                              />
                            </Link>
                        
                        {/* Sale Badge */}
                        {product?.originalPrice && product?.price && product.originalPrice > product.price && (
                          <div className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-red-500 text-white px-2 py-1 rounded-md text-xs sm:text-sm font-medium">
                            SALE
                          </div>
                        )}
                        
                        {/* Wishlist Button */}
                        <div className="absolute top-2 right-2 sm:top-4 sm:right-4">
                          <WishlistButton product={product} />
                        </div>
                      </div>

                      <div className="p-3 sm:p-4 lg:p-6">
                        <div className="flex items-start justify-between mb-2">
                          <Link to={`/products/${product.id}`}>
                            <h3 className="font-medium text-foreground group-hover:text-muted-foreground transition-colors line-clamp-2 text-sm sm:text-base">
                              {product?.name || 'Unnamed Product'}
                            </h3>
                          </Link>
                        </div>

                        {/* Rating */}
                        <div className="flex items-center mb-2">
                          <StarRating rating={ratingData?.average || 0} size="sm" />
                          <span className="ml-2 text-xs sm:text-sm text-muted-foreground">
                            ({ratingData?.count || 0})
                          </span>
                        </div>

                        {/* Category and Brand */}
                        <div className="text-xs sm:text-sm text-muted-foreground mb-2 capitalize">
                          {product?.category || 'Uncategorized'}
                          {product?.brand && ` • ${product.brand}`}
                        </div>

                        {/* Price */}
                        <div className="flex items-center mb-3 sm:mb-4">
                          <span className="text-lg sm:text-xl font-bold text-foreground">${product?.price || 0}</span>
                          {product?.originalPrice && product?.price && product.originalPrice > product.price && (
                            <span className="ml-2 text-xs sm:text-sm text-muted-foreground line-through">
                              ${product.originalPrice}
                            </span>
                          )}
                        </div>

                        {/* Add to Cart Button */}
                        <button
                          onClick={() => handleAddToCart(product)}
                          className="w-full btn-primary mb-2 text-sm sm:text-base py-2 sm:py-3"
                        >
                          Add to Cart
                        </button>

                        {/* Compare Button */}
                        <CompareButton 
                          product={product} 
                          className="w-full text-sm sm:text-base"
                          showText={true}
                        />
                      </div>
                    </div>
                  </ScaleIn>
                </FadeIn>
                  );
                }).filter(Boolean)}
              </StaggerContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;