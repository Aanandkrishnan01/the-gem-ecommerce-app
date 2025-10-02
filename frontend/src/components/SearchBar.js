import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSearch } from '../context/SearchContext';

const SearchBar = ({ className = '', placeholder = "Search products, brands, categories..." }) => {
  const {
    searchQuery,
    setSearchQuery,
    searchSuggestions,
    recentSearches,
    clearRecentSearches,
    isSearching,
    performSearch,
    updateFilter
  } = useSearch();
  
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState(-1);
  const searchRef = useRef(null);
  const suggestionsRef = useRef(null);
  const navigate = useNavigate();

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
        setSelectedSuggestion(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    const suggestions = searchQuery ? searchSuggestions : recentSearches.map(search => ({
      type: 'recent',
      text: search
    }));

    // Don't prevent default for regular typing keys (letters, numbers, backspace, etc.)
    if (e.key.length === 1 || e.key === 'Backspace' || e.key === 'Delete') {
      return; // Let the browser handle normal text input
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedSuggestion(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedSuggestion(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedSuggestion >= 0 && suggestions[selectedSuggestion]) {
          handleSuggestionClick(suggestions[selectedSuggestion]);
        } else if (searchQuery.trim()) {
          handleSearch(searchQuery);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setShowSuggestions(false);
        setSelectedSuggestion(-1);
        searchRef.current?.blur();
        break;
      default:
        break;
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);  // This updates the SearchContext
    setShowSuggestions(true);
    setSelectedSuggestion(-1);
  };

  const handleInputFocus = () => {
    setShowSuggestions(true);
  };

  const handleSearch = (query = searchQuery) => {
    setShowSuggestions(false);
    // Don't navigate - just update the search context
    if (query && query.trim()) {
      setSearchQuery(query.trim());
    }
  };

  const handleSuggestionClick = (suggestion) => {
    const query = suggestion.text;
    setSearchQuery(query);
    setShowSuggestions(false);
    setSelectedSuggestion(-1);
    
    if (suggestion.type === 'product') {
      navigate(`/products/${suggestion.id}`);
    } else if (suggestion.type === 'category') {
      // Update filter instead of navigating
      updateFilter('category', suggestion.category);
    } else if (suggestion.type === 'brand') {
      // Update filter instead of navigating
      updateFilter('brand', suggestion.text);
    } else {
      // Just update the search query, don't navigate
      setSearchQuery(query);
    }
  };

  const getSuggestionIcon = (type) => {
    switch (type) {
      case 'product':
        return (
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        );
      case 'category':
        return (
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        );
      case 'brand':
        return (
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
        );
      case 'recent':
        return (
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        );
    }
  };

  const suggestions = searchQuery ? searchSuggestions : recentSearches.map(search => ({
    type: 'recent',
    text: search
  }));

  const shouldShowSuggestions = showSuggestions && (suggestions.length > 0 || (!searchQuery && recentSearches.length > 0));

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoComplete="off"
          spellCheck="false"
          style={{ 
            color: '#111827',
            backgroundColor: '#ffffff',
            WebkitTextFillColor: '#111827',
            WebkitBoxShadow: '0 0 0 1000px white inset'
          }}
          className="w-full px-6 py-4 pl-14 pr-16 text-lg text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent placeholder-gray-500 focus:bg-white"
        />
        
        {/* Search Icon */}
        <div className="absolute left-5 top-1/2 transform -translate-y-1/2">
          {isSearching ? (
            <svg className="w-6 h-6 text-gray-400 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          ) : (
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          )}
        </div>

        {/* Clear Button */}
        {searchQuery && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setSearchQuery('');
              setShowSuggestions(false);
              setSelectedSuggestion(-1);
            }}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 z-10"
            title="Clear search"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {shouldShowSuggestions && (
        <div 
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-80 overflow-y-auto z-50"
        >
          {/* Recent Searches Header */}
          {!searchQuery && recentSearches.length > 0 && (
            <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100 bg-gray-50">
              <span className="text-sm font-medium text-gray-600">Recent Searches</span>
              <button
                onClick={clearRecentSearches}
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                Clear All
              </button>
            </div>
          )}

          {/* Suggestion Items */}
          {suggestions.map((suggestion, index) => (
            <button
              key={`${suggestion.type}-${suggestion.text}-${index}`}
              onClick={() => handleSuggestionClick(suggestion)}
              className={`w-full flex items-center px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                selectedSuggestion === index ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
              }`}
            >
              <span className="mr-3">
                {getSuggestionIcon(suggestion.type)}
              </span>
              <div className="flex-1">
                <div className="font-medium">
                  {suggestion.text}
                </div>
                {suggestion.category && suggestion.type !== 'category' && (
                  <div className="text-sm text-gray-500">
                    in {suggestion.category}
                  </div>
                )}
              </div>
              {suggestion.type === 'recent' && (
                <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                </svg>
              )}
            </button>
          ))}

          {/* No suggestions message */}
          {searchQuery && suggestions.length === 0 && (
            <div className="px-4 py-8 text-center text-gray-500">
              <svg className="w-8 h-8 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <p className="text-sm">No suggestions found</p>
              <p className="text-xs text-gray-400 mt-1">
                Press Enter to search for "{searchQuery}"
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;