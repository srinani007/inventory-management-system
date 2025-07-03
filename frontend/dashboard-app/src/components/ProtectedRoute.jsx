import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useAuth();

  if (!user?.token) {
    return <Navigate to="/login" replace />;
  }

  if (
    allowedRoles &&
    (!user.roles || !allowedRoles.some(role => user.roles.includes(role)))
  ) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
