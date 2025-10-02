import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useComparison } from '../context/ComparisonContext';
import { useCart } from '../context/CartContext';
import { useReviews } from '../context/ReviewsContext';
import StarRating from '../components/StarRating';

const ComparePage = () => {
  const { items, removeFromComparison, clearComparison, getComparisonCount, reorderComparison } = useComparison();
  const { addItem } = useCart();
  const { getProductRating } = useReviews();
  const navigate = useNavigate();
  const count = getComparisonCount();

  if (count === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="bg-white rounded-lg shadow-sm p-12">
            <svg className="w-24 h-24 mx-auto text-gray-300 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <h2 className="text-2xl font-light text-gray-900 mb-4">No Products to Compare</h2>
            <p className="text-gray-600 mb-8">
              Add products to your comparison list to see them side by side and find the perfect match for your needs.
            </p>
            <Link
              to="/products"
              className="btn-primary inline-flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span>Browse Products</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleAddToCart = (product) => {
    addItem({
      id: product.id,
      name: product.name || 'Unnamed Product',
      price: product.price || 0,
      image: product.image || '/images/placeholder-product.png',
      size: product.sizes?.[0] || 'One Size',
      color: product.colors?.[0] || 'Default',
      quantity: 1
    });
  };

  const getProductRatingData = (productId) => {
    try {
      const rating = getProductRating(productId);
      return {
        average: rating?.averageRating || 0,
        count: rating?.totalReviews || 0
      };
    } catch (error) {
      return { average: 0, count: 0 };
    }
  };

  // Get all unique attributes for comparison
  const getComparisonAttributes = () => {
    const attributes = {
      basic: ['name', 'price', 'originalPrice', 'category', 'brand'],
      features: ['colors', 'sizes', 'rating', 'tags'],
      specs: ['material', 'weight', 'dimensions', 'warranty']
    };
    return attributes;
  };

  const attributes = getComparisonAttributes();

  const formatValue = (value, key) => {
    if (value === null || value === undefined) return '-';
    
    switch (key) {
      case 'price':
      case 'originalPrice':
        return `$${value}`;
      case 'colors':
      case 'sizes':
      case 'tags':
        return Array.isArray(value) ? value.join(', ') : value;
      case 'rating':
        if (typeof value === 'object' && value.average) {
          return `${value.average}/5 (${value.count || 0} reviews)`;
        }
        return value;
      default:
        return value;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-light text-gray-900 mb-2">Product Comparison</h1>
              <p className="text-gray-600">Compare {count} product{count > 1 ? 's' : ''} side by side</p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={clearComparison}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Clear All
              </button>
              <button
                onClick={() => navigate('/products')}
                className="btn-primary"
              >
                Add More Products
              </button>
            </div>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              {/* Product Images and Basic Info */}
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-4 font-medium text-gray-900 min-w-[200px]">Product</th>
                  {items.map((product, index) => (
                    <th key={product.id} className="p-4 min-w-[250px]">
                      <div className="text-center">
                        <div className="relative inline-block">
                          <Link to={`/products/${product.id}`}>
                            <img
                              src={product.image || '/images/placeholder-product.png'}
                              alt={product.name || 'Product'}
                              className="w-32 h-32 object-cover rounded-lg mx-auto mb-4 hover:opacity-75 transition-opacity"
                              onError={(e) => {
                                e.target.src = '/images/placeholder-product.png';
                              }}
                            />
                          </Link>
                          <button
                            onClick={() => removeFromComparison(product.id)}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm hover:bg-red-600 transition-colors"
                            title="Remove from comparison"
                          >
                            ×
                          </button>
                        </div>
                        <Link to={`/products/${product.id}`}>
                          <h3 className="font-medium text-gray-900 hover:text-blue-600 transition-colors">
                            {product.name || 'Unnamed Product'}
                          </h3>
                        </Link>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              
              <tbody className="divide-y divide-gray-200">
                {/* Price Comparison */}
                <tr>
                  <td className="p-4 font-medium text-gray-900 bg-gray-50">Price</td>
                  {items.map((product) => (
                    <td key={product.id} className="p-4 text-center">
                      <div className="space-y-1">
                        <div className="text-2xl font-bold text-gray-900">
                          ${product.price || 0}
                        </div>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <div className="text-sm text-gray-500 line-through">
                            ${product.originalPrice}
                          </div>
                        )}
                        {product.originalPrice && product.originalPrice > product.price && (
                          <div className="text-sm text-green-600 font-medium">
                            Save ${(product.originalPrice - product.price).toFixed(2)}
                          </div>
                        )}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Rating Comparison */}
                <tr className="bg-gray-50">
                  <td className="p-4 font-medium text-gray-900">Rating</td>
                  {items.map((product) => {
                    const ratingData = getProductRatingData(product.id);
                    return (
                      <td key={product.id} className="p-4 text-center">
                        <div className="flex flex-col items-center space-y-1">
                          <StarRating rating={ratingData.average} size="sm" />
                          <span className="text-sm text-gray-600">
                            {ratingData.average}/5 ({ratingData.count} reviews)
                          </span>
                        </div>
                      </td>
                    );
                  })}
                </tr>

                {/* Category */}
                <tr>
                  <td className="p-4 font-medium text-gray-900">Category</td>
                  {items.map((product) => (
                    <td key={product.id} className="p-4 text-center capitalize">
                      {product.category || '-'}
                    </td>
                  ))}
                </tr>

                {/* Brand */}
                <tr className="bg-gray-50">
                  <td className="p-4 font-medium text-gray-900">Brand</td>
                  {items.map((product) => (
                    <td key={product.id} className="p-4 text-center">
                      {product.brand || '-'}
                    </td>
                  ))}
                </tr>

                {/* Available Colors */}
                <tr>
                  <td className="p-4 font-medium text-gray-900">Available Colors</td>
                  {items.map((product) => (
                    <td key={product.id} className="p-4 text-center">
                      {product.colors && product.colors.length > 0 ? (
                        <div className="flex justify-center space-x-1">
                          {product.colors.slice(0, 5).map((color, index) => (
                            <div
                              key={index}
                              className="w-6 h-6 rounded-full border border-gray-300"
                              style={{ backgroundColor: color }}
                              title={color}
                            />
                          ))}
                          {product.colors.length > 5 && (
                            <span className="text-sm text-gray-500">+{product.colors.length - 5}</span>
                          )}
                        </div>
                      ) : (
                        '-'
                      )}
                    </td>
                  ))}
                </tr>

                {/* Available Sizes */}
                <tr className="bg-gray-50">
                  <td className="p-4 font-medium text-gray-900">Available Sizes</td>
                  {items.map((product) => (
                    <td key={product.id} className="p-4 text-center">
                      {product.sizes && product.sizes.length > 0 ? product.sizes.join(', ') : '-'}
                    </td>
                  ))}
                </tr>

                {/* Stock Status */}
                <tr>
                  <td className="p-4 font-medium text-gray-900">Availability</td>
                  {items.map((product) => (
                    <td key={product.id} className="p-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        product.inStock 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </td>
                  ))}
                </tr>

                {/* Actions Row */}
                <tr className="bg-gray-50">
                  <td className="p-4 font-medium text-gray-900">Actions</td>
                  {items.map((product) => (
                    <td key={product.id} className="p-4 text-center">
                      <div className="space-y-2">
                        <button
                          onClick={() => handleAddToCart(product)}
                          className="w-full btn-primary text-sm py-2"
                          disabled={!product.inStock}
                        >
                          {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                        </button>
                        <Link
                          to={`/products/${product.id}`}
                          className="w-full block text-center py-2 px-4 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          View Details
                        </Link>
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Comparison Tips */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-blue-900 mb-2">Comparison Tips</h3>
          <ul className="text-blue-800 space-y-1 text-sm">
            <li>• Click on product images or names to view detailed product pages</li>
            <li>• Remove products from comparison by clicking the × button on product images</li>
            <li>• You can compare up to 4 products at once</li>
            <li>• Use filters and search to find similar products to compare</li>
            <li>• Consider price, ratings, and features when making your decision</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ComparePage;