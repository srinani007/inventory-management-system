import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('jwt') || null);
  const [roles, setRoles] = useState(() => {
    const stored = localStorage.getItem('roles');
    return stored ? JSON.parse(stored) : [];
  });

  // Call this after login
  function login(jwt, userRoles) {
    localStorage.setItem('jwt', jwt);
    localStorage.setItem('roles', JSON.stringify(userRoles));
    setToken(jwt);
    setRoles(userRoles);
  }

  function logout() {
    localStorage.removeItem('jwt');
    localStorage.removeItem('roles');
    setToken(null);
    setRoles([]);
  }

  return (
    <AuthContext.Provider value={{ token, roles, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
