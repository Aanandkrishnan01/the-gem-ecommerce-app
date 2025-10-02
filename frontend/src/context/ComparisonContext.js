import React, { createContext, useContext, useReducer, useEffect } from 'react';

const ComparisonContext = createContext();

const comparisonReducer = (state, action) => {
  switch (action.type) {
    case 'LOAD_COMPARISON':
      return {
        ...state,
        items: action.payload,
        loading: false
      };

    case 'ADD_TO_COMPARISON':
      const newItem = action.payload;
      const existingItem = state.items.find(item => item.id === newItem.id);
      
      if (existingItem) {
        return state; // Item already in comparison
      }

      // Limit to maximum 4 products for comparison
      let updatedItems;
      if (state.items.length >= 4) {
        // Replace the oldest item (first in array)
        updatedItems = [...state.items.slice(1), { ...newItem, addedAt: new Date().toISOString() }];
      } else {
        updatedItems = [...state.items, { ...newItem, addedAt: new Date().toISOString() }];
      }
      
      localStorage.setItem('comparison', JSON.stringify(updatedItems));
      
      return {
        ...state,
        items: updatedItems
      };

    case 'REMOVE_FROM_COMPARISON':
      const filteredItems = state.items.filter(item => item.id !== action.payload);
      localStorage.setItem('comparison', JSON.stringify(filteredItems));
      
      return {
        ...state,
        items: filteredItems
      };

    case 'CLEAR_COMPARISON':
      localStorage.removeItem('comparison');
      return {
        ...state,
        items: []
      };

    case 'REORDER_COMPARISON':
      const { fromIndex, toIndex } = action.payload;
      const reorderedItems = [...state.items];
      const [movedItem] = reorderedItems.splice(fromIndex, 1);
      reorderedItems.splice(toIndex, 0, movedItem);
      
      localStorage.setItem('comparison', JSON.stringify(reorderedItems));
      
      return {
        ...state,
        items: reorderedItems
      };

    default:
      return state;
  }
};

const initialState = {
  items: [],
  loading: true
};

export const ComparisonProvider = ({ children }) => {
  const [state, dispatch] = useReducer(comparisonReducer, initialState);

  // Load comparison from localStorage on app start
  useEffect(() => {
    const savedComparison = localStorage.getItem('comparison');
    if (savedComparison) {
      try {
        const parsedComparison = JSON.parse(savedComparison);
        dispatch({ type: 'LOAD_COMPARISON', payload: parsedComparison });
      } catch (error) {
        console.error('Error loading comparison:', error);
        dispatch({ type: 'LOAD_COMPARISON', payload: [] });
      }
    } else {
      dispatch({ type: 'LOAD_COMPARISON', payload: [] });
    }
  }, []);

  const addToComparison = (product) => {
    if (!product || !product.id) {
      console.warn('ComparisonContext: Cannot add invalid product to comparison:', product);
      return false;
    }
    
    const wasAdded = state.items.length < 4 || !state.items.find(item => item.id === product.id);
    dispatch({ type: 'ADD_TO_COMPARISON', payload: product });
    return wasAdded;
  };

  const removeFromComparison = (productId) => {
    if (!productId) {
      console.warn('ComparisonContext: Cannot remove product without ID:', productId);
      return;
    }
    dispatch({ type: 'REMOVE_FROM_COMPARISON', payload: productId });
  };

  const clearComparison = () => {
    dispatch({ type: 'CLEAR_COMPARISON' });
  };

  const reorderComparison = (fromIndex, toIndex) => {
    if (fromIndex < 0 || toIndex < 0 || fromIndex >= state.items.length || toIndex >= state.items.length) {
      return;
    }
    dispatch({ type: 'REORDER_COMPARISON', payload: { fromIndex, toIndex } });
  };

  const isInComparison = (productId) => {
    if (!productId) {
      return false;
    }
    return state.items.some(item => item.id === productId);
  };

  const getComparisonCount = () => {
    return state.items.length;
  };

  const canAddToComparison = () => {
    return state.items.length < 4;
  };

  const getComparisonCategories = () => {
    const categories = new Set();
    state.items.forEach(item => {
      if (item.category) {
        categories.add(item.category);
      }
    });
    return Array.from(categories);
  };

  const value = {
    items: state.items,
    loading: state.loading,
    addToComparison,
    removeFromComparison,
    clearComparison,
    reorderComparison,
    isInComparison,
    getComparisonCount,
    canAddToComparison,
    getComparisonCategories
  };

  return (
    <ComparisonContext.Provider value={value}>
      {children}
    </ComparisonContext.Provider>
  );
};

export const useComparison = () => {
  const context = useContext(ComparisonContext);
  if (context === undefined) {
    throw new Error('useComparison must be used within a ComparisonProvider');
  }
  return context;
};

export default ComparisonContext;