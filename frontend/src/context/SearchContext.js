import React, { createContext, useContext, useState, useEffect } from 'react';
import localProductService from '../services/localProductService';

const SearchContext = createContext();

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};

export const SearchProvider = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchSuggestions, setSuggestions] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    priceRange: [0, 1000],
    brand: '',
    size: '',
    color: '',
    rating: 0,
    inStock: false,
    onSale: false
  });
  const [sortBy, setSortBy] = useState('relevance');
  const [showFilters, setShowFilters] = useState(false);

  // Available filter options
  const [filterOptions, setFilterOptions] = useState({
    categories: [],
    brands: [],
    sizes: [],
    colors: [],
    priceRanges: [
      { label: 'Under $25', min: 0, max: 25 },
      { label: '$25 - $50', min: 25, max: 50 },
      { label: '$50 - $100', min: 50, max: 100 },
      { label: '$100 - $200', min: 100, max: 200 },
      { label: 'Over $200', min: 200, max: 1000 }
    ]
  });

  // Sort options
  const sortOptions = [
    { value: 'relevance', label: 'Best Match' },
    { value: 'price_low', label: 'Price: Low to High' },
    { value: 'price_high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Customer Rating' },
    { value: 'newest', label: 'Newest First' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'name_asc', label: 'Name: A to Z' },
    { value: 'name_desc', label: 'Name: Z to A' }
  ];

  // Load recent searches from localStorage
  useEffect(() => {
    const savedSearches = localStorage.getItem('recentSearches');
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
  }, []);

  // Load filter options from products
  useEffect(() => {
    const loadFilterOptions = async () => {
      try {
        const products = await localProductService.getAllProducts();
        
        const categories = [...new Set(products.map(p => p.category))];
        const brands = [...new Set(products.map(p => p.brand).filter(Boolean))];
        const sizes = [...new Set(products.flatMap(p => p.sizes || []))];
        const colors = [...new Set(products.flatMap(p => p.colors || []))];

        setFilterOptions(prev => ({
          ...prev,
          categories,
          brands,
          sizes,
          colors
        }));
      } catch (error) {
        console.error('Error loading filter options:', error);
      }
    };

    loadFilterOptions();
    
    // Load all products initially
    const loadInitialProducts = async () => {
      try {
        const products = await localProductService.getAllProducts();
        if (Array.isArray(products)) {
          setSearchResults(products);
        }
      } catch (error) {
        console.error('Error loading initial products:', error);
        setSearchResults([]);
      }
    };
    
    loadInitialProducts();
  }, []);

  // Perform search with debouncing
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      performSearch(searchQuery || '');
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, filters, sortBy]);

  // Generate search suggestions
  useEffect(() => {
    const generateSuggestions = async () => {
      if (!searchQuery || searchQuery.length < 2) {
        setSuggestions([]);
        return;
      }

      try {
        const products = await localProductService.getAllProducts();
        
        if (!Array.isArray(products)) {
          console.warn('generateSuggestions: products is not an array:', products);
          setSuggestions([]);
          return;
        }

        const suggestions = [];
        const searchLower = searchQuery.toLowerCase().trim();

        // Product name suggestions with null checks
        products.forEach(product => {
          try {
            if (product?.name && typeof product.name === 'string') {
              if (product.name.toLowerCase().includes(searchLower)) {
                suggestions.push({
                  type: 'product',
                  text: product.name,
                  category: product.category || 'uncategorized',
                  id: product.id
                });
              }
            }
          } catch (error) {
            console.warn('Error processing product suggestion:', product, error);
          }
        });

        // Category suggestions with null checks
        if (Array.isArray(filterOptions.categories)) {
          filterOptions.categories.forEach(category => {
            try {
              if (category && typeof category === 'string') {
                if (category.toLowerCase().includes(searchLower)) {
                  suggestions.push({
                    type: 'category',
                    text: category,
                    category: category
                  });
                }
              }
            } catch (error) {
              console.warn('Error processing category suggestion:', category, error);
            }
          });
        }

        // Brand suggestions with null checks
        if (Array.isArray(filterOptions.brands)) {
          filterOptions.brands.forEach(brand => {
            try {
              if (brand && typeof brand === 'string') {
                if (brand.toLowerCase().includes(searchLower)) {
                  suggestions.push({
                    type: 'brand',
                    text: brand,
                    category: 'brand'
                  });
                }
              }
            } catch (error) {
              console.warn('Error processing brand suggestion:', brand, error);
            }
          });
        }

        setSuggestions(suggestions.slice(0, 8));
      } catch (error) {
        console.error('Error generating suggestions:', error);
        setSuggestions([]);
      }
    };

    const debounceTimer = setTimeout(generateSuggestions, 200);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery, filterOptions]);

  const performSearch = async (query) => {
    setIsSearching(true);
    
    try {
      const products = await localProductService.getAllProducts();
      
      // Validate products array
      if (!Array.isArray(products)) {
        console.warn('Products is not an array:', products);
        setSearchResults([]);
        return;
      }

      let results = [...products]; // Create a copy to avoid mutations

      // Text search with better error handling
      if (query && query.trim()) {
        const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0);
        
        results = results.filter(product => {
          try {
            // Safely build searchable text with null checks
            const name = product?.name || '';
            const description = product?.description || '';
            const category = product?.category || '';
            const brand = product?.brand || '';
            const tags = Array.isArray(product?.tags) ? product.tags.join(' ') : '';
            
            const searchableText = `${name} ${description} ${category} ${brand} ${tags}`.toLowerCase();
            return searchTerms.every(term => searchableText.includes(term));
          } catch (filterError) {
            console.warn('Error filtering product:', product, filterError);
            return false;
          }
        });
      }

      // Apply filters with null checks
      if (filters.category) {
        results = results.filter(p => p?.category === filters.category);
      }

      if (filters.brand) {
        results = results.filter(p => p?.brand === filters.brand);
      }

      if (filters.size) {
        results = results.filter(p => Array.isArray(p?.sizes) && p.sizes.includes(filters.size));
      }

      if (filters.color) {
        results = results.filter(p => Array.isArray(p?.colors) && p.colors.includes(filters.color));
      }

      if (filters.rating > 0) {
        results = results.filter(p => p?.rating?.average && p.rating.average >= filters.rating);
      }

      if (filters.inStock) {
        results = results.filter(p => p?.inStock === true);
      }

      if (filters.onSale) {
        results = results.filter(p => p?.originalPrice && p?.price && p.originalPrice > p.price);
      }

      // Price range filter with null checks
      if (Array.isArray(filters.priceRange) && filters.priceRange.length === 2) {
        results = results.filter(p => {
          const price = parseFloat(p?.price);
          return !isNaN(price) && 
                 price >= filters.priceRange[0] && 
                 price <= filters.priceRange[1];
        });
      }

      // Apply sorting
      results = sortResults(results, sortBy);

      setSearchResults(results || []);

      // Save search to recent searches
      if (query && query.trim()) {
        saveRecentSearch(query.trim());
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const sortResults = (results, sortType) => {
    if (!Array.isArray(results)) {
      console.warn('sortResults received invalid results:', results);
      return [];
    }

    const sortedResults = [...results];

    try {
      switch (sortType) {
        case 'price_low':
          return sortedResults.sort((a, b) => {
            const priceA = parseFloat(a?.price) || 0;
            const priceB = parseFloat(b?.price) || 0;
            return priceA - priceB;
          });
        case 'price_high':
          return sortedResults.sort((a, b) => {
            const priceA = parseFloat(a?.price) || 0;
            const priceB = parseFloat(b?.price) || 0;
            return priceB - priceA;
          });
        case 'rating':
          return sortedResults.sort((a, b) => {
            const ratingA = a?.rating?.average || 0;
            const ratingB = b?.rating?.average || 0;
            return ratingB - ratingA;
          });
        case 'newest':
          return sortedResults.sort((a, b) => {
            const dateA = new Date(a?.createdAt || 0);
            const dateB = new Date(b?.createdAt || 0);
            return dateB - dateA;
          });
        case 'popular':
          return sortedResults.sort((a, b) => {
            const countA = a?.rating?.count || 0;
            const countB = b?.rating?.count || 0;
            return countB - countA;
          });
        case 'name_asc':
          return sortedResults.sort((a, b) => {
            const nameA = (a?.name || '').toLowerCase();
            const nameB = (b?.name || '').toLowerCase();
            return nameA.localeCompare(nameB);
          });
        case 'name_desc':
          return sortedResults.sort((a, b) => {
            const nameA = (a?.name || '').toLowerCase();
            const nameB = (b?.name || '').toLowerCase();
            return nameB.localeCompare(nameA);
          });
        default:
          return sortedResults; // relevance (default order)
      }
    } catch (sortError) {
      console.error('Error sorting results:', sortError);
      return results;
    }
  };

  const saveRecentSearch = (query) => {
    try {
      if (!query || typeof query !== 'string' || query.trim().length === 0) {
        return;
      }
      
      const trimmedQuery = query.trim();
      const currentSearches = Array.isArray(recentSearches) ? recentSearches : [];
      const updated = [trimmedQuery, ...currentSearches.filter(s => s !== trimmedQuery)].slice(0, 10);
      
      setRecentSearches(updated);
      localStorage.setItem('recentSearches', JSON.stringify(updated));
    } catch (error) {
      console.error('Error saving recent search:', error);
    }
  };

  const clearRecentSearches = () => {
    try {
      setRecentSearches([]);
      localStorage.removeItem('recentSearches');
    } catch (error) {
      console.error('Error clearing recent searches:', error);
    }
  };

  const updateFilter = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      priceRange: [0, 1000],
      brand: '',
      size: '',
      color: '',
      rating: 0,
      inStock: false,
      onSale: false
    });
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setSuggestions([]);
    clearFilters();
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.category) count++;
    if (filters.brand) count++;
    if (filters.size) count++;
    if (filters.color) count++;
    if (filters.rating > 0) count++;
    if (filters.inStock) count++;
    if (filters.onSale) count++;
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000) count++;
    return count;
  };

  const value = {
    // Search state
    searchQuery,
    setSearchQuery,
    searchResults,
    searchSuggestions,
    recentSearches,
    isSearching,
    
    // Filters
    filters,
    updateFilter,
    clearFilters,
    showFilters,
    setShowFilters,
    filterOptions,
    getActiveFiltersCount,
    
    // Sorting
    sortBy,
    setSortBy,
    sortOptions,
    
    // Actions
    performSearch,
    clearSearch,
    clearRecentSearches,
    saveRecentSearch
  };

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
};