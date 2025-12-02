import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import UserDashBoard from "./pages/UserDashBoard";
// import ProtectedRoute from './components/ProtectedRoute';
import SignUpPage from './pages/SignUpPage'; // ⬅️ add this import
import AdminDashboard from './pages/AdminDashboard';
import CartPage from './pages/CartPage';
import WishlistPage from './pages/WishlistPage';
import CheckoutPage from './pages/CheckoutPage';
import UpiPaymentPage from './pages/UpiPaymentPage';
import OrderSuccessPage from './pages/OrderSuccess';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            //<ProtectedRoute>
              <Dashboard />
            //</ProtectedRoute>
          }
        />
        <Route path="/UserDashBoard" element={<UserDashBoard />} />
        {/* ⬅️ New signup route */}
        <Route path="/SignUpPage" element={<SignUpPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/order" element={<CheckoutPage />} />
        <Route path="/payment" element={<UpiPaymentPage />} />
        <Route path="/orderSuccess" element={<OrderSuccessPage />} />

        {/* Fallback to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
