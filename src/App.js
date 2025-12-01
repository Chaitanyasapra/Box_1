import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import UserDashBoard from "./pages/UserDashBoard";
// import ProtectedRoute from './components/ProtectedRoute';
import SignUpPage from './pages/SignUpPage'; // ⬅️ add this import

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

        {/* Fallback to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
