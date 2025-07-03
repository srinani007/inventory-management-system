import React, { createContext, useState, useContext } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('auth');
    return stored ? JSON.parse(stored) : null;
  });

  const login = (token) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const userData = {
        token,
        username: payload.sub,
        roles: payload.roles || [],
      };
      localStorage.setItem('auth', JSON.stringify(userData));
      localStorage.setItem('token', token); // ✅ For Axios interceptor
      setUser(userData);
    } catch (error) {
      console.error('Failed to decode token:', error);
    }
  };

  const logout = () => {
    localStorage.removeItem('auth');
    localStorage.removeItem('token');
    setUser(null);
  };

  const value = { user, login, logout };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
