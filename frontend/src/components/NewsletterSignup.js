import React, { useState } from 'react';
import { useMarketing } from '../context/MarketingContext';

const NewsletterSignup = ({ 
  variant = 'default', // 'default', 'modal', 'footer', 'sidebar'
  onSuccess = null,
  className = ''
}) => {
  const { 
    subscribeNewsletter, 
    isSubscribed, 
    trackInteraction,
    preferences: defaultPreferences 
  } = useMarketing();
  
  const [formData, setFormData] = useState({
    email: '',
    preferences: {
      categories: ['new-arrivals'],
      frequency: 'weekly',
      format: 'html'
    }
  });
  
  const [formState, setFormState] = useState({
    loading: false,
    success: false,
    error: null,
    showPreferences: variant === 'modal' || variant === 'sidebar'
  });

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e) => {
    const email = e.target.value;
    setFormData(prev => ({ ...prev, email }));
    
    // Clear previous errors when user starts typing
    if (formState.error) {
      setFormState(prev => ({ ...prev, error: null }));
    }
  };

  const handlePreferenceChange = (type, value) => {
    setFormData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [type]: value
      }
    }));
  };

  const handleCategoryToggle = (category) => {
    setFormData(prev => {
      const currentCategories = prev.preferences.categories;
      const updatedCategories = currentCategories.includes(category)
        ? currentCategories.filter(c => c !== category)
        : [...currentCategories, category];
      
      return {
        ...prev,
        preferences: {
          ...prev.preferences,
          categories: updatedCategories
        }
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate email
    if (!formData.email.trim()) {
      setFormState(prev => ({ ...prev, error: 'Email address is required' }));
      return;
    }
    
    if (!validateEmail(formData.email)) {
      setFormState(prev => ({ ...prev, error: 'Please enter a valid email address' }));
      return;
    }

    // Check if already subscribed
    if (isSubscribed(formData.email)) {
      setFormState(prev => ({ ...prev, error: 'This email is already subscribed' }));
      return;
    }

    // Validate preferences
    if (formData.preferences.categories.length === 0) {
      setFormState(prev => ({ ...prev, error: 'Please select at least one category' }));
      return;
    }

    setFormState(prev => ({ ...prev, loading: true, error: null }));

    try {
      await subscribeNewsletter(formData.email, formData.preferences);
      
      setFormState(prev => ({ 
        ...prev, 
        loading: false, 
        success: true 
      }));

      // Reset form
      setFormData({
        email: '',
        preferences: {
          categories: ['new-arrivals'],
          frequency: 'weekly',
          format: 'html'
        }
      });

      // Call success callback if provided
      if (onSuccess) {
        onSuccess(formData.email, formData.preferences);
      }

      // Track successful signup
      trackInteraction('newsletter_signup_success', {
        variant,
        preferences: formData.preferences
      });

      // Hide success message after 5 seconds
      setTimeout(() => {
        setFormState(prev => ({ ...prev, success: false }));
      }, 5000);

    } catch (error) {
      setFormState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error.message || 'Failed to subscribe. Please try again.' 
      }));
      
      trackInteraction('newsletter_signup_error', {
        variant,
        error: error.message
      });
    }
  };

  const togglePreferences = () => {
    setFormState(prev => ({ 
      ...prev, 
      showPreferences: !prev.showPreferences 
    }));
    
    trackInteraction('newsletter_preferences_toggle', { variant });
  };

  const categoryOptions = [
    { value: 'new-arrivals', label: 'New Arrivals', description: 'Latest products and collections' },
    { value: 'sales', label: 'Sales & Discounts', description: 'Special offers and promotions' },
    { value: 'seasonal', label: 'Seasonal Updates', description: 'Holiday and seasonal collections' },
    { value: 'men', label: "Men's Fashion", description: "Men's clothing and accessories" },
    { value: 'women', label: "Women's Fashion", description: "Women's clothing and accessories" },
    { value: 'kids', label: "Kids' Fashion", description: "Children's clothing and items" }
  ];

  const frequencyOptions = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' }
  ];

  // Variant-specific styles
  const getVariantStyles = () => {
    switch (variant) {
      case 'modal':
        return {
          container: 'bg-white p-6 rounded-lg shadow-xl max-w-md mx-auto',
          title: 'text-2xl font-bold text-gray-900 mb-4',
          form: 'space-y-4'
        };
      case 'footer':
        return {
          container: 'bg-gray-800 text-white p-6',
          title: 'text-xl font-semibold text-white mb-4',
          form: 'space-y-3'
        };
      case 'sidebar':
        return {
          container: 'bg-gray-50 p-4 rounded-lg',
          title: 'text-lg font-semibold text-gray-900 mb-3',
          form: 'space-y-3'
        };
      default:
        return {
          container: 'bg-white border border-gray-200 p-6 rounded-lg shadow-sm',
          title: 'text-xl font-semibold text-gray-900 mb-4',
          form: 'space-y-4'
        };
    }
  };

  const styles = getVariantStyles();

  if (formState.success) {
    return (
      <div className={`${styles.container} ${className}`}>
        <div className="text-center">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Successfully Subscribed!
          </h3>
          <p className="text-gray-600">
            Thank you for subscribing to our newsletter. You'll receive updates based on your preferences.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.container} ${className}`}>
      <div className="text-center mb-4">
        <h3 className={styles.title}>
          Stay Updated
        </h3>
        <p className={variant === 'footer' ? 'text-gray-300' : 'text-gray-600'}>
          Get the latest updates on new products, sales, and exclusive offers.
        </p>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Email Input */}
        <div>
          <label htmlFor="newsletter-email" className="sr-only">
            Email address
          </label>
          <div className="relative">
            <input
              id="newsletter-email"
              type="email"
              value={formData.email}
              onChange={handleEmailChange}
              placeholder="Enter your email address"
              className={`
                w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                ${variant === 'footer' ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300'}
                ${formState.error ? 'border-red-500' : ''}
              `}
              disabled={formState.loading}
            />
            {formState.loading && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>
        </div>

        {/* Preferences Toggle */}
        {!formState.showPreferences && variant !== 'footer' && (
          <button
            type="button"
            onClick={togglePreferences}
            className="text-indigo-600 hover:text-indigo-500 text-sm font-medium"
          >
            Customize preferences
          </button>
        )}

        {/* Preferences Section */}
        {formState.showPreferences && (
          <div className="space-y-4 border-t pt-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Categories</h4>
              <div className="grid grid-cols-1 gap-2">
                {categoryOptions.map((category) => (
                  <label key={category.value} className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.preferences.categories.includes(category.value)}
                      onChange={() => handleCategoryToggle(category.value)}
                      className="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {category.label}
                      </div>
                      <div className="text-xs text-gray-500">
                        {category.description}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">Frequency</h4>
              <select
                value={formData.preferences.frequency}
                onChange={(e) => handlePreferenceChange('frequency', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                {frequencyOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">Format</h4>
              <div className="flex space-x-4">
                {[
                  { value: 'html', label: 'Rich HTML' },
                  { value: 'text', label: 'Plain Text' }
                ].map((option) => (
                  <label key={option.value} className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="format"
                      value={option.value}
                      checked={formData.preferences.format === option.value}
                      onChange={(e) => handlePreferenceChange('format', e.target.value)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {formState.error && (
          <div className="flex items-center space-x-2 text-red-600 text-sm">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>{formState.error}</span>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={formState.loading}
          className={`
            w-full px-6 py-3 rounded-lg font-medium transition-colors duration-200
            ${formState.loading
              ? 'bg-gray-400 cursor-not-allowed'
              : variant === 'footer'
                ? 'bg-indigo-600 hover:bg-indigo-500 text-white'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }
          `}
        >
          {formState.loading ? 'Subscribing...' : 'Subscribe'}
        </button>

        {/* Privacy Notice */}
        <p className={`text-xs ${variant === 'footer' ? 'text-gray-400' : 'text-gray-500'}`}>
          By subscribing, you agree to our privacy policy. You can unsubscribe at any time.
        </p>
      </form>
    </div>
  );
};

export default NewsletterSignup;