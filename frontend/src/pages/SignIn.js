import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const SignIn = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [currentImage, setCurrentImage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
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
      // Mock login - replace with actual authentication
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful login
      login({
        id: 1,
        name: 'User',
        email: formData.email
      });
      
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-100 via-orange-50 to-amber-200 flex items-center justify-center p-4">
      {/* Background Video-like Animation Container */}
      <div className="absolute inset-0 overflow-hidden">
        {backgroundImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-1000 ${
              index === currentImage 
                ? 'opacity-30 scale-100' 
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
        {/* Animated overlay elements */}
        <div className="absolute inset-0">
          {/* Floating elements inspired by the design */}
          <div className="absolute top-1/4 left-1/4 w-16 h-16 bg-white/20 rounded-full animate-pulse" 
               style={{ animationDelay: '0s', animationDuration: '3s' }} />
          <div className="absolute top-3/4 right-1/4 w-12 h-12 bg-blue-400/30 rounded-full animate-pulse" 
               style={{ animationDelay: '1s', animationDuration: '4s' }} />
          <div className="absolute top-1/2 right-1/3 w-8 h-8 bg-orange-300/40 rounded-full animate-pulse" 
               style={{ animationDelay: '2s', animationDuration: '5s' }} />
        </div>
      </div>

      {/* Main Sign In Container */}
      <div className="relative z-10 bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 w-full max-w-md mx-auto">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-light text-gray-800 tracking-wider">THEGEM</h1>
        </div>

        {/* Sign In Form */}
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-light text-gray-800 mb-2">Sign In</h2>
            <p className="text-sm text-gray-600">Welcome back to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
            <div>
              <label className="block text-sm text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full px-4 py-3 bg-gray-100 border-0 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-300 transition-all duration-200"
                required
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm text-gray-700 mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full px-4 py-3 bg-gray-100 border-0 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-300 transition-all duration-200"
                required
              />
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <Link to="/forgot-password" className="text-sm text-orange-500 hover:underline">
                Forgot Password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-orange-400 to-amber-500 text-white font-medium py-3 rounded-2xl hover:from-orange-500 hover:to-amber-600 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-70"
            >
              {isLoading ? 'SIGNING IN...' : 'SIGN IN'}
            </button>
          </form>

          {/* Footer Links */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Don't have an account? <Link to="/login" className="text-orange-500 hover:underline">Create Account</Link>
            </p>
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-10px) rotate(1deg); }
          66% { transform: translateY(5px) rotate(-1deg); }
        }
        
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .signin-container {
          animation: slideIn 0.8s ease-out;
        }
      `}</style>
    </div>
  );
};

export default SignIn;