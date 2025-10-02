import React, { useState, useEffect } from 'react';
import { useMarketing } from '../context/MarketingContext';

const PromotionalBanner = ({
  banner,
  position = 'top', // 'top', 'bottom', 'floating'
  autoHide = false,
  hideDelay = 5000,
  className = ''
}) => {
  const { dismissBanner, isBannerDismissed, trackInteraction } = useMarketing();
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Check if banner is already dismissed
    if (isBannerDismissed(banner.id)) {
      setIsVisible(false);
      return;
    }

    // Track banner impression
    trackInteraction('banner_impression', { bannerId: banner.id, position });

    // Auto-hide functionality
    if (autoHide && hideDelay > 0) {
      const timer = setTimeout(() => {
        handleDismiss(true);
      }, hideDelay);

      return () => clearTimeout(timer);
    }
  }, [banner.id, autoHide, hideDelay, isBannerDismissed, trackInteraction, position]);

  const handleDismiss = (isAutoHide = false) => {
    setIsAnimating(true);
    
    setTimeout(() => {
      setIsVisible(false);
      dismissBanner(banner.id);
      
      trackInteraction('banner_dismiss', { 
        bannerId: banner.id, 
        position,
        isAutoHide 
      });
    }, 300);
  };

  const handleClick = () => {
    if (banner.link) {
      trackInteraction('banner_click', { 
        bannerId: banner.id, 
        position,
        link: banner.link 
      });
    }
  };

  if (!isVisible || !banner) {
    return null;
  }

  const getBannerStyles = () => {
    const baseStyles = "relative overflow-hidden transition-all duration-300";
    
    switch (banner.type) {
      case 'success':
        return `${baseStyles} bg-green-100 border-green-500 text-green-800`;
      case 'warning':
        return `${baseStyles} bg-yellow-100 border-yellow-500 text-yellow-800`;
      case 'error':
        return `${baseStyles} bg-red-100 border-red-500 text-red-800`;
      case 'info':
        return `${baseStyles} bg-blue-100 border-blue-500 text-blue-800`;
      case 'sale':
        return `${baseStyles} bg-gradient-to-r from-red-600 to-pink-600 text-white`;
      case 'new-product':
        return `${baseStyles} bg-gradient-to-r from-indigo-600 to-purple-600 text-white`;
      case 'seasonal':
        return `${baseStyles} bg-gradient-to-r from-orange-500 to-red-500 text-white`;
      default:
        return `${baseStyles} bg-indigo-600 text-white`;
    }
  };

  const getPositionStyles = () => {
    switch (position) {
      case 'top':
        return 'fixed top-0 left-0 right-0 z-50 border-b';
      case 'bottom':
        return 'fixed bottom-0 left-0 right-0 z-50 border-t';
      case 'floating':
        return 'fixed top-4 right-4 z-50 rounded-lg shadow-lg max-w-sm border';
      default:
        return 'w-full border';
    }
  };

  const BannerContent = () => (
    <div className="flex items-center justify-between p-4">
      <div className="flex items-center space-x-4 flex-1 min-w-0">
        {/* Icon */}
        {banner.icon && (
          <div className="flex-shrink-0">
            {typeof banner.icon === 'string' ? (
              <span className="text-2xl">{banner.icon}</span>
            ) : (
              banner.icon
            )}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
            <div className="flex-1 min-w-0">
              {banner.title && (
                <h3 className="font-semibold text-sm sm:text-base truncate">
                  {banner.title}
                </h3>
              )}
              {banner.message && (
                <p className="text-sm opacity-90 mt-1">
                  {banner.message}
                </p>
              )}
            </div>

            {/* Action Button */}
            {banner.link && banner.buttonText && (
              <div className="flex-shrink-0 mt-2 sm:mt-0">
                <a
                  href={banner.link}
                  onClick={handleClick}
                  className={`
                    inline-flex items-center px-4 py-2 rounded-md text-sm font-medium
                    transition-colors duration-200
                    ${banner.type === 'sale' || banner.type === 'seasonal' || banner.type === 'new-product'
                      ? 'bg-white bg-opacity-20 hover:bg-opacity-30 text-white border border-white border-opacity-30'
                      : 'bg-white bg-opacity-10 hover:bg-opacity-20 text-current border border-current border-opacity-30'
                    }
                  `}
                >
                  {banner.buttonText}
                  {banner.showArrow && (
                    <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  )}
                </a>
              </div>
            )}
          </div>

          {/* Progress bar for auto-hide */}
          {autoHide && hideDelay > 0 && (
            <div className="w-full bg-black bg-opacity-20 rounded-full h-1 mt-2">
              <div 
                className="bg-white bg-opacity-60 h-1 rounded-full transition-all duration-100"
                style={{
                  animation: `shrink ${hideDelay}ms linear forwards`
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Dismiss Button */}
      <div className="flex-shrink-0 ml-4">
        <button
          onClick={() => handleDismiss(false)}
          className="p-1 rounded-full hover:bg-black hover:bg-opacity-10 transition-colors duration-200"
          aria-label="Dismiss banner"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );

  return (
    <>
      <style jsx>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
      <div 
        className={`
          ${getBannerStyles()} 
          ${getPositionStyles()} 
          ${className}
          ${isAnimating ? 'opacity-0 transform -translate-y-full' : 'opacity-100 transform translate-y-0'}
        `}
      >
        <BannerContent />
      </div>
    </>
  );
};

const PromotionalBannerManager = ({ position = 'top' }) => {
  const { campaigns, trackInteraction } = useMarketing();
  const [activeBanners, setActiveBanners] = useState([]);

  useEffect(() => {
    // Filter banners for current position and check if they should be displayed
    const currentTime = new Date();
    
    const validBanners = campaigns.filter(campaign => {
      // Check if campaign is active
      if (campaign.status !== 'active') return false;
      
      // Check time constraints
      if (campaign.startDate && new Date(campaign.startDate) > currentTime) return false;
      if (campaign.endDate && new Date(campaign.endDate) < currentTime) return false;
      
      // Check position
      if (campaign.position && campaign.position !== position) return false;
      
      // Check frequency constraints (if user has seen this before)
      return true;
    });

    setActiveBanners(validBanners);
  }, [campaigns, position]);

  // Default banners if no campaigns are set
  const defaultBanners = [
    {
      id: 'welcome-sale',
      type: 'sale',
      title: '🎉 Welcome Sale!',
      message: 'Get 20% off your first order with code WELCOME20',
      buttonText: 'Shop Now',
      link: '/products',
      showArrow: true,
      icon: '🛍️'
    },
    {
      id: 'free-shipping',
      type: 'info',
      title: 'Free Shipping',
      message: 'Free shipping on orders over $50',
      buttonText: 'Learn More',
      link: '/shipping-info',
      icon: '🚚'
    },
    {
      id: 'new-collection',
      type: 'new-product',
      title: 'New Collection',
      message: 'Check out our latest arrivals for the season',
      buttonText: 'Explore',
      link: '/new-arrivals',
      showArrow: true,
      icon: '✨'
    }
  ];

  const bannersToShow = activeBanners.length > 0 ? activeBanners : defaultBanners;

  if (bannersToShow.length === 0) {
    return null;
  }

  // Show only the first banner for each position to avoid clutter
  const bannerToShow = bannersToShow[0];

  return (
    <PromotionalBanner
      banner={bannerToShow}
      position={position}
      autoHide={position === 'floating'}
      hideDelay={8000}
    />
  );
};

// Hook for programmatically creating banners
export const useBanner = () => {
  const { trackInteraction } = useMarketing();

  const createBanner = (bannerConfig) => {
    const banner = {
      id: `banner_${Date.now()}`,
      createdAt: new Date().toISOString(),
      ...bannerConfig
    };

    trackInteraction('banner_created', { bannerId: banner.id });
    return banner;
  };

  const createSaleBanner = (title, message, discount, link = '/products') => {
    return createBanner({
      type: 'sale',
      title: title || `🏷️ Sale Alert!`,
      message: message || `Save ${discount}% on selected items`,
      buttonText: 'Shop Sale',
      link,
      showArrow: true,
      icon: '🛍️'
    });
  };

  const createWelcomeBanner = (customerName = '') => {
    return createBanner({
      type: 'success',
      title: `👋 Welcome${customerName ? ` ${customerName}` : ''}!`,
      message: 'Thanks for joining us. Enjoy browsing our collection.',
      buttonText: 'Start Shopping',
      link: '/products',
      icon: '🎉'
    });
  };

  const createStockAlert = (productName, link) => {
    return createBanner({
      type: 'warning',
      title: '⚠️ Low Stock Alert',
      message: `Only a few ${productName} items left in stock!`,
      buttonText: 'Buy Now',
      link,
      showArrow: true,
      icon: '📦'
    });
  };

  return {
    createBanner,
    createSaleBanner,
    createWelcomeBanner,
    createStockAlert
  };
};

export default PromotionalBanner;
export { PromotionalBannerManager };