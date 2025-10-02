import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: ''
  });
  const [currentImage, setCurrentImage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const { login, register, logout, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  // Images array for the animated background
  const backgroundImages = [
    '/images/aa8d13d6bafa93c3238482bf040c1a34.jpg',
    '/images/SIMPLY_BE_SPRING_PROJECT_IMAGES15-scaled.jpg',
    '/images/login-clothing.png'
  ];

  // Auto-rotate images every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % backgroundImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [backgroundImages.length]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignUp) {
        // Registration
        const result = await register({
          username: formData.email, // Using email as username for simplicity
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName
        });

        if (result.success) {
          // After successful registration, automatically log in
          const loginResult = await login(formData.email, formData.password);
          if (loginResult.success) {
            navigate('/');
          }
        } else {
          console.error('Registration failed:', result.error);
          setToast({
            message: result.error || 'Registration failed. Please try again.',
            type: 'error'
          });
        }
      } else {
        // Login
        const result = await login(formData.email, formData.password);
        if (result.success) {
          navigate('/');
        } else {
          console.error('Login failed:', result.error);
          setToast({
            message: result.error === 'Login failed' ? 'Invalid credentials. Please check your email and password.' : result.error,
            type: 'error'
          });
        }
      }
    } catch (error) {
      console.error('Authentication error:', error);
      setToast({
        message: 'Authentication error. Please try again.',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsSignUp(!isSignUp);
      setFormData({
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: ''
      });
    }, 350); // Reduced timing for smoother feel
    setTimeout(() => {
      setIsAnimating(false);
    }, 500); // Slightly longer for complete transition
  };

  const handleLogout = () => {
    logout();
    setToast({
      message: 'Successfully logged out!',
      type: 'success'
    });
    // Optionally redirect to home page
    setTimeout(() => {
      navigate('/');
    }, 1500);
  };

  // If user is authenticated, show logout interface
  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-100 via-orange-50 to-amber-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden flex items-center justify-center">
        {/* Background Animation Container */}
        <div className="absolute inset-0 overflow-hidden">
          {backgroundImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
                index === currentImage ? 'opacity-30 dark:opacity-20' : 'opacity-0'
              }`}
              style={{ backgroundImage: `url(${image})` }}
            />
          ))}
        </div>

        {/* Logout Card */}
        <div className="relative z-10 form-container shadow-2xl rounded-2xl p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">Welcome Back!</h2>
            {user && (
              <p className="text-muted-foreground mb-6">
                Hello, {user.firstName || user.email}!
              </p>
            )}
            <p className="text-muted-foreground mb-8">
              You are currently logged in. Click below to logout.
            </p>
            
            <button
              onClick={handleLogout}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 transform hover:scale-105"
            >
              Logout
            </button>

            <button
              onClick={() => navigate('/')}
              className="w-full mt-4 bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200"
            >
              Go to Home
            </button>
          </div>
        </div>

        {/* Toast Notifications */}
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-100 via-orange-50 to-amber-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
      {/* Background Animation Container */}
      <div className="absolute inset-0 overflow-hidden">
        {backgroundImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-1000 ${
              index === currentImage 
                ? 'opacity-20 dark:opacity-10 scale-100' 
                : 'opacity-0 scale-105'
            }`}
            style={{
              backgroundImage: `url(${image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'sepia(20%) saturate(80%) brightness(90%)'
            }}
          />
        ))}
      </div>

      {/* Main Container */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="form-container rounded-3xl shadow-2xl overflow-hidden max-w-4xl w-full relative">
          {/* Animation Overlay */}
          {isAnimating && (
            <div className="absolute inset-0 bg-white/10 dark:bg-black/10 backdrop-blur-[2px] z-50 rounded-3xl pointer-events-none"></div>
          )}
          
          <div className="flex min-h-[600px] relative flex-col md:flex-row">
            
            {/* Image Panel */}
            <div className={`md:w-1/2 w-full relative transition-all duration-500 ease-out ${
              isSignUp ? 'md:order-2 order-1' : 'md:order-1 order-1'
            } ${isAnimating ? 'md:translate-x-full opacity-90' : 'md:translate-x-0 opacity-100'} min-h-[200px] md:min-h-0`}>
              <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-amber-500 p-8 flex flex-col justify-center items-center text-white">
                {/* Current rotating image */}
                <div className="w-32 h-32 md:w-64 md:h-64 mb-4 md:mb-8 rounded-full overflow-hidden shadow-xl transition-all duration-300">
                  <img 
                    src={backgroundImages[currentImage]} 
                    alt="Fashion" 
                    className="w-full h-full object-cover transition-all duration-1000"
                  />
                </div>
                
                {/* Welcome Text */}
                <div className={`text-center transition-all duration-300 ${isAnimating ? 'opacity-0 transform scale-95' : 'opacity-100 transform scale-100'}`}>
                  <h2 className="text-xl md:text-3xl font-bold mb-2 md:mb-4">
                    {isSignUp ? 'Welcome Back!' : 'Hello, Friend!'}
                  </h2>
                  <p className="text-sm md:text-lg mb-4 md:mb-8 opacity-90 hidden md:block">
                    {isSignUp 
                      ? 'To keep connected with us please login with your personal info'
                      : 'Enter your personal details and start journey with us'
                    }
                  </p>
                  
                  {/* Toggle Button */}
                  <button
                    onClick={toggleMode}
                    disabled={isAnimating}
                    className="px-6 md:px-8 py-2 md:py-3 border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-orange-500 transition-all duration-300 transform hover:scale-105 text-sm md:text-base disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSignUp ? 'SIGN IN' : 'SIGN UP'}
                  </button>
                </div>
              </div>
            </div>

            {/* Form Panel */}
            <div className={`md:w-1/2 w-full transition-all duration-500 ease-out ${
              isSignUp ? 'md:order-1 order-2' : 'md:order-2 order-2'
            } ${isAnimating ? 'md:-translate-x-full opacity-90' : 'md:translate-x-0 opacity-100'}`}>
              <div className="p-6 md:p-12 flex flex-col justify-center h-full">
                
                {/* Logo */}
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-light text-foreground tracking-wider">THEGEM</h1>
                </div>

                {/* Form */}
                <div className={`space-y-6 transition-all duration-300 ${isAnimating ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0'}`}>
                  <div className="text-center">
                    <h2 className="text-2xl font-light text-foreground mb-2">
                      {isSignUp ? 'Create Account' : 'Sign In'}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {isSignUp 
                        ? 'Sign up and get 30 days free trial' 
                        : 'Welcome back to your account'
                      }
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name Fields for Sign Up */}
                    {isSignUp && (
                      <div className="flex space-x-4">
                        <div className="flex-1">
                          <label className="block text-sm text-foreground mb-2">First Name</label>
                          <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            placeholder="John"
                            className="input w-full"
                            required={isSignUp}
                          />
                        </div>
                        <div className="flex-1">
                          <label className="block text-sm text-foreground mb-2">Last Name</label>
                          <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            placeholder="Doe"
                            className="input w-full"
                            required={isSignUp}
                          />
                        </div>
                      </div>
                    )}

                    {/* Email Input */}
                    <div>
                      <label className="block text-sm text-foreground mb-2">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john.doe@example.com"
                        className="input w-full"
                        required
                      />
                    </div>

                    {/* Password Input */}
                    <div>
                      <label className="block text-sm text-foreground mb-2">Password</label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="••••••••"
                        className="input w-full"
                        required
                      />
                    </div>

                    {/* Confirm Password for Sign Up */}
                    {isSignUp && (
                      <div>
                        <label className="block text-sm text-foreground mb-2">Confirm Password</label>
                        <input
                          type="password"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          placeholder="••••••••"
                          className="input w-full"
                          required={isSignUp}
                        />
                      </div>
                    )}

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-orange-400 to-amber-500 text-white font-medium py-3 rounded-2xl hover:from-orange-500 hover:to-amber-600 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-70"
                    >
                      {isLoading 
                        ? (isSignUp ? 'SIGNING UP...' : 'SIGNING IN...') 
                        : (isSignUp ? 'SIGN UP' : 'SIGN IN')
                      }
                    </button>
                  </form>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Floating animated elements */}
      <div className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ${isAnimating ? 'opacity-30' : 'opacity-100'}`}>
        <div className="absolute top-1/4 left-1/4 w-12 h-12 bg-white/15 rounded-full animate-pulse" 
             style={{ animationDelay: '0s', animationDuration: '4s' }} />
        <div className="absolute top-3/4 right-1/4 w-8 h-8 bg-blue-400/20 rounded-full animate-pulse" 
             style={{ animationDelay: '2s', animationDuration: '5s' }} />
        <div className="absolute top-1/2 right-1/3 w-6 h-6 bg-orange-300/25 rounded-full animate-pulse" 
             style={{ animationDelay: '4s', animationDuration: '6s' }} />
      </div>

      {/* Toast Notifications */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Custom CSS */}
      <style jsx>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Auth;