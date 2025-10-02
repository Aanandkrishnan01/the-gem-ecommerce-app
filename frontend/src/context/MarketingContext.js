import React, { createContext, useContext, useReducer, useEffect } from 'react';

const MarketingContext = createContext();

const marketingReducer = (state, action) => {
  switch (action.type) {
    case 'LOAD_MARKETING_DATA':
      return {
        ...state,
        ...action.payload,
        loading: false
      };

    case 'SUBSCRIBE_NEWSLETTER':
      const subscription = {
        email: action.payload.email,
        preferences: action.payload.preferences,
        subscribedAt: new Date().toISOString(),
        status: 'active',
        id: Date.now().toString()
      };
      
      const updatedSubscriptions = [...state.subscriptions, subscription];
      localStorage.setItem('newsletter_subscriptions', JSON.stringify(updatedSubscriptions));
      
      return {
        ...state,
        subscriptions: updatedSubscriptions,
        userSubscription: subscription
      };

    case 'UNSUBSCRIBE_NEWSLETTER':
      const filteredSubscriptions = state.subscriptions.filter(sub => sub.id !== action.payload);
      localStorage.setItem('newsletter_subscriptions', JSON.stringify(filteredSubscriptions));
      
      return {
        ...state,
        subscriptions: filteredSubscriptions,
        userSubscription: null
      };

    case 'UPDATE_PREFERENCES':
      const updatedSubs = state.subscriptions.map(sub => 
        sub.id === action.payload.id 
          ? { ...sub, preferences: action.payload.preferences, updatedAt: new Date().toISOString() }
          : sub
      );
      localStorage.setItem('newsletter_subscriptions', JSON.stringify(updatedSubs));
      
      const updatedUserSub = updatedSubs.find(sub => sub.id === action.payload.id);
      
      return {
        ...state,
        subscriptions: updatedSubs,
        userSubscription: updatedUserSub || state.userSubscription
      };

    case 'DISMISS_BANNER':
      const dismissedBanners = [...state.dismissedBanners, action.payload];
      localStorage.setItem('dismissed_banners', JSON.stringify(dismissedBanners));
      
      return {
        ...state,
        dismissedBanners
      };

    case 'ADD_CAMPAIGN':
      const campaigns = [...state.campaigns, action.payload];
      localStorage.setItem('marketing_campaigns', JSON.stringify(campaigns));
      
      return {
        ...state,
        campaigns
      };

    case 'TRACK_INTERACTION':
      const interactions = [...state.interactions, {
        ...action.payload,
        timestamp: new Date().toISOString(),
        id: Date.now().toString()
      }];
      
      // Keep only last 100 interactions to prevent localStorage bloat
      const recentInteractions = interactions.slice(-100);
      localStorage.setItem('marketing_interactions', JSON.stringify(recentInteractions));
      
      return {
        ...state,
        interactions: recentInteractions
      };

    default:
      return state;
  }
};

const initialState = {
  subscriptions: [],
  userSubscription: null,
  dismissedBanners: [],
  campaigns: [],
  interactions: [],
  preferences: {
    categories: ['new-arrivals', 'sales', 'seasonal'],
    frequency: 'weekly', // daily, weekly, monthly
    format: 'html' // html, text
  },
  loading: true
};

