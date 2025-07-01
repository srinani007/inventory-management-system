import React from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import InventoryList from './pages/InventoryList';
import InventoryDetail from './pages/InventoryDetail';
import InventoryForm from './pages/InventoryForm';
import LoginPage from './pages/LoginPage';
import UnauthorizedPage from './pages/UnauthorizedPage';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ToastContainer />
        <nav className="bg-blue-600 text-white p-4">
          <Link to="/inventory" className="mr-4">Inventory</Link>
          <Link to="/inventory/new" className="mr-4">+ New Item</Link>
          <Link to="/login">Login</Link>
        </nav>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route path="/inventory" element={<ProtectedRoute roles={['ROLE_ADMIN','ROLE_MANAGER','ROLE_WAREHOUSE_STAFF']}><InventoryList /></ProtectedRoute>} />
          <Route path="/inventory/:id" element={<ProtectedRoute roles={['ROLE_ADMIN','ROLE_MANAGER','ROLE_WAREHOUSE_STAFF']}><InventoryDetail /></ProtectedRoute>} />
          <Route path="/inventory/new" element={<ProtectedRoute roles={['ROLE_ADMIN','ROLE_MANAGER']}><InventoryForm /></ProtectedRoute>} />
          <Route path="/inventory/:id/edit" element={<ProtectedRoute roles={['ROLE_ADMIN','ROLE_MANAGER']}><InventoryForm /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/inventory" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
