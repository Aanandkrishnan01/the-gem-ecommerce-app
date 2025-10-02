import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Cart = () => {
  const { items: cartItems, updateQuantity, removeItem, getCartTotal, clearCart } = useCart();
  const { isAuthenticated } = useAuth();

  const subtotal = getCartTotal();
  const shipping = subtotal > 100 ? 0 : 15;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;

  // Helper function to safely calculate item total
  const getItemTotal = (item) => {
    const price = parseFloat(item.price) || 0;
    const quantity = parseInt(item.quantity) || 0;
    return price * quantity;
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen page-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5-5M7 13l-2.5 5M17 21a2 2 0 100-4 2 2 0 000 4zM9 21a2 2 0 100-4 2 2 0 000 4z" />
              </svg>
            </div>
            <h2 className="text-3xl font-light text-foreground mb-4">Your cart is empty</h2>
            <p className="text-muted-foreground mb-8">Looks like you haven't added any items to your cart yet.</p>
            <Link to="/products" className="btn-primary">
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen page-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-light text-foreground mb-2">Shopping Cart</h1>
          <p className="text-muted-foreground">{cartItems.length} items in your cart</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="dark-container rounded-lg overflow-hidden">
              {cartItems.map((item, index) => (
                <div key={`${item.id}-${item.size}-${item.color}`} className={`p-6 ${index !== cartItems.length - 1 ? 'border-b border-border' : ''}`}>
                  <div className="flex items-start gap-4">
                    {/* Product Image */}
                    <div className="w-24 h-24 bg-muted rounded-lg flex-shrink-0 flex items-center justify-center">
                      <span className="text-muted-foreground text-xs text-center">{item.name}</span>
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <Link to={`/products/${item.id}`} className="text-lg font-medium text-foreground hover:text-muted-foreground transition-colors">
                        {item.name}
                      </Link>
                      <p className="text-muted-foreground text-sm mt-1 capitalize">{item.category}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span>Size: {item.size}</span>
                        <span>Color: {item.color}</span>
                      </div>
                      <p className="text-lg font-semibold text-foreground mt-2">${item.price}</p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity - 1)}
                        className="w-8 h-8 border border-border rounded-md flex items-center justify-center hover:border-ring transition-colors text-sm"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity + 1)}
                        disabled={item.quantity >= item.stock}
                        className="w-8 h-8 border border-border rounded-md flex items-center justify-center hover:border-ring transition-colors text-sm disabled:bg-muted disabled:cursor-not-allowed"
                      >
                        +
                      </button>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeItem(item.id, item.size, item.color)}
                      className="text-muted-foreground hover:text-red-600 transition-colors p-1"
                      title="Remove item"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  {/* Item Total */}
                  <div className="mt-4 text-right">
                    <p className="text-lg font-semibold text-foreground">
                      Subtotal: ${getItemTotal(item).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Continue Shopping */}
            <div className="mt-6">
              <Link to="/products" className="inline-flex items-center text-foreground hover:text-muted-foreground transition-colors">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Continue Shopping
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="dark-container rounded-lg p-6 sticky top-4">
              <h3 className="text-lg font-medium text-foreground mb-4">Order Summary</h3>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal ({cartItems.length} items)</span>
                  <span>${isNaN(subtotal) ? '0.00' : subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'FREE' : `$${isNaN(shipping) ? '0.00' : shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Tax</span>
                  <span>${isNaN(tax) ? '0.00' : tax.toFixed(2)}</span>
                </div>
                {shipping === 0 && subtotal < 100 && (
                  <div className="text-sm text-green-600 dark:text-green-400">
                    🎉 You qualify for free shipping!
                  </div>
                )}
                {shipping > 0 && (
                  <div className="text-sm text-muted-foreground">
                    Add ${(100 - subtotal).toFixed(2)} more for free shipping
                  </div>
                )}
              </div>

              <div className="border-t border-border pt-4 mb-6">
                <div className="flex justify-between text-lg font-semibold text-foreground">
                  <span>Total</span>
                  <span>${isNaN(total) ? '0.00' : total.toFixed(2)}</span>
                </div>
              </div>

              {/* Promo Code */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Promo Code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter code"
                    className="input flex-1"
                  />
                  <button className="px-4 py-2 text-sm border border-border rounded-md hover:border-ring transition-colors">
                    Apply
                  </button>
                </div>
              </div>

              {/* Checkout Button */}
              {isAuthenticated ? (
                <Link 
                  to="/checkout" 
                  className="w-full btn-primary text-center block mb-4"
                >
                  Proceed to Checkout
                </Link>
              ) : (
                <div className="mb-4">
                  <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-3 text-center">
                    <p className="text-amber-800 dark:text-amber-200 text-sm mb-2">
                      Please log in to proceed with checkout
                    </p>
                  </div>
                  <Link 
                    to="/auth" 
                    className="w-full btn-primary text-center block"
                  >
                    Log In to Checkout
                  </Link>
                </div>
              )}

              {/* Security Info */}
              <div className="text-center text-sm text-muted-foreground">
                <div className="flex items-center justify-center gap-1 mb-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Secure Checkout
                </div>
                <p>Your payment information is encrypted and secure</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;