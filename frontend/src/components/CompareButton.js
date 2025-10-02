import React, { useState } from 'react';
import { useComparison } from '../context/ComparisonContext';
import './CompareButton.css'; // We'll create this file

const CompareButton = ({ product, className = '', size = 'normal', showText = true }) => {
  const { addToComparison, removeFromComparison, isInComparison, canAddToComparison, getComparisonCount } = useComparison();
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Safety check for product prop
  if (!product || !product.id) {
    console.warn('CompareButton: Invalid product prop:', product);
    return null;
  }
  
  const inComparison = isInComparison(product.id);
  const canAdd = canAddToComparison();
  const comparisonCount = getComparisonCount();

  const handleToggleComparison = (e) => {
    e.preventDefault();
    e.stopPropagation();

    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);

    if (inComparison) {
      removeFromComparison(product.id);
    } else if (canAdd || comparisonCount === 0) {
      const wasAdded = addToComparison(product);
      if (!wasAdded && comparisonCount >= 4) {
        // Show a brief message that oldest item was replaced
        // Could show a toast notification here instead
      }
    }
  };

  const buttonSizes = {
    small: 'p-1',
    normal: 'p-2',
    large: 'p-3'
  };

  const iconSizes = {
    small: 'w-3 h-3',
    normal: 'w-4 h-4',
    large: 'w-5 h-5'
  };

  const textSizes = {
    small: 'text-xs',
    normal: 'text-sm',
    large: 'text-base'
  };

  const getButtonStyle = () => {
    if (inComparison) {
      return 'bg-blue-500 text-white border-blue-500 hover:bg-blue-600';
    } else if (!canAdd && comparisonCount >= 4) {
      return 'bg-orange-500 text-white border-orange-500 hover:bg-orange-600';
    } else {
      return 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400';
    }
  };

  const getTooltipText = () => {
    if (inComparison) {
      return 'Remove from comparison';
    } else if (!canAdd && comparisonCount >= 4) {
      return 'Replace oldest item in comparison';
    } else {
      return `Add to comparison (${comparisonCount}/4)`;
    }
  };

  const CompareIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2} 
        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" 
      />
    </svg>
  );

  return (
    <div className="compare-button-container">
      <button
        onClick={handleToggleComparison}
        className={`
          ${buttonSizes[size]} 
          ${getButtonStyle()}
          border rounded-lg transition-all duration-200 
          flex items-center space-x-2
          ${isAnimating ? 'scale-95' : 'scale-100'}
          ${className}
          relative
        `}
        title={getTooltipText()}
      >
        <CompareIcon className={iconSizes[size]} />
        {showText && (
          <span className={`${textSizes[size]} font-medium`}>
            {inComparison ? 'Remove' : 'Compare'}
          </span>
        )}
        
        {/* Comparison count badge */}
        {comparisonCount > 0 && !inComparison && (
          <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {comparisonCount}
          </span>
        )}
        
        {/* Tooltip */}
        <div className="compare-tooltip absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded transition-opacity whitespace-nowrap pointer-events-none z-10">
          {getTooltipText()}
        </div>
      </button>
    </div>
  );
};

export default CompareButton;