import React, { useState } from 'react';
import { useSearch } from '../context/SearchContext';

const SearchFilters = ({ className = '' }) => {
  const {
    filters,
    updateFilter,
    clearFilters,
    filterOptions,
    getActiveFiltersCount,
    showFilters,
    setShowFilters
  } = useSearch();

  const [expandedSections, setExpandedSections] = useState({
    category: true,
    price: true,
    brand: false,
    size: false,
    color: false,
    rating: false,
    other: false
  });

  const activeFiltersCount = getActiveFiltersCount();

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handlePriceRangeChange = (value, index) => {
    const newRange = [...filters.priceRange];
    newRange[index] = parseInt(value);
    updateFilter('priceRange', newRange);
  };

  const handleQuickPriceFilter = (range) => {
    updateFilter('priceRange', [range.min, range.max]);
  };

  const FilterSection = ({ title, section, children, count = 0 }) => (
    <div className="border-b border-border pb-4 mb-4 last:border-b-0 last:pb-0 last:mb-0">
      <button
        onClick={() => toggleSection(section)}
        className="flex items-center justify-between w-full text-left py-2"
      >
        <h3 className="font-medium text-foreground flex items-center">
          {title}
          {count > 0 && (
            <span className="ml-2 px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full">
              {count}
            </span>
          )}
        </h3>
        <svg
          className={`w-5 h-5 transform transition-transform ${
            expandedSections[section] ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {expandedSections[section] && (
        <div className="mt-3 space-y-2">
          {children}
        </div>
      )}
    </div>
  );

  if (!showFilters) {
    return (
      <button
        onClick={() => setShowFilters(true)}
        className={`flex items-center space-x-2 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors ${className}`}
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
    );
  }

  return (
    <div className={`dark-container ${className}`}>
      {/* Filter Header */}
      <div className="px-6 py-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-foreground flex items-center">
            Filters
            {activeFiltersCount > 0 && (
              <span className="ml-2 px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm rounded-full">
                {activeFiltersCount} active
              </span>
            )}
          </h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={clearFilters}
              disabled={activeFiltersCount === 0}
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              Clear All
            </button>
            <button
              onClick={() => setShowFilters(false)}
              className="p-1 hover:bg-muted rounded"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Content */}
      <div className="p-6 space-y-6 max-h-96 overflow-y-auto">
        {/* Category Filter */}
        <FilterSection 
          title="Category" 
          section="category" 
          count={filters.category ? 1 : 0}
        >
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="category"
                value=""
                checked={!filters.category}
                onChange={(e) => updateFilter('category', e.target.value)}
                className="mr-3"
              />
              <span className="text-foreground">All Categories</span>
            </label>
            {filterOptions.categories.map(category => (
              <label key={category} className="flex items-center">
                <input
                  type="radio"
                  name="category"
                  value={category}
                  checked={filters.category === category}
                  onChange={(e) => updateFilter('category', e.target.value)}
                  className="mr-3"
                />
                <span className="text-foreground capitalize">{category}</span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Price Range Filter */}
        <FilterSection 
          title="Price Range" 
          section="price"
          count={filters.priceRange[0] > 0 || filters.priceRange[1] < 1000 ? 1 : 0}
        >
          <div className="space-y-4">
            {/* Quick Price Filters */}
            <div className="grid grid-cols-1 gap-2">
              {filterOptions.priceRanges.map(range => (
                <button
                  key={range.label}
                  onClick={() => handleQuickPriceFilter(range)}
                  className={`px-3 py-2 text-sm border rounded-lg text-left transition-colors ${
                    filters.priceRange[0] === range.min && filters.priceRange[1] === range.max
                      ? 'border-blue-500 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200'
                      : 'border-border hover:border-muted-foreground bg-background text-foreground hover:bg-muted'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>

            {/* Custom Range Sliders */}
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Min Price: ${filters.priceRange[0]}
                </label>
                <input
                  type="range"
                  min="0"
                  max="1000"
                  step="10"
                  value={filters.priceRange[0]}
                  onChange={(e) => handlePriceRangeChange(e.target.value, 0)}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Max Price: ${filters.priceRange[1]}
                </label>
                <input
                  type="range"
                  min="0"
                  max="1000"
                  step="10"
                  value={filters.priceRange[1]}
                  onChange={(e) => handlePriceRangeChange(e.target.value, 1)}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
            </div>
          </div>
        </FilterSection>

        {/* Brand Filter */}
        {filterOptions.brands.length > 0 && (
          <FilterSection 
            title="Brand" 
            section="brand" 
            count={filters.brand ? 1 : 0}
          >
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="brand"
                  value=""
                  checked={!filters.brand}
                  onChange={(e) => updateFilter('brand', e.target.value)}
                  className="mr-3"
                />
                <span className="text-foreground">All Brands</span>
              </label>
              {filterOptions.brands.slice(0, 8).map(brand => (
                <label key={brand} className="flex items-center">
                  <input
                    type="radio"
                    name="brand"
                    value={brand}
                    checked={filters.brand === brand}
                    onChange={(e) => updateFilter('brand', e.target.value)}
                    className="mr-3"
                  />
                  <span className="text-foreground">{brand}</span>
                </label>
              ))}
            </div>
          </FilterSection>
        )}

        {/* Size Filter */}
        {filterOptions.sizes.length > 0 && (
          <FilterSection 
            title="Size" 
            section="size" 
            count={filters.size ? 1 : 0}
          >
            <div className="grid grid-cols-3 gap-2">
              {filterOptions.sizes.map(size => (
                <button
                  key={size}
                  onClick={() => updateFilter('size', filters.size === size ? '' : size)}
                  className={`px-3 py-2 text-sm border rounded-lg transition-colors ${
                    filters.size === size
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </FilterSection>
        )}

        {/* Color Filter */}
        {filterOptions.colors.length > 0 && (
          <FilterSection 
            title="Color" 
            section="color" 
            count={filters.color ? 1 : 0}
          >
            <div className="grid grid-cols-4 gap-2">
              {filterOptions.colors.map(color => (
                <button
                  key={color}
                  onClick={() => updateFilter('color', filters.color === color ? '' : color)}
                  className={`px-2 py-2 text-xs border rounded-lg transition-colors ${
                    filters.color === color
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  title={color}
                >
                  {color}
                </button>
              ))}
            </div>
          </FilterSection>
        )}

        {/* Rating Filter */}
        <FilterSection 
          title="Customer Rating" 
          section="rating" 
          count={filters.rating > 0 ? 1 : 0}
        >
          <div className="space-y-2">
            {[4, 3, 2, 1].map(rating => (
              <label key={rating} className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="rating"
                  value={rating}
                  checked={filters.rating === rating}
                  onChange={(e) => updateFilter('rating', parseInt(e.target.value))}
                  className="mr-3"
                />
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map(star => (
                    <svg
                      key={star}
                      className={`w-4 h-4 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="ml-2 text-sm text-muted-foreground">& up</span>
                </div>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Other Options */}
        <FilterSection 
          title="Other Options" 
          section="other" 
          count={(filters.inStock ? 1 : 0) + (filters.onSale ? 1 : 0)}
        >
          <div className="space-y-3">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={filters.inStock}
                onChange={(e) => updateFilter('inStock', e.target.checked)}
                className="mr-3"
              />
              <span className="text-foreground">In Stock Only</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={filters.onSale}
                onChange={(e) => updateFilter('onSale', e.target.checked)}
                className="mr-3"
              />
              <span className="text-foreground">On Sale</span>
            </label>
          </div>
        </FilterSection>
      </div>
    </div>
  );
};

export default SearchFilters;