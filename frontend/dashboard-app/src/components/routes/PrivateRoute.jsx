import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function PrivateRoute() {
  const { user } = useAuth();

  // ⛔ If not logged in, go to login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // ✅ Allow access to child route
  return <Outlet />;
}
