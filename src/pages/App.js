import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
//import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import CartPage from './pages/CartPage';
import WishlistPage from './pages/WishlistPage';
import UserDashBoard from './pages/UserDashBoard';
import SignUpPage from './pages/SignUpPage';
import Dashboard from './pages/Dashboard';

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
        
         <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
