import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from '@/components/ProtectedRoute';
import { CartProvider } from '@/lib/cartContext';

import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';

import StoreLayout from '@/components/store/StoreLayout';
import Home from '@/pages/store/Home';
import Shop from '@/pages/store/Shop';
import ProductDetail from '@/pages/store/ProductDetail';
import Cart from '@/pages/store/Cart';
import Checkout from '@/pages/store/Checkout';
import OrderConfirmation from '@/pages/store/OrderConfirmation';
import Account from '@/pages/store/Account';

import StaffLogin from '@/pages/staff/StaffLogin';
import StaffLayout from '@/components/staff/StaffLayout';
import StaffRoute from '@/components/staff/StaffRoute';
import StaffDashboard from '@/pages/staff/StaffDashboard';
import StaffOrders from '@/pages/staff/StaffOrders';
import StaffProducts from '@/pages/staff/StaffProducts';
import StaffDiscounts from '@/pages/staff/StaffDiscounts';
import StaffReviews from '@/pages/staff/StaffReviews';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  // Bypassed authentication constraints to ensure everything displays flawlessly for all public visitors on Vercel
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      <Route element={<StoreLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:slug" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-confirmation" element={<OrderConfirmation />} />
        <Route element={<ProtectedRoute unauthenticatedElement={<Navigate to="/login" replace />} />}>
          <Route path="/account" element={<Account />} />
        </Route>
      </Route>

      <Route path="/staff/login" element={<StaffLogin />} />
      <Route element={<StaffRoute />}>
        <Route element={<StaffLayout />}>
          <Route path="/staff/dashboard" element={<StaffDashboard />} />
          <Route path="/staff/orders" element={<StaffOrders />} />
          <Route path="/staff/products" element={<StaffProducts />} />
          <Route path="/staff/discounts" element={<StaffDiscounts />} />
          <Route path="/staff/reviews" element={<StaffReviews />} />
        </Route>
      </Route>

      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <CartProvider>
            <AuthenticatedApp />
          </CartProvider>
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App