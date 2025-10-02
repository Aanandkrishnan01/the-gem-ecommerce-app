import React from 'react';
import { Link } from 'react-router-dom';
import { useComparison } from '../context/ComparisonContext';

const ComparisonBar = () => {
  const { items, getComparisonCount, removeFromComparison, clearComparison } = useComparison();
  const count = getComparisonCount();

  if (count === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-blue-500 shadow-lg z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left side - Product thumbnails and count */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-8 h-8 bg-blue-500 text-white rounded-full text-sm font-semibold">
                {count}
              </div>
              <span className="font-medium text-gray-900">
                Product{count > 1 ? 's' : ''} to Compare
              </span>
            </div>
            
            {/* Product thumbnails */}
            <div className="flex space-x-2">
              {items.map((product, index) => (
                <div key={product.id} className="relative group">
                  <img
                    src={product.image || '/images/placeholder-product.png'}
                    alt={product.name || 'Product'}
                    className="w-12 h-12 object-cover rounded-md border border-gray-200"
                    onError={(e) => {
                      e.target.src = '/images/placeholder-product.png';
                    }}
                  />
                  <button
                    onClick={() => removeFromComparison(product.id)}
                    className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                    title="Remove from comparison"
                  >
                    ×
                  </button>
                  
                  {/* Tooltip with product name */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    {product.name}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right side - Action buttons */}
          <div className="flex items-center space-x-3">
            <button
              onClick={clearComparison}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Clear All
            </button>
            
            <Link
              to="/compare"
              className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors font-medium flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span>Compare ({count})</span>
            </Link>
          </div>
        </div>
        
        {/* Progress indicator */}
        <div className="mt-2">
          <div className="flex space-x-1">
            {[1, 2, 3, 4].map((slot) => (
              <div
                key={slot}
                className={`flex-1 h-1 rounded-full ${
                  slot <= count ? 'bg-blue-500' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-1 text-center">
            {count < 4 ? `Add ${4 - count} more products to compare` : 'Maximum 4 products selected'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ComparisonBar;