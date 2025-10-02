import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import localProductService from '../services/localProductService';
import { useCart } from '../context/CartContext';
import { useReviews } from '../context/ReviewsContext';
import StarRating from '../components/StarRating';
import ReviewForm from '../components/ReviewForm';
import ReviewsList from '../components/ReviewsList';
import ImageGalleryModal from '../components/ImageGalleryModal';
import { ProductSkeleton } from '../components/LoadingSkeleton';
import { FadeIn, SlideIn, ScaleIn } from '../components/Animations';

const ProductDetail = () => {
  const { id } = useParams();
  const { addItem } = useCart();
  const { getProductRating } = useReviews();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('S');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [showAddedAnimation, setShowAddedAnimation] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [galleryStartIndex, setGalleryStartIndex] = useState(0);

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      try {
        const productData = await localProductService.getProductById(id);
        setProduct(productData);
        if (productData.colors && productData.colors.length > 0) {
          setSelectedColor(productData.colors[0]);
        }
        // Set default size to 'S' if product has sizes
        if (productData.sizes && productData.sizes.length > 0) {
          setSelectedSize(productData.sizes.includes('S') ? 'S' : productData.sizes[0]);
        }
      } catch (error) {
        console.error('Error loading product:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      return; // Don't show alert, just return
    }
    
    // Add to cart using context
    const cartItem = {
      id: parseInt(product.id),
      name: product.name,
      category: product.category,
      price: product.price,
      size: selectedSize || 'S',
      color: selectedColor || (product.colors && product.colors[0]) || 'Default',
      quantity: quantity,
      image: product.image,
      stock: 50 // Default stock
    };
    
    addItem(cartItem);
    
    // Show animation
    setShowAddedAnimation(true);
    setTimeout(() => {
      setShowAddedAnimation(false);
    }, 2000);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <ProductSkeleton />
          <div className="space-y-6">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6 animate-pulse"></div>
            </div>
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-medium text-foreground mb-4">Product not found</h2>
          <p className="text-muted-foreground mb-4">Looking for product with ID: {id}</p>
          <p className="text-sm text-muted-foreground mb-6">
            Check the browser console (F12) for debug information
          </p>
          <div className="space-x-4">
            <Link to="/products" className="bg-primary text-primary-foreground px-4 py-2 hover:bg-primary/90 transition-colors rounded-lg">
              Back to Products
            </Link>
            <Link to="/" className="border border-border text-foreground px-4 py-2 hover:bg-accent transition-colors rounded-lg">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm">
            <li><Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link></li>
            <li><span className="text-muted-foreground">/</span></li>
            <li><Link to="/products" className="text-muted-foreground hover:text-foreground transition-colors">Products</Link></li>
            <li><span className="text-muted-foreground">/</span></li>
            <li className="text-foreground font-medium">{product.name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image - Single Image Only */}
          <FadeIn>
            <div 
              className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden cursor-zoom-in group"
              onClick={() => {
                setGalleryStartIndex(0);
                setIsGalleryOpen(true);
              }}
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="hidden w-full h-full items-center justify-center text-gray-500 dark:text-gray-400">
                Product Image
              </div>
              {/* Zoom indicator */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center">
                <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black bg-opacity-50 px-3 py-1 rounded-full text-sm">
                  Click to enlarge
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Product Info */}
          <SlideIn direction="right">
            <div className="space-y-6">
            {/* Product Title and Price */}
            <div>
              <h1 className="text-3xl font-light text-foreground mb-4">{product.name}</h1>
              <div className="flex items-center space-x-4 mb-4">
                <span className="text-3xl font-semibold text-foreground">${product.price}</span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-xl text-muted-foreground line-through">${product.originalPrice}</span>
                )}
              </div>
              
              {/* Rating */}
              <div className="mb-6">
                <StarRating
                  rating={getProductRating(id).average}
                  showCount={true}
                  count={getProductRating(id).count}
                  size="medium"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-medium text-foreground mb-3">Description</h3>
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Category & Fit Info */}
            <div className="space-y-2">
              <p><span className="font-medium">Category:</span> <span className="capitalize">{product.category}</span></p>
              {product.subcategory && (
                <p><span className="font-medium">Type:</span> <span className="capitalize">{product.subcategory}</span></p>
              )}
              {product.fit && (
                <p><span className="font-medium">Fit:</span> <span>{product.fit}</span></p>
              )}
            </div>

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-foreground mb-3">Size</h3>
                <div className="grid grid-cols-6 gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-3 px-4 border text-center text-sm font-medium transition-colors rounded-md ${
                        selectedSize === size
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border text-foreground hover:border-primary hover:bg-accent'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-foreground mb-3">Color</h3>
                <div className="flex space-x-3">
                  {product.colors.map((color, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedColor(color)}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        selectedColor === color 
                          ? 'border-primary scale-110' 
                          : 'border-border hover:border-primary'
                      }`}
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <h3 className="text-lg font-medium text-foreground mb-3">Quantity</h3>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 border border-border hover:border-primary hover:bg-accent transition-colors rounded-md"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
                <span className="text-lg font-medium px-4">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 border border-border hover:border-primary hover:bg-accent transition-colors rounded-md"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <div className="pt-4 relative">
              <button
                onClick={handleAddToCart}
                className="w-full btn-primary text-lg py-4"
              >
                Add to Cart - ${(product.price * quantity).toFixed(2)}
              </button>
              
              {/* Added Animation */}
              {showAddedAnimation && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="bg-green-500 text-white px-6 py-3 rounded-full shadow-lg animate-bounce">
                    <div className="flex items-center space-x-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="font-medium">Added to Cart!</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          </SlideIn>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <div className="border-b border-border">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('description')}
                className={`pb-4 text-sm font-medium transition-colors ${
                  activeTab === 'description'
                    ? 'text-foreground border-b-2 border-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Description
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`pb-4 text-sm font-medium transition-colors ${
                  activeTab === 'reviews'
                    ? 'text-foreground border-b-2 border-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Reviews ({getProductRating(id).count})
              </button>
              <button
                onClick={() => setActiveTab('shipping')}
                className={`pb-4 text-sm font-medium transition-colors ${
                  activeTab === 'shipping'
                    ? 'text-foreground border-b-2 border-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Shipping & Returns
              </button>
            </nav>
          </div>

          <div className="py-8">
            {/* Description Tab */}
            {activeTab === 'description' && (
              <div className="prose max-w-none">
                <h3 className="text-lg font-medium text-foreground mb-4">Product Details</h3>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  {product.description}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-foreground mb-3">Specifications</h4>
                    <ul className="space-y-2 text-muted-foreground">
                      <li><strong>Category:</strong> <span className="capitalize">{product.category}</span></li>
                      {product.subcategory && (
                        <li><strong>Type:</strong> <span className="capitalize">{product.subcategory}</span></li>
                      )}
                      {product.sizes && (
                        <li><strong>Available Sizes:</strong> {product.sizes.join(', ')}</li>
                      )}
                      {product.colors && (
                        <li><strong>Available Colors:</strong> {product.colors.join(', ')}</li>
                      )}
                      <li><strong>Material:</strong> Premium quality materials</li>
                      <li><strong>Care Instructions:</strong> Machine wash cold, tumble dry low</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-foreground mb-3">Features</h4>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>• High-quality construction</li>
                      <li>• Comfortable fit</li>
                      <li>• Durable materials</li>
                      <li>• Easy care</li>
                      <li>• Versatile style</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div className="space-y-8">
                <ReviewsList productId={id} />
                <ReviewForm productId={id} />
              </div>
            )}

            {/* Shipping Tab */}
            {activeTab === 'shipping' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-4">Shipping Information</h3>
                  <div className="space-y-4 text-muted-foreground">
                    <div className="flex items-start space-x-3">
                      <svg className="w-5 h-5 text-green-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <div>
                        <p className="font-medium">Free Standard Shipping</p>
                        <p className="text-sm">On orders over $100. Delivery in 3-7 business days.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <div>
                        <p className="font-medium">Express Shipping</p>
                        <p className="text-sm">$15 fee. Delivery in 1-2 business days.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-foreground mb-4">Returns & Exchanges</h3>
                  <div className="space-y-4 text-muted-foreground">
                    <p>We want you to be completely satisfied with your purchase. If you're not happy, we offer:</p>
                    <ul className="space-y-2 ml-4">
                      <li>• 30-day return policy</li>
                      <li>• Free return shipping</li>
                      <li>• Full refund or exchange</li>
                      <li>• Items must be in original condition</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Image Gallery Modal */}
      <ImageGalleryModal
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        images={[product.image]} // Only one image for now
        currentIndex={galleryStartIndex}
        productName={product.name}
      />
    </div>
  );
};

export default ProductDetail;