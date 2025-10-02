import React, { createContext, useContext, useReducer, useEffect } from 'react';

const WishlistContext = createContext();

const wishlistReducer = (state, action) => {
  switch (action.type) {
    case 'LOAD_WISHLIST':
      return {
        ...state,
        items: action.payload,
        loading: false
      };

    case 'ADD_TO_WISHLIST':
      const newItem = action.payload;
      const existingItem = state.items.find(item => item.id === newItem.id);
      
      if (existingItem) {
        return state; // Item already in wishlist
      }
      
      const updatedItems = [...state.items, { ...newItem, addedAt: new Date().toISOString() }];
      localStorage.setItem('wishlist', JSON.stringify(updatedItems));
      
      return {
        ...state,
        items: updatedItems
      };

    case 'REMOVE_FROM_WISHLIST':
      const filteredItems = state.items.filter(item => item.id !== action.payload);
      localStorage.setItem('wishlist', JSON.stringify(filteredItems));
      
      return {
        ...state,
        items: filteredItems
      };

    case 'CLEAR_WISHLIST':
      localStorage.removeItem('wishlist');
      return {
        ...state,
        items: []
      };

    case 'MOVE_TO_CART':
      // This will be handled by the cart context, we just remove from wishlist
      const remainingItems = state.items.filter(item => item.id !== action.payload);
      localStorage.setItem('wishlist', JSON.stringify(remainingItems));
      
      return {
        ...state,
        items: remainingItems
      };

    default:
      return state;
  }
};

const initialState = {
  items: [],
  loading: true
};

export const WishlistProvider = ({ children }) => {
  const [state, dispatch] = useReducer(wishlistReducer, initialState);

  // Load wishlist from localStorage on app start
  useEffect(() => {
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      try {
        const parsedWishlist = JSON.parse(savedWishlist);
        dispatch({ type: 'LOAD_WISHLIST', payload: parsedWishlist });
      } catch (error) {
        console.error('Error loading wishlist:', error);
        dispatch({ type: 'LOAD_WISHLIST', payload: [] });
      }
    } else {
      dispatch({ type: 'LOAD_WISHLIST', payload: [] });
    }
  }, []);

  const addToWishlist = (product) => {
    if (!product || !product.id) {
      console.warn('WishlistContext: Cannot add invalid product to wishlist:', product);
      return;
    }
    dispatch({ type: 'ADD_TO_WISHLIST', payload: product });
  };

  const removeFromWishlist = (productId) => {
    if (!productId) {
      console.warn('WishlistContext: Cannot remove product without ID:', productId);
      return;
    }
    dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: productId });
  };

  const clearWishlist = () => {
    dispatch({ type: 'CLEAR_WISHLIST' });
  };

  const moveToCart = (productId, addToCartFunction) => {
    const item = state.items.find(item => item.id === productId);
    if (item && addToCartFunction) {
      addToCartFunction(item);
      dispatch({ type: 'MOVE_TO_CART', payload: productId });
    }
  };

  const isInWishlist = (productId) => {
    if (!productId) {
      return false;
    }
    return state.items.some(item => item.id === productId);
  };

  const getWishlistCount = () => {
    return state.items.length;
  };

  const value = {
    items: state.items,
    loading: state.loading,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    moveToCart,
    isInWishlist,
    getWishlistCount
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export default WishlistContext;