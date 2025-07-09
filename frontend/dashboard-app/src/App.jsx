import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';
import './app.css';

// Context
import { AuthProvider } from './contexts/AuthContext';

// Layout
import Layout from './components/Layout';

// Route Guards
import PrivateRoute from './components/routes/PrivateRoute';
import AdminRoute from './components/routes/AdminRoute';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import UnauthorizedPage from './pages/UnauthorizedPage';
import Dashboard from './pages/Dashboard';
import InventoryList from './pages/InventoryList';
import InventoryDetail from './pages/InventoryDetail';
import InventoryForm from './pages/InventoryForm';
import InventoryReports from './pages/InventoryReports';
import UsersPage from './pages/UsersPage';
import OrderForm from './pages/OrderForm';
import OrdersPage from './pages/OrdersPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ToastContainer position="top-right" autoClose={3000} />
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          {/* Private Routes */}
          <Route element={<PrivateRoute />}>
            <Route element={<Layout />}>
            <Route path="/users" element={<ProtectedRoute allowedRoles={['ROLE_ADMIN']}> <UsersPage /> </ProtectedRoute>} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/inventory/reports" element={<InventoryReports />} />
              <Route path="/orders/new" element={<OrderForm />} />
              <Route path="/orders" element={<OrdersPage />} />

              <Route path="/inventory" element={<InventoryList />} />
              <Route path="/inventory/:id" element={<InventoryDetail />} />

              {/* Admin-only routes */}
              <Route element={<AdminRoute />}>
                <Route path="/inventory/new" element={<InventoryForm />} />
                <Route path="/inventory/:id/edit" element={<InventoryForm isEditMode />} />
                 <Route path="/users" element={<UsersPage />} />
              </Route>

              {/* Redirect / to dashboard */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Route>
          </Route>

          {/* Catch All */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
