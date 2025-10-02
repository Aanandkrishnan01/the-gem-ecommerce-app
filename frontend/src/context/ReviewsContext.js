import React, { createContext, useContext, useReducer, useEffect } from 'react';

const ReviewsContext = createContext();

const reviewsReducer = (state, action) => {
  switch (action.type) {
    case 'LOAD_REVIEWS':
      return {
        ...state,
        reviews: action.payload,
        loading: false
      };

    case 'ADD_REVIEW':
      const newReviews = [...state.reviews, action.payload];
      localStorage.setItem('productReviews', JSON.stringify(newReviews));
      return {
        ...state,
        reviews: newReviews
      };

    case 'UPDATE_REVIEW':
      const updatedReviews = state.reviews.map(review =>
        review.id === action.payload.id ? action.payload : review
      );
      localStorage.setItem('productReviews', JSON.stringify(updatedReviews));
      return {
        ...state,
        reviews: updatedReviews
      };

    case 'DELETE_REVIEW':
      const filteredReviews = state.reviews.filter(review => review.id !== action.payload);
      localStorage.setItem('productReviews', JSON.stringify(filteredReviews));
      return {
        ...state,
        reviews: filteredReviews
      };

    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };

    default:
      return state;
  }
};

const initialState = {
  reviews: [],
  loading: true
};

export const ReviewsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reviewsReducer, initialState);

  // Load reviews from localStorage on app start
  useEffect(() => {
    const savedReviews = localStorage.getItem('productReviews');
    if (savedReviews) {
      try {
        const parsedReviews = JSON.parse(savedReviews);
        dispatch({ type: 'LOAD_REVIEWS', payload: parsedReviews });
      } catch (error) {
        console.error('Error loading reviews:', error);
        dispatch({ type: 'LOAD_REVIEWS', payload: [] });
      }
    } else {
      // Initialize with sample reviews
      const sampleReviews = [
        {
          id: 1,
          productId: '1',
          userId: 'user1',
          userName: 'John Doe',
          rating: 5,
          title: 'Amazing quality!',
          comment: 'This product exceeded my expectations. Great quality and fast delivery.',
          date: new Date().toISOString(),
          verified: true,
          helpful: 12,
          notHelpful: 1
        },
        {
          id: 2,
          productId: '1',
          userId: 'user2',
          userName: 'Sarah Wilson',
          rating: 4,
          title: 'Good value for money',
          comment: 'Nice product overall. Good quality but took a while to arrive.',
          date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          verified: true,
          helpful: 8,
          notHelpful: 0
        }
      ];
      dispatch({ type: 'LOAD_REVIEWS', payload: sampleReviews });
      localStorage.setItem('productReviews', JSON.stringify(sampleReviews));
    }
  }, []);

  const addReview = (review) => {
    const newReview = {
      ...review,
      id: Date.now(),
      date: new Date().toISOString(),
      helpful: 0,
      notHelpful: 0
    };
    dispatch({ type: 'ADD_REVIEW', payload: newReview });
  };

  const updateReview = (reviewId, updates) => {
    const review = state.reviews.find(r => r.id === reviewId);
    if (review) {
      dispatch({ type: 'UPDATE_REVIEW', payload: { ...review, ...updates } });
    }
  };

  const deleteReview = (reviewId) => {
    dispatch({ type: 'DELETE_REVIEW', payload: reviewId });
  };

  const getProductReviews = (productId) => {
    return state.reviews.filter(review => review.productId === productId.toString());
  };

  const getProductRating = (productId) => {
    const productReviews = getProductReviews(productId);
    if (productReviews.length === 0) return { average: 0, count: 0 };
    
    const totalRating = productReviews.reduce((sum, review) => sum + review.rating, 0);
    const average = totalRating / productReviews.length;
    
    return {
      average: Math.round(average * 10) / 10,
      count: productReviews.length
    };
  };

  const markHelpful = (reviewId, isHelpful) => {
    const review = state.reviews.find(r => r.id === reviewId);
    if (review) {
      const updates = isHelpful 
        ? { helpful: review.helpful + 1 }
        : { notHelpful: review.notHelpful + 1 };
      updateReview(reviewId, updates);
    }
  };

  const value = {
    reviews: state.reviews,
    loading: state.loading,
    addReview,
    updateReview,
    deleteReview,
    getProductReviews,
    getProductRating,
    markHelpful
  };

  return (
    <ReviewsContext.Provider value={value}>
      {children}
    </ReviewsContext.Provider>
  );
};

export const useReviews = () => {
  const context = useContext(ReviewsContext);
  if (!context) {
    throw new Error('useReviews must be used within a ReviewsProvider');
  }
  return context;
};

export default ReviewsContext;