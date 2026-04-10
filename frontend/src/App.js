import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
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

// Lazy load pages
const Home = lazy(() => import('./pages/Home'));
const Products = lazy(() => import('./pages/Products'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Auth = lazy(() => import('./pages/Auth'));
const Profile = lazy(() => import('./pages/Profile'));
const Wishlist = lazy(() => import('./pages/Wishlist'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const OrderDetail = lazy(() => import('./pages/OrderDetail'));
const ComparePage = lazy(() => import('./pages/ComparePage'));
const ClothesPage = lazy(() => import('./pages/ClothesPage'));
const ShoesPage = lazy(() => import('./pages/ShoesPage'));
const WomenPage = lazy(() => import('./pages/WomenPage'));
const MenPage = lazy(() => import('./pages/MenPage'));
const KidsPage = lazy(() => import('./pages/KidsPage'));

// Layout component to conditionally show navbar
function Layout() {
  const location = useLocation();
  const hideNavbar = ['/login', '/signin', '/auth'].includes(location.pathname);
  const hideBanner = ['/login', '/signin', '/auth', '/admin'].includes(location.pathname);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {!hideNavbar && <Navbar />}
      <main>
        <Suspense fallback={
          <div className="flex justify-center items-center h-[50vh]">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        }>
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
        </Suspense>
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