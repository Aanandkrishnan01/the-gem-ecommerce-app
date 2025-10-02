import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import Wishlist from './pages/Wishlist';
import AdminDashboard from './pages/AdminDashboard';
import OrderDetail from './pages/OrderDetail';
import ComparePage from './pages/ComparePage';
import ClothesPage from './pages/ClothesPage';
import ShoesPage from './pages/ShoesPage';
import WomenPage from './pages/WomenPage';
import MenPage from './pages/MenPage';
import KidsPage from './pages/KidsPage';
import ComparisonBar from './components/ComparisonBar';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { WishlistProvider } from './context/WishlistContext';
import { ReviewsProvider } from './context/ReviewsContext';
import { OrdersProvider } from './context/OrdersContext';
import { AdminProvider } from './context/AdminContext';
import { SearchProvider } from './context/SearchContext';
import { ComparisonProvider } from './context/ComparisonContext';
import { MarketingProvider } from './context/MarketingContext';
import { ThemeProvider } from './components/theme-provider';

// Layout component to conditionally show navbar
function Layout() {
  const location = useLocation();
  const hideNavbar = ['/login', '/signin', '/auth'].includes(location.pathname);
  const hideBanner = ['/login', '/signin', '/auth', '/admin'].includes(location.pathname);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {!hideNavbar && <Navbar />}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/compare" element={<ComparePage />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/orders/:orderId" element={<OrderDetail />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/signin" element={<Auth />} />
          <Route path="/clothes" element={<ClothesPage />} />
          <Route path="/shoes" element={<ShoesPage />} />
          <Route path="/women" element={<WomenPage />} />
          <Route path="/men" element={<MenPage />} />
          <Route path="/kids" element={<KidsPage />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
        </Routes>
      </main>
      <ComparisonBar />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <ComparisonProvider>
              <ReviewsProvider>
                <OrdersProvider>
                  <AdminProvider>
                    <SearchProvider>
                      <MarketingProvider>
                        <Router>
                          <Layout />
                        </Router>
                      </MarketingProvider>
                    </SearchProvider>
                  </AdminProvider>
                </OrdersProvider>
              </ReviewsProvider>
            </ComparisonProvider>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;