export const MarketingProvider = ({ children }) => {
  const [state, dispatch] = useReducer(marketingReducer, initialState);

  // Load marketing data from localStorage on app start
  useEffect(() => {
    try {
      const subscriptions = JSON.parse(localStorage.getItem('newsletter_subscriptions') || '[]');
      const dismissedBanners = JSON.parse(localStorage.getItem('dismissed_banners') || '[]');
      const campaigns = JSON.parse(localStorage.getItem('marketing_campaigns') || '[]');
      const interactions = JSON.parse(localStorage.getItem('marketing_interactions') || '[]');
      
      // Find user's current subscription
      const userSubscription = subscriptions.find(sub => sub.status === 'active') || null;
      
      dispatch({
        type: 'LOAD_MARKETING_DATA',
        payload: {
          subscriptions,
          userSubscription,
          dismissedBanners,
          campaigns,
          interactions
        }
      });
    } catch (error) {
      console.error('Error loading marketing data:', error);
      dispatch({ type: 'LOAD_MARKETING_DATA', payload: {} });
    }
  }, []);

  const subscribeNewsletter = (email, preferences = state.preferences) => {
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      throw new Error('Valid email address is required');
    }

    // Check if already subscribed
    const existingSubscription = state.subscriptions.find(
      sub => sub.email === email && sub.status === 'active'
    );
    
    if (existingSubscription) {
      throw new Error('Email is already subscribed');
    }

    dispatch({
      type: 'SUBSCRIBE_NEWSLETTER',
      payload: { email, preferences }
    });

    // Track subscription interaction
    trackInteraction('newsletter_subscribe', { email, preferences });
    
    return true;
  };

  const unsubscribeNewsletter = (subscriptionId) => {
    if (!subscriptionId) {
      throw new Error('Subscription ID is required');
    }

    dispatch({ type: 'UNSUBSCRIBE_NEWSLETTER', payload: subscriptionId });
    trackInteraction('newsletter_unsubscribe', { subscriptionId });
  };

  const updatePreferences = (subscriptionId, preferences) => {
    if (!subscriptionId || !preferences) {
      throw new Error('Subscription ID and preferences are required');
    }

    dispatch({
      type: 'UPDATE_PREFERENCES',
      payload: { id: subscriptionId, preferences }
    });

    trackInteraction('preferences_update', { subscriptionId, preferences });
  };

  const dismissBanner = (bannerId) => {
    if (!bannerId) {
      return;
    }

    dispatch({ type: 'DISMISS_BANNER', payload: bannerId });
    trackInteraction('banner_dismiss', { bannerId });
  };

  const trackInteraction = (type, data = {}) => {
    dispatch({
      type: 'TRACK_INTERACTION',
      payload: { type, data }
    });
  };

  const isBannerDismissed = (bannerId) => {
    return state.dismissedBanners.includes(bannerId);
  };

  const isSubscribed = (email = null) => {
    if (email) {
      return state.subscriptions.some(sub => sub.email === email && sub.status === 'active');
    }
    return !!state.userSubscription;
  };

  const getActiveSubscription = () => {
    return state.userSubscription;
  };

  const getSubscriptionStats = () => {
    const total = state.subscriptions.length;
    const active = state.subscriptions.filter(sub => sub.status === 'active').length;
    const recent = state.subscriptions.filter(sub => {
      const subDate = new Date(sub.subscribedAt);
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      return subDate > weekAgo;
    }).length;

    return { total, active, recent };
  };

  const getPopularPreferences = () => {
    const preferenceCount = {};
    
    state.subscriptions.forEach(sub => {
      if (sub.preferences && sub.preferences.categories) {
        sub.preferences.categories.forEach(category => {
          preferenceCount[category] = (preferenceCount[category] || 0) + 1;
        });
      }
    });

    return Object.entries(preferenceCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([category, count]) => ({ category, count }));
  };

  const value = {
    // State
    subscriptions: state.subscriptions,
    userSubscription: state.userSubscription,
    dismissedBanners: state.dismissedBanners,
    campaigns: state.campaigns,
    interactions: state.interactions,
    preferences: state.preferences,
    loading: state.loading,

    // Actions
    subscribeNewsletter,
    unsubscribeNewsletter,
    updatePreferences,
    dismissBanner,
    trackInteraction,

    // Utilities
    isBannerDismissed,
    isSubscribed,
    getActiveSubscription,
    getSubscriptionStats,
    getPopularPreferences
  };

  return (
    <MarketingContext.Provider value={value}>
      {children}
    </MarketingContext.Provider>
  );
};

export const useMarketing = () => {
  const context = useContext(MarketingContext);
  if (context === undefined) {
    throw new Error('useMarketing must be used within a MarketingProvider');
  }
  return context;
};

export default MarketingContext;