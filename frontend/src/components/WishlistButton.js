import React, { useState } from 'react';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import './WishlistButton.css'; // We'll create this file
import { useNavigate } from 'react-router-dom';

const WishlistButton = ({ product, className = '', size = 'normal', showTooltip = true }) => {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Safety check for product prop
  if (!product || !product.id) {
    console.warn('WishlistButton: Invalid product prop:', product);
    return null;
  }
  
  const inWishlist = isInWishlist(product.id);

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }

    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);

    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'small': return 'w-4 h-4';
      case 'large': return 'w-6 h-6';
      default: return 'w-5 h-5';
    }
  };

  const getButtonSize = () => {
    switch (size) {
      case 'small': return 'p-1.5';
      case 'large': return 'p-3';
      default: return 'p-2';
    }
  };

  return (
    <div className="wishlist-button-container">
      <button
        onClick={handleToggleWishlist}
        className={`
          ${getButtonSize()}
          ${className}
          ${inWishlist ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}
          ${isAnimating ? 'animate-pulse' : ''}
          transition-all duration-200 ease-in-out transform hover:scale-110
          bg-white/80 backdrop-blur-sm rounded-full shadow-md hover:shadow-lg
          relative
        `}
        title={
          showTooltip 
            ? inWishlist 
              ? 'Remove from wishlist' 
              : isAuthenticated 
                ? 'Add to wishlist' 
                : 'Sign in to add to wishlist'
            : ''
        }
      >
        <svg 
          className={`${getIconSize()} transition-transform duration-200 ${isAnimating ? 'scale-125' : ''}`}
          fill={inWishlist ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth={inWishlist ? 0 : 2}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
        
        {/* Tooltip */}
        {showTooltip && (
          <div className="wishlist-tooltip absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-black text-white text-xs rounded-md transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
            {inWishlist 
              ? 'Remove from wishlist' 
              : isAuthenticated 
                ? 'Add to wishlist' 
                : 'Sign in to add to wishlist'}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-black"></div>
          </div>
        )}
      </button>
    </div>
  );
};

export default WishlistButton;