import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function AdminRoute() {
  const { user } = useAuth();

  const isAdminOrManager = user?.roles?.some(role =>
    ['ROLE_ADMIN', 'ROLE_MANAGER'].includes(role)
  );

  if (!isAdminOrManager) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}
