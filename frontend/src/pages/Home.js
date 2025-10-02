import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import localProductService from '../services/localProductService';
import { useCart } from '../context/CartContext';
import WishlistButton from '../components/WishlistButton';
import CompareButton from '../components/CompareButton';
import StarRating from '../components/StarRating';
import { useReviews } from '../context/ReviewsContext';
import NewsletterSignup from '../components/NewsletterSignup';
import HeroCarousel from '../components/HeroCarousel';
import { ProductGridSkeleton } from '../components/LoadingSkeleton';
import { FadeIn, SlideIn, ScaleIn, StaggerContainer } from '../components/Animations';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();
  const { getProductRating } = useReviews();

  // Fetch featured products from local service
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const products = await localProductService.getFeaturedProducts(4);
        setFeaturedProducts(products);
      } catch (error) {
        console.error('Error fetching featured products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <div className="min-h-screen page-bg">
      {/* Hero Carousel Section */}
      <FadeIn>
        <HeroCarousel />
      </FadeIn>

      {/* Featured Products Section */}
      <section className="py-20 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SlideIn direction="up" className="text-center mb-16">
            <h2 className="text-4xl font-light text-foreground mb-4">Featured Products</h2>
            <p className="text-muted-foreground text-lg">Discover our handpicked selection</p>
          </SlideIn>
          
          {loading ? (
            <ProductGridSkeleton count={4} />
          ) : (
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product, index) => (
                <FadeIn key={product.id} delay={index * 100}>
                  <ScaleIn>
                    <div className="product-card group dark-container rounded-lg shadow-sm hover:shadow-lg transition-all duration-300">
                      <div className="relative">
                        <Link to={`/products/${product.id}`}>
                          <div className="aspect-square bg-muted mb-4 flex items-center justify-center overflow-hidden rounded-lg">
                            <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                        <div className="hidden w-full h-full items-center justify-center text-muted-foreground text-center p-4">
                          <span className="text-sm">{product.name}</span>
                        </div>
                      </div>
                    </Link>
                    
                    {/* Wishlist Button */}
                    <div className="absolute top-3 right-3">
                      <WishlistButton product={product} />
                    </div>
                    
                    {/* Compare Button */}
                    <div className="absolute top-3 left-3">
                      <CompareButton product={product} showText={false} size="small" />
                    </div>
                  </div>
                  
                  <Link to={`/products/${product.id}`}>
                    <div className="p-2">
                      <h3 className="text-lg font-medium text-foreground mb-2 group-hover:text-muted-foreground transition-colors line-clamp-2">
                        {product.name}
                      </h3>
                      <p className="text-muted-foreground mb-2 capitalize">{product.category}</p>
                      
                      <div className="mb-2">
                        <StarRating
                          rating={getProductRating(product.id).average}
                          showCount={true}
                          count={getProductRating(product.id).count}
                          size="small"
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <p className="text-xl font-semibold text-foreground">${product.price}</p>
                      </div>
                    </div>
                  </Link>
                </div>
                  </ScaleIn>
                </FadeIn>
              ))}
            </StaggerContainer>
          )}
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-foreground mb-4">Shop by Category</h2>
            <p className="text-muted-foreground text-lg">Find exactly what you're looking for</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { name: 'Clothes', image: '/images/product_15.png' },
              { name: 'Shoes', image: '/images/shoes/nike-jordan.webp' }
            ].map((category) => (
              <Link 
                key={category.name}
                to={`/${category.name.toLowerCase()}`}
                className="group relative h-80 bg-muted overflow-hidden flex items-center justify-center hover:scale-105 transition-transform duration-300"
              >
                <img 
                  src={category.image} 
                  alt={category.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-50 transition-all duration-300"></div>
                <div className="relative z-10 text-center text-white">
                  <h3 className="text-3xl font-light mb-2">{category.name}</h3>
                  <p className="text-sm tracking-wider">SHOP NOW</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup Section */}
      <section className="py-16 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">
              Stay in Style
            </h2>
            <p className="text-xl text-indigo-100">
              Get exclusive access to new arrivals, special offers, and fashion insights delivered right to your inbox.
            </p>
          </div>
          
          <div className="max-w-md mx-auto">
            <NewsletterSignup 
              variant="default"
              onSuccess={(email) => {
                // Newsletter signup successful - could show toast notification here
              }}
              className="dark-container p-6 rounded-lg shadow-lg"
            />
          </div>

          <div className="mt-8 text-center">
            <div className="flex items-center justify-center space-x-8 text-indigo-100">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm">Weekly Updates</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span className="text-sm">Privacy Protected</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span className="text-sm">Unsubscribe Anytime</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;