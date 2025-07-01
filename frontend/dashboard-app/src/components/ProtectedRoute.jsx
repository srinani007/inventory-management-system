import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

export default function ProtectedRoute({ children, roles: requiredRoles }) {
  const { token, roles } = useContext(AuthContext);

  if (!token) {
    // Not logged in
    return <Navigate to="/login" replace />;
  }

  if (requiredRoles && !requiredRoles.some(r => roles.includes(r))) {
    // Logged in but lacks role
    return <Navigate to="/unauthorized" replace />;
  }

  // Authorized
  return children;
}
