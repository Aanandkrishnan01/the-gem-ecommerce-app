import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import SearchBar from './SearchBar';
import { ThemeToggle } from './mode-toggle';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNavVisible, setIsNavVisible] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const [mobileActiveDropdown, setMobileActiveDropdown] = useState(null);
  const { getCartItemsCount } = useCart();
  const { isAuthenticated, user, logout } = useAuth();
  const { getWishlistCount } = useWishlist();
  const navigate = useNavigate();
  const cartCount = getCartItemsCount();
  const wishlistCount = getWishlistCount();
  const navRef = useRef(null);
  const dropdownRefs = useRef({});

  // Handle hover events for navigation visibility
  const handleNavMouseEnter = () => {
    setIsNavVisible(true);
  };

  const handleNavMouseLeave = () => {
    setIsNavVisible(false);
    setActiveDropdown(null);
    // Don't close account dropdown on mouse leave, let click outside handle it
  };

  // Handle clicking outside dropdowns and mobile menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close mobile menu when clicking outside
      if (isMenuOpen && navRef.current && !navRef.current.contains(event.target)) {
        setIsMenuOpen(false);
        setMobileActiveDropdown(null);
      }
      
      // Close category dropdowns when clicking outside
      if (activeDropdown && dropdownRefs.current[activeDropdown]) {
        if (!dropdownRefs.current[activeDropdown].contains(event.target)) {
          setActiveDropdown(null);
        }
      }
      
      // Close account dropdown when clicking outside
      if (isAccountDropdownOpen && dropdownRefs.current.account) {
        if (!dropdownRefs.current.account.contains(event.target)) {
          setIsAccountDropdownOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activeDropdown, isAccountDropdownOpen, isMenuOpen]);

  const handleLogout = () => {
    logout();
    setIsAccountDropdownOpen(false);
    navigate('/');
  };

  // Navigation categories with dropdown items
  const navigationCategories = {
    clothes: {
      title: 'CLOTHES',
      items: [
        { name: 'All Clothes', path: '/clothes' },
        { name: 'Dresses', path: '/clothes?category=dresses' },
        { name: 'Tops', path: '/clothes?category=tops' },
        { name: 'Jackets', path: '/clothes?category=jackets' },
        { name: 'Pants', path: '/clothes?category=pants' }
      ]
    },
    shoes: {
      title: 'SHOES',
      items: [
        { name: 'All Shoes', path: '/shoes' },
        { name: 'Sneakers', path: '/shoes?category=sneakers' },
        { name: 'Boots', path: '/shoes?category=boots' },
        { name: 'Sandals', path: '/shoes?category=sandals' },
        { name: 'Heels', path: '/shoes?category=heels' }
      ]
    },
    women: {
      title: 'WOMEN',
      items: [
        { name: 'All Women', path: '/women' },
        { name: 'New Arrivals', path: '/women?filter=new' },
        { name: 'Trending', path: '/women?filter=trending' },
        { name: 'Sale Items', path: '/women?filter=sale' }
      ]
    },
    men: {
      title: 'MEN',
      items: [
        { name: 'All Men', path: '/men' },
        { name: 'New Arrivals', path: '/men?filter=new' },
        { name: 'Trending', path: '/men?filter=trending' },
        { name: 'Sale Items', path: '/men?filter=sale' }
      ]
    },
    kids: {
      title: 'KIDS',
      items: [
        { name: 'All Kids', path: '/kids' },
        { name: 'Boys', path: '/kids?category=boys' },
        { name: 'Girls', path: '/kids?category=girls' },
        { name: 'Baby', path: '/kids?category=baby' }
      ]
    },
    mainshop: {
      title: 'MAIN SHOP',
      items: [
        { name: 'All Products', path: '/products' },
        { name: 'New Arrivals', path: '/products?filter=new' },
        { name: 'Best Sellers', path: '/products?filter=bestsellers' },
        { name: 'Sale Items', path: '/products?filter=sale' },
        { name: 'Featured', path: '/products?filter=featured' }
      ]
    }
  };

  return (
    <>
      {/* Minimalist Navigation Header */}
      <nav 
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out"
        onMouseEnter={handleNavMouseEnter}
        onMouseLeave={handleNavMouseLeave}
      >
        {/* Always Visible Logo Bar */}
        <div className="bg-background/90 backdrop-blur-sm shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center items-center h-16">
              <Link to="/" className="flex items-center space-x-3 group">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-all duration-300">
                  <span className="text-primary-foreground font-bold text-xl">TG</span>
                </div>
                <span className="text-3xl font-bold tracking-wider bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent group-hover:from-primary group-hover:to-primary/80 transition-all duration-300">
                  THEGEM
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* Expandable Navigation Menu */}
        <div className={`bg-background border-t border-border shadow-lg transition-all duration-500 transform ${
          isNavVisible 
            ? 'opacity-100 translate-y-0 visible' 
            : 'opacity-0 -translate-y-full invisible'
        }`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              
              {/* Left Side - Main Navigation */}
              <div className="hidden md:flex items-center space-x-2 lg:space-x-6">
                <Link 
                  to="/products?filter=sale" 
                  className="nav-link text-red-600 hover:text-red-700 transition-colors font-semibold text-sm lg:text-base whitespace-nowrap"
                >
                  SALE
                </Link>
                
                {/* Category Dropdowns */}
                {Object.entries(navigationCategories).map(([key, category]) => (
                  <div 
                    key={key} 
                    className="relative hidden lg:block"
                    ref={el => dropdownRefs.current[key] = el}
                    onMouseEnter={() => setActiveDropdown(key)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <button className="nav-link hover:text-primary transition-colors flex items-center space-x-1 font-semibold text-foreground">
                      <span>{category.title}</span>
                      <svg 
                        className={`w-4 h-4 transition-transform duration-200 ${
                          activeDropdown === key ? 'rotate-180' : ''
                        }`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {/* Category Dropdown Menu */}
                    <div className={`absolute left-0 mt-2 w-56 bg-card rounded-lg shadow-xl border border-border py-3 transition-all duration-300 transform z-40 ${
                      activeDropdown === key 
                        ? 'opacity-100 translate-y-0 visible' 
                        : 'opacity-0 translate-y-2 invisible'
                    }`}>
                      {category.items.map((item, index) => (
                        <Link
                          key={index}
                          to={item.path}
                          className="block px-4 py-3 text-sm text-card-foreground hover:bg-accent hover:text-accent-foreground transition-colors font-medium"
                          onClick={() => setActiveDropdown(null)}
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Center - Search Bar */}
              <div className="flex-1 max-w-6xl mx-2 lg:mx-6 hidden md:block">
                <SearchBar className="w-full" placeholder="Search for products..." />
              </div>

              {/* Right Side - User Actions */}
              <div className="flex items-center space-x-4">
                {/* Account Dropdown - Hidden on mobile since we have mobile menu */}
                {isAuthenticated ? (
                  <div 
                    className="relative hidden md:block"
                    ref={el => dropdownRefs.current.account = el}
                  >
                    <button
                      onClick={() => setIsAccountDropdownOpen(!isAccountDropdownOpen)}
                      className="flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">
                          {user?.firstName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                        </span>
                      </div>
                      <div className="hidden md:block text-left">
                        <p className="text-sm font-semibold text-gray-900">
                          {user?.firstName || 'Account'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {user?.email?.substring(0, 20)}...
                        </p>
                      </div>
                      <svg 
                        className={`w-4 h-4 transition-transform duration-200 ${
                          isAccountDropdownOpen ? 'rotate-180' : ''
                        }`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {/* Account Dropdown Menu */}
                    <div className={`absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-3 transition-all duration-300 transform z-50 ${
                      isAccountDropdownOpen 
                        ? 'opacity-100 translate-y-0 visible' 
                        : 'opacity-0 translate-y-2 invisible'
                    } md:right-0 sm:right-0 xs:left-0`}>
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                        onClick={() => setIsAccountDropdownOpen(false)}
                      >
                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        My Profile
                      </Link>
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                        onClick={() => setIsAccountDropdownOpen(false)}
                      >
                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        My Orders
                      </Link>
                      <Link
                        to="/compare"
                        className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                        onClick={() => setIsAccountDropdownOpen(false)}
                      >
                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        Compare Products
                      </Link>
                      <hr className="my-2 border-gray-200" />
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                      >
                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Sign Out
                      </button>
                    </div>
                  </div>
                ) : (
                  <Link 
                    to="/auth" 
                    className="hidden md:block px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg"
                  >
                    Sign In
                  </Link>
                )}

                {/* Wishlist & Cart Icons */}
                <div className="flex items-center space-x-3">
                  {/* Dark Mode Toggle */}
                  <ThemeToggle />
                  
                  {/* Wishlist Icon */}
                  {isAuthenticated && (
                    <Link 
                      to="/wishlist" 
                      className="relative p-3 hover:bg-accent rounded-lg transition-colors group"
                      title="Wishlist"
                    >
                      <svg className="w-6 h-6 text-muted-foreground group-hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      {wishlistCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center animate-pulse font-bold shadow-lg">
                          {wishlistCount}
                        </span>
                      )}
                    </Link>
                  )}
                  
                  {/* Cart Icon */}
                  <Link 
                    to="/cart" 
                    className="relative p-3 hover:bg-accent rounded-lg transition-colors group"
                    title="Shopping Cart"
                  >
                    <svg className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5-5M7 13l-2.5 5M17 21a2 2 0 100-4 2 2 0 000 4zM9 21a2 2 0 100-4 2 2 0 000 4z" />
                    </svg>
                    {cartCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-6 w-6 flex items-center justify-center animate-pulse font-bold shadow-lg">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                </div>

                {/* Mobile menu button */}
                <button
                  className="lg:hidden p-2 hover:bg-muted rounded-lg transition-colors"
                  onClick={() => {
                    setIsMenuOpen(!isMenuOpen);
                    if (isMenuOpen) {
                      setMobileActiveDropdown(null);
                    }
                  }}
                  aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                >
                  {isMenuOpen ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <>
            {/* Mobile Menu Backdrop */}
            <div 
              className="lg:hidden fixed inset-0 bg-black bg-opacity-25 z-30"
              onClick={() => {
                setIsMenuOpen(false);
                setMobileActiveDropdown(null);
              }}
            ></div>
            
            {/* Mobile Menu Content */}
            <div className="lg:hidden bg-background dark-container border-t shadow-lg absolute top-full left-0 right-0 z-40 max-h-[calc(100vh-4rem)] overflow-y-auto">
              <div className="px-4 py-2 space-y-1">
                {/* Mobile Search */}
                <div className="py-2">
                  <SearchBar className="w-full" placeholder="Search..." />
                </div>
                <hr className="border-border" />
                
                {/* Mobile Account Section */}
                {isAuthenticated ? (
                  <div className="py-3 space-y-2">
                    <div className="flex items-center space-x-3 px-2 py-2 bg-muted rounded-lg">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">
                          {user?.firstName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-foreground">
                          {user?.firstName || 'Account'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {user?.email?.substring(0, 25)}...
                        </p>
                      </div>
                    </div>
                    
                    <Link
                      to="/profile"
                      className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors rounded-lg"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      View Account
                    </Link>
                    <Link
                      to="/profile"
                      className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors rounded-lg"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      My Orders
                    </Link>
                    <Link
                      to="/wishlist"
                      className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors rounded-lg"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      My Wishlist {wishlistCount > 0 && <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">{wishlistCount}</span>}
                    </Link>
                    <Link
                      to="/cart"
                      className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors rounded-lg"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5-5M7 13l-2.5 5M17 21a2 2 0 100-4 2 2 0 000 4zM9 21a2 2 0 100-4 2 2 0 000 4z" />
                      </svg>
                      Shopping Cart {cartCount > 0 && <span className="ml-2 bg-blue-500 text-white text-xs rounded-full px-2 py-1">{cartCount}</span>}
                    </Link>
                    <Link
                      to="/compare"
                      className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors rounded-lg"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      Compare Products
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors rounded-lg"
                    >
                      <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Sign Out
                    </button>
                    <hr className="border-border my-3" />
                  </div>
                ) : (
                  <div className="py-3">
                    <Link 
                      to="/auth" 
                      className="block w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg text-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign In / Register
                    </Link>
                    <hr className="border-border my-3" />
                  </div>
                )}
                
                {/* Main Navigation Links */}
                <div className="space-y-1">
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 py-1">Shop</div>
                  <Link to="/products?filter=sale" className="block py-3 px-2 text-base font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 rounded-lg transition-colors" onClick={() => {
                    setIsMenuOpen(false);
                    setMobileActiveDropdown(null);
                  }}>
                    🔥 SALE
                  </Link>
                  <Link to="/products" className="block py-3 px-2 text-base font-semibold text-foreground hover:bg-muted rounded-lg transition-colors" onClick={() => {
                    setIsMenuOpen(false);
                    setMobileActiveDropdown(null);
                  }}>
                    🛍️ MAIN SHOP
                  </Link>
                </div>
                
                <hr className="border-gray-200 my-3" />
                
                {/* Categories */}
                <div className="space-y-1">
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 py-1">Categories</div>
                  
                  {/* Mobile Category Dropdowns */}
                  {Object.entries(navigationCategories).map(([key, category]) => (
                    <div key={key} className="space-y-1">
                      <button
                        onClick={() => setMobileActiveDropdown(mobileActiveDropdown === key ? null : key)}
                        className="flex items-center justify-between w-full py-2 px-2 nav-link hover:bg-muted rounded-lg transition-colors text-left"
                      >
                        <span className="text-foreground font-medium">{category.title}</span>
                        <svg 
                          className={`w-4 h-4 transition-transform duration-200 ${
                            mobileActiveDropdown === key ? 'rotate-180' : ''
                          }`} 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      
                      {/* Mobile Dropdown Items */}
                      {mobileActiveDropdown === key && (
                        <div className="ml-4 space-y-1 border-l border-border pl-3">
                          {category.items.map((item, index) => (
                            <Link
                              key={index}
                              to={item.path}
                              className="block py-2 px-2 text-sm text-muted-foreground hover:bg-blue-100 dark:hover:bg-blue-900 hover:text-blue-600 dark:hover:text-blue-200 rounded-lg transition-colors"
                              onClick={() => {
                                setIsMenuOpen(false);
                                setMobileActiveDropdown(null);
                              }}
                            >
                              {item.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </nav>
      
      {/* Spacer for fixed navbar */}
      <div className="h-16"></div>
    </>
  );
};

export default Navbar;