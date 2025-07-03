// ✅ Clean App.jsx with layout delegation
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';
import './app.css';

import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

// Pages
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import UnauthorizedPage from './pages/UnauthorizedPage';
import Dashboard from './pages/Dashboard';
import InventoryList from './pages/InventoryList';
import InventoryDetail from './pages/InventoryDetail';
import InventoryForm from './pages/InventoryForm';
import InventoryReports from './pages/InventoryReports';

// Roles
const ROLES = {
  ADMIN: 'ROLE_ADMIN',
  MANAGER: 'ROLE_MANAGER',
  WAREHOUSE_STAFF: 'ROLE_WAREHOUSE_STAFF',
  USER: 'ROLE_USER',
};

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

          {/* Protected Routes with shared layout */}
          <Route element={<Layout />}>
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/inventory/reports"
              element={
                <ProtectedRoute>
                  <InventoryReports />
                </ProtectedRoute>
              }
            />


            <Route
              path="/inventory"
              element={
                <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.MANAGER, ROLES.WAREHOUSE_STAFF]}>
                  <InventoryList />
                </ProtectedRoute>
              }
            />

            <Route
              path="/inventory/:id"
              element={
                <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.MANAGER, ROLES.WAREHOUSE_STAFF]}>
                  <InventoryDetail />
                </ProtectedRoute>
              }
            />

            <Route
              path="/inventory/new"
              element={
                <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.MANAGER]}>
                  <InventoryForm />
                </ProtectedRoute>
              }
            />

            <Route
              path="/inventory/:id/edit"
              element={
                <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.MANAGER]}>
                  <InventoryForm isEditMode />
                </ProtectedRoute>
              }
            />

            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Navigate to="/dashboard" replace />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Catch All */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>

  );
}